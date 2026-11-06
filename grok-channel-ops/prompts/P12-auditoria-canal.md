# P12 — Auditoria de canal antes de escalar

**Quando usar:** antes de dobrar o volume em qualquer canal, e ao entrar em um canal novo.
**O que faz:** audita 4 dimensões (compliance, custo, conversão, risco de ban) e devolve veredito GO / NO-GO / AJUSTAR.
**Regra dura:** sem auditoria, não se escala. Escalar um erro é multiplicar o erro.

---

## Prompt (copie inteiro)

```text
Você é auditor de operação de canais.

ENTRADA
- canal: {CANAL}
- período auditado: {DIAS} dias
- dados: {posts, alcance, cliques, conversas, vendas, custo_api, custo_midia}
- incidentes: {remoções, avisos, 429, reprovações}
- config: {payloads usados no período}

AUDITE QUATRO DIMENSÕES (dê nota 0-10 em cada)

1) COMPLIANCE
   - houve mensagem fora da janela de 24h? (0 = tolerância zero)
   - todo link comercial tinha disclosure ANTES do link?
   - todo opt-in tem data e origem registrada?
   - houve tentativa de DM frio ou LinkedIn automatizado? (0 automático)
   - algum conteúdo violou regra local (sub, grupo, página)?

2) CUSTO
   - custo por conversa qualificada (meta < US$ 5)
   - custo por post (comparar com US$ 0,015 do X sem link)
   - % do orçamento gasto em posts com link (deveria ser < 10%)
   - custo total vs. custo planejado

3) CONVERSÃO
   - taxa de resposta na janela (meta > 90%)
   - conversa → reunião (meta 20-35%)
   - reunião → venda (meta 15-30%)
   - qual peça/canal originou cada venda (atribuição)

4) RISCO DE BAN
   - proximidade dos limites técnicos (deveria estar < 30%)
   - taxa de block/opt-out (alerta > 2%)
   - conteúdo duplicado em quantos canais?
   - uso de automação de engajamento (curtir/seguir/comentar)?

VEREDITO
- GO:     compliance >= 9 e custo por conversa < US$ 5 e risco < 5
- AJUSTAR: um dos três fora da faixa, mas corrigível em 7 dias
- NO-GO:  compliance < 7 OU qualquer incidente grave no período

SAÍDA
{
  "canal": "...",
  "notas": {"compliance": 0, "custo": 0, "conversao": 0, "risco": 0},
  "veredito": "GO | AJUSTAR | NO-GO",
  "correcoes_obrigatorias": ["..."],
  "o_que_escalar": "o que pode ser multiplicado com segurança",
  "o_que_parar_hoje": "o que precisa parar antes de qualquer aumento"
}
```

---

## Escala de decisão

| Compliance | Custo/conversa | Risco | Veredito |
|---|---|---|---|
| 9–10 | < US$ 5 | < 5 | **GO** — pode dobrar |
| 8–9 | US$ 5–10 | 5–6 | **AJUSTAR** — corrigir e reauditar em 7d |
| < 8 | qualquer | > 6 | **NO-GO** — parar e reconstruir |
| qualquer | qualquer | incidente grave | **NO-GO imediato** |

---

## Template de relatório semanal (1 página)

```
CANAL: instagram_dm          SEMANA: 45          PERÍODO: 02–08/11

COMPLIANCE  9/10   nenhuma mensagem fora da janela
CUSTO       10/10  US$ 1,84 por conversa qualificada
CONVERSÃO   7/10   3 conversas → 1 reunião (33%)
RISCO       8/10   12 respostas/dia (muito abaixo de 750/h)
VEREDITO: GO

ESCALAR: comentário → DM nos 3 posts com mais salvamentos
PARAR: nada
CORRIGIR: falta registrar a origem do opt-in em 2 contatos
```

---

## Checklist

- [ ] as quatro dimensões foram pontuadas (não só conversão)
- [ ] incidentes listados com data e causa
- [ ] veredito segue a escala (sem "GO por otimismo")
- [ ] correções têm prazo
- [ ] o que escalar é específico, não "postar mais"
