# grok-channel-ops

Copiloto de vendas multicanal usando a API da xAI (Grok). Transforma threads públicas em **lead cards qualificados** e **rascunhos de resposta**, e valida cada publicação contra as regras do canal antes de qualquer chamada de API. Sempre com revisão humana antes de publicar.

> **O que este projeto não faz:** não posta, não vota, não cria contas, não manda DM em massa, não raspa o Reddit. A publicação é sempre sua. Essa é a diferença entre um canal que dura anos e uma conta que dura uma semana.

---

## Instalação (30 segundos, zero dependências)

```bash
cd grok-channel-ops
cp .env.example .env       # opcional: preencha XAI_API_KEY para usar o modelo
python3 -m src.cli doctor
```

Requisito: Python 3.10+. Sem `pip install` — o cliente HTTP usa a biblioteca padrão.

---

## Uso

### 0. Canais: a matriz e o validador que evita ban

```bash
python3 -m src.cli canais                     # 20 canais, janela, limite, risco

# testa um payload ANTES de publicar (exit code 3 quando bloqueia)
python3 -m src.cli canais --check instagram_dm --cold        # COLD_DM_META
python3 -m src.cli canais --check linkedin_dm                # LINKEDIN_TOS_8_2
python3 -m src.cli canais --check whatsapp --hours 30        # WINDOW_24H
python3 -m src.cli canais --check tiktok --text "oi"         # TIKTOK_UNAUDITED
python3 -m src.cli canais --check x_post --text "oi"         # ok, US$ 0,015
```

Em código:

```python
from src.channels import validate_channel_post, ChannelViolation, estimate_cost

try:
    validate_channel_post("whatsapp", {"promotional": True,
                                       "hours_since_inbound": 30,
                                       "template_name": "promo_v1"})
except ChannelViolation as e:
    print(e.rule, e.message, e.fix)   # WINDOW_24H ...
```

### 1. Radar: achar as threads que importam

```bash
# demonstração offline, custo zero (dados de exemplo)
python3 -m src.cli radar --source fixture --limit 12

# com o modelo ligado (usa XAI_API_KEY do .env)
python3 -m src.cli radar --source fixture --limit 12 --top 8

# analisar uma thread específica que você colou
python3 -m src.cli radar --source manual --sub r/Goiania --text "Alguém indica corretor no Bueno?"
```

Saída: `output/leads.jsonl` + tabela no terminal, ordenada por score.

### 2. Scribe: redigir a resposta

```bash
python3 -m src.cli scribe --lead output/leads.jsonl --index 0 --save
```

Saída: rascunho no terminal + `output/drafts/draft_00.md` com checklist e avisos de compliance.

### 3. Weekly: decidir com número, não com sensação

```bash
python3 -m src.cli weekly --input output/leads.jsonl \
  --posts 12 --clicks 45 --conversations 6 --trials 2 --sales 1 --revenue 534
```

Saída: `output/weekly.md` com funil, ranking por sub e **veredito** (manter / pivotar / escalar).

### 4. Doctor: checar configuração

```bash
python3 -m src.cli doctor
```

---

## Testes

```bash
python3 tests/test_core.py      # 12 testes, sem pytest
# ou
python3 -m pytest tests -q
```

Os testes cobrem: scoring, parsers, orçamento, guarda-corpo do `x_search`, pipeline ponta a ponta offline, regras de veredito **e as 18 regras do validador multicanal** (cold DM, janela de 24h, LinkedIn §8.2, cota do YouTube, disclosure, compliance de e-mail).

---

## Arquitetura

```
src/
├── cli.py        comandos: radar | scribe | weekly | canais | doctor
├── config.py     tudo por env (.env), nada hardcoded
├── grok.py       cliente Responses API + Budget + Usage + JSON tolerante
├── sources.py    FixtureSource | ManualSource | OAuthSource + parser de rules.yaml
├── pipeline.py   scoring heurístico, prompts, radar, scribe, guard-rails
├── report.py     funil, KPIs e veredito go/no-go
├── channels.py   registry dos 20 canais + validate_channel_post (sem rede)
fixtures/         threads de exemplo (afiliados + imobiliário Goiânia)
prompts/          P1..P12 versionados (P8 adaptador, P9 WhatsApp, P10 repurposing,
                  P11 radar multicanal, P12 auditoria)
rules.yaml        regra por subreddit (link permitido, disclosure, tolerância)
output/           leads.jsonl, weekly.md, drafts/
```

### Fluxo

```
fonte (fixture/manual/oauth)
      ↓
scoring heurístico  ──►  corte de custo (só chama o modelo se passa do limiar)
      ↓
Grok (lead card JSON)  ──►  fila priorizada
      ↓
Grok (rascunho)  ──►  checagens automáticas de compliance
      ↓
HUMANO reescreve e publica
      ↓
weekly.md  ──►  decisão (manter / pivotar / escalar)
```

---

## Controle de custo

| Alavanca | Implementação |
|---|---|
| Cascata de modelos | heurística → `grok-4.1-fast` → `grok-4.3` |
| Orçamento diário | `DAILY_BUDGET_USD` (padrão US$ 1,00) — o cliente **para** ao estourar |
| Teto de `x_search` | `X_SEARCH_POSTS_BUDGET` (padrão 200 posts/dia) |
| Cache de prompt | `prompt_cache_key` estável no system prompt |
| Recorte de contexto | corpo limitado a 2.000 chars + 5 comentários |

Custo medido na simulação do playbook: **≈ US$ 2,34 por 1.000 threads** (triagem + scoring + redação + web search).

---

## Modos de fonte de dados

| Modo | Quando usar | Requer |
|---|---|---|
| `fixture` | desenvolvimento, demo, treinar o time | nada |
| `manual` | analisar uma thread que você viu | nada |
| `oauth` | operação com a API oficial | `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET` aprovados |

A API oficial do Reddit exige acordo para uso comercial (a tabela pública termina em **março de 2027**). Ver `docs/07-compliance.md`.

---

## Segurança e compliance embutidos

- Regra por sub (`rules.yaml`): se `link_allowed: false`, o Scribe **não** coloca link.
- Disclosure obrigatório quando há menção comercial (`DISCLOSURE_MODE=strict`).
- Bloqueio de linguagem de promessa ("garantido", "renda certa").
- Checklist de 8 itens em todo rascunho.
- `[VERIFICAR]` em todo número que o humano precisa confirmar.

---

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `XAI_API_KEY` | — | chave da API xAI (sem ela, roda offline) |
| `XAI_BASE_URL` | `https://api.x.ai/v1` | endpoint (compatível OpenAI-style) |
| `GROK_MODEL` | `grok-4.3` | modelo principal |
| `GROK_MODEL_FAST` | `grok-4.1-fast` | modelo de triagem |
| `REDDIT_SOURCE` | `fixture` | `fixture` \| `manual` \| `oauth` |
| `MIN_SCORE` | `60` | corte de intenção |
| `DAILY_BUDGET_USD` | `1.00` | freio de custo |
| `X_SEARCH_POSTS_BUDGET` | `200` | teto de posts do X por execução |
| `DAILY_DRAFT_CAP` | `8` | rascunhos por dia (anti-overposting) |
| `DISCLOSURE_MODE` | `strict` | disclosure obrigatório |
| `SUBREDDITS` | — | lista separada por vírgula (modo oauth) |
| `LANGUAGE` | `pt-BR` | idioma das respostas |
| `MARKET` | `br` | `br` ou `us` (muda disclosure e regras) |

---

## Limitações conhecidas

1. **Scoring offline é heurístico.** Bom para triagem, não substitui o modelo. Calibre com 20 threads rotuladas (`prompts/P3-radar.md`).
2. **Atribuição é manual.** O bot não vê vendas; você informa os números no `weekly`.
3. **`x_search` não está ligado por padrão.** É a ferramenta mais cara (US$ 5/1.000 posts). Ligue quando tiver orçamento e parâmetros definidos.
4. **Nomes de modelo mudam.** `GROK_MODEL` existe justamente para você trocar sem editar código.
5. **Não substitui julgamento.** Um lead card com score 95 numa thread que você não domina continua sendo uma thread que você não deve responder.

---

## Próximos passos sugeridos

| Prioridade | O que |
|---|---|
| 1 | Rodar o piloto de 14 dias (`docs/10-plano-90-dias.md`) |
| 2 | Rotular 20 threads e calibrar o score |
| 3 | Ligar `x_search` com `from_date` e `allowed_x_handles` |
| 4 | Conectar o `weekly` ao CRM via webhook |
| 5 | Só então considerar Reddit Ads (`prompts/P7-midia.md`) |
