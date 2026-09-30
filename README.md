# BlogMaster ✍️

**Estúdio de escrita guiada para Marketing, Storytelling e Escrita Avançada.**

O processo de escrita é apresentado como um **chat responsivo e fluido** ("Maestro"), com
**abas decisórias de rumo**: cada escolha do autor (missão, formato, tom, canal, âncoras)
re-roteia os entregáveis. Ao final do direcionamento, o estúdio entrega:

1. **Os 3 prompts de escrita da Etapa 4**, prontos para copiar (com botão de copiar e
   contexto do projeto já embutido em cada um);
2. **O checklist dos 5 Must-Haves em formato de cards** interativos (Etapa 5);
3. O **código/estrutura de componentes** — este repositório, em **React + Next.js (App
   Router) + Tailwind CSS v4 + TypeScript strict**.

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

## O método (6 etapas)

| Etapa | Nome | Onde vive no app |
|---|---|---|
| 1 | Briefing & direcionamento | Chat (tema + missão) |
| 2 | Formato & estrutura narrativa | Chat (formato) |
| 3 | Voz, promessa & âncoras | Chat (tom, promessa, canal, âncoras) |
| 4 | Escrita — 3 prompts | Aba **Etapa 4 · Prompts** |
| 5 | Revisão — 5 Must-Haves | Aba **5 Must-Haves** |
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

---

## Estrutura de componentes (React/Next)

```
blogmaster/
├── app/
│   ├── layout.tsx              # Raiz (pt-BR, metadata, fundo dark)
│   ├── page.tsx                # Estado global: respostas, progresso, abas, persistência
│   └── globals.css             # Tailwind v4 + animações (rise, typing dots, scrollbar)
├── components/
│   ├── studio/
│   │   ├── Header.tsx          # Header fixo com pílula de etapa atual
│   │   ├── TopTabs.tsx         # Abas principais (chat / prompts / checklist)
│   │   └── SidePanel.tsx       # Mapa do método (6 etapas) + "Rumo atual" editável
│   ├── chat/
│   │   ├── ChatFlow.tsx        # Motor do chat: bolhas, input livre e chips decisórios
│   │   ├── TypingDots.tsx      # Indicador "digitando…"
│   │   └── SummaryCard.tsx     # Recap das decisões + CTAs ao fim do direcionamento
│   ├── prompts/
│   │   ├── PromptsView.tsx     # Aba Etapa 4: contexto, banner e "copiar os 3"
│   │   └── PromptCard.tsx      # Card de prompt com <pre> e botão copiar
│   ├── checklist/
│   │   └── MustHavesView.tsx   # Aba Etapa 5: grid de cards com toggle e progresso
│   └── ui/
│       └── CopyButton.tsx      # Clipboard com fallback + estado "Copiado!"
└── lib/
    ├── types.ts                # Tipos: Answers, Steps, Prompt, MustHave, ids de decisão
    ├── method.ts               # STEPS (perguntas/chips), ETAPAS, helpers de estado
    ├── prompts.ts              # Blocos por decisão + buildPrompts() → 3 prompts finais
    ├── musthaves.ts            # Conteúdo dos 5 Must-Haves
    └── cls.ts                  # Concatenador de classes
```

### Como o chat funciona

- `page.tsx` mantém `answers`, `progress` (índice do passo atual em `STEPS`) e a aba ativa,
  persistidos em `localStorage` (`blogmaster-studio-v1`).
- As mensagens do chat são **derivadas** do progresso (sem estado duplicado): passos
  concluídos viram bolhas "Maestro + resposta"; o passo atual renderiza chips decisórios
  (decisões) ou input livre (tema/promessa).
- Voltar a uma decisão é só reposicionar `progress` (✏️ no painel lateral) — o histórico
  é re-derivado automaticamente.
- Com `progress === STEPS.length`, o `SummaryCard` libera as abas Etapa 4 e 5.

### Como personalizar o conteúdo

- Perguntas, chips e etapas: `lib/method.ts`
- Blocos de prompt por decisão (missão/formato/tom/canal/âncoras): `lib/prompts.ts`
- Cards do checklist: `lib/musthaves.ts`

Nenhum componente precisa ser alterado para mudar o conteúdo editorial.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript strict
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Estado 100% client-side + `localStorage` (sem backend)
