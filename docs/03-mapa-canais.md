# Mapa dos canais — onde o Grok vende em cada rede social (2026)

> **Pergunta deste documento.** O Reddit era o laboratório. Agora: em qual canal o bot Grok realmente vende, qual o preço de entrada, o que é permitido, e onde você coloca o bot para não tomar ban? **Resposta curta: em 2026 o bot vende oficialmente em 5 canais (X, Meta, TikTok, YouTube, Google) e em nenhum deles com postagem autônoma em massa. A venda acontece na conversa, e a conversa tem janela.**

::: meta
**Método:** pesquisa de documentação oficial, rate cards e policies de cada plataforma em nov/2026. Toda permissão abaixo foi verificada na fonte; onde a fonte é ambígua, está marcado como "verificar".
**Como ler a matriz:** a coluna "Bot pode?" é sobre **API oficial + política**, não sobre o que uma ferramenta de terceiros promete.
:::

---

## 1. A matriz que decide tudo

| Canal | Bot pode ler? | Bot pode publicar? | Bot pode conversar (DM)? | Barreira real | Melhor uso comercial |
|---|---|---|---|---|---|
| **X (Twitter)** | ✅ sim (pago por leitura) | ✅ sim (pago por post) | ✅ sim (DM pago) | custo alto — US$ 0,20 por post com link | Radar de intenção + autoridade técnica |
| **Reddit** | ⚠️ conforme contrato | ⚠️ moderação decide | ❌ (DM só sob convite) | regra do sub + API em transição | Intenção de compra + citação em IA |
| **Instagram** | ✅ profissional | ✅ 50–100 posts/24h | ✅ **só depois que a pessoa escreve** | janela de 24h; sem DM frio | Comentário→DM; qualificação |
| **Facebook (Page)** | ✅ | ✅ | ✅ 24h (+7d humano) | Groups API **extinta** | Messenger como CRM de conversa |
| **Facebook (Groups)** | ❌ API | ❌ **API removida em 22/04/2024** | ❌ | só manual | Nenhum — poste à mão |
| **WhatsApp** | ✅ | ✅ template aprovado | ✅ **janela 24h** | custo por mensagem; opt-in | Fechamento e follow-up |
| **TikTok** | ✅ Display API | ✅ Content Posting API (auditado) | ⚠️ Business Suite, 4 tipos nativos | audit obrigatório; DM API fechada em UE/UK/CH | Alcance orgânico + vídeo |
| **YouTube** | ✅ 10 mil unidades/dia | ✅ upload (cota própria) | ⚠️ só comentário | cota; sem DM | Autoridade + busca de longo prazo |
| **LinkedIn** | ⚠️ API limitada | ✅ (próprio feed) | ❌ **proibido automatizar** | ToS 8.2 — ban rápido | Prova social manual, não bot |
| **Threads** | ✅ | ✅ 250/24h | ✅ 1.000 respostas/24h | App Review p/ replies | Conversa de nicho, custo zero |
| **Bluesky** | ✅ aberto | ✅ | ✅ | 5.000 pontos/hora | Teste barato, sem burocracia |
| **Telegram** | ✅ | ✅ | ✅ (~30 msg/s) | nenhum custo | Comunidade, alertas, oferta direta |
| **Nextdoor** | ⚠️ | ✅ (2 posts/mês grátis) | ✅ | verificação de endereço | **Imobiliário hiperlocal** |
| **Google Business** | ✅ API | ✅ posts locais | ❌ | 1 imagem por post; sem analytics de post | **Busca local + avaliações** |
| **E-mail** | — | ✅ | — | consentimento/LGPD/CAN-SPAM | Nutrição e reativação |

**As cinco verdades que saem dessa matriz:**

1. **Nenhuma plataforma permite DM frio por API.** Instagram, Messenger, WhatsApp e TikTok só deixam o bot responder quem falou primeiro. O "bot que prospecta no Direct" é violação de termos, não feature.
2. **Onde há janela de 24h, há receita.** A janela do WhatsApp/Messenger/Instagram é justamente o período em que a pessoa está engajada — e é grátis ou barato responder dentro dela.
3. **O canal mais caro é o mais fácil de automatizar (X), e o mais barato é o mais fácil de queimar (Reddit).** Isso inverte a lógica de "onde começar".
4. **LinkedIn é zona proibida para bot.** A Seção 8.2 do User Agreement proíbe bots, scrapers e automação de sessão. É o único canal onde a resposta correta é "não automatize".
5. **API oficial ≠ permissão comercial.** O Instagram permite publicar 100 posts/dia; a política de spam proíbe postar 100 posts idênticos. A API dá a capacidade, a política define o uso.

---

## 2. Onde o dinheiro está: CPL por canal (2026)

Comparação de custo por lead entre canais pagos, com o mesmo tipo de comprador (B2B e imobiliário):

| Canal | CPL mediano | Faixa | Intenção do lead | Observação |
|---|---|---|---|---|
| **Reddit Ads** | **US$ 17–40** | 15–120 | pesquisa ativa | CPM US$ 3–8; CTR baixo (0,2–0,8%) mas lead qualificado |
| **TikTok Ads** | US$ 18–38 | 15–60 | descoberta | CPL de imobiliário US$ 18–38 em campanha de lançamento |
| **Meta (Facebook/Instagram)** | US$ 35–65 (imob.) / 50–75 (B2B SaaS) | 15–200 | interrupção | volume alto, qualificação baixa sem follow-up |
| **Google Search** | US$ 100 (imob.) / 80–250 (B2B) | 70–524 | compra ativa | o mais caro e o mais pronto para fechar |
| **LinkedIn Ads** | US$ 95–202 | 68–350 | profissional | lead 2–3× mais propenso a virar oportunidade |
| **Nextdoor** | sem CPL público | ~US$ 100/ZIP/mês | vizinhança verificada | fecha 2–3× melhor que Facebook no imobiliário |
| **E-mail (lista própria)** | ~US$ 0,01–0,05 | — | opt-in | ROI US$ 36–42 por US$ 1 gasto |
| **Reddit orgânico + Grok** | ~US$ 0 | — | intenção declarada | custo é tempo humano |

**A leitura estratégica:** Reddit e TikTok entregam o **CPL mais barato**; Google entrega o **lead mais pronto**; LinkedIn entrega o **lead mais qualificado a preço alto**; e-mail entrega o **melhor ROI** porque a lista é sua. O bot Grok não substitui nenhum deles — ele **conecta** os baratos aos prontos, qualificando no meio.

::: decisao
**Ordem de alocação recomendada para 2026 (orçamento de US$ 1.000/mês):**
1. **Reddit orgânico + Grok** — US$ 20 de API (o melhor retorno por dólar, comprovado no Estudo 1)
2. **E-mail/lista** — US$ 30 de ferramenta (o único canal cujo ativo é seu)
3. **Reddit Ads ou TikTok Ads** — US$ 300 (CPL mais baixo para testar oferta)
4. **Google Search** — US$ 400 (só depois de saber qual termo converte, senão é caro)
5. **Meta** — US$ 250 (retargeting de quem já te viu, não prospecção fria)
6. **LinkedIn** — US$ 0 em automação; US$ 0 em mídia até o LTV justificar US$ 150/lead
:::

---

## 3. Canal por canal: o que o bot faz e o que ele não faz

### 3.1 X (Twitter) — o radar mais rápido do mundo

**Por que importa:** é o único lugar onde a intenção quente aparece em minutos e onde a xAI tem acesso nativo com citação. Custo de leitura: US$ 0,005/post; US$ 0,010/perfil.

**O que o bot faz bem:**
- Monitorar menções a concorrentes e a termos de dor ("odiei o portal X", "alguém indica corretor em Goiânia").
- Responder publicamente com valor (com disclosure), dentro das regras do X.
- Publicar thread técnica/autoridade para gerar busca de marca.

**O custo que assusta:** postar com link custa **US$ 0,20 por post** (40× o post sem link). Se você publica 5 posts com link por dia, são US$ 30/mês só de publicação. **Solução:** link no primeiro comentário ou na bio; post principal sem URL.

**Regra de ouro:** no X, o bot é **radar e redator**, não "respondedor automático". Responder automaticamente a todo post que menciona seu termo é a definição de spam.

### 3.2 Instagram + Facebook — a máquina de conversa (e o canal mais importante no Brasil)

**Por que importa:** no Brasil, 93% dos respondentes de pesquisa de social selling usam Instagram para vender e 55% fecham no WhatsApp depois do Direct. Para imobiliária, é o canal principal.

**O que é permitido (verificado):**

| Ação | Status | Regra |
|---|---|---|
| Responder DM de quem te escreveu | ✅ | janela de 24h, conteúdo promocional permitido dentro dela |
| Comentário → 1 DM privada | ✅ | 1 mensagem por comentário, dentro de 7 dias |
| Story reply / menção → resposta | ✅ | conta como mensagem da pessoa, abre a janela |
| Ice breakers (até 4 perguntas) | ✅ | a pessoa toca primeiro |
| Humano responder após 24h | ✅ | tag HUMAN_AGENT, até 7 dias, **sem automação** |
| DM frio para lista | ❌ | não existe rota de API; é spam |
| Seguir/curtir/comentar automaticamente | ❌ | política de spam |
| Ferramenta que usa sua senha | ❌ | viola Platform Terms 6.a.iii |

**Limites de publicação:** 50 posts por 24h por conta (algumas fontes citam 100; o endpoint `content_publishing_limit` é a verdade). Stories e Reels contam. Carrossel conta como 1.

**Onde o Grok entra:** rascunhar a resposta dentro da janela, qualificar em 3 trocas, gerar o "kit de decisão" (3 imóveis + custo total). **Onde ele não entra:** mandar DM.

### 3.3 WhatsApp — onde a venda fecha no Brasil

**Custo real (rate card de 01/10/2026):**

| Tipo | Brasil | EUA |
|---|---|---|
| Marketing | **R$ 0,3217** (US$ 0,0625) | US$ 0,025 |
| Utility / autenticação | R$ 0,035 | US$ 0,004 |
| Serviço (resposta em 24h) | R$ 0,035 **após 1.000 grátis/mês** | grátis |

**O que isso significa:** mandar 1.000 mensagens de marketing/mês custa R$ 322. É barato por lead e caro por spam — e o opt-in é obrigatório. A mensagem de **serviço** (responder quem te procurou) é quase grátis: 1.000 grátis e R$ 0,035 depois. **A estratégia é fazer o lead chegar, não empurrar mensagem.**

**Ganho medido:** operações que respondem em <1 min via WhatsApp convertem **35% lead→visita** contra **15%** sem automação; 78% dos leads imobiliários esperam resposta em <30 min e só 18% das imobiliárias respondem nesse prazo.

### 3.4 TikTok — alcance orgânico sem preço

**O que é permitido:** Content Posting API (Direct Post ou upload como rascunho), Business Suite com 4 tipos de auto-mensagem (welcome, keyword reply, FAQ, prompts) — mas exige conta Business com Advanced Access e a cópia passa por **moderação de 1 a 5 dias úteis**.

**A pegadinha:** até o app passar no **audit**, todo conteúdo postado pela API fica **privado**. E a DM API oficial está **fechada para contas registradas na UE, Reino Unido e Suíça**.

**Limites:** 6 requisições/min por token de usuário; ~15 posts/dia por criador (cap da própria TikTok).

**Onde o Grok entra:** gerar roteiro, hook de 2 segundos, legenda, e — via Grok Imagine — o vídeo base. Custo do vídeo: US$ 0,08/s em 480p, US$ 0,14/s em 720p, US$ 0,25/s em 1080p. Um Reel de 15s em 720p custa **US$ 2,10**.

### 3.5 YouTube — autoridade que compõe por anos

**Custo:** API gratuita, mas com **cota**: 10.000 unidades/dia. Responder comentário custa 50 unidades → ~198 respostas/dia. Upload e busca têm cota própria (~100 chamadas/dia) desde 01/06/2026.

**Onde o bot entra:** responder comentários do próprio canal (permitido e oficial), transformar vídeo em Shorts, escrever descrição otimizada, e gerar o corte a partir de transcrição.

**Onde ele não entra:** comentar em vídeos de terceiros para prospectar. É spam e derruba o canal.

### 3.6 LinkedIn — o canal onde a resposta é "não"

**A regra literal (User Agreement §8.2):** proibido usar "bots ou outros métodos automatizados não autorizados para acessar os Serviços, adicionar ou baixar contatos, enviar ou redirecionar mensagens, criar, comentar, curtir, compartilhar ou repostar".

**O que isso significa na prática:** auto-connect, auto-message, scraper de perfil, extensão de navegador — tudo viola contrato. A hiQ v. LinkedIn terminou com a LinkedIn vencendo por quebra de contrato, não por crime.

**O que sobra e funciona:** conteúdo próprio (publicar no feed é permitido via API para o seu perfil), inbound, e o time comercial respondendo manualmente. **O Grok escreve; o humano envia.**

### 3.7 Threads e Bluesky — os testes baratos que ninguém faz

| Plataforma | Custo | Limite | Por que testar |
|---|---|---|---|
| **Threads** | grátis | 250 posts + 1.000 respostas/24h | público de nicho, texto longo, quase sem concorrência comercial |
| **Bluesky** | grátis, sem App Review | 5.000 pontos/hora (post = 3 pontos) | o canal mais barato de testar oferta e tom |

Ambos permitem publicar e responder via API sem burocracia. É onde você valida copy antes de gastar em canal caro.

### 3.8 Nextdoor + Google Business — o ouro escondido do imobiliário

**Nextdoor:** 100M de usuários verificados, 77% proprietários. Business Page grátis (2 posts/mês), Neighborhood Sponsorship de **US$ 30–150 por ZIP/mês**. Leads fecham 2–3× melhor que Facebook porque vêm com recomendação de vizinho. **É o canal mais subutilizado do mercado imobiliário americano.**

**Google Business Profile:** API oficial permite postar, responder avaliação e atualizar dados. Posts locais: 1.500 caracteres, **1 imagem**, expiram em 7 dias. Sem analytics por post — só por local. Para corretor de bairro, é a vitrine que aparece na busca "corretor em [bairro]".

---

## 4. Onde o bot realmente produz receita: a tabela de decisão

| Se o seu objetivo é… | Canal primário | Canal de apoio | Bot faz | Bot NÃO faz |
|---|---|---|---|---|
| Primeiro dólar como afiliado | Reddit | X, Threads | radar + rascunho | postar |
| Escalar afiliado | Reddit Ads + e-mail | YouTube | criativo + sequência | comprar lista |
| Lead imobiliário local (BR) | Instagram + WhatsApp | Google Business | qualificação + kit | DM frio |
| Lead imobiliário local (EUA) | Nextdoor + Google | Facebook Page | resposta + follow-up na janela | scrap de vizinho |
| Autoridade de longo prazo | YouTube | LinkedIn (manual) | roteiro + descrição | comentar em terceiros |
| Comunidade própria | Telegram | e-mail | moderação + curadoria | spam em grupo |
| Teste de oferta barato | Bluesky + Threads | X | publicar + medir | — |

---

## 5. O erro que mata 90% das operações multicanal

**Abrir 8 canais ao mesmo tempo.** Cada canal tem regra, janela, custo e formato diferentes. Um operador solo consegue manter **dois** com qualidade.

::: alerta
**Regra dos dois canais.** Escolha 1 canal de **intenção** (onde a pessoa declara que quer comprar — Reddit, X, Google) e 1 canal de **conversa** (onde a venda fecha — WhatsApp, Messenger, e-mail). Os outros existem apenas como **republicação** do mesmo conteúdo, sem operação própria. Quem tenta operar seis canais com uma pessoa produz seis mediocridades e nenhuma venda.
:::

**A sequência que funciona:**

```
MÊS 1        MÊS 2         MÊS 3          MÊS 4+
intenção  →  conversa   →  prova      →  distribuição
(Reddit/X)   (WhatsApp)    (YouTube)     (TikTok/Threads/Bluesky)
```

Cada canal novo só entra quando o anterior tem **uma métrica estável por 30 dias**.

---

## 6. Números para dimensionar (resumo executivo)

| Métrica | Valor 2026 | Fonte |
|---|---|---|
| Custo de post no X | US$ 0,015 (sem link) / **US$ 0,20 (com link)** | rate card X API |
| Custo de leitura no X | US$ 0,005/post | idem |
| Limite de posts no X (pay-per-use) | 3 milhões de leituras/mês | idem |
| Marketing WhatsApp Brasil | R$ 0,3217/msg | Meta, out/2026 |
| Serviço WhatsApp Brasil | 1.000 grátis, depois R$ 0,035 | idem |
| Publicação Instagram | 50–100 posts/24h | Meta |
| Janela de resposta Instagram/Messenger | 24h (7 dias com humano) | Meta |
| DM privada por comentário | 1 por comentário, em 7 dias | Meta |
| Publicação TikTok | ~15/dia por criador; 6 req/min | TikTok |
| Cota YouTube | 10.000 unidades/dia; resposta = 50 | Google |
| Publicação Threads | 250 posts + 1.000 respostas/24h | Meta |
| CPL Reddit | US$ 17–40 | benchmarks 2026 |
| CPL TikTok (imob.) | US$ 18–38 | case 2026 |
| CPL LinkedIn | US$ 95–202 | benchmarks 2026 |
| Sponsorship Nextdoor | US$ 30–150/ZIP/mês | Nextdoor |
| Vídeo Grok Imagine 720p | US$ 0,14/s (15s = US$ 2,10) | xAI |
| ROI e-mail | US$ 36–42 por US$ 1 | Litmus/2026 |
| Conversão WhatsApp <1min | 35% lead→visita (vs 15%) | dados BR 2026 |

---

## 7. As cinco conclusões do mapa

1. **Não existe "bot que vende em todas as redes".** Existe um bot que **encontra intenção** e um humano que **fecha na conversa**, com o bot rascunhando. Toda plataforma séria proíbe o contrário.
2. **A janela de 24h é o ativo mais valioso do marketing digital em 2026.** Quem responde dentro dela converte 2–3× mais; quem tenta furá-la paga com a conta.
3. **O canal mais barato (Reddit) exige o maior cuidado (regra do sub).** O canal mais caro (X) é o mais fácil de automatizar. O canal mais rentável (e-mail) é o que ninguém quer construir.
4. **No Brasil, Instagram + WhatsApp são o sistema nervoso do imobiliário.** Nos EUA, Nextdoor + Google. O mesmo bot serve aos dois mudando só a config.
5. **A vantagem competitiva é operacional, não tecnológica.** Qualquer um conecta a API. Poucos mantêm 9:1, disclosure, janela de 24h e opt-in por 12 meses seguidos.
