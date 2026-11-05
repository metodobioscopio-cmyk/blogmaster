# BlogMaster — Copiloto de Afiliados (Gringa) + CirurgiaAfiliada (MVP BR)

Aplicação web (HTML/CSS/JS puro, zero build) que funciona como **copiloto interativo**
para campanhas de afiliado no mercado gringo: radar de produto com score, blueprints de
campanha já validados, diagnóstico de campanha, gerador de presell/anúncios, matriz de
intenção (Custom Intent), calculadora de viabilidade, checklists de compliance, plano de
7 dias, arsenal curado de GitHub + Hugging Face e manual prático completo.

## Rodar

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

Não precisa de instalação, servidor Node, nem chave de API. Todo o estado que você digita
(checklists, plano, caderno) fica no `localStorage` do navegador.

## Duas camadas, um app

O menu tem dois grupos e **nada foi removido**:

**CirurgiaAfiliada (MVP)** — `assets/cirurgia.js`
Home com posicionamento e onboarding 3 passos · Diagnóstico determinístico de 5 perguntas ·
Redes 2026 (10 redes com status de verificação) · Stack & MCPs auditados · Método BOFU
(Thiago Boeiras, números preservados) · Reddit playbook + clonagem legal · Dashboard com
pipeline, checklist diário, **validador de campanha (dry-run de YAML)** , **FTC checker** e
UTM builder · Spec verificada item a item.

### Fluxo único `Executar plano`

Diagnóstico → Radar → Gerador em um clique. A oferta escolhida é travada, o briefing vem
pré-preenchido pelo nicho, e o app monta de uma vez:

1. **presell** no formato do canal, com disclosure FTC;
2. **YAML** de campanha validado pelas mesmas 10 regras do dry-run;
3. **UTM + sub-id** prontos;
4. **4 gates de liberação** — dados da oferta · estrutura própria (domínio sem a marca do
   produto) · campanha + disclosure · compliance de copy. Gate vermelho **bloqueia** o botão
   de execução;
5. **execução**: `POST /ads/create_campaign` no bridge (sempre `PAUSED`) ou prompt pronto
   para colar no MCP.

O plano vive em `localStorage` (`bm__fx`) e se espelha no Radar, no Gerador e no Dashboard —
sobrevive ao reload.

### Plano → Copiloto → Histórico

- **Copiloto de decisão** recebe do plano: canal, comissão da oferta e orçamento de teste
  (banner "Plano ativo" + botão *Preencher com o plano*). Com números, já diagnostica.
- **Histórico de planos** (`localStorage` `bm_planos`): cada plano executado vira uma linha.
  Umbral de comparação é **RPC por ângulo** — agrega cliques, gasto, vendas e mostra
  `RPC ÷ CPC` por ângulo, com barra de força relativa. Um plano novo por variação de
  oferta/ângulo/formato/canal; reabrir um plano antigo continua o mesmo teste.
- Números do Copiloto voltam automaticamente para o plano do histórico, e o histórico
  alimenta o Copiloto no sentido inverso (diagnosticar um plano antigo).
- Export/import JSON do histórico; nada sai do navegador.

**Copiloto** — cockpit, radar de 21 ofertas, 8 blueprints de campanha, diagnóstico de
campanha, gerador de presell, keyword/intenção, viabilidade, compliance, plano de 7 dias,
arsenal GitHub/HF, integrações MCP e manual.

```bash
# os dois eixos usam o mesmo bridge quando precisam de rede
python3 tools/mcp_bridge.py --port 8791
```

## Estrutura

```
index.html              # shell da aplicação
assets/styles.css       # design system (tema escuro)
assets/data.js          # base: ofertas, blueprints, canais, checklists, arsenal, templates
assets/manual.js        # manual prático em 10 seções
assets/cirurgia.js      # MVP CirurgiaAfiliada: redes, stack, método, reddit, spec auditada
assets/app.js           # motor: roteamento, score, gerador, diagnóstico, checklists
tools/keyword_harvest.py  # coleta autocomplete do Google → CSV de termos
tools/cluster_intent.py   # embeddings + KMeans para agrupar search terms por intenção
tools/mcp_bridge.py       # bridge local (stdlib only): Ads REST, Rally MCP via STDIO, ProdIntel
```

## Integrações (aba ⚡)

Tudo passa pelo `tools/mcp_bridge.py`, por três motivos técnicos: **CORS**, **token fora
do navegador** (o app é estático) e **Rally MCP só falar JSON-RPC sobre STDIO**.

```bash
export ADSPIRER_TOKEN=sk_live_...        # https://adspirer.ai/keys
export ML_AFFILIATE_ID=... SHOPEE_APP_ID=... SHOPEE_SECRET=...
python3 tools/mcp_bridge.py --port 8791
```

| Pilar | Ferramenta | Rota no bridge | Verificado 05/11/2026 |
|---|---|---|---|
| Execução de anúncios | Adspirer / `amekala/ads-mcp` | `POST /ads/<tool>` | REST `api.adspirer.ai/api/v1/tools/<tool>/execute`, Bearer `sk_live_`. Free = **15 chamadas/mês** (Plus 150/US$49, Pro 600/US$99, Max 3.000/US$199). Campanhas nascem **pausadas**. |
| Mercado BR | `@andrehocsis/rally-mcp-server` v1.0.0 | `POST /rally/<tool>` | Existe no npm; 6 tools (`search_products`, `trending_products`, `analyze_product`, `generate_affiliate_link`, `generate_copy`, `commission_calculator`); env `ML_AFFILIATE_ID`, `SHOPEE_APP_ID`, `SHOPEE_SECRET`. |
| Sinais ao vivo | ProdIntel `alicelabs-llc/Scraper` | `GET /signals`, `GET /reputation?domain=` | `/api/signals` é GET **sem query de produto** (trending global), 40 req/min, cache 900s. `api/reputation` é o gate de domínio. |

O app funciona 100% sem bridge — as integrações são upgrade opcional.

## Módulos

| Módulo | O que entrega |
|---|---|
| Cockpit | visão geral + fluxo do funil |
| Radar de produto | 21 ofertas gringas com score 0–100 (EPC, APV, CVR, gravity, risco) + plano de ataque |
| Campanhas validadas | 8 arquétipos (Display Custom Intent, Remarketing 3 camadas, Search marca, Demand Gen, Native, Meta, Bing, Email/SEO) com KPIs e critério de decisão |
| Copiloto | transforma gasto/cliques/vendas em escalar · ajustar · cortar |
| Gerador | presell em 4 formatos (advertorial, review, quiz, ponte VSL) + headlines + roteiro de vídeo |
| Keyword & intenção | matriz de termos classificada por intenção, CSV e cópia para Custom Segment |
| Viabilidade | CPC máximo, orçamento de teste, lucro por venda, builder de URLs de rastreio |
| Compliance | 46 pontos em 3 checklists (destino, Google, Meta) |
| Plano de 7 dias | execução com entregas diárias e progresso salvo |
| Arsenal GitHub / HF | 25 repositórios e 12 modelos, cada um com "como usar hoje" |
| Manual | 10 seções de fundamentos a glossário |
| Caderno | diário de decisões com export/import JSON |

## Aviso

Métricas de oferta (gravity, EPC, APV, CVR) são referência de mercado — snapshot de
nov/2026 — e mudam semanalmente. Confirme sempre no painel da rede antes de investir.
Nada aqui é garantia de resultado; o app existe para você decidir com número, não com achismo.
