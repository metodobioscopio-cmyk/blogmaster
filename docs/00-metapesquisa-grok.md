# Meta-pesquisa: o que é (e o que não é) um "Grok bot" de vendas

> **Escopo deste documento.** Investigação sobre o estado real da plataforma Grok/xAI em novembro de 2026, o que ela faz melhor do que as alternativas, quanto custa de verdade operá-la e qual arquitetura sobrevive ao contato com as regras do Reddit. É o alicerce dos dois estudos de mercado que vêm depois.

::: meta
**Verificado em:** 06/11/2026 · **Fontes:** docs.x.ai, pricing público xAI, relatórios trimestrais da Reddit (Q2 2026), política de conteúdo Reddit (mar/2026), FTC 16 CFR 255, CONAR 2026, FCC/TCPA.
**Regra de leitura:** preços de modelo e de ferramenta mudam a cada trimestre. Trate toda cifra como *ordem de grandeza verificada*, não como contrato.
:::

---

## 1. Definição: três coisas diferentes chamadas "Grok bot"

A expressão aparece no mercado com três significados que se confundem. Separar isso é o primeiro passo para não comprar a coisa errada.

| # | O que é | O que faz | Serve para vender? |
|---|---|---|---|
| **A** | **Grok consumidor** (app e web, SuperGrok ~US$ 30/mês) | Chat, DeepSearch, geração de imagem/vídeo, acesso a X | Só para pesquisa manual e produção de conteúdo. Não automatiza nada. |
| **B** | **Grok Business/Enterprise** (US$ 30/assento/mês; Enterprise sob consulta) | Grok com SOC 2, RBAC, SSO, sem treino nos seus dados | Uso interno de equipe: analisar conversas, redigir, resumir. Não posta, não prospecta. |
| **C** | **Bot operado por Grok** (o que este dossiê entrega) | Programa próprio que chama a **API da xAI** com ferramentas (`x_search`, `web_search`), pontua intenção de compra, redige resposta e entrega ao humano | **Sim — é o único dos três que gera pipeline.** |

Este dossiê trata de **C**. A tese central, que a pesquisa sustenta: *o valor não está no modelo, está no encanamento entre o modelo e o lugar onde a conversa de compra acontece.* Grok é commodity; o diferencial é o acesso nativo ao X e o custo por token. O Reddit é onde a intenção fica escrita em texto público. O bot é a ponte.

---

## 2. Estado da plataforma em nov/2026

### 2.1 Modelos e preço por milhão de tokens

| Modelo | Input | Input em cache | Output | Contexto | Papel na operação |
|---|---|---|---|---|---|
| `grok-4.6` (flagship) | US$ 2,00 | US$ 0,50 | US$ 6,00 | 500K | Análise de threads longas, due diligence de lead, redação final |
| `grok-4.5` | US$ 2,00 | US$ 0,30 | US$ 6,00 | 500K | Alternativa ao 4.6 com cache mais barato |
| `grok-4.3` | US$ 1,25 | US$ 0,20 | US$ 2,50 | 1M | **Cavalo de batalha**: classificação, redação em volume |
| `grok-4.1-fast` | US$ 0,20 | US$ 0,10 | US$ 0,50 | 2M | Triagem bruta de milhares de posts, custo quase zero |
| `grok-build-0.1` | US$ 1,00 | US$ 0,20 | US$ 2,00 | 256K | Código do próprio bot |

**Regras de bolso que saem desses números:**

- Acima de **200K tokens de prompt**, a tarifa dobra no 4.6 (US$ 4/US$ 12). Nunca mande a thread inteira "por segurança": recorte.
- **Cache de input derruba 75–90% do custo** de um system prompt grande e repetido. Um prompt de operador de 6.000 tokens usado 500 vezes/dia custa US$ 0,60 em vez de US$ 2,40 no 4.3.
- Nomes de modelo mudam rápido (a xAI aposentou o Grok 4 original em mai/2026). **Nunca hardcode o modelo**: exponha `GROK_MODEL` em variável de ambiente.

### 2.2 Ferramentas server-side (onde o custo de verdade mora)

| Ferramenta | Parâmetro na API | Preço | Para que serve na venda |
|---|---|---|---|
| Web Search | `web_search` | US$ 5 / 1.000 chamadas | Descobrir preço de concorrente, notícia local, dados de bairro |
| **X Search** | `x_search` | **US$ 5 / 1.000 posts + US$ 10 / 1.000 perfis** (desde 21/09/2026) | Radar de intenção em tempo real; monitorar concorrentes e criadores |
| Code Execution | `code_execution` | US$ 5 / 1.000 chamadas | Calcular financiamento, ROI, TCO dentro da conversa |
| Collections Search | `collections_search` | US$ 2,50 / 1.000 | RAG sobre sua base de imóveis/ofertas |
| File Attachments | `file_attachments` | US$ 5 / 1.000 | Ler PDF de contrato, laudo, tabela de comissão |

::: alerta
**A armadilha do custo.** Em setembro de 2026 a xAI mudou a cobrança do `x_search` de "por chamada" para "por post retornado". Uma única chamada que devolve 100 posts custa US$ 0,50 em vez de US$ 0,005 — **100× mais**. Um bot mal parametrizado que varre 2.000 posts/dia gasta US$ 10/dia só de ferramenta, contra centavos de token. **Parametrizar `max_turns`, `from_date` e `allowed_x_handles` não é otimização: é o que define se a operação existe ou não.**
:::

### 2.3 Capacidades que importam para vendas

| Capacidade | Existe? | Como usar |
|---|---|---|
| Function calling | Sim | O bot chama seu CRM, seu WhatsApp, sua planilha |
| Structured outputs | Sim | Lead card em JSON validado — não em texto livre |
| Reasoning effort (low→xhigh) | Sim | `low` para triagem em massa, `high` para diagnóstico de lead quente |
| Citations / tool metadata | Sim | **Obrigatório** para auditoria: você precisa provar de onde saiu cada afirmação |
| Batch API | Sim | Rodar scoring noturno de 10 mil threads com desconto |
| Rate limits (padrão) | 150 req/s · 7.200 req/min · 50M tokens/min | Nunca será seu gargalo; o gargalo é a fonte de dados |
| Fine-tuning | Não confirmado | Não planeje em cima disso |
| Conector nativo de Reddit | **Não** | **Você traz os dados do Reddit.** Este é o trabalho real. |

### 2.4 Onde Grok ganha e onde perde

| Dimensão | Grok | Alternativa | Veredito |
|---|---|---|---|
| Dados de X em tempo real | Nativo, com citação | Nenhum concorrente tem | **Vantagem estrutural** — use |
| Custo por token | 4.3 a US$ 1,25/US$ 2,50 | GPT/Claude frontier ~US$ 2–15 | **Vantagem** em volume |
| Contexto | 2M no 4.1-fast; 1M no 4.3 | 200K–1M | **Vantagem** para analisar threads gigantes |
| Dados de Reddit | Nenhum conector | Também nenhum nativo; APIs pagas existem | **Empate** — você constrói ou paga |
| Estabilidade de SKU | Aposenta modelo rápido | Ciclos mais lentos | **Risco real** — abstraia o modelo |
| Ferramentas de browser/UI | Limitadas vs Computer Use | Claude/GPT mais maduros | **Desvantagem** — não dependa |
| Governança de conteúdo | Depende de você | idem | **Empate** — o risco é seu |

**Conclusão do item 2:** Grok é a escolha certa para *radar de intenção + redação de resposta em volume*, e a escolha errada para *automação de postagem*. Essa assimetria define a arquitetura inteira da seção 4.

---

## 3. Por que Reddit + Grok, e não Reddit + ChatGPT

O Reddit virou infraestrutura de descoberta, não só fórum. Os números de 2026 explicam por que uma conversa enterrada num subreddit de 40 mil membros vale mais hoje do que valia em 2023:

| Métrica (Q2 2026) | Valor | Fonte |
|---|---|---|
| DAUq global | **130,3 milhões** (+18% a/a) | Relatório trimestral Reddit |
| WAUq global | **514,6 milhões** (+24% a/a) | Relatório trimestral Reddit |
| DAUq EUA | 53,2 milhões | Relatório trimestral Reddit |
| Usuários **deslogados** (chegam por busca) | **77,7 milhões/dia** (+27%) | Relatório trimestral Reddit |
| Posição do reddit.com em visibilidade no Google EUA | **4º domínio** | Sistrix, jul/2026 |
| Participação nas citações de AI Overviews | **18,5% (2º lugar)** | Ahrefs, set/2026 |
| Participação nas citações top-10 do Perplexity | **46,7%** | Profound, 2025–26 |

Duas consequências que mudam a estratégia:

1. **O leitor do seu comentário frequentemente não é um redditor.** 60% do tráfego diário chega deslogado, via Google. Um comentário útil de 2022 continua vendendo em 2026 porque é *citado por IA*.
2. **IA cita Reddit porque Reddit é opinião humana em texto.** Isso significa que responder bem no Reddit é, hoje, a forma mais barata de aparecer na resposta do ChatGPT/Perplexity/Gemini quando alguém pesquisa "melhor corretor em Goiânia" ou "is [SaaS] worth it". Tráfego vindo de IA converte ~4,4× melhor que orgânico tradicional (Seer Interactive, 2026).

E por que **Grok** especificamente nesse jogo: a xAI é a única que vende busca no X por API com citação, a US$ 5/1.000 posts. O X é onde a intenção *quente* aparece primeiro (o comprador reclamando de um portal, o investidor perguntando de bairro, o afiliado pedindo programa). O Reddit é onde a intenção *durável* fica indexada. O bot usa os dois: X para velocidade, Reddit para permanência.

::: nota
**Honestidade sobre o efeito GEO.** "Otimizar para ser citado por IA" beira manipulação quando feito com contas falsas. A linha ética e legal é simples: **humano real, opinião real, divulgação da relação comercial, sem enxame de contas.** A Reddit bloqueia ~23 milhões de visualizações de spam/dia, remove ~100 mil contas automatizadas/dia e, desde 25/03/2026, exige rótulo **[App]** para conta automatizada. O Cornell study de 2026 mostrou que 13 palavras plantadas num comentário bastam para virar uma recomendação de IA — e que isso é trivial de fazer. Justamente por ser trivial, é o caminho mais rápido para tomar ban e queimar o ativo. Este dossiê usa o efeito GEO **legítimo**: conteúdo verdadeiro que merece ser citado.
:::

---

## 4. Arquitetura do bot: as 5 camadas

```
┌──────────────────────────────────────────────────────────────────────┐
│  1. RADAR          x_search · web_search · fonte Reddit · RSS        │
│     (o que está sendo perguntado AGORA, por quem, onde)              │
└───────────────────────────────┬──────────────────────────────────────┘
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  2. SCOUT          scoring de intenção + fit + risco de ban          │
│     saída: lead card em JSON (não texto livre)                       │
└───────────────────────────────┬──────────────────────────────────────┘
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  3. SCRIBE         rascunho de resposta no tom da comunidade         │
│     + checagem de regra do sub + disclosure automático               │
└───────────────────────────────┬──────────────────────────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │ 4. HUMANO REVISA      │  ← etapa obrigatória
                    │ e publica             │
                    └───────────┬───────────┘
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│  5. MIRROR         CRM · WhatsApp · atribuição · citações em IA      │
│     realimenta o Radar com o que virou conversa e o que virou venda   │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.1 Por que o humano fica no meio (e não é preciosismo)

| Se o bot postar sozinho | Consequência |
|---|---|
| Conta nova + link + volume = spam | Remoção instantânea pelo AutoModerator; shadowban silencioso |
| Conta automatizada sem rótulo `[App]` | Violação da política de 25/03/2026 |
| Texto de IA apresentado como experiência humana | Violação de "Manipulated Content"; ban do sub e risco de ban de conta |
| Sem disclosure de comissão | Violação FTC 16 CFR 255 (EUA) e Guia CONAR 2026 (Brasil) |
| Erro factual em imóvel/oferta | Responsabilidade civil e, no Brasil, risco PROCON/CRECI |

O gargalo humano não é limitação — é o **fosso competitivo**. 99% dos concorrentes vão automatizar a postagem, tomar ban e desistir. Quem automatiza *pesquisa e redação* e mantém o humano na publicação opera indefinidamente.

### 4.2 O contrato de dados do Reddit (o ponto que derruba projetos)

Esta é a parte que ninguém coloca no pitch e que decide a viabilidade técnica:

| Via de acesso | Custo | Status em nov/2026 | Uso recomendado |
|---|---|---|---|
| API oficial, uso não comercial | Grátis, 100 QPM | Ativa, mas **cadastro self-service fechado** e API pública termina em **mar/2027** | Protótipo, validação |
| API oficial, uso comercial | ~US$ 0,24 / 1.000 chamadas (sem tabela pública) | Contrato manual, 2–4 semanas, sem preço self-serve | Operação séria com volume |
| `.json` não autenticado | Grátis | **403 desde mai/2026** | Não depender |
| Provedor terceiro por chamada | ~US$ 0,002/leitura | Ativo | MVP rápido, risco de ToS |
| **Reddit Pro (nativo, grátis)** | US$ 0 | Ativo, Trends só em inglês | Descoberta de comunidade e keyword |

::: decisao
**Decisão de arquitetura deste dossiê:** o motor (`grok-reddit-ops`) funciona em três modos — `fixture` (dados locais, custo zero, para desenvolver e demonstrar), `oauth` (API oficial com suas credenciais) e `manual` (você cola o texto da thread). Nenhum modo raspa o site em violação de termos. Para produção acima de ~150 mil leituras/mês, o caminho é contrato comercial com o Reddit ou provedor licenciado.
:::

---

## 5. Custo real de operação (a conta que decide o ROI)

Cenário: operação de 1 pessoa, 3 subreddits, ~200 threads/semana monitoradas, 40 respostas redigidas/semana, 1 varredura diária de X.

| Item | Volume/mês | Custo unitário | Custo/mês |
|---|---|---|---|
| Triagem de threads (`grok-4.1-fast`) | 800 threads × ~1.200 tokens in / 200 out | US$ 0,20 / US$ 0,50 por M | **US$ 0,27** |
| Scoring fino de shortlist (`grok-4.3`) | 160 × 2.500 in / 300 out | US$ 1,25 / US$ 2,50 por M | **US$ 0,62** |
| Redação de respostas (`grok-4.3` + cache) | 160 × 3.000 in (80% cacheado) / 450 out | idem | **US$ 0,38** |
| `web_search` | 300 chamadas | US$ 5 / 1.000 | **US$ 1,50** |
| `x_search` (parametrizado) | 3.000 posts/mês | US$ 5 / 1.000 posts | **US$ 15,00** |
| **Total API** | | | **≈ US$ 17,77/mês** |
| Reddit Ads (opcional, teste) | US$ 30/dia × 14 dias | CPC ~US$ 1,25–1,85 | **US$ 420 (único)** |
| Tempo humano | 1–1,5 h/dia | — | **o custo dominante** |

**Leitura estratégica:** a API custa **menos que um almoço**. O custo real é tempo humano e, se você usar anúncio, mídia. Isso inverte a pergunta: não é "dá para pagar Grok?", é "dá para pagar 1 hora/dia de julgamento humano?". O bot existe para transformar 3 horas em 45 minutos, não para eliminar a pessoa.

::: sim
**Simulação de custo por lead (afiliados):** 40 respostas/semana → ~170/mês. Se 6% gerarem conversa e 1,5% virar cadastro, são ~10 cadastros/mês a US$ 18 de API = **US$ 1,80 por cadastro**. Mesmo triplicando o custo de API, o CPA de topo de funil continua irrelevante. O que quebra a conta é tempo gasto em thread sem intenção — e é exatamente isso que a camada Scout resolve.
:::

---

## 6. Limites, riscos e o que este bot **não** faz

| Risco | Probabilidade | Impacto | Mitigação embutida |
|---|---|---|---|
| Ban de conta por excesso de link | Alta sem disciplina | Alto | Modo "sem link": resposta útil + perfil como destino |
| Ban por texto de IA não declarado | Média | Alto | Revisão humana + reescrita em voz própria + checagem de regra do sub |
| Mudança de preço/SKU da xAI | Alta | Médio | Modelo e preços em `.env`; fallback OpenAI-compatible |
| Fim da API pública do Reddit (mar/2027) | Certa | Médio | Camada de dados plugável (fixture/oauth/manual/provedor) |
| Lead card alucinado | Média | Alto | Structured output + exigência de `citations` + revisão |
| Regra do sub mudar | Alta | Médio | `rules.yaml` por subreddit, revisão mensal |
| Vazamento de dado pessoal no CRM | Baixa | Altíssimo | LGPD: base legal, minimização, retenção, criptografia |

**O bot não faz:** criar contas, votar, postar sozinho, mandar DM em massa, raspar o Reddit contra os termos, inventar depoimento, comprar lista. Cada um desses itens é, simultaneamente, ban garantido e problema jurídico. A entrega é um **copiloto de vendas**, não um exército de fantasmas.

---

## 7. As 5 conclusões da meta-pesquisa

1. **Grok é infraestrutura, não produto.** O que você vende é o fluxo: radar → qualificação → rascunho → humano → CRM.
2. **O custo de token é ruído; o custo de ferramenta e de tempo é o jogo.** Parametrizar `x_search` vale mais que trocar de modelo.
3. **Reddit não é canal de mídia, é canal de indexação e confiança.** O retorno vem de comentários que continuam sendo lidos e citados 12 meses depois — não do post da semana.
4. **A vantagem defensável é a disciplina.** 9:1, disclosure, sem link onde não pode, humano no comando. Chato, auditável e escalável.
5. **Os dois mercados exigem bots diferentes.** Afiliados: volume alto, ticket baixo, ciclo de dias, otimiza EPC. Imobiliário: volume baixo, ticket altíssimo, ciclo de semanas, otimiza **velocidade de resposta**. Os estudos 1 e 2 tratam cada um com sua própria matemática.

---

### Fontes principais

- xAI — docs.x.ai (modelos, `x_search`, rate limits, pricing), consultado em 06/11/2026.
- xAI — mudança de cobrança do X Search por post/perfil, vigente em 21/09/2026.
- Reddit Inc. — resultados do Q2 2026 (DAUq, WAUq, receita) e política "Humans welcome (bots must wear name tags)", 25/03/2026.
- Sistrix (jul/2026) e Ahrefs (set/2026) — visibilidade e citações em IA.
- Seer Interactive (2025–26) — conversão de tráfego indicado por IA.
- FTC — *Guides Concerning the Use of Endorsements and Testimonials*, 16 CFR Part 255 (revisão 2023, enforcement em 2026).
- CONAR — *Guia de Marketing e Publicidade por Influenciadores Digitais*, vigente em 01/06/2026.
- FCC/TCPA — regras de revogação de consentimento (vigentes em 11/04/2025) e status da regra *one-to-one* (vacada em 24/01/2025).
