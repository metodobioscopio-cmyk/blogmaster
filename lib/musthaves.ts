import type { MustHave } from "./types";

export const MUST_HAVES: MustHave[] = [
  {
    id: 1,
    emoji: "🎯",
    titulo: "Hook magnético",
    resumo:
      "As 3 primeiras linhas decidem 80% da leitura. Abra com tensão, cena ou tese contra-intuitiva — nunca com “hoje vamos falar de…”.",
    checks: [
      "A abertura cria uma pergunta ou tensão imediata?",
      "Dá para cortar a primeira frase sem perder nada? Então corte.",
      "O hook promete a experiência real do texto (zero clickbait vazio)?",
    ],
  },
  {
    id: 2,
    emoji: "🤝",
    titulo: "Uma promessa, um leitor",
    resumo:
      "Transformação clara para um leitor definido. Quem não é o alvo precisa sentir que o texto não foi feito para ele.",
    checks: [
      "A promessa aparece explícita ainda no primeiro terço?",
      "Dá para dizer em voz alta para QUEM é o texto?",
      "Trocar o público-alvo exigiria reescrever o texto? (bom sinal)",
    ],
  },
  {
    id: 3,
    emoji: "🧲",
    titulo: "Âncoras concretas",
    resumo:
      "Dados, casos reais, nomes e cenas tornam o texto inconfundível. Parágrafo 100% genérico é parágrafo transplantável.",
    checks: [
      "Cada argumento importante tem dado, caso ou experiência?",
      "Teste do transplante: algum parágrafo funcionaria em qualquer blog?",
      "Toda fonte citada é real e verificável?",
    ],
  },
  {
    id: 4,
    emoji: "🎢",
    titulo: "Arco emocional",
    resumo:
      "Storytelling não é enfeite, é estrutura: problema → escalada → virada → resolução mantém o leitor em movimento.",
    checks: [
      "Existe um problema que o leitor reconhece como próprio?",
      "Há escalada (algo piora ou complica) antes da solução?",
      "A virada é sentida, não apenas anunciada?",
    ],
  },
  {
    id: 5,
    emoji: "🚪",
    titulo: "CTA único",
    resumo:
      "Uma ação, um momento. Vários CTAs competem entre si e zeram a conversão — escolha a única ação que importa.",
    checks: [
      "Existe exatamente UM pedido final?",
      "O CTA é específico (“baixe o guia X”) e não vago (“saiba mais”)?",
      "O CTA decorre naturalmente da promessa do início?",
    ],
  },
];
