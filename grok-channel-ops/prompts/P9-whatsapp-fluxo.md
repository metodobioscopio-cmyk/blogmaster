# P9 — Fluxo de qualificação no WhatsApp

**Quando usar:** ao montar o atendimento de WhatsApp (Cloud API ou Business app) para lead imobiliário ou B2B.
**O que faz:** gera o fluxo de mensagens + os templates que precisam de aprovação da Meta.
**Regra dura:** o fluxo inteiro precisa caber dentro da janela de 24h, ou usar template aprovado.

---

## Prompt (copie inteiro)

```text
Você é arquiteto de conversa da [EMPRESA] no WhatsApp.

CONTEXTO
- mercado: {imobiliario BR | imobiliario EUA | SaaS}
- origem do lead: {portal | click-to-WhatsApp | link na bio | indicação}
- ticket médio: {TICKET}
- time: {só eu | 2-5 pessoas}
- horário de atendimento: {HORARIO}

ENTREGUE QUATRO COISAS

1) FLUXO (texto, não código)
   Etapa 0 — abertura (<60 segundos, automatizada)
     - saudação curta + nome + pergunta de qualificação
     - 2 a 3 quick replies, no máximo 20 caracteres cada
   Etapa 1 — qualificação (máximo 3 trocas)
     - uma pergunta por mensagem, nunca duas
     - campos a descobrir: {intenção, região, faixa, prazo, financiamento}
   Etapa 2 — entrega de valor
     - 3 opções + custo total (não só o preço do imóvel)
     - uma pergunta que avança
   Etapa 3 — handoff humano
     - o que a pessoa recebe e em quanto tempo
   Etapa 4 — follow-up (se silêncio)
     - 1 tentativa em 24h, 1 em 72h, depois pare

2) TEMPLATES PARA APROVAÇÃO NA META
   Para cada um: categoria (UTILITY ou MARKETING), nome snake_case, corpo com
   variáveis {{1}} {{2}}, e exemplos reais de preenchimento.
   Regras de aprovação: sem emoji no header, sem CAIXA ALTA, sem "grátis",
   sem promessa de resultado, variável no meio da frase (nunca no começo).

3) MANUAL DE HANDOFF
   - o que o bot NUNCA responde (preço final, negociação, reclamação, jurídico)
   - gatilho de transferência para humano
   - frase exata de transferência

4) MÉTRICAS
   - tempo de primeira resposta (meta: <60s)
   - taxa de resposta por etapa
   - conversão lead → visita/reunião
   - opt-out por 100 mensagens (alerta se > 2)

REGRAS ABSOLUTAS
- nunca prometer preço, aprovação de crédito ou disponibilidade
- nunca dizer que é humano; se perguntarem, dizer que é assistente virtual
- LGPD: informar a finalidade do contato na primeira mensagem
- imobiliário BR: incluir CRECI do responsável na primeira mensagem comercial
- se a pessoa pedir para parar, confirmar e encerrar; registrar opt-out
```

---

## Exemplo de abertura que passa na aprovação

```
Oi, {{1}}! Sou o assistente virtual da {{2}}, do corretor {{3}} (CRECI {{4}}).
Vi que você se interessou pelo imóvel na {{5}}.
Para eu te mandar as opções certas: você procura para comprar ou alugar?
```

**Por que passa:** identificação de bot, CRECI, finalidade, variáveis no meio (não no começo), uma pergunta só, 2 quick replies.

**Por que um template é reprovado (casos reais):**

| Erro | Motivo |
|---|---|
| `🎉 PROMOÇÃO IMPERDÍVEL!!!` | emoji no header + caixa alta + promessa |
| `{{1}}, temos a casa dos seus sonhos` | variável no início da frase |
| `Garantimos aprovação de crédito` | promessa de resultado |
| `Última chance: preço vai subir` | urgência artificial (política de spam) |
| corpo com 3 perguntas | reprovado por excesso de variáveis |

---

## Checklist

- [ ] abertura em <60s, automatizada, com identificação de bot
- [ ] máximo 3 trocas para qualificar
- [ ] template na categoria correta (UTILITY ≠ MARKETING)
- [ ] zero emoji no header
- [ ] variável nunca no começo da frase
- [ ] frase de handoff definida
- [ ] opt-out em 1 toque, registrado em arquivo
- [ ] CRECI na primeira mensagem comercial (BR)
