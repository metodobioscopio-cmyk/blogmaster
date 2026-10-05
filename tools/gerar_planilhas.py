#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera as 4 planilhas do kit do Growth Design Pro.

Por que um gerador: as planilhas compartilham identidade (cores dos tokens), estrutura de
cabeçalho, validações e formatos numéricos. Editar em um lugar só evita que as quatro
divirjam entre si na próxima atualização do kit.

Requisito:  pip install openpyxl
Uso:        python3 tools/gerar_planilhas.py
Saída:      kit/planilhas/*.xlsx
"""

from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import CellIsRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "kit" / "planilhas"

# --- Identidade (mesmos valores dos tokens do design system) -----------------
PAPER = "F7F4ED"
PAPER2 = "EFEADF"
NIGHT = "0F0F0D"
GOLD = "8F6F2E"
INK = "121110"
INK3 = "6B655C"
GREEN = "3D6B4A"
RED = "8C3A2E"
AMBER = "8A5A18"

F_TITLE = Font(name="Calibri", size=18, bold=True, color=NIGHT)
F_SUB = Font(name="Calibri", size=10, color=INK3, italic=True)
F_HEAD = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
F_BODY = Font(name="Calibri", size=10, color=INK)
F_MONO = Font(name="Consolas", size=10, color=INK)
F_KPI = Font(name="Calibri", size=22, bold=True, color=NIGHT)
F_KPI_LABEL = Font(name="Calibri", size=9, color=INK3)

FILL_HEAD = PatternFill("solid", fgColor=NIGHT)
FILL_ALT = PatternFill("solid", fgColor=PAPER)
FILL_INPUT = PatternFill("solid", fgColor="FFFFFF")
FILL_CALC = PatternFill("solid", fgColor=PAPER2)

THIN = Side(style="thin", color="D8D2C4")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="center")


def setup_sheet(ws, titulo, subtitulo, larguras):
    """Cabeçalho editorial padrão + larguras de coluna."""
    for i, w in enumerate(larguras, start=1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws["A1"] = titulo
    ws["A1"].font = F_TITLE
    ws["A2"] = subtitulo
    ws["A2"].font = F_SUB
    ws.row_dimensions[1].height = 26
    ws.row_dimensions[2].height = 16
    ws.freeze_panes = "A5"
    return 4  # linha do cabeçalho de tabela


def cabecalho(ws, linha, colunas, comentarios=None):
    for i, c in enumerate(colunas, start=1):
        cel = ws.cell(row=linha, column=i, value=c)
        cel.font = F_HEAD
        cel.fill = FILL_HEAD
        cel.alignment = Alignment(wrap_text=True, vertical="center", horizontal="left")
        cel.border = BORDER
        if comentarios and c in comentarios:
            cel.comment = Comment(comentarios[c], "Growth Design Pro")
    ws.row_dimensions[linha].height = 30


def zebra(ws, linha_ini, linha_fim, ncols):
    for r in range(linha_ini, linha_fim + 1):
        for c in range(1, ncols + 1):
            cel = ws.cell(row=r, column=c)
            cel.border = BORDER
            if cel.font is None or cel.font.color is None:
                cel.font = F_BODY
            cel.alignment = WRAP
            if (r - linha_ini) % 2 == 1:
                cel.fill = FILL_ALT


def area_input(ws, linha_ini, linha_fim, ncols):
    """Marca visualmente o que o usuário preenche."""
    for r in range(linha_ini, linha_fim + 1):
        for c in range(1, ncols + 1):
            ws.cell(row=r, column=c).fill = FILL_INPUT


# =============================================================================
# 1. ANÁLISE DE SEO
# =============================================================================
def planilha_seo():
    wb = Workbook()

    # --- Instruções
    ws = wb.active
    ws.title = "Instruções"
    ws.column_dimensions["A"].width = 4
    ws.column_dimensions["B"].width = 110
    ws["B2"] = "Análise de SEO — como usar"
    ws["B2"].font = F_TITLE
    passos = [
        ("1.", "Rode a AI SEO Analysis API na URL que você quer analisar. Copie o score geral e o score de cada dimensão que a API devolver."),
        ("2.", "Preencha a aba 'Análise' com uma linha por página analisada. Se a API não devolver score por dimensão, deixe a célula vazia (não estime)."),
        ("3.", "Na aba 'Recomendações', transforme cada achado da API em uma tarefa: impacto, esforço, responsável, prazo e critério de conclusão verificável."),
        ("4.", "Use a aba 'Comparativo' para colocar sua página e a do concorrente lado a lado. É esta aba que sustenta a conversa comercial."),
        ("5.", "Rode a API de novo em 30 dias, crie uma nova linha com a data nova e compare. Score sem comparação é só número."),
        ("", ""),
        ("Regra.", "Nunca escreva um item que você não consiga verificar. 'Melhorar SEO' não é tarefa; 'reescrever meta das 8 páginas com a palavra-chave no início' é."),
        ("Aviso.", "Nenhum item desta planilha garante posição no Google. Ela serve para organizar o trabalho, não para prometer resultado."),
    ]
    r = 4
    for n, t in passos:
        ws.cell(row=r, column=1, value=n).font = Font(name="Consolas", size=10, color=GOLD, bold=True)
        cel = ws.cell(row=r, column=2, value=t)
        cel.font = F_BODY
        cel.alignment = Alignment(wrap_text=True, vertical="top")
        ws.row_dimensions[r].height = 30 if len(t) > 95 else 16
        r += 1

    # --- Análise
    ws = wb.create_sheet("Análise")
    linha = setup_sheet(ws, "Análise por página",
                        "Uma linha por página analisada. Rode a API antes de preencher.",
                        [26, 12, 11, 11, 11, 11, 20, 34])
    cols = ["URL", "Data", "Score geral", "Técnico", "Conteúdo", "On-page", "Dimensão mais fraca", "Observação"]
    cabecalho(ws, linha, cols)
    area_input(ws, linha + 1, linha + 12, len(cols))
    zebra(ws, linha + 1, linha + 12, len(cols))
    for r in range(linha + 1, linha + 13):
        ws.cell(row=r, column=2).number_format = "DD/MM/YYYY"
        ws.cell(row=r, column=3).number_format = "0"
        for c in (4, 5, 6):
            ws.cell(row=r, column=c).number_format = "0"
    ws.conditional_formatting.add(
        f"C{linha+1}:C{linha+12}",
        CellIsRule(operator="greaterThanOrEqual", formula=["80"], fill=PatternFill("solid", fgColor="D8E8DA")),
    )
    ws.conditional_formatting.add(
        f"C{linha+1}:C{linha+12}",
        CellIsRule(operator="lessThan", formula=["50"], fill=PatternFill("solid", fgColor="F0D9D4")),
    )

    # --- Recomendações
    ws = wb.create_sheet("Recomendações")
    linha = setup_sheet(ws, "Plano de trabalho",
                        "Converta cada achado da API em tarefa com dono, prazo e critério de conclusão.",
                        [30, 12, 13, 12, 14, 13, 12, 34])
    cols = ["Achado (com o trecho da API)", "Página", "Impacto", "Esforço (h)", "Responsável",
            "Prazo", "Status", "Critério de conclusão (mensurável)"]
    cabecalho(ws, linha, cols, comentarios={
        "Impacto": "Alto / Médio / Baixo — impacto no resultado de negócio, não no score.",
        "Esforço (h)": "Horas de trabalho humano, não de API.",
        "Status": "A fazer / Em andamento / Feito / Descartado.",
    })
    area_input(ws, linha + 1, linha + 30, len(cols))
    zebra(ws, linha + 1, linha + 30, len(cols))

    dv_imp = DataValidation(type="list", formula1='"Alto,Médio,Baixo"', allow_blank=True)
    dv_st = DataValidation(type="list", formula1='"A fazer,Em andamento,Feito,Descartado"', allow_blank=True)
    ws.add_data_validation(dv_imp)
    ws.add_data_validation(dv_st)
    dv_imp.add(f"C{linha+1}:C{linha+30}")
    dv_st.add(f"G{linha+1}:G{linha+30}")
    for r in range(linha + 1, linha + 31):
        ws.cell(row=r, column=5).number_format = "0.0"
        ws.cell(row=r, column=6).number_format = "DD/MM/YYYY"
    ws.conditional_formatting.add(
        f"G{linha+1}:G{linha+30}",
        CellIsRule(operator="equal", formula=['"Feito"'], fill=PatternFill("solid", fgColor="D8E8DA")),
    )

    # --- Comparativo
    ws = wb.create_sheet("Comparativo")
    linha = setup_sheet(ws, "Comparativo com o concorrente",
                        "Preencha com os dados da Extração + Análise de SEO rodadas nas duas URLs.",
                        [30, 34, 34, 26])
    cabecalho(ws, linha, ["Dimensão", "Minha página", "Concorrente", "Leitura / ação"])
    dims = ["Title e meta", "Estrutura de headings", "Profundidade de conteúdo", "Prova social",
            "Chamada para ação", "Sinais de confiança", "Clareza da oferta", "Score geral (API)"]
    for i, d in enumerate(dims):
        r = linha + 1 + i
        ws.cell(row=r, column=1, value=d).font = Font(name="Calibri", size=10, bold=True, color=INK)
        area_input(ws, r, r, len(["a", "b", "c", "d"]))
    zebra(ws, linha + 1, linha + len(dims), 4)
    ws.cell(row=linha + len(dims) + 2, column=1, value="Minha URL:").font = Font(bold=True)
    ws.cell(row=linha + len(dims) + 3, column=1, value="URL do concorrente:").font = Font(bold=True)
    ws.cell(row=linha + len(dims) + 4, column=1, value="Data da análise:").font = Font(bold=True)

    wb.save(OUT / "analise-seo.xlsx")
    print("  ✓ kit/planilhas/analise-seo.xlsx")


# =============================================================================
# 2. GROWTH STACK DASHBOARD
# =============================================================================
def planilha_dashboard():
    wb = Workbook()

    # --- Painel
    ws = wb.active
    ws.title = "Painel"
    setup_sheet(ws, "Growth Stack Dashboard",
                "Painel de acompanhamento — os números se alimentam das abas Páginas, Rodadas e Custos.",
                [30, 16, 16, 16, 30])
    kpis = [
        ("A5", "Páginas monitoradas", "=COUNTA(Páginas!A5:A60)", "0"),
        ("A8", "Score de SEO (média)", "=IFERROR(AVERAGE(Páginas!C5:C60),0)", "0.0"),
        ("A11", "Score de conversão (média)", "=IFERROR(AVERAGE(Páginas!D5:D60),0)", "0.0"),
        ("A14", "Rodadas registradas", "=COUNTA(Rodadas!A5:A200)", "0"),
        ("A17", "Custo de API (mês)", "=SUM(Custos!E5:E30)", 'R$ #,##0.00'),
        ("A20", "Custo por página monitorada", "=IFERROR(B17/B5,0)", 'R$ #,##0.00'),
    ]
    for cel, rotulo, formula, fmt in kpis:
        col = cel[0]
        lin = int(cel[1:])
        ws[f"{col}{lin}"] = rotulo
        ws[f"{col}{lin}"].font = F_KPI_LABEL
    ws["B5"] = "=COUNTA(Páginas!A5:A60)"; ws["B5"].font = F_KPI; ws["B5"].number_format = "0"
    ws["B8"] = "=IFERROR(AVERAGE(Páginas!C5:C60),0)"; ws["B8"].font = F_KPI; ws["B8"].number_format = "0.0"
    ws["B11"] = "=IFERROR(AVERAGE(Páginas!D5:D60),0)"; ws["B11"].font = F_KPI; ws["B11"].number_format = "0.0"
    ws["B14"] = "=COUNTA(Rodadas!A5:A200)"; ws["B14"].font = F_KPI; ws["B14"].number_format = "0"
    ws["B17"] = "=SUM(Custos!E5:E30)"; ws["B17"].font = F_KPI; ws["B17"].number_format = 'R$ #,##0.00'
    ws["B20"] = "=IFERROR(B17/B5,0)"; ws["B20"].font = F_KPI; ws["B20"].number_format = 'R$ #,##0.00'

    ws["D5"] = "Regra de leitura"
    ws["D5"].font = Font(bold=True, size=11, color=GOLD)
    texto = ("Compare sempre a MESMA página entre duas rodadas. Score absoluto diz pouco; "
             "variação diz tudo. Se o score subiu e a conversão caiu, você otimizou para a API, "
             "não para o visitante — volte e leia o diagnóstico de novo.")
    c = ws["D6"]; c.value = texto; c.font = F_BODY; c.alignment = WRAP
    ws.merge_cells("D6:F14")

    # --- Páginas
    ws = wb.create_sheet("Páginas")
    linha = setup_sheet(ws, "Páginas monitoradas",
                        "Uma linha por página. Os scores vêm das APIs de SEO e de Conversão.",
                        [34, 20, 12, 12, 14, 12, 12, 22])
    cols = ["URL", "Cliente/projeto", "Score SEO", "Score conversão", "Última análise",
            "Visitas/mês", "Conversões/mês", "Observação"]
    cabecalho(ws, linha, cols)
    area_input(ws, linha + 1, linha + 40, len(cols))
    zebra(ws, linha + 1, linha + 40, len(cols))
    for r in range(linha + 1, linha + 41):
        ws.cell(row=r, column=3).number_format = "0"
        ws.cell(row=r, column=4).number_format = "0"
        ws.cell(row=r, column=5).number_format = "DD/MM/YYYY"
        ws.cell(row=r, column=6).number_format = "#,##0"
        ws.cell(row=r, column=7).number_format = "#,##0"
    # coluna calculada: taxa de conversão
    ws.cell(row=linha, column=9, value="Taxa de conv.").font = F_HEAD
    ws.cell(row=linha, column=9).fill = FILL_HEAD
    ws.cell(row=linha, column=9).border = BORDER
    ws.column_dimensions["I"].width = 14
    for r in range(linha + 1, linha + 41):
        cel = ws.cell(row=r, column=9, value=f"=IFERROR(G{r}/F{r},0)")
        cel.number_format = "0.00%"
        cel.fill = FILL_CALC
        cel.border = BORDER

    # --- Rodadas
    ws = wb.create_sheet("Rodadas")
    linha = setup_sheet(ws, "Histórico de rodadas",
                        "Cada vez que você roda o funil completo em uma página, registre aqui.",
                        [12, 18, 30, 11, 11, 30, 24])
    cols = ["Rodada", "Data", "Página", "Score SEO", "Score conv.", "O que mudou desde a última",
            "Próxima rodada em"]
    cabecalho(ws, linha, cols)
    area_input(ws, linha + 1, linha + 60, len(cols))
    zebra(ws, linha + 1, linha + 60, len(cols))
    for r in range(linha + 1, linha + 61):
        ws.cell(row=r, column=1).number_format = "0"
        ws.cell(row=r, column=2).number_format = "DD/MM/YYYY"
        ws.cell(row=r, column=4).number_format = "0"
        ws.cell(row=r, column=5).number_format = "0"
        ws.cell(row=r, column=7).number_format = "DD/MM/YYYY"

    # --- Custos
    ws = wb.create_sheet("Custos API")
    linha = setup_sheet(ws, "Custo das APIs por projeto",
                        "Preencha com os valores vigentes dos seus planos. Custos mudam — revise mensalmente.",
                        [30, 22, 18, 16, 16, 18])
    cols = ["API", "Plano contratado", "Chamadas/mês", "Custo unitário", "Custo total", "Projeto/cliente"]
    cabecalho(ws, linha, cols)
    nomes = ["Website Data Extraction", "AI SEO Analysis", "AI Conversion Optimization",
             "AI Website Copywriter", "AI Landing Page Optimizer", "AI Social Media Generator"]
    for i, nome in enumerate(nomes):
        r = linha + 1 + i
        ws.cell(row=r, column=1, value=nome).font = Font(name="Calibri", size=10, bold=True, color=INK)
        ws.cell(row=r, column=3).number_format = "#,##0"
        ws.cell(row=r, column=4).number_format = 'R$ #,##0.0000'
    for r in range(linha + 1, linha + 13):
        cel = ws.cell(row=r, column=5, value=f"=IFERROR(C{r}*D{r},0)")
        cel.number_format = 'R$ #,##0.00'
        cel.fill = FILL_CALC
    area_input(ws, linha + 1, linha + 12, 4)
    zebra(ws, linha + 1, linha + 12, 6)
    tot = linha + 13
    ws.cell(row=tot, column=4, value="TOTAL").font = Font(bold=True)
    cel = ws.cell(row=tot, column=5, value=f"=SUM(E{linha+1}:E{linha+12})")
    cel.font = Font(bold=True, size=11)
    cel.number_format = 'R$ #,##0.00'
    cel.fill = FILL_CALC

    wb.save(OUT / "growth-dashboard.xlsx")
    print("  ✓ kit/planilhas/growth-dashboard.xlsx")


# =============================================================================
# 3. CALENDÁRIO SOCIAL
# =============================================================================
def planilha_calendario():
    wb = Workbook()

    ws = wb.active
    ws.title = "Calendário"
    linha = setup_sheet(
        ws, "Calendário de conteúdo — 30 dias",
        "Use o prompt 30 da Golden Prompt Library para preencher as 30 linhas de uma vez. Depois revise à mão.",
        [6, 12, 14, 14, 16, 40, 26, 20, 10, 14],
    )
    cols = ["Dia", "Data", "Canal", "Formato", "Ângulo", "Gancho / título", "Ativo de origem",
            "CTA", "Esforço", "Status"]
    cabecalho(ws, linha, cols, comentarios={
        "Canal": "X / LinkedIn / Instagram / Facebook / E-mail / Blog",
        "Ângulo": "Dado / Erro comum / Antes e depois / Opinião / Passo a passo / Prova / Oferta",
        "Esforço": "Baixo / Médio / Alto",
        "Status": "Ideia / Rascunho / Aprovação / Agendado / Publicado",
    })
    area_input(ws, linha + 1, linha + 30, len(cols))
    zebra(ws, linha + 1, linha + 30, len(cols))

    dv_canal = DataValidation(type="list",
                              formula1='"X,LinkedIn,Instagram,Facebook,E-mail,Blog"', allow_blank=True)
    dv_ang = DataValidation(type="list",
                            formula1='"Dado,Erro comum,Antes e depois,Opinião,Passo a passo,Prova,Oferta"',
                            allow_blank=True)
    dv_esf = DataValidation(type="list", formula1='"Baixo,Médio,Alto"', allow_blank=True)
    dv_st = DataValidation(type="list",
                           formula1='"Ideia,Rascunho,Aprovação,Agendado,Publicado"', allow_blank=True)
    for dv in (dv_canal, dv_ang, dv_esf, dv_st):
        ws.add_data_validation(dv)
    dv_canal.add(f"C{linha+1}:C{linha+30}")
    dv_ang.add(f"E{linha+1}:E{linha+30}")
    dv_esf.add(f"I{linha+1}:I{linha+30}")
    dv_st.add(f"J{linha+1}:J{linha+30}")
    for r in range(linha + 1, linha + 31):
        ws.cell(row=r, column=1).value = r - linha
        ws.cell(row=r, column=2).number_format = "DD/MM/YYYY"
        ws.cell(row=r, column=10).value = "Ideia"
        ws.row_dimensions[r].height = 30

    # Regra de distribuição (70/20/10)
    ws.cell(row=linha + 33, column=1, value="Distribuição sugerida").font = Font(bold=True, color=GOLD)
    regras = [
        ("Conteúdo útil", "70%", "Ensina, resolve, mostra — sem vender"),
        ("Prova e autoridade", "20%", "Resultado, bastidor, aprendizado com dado real"),
        ("Oferta direta", "10%", "3 peças em 30 dias. Mais que isso cansa a audiência"),
    ]
    for i, (nome, pct, desc) in enumerate(regras):
        r = linha + 34 + i
        ws.cell(row=r, column=1, value=nome).font = F_BODY
        ws.cell(row=r, column=2, value=pct).font = Font(bold=True)
        ws.cell(row=r, column=3, value=desc).font = F_BODY

    # --- Desempenho
    ws = wb.create_sheet("Desempenho")
    linha = setup_sheet(ws, "Desempenho das peças publicadas",
                        "Preencha só o que você consegue medir. Métrica de vaidade fora do relatório.",
                        [6, 30, 14, 12, 12, 12, 12, 12, 12, 12])
    cols = ["Dia", "Gancho", "Canal", "Alcance", "Salvamentos", "Comentários", "Cliques",
            "Conversões", "Taxa de clique", "Engajamento"]
    cabecalho(ws, linha, cols)
    area_input(ws, linha + 1, linha + 30, 8)
    zebra(ws, linha + 1, linha + 30, len(cols))
    for r in range(linha + 1, linha + 31):
        for c in (4, 5, 6, 7, 8):
            ws.cell(row=r, column=c).number_format = "#,##0"
        ws.cell(row=r, column=9, value=f"=IFERROR(G{r}/D{r},0)").number_format = "0.00%"
        ws.cell(row=r, column=10, value=f"=IFERROR((E{r}+F{r})/D{r},0)").number_format = "0.00%"
        ws.cell(row=r, column=9).fill = FILL_CALC
        ws.cell(row=r, column=10).fill = FILL_CALC

    # --- Resumo
    ws = wb.create_sheet("Resumo")
    setup_sheet(ws, "Resumo do mês", "Calculado a partir da aba Desempenho.", [26, 16])
    dados = [
        ("Peças publicadas", "=COUNTA(Desempenho!B5:B34)"),
        ("Alcance total", "=SUM(Desempenho!D5:D34)"),
        ("Salvamentos", "=SUM(Desempenho!E5:E34)"),
        ("Cliques totais", "=SUM(Desempenho!G5:G34)"),
        ("Conversões", "=SUM(Desempenho!H5:H34)"),
        ("Taxa de clique média", "=IFERROR(SUM(Desempenho!G5:G34)/SUM(Desempenho!D5:D34),0)"),
        ("Canal com mais cliques", '=IFERROR(INDEX(Desempenho!C5:C34,MATCH(MAX(Desempenho!G5:G34),Desempenho!G5:G34,0)),"—")'),
    ]
    for i, (rot, formula) in enumerate(dados):
        r = 5 + i
        ws.cell(row=r, column=1, value=rot).font = Font(bold=True, size=10)
        cel = ws.cell(row=r, column=2, value=formula)
        cel.fill = FILL_CALC
        cel.border = BORDER
        cel.number_format = "0.00%" if "clique" in rot or "média" in rot.lower() else "#,##0"

    wb.save(OUT / "calendario-social.xlsx")
    print("  ✓ kit/planilhas/calendario-social.xlsx")


# =============================================================================
# 4. CALCULADORA DE ROI
# =============================================================================
def planilha_roi():
    wb = Workbook()

    ws = wb.active
    ws.title = "Entradas"
    setup_sheet(ws, "Calculadora de ROI do Growth Stack",
                "Preencha as células brancas. As demais são calculadas. Use números que você possa defender.",
                [44, 18, 60])
    entradas = [
        ("Visitas mensais da página", 3000, "#,##0", "Dado do analytics — não estime."),
        ("Taxa de conversão atual", 0.012, "0.00%", "Conversões / visitas. Se não mede, use 0,5% como ponto de partida conservador."),
        ("Ticket médio (R$)", 1200, 'R$ #,##0', "Receita média por conversão."),
        ("Margem bruta (%)", 0.6, "0%", "Parte da receita que sobra depois do custo direto de entrega."),
        ("Horas de trabalho por projeto", 12, "0.0", "Tempo humano real gasto no funil completo."),
        ("Valor da sua hora (R$)", 120, 'R$ #,##0', "Se você não sabe, use o valor que cobraria por consultoria."),
        ("Custo mensal das APIs (R$)", 150, 'R$ #,##0', "Da aba Custos do Growth Stack Dashboard."),
    ]
    r = 5
    for rot, val, fmt, obs in entradas:
        ws.cell(row=r, column=1, value=rot).font = Font(bold=True, size=10)
        cel = ws.cell(row=r, column=2, value=val)
        cel.number_format = fmt
        cel.fill = FILL_INPUT
        cel.border = BORDER
        cel.font = Font(size=11, bold=True)
        c = ws.cell(row=r, column=3, value=obs)
        c.font = F_SUB
        c.alignment = WRAP
        r += 1

    # --- Cenários
    ws = wb.create_sheet("Cenários")
    linha = setup_sheet(
        ws, "Cenários de resultado",
        "Três hipóteses de melhora de conversão. O cenário conservador é o único que você pode apresentar como expectativa.",
        [34, 18, 18, 18],
    )
    cabecalho(ws, linha, ["Indicador", "Conservador", "Base", "Otimista"])
    hipoteses = [1.15, 1.4, 1.75]  # multiplicador da taxa de conversão
    for i, m in enumerate(hipoteses):
        ws.cell(row=linha + 1, column=2 + i, value=m).number_format = "0.00\"x\""
        ws.cell(row=linha + 1, column=2 + i).fill = FILL_INPUT
    linhas_calc = [
        ("Nova taxa de conversão", "=Entradas!$B$6*{col}{lin}"),
        ("Conversões atuais/mês", "=Entradas!$B$5*Entradas!$B$6"),
        ("Conversões novas/mês", "=Entradas!$B$5*{col}{lin2}"),
        ("Receita atual/mês", "=Entradas!$B$5*Entradas!$B$6*Entradas!$B$7"),
        ("Receita nova/mês", "=Entradas!$B$5*{col}{lin2}*Entradas!$B$7"),
        ("Receita adicional/mês", "={col}{r5}-{col}{r4}"),
        ("Margem sobre o adicional", "={col}{r6}*Entradas!$B$8"),
        ("Custo do projeto (horas + APIs)", "=Entradas!$B$9*Entradas!$B$10+Entradas!$B$11"),
        ("Resultado no 1º mês", "={col}{r7}-{col}{r8}"),
        ("ROI no 1º mês", "=IFERROR({col}{r9}/{col}{r8},0)"),
        ("Payback (meses)", "=IFERROR({col}{r8}/{col}{r7},0)"),
    ]
    for i, (rot, formula) in enumerate(linhas_calc):
        r = linha + 2 + i
        ws.cell(row=r, column=1, value=rot).font = Font(bold=True, size=10)
    for i in range(3):
        col = get_column_letter(2 + i)
        for j, (rot, formula) in enumerate(linhas_calc):
            r = linha + 2 + j
            f = formula.replace("{col}", col).replace("{r4}", str(linha + 5)) \
                     .replace("{r5}", str(linha + 6)).replace("{r6}", str(linha + 7)) \
                     .replace("{r7}", str(linha + 8)).replace("{r8}", str(linha + 9)) \
                     .replace("{r9}", str(linha + 10)).replace("{lin2}", str(linha + 1)) \
                     .replace("{lin}", str(linha + 1))
            cel = ws.cell(row=r, column=2 + i, value=f)
            cel.fill = FILL_CALC
            cel.border = BORDER
            if "ROI" in rot or "Payback" in rot:
                cel.number_format = "0.00"
            elif "taxa" in rot:
                cel.number_format = "0.00%"
            elif "Conversões" in rot:
                cel.number_format = "#,##0.0"
            else:
                cel.number_format = 'R$ #,##0'
        ws.column_dimensions[col].width = 18

    # --- Custo das APIs
    ws = wb.create_sheet("Custos API")
    linha = setup_sheet(ws, "Custo das APIs",
                        "Estime por projeto antes de propor o preço ao cliente. Revise mensalmente.",
                        [34, 20, 16, 16, 16])
    cabecalho(ws, linha, ["API", "Chamadas por projeto", "Custo unitário", "Custo no projeto", "Observação"])
    nomes = ["Website Data Extraction", "AI SEO Analysis", "AI Conversion Optimization",
             "AI Website Copywriter", "AI Landing Page Optimizer", "AI Social Media Generator"]
    for i, nome in enumerate(nomes):
        r = linha + 1 + i
        ws.cell(row=r, column=1, value=nome).font = Font(size=10, bold=True)
        ws.cell(row=r, column=2, value=1).number_format = "#,##0"
        ws.cell(row=r, column=3).number_format = 'R$ #,##0.0000'
        cel = ws.cell(row=r, column=4, value=f"=B{r}*C{r}")
        cel.number_format = 'R$ #,##0.00'
        cel.fill = FILL_CALC
    area_input(ws, linha + 1, linha + 8, 3)
    zebra(ws, linha + 1, linha + 8, 5)
    ws.cell(row=linha + 9, column=3, value="TOTAL").font = Font(bold=True)
    cel = ws.cell(row=linha + 9, column=4, value=f"=SUM(D{linha+1}:D{linha+6})")
    cel.font = Font(bold=True, size=11)
    cel.number_format = 'R$ #,##0.00'
    cel.fill = FILL_CALC

    # --- Como usar
    ws = wb.create_sheet("Como usar")
    ws.column_dimensions["A"].width = 4
    ws.column_dimensions["B"].width = 108
    ws["B2"] = "Como usar esta calculadora"
    ws["B2"].font = F_TITLE
    texto = [
        ("1.", "Preencha a aba Entradas com dados do SEU projeto. Se não tiver o número, não invente — meça ou use o ponto de partida conservador indicado."),
        ("2.", "Na aba Cenários, ajuste apenas os multiplicadores (1,15x / 1,40x / 1,75x). Eles representam o quanto a taxa de conversão melhora depois do trabalho."),
        ("3.", "O cenário conservador é o único que pode ser apresentado ao cliente como expectativa. Os outros dois servem para você decidir se vale aceitar o projeto."),
        ("4.", "Se o payback for maior que 3 meses no cenário conservador, o projeto provavelmente não fecha — reduza escopo, aumente ticket ou escolha outro cliente."),
        ("", ""),
        ("Importante.", "Isto é uma ferramenta de decisão, não uma previsão. Melhora de conversão depende de oferta, público, tráfego e execução. Nunca apresente estes números como garantia."),
        ("Ética.", "Se você usar esta planilha com um cliente, deixe claro que os valores são cenários hipotéticos construídos a partir de dados que ele forneceu."),
    ]
    r = 4
    for n, t in texto:
        ws.cell(row=r, column=1, value=n).font = Font(name="Consolas", size=10, color=GOLD, bold=True)
        cel = ws.cell(row=r, column=2, value=t)
        cel.font = F_BODY
        cel.alignment = WRAP
        ws.row_dimensions[r].height = 32 if len(t) > 95 else 16
        r += 1

    wb.save(OUT / "calculadora-roi.xlsx")
    print("  ✓ kit/planilhas/calculadora-roi.xlsx")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print("Gerando planilhas do kit:")
    planilha_seo()
    planilha_dashboard()
    planilha_calendario()
    planilha_roi()
    print("Concluído. 4 arquivos .xlsx gerados.")


if __name__ == "__main__":
    main()
