"""Testes do núcleo: score, regras, parsing, orçamento e pipeline offline.

Rodar:  python -m pytest tests -q   (ou  python tests/test_core.py)
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from src.config import Config                          # noqa: E402
from src.grok import Budget, Usage, parse_json_loose   # noqa: E402
from src.pipeline import (                             # noqa: E402
    extract_x_search_budget,
    heuristic_score,
    run_radar,
    run_scribe,
)
from src.report import weekly_report                   # noqa: E402
from src.sources import (                              # noqa: E402
    Thread,
    default_rules,
    load_rules,
    parse_simple_yaml,
    rules_for_sub,
)


def _thread(**kw) -> Thread:
    base = dict(
        id="t1", subreddit="r/Goiania",
        title="Alguém indica um corretor em Goiânia?",
        body="Estou mudando de cidade e preciso de ajuda para escolher.",
        url="https://reddit.com/x", created_utc=datetime.now(timezone.utc) - timedelta(hours=2),
        score=10, num_comments=3,
    )
    base.update(kw)
    return Thread(**base)


def test_score_thread_quente():
    score, kind, signals = heuristic_score(_thread())
    assert score >= 70, f"esperado >=70, obtido {score}"
    assert kind in ("recommendation_request", "problem_aware")
    assert any("fresca" in s for s in signals)


def test_score_thread_fria_e_nao_comercial():
    score, kind, _ = heuristic_score(_thread(
        title="Desabafo sobre o mercado imobiliário",
        body="Só queria reclamar.",
        created_utc=datetime.now(timezone.utc) - timedelta(hours=200),
        num_comments=90,
    ))
    assert score < 40
    assert kind == "not_commercial"


def test_score_penaliza_thread_antiga():
    quente, _, _ = heuristic_score(_thread())
    velha, _, _ = heuristic_score(_thread(
        created_utc=datetime.now(timezone.utc) - timedelta(hours=100)))
    assert quente > velha


def test_regras_por_sub():
    rules = parse_simple_yaml((ROOT / "rules.yaml").read_text(encoding="utf-8"))
    assert rules_for_sub(rules, "r/Goiania")["link_allowed"] is False
    assert rules_for_sub(rules, "Goiania")["disclosure_required"] is True
    assert rules_for_sub(rules, "r/SideProject")["promo_tolerance"] == "high"
    assert rules_for_sub(rules, "r/inexistente") == {}
    assert default_rules()["link_allowed"] is False


def test_parse_json_loose_com_cerca():
    raw = '```json\n{"a": 1, "b": [2, 3]}\n```'
    assert parse_json_loose(raw) == {"a": 1, "b": [2, 3]}


def test_parse_json_loose_com_preambulo():
    raw = 'Claro! Aqui está:\n{"intent_score": 80}\nEspero ter ajudado.'
    assert parse_json_loose(raw)["intent_score"] == 80


def test_budget_freia_gasto():
    b = Budget(daily_usd=0.01)
    assert b.can_spend(0.005)
    b.charge(0.008)
    assert not b.can_spend(0.005)
    assert b.check_x(500) == 200          # respeita o teto de posts
    b.charge(0.0, 150)
    assert b.check_x(500) == 50


def test_custo_usage():
    u = Usage(input_tokens=1_000_000, output_tokens=1_000_000)
    assert abs(u.cost_usd("grok-4.3") - (1.25 + 2.50)) < 1e-6
    # cache desconta do input cheio
    u2 = Usage(input_tokens=1_000_000, cached_tokens=1_000_000)
    assert abs(u2.cost_usd("grok-4.3") - 0.20) < 1e-6


def test_x_search_guard():
    ok, msg = extract_x_search_budget(50, 200)
    assert ok and msg == ""
    bad, msg2 = extract_x_search_budget(400, 200)
    assert not bad and "US$" in msg2


def test_pipeline_offline_ponta_a_ponta(tmp_path):
    cfg = Config(root=ROOT, offline=True, api_key="", source="fixture", min_score=55)
    from src.grok import GrokClient
    client = GrokClient(cfg)
    threads = [_thread(), _thread(id="t2", title="Notícia do dia", body="nada", num_comments=120)]
    leads = run_radar(threads, client, cfg, top_n=5)
    assert leads and all("intent_score" in x for x in leads)
    assert leads[0]["intent_score"] >= leads[-1]["intent_score"]

    draft = run_scribe(leads[0], client, cfg)
    assert draft["text"]
    assert isinstance(draft["checklist"], list)
    assert draft["disclosure"]

    report = weekly_report(leads, cfg, {"posts": 12, "profile_clicks": 45, "trials": 2})
    assert report["funnel"]["posts"] == 12
    assert report["verdict"]["decision"] in {
        "setup", "pivotar oferta", "corrigir destino", "escalar", "manter", "observar"
    }
    assert "# Relatório semanal" in report["markdown"]


def test_veredito_pivota_com_zero_clique():
    cfg = Config(root=ROOT, offline=True)
    leads = [{"subreddit": "r/x", "intent_score": 70, "intent_type": "problem_aware"}]
    rep = weekly_report(leads, cfg, {"posts": 12, "profile_clicks": 0})
    assert rep["verdict"]["decision"] == "pivotar oferta"


def test_fixtures_carregam():
    data = json.loads((ROOT / "fixtures" / "threads.json").read_text(encoding="utf-8"))
    assert len(data) >= 8
    assert all("title" in t and "subreddit" in t for t in data)


def _run_all() -> int:
    fns = [v for k, v in sorted(globals().items()) if k.startswith("test_") and callable(v)]
    failed = 0
    for fn in fns:
        try:
            if fn.__code__.co_argcount == 1:
                import tempfile
                with tempfile.TemporaryDirectory() as td:
                    fn(Path(td))
            else:
                fn()
            print(f"  OK   {fn.__name__}")
        except AssertionError as exc:
            failed += 1
            print(f"  FAIL {fn.__name__}: {exc}")
        except Exception as exc:  # noqa: BLE001
            failed += 1
            print(f"  ERR  {fn.__name__}: {type(exc).__name__}: {exc}")
    print(f"\n{len(fns) - failed}/{len(fns)} testes passaram")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(_run_all())
