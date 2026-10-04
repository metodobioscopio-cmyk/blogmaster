#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gerar_iscas.py — gera as 4 iscas (lead magnets) da Coleção Vida em Ordem.

Saída em projeto-4-infoprodutos/iscas/:
  isca-1-ia-capitulo-0.pdf        capa + capítulo 0 + folha de uso (10 prompts)
  isca-2-dividas-capitulo-0.pdf   capa + capítulo 0 + folha de uso (script + checklist)
  isca-3-airfryer-capitulo-0.pdf  capa + capítulo 0 + folha de uso (tabela mestra)
  isca-4-energia-capitulo-0.pdf   capa + capítulo 0 + folha de uso (rastreador 7 dias)
  LEIA-ME.md                      como usar para capturar e-mail
  fontes/*.md                     o texto de cada isca, para editar

Uso: python3 tools/gerar_iscas.py
"""
import os
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer,
                                Table, TableStyle, KeepTogether)

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ = os.path.join(RAIZ, "projeto-4-infoprodutos")
OUT  = os.path.join(PROJ, "iscas")
FONT = os.path.join(OUT, "fontes")    # criada abaixo, guarda os .md

# ------------------------------------------------------------------ identidade
ISCAS = [
    dict(slug="isca-1-ia-capitulo-0", n=1,
         prim="#1B2A4A", acen="#00A98A", luz="#E8F7F3",
         titulo="IA QUE TRABALHA POR VOCÊ", promessa="CAPÍTULO 0 + 10 PROMPTS PRONTOS",
         lead="O pedido de 5 campos que faz a IA devolver trabalho pronto — e 10 prompts para copiar hoje.",
         cap_titulo="Capítulo 0 — Por que quase todo mundo usa IA errado",
         cap_paragrafos=[
            "Existe um momento em que a maioria das pessoas desiste da IA. Ela abre, escreve algo como "
            "“me ajuda com isso” e recebe de volta um texto genérico, cheio de lugar-comum, que precisa ser "
            "reescrito do zero. A conclusão parece óbvia: “não serve para o meu trabalho”. A conclusão é "
            "errada — o que faltou não foi capacidade da ferramenta. Faltou forma no pedido.",
            "Um pedido completo tem cinco campos. <b>Papel</b>: quem a IA deve ser naquela resposta "
            "(analista de RH, professor de matemática, social media de uma clínica). <b>Objetivo</b>: o que "
            "precisa existir quando a resposta terminar (uma descrição de vaga pronta para publicar, um "
            "resumo de cinco linhas, uma lista de tarefas com responsável e prazo). <b>Contexto</b>: o "
            "cenário real — porte da empresa, público, o que já foi tentado, restrições do seu caso. "
            "<b>Formato</b>: como você quer receber (tabela, bullets, e-mail, roteiro, legenda). "
            "<b>Restrição</b>: o que não pode acontecer (não usar jargão, não passar de 200 palavras, não "
            "inventar dado que eu não forneci).",
            "Quando os cinco campos estão presentes, a resposta deixa de ser um rascunho e passa a ser "
            "matéria-prima pronta para revisão. É uma diferença que se mede em minutos: o que antes levava "
            "duas horas de montagem costuma virar quinze minutos de ajuste.",
            "O segundo erro é tratar cada pedido como um caso isolado. A pessoa escreve um prompt excelente, "
            "usa uma vez e esquece. O profissional faz o contrário: salva o que funcionou, com uma etiqueta "
            "do tipo “tarefa + resultado”, e reutiliza. Em duas semanas existe uma biblioteca pessoal; em um "
            "mês, você parou de escrever do zero. É aí que as horas aparecem de verdade — não em um prompt "
            "milagroso, mas em um conjunto de pedidos que você não precisa pensar de novo.",
            "O terceiro erro é entregar à IA o que não se delega. Dado de cliente, informação sigilosa, "
            "estratégia do negócio e decisão com consequência jurídica ou financeira ficam fora. A IA "
            "organiza formato e texto; a responsabilidade continua sendo de quem assina. Regra simples: "
            "se o dado não pode circular, ele não entra na ferramenta pública.",
            "Este capítulo 0 é a porta de entrada. Nas páginas seguintes você tem a folha de uso com "
            "10 prompts prontos, escritos para serem copiados e adaptados à sua profissão — e um cartão da "
            "fórmula P.O.C.F.R. para deixar à vista enquanto trabalha."],
         folha_titulo="Folha de uso — 10 prompts prontos",
         folha_intro="Copie, troque o que está entre colchetes e salve o que funcionar na sua biblioteca.",
         folha_itens=[
            ("1. Resumo de reunião", "“Você é assistente executivo. Transforme a transcrição abaixo em: (a) resumo de 5 linhas, (b) decisões tomadas, (c) tarefas com responsável e prazo, (d) pontos que ficaram em aberto. Formato: tópicos. Não invente informação que não esteja no texto.”"),
            ("2. E-mail difícil", "“Você é [seu papel]. Escreva um e-mail para [quem] sobre [assunto]. Contexto: [situação]. Tom: cordial e firme. Máximo 150 palavras. Termine com uma pergunta objetiva. Sem jargão corporativo.”"),
            ("3. Descrição de produto/serviço", "“Escreva a descrição de [produto]. Informações: [medida, material, prazo, diferencial]. Formato: 3 frases de venda + 5 características técnicas + 1 frase de quando usar. Público: [público].”"),
            ("4. Padronizar 5 respostas de cliente", "“Tenho estas 5 respostas que repito: [cole]. Gere uma variação curta (WhatsApp), uma formal (e-mail) e uma cordial (cliente antigo) para cada uma. Mantenha o sentido.”"),
            ("5. Transformar texto em checklist", "“Transforme o texto abaixo em um checklist executável, com verbos de ação, na ordem de execução e no máximo 12 itens. Marque o que depende de terceiros.”"),
            ("6. Explicar de forma simples", "“Explique [assunto] para uma pessoa que nunca teve contato com o tema, usando uma analogia do dia a dia. Depois, liste 3 erros comuns de quem começa e como evitar cada um.”"),
            ("7. Plano de conteúdo do mês", "“Você é social media de [negócio]. Crie 12 pautas para o Instagram, uma por dia útil, cada uma com: gancho de 1 linha, formato (reels/carrossel/estático) e chamada para ação. Público: [público].”"),
            ("8. Organizar dados bagunçados", "“Organize as informações abaixo em tabela com as colunas [x, y, z]. Aponte divergências, dados faltantes e o que deveria ser conferido antes de usar.”"),
            ("9. Revisão de texto próprio", "“Revise o texto abaixo. Aponte: repetições, frases longas, ambiguidades e erros de concordância. Depois, entregue a versão corrigida mantendo o meu tom — sem deixar mais formal do que está.”"),
            ("10. Antes de decidir", "“Vou decidir sobre [situação]. Liste os 5 critérios que eu deveria considerar, os 3 riscos mais prováveis e uma pergunta que eu deveria responder antes de decidir. Não recomende uma opção: me dê o critério.”"),
         ],),
    dict(slug="isca-2-dividas-capitulo-0", n=2,
         prim="#0E3B2E", acen="#B58A0F", luz="#FBF4E2",
         titulo="SAIA DO VERMELHO EM 60 DIAS", promessa="CAPÍTULO 0 + SCRIPT DE NEGOCIAÇÃO",
         lead="A ordem certa de atacar as dívidas — e o roteiro da primeira ligação, palavra por palavra.",
         cap_titulo="Capítulo 0 — O medo não é do número. É da falta do número.",
         cap_paragrafos=[
            "Enquanto a dívida é um número vago, ela é infinita. Ela ocupa o pensamento à noite, entra na "
            "conversa em família e vira aquele assunto que ninguém quer abrir. Quando ela passa a ser uma "
            "planilha com sete linhas, com valor, custo mensal e risco, muda de natureza: deixa de ser uma "
            "ameaça difusa e passa a ser um problema de engenharia. E problema de engenharia se resolve por "
            "etapas.",
            "O erro mais comum é atacar pela ponta errada. A maioria começa pelas ligações — a parte mais "
            "visível, mais desconfortável e a menos decisiva. Negociar antes de saber quanto você pode pagar "
            "é o caminho mais curto para fechar um acordo que não dura. Dois meses depois, a parcela atrasa, "
            "o acordo cai e a situação fica pior do que estava.",
            "O caminho que funciona tem quatro fases, sempre nesta ordem. <b>Raio-X</b>: levantar todas as "
            "dívidas — as registradas nos birôs de crédito, as que estão em cobrança interna e as que você "
            "nem lembra mais — com valor atualizado e custo mensal de cada uma. <b>Enxugamento</b>: liberar "
            "caixa no orçamento, cortando o que não dói, antes de qualquer negociação. <b>Acordo</b>: só "
            "então usar os scripts, com um número que caiba no pior mês, não no mês bom. <b>Liquidação</b>: "
            "quitar na ordem que reduz mais juros, não na ordem que alivia mais o coração.",
            "Duas ideias sustentam tudo isso. A primeira é <b>capacidade real de pagamento</b>: some as "
            "entradas dos últimos três meses, retire o essencial fixo, olhe o mês mais fraco e é isso que "
            "você pode comprometer. A segunda é <b>documentação</b>: nada de acordo sem estar por escrito — "
            "valor com desconto, número e valor das parcelas, datas, o que acontece em caso de atraso e a "
            "confirmação de que a dívida será regularizada ao final.",
            "Sobre os credores, uma verdade prática que economiza dinheiro: o primeiro atendimento "
            "normalmente não tem alçada para a melhor condição. Pedir para verificar outra faixa de desconto "
            "é normal, educado e faz parte do jogo. O que não se faz é aceitar o primeiro número por "
            "vergonha de negociar.",
            "As próximas páginas trazem a folha de uso: o roteiro completo da primeira ligação, as três "
            "perguntas que costumam destravar desconto e o checklist do que exigir por escrito antes de "
            "pagar qualquer parcela. Este material é educacional — não é consultoria jurídica nem "
            "financeira — e foi escrito para ser aplicado hoje."],
         folha_titulo="Folha de uso — o roteiro da primeira ligação",
         folha_intro="Leia em voz alta duas vezes antes de ligar. Não improvise a abertura.",
         folha_itens=[
            ("Abertura", "“Boa tarde. Estou ligando porque quero resolver a dívida de vocês. Consigo retomar o pagamento, mas preciso que caiba no meu orçamento. Qual é o valor atualizado hoje e quais opções de condição vocês podem me oferecer?”"),
            ("Pergunta 1 (desconto)", "“Existe desconto para pagamento à vista? Qual é a melhor faixa que você consegue aprovar?”"),
            ("Pergunta 2 (parcelamento)", "“E se eu quitar em menos parcelas, a condição muda? Quanto ficaria?”"),
            ("Pergunta 3 (alçada)", "“Essa é a melhor condição que você pode aprovar, ou existe alguma faixa que depende de outra alçada? Pode verificar?”"),
            ("Fechamento", "“Consigo pagar [valor] por mês, começando em [data]. Fechamos assim? Me envie por escrito o valor com desconto, as parcelas e as datas.”"),
            ("Checklist antes de pagar", "☐ valor total com desconto  ☐ número de parcelas  ☐ valor de cada parcela  ☐ datas exatas  ☐ o que acontece se atrasar uma parcela  ☐ confirmação de regularização ao final"),
            ("Depois de pagar", "Tire foto de cada comprovante. Confirme a baixa da parcela no app. Guarde tudo em uma pasta única — é o que protege você em uma cobrança futura."),
            ("Nunca faça", "Não aceite acordo por telefone sem documento. Não use empréstimo novo para pagar dívida antiga sem fazer a conta do custo total. Não deixe de pedir o desconto — ele costuma existir."),
         ],),
    dict(slug="isca-3-airfryer-capitulo-0", n=3,
         prim="#5A1F0E", acen="#F2A93B", luz="#FDF3E4",
         titulo="AIRFRYER SEM MIMIMI", promessa="CAPÍTULO 0 + TABELA MESTRA",
         lead="Por que a comida sai seca — e a tabela de tempo e temperatura por litragem, para imprimir.",
         cap_titulo="Capítulo 0 — Não é a receita. É o cesto cheio.",
         cap_paragrafos=[
            "Quase todo mundo já viveu a mesma cena: a receita deu certo no vídeo e, na sua cozinha, saiu "
            "comida crua no meio e queimada na borda. A conclusão apressada é “minha airfryer é ruim”. Não é. "
            "O que aconteceu foi um desencontro de informação.",
            "A primeira causa é volume. Airfryer funciona por circulação de ar quente. Cesto cheio até o "
            "topo é cesto onde o ar não passa — e o resultado são duas comidas no mesmo prato: a que pegou "
            "calor direto e a que ficou abafada. Regra prática: nunca encha além de dois terços, e prefira "
            "assar em duas levas a apertar tudo em uma.",
            "A segunda causa é litragem. Uma receita feita em airfryer de 5 litros não se comporta igual em "
            "uma de 2 litros. Menos volume significa menos tempo e porção menor. Como referência: em 2 "
            "litros, use 60 a 70% da quantidade e reduza 2 a 3 minutos; de 3 a 4 litros, a receita original "
            "funciona como está; de 5 a 6 litros, quantidade cheia com 2 a 3 minutos a mais; acima de 7 "
            "litros, 100% da quantidade, 2 minutos menos e girar a prateleira na metade do tempo.",
            "A terceira causa é o pré-aquecimento usado do jeito errado. Ele não é lei: é escolha com "
            "consequência. Pré-aqueça de 3 a 5 minutos quando a superfície precisa de reação rápida (pão de "
            "queijo, pastel, bolinho), quando há massa (bolo, pizza, empada), em proteína fina e em qualquer "
            "receita que precise selar. Não pré-aqueça quando o alimento é grosso por dentro ou quando a "
            "receita vai longe, porque o choque de calor queima por fora antes de cozinhar por dentro.",
            "A quarta causa é a umidade. Legume molhado, carne com marinada líquida e alimento descongelado "
            "escorrendo viram vapor — e vapor não doura. Seque com papel-toalha e use um fio de óleo, não um "
            "banho. Uma colher de chá distribui de forma suficiente para uma refeição de três pessoas.",
            "A seguir, a folha de uso com a tabela mestra resumida e as quatro conversões por litragem. "
            "Imprima, cole na geladeira e consulte antes de cada preparo: em uma semana, você não precisa "
            "mais adivinhar."],
         folha_titulo="Folha de uso — tabela mestra (resumo)",
         folha_intro="Temperatura e tempo para airfryer de 3 a 4 litros. Ajuste pela litragem da sua (veja as 4 conversões abaixo).",
         folha_itens=[
            ("Batata rústica (500 g)", "200 °C · 22-25 min · sacuda o cesto na metade"),
            ("Frango (coxa e sobrecoxa, 500 g)", "180 °C · 22-26 min · vire na metade"),
            ("Filé de frango / sassami", "190 °C · 12-15 min · 5 min se pré-aquecida"),
            ("Pão de queijo (congelado)", "200 °C · 12-15 min · pré-aquecer 3 min"),
            ("Pastel / bolinho", "200 °C · 10-12 min · pré-aquecer 3 min · virar"),
            ("Bacon", "180 °C · 8-10 min · sem óleo, prateleira alta"),
            ("Legumes (brócolis, abobrinha, cenoura)", "190 °C · 12-15 min · fio de óleo, sacudir"),
            ("Pizza / empada (assar massa)", "180 °C · 10-14 min · pré-aquecer 5 min"),
            ("Bolo de caneca / bolo simples", "160 °C · 20-25 min · forma untada, cesto com folga"),
            ("Peixe (tilápia, filé)", "180 °C · 10-12 min · papel-toalha antes, sem molho"),
            ("Ovo (cozido na casca)", "160 °C · 10-12 min (mole) · 14 min (firme)"),
            ("Congelados prontos", "200 °C · 12-18 min · sem descongelar, virar na metade"),
            ("CONVERSÕES POR LITRAGEM", "2L: 60-70% da quantidade e −2 a 3 min ·  3-4L: receita como está ·  5-6L: quantidade cheia e +2 a 3 min ·  7L+: 100% e −2 min, girar a prateleira"),
            ("Regra de ouro", "Cesto no máximo 2/3 cheio. Na dúvida, duas levas rendem mais que uma leva apertada."),
         ],),
    dict(slug="isca-4-energia-capitulo-0", n=4,
         prim="#1E2A5A", acen="#E8B65A", luz="#F0F3FA",
         titulo="ENERGIA EM 21 DIAS", promessa="CAPÍTULO 0 + RASTREADOR DE 7 DIAS",
         lead="Seu relógio não está quebrado, está desalinhado — e a primeira hora do dia é o que o acerta.",
         cap_titulo="Capítulo 0 — Seu relógio não está quebrado, está desalinhado",
         cap_paragrafos=[
            "Dentro de você existe um maestro. Ele não toca nenhum instrumento: rege a orquestra. Diz quando "
            "o corpo aumenta o estado de alerta, quando a temperatura sobe, quando a digestão desacelera e "
            "quando chegou a hora de desligar. E ele tem uma característica que explica quase tudo: trabalha "
            "por horário, não por vontade, e se acerta pelo relógio externo — principalmente pela luz.",
            "O problema do mundo moderno é que damos a esse maestro sinais contraditórios. Ele recebe pouca "
            "luz pela manhã (acordamos e vamos direto para o ambiente fechado, com o celular a um palmo do "
            "rosto) e muita luz à noite (tela, teto aceso, casa iluminada até tarde). O resultado é um "
            "relógio atrasado: à noite o corpo não entende que o dia acabou e, de manhã, não entende que "
            "começou.",
            "É por isso que todos os protocolos que começam somente à noite falham na metade dos casos. "
            "Ajustar a noite sem trabalhar a manhã é tentar corrigir o fim de uma fila pelo final. Este "
            "protocolo começa de manhã e tem quatro letras.",
            "<b>S — Sol.</b> Dez minutos de luz natural na primeira hora depois de acordar. Não é olhar "
            "para o sol nem tomar banho de sol: é ficar em um ambiente claro, com céu à vista — janela "
            "aberta, varanda, calçada. Para quem sai antes de clarear, vale começar a luz no início do "
            "expediente; em dias nublados, mais tempo na claridade resolve. <b>O — Ordem da desaceleração.</b> "
            "A última hora antes de dormir tem três tarefas, sempre na mesma sequência: descarregar o dia "
            "(2 a 3 minutos escrevendo o que ficou pendente), preparar o amanhã (2 minutos) e fazer o sinal "
            "de sono (1 a 2 minutos, sempre o mesmo gesto). <b>N — Nada de cafeína depois do seu horário X.</b> "
            "A cafeína tem meia-vida de cerca de cinco horas — em algumas pessoas, sete a dez. Dorme às "
            "23h? O último café é às 15h (13h para os mais sensíveis). <b>O — Otimize o quarto.</b> Sete "
            "correções, e duas importam mais que as outras: escuro de verdade e celular fora da cama.",
            "A promessa deste material é modesta e por isso é honesta: organizar noites e manhãs, com "
            "15 minutos por dia, em 21 dias. Semana 1 é organização, semana 2 é consistência, semana 3 é "
            "quando o dia começa a fazer sentido sem você pensar nele.",
            "Material educacional de rotina e bem-estar. Não substitui avaliação profissional de saúde e não "
            "se destina a tratar qualquer condição. Se você tem dificuldade persistente para dormir, ronco "
            "com pausas na respiração, sonolência ao volante ou usa medicação contínua, procure um "
            "profissional de saúde. Em crise, ligue 188 (CVV, 24 horas e gratuito).",
            "Na folha de uso você tem o rastreador de 7 dias e as três tarefas da última hora. É o começo "
            "do protocolo de 21 — e já dá para perceber diferença na primeira semana."],
         folha_titulo="Folha de uso — rastreador de 7 dias",
         folha_intro="Marque o dia que conseguir cumprir cada item. No fim da semana, some e note o padrão — sem cobrança, só observação.",
         folha_itens=[
            ("S — Sol (10 min na 1ª hora)", "☐ dia 1   ☐ dia 2   ☐ dia 3   ☐ dia 4   ☐ dia 5   ☐ dia 6   ☐ dia 7"),
            ("O — Última hora (3 tarefas)", "☐ dia 1   ☐ dia 2   ☐ dia 3   ☐ dia 4   ☐ dia 5   ☐ dia 6   ☐ dia 7"),
            ("N — Café antes do horário X", "Meu horário X: ______   ☐ d1 ☐ d2 ☐ d3 ☐ d4 ☐ d5 ☐ d6 ☐ d7"),
            ("O — Celular fora da cama", "☐ dia 1   ☐ dia 2   ☐ dia 3   ☐ dia 4   ☐ dia 5   ☐ dia 6   ☐ dia 7"),
            ("Nota do dia (0 a 10)", "d1 ___  d2 ___  d3 ___  d4 ___  d5 ___  d6 ___  d7 ___   média: ____"),
            ("As 3 tarefas da última hora", "1) Descarregar o dia no papel (2-3 min) — o que ficou pendente e quando resolver.\n2) Preparar o amanhã (2 min) — roupa, mochila, garrafa, o que tirar da frente.\n3) Sinal de sono (1-2 min) — sempre o mesmo: respirar 4-7-8, alongar ou ler 2 páginas."),
            ("Meu horário X (cafeína)", "Dorme 22h → último café 14h (12h se sensível) · Dorme 23h → 15h (13h) · Dorme 0h → 16h (14h)"),
            ("Segurança", "Rotina não trata nada. Sinais que pedem avaliação profissional: dificuldade que dura semanas, ronco com pausas, sonolência ao volante, uso contínuo de medicação. Em crise: 188."),
         ],),
]

# ------------------------------------------------------------------ estilos
def estilos(prim, acen, luz):
    p, a = colors.HexColor(prim), colors.HexColor(acen)
    return dict(
        capa_tit=ParagraphStyle("ct", fontName="Helvetica-Bold", fontSize=21, leading=24,
                                textColor=colors.white, alignment=TA_CENTER),
        capa_sub=ParagraphStyle("cs", fontName="Helvetica", fontSize=10.5, leading=14,
                                textColor=colors.HexColor("#F2F4F8"), alignment=TA_CENTER),
        capa_selo=ParagraphStyle("cse", fontName="Helvetica-Bold", fontSize=9, leading=12,
                                 textColor=a, alignment=TA_CENTER),
        h1=ParagraphStyle("h1", fontName="Helvetica-Bold", fontSize=15, leading=18, textColor=p,
                          spaceAfter=8),
        h2=ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=11.5, leading=14, textColor=p,
                          spaceAfter=4, spaceBefore=10),
        corpo=ParagraphStyle("c", fontName="Times-Roman", fontSize=10.2, leading=14.4,
                             textColor=colors.HexColor("#1B1F2A"), alignment=TA_LEFT, spaceAfter=6),
        caixa=ParagraphStyle("cx", fontName="Helvetica", fontSize=9.4, leading=13,
                             textColor=colors.HexColor("#3A4152")),
        rodape=ParagraphStyle("rd", fontName="Helvetica", fontSize=7.4, leading=9.6,
                              textColor=colors.HexColor("#6A7284"), alignment=TA_CENTER),
    )

def desenhar_capa(canvas, doc):
    i = doc.isca
    canvas.saveState()
    W, H = A5
    p, a = colors.HexColor(i["prim"]), colors.HexColor(i["acen"])
    canvas.setFillColor(p); canvas.rect(0, 0, W, H, stroke=0, fill=1)
    canvas.setFillColor(a)
    canvas.rect(0, H-9*mm, W, 2.4*mm, stroke=0, fill=1)
    canvas.rect(0, 22*mm, W, 6*mm, stroke=0, fill=1)
    canvas.setFillColor(colors.HexColor(i["luz"]))
    canvas.setFont("Helvetica", 7.5)
    canvas.drawCentredString(W/2, 24.6*mm, "MATERIAL GRATUITO · COLEÇÃO VIDA EM ORDEM")
    canvas.setFillColor(colors.HexColor("#FFFFFF"))
    canvas.setFont("Helvetica", 8)
    canvas.drawCentredString(W/2, 13*mm, f"VOL. {i['n']} — versão de amostra · o livro completo tem muito mais")
    canvas.restoreState()

def main():
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(FONT, exist_ok=True)
    gerados = []
    for i in ISCAS:
        est = estilos(i["prim"], i["acen"], i["luz"])
        prim, acen, luz = (colors.HexColor(i[k]) for k in ("prim", "acen", "luz"))
        destino = os.path.join(OUT, i["slug"] + ".pdf")
        doc = BaseDocTemplate(destino, pagesize=A5,
                              leftMargin=16*mm, rightMargin=16*mm, topMargin=17*mm, bottomMargin=17*mm,
                              title=f"{i['titulo']} — capítulo 0", author="Coleção Vida em Ordem",
                              subject=i["promessa"])
        doc.isca = i
        frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f")
        doc.addPageTemplates([PageTemplate(id="capa", frames=[frame], onPage=desenhar_capa),
                              PageTemplate(id="miolo", frames=[frame])])

        F = []
        F.append(Spacer(1, 46*mm))
        F.append(Paragraph(i["promessa"], est["capa_selo"]))
        F.append(Spacer(1, 6*mm))
        F.append(Paragraph(i["titulo"], est["capa_tit"]))
        F.append(Spacer(1, 8*mm))
        F.append(Paragraph(i["lead"], est["capa_sub"]))
        F.append(Spacer(1, 58*mm))
        F.append(Paragraph("Capítulo 0 do livro + folha de uso para imprimir", est["capa_sub"]))

        F.append(Spacer(1, 0))   # quebra de página
        from reportlab.platypus import PageBreak
        F.append(PageBreak())
        F.append(Paragraph(i["cap_titulo"], est["h1"]))
        for par in i["cap_paragrafos"]:
            F.append(Paragraph(par, est["corpo"]))

        F.append(PageBreak())
        F.append(Paragraph(i["folha_titulo"], est["h1"]))
        F.append(Paragraph(i["folha_intro"], est["caixa"]))
        F.append(Spacer(1, 5*mm))
        linhas = [[Paragraph(f"<b>{t}</b>", est["caixa"]), Paragraph(v.replace("\n", "<br/>"), est["caixa"])]
                  for t, v in i["folha_itens"]]
        t = Table(linhas, colWidths=[42*mm, doc.width-42*mm])
        t.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("BACKGROUND", (0, 0), (0, -1), luz),
            ("BACKGROUND", (1, 0), (1, -1), colors.white),
            ("BOX", (0, 0), (-1, -1), 0.7, acen),
            ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#D7DBE5")),
            ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
            ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]))
        F.append(t)
        F.append(Spacer(1, 6*mm))
        F.append(Paragraph("Material educacional. Nada aqui promete resultado nem substitui orientação profissional.", est["rodape"]))

        doc.build(F)
        tamanho = os.path.getsize(destino)
        gerados.append((os.path.basename(destino), tamanho))

        # fonte editável
        md = [f"# {i['promessa']} — {i['titulo']}", "", f"_{i['lead']}_", "", f"## {i['cap_titulo']}", ""]
        for par in i["cap_paragrafos"]:
            md.append(par.replace("<b>", "**").replace("</b>", "**")); md.append("")
        md += [f"## {i['folha_titulo']}", "", i["folha_intro"], ""]
        for tt, vv in i["folha_itens"]:
            md += [f"**{tt}**", "", vv, ""]
        with open(os.path.join(FONT, i["slug"] + ".md"), "w", encoding="utf-8") as f:
            f.write("\n".join(md))

    leia = """# Iscas (lead magnets) — Coleção Vida em Ordem

Quatro PDFs prontos para **capturar e-mail**, um por livro. Cada um traz:

- **capa** com a identidade do volume (1600×2560 não: aqui é A5, para leitura no celular)
- **capítulo 0** — conteúdo real, não amostra vazia
- **folha de uso** — uma ferramenta prática (10 prompts · script de negociação · tabela mestra · rastreador)

## Como usar na captura

1. Suba o PDF em um serviço com entrega por e-mail (MailerLite, Brevo, Kiwify, Hotmart, Google Drive com formulário).
2. Página de captura: headline = a promessa da isca; campo único (nome + e-mail); botão "Quero o capítulo 0".
3. Sequência de 5 e-mails (arquivo `13-trafego-organico-estrutura.md`, §6): entrega → tarefa de 10 min → erro comum → conversa → oferta R$ 47.
4. Na bio das redes e nas descrições dos vídeos, use o link com UTM:

```
https://sualp.com.br/isca-vol3?utm_source=tiktok&utm_medium=organico&utm_campaign=vol3&utm_content=tiktok007
```

## Arquivos

| PDF | Livro | Folha de uso |
|---|---|---|
| `isca-1-ia-capitulo-0.pdf` | IA que Trabalha por Você | 10 prompts prontos + fórmula P.O.C.F.R. |
| `isca-2-dividas-capitulo-0.pdf` | Saia do Vermelho em 60 Dias | roteiro da 1ª ligação + checklist do acordo |
| `isca-3-airfryer-capitulo-0.pdf` | Airfryer Sem Mimimi | tabela mestra + conversões por litragem |
| `isca-4-energia-capitulo-0.pdf` | Energia em 21 Dias | rastreador de 7 dias + 3 tarefas da última hora |

Os textos em `fontes/` são a fonte editável (Markdown). Para mudar algo, edite o arquivo e rode
`python3 tools/gerar_iscas.py` de novo.

> Materiais educacionais. Nada promete resultado. O volume 4 traz o aviso de segurança e o CVV 188.
"""
    with open(os.path.join(OUT, "LEIA-ME.md"), "w", encoding="utf-8") as f:
        f.write(leia)

    print(f"{len(gerados)} iscas geradas em {OUT}:")
    for nome, tam in gerados:
        print(f"  {nome:34s} {tam/1024:6.1f} KB")

if __name__ == "__main__":
    main()
