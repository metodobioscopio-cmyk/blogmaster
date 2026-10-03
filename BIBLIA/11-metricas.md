# 11 · Métricas e Diagnóstico — onde está o vazamento

> Você não precisa de mais pins. Precisa saber **qual número está travando**. Este capítulo é o manual de leitura.

---

## 11.1 Os 8 KPIs que importam (e os 3 que não)

| ✅ Meça isso | ❌ Ignore isso |
|---|---|
| Impressões (crescimento semanal) | Curtidas |
| CTR de saída (cliques ÷ impressões) | Seguidores |
| Saves por 1.000 impressões | Repins |
| Cliques de saída | Comentários |
| Conversão (vendas ÷ cliques) | Visualizações de perfil |
| Receita por 1.000 impressões (RPM) | "Está viralizando?" |
| Vida útil do pin (cliques no mês 3) | |
| % de pins mortos | |

**Por que ignorar os outros:** 97% das buscas do Pinterest são não-marcadas — seguidores não decidem distribuição. E o top 1% dos pins gera mais de 50% das impressões: seu trabalho é produzir tentativas, não colecionar aplausos.

---

## 11.2 Benchmarks de referência

| Métrica | Fraco | OK | Bom | Excelente |
|---|---|---|---|---|
| **CTR de saída** | < 0,2% | 0,3% | 0,5% | > 1% |
| **Saves / 1k impressões (estático)** | < 3 | 5 | 8 | > 15 |
| **Saves / 1k (vídeo)** | < 8 | 13 | 20 | > 30 |
| **Conversão (vendas/cliques)** | < 0,3% | 0,5% | 1% | > 2% |
| **Vida útil do pin** | dias | semanas | 3 meses | 6+ meses |
| **Taxa de pins "mortos"** | — | ~70-80% é normal | — | — |

---

## 11.3 Como calcular (fórmulas prontas)

```
CTR de saída        = (cliques ÷ impressões) × 100
Taxa de save        = (saves ÷ impressões) × 1000
Conversão           = (vendas ÷ cliques) × 100
RPM (receita/1k)    = (receita ÷ impressões) × 1000
Receita por clique  = receita ÷ cliques
EPC (ganho por 100 cliques) = receita ÷ cliques × 100
```

**Exemplo prático:**
```
Impressões: 80.000 | Cliques: 320 | Saves: 480 | Vendas: 3 | Receita: R$ 145,50

CTR de saída = 320/80.000 × 100 = 0,40%      → OK (dentro do esperado)
Taxa de save = 480/80.000 × 1000 = 6,0/1k    → OK
Conversão    = 3/320 × 100 = 0,94%           → OK, quase bom
RPM          = 145,50/80.000 × 1000 = R$ 1,82 → a régua do seu negócio
```

**A régua que importa:** RPM. Se um pin tem RPM de R$ 1,82 e outro de R$ 0,40, produza 5 variações do primeiro para cada nova do segundo. É assim que se escala com dados em vez de intuição.

---

## 11.4 A árvore de diagnóstico (o fluxo completo)

```
IMPRESSÕES ESTÃO SUBINDO?
│
├── NÃO → Problema de DISTRIBUIÇÃO
│   ├── Publicando menos de 3 pins/dia? → aumente o volume
│   ├── Pins repetidos/sem frescor? → crie designs genuinamente novos
│   ├── Conta em suspeita (volume alto, muito afiliado)? → reduza, aumente 80/20
│   ├── Densidade de keyword baixa? → título 40-60 car. + nome do arquivo + board
│   └── Nada disso? → rode o Prompt 12 com os números
│
└── SIM → continuar
    │
    CLICKS DE SAÍDA ESTÃO SUBINDO?
    │
    ├── NÃO → Problema de PROMESSA ou VISUAL (a pessoa vê, não clica)
    │   ├── Overlay com menos de 5 palavras? → aumente (5-8 palavras +110% cliques)
    │   ├── Contraste fraco? → teste do brilho a 30%
    │   ├── Promessa vaga? → rode o Prompt 6 (20 títulos)
    │   ├── Imagem com "cara de IA"? → gere 5 e escolha a mais natural
    │   └── Público errado? → olhe demografia do Pinterest Analytics
    │
    └── SIM → continuar
        │
        AS VENDAS ESTÃO ACONTECENDO?
        │
        ├── NÃO → Problema de PÁGINA ou OFERTA
        │   ├── Link quebrado? → teste em janela anônima
        │   ├── Promessa do pin ≠ conteúdo da página? → alinhe
        │   ├── Aviso de afiliado ausente? → risco de compliance E queda de confiança
        │   ├── Página longa/lenta/com excesso de anúncio? → simplifique
        │   ├── Preço acima de R$ 297 em tráfego frio? → use uma isca grátis antes
        │   ├── Oferta sem prova social? → troque de produto
        │   └── Página boa e oferta boa? → o problema é o volume: 320 cliques/mês
        │       ainda é pouco para julgar. Continue e acumule 2.000 cliques.
        │
        └── SIM → ESCALE
            ├── Crie 5 variações do pin vencedor
            ├── Replique o formato em outro ângulo
            ├── Aplique os UTMs para saber QUAIS pins vendem
            └── Aumente o ticket (upsell, combo, produto próprio)
```

---

## 11.5 Os 5 vazamentos clássicos e a correção exata

### Vazamento 1 — Muito save, pouco clique
**Diagnóstico:** o conteúdo é ótimo, mas é "colecionável" e não "acionável".
**Correção:** adicione um verbo de ação no overlay ("teste", "veja o passo a passo", "copie a lista") e garanta que a promessa só se complete na página. Um pin que entrega tudo na imagem não precisa de clique.

### Vazamento 2 — CTR bom, conversão péssima
**Diagnóstico:** quebra de expectativa. O pin promete A e a página entrega B.
**Correção:** alinhe palavra por palavra. Se o pin diz "3 organizadores que cabem em qualquer cozinha", a página precisa ter esses 3 organizadores acima da dobra.

### Vazamento 3 — Poucas impressões com bons pins
**Diagnóstico:** problema de frescor ou de keyword, não de qualidade.
**Correção:** confirme 5 elementos — título (40-60 car.), descrição, nome do arquivo, board e alt text. Depois publique 3-5 pins/dia por 30 dias sem alterar nada (constância é variável de teste).

### Vazamento 4 — Nada funciona em nenhum ângulo
**Diagnóstico:** a **oferta** está errada, não o conteúdo.
**Correção:** volte ao capítulo 04. Em 90% dos casos é: produto de ticket baixo com comissão baixa, ou produto que ninguém busca.

### Vazamento 5 — Resultado ótimo que morre de repente
**Diagnóstico:** punição de conta (volume, repetição, encurtador, categoria).
**Correção:** capítulo 08, plano de recuperação. Reduza volume, aumente conteúdo não promocional, espere 2 semanas.

---

## 11.6 Rotina de medição

| Frequência | O que fazer | Tempo |
|---|---|---|
| **Diário** | Nada. Não olhe métricas todo dia — elas são ruído de curtíssimo prazo | 0 min |
| **Semanal (segunda)** | Anote: impressões, cliques, saves, vendas, receita da semana. Compare com a anterior | 10 min |
| **Mensal (dia 1)** | Rode o Prompt 12 com os dados do mês. Rode a autoauditoria de compliance. Decida: escalar / pivotar / matar | 45 min |
| **Trimestral** | RPM por oferta e por via. Decisão estratégica de diversificação | 2 h |

⚠️ **Regra do Pinterest:** os números têm **atraso de indexação** e o pin forte continua crescendo por meses. Avaliar um pin na primeira semana é ler um livro pela capa. Dê **30 dias** antes de julgar qualquer coisa.

---

## 11.7 Modelo de planilha (copie no Sheets)

```
| Data | Pins novos | Impressões | Saves | Cliques | Sessões | Vendas | Receita | CTR | Conv | RPM | Decisão |
|------|-----------|-----------|-------|---------|---------|--------|---------|-----|------|-----|---------|
| S1   | 21        | 3.200     | 18    | 9       | 8       | 0      | 0       |     |      |     |         |
| S2   | 24        | 8.400     | 51    | 28      | 25      | 0      | 0       |     |      |     |         |
| S3   | 19        | 15.100    | 96    | 55      | 49      | 1      | 48,50   |     |      |     |         |
| S4   | 26        | 24.800    | 148   | 91      | 82      | 2      | 97,00   |     |      |     | Dobrar ângulo B |
```

**A coluna "Decisão" é a mais importante da planilha.** Sem ela, você tem dados; com ela, você tem direção.

---

## 11.8 Sinais de que está na hora de pivotar

Pivote quando **três** destes forem verdadeiros ao mesmo tempo:

1. Mais de 400 pins publicados no nicho;
2. Menos de R$ 100 de receita acumulada em 90 dias;
3. Taxa de conversão abaixo de 0,3% em uma amostra de 500+ cliques;
4. Nenhuma oferta com RPM acima de R$ 0,50;
5. Você já testou pelo menos 8 ângulos diferentes.

**O que NÃO é sinal de pivô:** "não deu resultado em 3 semanas". Isso é sinal de paciência, não de estratégia errada.

**Como pivotar sem perder tudo:**
- Mantenha a conta e os boards (eles têm autoridade acumulada);
- Troque a **oferta** primeiro (é o maior impacto e o mais rápido);
- Troque o **ângulo** em segundo lugar;
- Só troque o **nicho** se os três anteriores falharem.

---

**Próximo:** [12 · Escala, Lotes e Automação](12-escala-e-automacao.md)
