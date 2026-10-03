#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gerar_hub_entregas.py — cria `entregas.html`: central de downloads da coleção.

Lista todos os ZIPs com link clicável, mostra as capas, os mockups, os anúncios
e as páginas de venda. Gera também miniaturas em marketing/_thumbs para a página
abrir rápido.

Servir a pasta do projeto para os links funcionarem:
    cd projeto-4-infoprodutos && python3 -m http.server 8099 --bind 0.0.0.0

Uso: python3 tools/gerar_hub_entregas.py
"""
import os, zipfile, html
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ = os.path.join(RAIZ, "projeto-4-infoprodutos")
DL   = os.path.join(PROJ, "downloads")
TH   = os.path.join(PROJ, "marketing", "_thumbs")

LIVRO_TXT = {
 "1-Livro-1-IA-que-Trabalha-por-Voce.zip": ("Vol. 1 · IA que Trabalha por Você", "63 pág. + bônus de 60 pág. · PDF + EPUB + fontes"),
 "2-Livro-2-Saia-do-Vermelho-em-60-Dias.zip": ("Vol. 2 · Saia do Vermelho em 60 Dias", "86 pág. + bônus de 16 pág. · PDF + EPUB + fontes"),
 "3-Livro-3-Airfryer-Sem-Mimimi.zip": ("Vol. 3 · Airfryer Sem Mimimi", "115 pág. + bônus de 25 pág. · 120 receitas"),
 "4-Livro-4-Energia-em-21-Dias.zip": ("Vol. 4 · Energia em 21 Dias", "74 pág. + bônus de 24 pág. + 4 áudios guiados"),
 "Kit-Completo-4-Livros.zip": ("Kit completo — os 4 livros", "tudo: livros, bônus, planilhas e os 4 áudios"),
 "5-Pacote-Marketing-Capas-Mockups-Anuncios.zip": ("Pacote de marketing", "4 capas 1600×2560 · 20 mockups · 13 anúncios"),
 "6-Paginas-de-Venda-HTML.zip": ("Páginas de venda (HTML)", "index + 4 páginas autocontidas, prontas para publicar"),
}

def mb(n):
    return f"{n/1048576:.2f} MB".replace(".", ",")

def itens(zip_path):
    try:
        with zipfile.ZipFile(zip_path) as z:
            return len(z.namelist())
    except Exception:
        return 0

def thumb(rel, largura=420, q=78):
    """Gera miniatura em marketing/_thumbs e devolve o caminho relativo à raiz do projeto."""
    origem = os.path.join(PROJ, "marketing", rel)
    if not os.path.exists(origem):
        return None
    os.makedirs(TH, exist_ok=True)
    nome = rel.replace("/", "__").rsplit(".", 1)[0] + ".jpg"
    destino = os.path.join(TH, nome)
    if not os.path.exists(destino):
        im = Image.open(origem).convert("RGB")
        if im.width > largura:
            im = im.resize((largura, int(im.height*largura/im.width)), Image.Resampling.LANCZOS)
        im.save(destino, "JPEG", quality=q, optimize=True, progressive=True)
    return "marketing/_thumbs/" + nome

def lista(pasta, padrao=None):
    p = os.path.join(PROJ, "marketing", pasta)
    if not os.path.isdir(p):
        return []
    arqs = sorted(f for f in os.listdir(p) if f.lower().endswith(".jpg"))
    if padrao:
        arqs = [f for f in arqs if padrao in f]
    return arqs

def cartao_zip(nome, itens_n=0):
    titulo, desc = LIVRO_TXT.get(nome, (nome, ""))
    caminho = os.path.join(DL, nome)
    tam = os.path.getsize(caminho) if os.path.exists(caminho) else 0
    destaque = " destaque" if nome.startswith("Kit") else ""
    extra = f"{itens_n} itens" if itens_n else ""
    return f"""      <a class="card{destaque}" href="downloads/{html.escape(nome)}" download>
        <div class="ic">⬇</div>
        <h3>{html.escape(titulo)}</h3>
        <p>{html.escape(desc)}</p>
        <span class="meta">{mb(tam)} · {extra}</span>
      </a>"""

def galeria(arquivos, pasta, subtitulo=""):
    itens_html = []
    for a in arquivos:
        t = thumb(f"{pasta}/{a}")
        if not t:
            continue
        link = f"marketing/{pasta}/{a}"
        itens_html.append(
            f'      <a class="thumb" href="{html.escape(link)}" target="_blank" rel="noopener">'
            f'<img loading="lazy" src="{html.escape(t)}" alt="{html.escape(a)}">'
            f'<span>{html.escape(subtitulo or a.replace(".jpg",""))}</span></a>')
    return "\n".join(itens_html)

def main():
    zips = [f for f in sorted(os.listdir(DL)) if f.endswith(".zip")] if os.path.isdir(DL) else []
    ordem = ["1-", "2-", "3-", "4-", "Kit", "5-", "6-"]
    zips.sort(key=lambda z: next((i for i, p in enumerate(ordem) if z.startswith(p)), 99))
    cards = "\n".join(cartao_zip(z, itens(os.path.join(DL, z))) for z in zips)

    capas = lista("capas")
    mockups = [m for m in lista("mockups") if m.startswith("vol")]
    hero = "kit-completo-5-hero.jpg"
    anuncios = lista("anuncios")

    paginas = ["index.html", "livro-1.html", "livro-2.html", "livro-3.html", "livro-4.html"]
    paginas_html = "\n".join(
        f'      <a class="card mini" href="paginas/{p}" target="_blank" rel="noopener">'
        f'<div class="ic">↗</div><h3>{p}</h3>'
        f'<p>{"Hub da coleção com a oferta do combo" if p == "index.html" else "Página de venda do volume " + p[6]}</p></a>'
        for p in paginas)

    total = sum(os.path.getsize(os.path.join(DL, z)) for z in zips) if zips else 0

    doc = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Central de entregas — Coleção Vida em Ordem</title>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;color:#141821;
 background:#F3F5F9;line-height:1.55;-webkit-font-smoothing:antialiased}}
header{{background:linear-gradient(160deg,#141B33,#0A0E1A);color:#fff;padding:44px 0 52px}}
.wrap{{max-width:1180px;margin:0 auto;padding:0 22px}}
header h1{{font-size:clamp(26px,3.4vw,40px);letter-spacing:-.02em}}
header h1 span{{color:#E8B65A}}
header p{{color:rgba(255,255,255,.75);margin-top:12px;max-width:70ch}}
.selo{{display:inline-block;background:#E8B65A;color:#12161F;font-weight:800;font-size:12px;
 letter-spacing:.12em;text-transform:uppercase;padding:6px 14px;border-radius:999px;margin-bottom:14px}}
section{{padding:46px 0 8px}}
h2{{font-size:clamp(19px,2.2vw,26px);margin-bottom:6px;letter-spacing:-.01em}}
h2 em{{font-style:normal;color:#5A6478;font-weight:500;font-size:14px;display:block;margin-top:6px}}
.grid{{display:grid;gap:16px;margin-top:24px}}
.zips{{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}}
.card{{display:block;background:#fff;border:1px solid rgba(20,24,33,.09);border-radius:16px;
 padding:20px 22px;text-decoration:none;color:inherit;transition:transform .15s ease,box-shadow .15s ease;
 box-shadow:0 2px 10px rgba(20,24,33,.05)}}
.card:hover{{transform:translateY(-3px);box-shadow:0 14px 30px rgba(20,24,33,.12)}}
.card.destaque{{background:linear-gradient(170deg,#1B2A4A,#0E1730);color:#fff;border-color:#1B2A4A}}
.card.destaque p{{color:rgba(255,255,255,.78)}}
.card.destaque .meta{{background:rgba(232,182,90,.18);color:#E8B65A}}
.card h3{{font-size:17px;margin-bottom:4px}}
.card p{{color:#5A6478;font-size:14px}}
.card .ic{{font-size:22px;margin-bottom:8px}}
.card .meta{{display:inline-block;margin-top:12px;font-size:12px;font-weight:700;background:#EEF1F7;
 color:#3A4560;padding:5px 11px;border-radius:999px}}
.mini h3{{font-size:15px;font-family:ui-monospace,Menlo,Consolas,monospace}}
.galeria{{grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}}
.thumb{{display:block;background:#fff;border:1px solid rgba(20,24,33,.09);border-radius:14px;
 overflow:hidden;text-decoration:none;color:inherit;transition:transform .15s ease}}
.thumb:hover{{transform:translateY(-3px)}}
.thumb img{{width:100%;display:block;background:#E9ECF3}}
.thumb span{{display:block;font-size:12px;padding:9px 12px;color:#5A6478;
 overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
footer{{margin-top:56px;background:#0E1220;color:rgba(255,255,255,.7);padding:34px 0;font-size:13px}}
footer a{{color:#E8B65A}}
.aviso{{background:#FFF6E5;border:1px solid #E8B65A;border-radius:12px;padding:14px 18px;
 font-size:13px;color:#6B4E12;margin-top:20px}}
code{{background:rgba(20,24,33,.07);padding:2px 6px;border-radius:6px;font-size:12.5px}}
</style>
</head>
<body>
<header><div class="wrap">
  <span class="selo">Central de entregas</span>
  <h1>Coleção <span>Vida em Ordem</span></h1>
  <p>Todos os arquivos deste projeto em um lugar só. Clique em qualquer cartão para baixar o ZIP.
     Os tamanhos somam {mb(total)}. Tudo regenerável pelos scripts em <code>tools/</code>.</p>
</div></header>

<section><div class="wrap">
  <h2>1. Baixar os pacotes <em>os 4 livros separados, o kit completo e o material de produção</em></h2>
  <div class="grid zips">
{cards}
  </div>
  <div class="aviso">Cada livro vem com <code>00-COMECE-AQUI.txt</code> (passo a passo de uso).
     O material de marketing e as páginas de venda têm marcadores <code>SUBSTITUIR-…</code> — troque os links de
     checkout e o e-mail de suporte antes de publicar.</div>
</div></section>

<section><div class="wrap">
  <h2>2. Capas <em>1600×2560 (formato da Amazon KDP) — clique para abrir em tamanho real</em></h2>
  <div class="grid galeria">
{galeria(capas, "capas")}
  </div>
</div></section>

<section><div class="wrap">
  <h2>3. Mockups <em>livro em pé, aberto por dentro, tablet/celular, kit de bônus</em></h2>
  <div class="grid galeria">
{galeria([hero] + mockups, "mockups")}
  </div>
</div></section>

<section><div class="wrap">
  <h2>4. Anúncios <em>feed 1080×1350 · story 1080×1920 · Pinterest 1000×1500</em></h2>
  <div class="grid galeria">
{galeria(anuncios, "anuncios")}
  </div>
</div></section>

<section><div class="wrap">
  <h2>5. Páginas de venda <em>abrem em nova aba; são arquivos únicos e autocontidos</em></h2>
  <div class="grid zips">
{paginas_html}
  </div>
</div></section>

<footer><div class="wrap">
  <p><b>Coleção Vida em Ordem</b> — projeto em <code>/home/user/blogmaster/projeto-4-infoprodutos</code>.</p>
  <p style="margin-top:8px">Gerado por <code>tools/gerar_hub_entregas.py</code>. Materiais educacionais: nada aqui promete resultado.</p>
</div></footer>
</body>
</html>
"""
    destino = os.path.join(PROJ, "entregas.html")
    with open(destino, "w", encoding="utf-8") as f:
        f.write(doc)
    print("gerado:", destino, f"({len(doc)/1024:.0f} KB)")
    print("zips:", len(zips), "· capas:", len(capas), "· mockups:", len(mockups) + 1, "· anuncios:", len(anuncios))

if __name__ == "__main__":
    main()
