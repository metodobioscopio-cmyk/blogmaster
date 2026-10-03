#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
gerar_paginas.py — páginas de venda (HTML autocontido) da coleção Vida em Ordem.

Saída em projeto-4-infoprodutos/paginas/:
  index.html            hub com os 4 volumes + oferta do combo
  livro-1.html … livro-4.html
  _publicar/            mesmo HTML pronto para arrastar para Kiwify/Cakto/Netlify

Cada página é UM arquivo: CSS inline + imagens em base64 + JSON-LD.
Não depende de internet, CDN, fonte externa ou JavaScript de terceiros.

⚠️  ANTES DE PUBLICAR: troque os links de checkout no dicionário CHECKOUT (abaixo).
    Eles estão marcados no HTML com  href="SUBSTITUIR-..."  para busca fácil.
"""
import os, base64, json, html

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJ = os.path.join(RAIZ, "projeto-4-infoprodutos")
MKT  = os.path.join(PROJ, "marketing")
OUT  = os.path.join(PROJ, "paginas")

# ------------------------------------------------------------------ links de checkout
CHECKOUT = {
    "vol1-ia":      dict(principal="SUBSTITUIR-LINK-CHECKOUT-IA",
                         bump="SUBSTITUIR-LINK-BUMP-IA (Kit Vendas com IA R$ 27)",
                         upsell="SUBSTITUIR-LINK-UPSELL-IA (pacote R$ 97)"),
    "vol2-dividas": dict(principal="SUBSTITUIR-LINK-CHECKOUT-DIVIDAS",
                         bump="SUBSTITUIR-LINK-BUMP-DIVIDAS (Kit Disque-Acordo R$ 27)",
                         upsell="SUBSTITUIR-LINK-UPSELL-DIVIDAS (pacote R$ 97)"),
    "vol3-airfryer":dict(principal="SUBSTITUIR-LINK-CHECKOUT-AIRFRYER",
                         bump="SUBSTITUIR-LINK-BUMP-AIRFRYER (Kit Despensa Inteligente R$ 27)",
                         upsell="SUBSTITUIR-LINK-UPSELL-AIRFRYER (pacote R$ 97)"),
    "vol4-energia": dict(principal="SUBSTITUIR-LINK-CHECKOUT-ENERGIA",
                         bump="SUBSTITUIR-LINK-BUMP-ENERGIA (Kit Rotina Blindada R$ 27)",
                         upsell="SUBSTITUIR-LINK-UPSELL-ENERGIA (pacote R$ 97)"),
    "combo":        dict(principal="SUBSTITUIR-LINK-CHECKOUT-COMBO (os 4 por R$ 127)",
                         bump="SUBSTITUIR-LINK-BUMP-COMBO",
                         upsell="SUBSTITUIR-LINK-UPSELL-COMBO"),
}
EMAIL_SUPORTE = "SUBSTITUIR-EMAIL-DE-SUPORTE@seudominio.com.br"
RAZAO         = "SUBSTITUIR-RAZÃO-SOCIAL / CNPJ"

# ------------------------------------------------------------------ dados das páginas
LIVROS = {
"vol1-ia": dict(
    n=1, cor="#1B2A4A", acen="#00A98A", luz="#E8F7F3",
    nome="IA que Trabalha por Você",
    promessa="200 prompts prontos",
    titulo_html="IA que <span>trabalha por você</span>",
    sub="O método 5D para delegar a parte chata do dia — <b>200 prompts em português</b>, 12 automações passo a passo e a fórmula P.O.C.F.R. Sem programar, funciona no celular.",
    capa="capas/capa-vol1-ia.jpg",
    imagens=["mockups/vol1-ia-1-livro-em-pe.jpg", "mockups/vol1-ia-2-aberto-por-dentro.jpg",
             "mockups/vol1-ia-4-kit-bonus.jpg", "mockups/vol1-ia-3-tablet-e-celular.jpg"],
    dores=["Você abre a IA, escreve “me ajuda com isso” e recebe um texto genérico que precisa ser reescrito inteiro.",
           "Passa três horas montando um relatório que sairia em quinze minutos se a solicitação estivesse certa.",
           "Vê gente vendendo serviço com IA e pensa: “eu não sei fazer isso”.",
           "Já assistiu vídeo grátis, salvou posts, mas nada virou rotina no seu dia."],
    por_que="Conteúdo grátis ensina a <b>ferramenta</b>. O que falta é a <b>tarefa</b>: a receita pronta, aplicada ao seu trabalho. Você não precisa de aula de IA — precisa de uma lista do que pedir e de um método para isso virar hábito.",
    mecanismo_titulo="O método 5D",
    mecanismo=[("1. Diagnóstico", "Você mede quanto vale a sua hora e lista as 10 tarefas que mais consomem tempo."),
               ("2. Delegação", "Escolhe o que a IA faz sozinha — e o que não deve passar por ela em hipótese alguma."),
               ("3. Direção", "A fórmula P.O.C.F.R.: papel, objetivo, contexto, formato e restrição. É o que separa resposta genérica de trabalho pronto."),
               ("4. Documentação", "Transforma o que funcionou em biblioteca de prompts sua — e não depende mais da memória."),
               ("5. Dinheiro", "Tabela de preços de 8 serviços que podem ser prestados com IA e 5 scripts para conseguir o primeiro cliente.")],
    dentro=["200 prompts em português, organizados por 10 profissões",
           "12 automações ilustradas, passo a passo (sem código)",
           "Fórmula de prompt P.O.C.F.R. + 10 exemplos comentados",
           "Tabela de preços de 8 serviços de IA",
           "5 scripts de abordagem para o primeiro cliente",
           "Planilha de horas economizadas (o ROI do livro, em número)"],
    bonus=[("200 Prompts Essenciais por profissão", "R$ 47"),
           ("12 Automações explicadas", "R$ 37"),
           ("Tabela de Preços + scripts de abordagem", "R$ 27")],
    ancoragem="Um freelancer cobra em média R$ 300 por uma proposta. Aqui você aprende a fazer em minutos <b>e</b> a cobrar por isso.",
    garantia="7 dias (Código de Defesa do Consumidor, art. 49). Se abrir e achar que não é para você, devolvemos 100%. Sem formulário chato e sem constrangimento.",
    faq=[("Preciso pagar alguma ferramenta?", "Não. Os prompts funcionam na versão gratuita das principais IAs. Assinaturas ampliam o limite de uso, mas não são obrigatórias."),
         ("Serve para quem não entende nada de tecnologia?", "Sim. Cada prompt e cada automação tem o passo a passo. Se você sabe usar WhatsApp, consegue aplicar."),
         ("Funciona no celular?", "Funciona. Toda a biblioteca de prompts foi pensada para ser usada no celular, com blocos de texto fácil de copiar."),
         ("É curso em vídeo?", "Não. É um livro prático (PDF + EPUB) com bônus em planilha. Leitura de 1 hora, aplicação imediata."),
         ("Quanto tempo leva para aplicar?", "A primeira tarefa do método leva 15 minutos e pode ser feita hoje."),
         ("Como recebo?", "Acesso imediato por e-mail, logo após a confirmação do pagamento (Pix cai na hora).")],
    ps="Se você não ganhar tempo na primeira semana, não perdeu dinheiro: tem 7 dias para pedir reembolso. E se ganhar, encontrou o melhor estagiário do mundo — que trabalha 24h e não pede aumento.",
    rodape_regra="Material educacional. Resultados variam conforme a aplicação."),
"vol2-dividas": dict(
    n=2, cor="#0E3B2E", acen="#B58A0F", luz="#FBF4E2",
    nome="Saia do Vermelho em 60 Dias",
    promessa="plano de 60 dias",
    titulo_html="Saia do <span>vermelho</span> em 60 dias",
    sub="O método R.E.A.L. para organizar e negociar suas dívidas: <b>planilha Raio-X</b>, calculadora de parcela e <b>15 scripts prontos</b> para chat, telefone e e-mail.",
    capa="capas/capa-vol2-dividas.jpg",
    imagens=["mockups/vol2-dividas-1-livro-em-pe.jpg", "mockups/vol2-dividas-4-kit-bonus.jpg",
             "mockups/vol2-dividas-2-aberto-por-dentro.jpg", "mockups/vol2-dividas-3-tablet-e-celular.jpg"],
    dores=["Você sabe que tem dívidas, mas não sabe o valor real somado — e o número vago parece infinito.",
           "A oferta que chega por WhatsApp parece resolver, mas a parcela não cabe no mês.",
           "Tem medo de fechar um acordo e não conseguir pagar até o fim.",
           "Cada mês que passa, a dívida cresce mais rápido que a renda."],
    por_que="“Educação financeira” começa pelo passo errado. Poupar e investir é o passo 3. O passo 1 é <b>parar a sangria dos juros</b> e organizar a ordem de ataque: o que é urgente, o que é caro e o que espera.",
    mecanismo_titulo="O método R.E.A.L. em 4 fases",
    mecanismo=[("Fase 1 · Raio-X (dias 1-7)", "Todas as dívidas listadas nas fontes oficiais e gratuitas, com o custo real de cada uma por mês."),
               ("Fase 2 · Enxugamento (dias 8-15)", "12 cortes que liberam de R$ 200 a R$ 600 por mês sem cortar o que importa."),
               ("Fase 3 · Acordo (dias 16-45)", "Os 15 scripts, a hora certa de pedir autorização ao supervisor e o que exigir por escrito antes de pagar qualquer parcela."),
               ("Fase 4 · Liquidação (dias 46-60)", "A tabela de desconto esperado por tipo de dívida e o plano de quitação que reduz o total de juros.")],
    dentro=["Planilha Raio-X: dívidas organizadas por risco e custo real",
           "15 scripts de negociação (chat, telefone, e-mail, cobrança, cartão, banco, faculdade, plano de saúde)",
           "Calculadora de capacidade real de pagamento",
           "Tabela de desconto esperado por tipo e tempo de atraso",
           "Planilha de quitação com projeção automática",
           "Guia de direitos: cobrança abusiva, Lei do Superendividamento e como blindar o CPF"],
    bonus=[("15 Scripts Editáveis", "R$ 47"),
           ("Checklist de Acordo Seguro", "R$ 27"),
           ("Guia de Blindagem do CPF", "R$ 27")],
    ancoragem="Um mês de juros do rotativo do cartão pode custar mais de R$ 400 na sua fatura. O plano que organiza essa conta custa menos que um jantar.",
    garantia="7 dias (CDC art. 49). Se abrir e achar que não é para o seu caso, devolvemos 100% do valor.",
    faq=[("Serve para quem está com o nome negativado?", "Sim. Negativação tem prazo e regra própria — o material mostra como lidar com o apontamento sem prometer prazo que não depende de você."),
         ("E se eu não tiver dinheiro para pagar nada agora?", "A Fase 2 é exatamente para isso: liberar caixa antes de negociar, para você não fechar um acordo que não consegue sustentar."),
         ("Funciona com bancos e lojas?", "Os scripts cobrem banco, financeira, cartão, loja, faculdade, plano de saúde e cobrança terceirizada."),
         ("É serviço jurídico?", "Não. É material educacional de organização e negociação. Não substitui advogado nem profissional de finanças."),
         ("Quanto tempo até a primeira negociação?", "O roteiro prevê a primeira ligação na primeira semana, com o script da página correspondente na frente."),
         ("Como recebo?", "Acesso imediato por e-mail após a confirmação do pagamento.")],
    ps="O credor já tem um script treinado para soar irrecusável. Agora você também tem.",
    rodape_regra="Material educacional de organização e negociação. Não é consultoria jurídica nem financeira."),
"vol3-airfryer": dict(
    n=3, cor="#5A1F0E", acen="#F2A93B", luz="#FDF3E4",
    nome="Airfryer Sem Mimimi",
    promessa="120 receitas",
    titulo_html="Airfryer <span>sem mimimi</span>",
    sub="120 receitas com <b>4 números em cada uma</b>: tempo ativo, custo por porção, temperatura e litragem testada. Mais o sistema 20-5-7 para fazer 7 marmitas em 90 minutos.",
    capa="capas/capa-vol3-airfryer.jpg",
    imagens=["mockups/vol3-airfryer-1-livro-em-pe.jpg", "mockups/vol3-airfryer-2-aberto-por-dentro.jpg",
             "mockups/vol3-airfryer-4-kit-bonus.jpg", "mockups/vol3-airfryer-3-tablet-e-celular.jpg"],
    dores=["A airfryer virou enfeite e só sai batata e nuggets.",
           "A receita que você achou na internet saiu seca — e a sua airfryer é de 2 litros, a do vídeo era de 5.",
           "O delivery de fim de semana estourou o orçamento do mês.",
           "Você odeia cozinhar, e odeia ainda mais lavar louça."],
    por_que="Receita não é o problema: <b>informação</b> é. Sem saber a litragem do cesto, a temperatura certa e o custo do prato, você fica refazendo teste até desistir e pedir delivery.",
    mecanismo_titulo="O sistema 20-5-7 + os 4 números",
    mecanismo=[("20 minutos", "O tempo máximo de uma receita de jantar deste livro — da geladeira ao prato."),
               ("5 ingredientes", "Nada de lista de 14 itens caros. Cada receita usa no máximo 5 ingredientes principais."),
               ("7 marmitas", "O cronograma de 90 minutos do domingo que abastece a semana."),
               ("4 números por receita", "Tempo ativo · custo por porção · temperatura · litragem testada. É o que faz dar certo na SUA cozinha.")],
    dentro=["120 receitas: jantares, almoços, marmitas, lanches, doces, café da manhã e molhos",
           "Tabela mestra de tempo e temperatura para colar na geladeira",
           "Sistema 20-5-7 + cronograma de 90 minutos",
           "Lista de compras automática por orçamento (R$ 150 / R$ 250 / R$ 400)",
           "Tabela de custo por porção + comparativo com delivery",
           "Guia de congelamento, validade e substituição de ingredientes"],
    bonus=[("Tabela de Custo por Porção (planilha)", "R$ 37"),
           ("Cardápio de 30 dias", "R$ 27"),
           ("20 temperos secos para não errar o sabor", "R$ 27")],
    ancoragem="Um jantar de delivery para 3 pessoas custa cerca de R$ 90. Três refeições deste livro pagam o material.",
    garantia="7 dias (CDC art. 49). Se não gostar, devolvemos 100% — e você fica com a tabela de temperatura.",
    faq=[("Minha airfryer é 2 litros, serve?", "Serve. Toda receita traz a litragem considerada e a regra de ajuste: menos cesto, menos tempo e porção reduzida."),
         ("As fotos são reais?", "As imagens das receitas são ilustrativas. Por isso o livro não vende “foto bonita”: vende os 4 números, que você confere na sua cozinha."),
         ("Preciso imprimir?", "Não. O PDF foi diagramado para leitura no celular. As tabelas você pode imprimir se preferir."),
         ("Tem receita sem glúten ou lactose?", "Há receitas naturalmente sem glúten e sem lactose, e o guia de substituição mostra as trocas possíveis."),
         ("Quanto tempo por dia na cozinha?", "As receitas de jantar levam até 20 minutos de tempo ativo. O dia de preparo em lote leva 90 minutos e rende 7 marmitas."),
         ("Como recebo?", "Acesso imediato por e-mail após a confirmação do pagamento.")],
    ps="Se você fizer só 6 das 120 receitas neste mês, o material já se pagou — e você ainda tem 114 ideias para o resto do ano.",
    rodape_regra="Material educacional de culinária e orçamento doméstico. Imagens ilustrativas."),
"vol4-energia": dict(
    n=4, cor="#1E2A5A", acen="#E8B65A", luz="#F0F3FA",
    nome="Energia em 21 Dias",
    promessa="15 minutos por dia · 21 dias",
    titulo_html="Energia em <span>21 dias</span>",
    sub="O protocolo <b>S.O.N.O.</b> para organizar noites e manhãs: a tarefa de cada dia (15 minutos), rastreador de 21 dias, 3 áudios guiados e trilha para quem trabalha à noite ou em escalas.",
    capa="capas/capa-vol4-energia.jpg",
    imagens=["mockups/vol4-energia-1-livro-em-pe.jpg", "mockups/vol4-energia-2-aberto-por-dentro.jpg",
             "mockups/vol4-energia-4-kit-bonus.jpg", "mockups/vol4-energia-3-tablet-e-celular.jpg"],
    dores=["Acorda já cansado e o dia começa com o terceiro toque do despertador.",
           "À tarde o foco desaba e a saída é mais café.",
           "Você já tentou “dormir mais cedo” e ficou rolando o feed até tarde.",
           "Sente que perdeu o controle da própria rotina — e o fim de semana não recupera."],
    por_que="Quase todo protocolo de rotina começa à noite. Este começa <b>de manhã</b>: a primeira hora do dia define o horário em que você vai sentir sono à noite. Sem luz de manhã, nenhuma força de vontade compensa.",
    mecanismo_titulo="O protocolo S.O.N.O.",
    mecanismo=[("S — Sol", "10 minutos de luz natural na primeira hora depois de acordar (com alternativa para quem sai antes de clarear, dias nublados e quarto escuro)."),
               ("O — Ordem da desaceleração", "As 3 tarefas da última hora: descarregar o dia (2-3 min), preparar amanhã (2 min), sinal de sono (1-2 min)."),
               ("N — Nada de cafeína depois do seu horário X", "Calculado a partir da sua hora de dormir: quem dorme às 23h para o café às 15h."),
               ("O — Otimize o quarto", "7 correções, com prioridade em duas: escuro de verdade e celular fora da cama.")],
    dentro=["Protocolo de 21 dias com a tarefa de cada dia (15 minutos, uma página por dia)",
           "Rastreador de 21 dias + planilha para ver a média da semana",
           "Kit da noite, kit da manhã e cartão S.O.N.O. de bolso para imprimir",
           "Trilha específica para trabalho noturno, escalas e viagens com fuso diferente",
           "Protocolo de emergência para noites ruins (a parte que ninguém ensina)",
           "3 áudios guiados (respiração, soltar o dia, foco) + desintoxicação digital de 7 noites"],
    bonus=[("3 Áudios Guiados narrados", "R$ 37"),
           ("Rastreador de 21 dias (folha + planilha)", "R$ 27"),
           ("Desintoxicação digital de 7 noites", "R$ 27")],
    ancoragem="Uma caixa de energético por mês custa mais caro que este material — e o efeito dela dura três horas.",
    garantia="7 dias (CDC art. 49). Se em 21 dias você não sentir diferença na organização da sua rotina, devolvemos o valor.",
    faq=[("Substitui médico ou profissional de saúde?", "Não. É material educacional de rotina e bem-estar. Não trata nem diagnostica nada. Se você tem dificuldade persistente para dormir, ronco com pausas na respiração, sonolência ao volante ou usa medicação contínua, procure um profissional de saúde."),
         ("Trabalho de madrugada ou em escala, serve?", "Sim. Há uma trilha específica, com a lógica do protocolo adaptada para quem não acorda de manhã."),
         ("Preciso de aparelho, aplicativo ou anel de sono?", "Não. O rastreador é uma folha (ou a planilha inclusa). Nenhum aparelho é necessário."),
         ("Quanto tempo por dia?", "15 minutos, divididos entre a manhã e a última hora antes de dormir."),
         ("E se eu falhar dois dias?", "Existe uma página só sobre isso: como retomar sem recomeçar do zero, e o protocolo de noite ruim."),
         ("Como recebo?", "Acesso imediato por e-mail, com os áudios na mesma pasta do livro.")],
    ps="Você já tentou força de vontade. Agora tente ordem. Se em 21 dias não sentir diferença, devolvemos seu dinheiro — e você fica com os áudios.",
    rodape_regra="Material educacional de rotina e bem-estar. Não substitui avaliação profissional. Em crise, ligue 188 (CVV, 24h e gratuito)."),
}

COMBO = dict(
    cor="#161B33", acen="#E8B65A",
    nome="Coleção Vida em Ordem — 4 volumes",
    titulo_html="Os <span>4 pilares</span> da sua vida",
    sub="Tempo, dinheiro, comida e energia. Quatro livros completos, com todos os bônus, por <b>R$ 127</b> (avulso: R$ 188).",
    imagens=["mockups/kit-completo-5-hero.jpg", "mockups/vol1-ia-1-livro-em-pe.jpg",
             "mockups/vol3-airfryer-2-aberto-por-dentro.jpg", "mockups/vol4-energia-1-livro-em-pe.jpg"],
)

# ------------------------------------------------------------------ CSS
CSS = """
*{box-sizing:border-box;margin:0;padding:0}
:root{--prim:%(cor)s;--acen:%(acen)s;--luz:%(luz)s;--txt:#141821;--mut:#5A6478;--bd:rgba(20,24,33,.10)}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
 color:var(--txt);background:#fff;line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%%;display:block}
.wrap{max-width:1060px;margin:0 auto;padding:0 20px}
header.topo{background:var(--prim);color:#fff;padding:14px 0;font-size:13px;letter-spacing:.16em;text-transform:uppercase}
header.topo .wrap{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;opacity:.86}
.hero{background:linear-gradient(160deg,var(--prim),#0B0F1C);color:#fff;padding:56px 0 64px;position:relative;overflow:hidden}
.hero:after{content:"";position:absolute;inset:auto -10%% -40%% -10%%;height:60%%;background:radial-gradient(ellipse at 50%% 0,%(acen)s33,transparent 70%%)}
.hero .wrap{display:grid;grid-template-columns:1.15fr .85fr;gap:44px;align-items:center;position:relative;z-index:1}
.selo{display:inline-block;background:var(--acen);color:#12161F;font-weight:800;font-size:13px;
 letter-spacing:.1em;text-transform:uppercase;padding:7px 16px;border-radius:999px;margin-bottom:18px}
.hero h1{font-size:clamp(30px,4.4vw,50px);line-height:1.06;letter-spacing:-.02em;font-weight:800}
.hero h1 span{color:var(--acen)}
.hero p.sub{margin-top:18px;font-size:clamp(16px,1.6vw,19px);color:rgba(255,255,255,.88);max-width:36ch}
.hero img.capa{border-radius:10px;box-shadow:0 30px 60px rgba(0,0,0,.45);width:100%%}
.cta{display:inline-flex;align-items:center;gap:10px;background:var(--acen);color:#12161F;font-weight:800;
 text-decoration:none;padding:17px 34px;border-radius:999px;font-size:17px;margin-top:26px;
 box-shadow:0 10px 26px rgba(0,0,0,.28);transition:transform .15s ease}
.cta:hover{transform:translateY(-2px)}
.cta small{display:block;font-weight:600;font-size:12px;opacity:.75;margin-top:2px}
.micro{margin-top:12px;font-size:13px;color:rgba(255,255,255,.72)}
section{padding:56px 0;border-bottom:1px solid var(--bd)}
section.alt{background:#F7F8FB}
h2{font-size:clamp(22px,2.6vw,32px);line-height:1.15;letter-spacing:-.01em;margin-bottom:14px}
h2 span{color:var(--prim)}
.lead{color:var(--mut);font-size:17px;max-width:70ch}
.dores{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:26px}
.dor{background:#fff;border:1px solid var(--bd);border-left:5px solid var(--acen);border-radius:12px;padding:18px 20px;color:var(--mut)}
.metodo{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:28px}
.passo{background:#fff;border:1px solid var(--bd);border-radius:14px;padding:22px}
.passo b{display:block;color:var(--prim);font-size:16px;margin-bottom:6px}
.passo p{color:var(--mut);font-size:15px}
.lista{margin-top:26px;display:grid;grid-template-columns:1fr 1fr;gap:10px 26px;list-style:none}
.lista li{position:relative;padding-left:30px;color:#2A3242;font-size:16px}
.lista li:before{content:"";position:absolute;left:0;top:8px;width:17px;height:17px;border-radius:50%%;
 background:var(--acen);box-shadow:inset 0 0 0 4px #fff}
.bonus{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:26px}
.bcard{background:linear-gradient(180deg,#fff,var(--luz));border:1px dashed var(--acen);border-radius:14px;padding:20px}
.bcard b{display:block;font-size:16px;margin-bottom:8px}
.bcard s{color:#98A0B2}
.provas{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:26px}
.prova{background:#fff;border:1px solid var(--bd);border-radius:14px;overflow:hidden}
.prova img{width:100%%}
.preco{background:var(--prim);color:#fff;border-radius:20px;padding:38px;text-align:center;margin-top:8px}
.preco .de{opacity:.6;text-decoration:line-through;font-size:17px}
.preco .por{font-size:clamp(40px,6vw,60px);font-weight:800;letter-spacing:-.03em;line-height:1.1;margin:6px 0 4px}
.preco .obs{opacity:.8;font-size:14px;margin-bottom:20px}
.preco .cta{margin-top:4px}
.garantia{display:flex;gap:18px;align-items:flex-start;background:var(--luz);border:1px solid var(--acen);
 border-radius:16px;padding:24px;margin-top:26px}
.garantia .num{font-size:34px;font-weight:800;color:var(--prim);line-height:1}
details{background:#fff;border:1px solid var(--bd);border-radius:12px;padding:16px 20px;margin-top:10px}
details summary{font-weight:700;cursor:pointer;list-style:none}
details summary::-webkit-details-marker{display:none}
details summary:after{content:"+";float:right;color:var(--acen);font-weight:800}
details[open] summary:after{content:"–"}
details p{color:var(--mut);margin-top:10px;font-size:15px}
footer{background:#0E1220;color:rgba(255,255,255,.72);padding:40px 0;font-size:13px}
footer a{color:var(--acen)}
.aviso{background:#FFF6E5;border:1px solid #E8B65A;border-radius:12px;padding:16px 20px;font-size:14px;color:#6B4E12;margin-top:22px}
.barra{position:fixed;left:0;right:0;bottom:0;background:var(--prim);color:#fff;padding:10px 16px;display:none;
 align-items:center;justify-content:space-between;gap:12px;z-index:50;box-shadow:0 -8px 24px rgba(0,0,0,.2)}
.barra b{font-size:15px}
.barra a{background:var(--acen);color:#12161F;font-weight:800;text-decoration:none;padding:11px 18px;border-radius:999px;font-size:14px;white-space:nowrap}
@media(max-width:820px){
 .hero .wrap{grid-template-columns:1fr;gap:30px}
 .hero img.capa{max-width:300px;margin:0 auto}
 .lista{grid-template-columns:1fr}
 .barra{display:flex}
 body{padding-bottom:66px}
}
@media print{.barra,.cta,header.topo{display:none}}
""" 

def img_b64(rel, largura_max=980, q=82):
    """Embute a imagem em base64 já otimizada (página de venda leve no celular)."""
    from PIL import Image
    import io
    p = os.path.join(MKT, rel)
    if not os.path.exists(p):
        return None
    im = Image.open(p).convert("RGB")
    if im.width > largura_max:
        im = im.resize((largura_max, int(im.height*largura_max/im.width)), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

def bloco_faq(faq):
    return "\n".join(f"""      <details><summary>{html.escape(q)}</summary><p>{r}</p></details>""" for q, r in faq)

def pagina_livro(slug):
    d = LIVROS[slug]
    ck = CHECKOUT[slug]
    capa = img_b64(d["capa"]) or ""
    provas = "\n".join(
        f'        <div class="prova"><img src="{img_b64(i) or ""}" alt="Material {html.escape(d["nome"])}"></div>'
        for i in d["imagens"] if img_b64(i))
    passos = "\n".join(f'        <div class="passo"><b>{t}</b><p>{p}</p></div>' for t, p in d["mecanismo"])
    dentro = "\n".join(f"        <li>{x}</li>" for x in d["dentro"])
    dores = "\n".join(f'        <div class="dor">{x}</div>' for x in d["dores"])
    bonus = "\n".join(f'        <div class="bcard"><b>{n}</b><s>valor avulso {v}</s></div>' for n, v in d["bonus"])
    soma = sum(int(v.replace("R$ ", "").replace(".", "")) for _, v in d["bonus"])
    css = CSS % dict(cor=d["cor"], acen=d["acen"], luz=d["luz"])
    ld = json.dumps({
        "@context": "https://schema.org", "@type": "Book",
        "name": d["nome"], "bookFormat": "https://schema.org/EBook",
        "inLanguage": "pt-BR", "genre": "Material educacional",
        "offers": {"@type": "Offer", "price": "47.00", "priceCurrency": "BRL", "availability": "https://schema.org/InStock"},
    }, ensure_ascii=False)
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{d['nome']} — {d['promessa']} | R$ 47</title>
<meta name="description" content="{html.escape(d['sub'].replace('<b>','').replace('</b>',''))}">
<!-- OG: troque og:image por uma URL pública da capa depois de subir o arquivo (base64 não funciona em preview de rede social) -->
<meta property="og:title" content="{d['nome']} — {d['promessa']}">
<meta property="og:description" content="{html.escape(d['sub'].replace('<b>','').replace('</b>',''))}">
<meta property="og:type" content="product">
<meta property="og:image" content="SUBSTITUIR-URL-PUBLICA-{d['capa'].split('/')[-1]}">
<link rel="canonical" href="SUBSTITUIR-URL-DA-PAGINA">
<script type="application/ld+json">{ld}</script>
<style>{css}</style>
</head>
<body>
<header class="topo"><div class="wrap"><span>Coleção Vida em Ordem · Vol. {d['n']}</span><span>PDF + EPUB + bônus</span></div></header>

<div class="hero">
  <div class="wrap">
    <div>
      <span class="selo">{d['promessa']}</span>
      <h1>{d['titulo_html']}</h1>
      <p class="sub">{d['sub']}</p>
      <a class="cta" href="#comprar">Quero por R$ 47 <small>acesso imediato · 7 dias de garantia</small></a>
      <p class="micro">Material educacional · pagamento único · sem mensalidade</p>
    </div>
    <img class="capa" src="{capa}" alt="Capa do livro {html.escape(d['nome'])}">
  </div>
</div>

<section><div class="wrap">
  <h2>Se você se reconhece aqui, <span>o problema não é você</span></h2>
  <p class="lead">É a falta de um caminho na ordem certa. As cenas abaixo são as que mais aparecem:</p>
  <div class="dores">{dores}</div>
</div></section>

<section class="alt"><div class="wrap">
  <h2>Por que <span>o conteúdo grátis não resolveu</span></h2>
  <p class="lead">{d['por_que']}</p>
</div></section>

<section><div class="wrap">
  <h2>{d['mecanismo_titulo'].split(' ')[0]} <span>{' '.join(d['mecanismo_titulo'].split(' ')[1:])}</span></h2>
  <div class="metodo">{passos}</div>
</div></section>

<section class="alt"><div class="wrap">
  <h2>O que tem dentro</h2>
  <ul class="lista">
{dentro}
  </ul>
</div></section>

<section><div class="wrap">
  <h2>Bônus inclusos <span>(R$ {soma} em material extra)</span></h2>
  <div class="bonus">{bonus}</div>
</div></section>

<section class="alt"><div class="wrap">
  <h2>Veja por dentro antes de comprar</h2>
  <p class="lead">Nenhuma promessa de resultado: veja o material que você recebe.</p>
  <div class="provas">
{provas}
  </div>
  <!-- DEPOIMENTOS: só depois de venda real, com autorização por escrito.
       Cole aqui o bloco abaixo, trocando os textos por depoimentos verdadeiros (nome, profissão, número).
  <div class="provas">
    <div class="prova" style="padding:20px"><p>“...”</p><b>Nome, profissão</b></div>
  </div>
  -->
</div></section>

<section id="comprar"><div class="wrap">
  <h2>Quanto custa</h2>
  <p class="lead">{d['ancoragem']}</p>
  <div class="preco">
    <div class="de">de R$ 94</div>
    <div class="por">R$ 47</div>
    <div class="obs">pagamento único · PDF + EPUB + todos os bônus · acesso imediato</div>
    <a class="cta" href="{ck['principal']}" rel="nofollow">Quero começar agora</a>
    <p class="micro" style="margin-top:14px">Compra processada em ambiente seguro. Pix aprovado na hora.</p>
  </div>
  <div class="garantia">
    <div class="num">7</div>
    <div><b>dias de garantia, sem perguntas.</b><br>{d['garantia']}</div>
  </div>
  <div class="aviso"><b>Antes de comprar, leia:</b> {d['rodape_regra']} Este material não promete resultado e não substitui orientação profissional.</div>
  <!-- ORDER BUMP no checkout: {ck['bump']} -->
  <!-- UPSELL pós-compra: {ck['upsell']} -->
</div></section>

<section class="alt"><div class="wrap">
  <h2>Perguntas frequentes</h2>
{bloco_faq(d['faq'])}
</div></section>

<section><div class="wrap" style="max-width:760px">
  <h2>Uma última coisa</h2>
  <p class="lead">{d['ps']}</p>
  <a class="cta" href="{ck['principal']}" rel="nofollow" style="background:{d['cor']};color:#fff">Quero o {html.escape(d['nome'])} por R$ 47</a>
  <p class="micro" style="color:#5A6478">Acesso imediato · 7 dias de garantia · pagamento único</p>
</div></section>

<footer><div class="wrap">
  <p><b>{RAZAO}</b> · suporte: {EMAIL_SUPORTE}</p>
  <p style="margin-top:8px">{d['rodape_regra']} Nenhuma informação desta página constitui promessa de resultado, orientação jurídica, financeira, médica ou nutricional. Resultados variam conforme a aplicação e o contexto de cada pessoa.</p>
  <p style="margin-top:8px">Direito de arrependimento: 7 dias a contar da compra (Código de Defesa do Consumidor, art. 49). Política de reembolso e termos de uso disponíveis no checkout.</p>
</div></footer>

<div class="barra"><b>{d['nome']} · R$ 47</b><a href="{ck['principal']}" rel="nofollow">Comprar agora</a></div>
</body>
</html>
"""

def pagina_index():
    css = CSS % dict(cor=COMBO["cor"], acen=COMBO["acen"], luz="#EDEFF6")
    cards = []
    for slug, d in LIVROS.items():
        cards.append(f"""      <div class="passo" style="display:flex;flex-direction:column;gap:10px">
        <img src="{img_b64(d['capa']) or ''}" alt="Capa {html.escape(d['nome'])}" style="border-radius:8px;box-shadow:0 12px 26px rgba(0,0,0,.18)">
        <b>Vol. {d['n']} — {html.escape(d['nome'])}</b>
        <p>{html.escape(d['promessa'].capitalize())} · <s style="color:#98A0B2">R$ 47</s></p>
        <a class="cta" style="margin-top:auto;padding:12px 20px;font-size:15px" href="livro-{d['n']}.html">Ver o volume {d['n']}</a>
      </div>""")
    provas = "\n".join(f'      <div class="prova"><img src="{img_b64(i) or ""}" alt="Coleção Vida em Ordem"></div>' for i in COMBO["imagens"])
    return f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Coleção Vida em Ordem — 4 volumes por R$ 127</title>
<meta name="description" content="Tempo, dinheiro, comida e energia: 4 livros práticos com bônus, planilhas, scripts e áudios. R$ 127 no combo (avulso R$ 188).">
<style>{css}</style>
</head>
<body>
<header class="topo"><div class="wrap"><span>Coleção Vida em Ordem</span><span>4 volumes · R$ 127 no combo</span></div></header>
<div class="hero"><div class="wrap">
  <div>
    <span class="selo">4 livros · todos os bônus</span>
    <h1>{COMBO['titulo_html']}</h1>
    <p class="sub">{COMBO['sub']}</p>
    <a class="cta" href="{CHECKOUT['combo']['principal']}" rel="nofollow">Quero os 4 por R$ 127 <small>economia de R$ 61 · acesso imediato</small></a>
    <p class="micro">7 dias de garantia · pagamento único</p>
  </div>
  <img class="capa" src="{img_b64('mockups/kit-completo-5-hero.jpg') or ''}" alt="Os 4 volumes da coleção">
</div></div>

<section><div class="wrap">
  <h2>Quatro problemas <span>que travam a mesma vida</span></h2>
  <p class="lead">Tempo (a parte chata do trabalho), dinheiro (as dívidas), comida (o delivery caro) e energia (a rotina desalinhada). Cada volume resolve um deles, na ordem em que faz sentido.</p>
  <div class="metodo">
{chr(10).join(cards)}
  </div>
</div></section>

<section class="alt"><div class="wrap">
  <h2>O que vem no combo</h2>
  <ul class="lista">
    <li>4 livros completos (PDF + EPUB), 63 + 86 + 115 + 74 páginas</li>
    <li>Bônus de cada volume: prompts, scripts, cardápio de 30 dias, rastreador</li>
    <li>Planilhas editáveis, tabelas para imprimir e checklists</li>
    <li>3 áudios guiados do Volume 4 (respiração, soltar o dia, foco)</li>
    <li>Fontes editáveis dos 4 livros (para quem quiser adaptar)</li>
    <li>Atualizações futuras da coleção sem custo adicional</li>
  </ul>
  <div class="preco">
    <div class="de">avulso: R$ 188</div>
    <div class="por">R$ 127</div>
    <div class="obs">você economiza R$ 61 · acesso imediato a tudo</div>
    <a class="cta" href="{CHECKOUT['combo']['principal']}" rel="nofollow">Quero a coleção completa</a>
  </div>
</div></section>

<section><div class="wrap">
  <h2>Veja o que você recebe</h2>
  <div class="provas">
{provas}
  </div>
</div></section>

<section class="alt"><div class="wrap">
  <h2>Perguntas frequentes</h2>
{bloco_faq([
  ("Posso comprar um volume só?", "Pode — cada volume tem sua própria página, a R$ 47. O combo existe para quem quer os quatro com desconto."),
  ("É curso em vídeo?", "Não. São livros práticos (PDF + EPUB) com bônus em planilha, tabelas e áudios."),
  ("Serve para quem não tem tempo?", "Foi desenhado para isso: tarefas de 10 a 20 minutos por dia, com a tarefa de cada dia já definida."),
  ("E se eu não gostar?", "7 dias de garantia (CDC art. 49), com devolução de 100% do valor."),
  ("Como recebo?", "Acesso imediato por e-mail. São 90 arquivos organizados por volume em um único download."),
])}
</div></section>

<footer><div class="wrap">
  <p><b>{RAZAO}</b> · suporte: {EMAIL_SUPORTE}</p>
  <p style="margin-top:8px">Materiais educacionais. Nenhuma informação desta página constitui promessa de resultado, orientação jurídica, financeira, médica ou nutricional. Resultados variam conforme a aplicação e o contexto de cada pessoa.</p>
  <p style="margin-top:8px">Direito de arrependimento: 7 dias a contar da compra (CDC art. 49).</p>
</div></footer>
<div class="barra"><b>Coleção completa · R$ 127</b><a href="{CHECKOUT['combo']['principal']}" rel="nofollow">Comprar agora</a></div>
</body>
</html>
"""

def main():
    os.makedirs(OUT, exist_ok=True)
    paginas = {"index.html": pagina_index()}
    for i, slug in enumerate(LIVROS, start=1):
        paginas[f"livro-{i}.html"] = pagina_livro(slug)
    for nome, conteudo in paginas.items():
        with open(os.path.join(OUT, nome), "w", encoding="utf-8") as f:
            f.write(conteudo)
        print(f"  {nome:16s} {len(conteudo)/1024:7.0f} KB")
    print(f"\n{len(paginas)} páginas em {OUT}")
    print("⚠️  Trocar os links SUBSTITUIR-LINK-CHECKOUT-* e o e-mail de suporte antes de publicar.")

if __name__ == "__main__":
    main()
