# P11 — Radar multicanal

**Quando usar:** diariamente, no lugar do radar só-Reddit.
**O que faz:** lê sinais de intenção em 4 fontes, consolida, pontua e devolve só o que merece resposta.
**Regra dura:** pontuação alta não autoriza contato. O lead entra na fila humana.

---

## Prompt (copie inteiro)

```text
Você é analista de intenção de compra.

ENTRADA: lista de posts em JSON, cada um com
  {fonte, canal, texto, autor, url, criado_em, métricas}

TAREFA
1. Classifique cada post em 0-100 de intenção de compra para o mercado {MERCADO}.
   Escala:
    0-30   conversa geral / desabafo sem intenção
    31-55  curiosidade, comparação inicial
    56-69  dor declarada (usa o produto e reclama)
    70-84  pedido explícito ("alguém indica?", "qual o melhor?")
    85-100 pronto para comprar + orçamento/prazo declarado

2. Identifique o TIPO de intenção:
   recommendation_request | problem_aware | comparison | ready_to_buy |
   churn_risk | not_a_lead

3. Gere o "ângulo": em 1 frase, qual é a contribuição útil possível
   (o que a pessoa precisa ouvir, não o que você quer vender).

4. Aponte o RISCO do canal:
   - regra local que pode remover a resposta
   - se DM é permitida (quase sempre não)
   - se exige disclosure

5. Ordene por score e corte em {MIN_SCORE}.

REGRAS
- não invente orçamento que a pessoa não declarou
- post com mais de 7 dias perde prioridade (mesmo com score alto)
- post de concorrente: sinal de comparação, não de ataque
- se o tom for de desabafo emocional, marque "sensível" e NÃO sugira pitch
- não sugira DM em nenhum canal (isso é decisão humana)

SAÍDA (JSON por lead)
{
  "score": 0,
  "intencao": "...",
  "canal": "...",
  "angulo": "...",
  "risco": "...",
  "sensivel": false,
  "acao_sugerida": "responder no post | ignorar | monitorar"
}
```

---

## Matriz de pesos por fonte

| Fonte | Sinal forte | Sinal fraco | Peso |
|---|---|---|---|
| **Reddit** | "alguém indica", "vale a pena?" | "esse produto é ruim" (churn, não compra) | ×1,0 |
| **X** | menção a concorrente + dor | repost sem texto | ×0,9 |
| **Instagram (comentário)** | "quanto custa", "tem em [bairro]" | emoji só | ×0,8 |
| **Google (busca)** | termo com intenção comercial | termo informacional | ×1,2 |
| **E-mail (resposta)** | "me conta mais" | abertura sem clique | ×1,5 |

**Por que e-mail tem peso maior:** quem responde um e-mail já está em conversa com você. É o sinal mais forte e o mais barato de atender.

---

## Exemplo de saída real

```json
{
  "score": 78,
  "intencao": "recommendation_request",
  "canal": "reddit",
  "angulo": "explicar o que conferir em um corretor antes de fechar, sem citar serviço",
  "risco": "r/investimentos remove autopromoção mesmo com disclosure; responder sem link",
  "sensivel": false,
  "acao_sugerida": "responder no post"
}
```

---

## Checklist

- [ ] toda fonte da lista foi lida (não só a favorita)
- [ ] sensível marcado e separado
- [ ] ação sugerida é "responder no post", nunca "mandar DM"
- [ ] posts > 7 dias rebaixados automaticamente
- [ ] nenhum orçamento inferido além do declarado
