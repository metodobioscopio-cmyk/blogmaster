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
    # PARTE I — fundamento
    ("00-metapesquisa-grok.md", "00", "O bot", "O que a plataforma faz, quanto custa e qual arquitetura sobrevive", "I"),
    # PARTE II — os dois mercados
    ("01-estudo-afiliados.md", "01", "Estudo 1 · Afiliados", "Unit economics, as 11 rotas e o caminho real até o dólar", "II"),
    ("02-estudo-real-estate.md", "02", "Estudo 2 · Real estate", "Janela dos 5 minutos, Goiânia, EUA e compliance", "II"),
    # PARTE III — os canais
    ("03-mapa-canais.md", "03", "Os 20 canais", "Onde o bot vende, o que é permitido e quanto custa", "III"),
    ("04-rotas-canal.md", "04", "As 11 rotas", "Cada rota no canal onde funciona — e o equivalente em todos", "III"),
    ("05-setup-tecnico.md", "05", "Setup técnico", "As 12 configurações que fazem o bot publicar sem tomar ban", "III"),
    # PARTE IV — operação
    ("06-playbook-grok.md", "06", "Playbook", "Prompts P1–P12, custo e controle de qualidade", "IV"),
    ("07-compliance.md", "07", "Compliance", "Os 6 banimentos reais e a defesa em código", "IV"),
    ("08-custos-roi.md", "08", "Custos & ROI", "CPL, custo por venda e payback por canal", "IV"),
    ("09-case-14-dias.md", "09", "Case · 14 dias", "5 canais, US$ 47 e 9 conversas — o que funcionou", "IV"),
    ("10-plano-90-dias.md", "10", "Plano & piloto", "90 dias, 14 dias e critérios de corte", "IV"),
]

EXTRA_PAGES = [
    ("README-codigo.md", "M", "O motor", "grok-channel-ops: instalação, uso e arquitetura", "IV"),
]

PARTS = {
    "I": ("Parte I", "O fundamento"),
    "II": ("Parte II", "Os dois mercados"),
    "III": ("Parte III", "Os canais"),
    "IV": ("Parte IV", "A operação"),
}

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

    pages = PAGES + [p for p in EXTRA_PAGES if (DOCS / p[0]).exists()]
    built = []
    search_index = []

    for filename, num, title, subtitle, part in pages:
        path = DOCS / filename
        if not path.exists():
            print(f"  ! faltando: {filename}")
            continue
        raw = path.read_text(encoding="utf-8")
        # remove o H1 do topo: ele já é renderizado como título da página
        raw_body = re.sub(r"\A\s*#\s+.*?\n", "", raw, count=1)
        body, toc = render(raw_body)
        out_name = "motor.html" if num == "M" else f"{num}.html"
        mins = reading_time(raw)

        # extrai h1 e subtítulo do primeiro blockquote
        h1 = title
        for line in raw.splitlines():
            if line.startswith("# "):
                h1 = line[2:].strip()
                break

        built.append({
            "num": num, "title": title, "subtitle": subtitle, "part": part,
            "h1": h1, "file": out_name, "mins": mins,
            "body": body, "toc": toc,
        })
        search_index.append({
            "num": num, "title": title, "file": out_name, "part": part,
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
    items, last_part = [], None
    for p in pages:
        part = p.get("part")
        if part != last_part and part in PARTS:
            label, name = PARTS[part]
            items.append(
                f'<span class="nav__part"><em>{label}</em>{html.escape(name)}</span>'
            )
            last_part = part
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
<title>Grok × Canais · dossiê de vendas em 20 canais</title>
<meta name="description" content="Dossiê operacional: como um bot Grok vende em affiliate marketing e real estate no Reddit, X, Instagram, WhatsApp, Facebook, TikTok, YouTube, LinkedIn, Telegram, Threads, Bluesky, Nextdoor e Google — com setup técnico, custos e compliance.">
<link rel="stylesheet" href="assets/style.css">
</head>
<body class="home">
<header class="topbar">
  <a class="brand" href="index.html"><span class="brand__mark">G</span><span class="brand__text">Grok <span>×</span> Canais</span></a>
  <div class="topbar__right"><button class="search-btn" id="searchBtn">Buscar <kbd>/</kbd></button></div>
</header>

<section class="hero">
  <p class="eyebrow">DOSSIÊ OPERACIONAL · 20 CANAIS · NOV 2026</p>
  <h1>Como um bot Grok vende<br><em>em qualquer canal</em> — sem perder a conta.</h1>
  <p class="hero__sub">Dois mercados (afiliados e imóveis), 20 canais mapeados, os 12 setups que fazem o bot publicar, a matemática do CPL por canal e o validador em código que bloqueia ban antes de acontecer.</p>
  <div class="hero__stats">
    <div><strong>20</strong><span>canais mapeados</span></div>
    <div><strong>2</strong><span>mercados estudados</span></div>
    <div><strong>11</strong><span>rotas de venda</span></div>
    <div><strong>12</strong><span>setups técnicos</span></div>
  </div>
  <div class="hero__cta">
    <a class="btn btn--primary" href="03.html">Começar pelo mapa dos canais</a>
    <a class="btn" href="00.html">Entender o bot primeiro</a>
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
    <p>Não é DM frio, não é auto-connect no LinkedIn, não é postar em grupo de Facebook. Cada uma dessas coisas é <strong>impossível ou ban</strong> — não é questão de opinião.</p>
  </div>
  <div class="thesis__col">
    <span class="thesis__num">03</span>
    <h2>O número que decide</h2>
    <p>O canal que fecha é a <strong>conversa</strong>, e ela tem janela: 24h no WhatsApp e no Direct. Quem responde dentro dela converte <strong>2–3× mais</strong>.</p>
  </div>
</section>

<section class="matrix-strip">
  <h2>Os 20 canais, em uma linha cada</h2>
  <div class="matrix-scroll">
  <table>
    <thead><tr><th>Canal</th><th>Publica</th><th>DM</th><th>Janela</th><th>Custo de entrada</th><th>Risco</th></tr></thead>
    <tbody>
      <tr><td>Reddit</td><td>sim</td><td>não</td><td>—</td><td>grátis (API oficial)</td><td class="r-alto">alto</td></tr>
      <tr><td>X / Twitter</td><td>sim</td><td>sim</td><td>—</td><td>US$ 0,015/post</td><td class="r-medio">médio</td></tr>
      <tr><td>Instagram</td><td>sim</td><td>só inbound</td><td>24h</td><td>grátis</td><td class="r-critico">crítico</td></tr>
      <tr><td>Facebook Page</td><td>sim</td><td>só inbound</td><td>24h</td><td>grátis</td><td class="r-critico">crítico</td></tr>
      <tr><td>Facebook Groups</td><td class="r-critico">não</td><td class="r-critico">não</td><td>—</td><td class="r-critico">API extinta</td><td class="r-critico">crítico</td></tr>
      <tr><td>WhatsApp</td><td>template</td><td>sim</td><td>24h</td><td>R$ 0,3217/msg</td><td class="r-critico">crítico</td></tr>
      <tr><td>TikTok</td><td>sim (audit)</td><td>restrito</td><td>—</td><td>grátis</td><td class="r-alto">alto</td></tr>
      <tr><td>YouTube</td><td>sim</td><td>não</td><td>—</td><td>grátis (cota)</td><td class="r-medio">médio</td></tr>
      <tr><td>LinkedIn</td><td>só feed</td><td class="r-critico">proibido</td><td>—</td><td>grátis</td><td class="r-critico">crítico</td></tr>
      <tr><td>Threads</td><td>sim</td><td>sim</td><td>—</td><td>grátis</td><td class="r-baixo">baixo</td></tr>
      <tr><td>Bluesky</td><td>sim</td><td>sim</td><td>—</td><td>grátis</td><td class="r-baixo">baixo</td></tr>
      <tr><td>Telegram</td><td>sim</td><td>sim</td><td>—</td><td>grátis</td><td class="r-baixo">baixo</td></tr>
      <tr><td>Google Business</td><td>sim</td><td>não</td><td>—</td><td>grátis</td><td class="r-baixo">baixo</td></tr>
      <tr><td>Nextdoor</td><td>sim</td><td>limitado</td><td>—</td><td>US$ 30–150/ZIP</td><td class="r-medio">médio</td></tr>
      <tr><td>E-mail</td><td>sim</td><td>—</td><td>—</td><td>US$ 0,05/lead</td><td class="r-alto">alto</td></tr>
    </tbody>
  </table>
  </div>
  <p class="matrix__foot">A matriz completa, com janela, limite e o que o bot pode fazer em cada um, está em <a href="03.html">Os 20 canais</a>. Os limites estão implementados em <code>src/channels.py</code>.</p>
</section>

<section class="thesis">
  <div class="thesis__col">
    <span class="thesis__num">04</span>
    <h2>Comece por onde o erro custa menos</h2>
    <p>Telegram e Reddit permitem errar por texto público. WhatsApp e Meta punem com <strong>restrição de conta</strong>. A ordem de entrada não é preferência — é gestão de risco.</p>
  </div>
  <div class="thesis__col">
    <span class="thesis__num">05</span>
    <h2>Mídia só com ticket alto</h2>
    <p>Custo por venda em qualquer canal pago: <strong>US$ 1.600–2.600</strong>. Comissão de afiliado de US$ 99 não paga isso. Comissão de R$ 40 mil de imóvel paga 20 vezes.</p>
  </div>
  <div class="thesis__col">
    <span class="thesis__num">06</span>
    <h2>O que sobrevive é o ativo</h2>
    <p>Uma conta de 5 anos vale mais que uma campanha de 3 dias. <strong>Todo canal tem um teto técnico e um teto de tolerância</strong> — opere a 30% do primeiro.</p>
  </div>
</section>

<footer class="foot foot--home">
  <p>grok-channel-ops · dossiê operacional · {year}</p>
  <p class="foot__warn">Simulações estão rotuladas. Nenhuma cifra é promessa de resultado. Regras e preços verificados em nov/2026 — reconfira antes de operar.</p>
</footer>

<div class="search-modal" id="searchModal" hidden>
  <div class="search-box">
    <input id="searchInput" type="search" placeholder="Buscar no dossiê… (ex: CPL, janela 24h, LGPD)" autocomplete="off">
    <div class="search-results" id="searchResults"></div>
  </div>
</div>
<script src="assets/app.js"></script>
</body>
</html>
"""

if __name__ == "__main__":
    build()
