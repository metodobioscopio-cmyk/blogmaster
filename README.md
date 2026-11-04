# BlogMaster — Copiloto de Afiliados (Gringa)

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

## Estrutura

```
index.html              # shell da aplicação
assets/styles.css       # design system (tema escuro)
assets/data.js          # base: ofertas, blueprints, canais, checklists, arsenal, templates
assets/manual.js        # manual prático em 10 seções
assets/app.js           # motor: roteamento, score, gerador, diagnóstico, checklists
tools/keyword_harvest.py  # coleta autocomplete do Google → CSV de termos
tools/cluster_intent.py   # embeddings + KMeans para agrupar search terms por intenção
```

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
