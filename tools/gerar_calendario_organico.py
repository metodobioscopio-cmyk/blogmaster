#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gerar_calendario_organico.py — gera a agenda de tráfego orgânico dos 4 livros.

Saída em projeto-4-infoprodutos/marketing/organico/:
  calendario-editorial-90-dias.csv   (importa no Google Sheets / Excel / Notion)
  painel-organico.html               (visão visual: canais, cadência, 14 primeiros dias, KPIs)

A lógica está no arquivo 13-trafego-organico-estrutura.md:
  fase 1 (dias 1-30) fundação · fase 2 (31-60) tração · fase 3 (61-90) colheita

Uso: python3 tools/gerar_calendario_organico.py
"""
import os, csv, datetime, html

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ = os.path.join(RAIZ, "projeto-4-infoprodutos")
OUT  = os.path.join(PROJ, "marketing", "organico")
INICIO = datetime.date(2026, 10, 5)      # segunda-feira seguinte

LIVROS = {1: "Vol.1 IA", 2: "Vol.2 Dívidas", 3: "Vol.3 Airfryer", 4: "Vol.4 Energia"}

# ---------------------------------------------------------------- banco de temas
HOOKS = {
1: ["Digitei isso e economizei 2 horas (leio o prompt)", "Para de pedir 'me ajuda com isso' pra IA",
    "A tarefa que ninguém devia fazer à mão em 2026", "3 prompts que eu cobraria R$ 300",
    "Sua IA responde genérico? Falta isto", "Quanto vale a SUA hora? Calculo em 15 s",
    "Automação sem código: 4 passos", "Tabela de preços: quanto cobrar com IA",
    "IA não veio te substituir, veio tirar a parte chata", "Fiz em 4 min o que levava 3 horas"],
2: ["Se o credor ofereceu desconto na 1ª ligação, dá pra pedir mais", "Nunca fale ISSO numa negociação",
    "Esperar 6 meses custa mais que o acordo (a conta)", "A frase que faz pedir o supervisor",
    "3 coisas para exigir por escrito", "Nome negativado tem prazo: você sabe qual?",
    "A ordem certa: organizar, enxugar, negociar, quitar", "Rotativo x acordo: a conta do mês",
    "Se aceitar o acordo errado, a dívida volta", "Cobrança todo dia? Obra pela ordem"],
3: ["Jantar para 3 por menos de R$ 25", "Sua airfryer sai seca: você pula um passo",
    "7 marmitas em 90 minutos (a ordem)", "Quanto custou o prato de hoje?",
    "Airfryer de 2 litros: o erro é a quantidade", "Delivery x airfryer: a conta do mês",
    "20 minutos, 5 ingredientes, sem louça", "Congelei no domingo, na quarta estava igual",
    "5 temperos que mudam qualquer proteína", "A temperatura certa para pastel e pão de queijo"],
4: ["A primeira coisa ao acordar decide seu dia", "Café às 16h: faz a conta",
    "Acordei 4 min antes do despertador no dia 9", "Sua última hora tem 3 tarefas. Só 3",
    "Trabalha à noite ou em escala? Essa trilha é sua", "Quarto escuro de verdade: 7 correções",
    "Não dormiu bem? O plano das próximas 12 h", "15 minutos por dia, 21 dias",
    "Os 3 blocos do dia: difícil, recuperação, fechamento", "Dia 21: o que muda na rotina"],
}
PINS = {
1: ["5 CAMPOS QUE FAZEM A IA TRABALHAR", "12 AUTOMAÇÕES SEM CÓDIGO", "QUANTO COBRAR?",
    "200 PROMPTS POR PROFISSÃO", "QUANTO VALE SUA HORA?", "4 MINUTOS NO LUGAR DE 3 HORAS"],
2: ["15 SCRIPTS DE NEGOCIAÇÃO", "A ORDEM CERTA", "6 EXIGÊNCIAS POR ESCRITO",
    "12 CORTES NO ORÇAMENTO", "CALCULADORA DE PARCELA", "RAIO-X EM 2 HORAS"],
3: ["7 MARMITAS EM 90 MIN", "TABELA DE TEMPERATURA", "R$ 25 PARA 3 PESSOAS",
    "2 LITROS: AJUSTE AQUI", "O QUE CONGELAR", "CUSTO POR PORÇÃO"],
4: ["10 MINUTOS DE LUZ", "3 TAREFAS DA ÚLTIMA HORA", "15 MINUTOS POR DIA",
    "TRABALHA À NOITE?", "7 CORREÇÕES NO QUARTO", "RASTREADOR DE 21 DIAS"],
}
ARTIGOS = {
1: ["Fórmula P.O.C.F.R.: os 5 campos do prompt que funciona", "12 automações sem código para escritório",
    "Quanto cobrar por serviço de IA: tabela por profissão", "IA para contabilidade: 9 tarefas do fechamento",
    "IA para RH: triagem de currículos com critério", "Planilha de horas economizadas: o ROI da IA"],
2: ["Como negociar dívida com banco: roteiro com script", "Raio-X das dívidas: onde consultar de graça",
    "Acordo de dívida: 6 exigências antes de pagar", "12 cortes que liberam R$ 200 a R$ 600",
    "Calculadora de parcela: o que cabe no mês", "Cobrança abusiva: o que a lei diz"],
3: ["12 receitas para airfryer de 2 litros", "Tabela de tempo e temperatura para imprimir",
    "7 marmitas em 90 minutos: cronograma do domingo", "Custo por porção: o preço do seu prato",
    "O que congelar e o que não congelar", "Mercado com R$ 150: 12 refeições"],
4: ["Protocolo S.O.N.O.: como aplicar em 21 dias", "Primeira hora do dia: os 10 minutos de luz",
    "Trabalho noturno e escala: como organizar a rotina", "Os 3 blocos do dia: difícil, recuperação, fechamento",
    "Rastreador de 21 dias: como preencher e ler", "Rotina em semanas de crise: reconstrução em 3 dias"],
}
FORUNS = {
1: ["Como acelerar o fechamento mensal?", "IA serve pra quê no trabalho de verdade?",
    "Vale usar IA para atender cliente?", "Como ganhar tempo no escritório?",
    "Plano de aula: alguém usa IA?"],
2: ["Vale mais negociar ou deixar rolar?", "Banco ofereceu acordo: aceito?",
    "Como organizar o mês sem contracheque?", "Parcela atrasada: o que fazer?",
    "Como sair das dívidas sem empréstimo?"],
3: ["O que fazer na airfryer além de batata?", "Como não enjoar da marmita?",
    "Jantar rápido para 4 pessoas?", "Receitas que funcionam na airfryer de 2L?",
    "Comida barata para república?"],
4: ["Como virar o dia depois da escala?", "Como estudar de manhã sem enrolar?",
    "Como organizar a manhã com filho pequeno?", "Como acordar sem 5 despertadores?",
    "Escala de madrugada: como manter rotina?"],
}
NEWS = {
1: ["O prompt de 5 campos (e por que economiza 2 horas)", "12 automações: escolha a sua primeira",
    "Quanto cobrar: a tabela que eu uso"],
2: ["Descubra o número que você está evitando", "4 cortes que liberam R$ 200 hoje",
    "O script da 1ª ligação (copie e use)"],
3: ["7 marmitas em 90 minutos: o cronograma", "Sua airfryer é 2L? A regra de ajuste",
    "Custo por porção: o cálculo de 60 segundos"],
4: ["Os 10 minutos que decidem sua noite", "As 3 tarefas da última hora",
    "Dia 21: como manter (plano de 90 dias)"],
}
LINKEDIN = {
1: ["5 tarefas do escritório que a IA faz melhor", "Como provar o ROI da IA em números",
    "O erro de 90% dos prompts corporativos"],
2: ["A ordem certa de atacar uma dívida", "6 documentos antes de fechar um acordo",
    "Sinais de cobrança abusiva"],
3: ["O custo real do delivery: a conta de um mês", "Marmitas de domingo: cronograma de 90 minutos",
    "Custo por porção: a métrica que ninguém calcula"],
4: ["Como começar o dia às 7h sem força de vontade", "A última hora: 3 tarefas e nada mais",
    "Rotina em semanas de crise: reconstrução em 3 dias"],
}

VERTICAIS = {   # a área de audiência gira a cada peça, para variar o ângulo
1: ["escritório/contabilidade", "RH/recrutamento", "freelancer/social media", "MEI/loja pequena",
    "advocacia", "professores", "corretores", "suporte/atendimento"],
2: ["servidores", "autônomos/motoristas", "famílias", "jovens no 1º emprego",
    "estudantes/FIES", "aposentados", "profissionais liberais", "CLT"],
3: ["famílias com crianças", "universitários/república", "quem mora sozinho", "marmita/trabalho",
    "festas em casa", "orçamento apertado", "proteína (sem dieta)", "vegetarianos"],
4: ["enfermagem/plantão", "trabalho noturno", "mães e pais", "concurseiros/ENEM",
    "motoristas de app", "atletas amadores", "freelancers", "viajantes/fuso"],
}

# ---------------------------------------------------------------- cadência por fase
def slots_do_dia(fase, dia_semana):
    """dia_semana: 0=segunda … 6=domingo. Retorna lista de (canal, formato)."""
    base_pins = 3 if fase == 1 else 5
    slots = []
    curto = {0: "TikTok", 1: "Instagram Reels", 2: "YouTube Shorts", 3: "TikTok",
             4: "Instagram Reels", 5: "YouTube Shorts", 6: "TikTok"}
    if fase == 1:
        if dia_semana in (0, 1, 2, 3, 4, 5):
            slots.append((curto[dia_semana], "vídeo curto 21-45s"))
        if dia_semana == 5:
            slots.append(("YouTube", "vídeo longo 6-12 min"))
        if dia_semana == 6:
            slots.append(("Newsletter", "1 ideia + 1 tarefa + 1 CTA"))
        if dia_semana in (1, 3):
            slots.append(("Fórum/Comunidade", "resposta útil 400-700 palavras"))
    elif fase == 2:
        slots.append((curto[dia_semana], "vídeo curto 21-45s"))
        if dia_semana in (0, 2, 4, 6):
            slots.append((curto[(dia_semana+1) % 7], "vídeo curto 21-45s (2ª peça)"))
        if dia_semana == 5:
            slots.append(("YouTube", "vídeo longo 6-12 min"))
        if dia_semana in (1, 3):
            slots.append(("Blog/Medium", "artigo transacional"))
        if dia_semana in (0, 2, 4, 6):
            slots.append(("Fórum/Comunidade", "resposta útil"))
        if dia_semana == 6:
            slots.append(("Newsletter", "1 ideia + 1 tarefa + 1 CTA"))
    else:
        slots.append((curto[dia_semana], "vídeo curto 21-45s"))
        slots.append((curto[(dia_semana+2) % 7], "vídeo curto — reciclagem do vencedor"))
        if dia_semana in (0, 2, 4, 6):
            slots.append((curto[(dia_semana+1) % 7], "vídeo curto 21-45s (2ª peça)"))
        if dia_semana == 5:
            slots.append(("YouTube", "vídeo longo 6-12 min"))
        if dia_semana in (1, 3):
            slots.append(("Blog/Medium", "artigo transacional"))
        if dia_semana in (0, 2, 4, 6):
            slots.append(("Fórum/Comunidade", "resposta útil"))
        if dia_semana == 4:
            slots.append(("LinkedIn", "carrossel 8-10 páginas"))
        if dia_semana == 6:
            slots.append(("Newsletter", "1 ideia + 1 tarefa + 1 CTA"))
    for _ in range(base_pins):
        slots.append(("Pinterest", "pin novo 1000x1500 (imagem nova)"))
    return slots

def tema_para(canal, livro, i):
    if canal in ("TikTok", "Instagram Reels", "YouTube Shorts"):
        return HOOKS[livro][i % len(HOOKS[livro])]
    if canal == "Pinterest":
        return PINS[livro][i % len(PINS[livro])]
    if canal == "Blog/Medium":
        return ARTIGOS[livro][i % len(ARTIGOS[livro])]
    if canal == "Fórum/Comunidade":
        return FORUNS[livro][i % len(FORUNS[livro])]
    if canal == "Newsletter":
        return NEWS[livro][i % len(NEWS[livro])]
    if canal == "LinkedIn":
        return LINKEDIN[livro][i % len(LINKEDIN[livro])]
    if canal == "YouTube":
        return f"Vídeo longo do {LIVROS[livro]} (ver arquivo 14, seção 2)"
    return ""

CTA_POR_CANAL = {
    "TikTok": "comenta a palavra-chave do vídeo (isca na bio)",
    "Instagram Reels": "salva + link da isca na bio",
    "YouTube Shorts": "inscreve; isca na descrição",
    "YouTube": "isca na descrição + capítulo final",
    "Pinterest": "clique para o capítulo grátis",
    "Blog/Medium": "CTA para a isca do livro",
    "Fórum/Comunidade": "sem link; perfil com a isca",
    "Newsletter": "oferta R$ 47 (garantia de 7 dias)",
    "LinkedIn": "isca no comentário fixado",
}

def main():
    os.makedirs(OUT, exist_ok=True)
    linhas, contadores = [], {c: 0 for c in ["curto", "pin", "artigo", "forum", "news", "longo", "linkedin"]}
    total = 90
    for d in range(total):
        data = INICIO + datetime.timedelta(days=d)
        dia = d + 1
        semana = d // 7 + 1
        fase = 1 if dia <= 30 else (2 if dia <= 60 else 3)
        livro = (d % 4) + 1
        for canal, formato in slots_do_dia(fase, data.weekday()):
            if canal == "Pinterest":
                contadores["pin"] += 1; i = contadores["pin"]
            elif canal in ("TikTok", "Instagram Reels", "YouTube Shorts"):
                contadores["curto"] += 1; i = contadores["curto"]
            elif canal == "Blog/Medium":
                contadores["artigo"] += 1; i = contadores["artigo"]
            elif canal == "Fórum/Comunidade":
                contadores["forum"] += 1; i = contadores["forum"]
            elif canal == "Newsletter":
                contadores["news"] += 1; i = contadores["news"]
            elif canal == "LinkedIn":
                contadores["linkedin"] += 1; i = contadores["linkedin"]
            else:
                contadores["longo"] += 1; i = contadores["longo"]
            vertical = VERTICAIS[livro][i % len(VERTICAIS[livro])]
            utm = f"?utm_source={canal.split('/')[0].lower().replace(' ', '')}&utm_medium=organico&utm_campaign=vol{livro}&utm_content={canal.split('/')[0].lower()}{i:03d}"
            linhas.append(dict(dia=dia, data=data.strftime("%d/%m/%Y"), semana=semana,
                               fase=f"F{fase}", livro=LIVROS[livro], canal=canal, formato=formato,
                               vertical=vertical, tema=tema_para(canal, livro, i),
                               cta=CTA_POR_CANAL[canal], utm=utm, status="a fazer",
                               views="", retencao="", saves="", cliques="", inscritos="", vendas=""))

    csv_path = os.path.join(OUT, "calendario-editorial-90-dias.csv")
    with open(csv_path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=list(linhas[0].keys()), delimiter=";")
        w.writeheader(); w.writerows(linhas)

    # ------------------------------------------------------------ painel visual
    resumo = {}
    for l in linhas:
        resumo.setdefault(l["fase"], {}).setdefault(l["canal"], 0)
        resumo[l["fase"]][l["canal"]] += 1
    canais = sorted({l["canal"] for l in linhas})
    def cel(fase, canal): return resumo.get(fase, {}).get(canal, 0)
    linhas_resumo = "\n".join(
        f"<tr><td>{c}</td><td>{cel('F1', c)}</td><td>{cel('F2', c)}</td><td>{cel('F3', c)}</td>"
        f"<td>{cel('F1', c)+cel('F2', c)+cel('F3', c)}</td></tr>" for c in canais)

    primeiros = [l for l in linhas if l["dia"] <= 14]
    por_dia = {}
    for l in primeiros:
        por_dia.setdefault(l["dia"], []).append(l)
    blocos = []
    for dia in sorted(por_dia):
        itens = por_dia[dia]
        d0 = itens[0]
        linhas_peças = "".join(
            f"<li><b>{html.escape(i['canal'])}</b> · {html.escape(i['vertical'])} — {html.escape(i['tema'])}</li>"
            for i in itens)
        blocos.append(f"""<div class="dia">
        <div class="cab"><b>Dia {dia}</b><span>{d0['data']} · semana {d0['semana']} · {d0['fase']}</span></div>
        <ul>{linhas_peças}</ul></div>""")

    kpis = [("Vídeo curto", "retenção ≥65% (<30s) · salvamentos", "retenção <55% em 10 vídeos → encurtar"),
            ("Vídeo longo", "CTR 4-6% · duração média", "CTR <3% em 6 vídeos → trocar miniatura/título"),
            ("Pinterest", "save >1% · clique externo >0,3%", "<0,15% em 90 dias → revisar título/prancha"),
            ("Artigo", "cliques em termo transacional", "0 clique em 90 dias → migrar para fórum/Pinterest"),
            ("Comunidade", "cliques no perfil · DMs", "removido 2x por autopromoção → só comentar"),
            ("Newsletter", "abertura 25-40% · respostas", "<20% em 4 envios → limpar lista e refazer assunto"),
            ("LinkedIn", "salvamentos · visitas ao perfil", "<500 impressões em 12 posts → refazer gancho")]
    linhas_kpi = "\n".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>" for a, b, c in kpis)

    doc = f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel de tráfego orgânico — Coleção Vida em Ordem</title>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;background:#F3F5F9;color:#141821;line-height:1.55}}
header{{background:linear-gradient(160deg,#14213D,#0A1120);color:#fff;padding:38px 22px 32px}}
.wrap{{max-width:1120px;margin:0 auto}}
.selo{{display:inline-block;background:#3DDC97;color:#04231A;font-weight:800;font-size:12px;letter-spacing:.12em;
text-transform:uppercase;padding:6px 14px;border-radius:999px}}
h1{{font-size:clamp(23px,3vw,34px);margin-top:14px}}
h1 span{{color:#3DDC97}}
header p{{color:rgba(255,255,255,.78);margin-top:10px;max-width:75ch}}
h2{{font-size:19px;margin:32px 0 12px}}
table{{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;overflow:hidden;
box-shadow:0 2px 10px rgba(20,24,33,.06);font-size:14px}}
th,td{{padding:11px 14px;text-align:left;border-bottom:1px solid rgba(20,24,33,.08)}}
th{{background:#EEF1F7;font-size:12.5px;text-transform:uppercase;letter-spacing:.06em;color:#3A4560}}
tr:last-child td{{border-bottom:0}}
.fases{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:14px}}
.fase{{background:#fff;border-radius:14px;padding:18px 20px;border-left:5px solid #3DDC97;
box-shadow:0 2px 10px rgba(20,24,33,.06)}}
.fase b{{display:block;font-size:16px;margin-bottom:6px}}
.fase small{{color:#5A6478}}
.dias{{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:12px;margin-top:14px}}
.dia{{background:#fff;border-radius:14px;padding:14px 16px;box-shadow:0 2px 10px rgba(20,24,33,.06)}}
.dia .cab{{display:flex;justify-content:space-between;gap:10px;align-items:baseline;
border-bottom:1px solid rgba(20,24,33,.08);padding-bottom:8px;margin-bottom:8px;font-size:13px;color:#5A6478}}
.dia .cab b{{color:#141821;font-size:14px}}
.dia ul{{list-style:none;font-size:13.5px}}
.dia li{{padding:3px 0}}
.nota{{background:#FFF6E5;border:1px solid #E8B65A;border-radius:12px;padding:14px 18px;font-size:13.5px;color:#6B4E12;margin-top:24px}}
code{{background:rgba(20,24,33,.07);padding:2px 6px;border-radius:6px;font-size:12.5px}}
footer{{color:#5A6478;font-size:12.5px;padding:28px 0 50px}}
</style></head><body>
<header><div class="wrap">
  <span class="selo">Painel orgânico · 90 dias</span>
  <h1>Estrutura de <span>tráfego orgânico</span> — Coleção Vida em Ordem</h1>
  <p>{len(linhas)} peças agendadas de {INICIO.strftime('%d/%m/%Y')} a
     {(INICIO + datetime.timedelta(days=89)).strftime('%d/%m/%Y')} · 12 canais · 4 livros ·
     cada linha do CSV já traz canal, área, tema, CTA e UTM.</p>
</div></header>
<div class="wrap">
  <h2>As três fases</h2>
  <div class="fases">
    <div class="fase"><b>Fase 1 · Fundação (dias 1-30)</b><small>volume para achar o ângulo que pega: 6 vídeos curtos, 3 pins/dia,
      1 vídeo longo, 1 newsletter e 2 respostas em comunidade por semana.</small></div>
    <div class="fase"><b>Fase 2 · Tração (dias 31-60)</b><small>dobrar no que funcionou: até 8 curtos/semana, 5 pins/dia,
      2 artigos transacionais e 4 respostas em comunidade.</small></div>
    <div class="fase"><b>Fase 3 · Colheita (dias 61-90)</b><small>mesma cadência + 2 reciclagens semanais do vencedor de cada livro
      e carrossel de LinkedIn.</small></div>
  </div>

  <h2>Peças por canal e por fase</h2>
  <table><tr><th>Canal</th><th>Fase 1</th><th>Fase 2</th><th>Fase 3</th><th>Total</th></tr>
{linhas_resumo}
  </table>

  <h2>Os 14 primeiros dias (o arranque)</h2>
  <div class="dias">
{chr(10).join(blocos)}
  </div>

  <h2>KPIs e critérios de corte</h2>
  <table><tr><th>Canal</th><th>KPI-âncora</th><th>Critério de corte (dia 14/30)</th></tr>
{linhas_kpi}
  </table>

  <div class="nota"><b>Como usar:</b> abra <code>calendario-editorial-90-dias.csv</code> no Google Sheets e preencha as colunas
  vazias (views, retenção, saves, cliques, inscritos, vendas) na medida em que publica. A decisão sai do cruzamento
  entre o KPI-âncora e o critério de corte — não de sensação. Os números de referência são mecânica de plataforma,
  não promessa: o que garante o resultado é cadência + leitura de dados.</div>
  <footer>Gerado por <code>tools/gerar_calendario_organico.py</code> · estrutura em
  <code>13-trafego-organico-estrutura.md</code> · peças em <code>14-conteudos-por-area.md</code>.</footer>
</div></body></html>"""
    with open(os.path.join(OUT, "painel-organico.html"), "w", encoding="utf-8") as f:
        f.write(doc)

    print(f"CSV: {csv_path} ({len(linhas)} linhas)")
    print(f"Painel: {os.path.join(OUT, 'painel-organico.html')}")
    for k, v in contadores.items():
        print(f"  {k:9s} {v:4d}")

if __name__ == "__main__":
    main()
