# Receita — Funil do Growth Stack no Zapier
### Growth Design Pro · Kit de Ferramentas

O Zapier **não importa** fluxos de vários passos por arquivo JSON. Esta é a receita de montagem: siga na
ordem, com os valores exatos de cada passo. Tempo estimado: 25 minutos.

> **Antes de começar.** No Zapier cada passo é uma "tarefa" cobrada. Este Zap tem 9 passos por execução —
> considere isso no seu preço. Se você vai rodar o funil para vários clientes, o n8n auto-hospedado sai
> muito mais barato (ver `kit/integracoes/README.md`).

---

## Estrutura do Zap

```
Gatilho  ①  Webhooks by Zapier — Catch Hook
Ação     ②  Formatter by Zapier — Text → Extract URL / validação
Ação     ③  Webhooks by Zapier — POST  (API 1: Extração)
Ação     ④  Webhooks by Zapier — POST  (API 2: SEO Analysis)
Ação     ⑤  Webhooks by Zapier — POST  (API 4: Copywriter)
Ação     ⑥  Webhooks by Zapier — POST  (API 5: Landing Optimizer)
Ação     ⑦  Webhooks by Zapier — POST  (API 3: Conversion Optimization)
Ação     ⑧  Google Sheets — Create Spreadsheet Row (dashboard)
Ação     ⑨  Gmail / E-mail — Send Outbound Email (entrega ao solicitante)
```

---

## Passo 1 — Gatilho: Catch Hook

1. Crie um Zap novo → **Trigger: Webhooks by Zapier** → Event: **Catch Hook**.
2. Copie a URL gerada e cole no seu formulário (campo oculto `webhook`) ou use como endpoint do
   `fetch()` da sua página.
3. Clique em **Test trigger** e envie um teste com o corpo `{"url": "https://exemplo.com.br"}`.
4. O Zapier vai capturar a estrutura do JSON. Confirme que aparece o campo `url`.

**Valide a origem.** No formulário, inclua um campo oculto com um valor secreto e teste no passo 2 se
ele confere. Sem isso, qualquer pessoa pode usar a sua cota.

## Passo 2 — Validação (Filter ou Formatter)

Use **Filter by Zapier** com a condição:
- `url` *contains* `https://` — e **Continue only if... matches**.

Se você tem mais de um cliente, adicione uma condição extra: `origem` *exactly matches* o código do
cliente, para rotear o resultado para a planilha certa.

## Passos 3 a 7 — As chamadas de API

Todos usam **Webhooks by Zapier → POST**. Campos idênticos, mudando URL e corpo:

| Passo | API | URL | Payload (JSON) |
|---|---|---|---|
| 3 | ① Extração | `https://HOST1.rapidapi.com/CAMINHO` | `{"url": "{{url}}"}` |
| 4 | ② SEO | `https://HOST2.rapidapi.com/CAMINHO` | `{"url": "{{url}}"}` |
| 5 | ④ Copy | `https://HOST4.rapidapi.com/CAMINHO` | `{"url": "{{url}}", "seo": "{{passo4_response}}"}` |
| 6 | ⑤ Landing | `https://HOST5.rapidapi.com/CAMINHO` | `{"url": "{{url}}", "copy": "{{passo5_response}}"}` |
| 7 | ③ Conversão | `https://HOST3.rapidapi.com/CAMINHO` | `{"url": "{{url}}"}` |

> Substitua `HOST` e `CAMINHO` pelos valores reais de cada API, copiados do painel do RapidAPI **hoje**.

**Headers** — em cada um dos cinco passos, adicione em *Headers*:

| Header | Valor |
|---|---|
| `X-RapidAPI-Key` | sua chave (ideal: use uma variável de ambiente do Zapier) |
| `X-RapidAPI-Host` | o host daquela API |

**Payload type:** `json`. Se o Zapier reclamar do JSON, use `raw` com o corpo exato.

**Importante sobre o passo 5 e 6:** a resposta da etapa anterior pode ser longa demais. No Zapier, use
**Formatter → Text → Truncate**, limite de 3.000 caracteres, e passe o resultado truncado. Mandar o JSON
inteiro estoura o limite da API e você paga por uma chamada que volta com erro.

## Passo 8 — Gravar no dashboard

**Google Sheets → Create Spreadsheet Row**. Aponte para a versão em Sheets do seu
`growth-dashboard.xlsx` (abas: `Páginas`, `Rodadas`, `Custos API`).

Mapeie:

| Coluna da planilha | Valor no Zapier |
|---|---|
| Data | `{{zap_meta_human_now}}` |
| URL | `{{url}}` |
| Score SEO | `{{passo4_score}}` |
| Score conversão | `{{passo7_score}}` |
| Copy gerada | `{{passo5_texto_truncado}}` |
| Observação | `via Zapier` |

Se o caminho do JSON do score mudar, use **Formatter → Utilities → Lookup Table** para localizar o campo,
ou peça ao suporte da API o nome exato no retorno atual.

## Passo 9 — Responder

**Gmail → Send Email** (ou Slack, WhatsApp Business, o que o cliente usar):

- **To:** e-mail informado no formulário
- **Subject:** `Diagnóstico de crescimento — {{url}}`
- **Body:**
  ```
  Seu diagnóstico está pronto.

  Score de SEO: {{passo4_score}}/100
  Score de conversão: {{passo7_score}}/100

  Próximos passos: [LINK DA SUA REUNIÃO]

  — Growth Design Pro
  ```

**Não prometa resultado no e-mail.** O diagnóstico é um retrato, não uma previsão.

---

## Erros comuns de montagem

| Sintoma | Causa | Correção |
|---|---|---|
| `403 Forbidden` | Header com nome errado ou plano sem o endpoint | Conferir `X-RapidAPI-Key` e `X-RapidAPI-Host`; conferir a assinatura |
| Zap para mas a planilha grava vazio | "Continue on error" ativado | Desligar — fluxo errado deve parar, não gravar dado falso |
| `413` ou resposta cortada | Payload grande demais | Truncar em 3.000 caracteres no Formatter |
| Tarefas estourando | 9 passos × volume de execuções | Migrar para n8n auto-hospedado |
| Só funciona no teste | Chave colada no código e não na credencial | Usar credencial do Zapier, não valor literal |

---

## Teste final (não pule)

1. Envie uma URL **sua** pelo formulário e acompanhe a execução no histórico do Zap.
2. Confirme que a linha apareceu na planilha, com os dois scores.
3. Force um erro (URL inexistente) e verifique que o Zap **falha** e te avisa — em vez de gravar vazio.
4. Rode a mesma URL de novo: se o Zap cobrar tudo outra vez, implemente o cache (Filter consultando a
   planilha antes de chamar as APIs).
5. Só então aponte o formulário do cliente para este webhook.
