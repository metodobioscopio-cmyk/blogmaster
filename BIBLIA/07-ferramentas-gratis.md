# 07 · Ferramentas Grátis e Integrações — o stack de custo zero

---

## 7.1 O stack completo (R$ 0)

| Etapa | Ferramenta | O que dá no plano grátis | Limitação honesta |
|---|---|---|---|
| **Texto / estratégia** | ChatGPT, Gemini, Claude | Chat ilimitado com limites de mensagem | Modelos mais fortes limitam uso por janela de tempo |
| **Imagem 2:3** | Bing Image Creator / Microsoft Designer | Gerações lentas praticamente ilimitadas + boosts semanais | ⚠️ Termos do Designer de consumidor restringem uso comercial — confira antes de monetizar |
| **Imagem 2:3** | Leonardo AI | ~150 tokens/dia (≈30-50 imagens) | Saída fica pública no plano grátis |
| **Imagem 2:3** | Ideogram | ~10 a 25/dia (fila lenta) | Fila lenta; melhor para texto dentro da imagem |
| **Imagem 2:3** | Adobe Firefly | ~25 créditos/mês | Segurança jurídica máxima, volume baixo |
| **Design do pin** | Canva grátis | Designs ilimitados, milhares de templates | Recursos de IA premium são pagos |
| **Vídeo** | CapCut desktop | Editor completo, exporta em 1080p/4K sem marca d'água | Efeitos premium são pagos |
| **Vídeo** | Canva grátis | Editor simples, templates de vídeo | Menos controle fino |
| **Vídeo com IA** | Kling AI | ~66 créditos/dia (~3-6 clipes de 5s) | Marca d'água e **sem uso comercial** no grátis |
| **Vídeo com IA** | Hailuo / MiniMax | ~3-5 gerações/dia | Marca d'água e sem uso comercial no grátis |
| **Agendamento** | Agendador nativo do Pinterest | Até 10 pins na fila; 14 dias (desktop) / 30 dias (app) | Fila pequena |
| **Agendamento** | Metricool | ~20 publicações/mês | Limite mensal baixo |
| **Agendamento** | Buffer | Até 10 posts na fila por canal | Pouco recurso específico de Pinterest |
| **Pesquisa** | Pinterest Trends | Grátis, sem login | Só dados dos EUA na maior parte |
| **Pesquisa** | Busca guiada do Pinterest | Grátis e o mais útil | Manual |
| **Página de destino** | Notion público, Gumroad, Payhip, Blogger, Substack | Grátis | Limites de customização |
| **Venda de digital** | Gumroad, Payhip, Ko-fi | Grátis (taxa por venda) | Taxa sobre cada venda |
| **Analytics** | Pinterest Analytics (conta business) | Nativo e grátis | Janela limitada de histórico |
| **Organização** | Este app (PinMind) + planilha | Ilimitado | Salva no seu navegador |

---

## 7.2 O fluxo de trabalho em 1 hora (o "bloco de produção")

Este é o processo que transforma IA grátis em 15-20 pins por sessão:

```
┌─ 0-10 min · PLANEJAMENTO ────────────────────────────────┐
│ Abra o app na etapa 9, escolha a ficha da semana.        │
│ Defina: 1 oferta principal + 3 ângulos.                   │
└──────────────────────────────────────────────────────────┘
┌─ 10-20 min · TEXTO ──────────────────────────────────────┐
│ Prompt 4 (Fábrica de Pins) no ChatGPT → 5 pins por ângulo │
│ = 15 pins com título, descrição, alt, overlay, arquivo    │
└──────────────────────────────────────────────────────────┘
┌─ 20-40 min · IMAGEM ─────────────────────────────────────┐
│ Cole cada prompt de imagem no gerador grátis.             │
│ Gere 2-3 variações por prompt. Salve as 15 melhores.      │
└──────────────────────────────────────────────────────────┘
┌─ 40-55 min · DESIGN ─────────────────────────────────────┐
│ Canva: template mestre → duplicar → trocar imagem+texto.  │
│ Exportar PNG. Renomear com a keyword.                     │
└──────────────────────────────────────────────────────────┘
┌─ 55-60 min · PUBLICAR ───────────────────────────────────┐
│ Publicar/agendar 5 pins. Colar o link na mão em cada um.  │
│ Registrar o que foi publicado.                            │
└──────────────────────────────────────────────────────────┘
```

**Quantidade realista:** 15 pins em 1 hora por sessão. Três sessões por semana = 45 pins/semana = ~180 pins/mês. É exatamente o volume necessário para o acervo que rende no mês 3.

---

## 7.3 Integrações e APIs (para quem quer ir além)

### 7.3.1 Pinterest API v5 — o que é possível e o que não é

A API do Pinterest é **gratuita**, mas tem dois degraus:

| | **Trial access** | **Standard access** |
|---|---|---|
| Como obter | Aprovação simples do app em `developers.pinterest.com` | Requer revisão com **vídeo demonstrando o fluxo OAuth** |
| Pins e boards criados | Ficam **visíveis só para você** (entidades sandbox) | Públicos, como qualquer pin |
| Limite | 1.000 requisições/dia por app | 100 requisições/s por usuário |
| Criação de pins (`org_write`) | 300/dia | 100/minuto |
| Sandbox | `api-sandbox.pinterest.com/v5` (não cria video pins) | — |

**Escopos necessários para criar um pin:** `boards:read`, `boards:write`, `pins:read`, `pins:write`.
**Token:** dura 30 dias com refresh de 60 dias. Exige OAuth 2.0.

**Exemplo de criação de pin (imagem):**
```bash
curl -X POST "https://api.pinterest.com/v5/pins" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "board_id": "ID_DO_BOARD",
    "title": "Organização de Cozinha Pequena em 6 Passos",
    "description": "Passo a passo para organizar cozinha pequena sem gastar muito. Contém link de afiliado.",
    "alt_text": "Cozinha pequena organizada com potes empilháveis e prateleira suspensa",
    "link": "https://sua-pagina.com/organizacao-cozinha",
    "media_source": { "source_type": "image_url", "url": "https://.../pin.jpg" }
  }'
```

### ⛔ A regra que você PRECISA conhecer antes de automatizar

As diretrizes de desenvolvedor do Pinterest proíbem aplicações que **permitem ao usuário final iniciar ações automaticamente, sem considerar especificamente cada ação**. Na prática:

- ❌ Script que publica 50 pins sozinho, sem revisão → **viola os termos**
- ✅ Ferramenta que monta o pin e você aprova um por um → **permitido**

**Conclusão pragmática:** para 95% das pessoas, **publicar pela interface do Pinterest é mais rápido, mais seguro e mais barato** do que construir integração. Use a API apenas se você tiver um volume que justifique o trabalho de engenharia — e mesmo assim, com revisão humana pin a pin.

### 7.3.2 Quando a API realmente vale a pena

| Cenário | Vale a pena? | Alternativa |
|---|---|---|
| Publicar 3-5 pins/dia sozinho | ❌ Não | Interface + agendador nativo |
| Agendar 30 pins de uma vez | ❌ Não | Metricool grátis / Buffer grátis |
| Gerenciar Pinterest de 5 clientes | ✅ Sim | API + aprovação humana por pin |
| Puxar analytics automaticamente | ✅ Talvez | API de analytics ou exportar CSV nativo |
| Publicar 200 pins/dia | ❌ Violaria os termos | Não faça |

### 7.3.3 Outras integrações úteis

| Integração | Para quê | Como |
|---|---|---|
| **Rich Pins** | Puxa metadados do seu site automaticamente | Reivindicar domínio + validar com o Rich Pin Validator |
| **Google Analytics / GA4** | Ver o tráfego que vem do Pinterest e onde ele converte | UTM: `?utm_source=pinterest&utm_medium=organic&utm_campaign=nome_do_pin` |
| **Webhook do Gumroad/Payhip** | Saber na hora que vendeu | Painel do produto → notificações |
| **Zapier/Make (grátis limitado)** | Ligar venda → Google Sheets → notificação | Automação simples de 2 passos |
| **API de IA (opcional)** | Gerar texto direto pelo app PinMind | Aba Integrações do app |

### 7.3.4 UTMs: como saber qual pin vendeu

Cole sempre na URL de destino:
```
https://sua-pagina.com/organizacao-cozinha?utm_source=pinterest&utm_medium=organic&utm_campaign=org-cozinha-v1
```
Troque `utm_campaign` a cada pin/pack. Assim você descobre **qual pin** trouxe a venda — não só "o Pinterest". Sem isso, você voa às cegas.

---

## 7.4 O que NÃO vale a pena (economize seu tempo)

| Tentação | Por que evitar |
|---|---|
| Comprar seguidores | Seguidores não influenciam distribuição (97% das buscas são não-marcadas) |
| Ferramenta paga de "pins ilimitados" | Os limites do Pinterest são o gargalo, não a ferramenta |
| Bot de auto-follow / auto-comment | Padrão de spam → limitação de conta |
| Encurtador de link | Bloqueado/marcado |
| Gerador de "pin automático em massa" | Gera criativo repetitivo = o oposto de pin fresco |
| Comprar lista de "melhores produtos" | O que funciona em 2026 muda em 2 meses |
| Curso de Pinterest de R$ 2.000 antes de faturar | Você tem a Bíblia e o app. Execute 90 dias primeiro |

---

## 7.5 Ordem de aquisição de ferramentas (se você for evoluir)

Quando o projeto começar a dar dinheiro, esta é a ordem de investimento com melhor retorno:

| Prioridade | Investimento | Quando | Por quê |
|---|---|---|---|
| 6º | Domínio próprio (~R$ 40/ano) | Ao criar o blog | Credibilidade + claim + e-mail |
| 5º | Hospedagem de blog (~R$ 15/mês) | Ao passar de 5 páginas de destino | Você deixa de depender de terceiros |
| 4º | Canva Pro (~R$ 40/mês) | Ao passar de 100 pins | Redimensionamento e recursos de IA |
| 3º | Gerador de imagem pago | Quando o grátis limitar volume | Consistência e velocidade |
| 2º | Agendador (Tailwind/Metricool) | Ao passar de 5 pins/dia | Constância sem esforço diário |
| 1º | **API de IA (US$ 5-20/mês)** | **Assim que houver receita** | Elimina o copiar-e-colar: maior ganho de tempo por real gasto |

⚠️ **Só invista depois que houver receita.** Ferramenta paga antes de faturamento é o erro mais comum e mais caro de quem começa.

---

**Próximo:** [08 · Compliance e Risco](08-compliance-e-risco.md)
