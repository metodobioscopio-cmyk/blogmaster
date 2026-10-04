#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gerar_pacote_full.py — cria o pacote completo: TUDO dentro de um ZIP único.

  downloads/0-Pacote-FULL-Tudo.zip
    ├── 00-COMECE-AQUI.txt          (guia do pacote)
    ├── 1-Livro-1…/ 2-Livro-2…/ 3-Livro-3…/ 4-Livro-4…/   (com 00-COMECE-AQUI.txt cada)
    ├── Kit-Completo-4-Livros/                              (pasta dos 4 volumes)
    ├── 5-Marketing/                (capas 1600×2560, mockups, anúncios)
    └── 6-Paginas-de-Venda/         (HTML autocontido + LEIA-ME de publicação)
    └── 7-Documentacao-do-Projeto/  (00…12 + painel.html + entregas.html)
    └── _fontes-e-geradores/        (o livro em markdown + tools/gerar_*.py)

Uso:  python3 tools/gerar_pacote_full.py
"""
import os, zipfile, shutil, subprocess, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ = os.path.join(RAIZ, "projeto-4-infoprodutos")
DL   = os.path.join(PROJ, "downloads")
TMP  = os.path.join(PROJ, "_full-tmp")
SAIDA = os.path.join(DL, "0-Pacote-FULL-Tudo.zip")

LEIA = """COLECOES VIDA EM ORDEM — PACOTE COMPLETO (TUDO)
=========================================================================

Este ZIP contem ABSOLUTAMENTE TUDO deste projeto, organizado em pastas.

1-Livro-1-IA-que-Trabalha-por-Voce/ ...... PDF 63 pag + bonus 60 pag + EPUB + fontes
2-Livro-2-Saia-do-Vermelho-em-60-Dias/ ... PDF 86 pag + bonus 16 pag + EPUB + fontes
3-Livro-3-Airfryer-Sem-Mimimi/ ........... PDF 115 pag + bonus 25 pag + EPUB + fontes
4-Livro-4-Energia-em-21-Dias/ ............ PDF 74 pag + bonus 24 pag + 4 AUDIOS GUIADOS
5-Marketing/ ............................. 4 capas 1600x2560 + 17 mockups + 12 anuncios + 12 pins
6-Paginas-de-Venda/ ...................... 5 paginas HTML autocontidas prontas para publicar
7-Documentacao-do-Projeto/ ............... os 16 arquivos de estrategia (00 a 15) + 2 paineis
8-Iscas-Capitulo-0/ ...................... os 4 PDFs de isca (material gratuito) + fontes em markdown
_fontes-e-geradores/ ..................... o texto dos livros em markdown + os scripts que geram tudo
                                           (os audios ficam só na pasta do Vol. 4, para não pesar duas vezes)

OBS.: este pacote NAO repete os livros. Cada volume aparece uma única vez, na pasta dele.
      Se você quiser a pasta pronta para entregar ao cliente (os 4 juntos), use o
      arquivo Kit-Completo-4-Livros.zip, que é separado.

CADA LIVRO TEM UM ARQUIVO 00-COMECE-AQUI.txt COM O PASSO A PASSO DE USO.
O Volume 4, na pasta audios/, traz: respiracao guiada (5 min), soltar o dia (7 min),
foco para comecar (8 min) e luz da manha (10 min).

ANTES DE PUBLICAR
  - Em 6-Paginas-de-Venda/, troque os textos "SUBSTITUIR-..." (links de checkout,
    e-mail de suporte, razao social) e o og:image por uma URL publica (veja o LEIA-ME.txt).
  - Em 5-Marketing/, as capas JA estao no formato da Amazon KDP (1600x2560).
  - O material e educacional: nao prometa resultado e nao use termos clinicos.

PARA REGERAR TUDO (se editar o texto dos livros)
  python3 tools/gerar_livros.py        -> PDFs, EPUBs e o Kit
  python3 tools/gerar_marketing.py     -> capas, mockups e anuncios
  python3 tools/gerar_paginas.py       -> paginas de venda
  python3 tools/gerar_downloads.py     -> zips separados
  python3 tools/gerar_hub_entregas.py  -> entregas.html
  python3 tools/gerar_pacote_full.py   -> este pacote
"""

EXCLUIR_EXT = (".zip", ".pyc", ".tmp")
EXCLUIR_DIR = {"__pycache__", "_thumbs", "_full-tmp", "_seg", ".git"}

def copiar(origem, destino, filtro=None):
    if not os.path.exists(origem):
        print("  (aviso) não existe:", origem); return 0
    n = 0
    for raiz, dirs, files in os.walk(origem):
        dirs[:] = [d for d in dirs if d not in EXCLUIR_DIR]
        rel = os.path.relpath(raiz, origem)
        alvo = os.path.join(destino, rel) if rel != "." else destino
        os.makedirs(alvo, exist_ok=True)
        for f in sorted(files):
            if f.endswith(EXCLUIR_EXT): continue
            if filtro and not filtro(f, raiz): continue
            shutil.copy2(os.path.join(raiz, f), os.path.join(alvo, f))
            n += 1
    return n

def main():
    if os.path.exists(TMP):
        shutil.rmtree(TMP)
    os.makedirs(TMP)
    total = 0
    print("montando a árvore do pacote…")
    for pasta, apelido in [("Livro-1-IA-que-Trabalha-por-Voce", "1-Livro-1-IA-que-Trabalha-por-Voce"),
                           ("Livro-2-Saia-do-Vermelho-em-60-Dias", "2-Livro-2-Saia-do-Vermelho-em-60-Dias"),
                           ("Livro-3-Airfryer-Sem-Mimimi", "3-Livro-3-Airfryer-Sem-Mimimi"),
                           ("Livro-4-Energia-em-21-Dias", "4-Livro-4-Energia-em-21-Dias")]:
        n = copiar(os.path.join(PROJ, "entregaveis", pasta), os.path.join(TMP, apelido))
        print(f"  {apelido:44s} {n:3d} arquivos"); total += n
    n = copiar(os.path.join(PROJ, "marketing"), os.path.join(TMP, "5-Marketing"))
    print(f"  {'5-Marketing':44s} {n:3d} arquivos"); total += n
    n = copiar(os.path.join(PROJ, "iscas"), os.path.join(TMP, "8-Iscas-Capitulo-0"))
    print(f"  {'8-Iscas-Capitulo-0':44s} {n:3d} arquivos"); total += n
    n = copiar(os.path.join(PROJ, "paginas"), os.path.join(TMP, "6-Paginas-de-Venda"))
    print(f"  {'6-Paginas-de-Venda':44s} {n:3d} arquivos"); total += n
    n = copiar(PROJ, os.path.join(TMP, "7-Documentacao-do-Projeto"),
               filtro=lambda f, r: (f.endswith(".md") or f in ("painel.html", "entregas.html"))
                                   and os.path.abspath(r) == os.path.abspath(PROJ))
    print(f"  {'7-Documentacao-do-Projeto':44s} {n:3d} arquivos"); total += n
    nf = copiar(os.path.join(PROJ, "livro-4"), os.path.join(TMP, "_fontes-e-geradores", "livros-md", "livro-4"),
                filtro=lambda f, r: os.path.basename(r) != "audios")
    for i in (1, 2, 3):
        nf += copiar(os.path.join(PROJ, f"livro-{i}"), os.path.join(TMP, "_fontes-e-geradores", "livros-md", f"livro-{i}"))
    nf += copiar(os.path.join(RAIZ, "tools"), os.path.join(TMP, "_fontes-e-geradores", "tools"))
    print(f"  {'_fontes-e-geradores':44s} {nf:3d} arquivos"); total += nf
    with open(os.path.join(TMP, "00-COMECE-AQUI.txt"), "w", encoding="utf-8") as f:
        f.write(LEIA)

    os.makedirs(DL, exist_ok=True)
    if os.path.exists(SAIDA):
        os.remove(SAIDA)
    print("\ncompactando (deflate nível 9)…")
    with zipfile.ZipFile(SAIDA, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for raiz, dirs, files in os.walk(TMP):
            for f in sorted(files):
                full = os.path.join(raiz, f)
                z.write(full, os.path.join("Colecao-Vida-em-Ordem-COMPLETO", os.path.relpath(full, TMP)))
    shutil.rmtree(TMP, ignore_errors=True)
    tam = os.path.getsize(SAIDA)
    print(f"\n0-Pacote-FULL-Tudo.zip → {total} arquivos · {tam/1048576:.1f} MB")
    with zipfile.ZipFile(SAIDA) as z:
        ruins = z.testzip()
        print("testzip:", "OK" if ruins is None else f"PROBLEMA em {ruins}")

    # 7z costuma render 10-15% mais; usa se existir
    if shutil.which("7z") or shutil.which("7za"):
        exe = shutil.which("7z") or shutil.which("7za")
        alt = SAIDA.replace(".zip", ".7z").replace("0-Pacote", "0-Pacote")
        subprocess.run([exe, "a", "-t7z", "-mx=9", alt, os.path.join(TMP, "*")], capture_output=True)

if __name__ == "__main__":
    main()
