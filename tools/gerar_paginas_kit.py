#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Growth Design Pro — gerador das páginas públicas do Kit e do E-book.

Emite quatro páginas estáticas, sempre em par PT-BR / EN:

    site/kit/index.html          site/en/kit/index.html
    site/ebook/index.html        site/en/ebook/index.html

Por que um gerador: as duas versões de idioma precisam ficar idênticas em
estrutura (mesmos ids, mesmos links internos, mesmos nomes de arquivo do kit).
Editar o HTML gerado é perda de tempo — o script sobrescreve. Edite aqui.

Uso, a partir da raiz do repositório:

    python3 tools/gerar_paginas_kit.py

Dependências: nenhuma (só a biblioteca padrão).
"""

from __future__ import annotations

from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITE = RAIZ / "site"

# ---------------------------------------------------------------------------
# Dados do kit: uma fonte só para os dois idiomas.
# ---------------------------------------------------------------------------

SISTEMAS = [
    ("01", "Editorial Papel",    "arejado", "1.25", "8px", "Revistas, portfólios, publicações independentes."),
    ("02", "SaaS Claro",         "médio",   "1.20", "4px", "Produtos digitais que precisam parecer simples."),
    ("03", "Noite Dourada",      "arejado", "1.28", "8px", "Marcas de prestígio, consultorias, alto ticket."),
    ("04", "Técnico Mono",       "denso",   "1.15", "4px", "Documentação, APIs, ferramentas para devs."),
    ("05", "Terroso Artesanal",  "médio",   "1.22", "8px", "Marcas autorais, comida, artesanato, turismo."),
    ("06", "Corporativo Sólido", "médio",   "1.20", "8px", "Serviços B2B, jurídico, contabilidade, saúde."),
    ("07", "Neon Controlado",    "denso",   "1.22", "4px", "Eventos, games, música, cultura jovem."),
    ("08", "Minimal Suíço",      "arejado", "1.33", "8px", "Estúdios, arquitetura, design, fotografia."),
    ("09", "Serviço Local",      "denso",   "1.25", "8px", "Clínicas, oficinas, salões, comércio de bairro."),
    ("10", "Publicação Cultural","arejado", "1.28", "8px", "Museus, festivais, projetos com apoio/incentivo."),
]

PROMPTS = [
    ("§1", "01–06", "Extração de design system",
     "Sistema completo, paleta com teste de contraste, escala tipográfica fluida, ritmo de espaçamento, movimento e tom de voz."),
    ("§2", "07–12", "Diagnóstico",
     "Nota de SEO com plano de 30 dias, comparação com concorrente, priorização de CRO, auditoria de formulário, sinais de confiança, relatório para cliente."),
    ("§3", "13–20", "Conteúdo e copy",
     "Title e meta em escala, página inteira a partir do diagnóstico, ângulos de headline, reescrita por intenção de busca, CTA, microcopy, captura de e-mail, biblioteca de conteúdo."),
    ("§4", "21–26", "Landing page",
     "Primeira dobra, reestruturação do caminho, plano de teste com ressalva de amostra, quebra de objeções, queda no meio da página, comparação com concorrente."),
    ("§5", "27–32", "Social",
     "X, LinkedIn, Instagram, calendário de 30 dias, um conteúdo para quatro plataformas, reciclagem do que performou."),
    ("§6", "33–38", "Agentes",
     "Prompt de sistema com 6 regras invioláveis, pipeline das 6 APIs na ordem do funil, revisor com veredito, triagem de falha de API, revisão de plano, aprendizados de projeto."),
    ("§7", "39–46", "Estratégia",
     "Proposta comercial, precificação por valor, briefing, plano de 90 dias, escopo e limites, oferta recorrente, discurso em três camadas, objeção “já uso ChatGPT”."),
    ("§8", "47–52", "Qualidade e conformidade",
     "Auditoria de honestidade (CONAR/FTC), acessibilidade, SEO técnico, crítica de saída de IA, reescrita por legibilidade, veredito antes de publicar."),
]

CHECKLISTS = [
    ("Conversão", "9 blocos. Mede o que dá para medir e avisa quando o volume ainda é ruído (abaixo de 1.000 visitas/mês)."),
    ("SEO on-page", "7 blocos e uma tabela de decisão: o que corrigir primeiro quando tudo parece urgente."),
    ("Configuração da RapidAPI", "7 blocos, tabela de custo, erros 403/429, 200 vazio, JSON escapado, mudança silenciosa de contrato."),
    ("Publicação", "Bloqueadores antes de tudo: promessa que não dá para provar, depoimento sem autorização, política ausente, chave de API no código da página."),
]

PLANILHAS = [
    ("analise-seo.xlsx", "Nota por dimensão, plano de ação e comparação antes/depois."),
    ("growth-dashboard.xlsx", "KPIs por página, incluindo custo por página — o número que ninguém calcula."),
    ("calendario-social.xlsx", "Regra 70/20/10: 70% útil, 20% prova, 10% oferta."),
    ("calculadora-roi.xlsx", "Multiplicadores 1,15× / 1,40× / 1,75×. O cenário conservador é o único apresentável a cliente."),
]

INTEGRACOES = [
    ("n8n", "funil-growth-stack.json", "Workflow de 9 nós, importável. É a opção recomendada para quem atende vários clientes."),
    ("Make", "blueprint-funil.json", "Especificação legível + esqueleto de importação."),
    ("Zapier", "RECEITA.md", "Receita de montagem manual, passo a passo, com as limitações declaradas."),
]

# ---------------------------------------------------------------------------
# Blocos compartilhados (chrome)
# ---------------------------------------------------------------------------

def chrome_head(lang: str, assets: str, titulo: str, descricao: str, alt_href: str, canonical: str) -> str:
    outro = "en" if lang == "pt-BR" else "pt-BR"
    hreflang = "en" if lang == "pt-BR" else "pt-BR"
    return f"""<!DOCTYPE html>
<html lang="{lang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo}</title>
<meta name="description" content="{descricao}">
<meta name="theme-color" content="#0F0F0D">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="{outro}" href="{alt_href}">
<link rel="icon" href="{assets}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{assets}assets/css/tokens.css">
<link rel="stylesheet" href="{assets}assets/css/base.css">
<link rel="stylesheet" href="{assets}assets/css/components.css">
<meta property="og:type" content="website">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{descricao}">
<meta property="og:image" content="https://growthdesignpro.com.br/assets/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
</head>
<body>
<div class="gdp-progress" data-progress aria-hidden="true"></div>
<a class="skip-link" href="#conteudo">{'Pular para o conteúdo' if lang == 'pt-BR' else 'Skip to content'}</a>
"""


def chrome_nav(lang: str, casa: str, alt_href: str, rotulo_alt: str) -> str:
    if lang == "pt-BR":
        links = [("stack", "O Stack"), ("funil", "O Funil"), ("modulos", "Conteúdo"), ("kit", "Ferramentas"), ("faq", "Dúvidas")]
        cta, cta_marca = "Quero acesso", "Growth Design Pro"
        ancora_oferta = "oferta"
        sub = "Sistema de 6 APIs"
        aria_pagina = "Seções da página inicial"
        rotulo_home = "Growth Design Pro — início"
    else:
        links = [("stack", "The Stack"), ("funnel", "The Funnel"), ("curriculum", "Curriculum"), ("toolkit", "Tool kit"), ("faq", "FAQ")]
        cta, cta_marca = "Get access", "Growth Design Pro"
        ancora_oferta = "offer"
        sub = "6-API system"
        aria_pagina = "Home page sections"
        rotulo_home = "Growth Design Pro — home"

    itens = "\n      ".join(
        f'<a class="gdp-nav__link" href="{casa}#{i}">{t}</a>' for i, t in links
    )
    return f"""<header class="gdp-nav" data-nav>
  <div class="shell gdp-nav__inner">
    <a class="gdp-brand" href="{casa}" aria-label="{rotulo_home}">
      <span class="gdp-brand__mark" aria-hidden="true">G</span>
      <span class="gdp-brand__text">
        <span class="gdp-brand__name">{cta_marca}</span>
        <span class="gdp-brand__sub">{sub}</span>
      </span>
    </a>
    <nav class="gdp-nav__links" aria-label="{aria_pagina}">
      {itens}
    </nav>
    <div class="gdp-nav__right">
      <a class="gdp-lang" href="{alt_href}" hreflang="{'en' if lang == 'pt-BR' else 'pt-BR'}" lang="{'en' if lang == 'pt-BR' else 'pt-BR'}">{rotulo_alt}</a>
      <a class="gdp-btn gdp-btn--sm" href="{casa}#{ancora_oferta}">{cta}</a>
    </div>
  </div>
</header>
"""


def chrome_footer(lang: str, casa: str, raiz: str, home: str, assets: str) -> str:
    if lang == "pt-BR":
        titulo_produto, titulo_curso, titulo_legal = "Produto", "Recursos", "Contato e legal"
        itens_produto = [
            (f"{casa}#stack", "As 6 APIs"),
            (f"{casa}#modulos", "6 módulos · 28 aulas"),
            (f"{raiz}area/", "Área de membros"),
        ]
        itens_curso = [
            (f"{casa}kit/", "Kit de ferramentas"),
            (f"{casa}ebook/", "E-book Playbook"),
            (f"{raiz}legal/licenca.html", "Licença do kit"),
        ]
        itens_legal = [
            ("mailto:contato@growthdesignpro.com.br", "contato@growthdesignpro.com.br"),
            (f"{raiz}legal/termos.html", "Termos de uso"),
            (f"{raiz}legal/privacidade.html", "Política de privacidade"),
        ]
        legal = ("Resultados variam conforme mercado, oferta e execução. Nenhuma ferramenta garante tráfego, "
                 "ranking ou faturamento. As assinaturas da RapidAPI são contratadas por você, na sua conta — "
                 "o curso não inclui acesso às APIs. Growth Design Pro não é afiliado à RapidAPI.")
        voltar = "Voltar ao início"
    else:
        titulo_produto, titulo_curso, titulo_legal = "Product", "Resources", "Contact &amp; legal"
        itens_produto = [
            (f"{casa}#stack", "The six APIs"),
            (f"{casa}#curriculum", "6 modules · 28 lessons"),
            (f"{raiz}area/", "Members area"),
        ]
        itens_curso = [
            (f"{casa}kit/", "Tool kit"),
            (f"{casa}ebook/", "Playbook e-book"),
            (f"{raiz}legal/licenca.html", "Toolkit licence"),
        ]
        itens_legal = [
            ("mailto:hello@growthdesignpro.com", "hello@growthdesignpro.com"),
            (f"{raiz}legal/terms.html", "Terms of use"),
            (f"{raiz}legal/privacy.html", "Privacy policy"),
        ]
        legal = ("Results vary by market, offer and execution. No tool guarantees traffic, ranking or revenue. "
                 "RapidAPI subscriptions are purchased by you, in your own account — the course does not include "
                 "API access. Growth Design Pro is not affiliated with RapidAPI.")
        voltar = "Back to home"

    def lista(itens):
        return "\n          ".join(f'<li><a href="{u}">{t}</a></li>' for u, t in itens)

    return f"""<footer class="gdp-footer theme-night">
  <div class="shell">
    <div class="gdp-footer__grid">
      <div>
        <div style="display:flex;align-items:center;gap:var(--s-3);margin-bottom:var(--s-5)">
          <span class="gdp-brand__mark" aria-hidden="true" style="border-color:rgba(201,164,76,.34);color:var(--gold-bright)">G</span>
          <span style="font-family:var(--font-display);font-size:1.125rem">Growth Design Pro</span>
        </div>
        <a class="gdp-link" href="{home}">{voltar}</a>
      </div>
      <div>
        <h2 class="gdp-footer__title">{titulo_produto}</h2>
        <ul class="gdp-footer__list">
          {lista(itens_produto)}
        </ul>
      </div>
      <div>
        <h2 class="gdp-footer__title">{titulo_curso}</h2>
        <ul class="gdp-footer__list">
          {lista(itens_curso)}
        </ul>
      </div>
      <div>
        <h2 class="gdp-footer__title">{titulo_legal}</h2>
        <ul class="gdp-footer__list">
          {lista(itens_legal)}
        </ul>
      </div>
    </div>
    <div class="gdp-footer__bottom">
      <span>© 2026 Growth Design Pro · v1.0</span>
      <span>{'Conteúdo original, escrito para este produto.' if lang == 'pt-BR' else 'Original content, written for this product.'}</span>
    </div>
    <p class="gdp-footer__legal">{legal}</p>
  </div>
</footer>

<script src="{assets}assets/js/main.js" defer></script>
</body>
</html>
"""


def filete(num: str, rotulo: str, extra: str = "") -> str:
    return f"""<div class="filete reveal">
      <span class="filete__num">{num}</span>
      <span class="filete__label">{rotulo}</span>
      <span class="filete__rule" aria-hidden="true"></span>
      {f'<span class="filete__num">{extra}</span>' if extra else ''}
    </div>"""


# ---------------------------------------------------------------------------
# Página do kit
# ---------------------------------------------------------------------------

def corpo_kit(lang: str, casa: str, raiz: str) -> str:
    if lang == "pt-BR":
        eyebrow = "Kit de ferramentas"
        h1 = "O kit que transforma o curso em operação."
        lead = ("Tudo o que vem junto com o Growth Design Pro — e que você usa no cliente, não só na aula. "
                "Cada peça abaixo existe para uma etapa específica do funil, na ordem em que ela é executada.")
        numeros = [("52", "prompts"), ("4", "checklists"), ("4", "planilhas"), ("2", "clientes de código"),
                   ("3", "integrações"), ("10", "design systems"), ("12+1", "capítulos"), ("1", "template de LP")]
        grid_titulo = "Oito famílias de material"
        grid = [
            ("01", "Golden Prompt Library", "52 prompts em 8 blocos: da extração do design system à auditoria de honestidade antes de publicar. Em PT-BR e EN.", "#prompts", "52 arquivos .md"),
            ("02", "Checklists de execução", "Quatro listas curtas que impedem erro caro: conversão, SEO on-page, configuração da RapidAPI e publicação.", "#checklists", "4 arquivos .md"),
            ("03", "Planilhas de trabalho", "Análise de SEO, dashboard, calendário social e calculadora de ROI — com fórmulas, validações e formatação condicional prontas.", "#planilhas", "4 .xlsx"),
            ("04", "Clientes de código", "O funil das 6 APIs em JavaScript e Python: retry, cache de 24 h, timeout e parada em caso de falha.", "#codigo", "2 arquivos"),
            ("05", "Integrações", "n8n (recomendado), Make e Zapier. Ordem de execução igual à do funil, nunca a numeração do catálogo.", "#integracoes", "3 formatos"),
            ("06", "Templates", "Landing page de conversão com campos para preencher e o starter kit com 10 design systems originais em tokens CSS.", "#templates", "2 pastas"),
            ("07", "Design systems", "10 sistemas completos e comparáveis. Mesmos nomes de token para você trocar de linguagem visual sem reescrever página.", "#design-system", "10 .css"),
            ("08", "Growth Design Playbook", "O método em texto: 12 capítulos na ordem do funil, mais o apêndice de conformidade.", "#ebook", "PT + EN"),
        ]
        prompts_intro = ("Oito blocos numerados. Você chama pelo número — “usa o 14 aqui” — em vez de procurar em pasta. "
                         "Todos terminam declarando formato de saída e proibindo invenção de dado: onde falta informação, o prompt escreve [CONFIRMAR].")
        checks_intro = "Cada checklist fecha com um veredito: pode publicar, ou o que ainda falta."
        plan_intro = "Todas as planilhas carregam o aviso: ferramenta de decisão, não previsão."
        codigo_intro = ("Você assina a RapidAPI na sua conta e cola a chave em variável de ambiente — nunca no código da página. "
                        "Os dois clientes fazem a mesma coisa; escolha pelo ambiente em que você já trabalha.")
        integracoes_intro = "Quatro ajustes são obrigatórios antes de importar: host real, caminho do endpoint, autenticação por header e ID da planilha de destino."
        templates_intro = "Os dois templates são editáveis e não dependem de framework."
        ds_intro = ("Cada sistema define os mesmos tokens (papel, tinta, acento, estados, fontes, escala, espaçamento, raio, sombra, movimento). "
                    "Trocar de um para o outro é trocar um arquivo, não redesenhar a página. Todos passam em contraste AA nos pares de corpo e acento.")
        licenca_titulo = "O que você pode fazer com o kit"
        licenca_pode = [("Usar em projetos próprios", "inclusive comerciais, sem taxa por projeto."),
                        ("Usar em trabalho para cliente", "com ou sem ajuste de tokens e conteúdo."),
                        ("Adaptar e recombinar", "os arquivos fazem parte do seu processo de trabalho.")]
        licenca_nao = [("Revender ou redistribuir", "o kit, isolado ou dentro de outro produto."),
                       ("Sublicenciar", "como se fosse seu material de curso."),
                       ("Publicar como biblioteca aberta", "repositório público, pasta compartilhada ou pack gratuito.")]
        licenca_rodape = '<a class="gdp-link" href="' + raiz + 'legal/licenca.html">Ler a licença completa</a>'
        cta_titulo = "Isso tudo está incluído no curso."
        cta_texto = "O kit não é vendido separado: ele vem com os 6 módulos e as 28 aulas, para ser usado enquanto você assiste."
        cta_btn = "Ver a oferta completa"
        sec_prefix, sec_checks, sec_plan, sec_code, sec_integ, sec_tpl, sec_ds, sec_lic = (
            "Bloco a bloco", "Antes de publicar", "Números em ordem", "Duas linguagens, o mesmo funil",
            "Onde a mão na massa acontece", "Ponto de partida", "Dez linguagens visuais", "Licença do kit")
        ancora_oferta = "oferta"
    else:
        eyebrow = "Tool kit"
        h1 = "The kit that turns the course into an operation."
        lead = ("Everything that ships with Growth Design Pro — and that you use on client work, not only in class. "
                "Each piece below exists for one specific step of the funnel, in the order it runs.")
        numeros = [("52", "prompts"), ("4", "checklists"), ("4", "spreadsheets"), ("2", "code clients"),
                   ("3", "integrations"), ("10", "design systems"), ("12+1", "chapters"), ("1", "LP template")]
        grid_titulo = "Eight families of material"
        grid = [
            ("01", "Golden Prompt Library", "52 prompts across 8 blocks: from design-system extraction to the honesty audit before publishing. In PT-BR and EN.", "#prompts", "52 .md files"),
            ("02", "Execution checklists", "Four short lists that prevent expensive mistakes: conversion, on-page SEO, RapidAPI setup and publishing.", "#checklists", "4 .md files"),
            ("03", "Working spreadsheets", "SEO analysis, dashboard, social calendar and ROI calculator — formulas, validations and conditional formatting ready.", "#planilhas", "4 .xlsx"),
            ("04", "Code clients", "The 6-API funnel in JavaScript and Python: retry, 24 h cache, timeout and stop-on-failure.", "#codigo", "2 files"),
            ("05", "Integrations", "n8n (recommended), Make and Zapier. Execution order follows the funnel, never the catalogue numbering.", "#integracoes", "3 formats"),
            ("06", "Templates", "A conversion landing page with fill-in fields and the starter kit with 10 original design systems in CSS tokens.", "#templates", "2 folders"),
            ("07", "Design systems", "10 complete, comparable systems. Same token names so you can swap visual language without rewriting a page.", "#design-system", "10 .css"),
            ("08", "Growth Design Playbook", "The method in text: 12 chapters in funnel order, plus the compliance appendix.", "#ebook", "PT + EN"),
        ]
        prompts_intro = ("Eight numbered blocks. You call them by number — “use 14 here” — instead of digging through folders. "
                         "Every prompt declares its output format and forbids inventing data: where information is missing it writes [CONFIRMAR].")
        checks_intro = "Every checklist ends with a verdict: publishable, or what is still missing."
        plan_intro = "Every spreadsheet carries the same note: a decision tool, not a forecast."
        codigo_intro = ("You subscribe to RapidAPI in your own account and keep the key in an environment variable — never in page source. "
                        "Both clients do the same thing; pick the environment you already work in.")
        integracoes_intro = "Four edits are mandatory before importing: real host, endpoint path, header authentication and destination sheet ID."
        templates_intro = "Both templates are editable and framework-free."
        ds_intro = ("Every system defines the same tokens (paper, ink, accent, states, fonts, scale, spacing, radius, shadow, motion). "
                    "Switching systems is swapping a file, not redesigning the page. All of them pass AA contrast on body and accent pairs.")
        licenca_titulo = "What you may do with the kit"
        licenca_pode = [("Use it on your own projects", "including commercial ones, with no per-project fee."),
                        ("Use it on client work", "with or without adjusted tokens and content."),
                        ("Adapt and recombine", "the files become part of how you work.")]
        licenca_nao = [("Resell or redistribute", "the kit, standalone or inside another product."),
                       ("Sublicense", "as if it were your own course material."),
                       ("Publish as an open library", "public repo, shared folder or free pack.")]
        licenca_rodape = '<a class="gdp-link" href="' + raiz + 'legal/licenca.html">Read the full licence</a>'
        cta_titulo = "All of this is included in the course."
        cta_texto = "The kit is not sold separately: it ships with the 6 modules and 28 lessons, to be used while you watch."
        cta_btn = "See the full offer"
        sec_prefix, sec_checks, sec_plan, sec_code, sec_integ, sec_tpl, sec_ds, sec_lic = (
            "Block by block", "Before publishing", "Numbers in order", "Two languages, one funnel",
            "Where the hands-on work happens", "Starting point", "Ten visual languages", "Kit licence")
        ancora_oferta = "offer"

    itens_grid = "\n      ".join(
        f"""<article class="gdp-kit__item reveal">
        <span class="gdp-kit__icon" aria-hidden="true">{n}</span>
        <h3 class="gdp-kit__name">{nome}</h3>
        <p class="gdp-kit__desc">{desc}</p>
        <div class="gdp-kit__fmt"><a class="gdp-link" href="{anc}">{rot}</a></div>
      </article>""" for n, nome, desc, anc, rot in grid
    )

    linhas_prompts = "\n      ".join(
        f"""<article class="gdp-card reveal" style="padding:var(--s-5)">
        <div style="font-family:var(--font-mono);font-size:.625rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)">{bloco} · {faixa}</div>
        <h3 class="h3 mt-3" style="font-size:var(--fs-h4)">{titulo}</h3>
        <p class="mt-3" style="font-size:var(--fs-caption);color:var(--ink-2)">{desc}</p>
      </article>""" for bloco, faixa, titulo, desc in PROMPTS
    )

    def cartoes(itens):
        return "\n      ".join(
            f"""<article style="border-top:1px solid var(--rule);padding-top:var(--s-4)">
        <h3 class="h3" style="font-size:var(--fs-h4)">{n}</h3>
        <p class="mt-3" style="font-size:var(--fs-caption);color:var(--ink-2)">{d}</p>
      </article>""" for n, d in itens
        )

    def cartoes_simples(itens):
        return "\n      ".join(
            f"""<article style="border-top:1px solid var(--rule);padding-top:var(--s-4)">
        <h3 class="h3" style="font-size:var(--fs-h4)">{n}</h3>
        <p class="mt-3" style="font-size:var(--fs-caption);color:var(--ink-2)">{d}</p>
      </article>""" for n, d in itens
        )

    linhas_sistemas = "\n      ".join(
        f"""<tr>
        <td style="font-family:var(--font-mono);color:var(--gold);padding:var(--s-3) 0">{i}</td>
        <td style="padding:var(--s-3) var(--s-4)"><strong>{nome}</strong></td>
        <td style="padding:var(--s-3) var(--s-4);color:var(--ink-2)">{dens}</td>
        <td style="padding:var(--s-3) var(--s-4);color:var(--ink-2)">{escala}</td>
        <td style="padding:var(--s-3) var(--s-4);color:var(--ink-2)">{base}</td>
        <td style="padding:var(--s-3) 0;color:var(--ink-2);font-size:var(--fs-caption)">{uso}</td>
      </tr>""" for i, nome, dens, escala, base, uso in SISTEMAS
    )

    if lang == "pt-BR":
        cab_sistema = ("08", "Sistema", "Densidade", "Escala", "Base", "Uso típico")
        alt_kits = "Kit de ferramentas" 
    else:
        cab_sistema = ("08", "System", "Density", "Scale", "Base", "Typical use")
        alt_kits = "Tool kit"
    thead = f"""<thead><tr>
          <th scope="col" style="padding:0 var(--s-4) var(--s-3) 0">{cab_sistema[0]}</th>
          <th scope="col" style="padding:0 var(--s-4) var(--s-3) 0">{cab_sistema[1]}</th>
          <th scope="col" style="padding:0 var(--s-4) var(--s-3) 0">{cab_sistema[2]}</th>
          <th scope="col" style="padding:0 var(--s-4) var(--s-3) 0">{cab_sistema[3]}</th>
          <th scope="col" style="padding:0 var(--s-4) var(--s-3) 0">{cab_sistema[4]}</th>
          <th scope="col" style="padding:0 0 var(--s-3) 0">{cab_sistema[5]}</th>
        </tr></thead>"""

    return f"""<main id="conteudo">

<section class="section section--tight">
  <div class="shell">
    {filete('KIT', eyebrow, '08 famílias' if lang == 'pt-BR' else '08 families')}
    <h1 class="h1 mt-6 reveal" style="max-width:22ch">{h1}</h1>
    <p class="lead mt-6 reveal" style="max-width:64ch">{lead}</p>

    <div class="gdp-colophon mt-9 reveal">
      {''.join(f'<div class="gdp-colophon__row"><span class="gdp-colophon__key">{n}</span><span class="gdp-colophon__val">{r}</span></div>' for n, r in numeros)}
    </div>
  </div>
</section>

<section class="section section--paper2" id="indice">
  <div class="shell">
    <h2 class="h2 reveal">{grid_titulo}</h2>
    <div class="gdp-kit mt-8">
      {itens_grid}
    </div>
  </div>
</section>

<section class="section" id="prompts">
  <div class="shell">
    {filete('01', "Golden Prompt Library", '52')}
    <h2 class="h2 mt-6 reveal">{sec_prefix}</h2>
    <p class="lead mt-5 reveal" style="max-width:62ch">{prompts_intro}</p>
    <div class="grid grid--3 mt-8">
      {linhas_prompts}
    </div>
  </div>
</section>

<section class="section section--paper2" id="checklists">
  <div class="shell">
    {filete('02', 'Checklists', '4')}
    <h2 class="h2 mt-6 reveal">{sec_checks}</h2>
    <div class="gdp-checks gdp-checks--2 mt-8">
      {cartoes(CHECKLISTS)}
    </div>
    <p class="mt-7" style="font-size:var(--fs-caption);color:var(--ink-3)">{checks_intro}</p>
  </div>
</section>

<section class="section" id="planilhas">
  <div class="shell">
    {filete('03', 'Planilhas' if lang == 'pt-BR' else 'Spreadsheets', '4')}
    <h2 class="h2 mt-6 reveal">{sec_plan}</h2>
    <div class="grid grid--2 mt-8">
      {cartoes_simples(PLANILHAS)}
    </div>
    <p class="mt-7" style="font-size:var(--fs-caption);color:var(--ink-3)">{plan_intro}</p>
  </div>
</section>

<section class="section theme-night" id="codigo">
  <div class="shell">
    {filete('04', 'Código' if lang == 'pt-BR' else 'Code', 'JS · PY')}
    <h2 class="h2 mt-6 reveal">{sec_code}</h2>
    <p class="lead mt-5 reveal" style="max-width:62ch">{codigo_intro}</p>
    <div class="grid grid--2 mt-8">
      <article style="border:1px solid var(--night-line);padding:var(--s-6)">
        <h3 class="h3" style="font-size:var(--fs-h4)">growth-stack.js</h3>
        <p class="mt-4" style="font-size:var(--fs-small);color:var(--on-night-2)">{'Cliente Node para quem já vive no JavaScript. Exporta ETAPAS, chamarEtapa e executarFunil, e grava cada resposta em dados/0N-*.json.' if lang == 'pt-BR' else 'Node client for those already living in JavaScript. Exports ETAPAS, chamarEtapa and executarFunil, and writes every response to dados/0N-*.json.'}</p>
      </article>
      <article style="border:1px solid var(--night-line);padding:var(--s-6)">
        <h3 class="h3" style="font-size:var(--fs-h4)">growth_stack.py</h3>
        <p class="mt-4" style="font-size:var(--fs-small);color:var(--on-night-2)">{'Espelho em Python, só biblioteca padrão. Aceita --sem-cache e confere o esquema da URL antes de gastar chamada.' if lang == 'pt-BR' else 'Python mirror, standard library only. Takes --sem-cache and checks the URL scheme before spending a call.'}</p>
      </article>
    </div>
  </div>
</section>

<section class="section" id="integracoes">
  <div class="shell">
    {filete('05', 'Integrações' if lang == 'pt-BR' else 'Integrations', '3')}
    <h2 class="h2 mt-6 reveal">{sec_integ}</h2>
    <p class="lead mt-5 reveal" style="max-width:62ch">{integracoes_intro}</p>
    <div class="grid grid--3 mt-8">
      {''.join(f'<article class="gdp-card" style="padding:var(--s-6)"><h3 class="h3" style="font-size:var(--fs-h4)">{p}</h3><p class="mt-2" style="font-family:var(--font-mono);font-size:.6875rem;color:var(--gold)">{a}</p><p class="mt-4" style="font-size:var(--fs-caption);color:var(--ink-2)">{d}</p></article>' for p, a, d in INTEGRACOES)}
    </div>
  </div>
</section>

<section class="section section--paper2" id="templates">
  <div class="shell">
    {filete('06', 'Templates', '2')}
    <h2 class="h2 mt-6 reveal">{sec_tpl}</h2>
    <p class="lead mt-5 reveal" style="max-width:62ch">{templates_intro}</p>
    <div class="grid grid--2 mt-8">
      <article class="gdp-card">
        <h3 class="h3" style="font-size:var(--fs-h4)">{'Landing page de conversão' if lang == 'pt-BR' else 'Conversion landing page'}</h3>
        <p class="mt-4" style="font-size:var(--fs-small);color:var(--ink-2)">{'Página completa com campos entre [[ ]] para preencher, blocos de depoimento marcados como placeholder, consentimento LGPD e o fetch do formulário comentado até você apontar o webhook.' if lang == 'pt-BR' else 'A full page with [[ ]] fill-in fields, testimonial blocks explicitly marked as placeholders, LGPD consent and the form fetch commented out until you point it at your webhook.'}</p>
      </article>
      <article class="gdp-card">
        <h3 class="h3" style="font-size:var(--fs-h4)">Design System Starter Kit</h3>
        <p class="mt-4" style="font-size:var(--fs-small);color:var(--ink-2)">{'Dez sistemas originais com os mesmos nomes de token, página de demonstração de cada um e regras de aplicação documentadas no fim de cada arquivo.' if lang == 'pt-BR' else 'Ten original systems sharing the same token names, a demo page for each and application rules documented at the end of every file.'}</p>
      </article>
    </div>
  </div>
</section>

<section class="section" id="design-system">
  <div class="shell">
    {filete('07', 'Design systems', '10')}
    <h2 class="h2 mt-6 reveal">{sec_ds}</h2>
    <p class="lead mt-5 reveal" style="max-width:62ch">{ds_intro}</p>
    <div style="overflow-x:auto" class="mt-8">
      <table style="width:100%;min-width:44rem;border-collapse:collapse;font-size:var(--fs-caption)">
        {thead}
        <tbody>
      {linhas_sistemas}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section section--paper2" id="licenca">
  <div class="shell">
    {filete('08', sec_lic, 'v1.0')}
    <h2 class="h2 mt-6 reveal">{licenca_titulo}</h2>
    <div class="grid grid--2 mt-8">
      <div>
        <h3 class="eyebrow">{'Permitido' if lang == 'pt-BR' else 'Allowed'}</h3>
        <ul class="gdp-checks mt-5">
          {''.join(f'<li class="gdp-check"><span class="gdp-check__box" aria-hidden="true">✓</span><span><strong>{t}</strong> — {d}</span></li>' for t, d in licenca_pode)}
        </ul>
      </div>
      <div>
        <h3 class="eyebrow">{'Proibido' if lang == 'pt-BR' else 'Not allowed'}</h3>
        <ul class="gdp-checks mt-5">
          {''.join(f'<li class="gdp-check"><span class="gdp-check__box" aria-hidden="true">×</span><span><strong>{t}</strong> — {d}</span></li>' for t, d in licenca_nao)}
        </ul>
      </div>
    </div>
    <p class="mt-7">{licenca_rodape}</p>
  </div>
</section>

<section class="section theme-night" id="ebook">
  <div class="shell shell--narrow" style="text-align:center">
    <h2 class="h2 reveal">{cta_titulo}</h2>
    <p class="lead mt-5 reveal" style="margin-inline:auto;max-width:52ch">{cta_texto}</p>
    <div class="mt-8 reveal">
      <a class="gdp-btn gdp-btn--gold gdp-btn--lg" href="{casa}#{ancora_oferta}">{cta_btn}<span class="gdp-btn__arrow" aria-hidden="true">→</span></a>
    </div>
    <p class="mt-6" style="font-size:var(--fs-caption);color:var(--on-night-2)">
      <a class="gdp-link" href="{casa}ebook/">{'Conhecer o e-book' if lang == 'pt-BR' else 'Meet the e-book'}</a>
    </p>
  </div>
</section>

</main>"""


# ---------------------------------------------------------------------------
# Página do e-book
# ---------------------------------------------------------------------------

def corpo_ebook(lang: str, casa: str, raiz: str) -> str:
    if lang == "pt-BR":
        eyebrow, h1 = "E-book incluído", "Growth Design Playbook"
        lead = ("O método completo em texto, na mesma ordem do curso. Serve para consultar durante um projeto "
                "e para entregar a um cliente que quer entender o raciocínio por trás das decisões.")
        colofao = [("12", "capítulos"), ("1", "apêndice de conformidade"), ("PT + EN", "edições"),
                   ("A5", "pronto para impressão"), ("1", "exercício por capítulo")]
        titulo_sumario, introducao_sumario = "Sumário", "Doze capítulos na ordem do funil, mais o apêndice que ninguém lê e todo mundo deveria."
        como_titulo = "Como usar"
        como = [
            ("Leia na ordem na primeira vez", "cada capítulo depende do anterior, como as etapas do funil."),
            ("Faça o exercício de cada capítulo", "são curtos e sempre aplicados a um projeto real, seu ou de um cliente."),
            ("Use como manual depois", "o índice foi feito para você voltar direto ao ponto que precisa."),
            ("Imprima se preferir", "a edição em HTML tem folha de estilo de impressão em A5."),
        ]
        formatos_titulo, formatos = "Formatos", [
            ("HTML (área de membros)", "Leitura online, no navegador, com índice numerado clicável."),
            ("Impressão / PDF", "Abre a edição HTML e manda imprimir: o CSS já cuida do tamanho A5 e das quebras de página."),
        ]
        cta_titulo = "O Playbook vem com o curso."
        cta_texto = "Junto com os 6 módulos, as 28 aulas e o kit de ferramentas completo."
        cta_btn = "Ver a oferta"
        ancora_oferta = "oferta"
        aviso = ("Este e-book é material didático. Ele descreve método e processo — não promete tráfego, ranking, "
                 "conversão ou faturamento. Resultados dependem de mercado, oferta e execução.")
    else:
        eyebrow, h1 = "Included e-book", "Growth Design Playbook"
        lead = ("The full method in text, in the same order as the course. Consult it during a project, or hand it "
                "to a client who wants to understand the reasoning behind the decisions.")
        colofao = [("12", "chapters"), ("1", "compliance appendix"), ("PT + EN", "editions"),
                   ("A5", "print-ready"), ("1", "exercise per chapter")]
        titulo_sumario, introducao_sumario = "Contents", "Twelve chapters in funnel order, plus the appendix nobody reads and everybody should."
        como_titulo = "How to use it"
        como = [
            ("Read it in order the first time", "each chapter depends on the previous one, like the funnel steps."),
            ("Do the exercise in each chapter", "they are short and always applied to a real project, yours or a client's."),
            ("Keep it as a manual later", "the index is built so you can jump straight to what you need."),
            ("Print it if you prefer", "the HTML edition ships with an A5 print stylesheet."),
        ]
        formatos_titulo, formatos = "Formats", [
            ("HTML (members area)", "Read online, in the browser, with a clickable numbered index."),
            ("Print / PDF", "Open the HTML edition and print: the CSS handles A5 size and page breaks."),
        ]
        cta_titulo = "The Playbook ships with the course."
        cta_texto = "Along with the 6 modules, the 28 lessons and the full tool kit."
        cta_btn = "See the offer"
        ancora_oferta = "offer"
        aviso = ("This e-book is teaching material. It describes method and process — it does not promise traffic, "
                 "ranking, conversion or revenue. Results depend on market, offer and execution.")

    if lang == "pt-BR":
        capitulos = [
            ("01", "O problema do design linear"), ("02", "Ecossistema, não página"),
            ("03", "Etapa 1 — Extrair"), ("04", "Recombinar é construir"),
            ("05", "Etapa 2 — O funil de crescimento"), ("06", "Etapa 3 — SEO que dá para medir"),
            ("07", "Etapa 4 — Conversão"), ("08", "Etapa 5 — Copy que não promete demais"),
            ("09", "Etapa 6 — Landing page"), ("10", "Amplificação social"),
            ("11", "Custo, limite técnico e risco"), ("12", "Receita e precificação"),
            ("A", "Apêndice — conformidade e honestidade"),
        ]
    else:
        capitulos = [
            ("01", "The linear design problem"), ("02", "An ecosystem, not a page"),
            ("03", "Step 1 — Extract"), ("04", "Recombining is building"),
            ("05", "Step 2 — The growth funnel"), ("06", "Step 3 — SEO you can measure"),
            ("07", "Step 4 — Conversion"), ("08", "Step 5 — Copy that does not overpromise"),
            ("09", "Step 6 — Landing page"), ("10", "Social amplification"),
            ("11", "Cost, technical limits and risk"), ("12", "Revenue and pricing"),
            ("A", "Appendix — compliance and honesty"),
        ]

    linhas_cap = "\n      ".join(
        f"""<li style="display:grid;grid-template-columns:3rem minmax(0,1fr);gap:var(--s-4);padding:var(--s-3) 0;border-bottom:1px dotted var(--rule)">
        <span style="font-family:var(--font-mono);font-size:var(--fs-caption);color:var(--gold)">{n}</span>
        <span style="font-weight:500">{t}</span>
      </li>""" for n, t in capitulos
    )

    return f"""<main id="conteudo">

<section class="section section--tight">
  <div class="shell">
    {filete('E-BOOK', eyebrow, 'v1.0')}
    <h1 class="h1 mt-6 reveal" style="max-width:20ch">{h1}</h1>
    <p class="lead mt-6 reveal" style="max-width:64ch">{lead}</p>
    <div class="gdp-colophon mt-9 reveal">
      {''.join(f'<div class="gdp-colophon__row"><span class="gdp-colophon__key">{n}</span><span class="gdp-colophon__val">{r}</span></div>' for n, r in colofao)}
    </div>
  </div>
</section>

<section class="section section--paper2">
  <div class="shell">
    <div class="grid grid--split">
      <div>
        <h2 class="h2 reveal">{titulo_sumario}</h2>
        <p class="mt-4 reveal" style="color:var(--ink-2)">{introducao_sumario}</p>
      </div>
      <ul class="reveal">
      {linhas_cap}
      </ul>
    </div>
  </div>
</section>

<section class="section">
  <div class="shell">
    <div class="grid grid--2">
      <div>
        <h2 class="h2 reveal">{como_titulo}</h2>
        <ul class="gdp-checks mt-7">
          {''.join(f'<li class="gdp-check"><span class="gdp-check__box" aria-hidden="true">✓</span><span><strong>{t}</strong> — {d}</span></li>' for t, d in como)}
        </ul>
      </div>
      <div>
        <h2 class="h2 reveal">{formatos_titulo}</h2>
        <div class="gdp-checks mt-7">
          {''.join(f'<article style="border-top:1px solid var(--rule);padding-top:var(--s-4)"><h3 class="h3" style="font-size:var(--fs-h4)">{t}</h3><p class="mt-3" style="font-size:var(--fs-caption);color:var(--ink-2)">{d}</p></article>' for t, d in formatos)}
        </div>
      </div>
    </div>
    <p class="mt-9" style="font-size:var(--fs-caption);color:var(--ink-3);max-width:70ch">{aviso}</p>
  </div>
</section>

<section class="section theme-night">
  <div class="shell shell--narrow" style="text-align:center">
    <h2 class="h2 reveal">{cta_titulo}</h2>
    <p class="lead mt-5 reveal" style="margin-inline:auto;max-width:52ch">{cta_texto}</p>
    <div class="mt-8 reveal">
      <a class="gdp-btn gdp-btn--gold gdp-btn--lg" href="{casa}#{ancora_oferta}">{cta_btn}<span class="gdp-btn__arrow" aria-hidden="true">→</span></a>
    </div>
    <p class="mt-6" style="font-size:var(--fs-caption);color:var(--on-night-2)">
      <a class="gdp-link" href="{casa}kit/">{'Conhecer o kit completo' if lang == 'pt-BR' else 'See the full kit'}</a>
    </p>
  </div>
</section>

</main>"""


# ---------------------------------------------------------------------------
# Montagem
# ---------------------------------------------------------------------------

PAGINAS = [
    dict(
        saida="site/kit/index.html", lang="pt-BR", tipo="kit",
        assets="../", casa="../", raiz="../", alt="../en/kit/",
        titulo="Kit de ferramentas — Growth Design Pro",
        descricao="52 prompts, 4 checklists, 4 planilhas, clientes JS/Python das 6 APIs, integrações n8n/Make/Zapier e 10 design systems originais. Incluído no curso Growth Design Pro.",
        canonical="https://growthdesignpro.com.br/kit/",
    ),
    dict(
        saida="site/en/kit/index.html", lang="en", tipo="kit",
        assets="../../", casa="../", raiz="../../", alt="../../kit/",
        titulo="Tool kit — Growth Design Pro",
        descricao="52 prompts, 4 checklists, 4 spreadsheets, JS/Python clients for the six APIs, n8n/Make/Zapier integrations and 10 original design systems. Included in the Growth Design Pro course.",
        canonical="https://growthdesignpro.com.br/en/kit/",
    ),
    dict(
        saida="site/ebook/index.html", lang="pt-BR", tipo="ebook",
        assets="../", casa="../", raiz="../", alt="../en/ebook/",
        titulo="Growth Design Playbook — o e-book do curso",
        descricao="O método completo em texto: 12 capítulos na ordem do funil, um apêndice de conformidade e um exercício por capítulo. Edições em PT-BR e inglês, com folha de impressão A5.",
        canonical="https://growthdesignpro.com.br/ebook/",
    ),
    dict(
        saida="site/en/ebook/index.html", lang="en", tipo="ebook",
        assets="../../", casa="../", raiz="../../", alt="../../ebook/",
        titulo="Growth Design Playbook — the course e-book",
        descricao="The full method in text: 12 chapters in funnel order, a compliance appendix and one exercise per chapter. PT-BR and English editions, with an A5 print stylesheet.",
        canonical="https://growthdesignpro.com.br/en/ebook/",
    ),
]


def gerar() -> list[Path]:
    escritas: list[Path] = []
    for pg in PAGINAS:
        lang = pg["lang"]
        rotulo_alt = "EN" if lang == "pt-BR" else "PT"
        assets, casa, raiz = pg["assets"], pg["casa"], pg["raiz"]
        corpo = (corpo_kit(lang, casa, raiz) if pg["tipo"] == "kit"
                 else corpo_ebook(lang, casa, raiz))
        html = (
            chrome_head(lang, assets, pg["titulo"], pg["descricao"], pg["alt"], pg["canonical"])
            + chrome_nav(lang, casa, pg["alt"], rotulo_alt)
            + corpo
            + "\n\n"
            + chrome_footer(lang, casa, raiz, casa, assets)
        )
        destino = RAIZ / pg["saida"]
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(html, encoding="utf-8")
        escritas.append(destino)
        print(f"  ✓ {pg['saida']}  ({len(html) // 1024} KB)")
    return escritas


if __name__ == "__main__":
    print("Growth Design Pro — páginas do kit e do e-book")
    arquivos = gerar()
    print(f"{len(arquivos)} páginas geradas.")
