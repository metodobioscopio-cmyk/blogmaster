# Plano de 90 dias e piloto de 14 dias — executável em 6 canais

> Dois trilhos rodando em paralelo com orçamento separado e critérios de corte independentes. Se um dos dois falhar, o outro continua. A regra do plano: **nenhuma decisão por sensação — cada fase tem métrica e corte definidos antes de começar.**
>
> **E a regra dos canais:** cada trilho começa em **1 canal de intenção + 1 de conversa** e só abre o terceiro canal depois de 30 dias estáveis. A sequência está na seção 2.1.

---

## 1. Orçamento total

| Item | Valor | Quando | Observação |
|---|---|---|---|
| API xAI (redação + radar) | **US$ 20/mês** | contínuo | 1 operador, 3 fontes |
| API do X (leitura + posts) | **US$ 22–30/mês** | dia 7+ | US$ 0,005/leitura; link só na resposta |
| Telegram | US$ 0 | dia 1 | valida o fluxo sem risco |
| WhatsApp Cloud (marketing) | **R$ 322/mês** (se 1.000 msgs) | dia 15+ | serviço: 1.000 grátis |
| Instagram (publicação) | US$ 0 | dia 15+ | custo é vídeo: US$ 2,10/Reel |
| Grok Bot (agente) | **US$ 30/mês** | dia 20+ | opcional; substitui orquestração manual |
| Ferramentas (opcional) | US$ 0–30/mês | dia 30+ | Reddit Pro é grátis; n8n self-host, US$ 0 |
| Domínio + hub (perfil como funil) | US$ 12/ano | dia 7 | pode ser Notion público |
| Mídia (afiliados) | US$ 420 | dia 60+ | só após 5 vendas orgânicas |
| Mídia (imobiliário) | R$ 3.000–8.000 | dia 45+ | só após 2 visitas agendadas |
| **Total sem mídia** | **≈ US$ 95–115/mês** | | o custo real é tempo |

---

## 2. Estrutura de semanas

### 2.1 A sequência de canais (não abra dois de uma vez)

| Mês | Canal de intenção | Canal de conversa | Canal de prova | Total ativo |
|---|---|---|---|---|
| **1** | Reddit (+ Telegram para validar) | — | — | 2 |
| **2** | Reddit + X | WhatsApp | — | 3 |
| **3** | Reddit + X | WhatsApp | Instagram (orgânico) | 4 |
| **4** | os mesmos | os mesmos | + YouTube ou Nextdoor | 5 |
| **5+** | + TikTOk *só se* audit aprovado | os mesmos | + Threads/Bluesky (teste) | 6–7 |

**Por que essa ordem:** Reddit é onde o erro custa menos (texto público, sem custo por mensagem). X cobra por leitura, então só entra quando você já sabe qual termo converte. WhatsApp entra quando há conversa para atender. Instagram entra como prova, não como aquisição. **TikTok é o último** porque depende de audit e vídeo.

### 2.2 Calendário

| Semana | Trilho afiliados | Trilho imobiliário | Entrega comum |
|---|---|---|---|
| 1 | P1+P2; 2 programas; conta pronta | P1+P2; 2 bairros; base de m² com fonte | `nicho.md`, `subs.md`, `kb/` |
| 2 | Só comentário útil (rota 3) | Só comentário útil (rota 3) | 10 comentários cada |
| 3 | Comentário útil + radar diário | Comentário útil + 1ª análise de bairro | 1 post publicado |
| 4 | 1ªs menções com disclosure | Responder 3 threads de "indica corretor" | 1ª DM recebida |
| 5–6 | Post de caso; medir cliques | Segunda análise (outro bairro); parceria com criador local | P6 rodado |
| 7–8 | Matar sub que não converte; dobrar o que converte | Primeiras visitas agendadas | Revisão de `rules.yaml` |
| 9–10 | Se ≥5 vendas → testar US$ 30/dia | Se ≥2 visitas → testar R$ 100/dia | P7 rodado |
| 11–12 | Escalar ou pivotar oferta | Escalar ou pivotar bairro | Relatório de 90 dias |
| 13 | Decisão go/no-go de cada trilho | idem | Plano do trimestre seguinte |

---

## 3. Piloto de 14 dias — runbook diário

### Trilho A — Afiliados

| Dia | Ação (tempo) | Saída esperada |
|---|---|---|
| 0 | Criar/verificar conta Reddit; escolher nicho e 2 programas (60 min) | `nicho.md` |
| 1 | P1 + P2; ler regra de 6 subs; preencher `rules.yaml` (60 min) | `subs.md` |
| 2 | Rodar radar em fixture/manual; rotular 20 threads à mão; comparar (45 min) | precisão do score |
| 3 | Ajustar prompt do Radar com os erros; rodar de novo (30 min) | score ≥70% |
| 4 | 2 comentários úteis, sem menção (30 min) | karma +4 |
| 5 | 2 comentários úteis (30 min) | karma +6 |
| 6 | 2 comentários úteis + 1 resposta-âncora sem menção (45 min) | 1º clique no perfil |
| 7 | Revisão da semana; ajustar `rules.yaml` (20 min) | painel semana 1 |
| 8 | 1 resposta-âncora **com** menção + disclosure (30 min) | 1ª conversa |
| 9 | 2 comentários úteis (30 min) | — |
| 10 | 1 resposta-âncora com menção + P5 (30 min) | 2ª conversa |
| 11 | 2 comentários úteis (30 min) | — |
| 12 | Post de caso curto (800 palavras, números reais) (120 min) | 1 post |
| 13 | Responder todos os comentários do post (45 min) | engajamento |
| 14 | Rodar P6; preencher painel; decidir continua/pivota (45 min) | relatório |

### Trilho B — Imobiliário

| Dia | Ação (tempo) | Saída esperada |
|---|---|---|
| 0 | Definir bairros e segmento; levantar m²/valorização com fonte (90 min) | `kb/bairros/*.md` |
| 1 | P2; ler regra de r/Goiania, r/investimentos, r/brasil (45 min) | `rules.yaml` |
| 2 | Radar em modo manual; 3 threads analisadas (30 min) | lead cards |
| 3 | Calibrar score; testar cálculo de ITBI/financiamento (30 min) | calculadora validada |
| 4–6 | 2 comentários/dia com número e fonte (30 min/dia) | reconhecimento |
| 7 | Publicar análise de bairro nº 1 (150 min) | post no ar |
| 8–9 | Responder comentários; 2 comentários/dia (45 min) | DMs |
| 10 | Responder thread de "indica corretor" com CRECI + comparativo (30 min) | 1ª DM qualificada |
| 11 | Segunda análise (bairro 2) ou tour em vídeo (90 min) | 2º post |
| 12 | Abordar 1 criador local para parceria (30 min) | conversa iniciada |
| 13 | Consolidar DMs; registrar consentimento no CRM (30 min) | pipeline |
| 14 | P6 + relatório; decidir continua/pivota (45 min) | relatório |

---

## 4. Painel de KPIs (preencher toda sexta)

| Métrica | Meta semanal (afiliados) | Meta semanal (imobiliário) |
|---|---|---|
| Threads analisadas | 200 | 60 |
| Cards com score ≥ 60 | 18 (9%) | 8 (13%) |
| Respostas publicadas | 12 | 12 |
| Remoções | **0** | **0** |
| Cliques no perfil | 40 | 25 |
| Conversas iniciadas | 5 | 6 |
| Trials / visitas agendadas | 1,5 | 2 |
| Vendas / propostas | 0,5 | 0,5 |
| Custo de API | US$ 4,50 | US$ 4,50 |

**Como ler:** se remoções > 0, **pare tudo e reescreva o tom**. Se cliques = 0 com 12 respostas, o problema é a oferta/sub, não o volume. Se trials = 0 com 40 cliques, o problema é a página de destino.

---

## 5. Critérios de corte e de escala

::: decisao
**Cortar (pivotar oferta ou sub):** 14 dias com 0 clique no perfil, OU qualquer remoção, OU custo por lead > US$ 10 (afiliado) / R$ 400 (imobiliário).
**Manter:** 1 trial/visita por semana e EPC/CPL dentro da meta.
**Escalar:** 5+ vendas (afiliado) ou 2+ visitas (imobiliário) e custo orgânico < 30% do LTV. Aí entra mídia.
**Escalar de verdade:** só com um segundo par de mãos — um operador não passa de ~15 respostas/dia com qualidade.
:::

---

## 6. O que fazer quando algo dá errado (árvore de decisão)

| Sintoma | Canal | Causa provável | Ação |
|---|---|---|---|
| Post removido | Reddit | Regra do sub / tom de anúncio | Ler regra, reescrever, pedir desculpa ao mod por modmail |
| Conta sem views | Reddit | Shadowban por link repetido | Pausar 30 dias, remover links, testar deslogado |
| `outside the allowed window` | Meta | Mensagem fora das 24h | Usar template aprovado; esperar a pessoa escrever |
| Block rate > 2% | WhatsApp | Mensagem para quem não pediu | Parar disparo, auditar lista, reconstruir opt-in |
| Post sai privado | TikTok | App sem audit | Submeter ao audit; não insistir |
| `quotaExceeded` | YouTube | 10.000 unidades/dia estouradas | Reset à meia-noite do Pacífico; enfileirar |
| Custo de X 10× o previsto | X | Post com link em vez de sem link | Link na resposta (US$ 0,015 vs US$ 0,20) |
| Conta restrita | LinkedIn | Automação de sessão | Nunca automatizar; §8.2 |
| Zero conversa | todos | Oferta fraca ou canal errado | Trocar rota (2 ou 8), não aumentar volume |
| Muita conversa e pouca venda | WhatsApp | Qualificação ruim | Usar `P4`; cortar score < 70; handoff humano cedo |
| Custo de API subiu | xAI | `x_search` sem teto ou contexto inflado | Alavancas do Playbook §4 |
| Cansaço no dia 20 | todos | Rotina insustentável | Reduzir para 30 min/dia; fechar canais extras |

---

## 7. Relatório de 90 dias (o documento que decide o trimestre)

Estrutura de uma página:

1. **Números:** respostas, cliques, conversas, vendas, receita, custo total, custo por venda.
2. **Ranking de canais:** qual gerou conversa, qual gerou venda, qual só consumiu tempo (não são o mesmo).
3. **Ranking de rotas e subs:** EPC/CPL por comunidade.
4. **Auditoria de canal:** rodar `P12` em cada canal ativo — GO / AJUSTAR / NO-GO.
5. **O que eu errei:** 3 decisões que custaram tempo.
6. **Decisão:** escalar / manter / pivotar / encerrar — com o número que sustenta a decisão.
7. **Próximo trimestre:** 1 meta, 1 aposta, 1 coisa que vou parar de fazer (e 1 canal que vou fechar).

---

## 8. Quem faz o quê (se você tiver sócio ou equipe)

| Papel | Responsabilidade | Tempo |
|---|---|---|
| **Operador** | Radar nos 3 canais, revisão, publicação, relacionamento | 45 min/dia |
| **Especialista** (você, corretor, afiliado) | Conhecimento, números, credibilidade | 2 h/semana |
| **Editor** (opcional) | Reescrever no tom, revisar compliance | 1 h/semana |
| **Analista** (opcional) | Painel, atribuição, P6 | 1 h/semana |

Com uma pessoa só, os quatro papéis são a mesma pessoa em horários diferentes — e é por isso que o bot precisa economizar 2 horas por dia, não 10 minutos.
