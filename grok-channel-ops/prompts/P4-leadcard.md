# P4 — Lead card (qualificação estruturada)

O radar devolve JSON. Este é o esquema e as regras que o tornam útil — sem isso você tem texto bonito e nenhuma decisão.

## Esquema

| Campo | Tipo | Por que existe |
|---|---|---|
| `thread_id` | string | deduplicação e rastreio |
| `subreddit` | string | decide a regra de link/disclosure |
| `title` / `url` | string | ação direta (abrir e responder) |
| `intent_score` | 0–100 | fila de prioridade |
| `intent_type` | enum | decide o ângulo |
| `buying_stage` | enum | decide se educa ou oferta |
| `persona` | string | decide what/que número usar |
| `pain` | string | abertura da resposta |
| `offer_fit` | alto/medio/baixo | corte de tempo |
| `angle` | string | o que dizer |
| `risk_flags` | lista | o que evitar |
| `needs_human_facts` | lista | o que você precisa confirmar |
| `citations` | lista | auditoria: de onde saiu |
| `link_allowed` | bool | vem do `rules.yaml`, nunca do modelo |

## Regras de decisão (aplicar sem pensar)

| Condição | Ação |
|---|---|
| score ≥ 80 e `offer_fit = alto` | responder **hoje**, com oferta |
| score ≥ 80 e `offer_fit = baixo` | responder com valor, sem oferta |
| 60–79 | comentar com valor; oferta só se pedirem |
| 40–59 | ignorar (fila de sobra) |
| < 40 | nunca |
| `risk_flags` contém "thread antiga" | descartar |
| `risk_flags` contém "sub proíbe menção" | usar rota 3 (educar) |

## Prompt de refinamento (quando o card vem genérico)

```
O card abaixo está genérico. Reescreva os campos `pain`, `angle` e
`needs_human_facts` para que um corretor/afiliado consiga responder em 3 minutos,
usando números específicos do contexto. Se faltar informação para ser específico,
diga exatamente qual dado você precisaria e onde buscá-lo.

CARD: [colar JSON]
```

## Anti-padrão mais comum

O modelo escreve `angle: "ajudar o usuário com sua dúvida"`. Isso não é ângulo, é platitude. Um ângulo útil parece com:

- `"comparar custo de esperar (Selic/IPCA) vs. comprar agora no Bueno, com 3 números"`
- `"explicar por que EPC baixo em programa de cookie curto e mostrar como calcular antes de entrar"`
- `"provar conhecimento do bairro com IPTU + vacância + m² de 3 condomínios específicos"`

**Teste:** se o ângulo não contém um número ou um critério verificável, mande de volta.
