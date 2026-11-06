"""Cliente xAI — Responses API com function calling e controle de orçamento.

Sem dependências externas: usa urllib. Interface compatível com a API
OpenAI-style da xAI (https://api.x.ai/v1).

Design:
- `complete_json()`  -> saída estruturada validada (usada no radar/lead card)
- `complete()`       -> texto livre (usada no scribe)
- Budget            -> freio duro de custo por execução/dia
"""

from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field

from src.config import Config


class GrokError(RuntimeError):
    pass


# ---------------------------------------------------------------- tabela de preço
# USD por 1M de tokens. Atualize quando a xAI mudar o rate card.
PRICES = {
    "grok-4.6": (2.00, 0.50, 6.00),
    "grok-4.5": (2.00, 0.30, 6.00),
    "grok-4.3": (1.25, 0.20, 2.50),
    "grok-4.1-fast": (0.20, 0.10, 0.50),
    "grok-build-0.1": (1.00, 0.20, 2.00),
}
X_SEARCH_USD_PER_POST = 5.0 / 1000
WEB_SEARCH_USD_PER_CALL = 5.0 / 1000


@dataclass
class Budget:
    """Freio de custo. Um bot sem freio é um cartão de crédito com API."""
    daily_usd: float = 1.00
    spent_usd: float = 0.0
    x_posts: int = 0
    x_posts_cap: int = 200

    def can_spend(self, estimated_usd: float) -> bool:
        return (self.spent_usd + estimated_usd) <= self.daily_usd

    def charge(self, usd: float, x_posts: int = 0) -> None:
        self.spent_usd += max(0.0, usd)
        self.x_posts += max(0, x_posts)

    def check_x(self, requested_posts: int) -> int:
        """Retorna quantos posts ainda cabem no teto diário."""
        remaining = max(0, self.x_posts_cap - self.x_posts)
        return min(requested_posts, remaining)


@dataclass
class Usage:
    input_tokens: int = 0
    output_tokens: int = 0
    cached_tokens: int = 0
    x_posts: int = 0
    web_calls: int = 0
    tool_calls: int = 0

    def cost_usd(self, model: str) -> float:
        inp, cached, out = PRICES.get(model, PRICES["grok-4.3"])
        billable_in = max(0, self.input_tokens - self.cached_tokens)
        return (
            (billable_in / 1_000_000) * inp
            + (self.cached_tokens / 1_000_000) * cached
            + (self.output_tokens / 1_000_000) * out
            + self.x_posts * X_SEARCH_USD_PER_POST
            + self.web_calls * WEB_SEARCH_USD_PER_CALL
        )


@dataclass
class GrokClient:
    cfg: Config
    budget: Budget = field(default_factory=Budget)
    timeout: int = 120
    max_retries: int = 3

    def __post_init__(self) -> None:
        self.budget = Budget(daily_usd=self.cfg.daily_usd, x_posts_cap=self.cfg.daily_x_posts)

    # ------------------------------------------------------------ transporte
    def _post(self, payload: dict) -> dict:
        if not self.cfg.api_key:
            raise GrokError("XAI_API_KEY ausente — use o modo offline (fixture).")
        body = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            f"{self.cfg.base_url}/responses",
            data=body,
            headers={
                "Authorization": f"Bearer {self.cfg.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        delay = 1.0
        last_err = ""
        for attempt in range(1, self.max_retries + 1):
            try:
                with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                    return json.loads(resp.read().decode("utf-8"))
            except urllib.error.HTTPError as exc:
                detail = exc.read().decode("utf-8", "replace")[:600]
                last_err = f"HTTP {exc.code}: {detail}"
                if exc.code in (429, 500, 502, 503, 504) and attempt < self.max_retries:
                    time.sleep(delay)
                    delay *= 2
                    continue
                raise GrokError(last_err) from exc
            except (urllib.error.URLError, TimeoutError) as exc:
                last_err = f"rede: {exc}"
                if attempt < self.max_retries:
                    time.sleep(delay)
                    delay *= 2
                    continue
                raise GrokError(last_err) from exc
        raise GrokError(last_err or "falha desconhecida")

    @staticmethod
    def _usage_from(payload: dict, model: str) -> Usage:
        u = payload.get("usage", {}) or {}
        details = u.get("server_side_tool_usage_details", {}) or {}
        return Usage(
            input_tokens=int(u.get("input_tokens", 0) or 0),
            output_tokens=int(u.get("output_tokens", 0) or 0),
            cached_tokens=int(u.get("cached_tokens", 0)
                              or (u.get("input_tokens_details", {}) or {}).get("cached_tokens", 0)
                              or 0),
            x_posts=int(details.get("x_posts_fetched", 0) or 0),
        )

    @staticmethod
    def _text_from(payload: dict) -> str:
        chunks: list[str] = []
        for item in payload.get("output", []) or []:
            if item.get("type") in ("message", "output_text"):
                for part in item.get("content", []) or []:
                    if part.get("type") in ("output_text", "text") and part.get("text"):
                        chunks.append(part["text"])
            elif item.get("type") == "text" and item.get("text"):
                chunks.append(item["text"])
        if not chunks and isinstance(payload.get("output_text"), str):
            chunks.append(payload["output_text"])
        return "\n".join(chunks).strip()

    # ------------------------------------------------------------ chamadas
    def complete(
        self,
        system: str,
        user: str,
        *,
        model: str | None = None,
        effort: str = "medium",
        temperature: float = 0.6,
        tools: list[dict] | None = None,
        max_turns: int = 2,
        cache_key: str | None = None,
    ) -> tuple[str, Usage]:
        model = model or self.cfg.model
        payload: dict = {
            "model": model,
            "input": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": temperature,
            "reasoning": {"effort": effort},
        }
        if tools:
            payload["tools"] = tools
            payload["max_turns"] = max_turns
        if cache_key:
            payload["prompt_cache_key"] = cache_key

        est = 0.02
        if not self.budget.can_spend(est):
            raise GrokError(
                f"orçamento diário esgotado (US$ {self.budget.spent_usd:.4f} de "
                f"US$ {self.budget.daily_usd:.2f}). Ajuste DAILY_BUDGET_USD."
            )

        raw = self._post(payload)
        usage = self._usage_from(raw, model)
        self.budget.charge(usage.cost_usd(model), usage.x_posts)
        text = self._text_from(raw)
        if not text:
            raise GrokError(f"resposta sem texto. Chaves: {list(raw)[:8]}")
        return text, usage

    def complete_json(
        self,
        system: str,
        user: str,
        *,
        model: str | None = None,
        effort: str = "low",
        temperature: float = 0.2,
        schema_hint: str = "",
    ) -> tuple[dict, Usage]:
        """Pede JSON, tolera cercas de código e devolve dict."""
        sys_prompt = (
            system
            + "\n\nResponda APENAS com um objeto JSON válido, sem texto antes ou depois, "
            "sem cercas de código."
            + (f"\n\nEsquema esperado:\n{schema_hint}" if schema_hint else "")
        )
        text, usage = self.complete(
            sys_prompt, user, model=model, effort=effort, temperature=temperature
        )
        return parse_json_loose(text), usage


def parse_json_loose(text: str) -> dict:
    """Extrai o primeiro objeto JSON de um texto, tolerando cercas e preâmbulo."""
    clean = text.strip()
    clean = re.sub(r"^```(?:json)?\s*", "", clean)
    clean = re.sub(r"\s*```$", "", clean)
    try:
        data = json.loads(clean)
        return data if isinstance(data, dict) else {"value": data}
    except json.JSONDecodeError:
        pass
    start = clean.find("{")
    if start == -1:
        raise GrokError(f"JSON não encontrado na resposta: {clean[:200]}")
    depth = 0
    in_str = False
    esc = False
    for i in range(start, len(clean)):
        ch = clean[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
            continue
        if ch == '"':
            in_str = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return json.loads(clean[start:i + 1])
    raise GrokError("JSON incompleto na resposta do modelo.")
