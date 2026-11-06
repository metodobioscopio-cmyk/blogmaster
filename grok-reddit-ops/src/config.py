"""Configuração central — tudo por ambiente, nada hardcoded."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path


def _env_bool(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


def _load_dotenv(root: Path) -> None:
    """Carrega .env sem dependência externa. Não sobrescreve variáveis já definidas."""
    env_path = root / ".env"
    if not env_path.exists():
        return
    for raw in env_path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


@dataclass
class Config:
    root: Path
    api_key: str = ""
    base_url: str = "https://api.x.ai/v1"
    model: str = "grok-4.3"
    fast_model: str = "grok-4.1-fast"
    source: str = "fixture"
    min_score: int = 60
    daily_usd: float = 1.00
    daily_x_posts: int = 200
    daily_draft_cap: int = 8
    disclosure_mode: str = "strict"
    offline: bool = False
    subreddits: tuple[str, ...] = ()
    language: str = "pt-BR"
    market: str = "br"
    prompts_dir: Path = field(default_factory=lambda: Path("prompts"))

    @property
    def prompt_path(self) -> Path:
        return self.root / self.prompts_dir


def load_config(root: Path) -> Config:
    _load_dotenv(root)
    subs_raw = os.getenv("SUBREDDITS", "")
    subs = tuple(s.strip() for s in subs_raw.split(",") if s.strip())
    return Config(
        root=root,
        api_key=os.getenv("XAI_API_KEY", "").strip(),
        base_url=os.getenv("XAI_BASE_URL", "https://api.x.ai/v1").rstrip("/"),
        model=os.getenv("GROK_MODEL", "grok-4.3").strip(),
        fast_model=os.getenv("GROK_MODEL_FAST", "grok-4.1-fast").strip(),
        source=os.getenv("REDDIT_SOURCE", "fixture").strip().lower(),
        min_score=int(os.getenv("MIN_SCORE", "60")),
        daily_usd=float(os.getenv("DAILY_BUDGET_USD", "1.00")),
        daily_x_posts=int(os.getenv("X_SEARCH_POSTS_BUDGET", "200")),
        daily_draft_cap=int(os.getenv("DAILY_DRAFT_CAP", "8")),
        disclosure_mode=os.getenv("DISCLOSURE_MODE", "strict").strip().lower(),
        offline=_env_bool("OFFLINE", False) or not bool(os.getenv("XAI_API_KEY")),
        subreddits=subs,
        language=os.getenv("LANGUAGE", "pt-BR"),
        market=os.getenv("MARKET", "br").strip().lower(),
    )
