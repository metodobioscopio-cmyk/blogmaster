# P7 — Decisão de mídia (Reddit Ads)

Só use este prompt **depois** de ter vendas orgânicas. Anúncio amplifica o que já funciona; ele não conserta uma oferta fraca.

## O cálculo antes da conversa

```
LTV de comissão (afiliado) = ticket × % comissão × meses de retenção
LTV de comissão (imobiliária) = ticket do imóvel × % comissão × taxa de fechamento por lead
CAC máximo aceitável = LTV × 0,30
```

Exemplos verificáveis:

| Caso | Conta | CAC máximo |
|---|---|---|
| SaaS, US$ 99/mês, 30% de comissão, 18 meses | 99 × 0,30 × 18 = US$ 534,60 | US$ 160 |
| Imóvel R$ 818 mil, 5% de comissão, 2% de fechamento por lead | 40.900 × 0,02 = R$ 818 por lead | R$ 245 |

Se o CPL da sua campanha ficar **acima de 40% do CAC máximo**, corte. Se ficar **abaixo de 20%**, escale.

## Benchmarks para calibrar a expectativa (2026)

| Formato | CPC | CPM | CTR | CPL típico |
|---|---|---|---|---|
| Promoted Post imagem | US$ 0,75–2,00 | US$ 5–12 | 1,5–3,0% | US$ 15–120 |
| **Conversation Ad** | US$ 0,75–2,50 | US$ 6–14 | **2,0–4,0%** | o mais baixo |
| Carrossel | US$ 0,80–2,50 | US$ 6–12 | 1,0–2,0% | médio |
| Free-form (texto longo) | US$ 0,50–2,00 | US$ 4–10 | 1,0–2,5% | médio |
| Lead Gen Ad (form nativo) | — | — | — | US$ 15–120 |

## Prompt de decisão

```
Você é um media buyer sênior especializado em Reddit Ads.

MEUS NÚMEROS
- LTV de comissão por cliente: [US$ ou R$]
- CAC máximo aceitável (30% do LTV): [ ]
- Vendas orgânicas via Reddit até hoje: [ ]
- Orçamento disponível: [ ] (por dia e total)
- Público: [afiliado / imobiliário], mercado [BR / EUA]
- Subreddits que já funcionaram organicamente: [ ]

TAREFA
1. Diga GO ou NO-GO, com a razão em 2 frases.
2. Se GO: formato recomendado (justifique entre Conversation Ad e Promoted Post),
   budget diário, duração do teste e 3 critérios de corte com números.
3. Se NO-GO: o que precisa acontecer antes de investir 1 real em mídia.

REGRAS
- Teste com menos de US$ 50/dia por 14 dias não gera dado estatisticamente útil.
- Considere que conversão de clique em lead fica entre 2% e 4%.
- Se o LTV não sustentar o CPL da tabela de benchmarks, recomende NO-GO.
- Mostre a conta em cada critério.
```

## Estrutura de campanha que funciona (2026)

| Nível | O que fazer |
|---|---|
| Campanha | 1 objetivo só (conversão ou tráfego); nunca dois |
| Ad group | 1 por subreddit, para isolar aprendizado |
| Segmentação | Subreddit + keyword, não interesse amplo no começo |
| Criativo | **3 peças por ad group**, tom de comentário, sem CTA agressivo |
| Comentários | **Permitir e responder** — melhora qualidade e CTR |
| Pixel | Instalar antes de rodar; sem pixel você está no escuro |

## Os 4 erros que queimam orçamento

1. **Rodar em sub que odeia promoção.** Cai o CTR e sobe o CPC. Use sub de tolerância média/alta.
2. **Criativo com cara de anúncio de Facebook.** Reddit pune visual corporativo.
3. **Testar com US$ 5/dia.** Três cliques por dia não são amostra.
4. **Julgar em 3 dias.** O algoritmo precisa de 4–6 semanas para estabilizar.

## Regra de ouro final

Anúncio no Reddit compra **atenção**, não **confiança**. A confiança continua vindo do comentário, do histórico e da prova. Por isso a campanha que melhor converte é a que leva para um conteúdo seu que já é bom — não para uma landing page genérica.
