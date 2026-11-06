#!/usr/bin/env python3
"""Gera o site estático a partir dos documentos Markdown em docs/.

Sem framework: markdown -> HTML com tema próprio, navegação, busca client-side
e sumário lateral. Rodar:  python3 tools/build_site.py
"""

from __future__ import annotations

import html
import json
import re
from datetime import datetime
from pathlib import Path

import markdown
from markdown.extensions.toc import TocExtension

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SITE = ROOT / "site"

# ordem e metadados de navegação
PAGES = [
    ("00-metapesquisa-grok.md", "00", "Meta-pesquisa", "O que é um bot Grok de vendas, o que custa e o que não faz"),
    ("01-estudo-afiliados.md", "01", "Estudo 1 · Afiliados", "Unit economics, rotas, cases e o caminho real até o dólar"),
    ("02-estudo-real-estate.md", "02", "Estudo 2 · Real estate", "Velocidade de resposta, Goiânia, EUA e compliance"),
    ("03-playbook-grok.md", "03", "Playbook Grok", "Setup, prompts P1–P7 e controle de custo"),
    ("04-rotas-reddit.md", "04", "Rotas do Reddit", "As 11 formas de vender, comparadas"),
    ("05-plano-90-dias.md", "05", "Plano & piloto", "90 dias, 14 dias e critérios de corte"),
    ("06-compliance.md", "06", "Compliance", "Reddit, FTC, CONAR, CRECI, LGPD e TCPA"),
]

# Fase 2 — expansão multicanal (numeração própria para não renumerar a Fase 1)
CHANNEL_PAGES = [
    ("07-canais-2026.md", "C1", "Mapa dos canais", "Onde o bot vende, o que é permitido e quanto custa em 2026"),
    ("08-setup-tecnico.md", "C2", "Setup técnico", "As 12 configs que fazem o bot publicar sem tomar ban"),
    ("09-custos-roi.md", "C3", "Custos & ROI", "CPL, custo por venda e payback por canal"),
    ("10-riscos-compliance.md", "C4", "Riscos & bans", "Os 6 banimentos reais e a defesa em código"),
    ("11-case-multicanal.md", "C5", "Case 14 dias", "5 canais, US$ 47 e 9 conversas — o que funcionou"),
]

EXTRA_PAGES = [
    ("README-codigo.md", "M", "Motor em Python", "grok-reddit-ops: instalação, uso e arquitetura"),
]

CALLOUT_LABELS = {
    "meta": ("Contexto", "◷"),
    "alerta": ("Atenção", "!"),
    "decisao": ("Decisão", "→"),
    "sim": ("Simulação", "≈"),
    "nota": ("Nota", "i"),
}


def _inline_md() -> markdown.Markdown:
    """Instância markdown usada para processar o corpo dos callouts separadamente."""
    return markdown.Markdown(extensions=["tables", "sane_lists"])


def callouts(text: str) -> str:
    """Converte blocos ::: tipo ... ::: em HTML antes do markdown.

    O corpo do callout é renderizado como markdown próprio (tabelas, listas, ênfase)
    e depois inserido, porque HTML bruto bloqueia o parse de markdown dentro dele.
    """
    pattern = re.compile(r"^:::[ \t]*(\w+)[ \t]*\n(.*?)^:::[ \t]*$", re.M | re.S)
    label_map = CALLOUT_LABELS

    def repl(m: re.Match) -> str:
        kind, body = m.group(1), m.group(2).strip()
        label, icon = label_map.get(kind, (kind.title(), "•"))
        inner = _inline_md().convert(body)
        return (
            f'<div class="callout callout--{kind}" markdown="0">'
            f'<div class="callout__head"><span class="callout__icon">{icon}</span>'
            f'<span class="callout__label">{label}</span></div>\n'
            f'<div class="callout__body">{inner}</div></div>'
        )

    return pattern.sub(repl, text)


def slug(s: str) -> str:
    s = re.sub(r"[^\w\s-]", "", s.lower())
    return re.sub(r"[-\s]+", "-", s).strip("-")


def render(md_text: str) -> tuple[str, str]:
    md = markdown.Markdown(
        extensions=["tables", "fenced_code", "sane_lists", "attr_list",
                    TocExtension(permalink=True, toc_depth="2-3")],
        extension_configs={"toc": {"permalink": "§"}},
    )
    body = md.convert(callouts(md_text))
    return body, md.toc


def reading_time(text: str) -> int:
    words = len(re.findall(r"\w+", text))
    return max(1, round(words / 220))


def build() -> None:
    SITE.mkdir(parents=True, exist_ok=True)
    (SITE / "assets").mkdir(exist_ok=True)

    pages = (PAGES
             + [p for p in CHANNEL_PAGES if (DOCS / p[0]).exists()]
             + [p for p in EXTRA_PAGES if (DOCS / p[0]).exists()])
    built = []
    search_index = []

    for filename, num, title, subtitle in pages:
        path = DOCS / filename
        if not path.exists():
            print(f"  ! faltando: {filename}")
            continue
        raw = path.read_text(encoding="utf-8")
        # remove o H1 do topo: ele já é renderizado como título da página
        raw_body = re.sub(r"\A\s*#\s+.*?\n", "", raw, count=1)
        body, toc = render(raw_body)
        out_name = f"{num.lower()}.html" if num != "00" else "meta.html"
        if num == "M":
            out_name = "motor.html"
        mins = reading_time(raw)

        # extrai h1 e subtítulo do primeiro blockquote
        h1 = title
        for line in raw.splitlines():
            if line.startswith("# "):
                h1 = line[2:].strip()
                break

        built.append({
            "num": num, "title": title, "subtitle": subtitle,
            "h1": h1, "file": out_name, "mins": mins,
            "body": body, "toc": toc,
        })
        search_index.append({
            "num": num, "title": title, "file": out_name,
            "text": re.sub(r"\s+", " ", re.sub(r"[#*`>|:]", " ", raw))[:6000],
        })

    # ---------------- páginas de conteúdo
    for i, page in enumerate(built):
        prev_p = built[i - 1] if i > 0 else None
        next_p = built[i + 1] if i + 1 < len(built) else None
        html_out = TEMPLATE.format(
            title=f"{page['title']} · Grok × Canais",
            nav=nav_html(built, page["num"]),
            toc=page["toc"],
            content=page["body"],
            eyebrow=f"DOC {page['num']} · {page['mins']} MIN DE LEITURA",
            h1=html.escape(page["h1"]),
            prev=nav_link(prev_p, "← Anterior") if prev_p else "<span></span>",
            next=nav_link(next_p, "Próximo →") if next_p else "<span></span>",
            year=datetime.now().year,
        )
        (SITE / page["file"]).write_text(html_out, encoding="utf-8")

    # ---------------- home
    cards = "\n".join(
        f'<a class="card" href="{p["file"]}">'
        f'<span class="card__num">{p["num"]}</span>'
        f'<h3>{html.escape(p["title"])}</h3>'
        f'<p>{html.escape(p["subtitle"])}</p>'
        f'<span class="card__meta">{p["mins"]} min →</span></a>'
        for p in built
    )
    (SITE / "index.html").write_text(
        HOME.format(cards=cards, nav=nav_html(built, None), year=datetime.now().year),
        encoding="utf-8",
    )

    (SITE / "search-index.json").write_text(
        json.dumps(search_index, ensure_ascii=False), encoding="utf-8"
    )
    print(f"  site gerado: {len(built)} páginas em {SITE}")


def nav_html(pages, current_num) -> str:
    items = []
    for p in pages:
        active = " active" if p["num"] == current_num else ""
        items.append(
            f'<a class="nav__link{active}" href="{p["file"]}">'
            f'<span class="nav__num">{p["num"]}</span>{html.escape(p["title"])}</a>'
        )
    return "\n".join(items)


def nav_link(page, label) -> str:
    if not page:
        return "<span></span>"
    return (f'<a class="pager__link" href="{page["file"]}">'
            f'<span class="pager__label">{label}</span>'
            f'<span class="pager__title">{html.escape(page["title"])}</span></a>')


TEMPLATE = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="Dossiê operacional multicanal: Grok bot de vendas para affiliate marketing e real estate.">
<link rel="stylesheet" href="assets/style.css">
</head>
<body>
<div class="progress" id="progress"></div>
<header class="topbar">
  <button class="menu-btn" id="menuBtn" aria-label="Menu">☰</button>
  <a class="brand" href="index.html">
    <span class="brand__mark">G</span>
    <span class="brand__text">Grok <span>×</span> Canais</span>
  </a>
  <div class="topbar__right">
    <button class="search-btn" id="searchBtn">Buscar <kbd>/</kbd></button>
  </div>
</header>

<div class="shell">
  <aside class="sidebar" id="sidebar">
    <nav class="nav">
      <span class="nav__label">Dossiê</span>
      {nav}
    </nav>
    <div class="sidebar__foot">
      <p>Dados verificados em nov/2026.<br>Preços de API e regras mudam — reconfira antes de operar.</p>
    </div>
  </aside>

  <main class="main">
    <article class="doc">
      <p class="eyebrow">{eyebrow}</p>
      <h1 class="doc__title">{h1}</h1>
      {content}
    </article>

    <nav class="pager">
      {prev}
      {next}
    </nav>
    <footer class="foot">
      <p>grok-reddit-ops · dossiê operacional · {year}</p>
      <p class="foot__warn">Nenhuma cifra aqui é promessa de resultado. Simulações estão rotuladas como simulações.</p>
    </footer>
  </main>

  <aside class="toc-rail">
    <span class="toc__label">Nesta página</span>
    {toc}
  </aside>
</div>

<div class="search-modal" id="searchModal" hidden>
  <div class="search-box">
    <input id="searchInput" type="search" placeholder="Buscar no dossiê… (ex: CPL, LGPD, janela 24h)" autocomplete="off">
    <div class="search-results" id="searchResults"></div>
  </div>
</div>

<script src="assets/app.js"></script>
</body>
</html>
"""

HOME = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Grok × Canais · dossiê de vendas</title>
<meta name="description" content="Dossiê operacional: como um bot Grok vende em affiliate marketing e real estate no Reddit, X, Instagram, WhatsApp, TikTok, YouTube, LinkedIn, Telegram e Google — com setup técnico, custos e compliance.">
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="home">
<header class="topbar">
  <a class="brand" href="index.html"><span class="brand__mark">G</span><span class="brand__text">Grok <span>×</span> Canais</span></a>
  <div class="topbar__right"><button class="search-btn" id="searchBtn">Buscar <kbd>/</kbd></button></div>
</header>

<section class="hero">
  <p class="eyebrow">DOSSIÊ OPERACIONAL · NOV 2026</p>
  <h1>Como um bot Grok vende no Reddit<br><em>de verdade</em> — em afiliados e imóveis.</h1>
  <p class="hero__sub">Meta-pesquisa da plataforma, dois estudos de mercado com números verificados, as 11 rotas do Reddit, o mapa dos 20 canais, o setup técnico de cada API, o motor em Python e dois pilotos com critério de corte.</p>
  <div class="hero__stats">
    <div><strong>2</strong><span>mercados estudados</span></div>
    <div><strong>20</strong><span>canais mapeados</span></div>
    <div><strong>11</strong><span>rotas do Reddit</span></div>
    <div><strong>US$ 95</strong><span>custo mensal multicanal</span></div>
  </div>
  <div class="hero__cta">
    <a class="btn btn--primary" href="meta.html">Começar pela meta-pesquisa</a>
    <a class="btn" href="c1.html">Ver o mapa dos canais</a>
  </div>
</section>

<section class="grid-wrap">
  <div class="grid">
    {cards}
  </div>
</section>

<section class="thesis">
  <div class="thesis__col">
    <span class="thesis__num">01</span>
    <h2>A tese em uma frase</h2>
    <p>Grok é commodity. O valor está no encanamento entre o modelo e o lugar onde a intenção de compra está escrita — e no fato de que <strong>o humano continua publicando</strong>.</p>
  </div>
  <div class="thesis__col">
    <span class="thesis__num">02</span>
    <h2>O que isso não é</h2>
    <p>Não é fazenda de contas, não é post automático, não é plantar palavra para virar resposta de IA. Cada uma dessas coisas tem retorno decrescente e ban permanente.</p>
  </div>
  <div class="thesis__col">
    <span class="thesis__num">03</span>
    <h2>O número que decide</h2>
    <p>Afiliado: EPC acima de US$ 1 e comissão recorrente. Imobiliário: <strong>78% dos compradores fecham com quem responde primeiro</strong>. Velocidade é o produto.</p>
  </div>
</section>

<footer class="foot foot--home">
  <p>grok-reddit-ops · dossiê operacional · {year}</p>
  <p class="foot__warn">Simulações estão rotuladas. Nenhuma cifra é promessa de resultado.</p>
</footer>

<div class="search-modal" id="searchModal" hidden>
  <div class="search-box">
    <input id="searchInput" type="search" placeholder="Buscar no dossiê…" autocomplete="off">
    <div class="search-results" id="searchResults"></div>
  </div>
</div>
<script src="assets/app.js"></script>
</body>
</html>
"""

if __name__ == "__main__":
    build()
