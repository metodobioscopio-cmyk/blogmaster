# Plano de 90 dias e piloto de 14 dias — executável

> Dois trilhos rodando em paralelo com orçamento separado e critérios de corte independentes. Se um dos dois falhar, o outro continua. A regra do plano: **nenhuma decisão por sensação — cada fase tem métrica e corte definidos antes de começar.**

---

## 1. Orçamento total

| Item | Valor | Quando | Observação |
|---|---|---|---|
| API xAI | **US$ 20/mês** | contínuo | suficiente para 1 operador e 3 subs |
| Conta Reddit | US$ 0 | dia 0 | precisa ter 30+ dias de idade |
| Ferramentas (opcional) | US$ 0–30/mês | dia 15+ | Reddit Pro é grátis; F5Bot/Syften só se sentir falta |
| Domínio + hub (perfil como funil) | US$ 12/ano | dia 7 | pode ser Notion público, custo zero |
| Mídia (afiliados) | US$ 420 | dia 60+ | só após 5 vendas orgânicas |
| Mídia (imobiliário) | R$ 3.000–8.000 | dia 45+ | só após 2 visitas agendadas |
| **Total sem mídia** | **≈ US$ 22/mês** | | o custo real é tempo |

---

## 2. Estrutura de semanas

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

| Sintoma | Causa provável | Ação |
|---|---|---|
| Post removido | Regra do sub / tom de anúncio | Ler regra, reescrever, pedir desculpa ao mod por modmail |
| Conta sem views | Shadowban por link repetido | Pausar 30 dias, remover links, testar deslogado |
| Muitos downvotes | Tom arrogante ou número errado | Revisar tom; conferir fonte |
| Zero DM | Oferta fraca ou thread errada | Testar outra rota (2 ou 8) |
| Muita DM e pouca venda | Qualificação ruim | Usar `P4` e cortar score < 70 |
| Custo de API subiu | `x_search` sem teto ou contexto inflado | Aplicar alavancas do Playbook §4 |
| Cansaço no dia 20 | Rotina insustentável | Reduzir para 30 min/dia e priorizar rota 2 |

---

## 7. Relatório de 90 dias (o documento que decide o trimestre)

Estrutura de uma página:

1. **Números:** respostas, cliques, conversas, vendas, receita, custo total, custo por venda.
2. **Ranking de rotas:** qual gerou mais conversa e qual gerou mais venda (não são a mesma).
3. **Ranking de subs:** EPC/CPL por comunidade.
4. **O que eu errei:** 3 decisões que custaram tempo.
5. **Decisão:** escalar / manter / pivotar / encerrar — com o número que sustenta a decisão.
6. **Próximo trimestre:** 1 meta, 1 aposta, 1 coisa que vou parar de fazer.

---

## 8. Quem faz o quê (se você tiver sócio ou equipe)

| Papel | Responsabilidade | Tempo |
|---|---|---|
| **Operador** | Radar, revisão, publicação, relacionamento | 45 min/dia |
| **Especialista** (você, corretor, afiliado) | Conhecimento, números, credibilidade | 2 h/semana |
| **Editor** (opcional) | Reescrever no tom, revisar compliance | 1 h/semana |
| **Analista** (opcional) | Painel, atribuição, P6 | 1 h/semana |

Com uma pessoa só, os quatro papéis são a mesma pessoa em horários diferentes — e é por isso que o bot precisa economizar 2 horas por dia, não 10 minutos.
