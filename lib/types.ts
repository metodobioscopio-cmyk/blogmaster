export type TabId = "chat" | "prompts" | "checklist";

export type MissionId = "vender" | "educar" | "inspirar" | "autoridade";
export type FormatId = "opiniao" | "guia" | "estudo" | "narrativa";
export type ToneId = "provocativo" | "conversacional" | "tecnico" | "inspirador";
export type ChannelId = "blog" | "linkedin" | "newsletter" | "instagram";
export type AnchorId = "fortes" | "parciais" | "nenhuma";

export interface Answers {
  tema: string;
  missao: MissionId | null;
  formato: FormatId | null;
  tom: ToneId | null;
  promessa: string;
  canal: ChannelId | null;
  ancoras: AnchorId | null;
}

export interface ChipOption {
  id: string;
  label: string;
  emoji: string;
  hint: string;
}

interface StepBase {
  etapa: number;
  etapaLabel: string;
  question: string;
  sub?: string;
}

export interface DecisionStep extends StepBase {
  kind: "decision";
  id: "missao" | "formato" | "tom" | "canal" | "ancoras";
  options: ChipOption[];
}

export interface TextStep extends StepBase {
  kind: "text";
  id: "tema" | "promessa";
  placeholder: string;
  fallback: string;
}

export type Step = DecisionStep | TextStep;

export interface Prompt {
  id: string;
  fase: string;
  titulo: string;
  objetivo: string;
  texto: string;
}

export interface MustHave {
  id: number;
  emoji: string;
  titulo: string;
  resumo: string;
  checks: string[];
}
