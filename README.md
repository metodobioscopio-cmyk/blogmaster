# VALIDA OS

**Console operacional do Método V.A.L.I.D.A.** — transforma o roadmap de validação de campanhas de afiliados no exterior em números, checklists e vereditos que rodam no navegador.

O problema que ele resolve: 90% do conteúdo sobre marketing de afiliados diz *o que* fazer e nenhum diz **quando parar**. Este app coloca a régua antes do primeiro clique — e recusa escalar o que não foi validado.

---

## O que tem dentro

### As seis letras, cada uma como módulo auditável

| Letra | Módulo | Passos do roadmap |
| --- | --- | --- |
| **V** | Demanda & comissão | 1, 2, 4, 5 — calculadora de comissão mínima viável, orçamento de teste, filtro de demanda |
| **A** | Auditoria & compliance | 3, 6, 18 — 5 concorrentes, 21 regras de compliance por jurisdição, estrutura fiscal |
| **L** | Ângulo & canal | 7, 8, 11, 12 — construtor de ângulo, matriz de adequação por canal, localização |
| **I** | Instrumentação | 9, 10 — UTM + sub-ID, postback, snippets de pixel, 3 criativos por ângulo |
| **D** | Decisão por métrica | 13, 15 — régua de corte, amostragem e veredito estatístico |
| **A** | Ampliação | 17, 19 — escada de 20%/dia com guarda de CPA |

Mais: **Teste de 72h** (cronômetro + registro diário), **Plano de 14 dias** (os 19 passos com ação, porquê, exemplo e armadilha), **Benchmarks 2026**, **Stack OSS & Hugging Face**, **Relatório & template** e **Planos**.

### O motor de cálculo (tudo em `src/lib`, com testes)

```
comissão líquida = ((preço − taxa da rede) × comissão%) × (1 − estorno)
CR de empate     = CPC ÷ comissão líquida
```
O exemplo do roadmap se confirma: comissão de US$ 12 e CPC de US$ 2 exigem **1 conversão a cada 6,0 cliques** (16,67%) para empatar.

**Amostragem** — intervalo de Wilson + teste z de duas proporções:
> Com 1.000 impressões a 1% de CTR você tem ~10 cliques. O IC95 vai de 0,5% a 1,8%. A régua "CTR < 1% = pause" **não é decidível** nessa amostra. O motor responde "colete mais dado" em vez de mandar você matar uma campanha por ruído.

Para ler CTR com ±20% de erro relativo: **~9.510 impressões**. Para 100 cliques legíveis: 10.000 impressões a 1%.

**Orçamento de teste (Passo 13)** — o maior de três pisos vence:
1. piso técnico da plataforma (TikTok: >US$ 50/campanha, >US$ 20/dia por ad group)
2. learning phase: `targetCPA × 50 eventos ÷ 7 dias` (Meta e TikTok)
3. piso estatístico: `CPC × 100 cliques ÷ dias`

Exemplo Meta com CPA alvo de US$ 40 → **US$ 286/dia**, US$ 858 em 72h, ~21 conversões esperadas.

**Veredito (Passo 15)** — SCALE / ITERATE / KILL / *colete mais dado*, com guarda de queima e intervalo de confiança explícito:
- 0 falhas com amostra suficiente → **SCALE**
- 1 falha → **ITERATE** (um eixo por vez)
- 2+ falhas → **KILL**
- gasto > 3× o CPA máximo sem nenhuma conversão → **KILL** imediato
- Zero conversões só conta como falha quando deixa de ser azar: `n = ln(1−confiança) ÷ ln(1−CR de empate)` — para CR de empate de 2%, isso são **114 cliques**.

### Benchmarks com fonte (o roadmap pedia isso em cinco âncoras)

As âncoras `[ÂNCORA NECESSÁRIA] Pesquisar:` do roadmap estão preenchidas na base `src/lib/benchmarks.ts`, com fonte e ano em cada linha:

- **Google Search**: CTR 3,52–6,64% · CPC US$ 2,96–5,42 · CPA US$ 53,52–66,69 (Silverback 2026, Whatagraph 2026)
- **Meta**: CTR 1,20–2,40% · CPC US$ 0,35–2,35 · CPA US$ 12–85 por vertical (RedClawey Q1/2026, AdLibrary 2026)
- **TikTok**: CTR 0,57–1,77% · CPA US$ 16,87–42,60 · Shop com CVR 3,70% (Triple Whale 5.900+ marcas, Silverback)
- **Microsoft**: CPC US$ 1,54 · CPA US$ 41,44 · ROI US$ 2,53 por US$ 1
- **Custo de rede**: ClickBank 7,5% + US$ 1 por venda, US$ 2,50/ciclo, US$ 35 por wire · Amazon 1–20% por categoria, cookie de 24h

**Honestidade metodológica**: as fontes discordam entre si (o CTR do TikTok vai de 0,61% a 1,77% dependendo da base). Isso está exposto, não escondido. Multiplicadores geográficos T2/T3 são **derivação própria marcada como tal** — não existe base pública confiável de CTR/CPA por país, e inventar um número seria vender precisão falsa.

### Compliance como motor, não como texto

21 regras filtradas automaticamente por país-alvo + rede + canal: FTC (16 CFR Part 255, revisão de out/2023, penalidade de US$ 53.088 por violação), Amazon Associates (frase literal obrigatória, proibição de link em e-mail), GDPR, LGPD (arts. 7º, 33–36), políticas de Meta/Google/TikTok, W-8BEN, CNAE, Fator R e IOF.

O app gera o texto de disclosure para a combinação país + rede:
> `As an Amazon Associate, I earn from qualifying purchases. Paid link: I earn a commission for purchases made through links in this page, at no extra cost to you. Resultados variam.`

---

## Rodando

```bash
npm install
npm run dev        # API (8787) + front (5173) juntos
```

- Front: `http://localhost:5173`
- API: `http://localhost:8787/api/health`

Outros comandos:

```bash
npm run typecheck   # tsc --noEmit
npm test            # 105 testes (motor + UI)
npm run build       # typecheck + bundle de produção
npm start           # serve o dist junto com a API
```

O servidor Express serve o `dist/` em produção e faz proxy de `/api` no dev. O front usa **URLs relativas**, então funciona atrás de qualquer proxy/host de preview.

### Variáveis de ambiente

Copie `.env.example` para `.env`. **Sem `STRIPE_SECRET_KEY` o app roda em modo demonstração**: o plano é ativado localmente e nenhuma cobrança é feita.

---

## Monetização

| Plano | Preço | Limites |
| --- | --- | --- |
| Grátis | R$ 0 | 1 campanha, 3 registros de teste, template completo |
| Pro | R$ 47/mês (US$ 12) | 25 campanhas, registros ilimitados, exportação |
| Agência | R$ 147/mês (US$ 37) | Ilimitado, 10 assentos, relatório com marca, import em lote |

Anual com 2 meses grátis. Checkout por `POST /api/checkout` → Stripe (assinatura, `allow_promotion_codes`, referral via `client_reference_id`).

**Programa de indicação do próprio app**: 30% recorrente por 12 meses, cookie de 90 dias, link gerado com UTM e sub-ID no esquema que o Passo 9 ensina — o produto aplica o método a si mesmo.

**Lead magnet**: o template "Campanha Validada em 14 Dias" é gerado localmente e baixa **mesmo sem cadastro**. O formulário é opcional, com consentimento explícito (LGPD art. 7º) e endpoint `/api/leads` com deduplicação. Fricção obrigatória seria incoerente com o que o próprio método prega sobre disclosure.

---

## Stack aberta mapeada por passo

O catálogo em `src/lib/catalog.ts` foi verificado na API do GitHub e do Hugging Face em **01/10/2026** — estrelas, licença e data do último push são dados reais, e projetos parados vêm com ressalva explícita.

| Passo | Ferramenta | Estrelas / licença |
| --- | --- | --- |
| 9 Rastreamento | `dubinc/dub` | 24.851 ★ |
| 9 Analytics | `PostHog/posthog` · `umami-software/umami` | 40.060 ★ · 39.107 ★ MIT |
| 6 GDPR | `matomo-org/matomo` | 21.917 ★ GPL-3.0 |
| 8 Funil | `knadh/listmonk` · `formbricks/formbricks` | 23.643 ★ AGPL · 13.047 ★ |
| 10 Teste A/B | `growthbook/growthbook` | 8.462 ★ |
| 17 Automação | `n8n-io/n8n` · `kestra-io/kestra` | 206.430 ★ · 28.594 ★ Apache-2.0 |
| 18 Contratos | `docusealco/docuseal` · `documenso/documenso` | 18.637 ★ · 15.280 ★ AGPL-3.0 |
| 4 Demanda | `pat310/google-trends-api` | 974 ★ MIT (sem push desde 2022 — com ressalva) |
| 9 Atribuição | `DP6/Marketing-Attribution-Models` | 370 ★ Apache-2.0 |

**Hugging Face**: `marketeam/Qwen-Marketing` (MIT, finetune de Qwen3-8B, 5.650 downloads), `neuralmind/bert-base-portuguese-cased` (MIT, 192.853 downloads), `coastalcph/lex_glue` (CC-BY-4.0), `Angrybird12/ad-display_click-data_taobao.com` (licença não declarada — só uso interno), `yothinS/gemma4-thai-marketing.gguf` (Apache-2.0).

---

## Arquitetura

```
src/
  lib/            motor puro, testável, sem React
    breakEven.ts       comissão mínima viável e engenharia reversa
    sampleSize.ts      Wilson, z-test, tamanho de amostra
    decision.ts        veredito SCALE/ITERATE/KILL + guarda de queima
    offerScore.ts      score V.A.L.I.D.A. e portão do teste
    scaleLadder.ts     simulação de degraus de 20% com guarda de CPA
    budget.ts          os três pisos de orçamento
    compliance.ts      21 regras × país × rede × canal + disclosure
    tracking.ts        UTM, sub-ID, postback, snippets de pixel
    benchmarks.ts      base 2026 com fonte em cada linha
    catalog.ts         stack OSS + Hugging Face verificada
    report.ts          relatório de 9 seções + template do lead magnet
    steps.ts           os 19 passos e o checklist final
  state/store.tsx   reducer + persistência em localStorage + migração
  pages/            14 módulos
  components/       design system
server/index.ts     Express: health, config, benchmarks, leads, checkout, dist
```

O motor é TypeScript puro sem dependências — dá para testar, portar para Node e reusar num worker. Os dados do usuário ficam no `localStorage`; o servidor só cuida de lead, benchmark, health e checkout. Nada de telemetria.

---

## Limites assumidos

1. **Não é aconselhamento jurídico, contábil ou financeiro.** O módulo de compliance é checklist operacional para você chegar preparado na conversa com contador e advogado.
2. **Multiplicadores geográficos T2/T3 são derivação**, não dado publicado — marcados na interface.
3. **Taxa de rede é configurável** porque ela muda por contrato; o padrão vem da documentação pública de cada rede.
4. **Sem backend de dados.** O que você lança vive no navegador. Baixe o backup em Relatório & template.
5. Benchmarks de mídia mudam trimestralmente — revise a base antes de cada ciclo.

---

## Licença e créditos

Código do app: uso livre para o proprietário do repositório. Benchmarks, produtos de terceiros e ferramentas citadas pertencem aos seus autores, com atribuição e fonte em cada ponto de uso.
