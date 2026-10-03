#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gerar_marketing.py — Coleção Vida em Ordem
Gera, a partir de um único script:

  marketing/capas/           capa 1600x2560 (PNG + JPG) dos 4 livros + teste de miniatura
  marketing/mockups/         5 poses por livro + hero do kit completo
  marketing/anuncios/        feed 1080x1350, story 1080x1920 e pin 1000x1500

Sem dependências além do Pillow e das fontes DejaVu (já instaladas no sistema).
Tipografia é desenhada de verdade: nada de texto "quebrado" de IA.

Uso:  python3 tools/gerar_marketing.py            (gera tudo)
      python3 tools/gerar_marketing.py --somente capas
"""
import os, sys, math, glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

RAIZ   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ   = os.path.join(RAIZ, "projeto-4-infoprodutos")
OUT    = os.path.join(PROJ, "marketing")
FONTS  = "/usr/share/fonts/truetype/dejavu"
F_SANS = os.path.join(FONTS, "DejaVuSans.ttf")
F_BOLD = os.path.join(FONTS, "DejaVuSans-Bold.ttf")
F_SRF  = os.path.join(FONTS, "DejaVuSerif.ttf")
F_SRFB = os.path.join(FONTS, "DejaVuSerif-Bold.ttf")

# ----------------------------------------------------------------------------- cores
def hx(c):
    if isinstance(c, (tuple, list)):
        return tuple(int(v) for v in c[:3])
    c = c.lstrip("#")
    return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))

def mix(c1, c2, t):
    a, b = hx(c1) if isinstance(c1, str) else c1, hx(c2) if isinstance(c2, str) else c2
    return tuple(int(round(a[i] + (b[i]-a[i])*t)) for i in range(3))

def claro(c, t=0.15): return mix(c, "#FFFFFF", t)
def escuro(c, t=0.25): return mix(c, "#000000", t)
def rgba(c, a): r, g, b = hx(c) if isinstance(c, str) else c; return (r, g, b, a)

# ----------------------------------------------------------------------------- fontes
_cache = {}
def fonte(caminho, tam):
    k = (caminho, tam)
    if k not in _cache:
        _cache[k] = ImageFont.truetype(caminho, tam)
    return _cache[k]

def largura_texto(d, txt, f, tracking=0, stroke=0):
    if not txt: return 0
    bb = d.textbbox((0, 0), txt, font=f, stroke_width=stroke)
    w = bb[2] - bb[0]
    return w + tracking * max(0, len(txt)-1)

def texto_espacado(d, xy, txt, f, fill, tracking=0, ancora="mm", stroke=0, stroke_fill=None):
    """Desenha texto com espaçamento entre letras. ancora: 'mm' (centro) ou 'la' (esq.)."""
    w = largura_texto(d, txt, f, tracking, stroke)
    x, y = xy
    if ancora == "mm": x -= w/2
    elif ancora == "ra": x -= w
    for ch in txt:
        d.text((x, y), ch, font=f, fill=fill, anchor="lm", stroke_width=stroke, stroke_fill=stroke_fill)
        x += d.textlength(ch, font=f) + tracking
    return w

def quebrar(d, txt, f, largura_max):
    palavras, linhas, atual = txt.split(), [], ""
    for p in palavras:
        teste = (atual + " " + p).strip()
        if largura_texto(d, teste, f) <= largura_max or not atual:
            atual = teste
        else:
            linhas.append(atual); atual = p
    if atual: linhas.append(atual)
    return linhas

# ----------------------------------------------------------------------------- formas
def gradiente(tam, c1, c2, horizontal=False):
    w, h = tam
    base = Image.new("RGB", (1, h if not horizontal else w))
    d = ImageDraw.Draw(base)
    n = base.height if not horizontal else base.width
    for i in range(n):
        d.point((0, i) if not horizontal else (i, 0), fill=mix(c1, c2, i/max(1, n-1)))
    return base.resize(tam, Image.Resampling.BILINEAR)

def brilho(tam, centro, raio, cor, alpha=80):
    w, h = tam
    pequeno = (max(2, w//8), max(2, h//8))
    layer = Image.new("L", pequeno, 0)
    d = ImageDraw.Draw(layer)
    cx, cy = centro[0]*pequeno[0]/w, centro[1]*pequeno[1]/h
    r = raio*pequeno[0]/w
    passos = 18
    for i in range(passos, 0, -1):
        t = i/passos
        d.ellipse([cx-r*t, cy-r*t*0.8, cx+r*t, cy+r*t*0.8], fill=int(alpha*(1-t)**1.4))
    layer = layer.resize((w, h), Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(max(4, w//60)))
    out = Image.new("RGBA", (w, h), rgba(cor, 0))
    out.putalpha(layer)
    return out

def sombra(img, desloc=(18, 26), blur=34, alpha=120):
    """Sombra projetada a partir do canal alfa de img. Retorna RGBA do mesmo tamanho."""
    a = img.split()[-1].point(lambda v: min(255, int(v*alpha/255)))
    s = Image.new("RGBA", img.size, (0, 0, 0, 0))
    s.putalpha(a)
    s = s.filter(ImageFilter.GaussianBlur(blur))
    base = Image.new("RGBA", img.size, (0, 0, 0, 0))
    base.alpha_composite(s, desloc)
    return base

# --------------------------------------------------------------- homografia (perspectiva)
def _solve(m, b):
    n = len(m)
    for i in range(n):
        p = max(range(i, n), key=lambda r: abs(m[r][i]))
        m[i], m[p] = m[p], m[i]; b[i], b[p] = b[p], b[i]
        piv = m[i][i]
        for r in range(i+1, n):
            f = m[r][i]/piv
            if f:
                for c in range(i, n): m[r][c] -= f*m[i][c]
                b[r] -= f*b[i]
    x = [0]*n
    for i in reversed(range(n)):
        s = b[i] - sum(m[i][c]*x[c] for c in range(i+1, n))
        x[i] = s/m[i][i]
    return x

def coeffs(destino, origem):
    """Coeficientes para Image.transform(PERSPECTIVE) levando o quad `destino` à origem."""
    m, b = [], []
    for (xd, yd), (xo, yo) in zip(destino, origem):
        m.append([xd, yd, 1, 0, 0, 0, -xo*xd, -xo*yd]); b.append(xo)
        m.append([0, 0, 0, xd, yd, 1, -yo*xd, -yo*yd]); b.append(yo)
    return _solve(m, b)

def colar_perspectiva(base, img, destino, origem=None):
    """Cola img (RGBA) em `base` deformada de forma que `destino` (4 pontos) vire o retângulo da img."""
    if origem is None:
        w, h = img.size
        origem = [(0, 0), (w, 0), (w, h), (0, h)]
    c = coeffs(destino, origem)
    def _f(p):
        x, y = p
        d = c[6]*x + c[7]*y + 1
        return ((c[0]*x + c[1]*y + c[2])/d, (c[3]*x + c[4]*y + c[5])/d)
    inv = [_f(p) for p in destino]
    tr = img.transform(base.size, Image.Transform.PERSPECTIVE, c, Image.Resampling.BICUBIC).convert("RGBA")
    base.alpha_composite(tr)
    return inv

# ----------------------------------------------------------------------------- LIVROS
LIVROS = [
    dict(n=1, slug="vol1-ia", pasta="livro-1",
         eyebrow="COLEÇÃO VIDA EM ORDEM",
         promessa="200 PROMPTS PRONTOS",
         titulo=[[("IA QUE", "w"), ("TRABALHA", "a")], [("POR VOCÊ", "w")]],
         sub="O método 5D para delegar a parte chata do dia — sem precisar programar.",
         bullets=["200 prompts em português, organizados por profissão",
                  "12 automações explicadas passo a passo (sem código)",
                  "Tabela de preços: 8 serviços que você pode cobrar"],
         selo="INCLUI PLANILHA DE HORAS + SCRIPTS DE ABORDAGEM",
         icone="chip",
         prim="#1B2A4A", acen="#00A98A", luz="#E8F7F3",
         cena="cena-ia.jpg",
         hook="3 horas de relatório → 15 minutos com o prompt certo",
         hook_curto="O PROMPT CERTO FAZ EM\n15 MINUTOS O QUE VOCÊ\nFAZ EM 3 HORAS",
         oferta="200 prompts em português + 12 automações passo a passo",
         interno_titulo="CAPÍTULO 1", interno_sub="A conta que ninguém faz",
         interno_txt=("No fim deste capítulo você vai saber exatamente quanto custa, em reais, cada tarefa "
                      "que você faz manualmente. Pegue seu salário bruto mensal e divida pelas horas que "
                      "você trabalha por mês. Esse é o seu valor de partida — e toda tarefa repetitiva que "
                      "você faz à mão está sendo paga por esse valor."),
         interno_box="FAÇA AGORA (10 MIN)", interno_box_txt="Calcule o valor da sua hora e anote 3 tarefas repetitivas do seu dia.",
         interno_lista=["Diagnóstico", "Delegação", "Direção", "Documentação", "Dinheiro"]),
    dict(n=2, slug="vol2-dividas", pasta="livro-2",
         eyebrow="COLEÇÃO VIDA EM ORDEM",
         promessa="PLANO DE 60 DIAS",
         titulo=[[("SAIA DO", "w")], [("VERMELHO", "a")]],
         sub="O método R.E.A.L. para organizar e negociar suas dívidas — com 15 scripts prontos.",
         bullets=["Planilha Raio-X e calculadora de parcela",
                  "15 scripts para chat, telefone, e-mail e cobrança",
                  "Guia de direitos: cobrança abusiva e blindagem do CPF"],
         selo="INCLUI PLANILHAS EDITÁVEIS + CALCULADORA",
         icone="grafico",
         prim="#0E3B2E", acen="#B58A0F", luz="#FBF4E2",
         cena="cena-dividas.jpg",
         hook="Ninguém te ensina a ordem: organizar, enxugar, negociar e quitar",
         hook_curto="15 SCRIPTS PRONTOS\nPARA NEGOCIAR SUAS\nDÍVIDAS",
         oferta="O plano de 60 dias, com calculadora de parcela e o que exigir por escrito",
         interno_titulo="CAPÍTULO 1", interno_sub="Raio-X: saber exatamente quanto você deve",
         interno_txt=("O medo que você sente não é do número: é da falta do número. Enquanto ele é vago, "
                      "ele é infinito. Quando vira uma planilha com sete linhas, ele passa a ser um problema "
                      "de engenharia — e problema de engenharia se resolve por etapas."),
         interno_box="SCRIPT PRONTO", interno_box_txt="“Consigo pagar à vista, mas preciso de desconto. Qual é a melhor condição?”",
         interno_lista=["Raio-X", "Enxugamento", "Acordo", "Liquidação"]),
    dict(n=3, slug="vol3-airfryer", pasta="livro-3",
         eyebrow="COLEÇÃO VIDA EM ORDEM",
         promessa="120 RECEITAS COM CUSTO POR PORÇÃO",
         titulo=[[("AIRFRYER", "a")], [("SEM MIMIMI", "w")]],
         sub="O sistema 20-5-7: 7 marmitas em 90 minutos, com custo por porção em cada receita.",
         bullets=["Tempo e temperatura para 2L, 4L e 5L",
                  "Custo por porção em cada receita",
                  "Cardápio de 30 dias + tabela de temperatura"],
         selo="INCLUI TEMPO, TEMPERATURA E CUSTO POR PORÇÃO",
         icone="airfryer",
         prim="#5A1F0E", acen="#F2A93B", luz="#FDF3E4",
         cena="cena-airfryer.jpg",
         hook="Jantar para 3 pessoas por menos de R$ 25 — em 20 minutos",
         hook_curto="JANTAR PARA 3\nPOR MENOS DE R$ 25\nNA AIRFRYER",
         oferta="120 receitas com tempo, temperatura, litragem e custo por porção",
         interno_titulo="CAPÍTULO 4", interno_sub="Jantares em 20 minutos",
         interno_txt=("Você já fez tudo certo e mesmo assim comeu um pedaço de papelão. Acontece com todo "
                      "mundo nas primeiras semanas — e quase sempre por uma das seis razões. Aprenda estas "
                      "e você acerta 80% das receitas sem pensar."),
         interno_box="ATENÇÃO", interno_box_txt="Mudou a litragem da airfryer? Recalcule o tempo: menos cesto, menos tempo.",
         interno_lista=["20 min", "5 ingredientes", "7 marmitas", "R$ 25"]),
    dict(n=4, slug="vol4-energia", pasta="livro-4",
         eyebrow="COLEÇÃO VIDA EM ORDEM",
         promessa="15 MINUTOS POR DIA · 21 DIAS",
         titulo=[[("ENERGIA", "a")], [("EM 21 DIAS", "w")]],
         sub="O protocolo S.O.N.O. para organizar noites e manhãs — com trilha para quem trabalha à noite.",
         bullets=["A tarefa de cada dia, uma página por dia",
                  "Rastreador de 21 dias + 3 áudios guiados",
                  "Kit da noite, kit da manhã e protocolo de noites ruins"],
         selo="INCLUI ÁUDIOS GUIADOS + RASTREADOR IMPRIMÍVEL",
         icone="sol",
         prim="#1E2A5A", acen="#E8B65A", luz="#F0F3FA",
         cena="cena-energia.jpg",
         hook="15 minutos por dia, 21 dias: organize noites e manhãs",
         hook_curto="15 MINUTOS POR DIA\n21 DIAS PARA ORGANIZAR\nSUAS NOITES E MANHÃS",
         oferta="Protocolo S.O.N.O. + rastreador + 3 áudios guiados",
         interno_titulo="DIA 1", interno_sub="A primeira hora decide o resto",
         interno_txt=("Antes de mudar hábito, entenda o mecanismo. Dentro de você existe um maestro: ele "
                      "não toca nenhum instrumento, ele rege a orquestra. E ele se acerta pelo relógio "
                      "externo — principalmente pela luz."),
         interno_box="HOJE VOCÊ FAZ SÓ ISSO", interno_box_txt="10 minutos de luz natural na primeira hora depois de acordar.",
         interno_lista=["S", "O", "N", "O"]),
]

# ----------------------------------------------------------------------------- ícones
def icone(kind, img, cx, cy, esc, cor, cor2, cor3):
    d = ImageDraw.Draw(img, "RGBA")
    if kind == "chip":
        s = esc*0.46
        cx0, cy0 = cx-s, cy-s
        for i in range(4):
            off = cy0 + s*0.5 + i*s*0.5 - s*0.06
            d.line([cx0-s*0.16, off, cx0, off], fill=rgba(cor2, 190), width=int(esc*0.022))
            d.line([cx0+2*s, off, cx0+2*s+s*0.16, off], fill=rgba(cor2, 190), width=int(esc*0.022))
        for i in range(4):
            off = cx0 + s*0.5 + i*s*0.5 - s*0.06
            d.line([off, cy0-s*0.16, off, cy0], fill=rgba(cor2, 190), width=int(esc*0.022))
            d.line([off, cy0+2*s, off, cy0+2*s+s*0.16], fill=rgba(cor2, 190), width=int(esc*0.022))
        d.rounded_rectangle([cx0, cy0, cx0+2*s, cy0+2*s], radius=int(s*0.22),
                            fill=rgba(cor, 255), outline=rgba(cor2, 255), width=int(esc*0.018))
        p = s*0.62
        d.polygon([(cx-p*0.12, cy-p*0.95), (cx+p*0.55, cy-p*0.95), (cx+p*0.08, cy-p*0.08),
                   (cx+p*0.62, cy-p*0.08), (cx-p*0.30, cy+p*1.0), (cx-p*0.02, cy+p*0.06),
                   (cx-p*0.58, cy+p*0.06)], fill=rgba(cor3, 255))
    elif kind == "grafico":
        base_y = cy + esc*0.34
        for i, alt in enumerate([0.34, 0.56, 0.82]):
            x = cx - esc*0.42 + i*esc*0.29
            d.rounded_rectangle([x, base_y-esc*alt, x+esc*0.20, base_y], radius=int(esc*0.03),
                                fill=rgba(cor2, 200 if i < 2 else 255))
        d.line([cx-esc*0.52, base_y, cx+esc*0.52, base_y], fill=rgba(cor3, 255), width=int(esc*0.022))
        a, b = (cx+esc*0.02, base_y-esc*0.32), (cx+esc*0.30, base_y-esc*0.86)
        esp = esc*0.055
        d.line([a, b], fill=rgba(cor3, 255), width=int(esc*0.075))
        d.polygon([(b[0]-esp*0.4, b[1]-esp*0.6), (b[0]+esp*1.5, b[1]+esp*0.1),
                   (b[0]-esp*0.5, b[1]+esp*1.5)], fill=rgba(cor3, 255))
        d.line([(cx+esc*0.08, base_y-esc*0.76), (cx+esc*0.30, base_y-esc*0.76)],
               fill=rgba("#FFFFFF", 90), width=int(esc*0.02))
    elif kind == "airfryer":
        w = esc*0.62; h = esc*0.60; top = cy - h*0.22
        d.rounded_rectangle([cx-w, top, cx+w, top+h], radius=int(w*0.26), fill=rgba(cor, 255),
                            outline=rgba(cor3, 200), width=int(esc*0.016))
        d.rounded_rectangle([cx-w*0.86, top+h*0.52, cx+w*0.86, top+h*0.92], radius=int(w*0.16),
                            fill=rgba(cor3, 255))
        d.line([cx-w*0.86, top+h*0.52, cx+w*0.86, top+h*0.52], fill=rgba(cor2, 255), width=int(esc*0.02))
        d.rounded_rectangle([cx-w*0.62, top-h*0.20, cx+w*0.62, top+h*0.06], radius=int(w*0.12),
                            fill=rgba(cor2, 255))
        for i in range(3):
            x = cx - w*0.36 + i*w*0.36
            d.line([(x, top+h*0.38), (x, top+h*0.62)], fill=rgba(cor, 150), width=int(esc*0.014))
    elif kind == "sol":
        r = esc*0.34
        for i in range(12):
            a = math.radians(i*30)
            x1, y1 = cx+math.cos(a)*r*1.28, cy+math.sin(a)*r*1.28
            x2, y2 = cx+math.cos(a)*r*1.62, cy+math.sin(a)*r*1.62
            d.line([(x1, y1), (x2, y2)], fill=rgba(cor2, 235), width=int(esc*0.028))
        d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=rgba(cor2, 255))
        d.ellipse([cx-r*0.62, cy-r*0.62, cx+r*0.62, cy+r*0.62], fill=rgba(cor3, 255))
        mr = esc*0.17
        mx, my = cx + esc*0.70, cy - esc*0.40
        d.ellipse([mx-mr, my-mr, mx+mr, my+mr], fill=rgba(cor3, 255))
        d.ellipse([mx-mr*0.72, my-mr*1.10, mx+mr*1.28, my+mr*0.90], fill=rgba(cor, 255))
        d.line([cx-esc*0.72, cy+esc*0.50, cx+esc*0.72, cy+esc*0.50], fill=rgba(cor3, 160), width=int(esc*0.012))

# ----------------------------------------------------------------------------- capa
def capa(b, destino_base):
    W, H = 1600, 2560
    prim, acen, luz = b["prim"], b["acen"], b["luz"]
    img = gradiente((W, H), claro(prim, 0.14), escuro(prim, 0.42)).convert("RGBA")
    img.alpha_composite(brilho((W, H), (W//2, int(H*0.34)), int(W*0.95), acen, 92))
    img.alpha_composite(brilho((W, H), (int(W*0.14), int(H*0.86)), int(W*0.7), acen, 34))
    d = ImageDraw.Draw(img, "RGBA")

    d.rectangle([0, 0, W, 18], fill=rgba(acen, 255))
    d.rectangle([0, H-176, W, H-158], fill=rgba(acen, 255))
    d.rectangle([0, H-158, W, H], fill=rgba(escuro(prim, 0.55), 255))

    # eyebrow + número da coleção
    f_eb = fonte(F_BOLD, 44)
    texto_espacado(d, (W//2, 108), b["eyebrow"], f_eb, rgba(luz, 225), tracking=14)
    f_vol = fonte(F_BOLD, 40)
    texto_espacado(d, (W//2, 186), f"VOL. {b['n']}", f_vol, rgba(acen, 255), tracking=8)

    # selo de promessa
    f_pr = fonte(F_BOLD, 62)
    txtp = b["promessa"]
    while largura_texto(d, txtp, f_pr, 6) > W - 420 and f_pr.size > 34:
        f_pr = fonte(F_BOLD, f_pr.size-2)
    wp = largura_texto(d, txtp, f_pr, 6) + 108
    alvo_h = 112
    d.rounded_rectangle([W/2-wp/2, 248, W/2+wp/2, 248+alvo_h], radius=alvo_h//2, fill=rgba(acen, 255))
    texto_espacado(d, (W/2, 248+alvo_h/2), txtp, f_pr, rgba(escuro(prim, 0.55), 255), tracking=6)

    # ícone
    icone(b["icone"], img, W/2, int(H*0.288), 596, escuro(prim, 0.38), acen, luz)

    # título
    y = int(H*0.435)
    for linha in b["titulo"]:
        tam = 210
        while True:
            f = fonte(F_BOLD, tam)
            largura = sum(largura_texto(d, t, f, 4) for t, _ in linha) + 26*(len(linha)-1)
            if largura <= W - 320 or tam <= 84:
                break
            tam -= 6
        x = W/2 - largura/2
        for t, papel in linha:
            cor = luz if papel == "w" else acen
            texto_espacado(d, (x, y), t, f, rgba(cor, 255), tracking=4, ancora="la",
                           stroke=9, stroke_fill=rgba(escuro(prim, 0.62), 255))
            x += largura_texto(d, t, f, 4) + 26
        y += int(tam*1.06)

    # subtítulo
    f_sub = fonte(F_SANS, 62)
    y += 26
    for ln in quebrar(d, b["sub"], f_sub, W-300)[:3]:
        texto_espacado(d, (W/2, y), ln, f_sub, rgba(luz, 232), tracking=1)
        y += 84
    y += 34

    # lista de entregáveis
    f_b = fonte(F_SANS, 50)
    linhas_b = []
    while True:
        linhas_b = [ln for item in b["bullets"] for ln in quebrar(d, item, f_b, W-430)]
        if (len(linhas_b) <= 6 and max(largura_texto(d, ln, f_b) for ln in linhas_b) <= W-430) or f_b.size <= 32:
            break
        f_b = fonte(F_SANS, f_b.size-2)
    lh = int(f_b.size*1.5)
    for ln in linhas_b:
        d.ellipse([176, y-16, 214, y+22], fill=rgba(acen, 255))
        d.line([(186, y+3), (194, y+11), (206, y-7)], fill=rgba(escuro(prim, 0.6), 255), width=6)
        texto_espacado(d, (242, y), ln, f_b, rgba(luz, 210), ancora="la")
        y += lh

    # selo de bônus (caixa tracejada)
    f_s = fonte(F_BOLD, 40)
    yb = H - 300
    caixa = [140, yb, W-140, yb+92]
    d.rounded_rectangle(caixa, radius=22, outline=rgba(acen, 220), width=5)
    linha = b["selo"]
    fs = f_s
    while largura_texto(d, linha, fs, 3) > (W-340) and fs.size > 24:
        fs = fonte(F_BOLD, fs.size-2)
    texto_espacado(d, (W/2, yb+47), linha, fs, rgba(acen, 255), tracking=3)

    # rodapé
    esq, dir_ = f"VOL. {b['n']} · VIDA EM ORDEM", "PDF + EPUB + BÔNUS"
    f_r = fonte(F_BOLD, 40)
    while max(largura_texto(d, esq, f_r, 5), largura_texto(d, dir_, f_r, 5)) > W/2 - 200 and f_r.size > 20:
        f_r = fonte(F_BOLD, f_r.size-2)
    texto_espacado(d, (140, H-80), esq, f_r, rgba(luz, 200), tracking=5, ancora="la")
    texto_espacado(d, (W-140, H-80), dir_, f_r, rgba(acen, 230), tracking=5, ancora="ra")

    caminho_png = destino_base + ".png"
    img.convert("RGB").save(caminho_png, "PNG", optimize=True)
    img.convert("RGB").save(destino_base + ".jpg", "JPEG", quality=92, optimize=True, subsampling=0)
    mini = img.convert("RGB").resize((150, 240), Image.Resampling.LANCZOS)
    mini.save(os.path.join(OUT, "_teste-miniatura", os.path.basename(destino_base) + "-150px.png"))
    return caminho_png

# ----------------------------------------------------------------------------- livro 3D
def livro_3d(capa_img, altura=1200, persp=0.010, com_lombada=True):
    """Monta um livro em pé (frente + lombada + miolo) a partir da capa, como RGBA."""
    w = int(altura/1.6)
    frente = capa_img.convert("RGBA").resize((w, altura), Image.Resampling.LANCZOS)
    lon = int(w*0.055) if com_lombada else 1
    total = Image.new("RGBA", (w+lon+int(w*0.02)+8, altura+int(altura*0.03)+8), (0, 0, 0, 0))
    dx = 6
    dx2 = dx + lon
    dy = 4
    dy2 = dy + int(altura*0.022)
    # miolo (folhas) atrás, à direita
    miolo = Image.new("RGBA", (w, altura), (250, 248, 244, 255))
    dm = ImageDraw.Draw(miolo)
    for i in range(0, altura, 7):
        dm.line([(0, i), (w, i)], fill=(232, 228, 220, 255), width=1)
    colar_perspectiva(total, miolo, [(dx2+8, dy+6), (dx2+w+10, dy2), (dx2+w+10, dy2+altura), (dx2+8, dy+6+altura)])
    # lombada
    if com_lombada:
        lomb = gradiente((lon, altura), claro(capa_img.convert("RGB").getpixel((8, 40)), 0.02), escuro(capa_img.convert("RGB").getpixel((8, 40)), 0.35))
        lomb = lomb.convert("RGBA")
        dl = ImageDraw.Draw(lomb, "RGBA")
        dl.line([(int(lon*0.16), 24), (int(lon*0.16), altura-24)], fill=(255, 255, 255, 60), width=3)
        dl.line([(int(lon*0.84), 20), (int(lon*0.84), altura-20)], fill=(0, 0, 0, 90), width=4)
        colar_perspectiva(total, lomb, [(dx, dy2), (dx+lon, dy+2), (dx+lon, dy+altura), (dx, dy2+altura)])
    colar_perspectiva(total, frente, [(dx2, dy+2), (dx2+w, dy2), (dx2+w, dy2+altura), (dx2, dy+2+altura)])
    return total

def colar_3d(base, livro, centro, altura_alvo, rot=0.0):
    esc = altura_alvo/livro.height
    lv = livro.resize((max(1, int(livro.width*esc)), altura_alvo), Image.Resampling.LANCZOS)
    if rot: lv = lv.rotate(rot, expand=True, resample=Image.Resampling.BICUBIC)
    s = sombra(lv, (16, 26), 30, 130)
    x, y = int(centro[0]-lv.width/2), int(centro[1]-lv.height/2)
    base.alpha_composite(s, (x, y))
    base.alpha_composite(lv, (x, y))
    return (x, y, lv.width, lv.height)

# ----------------------------------------------------------------------------- página interna
def pagina_interna(b, qual="box"):
    W, H = 1000, 1400
    prim, acen, luz = b["prim"], b["acen"], b["luz"]
    img = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    d = ImageDraw.Draw(img, "RGBA")
    d.rectangle([0, 0, W, 12], fill=hx(prim))
    f_eb = fonte(F_BOLD, 26); f_ti = fonte(F_BOLD, 54); f_bd = fonte(F_SANS, 27); f_pq = fonte(F_SANS, 22)
    texto_espacado(d, (72, 92), b["interno_titulo"], f_eb, rgba(acen, 255), tracking=5, ancora="la")
    y = 150
    for ln in quebrar(d, b["interno_sub"], f_ti, W-144)[:2]:
        d.text((72, y), ln, font=f_ti, fill=hx(prim)); y += 66
    y += 22
    for ln in quebrar(d, b["interno_txt"], f_bd, W-144)[:9]:
        d.text((72, y), ln, font=f_bd, fill=hx(mix(prim, "#000000", 0.35))); y += 42
    if qual == "box":
        y += 30
        caixa = [72, y, W-72, y+250]
        d.rounded_rectangle(caixa, radius=18, fill=rgba(luz, 255), outline=rgba(acen, 255), width=4)
        d.rounded_rectangle([72, y, 92, y+250], radius=10, fill=rgba(acen, 255))
        texto_espacado(d, (116, y+46), b["interno_box"], fonte(F_BOLD, 30), rgba(escuro(prim, 0.3), 255), tracking=2, ancora="la")
        yy = y+100
        for ln in quebrar(d, b["interno_box_txt"], fonte(F_SANS, 26), W-260)[:4]:
            d.text((116, yy), ln, font=fonte(F_SANS, 26), fill=hx(mix(prim, "#000000", 0.45))); yy += 38
    else:
        y += 26
        for i, item in enumerate(b["interno_lista"]):
            yy = y + i*92
            d.rounded_rectangle([72, yy, W-72, yy+74], radius=14,
                                fill=rgba(luz, 255) if i % 2 == 0 else (255, 255, 255, 255),
                                outline=rgba(acen, 160), width=3)
            d.ellipse([96, yy+18, 132, yy+54], fill=rgba(acen, 255))
            d.text((114, yy+36), str(i+1), font=fonte(F_BOLD, 24), fill=hx(escuro(prim, 0.45)), anchor="mm")
            d.text((156, yy+36), item, font=fonte(F_SANS, 30), fill=hx(prim), anchor="lm")
    d.line([(72, H-90), (W-72, H-90)], fill=rgba(prim, 60), width=2)
    d.text((72, H-62), f"Vol. {b['n']} — {b['titulo'][0][0][0].title()}...", font=f_pq, fill=rgba(prim, 150), anchor="lm")
    d.text((W-72, H-62), "1", font=f_pq, fill=rgba(prim, 150), anchor="rm")
    return img

# ----------------------------------------------------------------------------- mockups
def fundo_estudio(b, tam, luz_extra=True):
    img = gradiente(tam, claro(b["prim"], 0.72), claro(b["prim"], 0.30)).convert("RGBA")
    if luz_extra:
        img.alpha_composite(brilho(tam, (int(tam[0]*0.5), int(tam[1]*0.32)), int(tam[0]*0.85), b["acen"], 60))
    d = ImageDraw.Draw(img, "RGBA")
    d.ellipse([-tam[0]*0.2, int(tam[1]*0.74), tam[0]*1.2, int(tam[1]*1.35)], fill=rgba(escuro(b["prim"], 0.18), 90))
    return img

def mock_livro_em_pe(b, livro3d, destino):
    W, H = 1600, 2000
    img = fundo_estudio(b, (W, H))
    colar_3d(img, livro3d, (W*0.5, H*0.47), 1180, rot=-1.5)
    d = ImageDraw.Draw(img, "RGBA")
    f = fonte(F_BOLD, 54); texto_espacado(d, (W/2, H*0.905), b["promessa"], f, rgba(b["acen"], 255), tracking=8)
    f2 = fonte(F_SANS, 40); texto_espacado(d, (W/2, H*0.952), "PDF + EPUB + BÔNUS · acesso imediato", f2, rgba("#FFFFFF", 210), tracking=3)
    img.convert("RGB").save(destino, "JPEG", quality=92, subsampling=0)

def mock_aberto(b, paginas, destino):
    W, H = 1800, 1300
    img = fundo_estudio(b, (W, H), False)
    img.alpha_composite(brilho((W, H), (W//2, int(H*0.30)), int(W*0.7), b["acen"], 55))
    esq, dir_ = paginas
    cx, topo, base = W/2, 150, 1080
    # sombra geral
    sombra_pag = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ds = ImageDraw.Draw(sombra_pag, "RGBA")
    ds.polygon([(cx-760, topo+80), (cx-40, topo), (cx-40, base), (cx-760, base+30)], fill=(0, 0, 0, 120))
    ds.polygon([(cx+40, topo), (cx+760, topo+80), (cx+760, base+30), (cx+40, base)], fill=(0, 0, 0, 120))
    img.alpha_composite(sombra_pag.filter(ImageFilter.GaussianBlur(34)))
    colar_perspectiva(img, esq, [(cx-740, topo+96), (cx-26, topo+14), (cx-26, base-6), (cx-740, base+40)])
    colar_perspectiva(img, dir_, [(cx+26, topo+14), (cx+740, topo+96), (cx+740, base+40), (cx+26, base-6)])
    d = ImageDraw.Draw(img, "RGBA")
    # vinco central
    v = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dv = ImageDraw.Draw(v, "RGBA")
    dv.rectangle([cx-46, topo-10, cx+46, base+40], fill=(0, 0, 0, 90))
    img.alpha_composite(v.filter(ImageFilter.GaussianBlur(26)))
    f = fonte(F_SANS, 40)
    texto_espacado(d, (W/2, H-100), f"por dentro: 1 ideia por página, passo a passo", f, rgba("#FFFFFF", 200), tracking=2)
    img.convert("RGB").save(destino, "JPEG", quality=92, subsampling=0)

def mock_tablet_celular(b, capa_img, pag, destino):
    W, H = 1800, 1500
    img = fundo_estudio(b, (W, H), False)
    img.alpha_composite(brilho((W, H), (int(W*0.62), int(H*0.30)), int(W*0.7), b["acen"], 60))
    # tablet
    tw, th = 880, 1180
    tab = Image.new("RGBA", (tw, th), (18, 18, 22, 255))
    dt = ImageDraw.Draw(tab)
    dt.rounded_rectangle([8, 8, tw-8, th-8], radius=34, fill=hx(escuro(b["prim"], 0.35)))
    tab.alpha_composite(capa_img.convert("RGBA").resize((tw-84, int((tw-84)*1.6)), Image.Resampling.LANCZOS).crop((0, 0, tw-84, th-128)), (42, 54))
    tab = tab.rotate(-4, expand=True, resample=Image.Resampling.BICUBIC)
    s = sombra(tab, (14, 26), 30, 140)
    img.alpha_composite(s, (int(W*0.30-tab.width/2), int(H*0.52-tab.height/2)))
    img.alpha_composite(tab, (int(W*0.30-tab.width/2), int(H*0.52-tab.height/2)))
    # celular
    cw, ch = 430, 860
    cel = Image.new("RGBA", (cw, ch), (16, 16, 20, 255))
    dc = ImageDraw.Draw(cel)
    dc.rounded_rectangle([8, 8, cw-8, ch-8], radius=58, fill=hx(escuro(b["prim"], 0.28)))
    pg = pag.convert("RGBA").resize((cw-64, ch-100), Image.Resampling.LANCZOS)
    cel.alpha_composite(pg, (32, 50))
    dc.rounded_rectangle([cw/2-46, 20, cw/2+46, 34], radius=7, fill=(30, 30, 34, 255))
    cel = cel.rotate(5, expand=True, resample=Image.Resampling.BICUBIC)
    s2 = sombra(cel, (12, 20), 26, 150)
    img.alpha_composite(s2, (int(W*0.755-cel.width/2), int(H*0.50-cel.height/2)))
    img.alpha_composite(cel, (int(W*0.755-cel.width/2), int(H*0.50-cel.height/2)))
    d = ImageDraw.Draw(img, "RGBA")
    f = fonte(F_BOLD, 46)
    texto_espacado(d, (W/2, H-92), "LEIA NO CELULAR, NO TABLET OU IMPRIMA", f, rgba("#FFFFFF", 225), tracking=6)
    img.convert("RGB").save(destino, "JPEG", quality=92, subsampling=0)

def _cartao(titulo, linhas, cor, tam=(760, 900), grade=False, checks=False):
    w, h = tam
    c = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    d = ImageDraw.Draw(c, "RGBA")
    d.rounded_rectangle([0, 0, w-1, h-1], radius=28, fill=(255, 255, 255, 255), outline=hx(cor)+(255,), width=6)
    d.rounded_rectangle([0, 0, w-1, 120], radius=28, fill=hx(cor)+(255,))
    d.rectangle([0, 90, w-1, 122], fill=hx(cor)+(255,))
    texto_espacado(d, (44, 60), titulo, fonte(F_BOLD, 44), (255, 255, 255, 255), tracking=4, ancora="lm")
    if grade:
        for i in range(1, 8):
            d.line([(44, 200+i*78), (w-44, 200+i*78)], fill=hx(claro(cor, 0.55))+(255,), width=2)
        for j in range(1, 4):
            d.line([(44+j*(w-88)/4, 200), (44+j*(w-88)/4, 200+7*78)], fill=hx(claro(cor, 0.55))+(255,), width=2)
        for j in range(4):
            d.rounded_rectangle([60+j*((w-120)/4), 214, 60+j*((w-120)/4)+((w-140)/4), 262], radius=6,
                                fill=hx(claro(cor, 0.78))+(255,))
    if checks:
        for i in range(6):
            yy = 200 + i*100
            d.rounded_rectangle([50, yy, 106, yy+56], radius=10, outline=hx(cor)+(255,), width=5)
            d.line([(64, yy+30), (76, yy+42), (96, yy+14)], fill=hx(cor)+(255,), width=7)
            d.rounded_rectangle([128, yy+14, 128+int((w-200)*0.72), yy+42], radius=8, fill=hx(claro(cor, 0.72))+(255,))
    else:
        for i, ln in enumerate(linhas):
            d.text((44, 200+i*74), ln, font=fonte(F_SANS, 34), fill=hx(mix(cor, "#000000", 0.35)), anchor="lm")
    return c

def mock_stack(b, livro3d, destino):
    W, H = 1800, 1400
    img = fundo_estudio(b, (W, H))
    colar_3d(img, livro3d, (W*0.30, H*0.50), 980, rot=-3)
    plan = _cartao("PLANILHA", [], b["prim"], grade=True).rotate(-4, expand=True, resample=Image.Resampling.BICUBIC)
    plan = plan.resize((int(plan.width*0.72), int(plan.height*0.72)), Image.Resampling.LANCZOS)
    img.alpha_composite(sombra(plan, (12, 20), 26, 130), (int(W*0.70-plan.width/2), int(H*0.40-plan.height/2)))
    img.alpha_composite(plan, (int(W*0.70-plan.width/2), int(H*0.40-plan.height/2)))
    chk = _cartao("CHECKLIST", [], b["acen"], checks=True).rotate(5, expand=True, resample=Image.Resampling.BICUBIC)
    chk = chk.resize((int(chk.width*0.62), int(chk.height*0.62)), Image.Resampling.LANCZOS)
    img.alpha_composite(sombra(chk, (10, 18), 24, 120), (int(W*0.755-chk.width/2), int(H*0.76-chk.height/2)))
    img.alpha_composite(chk, (int(W*0.755-chk.width/2), int(H*0.76-chk.height/2)))
    d = ImageDraw.Draw(img, "RGBA")
    f = fonte(F_BOLD, 46)
    texto_espacado(d, (W/2, 70), "O KIT QUE VEM JUNTO", f, rgba("#FFFFFF", 230), tracking=8)
    img.convert("RGB").save(destino, "JPEG", quality=92, subsampling=0)

def mock_kit_completo(capas, destino, titulo="COLEÇÃO VIDA EM ORDEM", sub="4 livros · tempo, dinheiro, comida e energia"):
    W, H = 2240, 1500
    img = gradiente((W, H), "#F4F6FB", "#D8DEE9").convert("RGBA")
    img.alpha_composite(brilho((W, H), (W//2, int(H*0.25)), int(W*0.75), "#FFFFFF", 160))
    d = ImageDraw.Draw(img, "RGBA")
    texto_espacado(d, (W/2, 96), titulo, fonte(F_BOLD, 62), hx("#161B33"), tracking=12)
    texto_espacado(d, (W/2, 176), sub, fonte(F_SANS, 42), hx("#4A5470"), tracking=3)
    livros = [livro_3d(c, altura=900) for c in capas]
    gap = 100
    conj = [lv.rotate(-5 + i*2.6, expand=True, resample=Image.Resampling.BICUBIC) for i, lv in enumerate(livros)]
    total = sum(l.width for l in conj) + gap*(len(conj)-1)
    limite = W - 200
    if total > limite:
        k = limite/total
        conj = [l.resize((max(1, int(l.width*k)), max(1, int(l.height*k))), Image.Resampling.LANCZOS) for l in conj]
        gap = int(gap*k)
    total = sum(l.width for l in conj) + gap*(len(conj)-1)
    x = (W-total)/2
    for i, lvr in enumerate(conj):
        pos = (int(x), int(H*0.56-lvr.height/2 + abs(i-1.5)*16))
        img.alpha_composite(sombra(lvr, (14, 24), 28, 120), (pos[0]+14, pos[1]+24))
        img.alpha_composite(lvr, pos)
        x += lvr.width + gap
    texto_espacado(d, (W/2, H-96), "PDF + EPUB + BÔNUS EM CADA VOLUME", fonte(F_BOLD, 42), hx("#161B33"), tracking=8)
    img.convert("RGB").save(destino, "JPEG", quality=92, subsampling=0)

# ----------------------------------------------------------------------------- anúncios
def _scrim(tam, cor="#000000", forca=0.92, topo=0.35):
    w, h = tam
    layer = Image.new("L", (1, h))
    d = ImageDraw.Draw(layer)
    for y in range(h):
        t = y/h
        v = 0 if t < topo else int(255*forca*((t-topo)/(1-topo))**1.15)
        d.point((0, y), fill=min(255, v))
    layer = layer.resize((w, h))
    out = Image.new("RGBA", (w, h), rgba(cor, 0))
    out.putalpha(layer)
    return out

def _scrim_topo(tam, cor="#000000", forca=0.80, altura=0.20):
    w, h = tam
    layer = Image.new("L", (1, h))
    d = ImageDraw.Draw(layer)
    for y in range(h):
        t = y/h
        v = 0 if t > altura else int(255*forca*(1-t/altura)**1.2)
        d.point((0, y), fill=min(255, v))
    return Image.merge("RGBA", (*Image.new("L", (w, h), 0).split()[:2], layer, Image.new("L", (w, h), 255)))._new_core if False else _alpha_over((w, h), cor, layer)

def _alpha_over(tam, cor, layer):
    out = Image.new("RGBA", tam, rgba(cor, 0))
    out.putalpha(layer.resize(tam))
    return out

def _cena(caminho, tam):
    if not caminho or not os.path.exists(caminho):
        return gradiente(tam, "#2A2E3A", "#11141C").convert("RGBA")
    im = Image.open(caminho).convert("RGB")
    return ImageOps.fit(im, tam, Image.Resampling.LANCZOS, centering=(0.5, 0.45)).convert("RGBA")

def _cta(d, xy, texto, acen, prim, tam=44, pad=(52, 26)):
    f = fonte(F_BOLD, tam)
    w = largura_texto(d, texto, f, 2) + pad[0]*2
    h = tam + pad[1]*2
    x, y = xy
    d.rounded_rectangle([x-w/2, y-h/2, x+w/2, y+h/2], radius=h//2, fill=rgba(acen, 255))
    texto_espacado(d, (x, y), texto, f, rgba(escuro(prim, 0.62), 255), tracking=2)
    return h

def anuncio(b, livro3d, destino, formato="feed"):
    if formato == "feed":   W, H = 1080, 1350
    elif formato == "story":W, H = 1080, 1920
    else:                   W, H = 1000, 1500
    cena = _cena(os.path.join(OUT, "_cenas", b["cena"]), (W, H))
    img = cena.copy()
    img.alpha_composite(_scrim((W, H), "#05070E", 0.94, 0.28 if formato != "story" else 0.42))
    img.alpha_composite(_scrim_topo((W, H), "#05070E", 0.82, 0.17))
    d = ImageDraw.Draw(img, "RGBA")

    texto_espacado(d, (72, 78), f"VOL. {b['n']} · COLEÇÃO VIDA EM ORDEM", fonte(F_BOLD, 30), rgba(b["acen"], 255), tracking=6, ancora="la")

    esc = 0.335 if formato == "feed" else 0.38
    larg = int(W*esc)
    lv = livro3d.resize((larg, int(livro3d.height*larg/livro3d.width)), Image.Resampling.LANCZOS)
    lv = lv.rotate(-6, expand=True, resample=Image.Resampling.BICUBIC)
    lv_pos = (W-lv.width-30, int(H*0.10) if formato == "feed" else int(H*0.09))
    img.alpha_composite(sombra(lv, (10, 18), 26, 150), (lv_pos[0]+12, lv_pos[1]+16))
    img.alpha_composite(lv, lv_pos)
    base_texto = lv_pos[1] + lv.height + 46

    f_h = fonte(F_BOLD, 70 if formato != "story" else 78)
    linhas_h = []
    while True:
        linhas_h = b["hook_curto"].split("\n")
        if max(largura_texto(d, ln, f_h, 1) for ln in linhas_h) <= W-144 or f_h.size <= 44:
            break
        f_h = fonte(F_BOLD, f_h.size-3)
    f_o = fonte(F_SANS, 42)
    linhas_o = quebrar(d, b["oferta"], f_o, W-150)[:2 if formato == "feed" else 3]
    altura_bloco = int(f_h.size*1.14)*len(linhas_h) + 18 + 60*len(linhas_o)
    topo_faixa, fim_faixa = int(H*(0.44 if formato == 'feed' else 0.30)), H-(380 if formato == 'feed' else 330)
    y = int(max(topo_faixa + 40, min(base_texto, (topo_faixa+fim_faixa-altura_bloco)/2 + topo_faixa/2)))
    y = min(y, fim_faixa - altura_bloco)
    for ln in linhas_h:
        d.text((72, y), ln, font=f_h, fill=(255, 255, 255, 255), stroke_width=6, stroke_fill=(0, 0, 0, 140))
        y += int(f_h.size*1.14)
    y += 18
    for ln in linhas_o:
        d.text((72, y), ln, font=f_o, fill=rgba(b["luz"], 235)); y += 60


    _cta(d, (W/2, H-250), "QUERO POR R$ 47", b["acen"], b["prim"], 48)
    texto_espacado(d, (W/2, H-160), "7 dias de garantia · acesso imediato", fonte(F_SANS, 32), rgba("#FFFFFF", 215), tracking=2)
    texto_espacado(d, (W/2, H-92), "Material educacional. Não substitui avaliação profissional." if b["n"] in (2, 4)
                   else "Material educacional · resultados variam por aplicação.",
                   fonte(F_SANS, 24), rgba("#FFFFFF", 150), tracking=1)
    img.convert("RGB").save(destino, "JPEG", quality=92, subsampling=0)

def anuncio_kit(capas, cena, destino, formato="feed"):
    W, H = (1080, 1350) if formato == "feed" else (1080, 1920)
    img = _cena(cena, (W, H))
    img.alpha_composite(_scrim((W, H), "#05070E", 0.93, 0.30 if formato == "feed" else 0.44))
    img.alpha_composite(_scrim_topo((W, H), "#05070E", 0.82, 0.17))
    d = ImageDraw.Draw(img, "RGBA")
    texto_espacado(d, (72, 78), "COMBO COMPLETO · 4 LIVROS", fonte(F_BOLD, 30), rgba("#E8B65A", 255), tracking=6, ancora="la")
    y = int(H*0.42)
    for ln, cor in [("OS 4 PILARES", "#FFFFFF"), ("DA SUA VIDA", "#E8B65A")]:
        d.text((72, y), ln, font=fonte(F_BOLD, 92), fill=hx(cor)+(255,), stroke_width=7, stroke_fill=(0, 0, 0, 140)); y += 104
    y += 22
    for ln in quebrar(d, "Tempo, dinheiro, comida e energia: 4 livros + todos os bônus, com R$ 61 de desconto no combo.", fonte(F_SANS, 44), W-150)[:4]:
        d.text((72, y), ln, font=fonte(F_SANS, 44), fill=(255, 255, 255, 225)); y += 62
    base_y = int(H*(0.16 if formato == "feed" else 0.13))
    larg = 250
    livros = [livro_3d(c, altura=int(larg*1.6)) for c in capas]
    x = 78
    for i, lv in enumerate(livros):
        lvr = lv.resize((larg, int(lv.height*larg/lv.width)), Image.Resampling.LANCZOS).rotate(-4+i*3, expand=True, resample=Image.Resampling.BICUBIC)
        img.alpha_composite(sombra(lvr, (8, 14), 22, 140), (x+8, base_y+10))
        img.alpha_composite(lvr, (x, base_y))
        x += int(larg*0.86)
    _cta(d, (W/2, H-250), "QUERO OS 4 POR R$ 127", "#E8B65A", "#1B2A4A", 46)
    texto_espacado(d, (W/2, H-160), "Avulso: R$ 188 · acesso imediato · garantia de 7 dias", fonte(F_SANS, 32), rgba("#FFFFFF", 215), tracking=2)
    texto_espacado(d, (W/2, H-92), "Material educacional. Resultados variam conforme a aplicação.", fonte(F_SANS, 24), rgba("#FFFFFF", 150), tracking=1)
    img.convert("RGB").save(destino, "JPEG", quality=92, subsampling=0)

# ----------------------------------------------------------------------------- main
def main(somente=None):
    for sub in ["capas", "mockups", "anuncios", "_teste-miniatura"]:
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)
    capas = []
    paginas = {}
    for b in LIVROS:
        nome = f"capa-{b['slug']}"
        print("· capa", b["slug"])
        png = capa(b, os.path.join(OUT, "capas", nome))
        c = Image.open(png)
        capas.append(c)
        paginas[b["slug"]] = (pagina_interna(b, "box"), pagina_interna(b, "lista"))
    if somente == "capas":
        return
    livros3d = {b["slug"]: livro_3d(c) for b, c in zip(LIVROS, capas)}
    for b, c in zip(LIVROS, capas):
        s = b["slug"]
        print("· mockups", s)
        mock_livro_em_pe(b, livros3d[s], os.path.join(OUT, "mockups", f"{s}-1-livro-em-pe.jpg"))
        mock_aberto(b, paginas[s], os.path.join(OUT, "mockups", f"{s}-2-aberto-por-dentro.jpg"))
        mock_tablet_celular(b, c, paginas[s][0], os.path.join(OUT, "mockups", f"{s}-3-tablet-e-celular.jpg"))
        mock_stack(b, livros3d[s], os.path.join(OUT, "mockups", f"{s}-4-kit-bonus.jpg"))
        print("· anuncios", s)
        anuncio(b, livros3d[s], os.path.join(OUT, "anuncios", f"{s}-feed-1080x1350.jpg"), "feed")
        anuncio(b, livros3d[s], os.path.join(OUT, "anuncios", f"{s}-story-1080x1920.jpg"), "story")
    print("· mockup kit completo")
    mock_kit_completo(capas, os.path.join(OUT, "mockups", "kit-completo-5-hero.jpg"))
    cena_kit = os.path.join(OUT, "_cenas", "cena-kit.jpg")
    anuncio_kit(capas, cena_kit, os.path.join(OUT, "anuncios", "kit-combo-feed-1080x1350.jpg"), "feed")
    anuncio_kit(capas, cena_kit, os.path.join(OUT, "anuncios", "kit-combo-story-1080x1920.jpg"), "story")
    # pins verticais (Pinterest) reaproveitando o story
    for b in LIVROS:
        if b["n"] in (3, 4):
            src = Image.open(os.path.join(OUT, "anuncios", f"{b['slug']}-story-1080x1920.jpg"))
            src.resize((1000, 1500), Image.Resampling.LANCZOS).save(
                os.path.join(OUT, "anuncios", f"{b['slug']}-pinterest-1000x1500.jpg"), "JPEG", quality=92)
    print("\nPronto. Arquivos em", OUT)

if __name__ == "__main__":
    arg = sys.argv[1] if len(sys.argv) > 1 else ""
    main("capas" if arg == "--somente" and len(sys.argv) > 2 and sys.argv[2] == "capas" else None)
