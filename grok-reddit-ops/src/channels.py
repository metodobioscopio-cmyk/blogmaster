"""Registry de canais + validador de publicação.

Este módulo é a *camada de segurança* do orquestrador: nenhuma chamada de API
de rede acontece sem passar por `validate_channel_post`. Ele transforma as
regras de política de cada plataforma (verificadas em nov/2026) em bloqueio
executável — em vez de confiar na memória do operador.

Filosofia:
    - Falhar cedo: barato bloquear em Python, caro perder a conta.
    - Cada violação traz `rule` (id estável), `message` (o que houve) e
      `fix` (o que fazer em vez disso).
    - O módulo NÃO faz rede. Ele não posta, não lê, não autentica.

Uso:
    >>> from src.channels import validate_channel_post, ChannelViolation
    >>> validate_channel_post("telegram", {"text": "oi", "chat_id": "123"}).ok
    True
    >>> validate_channel_post("instagram_dm", {"cold": True})
    Traceback (most recent call last):
    ...
    src.channels.ChannelViolation: [COLD_DM_META] ...
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

# ---------------------------------------------------------------------------
# Registry
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class Channel:
    """Metadados de um canal — o que o operador precisa saber antes de tocar."""

    key: str
    label: str
    can_read: bool
    can_publish: bool
    can_dm: bool
    window_hours: int | None       # janela de resposta; None = sem janela
    cost_note: str
    publish_limit: str
    dm_limit: str
    risk: str                      # baixo | medio | alto | critico
    docs: str                      # seção do docs/07 e docs/08

    @property
    def summary(self) -> str:
        return (f"{self.label}: publica={'sim' if self.can_publish else 'não'} · "
                f"DM={'sim' if self.can_dm else 'não'} · "
                f"janela={self.window_hours or '—'}h · risco={self.risk}")


CHANNELS: dict[str, Channel] = {
    "reddit": Channel(
        "reddit", "Reddit", True, True, False, None,
        "API gratuita; use a oficial (Data API expira mar/2027)",
        "regra do sub define; 9:1 recomendado", "não há DM por API",
        "alto", "07 §3.1 / 10 §2.3",
    ),
    "x_post": Channel(
        "x_post", "X (Twitter) — post", True, True, False, None,
        "US$ 0,015/post sem link · US$ 0,20 com link",
        "≤ 5 posts/dia (autoimposto)", "—", "medio", "07 §3.1 / 08 §3",
    ),
    "x_reply": Channel(
        "x_reply", "X (Twitter) — resposta", True, True, False, None,
        "US$ 0,010 por summoned reply",
        "≤ 20 respostas/dia (autoimposto)", "—", "alto", "07 §3.1 / 08 §3.3",
    ),
    "x_dm": Channel(
        "x_dm", "X (Twitter) — DM", True, False, True, None,
        "US$ 0,015 por DM", "—", "só com contexto de conversa",
        "alto", "07 §3.1",
    ),
    "instagram_post": Channel(
        "instagram_post", "Instagram — post/Reel", True, True, False, None,
        "grátis (API); vídeo Grok US$ 0,14/s em 720p",
        "50–100 posts/24h por conta", "—", "medio", "07 §3.2 / 08 §5",
    ),
    "instagram_dm": Channel(
        "instagram_dm", "Instagram — DM", True, False, True, 24,
        "grátis dentro da janela", "—", "1 private reply por comentário, em 7d",
        "critico", "07 §3.2 / 08 §5.3",
    ),
    "messenger": Channel(
        "messenger", "Facebook Messenger", True, False, True, 24,
        "grátis dentro da janela", "—", "24h; HUMAN_AGENT 7d (humano)",
        "critico", "07 §3.2 / 08 §5",
    ),
    "facebook_page": Channel(
        "facebook_page", "Facebook Page — post", True, True, False, None,
        "grátis (Graph API)", "conforme rate limit da Page", "—",
        "baixo", "07 §3.2",
    ),
    "facebook_groups": Channel(
        "facebook_groups", "Facebook Groups", False, False, False, None,
        "API removida em 22/04/2024", "impossível por API", "impossível",
        "critico", "07 §1 / 10 §2",
    ),
    "whatsapp": Channel(
        "whatsapp", "WhatsApp Cloud API", True, True, True, 24,
        "BR: marketing R$ 0,3217 · utility/serviço R$ 0,035",
        "template aprovado; 1.000 serviço grátis/mês", "janela 24h; opt-in obrigatório",
        "critico", "07 §3.3 / 08 §4",
    ),
    "tiktok": Channel(
        "tiktok", "TikTok — post", True, True, False, None,
        "grátis; audit obrigatório", "~15 posts/dia · 6 req/min",
        "DM API fechada em UE/UK/CH", "alto", "07 §3.4 / 08 §6",
    ),
    "youtube": Channel(
        "youtube", "YouTube — comentário", True, True, False, None,
        "grátis; cota 10.000 un/dia", "~198 respostas/dia (50 un cada)",
        "sem DM", "medio", "07 §3.5 / 08 §7",
    ),
    "linkedin_post": Channel(
        "linkedin_post", "LinkedIn — post próprio", True, True, False, None,
        "grátis (API de publicação)", "conforme rate limit", "—",
        "baixo", "07 §3.6 / 08",
    ),
    "linkedin_dm": Channel(
        "linkedin_dm", "LinkedIn — outbound/DM", False, False, False, None,
        "não existe rota oficial", "proibido (§8.2)", "proibido (§8.2)",
        "critico", "07 §3.6 / 10 §2.1",
    ),
    "threads": Channel(
        "threads", "Threads", True, True, True, None,
        "grátis", "250 posts + 1.000 respostas/24h", "500 caracteres",
        "baixo", "07 §3.7 / 08 §9.1",
    ),
    "bluesky": Channel(
        "bluesky", "Bluesky", True, True, True, None,
        "grátis, sem App Review", "5.000 pontos/hora (post = 3)", "300 caracteres",
        "baixo", "07 §3.7 / 08 §9.2",
    ),
    "telegram": Channel(
        "telegram", "Telegram", True, True, True, None,
        "grátis", "1 msg/s por chat · 20/min por grupo", "4.096 caracteres",
        "baixo", "07 §3 / 08 §2",
    ),
    "gbp": Channel(
        "gbp", "Google Business Profile", True, True, False, None,
        "grátis; 10 edições/min por perfil", "post expira em ~7 dias", "sem DM",
        "baixo", "07 §3.8 / 08 §8",
    ),
    "nextdoor": Channel(
        "nextdoor", "Nextdoor", True, True, True, None,
        "US$ 30–150 por ZIP/mês (sponsorship)", "2 posts/mês no plano grátis",
        "sem API de DM pública", "medio", "07 §3.8",
    ),
    "email": Channel(
        "email", "E-mail", True, True, False, None,
        "US$ 0,01–0,05 por lead (lista própria)", "conforme ESP",
        "CAN-SPAM/LGPD/GDPR", "alto", "10 §2.6",
    ),
}


def get_channel(key: str) -> Channel:
    try:
        return CHANNELS[key]
    except KeyError:
        known = ", ".join(sorted(CHANNELS))
        raise KeyError(f"canal desconhecido: {key!r}. Canais: {known}") from None


# ---------------------------------------------------------------------------
# Violations
# ---------------------------------------------------------------------------


@dataclass
class ChannelViolation(Exception):
    """Bloqueio de publicação com correção acionável."""

    rule: str
    message: str
    fix: str
    channel: str = ""

    def __post_init__(self) -> None:
        Exception.__init__(self, f"[{self.rule}] {self.message} → {self.fix}")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"[{self.rule}] {self.message} → {self.fix}"


@dataclass
class ValidationResult:
    ok: bool
    channel: str
    checks: list[str] = field(default_factory=list)
    rule: str | None = None

    def __bool__(self) -> bool:  # pragma: no cover - trivial
        return self.ok


def _fail(rule: str, message: str, fix: str, channel: str) -> ChannelViolation:
    return ChannelViolation(rule=rule, message=message, fix=fix, channel=channel)


# ---------------------------------------------------------------------------
# Regras por canal
# ---------------------------------------------------------------------------

MAX_LEN = {
    "x_post": 280,
    "x_reply": 280,
    "instagram_post": 2200,
    "instagram_dm": 1000,
    "messenger": 2000,
    "whatsapp": 4096,
    "telegram": 4096,
    "threads": 500,
    "bluesky": 300,
    "gbp": 1500,
    "tiktok": 2200,
    "linkedin_post": 3000,
    "email": 100_000,
    "youtube": 10_000,
    "facebook_page": 63_206,
}


def _check_disclosure(channel: str, post: dict[str, Any]) -> None:
    """Link comercial exige disclosure antes do link."""
    has_link = post.get("has_link") or post.get("link")
    if not has_link:
        return
    if post.get("disclosure") or post.get("affiliate", False):
        return
    raise _fail(
        "DISCLOSURE_MISSING",
        f"{channel}: conteúdo com link comercial sem aviso de afiliação",
        "inclua disclosure antes do link (\"sou afiliado\", \"#publi\") — "
        "FTC 16 CFR 255, CONAR Guia 12/05/2026",
        channel,
    )


def _check_meta_window(channel: str, post: dict[str, Any]) -> None:
    """Promocional fora da janela de 24h só com tag permitida e humana."""
    if not post.get("promotional"):
        return
    hours = post.get("hours_since_inbound")
    if hours is None:
        return  # inbound desconhecido: quem chama assume o risco
    if float(hours) <= 24:
        return
    tag = str(post.get("tag") or "").upper()
    if tag == "HUMAN_AGENT":
        if post.get("automated", False):
            raise _fail(
                "HUMAN_AGENT_AUTOMATED",
                f"{channel}: tag HUMAN_AGENT usada por automação",
                "a tag HUMAN_AGENT é para resposta manual de pessoa, até 7 dias",
                channel,
            )
        return  # humano respondendo: permitido
    raise _fail(
        "WINDOW_24H",
        f"{channel}: mensagem promocional {float(hours):.0f}h após o último inbound",
        "responda dentro de 24h, use template aprovado (WhatsApp) ou espere a "
        "pessoa escrever de novo — fora da janela só Sponsored/Marketing Messages",
        channel,
    )


def _check_email(post: dict[str, Any]) -> None:
    if not post.get("unsubscribe_url"):
        raise _fail(
            "EMAIL_NO_UNSUB",
            "e-mail sem link de descadastro",
            "inclua unsubscribe em 1 clique (CAN-SPAM exige em 10 dias úteis)",
            "email",
        )
    if not post.get("physical_address"):
        raise _fail(
            "EMAIL_NO_ADDRESS",
            "e-mail sem endereço físico da empresa",
            "CAN-SPAM exige endereço postal válido no rodapé",
            "email",
        )
    if not post.get("consent_basis"):
        raise _fail(
            "EMAIL_NO_BASIS",
            "e-mail sem base legal declarada",
            "declare 'opt_in' (BR/EUA) ou 'legitimate_interest' + LIA (GDPR)",
            "email",
        )


def _check_x(post: dict[str, Any], channel: str) -> None:
    text = str(post.get("text") or "")
    has_link = bool(post.get("has_link") or "http" in text)
    if has_link and channel == "x_post":
        budget = post.get("link_budget_remaining")
        if budget is not None and int(budget) <= 0:
            raise _fail(
                "X_LINK_BUDGET",
                "orçamento de posts com link esgotado",
                "publique sem URL (US$ 0,015) e coloque o link na resposta "
                "(economia de 92% sobre US$ 0,20)",
                channel,
            )
    daily = post.get("posts_today")
    if daily is not None:
        limit = 5 if channel == "x_post" else 20
        if int(daily) >= limit:
            raise _fail(
                "X_POST_LIMIT",
                f"{channel}: {daily} publicações hoje (limite autoimposto {limit})",
                "espere o próximo dia; acima disso a plataforma marca automação agressiva",
                channel,
            )


#: países/regiões onde a API de mensagens do TikTok está fechada
_TIKTOK_DM_BLOCKED = {
    "EU", "UK", "GB", "CH", "DE", "FR", "IT", "ES", "PT", "NL", "BE", "IE",
    "AT", "SE", "DK", "FI", "PL", "CZ", "GR", "RO", "HU", "SK", "BG", "HR",
    "SI", "LT", "LV", "EE", "LU", "MT", "CY", "NO", "IS", "LI",
}


def _check_tiktok(post: dict[str, Any]) -> None:
    if not post.get("audited", False):
        raise _fail(
            "TIKTOK_UNAUDITED",
            "app TikTok sem audit aprovado",
            "posts saem privados (unaudited_client_can_only_post_to_private_accounts); "
            "submeta o app ao audit antes de publicar",
            "tiktok",
        )
    region = str(post.get("region") or "").upper()
    if post.get("dm") and region in _TIKTOK_DM_BLOCKED:
        raise _fail(
            "TIKTOK_DM_REGION",
            f"DM API do TikTok fechada para {region}",
            "use Business Suite manualmente ou outro canal de conversa",
            "tiktok",
        )


def _check_quotas(channel: str, post: dict[str, Any]) -> None:
    daily = post.get("daily_count")
    if daily is None:
        return
    limits = {
        "instagram_post": 50,
        "threads": 250,
        "youtube": 198,
        "telegram": 30,
        "gbp": 100,
    }
    limit = limits.get(channel)
    if limit is not None and int(daily) >= limit:
        rule = {
            "instagram_post": "IG_PUBLISH_LIMIT",
            "threads": "THREADS_LIMIT",
            "youtube": "YOUTUBE_QUOTA",
            "telegram": "TELEGRAM_RATE",
            "gbp": "GBP_EDIT_LIMIT",
        }[channel]
        raise _fail(rule, f"{channel}: {daily} publicações hoje (limite {limit})",
                    "reagende para a próxima janela; estourar a cota pode restringir a conta",
                    channel)


# ---------------------------------------------------------------------------
# API pública
# ---------------------------------------------------------------------------

#: canais que nunca aceitam automação de outbound
BLOCKED_ALWAYS = {
    "linkedin_dm": (
        "LINKEDIN_TOS_8_2",
        "LinkedIn proíbe bots e automação de sessão (User Agreement §8.2)",
        "publique no feed (API oficial) e envie convites/mensagens manualmente; "
        "Sales Navigator como pesquisa, não como disparo",
    ),
    "facebook_groups": (
        "FB_GROUPS_DEAD",
        "a Groups API foi removida em 22/04/2024 (publish_to_groups)",
        "poste manualmente ou use o agendador nativo do admin do grupo",
    ),
}


def validate_channel_post(channel: str, post: dict[str, Any]) -> ValidationResult:
    """Valida um payload antes de publicar.

    Levanta `ChannelViolation` na primeira regra quebrada; retorna
    `ValidationResult` com `ok=True` quando passa.
    """
    get_channel(channel)  # KeyError se o canal não existe

    if channel in BLOCKED_ALWAYS:
        rule, msg, fix = BLOCKED_ALWAYS[channel]
        raise _fail(rule, msg, fix, channel)

    if channel == "email":
        _check_email(post)
        return ValidationResult(True, channel, ["compliance e-mail ok"])

    if channel in ("instagram_dm", "messenger", "whatsapp", "x_dm"):
        if post.get("cold") or post.get("cold_dm"):
            raise _fail(
                "COLD_DM_META" if channel != "x_dm" else "COLD_DM",
                f"{channel}: tentativa de mensagem para quem nunca escreveu",
                "peça que a pessoa escreva primeiro (comment-to-DM, click-to-WhatsApp, "
                "link na bio) — não existe rota de API para DM frio",
                channel,
            )
        _check_meta_window(channel, post)
        if channel in ("instagram_dm", "messenger"):
            replies = post.get("private_replies_to_same_comment")
            if replies is not None and int(replies) >= 1:
                raise _fail(
                    "PRIVATE_REPLY_ONCE",
                    f"{channel}: segunda DM privada no mesmo comentário",
                    "é permitida 1 mensagem por comentário, dentro de 7 dias; "
                    "a resposta seguinte só depois que a pessoa escrever",
                    channel,
                )
        if channel == "whatsapp" and post.get("promotional"):
            if not post.get("template_name"):
                raise _fail(
                    "WHATSAPP_NO_TEMPLATE",
                    "mensagem de marketing sem template aprovado",
                    "submeta o template na Meta; template reprovado/ausente não entrega",
                    channel,
                )

    if channel in ("x_post", "x_reply"):
        _check_x(post, channel)

    if channel == "tiktok":
        _check_tiktok(post)

    _check_quotas(channel, post)

    # tamanho
    limit = MAX_LEN.get(channel)
    text = str(post.get("text") or post.get("caption") or "")
    if limit and len(text) > limit:
        raise _fail(
            "TEXT_TOO_LONG",
            f"{channel}: {len(text)} caracteres (limite {limit})",
            "corte o texto ou publique como thread/carrossel",
            channel,
        )

    # YouTube: prospecção em vídeo de terceiro é spam
    if channel == "youtube" and post.get("third_party_video"):
        raise _fail(
            "YOUTUBE_THIRD_PARTY",
            "comentário em vídeo de terceiro para prospectar",
            "responda apenas comentários do seu próprio canal",
            channel,
        )

    _check_disclosure(channel, post)

    return ValidationResult(True, channel, ["todas as regras do canal ok"])


def estimate_cost(channel: str, post: dict[str, Any]) -> float:
    """Custo marginal estimado em US$ de uma publicação (0.0 quando grátis)."""
    text = str(post.get("text") or "")
    has_link = bool(post.get("has_link") or "http" in text)
    if channel == "x_post":
        return 0.20 if has_link else 0.015
    if channel == "x_reply":
        return 0.010 if not has_link else 0.20
    if channel == "x_dm":
        return 0.015
    if channel == "whatsapp":
        if post.get("template_name") and post.get("promotional"):
            return 0.0625  # marketing BR
        return 0.0068      # utility/serviço (após os 1.000 grátis)
    if channel == "gbp":
        return 0.0
    return 0.0


def channel_matrix() -> list[dict[str, str]]:
    """Tabela pronta para terminal/relatório."""
    rows = []
    for ch in CHANNELS.values():
        rows.append({
            "canal": ch.key,
            "publica": "sim" if ch.can_publish else "não",
            "dm": "sim" if ch.can_dm else "não",
            "janela_h": str(ch.window_hours) if ch.window_hours else "—",
            "risco": ch.risk,
            "limite": ch.publish_limit,
            "custo": ch.cost_note,
        })
    return rows
