#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Growth Design Pro — publicador do site.

O site é estático e precisa ser autossuficiente: tudo o que o aluno baixa tem
de viver dentro de `site/`. Este script copia o kit e as edições do e-book para
a área de membros e gera o índice de materiais dessa pasta.

    site/area/materiais/
        index.html          <- gerado por este script
        playbook-pt.html    <- escrito por tools/gerar_ebook.py
        playbook-en.html    <- escrito por tools/gerar_ebook.py
        kit/                <- cópia fiel de kit/

Uso, a partir da raiz do repositório:

    python3 tools/publicar_site.py            # sincroniza
    python3 tools/publicar_site.py --limpar   # apaga e recopia do zero

Regra: `site/area/materiais/` é artefato. Não edite nada lá dentro — rode o
script de novo depois de mexer em `kit/` ou em `ebook/`.

Dependências: nenhuma (só a biblioteca padrão).
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITE = RAIZ / "site"
ORIGEM_KIT = RAIZ / "kit"
ORIGEM_EBOOK = RAIZ / "ebook"
DESTINO = SITE / "area" / "materiais"

IGNORAR = {"__pycache__", ".DS_Store", ".git", "node_modules"}

# Títulos e descrições usados no índice de materiais.
GRUPOS = [
    ("prompts", "Golden Prompt Library", "kit/prompts",
     "Os 52 prompts em duas edições: PT-BR e inglês."),
    ("checklists", "Checklists", "kit/checklists",
     "Conversão, SEO on-page, configuração da RapidAPI e publicação."),
    ("planilhas", "Planilhas", "kit/planilhas",
     "As quatro planilhas de trabalho. Lembre: ferramenta de decisão, não previsão."),
    ("codigo", "Clientes de código", "kit/codigo",
     "O funil das 6 APIs em JavaScript e Python. Chave da RapidAPI só em variável de ambiente."),
    ("integracoes", "Integrações", "kit/integracoes",
     "n8n, Make e Zapier. Quatro ajustes obrigatórios antes de importar."),
    ("templates", "Templates", "kit/templates",
     "Landing page de conversão e o Design System Starter Kit com 10 sistemas."),
    ("design-system", "Design System Starter Kit", "kit/templates/design-system-starter-kit",
     "10 sistemas originais em tokens CSS, com página de demonstração."),
    ("codigo-detalhe", "Referência rápida", "kit/checklists/checklist-configuracao-rapidapi.md",
     "Antes de rodar qualquer chamada: confira a checklist de configuração da RapidAPI."),
]


def copiar(origem: Path, destino: Path) -> int:
    """Copia uma árvore ignorando lixo de sistema. Devolve o número de arquivos."""
    n = 0
    for item in sorted(origem.rglob("*")):
        if any(parte in IGNORAR for parte in item.parts):
            continue
        rel = item.relative_to(origem)
        alvo = destino / rel
        if item.is_dir():
            alvo.mkdir(parents=True, exist_ok=True)
        else:
            alvo.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, alvo)
            n += 1
    return n


def listar(origem: Path, destino: Path) -> str:
    """Lista os arquivos de um grupo como itens de uma lista HTML."""
    itens = []
    for item in sorted(origem.rglob("*")):
        if not item.is_file() or any(parte in IGNORAR for parte in item.parts):
            continue
        rel = item.relative_to(origem)
        alvo = destino / rel
        href = alvo.relative_to(DESTINO).as_posix()
        peso = item.stat().st_size
        peso_txt = f"{peso / 1024:.0f} KB" if peso >= 1024 else f"{peso} B"
        pastas = rel.parent.as_posix()
        prefixo = "" if pastas == "." else f"{pastas}/"
        itens.append(
            f'<li style="display:flex;justify-content:space-between;gap:var(--s-4);'
            f'padding:var(--s-2) 0;border-bottom:1px dotted var(--rule)">'
            f'<a href="{href}">{prefixo}{rel.name}</a>'
            f'<span style="font-family:var(--font-mono);font-size:.6875rem;color:var(--ink-3)">{peso_txt}</span>'
            f"</li>"
        )
    return "\n        ".join(itens) if itens else '<li style="color:var(--ink-3)">—</li>'


def gerar_indice() -> Path:
    """Gera o índice de materiais a partir do que foi realmente publicado."""
    blocos = []
    for ancora, titulo, caminho, desc in GRUPOS:
        origem = ORIGEM_KIT / caminho.removeprefix("kit/")
        destino = DESTINO / caminho
        if origem.is_dir():
            conteudo = listar(origem, destino)
        elif origem.is_file():
            href = destino.relative_to(DESTINO).as_posix()
            conteudo = f'<li><a href="{href}">{origem.name}</a></li>'
        else:
            continue
        blocos.append(f"""<section class="section" id="{ancora}">
  <div class="shell">
    <h2 class="h2" style="font-size:var(--fs-h3)">{titulo}</h2>
    <p class="mt-3" style="font-size:var(--fs-caption);color:var(--ink-2);max-width:62ch">{desc}</p>
    <ul class="mt-6" style="font-size:var(--fs-small);max-width:70ch">
        {conteudo}
    </ul>
  </div>
</section>""")

    ebook_blocos = []
    for edicao, rotulo in (("pt", "Growth Design Playbook — português"), ("en", "Growth Design Playbook — English")):
        arquivo = DESTINO / f"playbook-{edicao}.html"
        if arquivo.exists():
            ebook_blocos.append(f'<li><a href="playbook-{edicao}.html">{rotulo}</a></li>')
    ebook_blocos.append('<li><a href="kit/prompts/prompts-pt.md">Golden Prompt Library — PT-BR</a></li>')
    ebook_blocos.append('<li><a href="kit/prompts/prompts-en.md">Golden Prompt Library — English</a></li>')

    html = f"""<!DOCTYPE html>
<html lang="pt-BR" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Biblioteca de materiais — Growth Design Pro</title>
<meta name="description" content="Índice dos arquivos liberados para alunos do Growth Design Pro.">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0F0F0D">
<link rel="icon" href="../../assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../../assets/css/tokens.css">
<link rel="stylesheet" href="../../assets/css/base.css">
<link rel="stylesheet" href="../../assets/css/components.css">
</head>
<body>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>

<header class="gdp-nav" data-nav>
  <div class="shell gdp-nav__inner">
    <a class="gdp-brand" href="../../" aria-label="Growth Design Pro — início">
      <span class="gdp-brand__mark" aria-hidden="true">G</span>
      <span class="gdp-brand__text">
        <span class="gdp-brand__name">Growth Design Pro</span>
        <span class="gdp-brand__sub">Biblioteca de materiais</span>
      </span>
    </a>
    <div class="gdp-nav__right">
      <a class="gdp-link" href="../">Área de membros</a>
    </div>
  </div>
</header>

<main id="conteudo">
<section class="section section--tight" id="biblioteca">
  <div class="shell">
    <div class="filete">
      <span class="filete__num">MÓDULO 06</span>
      <span class="filete__label">Biblioteca de materiais</span>
      <span class="filete__rule" aria-hidden="true"></span>
      <span class="filete__num">v1.0</span>
    </div>
    <h1 class="h2 mt-6" style="font-size:var(--fs-h2)">Tudo o que você pode baixar.</h1>
    <p class="lead mt-5" style="max-width:62ch">
      Os arquivos abaixo são seus para usar em projeto próprio e em trabalho de cliente, como descrito na
      <a class="gdp-link" href="../../legal/licenca.html">licença do kit</a>. Revender ou redistribuir não é permitido.
    </p>
    <ul class="gdp-checks mt-7" style="font-size:var(--fs-small)">
      <li class="gdp-check"><span class="gdp-check__box" aria-hidden="true">✓</span><span><strong>Chave da RapidAPI</strong> — sempre em variável de ambiente. Nunca cole a chave no código que vai para o navegador.</span></li>
      <li class="gdp-check"><span class="gdp-check__box" aria-hidden="true">✓</span><span><strong>Assinaturas</strong> — contratadas por você, na sua conta RapidAPI. O curso não inclui acesso às APIs.</span></li>
      <li class="gdp-check"><span class="gdp-check__box" aria-hidden="true">✓</span><span><strong>Dúvida ou arquivo corrompido</strong> — escreva para <a class="gdp-link" href="mailto:suporte@growthdesignpro.com.br">suporte@growthdesignpro.com.br</a>.</span></li>
    </ul>

    <h2 class="h3 mt-9">E-book</h2>
    <ul class="mt-5" style="font-size:var(--fs-small);max-width:70ch">
      {chr(10).join(f"      {b}" for b in ebook_blocos)}
    </ul>
  </div>
</section>

{chr(10).join(blocos)}

</main>

<footer class="gdp-footer theme-night">
  <div class="shell">
    <div class="gdp-footer__bottom">
      <span>© 2026 Growth Design Pro · v1.0</span>
      <span><a class="gdp-link" href="../">Voltar à área de membros</a></span>
    </div>
    <p class="gdp-footer__legal">Material didático. Resultados variam conforme mercado, oferta e execução — nenhuma ferramenta garante tráfego, ranking ou faturamento. Growth Design Pro não é afiliado à RapidAPI.</p>
  </div>
</footer>

<script src="../../assets/js/main.js" defer></script>
</body>
</html>
"""
    destino = DESTINO / "index.html"
    destino.write_text(html, encoding="utf-8")
    return destino


def main() -> int:
    ap = argparse.ArgumentParser(description="Publica kit e e-book dentro de site/area/materiais/.")
    ap.add_argument("--limpar", action="store_true", help="apaga a pasta de destino antes de copiar")
    args = ap.parse_args()

    faltando = [p for p in (ORIGEM_KIT, ORIGEM_EBOOK, SITE) if not p.exists()]
    if faltando:
        print("ERRO — não encontrei:", ", ".join(str(p.relative_to(RAIZ)) for p in faltando))
        return 1

    if args.limpar:
        # Apaga só o que este script gera. As edições do e-book na mesma
        # pasta são escritas por tools/gerar_ebook.py e ficam onde estão.
        for alvo in (DESTINO / "kit", DESTINO / "index.html"):
            if alvo.is_dir():
                shutil.rmtree(alvo)
            elif alvo.exists():
                alvo.unlink()
        print("  · destino limpo (kit/ e index.html)")

    DESTINO.mkdir(parents=True, exist_ok=True)

    n_kit = copiar(ORIGEM_KIT, DESTINO / "kit")
    print(f"  ✓ kit/  →  site/area/materiais/kit/  ({n_kit} arquivos)")

    # O e-book publicado é escrito por tools/gerar_ebook.py (ele ajusta os links
    # de contexto). Aqui só conferimos se a cópia existe.
    for edicao in ("pt", "en"):
        alvo = DESTINO / f"playbook-{edicao}.html"
        if alvo.exists():
            print(f"  · playbook-{edicao}.html já publicado ({alvo.stat().st_size // 1024} KB)")
        else:
            print(f"  ! playbook-{edicao}.html ausente — rode: python3 tools/gerar_ebook.py")

    indice = gerar_indice()
    print(f"  ✓ índice: {indice.relative_to(RAIZ)}")

    total = sum(1 for f in DESTINO.rglob("*") if f.is_file())
    tamanho = sum(f.stat().st_size for f in DESTINO.rglob("*") if f.is_file())
    print(f"\n{total} arquivos publicados, {tamanho / 1024:.0f} KB no total.")
    print("Lembrete: rode tools/verificar.py antes de publicar.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
