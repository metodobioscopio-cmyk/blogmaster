#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verificador do Growth Design Pro.

Roda antes de cada publicação. Verifica o que quebra um produto digital de forma
silenciosa: link morto, id referenciado que não existe, token usado e não definido,
fonte faltando, requisição a CDN externa, placeholder esquecido no ar.

Não substitui revisão humana de conteúdo — substitui a parte mecânica dela.

Uso:      python3 tools/verificar.py [--quieto]
Saída:    relatório no terminal; código de saída 1 se houver pendência bloqueante.

Sem dependências externas (biblioteca padrão apenas).
"""

from __future__ import annotations

import argparse
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link",
        "meta", "param", "source", "track", "wbr"}

# Arquivos que fazem parte do site publicado
IGNORAR_DIRS = {".git", "node_modules", "dados", "__pycache__"}

# Esquemas e prefixos que não são links internos a verificar
EXTERNOS = ("http://", "https://", "mailto:", "tel:", "data:", "javascript:", "#")


class Cores:
    OK = "\033[32m"
    ERRO = "\033[31m"
    AVISO = "\033[33m"
    FRACO = "\033[90m"
    NEG = "\033[1m"
    FIM = "\033[0m"


problemas: list[str] = []
avisos: list[str] = []
pendencias: list[str] = []   # placeholder marcado, esperado durante a produção


def relatar(msg: str) -> None:
    problemas.append(msg)


def avisar(msg: str) -> None:
    avisos.append(msg)


# ---------------------------------------------------------------------------
# 1. HTML — estrutura, ids, links
# ---------------------------------------------------------------------------

class AnalisadorHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pilha: list[tuple[str, int]] = []
        self.ids: set[str] = set()
        self.controles: list[tuple[str, int]] = []
        self.links: list[tuple[str, int]] = []
        self.assets: list[tuple[str, int]] = []
        self.placeholders: list[str] = []
        self.tem_lang = False
        self.tem_viewport = False

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        linha = self.getpos()[0]
        if "id" in d:
            if d["id"] in self.ids:
                relatar(f"{self._arq}:{linha} — id duplicado: {d['id']}")
            self.ids.add(d["id"])
        if "aria-controls" in d:
            self.controles.append((d["aria-controls"], linha))
        if "data-placeholder" in d:
            self.placeholders.append(f"{self._arq}:{linha} — data-placeholder=\"{d['data-placeholder']}\"")

        if tag == "a" and d.get("href"):
            self.links.append((d["href"], linha))
        if tag == "link" and d.get("href") and d.get("rel") in (
            "stylesheet", "preload", "icon", "apple-touch-icon", "manifest"
        ):
            self.assets.append((d["href"], linha))
        if tag == "script" and d.get("src"):
            self.assets.append((d["src"], linha))
        if tag == "img" and d.get("src"):
            self.assets.append((d["src"], linha))

        if tag == "html" and "lang" in d:
            self.tem_lang = True
        if tag == "meta" and d.get("name") == "viewport":
            self.tem_viewport = True

        if tag in VOID:
            return
        self.pilha.append((tag, linha))

    def handle_startendtag(self, tag, attrs):
        d = dict(attrs)
        if "id" in d:
            self.ids.add(d["id"])
        if tag in ("script", "img"):
            ref = d.get("src")
            if ref:
                self.assets.append((ref, self.getpos()[0]))
        elif tag == "link" and d.get("href") and d.get("rel") in (
            "stylesheet", "preload", "icon", "apple-touch-icon", "manifest"
        ):
            self.assets.append((d["href"], self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if not self.pilha:
            relatar(f"{self._arq}:{self.getpos()[0]} — </{tag}> sem abertura")
            return
        if self.pilha[-1][0] == tag:
            self.pilha.pop()
            return
        nomes = [t for t, _ in self.pilha]
        if tag in nomes:
            idx = len(nomes) - 1 - nomes[::-1].index(tag)
            for t, l in self.pilha[idx + 1:]:
                relatar(f"{self._arq}:{l} — <{t}> não fechado antes de </{tag}>")
            self.pilha = self.pilha[:idx]
        else:
            relatar(f"{self._arq}:{self.getpos()[0]} — </{tag}> órfão")


def verificar_html(caminho: Path) -> None:
    parser = AnalisadorHTML()
    parser._arq = str(caminho.relative_to(ROOT))
    parser.feed(caminho.read_text(encoding="utf-8"))

    arquivo = parser._arq

    for t, l in parser.pilha:
        relatar(f"{arquivo}:{l} — <{t}> não fechado")

    for alvo, linha in parser.controles:
        if alvo not in parser.ids:
            relatar(f"{arquivo}:{linha} — aria-controls aponta para id inexistente: {alvo}")

    if not parser.tem_lang:
        avisar(f"{arquivo} — <html> sem atributo lang")
    if not parser.tem_viewport:
        avisar(f"{arquivo} — sem meta viewport (quebra no celular)")

    for ref, linha in parser.links:
        if ref.startswith(EXTERNOS):
            continue
        if ref.startswith("[["):
            pendencias.append(f"{caminho}:{linha} — campo do template não preenchido: {ref}")
            continue

        # link com âncora: além do arquivo, a âncora precisa existir
        if "#" in ref and not ref.startswith("#") and not ref.startswith("mailto:"):
            caminho_ref, _, ancora = ref.partition("#")
            if caminho_ref:
                alvo = (caminho.parent / caminho_ref).resolve()
                if alvo.is_dir():
                    alvo = alvo / "index.html"
                if alvo.exists() and alvo.suffix == ".html":
                    conteudo = alvo.read_text(encoding="utf-8", errors="replace")
                    if ancora and f'id="{ancora}"' not in conteudo:
                        relatar(f"{caminho}:{linha} — âncora inexistente: {ref}")
        if re.match(r"CHECKOUT-URL", ref):
            pendencias.append(f"{caminho}:{linha} — URL de checkout não configurada: {ref}")
            continue
        destino = (caminho.parent / unquote(urlparse(ref).path)).resolve()
        if not destino.exists() and not str(destino).endswith("/") :
            relatar(f"{arquivo}:{linha} — link interno quebrado: {ref}")

    for ref, linha in parser.assets:
        if ref.startswith(("http://", "https://", "//", "data:")):
            relatar(f"{arquivo}:{linha} — requisição externa em runtime: {ref}")
            continue
        destino = (caminho.parent / unquote(urlparse(ref).path)).resolve()
        if not destino.exists():
            relatar(f"{arquivo}:{linha} — arquivo não encontrado: {ref}")

    pendencias.extend(parser.placeholders)


# ---------------------------------------------------------------------------
# 2. CSS — chaves, tokens definidos e usados, arquivos de fonte
# ---------------------------------------------------------------------------

def verificar_css() -> None:
    tokens_css = SITE / "assets" / "css" / "tokens.css"
    if not tokens_css.exists():
        relatar("tokens.css não encontrado — o design system inteiro depende dele")
        return

    definidos: set[str] = set()
    for arquivo in (SITE / "assets" / "css").glob("*.css"):
        texto = arquivo.read_text(encoding="utf-8")
        definidos |= set(re.findall(r"(--[a-z0-9-]+)\s*:", texto))

    for arquivo in sorted((SITE / "assets" / "css").glob("*.css")):
        texto = arquivo.read_text(encoding="utf-8")
        nome = str(arquivo.relative_to(ROOT))

        if texto.count("{") != texto.count("}"):
            relatar(f"{nome} — chaves desbalanceadas ({texto.count('{')} aberturas, "
                    f"{texto.count('}')} fechamentos)")

        sem_reserva = set(re.findall(r"var\((--[a-z0-9-]+)\s*\)", texto))
        faltando = sem_reserva - definidos
        for token in sorted(faltando):
            relatar(f"{nome} — token usado e não definido: {token}")

        # Valores hex fora de tokens.css
        if arquivo.name != "tokens.css":
            hexes = re.findall(r"#[0-9A-Fa-f]{3,8}\b", texto)
            # permitir dentro de gradientes de destaque e sombras com alpha declarado
            hexes = [h for h in hexes if len(h) in (4, 7, 9)]
            if hexes:
                avisar(f"{nome} — {len(hexes)} valor(es) hexadecimal(is) fora de tokens.css")

        # Fontes referenciadas
        for ref in re.findall(r"url\(['\"]?([^'\")]+\.woff2)['\"]?\)", texto):
            destino = (arquivo.parent / ref).resolve()
            if not destino.exists():
                relatar(f"{nome} — arquivo de fonte não encontrado: {ref}")


# ---------------------------------------------------------------------------
# 3. Placeholders e resíduos de rascunho
# ---------------------------------------------------------------------------

PADROES_PENDENCIA = [
    (r"CHECKOUT-URL-(AQUI|HERE)", "URL de checkout não configurada"),
    (r"COLE-AQUI", "host/endpoint de API não configurado"),
    (r"\[\[[^\]]+\]\]", "campo do template de landing page não preenchido"),
    (r"\[CONFIRMAR[^\]]*\]", "campo marcado para confirmação"),
    (r"COLE-O-", "identificador de planilha/hook não configurado"),
]

PADROES_PROIBIDOS = [
    (r"\bTODO\b", "marcador TODO esquecido"),
    (r"(?i)lorem ipsum", "texto de preenchimento esquecido"),
    (r"XXX+", "placeholder genérico esquecido"),
]

EXTENSOES_TEXTO = {".html", ".css", ".js", ".md", ".json", ".py", ".svg"}


# Cópias publicadas dentro de site/area/materiais/: o conteúdo original já é
# verificado nos arquivos de origem. Aqui só a estrutura HTML importa.
ESPELHOS = ("site/area/materiais/kit/", "site/area/materiais/playbook-")


def eh_espelho(rel: str) -> bool:
    return any(rel.replace("\\", "/").startswith(e) for e in ESPELHOS)


def verificar_textos() -> None:
    for arquivo in ROOT.rglob("*"):
        if not arquivo.is_file() or arquivo.suffix not in EXTENSOES_TEXTO:
            continue
        if any(parte in IGNORAR_DIRS for parte in arquivo.parts):
            continue
        if "verificar.py" in arquivo.name:
            continue
        try:
            texto = arquivo.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue

        rel = str(arquivo.relative_to(ROOT))
        if eh_espelho(rel):
            continue  # cópia publicada: a origem é que é auditada
        # remove o conteúdo entre crases: documentação que cita um padrão não é o padrão
        sem_codigo = re.sub(r"`[^`]*`", lambda m: " " * len(m.group(0)), texto)

        for padrao, descricao in PADROES_PENDENCIA:
            if padrao.startswith(r"\[\[") and arquivo.suffix not in (".html", ".md"):
                continue  # em JSON, [[ é sintaxe de array aninhado, não campo de template
            if "landing-page-template" in rel and padrao.startswith(r"\[\["):
                continue  # template por definição: os campos são para preencher
            for m in re.finditer(padrao, sem_codigo):
                linha = texto[:m.start()].count("\n") + 1
                pendencias.append(f"{rel}:{linha} — {descricao}: {m.group(0)[:60]}")
        for padrao, descricao in PADROES_PROIBIDOS:
            for m in re.finditer(padrao, sem_codigo):
                linha = texto[:m.start()].count("\n") + 1
                relatar(f"{rel}:{linha} — {descricao}")


# ---------------------------------------------------------------------------
# 4. Contraste (pares declarados nos tokens)
# ---------------------------------------------------------------------------

def luminancia(hexcor: str) -> float:
    hexcor = hexcor.lstrip("#")
    if len(hexcor) == 3:
        hexcor = "".join(c * 2 for c in hexcor)
    r, g, b = (int(hexcor[i:i + 2], 16) / 255 for i in (0, 2, 4))

    def canal(c: float) -> float:
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)


def contraste(c1: str, c2: str) -> float:
    l1, l2 = luminancia(c1), luminancia(c2)
    claro, escuro = max(l1, l2), min(l1, l2)
    return (claro + 0.05) / (escuro + 0.05)


def verificar_contraste() -> None:
    tokens_css = (SITE / "assets" / "css" / "tokens.css")
    if not tokens_css.exists():
        return
    texto = tokens_css.read_text(encoding="utf-8")

    def valor(token: str) -> str | None:
        m = re.search(rf"{re.escape(token)}\s*:\s*(#[0-9A-Fa-f]{{3,8}})", texto)
        return m.group(1) if m else None

    pares = [
        ("--ink", "--paper", 4.5, "texto principal sobre papel"),
        ("--ink-2", "--paper", 4.5, "texto secundário sobre papel"),
        ("--ink-3", "--paper", 4.5, "legenda sobre papel (piso)"),
        ("--ink-3", "--paper-2", 4.5, "legenda sobre seção alternada"),
        ("--gold", "--paper", 3.0, "acento sobre papel (usado em destaque, não em corpo)"),
        ("--on-night", "--night", 4.5, "texto sobre fundo escuro"),
        ("--on-night-2", "--night", 4.5, "texto suave sobre fundo escuro"),
        ("--gold-bright", "--night", 3.0, "acento sobre fundo escuro"),
        ("--on-night-3", "--night", 4.5, "rodapé sobre fundo escuro"),
        ("--on-night-4", "--night", 4.5, "texto legal sobre fundo escuro"),
        ("--on-gold", "--gold", 4.5, "texto sobre botão dourado"),
        ("--on-gold-night", "--gold-bright", 4.5, "texto sobre botão dourado (tema escuro)"),
    ]

    for token_texto, token_fundo, minimo, descricao in pares:
        cor_texto, cor_fundo = valor(token_texto), valor(token_fundo)
        if not cor_texto or not cor_fundo:
            continue
        razao = contraste(cor_texto, cor_fundo)
        if razao < minimo:
            relatar(f"contraste reprovado: {descricao} — {razao:.2f}:1 (mínimo {minimo}:1)")
        else:
            print(f"  {Cores.OK}✓{Cores.FIM} contraste {razao:5.2f}:1  {Cores.FRACO}{descricao}{Cores.FIM}")


# ---------------------------------------------------------------------------
# 5. Estrutura do produto
# ---------------------------------------------------------------------------

ESPERADOS = [
    "site/index.html", "site/en/index.html", "site/area/index.html",
    "site/kit/index.html", "site/en/kit/index.html",
    "site/ebook/index.html", "site/en/ebook/index.html",
    "site/area/materiais/index.html", "site/area/materiais/playbook-pt.html",
    "site/area/materiais/playbook-en.html",
    "site/assets/css/tokens.css", "site/assets/css/base.css", "site/assets/css/components.css",
    "site/assets/js/main.js", "site/assets/img/favicon.svg", "site/assets/img/og.jpg",
    "site/robots.txt", "site/sitemap.xml", "site/_headers", "site/_redirects",
    "site/legal/termos.html", "site/legal/privacidade.html", "site/legal/licenca.html",
    "kit/prompts/prompts-pt.md", "kit/prompts/prompts-en.md",
    "kit/planilhas/analise-seo.xlsx", "kit/planilhas/growth-dashboard.xlsx",
    "kit/planilhas/calendario-social.xlsx", "kit/planilhas/calculadora-roi.xlsx",
    "kit/checklists/checklist-conversao.md", "kit/checklists/checklist-seo-onpage.md",
    "kit/checklists/checklist-configuracao-rapidapi.md", "kit/checklists/checklist-publicacao.md",
    "kit/templates/landing-page-template/index.html",
    "kit/templates/design-system-starter-kit/README.md",
    "kit/integracoes/n8n/funil-growth-stack.json",
    "kit/codigo/js/growth-stack.js", "kit/codigo/python/growth_stack.py",
    "ebook/pt/index.html", "ebook/en/index.html", "ebook/pt/playbook.md", "ebook/en/playbook.md",
    "tools/gerar_ebook.py", "tools/gerar_paginas_kit.py", "tools/publicar_site.py", "tools/verificar.py",
    "vendas/pagina-de-vendas.md", "vendas/anuncios.md", "vendas/emails.md",
    "00-PROJETO.md",
]


def verificar_estrutura() -> None:
    for item in ESPERADOS:
        if not (ROOT / item).exists():
            relatar(f"arquivo esperado ausente: {item}")

    # Toda URL do sitemap precisa existir de verdade no site publicado.
    sitemap = SITE / "sitemap.xml"
    if sitemap.exists():
        texto = sitemap.read_text(encoding="utf-8")
        for url in re.findall(r"<loc>([^<]+)</loc>", texto):
            caminho = url.split("growthdesignpro.com.br", 1)[-1]
            limpo = caminho.strip("/")
            if limpo == "":
                alvo = SITE / "index.html"
            elif caminho.endswith("/"):
                alvo = SITE / limpo / "index.html"
            else:
                alvo = SITE / limpo
            if not alvo.exists():
                relatar(f"sitemap.xml aponta para página inexistente: {caminho}")


# ---------------------------------------------------------------------------
# Execução
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description="Verifica o produto antes de publicar.")
    parser.add_argument("--quieto", action="store_true", help="mostra só problemas e pendências")
    args = parser.parse_args()

    print(f"\n{Cores.NEG}Growth Design Pro — verificação{Cores.FIM}")
    print(f"{Cores.FRACO}raiz: {ROOT}{Cores.FIM}\n")

    print(f"{Cores.NEG}1. Estrutura{Cores.FIM}")
    verificar_estrutura()
    print(f"  {len(ESPERADOS)} arquivos esperados verificados\n")

    print(f"{Cores.NEG}2. HTML{Cores.FIM}")
    htmls = sorted(SITE.rglob("*.html"))
    for arquivo in htmls:
        verificar_html(arquivo)
        print(f"  {Cores.OK}✓{Cores.FIM} {arquivo.relative_to(ROOT)}")
    print(f"  {len(htmls)} páginas verificadas\n")

    print(f"{Cores.NEG}3. CSS e tokens{Cores.FIM}")
    n_css = len(list((SITE / "assets" / "css").glob("*.css")))
    verificar_css()
    print(f"  {Cores.OK}✓{Cores.FIM} {n_css} arquivos de CSS, chaves balanceadas e tokens resolvidos\n")

    print(f"{Cores.NEG}4. Contraste (WCAG AA){Cores.FIM}")
    verificar_contraste()
    print()

    print(f"{Cores.NEG}5. Placeholders e rascunhos{Cores.FIM}")
    print(f"  {Cores.FRACO}·{Cores.FIM} cópias em site/area/materiais/ não são reauditadas (a origem é)")
    verificar_textos()
    print()

    # --- Relatório
    print("=" * 68)
    if pendencias:
        print(f"\n{Cores.AVISO}{Cores.NEG}PENDÊNCIAS DE PUBLICAÇÃO ({len(pendencias)}){Cores.FIM}")
        print(f"{Cores.FRACO}Esperadas durante a produção. Zere antes de publicar.{Cores.FIM}")
        for p in pendencias[:40]:
            print(f"  {Cores.AVISO}!{Cores.FIM} {p}")
        if len(pendencias) > 40:
            print(f"  {Cores.FRACO}… e mais {len(pendencias) - 40}{Cores.FIM}")

    if avisos:
        print(f"\n{Cores.AVISO}AVISOS ({len(avisos)}){Cores.FIM}")
        for a in avisos[:20]:
            print(f"  {Cores.AVISO}~{Cores.FIM} {a}")
        if len(avisos) > 20:
            print(f"  {Cores.FRACO}… e mais {len(avisos) - 20}{Cores.FIM}")

    if problemas:
        print(f"\n{Cores.ERRO}{Cores.NEG}PROBLEMAS BLOQUEANTES ({len(problemas)}){Cores.FIM}")
        for p in problemas[:60]:
            print(f"  {Cores.ERRO}✗{Cores.FIM} {p}")
        if len(problemas) > 60:
            print(f"  {Cores.FRACO}… e mais {len(problemas) - 60}{Cores.FIM}")
        print()
        return 1

    if pendencias:
        print(f"\n{Cores.AVISO}Sem problemas bloqueantes.{Cores.FIM} "
              f"{len(pendencias)} pendência(s) de publicação a resolver.\n")
        return 0

    print(f"\n{Cores.OK}{Cores.NEG}Tudo limpo.{Cores.FIM} "
          f"{len(htmls)} páginas, sem link quebrado, sem placeholder pendente.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
