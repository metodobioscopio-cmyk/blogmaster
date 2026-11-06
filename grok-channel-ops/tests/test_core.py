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

from src.channels import (                            # noqa: E402
    CHANNELS,
    ChannelViolation,
    channel_matrix,
    estimate_cost,
    validate_channel_post,
)
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


# ---------------------------------------------------------------------------
# canais.py — o validador que impede o ban
# ---------------------------------------------------------------------------


def _bloqueia(canal, payload, regra):
    """Auxiliar: espera ChannelViolation com a regra dada."""
    try:
        validate_channel_post(canal, payload)
    except ChannelViolation as exc:
        assert exc.rule == regra, f"esperado {regra}, obtido {exc.rule}"
        assert exc.fix, "violação sem correção acionável"
        return
    raise AssertionError(f"{canal} deveria bloquear com {regra}")


def test_registry_tem_os_20_canais():
    assert len(CHANNELS) == 20
    for canal in ("x_post", "instagram_dm", "whatsapp", "tiktok",
                  "youtube", "linkedin_dm", "threads", "bluesky", "gbp"):
        assert canal in CHANNELS
    assert len(channel_matrix()) == 20


def test_cold_dm_meta_bloqueado():
    _bloqueia("instagram_dm", {"cold": True}, "COLD_DM_META")
    _bloqueia("messenger", {"cold_dm": True}, "COLD_DM_META")
    _bloqueia("whatsapp", {"cold": True}, "COLD_DM_META")


def test_linkedin_automatizado_sempre_bloqueado():
    _bloqueia("linkedin_dm", {"automated": True}, "LINKEDIN_TOS_8_2")
    _bloqueia("linkedin_dm", {}, "LINKEDIN_TOS_8_2")


def test_facebook_groups_esta_morto():
    _bloqueia("facebook_groups", {"text": "oi"}, "FB_GROUPS_DEAD")


def test_janela_24h_bloqueia_promocional():
    _bloqueia("whatsapp", {"promotional": True, "hours_since_inbound": 30,
                           "template_name": "promo"}, "WINDOW_24H")
    _bloqueia("instagram_dm", {"promotional": True, "hours_since_inbound": 25},
              "WINDOW_24H")


def test_dentro_da_janela_passa():
    r = validate_channel_post("instagram_dm", {"promotional": True,
                                               "hours_since_inbound": 3})
    assert r.ok
    r = validate_channel_post("whatsapp", {"promotional": True,
                                           "hours_since_inbound": 1,
                                           "template_name": "promo_v1"})
    assert r.ok


def test_human_agent_manual_passa_automatizado_nao():
    r = validate_channel_post("messenger", {
        "promotional": True, "hours_since_inbound": 100,
        "tag": "HUMAN_AGENT", "automated": False})
    assert r.ok, "humano respondendo em 7 dias é permitido"
    _bloqueia("messenger", {"promotional": True, "hours_since_inbound": 100,
                            "tag": "HUMAN_AGENT", "automated": True},
              "HUMAN_AGENT_AUTOMATED")


def test_private_reply_uma_vez_por_comentario():
    _bloqueia("instagram_dm", {"private_replies_to_same_comment": 1},
              "PRIVATE_REPLY_ONCE")


def test_x_orcamento_de_link():
    _bloqueia("x_post", {"text": "confira", "has_link": True,
                         "link_budget_remaining": 0}, "X_LINK_BUDGET")
    r = validate_channel_post("x_post", {"text": "confira", "has_link": True,
                                         "link_budget_remaining": 3,
                                         "disclosure": "link de afiliado"})
    assert r.ok


def test_x_limite_de_posts():
    _bloqueia("x_post", {"text": "oi", "posts_today": 5}, "X_POST_LIMIT")
    _bloqueia("x_reply", {"text": "oi", "posts_today": 20}, "X_POST_LIMIT")


def test_tiktok_sem_audit_e_regiao_de_dm():
    _bloqueia("tiktok", {"text": "oi"}, "TIKTOK_UNAUDITED")
    _bloqueia("tiktok", {"text": "oi", "audited": True, "dm": True,
                         "region": "DE"}, "TIKTOK_DM_REGION")
    r = validate_channel_post("tiktok", {"text": "oi", "audited": True})
    assert r.ok


def test_limites_de_publicacao():
    _bloqueia("instagram_post", {"text": "oi", "daily_count": 50},
              "IG_PUBLISH_LIMIT")
    _bloqueia("threads", {"text": "oi", "daily_count": 250}, "THREADS_LIMIT")
    _bloqueia("youtube", {"text": "oi", "daily_count": 198}, "YOUTUBE_QUOTA")


def test_youtube_nao_prospecta_em_video_de_terceiro():
    _bloqueia("youtube", {"text": "confira meu link",
                          "third_party_video": True}, "YOUTUBE_THIRD_PARTY")
    r = validate_channel_post("youtube", {"text": "boa pergunta!",
                                          "third_party_video": False})
    assert r.ok


def test_email_compliance_em_tres_camadas():
    _bloqueia("email", {"text": "oi"}, "EMAIL_NO_UNSUB")
    _bloqueia("email", {"text": "oi", "unsubscribe_url": "https://x/u"},
              "EMAIL_NO_ADDRESS")
    _bloqueia("email", {"text": "oi", "unsubscribe_url": "https://x/u",
                        "physical_address": "Rua X, 1, Goiânia/GO"},
              "EMAIL_NO_BASIS")
    r = validate_channel_post("email", {
        "text": "oi", "unsubscribe_url": "https://x/u",
        "physical_address": "Rua X, 1, Goiânia/GO",
        "consent_basis": "opt_in"})
    assert r.ok


def test_disclosure_obrigatorio_antes_do_link():
    _bloqueia("instagram_post", {"text": "veja o imóvel",
                                 "has_link": True}, "DISCLOSURE_MISSING")
    r = validate_channel_post("instagram_post", {
        "text": "veja o imóvel #publi", "has_link": True,
        "disclosure": True})
    assert r.ok


def test_texto_longo_demais():
    _bloqueia("bluesky", {"text": "x" * 301}, "TEXT_TOO_LONG")
    _bloqueia("x_post", {"text": "x" * 281}, "TEXT_TOO_LONG")


def test_custo_estimado_por_canal():
    assert estimate_cost("x_post", {"text": "oi"}) == 0.015
    assert estimate_cost("x_post", {"text": "oi", "has_link": True}) == 0.20
    assert estimate_cost("whatsapp", {"promotional": True,
                                      "template_name": "t"}) == 0.0625
    assert estimate_cost("whatsapp", {}) == 0.0068
    assert estimate_cost("telegram", {"text": "oi"}) == 0.0


def test_canal_saudavel_passa():
    for canal, payload in (
        ("telegram", {"text": "bom dia"}),
        ("threads", {"text": "nota rápida"}),
        ("bluesky", {"text": "teste"}),
        ("gbp", {"text": "novo horário de atendimento"}),
        ("facebook_page", {"text": "post da página"}),
        ("linkedin_post", {"text": "conteúdo próprio"}),
    ):
        assert validate_channel_post(canal, payload).ok, canal


def test_canal_desconhecido_estoura():
    try:
        validate_channel_post("orkut", {"text": "oi"})
    except KeyError as exc:
        assert "orkut" in str(exc)
        return
    raise AssertionError("deveria estourar KeyError")



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
