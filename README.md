# BlogMaster ✍️

**Estúdio full-stack de escrita guiada para Marketing, Storytelling e Escrita Avançada.**

O processo de escrita é conduzido por um **chat responsivo e fluido** ("Maestro"), com
**abas decisórias de rumo**: cada escolha do autor (missão, formato, tom, canal, âncoras)
re-roteia os entregáveis. Tudo agora é **persistido na API**: múltiplos projetos,
retomada de onde parou, checklist salvo e rascunho com autosave.

> Filosofia: *do genérico ao inconfundível* — âncoras concretas, teste do transplante e
> banimento de clichês para impedir texto "transplantável".

---

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:3000 (bound em 0.0.0.0)
npm run typecheck  # tsc --noEmit
npm run build      # build de produção
```

O banco SQLite é criado automaticamente em `data/blogmaster.db` (fora do Git) na primeira
escrita da API.

## Arquitetura full-stack

```
┌─ React 19 + Next.js 15 (App Router) ─────────────────────────────┐
│  Dashboard (/)            → lista/cria/exclui projetos           │
│  Workspace (/projeto/[id]) → chat, prompts, checklist, rascunho  │
│  UI otimista: cada decisão faz PATCH e reverte em caso de erro   │
└───────────────┬──────────────────────────────────────────────────┘
                │ fetch relativo (API Routes)
┌───────────────▼──────────────────────────────────────────────────┐
│  API REST (Next Route Handlers) + validação Zod                  │
│  GET/POST  /api/projects                                         │
│  GET/PATCH/DELETE /api/projects/:id                              │
│  GET       /api/projects/:id/prompts  (montados no servidor)     │
└───────────────┬──────────────────────────────────────────────────┘
                │
┌───────────────▼──────────────────────────────────────────────────┐
│  node:sqlite (SQLite embutido no Node, WAL) — data/blogmaster.db │
│  projects: id, title, answers_json, checklist_json, draft,       │
│            created_at, updated_at                                │
└──────────────────────────────────────────────────────────────────┘
```

### Contratos da API

| Método | Rota | Corpo | Saída |
|---|---|---|---|
| GET | `/api/projects` | — | `{ projects: ProjectDTO[] }` |
| POST | `/api/projects` | `{ title }` | `{ project }` (201) |
| GET | `/api/projects/:id` | — | `{ project }` ou 404 |
| PATCH | `/api/projects/:id` | `{ title?, answers?, checklist?, draft? }` | `{ project }` |
| DELETE | `/api/projects/:id` | — | `{ ok: true }` |
| GET | `/api/projects/:id/prompts` | — | `{ prompts: Prompt[3] }` |

Entradas são validadas com Zod (enums de decisão, limites de tamanho); PATCH vazio → 400.

## O método (6 etapas)

| Etapa | Nome | Onde vive no app |
|---|---|---|
| 1 | Briefing & direcionamento | Chat (tema + missão) |
| 2 | Formato & estrutura narrativa | Chat (formato) |
| 3 | Voz, promessa & âncoras | Chat (tom, promessa, canal, âncoras) |
| 4 | Escrita — 3 prompts | Aba **Etapa 4 · Prompts** (gerados pela API) |
| 5 | Revisão — 5 Must-Haves | Aba **5 Must-Haves** (progresso salvo) |
| 6 | Publicação | Em breve |

### Abas decisórias de rumo

Cada decisão no chat altera os blocos injetados nos prompts:

- **Missão** (vender / educar / inspirar / autoridade) → troca a arquitetura do Prompt 1
  (PAS, passos progressivos, 3 atos ou tese contra-intuitiva).
- **Formato** (opinião / guia / estudo de caso / narrativa) → diretrizes estruturais do Prompt 2.
- **Tom** (provocativo / conversacional / técnico / inspirador) → diretrizes de voz do Prompt 2/3.
- **Canal** (blog SEO / LinkedIn / newsletter / Instagram) → tamanho, abertura e CTA.
- **Âncoras** (fortes / parciais / nenhuma) → política de evidência; sem âncoras, os prompts
  proíbem inventar dados e marcam `[ÂNCORA NECESSÁRIA]`.

### Os 3 prompts da Etapa 4

1. **Esqueleto narrativo + 5 hooks** — estrutura antes de escrever.
2. **Rascunho guiado** — redação com voz, canal e âncoras travados + teste do transplante.
3. **Revisão avançada pelos 5 Must-Haves** — notas, cortes e versão final.

### Os 5 Must-Haves (Etapa 5, em cards)

1. 🎯 Hook magnético · 2. 🤝 Uma promessa, um leitor · 3. 🧲 Âncoras concretas ·
4. 🎢 Arco emocional · 5. 🚪 CTA único

### Nova aba Rascunho

Área para colar o resultado do Prompt 2 e trabalhar a versão final — com **autosave
debounced na API**, indicador de status (Salvando… / Salvo ✓ / Erro), contagem de
palavras e botão de copiar.

---

## Estrutura do código

```
blogmaster/
├── app/
│   ├── page.tsx                     # Dashboard (server component)
│   ├── projeto/[id]/page.tsx        # Workspace do projeto
│   ├── api/projects/route.ts        # GET lista · POST cria
│   ├── api/projects/[id]/route.ts   # GET · PATCH · DELETE
│   ├── api/projects/[id]/prompts/route.ts  # GET prompts montados no servidor
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── dashboard/ProjectsDashboard.tsx   # Cards, criação, exclusão em 2 cliques
│   ├── workspace/Workspace.tsx           # Estado do projeto + UI otimista
│   ├── studio/{Header,TopTabs,SidePanel}.tsx
│   ├── chat/{ChatFlow,TypingDots,SummaryCard}.tsx
│   ├── prompts/{PromptsView,PromptCard}.tsx   # Busca prompts na API
│   ├── checklist/MustHavesView.tsx            # Cards controlados pelo servidor
│   ├── draft/DraftView.tsx                    # Autosave na API
│   └── ui/{CopyButton,ToastHost}.tsx
├── lib/
│   ├── db.ts            # node:sqlite: schema + CRUD
│   ├── schemas.ts       # validação Zod da API
│   ├── api.ts           # client fetch helper com ApiError
│   ├── toast.ts         # bus de notificações
│   ├── types.ts         # Answers, Steps, ProjectDTO, Prompt, MustHave
│   ├── method.ts        # STEPS (perguntas/chips), ETAPAS, helpers
│   ├── prompts.ts       # blocos por decisão + buildPrompts() (client & server)
│   ├── musthaves.ts     # conteúdo dos 5 Must-Haves
│   └── cls.ts
└── data/blogmaster.db   # SQLite (gitignored, criado pela API)
```

### Fluidez e responsividade

- **UI otimista**: decisões do chat, checklist e título atualizam na hora; o PATCH roda em
  background e reverte + avisa (toast) se a API falhar.
- **Skeletons** no dashboard e na aba de prompts enquanto a API responde.
- **Autosave com debounce** (700 ms) no rascunho, com indicador de status.
- Toasts não bloqueantes, abas com scroll horizontal no mobile, grids responsivos.

### Como personalizar o conteúdo

- Perguntas, chips e etapas: `lib/method.ts`
- Blocos de prompt por decisão (missão/formato/tom/canal/âncoras): `lib/prompts.ts`
- Cards do checklist: `lib/musthaves.ts`

Nenhum componente precisa ser alterado para mudar o conteúdo editorial.

## Stack

- Next.js 15 (App Router + Route Handlers) · React 19 · TypeScript strict
- Tailwind CSS v4 · Zod (validação da API) · SQLite nativo do Node (node:sqlite, WAL)
- UI 100% client-side sobre API REST do próprio Next (sem backend externo)
