#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Growth Design Pro — área de membros em inglês.

A área em português (`site/area/index.html`) é escrita à mão. Esta versão em
inglês é gerada porque as 28 aulas precisam ficar idênticas, em número e em
ordem, às da página de vendas — e é fácil as duas divergirem quando alguém move
uma aula de lugar.

Fonte dos dados: as aulas da própria página de vendas em inglês
(`site/en/index.html`). Se a página de vendas mudar, rode este script de novo.

Uso, a partir da raiz do repositório:

    python3 tools/gerar_area_en.py

Dependências: nenhuma (só a biblioteca padrão).
"""

from __future__ import annotations

import html as _html
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITE = RAIZ / "site"
VENDA_EN = SITE / "en" / "index.html"
SAIDA = SITE / "en" / "area" / "index.html"

# Materiais bilíngues liberados para o aluno (o kit é o mesmo para os dois idiomas).
MATERIAIS_POR_AULA = {
    "1.1": [("../../area/materiais/#biblioteca", "Funnel map")],
    "1.2": [("../../area/materiais/kit/prompts/prompts-en.md", "Prompt 01–06")],
    "1.3": [("../../area/materiais/kit/templates/design-system-starter-kit/index.html", "tokens.css")],
    "1.4": [("../../area/materiais/kit/checklists/", "Funnel map")],
    "2.1": [("../../area/materiais/kit/planilhas/analise-seo.xlsx", "SEO sheet")],
    "2.2": [("../../area/materiais/kit/checklists/checklist-seo-onpage.md", "On-page checklist")],
    "2.3": [("../../area/materiais/kit/checklists/checklist-conversao.md", "Conversion checklist")],
    "2.4": [("../../area/materiais/kit/prompts/prompts-en.md", "Prompts 13–20")],
    "2.5": [("../../area/materiais/kit/templates/landing-page-template/index.html", "LP template")],
    "2.6": [("../../area/materiais/kit/planilhas/calendario-social.xlsx", "Social calendar")],
    "3.1": [("../../area/materiais/kit/prompts/prompts-en.md", "Prompts 07–12")],
    "3.2": [("../../area/materiais/kit/prompts/prompts-en.md", "Prompts 13–20")],
    "3.3": [("../../area/materiais/kit/checklists/checklist-conversao.md", "Conversion checklist")],
    "3.4": [("../../area/materiais/kit/planilhas/calendario-social.xlsx", "Social calendar")],
    "3.5": [("../../area/materiais/kit/planilhas/calculadora-roi.xlsx", "ROI calculator")],
    "4.1": [("../../area/materiais/kit/checklists/checklist-configuracao-rapidapi.md", "RapidAPI checklist")],
    "4.2": [("../../area/materiais/kit/integracoes/", "Integrations")],
    "4.3": [("../../area/materiais/kit/codigo/", "Code clients")],
    "4.4": [("../../area/materiais/kit/prompts/prompts-en.md", "Prompts 33–38")],
    "4.5": [("../../area/materiais/kit/planilhas/growth-dashboard.xlsx", "Dashboard")],
    "5.1": [("../../area/materiais/kit/planilhas/calculadora-roi.xlsx", "ROI calculator")],
    "5.2": [("../../area/materiais/kit/templates/design-system-starter-kit/index.html", "Starter kit")],
    "5.3": [("../../area/materiais/kit/prompts/prompts-en.md", "Prompts 39–46")],
    "5.4": [("../../area/materiais/kit/integracoes/README.md", "Integrations guide")],
    "6.1": [("../../area/materiais/kit/prompts/prompts-en.md", "Prompt library")],
    "6.2": [("../../area/materiais/kit/planilhas/", "Spreadsheets")],
    "6.3": [("../../area/materiais/kit/templates/", "Templates")],
    "6.4": [("../../area/materiais/playbook-en.html", "Read online")],
}

META_M6 = "4 lessons · 24 min"


def extrair_modulos() -> list[dict]:
    texto = VENDA_EN.read_text(encoding="utf-8")
    modulos = []
    for bloco in re.split(r'class="gdp-module"', texto)[1:]:
        numero = re.search(r'gdp-module__num">([^<]+)<', bloco).group(1)
        titulo = re.search(r'gdp-module__title">([^<]+)<', bloco).group(1)
        meta = re.search(r'gdp-module__meta">([^<]+)<', bloco).group(1).strip()
        if numero.strip().endswith("06"):
            meta = META_M6
        aulas = re.findall(
            r'gdp-lesson__id">([\d.]+)<.*?gdp-lesson__title">([^<]+)<.*?gdp-lesson__desc">([^<]+)<',
            bloco, re.S)
        modulos.append(dict(
            numero=numero.strip(), titulo=_html.unescape(titulo), meta=meta,
            aulas=[dict(id=i, titulo=_html.unescape(t), desc=_html.unescape(d.strip()))
                   for i, t, d in aulas],
        ))
    return modulos


def linha_aula(aula: dict) -> str:
    acoes = ['<a class="area-chip area-chip--soon" href="#materials" title="Video placeholder">[VIDEO]</a>']
    for href, rotulo in MATERIAIS_POR_AULA.get(aula["id"], []):
        acoes.append(f'<a class="area-chip" href="{href}">{rotulo}</a>')
    return f"""      <li class="area-lesson"><span class="area-lesson__id">{aula['id']}</span>
        <div><div class="area-lesson__title">{aula['titulo']}</div>
        <div class="area-lesson__desc">{aula['desc']}</div></div>
        <div class="area-lesson__actions">{''.join(acoes)}</div>
      </li>"""


def bloco_modulo(modulo: dict, primeiro: bool) -> str:
    aulas = "\n".join(linha_aula(a) for a in modulo["aulas"])
    classes = "section section--tight" + ("" if primeiro else " section--ruled")
    return f"""<section class="{classes}">
  <div class="shell">
    <div class="filete reveal">
      <span class="filete__num">{modulo['numero']}</span>
      <span class="filete__label">{modulo['titulo']}</span>
      <span class="filete__rule" aria-hidden="true"></span>
      <span class="filete__num">{modulo['meta'].split('·')[-1].strip()}</span>
    </div>
    <ul>
{aulas}
    </ul>
  </div>
</section>"""


def gerar() -> Path:
    modulos = extrair_modulos()
    total = sum(len(m["aulas"]) for m in modulos)
    if total != 28:
        raise SystemExit(f"ERRO: esperava 28 lessons, encontrei {total}. "
                         "Confira as aulas em site/en/index.html.")

    corpo = "\n\n".join(bloco_modulo(m, i == 0) for i, m in enumerate(modulos))

    html = f"""<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Members Area — Growth Design Pro</title>
<meta name="description" content="Growth Design Pro members area: 6 modules, 28 lessons, downloadable materials and the complete tool kit.">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0F0F0D">
<link rel="icon" href="../../assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../../assets/css/tokens.css">
<link rel="stylesheet" href="../../assets/css/base.css">
<link rel="stylesheet" href="../../assets/css/components.css">
<style>
  /* Members-area specific styles — outside the public design system on purpose. */
  .area-head {{ border-bottom: 1px solid var(--rule); padding-block: var(--s-8) var(--s-7); }}
  .area-progress {{ height: 6px; background: var(--paper-3); position: relative; overflow: hidden; margin-top: var(--s-5); }}
  .area-progress__fill {{ position: absolute; inset: 0 auto 0 0; width: 0%; background: var(--gold); }}
  .area-lesson {{ display: grid; grid-template-columns: 3.5rem minmax(0,1fr) auto; gap: var(--s-5); align-items: center; padding: var(--s-4) 0; border-bottom: 1px dotted var(--rule); }}
  .area-lesson:last-child {{ border-bottom: 0; }}
  .area-lesson__id {{ font-family: var(--font-mono); font-size: var(--fs-caption); color: var(--gold); }}
  .area-lesson__title {{ font-weight: 600; }}
  .area-lesson__desc {{ font-size: var(--fs-caption); color: var(--ink-2); max-width: 62ch; }}
  .area-lesson__actions {{ display: flex; gap: var(--s-2); flex-wrap: wrap; justify-content: flex-end; }}
  .area-chip {{ font-family: var(--font-mono); font-size: .6875rem; letter-spacing: .06em; text-transform: uppercase; border: 1px solid var(--rule); padding: .35rem .6rem; color: var(--ink-2); white-space: nowrap; }}
  .area-chip:hover {{ border-color: var(--gold-line); color: var(--ink); }}
  .area-chip--soon {{ color: var(--ink-3); border-style: dashed; }}
  .area-note {{ border: 1px solid var(--gold-line); background: var(--paper-card); padding: var(--s-6); font-size: var(--fs-small); }}
  @media (max-width: 720px) {{
    .area-lesson {{ grid-template-columns: 2.5rem minmax(0,1fr); }}
    .area-lesson__actions {{ grid-column: 1 / -1; justify-content: flex-start; }}
  }}
</style>
</head>
<body>
<a class="skip-link" href="#content">Skip to content</a>

<header class="gdp-nav" data-nav>
  <div class="shell gdp-nav__inner">
    <a class="gdp-brand" href="../" aria-label="Growth Design Pro — home">
      <span class="gdp-brand__mark" aria-hidden="true">G</span>
      <span class="gdp-brand__text">
        <span class="gdp-brand__name">Growth Design Pro</span>
        <span class="gdp-brand__sub">Members area · EN</span>
      </span>
    </a>
    <div class="gdp-nav__right">
      <a class="gdp-lang" href="../../area/" hreflang="pt-BR" lang="pt-BR">PT</a>
      <a class="gdp-btn gdp-btn--sm" href="../#offer">Review the offer</a>
    </div>
  </div>
</header>

<main id="content">

<div class="area-head">
  <div class="shell">
    <span class="eyebrow">Cohort 01 · lifetime access</span>
    <h1 class="h1 mt-5">Welcome to<br>Growth Design Pro.</h1>
    <p class="lead mt-6">Start with Module 1 and follow the order. Every lesson ends with a downloadable
    artifact — the course only works if the material leaves the video and becomes a file on your computer.</p>

    <div class="area-note mt-7" style="max-width:56ch">
      <strong>Language note.</strong> The video lessons are recorded in Brazilian Portuguese with English
      subtitles. The tool kit, the Prompt Library and the Playbook ship in English as well — everything
      linked from this page is available in English.
    </div>

    <div class="mt-7" style="max-width:36rem">
      <div style="display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:var(--fs-eyebrow);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3)">
        <span>Your progress</span><span>0 of {total} lessons</span>
      </div>
      <div class="area-progress" role="img" aria-label="Progress: 0 percent"><div class="area-progress__fill"></div></div>
      <p style="font-size:var(--fs-caption);color:var(--ink-3);margin-top:var(--s-3)">
        Each lesson has two shortcuts: <strong>[VIDEO]</strong> opens the recording and the chip beside it
        downloads that lesson's artifact. Every file is also gathered in
        <a class="gdp-link" href="../../area/materiais/">materials</a>.
      </p>
    </div>
  </div>
</div>

<section class="section section--tight">
  <div class="shell">
    <div class="area-note reveal" style="border-color:var(--rule)">
      <strong>Before your first API call:</strong> subscribe to the six APIs in your own RapidAPI account
      (the course does not include API access) and keep the key in an environment variable — never in page
      source. Cost, limits and the 403/429 error table are in
      <a class="gdp-link" href="../../area/materiais/kit/checklists/checklist-configuracao-rapidapi.md">the RapidAPI checklist</a>.
    </div>
  </div>
</section>

{corpo}

<section class="section theme-night" id="materials">
  <div class="shell">
    <div class="filete reveal">
      <span class="filete__num">MODULE 06</span>
      <span class="filete__label">Resource library</span>
      <span class="filete__rule" aria-hidden="true"></span>
      <span class="filete__num">Downloads</span>
    </div>

    <h2 class="h2 mt-6 reveal" style="color:var(--ink)">Everything you can download today.</h2>

    <div class="gdp-kit mt-9">
      <article class="gdp-kit__item reveal" style="background:var(--night-2);border-color:var(--night-line)">
        <h3 class="gdp-kit__name">Golden Prompt Library</h3>
        <p class="gdp-kit__desc">52 prompts in English and Portuguese: design-system extraction, diagnostics, copy, social, agents and the honesty audit.</p>
        <div class="gdp-kit__fmt"><a href="../../area/materiais/kit/prompts/prompts-en.md" class="gdp-link">download .md (EN)</a></div>
      </article>
      <article class="gdp-kit__item reveal" data-reveal-delay="40" style="background:var(--night-2);border-color:var(--night-line)">
        <h3 class="gdp-kit__name">Working spreadsheets</h3>
        <p class="gdp-kit__desc">SEO analysis, social calendar, ROI calculator and the Growth Stack Dashboard — formulas ready.</p>
        <div class="gdp-kit__fmt"><a href="../../area/materiais/kit/planilhas/" class="gdp-link">open folder</a></div>
      </article>
      <article class="gdp-kit__item reveal" data-reveal-delay="80" style="background:var(--night-2);border-color:var(--night-line)">
        <h3 class="gdp-kit__name">Growth Design Playbook</h3>
        <p class="gdp-kit__desc">The full method in text, 12 chapters in funnel order, in English and Portuguese.</p>
        <div class="gdp-kit__fmt"><a href="../../area/materiais/playbook-en.html" class="gdp-link">read online</a></div>
      </article>
      <article class="gdp-kit__item reveal" data-reveal-delay="120" style="background:var(--night-2);border-color:var(--night-line)">
        <h3 class="gdp-kit__name">Templates and integrations</h3>
        <p class="gdp-kit__desc">Landing page template, automation blueprints and the JS/Python clients for the six APIs.</p>
        <div class="gdp-kit__fmt"><a href="../../area/materiais/kit/templates/" class="gdp-link">open folder</a></div>
      </article>
      <article class="gdp-kit__item reveal" data-reveal-delay="160" style="background:var(--night-2);border-color:var(--night-line)">
        <h3 class="gdp-kit__name">Design System Starter Kit</h3>
        <p class="gdp-kit__desc">10 original systems in CSS tokens, each with a demo page and the origin of every variable documented.</p>
        <div class="gdp-kit__fmt"><a href="../../area/materiais/kit/templates/design-system-starter-kit/index.html" class="gdp-link">open folder</a></div>
      </article>
      <article class="gdp-kit__item reveal" data-reveal-delay="200" style="background:var(--night-2);border-color:var(--night-line)">
        <h3 class="gdp-kit__name">Checklists</h3>
        <p class="gdp-kit__desc">Conversion, on-page SEO, RapidAPI setup and publishing — short lists that prevent expensive mistakes.</p>
        <div class="gdp-kit__fmt"><a href="../../area/materiais/kit/checklists/" class="gdp-link">open folder</a></div>
      </article>
    </div>

    <p class="mt-8" style="font-size:var(--fs-caption);color:var(--on-night-2);max-width:70ch">
      Licence: use in your own and client projects, including commercial ones. Reselling or redistributing
      the kit is not allowed — see the
      <a class="gdp-link" href="../../legal/licenca.html">toolkit licence</a>. Support:
      <a class="gdp-link" href="mailto:hello@growthdesignpro.com">hello@growthdesignpro.com</a>.
    </p>
  </div>
</section>

</main>

<footer class="gdp-footer theme-night">
  <div class="shell">
    <div class="gdp-footer__bottom">
      <span>© 2026 Growth Design Pro · v1.0</span>
      <span><a class="gdp-link" href="../">Back to home</a> · <a class="gdp-link" href="../../area/">Versão em português</a></span>
    </div>
    <p class="gdp-footer__legal">Teaching material. Results vary by market, offer and execution — no tool
    guarantees traffic, ranking or revenue. RapidAPI subscriptions are purchased by you, in your own
    account. Growth Design Pro is not affiliated with RapidAPI.</p>
  </div>
</footer>

<script src="../../assets/js/main.js" defer></script>
</body>
</html>
"""
    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text(html, encoding="utf-8")
    return SAIDA


if __name__ == "__main__":
    destino = gerar()
    print(f"  ✓ {destino.relative_to(RAIZ)} — 28 lessons, {destino.stat().st_size // 1024} KB")
