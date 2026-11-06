# Playbook Grok — operação, prompts e controle de custo

> Manual de campo do bot, **em todos os canais**. Não é teoria: cada seção corresponde a um arquivo do motor `grok-channel-ops` e a um prompt versionado em `prompts/`. Se você seguir na ordem, termina com o radar rodando, o validador de canal ligado e um relatório semanal na mão.

---

## 1. Setup em 20 minutos

### 1.1 Pré-requisitos

| Item | Como obter | Observação |
|---|---|---|
| `XAI_API_KEY` | console.x.ai → API Keys | Novos usuários costumam receber créditos promocionais; confirme no painel |
| Python 3.10+ | já instalado na maioria dos ambientes | sem dependências externas no modo fixture |
| Fonte de dados | Reddit: `fixture`/`oauth`/`manual`; X: `X_BEARER_TOKEN` | ver seção 2 |
| Conta real em cada canal | Reddit: 30+ dias e 100+ karma · IG: conta Business · WhatsApp: WABA aprovado | **sem conta real, não há canal** |
| Telegram | `TELEGRAM_BOT_TOKEN` (10 min, custo zero) | **comece por aqui** para validar o fluxo |

### 1.2 Instalação

```bash
cd grok-channel-ops
cp .env.example .env          # preencha XAI_API_KEY
python -m src.cli doctor                # confere config
python -m src.cli canais                # matriz dos 20 canais
python -m src.cli radar --source fixture --limit 12
python -m src.cli weekly --input output/leads.jsonl
```

O primeiro comando já produz lead cards usando dados de exemplo — sem gastar um centavo de API. É assim que você calibra antes de ligar o modelo.

### 1.3 Variáveis de ambiente

| Variável | Padrão | Para que serve |
|---|---|---|
| `XAI_API_KEY` | — | autenticação |
| `GROK_MODEL` | `grok-4.3` | cavalo de batalha; troque sem mexer no código |
| `GROK_MODEL_FAST` | `grok-4.1-fast` | triagem volumosa |
| `X_SEARCH_POSTS_BUDGET` | `200` | **teto diário de posts do X** (controle de custo) |
| `REDDIT_SOURCE` | `fixture` | `fixture` \| `oauth` \| `manual` |
| `MIN_SCORE` | `60` | corte de intenção |
| `DAILY_DRAFT_CAP` | `8` | máximo de rascunhos/dia (evita overposting) |
| `DISCLOSURE_MODE` | `strict` | injeta disclosure obrigatório no Scribe |
| `TELEGRAM_BOT_TOKEN` | — | canal de teste e alerta de lead quente |
| `WA_TOKEN` / `WA_PHONE_NUMBER_ID` | — | WhatsApp Cloud API (janela 24h) |
| `IG_TOKEN` / `IG_USER_ID` | — | Instagram Business (50–100 posts/24h) |
| `TIKTOK_AUDITED` | `false` | enquanto `false`, o validador bloqueia publicação |
| `YOUTUBE_REPLIES_DAILY_CAP` | `198` | teto de respostas/dia (cota 10.000 un) |

---

## 2. A camada de dados: três modos, uma interface

```
RedditSource (interface)
├── FixtureSource   → lê fixtures/threads.json (desenvolvimento, demo, testes)
├── OAuthSource     → API oficial do Reddit (PRAW/HTTP OAuth), respeita limite
└── ManualSource    → você cola o texto da thread, o bot analisa
```

**Por que isso importa:** a API pública do Reddit termina em março de 2027 e o cadastro self-service já está fechado. Um bot que depende de scraping morre nessa data. Um bot com interface plugável troca de fonte em uma linha.

```python
# trocar a fonte não muda nada no resto do pipeline
source = get_source(os.getenv("REDDIT_SOURCE", "fixture"))
threads = source.fetch(subreddits=SUBS, since_hours=48, limit=40)
```

---

## 3. As doze tarefas e seus prompts

Cada prompt é um arquivo em `prompts/`. Todos exigem saída estruturada e citação. Versione-os: mudança de prompt é mudança de produto.

### `P1-nicho.md` — escolher o que vender

**Entrada:** seu perfil (tempo, capital, experiência).
**Saída:** 5 nichos ranqueados com comissão, LTV estimado, dificuldade de moderação no Reddit e veredito.
**Critério de sucesso:** você consegue dizer em uma frase por que o nicho nº 1 paga suas contas em 12 meses.

### `P2-subs.md` — mapear comunidades

**Entrada:** nicho + idioma + país.
**Saída:** tabela com sub, tamanho, tolerância a promo, regra citada, rota recomendada, risco.
**Regra embutida:** se o prompt não conseguir citar a regra do sub, ele deve marcar `needs_manual_check: true`. Nunca invente regra.

### `P3-radar.md` — achar intenção

**Entrada:** lote de threads (título, sub, texto, idade, score, comentários).
**Saída:** para cada thread, `intent_score` 0–100 + `intent_type` + `buying_stage` + `reason`.
**Definição operacional de intenção (embutida no prompt):**

| Score | Sinal | Ação |
|---|---|---|
| 80–100 | Pergunta explícita de compra/recomendação, recente (< 24 h), sem resposta boa | Responder hoje |
| 60–79 | Dor clara, sem pedido explícito | Comentar com valor, sem oferta |
| 40–59 | Tema adjacente | Só se sobrar tempo |
| 0–39 | Desabafo, notícia, humor | Ignorar |

### `P4-leadcard.md` — qualificar

**Saída (JSON, validado):**

```json
{
  "thread_id": "...", "subreddit": "...", "url": "...",
  "intent_score": 87, "intent_type": "recommendation_request",
  "buying_stage": "solution_aware",
  "persona": "investidor iniciante, 32-45, renda 10-20k",
  "pain": "não sabe se compra agora ou espera juros caírem",
  "offer_fit": "alto", "angle": "comparar custo de esperar vs. comprar",
  "risk_flags": ["thread antiga? não", "sub proíbe link: sim"],
  "citations": ["https://reddit.com/r/.../..."],
  "needs_human_facts": ["m² atualizado do bairro", "taxa de juros vigente"]
}
```

**Por que JSON e não texto:** você consegue filtrar, somar, deduplicar, jogar no CRM e medir precisão. Texto livre não escala.

### `P5-scribe.md` — redigir

**Regras embutidas no prompt:**
1. Responder a pergunta **na primeira frase** (44% das citações de IA vêm do primeiro 30% do texto).
2. Máximo 250 palavras em comentário; 1.500 em post.
3. Sem superlativos, sem emoji, sem "game changer", sem CAIXA ALTA.
4. Incluir disclosure se houver menção comercial (`DISCLOSURE_MODE=strict`).
5. Se a regra do sub proíbe link → `link_allowed: false` e destino é o perfil.
6. Marcar `[VERIFICAR]` em qualquer número que o humano precise confirmar.
7. Nunca inventar experiência pessoal — o humano reescreve em primeira pessoa.

### `P6-atribuicao.md` — medir

**Entrada:** CSV de cliques, trials, vendas + log de respostas.
**Saída:** EPC por sub, por ângulo, por tipo de thread; custo por lead; ranking de respostas que geraram clique.
**Regra:** se uma métrica não muda uma decisão, não colete.

### `P7-midia.md` — decidir anúncio

**Entrada:** LTV, CAC atual, volume de leads, orçamento.
**Saída:** veredito go/no-go, budget diário sugerido, formato recomendado e critério de corte em 14 dias.

*(Os promptos abaixo são a camada multicanal. O corpo completo está em `prompts/`; aqui vão só os gatilhos.)*

### `P8-adaptador-canal.md` — traduzir 1 conteúdo para 1 canal
**Entrada:** tema + canal + fatos verificados. **Saída:** peça nativa com limite respeitado, disclosure no lugar e uma variante B.

### `P9-whatsapp-fluxo.md` — montar o atendimento que fecha
**Entrada:** mercado + origem do lead + ticket. **Saída:** fluxo em 4 etapas, templates para aprovação da Meta e manual de handoff.

### `P10-repurposing.md` — 1 ideia → 12 peças
**Entrada:** peça que performou. **Saída:** 12 peças nativas de 7 canais, cada uma com CTA próprio.

### `P11-radar-multicanal.md` — ler 4 fontes, ranquear uma fila
**Entrada:** posts de Reddit, X, IG e Google. **Saída:** score 0–100, tipo de intenção, risco do canal e ação sugerida (sempre "responder no post", nunca DM).

### `P12-auditoria-canal.md` — GO / AJUSTAR / NO-GO
**Entrada:** 30 dias de métricas + incidentes. **Saída:** nota em compliance, custo, conversão e risco, com o que escalar e o que parar hoje.

---

## 4. Controle de custo (a parte que salva o projeto)

### 4.1 As quatro alavancas (cérebro)

| Alavanca | Efeito | Como implementar |
|---|---|---|
| **Cache de system prompt** | −75 a −90% de input | Prompt fixo grande + `prompt_cache_key` estável |
| **Modelo em cascata** | −80% | fast para triagem → 4.3 para shortlist → 4.6 só no topo |
| **Recorte de contexto** | −50 a −95% | mandar título + 1.500 chars + top 5 comentários, nunca a thread inteira |
| **Teto de `x_search`** | −90% | `X_SEARCH_POSTS_BUDGET` diário + `from_date` + `allowed_x_handles` |

### 4.2 O custo muda de canal para canal (o que o teto de x_search não vê)

O controle de custo do motor cobre o **cérebro** (xAI). O que estoura orçamento é o **canal**:

| Canal | Ação | Custo unitário | Onde dói |
|---|---|---|---|
| X | post sem link | US$ 0,015 | barato |
| X | **post com link** | **US$ 0,20** | 13× — 3 posts/dia com link = US$ 18/mês |
| X | leitura de post | US$ 0,005 | radar de 4.500 leituras/mês = US$ 22,50 |
| WhatsApp | marketing BR | R$ 0,3217 | 1.000 disparos = R$ 322 |
| WhatsApp | serviço | R$ 0 (1.000 grátis) → R$ 0,035 | quase grátis |
| Grok Imagine | vídeo 15s 720p | US$ 2,10 | 30 Reels/mês = US$ 63 |
| Meta/TikTok/YouTube/LinkedIn/GBP | publicar | US$ 0 | cota, não dinheiro |

**Regra prática:** mantenha o **gasto de canal** abaixo de 40% do gasto total de API. Se o X estiver consumindo mais que isso, o problema é o calendário de posts com link — troque o link para a resposta.

### 4.3 Simulação de custo por 1.000 threads

| Etapa | Modelo | Tokens in | Tokens out | Custo |
|---|---|---|---|---|
| Triagem | 4.1-fast | 1.000 × 1.200 = 1,2M | 200K | **US$ 0,34** |
| Scoring | 4.3 | 160 × 2.500 = 400K | 48K | **US$ 0,62** |
| Redação | 4.3 (cache 80%) | 160 × 3.000 = 480K | 72K | **US$ 0,38** |
| Web search | — | 200 chamadas | — | **US$ 1,00** |
| **Total** | | | | **≈ US$ 2,34 / 1.000 threads** |

Ou seja: **meio centavo por thread analisada.** O erro clássico não é gastar com modelo — é mandar 40 mil tokens por thread por preguiça de recortar.

### 4.4 Guard-rails no código

```python
# src/budget.py
class Budget:
    def __init__(self, daily_usd=1.00, daily_x_posts=200): ...
    def can_spend(self, estimated_usd: float) -> bool: ...
    def charge(self, usage) -> None: ...   # lê usage do response
```

Se o orçamento estourar, o bot **para e avisa** em vez de continuar gastando. Um bot que não tem freio é um cartão de crédito com API.

E o freio de **canal**, que é tão importante quanto o de dinheiro:

```python
from src.channels import validate_channel_post, ChannelViolation

try:
    validate_channel_post("instagram_dm", {"cold": True})
except ChannelViolation as e:
    print(e.rule)   # COLD_DM_META — e o envio nunca acontece
```

**Dois freios, dois riscos diferentes:** o de orçamento protege o bolso; o de canal protege a conta. Um sem o outro é meio sistema.

---

## 5. Qualidade: como saber se o bot está certo

| Teste | O que mede | Meta |
|---|---|---|
| **Precisão do score** | 20 threads rotuladas à mão vs. saída do bot | ≥ 70% de concordância |
| **Recall de intenção** | threads de compra que o bot deixou passar | ≤ 20% |
| **Factualidade** | números nas respostas conferidos na fonte | 100% (não é meta, é requisito) |
| **Tom** | resposta parece humana daquele sub? | revisão cega de 5 respostas |
| **Regra** | `link_allowed` correto por sub | 100% (checagem contra `rules.yaml`) |
| **Custo** | US$/thread | < US$ 0,01 |
| **Política** | payload reprovado pelo validador antes de chegar na API | 100% (bloqueio, não aviso) |
| **Canal** | resposta dentro da janela (24h Meta/WhatsApp) | > 90% |

**Como rotular 20 threads em 15 minutos:** leia só o título e o primeiro parágrafo; marque 1 (compraria hoje), 0,5 (dor, sem pedido), 0 (irrelevante). Compare com a saída. Ajuste o prompt citando os 3 casos em que errou — isso vale mais que 10 regras novas.

---

## 6. RAG próprio: a base que ninguém tem

O diferencial do bot imobiliário não é o modelo, é a **base local**:

```
data/kb/
├── bairros/goiania-bueno.md        # m², valorização, aluguel/m², IPTU, escolas
├── bairros/goiania-marista.md
├── financiamento/tabela-2026.md    # taxas, entrada, MIP/DFI, seguro
├── custos/itbi-escritura-go.md     # alíquotas, cartório
└── ofertas/programa-x.md           # comissão, cookie, requisitos (afiliados)
```

Cada arquivo tem: **fonte, data de coleta, responsável**. O retriever é simples (TF-IDF ou embeddings) e o prompt exige que a resposta cite o arquivo. Sem isso, o modelo inventa m² — e um m² errado no Reddit destrói a credibilidade em um comentário.

---

## 7. Integração com o resto da stack

**A arquitetura de três camadas** (detalhada em `05-setup-tecnico.md` §0):

```
CÉREBRO      Grok via API (chat, web, X) ou Grok Bot (agente persistente, US$ 30/mês)
   ↓
ORQUESTRADOR fila → validate_channel_post() → aprovação humana → publica
   ↓
CANAIS       X · Meta · WhatsApp · TikTok · YouTube · Telegram · GBP · Threads · Bluesky
```

O ponto que não se negocia: **a validação vem antes da chamada de API.** Um orquestrador que valida depois só documenta o ban.

| Destino | Como | Por quê |
|---|---|---|
| **Planilha / Google Sheets** | CSV em `output/weekly.csv` | simplicidade radical; todo mundo sabe abrir |
| **CRM** (HubSpot, Pipedrive, Follow Up Boss) | webhook ou export | atribuição por origem "reddit" |
| **WhatsApp** | link `wa.me` no perfil, **nunca** na thread | compliance LGPD/TCPA |
| **Telegram/Slack** | alerta quando `intent_score ≥ 85` | resposta em minutos |
| **Notion** | base de conteúdo e calendário editorial | opcional |

---

## 8. Rotina diária de 45 minutos (o formato que sobrevive)

| Minuto | Ação |
|---|---|
| 0–5 | Rodar radar; ler os 5 cards de score mais alto |
| 5–20 | Responder 2 threads (rascunho do bot + sua reescrita de 3 min) |
| 20–30 | 3 comentários puramente úteis, sem menção (rota 3) |
| 30–35 | 1 comentário em thread de ontem que você deixou pendente |
| 35–40 | Registrar no painel: publicado, removido, clique |
| 40–45 | Ver 1 thread nova do X search e anotar 1 insight de oferta |

**Semana:** 1 post de caso ou análise (4 h em um dia só). **Mês:** 1 revisão de `rules.yaml` e 1 calibração de score.

---

## 9. Sinais de que o bot está te prejudicando (pare imediatamente)

| Sinal | Diagnóstico | Ação |
|---|---|---|
| Remoções começaram a aparecer | Tom virou anúncio | Voltar para rota 3 por 30 dias |
| Upvotes caíram no mesmo sub | A comunidade te reconheceu como vendedor | Trocar sub ou mudar de ângulo |
| Conta com "shadowban" (posts sem views) | Link repetido / volume | Testar com conta deslogada; pausar 30 dias |
| Zero clique no perfil com 20 respostas | Oferta errada ou sub errado | Trocar a oferta antes de trocar o volume |
| Custo por lead subiu muito | `x_search` descontrolado ou contexto inflado | Aplicar as 4 alavancas da seção 4 |

---

## 10. Checklist de conformidade antes de publicar

- [ ] Li a regra do sub hoje (não a do mês passado).
- [ ] Se há menção comercial, o disclosure está **na mesma tela**, antes do link.
- [ ] Não há link onde o sub proíbe.
- [ ] Todo número tem fonte e data.
- [ ] Não estou apresentando texto de IA como experiência pessoal — reescrevi.
- [ ] Não há promessa de renda/resultado.
- [ ] Se é imóvel: CRECI visível, autorização do proprietário, dados exatos.
- [ ] Se é lead: registro de consentimento e canal de saída.
- [ ] A resposta seria útil mesmo sem a oferta.
