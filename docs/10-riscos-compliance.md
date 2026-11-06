# Riscos, banimentos e defesa — o manual de sobrevivência

> **Por que este documento existe.** Todo projeto de bot morre na mesma ordem: primeiro toma erro de política, depois toma ban, depois tenta recorrer e descobre que não há recurso. **Este documento é a lista dos erros que custam a conta — e o procedimento para não cometê-los.**
>
> Ele não é jurídico. É operacional: o que fazer, em que ordem, e o que documentar antes que aconteça.

::: meta
**Regra base:** em 2026, a plataforma tem **dados, logs e poder de banimento unilaterais**. A única defesa eficaz é **prevenção documentada** — não contestação posterior.
:::

---

## 1. A tabela central dos riscos

| Canal | Ação que derruba a conta | Gravidade | Defesa |
|---|---|---|---|
| **LinkedIn** | qualquer automação de sessão (auto-connect, auto-DM, scraper) | **crítica — ban definitivo, sem recurso** | não automatizar; §8.2 |
| **Meta (IG/FB)** | DM frio / mensagem fora da janela sem tag | **alta — restrição de messaging na Page** | validar janela antes de enviar |
| **Meta (IG/FB)** | compartilhar senha com ferramenta não oficial | alta — desativação de conta | só API oficial (Platform Terms 6.a.iii) |
| **WhatsApp** | disparo sem opt-in / template não aprovado / taxa de block alta | **crítica — número banido, irrecuperável** | opt-in com data + segmentação |
| **WhatsApp** | comprar lista | crítica | nunca |
| **X** | post idêntico em massa / reply automatizado indiscriminado | alta — suspensão | variar copy, responder só com contexto |
| **Reddit** | post promocional disfarçado / ban evasion | **crítica — ban de IP e shadowban** | disclosure + regra do sub |
| **Reddit** | criar conta nova após ban | crítica | não fazer |
| **TikTok** | app não auditado postando | média — conteúdo privado | audit antes |
| **TikTok** | automação de follow/like/DM | alta | não fazer |
| **YouTube** | comentar em vídeos de terceiros para prospectar | média — strike no canal | só responder no próprio canal |
| **Facebook Groups** | tentar automatizar | **impossível** — API extinta | manual |
| **E-mail** | sem unsubscribe / sem endereço físico | **legal — US$ 53.088 por e-mail** | CAN-SPAM completo |
| **E-mail** | sem base legal na UE | **legal — €20M ou 4%** | LIA documentada + Art. 14 |
| **E-mail** | sem opt-out no BR | legal — 2% da receita, teto R$ 50M | LGPD art. 18 |
| **Google Business** | edições em massa | baixa — 10 edições/min | throttle |

---

## 2. Os seis banimentos que realmente acontecem

### 2.1 LinkedIn — o ban mais rápido e mais definitivo

**O que acontece:** você conecta uma ferramenta de automação. Ela faz login com seu usuário e senha. Em 2 a 10 dias, a conta é restringida com "atividade incomum" e pede documento. Muitas vezes não volta.

**Como a LinkedIn detecta:** fingerprint do navegador, cadência de requisições (humano não clica 200 perfis/hora), IP do datacenter, ausência de eventos de mouse, padrão de mensagens idênticas.

**Por que não há recurso:** você violou a **Seção 8.2 do User Agreement** no momento do login automatizado. A hiQ v. LinkedIn foi decidida por **quebra de contrato** — a LinkedIn venceu. Não existe "uso legítimo" de scraping de perfis.

::: alerta
**Não existe ferramenta "segura" para LinkedIn outbound.** Todas operam com sua sessão autenticada — o que é exatamente o que §8.2 proíbe. Se um fornecedor diz "somos compatíveis com os termos", ele está mentindo ou usando a API de parceiro (que **não** permite envio de mensagens para não-conexões).
:::

**O que fazer no lugar:**
- Publicar no feed (permitido, via API para o próprio perfil).
- Responder quem te procurou (manual).
- Usar o Sales Navigator como **fonte de pesquisa** e enviar o convite à mão (10–20/dia, com nota).
- Usar o LinkedIn Ads se precisar de volume (CPL US$ 95–202).

### 2.2 WhatsApp — o número que não volta

**O que acontece:** você importa uma lista de 5.000 contatos e dispara. Em 24–72h, o número é **banido** e o WABA é restrito. O número **nunca mais** pode ser usado no WhatsApp — nem no app comum.

**Os três gatilhos:**
1. **Taxa de bloqueio (block rate) acima de ~2%** — usuários que recebem e bloqueiam.
2. **Denúncias** — "reportar e bloquear" é um toque.
3. **Template reprovado** usado mesmo assim, ou categoria errada (marketing enviado como utility).

**A defesa que funciona:**

```
1. Opt-in explícito, com data, hora, origem e IP — guardado
2. Mensagem de confirmação ("responda SIM para receber ofertas")
3. Segmentação: nunca a lista inteira, sempre o subgrupo relevante
4. Frequência: máximo 4 mensagens de marketing/mês por contato
5. Monitorar block rate semanalmente; acima de 1%, parar e revisar
6. Botão de saída em toda mensagem ("responda SAIR")
```

### 2.3 Reddit — o shadowban silencioso

**O que acontece:** você não recebe erro. Seus posts simplesmente **não aparecem** para ninguém além de você. É o shadowban — e é a punição mais comum e mais difícil de detectar.

**Como detectar:** abra o post em uma janela anônima. Se não aparecer, está shadowbanned.

**Os gatilhos:**
- Link para o mesmo domínio repetidamente (especialmente domínio próprio).
- Post promocional sem disclosure.
- Conta nova postando em sub grande (filtro automático de karma/idade).
- Ban evasion (nova conta após ban).

**A defesa:**
- 9:1 (nove contribuições úteis para cada menção comercial).
- Disclosure na primeira linha quando for comercial.
- Ler as regras do sub e postar só onde é permitido.
- Nunca criar conta nova após ban.

### 2.4 X — a suspensão por "automação agressiva"

**O que acontece:** replies automatizados a menções, follows em massa, ou posts idênticos em sequência. A conta é suspensa temporariamente, depois permanentemente.

**A defesa:**
- Responder só a posts onde há contexto real (não "todo post com a palavra X").
- Variar a copy — nunca a mesma resposta duas vezes.
- Limite autoimposto: ≤ 20 respostas/dia, ≤ 5 posts/dia.
- Não usar o mesmo texto em múltiplas contas.

### 2.5 Instagram/Messenger — a restrição de messaging

**O que acontece:** você manda fora da janela de 24h, ou usa a API para algo que parece spam. A Page perde a capacidade de enviar mensagens por 24h a 30 dias. Em casos graves, a conta é desativada.

**A defesa:** a validação em código (seção 4) — o erro acontece **antes** da chamada de API, não depois.

### 2.6 E-mail — a multa que chega 6 meses depois

**O que acontece:** você compra uma lista, dispara, e 6 meses depois recebe uma notificação da FTC (EUA) ou de uma autoridade de proteção de dados (UE/BR).

| Regime | Multa | Requisito central |
|---|---|---|
| **CAN-SPAM** (EUA) | **US$ 53.088 por e-mail** (ajuste FTC 2026) | opt-out funcional, endereço físico, unsubscribe em 10 dias úteis |
| **GDPR** (UE) | **€20M ou 4% do faturamento global** | base legal (LIA documentada), informar origem dos dados (Art. 14), objeção imediata |
| **LGPD** (BR) | **2% da receita, teto R$ 50M** | legítimo interesse B2B, opt-out, resposta em 15 dias |
| **CASL** (Canadá) | até CAD 10M | consentimento explícito (implícito dura 2 anos) |

::: alerta
**CAN-SPAM não distingue B2B de B2C.** Um e-mail frio para o `contato@empresa.com` está sujeito à mesma regra de um e-mail para consumidor. O que muda entre os regimes é a **base legal**, não a obrigação de parar de mandar quando pedem.
:::

**O rodapé mínimo (todos os regimes, um só formato):**

```
[EMPRESA LTDA] · CNPJ 00.000.000/0001-00
[Rua, número, cidade, estado, CEP, país]     ← endereço físico: obrigatório CAN-SPAM
Você recebeu porque [origem dos dados + data].
Para não receber mais: [link de unsubscribe em 1 clique]
Responder "SAIR" também funciona. Processamos em até 10 dias úteis.
```

---

## 3. O que é legal mas ainda assim derruba a conta

Existe uma zona cinzenta onde você está tecnicamente dentro dos termos e a plataforma te pune mesmo assim. **Ela é maior do que a zona proibida.**

| Prática | Status legal | Status prático |
|---|---|---|
| Postar o mesmo conteúdo em 5 canais no mesmo minuto | permitido | alcance reduzido (duplicata) |
| 50 posts/dia no Instagram via API | permitido | flagged como spam |
| Seguir 500 contas/dia no X (manual) | permitido | rate limit + reputação |
| Responder 198 comentários/dia no YouTube | permitido (cota) | flagged se todos forem "confira meu link" |
| Enviar 1.000 templates de marketing/mês no WhatsApp | permitido (pago) | block rate > 2% = ban |
| Comentar em 100 posts de desconhecidos no Reddit | permitido pelo ToS | ban do sub por regra local |

**A lição:** a política da plataforma é o **piso**, não o teto. O teto é o que o algoritmo e os moderadores toleram. Opere a 30% do limite técnico.

---

## 4. Defesa em código: o validador de canal

O `src/channels.py` do repositório implementa as regras acima como **bloqueio executável**. Ele roda **antes** de qualquer chamada de API.

```python
from src.channels import validate_channel_post, ChannelViolation

# 1. DM frio no Instagram → bloqueado
validate_channel_post("instagram_dm", {"cold": True})
# ChannelViolation: COLD_DM_META — peça que a pessoa escreva primeiro

# 2. Post no X com link → bloqueado se o orçamento de link estourou
validate_channel_post("x_post", {"text": "…", "has_link": True})
# ChannelViolation: X_LINK_BUDGET — use link na resposta (US$ 0,015 vs US$ 0,20)

# 3. Mensagem promocional fora da janela de 24h → bloqueado
validate_channel_post("whatsapp", {"promotional": True, "hours_since_inbound": 30})
# ChannelViolation: WINDOW_24H — use template aprovado ou espere a pessoa escrever

# 4. LinkedIn outbound → bloqueado sempre
validate_channel_post("linkedin_dm", {"automated": True})
# ChannelViolation: LINKEDIN_TOS_8_2 — não existe rota oficial
```

**As 14 regras implementadas:**

| Regra | Canal | Bloqueia quando |
|---|---|---|
| `COLD_DM_META` | IG, Messenger | tentativa de mensagem sem inbound |
| `WINDOW_24H` | IG, Messenger, WhatsApp | promocional após 24h sem tag |
| `HUMAN_AGENT_AUTOMATED` | IG, Messenger | bot usando tag HUMAN_AGENT |
| `PRIVATE_REPLY_ONCE` | IG, Messenger | 2ª DM privada no mesmo comentário |
| `LINKEDIN_TOS_8_2` | LinkedIn | qualquer DM/connect automatizado |
| `FB_GROUPS_DEAD` | Facebook Groups | qualquer publicação via API |
| `TIKTOK_UNAUDITED` | TikTok | post sem audit aprovado |
| `TIKTOK_DM_REGION` | TikTok | DM para conta UE/UK/CH |
| `X_LINK_BUDGET` | X | post com link acima do orçamento |
| `X_POST_LIMIT` | X | > 5 posts/dia ou > 20 respostas/dia |
| `YOUTUBE_QUOTA` | YouTube | > 198 respostas/dia |
| `IG_PUBLISH_LIMIT` | Instagram | > 50 posts/24h |
| `THREADS_LIMIT` | Threads | > 250 posts ou 1.000 respostas/24h |
| `TELEGRAM_RATE` | Telegram | > 1 msg/s no mesmo chat |
| `EMAIL_NO_UNSUB` | E-mail | falta unsubscribe ou endereço físico |
| `DISCLOSURE_MISSING` | todos | link comercial sem aviso de afiliação |

---

## 5. Procedimento de crise: o que fazer em cada cenário

### 5.1 Conta restrita

```
HORA 0   pare TODAS as automações daquele canal imediatamente
HORA 0   registre print da tela de restrição + horário
HORA 1   identifique a ação que disparou (log do orquestrador)
HORA 2   remova a causa (token, ferramenta, agendamento)
DIA 1    apele pelo canal oficial, com: o que aconteceu, o que foi corrigido
DIA 3    se não houver resposta, escale (formulário de suporte / parceiro)
DIA 7    se não voltar: migre o canal. Não crie conta nova.
```

::: alerta
**Nunca crie conta nova após ban.** É "ban evasion" — a punição passa a ser de IP/dispositivo e derruba também as contas saudáveis ligadas ao mesmo pagamento ou telefone.
:::

### 5.2 Número de WhatsApp banido

1. **Não tente recriar o WABA com o mesmo número.** É permanentemente inelegível.
2. Use um número novo, **outro perfil de uso** (não replique a mesma lista).
3. Antes de voltar: audite a lista (quantos pediram opt-out? qual o block rate histórico?).
4. Reconstrua com opt-in **duplo** e volume de 10% do anterior na primeira semana.

### 5.3 Post viral negativo

```
1. NÃO apague o post (apagar amplifica)
2. Responda em 1 hora, público, sem defensiva, com o fato
3. Se houver erro: reconheça e diga o que será feito
4. Se for ataque coordenado: não alimente; uma resposta, depois silêncio
5. Registre tudo (para o caso de precisar de suporte da plataforma)
```

---

## 6. Compliance por mercado

### 6.1 Brasil

| Regra | O que exige | Onde aparece |
|---|---|---|
| **LGPD** | base legal, opt-out, resposta a titular em 15 dias | e-mail, WhatsApp, CRM |
| **CONAR Guia 12/05/2026** | identificação de publicidade, inclusive por IA | todo conteúdo com link comercial |
| **CRECI Res. 1.065/2007** | oferta imobiliária precisa de CRECI do responsável | Instagram, WhatsApp, GBP |
| **CDC** | informação clara, sem publicidade enganosa | todos |
| **Marco Civil** | guarda de logs | infraestrutura |

**O rodapé de imobiliário no Brasil:**

```
Corretor responsável: [Nome] — CRECI [UF] [número]
Imóvel sujeito a disponibilidade. Valores e condições em [data].
Este conteúdo é informativo e não constitui oferta vinculante.
```

### 6.2 Estados Unidos

| Regra | O que exige | Onde aparece |
|---|---|---|
| **FTC 16 CFR 255** | disclosure clara e destacada de material connection | todo post de afiliado |
| **TCPA** | consentimento escrito prévio para SMS/WhatsApp | mensagens móveis |
| **CAN-SPAM** | opt-out, endereço físico | e-mail |
| **Fair Housing Act** | nunca segmentar anúncio por raça, religião, origem, família | Meta Ads, Google Ads |
| **State license** | divulgar licença imobiliária do estado | todo material |

::: alerta
**Fair Housing é o risco específico de imobiliário nos EUA.** Segmentar "famílias com crianças" ou "pessoas de [religião]" no Meta Ads é violação federal — mesmo que a intenção seja "ajustar o anúncio". A defesa: segmentar por **geografia e comportamento de busca**, nunca por atributo protegido. E deixar o Meta entregar (Advantage+) reduz o risco, porque a plataforma assume a segmentação.
:::

### 6.3 União Europeia

| Regra | O que exige |
|---|---|
| **GDPR** | base legal, LIA documentada, Art. 14 (origem dos dados), objeção imediata |
| **ePrivacy** | consentimento para cookies e marketing eletrônico em muitos Estados |
| **Alemanha/Itália** | tratar e-mail B2B como opt-in (não vale legítimo interesse para prospecção) |
| **DSA** | identificação de conteúdo publicitário |

---

## 7. O disclosure: a única regra que vale em todo canal

Toda plataforma, todo país e toda política exigem a mesma coisa: **a pessoa precisa saber que você ganha dinheiro se ela comprar.**

### 7.1 Formato por canal

| Canal | Como fazer | Exemplo |
|---|---|---|
| Reddit | primeira linha do comentário | "Sou afiliado do [produto]. Uso há 8 meses e pago a licença com comissão." |
| X | no post ou na resposta com link | "link de afiliado" |
| Instagram | primeira linha da legenda + hashtag | "#publi" ou "link de afiliado na bio" |
| WhatsApp | primeira mensagem comercial | "Oi! Sou assistente do [nome]. Trabalho com [empresa] e posso ganhar comissão." |
| YouTube | verbal no vídeo + descrição | "os links abaixo são de afiliado" |
| E-mail | rodapé + linha antes do link | "Este e-mail contém links de afiliado" |
| Blog | antes do primeiro link | "Este artigo contém links de afiliado" |

### 7.2 O teste de três perguntas

Antes de publicar qualquer coisa comercial, responda:

1. **Uma pessoa lendo rapidamente saberia que você ganha com aquilo?**
2. **O aviso está antes do link, não depois?**
3. **Se você removesse o aviso, a recomendação pareceria neutra?**

Se qualquer resposta for "não", "não" ou "sim" → reescreva.

---

## 8. Checklist de sobrevivência (cole na parede)

```
ANTES DE QUALQUER CANAL NOVO
[ ] li a policy de mensagens (não a de publicação)
[ ] sei qual é a janela de resposta
[ ] sei o custo por mensagem
[ ] sei o que causa ban (não o que é permitido)
[ ] tenho log de custo por ação

ANTES DE QUALQUER DISPARO
[ ] tenho opt-in com data e origem
[ ] tem unsubscribe em 1 clique
[ ] tem endereço físico (e-mail) ou CRECI (imobiliário BR)
[ ] a lista foi segmentada (não é "todos")
[ ] block rate histórico < 1%

ANTES DE QUALQUER AUTOMAÇÃO
[ ] existe API oficial para isso? (se não, não faça)
[ ] isso vai contra §8.2 do LinkedIn? (se sim, não faça)
[ ] o bot está identificado como bot?
[ ] há aprovação humana para publicação?
[ ] está a 30% do limite técnico?

QUANDO ALGO DER ERRADO
[ ] parei as automações
[ ] registrei evidência
[ ] não criei conta nova
[ ] apelei pelo canal oficial
[ ] documentei a causa para o próximo
```

---

## 9. A hierarquia de risco (o que priorizar)

```
RISCO CRÍTICO (perde o ativo inteiro, sem recurso)
  1. LinkedIn automatizado
  2. WhatsApp sem opt-in / block rate alto
  3. Reddit ban evasion
  4. E-mail sem compliance (multa)

RISCO ALTO (perde o canal por semanas)
  5. Meta fora da janela de 24h
  6. X automação agressiva
  7. TikTok automação de engajamento

RISCO MÉDIO (perde alcance)
  8. YouTube prospecção em comentários
  9. Conteúdo duplicado em massa
  10. Edições em massa no GBP

RISCO BAIXO (erro técnico)
  11. Estouro de cota
  12. Token expirado
  13. Rate limit 429
```

**A regra de alocação de atenção:** 80% do esforço de compliance nos 4 primeiros. Os outros 9 são resolvidos por código (é o que o `channels.py` faz).

---

## 10. O princípio final

::: decisao
**Você não está construindo um bot que posta. Está construindo um ativo que sobrevive.**

A conta de 5 anos com 20 mil seguidores vale mais que a campanha de 3 dias com 200 mil impressões — e a segunda é o que derruba a primeira. Toda decisão de automação tem uma pergunta embutida: **"isso protege ou expõe o ativo?"** Quando a resposta for "expõe", a resposta é não — mesmo que funcione hoje.
:::

**Os três testes antes de qualquer automação nova:**

1. **Teste da API:** existe endpoint oficial? Se não, não faça.
2. **Teste da janela:** a mensagem só vai para quem pediu, dentro do prazo permitido? Se não, não faça.
3. **Teste do arrependimento:** se isso aparecer no print de um jornalista, você consegue explicar? Se não, não faça.
