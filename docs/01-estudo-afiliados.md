# ESTUDO 1 — Afiliados: como o Reddit + Grok produzem venda real

> **Pergunta deste estudo.** Dá para vender como afiliado usando Reddit como canal principal, com um bot Grok fazendo o trabalho pesado, sem tomar ban e sem depender de sorte? **Resposta curta: sim, mas não no modelo que 95% das pessoas tentam.** Este documento entrega a matemática, as rotas, os roteiros e o ponto exato onde o dinheiro aparece.

::: meta
**Mercados cobertos:** EUA (onde o Reddit converte e o dinheiro é em dólar) e Brasil (onde você opera). **Período de dados:** 2025–2026. **Público-alvo:** operador solo ou dupla, capital de até US$ 500, 1–2 h/dia.
:::

---

## 1. O tamanho do jogo e por que o afiliado mediano perde

| Indicador | Valor 2026 | Fonte |
|---|---|---|
| Mercado global de afiliados | ~US$ 20 bi | estimativas de mercado 2026 |
| Comissão média (SaaS) | **24,16%** | Rewardful, 2026 |
| Pagamento médio por comissão | **US$ 14,10** | Rewardful, 2026 |
| Conversão referral→venda (rede) | **0,8%** | Rewardful, 2026 |
| Afiliados que geram ≥1 venda | **1,28%** | Rewardful, 2026 |
| Conversão média e-commerce afiliado | 1–3% (forte: >3–5%) | benchmarks 2026 |
| EPC médio (agregado) | US$ 0,45–1,50 | benchmarks 2026 |
| EPC em SaaS | US$ 1,20–3,50 (forte >US$ 2) | StackedReview 2026 |
| Ticket médio de programa | US$ 111–130 | Rewardful, 2026 |

**A leitura fria:** 98,7% dos afiliados não vendem nada. Não é falta de inteligência: é que a maioria escolhe tráfego que nunca teve intenção. Cupom, listicle genérico e "melhores ferramentas de 2026" competem com mil sites idênticos e com o próprio Google resumindo a resposta.

**Onde a intenção existe de verdade:**
- **Reddit:** gente escrevendo "estou procurando X, alguém usa?" — intenção explícita, em texto, datada.
- **X:** gente reclamando em tempo real de uma ferramenta e perguntando alternativa.
- **Buscas longtail de comparação:** "X vs Y reddit" — o comprador está pedindo opinião de humano.

O Reddit é o único dos três onde a resposta fica **indexada para sempre** e é **citada por IA**. É por isso que este estudo usa Reddit como base e X como acelerador.

---

## 2. Segmentação: onde o dinheiro está em 2026

### 2.1 Por vertical (EUA / global)

| Vertical | Comissão típica | EPC forte | Ciclo de decisão | Adequação ao Reddit |
|---|---|---|---|---|
| **SaaS B2B** (CRM, SEO, automação) | 20–40% recorrente, até 50% | US$ 1,50–3,50 | 2–8 semanas | **Altíssima** — subs técnicos com threads de comparação |
| **Finanças/seguros** (CPA) | US$ 75–300 por conversão | US$ 1,00–2,80 | dias | Média — moderação hostil, exige compliance |
| **Hospedagem/dev tools** | US$ 50–450 fixo | US$ 1,00+ | dias | Alta — público dev, intolerante a marketing |
| **Educação/cursos** | 20–50% | alto em lançamento | dias–semanas | Média — r/JustStart e r/Entrepreneur toleram story |
| **E-commerce físico** | 5–15% | US$ 0,15–0,65 | horas | Baixa — Reddit odeia link de loja |
| **Alto ticket digital** (mentoria, B2B info) | 30–60% | variável | 1–4 semanas | Baixa — cheiro de golpe, modera agressivo |

### 2.2 A escolha recomendada (e por quê)

::: decisao
**Foco primário: SaaS B2B / ferramentas de IA com comissão recorrente.**
Motivos: (1) comissão recorrente transforma 1 cliente em fluxo de caixa; (2) o comprador B2B pesquisa em Reddit antes de assinar; (3) ticket alto dilui o custo de aquisição; (4) você pode responder sem link, porque a ferramenta é *nomeável*; (5) LTV permite pagar mídia depois.
**Foco secundário: hospedagem/dev tools** (comissão fixa alta, decisão rápida) como "primeiro dólar" para validar o fluxo.
**Evitar no começo:** e-commerce físico (comissão baixa + hostilidade), finanças/seguro (compliance pesado), info-produto de alto ticket (risco reputacional).
:::

### 2.3 Matemática de uma comissão recorrente (por que muda tudo)

Ferramenta a US$ 99/mês, comissão 30%, retenção média 18 meses:

```
1 cliente = 99 × 0,30 × 18 = US$ 534,60 de LTV de comissão
10 clientes = US$ 5.346
100 clientes = US$ 53.460 (fluxo, não pico)
```

Compare com e-commerce: AOV US$ 80, comissão 8% = **US$ 6,40 por venda**, uma vez. É preciso 84 vendas para igualar **um** cliente SaaS. Isso define onde colocar o esforço.

---

## 3. Unit economics: a planilha que decide se você continua

### 3.1 Funil canônico do afiliado via Reddit

```
Thread com intenção (1.000 lidas)
        │  3–8% clicam no perfil / link no perfil
        ▼
Visita ao destino (50)
        │  18–28% clicam para o merchant (review page → merchant)
        ▼
Clique no merchant (12)
        │  2–5% iniciam trial (SaaS)
        ▼
Trial (0,4)
        │  20–45% viram pagantes
        ▼
Pagante (0,12)  ← a cada ~8 threads boas, 1 cliente
```

Com LTV de comissão de US$ 534, o **valor por thread respondida** é ~US$ 67 — mas só se a thread tiver intenção real. Uma thread sem intenção vale US$ 0 independentemente da qualidade da resposta. **É por isso que o scoring é a camada que gera dinheiro, não a redação.**

### 3.2 Cenário base (operador solo, 90 dias)

| Variável | Valor | Observação |
|---|---|---|
| Threads monitoradas/semana | 200 | 3–5 subs |
| Threads com intenção real/semana | 18 (9%) | filtro do Scout |
| Respostas publicadas/semana | 12 | humano revisa e publica |
| Cliques no perfil/semana | 40 | 8% das leituras das respostas |
| Trials/semana | 1,5 | |
| Pagantes/mês | 2–4 | conservador |
| Comissão mensal acumulada ao mês 3 | US$ 300–700 | recorrente |
| Custo API/mês | US$ 18 | |
| Custo Reddit Ads (opcional) | US$ 0–420 | só após validar orgânico |

::: sim
**Projeção de 12 meses (rotulada como projeção, não promessa).** Mantendo 4 pagantes novos/mês, churn de 3% e ticket de US$ 99 a 30%, a base chega a **~35 clientes ativos no mês 12 → US$ 1.046/mês recorrentes** de comissão. Se dobrar o volume de subs e adicionar um segundo programa, chega perto de **US$ 2.000/mês**. Isto é um negócio de R$ 5–11 mil/mês, não de R$ 100 mil. Quem promete mais está vendendo curso.
:::

### 3.3 Quando o anúncio passa a fazer sentido

| Situação | Orgânico basta? | Anúncio? |
|---|---|---|
| < 50 respostas publicadas | Sim | **Não** — você ainda não sabe o que converte |
| Já tem 1 oferta validada e 5+ vendas | Sim, mas teto baixo | **Sim**, US$ 30–50/dia em Conversation Ads |
| Quer rodar em sub que proíbe link orgânico | — | **Sim** — anúncio é a via legítima de pagar pelo espaço |
| CAC orgânico < 30% do LTV | Sim | Escalar com cuidado |

Benchmarks de Reddit Ads 2026 para calibrar: CPC US$ 0,50–4,00 (mediana US$ 1,25–1,85), CPM US$ 3–15 (mediana ~US$ 6,50), mínimo US$ 5/dia, teste real US$ 500–1.500. **Não existe teste válido com US$ 5/dia.**

---

## 4. As rotas do Reddit — todas as formas de vender (mapa completo)

Cada rota tem: como funciona, janela de risco, esforço, retorno esperado e se serve para afiliado ou imobiliária.

### Rota 1 — Comentário de alta intenção ("resposta-âncora")

**Como funciona.** Você monitora threads com pergunta explícita de compra ("looking for a tool that does X", "is Y worth it?", "alternatives to Z?"). Responde com valor real — critérios, prós/contras, armadilhas — e **menciona a ferramenta em uma frase, com disclosure**, sem link (ou com link só se a regra do sub permitir).

**Regra de ouro.** A resposta precisa ser útil **mesmo se a pessoa nunca clicar em nada**. Se você remover sua menção e a resposta ficar inútil, é anúncio disfarçado e vai ser removido.

**Risco:** baixo/médio · **Esforço:** 20 min/dia · **Retorno:** o mais alto e o mais consistente · **Serve:** afiliado e imobiliária.

Exemplo de estrutura (não copie literalmente; adapte ao seu caso):

> Contexto: já usei as três. O que muda de verdade entre elas é [critério 1] e [critério 2] — o resto é cosmético.
> - Se seu caso é [A], vai de [X] porque [razão concreta].
> - Se é [B], [Y] resolve melhor, mas cobra por [limitação].
> - [Z] é a que eu uso hoje; **sou afiliado dela, então peso isso na leitura** — o motivo real é [razão técnica].
> Teste gratuito resolve em um dia: pegue as duas e rode a mesma tarefa.

**Por que funciona:** entrega o critério de decisão, admite o interesse, e deixa a escolha com a pessoa.

---

### Rota 2 — Post de caso com números ("o post que vira citação")

**Como funciona.** Um post longo (1.200–2.000 palavras) contando um resultado com números verificáveis: custo, tempo, erro, o que faria diferente. Título específico, não genérico.

Formatos que sobrevivem em 2026: `"Como reduzi X de A para B em N dias (planilha e números dentro)"`, `"Analisei 40 threads sobre [tema] — o que os dados dizem"`, `"Gastei US$ 300 testando [categoria]: os 3 critérios que importam"`.

**Risco:** médio (moderador lê o post inteiro) · **Esforço:** 4–6 h por post · **Retorno:** alto e duradouro (indexa, é citado por IA, gera DM) · **Serve:** ambos. É a rota com **maior efeito GEO**: 44,2% das citações de LLM vêm do primeiro 30% do texto.

**Regra:** números reais. Um post com números inventados é destruído nos comentários em 2 horas — e o Reddit tem memória.

---

### Rota 3 — Educar sem citar produto ("pré-venda por autoridade")

**Como funciona.** Você responde 20–30 threads com puro valor, sem mencionar nada. Perfil tem bio e link. A pessoa curiosa clica. É o modelo 9:1 puro.

**Risco:** baixíssimo · **Esforço:** 15 min/dia · **Retorno:** médio, lento (60–90 dias para compor) · **Serve:** ambos, e é **obrigatório como base** para as outras rotas funcionarem.

**Por que é base e não opção:** mods checam histórico antes de aprovar qualquer post promocional. Sem histórico, seu post bom morre na fila.

---

### Rota 4 — Thread própria em sub permissivo (r/SideProject, r/roastmystartup, weekly threads)

**Como funciona.** Subs e threads designadas para divulgação ("Share Your SaaS", "Feedback Friday", "Self-Promo Saturday"). É o **único lugar onde link é bem-vindo** — e lá a concorrência é alta, então a oferta precisa ser específica.

**Risco:** baixo · **Esforço:** 30 min/semana · **Retorno:** baixo/médio, mas é onde você testa copy sem queimar conta · **Serve:** afiliado (produto próprio) e prestador de serviço.

---

### Rota 5 — Perfil como funil (a rota mais subestimada)

**Como funciona.** O `u/seunome` é público, indexável e aceita bio + links + posts de perfil. Quem lê um comentário bom clica no nome. O perfil vira uma landing page sem violar regra de sub nenhuma.

**O que colocar:** 1 linha de quem você é + prova concreta + 1 link (hub com suas reviews/roteiros) + 3 posts de perfil com o melhor conteúdo. Nada de "DM me".

**Risco:** zero · **Esforço:** 2 h uma vez · **Retorno:** multiplica todas as outras rotas · **Serve:** ambos.

---

### Rota 6 — DM consentida (só após convite público)

**Como funciona.** A pessoa escreve "me manda?" / "DM me" no comentário. Aí sim você manda uma mensagem curta, pessoal, com o que ela pediu. Nunca antes disso.

Dados de campo: em um caso documentado de 2026, **26 DMs frios → 13 cadastros (50%)**, mas com abordagem personalizada e thread recente (<48 h). Em massa, a taxa cai para <20% e a conta é denunciada.

**Risco:** alto se não solicitado · **Esforço:** baixo · **Retorno:** alto por conversa · **Regra:** **só sob convite**.

---

### Rota 7 — Reddit Ads (a via legítima de comprar atenção)

**Como funciona.** Promoted Posts, Conversation Ads (dentro da thread, a mais nativa), Lead Gen Ads, Product Ads, Max Campaigns (beta, US$ 20/dia), AMA Ads.

| Formato | CPC típico | CTR | Melhor uso |
|---|---|---|---|
| Promoted Post imagem | US$ 0,75–2,00 | 1,5–3,0% | Oferta clara, topo de funil |
| **Conversation Ad** | US$ 0,75–2,50 | **2,0–4,0%** | Meio de funil, alta intenção |
| Carrossel | US$ 0,80–2,50 | 1,0–2,0% | Comparação, prova |
| Free-form (texto longo) | US$ 0,50–2,00 | 1,0–2,5% | Storytelling, público técnico |
| Lead Gen Ad (form nativo) | CPL US$ 15–120 | — | Captura sem sair do Reddit |

**Risco:** nenhum de ban · **Esforço:** setup 3 h · **Retorno:** previsível e escalável · **Serve:** ambos — no imobiliário, é a rota de maior volume.

---

### Rota 8 — AMA / Q&A com especialista

**Como funciona.** AMA (Ask Me Anything) em sub relevante, com credencial real. Não é palco de venda: é prova de competência. O retorno vem nos DMs e nas citações posteriores.
**Risco:** médio (AMA ruim é pior que não fazer) · **Esforço:** 6 h + 3 h ao vivo · **Retorno:** picos de autoridade · **Serve:** imobiliária (corretor especialista em bairro) e afiliado (operador com números reais).

---

### Rota 9 — Subreddit próprio (só com tração)

**Como funciona.** Criar comunidade de nicho geográfico (ex.: `r/GoianiaImoveis`). Você é mod, define regras, gera pauta.
**Risco:** alto de parecer "seeded community" (a Reddit derrubou 4 comunidades de teste de uma empresa em 2026 por conteúdo semeado) · **Esforço:** alto e contínuo · **Retorno:** altíssimo se pegar · **Veredito:** **não faça antes de 6 meses de reputação real.** Sem massa crítica, é um cemitério.

---

### Rota 10 — Parceria com criador do próprio sub (co-marketing)

**Como funciona.** Achar quem já tem audiência no sub (post recorrente, comentário com centenas de upvotes) e propor: ele publica a análise, você dá os dados/oferta. Pagamento por resultado, não por post.
**Risco:** baixo · **Esforço:** médio · **Retorno:** rápido · **Serve:** ambos. É a rota mais ignorada e uma das mais eficientes.

---

### Rota 11 — Conteúdo para IA citar (GEO legítimo)

**Como funciona.** Escrever respostas e posts com estrutura que LLMs extraem: resposta direta nos primeiros 30%, dados com fonte, listas comparativas, linguagem definida. O Reddit é 2º maior fonte de citações em AI Overviews (18,5%).

**Dado que justifica:** tráfego indicado por IA converte ~4,4× melhor que orgânico; ChatGPT 15,9%, Perplexity 10,5% de conversão contra 1,76% do orgânico tradicional.
**Risco:** zero (é só conteúdo bom) · **Esforço:** embutido nas rotas 1–2 · **Retorno:** composto, crescente · **Serve:** ambos.

::: alerta
**A linha vermelha do GEO.** Existe uma prática de plantar 13 palavras em comentário para virar recomendação de IA. É eficaz, é trivial e é **exatamente o que a Reddit está caçando**: 23 milhões de views de spam bloqueadas/dia, 2 milhões de votos inautênticos revogados/dia, e política `[App]` desde mar/2026. O ganho dura semanas; o ban é permanente e o ativo (conta com histórico) é insubstituível. **Não faça.**
:::

---

## 5. Mapa de subreddits: onde jogar cada rota

| Subreddit | Tamanho | Tolerância a promo | Melhor rota | O que postar | Frequência segura |
|---|---|---|---|---|---|
| r/AffiliateMarketing | ~285K | **Baixa** (10%, sem link/ref) | 1, 3, 4 | Comparativo de programas, erro de iniciante | 1 post/60 dias + comentários |
| r/JustStart | ~179K | **Média** | 2, 4 | "Como fiz X" com números, build in public | 1 post/mês |
| r/SEO | ~498K | **Muito baixa** | 1, 3 | Dado técnico, teste | comentários apenas |
| r/SaaS | ~380K | Média/baixa | 2, 4 | Teardown, pricing, churn | 1 post/60 dias |
| r/Entrepreneur | ~3M | Baixa | 2, 3 | Lição com número | raro |
| r/SideProject | grande | **Alta** | 4 | Lançamento, demo | semanal |
| r/marketing | grande | Baixa | 1, 3 | Tática replicável | comentários |
| r/smallbusiness | grande | Baixa | 1, 3 | Ferramenta que resolve dor específica | comentários |
| r/digitalnomad / r/freelance | médio | Média | 1, 3 | Operação remota, ferramenta | comentários |
| r/DataHoarder, r/devops, r/sysadmin | médio/grande | **Muito baixa** | 1, 3 | Solução técnica real | comentários |

**Regras de ouro (verificadas em nov/2026):** 34% dos subs que fundadores usam **proíbem** autopromoção; 23% permitem só sob 9:1; 2% acolhem. Muitos exigem 100+ karma e 30 dias de conta. r/SaaS e r/startups endureceram em 2026 (categoria banida, 1 post/60 dias).

::: nota
**Brasil:** r/empreendedorismo (~185K), r/brasilcoders (~92K), r/investimentos (~320K), r/StartupsBrasil (~67K), r/Contabilidade, r/PequenoNegocio, r/MEI. Reddit BR tem ~20–24 milhões de usuários/mês (estimativas divergem: 19,9M em DataReportal, 22,5M em outras fontes) e cresceu ~27–60% em 2 anos. Menor volume, **muito menos concorrência** e zero conteúdo bom de afiliado em português. Para afiliado que vende SaaS global, o sub em inglês ainda é o mercado principal; o BR serve para authority e para produto local.
:::

---

## 6. Tom e formato: o que o Reddit aceita em 2026

**O que ganha upvote:** primeira pessoa, número específico, admissão de erro, lista curta, pergunta no fim, "editei para adicionar" (sinal de honestidade), planilha/print.

**O que é destruído:** título em CAIXA ALTA, emoji em excesso, "Game changer", "DM me", link no primeiro parágrafo, contador de dinheiro, promessa de retorno, texto que parece press release, resposta que não endereça a pergunta feita.

**Comprimento:** comentário útil 120–250 palavras; post de caso 1.200–2.000 palavras; acima de 2.000 palavras, publique como post de perfil e linke.

**Disclosure afiliado (EUA, FTC 16 CFR 255):** precisa ser **clara e conspícua**, antes do link, na mesma tela, linguagem simples: *"I earn a commission if you sign up through my link."* Enterrar no rodapé, usar "partner"/"sponsor" vago, ou hashtag perdida não vale. Desde jul/2026 a regra cobre explicitamente **conteúdo gerado por IA** e responsabiliza solidariamente quem recruta tráfego.

**Disclosure Brasil (CONAR, vigente 01/06/2026):** link de afiliado e cupom **são publicidade**. Exige identificação ostensiva em primeiro plano (`#publi`/`#publicidade` ou selo da plataforma), sem clique em "mais". Anunciante e agência também respondem. A Lei 15.325/2026 reforça o dever de sinalizar.

---

## 7. O papel do Grok no funil de afiliado (tarefa por tarefa)

| Etapa | O que o humano faz | O que o Grok faz | Prompt |
|---|---|---|---|
| Escolher nicho | Decide com base em LTV e acesso | Mapeia 20 programas, comissão, cookie, EPC e reputação | `P1-nicho.md` |
| Achar subs | Valida regra no sidebar | Lista subs por intenção e tolerância, com riscos | `P2-subs.md` |
| Monitorar | — | Radar diário de threads + score 0–100 | `P3-radar.md` |
| Qualificar | Aprova/descarta em 15 s | Gera lead card JSON com motivo, oferta, ângulo | `P4-leadcard.md` |
| Redigir | Reescreve na própria voz | Rascunho no tom do sub + disclosure + checagem de regra | `P5-scribe.md` |
| Publicar | **Humano publica** | — | — |
| Medir | Lê o painel semanal | Consolida cliques, trials, receita, EPC por sub | `P6-atribuicao.md` |
| Escalar | Decide mídia | Calcula CAC/LTV e ponto de equilíbrio do anúncio | `P7-midia.md` |

**Divisão de trabalho que funciona:** o Grok produz **80% do texto, 100% do rastreamento e 0% da decisão**. O humano produz **100% do julgamento e da assinatura**.

---

## 8. CASE — trilha completa, com números e fontes separadas

### 8.1 Casos reais publicados (com fonte)

| Caso | O que fizeram | Resultado declarado | Como ler com ceticismo |
|---|---|---|---|
| **Marca de cozinha DTC** | 1º AMA em sub de culinária, + follow-ups | **US$ 52 mil** em 6 meses, CAC de US$ 45 → US$ 11, AOV 34% maior | Números de agência; AMA bem-sucedido exige produto com fãs |
| **SaaS B2B de analytics** | 87 posts/comentários, 4 subs, 90 dias, US$ 4,2 mil de teste | 47.128 sessões, **312 MQLs**, 41 clientes, CAC US$ 89 vs US$ 237 no Google | O mais crível: tem meta, orçamento, atribuição por UTM |
| **Firm de cibersegurança** | Thread semanal de ameaças | +340% de leads qualificados, CPL US$ 180 → 22, 2 deals de US$ 120k ARR | Lead B2B de nicho; ciclo longo, difícil atribuir |
| **Newsletter de finanças** | Posts mensais com dado próprio | 200 → 5.100 assinantes em 5 meses, abertura 52% | Verificável por terceiros (Substack) |
| **App de meditação** | Post viral em r/apps | 11 mil instalações em 72 h, CPI US$ 0 vs US$ 3,50 | Pico irrepetível; 50–80/mês residual 8 meses depois |
| **Agente imobiliário (Chicago)** | 18 meses em r/FirstTimeHomeBuyer + sub local | **43 transações, US$ 14 mi** de volume | Case de fornecedor de leads; volume plausível para 18 meses |
| **Narrative Nooks (EdTech)** | Monitor + comentário em thread de alta intenção | 139 leads, US$ 980 em 30 dias, 30 clientes | Ticket baixo; mostra o valor da velocidade de resposta |

**Padrão comum aos que funcionaram:** (1) um sub principal, não dez; (2) cadência de meses, não semanas; (3) alguém respondendo em horas, não dias; (4) oferta que a comunidade já pedia.

### 8.2 Simulação financeira do operador solo (transparente)

::: sim
**Rótulo: SIMULAÇÃO.** Não é resultado obtido. Premissas explícitas, todas conservadoras e ajustáveis na planilha `data/unit-economics.csv`.

| Mês | Respostas publicadas | Cliques perfil | Trials | Pagantes novos | Base ativa | Comissão US$ |
|---|---|---|---|---|---|---|
| 1 | 20 | 45 | 2 | 0 | 0 | 0 |
| 2 | 45 | 110 | 5 | 1 | 1 | 30 |
| 3 | 50 | 140 | 7 | 3 | 4 | 118 |
| 4 | 50 | 150 | 8 | 3 | 7 | 203 |
| 5 | 50 | 155 | 8 | 4 | 11 | 316 |
| 6 | 50 | 160 | 9 | 4 | 14 | 425 |
| 9 | 50 | 165 | 9 | 4 | 25 | 734 |
| 12 | 55 | 180 | 10 | 5 | 35 | 1.046 |

Premissas: conversão perfil→trial ~4–6%, trial→pago 30%, ticket US$ 99, comissão 30% (US$ 29,70 por cliente/mês), churn 3%/mês, base calculada mês a mês com churn composto. **O que quebra a projeção:** em ~60% dos casos a conversão fica 50% abaixo por resposta genérica e thread sem intenção. **O que melhora:** um segundo programa com EPC maior dobra a receita sem dobrar o trabalho.
:::

### 8.3 O caminho real, passo a passo (o que fazer na segunda-feira)

1. **Dia 1** — Escolha 1 nicho e 2 programas (1 recorrente + 1 fixo). Cadastre-se, pegue link e cookie. Anote EPC alvo.
2. **Dia 1–3** — Rode `P1` e `P2` no Grok. Saída: 6 subs, regra de cada um, 3 ângulos.
3. **Dia 4–30** — **Só comentário, zero link, zero menção.** Meta: 100+ karma e 3 subs onde você é reconhecido. Rode o radar todo dia (15 min).
4. **Dia 31** — Publique o primeiro post de caso (rota 2) em sub de tolerância média. Números reais.
5. **Dia 32–60** — Ative menções com disclosure (1 a cada 10 contribuições). Comece a medir clique no perfil e trial.
6. **Dia 61** — Revise EPC por sub. Mate o sub que não converteu; dobre o que converteu.
7. **Dia 61–90** — Se ≥5 pagantes: teste Reddit Ads US$ 30/dia em Conversation Ad. Se <5: volte ao passo 3 e melhore as respostas; não gaste em mídia.
8. **Dia 90** — Decisão go/no-go: EPC ≥ US$ 1 ou CAC orgânico < 30% do LTV? Se sim, escale. Se não, mude de oferta, não de canal.

---

## 9. Piloto de 14 dias (executável hoje, com critério de corte)

::: meta
**Objetivo:** provar ou matar a tese em 14 dias, gastando ~US$ 10 de API e 1 h/dia.
**Material:** `grok-reddit-ops` (motor), `P3`/`P4`/`P5` (prompts), `rules.yaml` (regras por sub).
:::

| Fase | Dias | Ações | Entregável | Métrica |
|---|---|---|---|---|
| Setup | 0–1 | Criar conta Reddit "limpa" (se não tiver), escolher nicho + 2 programas, rodar `P1`/`P2` | `nicho.md`, `subs.md` | 6 subs mapeados, regra lida |
| Observação | 2–3 | Rodar radar em fixture/manual; calibrar score; **não postar nada** | 20 lead cards; 10 threads escolhidas | Precisão do score ≥ 70% |
| Presença | 4–8 | 2 comentários/dia puramente úteis, sem menção | 10 comentários; karma inicial | Karma > 20, zero remoção |
| Conversão | 9–12 | 3 comentários com menção + disclosure; 1 post de caso curto | 3 respostas com disclosure; 1 post | Cliques no perfil ≥ 10 |
| Leitura | 13–14 | Rodar `P6`; preencher painel | Relatório semanal | Trials ≥ 1 · Custo/lead ≤ US$ 5 |

**Critérios de corte (duros):** se em 14 dias você tiver (a) qualquer remoção por regra, **pare e reescreva o tom**; (b) zero clique no perfil em 10 comentários, **o problema é a oferta ou o sub**, não o volume; (c) score do bot acertando <60%, **recalibre o prompt com 20 exemplos rotulados à mão**.

---

## 10. Erros que custam a conta (e o dinheiro)

| Erro | O que acontece | Correção |
|---|---|---|
| Link em toda resposta | Filtro de spam do AutoMod; shadowban | Zero link no primeiro mês; perfil como destino |
| Copiar/colar o mesmo texto em 5 subs | Remoção por "mass-posting" | Reescrever por sub, sempre |
| Usar IA sem reescrever | Detectado como "AI presented as human" | Reescrever na sua voz, erros humanos inclusive |
| Múltiplas contas | Ban de IP/conta, sem apelação | Uma conta, uma pessoa |
| Postar em sub grande sem histórico | Remoção e ban do sub | 2 semanas de comentários antes |
| Prometer renda | Remoção + exposição pública | Compartilhar processo, nunca retorno garantido |
| Ignorar a regra do sub | Ban imediato, irreversível na prática | `rules.yaml` + checagem no Scribe |
| Escalar antes de validar | Queima orçamento de anúncio | Só mídia com ≥5 vendas orgânicas |

---

## 11. Teses finais do Estudo 1

1. **Afiliado no Reddit é jogo de oferta + intenção, não de volume de post.** 8 threads certas por mês valem mais que 200 comentários genéricos.
2. **Recorrência é o único modelo que compensa o esforço.** US$ 6,40 por venda é hobby; US$ 534 por cliente é negócio.
3. **A rota que mais rende é a mais chata:** comentário útil, sem link, com constância — e o perfil fazendo a venda.
4. **Grok vale por 15 minutos por dia economizados e por achar threads que você não acharia.** O resto é disciplina humana.
5. **O teto realista do operador solo é R$ 5–10 mil/mês em 12 meses.** Acima disso exige equipe, segundo programa e mídia paga — e aí o jogo muda de novo.

---

### Fontes do Estudo 1

- Rewardful (2026) — comissão média 24,16%, payout US$ 14,10, conversão 0,8%, 1,28% dos afiliados vendem.
- Dollarpocket / AffNinja / StackedReview / IREV (2026) — benchmarks de CVR, EPC e comissão por nicho.
- PartnerStack, Impact, CJ, ShareASale (2026) — estruturas de comissão recorrente.
- Reddit Inc. (Q2 2026) — DAUq/WAUq; Reddit Ads Help (2026) — formatos, mínimo de US$ 5/dia.
- Benchmarks Reddit Ads 2026 — CPC, CPM, CTR por formato.
- Cases: MediaFast (7 cases), Elevated Magazines (SaaS 90 dias), Superside, ReplyAgent, Subreddit Signals, ReddiReach, OneUp.
- FTC 16 CFR 255 (2023, enforcement 2026); CONAR Guia 2026 (vigente 01/06/2026); Lei 15.325/2026.
- Regras de subreddit: MediaFast/ThreadOtter/oneup (r/AffiliateMarketing, r/JustStart, r/SEO), verificadas em 2026.
