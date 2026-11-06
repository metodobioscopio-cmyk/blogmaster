"""Camada de dados do Reddit — interface plugável.

Três fontes implementam a mesma interface, para que trocar de origem
não exija mudar o pipeline:

    FixtureSource  -> fixtures/threads.json (offline, demo, testes)
    ManualSource   -> você cola o texto de uma thread
    OAuthSource    -> API oficial do Reddit (OAuth2 client credentials)

Nenhuma fonte raspa HTML do reddit.com: a API pública .json está bloqueada
desde maio/2026 e o acesso comercial é contratual (ver docs/07-compliance.md).
"""

from __future__ import annotations

import json
import os
import re
import urllib.parse
import urllib.request
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta, timezone
from pathlib import Path

from src.config import Config


@dataclass
class Thread:
    id: str
    subreddit: str
    title: str
    body: str
    url: str
    created_utc: datetime
    score: int = 0
    num_comments: int = 0
    author: str = ""
    top_comments: list[str] = field(default_factory=list)

    @property
    def age_hours(self) -> float:
        now = datetime.now(timezone.utc)
        created = self.created_utc
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        return max(0.0, (now - created).total_seconds() / 3600)

    def to_dict(self) -> dict:
        d = asdict(self)
        d["created_utc"] = self.created_utc.isoformat()
        return d


class RedditSource:
    def fetch(self, limit: int = 20, since_hours: int = 72) -> list[Thread]:
        raise NotImplementedError

    def from_text(self, text: str, subreddit: str = "r/manual") -> list[Thread]:
        return [Thread(
            id="manual-1",
            subreddit=subreddit,
            title=text.strip().splitlines()[0][:180] if text.strip() else "(sem título)",
            body=text.strip(),
            url="",
            created_utc=datetime.now(timezone.utc),
        )]


class FixtureSource(RedditSource):
    """Dados de exemplo locais: rodar, demonstrar e testar sem gastar API."""

    def __init__(self, path: Path):
        self.path = path

    def fetch(self, limit: int = 20, since_hours: int = 72) -> list[Thread]:
        if not self.path.exists():
            return []
        raw = json.loads(self.path.read_text(encoding="utf-8"))
        now = datetime.now(timezone.utc)
        out: list[Thread] = []
        for item in raw[:limit]:
            age = float(item.get("age_hours", 6))
            out.append(Thread(
                id=item.get("id", f"fx-{len(out)}"),
                subreddit=item.get("subreddit", "r/unknown"),
                title=item.get("title", ""),
                body=item.get("body", ""),
                url=item.get("url", ""),
                created_utc=now - timedelta(hours=age),
                score=int(item.get("score", 0)),
                num_comments=int(item.get("num_comments", 0)),
                author=item.get("author", ""),
                top_comments=item.get("top_comments", []) or [],
            ))
        return [t for t in out if t.age_hours <= since_hours] or out


class ManualSource(RedditSource):
    """Analisa uma thread colada. Útil para o primeiro dia e para auditoria."""

    def fetch(self, limit: int = 20, since_hours: int = 72) -> list[Thread]:
        return []


class OAuthSource(RedditSource):
    """API oficial do Reddit (OAuth2). Requer credenciais e acesso aprovado."""

    TOKEN_URL = "https://www.reddit.com/api/v1/access_token"
    BASE = "https://oauth.reddit.com"

    def __init__(self, cfg: Config):
        self.client_id = os.getenv("REDDIT_CLIENT_ID", "")
        self.client_secret = os.getenv("REDDIT_CLIENT_SECRET", "")
        self.user_agent = os.getenv("REDDIT_USER_AGENT", "grok-channel-ops/1.0")
        self.subs = cfg.subreddits or ("SaaS",)
        self._token: str | None = None

    def _auth(self) -> str:
        if self._token:
            return self._token
        if not (self.client_id and self.client_secret):
            raise RuntimeError(
                "REDDIT_CLIENT_ID/REDDIT_CLIENT_SECRET ausentes. "
                "Use --source fixture ou manual."
            )
        import base64
        basic = base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()
        data = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode()
        req = urllib.request.Request(
            self.TOKEN_URL, data=data,
            headers={"Authorization": f"Basic {basic}", "User-Agent": self.user_agent},
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = json.loads(resp.read().decode())
        self._token = payload["access_token"]
        return self._token

    def _get(self, path: str, params: dict | None = None) -> dict:
        url = f"{self.BASE}{path}"
        if params:
            url += "?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, headers={
            "Authorization": f"bearer {self._auth()}",
            "User-Agent": self.user_agent,
        })
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())

    def fetch(self, limit: int = 20, since_hours: int = 72) -> list[Thread]:
        out: list[Thread] = []
        per_sub = max(1, limit // max(1, len(self.subs)))
        for sub in self.subs:
            data = self._get(f"/r/{sub}/new", {"limit": per_sub * 2, "raw_json": 1})
            for child in data.get("data", {}).get("children", []):
                d = child.get("data", {})
                created = datetime.fromtimestamp(d.get("created_utc", 0), tz=timezone.utc)
                t = Thread(
                    id=d.get("id", ""),
                    subreddit=d.get("subreddit_name_prefixed", f"r/{sub}"),
                    title=d.get("title", ""),
                    body=d.get("selftext", "") or "",
                    url="https://www.reddit.com" + d.get("permalink", ""),
                    created_utc=created,
                    score=int(d.get("score", 0) or 0),
                    num_comments=int(d.get("num_comments", 0) or 0),
                    author=d.get("author", ""),
                )
                if t.age_hours <= since_hours:
                    out.append(t)
        out.sort(key=lambda t: t.age_hours)
        return out[:limit]


def get_source(kind: str, cfg: Config) -> RedditSource:
    kind = (kind or "fixture").lower()
    if kind == "fixture":
        return FixtureSource(cfg.root / "fixtures" / "threads.json")
    if kind == "manual":
        return ManualSource()
    if kind == "oauth":
        return OAuthSource(cfg)
    raise ValueError(f"fonte desconhecida: {kind}")


# ---------------------------------------------------------------- regras por sub
def load_rules(root: Path) -> dict:
    path = root / "rules.yaml"
    if not path.exists():
        return {}
    return parse_simple_yaml(path.read_text(encoding="utf-8"))


def parse_simple_yaml(text: str) -> dict:
    """Parser mínimo de YAML para o formato de rules.yaml (sem dependências).

    Suporta: chave: valor, listas com "- item", aninhamento por indentação de 2.
    Suficiente para o arquivo de regras, e mantém zero dependências.
    """
    root: dict = {}
    stack: list[tuple[int, dict]] = [(-1, {} if False else root)]

    def current() -> dict:
        return stack[-1][1]

    for raw in text.splitlines():
        if not raw.strip() or raw.strip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        line = raw.strip()
        while stack and indent <= stack[-1][0] and len(stack) > 1:
            stack.pop()
        if line.startswith("- "):
            item = line[2:].strip().strip('"').strip("'")
            container = current()
            key = stack[-1][2] if len(stack[-1]) > 2 else None  # type: ignore[index]
            if key and isinstance(container.get(key), list) is False:
                container[key] = []
            if key:
                container[key].append(item)
            continue
        if ":" in line:
            k, _, v = line.partition(":")
            k = k.strip()
            v = v.strip()
            if v == "":
                current()[k] = {}
                stack.append((indent, current()[k], k))
            else:
                v = v.strip('"').strip("'")
                if v.lower() in ("true", "false"):
                    current()[k] = v.lower() == "true"
                elif re.fullmatch(r"-?\d+", v):
                    current()[k] = int(v)
                elif v.startswith("[") and v.endswith("]"):
                    current()[k] = [x.strip().strip('"') for x in v[1:-1].split(",") if x.strip()]
                else:
                    current()[k] = v
    return root


def rules_for_sub(rules: dict, subreddit: str) -> dict:
    """Busca a regra do sub (aceita com e sem o prefixo r/)."""
    key = subreddit.lower().lstrip("/")
    subs = rules.get("subreddits", {}) or {}
    for name, body in subs.items():
        if name.lower().lstrip("/").removeprefix("r/") == key.removeprefix("r/"):
            return body if isinstance(body, dict) else {}
    return {}


def default_rules() -> dict:
    """Regra conservadora: sem link, disclosure obrigatório."""
    return {"link_allowed": False, "disclosure_required": True, "promo_tolerance": "low"}
