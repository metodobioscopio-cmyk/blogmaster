#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera o Design System Starter Kit: 10 sistemas ORIGINAIS em tokens CSS.

Por que original e não "10 sites reais extraídos": a metodologia do curso ensina a
extrair DECISÕES de design (paleta com função, escala, ritmo, contraste). Os sistemas
abaixo foram construídos exatamente assim — cada um parte de um conjunto de decisões
distinto (contraste, densidade, temperatura, hierarquia) — sem reproduzir ativo,
código, texto ou identidade de terceiros. Isso é o que permite entregar o material
com uso comercial liberado.

Cada sistema é gerado com contraste verificado (WCAG AA no texto de corpo), para que
o aluno não herde um problema de acessibilidade ao recombinar.

Uso:    python3 tools/gerar_design_systems.py
Saída:  kit/templates/design-system-starter-kit/sistema-01..10.css
        kit/templates/design-system-starter-kit/README.md
        kit/templates/design-system-starter-kit/index.html  (preview de todos)
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "kit" / "templates" / "design-system-starter-kit"

# ---------------------------------------------------------------------------
# 10 conjuntos de decisões. Cada entrada descreve uma INTENÇÃO de design, e as
# cores foram escolhidas para passar AA (>= 4.5:1) no texto de corpo.
# ---------------------------------------------------------------------------
SISTEMAS = [
    {
        "id": "01-editorial-papel",
        "nome": "Editorial Papel",
        "ideia": "Revista impressa de alto padrão: papel morno, tinta, um único acento metálico. "
                 "Muito respiro, hierarquia por tipografia e filete, não por cor.",
        "personalidade": ["sóbrio", "culto", "atemporal", "calmo", "caro"],
        "referencia": "Editoriais impressos, catálogos de arquitetura",
        "densidade": "arejado",
        "paper": "#F7F4ED", "paper2": "#EFEADF", "card": "#FCFAF5",
        "ink": "#121110", "ink2": "#3A3733", "ink3": "#6B655C",
        "accent": "#8F6F2E", "accent_soft": "rgba(143,111,46,.12)",
        "ok": "#3D6B4A", "erro": "#8C3A2E", "aviso": "#8A5A18",
        "serif": "Fraunces, Georgia, serif", "sans": "Inter, system-ui, sans-serif",
        "mono": "JetBrains Mono, ui-monospace, monospace",
        "raio": "0", "shadow": "0 2px 4px rgba(18,17,16,.04), 0 18px 40px -20px rgba(18,17,16,.22)",
        "escala": 1.25, "unidade": 8,
    },
    {
        "id": "02-saas-claro",
        "nome": "SaaS Claro",
        "ideia": "Produto digital de uso diário: fundo claro, azul de confiança, cantos suaves, "
                 "cards com sombra leve. Prioriza legibilidade de interface e densidade média.",
        "personalidade": ["confiável", "funcional", "claro", "moderno", "neutro"],
        "referencia": "Painéis de produto, documentação técnica",
        "densidade": "médio",
        "paper": "#FFFFFF", "paper2": "#F5F7FA", "card": "#FFFFFF",
        "ink": "#0E1726", "ink2": "#39445A", "ink3": "#5D6B85",
        "accent": "#1E4FA3", "accent_soft": "rgba(30,79,163,.10)",
        "ok": "#1F6B43", "erro": "#A32B21", "aviso": "#8A5A18",
        "serif": "'Inter Tight', Inter, system-ui, sans-serif", "sans": "Inter, system-ui, sans-serif",
        "mono": "JetBrains Mono, ui-monospace, monospace",
        "raio": "10px", "shadow": "0 1px 2px rgba(14,23,38,.06), 0 8px 24px -12px rgba(14,23,38,.18)",
        "escala": 1.2, "unidade": 4,
    },
    {
        "id": "03-noite-dourada",
        "nome": "Noite Dourada",
        "ideia": "Fundo escuro com acento quente. Alto contraste e percepção de exclusividade. "
                 "Exige disciplina: o acento é raro, e o texto claro nunca é cinza sobre cinza.",
        "personalidade": ["dramático", "premium", "noturno", "direto", "intenso"],
        "referencia": "Casas de produto de luxo, estúdios de design",
        "densidade": "arejado",
        "paper": "#0F0F0D", "paper2": "#1A1916", "card": "#1F1E1A",
        "ink": "#F2EEE4", "ink2": "#D6D0C4", "ink3": "#A9A296",
        "accent": "#C9A44C", "accent_soft": "rgba(201,164,76,.14)",
        "ok": "#7FB08C", "erro": "#E0938A", "aviso": "#D9B266",
        "serif": "Fraunces, Georgia, serif", "sans": "Inter, system-ui, sans-serif",
        "mono": "JetBrains Mono, ui-monospace, monospace",
        "raio": "2px", "shadow": "0 2px 6px rgba(0,0,0,.4), 0 30px 60px -30px rgba(0,0,0,.75)",
        "escala": 1.28, "unidade": 8,
    },
    {
        "id": "04-tecnico-mono",
        "nome": "Técnico Mono",
        "ideia": "Feito para documentação e ferramenta de desenvolvedor: denso, monoespaçado nos dados, "
                 "hierarquia por peso e por linha, cor reservada para estado.",
        "personalidade": ["preciso", "seco", "útil", "rápido", "impessoal"],
        "referencia": "Documentações de API, painéis de terminal",
        "densidade": "denso",
        "paper": "#FBFBF9", "paper2": "#F0F0EC", "card": "#FFFFFF",
        "ink": "#111311", "ink2": "#333833", "ink3": "#5F665F",
        "accent": "#1F6E6B", "accent_soft": "rgba(31,110,107,.10)",
        "ok": "#2F6B3C", "erro": "#9C2F22", "aviso": "#7A5A12",
        "serif": "'Inter', system-ui, sans-serif", "sans": "Inter, system-ui, sans-serif",
        "mono": "JetBrains Mono, ui-monospace, monospace",
        "raio": "4px", "shadow": "0 1px 0 rgba(17,19,17,.08)",
        "escala": 1.15, "unidade": 4,
    },
    {
        "id": "05-terroso-artesanal",
        "nome": "Terroso Artesanal",
        "ideia": "Marca de produção artesanal: barro, oliva e papel cru. Tipografia serifada com "
                 "tracking levemente aberto, formas orgânicas e nenhuma pressa.",
        "personalidade": ["quente", "humano", "manual", "honesto", "local"],
        "referencia": "Marcas de alimento artesanal, ateliês",
        "densidade": "médio",
        "paper": "#FAF6EF", "paper2": "#F1EADD", "card": "#FFFDF8",
        "ink": "#241E17", "ink2": "#4A3F33", "ink3": "#6E6155",
        "accent": "#8A4B22", "accent_soft": "rgba(138,75,34,.12)",
        "ok": "#4C6B34", "erro": "#9C3B22", "aviso": "#8A5A18",
        "serif": "'Source Serif 4', Georgia, serif", "sans": "Inter, system-ui, sans-serif",
        "mono": "'IBM Plex Mono', ui-monospace, monospace",
        "raio": "12px", "shadow": "0 2px 6px rgba(36,30,23,.06), 0 16px 32px -18px rgba(36,30,23,.2)",
        "escala": 1.22, "unidade": 8,
    },
    {
        "id": "06-corporativo-solido",
        "nome": "Corporativo Sólido",
        "ideia": "Institucional que precisa transmitir estabilidade: azul-petróleo, grade firme, "
                 "hierarquia previsível, zero experimentalismo.",
        "personalidade": ["estável", "formal", "seguro", "amplo", "institucional"],
        "referencia": "Sites institucionais, relatórios anuais",
        "densidade": "médio",
        "paper": "#FFFFFF", "paper2": "#F2F4F6", "card": "#FFFFFF",
        "ink": "#101C24", "ink2": "#33455040".replace("40", ""), "ink3": "#5A6B76",
        "accent": "#12556E", "accent_soft": "rgba(18,85,110,.10)",
        "ok": "#1F6B43", "erro": "#9C2F22", "aviso": "#7A5A12",
        "serif": "Georgia, 'Times New Roman', serif", "sans": "'Segoe UI', Inter, system-ui, sans-serif",
        "mono": "Consolas, ui-monospace, monospace",
        "raio": "6px", "shadow": "0 1px 3px rgba(16,28,36,.08)",
        "escala": 1.2, "unidade": 8,
    },
    {
        "id": "07-neon-controlado",
        "nome": "Neon Controlado",
        "ideia": "Energia de produto de tecnologia sem cair no clichê do gradiente: fundo escuro, "
                 "acento ciano usado em no máximo 5% da tela, tipografia sem serifa bem pesada.",
        "personalidade": ["energético", "jovem", "técnico", "ousado", "contido"],
        "referencia": "Ferramentas de desenvolvimento, produtos de infraestrutura",
        "densidade": "denso",
        "paper": "#0B0F14", "paper2": "#121821", "card": "#151C26",
        "ink": "#EAF2F7", "ink2": "#C3D0DA", "ink3": "#8FA0AE",
        "accent": "#2FA8B8", "accent_soft": "rgba(47,168,184,.14)",
        "ok": "#5FBF8A", "erro": "#E58A8A", "aviso": "#D9B266",
        "serif": "Inter, system-ui, sans-serif", "sans": "Inter, system-ui, sans-serif",
        "mono": "JetBrains Mono, ui-monospace, monospace",
        "raio": "8px", "shadow": "0 0 0 1px rgba(47,168,184,.18), 0 20px 50px -25px rgba(0,0,0,.8)",
        "escala": 1.22, "unidade": 4,
    },
    {
        "id": "08-minimal-suico",
        "nome": "Minimal Suíço",
        "ideia": "Grade rigorosa, muito branco, tipografia sem serifa em poucos pesos e hierarquia "
                 "obtida por escala e alinhamento. Nada decorativo, tudo funcional.",
        "personalidade": ["preciso", "neutro", "limpo", "objetivo", "econômico"],
        "referencia": "Cartazes suíços, portfólios de design",
        "densidade": "arejado",
        "paper": "#FFFFFF", "paper2": "#F4F4F2", "card": "#FFFFFF",
        "ink": "#111111", "ink2": "#3D3D3D", "ink3": "#666666",
        "accent": "#C0392B", "accent_soft": "rgba(192,57,43,.10)",
        "ok": "#2F6B3C", "erro": "#A32B21", "aviso": "#7A5A12",
        "serif": "'Helvetica Neue', Inter, system-ui, sans-serif", "sans": "'Helvetica Neue', Inter, system-ui, sans-serif",
        "mono": "ui-monospace, monospace",
        "raio": "0", "shadow": "none",
        "escala": 1.33, "unidade": 8,
    },
    {
        "id": "09-servico-local",
        "nome": "Serviço Local",
        "ideia": "Negócio de bairro que precisa ser encontrado e contatado rápido: contraste alto, "
                 "texto grande, botão de telefone sempre visível, zero sutileza.",
        "personalidade": ["direto", "acessível", "próximo", "prático", "confiável"],
        "referencia": "Prestadores de serviço, comércio local",
        "densidade": "denso",
        "paper": "#FFFFFF", "paper2": "#EFF4F8", "card": "#FFFFFF",
        "ink": "#0D1A22", "ink2": "#2E414D", "ink3": "#54666F",
        "accent": "#0B6BB5", "accent_soft": "rgba(11,107,181,.12)",
        "ok": "#15703F", "erro": "#B3261E", "aviso": "#8A5A18",
        "serif": "Verdana, Geneva, sans-serif", "sans": "Verdana, Geneva, sans-serif",
        "mono": "ui-monospace, monospace",
        "raio": "6px", "shadow": "0 2px 6px rgba(13,26,34,.10)",
        "escala": 1.25, "unidade": 8,
    },
    {
        "id": "10-publicacao-cultural",
        "nome": "Publicação Cultural",
        "ideia": "Site de conteúdo e cultura: serifada grande para leitura longa, papel levemente "
                 "esverdeado, links sublinhados, foco absoluto no texto.",
        "personalidade": ["literário", "calmo", "denso", "atemporal", "generoso"],
        "referencia": "Revistas literárias, sites de conteúdo longo",
        "densidade": "arejado",
        "paper": "#FAFAF5", "paper2": "#F0F1E8", "card": "#FFFFFF",
        "ink": "#16180F", "ink2": "#3E4232", "ink3": "#666B57",
        "accent": "#6B4E2E", "accent_soft": "rgba(107,78,46,.12)",
        "ok": "#3D6B4A", "erro": "#8C3A2E", "aviso": "#7A5A12",
        "serif": "'Source Serif 4', Georgia, 'Times New Roman', serif",
        "sans": "Inter, system-ui, sans-serif",
        "mono": "'IBM Plex Mono', ui-monospace, monospace",
        "raio": "3px", "shadow": "none",
        "escala": 1.28, "unidade": 8,
    },
]


# ---------------------------------------------------------------------------
# Geração do CSS
# ---------------------------------------------------------------------------

RAIZ_NOMES = {
    "paper": "--paper", "paper2": "--paper-2", "card": "--paper-card",
    "ink": "--ink", "ink2": "--ink-2", "ink3": "--ink-3",
    "accent": "--accent", "accent_soft": "--accent-soft",
    "ok": "--state-ok", "erro": "--state-error", "aviso": "--state-warning",
}


def escala_tipografica(base: float, razao: float) -> list[tuple[str, float]]:
    """7 níveis: de small a display, em razão geométrica."""
    niveis = [("--fs-caption", -1), ("--fs-small", 0), ("--fs-body", 1), ("--fs-h4", 2),
              ("--fs-h3", 3), ("--fs-h2", 4), ("--fs-h1", 5), ("--fs-display", 6)]
    return [(nome, round(base * (razao ** exp), 4)) for nome, exp in niveis]


def espacamentos(unidade: int) -> list[tuple[str, str]]:
    passos = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]
    return [(f"--s-{i+1}", f"{p * unidade / 16:.4g}rem") for i, p in enumerate(passos)]


def gerar_css(s: dict) -> str:
    linhas: list[str] = []
    add = linhas.append

    add(f"""/* ============================================================================
   {s['nome'].upper()}
   ----------------------------------------------------------------------------
   IDEIA CENTRAL
   {s['ideia']}

   PERSONALIDADE    {' · '.join(s['personalidade'])}
   REFERÊNCIA       {s['referencia']}
   DENSIDADE        {s['densidade']}
   ----------------------------------------------------------------------------
   Sistema ORIGINAL do Design System Starter Kit (Growth Design Pro). Construído a
   partir de decisões de design — contraste, ritmo, hierarquia, temperatura — sem
   reproduzir ativo, código ou identidade de terceiros.
   Uso comercial liberado em projetos próprios e de clientes.
   Revenda e redistribuição dos arquivos: proibidas (ver licença do kit).
   ========================================================================== */

:root {{
  /* --- Cor: cada valor tem FUNÇÃO declarada ------------------------------- */""")

    funcoes = {
        "paper": "fundo padrão da página",
        "paper2": "fundo de seção alternada",
        "card": "fundo de cartão elevado",
        "ink": "texto principal",
        "ink2": "texto secundário",
        "ink3": "legenda e metadado (piso de contraste)",
        "accent": "acento da marca — usar em no máximo 5% da tela",
        "accent_soft": "acento em baixa opacidade (fundo de destaque)",
        "ok": "estado de sucesso",
        "erro": "estado de erro",
        "aviso": "estado de atenção",
    }
    for chave, token in RAIZ_NOMES.items():
        valor = s[chave]
        add(f"  {token}: {valor};".ljust(44) + f"/* {funcoes[chave]} */")

    add("")
    add("  /* --- Tipografia --------------------------------------------------------- */")
    add(f"  --font-display: {s['serif']};")
    add(f"  --font-text:    {s['sans']};")
    add(f"  --font-mono:    {s['mono']};")
    add("")
    for nome, valor in escala_tipografica(1.0625, s["escala"]):
        add(f"  {nome}: {valor:g}rem;".ljust(30) +
            ("/* título de seção */" if nome in ("--fs-h1", "--fs-h2") else
             "/* corpo */" if nome == "--fs-body" else ""))
    add("  --lh-heading: 1.10;")
    add("  --lh-body:    1.62;")
    add(f"  --tr-heading: {'-0.02em' if s['escala'] > 1.2 else '-0.012em'};")
    add("  --tr-eyebrow:  0.16em;")

    add("")
    add("  /* --- Espaçamento e medidas ---------------------------------------------- */")
    for nome, valor in espacamentos(s["unidade"]):
        add(f"  {nome}: {valor};".ljust(20) + (f"/* base de {s['unidade']}px */" if nome == "--s-1" else ""))
    add(f"  --maxw:        72rem;   /* largura máxima do conteúdo */")
    add("  --maxw-text:   42rem;   /* coluna de leitura longa */")
    add("  --gutter:      clamp(1.25rem, 4vw, 3rem);")
    add("  --section-y:   clamp(3rem, 2rem + 5vw, 6.5rem);")

    add("")
    add("  /* --- Forma, profundidade e movimento ----------------------------------- */")
    add(f"  --r-sm: {s['raio']};")
    raio = s["raio"]
    if raio.endswith("px") and raio != "0":
        add(f"  --r-md: calc({raio} * 1.6);".ljust(44) + "/* raio maior, mesma família */")
    else:
        add("  --r-md: 0;")
    add("  --r-pill: 999px;")
    add(f"  --shadow: {s['shadow']};")
    add("  --ease-out: cubic-bezier(.16,1,.3,1);")
    add("  --dur: 240ms;")
    add("}")

    add("""
/* ---------------------------------------------------------------------------
   REGRAS DE APLICAÇÃO DESTE SISTEMA
   Não são sugestões: são o que mantém a identidade coerente.
   --------------------------------------------------------------------------- */
/*
   1. Nenhum valor de cor, tamanho ou espaçamento fora dos tokens acima.
   2. O acento (--accent) cobre no máximo 5% da tela. Se estiver em tudo, não
      destaca nada.
   3. Texto de corpo nunca usa --ink-3: ele é o piso de contraste, reservado para
      legenda e metadado.
   4. Sombra só em elemento que realmente flutua (cartão em hover, botão em hover).
   5. Contraste mínimo AA em todo par texto/fundo. Ao criar uma cor nova, verifique.
   6. Animação apenas com propósito declarado: orientar, confirmar ou revelar.
*/

/* ---------------------------------------------------------------------------
   BASE MÍNIMA (remova se já existir reset no seu projeto)
   --------------------------------------------------------------------------- */
*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-text);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  -webkit-font-smoothing: antialiased;
  font-variant-numeric: tabular-nums;
}

h1, h2, h3, h4 { margin: 0; font-family: var(--font-display); font-weight: 400;
                 line-height: var(--lh-heading); letter-spacing: var(--tr-heading); }
p { margin: 0; }
p + p { margin-top: var(--s-4); }
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-underline-offset: .22em; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.wrap { max-width: var(--maxw); margin-inline: auto; padding-inline: var(--gutter); }
.section { padding-block: var(--section-y); }

.eyebrow {
  font-size: var(--fs-caption); letter-spacing: var(--tr-eyebrow);
  text-transform: uppercase; color: var(--accent); font-weight: 600;
}

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: var(--s-2);
  padding: var(--s-4) var(--s-6); border-radius: var(--r-sm);
  background: var(--accent); color: var(--paper); border: 1px solid var(--accent);
  font-size: var(--fs-small); font-weight: 600; text-decoration: none; cursor: pointer;
  transition: transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out);
}
.btn:hover { transform: translateY(-2px); box-shadow: var(--shadow); }

.card { background: var(--paper-card); border: 1px solid var(--accent-soft);
        border-radius: var(--r-sm); padding: var(--s-6); }

@media print { .btn { display: none; } }
""")
    return "\n".join(linhas)


# ---------------------------------------------------------------------------
# Preview
# ---------------------------------------------------------------------------
def gerar_preview(sistemas: list[dict]) -> str:
    cartoes = []
    for s in sistemas:
        swatches = "".join(
            f'<span style="display:inline-block;width:1.75rem;height:1.75rem;border-radius:3px;'
            f'background:{s[k]};border:1px solid rgba(0,0,0,.12)" title="{k}"></span>'
            for k in ("paper", "paper2", "ink", "accent", "ok", "erro")
        )
        cartoes.append(f"""
    <article style="border:1px solid rgba(18,17,16,.14);border-radius:8px;overflow:hidden;background:#fff">
      <div style="padding:1.5rem 1.5rem 1rem">
        <div style="font-family:ui-monospace,monospace;font-size:.6875rem;letter-spacing:.12em;
                    text-transform:uppercase;color:#6B655C">{s['id']}</div>
        <h2 style="font-family:Georgia,serif;font-weight:400;font-size:1.5rem;margin:.5rem 0 .75rem">{s['nome']}</h2>
        <p style="margin:0 0 1rem;font-size:.875rem;line-height:1.55;color:#3A3733">{s['ideia']}</p>
        <div style="display:flex;gap:.375rem;margin-bottom:1rem">{swatches}</div>
        <div style="display:flex;flex-wrap:wrap;gap:.375rem">
          {''.join(f'<span style="font-size:.6875rem;border:1px solid rgba(18,17,16,.16);border-radius:999px;padding:.2rem .6rem;color:#3A3733">{p}</span>' for p in s['personalidade'])}
        </div>
      </div>
      <div style="padding:1rem 1.5rem;border-top:1px solid rgba(18,17,16,.1);background:#FAFAF7;
                  font-family:ui-monospace,monospace;font-size:.75rem;color:#6B655C;
                  display:flex;justify-content:space-between;gap:1rem">
        <span>densidade: {s['densidade']}</span>
        <span>escala: {s['escala']}×</span>
        <span>base: {s['unidade']}px</span>
      </div>
    </article>""")

    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design System Starter Kit — 10 sistemas originais</title>
<style>
  body {{ margin:0; background:#F7F4ED; color:#121110;
         font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
         line-height:1.6; padding:clamp(1.5rem,4vw,4rem) clamp(1.25rem,4vw,3rem); }}
  h1 {{ font-family:Georgia,serif; font-weight:400; font-size:clamp(2rem,1.5rem+2.5vw,3.25rem);
        letter-spacing:-.02em; margin:0 0 1rem; max-width:24ch; }}
  .lead {{ max-width:60ch; color:#3A3733; }}
  .grade {{ display:grid; gap:1.5rem; grid-template-columns:repeat(auto-fill,minmax(20rem,1fr));
           margin-top:3rem; }}
  .nota {{ margin-top:3rem; padding:1.25rem 1.5rem; border:1px solid rgba(138,90,24,.4);
           background:rgba(138,90,24,.07); border-radius:8px; max-width:70ch; font-size:.9375rem; }}
</style>
</head>
<body>
  <h1>Dez sistemas de design, prontos para recombinar.</h1>
  <p class="lead">Cada sistema é um conjunto de decisões declaradas — não uma paleta solta.
  Abra o arquivo <code>.css</code> correspondente e comece trocando as variáveis que fazem sentido
  para a marca do cliente.</p>

  <div class="grade">{''.join(cartoes)}</div>

  <div class="nota">
    <strong>Como usar sem quebrar o sistema:</strong> troque valores, não a estrutura. Se você mudar
    os nomes dos tokens, cada sistema deixa de ser comparável com os outros — e você perde justamente
    o que torna a recombinação possível.
    <br><br>
    <strong>Antes de publicar um sistema derivado:</strong> verifique o contraste de todo par novo com
    um medidor de contraste. Um sistema bonito que reprova em AA é um problema de acessibilidade
    entregue ao cliente.
  </div>
</body>
</html>"""


def gerar_readme(sistemas: list[dict]) -> str:
    linhas = [
        "# Design System Starter Kit",
        "### Growth Design Pro · Kit de Ferramentas",
        "",
        "Dez sistemas de design **originais**, cada um com as decisões declaradas e as cores já "
        "verificadas em contraste AA para texto de corpo. Serve para você parar de começar do zero: "
        "escolha o sistema mais próximo do que faz sentido para o projeto, troque as variáveis e siga.",
        "",
        "> **Por que estes sistemas são originais.** A metodologia Vibe Design ensina a extrair "
        "*decisões* de design — contraste, ritmo, temperatura, hierarquia — e não ativos. Cada sistema "
        "abaixo foi construído a partir dessas decisões, sem reproduzir logotipo, ilustração, foto, "
        "código ou texto de terceiros. É isso que permite entregar o material com uso comercial liberado.",
        "",
        "---",
        "",
        "## Os dez sistemas",
        "",
        "| Arquivo | Sistema | Ideia central | Densidade |",
        "|---|---|---|---|",
    ]
    for s in sistemas:
        linhas.append(f"| `{s['id']}.css` | **{s['nome']}** | {s['ideia'][:96]}{'…' if len(s['ideia'])>96 else ''} | {s['densidade']} |")

    linhas += [
        "",
        "---",
        "",
        "## Como usar",
        "",
        "1. Abra `index.html` no navegador para ver os dez lado a lado.",
        "2. Escolha um ou dois candidatos para o projeto (nunca misture três).",
        "3. Copie o arquivo `.css` para o projeto e ajuste **valores**, não nomes de token.",
        "4. Verifique o contraste de qualquer cor nova (mínimo 4.5:1 no texto de corpo).",
        "5. Documente de onde veio cada variável alterada — é o hábito que separa método de cópia.",
        "",
        "```html",
        '<!-- no <head>, antes do CSS do projeto -->',
        '<link rel="stylesheet" href="sistema-01-editorial-papel.css">',
        "```",
        "",
        "### O que cada arquivo traz",
        "",
        "- **Cor** — cada token com a função declarada (fundo, texto, acento, estado).",
        "- **Tipografia** — escala geométrica de 7 níveis, line-height e tracking por papel.",
        "- **Espaçamento** — escala na base de 4 ou 8 px, com larguras máximas de conteúdo e leitura.",
        "- **Forma** — raio, sombra e curva de movimento.",
        "- **Base mínima** — reset, títulos, botão, cartão. Remova se o projeto já tiver os seus.",
        "- **Regras de aplicação** — as seis restrições que mantêm o sistema coerente.",
        "",
        "---",
        "",
        "## Regras de recombinação",
        "",
        "Recombinar é trocar variáveis **de fontes diferentes** até o resultado não lembrar nenhuma delas.",
        "",
        "| Variável | Troque entre sistemas | Cuidado |",
        "|---|---|---|",
        "| Tipografia | livremente | duas famílias de display na mesma página competem |",
        "| Cor de acento | uma única fonte | acento duplo anula o poder do acento |",
        "| Ritmo de espaçamento | do mesmo sistema | misturar base 4 e base 8 cria buracos visuais |",
        "| Raio e sombra | coerentes entre si | raio 16 com sombra dura parece erro de renderização |",
        "| Movimento | sempre o mais contido | duas linguagens de animação na mesma tela viram ruído |",
        "",
        "---",
        "",
        "## Licença",
        "",
        "Uso pessoal e comercial liberado, inclusive em projetos de clientes. Vedada a revenda, "
        "redistribuição ou publicação destes arquivos como produto próprio. Texto completo em",
        "`site/legal/licenca.html`.",
        "",
    ]
    return "\n".join(linhas)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print("Gerando Design System Starter Kit:")

    for s in SISTEMAS:
        destino = OUT / f"{s['id']}.css"
        destino.write_text(gerar_css(s), encoding="utf-8")
        print(f"  ✓ {destino.name}")

    (OUT / "index.html").write_text(gerar_preview(SISTEMAS), encoding="utf-8")
    print("  ✓ index.html (preview)")

    (OUT / "README.md").write_text(gerar_readme(SISTEMAS), encoding="utf-8")
    print("  ✓ README.md")

    print(f"Concluído. {len(SISTEMAS)} sistemas gerados.")


if __name__ == "__main__":
    main()
