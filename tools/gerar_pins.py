#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gerar_pins.py — 12 capas de Pinterest (1000x1500) da Coleção Vida em Ordem.

3 pins por livro, cada um com uma promessa prática e CTA para o capítulo grátis.
Reaproveita os desenhos do gerador de marketing (capas 3D, gradientes, tipografia).

Saída: projeto-4-infoprodutos/marketing/pins/*.jpg
Uso:   python3 tools/gerar_pins.py
"""
import os, sys, math
from PIL import Image, ImageDraw

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, "tools"))
import gerar_marketing as gm   # reaproveita funções

PROJ = os.path.join(RAIZ, "projeto-4-infoprodutos")
CAPAS = os.path.join(PROJ, "marketing", "capas")
OUT = os.path.join(PROJ, "marketing", "pins")

W, H = 1000, 1500
F_BOLD, F_SANS = gm.F_BOLD, gm.F_SANS

LIVROS = [
    dict(slug="vol1-ia", n=1, capa="capa-vol1-ia.jpg", prim="#1B2A4A", acen="#00A98A", luz="#E8F7F3",
         nome="IA QUE TRABALHA POR VOCÊ",
         pins=[
            dict(titulo="5 CAMPOS QUE FAZEM A IA TRABALHAR", sub="A fórmula do prompt que devolve trabalho pronto",
                 bullets=["Papel · Objetivo · Contexto · Formato · Restrição", "10 exemplos por profissão", "Funciona no celular"]),
            dict(titulo="12 AUTOMAÇÕES SEM CÓDIGO", sub="Tarefas que rodam sozinhas no seu trabalho",
                 bullets=["Passo a passo ilustrado", "Sem programar nada", "Para escritório, RH e freelancer"]),
            dict(titulo="QUANTO COBRAR?", sub="Tabela de preços de 8 serviços com IA",
                 bullets=["Por tipo de entrega", "5 scripts de abordagem", "Do orçamento ao primeiro cliente"]),
         ]),
    dict(slug="vol2-dividas", n=2, capa="capa-vol2-dividas.jpg", prim="#0E3B2E", acen="#B58A0F", luz="#FBF4E2",
         nome="SAIA DO VERMELHO EM 60 DIAS",
         pins=[
            dict(titulo="15 SCRIPTS DE NEGOCIAÇÃO", sub="O que dizer no chat, no telefone e por e-mail",
                 bullets=["Palavra por palavra", "Chat · telefone · e-mail · cobrança", "Inclui contraproposta"]),
            dict(titulo="A ORDEM CERTA", sub="Organizar → enxugar → negociar → quitar",
                 bullets=["Planilha Raio-X das dívidas", "Capacidade real de pagamento", "Plano de 60 dias"]),
            dict(titulo="CALCULADORA DE PARCELA", sub="Descubra o que cabe no seu mês",
                 bullets=["Cálculo da parcela possível", "Tabela de desconto esperado", "Checklist do acordo seguro"]),
         ]),
    dict(slug="vol3-airfryer", n=3, capa="capa-vol3-airfryer.jpg", prim="#5A1F0E", acen="#F2A93B", luz="#FDF3E4",
         nome="AIRFRYER SEM MIMIMI",
         pins=[
            dict(titulo="TABELA DE TEMPERATURA", sub="Tempo e temperatura para imprimir e colar na geladeira",
                 bullets=["2L · 3-4L · 5-6L · 7L+", "Ajuste por litragem", "120 receitas com 4 números"]),
            dict(titulo="R$ 25 PARA 3 PESSOAS", sub="Jantar completo em 20 minutos",
                 bullets=["Custo por porção em cada receita", "Máximo 5 ingredientes", "Sem louça e sem fogão"]),
            dict(titulo="7 MARMITAS EM 90 MIN", sub="O sistema 20-5-7 do domingo",
                 bullets=["Cronograma de 90 minutos", "Lista de compras por orçamento", "Guia de congelamento"]),
         ]),
    dict(slug="vol4-energia", n=4, capa="capa-vol4-energia.jpg", prim="#1E2A5A", acen="#E8B65A", luz="#F0F3FA",
         nome="ENERGIA EM 21 DIAS",
         pins=[
            dict(titulo="10 MINUTOS DE LUZ", sub="A primeira hora decide o resto do dia",
                 bullets=["Protocolo S.O.N.O. de 21 dias", "15 minutos por dia", "Rastreador imprimível"]),
            dict(titulo="3 TAREFAS DA ÚLTIMA HORA", sub="A rotina da noite em 3 passos simples",
                 bullets=["Descarregar o dia", "Preparar amanhã", "Sinal de sono"]),
            dict(titulo="RASTREADOR DE 21 DIAS", sub="Acompanhe a rotina sem aparelho e sem aplicativo",
                 bullets=["Folha + planilha inclusas", "Kit da noite e da manhã", "Trilha para quem trabalha à noite"]),
         ]),
]

def header_band(d, i, livro):
    """Faixa do topo: coleção + volume."""
    d.rectangle([0, 0, W, 96], fill=gm.rgba(livro["prim"], 255))
    d.rectangle([0, 96, W, 104], fill=gm.rgba(livro["acen"], 255))
    gm.texto_espacado(d, (W/2, 48), "COLEÇÃO VIDA EM ORDEM", gm.fonte(F_BOLD, 26),
                      gm.rgba(livro["luz"], 230), tracking=9)
    gm.texto_espacado(d, (W/2, 120), f"VOL. {livro['n']} · {livro['nome']}", gm.fonte(F_BOLD, 24),
                      gm.rgba(livro["acen"], 255), tracking=4)

def cta_band(d, livro, texto="CAPÍTULO GRÁTIS · TOQUE PARA LER"):
    d.rectangle([0, H-118, W, H], fill=gm.rgba(livro["prim"], 255))
    d.rectangle([0, H-118, W, H-112], fill=gm.rgba(livro["acen"], 255))
    gm.texto_espacado(d, (W/2, H-58), texto, gm.fonte(F_BOLD, 30), gm.rgba(livro["acen"], 255), tracking=4)
    gm.texto_espacado(d, (W/2, H-24), "material educacional · sem promessa de resultado", gm.fonte(F_SANS, 17),
                      gm.rgba(livro["luz"], 170), tracking=1)

def pin(livro, p, destino, variant=0):
    prim, acen, luz = livro["prim"], livro["acen"], livro["luz"]
    img = gm.gradiente((W, H), gm.claro(prim, 0.16), gm.escuro(prim, 0.44)).convert("RGBA")
    img.alpha_composite(gm.brilho((W, H), (W//2, int(H*0.30)), int(W*1.0), acen, 88))
    img.alpha_composite(gm.brilho((W, H), (int(W*0.12), int(H*0.78)), int(W*0.7), acen, 40))
    d = ImageDraw.Draw(img, "RGBA")

    header_band(d, None, livro)

    # título grande
    y = 180
    f = gm.fonte(F_BOLD, 84 if variant != 1 else 76)
    # quebra respeitando a largura
    texto_linhas, atual = [], ""
    for palavra in p["titulo"].split():
        teste = (atual + " " + palavra).strip()
        if gm.largura_texto(d, teste, f, 2) <= W - 110 or not atual:
            atual = teste
        else:
            texto_linhas.append(atual); atual = palavra
    if atual: texto_linhas.append(atual)
    y = 180 + max(0, 3 - len(texto_linhas)) * 70
    for i, ln in enumerate(texto_linhas):
        cor = acen if (i % 2 == 0 or len(texto_linhas) == 1) else luz
        d.text((W/2, y), ln, font=f, fill=gm.hx(cor) + (255,), anchor="ma",
               stroke_width=7, stroke_fill=gm.hx(gm.escuro(prim, 0.6)) + (255,))
        y += int(f.size*1.08)
    y += 16
    for ln in gm.quebrar(d, p["sub"], gm.fonte(F_SANS, 32), W-140)[:2]:
        d.text((W/2, y), ln, font=gm.fonte(F_SANS, 32), fill=gm.rgba(luz, 235), anchor="ma"); y += 44

    # bullets
    y += 18
    for b in p["bullets"]:
        f_b = gm.fonte(F_SANS, 27)
        w = gm.largura_texto(d, b, f_b)
        bx = W/2 - (w + 46)/2
        d.ellipse([bx, y-13, bx+26, y+13], fill=gm.rgba(acen, 255))
        d.line([(bx+8, y), (bx+12, y+5), (bx+19, y-6)], fill=gm.hx(gm.escuro(prim, 0.6)) + (255,), width=3)
        d.text((bx+38, y), b, font=f_b, fill=gm.rgba(luz, 225), anchor="lm")
        y += 46
    return img

def main():
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for livro in LIVROS:
        capa = Image.open(os.path.join(CAPAS, livro["capa"]))
        l3d = gm.livro_3d(capa, altura=700)
        for k, p in enumerate(livro["pins"]):
            img = pin(livro, p, None, variant=k)
            # livro 3D na base, centralizado
            alt = int(680 if k != 1 else 640)
            esc = alt / l3d.height
            lv = l3d.resize((int(l3d.width*esc), alt), Image.Resampling.LANCZOS)
            lv = lv.rotate(-3 + k*2.5, expand=True, resample=Image.Resampling.BICUBIC)
            x = int(W/2 - lv.width/2)
            y = int(H - 150 - lv.height + 30)
            img.alpha_composite(gm.sombra(lv, (10, 18), 26, 150), (x+10, y+18))
            img.alpha_composite(lv, (x, y))
            d = ImageDraw.Draw(img, "RGBA")
            cta_band(d, livro)
            nome = f"{livro['slug']}-pin-{k+1}.jpg"
            img.convert("RGB").save(os.path.join(OUT, nome), "JPEG", quality=92, subsampling=0)
            print(f"  {nome:34s} 1000x1500")
            total += 1
    print(f"\n{total} pins em {OUT}")

if __name__ == "__main__":
    main()
