# Conectar o WhatsApp do corretor + Disparo Sequencial

## Modo Web (recomendado — funciona hoje, sem custo)

1. No app: **🔗 Conectar WhatsApp → Abrir WhatsApp Web**.
2. No celular do corretor: **WhatsApp → ⋮ (Android) / Ajustes (iPhone) → Aparelhos conectados → Conectar aparelho** e escaneie o QR Code.
3. Volte ao app, informe o número (com DDD) e clique **✅ Marcar como conectado**.
4. **🗂️ Painel por Listas** → importe/cole a lista → no card da lista, **🚀 Disparo sequencial**
   (ou **🛡️ Fila Segura → ▶ INICIAR DISPARO SEQUENCIAL**).
5. Fluxo por lead: **💬 1 · Abrir WhatsApp e enviar p/ _nome_** (abre a conversa no seu WhatsApp conectado, já com a mensagem personalizada — nome dele + nome do corretor) → você aperta *enviar* no WhatsApp → volta ao CRM e clica **✅ 2 · Enviei — próximo lead**. O intervalo anti-ban conta sozinho (dá para pular a espera).

> Por que não um robô que aperta enviar sozinho? Porque automação não-oficial sobre o WhatsApp Web/app é o caminho mais rápido para banir o número. Aqui, o disparo coletivo é uma **fila sequencial assistida**: 2 cliques por lead, sem digitar nada.

## Modo API Oficial (automático de verdade — Meta Cloud API)

1. Acesse **developers.facebook.com** → *Meus apps* → criar app tipo **Empresa** → adicionar produto **WhatsApp**.
2. Em **WhatsApp → Configuração da API**: copie o **Phone Number ID** e gere um **token** (temporário para teste; permanente via usuário do sistema p/ produção).
3. Em **WhatsApp → Gerenciar modelos**, crie e aprove o template do 1º contato com **duas variáveis no corpo**: `{{1}}` = primeiro nome do lead, `{{2}}` = nome do corretor. Sugestão de corpo (Acelera 3.0, Etapa 1):

```
Olá, {{1}}, tudo bem?

Sou o {{2}}, especialista de atendimento da MRV — a maior construtora da América Latina! 🏢✨

Posso te fazer uma pergunta rápida? Para eu te enviar os detalhes exatos e calcular as melhores condições para você, qual destas localizações você prefere?

📍 *APARECIDA DE GOIÂNIA*
1️⃣ *Gran Essence* — Parque das Nações
2️⃣ *Gran Safira* — Parque Atheneu
3️⃣ *Gran Parma* — Papillon Park

📍 *GOIÂNIA*
4️⃣ *Gran Terrazzo* — Jardim Nova Esperança (Noroeste)
5️⃣ *Golden Ville* — Noroeste (atrás da Unialfa)
6️⃣ *Priville* — Carolina Parque
7️⃣ *Gran Aurora* — Jardim Gardênia
8️⃣ *Gran Porto* — Jardim Novo Mundo
9️⃣ *Vert* — Parque Amazônia

Me responda apenas com o número da opção que mais te interessa!
```

4. No app: **🔗 Conectar WhatsApp** → preencha Phone Number ID, template aprovado (ex.: `mrv_abertura_menu9_v1`), idioma `pt_BR` e o token → **💾 Salvar** → **🔌 Testar conexão API**.
5. Em **🚀 Modo do Disparo Sequencial**, escolha **☁️ API Oficial**. A partir daí, o botão envia o template e avança sozinho pela lista, respeitando o intervalo — com **⏸ Pausar** e **⏹ Parar**.

### Servidor (produção)

O `server.js` expõe a ponte com a Meta (sem expor o token no navegador, se preferir):

| Endpoint | Uso |
|---|---|
| `GET /api/whatsapp/status?phoneNumberId=...` | Testar conexão (número, nome verificado, qualidade) |
| `POST /api/whatsapp/send` | Enviar template (`{to, templateName, language, bodyParams}`) ou texto na janela de 24h (`{to, text}`) |
| `GET/POST /api/whatsapp/webhook` | Verificação + recebimento de respostas/status |
| `GET /api/whatsapp/inbox` | Últimos eventos recebidos (memória) |

Variáveis de ambiente: `WA_TOKEN`, `WA_PHONE_NUMBER_ID`, `WA_VERIFY_TOKEN` (padrão `blogmaster-acelera-2026`).
No painel da Meta (Webhook): URL = `https://SEU-DOMINIO/api/whatsapp/webhook`, verify token idêntico ao do servidor, assinar o campo **messages**.

> ⚠️ A prévia de testes do Arena bloqueia internet externa p/ a Meta (`graph.facebook.com`) — o **Modo Web funciona 100% nela**; o **Modo API** deve ser testado no servidor de produção. Nunca compartilhe o token; trate listas e documentos conforme a LGPD.
