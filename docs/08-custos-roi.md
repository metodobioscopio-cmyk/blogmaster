# Custos, CPL e ROI — a matemática de cada canal

> **Pergunta deste documento.** Quanto custa operar o bot em cada canal, quanto custa o lead que ele traz, e em quanto tempo o dinheiro volta? **Resposta curta: o custo do bot é US$ 95–175/mês; o custo do lead varia de US$ 0 (orgânico disciplinado) a US$ 300 (LinkedIn qualificado); e o único canal que se paga no primeiro mês é o orgânico com intenção declarada.**

::: meta
**Regra de leitura:** nenhum número aqui é "o CPL do canal". CPL é resultado de oferta × criativo × qualificação. Os valores abaixo são **faixas de benchmark 2026** para dimensionar decisão, não promessa de resultado.
**Moeda:** US$ por padrão; valores em R$ marcados. Câmbio de referência usado: R$ 5,50/US$.
:::

---

## 1. O custo de operar o bot (o denominador que quase ninguém calcula)

Antes de comparar CPL, você precisa saber quanto custa **rodar** a máquina:

| Item | Faixa mensal | Tipo | Observação |
|---|---|---|---|
| xAI API (redação + classificação) | US$ 15–25 | variável | ~US$ 2,34/1.000 threads (Estudo 1) |
| X API (radar + posts) | US$ 20–35 | variável | US$ 0,005/leitura; US$ 0,20/post com link |
| Grok Bot (plano Premium) | US$ 30 | fixo | inclui créditos de X API |
| WhatsApp (1.000 marketing) | R$ 322 ≈ US$ 58 | variável | R$ 0,3217/msg |
| WhatsApp (serviço) | US$ 0–13 | variável | 1.000 grátis/mês |
| Vídeo (Grok Imagine 720p) | US$ 0–42 | variável | US$ 0,14/s; 15s = US$ 2,10 |
| Orquestrador (n8n self-host) | US$ 0 | — | ou US$ 29 em SaaS |
| **Total** | **US$ 95–175** | | |

**O que isso significa:** o piso operacional é **~US$ 100/mês**. Para um afiliado com comissão de US$ 29,70/mês por cliente (US$ 99 × 30%), o **break-even é 4 clientes ativos**. Para real estate em Goiânia com comissão de R$ 40.900 por venda, **meia venda paga 5 anos de operação**.

::: alerta
**O custo que explode silenciosamente:** postar no X **com link**. São US$ 0,20 contra US$ 0,015 — 13×. Um calendário de 3 posts com link por dia custa US$ 18/mês; o mesmo calendário sem link custa US$ 1,35. Em 12 meses, a diferença é de US$ 200 — mais que um ano de API de redação.
:::

---

## 2. CPL por canal: os números de 2026 lado a lado

### 2.1 Comparação direta (mesmo comprador: B2B SaaS e imobiliário)

| Canal | CPL baixo | CPL mediano | CPL alto | CPL qualificado | Qualidade |
|---|---|---|---|---|---|
| Reddit Ads | US$ 15 | **US$ 17–40** | US$ 120 | US$ 40–80 | alta (pesquisa ativa) |
| TikTok Ads | US$ 15 | **US$ 18–38** | US$ 60 | US$ 50–90 | média |
| Meta (imob.) | US$ 35 | **US$ 35–65** | US$ 100 | **US$ 150–300** | baixa→média |
| Meta (B2B SaaS) | US$ 50 | **US$ 50–75** | US$ 145 | US$ 120–200 | média |
| Google Search (B2B) | US$ 80 | **US$ 100** | US$ 524 | US$ 150–300 | muito alta |
| LinkedIn | US$ 68 | **US$ 95–202** | US$ 350 | US$ 250–450 | muito alta |
| E-mail (lista própria) | US$ 0,01 | **US$ 0,05** | US$ 0,50 | — | depende da lista |
| Reddit orgânico + Grok | ~US$ 0 | **US$ 0** | — | US$ 0 | máxima |
| Nextdoor (sponsorship) | — | **~US$ 100/ZIP/mês** | — | — | alta (vizinho verificado) |

### 2.2 A tabela que importa: custo por **venda**, não por lead

CPL é vaidade. O que decide orçamento é **custo por aquisição** (CPA):

| Canal | CPL | Conversão lead→venda | CPA | Ticket necessário p/ pagar |
|---|---|---|---|---|
| Reddit orgânico | US$ 0 | 2–5% | ~US$ 0 | qualquer |
| E-mail | US$ 0,05 | 2,4–4,1% | **US$ 1,20–2,10** | qualquer |
| Reddit Ads | US$ 25 | 1–3% | US$ 833–2.500 | alto |
| TikTok Ads | US$ 28 | 1–2% | US$ 1.400–2.800 | alto |
| Meta (imob.) | US$ 50 | 2–3% | US$ 1.667–2.500 | comissão > US$ 5k |
| Google Search | US$ 100 | 4–6% | US$ 1.667–2.500 | comissão > US$ 5k |
| LinkedIn | US$ 130 | 5–8% | US$ 1.625–2.600 | LTV > US$ 8k |

**A conclusão que reorganiza o orçamento:** em custo **por venda**, e-mail e Reddit orgânico empatam em primeiro lugar por motivos opostos — e-mail porque o lead é barato, Reddit porque o lead é grátis. Os canais pagos todos empatam em US$ 1.600–2.600 por venda. **Ou seja: pagar por mídia só faz sentido quando o ticket > US$ 5.000.**

::: decisao
**Regra de ouro do orçamento:** se a sua comissão por venda é **menor que US$ 1.500**, você **não pode** comprar mídia nesses canais. Sobra orgânico (Reddit, TikTok, Threads, Bluesky, YouTube) + e-mail. É exatamente o caso do afiliado de SaaS de US$ 99/mês — e é por isso que o Estudo 1 dizia "orgânico primeiro".
:::

---

## 3. Unit economics dos dois mercados (recalculado com dados de canal)

### 3.1 Afiliado / SaaS — canal orgânico

| Variável | Valor | Fonte |
|---|---|---|
| Preço do SaaS | US$ 99/mês | Estudo 1 |
| Comissão | 30% → **US$ 29,70/mês** | programa |
| Retenção média | 18 meses | premissa rotulada |
| LTV por cliente | **US$ 534** | 29,70 × 18 |
| Custo de aquisição (orgânico) | **~US$ 0** | tempo humano |
| Custo da operação/mês | US$ 100 | seção 1 |
| Clientes para break-even | **4** | 100 ÷ 29,70 |

**Com CAC ~zero e LTV US$ 534, o negócio é limitado por tempo, não por capital.** O gargalo é quantas conversas qualificadas você consegue ter por semana. É por isso que o motor prioriza **radar** (encontrar intenção) sobre **publicação** (volume).

**Se você adicionar mídia:** CPL US$ 25 (Reddit) × 2% = US$ 1.250 por cliente, contra LTV de US$ 534. **Prejuízo de US$ 716 por cliente.** Mídia paga **destrói** esse modelo. Toda a tese do Estudo 1 depende de orgânico.

### 3.2 Real estate — Goiânia (BR)

| Variável | Valor | Fonte |
|---|---|---|
| Ticket médio | R$ 818.000 | Estudo 2 |
| Comissão | 5% → **R$ 40.900** | mercado |
| Leads por venda | 50 | Estudo 2 |
| Custo de mídia por venda | R$ 2.000–6.000 | Estudo 2 |
| Custo de mídia por lead | R$ 40–120 | derivado |
| **Canal orgânico (Instagram+WhatsApp)** | **R$ 322/mês** | 1.000 msgs marketing |

**O ponto central:** com comissão de R$ 40.900 e 50 leads por venda, **cada lead vale R$ 818**. Você pode pagar até R$ 818 por lead e ainda empatar. A mídia a R$ 40–120/lead é **lucrativa por 7×**. Isto é o oposto exato do afiliado de SaaS.

> **Insight estrutural:** o mesmo bot, o mesmo stack e o mesmo custo de US$ 100/mês geram retornos de 100× diferentes conforme o ticket. **Real estate suporta mídia; SaaS de US$ 99 não.** Escolher o mercado é a decisão de maior alavancagem de todo o projeto.

### 3.3 Real estate — EUA

| Variável | Valor | Fonte |
|---|---|---|
| Preço mediano de imóvel | US$ 420.000 | premissa |
| Comissão (lado do comprador) | 2,5% → **US$ 10.500** | mercado pós-NAR settlement |
| Leads por venda | 30–60 | benchmark |
| CPL Meta | US$ 35–65 | seção 2 |
| CPL Nextdoor | ~US$ 100/ZIP/mês | sponsorships |
| **Custo por venda (Meta)** | **US$ 1.050–5.850** | 30–60 × CPL |
| **Margem por venda** | **US$ 4.650–9.450** | |

Nos EUA, o imobiliário tem a mesma matemática favorável do Brasil, com CPL maior e ticket maior. **É o mercado onde o bot tem o melhor ROI por hora de operação.**

---

## 4. ROI comparado: os quatro cenários

| Cenário | Investimento/mês | Vendas/mês (premissa) | Receita/mês | ROI |
|---|---|---|---|---|
| **A. Afiliado orgânico** | US$ 100 | 3 novos clientes | US$ 89,10 MRR | −11% no mês 1; **+934% no mês 12** (35 clientes) |
| **B. Afiliado com mídia** | US$ 1.100 | 0,8 clientes (US$ 1.250 CPA) | US$ 23,76 | **−98%** — não faça |
| **C. Imobiliário BR orgânico** | R$ 322 | 0,4 venda | R$ 16.360 | **+4.980%** |
| **D. Imobiliário BR com mídia** | R$ 6.000 | 1,5 vendas | R$ 61.350 | **+922%** |

::: alerta
**Cenário B é o erro mais comum do mercado.** Afiliado de produto de baixo ticket comprando tráfego frio. A conta nunca fecha: o CPA (US$ 1.250) é 2,3× o LTV (US$ 534). Se você vê alguém vendendo "curso de tráfego pago para afiliado de SaaS", essa é a matemática que ele não mostra.
:::

---

## 5. Payback e o ponto de virada

### 5.1 Quando o investimento volta

| Canal | Payback | Por quê |
|---|---|---|
| Reddit orgânico | **imediato** | custo marginal zero |
| E-mail | **1–2 meses** | lista própria, custo fixo baixo |
| WhatsApp | **1 venda** | R$ 322/mês vs R$ 40.900/venda |
| Instagram orgânico | **2–3 meses** | tempo de construção de audiência |
| TikTok orgânico | **3–6 meses** | algoritmo premia consistência |
| YouTube | **6–12 meses** | busca compõe devagar |
| Meta Ads | **1–3 meses** | se a oferta estiver pronta |
| Google Search | **1–2 meses** | intenção já existe |
| LinkedIn Ads | **3–6 meses** | CPL alto exige volume |

### 5.2 O ponto de virada real

O gráfico mental que você precisa ter:

```
custo
  │                     ╭──── mídia paga (linear, sobe com volume)
  │              ╭──────╯
  │      ╭───────╯
  │  ╭───╯ ← orgânico (fixo: US$100/mês)
  │──╯
  └──────────────────────────────────► volume de leads
       ↑              ↑
    break-even     ponto onde mídia
    do orgânico    passa a ser mais barata
```

**O orgânico tem custo fixo e retorno linear; a mídia tem custo linear e retorno linear.** Em volume baixo, orgânico ganha sempre. Em volume muito alto, mídia ganha — porque o orgânico satura (você não pode responder 500 threads por dia com uma pessoa).

**Ponto de saturação do orgânico com bot:** ~40–60 conversas qualificadas/mês por operador. Acima disso, ou você contrata, ou começa a pagar mídia.

---

## 6. Custos por canal, em detalhe

### 6.1 X — o mais caro por ação

| Operação | Custo unitário | Volume/mês | Custo/mês |
|---|---|---|---|
| Radar (50 posts × 3×/dia) | US$ 0,005 | 4.500 | **US$ 22,50** |
| Post sem link | US$ 0,015 | 60 | US$ 0,90 |
| Post com link | US$ 0,20 | 60 | **US$ 12,00** |
| DM | US$ 0,015 | 100 | US$ 1,50 |
| **Total realista** | | | **US$ 25–37** |

**Otimização:** radar 2×/dia em vez de 3× economiza US$ 7,50/mês. Link na resposta em vez do post economiza US$ 11,10/mês. Juntas: **−50% no custo do X** sem perder alcance.

### 6.2 WhatsApp — o mais previsível

| Tipo | Preço BR | Volume | Custo |
|---|---|---|---|
| Marketing | R$ 0,3217 | 1.000 | R$ 321,70 |
| Utility | R$ 0,035 | 500 | R$ 17,50 |
| Serviço (após 1.000 grátis) | R$ 0,035 | 2.000 | R$ 35,00 |
| **Total** | | | **R$ 374,20 ≈ US$ 68** |

**Nota:** marketing **não tem desconto por volume** no Brasil. Utility e authentication têm desconto de até 25% em tiers. Planeje o custo de marketing como linear.

### 6.3 Conteúdo em vídeo (Grok Imagine) — o custo marginal mais alto

| Formato | Duração | Resolução | Custo por peça | 30 peças/mês |
|---|---|---|---|---|
| Reel/Short | 15s | 720p | US$ 2,10 | **US$ 63** |
| Reel/Short | 15s | 1080p | US$ 3,75 | US$ 112,50 |
| Vídeo longo | 60s (4×15s) | 720p | US$ 8,40 | US$ 252 |
| Imagem de capa | — | 1K | US$ 0,02 | US$ 0,60 |

**A leitura:** gerar 30 Reels por mês com IA custa **US$ 63** — menos que 1 lead de Meta. Se você produz 30 vídeos/mês manualmente, são 40–60 horas de trabalho. **É aqui que o bot tem o maior retorno por dólar.**

### 6.4 Comparação de "custo por peça de conteúdo"

| Método | Custo por peça | Tempo humano |
|---|---|---|
| Agência de conteúdo | US$ 150–600 | 0 |
| Freelancer | US$ 50–150 | 0,5h de briefing |
| Você mesmo, sem IA | US$ 0 | 3–5h |
| Você + Grok (texto) | **US$ 0,01** | 10 min de revisão |
| Você + Grok Imagine (vídeo) | **US$ 2,10** | 10 min de revisão |

---

## 7. O que medir (e o que ignorar)

### 7.1 As sete métricas que decidem

| Métrica | Como calcular | Meta 2026 |
|---|---|---|
| **Custo por conversa qualificada** | custo total ÷ conversas ≥70 | < US$ 5 |
| **Taxa de resposta na janela de 24h** | respondidas dentro de 24h ÷ recebidas | > 90% |
| **Conversão conversa→reunião** | reuniões ÷ conversas | 20–35% |
| **Conversão reunião→venda** | vendas ÷ reuniões | 15–30% |
| **CAC** | custo total ÷ vendas | < 1/3 do LTV |
| **Payback** | CAC ÷ margem mensal | < 3 meses |
| **Custo por 1.000 impressões orgânicas** | custo ÷ (impressões/1.000) | < US$ 2 |

### 7.2 As métricas de vaidade (ignore)

| Métrica | Por que ignorar |
|---|---|
| Seguidores | não compra; 10 mil seguidores frios valem menos que 50 leads |
| Curtidas | sinal fraco de intenção |
| Alcance | sem contexto de conversão, não diz nada |
| Taxa de abertura de e-mail (não ajustada) | inflada por Apple MPP em 15–40% |
| CPL bruto | esconde a qualidade; use custo por **lead qualificado** |

::: dica
**Substitua "CPL" por "custo por conversa qualificada" em todos os seus relatórios.** É a única métrica que não pode ser inflada por lead ruim. Um CPL de US$ 5 com 2% de qualificação custa US$ 250 por conversa; um CPL de US$ 50 com 40% de qualificação custa US$ 125. O segundo parece pior e é 2× melhor.
:::

---

## 8. Cenário de 12 meses (o plano financeiro)

Operador solo, afiliado SaaS + real estate BR, começando do zero:

| Mês | Custo acumulado | Clientes afiliado | Vendas imob. | Receita acumulada | Saldo |
|---|---|---|---|---|---|
| 1 | US$ 100 | 1 | 0 | US$ 29,70 | −US$ 70 |
| 3 | US$ 300 | 5 | 0 | US$ 445 | +US$ 145 |
| 6 | US$ 600 | 15 | 1 (R$ 40.900) | US$ 7.900 | **+US$ 7.300** |
| 9 | US$ 900 | 25 | 2 | US$ 16.340 | +US$ 15.440 |
| 12 | US$ 1.200 | 35 | 3 | US$ 25.200 | **+US$ 24.000** |

*Premissas: 3 clientes novos/mês a partir do mês 2 (churn 3%); 1 venda imobiliária a cada 4 meses; câmbio R$ 5,50. **Simulação, não previsão.***

**O ponto de virada está no mês 2–3.** Antes disso, o projeto é investimento; depois, é caixa. Quem desiste no mês 2 desiste exatamente no ponto de inflexão.

---

## 9. Cinco números para levar para a reunião

1. **US$ 95–175/mês** — custo total de operar o stack multicanal.
2. **US$ 0,01 vs US$ 2,10** — custo de uma peça de conteúdo em texto vs vídeo gerado.
3. **US$ 1.600–2.600** — custo por venda em qualquer canal pago. Só compensa com ticket > US$ 5.000.
4. **R$ 818** — valor de um único lead imobiliário em Goiânia (comissão ÷ 50 leads).
5. **7×** — quanto a mídia imobiliária é lucrativa (R$ 818 de valor vs R$ 40–120 de custo por lead), contra **0,4×** do afiliado de SaaS (LTV US$ 534 vs CPA US$ 1.250).

> **A tese financeira do dossiê:** o bot é caro por ação e barato por resultado. Ele só faz sentido onde o ticket justifica — e onde a operação é orgânica, disciplinada e medida por conversa qualificada, não por CPL.
