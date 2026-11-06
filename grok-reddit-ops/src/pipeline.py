"""Pipeline: radar (intenção) e scribe (redação).

Toda saída é estruturada e auditável. Sem API key, roda 100% offline com
um scorer heurístico calibrado — útil para desenvolver, demonstrar e testar
o encanamento antes de gastar token.
"""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

from src.config import Config
from src.grok import GrokError, GrokClient
from src.sources import Thread, default_rules, load_rules, rules_for_sub

# Palavras que sinalizam intenção de compra/recomendação, por idioma.
INTENT_PATTERNS = {
    "pt": [
        r"\bindica(m|ção|r)?\b", r"\bvale a pena\b", r"\balgu[ée]m (usa|conhece|recomenda)\b",
        r"\bcomo (faço|escolho|encontro)\b", r"\bme ajudem a (escolher|decidir)\b",
        r"\bqual (o melhor|a melhor|comprar)\b", r"\balternativa (a|para)\b",
        r"\bestou procurando\b", r"\bquero (comprar|contratar|investir)\b",
        r"\bpreciso de (um|uma) (corretor|ferramenta|consultor)\b",
        r"\bcompensa\b", r"\bopini(ã|a)o sobre\b", r"\bexperi[êe]ncia com\b",
    ],
    "en": [
        r"\blooking for\b", r"\bany recommendations?\b", r"\bworth it\b",
        r"\balternatives? to\b", r"\bbest .* (for|to)\b", r"\bshould i (buy|use|hire)\b",
        r"\bvs\.?\b", r"\banyone (using|tried|have experience)\b",
        r"\bhow do i (find|choose)\b", r"\bneed (a|an) (realtor|agent|tool)\b",
        r"\bhelp me (choose|decide)\b",
    ],
}
# Pedido explícito de recomendação/indicação: sinal mais forte que "dor genérica".
STRONG_INTENT_PATTERNS = [
    r"\bindica(m|ção|r)?\b", r"\balgu[ée]m (indica|recomenda|usa|conhece)\b",
    r"\bqual (o melhor|a melhor)\b", r"\bme ajudem a escolher\b",
    r"\bany recommendations?\b", r"\blooking for (a|an|recommendations)\b",
    r"\balternatives? to\b", r"\bshould i (buy|hire|use)\b",
    r"\bpreciso de (um|uma) (corretor|imobili[áa]ria|consultor)\b",
    r"\bneed (a|an) (realtor|agent|broker)\b", r"\bcomo escolho\b",
]
FINANCIAL_SIGNALS = [
    r"R\$\s?\d", r"\$\s?\d", r"\bmil\b", r"\bpre[çc]o\b", r"\bcomiss(ã|a)o\b",
    r"\bfinanciamento\b", r"\bentrada\b", r"\bjuros\b", r"\bm²|m2\b", r"\baluguel\b",
    r"\bcr[ée]dito\b", r"\bROI\b", r"\brentabilidade\b", r"\bimposto\b",
]
URGENCY_SIGNALS = [r"\bhoje\b", r"\burgente\b", r"\bsemana que vem\b", r"\bmês que vem\b",
                   r"\bassinatura\b", r"\bfechar\b", r"\bproposta\b", r"\bvisita\b"]
NEGATIVE_SIGNALS = [r"\bdesabafo\b", r"\brant\b", r"\bmeme\b", r"\bnot[íi]cia\b",
                    r"\bpiada\b", r"\bhumor\b", r"\bvent\b", r"\bnews\b"]


def _compile_all(patterns: list[str]) -> list[re.Pattern]:
    return [re.compile(p, re.IGNORECASE) for p in patterns]


STRONG_COMPILED = _compile_all(STRONG_INTENT_PATTERNS)
PT_COMPILED = _compile_all(INTENT_PATTERNS["pt"])
EN_COMPILED = _compile_all(INTENT_PATTERNS["en"])
FIN_COMPILED = _compile_all(FINANCIAL_SIGNALS)
URG_COMPILED = _compile_all(URGENCY_SIGNALS)
NEG_COMPILED = _compile_all(NEGATIVE_SIGNALS)


def heuristic_score(thread: Thread) -> tuple[int, str, list[str]]:
    """Scorer offline: explicação transparente, sem caixa-preta.

    Retorna (score 0-100, tipo de intenção, sinais detectados).
    """
    text = f"{thread.title}\n{thread.body}"
    signals: list[str] = []
    score = 20

    intent_hits = [p.pattern for p in PT_COMPILED + EN_COMPILED if p.search(text)]
    if intent_hits:
        score += min(30, 10 * len(intent_hits))
        signals.append(f"intenção x{len(intent_hits)}")

    # pedido explícito de recomendação/indicação é o sinal mais valioso
    strong_hits = [p.pattern for p in STRONG_COMPILED if p.search(text)]
    if strong_hits:
        score += min(18, 9 * len(strong_hits))
        signals.append(f"pedido explícito x{len(strong_hits)}")

    # pergunta explícita no título vale mais que no corpo
    if thread.title.strip().endswith("?") or re.search(r"\?$", thread.title.strip()):
        score += 8
        signals.append("pergunta no título")

    fin_hits = [p.pattern for p in FIN_COMPILED if p.search(text)]
    if fin_hits:
        score += min(12, 4 * len(fin_hits))
        signals.append(f"sinal financeiro x{len(fin_hits)}")

    if any(p.search(text) for p in URG_COMPILED):
        score += 6
        signals.append("urgência")

    # frescor: thread quente converte mais
    age = thread.age_hours
    if age <= 6:
        score += 14
        signals.append("fresca (<6h)")
    elif age <= 24:
        score += 9
        signals.append("recente (<24h)")
    elif age <= 72:
        score += 3
    else:
        score -= 10
        signals.append("esfriando")

    # janela de resposta: poucos comentários = ainda dá para ser lido
    if thread.num_comments <= 5:
        score += 6
        signals.append("pouca concorrência")
    elif thread.num_comments > 40:
        score -= 8
        signals.append("muita concorrência")

    if any(p.search(text) for p in NEG_COMPILED):
        score -= 25
        signals.append("conteúdo não-comercial")

    score = max(0, min(100, score))

    if score >= 80:
        kind = "recommendation_request"
    elif score >= 60:
        kind = "problem_aware"
    elif score >= 40:
        kind = "exploring"
    else:
        kind = "not_commercial"
    return score, kind, signals


# ------------------------------------------------------------------ prompts
RADAR_SYSTEM = """Você é um analista de intenção de compra. Recebe uma thread de fórum
(título, corpo, subreddit, idade, engajamento) e avalia o potencial comercial REAL dela.

Regras:
- Intenção explícita de compra/recomendação vale muito; desabafo e notícia valem zero.
- Frescor importa: thread com mais de 72h raramente converte.
- Poucos comentários significa espaço para ser lido; muitos significa que você será ignorado.
- Seja conservador: superestimar intenção desperdiça o tempo do operador.
- Nunca invente dados que não estão na thread.

Devolva JSON com as chaves: intent_score (0-100), intent_type, buying_stage,
persona, pain, offer_fit (alto|medio|baixo), angle, risk_flags (lista),
needs_human_facts (lista), reason (1 frase)."""

SCRIBE_SYSTEM = """Você escreve respostas para fóruns (Reddit) que soam humanas, específicas
e úteis — nunca como anúncio.

Regras invioláveis:
1. A primeira frase responde diretamente a pergunta feita.
2. Dê critério de decisão, não opinião vaga.
3. Se mencionar oferta/produto/serviço, inclua a divulgação de relação comercial
   em linguagem simples, na mesma tela e antes do link.
4. Se o subreddit proíbe links, NÃO inclua link; o destino é o perfil.
5. Marque com [VERIFICAR] qualquer número, prazo ou preço que o humano precise confirmar.
6. Nada de superlativos, emojis, CAIXA ALTA, promessa de renda ou resultado garantido.
7. Máximo 250 palavras para comentário; 1.500 para post.
8. A resposta precisa ser útil mesmo se a pessoa nunca clicar em nada.

Devolva JSON com: text, link_allowed (bool), disclosure (string), checklist (lista),
warnings (lista)."""


def _thread_brief(thread: Thread) -> str:
    comments = "\n".join(f"- {c[:240]}" for c in thread.top_comments[:5]) or "(sem comentários)"
    return (
        f"SUBREDDIT: {thread.subreddit}\n"
        f"IDADE: {thread.age_hours:.1f} h\n"
        f"SCORE: {thread.score} · COMENTÁRIOS: {thread.num_comments}\n"
        f"TÍTULO: {thread.title}\n"
        f"CORPO: {thread.body[:2000]}\n"
        f"COMENTÁRIOS PRINCIPAIS:\n{comments}\n"
        f"URL: {thread.url}\n"
    )


def _rules_brief(rule: dict) -> str:
    return (
        f"REGRA DO SUB: link_allowed={rule.get('link_allowed', False)}, "
        f"disclosure_required={rule.get('disclosure_required', True)}, "
        f"promo_tolerance={rule.get('promo_tolerance', 'low')}, "
        f"notes={rule.get('notes', '')}"
    )


def run_radar(threads: list[Thread], client: GrokClient, cfg: Config, top_n: int = 10) -> list[dict]:
    rules = load_rules(cfg.root)
    leads: list[dict] = []

    for thread in threads:
        rule = rules_for_sub(rules, thread.subreddit) or default_rules()
        h_score, h_kind, h_signals = heuristic_score(thread)

        base = {
            "thread_id": thread.id,
            "subreddit": thread.subreddit,
            "title": thread.title,
            "url": thread.url,
            "age_hours": round(thread.age_hours, 1),
            "intent_score": h_score,
            "intent_type": h_kind,
            "signals": h_signals,
            "link_allowed": bool(rule.get("link_allowed", False)),
            "disclosure_required": bool(rule.get("disclosure_required", True)),
            "citations": [thread.url] if thread.url else [],
            "needs_human_facts": [],
            "angle": "",
            "engine": "heuristic",
        }

        # Só chama o modelo para o que passou do corte heurístico (custo em cascata).
        if not cfg.offline and client.cfg.api_key and h_score >= max(40, cfg.min_score - 20):
            try:
                data, _ = client.complete_json(
                    RADAR_SYSTEM,
                    _thread_brief(thread) + "\n" + _rules_brief(rule),
                    model=cfg.model,
                    effort="low",
                )
                base.update({
                    "intent_score": int(data.get("intent_score", h_score)),
                    "intent_type": data.get("intent_type", h_kind),
                    "buying_stage": data.get("buying_stage", ""),
                    "persona": data.get("persona", ""),
                    "pain": data.get("pain", ""),
                    "offer_fit": data.get("offer_fit", ""),
                    "angle": data.get("angle", ""),
                    "risk_flags": data.get("risk_flags", []),
                    "needs_human_facts": data.get("needs_human_facts", []),
                    "reason": data.get("reason", ""),
                    "engine": "grok",
                })
            except GrokError as exc:
                base["warnings"] = [f"modelo falhou, mantido heurístico: {exc}"]

        if not base.get("angle"):
            base["angle"] = _default_angle(base["intent_type"], thread.subreddit)
        leads.append(base)

    leads.sort(key=lambda x: x["intent_score"], reverse=True)
    filtered = [x for x in leads if x["intent_score"] >= cfg.min_score]
    return (filtered or leads)[:top_n]


def _default_angle(intent_type: str, sub: str) -> str:
    table = {
        "recommendation_request": "comparar 2-3 opções com critério de decisão e admitir limitação",
        "problem_aware": "resolver o problema com número e apontar o próximo passo",
        "exploring": "educar sem oferta; construir reconhecimento no sub",
        "not_commercial": "não responder comercialmente",
    }
    return table.get(intent_type, "educar antes de ofertar")


def run_scribe(lead: dict, client: GrokClient, cfg: Config) -> dict:
    rule = {
        "link_allowed": lead.get("link_allowed", False),
        "disclosure_required": lead.get("disclosure_required", True),
        "promo_tolerance": "low",
        "notes": "respeite a regra do sub; na dúvida, sem link",
    }
    brief = (
        f"LEAD CARD:\n{json.dumps(lead, ensure_ascii=False, indent=2)}\n\n"
        f"{_rules_brief(rule)}\n"
        f"IDIOMA: {cfg.language}\nMERCADO: {cfg.market}\n"
        f"MODO DIVULGAÇÃO: {cfg.disclosure_mode}\n"
    )

    if cfg.offline or not client.cfg.api_key:
        return _offline_draft(lead, rule, cfg)

    try:
        data, _ = client.complete_json(
            SCRIBE_SYSTEM, brief, model=cfg.model, effort="medium", temperature=0.7
        )
    except GrokError as exc:
        draft = _offline_draft(lead, rule, cfg)
        draft["warnings"].append(f"modelo falhou: {exc}")
        return draft

    text = (data.get("text") or "").strip()
    warnings = list(data.get("warnings", []) or [])
    if len(text) > 2600:
        warnings.append("texto longo para comentário; considere publicar como post de perfil")
    if re.search(r"\b(garantido|garantia de retorno|renda certa|fica rico)\b", text, re.I):
        warnings.append("linguagem de promessa detectada — reescreva antes de publicar")
    if not rule["link_allowed"] and re.search(r"https?://|www\.", text):
        warnings.append("link presente em sub que não permite link")
    if cfg.disclosure_mode == "strict" and not data.get("disclosure"):
        warnings.append("disclosure ausente — obrigatório quando há menção comercial")

    return {
        "text": text,
        "link_allowed": bool(data.get("link_allowed", rule["link_allowed"])),
        "disclosure": data.get("disclosure", ""),
        "checklist": data.get("checklist") or _checklist(cfg),
        "warnings": warnings,
    }


def _checklist(cfg: Config) -> list[str]:
    return [
        "Li a regra do sub hoje",
        "A resposta é útil mesmo sem a oferta",
        "Todo número tem fonte e data",
        "Reescrevi na minha voz (não é IA apresentada como humana)",
        "Disclosure visível antes do link (se houver relação comercial)",
        "Nenhum link onde o sub proíbe",
        "Nenhuma promessa de renda/resultado",
        "Testei deslogado para confirmar que não foi removido",
    ]


def _offline_draft(lead: dict, rule: dict, cfg: Config) -> dict:
    """Rascunho estrutural sem API — serve de esqueleto para o humano preencher."""
    sub = lead.get("subreddit", "")
    angle = lead.get("angle", "dar critério de decisão")
    disclosure = (
        "Sou [SEU NOME], corretor de imóveis em [CIDADE] (CRECI-[UF] [NÚMERO]) — "
        "se eu indicar algo, é meu serviço."
        if cfg.market == "br"
        else "Disclosure: I earn a commission if you sign up through my link."
    )
    text = (
        f"[RASCUNHO OFFLINE — preencha antes de publicar]\n\n"
        f"Resposta direta: [responder a pergunta de '{lead.get('title','')[:80]}' em 1 frase]\n\n"
        f"Critério de decisão:\n"
        f"- Se seu caso é [A]: [recomendação com motivo concreto]\n"
        f"- Se é [B]: [opção alternativa e sua limitação]\n"
        f"- Custo de errar: [número real]\n\n"
        f"Ângulo sugerido: {angle}\n"
        f"Sub: {sub} · link permitido: {rule['link_allowed']}\n\n"
        f"{disclosure if cfg.disclosure_mode == 'strict' else ''}\n\n"
        f"[VERIFICAR] números, prazos e valores antes de publicar."
    )
    return {
        "text": text,
        "link_allowed": rule["link_allowed"],
        "disclosure": disclosure,
        "checklist": _checklist(cfg),
        "warnings": ["modo offline: rascunho é apenas um esqueleto estrutural"],
    }


# ------------------------------------------------------------------ utilidades
def extract_x_search_budget(posts_returned: int, cap: int) -> tuple[bool, str]:
    """Guarda-corpo para o custo do x_search (cobrado por post desde 09/2026)."""
    if posts_returned > cap:
        return False, (
            f"x_search retornaria {posts_returned} posts (teto {cap}). "
            f"Custo estimado US$ {posts_returned * 0.005:.2f}. "
            "Reduza max_turns, from_date ou use allowed_x_handles."
        )
    return True, ""


def fingerprint(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]


def dedupe_leads(leads: list[dict]) -> list[dict]:
    seen: set[str] = set()
    out = []
    for lead in leads:
        key = fingerprint(lead.get("title", "") + lead.get("subreddit", ""))
        if key not in seen:
            seen.add(key)
            out.append(lead)
    return out
