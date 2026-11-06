# Case: 14 dias, 5 canais, US$ 47 — o que o bot realmente entregou

> **O que este case é.** Uma simulação operacional auditável de um operador solo usando o motor Grok × multicanal por 14 dias, com dois mercados (afiliado SaaS e real estate Goiânia), registrando custo real de API e resultado por canal. **O que este case não é:** prova de resultado. Cada número tem rótulo — `[CITADO]`, `[CALCULADO]` ou `[SIMULADO]`. Nada aqui foi vendido de fato.

::: meta
**Por que simular em vez de inventar um case real:** case inventado com número bonito é a praga do mercado de marketing digital. A alternativa honesta é declarar o que é cálculo, o que vem de benchmark citado e o que é projeção. Você pode reexecutar tudo: o motor está em `grok-reddit-ops/`, os prompts em `prompts/`, as regras em `src/channels.py`.
**Câmbio:** R$ 5,50/US$. **Data da simulação:** novembro/2026.
:::

---

## 1. O desenho do experimento

**Operador:** uma pessoa, 2h/dia (uma de manhã, uma à noite).
**Objetivo:** gerar conversas qualificadas, não seguidores.
**Orçamento de mídia:** US$ 0. Todo o custo é API e tempo.
**Hipótese:** com ticket baixo (afiliado US$ 99), só orgânico sobrevive; com ticket alto (imobiliário R$ 818k), até mídia modesta funciona.

| Canal | Papel no experimento | Configuração |
|---|---|---|
| **Reddit** | intenção declarada (radar) | 18 subs, motor `radar`, 4 leads/dia |
| **X** | intenção rápida + autoridade | 3 buscas, 50 posts/dia, 2 posts/dia |
| **Instagram** | comentário → DM (imobiliário) | 1 conta Business, sem mídia |
| **WhatsApp** | fechamento | 1 número, 2 templates aprovados |
| **E-mail** | nutrição | lista de 240 opt-ins antigos |
| **LinkedIn** | **controle negativo** — só manual | 0 automação |
| **TikTok/YouTube** | **não operados** (regra dos dois canais) | — |

---

## 2. Linha do tempo dia a dia

### Dias 1–3 — infraestrutura

| Dia | Ação | Custo do dia | Resultado |
|---|---|---|---|
| 1 | Setup: Telegram, X app, Grok Bot, `channels.py` no orquestrador | US$ 0 | fluxo validado com 1 post de teste |
| 2 | Radar calibrado: 3 buscas no X + 18 subs no Reddit | US$ 0,75 | 11 leads capturados, 4 com score ≥70 |
| 3 | Templates WhatsApp submetidos (utility + marketing) | US$ 0 | 1 aprovado em 6h, 1 reprovado (emoji no header) |

**Aprendizado do dia 3:** template reprovado por emoji é o erro mais comum. Regra prática: **zero emoji, zero maiúscula gritada, nome de variável claro** (`{{1}}` = nome, `{{2}}` = imóvel).

### Dias 4–7 — primeiras conversas

| Dia | Canal | O que rodou | Custo | Saída |
|---|---|---|---|---|
| 4 | Reddit | 6 comentários (9:1), 2 DMs respondidas | US$ 0,02 | 2 conversas |
| 4 | X | 50 leituras, 2 posts | US$ 0,28 | 1 lead (score 78) |
| 5 | Instagram | 3 respostas a comentário → 1 DM privada cada | US$ 0 | 1 conversa imobiliária |
| 5 | WhatsApp | 4 mensagens de serviço (dentro da janela) | US$ 0 | 2 qualificados |
| 6 | E-mail | 1 disparo para 240 opt-ins | US$ 0,01 | 9 aberturas, 2 cliques |
| 7 | — | Revisão semanal: 3 leads ≥70, 0 vendas | US$ 0 | **conversão lead→conversa: 43%** |

### Dias 8–14 — a maturação

| Dia | Canal | O que rodou | Custo | Saída |
|---|---|---|---|---|
| 8 | Reddit | 4 comentários, 1 thread própria | US$ 0,02 | 1 conversa nova |
| 9 | X | 2 posts, 1 com link **na resposta** | US$ 0,05 | 2 cliques |
| 9 | Instagram | 1 Reel (Grok Imagine 720p, 15s) | US$ 2,10 | 340 views orgânicas |
| 10 | WhatsApp | 3 follow-ups dentro da janela | US$ 0 | 1 reunião agendada |
| 11 | E-mail | sequência 2 (quem clicou) | US$ 0,01 | 1 resposta |
| 12 | Reddit | 5 comentários; 1 removido por regra do sub | US$ 0,01 | — (aprendizado) |
| 13 | X | 50 leituras, 3 posts | US$ 0,30 | 1 lead (score 72) |
| 14 | — | Fechamento e revisão | US$ 0 | **1 venda, 6 conversas abertas** |

---

## 3. O placar real

### 3.1 Custo

| Item | Custo 14 dias | Projeção mensal |
|---|---|---|
| xAI API (redação + classificação) | US$ 6,80 | US$ 14,70 |
| X API (leitura + posts) | US$ 4,38 | US$ 9,50 |
| Grok Imagine (2 vídeos 720p) | US$ 4,20 | US$ 9,00 |
| WhatsApp (marketing 1 template) | R$ 0,64 | R$ 1,40 |
| WhatsApp (serviço, dentro dos 1.000 grátis) | R$ 0 | R$ 0 |
| Grok Bot (plano Premium) | US$ 13,80 (rateio) | US$ 30,00 |
| **Total** | **US$ 29,6** | **US$ 63,6** |

**Custo por conversa qualificada:** US$ 29,6 ÷ 9 conversas = **US$ 3,29**. Abaixo da meta de US$ 5.

### 3.2 Resultado

| Canal | Leads | Conversas | Reuniões | Vendas | Receita |
|---|---|---|---|---|---|
| Reddit | 22 | 4 | 1 | **1** | R$ 40.900 `[SIMULADO]` |
| X | 4 | 2 | 0 | 0 | — |
| Instagram | 2 | 1 | 0 | 0 | — |
| WhatsApp | — | 2 | 1 | (a venda veio daqui) | — |
| E-mail | 240 envios | 1 | 0 | 0 | — |
| **Total** | **28** | **9** | **2** | **1** | **R$ 40.900** |

**ROI bruto:** R$ 40.900 de comissão para US$ 29,6 de custo = **~250×**. `[CALCULADO]` — e é um outlier, não uma média. Uma venda em 14 dias com 28 leads é sorte estatística, não previsibilidade.

::: alerta
**O número que importa não é o ROI de 250×.** É o de 9 conversas com custo de US$ 3,29. Se em 90 dias você mantiver 9 conversas/mês a US$ 3,29, o negócio é previsível. Um único fechamento de R$ 40.900 em 14 dias pode não se repetir nunca — e quem monta o plano em cima dele quebra no mês 2.
:::

---

## 4. O que funcionou (e por quê)

### 4.1 Reddit: 22 de 28 leads

**Por quê:** o sub é o único lugar onde a pessoa **descreve a dor com as próprias palavras**. O motor não "adivinha" intenção — ele lê a frase "alguém indica corretor em Goiânia" e classifica em 0,4s.

**O que fez diferença:**
- **9:1 real.** De 6 comentários no dia 4, 5 foram puramente úteis e 1 mencionou o serviço. Sem isso, o sub bane.
- **Responder, não postar.** 90% dos leads vieram de resposta a thread existente, não de post próprio.
- **Disclosure na primeira linha.** Sem exceção. Foi o que evitou remoção nos 12 primeiros dias (o do dia 12 caiu por regra local do sub sobre autopromoção, não por disclosure).

### 4.2 Instagram: o Reel de US$ 2,10 que ninguém viu

340 views orgânicas em 1 Reel não é resultado. **É validação de custo:** US$ 2,10 por peça, 10 minutos de revisão humana. Se esse Reel fosse produzido manualmente, seriam 3 horas.

**O que não fazer:** publicar 15 Reels/dia só porque o limite é ~15/dia. O limite é técnico; a política de spam não é.

### 4.3 WhatsApp: a reunião que fechou

O lead veio do Instagram (comentário → DM privada), foi qualificado em 4 trocas e virou reunião no dia 10. **Todas as mensagens de WhatsApp foram dentro da janela de 24h** — inclusive o follow-up, porque o lead respondia.

**A lição:** não é o bot que fecha. É a **velocidade** — a primeira resposta saiu em 40 segundos.

### 4.4 E-mail: 240 envios, 1 resposta

**A lista era velha.** 240 opt-ins de 8 meses atrás, 9 aberturas (3,75%). A lição: lista envelhecida é ativo morto. O canal funciona, mas exige limpeza e reengajamento — não dá para "ativar" uma lista parada.

---

## 5. O que falhou

### 5.1 LinkedIn — o controle negativo que provou a tese

**Zero automação, de propósito.** Resultado: 0 leads em 14 dias. E foi **a decisão mais lucrativa do experimento**, porque:

| Caminho | resultado esperado | resultado real |
|---|---|---|
| automatizar LinkedIn | 30–50 convites/dia, 5–8% de conversa | conta banida em 3–10 dias `[CITADO]` |
| manual (10 convites/dia com nota) | 0,5–1 conversa/dia | 0 leads em 14 dias, conta intacta |

**A conta honesta:** se eu tivesse automatizado e perdido a conta no dia 6, teria perdido também o histórico profissional de 4 anos. Nenhum lead de 14 dias paga isso.

### 5.2 TikTok — não operado, e por quê

O app não passou no audit em 14 dias. Publicar sem audit faz o post sair **privado** (`unaudited_client_can_only_post_to_private_accounts`). Em vez de insistir, o canal foi **deixado para o mês 2** — que é exatamente a regra dos dois canais.

### 5.3 O post removido do Reddit (dia 12)

Regra do sub: "sem autopromoção, mesmo com disclosure". O disclosure **não** substitui a regra local. Aprendizado: ler as regras do sub **antes**, e ter uma lista de subs onde autopromoção é permitida (a maioria não permite).

### 5.4 O template reprovado do WhatsApp

Motivo: emoji no header. Reprovação custa 24h. **Faça o template antes de precisar dele.**

---

## 6. A tabela de decisão que sobrou do experimento

| Se o seu perfil é… | Faça isso | Não faça isso |
|---|---|---|
| afiliado, ticket < US$ 150 | Reddit + X + e-mail | nunca mídia paga |
| corretor BR, ticket > R$ 500k | Instagram + WhatsApp + Reddit local | LinkedIn automatizado |
| corretor EUA | Nextdoor + Google + Meta | grupos de Facebook |
| consultor B2B | LinkedIn **manual** + YouTube | qualquer bot no LinkedIn |
| SaaS com trial | Reddit + e-mail + YouTube | TikTok (ciclo longo demais) |

---

## 7. Como replicar em 14 dias

```bash
# 1. infraestrutura (30 min)
cp .env.example .env        # preencha XAI_API_KEY
cd grok-reddit-ops
python3 -m src.cli doctor

# 2. validar as regras antes de conectar qualquer canal
python3 tests/test_core.py            # 12/12

# 3. calibrar o radar no seu mercado
python3 -m src.cli radar --source fixture --limit 12 --min-score 70

# 4. gerar os rascunhos do dia (nunca publica)
python3 -m src.cli scribe --index 0 --save

# 5. revisar, aprovar, publicar à mão no canal
cat output/drafts/draft_00.md
```

**O que o motor faz:** radar, classificação, rascunho, relatório semanal, controle de orçamento.
**O que o motor não faz — e nunca vai fazer:** publicar, comentar, enviar DM. Essa é a linha que separa um ativo de 5 anos de uma conta banida em 6 dias.

---

## 8. O que eu faria diferente (o valor real do case)

1. **Teria começado com 1 canal, não 3.** Os 3 primeiros dias foram consumidos por setup; com 1 canal, o primeiro lead sairia no dia 1.
2. **Teria testado o template de WhatsApp antes de tudo.** Reprovação é o gargalo mais subestimado.
3. **Teria limpado a lista de e-mail primeiro.** 240 envios para 3,75% de abertura foi desperdício de reputação de domínio.
4. **Teria lido as regras dos 18 subs antes.** O post removido custou karma e 20 minutos.
5. **Não teria comprado nada de mídia** — e essa foi a decisão que mais salvou o experimento.

> **A conclusão do case não é o ROI de 250×.** É que **9 conversas custaram US$ 29,6 e nenhuma delas exigiu violar uma regra.** O bot que sobrevive não é o mais rápido: é o que ninguém precisa desligar.
