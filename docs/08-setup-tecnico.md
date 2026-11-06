# Setup técnico — como setar o Grok Bot em cada canal

> **Este é o documento "mão na massa".** Cada seção tem: o que você precisa ter antes, os passos exatos, o código real que funciona, e o erro que vai te travar se você não souber. Todo código é copiável e roda com Python 3.11 + `requests`.
>
> **Tempo total de setup completo:** ~4 horas. **Tempo para o primeiro canal funcionando (Telegram ou X):** 25 minutos.

::: meta
**Credenciais necessárias no `.env`** — todas as chaves usadas neste documento estão no `.env.example` do repositório. Nunca comite o `.env`.
**Ordem recomendada:** Telegram (valida o fluxo) → X (valida o radar) → WhatsApp (valida a conversa) → Instagram → YouTube → os demais.
:::

---

## 0. Antes de começar: a arquitetura de três camadas

```
CAMADA 1 — CÉREBRO (xAI)
    Grok via API (chat, busca web, X) ou Grok Bot (agente autônomo)
         ↓ escreve, classifica, decide
CAMADA 2 — ORQUESTRADOR (seu código ou n8n/MCP)
    fila → valida regra do canal → aprova → publica
         ↓ chama APIs oficiais
CAMADA 3 — CANAIS (APIs oficiais de cada rede)
    X · Meta · WhatsApp · TikTok · YouTube · Telegram · GBP
```

**A regra que não se quebra:** a camada 2 **sempre** passa pelo validador de canal (`src/channels.py`) antes de publicar. É ele que impede o bot de violar janela de 24h, mandar DM frio ou estourar cota.

```python
# o padrão de uso, presente em todo este documento
from src.channels import validate_channel_post, ChannelViolation

try:
    validate_channel_post("instagram_dm", {"cold": True})
except ChannelViolation as e:
    print(e.rule, e.fix)   # → COLD_DM_META "peça que a pessoa escreva primeiro"
```

---

## 1. Grok Bot: o agente que executa (e o que ele substitui)

**O que é:** produto da xAI em beta desde 11/08/2026. Cada conta ganha **um computador Linux persistente na nuvem** com navegador, terminal e sistema de arquivos. Você cria "Bots" nomeados, cada um com uma função, que rodam **Routines** (agendadas ou disparadas por evento) e voltam pedindo aprovação.

**O que isso muda na prática:**

| Antes (2025) | Agora (Grok Bot, 2026) |
|---|---|
| você escreve o script de cada canal | o bot usa o navegador nos sites sem API |
| cron + servidor próprio | Routines nativas, sem servidor |
| OAuth de cada plataforma na mão | conectores + MCP com um clique |
| você revisa post por post | aprovações configuráveis por ação |

### 1.1 Setup (30 minutos)

| Passo | O que fazer | Detalhe que trava |
|---|---|---|
| 1 | Assine **The X Subscription Premium (US$ 30/mês)** ou tenha SuperGrok/Cursor pago | Grok Bot **não** existe no plano Free ou Plus |
| 2 | Instale o app (macOS, Windows, Linux, iOS, Android) e entre com a conta que vai ser **dona** dos bots | decida o dono antes de conectar ferramentas |
| 3 | Crie **1 bot focado**: nome + uma responsabilidade + limites escritos no prompt | um bot por função; não crie o "bot faz-tudo" |
| 4 | Abra **Plugins → Marketplace** e instale os conectores que precisa | Gmail, Google Calendar, X e Composio são os primeiros |
| 5 | Ensine a tarefa com **Teach a Task** (faça uma vez, ele grava como skill) | mais rápido que escrever 40 linhas de prompt |
| 6 | Crie a **Routine**: intervalo ou gatilho (mensagem no Slack, evento no GitHub) | cada bot aceita até 50 routines |
| 7 | Configure **aprovações obrigatórias** para: publicar, enviar mensagem, apagar, comprar | sem isso o bot age sozinho — e a conta é sua |

::: alerta
**Limites reais do Grok Bot em nov/2026:** está em **beta**; não há seletor de modelo (a xAI escolhe); alguns sites bloqueiam automação ou pedem CAPTCHA — e **CAPTCHA/2FA continuam com você**. Ele não é um "postador mágico": ele é um operador que usa o navegador quando não existe conector. Onde existe API oficial, **use a API** — é mais confiável e mais barato.
:::

### 1.2 O prompt do bot de vendas (cole isto)

```text
Você é o "Radar", bot de aquisição da [EMPRESA] em [MERCADO].

FUNÇÃO: encontrar e qualificar intenção de compra; nunca fechar sozinho.

FAÇA:
- monitorar X, Reddit e Google por termos de dor: [LISTA]
- classificar cada post em 0-100 de intenção; só acima de 70 vira lead
- rascunhar resposta com disclosure (sou fundador/afiliado) antes de qualquer link
- registrar tudo em leads.jsonl com url, autor, score, motivo

NÃO FAÇA NUNCA:
- publicar, comentar, curtir ou enviar DM sem minha aprovação explícita
- criar conta em qualquer plataforma
- se passar por pessoa; sempre dizer que é assistente virtual
- mandar mensagem fora da janela de 24h da Meta ou para quem não escreveu primeiro
- scrapear LinkedIn (viola §8.2) ou grupos do Facebook (API extinta)

QUANDO TIVER DÚVIDA: me pergunte e pare.
```

**Por que o "não faça" é a parte mais importante:** um agente com navegador pode clicar em "criar conta" e "enviar" sozinho. O prompt sem esses limites é o que faz a conta principal cair.

---

## 2. Telegram — o teste de 10 minutos

**Por que começar aqui:** custo zero, sem aprovação de app, sem cota. Valida todo o fluxo (redação → aprovação → envio) antes de você encostar em plataforma com política rígida.

### 2.1 Criar o bot

1. No Telegram, fale com **@BotFather** → `/newbot` → dê nome e username (precisa terminar em `bot`).
2. Copie o token: `7123456789:AAF...` → `.env` como `TELEGRAM_BOT_TOKEN`.
3. Descubra seu chat id: mande uma mensagem para o bot, depois acesse
   `https://api.telegram.org/bot<TOKEN>/getUpdates` e leia `result[0].message.chat.id`.
4. Guarde em `TELEGRAM_CHAT_ID`.

### 2.2 Publicar e ler

```python
import os, requests, time

BASE = f"https://api.telegram.org/bot{os.environ['TELEGRAM_BOT_TOKEN']}"

def enviar(chat_id: str, texto: str) -> dict:
    r = requests.post(f"{BASE}/sendMessage", json={
        "chat_id": chat_id,
        "text": texto,
        "parse_mode": "HTML",
        "disable_web_page_preview": False,
    }, timeout=30)
    if r.status_code == 429:                      # rate limit
        espera = r.json()["parameters"]["retry_after"]
        time.sleep(espera)
        return enviar(chat_id, texto)
    r.raise_for_status()
    return r.json()

enviar(os.environ["TELEGRAM_CHAT_ID"], "Teste do Radar ✅")
```

### 2.3 Limites que você vai encontrar

| Limite | Valor | Consequência |
|---|---|---|
| Mensagens por segundo, por chat | 1 | mandar 2 seguidas derruba a 2ª com 429 |
| Mensagens por minuto, por grupo | 20 | acima disso o bot é silenciado |
| Envio em massa | ~30/s | para listas grandes |
| Tamanho da mensagem | 4.096 caracteres | acima, divida |
| Upload de arquivo | 50 MB | vídeo grande vai por link |
| Broadcast pago | até 1.000/s a 0,1 Star/msg | exige ≥100k Stars em saldo e ≥100k MAU |

::: dica
`429` sempre traz `retry_after` em segundos. **Sempre** respeite esse número; usar `sleep(1)` fixo gera bloqueio progressivo. O `enviar()` acima já faz isso.
:::

---

## 3. X (Twitter) — o radar de intenção

**Modelo de cobrança em 2026:** pay-per-use por crédito. Não existe mais o plano Basic de US$ 200 nem o Pro de US$ 5.000 (aposentados em 2026). Novas contas ganham **20.000 créditos** iniciais.

### 3.1 Rate card (o que cada ação custa)

| Ação | Custo | Observação |
|---|---|---|
| Publicar post de texto | US$ 0,015 | **US$ 0,20 se contiver URL** |
| Ler post de terceiro | US$ 0,005 | a base do radar |
| Ler post próprio | US$ 0,001 | barato |
| Ler perfil/followers/trend | US$ 0,010 | |
| Enviar DM | US$ 0,015 | |
| Responder post (summoned reply) | US$ 0,010 | |
| Teto de leitura | 3.000.000 posts/mês | acima disso, planeje Enterprise (~US$ 42k+/mês) |

::: alerta
**O link custa 13 vezes mais.** Post com URL = US$ 0,20; sem URL = US$ 0,015. Se você publica 5 posts com link por dia, são **US$ 30/mês** só nisso. **Padrão recomendado:** post principal sem URL, link na resposta ou na bio. Economia de 92%.
:::

### 3.2 Criar o app e publicar

1. Acesse `console.x.ai` → crie a API key → `.env` como `XAI_API_KEY`.
2. Para postar no X **pelo bot**, conecte a conta em **Grok Bot → Plugins → X** (a partir de 29/08/2026 o conector é nativo e **assinantes pagos recebem créditos de X API inclusos**).
3. Alternativa programática: app em `developer.x.com`, OAuth 2.0 com escopos `tweet.read tweet.write users.read offline.access`.

```python
import os, requests

def postar_x(texto: str, tem_link: bool = False) -> dict:
    """Posta no X via API v2. NUNCA coloque link no post principal."""
    assert len(texto) <= 280, "acima de 280 o X rejeita (ou use Premium)"
    if tem_link:
        print("AVISO: post com link custa US$ 0,20 (13x). Considere link na resposta.")
    r = requests.post(
        "https://api.x.com/2/tweets",
        headers={"Authorization": f"Bearer {os.environ['X_USER_TOKEN']}",
                 "Content-Type": "application/json"},
        json={"text": texto},
        timeout=30,
    )
    r.raise_for_status()
    return r.json()          # {"data": {"id": "...", "text": "..."}}
```

### 3.3 O radar de intenção (o uso que dá dinheiro)

```python
QUERIES = [
    '(indicação OR "alguém conhece") (corretor OR imobiliária) (Goiânia OR Anápolis) -is:retweet',
    '("preciso de" OR "procuro") (ferramenta OR SaaS) (afiliado OR "programa de afiliados") -is:retweet lang:pt',
    '(odiei OR "não funciona") (portal OR zap OR vivareal) -is:retweet',
]

def radar(limite: int = 50) -> list[dict]:
    """Custo: US$ 0,005 por post lido. 50 posts = US$ 0,25."""
    achados = []
    for q in QUERIES:
        r = requests.get(
            "https://api.x.com/2/tweets/search/recent",
            headers={"Authorization": f"Bearer {os.environ['X_BEARER_TOKEN']}"},
            params={"query": q, "max_results": min(limite, 100),
                    "tweet.fields": "author_id,created_at,public_metrics,lang"},
            timeout=30,
        )
        if r.status_code == 429:
            break
        achados.extend(r.json().get("data", []))
    return achados
```

**Custo de rodar o radar 3× por dia, 50 posts cada:** 150 leituras × US$ 0,005 = **US$ 0,75/dia ≈ US$ 22/mês**. É o custo mais alto do stack — e ainda assim 1/3 do CPL da Meta.

---

## 4. WhatsApp Cloud API — onde a venda fecha no Brasil

### 4.1 O que você precisa antes

| Requisito | Detalhe |
|---|---|
| Conta Meta Business verificada | CNPJ + documento; leva de 1 a 5 dias |
| Número de telefone | **não pode estar ativo no WhatsApp comum** |
| Nome de exibição aprovado | sem "casa", "promo", emoji |
| BSP ou conexão direta | direto (grátis + fee) ou via BSP (fee + markup de US$ 0,003–0,010) |

### 4.2 Setup (1 hora depois de aprovado)

1. `developers.facebook.com` → **Create App** → tipo **Business**.
2. Adicione o produto **WhatsApp** → crie/associe o WABA (WhatsApp Business Account).
3. Registre o número e gere o **token permanente** (System User) → `WA_TOKEN`.
4. Anote `WA_PHONE_NUMBER_ID` (não é o número; é o ID).
5. Configure o webhook com uma URL pública HTTPS e um `verify_token` seu.

### 4.3 Enviar template (fora da janela) e texto livre (dentro)

```python
import os, requests

WA = "https://graph.facebook.com/v21.0"
H = {"Authorization": f"Bearer {os.environ['WA_TOKEN']}"}
PID = os.environ["WA_PHONE_NUMBER_ID"]

def enviar_template(para: str, nome: str, variaveis: list[str]) -> dict:
    """Marketing/utility. Custa R$0,3217 (marketing) ou R$0,035 (utility) no BR.
    Só para quem deu opt-in explícito."""
    r = requests.post(f"{WA}/{PID}/messages", headers=H, json={
        "messaging_product": "whatsapp",
        "to": para,
        "type": "template",
        "template": {
            "name": nome,
            "language": {"code": "pt_BR"},
            "components": [{"type": "body", "parameters":
                            [{"type": "text", "text": v} for v in variaveis]}],
        },
    }, timeout=30)
    r.raise_for_status()
    return r.json()

def enviar_texto(para: str, texto: str) -> dict:
    """Só dentro da janela de 24h aberta por mensagem do cliente.
    Serviço: 1.000 respostas grátis/mês, depois R$0,035."""
    r = requests.post(f"{WA}/{PID}/messages", headers=H, json={
        "messaging_product": "whatsapp", "to": para,
        "type": "text", "text": {"body": texto[:4096], "preview_url": False},
    }, timeout=30)
    r.raise_for_status()
    return r.json()
```

### 4.4 O fluxo de qualificação imobiliária (o que converte)

```
Lead chega (portal, anúncio Click-to-WhatsApp, link na bio)
  ↓ <1 min: resposta automática com quick reply
  "Para te mandar as opções certas: comprar ou alugar?"  [Comprar] [Alugar]
  ↓
  "Qual região e faixa de valor?"  → 3 opções
  ↓
  "Quer financiar? Já tem entrada?"  → sim/não/parcial
  ↓
  [BOT ENTREGA O KIT: 3 imóveis + custo total + 1 pergunta]
  ↓
  [HUMANO ASSUME] agenda visita
```

**Por que responder em <1 minuto importa:** conversão lead→visita de **35%** contra **15%** sem automação. E 78% dos leads imobiliários esperam resposta em menos de 30 minutos.

::: alerta
**Custo escondido:** desde 01/10/2026 até o **serviço** é cobrado no Brasil (R$ 0,035), com **1.000 respostas grátis por número/mês**. Se sua operação recebe 3.000 mensagens/mês, o custo de serviço é R$ 70/mês — trivial. O que dói é **marketing**: 3.000 disparos = R$ 965. Nunca dispare marketing sem segmentar.
:::

---

## 5. Instagram + Facebook Page — a conversa que vende

### 5.1 Pré-requisitos

| Item | Instagram | Facebook Page |
|---|---|---|
| Tipo de conta | **Business ou Creator** (pessoal não publica via API) | Page (não perfil) |
| App Meta | mesmo app, produto **Instagram Graph API** | produto **Messenger** |
| Permissões | `instagram_basic`, `instagram_content_publish`, `instagram_manage_messages` | `pages_messaging`, `pages_manage_posts` |
| App Review | necessário só para **contas de terceiros** | idem |

### 5.2 Publicar no Instagram (fluxo de 3 passos)

```python
import os, time, requests

IG = "https://graph.instagram.com/v21.0"
TOKEN = os.environ["IG_TOKEN"]
UID = os.environ["IG_USER_ID"]

def publicar_reels(video_url: str, legenda: str) -> str:
    """3 passos: criar container → aguardar transcodificação → publicar."""
    c = requests.post(f"{IG}/{UID}/media", data={
        "media_type": "REELS", "video_url": video_url,
        "caption": legenda[:2200], "access_token": TOKEN,
    }, timeout=30).json()
    cid = c["id"]

    for _ in range(40):                       # até ~10 min de processamento
        st = requests.get(f"{IG}/{cid}", params={
            "fields": "status_code", "access_token": TOKEN}, timeout=30).json()
        if st.get("status_code") == "FINISHED":
            break
        if st.get("status_code") == "ERROR":
            raise RuntimeError(f"transcodificação falhou: {st}")
        time.sleep(15)

    p = requests.post(f"{IG}/{UID}/media_publish", data={
        "creation_id": cid, "access_token": TOKEN}, timeout=30).json()
    return p["id"]
```

### 5.3 Responder na janela de 24h (o que dá dinheiro)

```python
def responder_dm(igsid: str, texto: str) -> dict:
    """Só vale se a pessoa te escreveu nas últimas 24h.
    validate_channel_post barra o resto antes de chegar aqui."""
    r = requests.post(f"{IG}/{UID}/messages",
        params={"access_token": TOKEN},
        json={"recipient": {"id": igsid},
              "message": {"text": texto[:1000]}},   # limite: 1.000 bytes
        timeout=30)
    r.raise_for_status()
    return r.json()
```

### 5.4 Responder comentário com 1 DM privada

```python
def dm_privada_de_comentario(comment_id: str, texto: str) -> dict:
    """Permitido: 1 mensagem por comentário, dentro de 7 dias.
    Limite: 750 chamadas/hora por conta."""
    r = requests.post(f"{IG}/{UID}/messages",
        params={"access_token": TOKEN},
        json={"recipient": {"comment_id": comment_id},
              "message": {"text": texto}},
        timeout=30)
    r.raise_for_status()
    return r.json()
```

::: alerta
**Três proibições que derrubam contas:**
1. **DM frio** — a API não tem rota para isso; tentar via navegador é spam e suspensão.
2. **Automation fora da janela** — depois de 24h só o humano envia (tag HUMAN_AGENT, 7 dias).
3. **Automação de curtir/seguir/comentar** — política de plataforma, ban automático.
:::

---

## 6. TikTok — publicar sem virar conta fantasma

### 6.1 O passo que ninguém faz e todo mundo precisa

| Etapa | O que acontece | Prazo |
|---|---|---|
| 1. Criar app em `developers.tiktok.com` | produto **Content Posting API** | 15 min |
| 2. Adicionar escopo `video.publish` | OAuth 2.0 do criador | 15 min |
| 3. **Passar no audit** | sem isso, **todo post via API fica privado** | dias a semanas |
| 4. Verificar domínio para `PULL_FROM_URL` | DNS TXT ou arquivo | 10 min |

Se você pular a etapa 3, recebe o erro `unaudited_client_can_only_post_to_private_accounts` e acha que o código está errado. **Não está.**

### 6.2 Publicar

```python
import os, requests

def publicar_tiktok(video_url: str, titulo: str) -> dict:
    """Limite: 6 req/min por token; ~15 posts/dia por criador."""
    r = requests.post(
        "https://open.tiktokapis.com/v2/post/publish/video/init/",
        headers={"Authorization": f"Bearer {os.environ['TIKTOK_TOKEN']}",
                 "Content-Type": "application/json; charset=UTF-8"},
        json={"post_info": {
                "title": titulo[:2200],
                "privacy_level": "PUBLIC_TO_EVERYONE",
                "disable_comment": False},
              "source_info": {"source": "PULL_FROM_URL",
                              "video_url": video_url}},
        timeout=30,
    )
    r.raise_for_status()
    return r.json()      # {"data": {"publish_id": "..."}}
```

### 6.3 Business Suite (sem código) — auto-mensagens

Disponível para conta **Business com Advanced Access** ou Verified Business. Quatro tipos: welcome, keyword reply (match exato), FAQ, prompts. Limites de texto: welcome 250 caracteres, keyword 500. **A moderação leva de 1 a 5 dias úteis** — planeje antes de lançar campanha.

---

## 7. YouTube — autoridade de longo prazo

**Cota:** 10.000 unidades/dia, reset à meia-noite do Pacífico.

| Operação | Custo em unidades | Quantas por dia |
|---|---|---|
| `commentThreads.list` | 1 | ~10.000 |
| `comments.insert` (responder) | **50** | **~198** |
| `search.list` | cota própria | ~100 chamadas |
| `videos.insert` (upload) | cota própria | ~100 vídeos |

```python
import os, requests

YT = "https://www.googleapis.com/youtube/v3"

def responder_comentario(parent_id: str, texto: str) -> dict:
    """50 unidades de 10.000 → no máximo ~198 respostas/dia."""
    r = requests.post(f"{YT}/comments", params={"part": "snippet"},
        headers={"Authorization": f"Bearer {os.environ['YT_ACCESS_TOKEN']}"},
        json={"snippet": {"parentId": parent_id, "textOriginal": texto[:10000]}},
        timeout=30)
    if r.status_code == 403:
        raise RuntimeError("cota esgotada — reset à meia-noite do Pacífico")
    r.raise_for_status()
    return r.json()
```

**Regra dura:** responder comentários **do seu canal** é permitido e recomendado. Comentar em vídeos de terceiros para prospectar é spam e derruba o canal.

---

## 8. Google Business Profile — a vitrine local

### 8.1 Setup

1. `console.cloud.google.com` → projeto → habilite **Business Profile Performance API** e **My Business Account Management API**.
2. Crie credenciais OAuth 2.0 (tipo "Desktop") → salve `client_id`/`client_secret`.
3. Faça o fluxo OAuth com escopo `https://www.googleapis.com/auth/business.manage`.
4. Descubra o `locationId`: `GET /v1/accounts` → `GET /v1/accounts/{id}/locations`.

### 8.2 Publicar post local

```python
import os, requests

def postar_gbp(account_id: str, location_id: str, texto: str,
               botao_url: str | None = None) -> dict:
    """1.500 caracteres, 1 imagem, expira em ~7 dias.
    Limite: 10 edições/min por perfil (não aumentável)."""
    corpo = {"languageCode": "pt-BR", "summary": texto[:1500],
             "topicType": "STANDARD"}
    if botao_url:
        corpo["callToAction"] = {"actionType": "LEARN_MORE", "url": botao_url}
    r = requests.post(
        f"https://mybusiness.googleapis.com/v4/accounts/{account_id}"
        f"/locations/{location_id}/localPosts",
        headers={"Authorization": f"Bearer {os.environ['GBP_TOKEN']}"},
        json=corpo, timeout=30)
    r.raise_for_status()
    return r.json()
```

**Limites que pegam:** 300 req/min na maioria dos endpoints, criação de local 300/dia, updates 10.000/dia, mas **10 edições/min por perfil** — e esse não sobe. **Sem analytics por post**: só por local.

---

## 9. Threads e Bluesky — teste em 20 minutos

### 9.1 Threads (2 chamadas)

```python
import os, requests

T = "https://graph.threads.com/v1.0"
TOK = os.environ["THREADS_TOKEN"]; UID = os.environ["THREADS_USER_ID"]

def postar_threads(texto: str) -> str:
    """500 caracteres. Limite: 250 posts + 1.000 respostas/24h."""
    c = requests.post(f"{T}/{UID}/threads",
        params={"media_type": "TEXT", "text": texto[:500], "access_token": TOK},
        timeout=30).json()
    p = requests.post(f"{T}/{UID}/threads_publish",
        params={"creation_id": c["id"], "access_token": TOK}, timeout=30).json()
    return p["id"]

def cota_threads() -> dict:
    return requests.get(f"{T}/{UID}/threads_publishing_limit",
        params={"fields": "quota_usage,config,reply_quota_usage",
                "access_token": TOK}, timeout=30).json()
```

### 9.2 Bluesky (AT Protocol)

```python
import os, requests

def postar_bluesky(texto: str) -> dict:
    """Sem App Review. Limite: 5.000 pontos/hora (post = 3 pontos)."""
    ses = requests.post("https://bsky.social/xrpc/com.atproto.server.createSession",
        json={"identifier": os.environ["BSKY_HANDLE"],
              "password": os.environ["BSKY_APP_PASSWORD"]}, timeout=30).json()
    return requests.post("https://bsky.social/xrpc/com.atproto.repo.createRecord",
        headers={"Authorization": f"Bearer {ses['accessJwt']}"},
        json={"repo": ses["did"], "collection": "app.bsky.feed.post",
              "record": {"text": texto[:300],
                         "createdAt": "2026-11-06T12:00:00.000Z"}},
        timeout=30).json()
```

::: dica
Bluesky usa **App Password**, não a senha da conta. Gere em Settings → App Passwords. A senha principal **nunca** vai em código.
:::

---

## 10. Orquestração: n8n ou MCP

Você tem duas rotas para ligar o cérebro aos canais sem escrever tudo do zero.

| Rota | Como funciona | Melhor para | Custo |
|---|---|---|---|
| **n8n** | nó `lmChatXAiGrok` + nós HTTP por canal | quem já tem n8n, quer visual e self-host | grátis (self-host) |
| **MCP** | servidor MCP expõe "publicar no canal X" como ferramenta | Grok Bot, Claude, qualquer agente | US$ 0–29/mês |
| **API unificada** | 1 chamada publica em 9 plataformas | velocidade de integração | US$ 24–39/mês |

### 10.1 n8n — o fluxo mínimo

```
[Cron 06:00] → [lmChatXAiGrok: gerar 3 ângulos] → [Code: validate_channel_post]
   → [IF aprovado] → [HTTP: publicar] → [Google Sheets: registrar]
   → [IF reprovado] → [Slack: pedir aprovação humana]
```

**Credencial:** uma única credencial xAI no nó `lmChatXAiGrok` (9 parâmetros; catálogo atualizado em 16/09/2026).

### 10.2 MCP — o padrão que funciona

O Grok Bot aceita **MCP server customizado**: Plugins → add custom MCP server → cole a URL HTTPS pública → faça login ou use uma chave. Padrão usado pela maioria dos servidores: **HTTP Streamable + Bearer token**.

```
# arquivo de configuração conceitual (o formato varia por host)
{
  "mcpServers": {
    "canais": {
      "url": "https://seu-servidor.com/mcp",
      "headers": { "Authorization": "Bearer ${MCP_TOKEN}" }
    }
  }
}
```

**Ferramentas que o servidor deve expor** (nada a mais):

| Ferramenta | Entrada | Saída |
|---|---|---|
| `listar_canais` | — | canais e limites vigentes |
| `validar_post` | canal + payload | ok / violação + correção |
| `enfileirar` | canal + payload | id da fila |
| `status_fila` | id | pendente/aprovado/publicado/erro |

**Nunca exponha** `publicar_direto` sem aprovação. A ferramenta mais perigosa do seu servidor é a que não pede confirmação.

### 10.3 A camada paga (se quiser velocidade)

| Serviço | Preço | O que resolve |
|---|---|---|
| Blotato | US$ 29/mês (20 contas) | 9 plataformas + geração de imagem/vídeo + MCP com 14 ferramentas |
| PostEverywhere | US$ 29/mês | 9 plataformas via API |
| Upload-Post | US$ 24/mês | 9 plataformas |
| Metricool | US$ 35 (API: US$ 77) | agendamento + analytics |

**Trade-off honesto:** US$ 29/mês economiza ~20 horas de integração. Mas você **não** escapa da política de cada plataforma — a camada paga só remove o trabalho de OAuth, não a regra da janela de 24h.

---

## 11. Checklist de "está tudo setado"

```
INFRAESTRUTURA
[ ] .env com todas as chaves (nunca comitado)
[ ] src/channels.py importado no orquestrador
[ ] fila de aprovação humana antes de qualquer publicação
[ ] log de custo por ação (X cobra por post — precisa de contador)

CANAL A CANAL
[ ] Telegram: bot criado, chat_id salvo, teste enviado
[ ] X: app criado, créditos checados, conta conectada no Grok Bot
[ ] WhatsApp: WABA aprovado, número registrado, template aprovado
[ ] Instagram: conta Business, token de 60 dias renovado, janela testada
[ ] Facebook Page: página (não perfil), Messenger conectado
[ ] TikTok: app criado, AUDIT APROVADO (senão post sai privado)
[ ] YouTube: OAuth, cota conferida, resposta de comentário testada
[ ] GBP: OAuth, locationId descoberto, post de teste publicado
[ ] Threads/Bluesky: teste de publicação

COMPLIANCE
[ ] disclosure visível antes de qualquer link
[ ] opt-in registrado (com data e origem) para WhatsApp/e-mail
[ ] bot nunca se passa por humano
[ ] LinkedIn: zero automação
[ ] Facebook Groups: zero automação (API extinta)
```

---

## 12. Erros que custam caro (e como reconhecer)

| Sintoma | Causa | Correção |
|---|---|---|
| `unaudited_client_can_only_post_to_private_accounts` | app TikTok sem audit | submeter ao audit antes de postar |
| `(#10) outside the allowed window` | Meta: mensagem fora das 24h | usar template ou esperar a pessoa escrever |
| `429 retry_after` no Telegram | 1 msg/s por chat | respeitar `retry_after` |
| `quotaExceeded` no YouTube | 10.000 unidades/dia | reset à meia-noite do Pacífico |
| post no IG sai sem erro mas não aparece | conta pessoal, não Business | converter para Business/Creator |
| conta de X com cobrança inesperada | post com URL (US$ 0,20) | tirar link do post principal |
| WhatsApp não entrega | template não aprovado ou opt-out | reenviar para aprovação |
| `409` no canal X (créditos) | saldo de pay-per-use acabou | recarregar ou pausar a fila |
| LinkedIn: restrição de conta | automação de sessão | remover ferramenta; §8.2 |

---

## 13. Quanto custa manter tudo ligado (mensal)

| Item | Custo | Natureza |
|---|---|---|
| xAI API (redação + radar) | US$ 15–25 | variável |
| X API (leitura + posts) | US$ 20–35 | variável — cuidado com link |
| WhatsApp (marketing 1.000 msg) | R$ 322 (~US$ 58) | variável |
| WhatsApp (serviço) | R$ 0–70 | quase grátis |
| Grok Bot | US$ 30 | fixo (plano Premium) |
| n8n self-host | US$ 0 | fixo |
| Orquestrador pago (opcional) | US$ 29 | fixo |
| **Total realista** | **US$ 95–175/mês** | |

Comparado a: um único lead de real estate nos EUA (US$ 35–65) ou um lead qualificado (US$ 150–300). **O stack inteiro custa menos que 2 leads qualificados por mês.** Esse é o argumento econômico do canal orgânico com bot.

::: decisao
**Se você só pode fazer uma coisa esta semana:** crie o bot do Telegram e o app da xAI. São 25 minutos, custam quase nada, e validam o fluxo completo (Grok escreve → você aprova → publica) sem tocar em nenhuma plataforma com política rígida. Todo o resto é extensão do mesmo padrão.
:::
