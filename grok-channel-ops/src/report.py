"""Relatórios: painel semanal e decisão go/no-go.

Princípio: se uma métrica não muda uma decisão, ela não entra no relatório.
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path

from src.config import Config


def save_jsonl(items: list[dict], path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        for item in items:
            fh.write(json.dumps(item, ensure_ascii=False) + "\n")


def load_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def weekly_report(leads: list[dict], cfg: Config, outcomes: dict | None = None) -> dict:
    """Consolida leads + resultados informados manualmente.

    `outcomes` aceita: {"posts": 12, "profile_clicks": 40, "conversations": 5,
                        "trials": 2, "sales": 1, "revenue_usd": 534}
    """
    outcomes = outcomes or {}
    by_sub = Counter(lead.get("subreddit", "?") for lead in leads)
    by_type = Counter(lead.get("intent_type", "?") for lead in leads)
    by_engine = Counter(lead.get("engine", "heuristic") for lead in leads)
    scores = [lead.get("intent_score", 0) for lead in leads] or [0]

    posts = outcomes.get("posts", 0)
    clicks = outcomes.get("profile_clicks", 0)
    convs = outcomes.get("conversations", 0)
    trials = outcomes.get("trials", 0)
    sales = outcomes.get("sales", 0)
    revenue = outcomes.get("revenue_usd", 0)

    cost = 0.0
    estimated_cost_per_lead = "n/d"
    if leads:
        # custo real vem do GrokClient; aqui usamos a referência do playbook
        cost = len(leads) * 0.0025
        estimated_cost_per_lead = f"US$ {cost / max(1, len(leads)):.4f}"

    verdict = _verdict(clicks, posts, trials, sales, convs)

    markdown = _render_markdown(
        cfg, leads, by_sub, by_type, by_engine, min(scores), max(scores),
        posts, clicks, convs, trials, sales, revenue, cost, verdict,
    )
    return {
        "total_leads": len(leads),
        "by_subreddit": dict(by_sub),
        "by_intent_type": dict(by_type),
        "by_engine": dict(by_engine),
        "score_min": min(scores),
        "score_max": max(scores),
        "funnel": {
            "posts": posts, "profile_clicks": clicks, "conversations": convs,
            "trials": trials, "sales": sales, "revenue_usd": revenue,
        },
        "estimated_api_cost_usd": round(cost, 4),
        "cost_per_lead": estimated_cost_per_lead,
        "verdict": verdict,
        "markdown": markdown,
    }


def _verdict(clicks: int, posts: int, trials: int, sales: int, convs: int) -> dict:
    """Regras de corte explícitas — nunca decidir por sensação."""
    if posts == 0:
        return {"decision": "setup", "reason": "nenhuma publicação registrada ainda",
                "action": "complete o piloto de 14 dias antes de decidir"}
    if clicks == 0 and posts >= 10:
        return {"decision": "pivotar oferta", "reason": "10+ publicações e zero clique no perfil",
                "action": "trocar a oferta ou o subreddit; não aumentar volume"}
    if trials == 0 and clicks >= 30:
        return {"decision": "corrigir destino", "reason": "cliques sem trial/visita",
                "action": "revisar página de destino, bio e CTA"}
    if sales >= 5:
        return {"decision": "escalar", "reason": "5+ vendas orgânicas validadas",
                "action": "testar Reddit Ads US$ 30–50/dia em Conversation Ad"}
    if trials >= 1:
        return {"decision": "manter", "reason": "pipeline ativo", "action": "dobrar no sub que mais gera conversa"}
    return {"decision": "observar", "reason": "amostra pequena", "action": "mais 7 dias no mesmo sub"}


def _render_markdown(cfg, leads, by_sub, by_type, by_engine, smin, smax,
                     posts, clicks, convs, trials, sales, revenue, cost, verdict) -> str:
    lines = [
        "# Relatório semanal — grok-channel-ops",
        "",
        f"- mercado: **{cfg.market}** · idioma: **{cfg.language}** · fonte: **{cfg.source}**",
        f"- modelo: `{cfg.model}` (rápido: `{cfg.fast_model}`)",
        f"- leads no arquivo: **{len(leads)}** · score {smin}–{smax}",
        f"- motor: {dict(by_engine)}",
        "",
        "## Funil da semana",
        "",
        "| Etapa | Valor | Meta |",
        "|---|---|---|",
        f"| Respostas publicadas | {posts} | 12 |",
        f"| Cliques no perfil | {clicks} | 40 |",
        f"| Conversas iniciadas | {convs} | 5 |",
        f"| Trials / visitas | {trials} | 1,5 |",
        f"| Vendas | {sales} | 0,5 |",
        f"| Receita | US$ {revenue} | — |",
        f"| Custo estimado de API | US$ {cost:.2f} | ≤ US$ 5 |",
        "",
        "## Onde está a intenção",
        "",
    ]
    for sub, n in by_sub.most_common():
        lines.append(f"- **{sub}**: {n} leads")
    lines += ["", "### Por tipo de intenção", ""]
    for t, n in by_type.most_common():
        lines.append(f"- `{t}`: {n}")
    lines += [
        "",
        "## Decisão da semana",
        "",
        f"**{verdict['decision'].upper()}** — {verdict['reason']}",
        "",
        f"Ação: {verdict['action']}",
        "",
        "## Top 5 threads para responder hoje",
        "",
    ]
    for lead in sorted(leads, key=lambda x: x.get("intent_score", 0), reverse=True)[:5]:
        lines.append(
            f"1. **{lead.get('intent_score')}** · {lead.get('subreddit')} · "
            f"{lead.get('title', '')[:90]}  \n   {lead.get('url', '')}"
        )
    lines += [
        "",
        "---",
        "_Gerado por grok-channel-ops. Números do funil são informados manualmente; "
        "o custo de API é estimado pela tabela de preços do playbook._",
    ]
    return "\n".join(lines)
