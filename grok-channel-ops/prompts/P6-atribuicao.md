# P6 — Atribuição e painel semanal

O erro de atribuição mais comum no Reddit é tentar rastrear tudo com UTM. Não funciona: a maior parte do tráfego vem de perfil, DM e busca de marca. A solução é **dupla contagem**: o que dá para rastrear e o que só dá para perguntar.

## 1. Três camadas de atribuição

| Camada | O que mede | Como | Confiabilidade |
|---|---|---|---|
| **Link rastreável** | cliques do perfil e do post para o destino | UTM no link do perfil (`?utm_source=reddit&utm_medium=profile&utm_campaign=sub`) | Alta |
| **Pergunta única** | canal declarado | "Como você me encontrou?" no primeiro contato; registrar no CRM | Média-alta |
| **Janela de correlação** | picos após post | comparar DMs/visitas nos 3 dias após cada post | Baixa (só para tendência) |

**Regra:** nunca some as três. Use a camada 1 para otimizar canal e a camada 2 para validar se a camada 1 está certa.

## 2. Planilha mínima (5 colunas)

| Data | Subreddit | Tipo (resposta-âncora / post / educar) | Cliques no perfil | Conversas |
|---|---|---|---|---|
| 2026-11-06 | r/Goiania | resposta-âncora | 4 | 1 |
| 2026-11-07 | r/investimentos | educar | 1 | 0 |

Com 4 semanas disso você descobre qual combinação **sub × tipo** gera conversa. É o único insight que importa no começo.

## 3. Prompt de consolidação

```
Aqui estão meus dados da semana (CSV). Calcule:
1. EPC/CPL por subreddit e por tipo de conteúdo.
2. Qual combinação sub × tipo tem melhor custo por conversa.
3. O que eu deveria PARAR de fazer.
4. O que eu deveria dobrar.
5. Se os números sustentam escalar para mídia paga (regra: 5+ vendas orgânicas
   ou CAC orgânico < 30% do LTV).

Se a amostra for pequena demais para concluir, diga isso explicitamente em vez de
inventar precisão. Mostre a conta.

DADOS:
[colar CSV]
```

## 4. As quatro métricas do painel (nada além disso no primeiro trimestre)

1. **Respostas publicadas** (esforço)
2. **Cliques no perfil** (interesse)
3. **Conversas iniciadas** (intenção real)
4. **Vendas** (resultado)

Tudo o mais — upvote, impressão, karma — é sinal intermediário e não paga conta. Acompanhe, mas não decida por eles.

## 5. Alertas de anomalia

| Sinal | Provável causa | Verificar |
|---|---|---|
| Cliques caem com respostas constantes | perfil/link quebrado ou bio alterada | abrir o perfil deslogado |
| Conversas caem com cliques constantes | oferta desalinhada ou página lenta | testar o destino no celular |
| Vendas caem com conversas constantes | qualificação ruim | revisar `P4` e cortar score < 70 |
| Tudo cai de uma vez | sombra de ban (shadowban) | testar thread deslogado |
