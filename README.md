# 📌 BlogMaster — Pinterest + IA (Custo Zero)

**Sistema completo para ganhar dinheiro no Pinterest usando Inteligência Artificial de graça.**

Duas entregas que funcionam juntas: o **método** (a Bíblia, em 16 capítulos) e a **execução** (o app que te pega pela mão e faz o trabalho pesado).

| Entrega | O que é | Onde |
|---|---|---|
| 📕 **A BÍBLIA** | O método completo em 16 capítulos: fundamentos, nichos, validação de produtos, visual que converte, biblioteca de prompts, ferramentas grátis, integrações/APIs, compliance, 7 vias de monetização, plano 30-60-90, métricas e escala. | [`BIBLIA/00-INDICE.md`](BIBLIA/00-INDICE.md) |
| 🛠️ **O APP (PinMind)** | App web offline com 11 etapas guiadas: valida nicho e produto com score, gera todos os prompts (PT-BR + EN), valida o visual, monta o pack de pins, exporta em CSV/Markdown. **O link você cola à mão.** | [`app/index.html`](app/index.html) |

---

## ⚡ Começar agora (2 minutos)

**Opção 1 — arquivo único (a mais simples):** dê duplo-clique em
[`PinMind-app-completo.html`](PinMind-app-completo.html). É o app inteiro (interface + 16 capítulos da
Bíblia) dentro de um só arquivo. Funciona offline, sem instalar nada, em qualquer navegador.

**Opção 2 — abrir a pasta do app:** duplo-clique em `app/index.html`.

**Opção 3 — servidor local:**
```bash
node scripts/servir.js 8080      # abra http://localhost:8080
```

O app funciona 100% offline, sem chave de API e sem cadastro. Seus projetos ficam salvos no
navegador (`localStorage`) e podem ser exportados em JSON / CSV / Markdown.

> ℹ️ Em alguns navegadores, abrir o arquivo direto do disco (`file://`) **bloqueia o salvamento
> automático**. Nesse caso o app avisa e entra em *modo sessão*: continua funcionando, mas use o
> botão **Exportar** para guardar. Isso vale também para janela anônima.

---

## 🧭 As 11 etapas do app

| # | Etapa | O que acontece |
|---|---|---|
| 0 | **Fundação** | Conta business, bio com keyword, 5 boards, claim do site |
| 1 | **Nicho** | Escolha guiada entre 16 nichos, com score de oportunidade e sub-nichos |
| 2 | **Produto/Oferta** | Validação por **12 critérios** (3 bloqueios de peso máximo) + calculadora de comissão + tabela de 16 categorias de oferta |
| 3 | **Ângulos** | 1 palavra-chave → **10 ângulos** diferentes, com gatilho, estilo e destino |
| 4 | **Visual** | 12 estilos mapeados com o que mais se vê no feed + prompts de imagem prontos |
| 5 | **Texto** | Título (40-60 caracteres), descrição, alt text, overlay, hashtags, nome do arquivo |
| 6 | **Vídeo e carrossel** | Roteiro de 6-15s e carrossel de 5 slides + mix de formatos |
| 7 | **Página e link** | Modelo de página com aviso de afiliado; **o link é colado manualmente** |
| 8 | **Validação final** | 4 checklists com nota (produto, visual, SEO, compliance) e bloqueios |
| 9 | **Pack de produção** | Gera 10 ou 20 pins completos e exporta em Markdown / CSV / JSON |
| 10 | **Publicar e medir** | Calendário de 30 dias + calculadora de CTR/conversão/RPM + diagnóstico |
| 11-13 | **Referência** | Biblioteca com os 15 prompts, a Bíblia completa dentro do app e Integrações opcionais |

---

## 📂 Estrutura

```
BIBLIA/              16 capítulos do método (Markdown)
  00-INDICE.md       comece por aqui
  ...
  15-fontes.md       de onde veio cada número + links oficiais

app/
  index.html         o app (abra este arquivo)
  assets/css/        estilo (sem dependências externas)
  assets/js/         motor de prompts, validação, exportação, UI
  assets/js/biblia.js   Bíblia embutida (GERADO — não edite à mão)
  dados/             base de conhecimento: nichos, ofertas, benchmarks, estilos

scripts/
  servir.js          servidor estático local (Node, sem dependências)
  build-biblia.js    converte BIBLIA/*.md → app/assets/js/biblia.js
  testar-motor.js    testes do núcleo (prompts, score, geração, exportação)
  testar-ui.js       testes da interface em DOM real (requer jsdom)

templates/           planilhas prontas (calendário, pack, métricas, compliance)
```

---

## 📦 Gerar o arquivo único e o ZIP para download

```bash
npm run build         # regenera a Bíblia embutida + o PinMind-app-completo.html
npm run zip           # gera ../pinterest-ia-custo-zero.zip pronto para distribuir
```

O ZIP sai **fora** do repositório (binário não é versionado) e traz, na raiz, um
`LEIA-ME-PRIMEIRO.txt` explicando o que fazer no primeiro dia.

---

## 🧪 Testes

```bash
npm run testar              # 60+ asserções no núcleo (roda sem dependências)
npm run testar:ui           # fluxo completo em DOM real (precisa de jsdom)
npm run testar:standalone   # valida o arquivo único abrindo via file:// (precisa de jsdom)
npm run testar:tudo         # rebuild + os três testes
```

---

## 🔁 Manutenção

Editou algum capítulo da Bíblia? Regenere os artefatos:

```bash
npm run build         # = node scripts/build-biblia.js && node scripts/gerar-standalone.js
```

Nunca edite à mão `app/assets/js/biblia.js` nem `PinMind-app-completo.html` — os dois são
gerados a partir dos `.md` em `BIBLIA/` e do código em `app/`.

---

## 🔌 Integrações (opcionais, desligadas por padrão)

O app funciona inteiro com o modo **copiar-e-colar** em IAs gratuitas. Se quiser automatizar:

- **API de IA** (qualquer endpoint compatível com OpenAI: OpenAI, Groq, OpenRouter, Together, Ollama local) — aba *Integrações*.
- **Pinterest API v5** — exige app aprovado; no degrau *Trial* os pins ficam privados e o *Standard* pede revisão com vídeo.

> ⚠️ **Importante:** as diretrizes do Pinterest proíbem aplicações que executam ações **sem consideração individual de cada uma**. Publicar em massa por API viola os termos. O app é deliberadamente manual: ele monta tudo, você revisa e publica.

---

## ⚖️ Aviso

Nada aqui é promessa de renda. Os números usados como referência vêm de benchmarks públicos de mercado (2025-2026), todos citados no [`BIBLIA/15-fontes.md`](BIBLIA/15-fontes.md). Pinterest, programas de afiliados e ferramentas mudam de regra com frequência — **revalide sempre** nos links oficiais antes de escalar.

O que este material entrega é o **processo**: validar antes de produzir, produzir em volume, medir e cortar o que não funciona.
