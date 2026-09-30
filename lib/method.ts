import type { Answers, Step } from "./types";

export const DEFAULT_ANSWERS: Answers = {
  tema: "",
  missao: null,
  formato: null,
  tom: null,
  promessa: "",
  canal: null,
  ancoras: null,
};

export interface EtapaMeta {
  n: number;
  titulo: string;
  desc: string;
}

export const ETAPAS: EtapaMeta[] = [
  { n: 1, titulo: "Briefing & direcionamento", desc: "Tema, missão e rumo do conteúdo" },
  { n: 2, titulo: "Formato & estrutura narrativa", desc: "O esqueleto que sustenta a história" },
  { n: 3, titulo: "Voz, promessa & âncoras", desc: "Tom, transformação e evidências" },
  { n: 4, titulo: "Escrita — 3 prompts", desc: "Esqueleto, rascunho e revisão guiados" },
  { n: 5, titulo: "Revisão — 5 Must-Haves", desc: "O espelho editorial do texto" },
  { n: 6, titulo: "Publicação", desc: "Distribuição, SEO e republicação" },
];

export const STEPS: Step[] = [
  {
    kind: "text",
    id: "tema",
    etapa: 1,
    etapaLabel: "Briefing & direcionamento",
    question: "Para começar: qual é o tema ou ideia central do seu conteúdo?",
    sub: "Uma frase basta. Ex.: “Como precificar serviços criativos sem competir por preço.”",
    placeholder: "Ex.: Precificação para criativos que não sabem cobrar",
    fallback: "um conteúdo sobre marketing e escrita que eu ainda vou definir",
  },
  {
    kind: "decision",
    id: "missao",
    etapa: 1,
    etapaLabel: "Briefing & direcionamento",
    question: "Qual é a missão deste conteúdo? Essa aba decide o rumo de todo o processo.",
    sub: "Cada missão ativa uma arquitetura diferente nos prompts da Etapa 4.",
    options: [
      { id: "vender", label: "Persuadir & vender", emoji: "🛒", hint: "Estrutura PAS, objeções e CTA forte" },
      { id: "educar", label: "Educar & guiar", emoji: "🧭", hint: "Passos progressivos e analogias" },
      { id: "inspirar", label: "Inspirar & conectar", emoji: "✨", hint: "Storytelling com arco emocional" },
      { id: "autoridade", label: "Construir autoridade", emoji: "🏛️", hint: "Tese contra-intuitiva + evidência" },
    ],
  },
  {
    kind: "decision",
    id: "formato",
    etapa: 2,
    etapaLabel: "Formato & estrutura narrativa",
    question: "Qual formato conversa melhor com esse tema?",
    sub: "O formato define o esqueleto narrativo que o Prompt 1 vai gerar.",
    options: [
      { id: "opiniao", label: "Artigo de opinião", emoji: "🗞️", hint: "Ponto de vista forte e defesa de tese" },
      { id: "guia", label: "Guia prático", emoji: "🧩", hint: "Passo a passo aplicável" },
      { id: "estudo", label: "Estudo de caso", emoji: "📊", hint: "Contexto, desafio, solução e resultado" },
      { id: "narrativa", label: "Narrativa / storytelling", emoji: "🎬", hint: "Cenas, personagem e virada" },
    ],
  },
  {
    kind: "decision",
    id: "tom",
    etapa: 3,
    etapaLabel: "Voz, promessa & âncoras",
    question: "Qual tom deve dominar a voz do texto?",
    sub: "O tom atravessa os três prompts para manter a voz consistente.",
    options: [
      { id: "provocativo", label: "Provocativo", emoji: "🔥", hint: "Frases curtas, opiniões que dividem" },
      { id: "conversacional", label: "Conversacional", emoji: "☕", hint: "Como um café com o leitor" },
      { id: "tecnico", label: "Técnico preciso", emoji: "🔬", hint: "Dados, termos e rigor" },
      { id: "inspirador", label: "Inspirador", emoji: "🌅", hint: "Imagens e ritmo crescente" },
    ],
  },
  {
    kind: "text",
    id: "promessa",
    etapa: 3,
    etapaLabel: "Voz, promessa & âncoras",
    question: "Complete a promessa do texto: “Ao terminar de ler, o leitor vai ser capaz de…”",
    sub: "Uma promessa específica é o Must-Have nº 2 do checklist.",
    placeholder: "Ex.: montar uma proposta de valor que justifica preço maior",
    fallback: "aplicar o método apresentado no conteúdo",
  },
  {
    kind: "decision",
    id: "canal",
    etapa: 3,
    etapaLabel: "Voz, promessa & âncoras",
    question: "Onde esse conteúdo será publicado?",
    sub: "O canal define tamanho, formato de abertura e CTA.",
    options: [
      { id: "blog", label: "Blog (SEO)", emoji: "🌐", hint: "1.200–1.800 palavras, H2/H3, meta description" },
      { id: "linkedin", label: "LinkedIn", emoji: "💼", hint: "Hook forte nas 2 primeiras linhas" },
      { id: "newsletter", label: "Newsletter", emoji: "✉️", hint: "Assunto + abertura pessoal" },
      { id: "instagram", label: "Instagram", emoji: "📱", hint: "Carrossel ou legenda curta" },
    ],
  },
  {
    kind: "decision",
    id: "ancoras",
    etapa: 3,
    etapaLabel: "Voz, promessa & âncoras",
    question: "Você já tem âncoras concretas? (dados, casos reais, experiência própria)",
    sub: "Âncoras são o antídoto contra texto genérico — o Must-Have nº 3.",
    options: [
      { id: "fortes", label: "Tenho âncoras fortes", emoji: "🧲", hint: "Números, casos e exemplos reais" },
      { id: "parciais", label: "Tenho algumas", emoji: "🧩", hint: "Faltam evidências em partes" },
      { id: "nenhuma", label: "Ainda não tenho", emoji: "🌱", hint: "Os prompts marcam o que pesquisar" },
    ],
  },
];

export const STEP_SHORT: Record<Step["id"], string> = {
  tema: "Tema",
  missao: "Missão",
  formato: "Formato",
  tom: "Tom",
  promessa: "Promessa",
  canal: "Canal",
  ancoras: "Âncoras",
};

export function stepIndexById(id: Step["id"]): number {
  return STEPS.findIndex((s) => s.id === id);
}

export function answerLabel(step: Step, answers: Answers): string {
  if (step.kind === "decision") {
    const v = answers[step.id];
    const opt = step.options.find((o) => o.id === v);
    return opt ? `${opt.emoji} ${opt.label}` : "—";
  }
  const v = answers[step.id];
  return v && v.trim() ? `“${v.trim()}”` : `“${step.fallback}”`;
}

export function isComplete(a: Answers): boolean {
  return Boolean(
    a.tema.trim() && a.promessa.trim() && a.missao && a.formato && a.tom && a.canal && a.ancoras
  );
}
