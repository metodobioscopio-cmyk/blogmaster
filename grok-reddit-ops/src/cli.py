#!/usr/bin/env python3
"""grok-reddit-ops — copiloto de vendas para Reddit usando a API xAI.

Camadas:
    radar   -> coleta threads e pontua intenção
    scribe  -> redige resposta no tom da comunidade (revisão humana obrigatória)
    weekly  -> consolida métricas e decide go/no-go

Modos de dado: fixture (offline), manual (cola a thread), oauth (API oficial).

Uso:
    python -m src.cli radar  --source fixture --limit 12
    python -m src.cli radar  --source manual --text "..." --sub r/Goiania
    python -m src.cli scribe --lead output/leads.jsonl --index 0
    python -m src.cli weekly --input output/leads.jsonl
    python -m src.cli canais
    python -m src.cli canais --check instagram_dm --cold
    python -m src.cli doctor
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from src.channels import (                              # noqa: E402
    CHANNELS,
    ChannelViolation,
    channel_matrix,
    estimate_cost,
    validate_channel_post,
)
from src.config import load_config                      # noqa: E402
from src.grok import GrokClient, GrokError              # noqa: E402
from src.sources import get_source                      # noqa: E402
from src.pipeline import run_radar, run_scribe          # noqa: E402
from src.report import weekly_report, save_jsonl        # noqa: E402


def _print(obj) -> None:
    print(json.dumps(obj, ensure_ascii=False, indent=2))


def cmd_radar(args, cfg) -> int:
    source = get_source(cfg.source if not args.source else args.source, cfg)
    if args.text:
        threads = source.from_text(args.text, subreddit=args.sub or "r/manual")
    else:
        threads = source.fetch(limit=args.limit, since_hours=args.hours)
    if not threads:
        print("[radar] nenhuma thread encontrada. Verifique fonte/filtros.", file=sys.stderr)
        return 1

    client = GrokClient(cfg)
    leads = run_radar(threads, client, cfg, top_n=args.top)
    out = ROOT / "output" / "leads.jsonl"
    save_jsonl(leads, out)

    if args.json:
        _print(leads)
    else:
        print(f"\n{len(threads)} threads analisadas · {len(leads)} leads acima do corte "
              f"({cfg.min_score}) · modo={cfg.source} · modelo={cfg.model}")
        print(f"custo estimado desta execução: US$ {client.budget.spent_usd:.4f}\n")
        for i, lead in enumerate(leads, 1):
            print(f"[{i}] score {lead['intent_score']:>3} · {lead['subreddit']} · "
                  f"{lead['intent_type']}")
            print(f"    {lead['title'][:110]}")
            print(f"    ângulo: {lead['angle']}")
            print(f"    {lead['url']}\n")
    print(f"[radar] salvo em {out.relative_to(ROOT)}")
    return 0


def cmd_scribe(args, cfg) -> int:
    path = Path(args.lead)
    if not path.is_absolute():
        path = ROOT / path
    leads = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    if not leads:
        print("[scribe] arquivo de leads vazio.", file=sys.stderr)
        return 1
    idx = args.index
    if idx < 0 or idx >= len(leads):
        print(f"[scribe] índice fora do intervalo (0..{len(leads)-1}).", file=sys.stderr)
        return 1

    lead = leads[idx]
    client = GrokClient(cfg)
    draft = run_scribe(lead, client, cfg)

    print("=" * 78)
    print(f"THREAD : {lead['title']}")
    print(f"SUB    : {lead['subreddit']}   SCORE: {lead['intent_score']}")
    print(f"REGRA  : link permitido = {draft['link_allowed']} · disclosure = {draft['disclosure']}")
    print("=" * 78)
    print(draft["text"])
    print("=" * 78)
    print("CHECKLIST:")
    for item in draft["checklist"]:
        print(f"  [ ] {item}")
    if draft.get("warnings"):
        print("\nAVISOS:")
        for w in draft["warnings"]:
            print(f"  ! {w}")

    if args.save:
        out = ROOT / "output" / "drafts" / f"draft_{idx:02d}.md"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(
            f"# Draft — {lead['title']}\n\n"
            f"- sub: {lead['subreddit']}\n- score: {lead['intent_score']}\n"
            f"- link permitido: {draft['link_allowed']}\n- disclosure: {draft['disclosure']}\n\n"
            f"---\n\n{draft['text']}\n\n---\n\n"
            + "\n".join(f"- [ ] {c}" for c in draft["checklist"]),
            encoding="utf-8",
        )
        print(f"\n[save] {out.relative_to(ROOT)}")
    return 0


def cmd_weekly(args, cfg) -> int:
    path = Path(args.input)
    if not path.is_absolute():
        path = ROOT / path
    leads = [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]
    outcomes = {}
    if args.posts or args.clicks:
        outcomes = {
            "posts": args.posts,
            "profile_clicks": args.clicks,
            "conversations": args.conversations,
            "trials": args.trials,
            "sales": args.sales,
            "revenue_usd": args.revenue,
        }
    report = weekly_report(leads, cfg, outcomes)
    summary = {k: v for k, v in report.items() if k != "markdown"}
    _print(summary)
    out = ROOT / "output" / "weekly.md"
    out.write_text(report["markdown"], encoding="utf-8")
    print(f"\n[weekly] salvo em {out.relative_to(ROOT)}")
    return 0


def cmd_doctor(args, cfg) -> int:
    print("grok-reddit-ops · diagnóstico\n")
    checks = [
        ("API key configurada", bool(cfg.api_key)),
        ("modelo principal", cfg.model),
        ("modelo rápido", cfg.fast_model),
        ("fonte de dados", cfg.source),
        ("orçamento diário (US$)", cfg.daily_usd),
        ("teto diário x_search (posts)", cfg.daily_x_posts),
        ("score mínimo", cfg.min_score),
        ("disclosure", cfg.disclosure_mode),
        ("fixtures presentes", (ROOT / "fixtures" / "threads.json").exists()),
        ("rules.yaml presente", (ROOT / "rules.yaml").exists()),
    ]
    for name, val in checks:
        print(f"  {'OK ' if val else '!! '} {name}: {val}")
    if not cfg.api_key:
        print("\n  Sem XAI_API_KEY o modo fixture ainda funciona (score heurístico).")
    return 0


def cmd_canais(args, cfg) -> int:
    if args.check:
        canal = args.check
        if canal not in CHANNELS:
            print(f"[canais] desconhecido: {canal}", file=sys.stderr)
            print("  válidos: " + ", ".join(sorted(CHANNELS)), file=sys.stderr)
            return 1
        payload: dict = {}
        if args.text:
            payload["text"] = args.text
        if args.link:
            payload["has_link"] = True
            payload["link"] = args.link
        if args.cold:
            payload["cold"] = True
        if args.hours is not None:
            payload["hours_since_inbound"] = args.hours
            payload["promotional"] = True
        if args.tested:
            payload["audited"] = True
        try:
            res = validate_channel_post(canal, payload)
        except ChannelViolation as exc:
            _print({
                "ok": False,
                "canal": canal,
                "regra": exc.rule,
                "problema": exc.message,
                "correcao": exc.fix,
            })
            return 3
        ch = CHANNELS[canal]
        _print({
            "ok": True,
            "canal": canal,
            "checks": res.checks,
            "custo_estimado_usd": estimate_cost(canal, payload),
            "janela_horas": ch.window_hours,
            "limite": ch.publish_limit,
            "docs": ch.docs,
        })
        return 0

    rows = channel_matrix()
    if args.json:
        _print(rows)
        return 0
    cab = f"{'CANAL':<18}{'PUBLICA':<9}{'DM':<6}{'JANELA':<8}{'RISCO':<9}LIMITE"
    print(cab)
    print("-" * len(cab))
    for r in rows:
        print(f"{r['canal']:<18}{r['publica']:<9}{r['dm']:<6}"
              f"{r['janela_h']:<8}{r['risco']:<9}{r['limite']}")
    print(f"\n{len(rows)} canais · detalhe em docs/07 e docs/08")
    print("use:  python3 -m src.cli canais --check <canal> [--text ...] [--link ...] [--cold]")
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="grok-reddit-ops", description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    r = sub.add_parser("radar", help="coleta threads e pontua intenção")
    r.add_argument("--source", choices=["fixture", "oauth", "manual"], default=None)
    r.add_argument("--limit", type=int, default=20)
    r.add_argument("--top", type=int, default=10, help="quantos leads manter no arquivo")
    r.add_argument("--hours", type=int, default=72, help="janela em horas")
    r.add_argument("--text", type=str, default=None, help="texto da thread (modo manual)")
    r.add_argument("--sub", type=str, default=None, help="subreddit (modo manual)")
    r.add_argument("--json", action="store_true")
    r.set_defaults(func=cmd_radar)

    s = sub.add_parser("scribe", help="redige resposta para um lead")
    s.add_argument("--lead", default="output/leads.jsonl")
    s.add_argument("--index", type=int, default=0)
    s.add_argument("--save", action="store_true")
    s.set_defaults(func=cmd_scribe)

    w = sub.add_parser("weekly", help="relatório semanal")
    w.add_argument("--input", default="output/leads.jsonl")
    w.add_argument("--posts", type=int, default=0, help="respostas publicadas na semana")
    w.add_argument("--clicks", type=int, default=0, help="cliques no perfil")
    w.add_argument("--conversations", type=int, default=0)
    w.add_argument("--trials", type=int, default=0, help="trials (afiliado) ou visitas (imob.)")
    w.add_argument("--sales", type=int, default=0)
    w.add_argument("--revenue", type=float, default=0.0)
    w.set_defaults(func=cmd_weekly)

    c = sub.add_parser("canais", help="matriz de canais e validador de publicação")
    c.add_argument("--check", metavar="CANAL", default=None,
                   help="valida um payload contra as regras do canal")
    c.add_argument("--text", default=None, help="texto a validar")
    c.add_argument("--link", default=None, help="URL presente no post")
    c.add_argument("--cold", action="store_true", help="simula DM fria")
    c.add_argument("--hours", type=float, default=None,
                   help="horas desde o último inbound (testa janela de 24h)")
    c.add_argument("--tested", action="store_true", help="simula app TikTok auditado")
    c.add_argument("--json", action="store_true")
    c.set_defaults(func=cmd_canais)

    d = sub.add_parser("doctor", help="checa configuração")
    d.set_defaults(func=cmd_doctor)
    return p


def main(argv=None) -> int:
    args = build_parser().parse_args(argv)
    cfg = load_config(ROOT)
    try:
        return args.func(args, cfg)
    except ChannelViolation as exc:
        print(f"[bloqueado] {exc}", file=sys.stderr)
        return 3
    except GrokError as exc:
        print(f"[erro] {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
