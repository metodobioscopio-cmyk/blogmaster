#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera o e-book (Growth Design Playbook) em HTML a partir dos arquivos Markdown.

Por que Markdown como fonte: o texto do e-book é o ativo mais reeditado do produto.
Manter o conteúdo em Markdown e gerar o HTML permite que a diagramação (tipografia,
numeração, sumário, folha de estilo de impressão) fique separada da escrita.

O HTML gerado é também o PDF: abra no navegador e use "Imprimir → Salvar como PDF".
A folha de estilo de impressão está configurada para A5, com numeração de página
nos rodapés e sem quebra no meio de blocos de código.

Uso:    python3 tools/gerar_ebook.py
Saída:  ebook/pt/index.html  ·  ebook/en/index.html
"""

from __future__ import annotations

import html
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

EDICOES = [
    {
        "lang": "pt-BR",
        "entrada": ROOT / "ebook" / "pt" / "playbook.md",
        "saida": ROOT / "ebook" / "pt" / "index.html",
        "titulo": "Growth Design Playbook",
        "subtitulo": "O sistema completo para projetar sites exponenciais com IA",
        "rotulo_sumario": "Sumário",
        "rodape": "Growth Design Pro · Playbook · edição em português",
        "outro_idioma": ("../en/", "Read in English"),
        "saida_site": ROOT / "site" / "area" / "materiais" / "playbook-pt.html",
        "outro_publicado": ("playbook-en.html", "Read in English"),
    },
    {
        "lang": "en",
        "entrada": ROOT / "ebook" / "en" / "playbook.md",
        "saida": ROOT / "ebook" / "en" / "index.html",
        "titulo": "Growth Design Playbook",
        "subtitulo": "The complete system for building exponential websites with AI",
        "rotulo_sumario": "Contents",
        "rodape": "Growth Design Pro · Playbook · English edition",
        "outro_idioma": ("../pt/", "Ler em português"),
        "saida_site": ROOT / "site" / "area" / "materiais" / "playbook-en.html",
        "outro_publicado": ("playbook-pt.html", "Ler em português"),
    },
]


# ---------------------------------------------------------------------------
# Conversor Markdown → HTML (subconjunto suficiente e previsível)
# ---------------------------------------------------------------------------

def inline(texto: str) -> str:
    """Negrito, itálico, código e links — na ordem que evita conflito."""
    t = html.escape(texto, quote=False)
    # código inline primeiro (protege o conteúdo dele das outras regras)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    # links [texto](url)
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', t)
    # negrito e itálico
    t = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\*\w])\*([^*\n]+)\*(?![\*\w])", r"<em>\1</em>", t)
    return t


def bloco_tabela(linhas: list[str]) -> str:
    """Converte linhas de tabela markdown em <table>."""
    def celulas(linha: str) -> list[str]:
        partes = linha.strip().strip("|").split("|")
        return [c.strip() for c in partes]

    cabecalho = celulas(linhas[0])
    corpo = [celulas(l) for l in linhas[2:]]

    saida = ['<div class="tabela-wrap"><table>', "<thead><tr>"]
    saida += [f"<th>{inline(c)}</th>" for c in cabecalho]
    saida += ["</tr></thead><tbody>"]
    for linha in corpo:
        saida.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in linha) + "</tr>")
    saida += ["</tbody></table></div>"]
    return "\n".join(saida)


def converter(markdown: str) -> tuple[str, list[tuple[str, str, int]]]:
    """Devolve (html_do_corpo, sumário) onde sumário = [(nivel, texto, indice)]."""
    linhas = markdown.replace("\r\n", "\n").split("\n")
    saida: list[str] = []
    sumario: list[tuple[str, str, int]] = []

    i = 0
    n_capitulo = 0
    usadas: set[str] = set()

    while i < len(linhas):
        linha = linhas[i]

        # --- bloco de código
        if linha.strip().startswith("```"):
            linguagem = linha.strip()[3:].strip() or "texto"
            i += 1
            codigo: list[str] = []
            while i < len(linhas) and not linhas[i].strip().startswith("```"):
                codigo.append(linhas[i])
                i += 1
            i += 1
            saida.append(
                f'<pre class="codigo" data-linguagem="{html.escape(linguagem)}">'
                f"<code>{html.escape(chr(10).join(codigo))}</code></pre>"
            )
            continue

        # --- tabela
        if linha.strip().startswith("|") and i + 1 < len(linhas) and re.match(
            r"^\s*\|[\s:|-]+\|\s*$", linhas[i + 1]
        ):
            tabela: list[str] = [linha]
            i += 1
            while i < len(linhas) and linhas[i].strip().startswith("|"):
                tabela.append(linhas[i])
                i += 1
            saida.append(bloco_tabela(tabela))
            continue

        # --- títulos
        m = re.match(r"^(#{1,4})\s+(.*)$", linha)
        if m:
            nivel = len(m.group(1))
            texto = m.group(2).strip()
            if nivel == 1:
                # O h1 é o título do documento: aparece na capa, não no sumário.
                # (o incremento de `i` acontece antes do continue, no fim do bloco)
                i += 1
                continue
            # âncora legível: sem acento, sem repetição dentro do mesmo capítulo
            base = unicodedata.normalize("NFKD", texto.lower())
            base = "".join(c for c in base if not unicodedata.combining(c))
            ancora_base = re.sub(r"[^a-z0-9]+", "-", base).strip("-")[:40] or "secao"
            prefixo_cap = f"c{n_capitulo}-" if n_capitulo else ""
            ancora = f"{prefixo_cap}{ancora_base}"
            contador = 0
            while ancora in usadas:
                contador += 1
                ancora = f"{prefixo_cap}{ancora_base}-{contador}"
            usadas.add(ancora)
            if nivel == 2 and re.match(r"^(Cap[ií]tulo|Chapter|Ap[êe]ndice|Appendix)\b", texto):
                n_capitulo += 1
                limpo = re.sub(r"^(Cap[ií]tulo|Chapter)\s+\d+\s*[—–-]\s*", "", texto)
                sumario.append((texto, n_capitulo))
                saida.append(
                    f'<h2 id="c{n_capitulo}" class="capitulo">'
                    f'<span class="capitulo__numero">{n_capitulo:02d}</span>{inline(limpo)}</h2>'
                )
            else:
                if nivel == 2:
                    sumario.append((texto, len(sumario)))
                saida.append(f'<h{nivel} id="{ancora}">{inline(texto)}</h{nivel}>')
            i += 1
            continue

        # --- linha horizontal
        if re.match(r"^\s*---+\s*$", linha):
            saida.append('<hr class="divisor">')
            i += 1
            continue

        # --- citação
        if linha.strip().startswith(">"):
            cita: list[str] = []
            while i < len(linhas) and linhas[i].strip().startswith(">"):
                cita.append(linhas[i].strip()[1:].strip())
                i += 1
            saida.append(f'<blockquote><p>{inline(" ".join(cita))}</p></blockquote>')
            continue

        # --- listas
        if re.match(r"^\s*[-*]\s+", linha):
            itens: list[str] = []
            while i < len(linhas) and re.match(r"^\s*[-*]\s+", linhas[i]):
                itens.append(re.sub(r"^\s*[-*]\s+", "", linhas[i]))
                i += 1
            saida.append("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in itens) + "</ul>")
            continue

        if re.match(r"^\s*\d+\.\s+", linha):
            itens = []
            while i < len(linhas) and re.match(r"^\s*\d+\.\s+", linhas[i]):
                itens.append(re.sub(r"^\s*\d+\.\s+", "", linhas[i]))
                i += 1
            saida.append("<ol>" + "".join(f"<li>{inline(x)}</li>" for x in itens) + "</ol>")
            continue

        # --- parágrafo
        if linha.strip():
            paragrafo: list[str] = []
            while i < len(linhas) and linhas[i].strip() and not re.match(
                r"^\s*(#|>|[-*]\s|\d+\.\s|\||```|---)", linhas[i]
            ):
                paragrafo.append(linhas[i].strip())
                i += 1
            texto = " ".join(paragrafo)
            classe = ' class="lead"' if texto.startswith("**How to read") or texto.startswith("**Nota de leitura") else ""
            saida.append(f"<p{classe}>{inline(texto)}</p>")
            continue

        i += 1

    return "\n".join(saida), sumario


# ---------------------------------------------------------------------------
# Template
# ---------------------------------------------------------------------------

CSS = """
:root{
  --paper:#F7F4ED; --paper-2:#EFEADF; --card:#FCFAF5;
  --ink:#121110; --ink-2:#3A3733; --ink-3:#6B655C;
  --accent:#8F6F2E; --accent-soft:rgba(143,111,46,.12);
  --rule:rgba(18,17,16,.13);
  --serif:'Iowan Old Style','Palatino Linotype',Georgia,serif;
  --sans:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
*,*::before,*::after{box-sizing:border-box}
body{
  margin:0;background:var(--paper);color:var(--ink);
  font-family:var(--sans);font-size:1.0625rem;line-height:1.68;
  -webkit-font-smoothing:antialiased;
}
.pagina{max-width:52rem;margin-inline:auto;padding:clamp(1.5rem,4vw,4rem) clamp(1.25rem,5vw,3.5rem) 6rem}

/* --- Capa --- */
.capa{border-bottom:1px solid var(--rule);padding-bottom:3rem;margin-bottom:3rem}
.capa__selo{
  display:inline-block;border:1px solid var(--accent);color:var(--accent);
  padding:.35rem .8rem;font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600
}
.capa h1{font-family:var(--serif);font-weight:400;font-size:clamp(2.25rem,1.6rem+3vw,3.75rem);
         letter-spacing:-.025em;line-height:1.05;margin:1.5rem 0 1rem}
.capa p.sub{font-size:clamp(1.0625rem,1rem+.4vw,1.25rem);color:var(--ink-2);max-width:38ch;margin:0}
.capa__meta{margin-top:2rem;font-family:var(--mono);font-size:.75rem;letter-spacing:.08em;
            text-transform:uppercase;color:var(--ink-3)}
.capa__meta a{color:var(--accent);text-decoration:none}

/* --- Sumário --- */
.sumario{border:1px solid var(--rule);background:var(--card);padding:1.75rem;margin-bottom:3.5rem}
.sumario h2{font-family:var(--mono);font-size:.6875rem;letter-spacing:.16em;text-transform:uppercase;
            color:var(--accent);margin:0 0 1.25rem;font-weight:600}
.sumario ol{margin:0;padding:0;list-style:none;counter-reset:s}
.sumario li{counter-increment:s;display:flex;gap:1rem;padding:.4rem 0;border-bottom:1px dotted var(--rule);
            font-size:.9375rem;align-items:baseline}
.sumario li:last-child{border-bottom:0}
.sumario li::before{content:counter(s,decimal-leading-zero);font-family:var(--mono);font-size:.75rem;
                    color:var(--accent);flex:none}
.sumario a{color:var(--ink);text-decoration:none}

/* --- Tipografia --- */
h2.capitulo{
  font-family:var(--serif);font-weight:400;font-size:clamp(1.875rem,1.4rem+2.2vw,2.75rem);
  letter-spacing:-.02em;line-height:1.1;margin:5rem 0 2rem;padding-top:2rem;
  border-top:1px solid var(--rule);position:relative;page-break-before:always
}
.capitulo:first-of-type{page-break-before:auto}
.capitulo__numero{display:block;font-family:var(--mono);font-size:.75rem;letter-spacing:.18em;
                  color:var(--accent);margin-bottom:.75rem}
h2{font-family:var(--serif);font-weight:400;font-size:1.5rem;line-height:1.2;letter-spacing:-.01em;
   margin:3rem 0 1rem}
h3{font-family:var(--sans);font-weight:600;font-size:1.0625rem;margin:2rem 0 .75rem}
p{margin:0;color:var(--ink-2)}
p+p{margin-top:1rem}
p.lead{font-size:1.125rem;color:var(--ink-2);border-left:2px solid var(--accent);padding-left:1.25rem}
strong{color:var(--ink);font-weight:600}
em{font-style:italic}
a{color:var(--accent);text-underline-offset:.2em}
hr.divisor{border:0;border-top:1px solid var(--rule);margin:3rem 0}

ul,ol{margin:1rem 0;padding-left:1.25rem;color:var(--ink-2)}
li{margin:.4rem 0}
li::marker{color:var(--accent)}
ol li::marker{font-family:var(--mono);font-size:.875rem}

blockquote{
  margin:1.75rem 0;padding:1.25rem 1.5rem;background:var(--accent-soft);
  border-left:3px solid var(--accent);border-radius:0 4px 4px 0
}
blockquote p{margin:0;color:var(--ink);font-size:.9375rem}

code{font-family:var(--mono);font-size:.875em;background:var(--paper-2);
     padding:.1em .35em;border-radius:3px;color:var(--ink)}
pre.codigo{
  background:#16150F;color:#E8E3D8;padding:1.25rem 1.5rem;border-radius:4px;overflow-x:auto;
  font-family:var(--mono);font-size:.8125rem;line-height:1.7;margin:1.5rem 0;page-break-inside:avoid
}
pre.codigo code{background:none;color:inherit;padding:0;font-size:inherit}

.tabela-wrap{overflow-x:auto;margin:1.75rem 0;page-break-inside:avoid}
table{width:100%;border-collapse:collapse;font-size:.875rem}
th{background:var(--ink);color:var(--paper);text-align:left;padding:.7rem .85rem;
   font-weight:600;font-size:.75rem;letter-spacing:.04em;text-transform:uppercase}
td{padding:.7rem .85rem;border-bottom:1px solid var(--rule);color:var(--ink-2);vertical-align:top}
tr:nth-child(even) td{background:rgba(239,234,223,.5)}

.rodape{margin-top:5rem;padding-top:2rem;border-top:1px solid var(--rule);
        font-size:.8125rem;color:var(--ink-3)}
.rodape a{color:var(--ink-3)}

/* --- Voltar ao topo --- */
.topo{position:fixed;right:1.25rem;bottom:1.25rem;background:var(--ink);color:var(--paper);
      text-decoration:none;padding:.6rem .9rem;font-size:.75rem;letter-spacing:.1em;text-transform:uppercase}

/* --- Impressão: aqui o HTML se torna o PDF do e-book --- */
@media print{
  @page{size:A5;margin:14mm 15mm 16mm}
  body{background:#fff;font-size:9.6pt;line-height:1.55}
  .pagina{max-width:none;padding:0}
  .topo{display:none}
  .capa{page-break-after:always}
  h2.capitulo{margin-top:0;page-break-before:always}
  h2,h3{page-break-after:avoid}
  p,li,blockquote{orphans:3;widows:3}
  pre.codigo{background:#F4F2EC;color:#121110;border:1px solid #D8D2C4}
  th{background:#121110 !important;color:#fff !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  tr:nth-child(even) td{background:#F4F2EC !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  blockquote{background:#F4F2EC !important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  a{color:#121110;text-decoration:none}
  a[href^="http"]::after{content:" (" attr(href) ")";font-size:.8em;color:#666}
}
"""

TEMPLATE = """<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titulo} — {subtitulo}</title>
<meta name="description" content="{subtitulo}">
<meta name="author" content="Growth Design Pro">
<meta name="robots" content="noindex, nofollow">
<style>{css}</style>
</head>
<body>
<a class="topo" href="#topo">↑ topo</a>
<div class="pagina" id="topo">

  <header class="capa">
    <span class="capa__selo">Growth Design Pro · Playbook</span>
    <h1>{titulo}</h1>
    <p class="sub">{subtitulo}</p>
    <div class="capa__meta">
      {n_capitulos} capítulos &nbsp;·&nbsp; edição {lang} &nbsp;·&nbsp; v1.0<br>
      <a href="{outro_url}">{outro_texto}</a> &nbsp;·&nbsp;
      <a href="../../site/index.html">site</a>
    </div>
  </header>

  <nav class="sumario" aria-label="{rotulo_sumario}">
    <h2>{rotulo_sumario}</h2>
    <ol>
      {itens_sumario}
    </ol>
  </nav>

  <main>
{corpo}
  </main>

  <footer class="rodape">
    <p><strong>Growth Design Pro</strong> — {rodape}</p>
    <p style="margin-top:.5rem">Material educacional. Não há garantia de tráfego, posicionamento em
    buscadores, vendas ou renda: resultados dependem da execução, do mercado e de plataformas de
    terceiros. As assinaturas das APIs não estão inclusas.</p>
    <p style="margin-top:.5rem">Licença de uso do kit: <code>site/legal/licenca.html</code></p>
  </footer>

</div>
</body>
</html>
"""


def gerar(edicao: dict) -> None:
    markdown = edicao["entrada"].read_text(encoding="utf-8")
    corpo, sumario = converter(markdown)

    capitulos = [(t, n) for t, n in sumario if re.match(r"^(Cap[ií]tulo|Chapter|Ap[êe]ndice|Appendix)\b", t)]
    capitulos = [(re.sub(r"^(Cap[ií]tulo|Chapter)\s+\d+\s*[—–-]\s*", "", t), n) for t, n in capitulos]
    itens = "\n      ".join(
        f'<li><a href="#c{n}">{html.escape(t)}</a></li>' for t, n in capitulos
    )

    html_final = TEMPLATE.format(
        lang=edicao["lang"],
        titulo=edicao["titulo"],
        subtitulo=edicao["subtitulo"],
        css=CSS,
        n_capitulos=len(capitulos),
        rotulo_sumario=edicao["rotulo_sumario"],
        itens_sumario=itens,
        corpo=corpo,
        rodape=edicao["rodape"],
        outro_url=edicao["outro_idioma"][0],
        outro_texto=edicao["outro_idioma"][1],
    )

    edicao["saida"].parent.mkdir(parents=True, exist_ok=True)
    edicao["saida"].write_text(html_final, encoding="utf-8")
    palavras = len(re.findall(r"\w+", markdown))
    print(f"  ✓ {edicao['saida'].relative_to(ROOT)} — {len(capitulos)} capítulos, ~{palavras:,} palavras")

    # Cópia para a área de membros: os dois links de contexto mudam.
    if edicao.get("saida_site"):
        publicado = html_final.replace(
            f'href="{edicao["outro_idioma"][0]}"', f'href="{edicao["outro_publicado"][0]}"'
        ).replace(
            f'>{edicao["outro_idioma"][1]}</a>', f'>{edicao["outro_publicado"][1]}</a>'
        ).replace(
            'href="../../site/index.html"', 'href="../../index.html"'
        )
        destino = edicao["saida_site"]
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(publicado, encoding="utf-8")
        print(f"  ✓ {destino.relative_to(ROOT)} — cópia para a área de membros")


def main():
    print("Gerando o e-book:")
    for edicao in EDICOES:
        gerar(edicao)
    print("Concluído. Para o PDF: abra o HTML e use Imprimir → Salvar como PDF (A5).")


if __name__ == "__main__":
    main()
