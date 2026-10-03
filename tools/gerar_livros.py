#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera os e-books (PDF + EPUB) do Projeto Quatro Ativos a partir dos markdown-fonte.

Uso:
    python3 tools/gerar_livros.py

Saída: projeto-4-infoprodutos/entregaveis/
  Livro-1-.../  Livro-1.pdf, Livro-1-BONUS.pdf, Livro-1.epub, fonte-markdown/
  Livro-2-.../  ...
  Kit-Livros-1-2-3.zip
"""

import os
import re
import shutil
import zipfile
import datetime

from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Preformatted, CondPageBreak, NextPageTemplate
)
from reportlab.platypus.tableofcontents import TableOfContents

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(RAIZ, "projeto-4-infoprodutos")
SAIDA = os.path.join(BASE, "entregaveis")

DATA = datetime.date.today().strftime("%d/%m/%Y")
ANO = datetime.date.today().year

# ---------------------------------------------------------------- configuração

LIVROS = [
    dict(
        slug="Livro-1-IA-que-Trabalha-por-Voce",
        fonte="livro-1",
        titulo="IA QUE TRABALHA POR VOCÊ",
        subtitulo="200 prompts e 12 automações prontas para recuperar 10 horas por semana",
        promessa="Método 5D — Diagnóstico · Delegação · Direção · Documentação · Dinheiro",
        colecao="COLEÇÃO VIDA EM ORDEM · VOLUME 1",
        bonus_desc="200 prompts, 12 automações, tabela de preços e ferramentas",
        primaria="#1B2A4A",
        acento="#00A98A",
        claro="#E8F7F3",
        corpo=[
            "00-abertura.md",
            "01-cap1-a-conta-que-ninguem-faz.md",
            "02-cap2-ia-sem-mito.md",
            "03-cap3-d1-diagnostico.md",
            "04-cap4-d2-delegacao.md",
            "05-cap5-d3-direcao.md",
            "06-cap6-d4-documentacao.md",
            "07-cap7-d5-dinheiro.md",
            "08-cap8-automacoes.md",
            "09-cap9-prompts-por-profissao.md",
            "10-cap10-etica-limites.md",
            "11-cap11-plano-30-dias.md",
            "12-cap12-proximos-passos.md",
        ],
        bonus=[
            "bonus-200-prompts-1.md",
            "bonus-200-prompts-2.md",
            "bonus-12-automacoes.md",
            "bonus-tabela-de-precos.md",
            "bonus-scripts-e-ferramentas.md",
        ],
    ),
    dict(
        slug="Livro-2-Saia-do-Vermelho-em-60-Dias",
        fonte="livro-2",
        titulo="SAIA DO VERMELHO EM 60 DIAS",
        subtitulo="O método de negociação que cabe no seu bolso — 15 scripts prontos para usar",
        promessa="Método R.E.A.L. — Raio-X · Enxugamento · Acordo · Liquidação",
        colecao="COLEÇÃO VIDA EM ORDEM · VOLUME 2",
        bonus_desc="15 scripts, ferramentas de negociação e planilhas",
        primaria="#0E3B2E",
        acento="#B58A0F",
        claro="#FBF4E2",
        corpo=[
            "00-abertura.md",
            "01-cap1-raio-x.md",
            "02-cap2-enxugamento.md",
            "03-cap3-como-o-credor-pensa.md",
            "04-cap4-as-6-regras-de-ouro.md",
            "05-cap5-os-15-scripts.md",
            "06-cap6-quanto-oferecer.md",
            "07-cap7-bola-de-neve.md",
            "08-cap8-depois-do-acordo.md",
            "09-cap9-guia-juridico-basico.md",
            "10-cap10-plano-60-dias.md",
            "11-cap11-historias.md",
            "12-cap12-blindagem.md",
        ],
        bonus=[
            "bonus-15-scripts.md",
            "bonus-ferramentas.md",
        ],
    ),
    dict(
        slug="Livro-3-Airfryer-Sem-Mimimi",
        fonte="livro-3",
        titulo="AIRFRYER SEM MIMIMI",
        subtitulo="120 receitas com tempo, custo, temperatura e litragem — e 7 dias de comida em 90 minutos",
        promessa="Sistema 20-5-7 — 20 minutos · 5 ingredientes · 7 dias",
        colecao="COLEÇÃO VIDA EM ORDEM · VOLUME 3",
        primaria="#5A1F0E",
        acento="#F2A93B",
        claro="#FDF3E4",
        bonus_desc="tabela mestra, guia de congelamento, custo por porção, listas de compra, cardápio de 30 dias, 20 temperos e o cronograma de 90 minutos",
        corpo=[
            "00-abertura.md",
            "01-cap1-os-6-segredos.md",
            "02-cap2-despensa-de-guerra.md",
            "03-cap3-as-8-tecnicas-base.md",
            "04-cap4-jantares-em-20-minutos.md",
            "05-cap5-almocos-classicos.md",
            "06-cap6-as-7-marmitas-do-domingo.md",
            "07-cap7-lanches-e-petiscos.md",
            "08-cap8-doces-sem-estourar.md",
            "09-cap9-cafe-da-manha.md",
            "10-cap10-molhos-e-temperos.md",
            "11-cap11-vegetarianas.md",
            "12-cap12-feira-de-domingo.md",
        ],
        bonus=[
            "bonus-tabela-mestra.md",
            "bonus-custo-por-porcao.md",
            "bonus-lista-de-compras-e-cardapio.md",
            "bonus-temperos-e-molhos.md",
            "bonus-domingo-90-minutos.md",
        ],
    ),
    dict(
        slug="Livro-4-Energia-em-21-Dias",
        fonte="livro-4",
        titulo="ENERGIA EM 21 DIAS",
        subtitulo="O protocolo S.O.N.O. — 15 minutos por dia para organizar suas noites e suas manhãs",
        promessa="Protocolo S.O.N.O. — Sol · Ordem · Nada de cafeína depois do X · Otimize o quarto",
        colecao="COLEÇÃO VIDA EM ORDEM · VOLUME 4",
        primaria="#1E2A5A",
        acento="#E8B65A",
        claro="#F0F3FA",
        bonus_desc="3 roteiros de áudio guiado, rastreador de 21 dias, checklist de geladeira, desintoxicação digital de 7 noites, 12 rituais de manhã e protocolo de emergência",
        corpo=[
            "00-abertura.md",
            "01-cap1-relogio-desalinhado.md",
            "02-cap2-protocolo-sono.md",
            "03-cap3-semana1-ancorar.md",
            "04-cap4-semana2-ajustar.md",
            "05-cap5-semana3-automatizar.md",
            "06-cap6-os-3-blocos.md",
            "07-cap7-alimentacao-sem-dieta.md",
            "08-cap8-movimento-minimo.md",
            "09-cap9-mente-que-nao-desliga.md",
            "10-cap10-plano-90-dias.md",
            "11-cap11-historias-e-faq.md",
            "12-cap12-rastreador-final.md",
        ],
        bonus=[
            "bonus-audios-guiados.md",
            "bonus-rastreador-21-dias.md",
            "bonus-checklist-geladeira.md",
            "bonus-desintox-digital-7-dias.md",
            "bonus-12-rituais-de-manha.md",
            "bonus-protocolo-de-emergencia.md",
        ],
    ),
]

# ------------------------------------------------------------ limpeza de glifos

REPL = {
    "🟦": "", "🟨": "", "🟩": "", "🟥": "", "🟪": "", "📎": "", "📌": "", "🔎": "",
    "⚠️": "!", "⚠": "!", "✅": "[x]", "❌": "[ ]", "☑": "[x]", "☐": "[ ]",
    "🔴": "[ALTO]", "🟡": "[MÉDIO]", "🟢": "[BAIXO]",
    "🚨": "!", "👉": "->", "→": "->", "←": "<-", "≤": "<=", "≥": ">=", "×": "x",
    "▸": "-", "●": "-", "▓": "#", "░": ".", "│": "|", "─": "-", "━": "-",
    "└": "-", "├": "-", "┌": "-", "┐": "-", "┘": "-", "┴": "-", "┬": "-", "┼": "-",
    "⭐": "*", "🌟": "*", "💡": "", "🔥": "", "🚀": "", "📈": "", "📊": "", "🎨": "",
    "✍️": "", "✍": "", "💰": "", "🧠": "", "🧭": "", "🌍": "", "🛡️": "", "🛡": "",
    "📦": "", "📘": "", "📕": "", "📗": "", "📙": "", "⏱": "", "⌛": "", "🔧": "",
    "⚙": "", "✦": "", "✨": "", "🥇": "", "🏆": "", "🆕": "", "💥": "", "🙂": "",
    "🄰": "", "\ufe0f": "", "\u200b": "", "🟧": "", "🅐": "",
    "□": "[ ]", "☐": "[ ]", "☑": "[x]", "−": "-", "↓": "v", "↑": "^",
    "•": "-", "▫": "-", "◻": "[ ]", "■": "*", "＝": "=", "≠": "!=", "≈": "~", "🔵": "", "⚪": "", "😴": "", "🌞": "", "☀": "", "☀️": "", "🌙": "", "🧘": "",
}

DESCARTADOS = {}


def limpar(txt):
    """Troca emojis por equivalentes de texto e descarta o que não for latino."""
    for k, v in REPL.items():
        txt = txt.replace(k, v)
    fora = []
    saida = []
    for ch in txt:
        try:
            ch.encode("cp1252")
            saida.append(ch)
        except UnicodeEncodeError:
            fora.append(ch)
    if fora:
        for ch in fora:
            DESCARTADOS[ch] = DESCARTADOS.get(ch, 0) + 1
    return "".join(saida)


# ------------------------------------------------------------ parser markdown

def inline_md(txt):
    """Converte markdown inline para o dialeto do ReportLab (com limpeza antes)."""
    txt = limpar(txt)
    txt = txt.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    txt = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", txt)
    txt = re.sub(r"(?<!\*)\*([^*\n]+?)\*(?!\*)", r"<i>\1</i>", txt)
    txt = re.sub(r"`([^`]+?)`", r'<font face="Courier">\1</font>', txt)
    txt = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", txt)
    return txt.strip()


def inline_xhtml(txt):
    """Mesma conversão, mas para HTML (EPUB)."""
    txt = limpar(txt)
    txt = txt.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    txt = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", txt)
    txt = re.sub(r"(?<!\*)\*([^*\n]+?)\*(?!\*)", r"<em>\1</em>", txt)
    txt = re.sub(r"`([^`]+?)`", r"<code>\1</code>", txt)
    txt = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1", txt)
    return txt.strip()


def analisar_caixa(linhas):
    """Devolve (tipo, rotulo_ou_None, linhas_do_corpo)."""
    primeira = linhas[0] if linhas else ""
    tem_marca = bool(re.match(r"^\s*[🟦🟨🟩🟥🟪📌⚠⭐🚨👉✅❌💡]", primeira))
    bruto = primeira.upper()
    tipo = "nota"
    for chave, valor in (("FAÇA AGORA", "faca"), ("FACA AGORA", "faca"),
                         ("SCRIPT", "script"), ("CHECKLIST", "check"),
                         ("EXEMPLO REAL", "exemplo"), ("POR QUE ISSO FUNCIONA", "exemplo"),
                         ("ERRO COMUM", "alerta"), ("ATENÇÃO", "alerta"),
                         ("ATENCAO", "alerta"), ("AVISO", "alerta"),
                         ("IMPORTANTE", "alerta"), ("LEMBRETE", "alerta")):
        if chave in bruto:
            tipo = valor
            break

    if tipo != "nota" or tem_marca:
        rot = re.sub(r"[*`#]", "", limpar(primeira))
        rot = re.sub(r"^[\s\-—:•]+", "", rot).strip(" :—-")
        if tipo == "nota":
            tipo = "alerta" if any(k in rot.upper() for k in ("ATEN", "AVISO", "CUIDADO")) else "nota"
        if not rot:
            rot = ETQ[tipo]
        return tipo, rot, linhas[1:]
    return "nota", None, linhas


ETQ = {
    "faca":    "FAÇA AGORA",
    "script":  "SCRIPT",
    "check":   "CHECKLIST",
    "exemplo": "EXEMPLO",
    "alerta":  "ATENÇÃO",
    "nota":    "NOTA",
}


def parse_md(texto):
    """Markdown -> lista de blocos."""
    linhas = texto.replace("\r\n", "\n").split("\n")
    blocos, i, n = [], 0, len(linhas)

    while i < n:
        ln = linhas[i]
        s = ln.strip()

        if not s:
            i += 1
            continue

        # código
        if s.startswith("```"):
            i += 1
            buf = []
            while i < n and not linhas[i].strip().startswith("```"):
                buf.append(linhas[i])
                i += 1
            i += 1
            blocos.append(("code", "\n".join(buf)))
            continue

        # títulos
        m = re.match(r"^(#{1,6})\s+(.*)$", s)
        if m:
            nivel = len(m.group(1))
            blocos.append(("h%d" % min(nivel, 3), m.group(2).strip()))
            i += 1
            continue

        # linha horizontal
        if re.match(r"^-{3,}$", s) or re.match(r"^\*{3,}$", s):
            blocos.append(("hr", ""))
            i += 1
            continue

        # citação / caixa
        if s.startswith(">"):
            buf = []
            while i < n and linhas[i].strip().startswith(">"):
                buf.append(re.sub(r"^\s*>\s?", "", linhas[i]).rstrip())
                i += 1
            while buf and not buf[-1].strip():
                buf.pop()
            blocos.append(("quote", buf))
            continue

        # tabela
        if s.startswith("|") and s.count("|") >= 2:
            rows = []
            while i < n and linhas[i].strip().startswith("|"):
                linhas_tab = linhas[i].strip()
                cells = [c.strip() for c in linhas_tab.strip("|").split("|")]
                if not re.match(r"^[\s:\-|]+$", linhas_tab):
                    rows.append(cells)
                i += 1
            if rows:
                blocos.append(("table", rows))
            continue

        # listas
        if re.match(r"^[-*]\s+", s):
            itens = []
            while i < n and re.match(r"^\s*[-*]\s+", linhas[i]):
                itens.append(re.sub(r"^\s*[-*]\s+", "", linhas[i]).strip())
                i += 1
                # continuação indentada
                while i < n and linhas[i].startswith("  ") and linhas[i].strip() and \
                        not re.match(r"^\s*[-*]\s+", linhas[i]):
                    itens[-1] += " " + linhas[i].strip()
                    i += 1
            blocos.append(("ul", itens))
            continue

        if re.match(r"^\d+[.)]\s+", s):
            itens = []
            while i < n and re.match(r"^\s*\d+[.)]\s+", linhas[i]):
                itens.append(re.sub(r"^\s*\d+[.)]\s+", "", linhas[i]).strip())
                i += 1
                while i < n and linhas[i].startswith("  ") and linhas[i].strip() and \
                        not re.match(r"^\s*[-*]\s+", linhas[i]) and \
                        not re.match(r"^\s*\d+[.)]\s+", linhas[i]):
                    itens[-1] += " " + linhas[i].strip()
                    i += 1
            blocos.append(("ol", itens))
            continue

        # parágrafo
        buf = [s]
        i += 1
        while i < n:
            nxt = linhas[i].strip()
            if (not nxt or nxt.startswith("#") or nxt.startswith(">")
                    or nxt.startswith("|") or nxt.startswith("```")
                    or re.match(r"^[-*]\s+", nxt) or re.match(r"^\d+[.)]\s+", nxt)
                    or re.match(r"^-{3,}$", nxt)):
                break
            buf.append(nxt)
            i += 1
        blocos.append(("p", " ".join(buf)))
    return blocos


# ------------------------------------------------------------------ estilos PDF

def montar_estilos(cfg):
    prim = colors.HexColor(cfg["primaria"])
    ace = colors.HexColor(cfg["acento"])
    claro = colors.HexColor(cfg["claro"])
    escuro = colors.HexColor("#22252B")
    cinza = colors.HexColor("#5A6270")

    e = {}
    e["base"] = ParagraphStyle(
        "base", fontName="Helvetica", fontSize=9.3, leading=14.2,
        textColor=escuro, alignment=TA_JUSTIFY, spaceAfter=6, firstLineIndent=0)
    e["h1"] = ParagraphStyle(
        "H1", fontName="Helvetica-Bold", fontSize=19, leading=23, textColor=prim,
        spaceBefore=0, spaceAfter=6, pageBreakBefore=1)
    e["h1primeiro"] = ParagraphStyle(
        "H1p", parent=e["h1"], pageBreakBefore=0, spaceBefore=0)
    e["h2"] = ParagraphStyle(
        "H2", fontName="Helvetica-Bold", fontSize=12.4, leading=16, textColor=ace,
        spaceBefore=13, spaceAfter=5)
    e["h3"] = ParagraphStyle(
        "H3", fontName="Helvetica-BoldOblique", fontSize=10.4, leading=14,
        textColor=prim, spaceBefore=9, spaceAfter=3)
    e["cap"] = ParagraphStyle(
        "CAP", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=ace,
        spaceBefore=0, spaceAfter=2)
    e["bul"] = ParagraphStyle(
        "BUL", parent=e["base"], leftIndent=13, bulletIndent=4, spaceAfter=3,
        alignment=TA_LEFT)
    e["num"] = ParagraphStyle(
        "NUM", parent=e["base"], leftIndent=17, bulletIndent=4, spaceAfter=3,
        alignment=TA_LEFT)
    e["quote"] = ParagraphStyle(
        "QUOTE", parent=e["base"], fontSize=9.1, leading=13.6, spaceAfter=5,
        leftIndent=5, rightIndent=5, alignment=TA_LEFT)
    e["etq"] = ParagraphStyle(
        "ETQ", fontName="Helvetica-Bold", fontSize=7.6, leading=10,
        textColor=colors.white, spaceAfter=0, spaceBefore=0)
    e["pre"] = ParagraphStyle(
        "PRE", fontName="Courier", fontSize=7.2, leading=9.4, textColor=escuro,
        backColor=colors.HexColor("#F4F5F7"), borderColor=colors.HexColor("#D7DBE0"),
        borderWidth=0.6, borderPadding=7, leftIndent=2, rightIndent=2,
        spaceBefore=4, spaceAfter=8, borderRadius=3)
    e["th"] = ParagraphStyle(
        "TH", fontName="Helvetica-Bold", fontSize=7.6, leading=9.6,
        textColor=colors.white)
    e["td"] = ParagraphStyle(
        "TD", fontName="Helvetica", fontSize=7.4, leading=9.6, textColor=escuro)
    e["toc_t"] = ParagraphStyle(
        "TOCT", fontName="Helvetica-Bold", fontSize=15, leading=18, textColor=prim,
        spaceAfter=10)
    e["cred"] = ParagraphStyle(
        "CRED", fontName="Helvetica", fontSize=7.6, leading=11,
        textColor=cinza, alignment=TA_CENTER)
    e["capa_sub"] = ParagraphStyle(
        "CSUB", fontName="Helvetica", fontSize=10, leading=14,
        textColor=colors.white, alignment=TA_CENTER)
    return e


PALETA = {
    "faca":    ("#0B6E5A", "#E4F6F1"),
    "script":  ("#8A3A22", "#FBEDE7"),
    "check":   ("#3B3470", "#EFEDFA"),
    "exemplo": ("#1E5B33", "#EAF4EC"),
    "alerta":  ("#8A6100", "#FDF4DC"),
    "nota":    ("#2C3E52", "#EEF1F5"),
}


def caixa_pdf(linhas, estilos):
    """Renderiza uma citação como caixa colorida."""
    tipo, rotulo, corpo = analisar_caixa(linhas)
    borda, fundo = PALETA[tipo]
    escuro = colors.HexColor(borda)
    f = []

    if rotulo:
        f.append(Paragraph(limpar(rotulo).upper(), estilos["etq"]))

    est = estilos["quote"]
    buf = []
    for ln in corpo:
        t = ln.strip()
        if not t:
            if buf:
                f.append(Paragraph(inline_md(" ".join(buf)), est))
                buf = []
            continue
        m_item = re.match(r"^[-*]\s+(.*)$", t)
        m_num = re.match(r"^(\d+)[.)]\s+(.*)$", t)
        if m_item:
            if buf:
                f.append(Paragraph(inline_md(" ".join(buf)), est))
                buf = []
            txt = m_item.group(1).strip()
            if txt.startswith("[ ]") or txt.startswith("[x]"):
                marca = "( )" if txt.startswith("[ ]") else "(x)"
                f.append(Paragraph(inline_md(re.sub(r"^\[[ x]\]\s*", "", txt)),
                                   estilos["bul"], bulletText=marca))
            else:
                f.append(Paragraph(inline_md(txt), estilos["bul"], bulletText="•"))
            continue
        if m_num:
            if buf:
                f.append(Paragraph(inline_md(" ".join(buf)), est))
                buf = []
            f.append(Paragraph(inline_md(m_num.group(2)), estilos["num"],
                               bulletText=m_num.group(1) + "."))
            continue
        buf.append(t)
    if buf:
        f.append(Paragraph(inline_md(" ".join(buf)), est))

    if not f:
        return []

    tab = Table([[f]], colWidths=["100%"])
    borda_w = 0.4 if tipo == "nota" and not rotulo else 0.4
    tab.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(fundo)),
        ("LINEBEFORE", (0, 0), (0, -1), 2.6 if rotulo else 1.4, escuro),
        ("BOX", (0, 0), (-1, -1), borda_w, colors.HexColor(borda)),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return [Spacer(1, 3), tab, Spacer(1, 7)]


def tabela_pdf(rows, estilos, largura):
    cab = [Paragraph(inline_md(c), estilos["th"]) for c in rows[0]]
    corpo = [[Paragraph(inline_md(c), estilos["td"]) for c in r] for r in rows[1:]]
    dados = [cab] + corpo
    ncol = max(len(r) for r in rows)
    for r in dados:
        while len(r) < ncol:
            r.append(Paragraph("", estilos["td"]))
    # larguras: iguais, ajustando para tabelas muito largas
    if ncol <= 2:
        pesos = [1.0] * ncol
    else:
        pesos = []
        for c in range(ncol):
            celulas = [re.sub(r"\*\*|`", "", r[c]) for r in rows if c < len(r)]
            maior = max(len(x) for x in celulas)
            # piso = maior palavra da coluna (evita quebra no meio de palavra)
            palavras = [len(w) for x in celulas for w in x.split()] or [6]
            piso = min(max(palavras) + 2, 28)
            pesos.append(max(piso, min(maior, 44)))
    total = sum(pesos)
    larguras = [largura * p / total for p in pesos]
    # garante largura minima por coluna (redistribui das colunas folgadas)
    MINW = max(16.0, min(26.0, largura / max(ncol, 1) * 0.72))
    for _ in range(10):
        falta = sum(MINW - w for w in larguras if w < MINW)
        doadores = [i for i, w in enumerate(larguras) if w > MINW + 2]
        if falta <= 0.5 or not doadores:
            break
        excesso = sum(larguras[i] - MINW for i in doadores)
        if excesso <= 0.5:
            break
        for i in doadores:
            larguras[i] -= falta * (larguras[i] - MINW) / excesso
        larguras = [max(w, MINW) for w in larguras]
    t = Table(dados, colWidths=larguras, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(estilos["_primaria"])),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1),
         [colors.white, colors.HexColor("#F7F8FA")]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#C9CFD8")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5),
    ]))
    return t


def quebrar_linhas(txt, limite=96):
    saida = []
    for ln in txt.split("\n"):
        while len(ln) > limite:
            corte = ln.rfind(" ", 0, limite)
            if corte < 20:
                corte = limite
            saida.append(ln[:corte])
            ln = "   " + ln[corte:].lstrip()
        saida.append(ln)
    return "\n".join(saida)


# --------------------------------------------------------------- doc template

class LivroDoc(BaseDocTemplate):
    def __init__(self, nome, cfg, estilos, **kw):
        self.cfg = cfg
        self.estilos = estilos
        BaseDocTemplate.__init__(self, nome, **kw)

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph):
            nome = flowable.style.name
            if nome in ("H1", "H1p"):
                self.notify("TOCEntry", (0, flowable.getPlainText(), self.page))
            elif nome == "H2":
                self.notify("TOCEntry", (1, flowable.getPlainText(), self.page))


def rodape(canvas, doc, cfg):
    canvas.saveState()
    prim = colors.HexColor(cfg["primaria"])
    canvas.setFillColor(colors.HexColor("#9AA3AF"))
    canvas.setFont("Helvetica", 6.6)
    canvas.drawString(14 * mm, 9 * mm, cfg["titulo"])
    canvas.drawRightString(A5[0] - 14 * mm, 9 * mm, "pág. %d" % doc.page)
    canvas.setStrokeColor(colors.HexColor("#E1E5EA"))
    canvas.setLineWidth(0.4)
    canvas.line(14 * mm, 12 * mm, A5[0] - 14 * mm, 12 * mm)
    canvas.setFillColor(prim)
    canvas.restoreState()


def capa(canvas, doc, cfg):
    prim = colors.HexColor(cfg["primaria"])
    ace = colors.HexColor(cfg["acento"])
    L, A = A5
    canvas.saveState()
    canvas.setFillColor(prim)
    canvas.rect(0, 0, L, A, stroke=0, fill=1)
    # faixa de acento
    canvas.setFillColor(ace)
    canvas.rect(0, A - 46 * mm, L, 5 * mm, stroke=0, fill=1)
    canvas.setFillColor(ace)
    canvas.rect(18 * mm, 30 * mm, 26 * mm, 1.6 * mm, stroke=0, fill=1)

    # coleção
    canvas.setFillColor(colors.Color(1, 1, 1, 0.72))
    canvas.setFont("Helvetica-Bold", 7.6)
    canvas.drawString(18 * mm, A - 34 * mm, cfg["colecao"])

    # título (quebra em linhas)
    canvas.setFillColor(colors.white)
    tamanho = 27
    palavras = cfg["titulo"].split()
    linhas, atual = [], ""
    for p in palavras:
        teste = (atual + " " + p).strip()
        if canvas.stringWidth(teste, "Helvetica-Bold", tamanho) < L - 36 * mm:
            atual = teste
        else:
            linhas.append(atual)
            atual = p
    linhas.append(atual)
    y = A - 60 * mm
    for ln in linhas:
        canvas.setFont("Helvetica-Bold", tamanho)
        canvas.drawString(18 * mm, y, ln)
        y -= tamanho * 1.16
    # subtítulo
    y -= 4 * mm
    canvas.setFont("Helvetica", 9.6)
    canvas.setFillColor(colors.Color(1, 1, 1, 0.86))
    sub = cfg["subtitulo"]
    palavras = sub.split()
    linhas, atual = [], ""
    for p in palavras:
        teste = (atual + " " + p).strip()
        if canvas.stringWidth(teste, "Helvetica", 9.6) < L - 40 * mm:
            atual = teste
        else:
            linhas.append(atual)
            atual = p
    linhas.append(atual)
    for ln in linhas:
        canvas.drawString(18 * mm, y, ln)
        y -= 12
    # promessa
    canvas.setFont("Helvetica-Oblique", 8.2)
    canvas.setFillColor(ace)
    canvas.drawString(18 * mm, y - 3 * mm, cfg["promessa"])
    # rodapé da capa
    canvas.setFillColor(colors.Color(1, 1, 1, 0.55))
    canvas.setFont("Helvetica", 7)
    canvas.drawString(18 * mm, 20 * mm, "Edição %s · material educacional" % ANO)
    canvas.drawRightString(L - 18 * mm, 20 * mm, "R$ 47")
    canvas.restoreState()


def pagina_simples(canvas, doc, cfg):
    rodape(canvas, doc, cfg)


def construir_pdf(cfg, arquivos, destino, estilos, com_toc=True):
    prim = colors.HexColor(cfg["primaria"])
    estilos["_primaria"] = cfg["primaria"]
    largura_frame = A5[0] - 30 * mm

    doc = LivroDoc(
        destino, cfg, estilos,
        pagesize=A5,
        leftMargin=15 * mm, rightMargin=15 * mm,
        topMargin=16 * mm, bottomMargin=16 * mm,
        title=cfg["titulo"], author=cfg["colecao"])

    capa_frame = Frame(0, 0, A5[0], A5[1], id="capa",
                       leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    texto_frame = Frame(15 * mm, 16 * mm, largura_frame, A5[1] - 32 * mm, id="texto")
    doc.addPageTemplates([
        PageTemplate(id="capa", frames=[capa_frame], onPage=lambda c, d: capa(c, d, cfg)),
        PageTemplate(id="texto", frames=[texto_frame], onPage=lambda c, d: pagina_simples(c, d, cfg)),
    ])

    story = [NextPageTemplate("texto"), PageBreak()]

    if com_toc:
        story.append(Paragraph("SUMÁRIO", estilos["toc_t"]))
        toc = TableOfContents()
        toc.levelStyles = [
            ParagraphStyle(name="toc0", fontName="Helvetica-Bold", fontSize=8.6,
                           leading=13, textColor=prim, spaceBefore=4),
            ParagraphStyle(name="toc1", fontName="Helvetica", fontSize=7.8,
                           leading=11, textColor=colors.HexColor("#444"), leftIndent=10),
        ]
        story.append(toc)
        story.append(PageBreak())

    primeiro = True
    for arq in arquivos:
        caminho = os.path.join(BASE, cfg["fonte"], arq)
        if not os.path.exists(caminho):
            print("  !! faltando:", arq)
            continue
        with open(caminho, encoding="utf-8") as fh:
            blocos = parse_md(fh.read())

        for tipo, val in blocos:
            if tipo in ("h1", "h2", "h3"):
                if tipo == "h1":
                    st = estilos["h1primeiro"] if primeiro else estilos["h1"]
                    primeiro = False
                    story.append(Paragraph(inline_md(val), st))
                    story.append(Table([[""]], colWidths=[largura_frame],
                                       rowHeights=[1.6],
                                       style=TableStyle([
                                           ("BACKGROUND", (0, 0), (-1, -1),
                                            colors.HexColor(cfg["acento"])),
                                       ])))
                    story.append(Spacer(1, 8))
                elif tipo == "h2":
                    story.append(Paragraph(inline_md(val), estilos["h2"]))
                else:
                    story.append(Paragraph(inline_md(val), estilos["h3"]))
            elif tipo == "p":
                story.append(Paragraph(inline_md(val), estilos["base"]))
            elif tipo == "ul":
                for item in val:
                    it = item.strip()
                    if it.startswith("[ ]") or it.startswith("[x]"):
                        marca = "( )" if it.startswith("[ ]") else "(x)"
                        story.append(Paragraph(
                            inline_md(re.sub(r"^\[[ x]\]\s*", "", it)),
                            estilos["bul"], bulletText=marca))
                    else:
                        story.append(Paragraph(inline_md(item), estilos["bul"],
                                               bulletText="•"))
            elif tipo == "ol":
                for i, item in enumerate(val, 1):
                    story.append(Paragraph(inline_md(item), estilos["num"],
                                           bulletText="%d." % i))
            elif tipo == "table":
                story.append(Spacer(1, 3))
                story.append(tabela_pdf(val, estilos, largura_frame))
                story.append(Spacer(1, 8))
            elif tipo == "quote":
                story.extend(caixa_pdf(val, estilos))
            elif tipo == "code":
                story.append(Preformatted(
                    limpar(quebrar_linhas(val)), estilos["pre"]))
            elif tipo == "hr":
                story.append(Spacer(1, 6))

    doc.multiBuild(story)
    return doc.page


# -------------------------------------------------------------------- EPUB

def epub_xhtml(titulo, corpo_html, cfg):
    ace = cfg["acento"]
    return """<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt-BR" lang="pt-BR">
<head>
<meta charset="utf-8"/>
<title>%s</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
%s
</body>
</html>""" % (titulo, corpo_html)


def css_epub(cfg):
        return """@charset "utf-8";
    body { font-family: Georgia, serif; font-size: 1em; line-height: 1.55; margin: 0 5%%; }
    h1 { font-size: 1.5em; color: %s; margin: 1.2em 0 .4em; page-break-before: always; }
    h2 { font-size: 1.18em; color: %s; margin: 1.3em 0 .35em; }
    h3 { font-size: 1.02em; color: %s; margin: 1.1em 0 .3em; font-style: italic; }
    p { margin: 0 0 .7em; text-align: justify; }
    ul, ol { margin: 0 0 .8em 1.1em; padding: 0; }
    li { margin-bottom: .3em; }
    blockquote { margin: .9em 0; padding: .6em .8em; border-left: 4px solid #888; background: #f4f4f4; }
    blockquote.faca { border-color: #0B6E5A; background: #E4F6F1; }
    blockquote.alerta { border-color: #8A6100; background: #FDF4DC; }
    blockquote.exemplo { border-color: #1E5B33; background: #EAF4EC; }
    blockquote.script { border-color: #8A3A22; background: #FBEDE7; }
    blockquote.check { border-color: #3B3470; background: #EFEDFA; }
    blockquote .etq { display: block; font-size: .72em; letter-spacing: .12em;
      font-weight: bold; text-transform: uppercase; margin-bottom: .35em; }
    pre { font-family: "Courier New", monospace; font-size: .78em; line-height: 1.35;
      background: #F4F5F7; border: 1px solid #D7DBE0; padding: .7em; overflow-x: auto;
      white-space: pre-wrap; }
    table { border-collapse: collapse; width: 100%%; margin: .8em 0; font-size: .82em; }
    th { background: %s; color: #fff; text-align: left; padding: .35em .45em; }
    td { border: 1px solid #C9CFD8; padding: .32em .45em; vertical-align: top; }
    tr:nth-child(even) td { background: #F7F8FA; }
    hr { border: 0; border-top: 1px solid #ccc; margin: 1.2em 0; }
""" % (cfg["primaria"], cfg["acento"], cfg["primaria"], cfg["primaria"])


def md_para_xhtml(blocos):
    partes = []
    for tipo, val in blocos:
        if tipo in ("h1", "h2", "h3"):
            partes.append("<%s>%s</%s>" % (tipo, inline_xhtml(val), tipo))
        elif tipo == "p":
            partes.append("<p>%s</p>" % inline_xhtml(val))
        elif tipo == "ul":
            itens = []
            for it in val:
                item = re.sub(r"^\[[ x]\]\s*", "", it.strip())
                itens.append("<li>%s</li>" % inline_xhtml(item))
            partes.append("<ul>%s</ul>" % "".join(itens))
        elif tipo == "ol":
            itens = ["<li>%s</li>" % inline_xhtml(it) for it in val]
            partes.append("<ol>%s</ol>" % "".join(itens))
        elif tipo == "table":
            linhas = []
            for idx, r in enumerate(val):
                tag = "th" if idx == 0 else "td"
                cels = "".join("<%s>%s</%s>" % (tag, inline_xhtml(c), tag) for c in r)
                linhas.append("<tr>%s</tr>" % cels)
            partes.append("<table>%s</table>" % "".join(linhas))
        elif tipo == "quote":
            classe, rotulo, corpo_linhas = analisar_caixa(val)
            corpo = []
            if rotulo:
                corpo.append('<span class="etq">%s</span>' % inline_xhtml(rotulo.upper()))
            for ln in corpo_linhas:
                t = ln.strip()
                if not t:
                    continue
                m = re.match(r"^[-*]\s+(.*)$", t)
                if m:
                    item = re.sub(r"^\[[ x]\]\s*", "", m.group(1))
                    corpo.append("<p>- %s</p>" % inline_xhtml(item))
                else:
                    corpo.append("<p>%s</p>" % inline_xhtml(t))
            partes.append('<blockquote class="%s">%s</blockquote>' % (classe, "".join(corpo)))
        elif tipo == "code":
            partes.append("<pre>%s</pre>" % inline_xhtml(val))
        elif tipo == "hr":
            partes.append("<hr/>")
    return "\n".join(partes)


def gerar_epub(cfg, arquivos, destino):
    capitulos = []
    for i, arq in enumerate(arquivos, 1):
        caminho = os.path.join(BASE, cfg["fonte"], arq)
        if not os.path.exists(caminho):
            continue
        with open(caminho, encoding="utf-8") as fh:
            blocos = parse_md(fh.read())
        titulo = "Capítulo %d" % i
        for t, v in blocos:
            if t == "h1":
                titulo = limpar(v)
                break
        nome = "cap%02d.xhtml" % i
        capitulos.append((nome, titulo, epub_xhtml(limpar(titulo), md_para_xhtml(blocos), cfg)))

    nav = ['<?xml version="1.0" encoding="utf-8"?>',
           '<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" '
           'xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="pt-BR">',
           '<head><meta charset="utf-8"/><title>Sumário</title>'
           '<link rel="stylesheet" type="text/css" href="style.css"/></head><body>',
           '<nav epub:type="toc" id="toc"><h1>Sumário</h1><ol>']
    for nome, titulo, _ in capitulos:
        nav.append('<li><a href="%s">%s</a></li>' % (nome, titulo))
    nav.append('</ol></nav></body></html>')
    nav = "\n".join(nav)

    manifest = "".join(
        '<item id="c%d" href="%s" media-type="application/xhtml+xml"/>' % (i, n)
        for i, (n, _, _) in enumerate(capitulos, 1))
    spine = "".join('<itemref idref="c%d"/>' % i for i in range(1, len(capitulos) + 1))
    uid = "urn:uuid:%s-%s" % (cfg["slug"].lower(), ANO)
    opf = """<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:identifier id="pub-id">%s</dc:identifier>
<dc:title>%s</dc:title>
<dc:description>%s</dc:description>
<dc:language>pt-BR</dc:language>
<dc:creator>Coleção Vida em Ordem</dc:creator>
<meta property="dcterms:modified">%sT12:00:00Z</meta>
</metadata>
<manifest>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="css" href="style.css" media-type="text/css"/>
%s
</manifest>
<spine>
%s
</spine>
</package>""" % (uid, cfg["titulo"], cfg["subtitulo"], datetime.date.today().isoformat(),
                   manifest, spine)

    if os.path.exists(destino):
        os.remove(destino)
    with zipfile.ZipFile(destino, "w") as z:
        z.writestr("mimetype", "application/epub+zip", zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml",
                   '<?xml version="1.0" encoding="UTF-8"?>\n'
                   '<container version="1.0" '
                   'xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n'
                   '<rootfiles><rootfile full-path="OEBPS/content.opf" '
                   'media-type="application/oebps-package+xml"/></rootfiles></container>')
        z.writestr("OEBPS/content.opf", opf, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/nav.xhtml", nav, zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/style.css", css_epub(cfg), zipfile.ZIP_DEFLATED)
        for nome, _, html in capitulos:
            z.writestr("OEBPS/" + nome, html, zipfile.ZIP_DEFLATED)
    return len(capitulos)


# -------------------------------------------------------------------- main

def main():
    if os.path.exists(SAIDA):
        shutil.rmtree(SAIDA)
    os.makedirs(SAIDA)

    pastas = []
    for cfg in LIVROS:
        estilos = montar_estilos(cfg)
        pasta = os.path.join(SAIDA, cfg["slug"])
        os.makedirs(pasta)
        pastas.append(pasta)
        print("== %s" % cfg["titulo"])

        p1 = os.path.join(pasta, "%s.pdf" % cfg["slug"])
        n1 = construir_pdf(cfg, cfg["corpo"], p1, estilos)
        print("   PDF principal .... %d páginas" % n1)

        p2 = os.path.join(pasta, "%s-BONUS.pdf" % cfg["slug"])
        n2 = construir_pdf(cfg, cfg["bonus"], p2, estilos, com_toc=False)
        print("   PDF de bônus ..... %d páginas" % n2)

        p3 = os.path.join(pasta, "%s.epub" % cfg["slug"])
        n3 = gerar_epub(cfg, cfg["corpo"] + cfg["bonus"], p3)
        print("   EPUB ............. %d capítulos" % n3)

        # áudios (se gravados/gerados)
        adir_src = os.path.join(BASE, cfg["fonte"], "audios")
        if os.path.isdir(adir_src):
            adir = os.path.join(pasta, "audios")
            os.makedirs(adir, exist_ok=True)
            n_aud = 0
            for a in sorted(os.listdir(adir_src)):
                if a.lower().endswith((".mp3", ".m4a", ".wav")):
                    shutil.copy2(os.path.join(adir_src, a), adir)
                    n_aud += 1
            if n_aud:
                print("   ÁUDIOS ........... %d faixas" % n_aud)

        # fontes editáveis
        fdir = os.path.join(pasta, "fontes-editaveis")
        os.makedirs(fdir)
        for arq in cfg["corpo"] + cfg["bonus"]:
            src = os.path.join(BASE, cfg["fonte"], arq)
            if os.path.exists(src):
                shutil.copy2(src, fdir)

    # material interno (não é para o cliente)
    interno = os.path.join(SAIDA, "_material-interno-do-produtor")
    os.makedirs(interno, exist_ok=True)
    for cfg in LIVROS:
        for arq in ("LEIA-ME.md",):
            src = os.path.join(BASE, cfg["fonte"], arq)
            if os.path.exists(src):
                shutil.copy2(src, os.path.join(interno, "%s_%s" % (cfg["slug"], arq)))

    # leia-me do pacote
    with open(os.path.join(SAIDA, "LEIA-ME.txt"), "w", encoding="utf-8") as fh:
        linhas_leia = ["COLEÇÃO VIDA EM ORDEM — Pacote de produção",
                       "Gerado em %s" % DATA, "", "O QUE TEM AQUI", ""]
        for cfg in LIVROS:
            linhas_leia.append("  %s/" % cfg["slug"])
            linhas_leia.append("      %s.pdf ......... livro completo (corpo), pronto para ler no celular" % cfg["slug"])
            linhas_leia.append("      %s-BONUS.pdf ... %s" % (cfg["slug"], cfg.get("bonus_desc", "todos os bônus")))
            linhas_leia.append("      %s.epub ........ versão para Kindle, Kobo e Apple Books" % cfg["slug"])
            linhas_leia.append("      fontes-editaveis/ ....... os arquivos .md originais, para você editar")
            if os.path.isdir(os.path.join(SAIDA, cfg["slug"], "audios")):
                n_mp3 = len([a for a in os.listdir(os.path.join(SAIDA, cfg["slug"], "audios")) if a.endswith(".mp3")])
                linhas_leia.append("      audios/ ................ %d faixas de áudio guiado (mp3)" % n_mp3)
            linhas_leia.append("")
        linhas_leia += [
            "  _material-interno-do-produtor/",
            "      Painéis de produção (não entregar ao cliente)",
            "",
            "ANTES DE VENDER — 6 PASSOS",
            "  1. Leia o PDF inteiro e ajuste o que não estiver com a sua voz.",
            "  2. Crie as capas (um designer ou o Canva resolvem) — o PDF já sai com capa",
            "     tipográfica, mas uma capa desenhada vende mais.",
            "  3. Confira os avisos legais do Livro 2 e, se puder, faça revisão jurídica.",
            "  4. Substitua os casos do capítulo 11 do Livro 2 por histórias reais autorizadas,",
            "     ou mantenha a etiqueta de \"caso ilustrativo\".",
            "  5. Livro 3: teste as receitas na SUA airfryer (30 delas bastam), confirme os",
            "     custos com o preço da sua cidade e fotografe os 30 pratos principais.",
            "  6. Suba na Kiwify/Cakto (venda direta) e na Hotmart (afiliados).",
            "     Use a copy e os anúncios dos arquivos 08 e 09 do projeto.",
            "",
            "OBSERVAÇÃO TÉCNICA",
            "  Os PDFs estão em formato A5 (148 x 210 mm), ideais para leitura no celular.",
            "  Para imprimir, use \"tamanho real\" ou \"ajustar à página\" — não \"múltiplas páginas\".",
        ]
        fh.write("\n".join(linhas_leia) + "\n")

    # zip
    numeros = "-".join(str(i + 1) for i in range(len(LIVROS)))
    zip_path = os.path.join(BASE, "Kit-Livros-%s.zip" % numeros)
    if os.path.exists(zip_path):
        os.remove(zip_path)
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for raiz, dirs, files in os.walk(SAIDA):
            dirs[:] = [d for d in dirs if not d.startswith(".")]
            for f in files:
                full = os.path.join(raiz, f)
                rel = os.path.relpath(full, SAIDA)
                z.write(full, rel)
    print("\nZIP: %s (%.1f MB)" % (zip_path, os.path.getsize(zip_path) / 1048576))

    if DESCARTADOS:
        resumo = sorted(DESCARTADOS.items(), key=lambda kv: -kv[1])[:40]
        print("\nCaracteres descartados (esperado: apenas emojis):")
        print("   ", resumo)


if __name__ == "__main__":
    main()
