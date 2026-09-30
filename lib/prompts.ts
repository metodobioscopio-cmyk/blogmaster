import type {
  AnchorId,
  Answers,
  ChannelId,
  FormatId,
  MissionId,
  Prompt,
  ToneId,
} from "./types";

export const LABELS: {
  missao: Record<MissionId, string>;
  formato: Record<FormatId, string>;
  tom: Record<ToneId, string>;
  canal: Record<ChannelId, string>;
  ancoras: Record<AnchorId, string>;
} = {
  missao: {
    vender: "Persuadir & vender",
    educar: "Educar & guiar",
    inspirar: "Inspirar & conectar",
    autoridade: "Construir autoridade",
  },
  formato: {
    opiniao: "Artigo de opinião",
    guia: "Guia prático passo a passo",
    estudo: "Estudo de caso",
    narrativa: "Narrativa / storytelling",
  },
  tom: {
    provocativo: "Provocativo e direto",
    conversacional: "Conversacional, como um café",
    tecnico: "Técnico e preciso",
    inspirador: "Inspirador e visual",
  },
  canal: {
    blog: "Blog (SEO)",
    linkedin: "LinkedIn",
    newsletter: "Newsletter",
    instagram: "Instagram",
  },
  ancoras: {
    fortes: "Âncoras fortes (dados, casos e experiências reais à disposição)",
    parciais: "Âncoras parciais (alguns exemplos; faltam evidências)",
    nenhuma: "Sem âncoras ainda (pesquisa pendente)",
  },
};

const MISSAO_BLOCK: Record<MissionId, string> = {
  vender:
    "Arquitetura de persuasão: use PAS — Problema (cena concreta que o leitor reconhece), Agitação (o custo real de não agir), Solução (o método apresentado). Liste as 3 objeções mais prováveis do leitor e o contra-argumento de cada uma.",
  educar:
    "Arquitetura didática: organize em passos progressivos (máximo 7). Cada passo deve indicar: o que fazer, por que funciona e o erro mais comum. Preveja 2 analogias para os conceitos mais difíceis.",
  inspirar:
    "Arquitetura de história: estruture em 3 atos — mundo comum, escalada do conflito, virada e novo mundo. Defina protagonista, desejo, obstáculo central e o exato momento de virada.",
  autoridade:
    "Arquitetura de tese: abra com uma posição contra-intuitiva. Estruture: tese → por que o senso comum erra → evidência → método próprio → implicações práticas.",
};

const FORMATO_BLOCK: Record<FormatId, string> = {
  opiniao:
    "Defenda um lado desde a primeira linha. Traga o melhor argumento contrário e responda a ele com respeito e firmeza. Feche com implicação prática: o que muda para o leitor a partir de hoje.",
  guia:
    "Numere os passos com mini-títulos acionáveis (verbo no imperativo). Cada passo: ação, porquê, exemplo e armadilha. O leitor precisa conseguir executar sem reler.",
  estudo:
    "Estruture como: contexto → desafio → tentativa frustrada → intervenção → resultado com números → lição transferível. Nada de resultado sem medida.",
  narrativa:
    "Construa por cenas: ambiente sensorial, diálogo curto e ação. Mostre o momento decisivo em tempo real e só depois explique o que ele significa.",
};

const TOM_BLOCK: Record<ToneId, string> = {
  provocativo:
    "Frases curtas e incisivas. Assuma uma posição que divide: sem meias-palavras, sem 'talvez'. Provoque com respeito: ataque ideias, nunca pessoas.",
  conversacional:
    "Escreva como quem conversa tomando café: contrações naturais, perguntas diretas ao leitor, confissões pequenas. Zero tom de palestra.",
  tecnico:
    "Precisão acima de estilo: defina cada termo técnico na primeira ocorrência, cite dados e diferencie fato de interpretação.",
  inspirador:
    "Imagens sensoriais e ritmo crescente: frases que aceleram rumo à virada. Termine parágrafos-chave com impulso para o próximo.",
};

const CANAL_BLOCK: Record<ChannelId, string> = {
  blog:
    "Canal Blog (SEO): 1.200–1.800 palavras. Intertítulos H2/H3 com palavras-chave naturais. Inclua: meta description de até 155 caracteres e 1 frase destacável pronta para snippet.",
  linkedin:
    "Canal LinkedIn: as 2 primeiras linhas precisam funcionar antes do 'ver mais'. Parágrafos de 1–2 linhas, 900–1.300 caracteres, ritmo de linha em linha. Sem link no corpo — sugira o link para o primeiro comentário.",
  newsletter:
    "Canal Newsletter: entregue assunto (até 45 caracteres) + preview text. Abertura pessoal e direta, corpo de 800–1.200 palavras e um único link principal.",
  instagram:
    "Canal Instagram: entregue roteiro de carrossel com até 10 telas (tela 1 = hook visual/frase de impacto) OU legenda de até 2.200 caracteres com quebras de linha estratégicas.",
};

const ANCORAS_BLOCK: Record<AnchorId, string> = {
  fortes:
    "Use as âncoras reais que eu fornecer (números, casos, experiências). Regra: pelo menos 1 âncora concreta a cada 3 parágrafos. Cite a origem de cada dado.",
  parciais:
    "Use os exemplos existentes e marque com [ÂNCORA NECESSÁRIA] todo trecho que exigir dado ou caso que ainda não temos. Ao final, liste as lacunas por prioridade.",
  nenhuma:
    "NÃO invente dados, fontes, números ou casos. Escreva a estrutura e marque com [ÂNCORA NECESSÁRIA] todo ponto que pede evidência. Ao final, entregue a lista de pesquisa priorizada.",
};

const BANIDAS =
  "\"no mundo de hoje\", \"em um mundo cada vez mais conectado\", \"saia da zona de conforto\", \"pense fora da caixa\", \"destrave seu potencial\", \"mergulhe fundo\", \"no final do dia\", \"é importante ressaltar que\", \"game changer\", \"jornada transformadora\"";

function contexto(a: Answers): string {
  const tema = a.tema.trim() || "[DEFINA O TEMA NO PROCESSO GUIADO]";
  const promessa = a.promessa.trim() || "[DEFINA A PROMESSA NO PROCESSO GUIADO]";
  return [
    "CONTEXTO DO PROJETO",
    `- Tema central: ${tema}`,
    `- Promessa ao leitor: ${promessa}`,
    `- Missão do conteúdo: ${LABELS.missao[a.missao ?? "educar"]}`,
    `- Formato: ${LABELS.formato[a.formato ?? "opiniao"]}`,
    `- Tom de voz: ${LABELS.tom[a.tom ?? "conversacional"]}`,
    `- Canal principal: ${LABELS.canal[a.canal ?? "blog"]}`,
    `- Âncoras disponíveis: ${LABELS.ancoras[a.ancoras ?? "nenhuma"]}`,
  ].join("\n");
}

export function buildPrompts(a: Answers): Prompt[] {
  const ctx = contexto(a);
  const missao = a.missao ?? "educar";
  const formato = a.formato ?? "opiniao";
  const tom = a.tom ?? "conversacional";
  const canal = a.canal ?? "blog";
  const ancoras = a.ancoras ?? "nenhuma";
  const canalLabel = LABELS.canal[canal];
  const tomLabel = LABELS.tom[tom];

  const p1: Prompt = {
    id: "esqueleto",
    fase: "Etapa 4.1",
    titulo: "Esqueleto narrativo + 5 hooks",
    objetivo: "Estruturar antes de escrever — a decisão mais importante da escrita avançada.",
    texto: `PAPEL
Você é estrategista editorial sênior, especialista em marketing de conteúdo e storytelling. Recuse respostas genéricas: cada seção abaixo precisa de uma decisão concreta.

${ctx}

TAREFA — PROMPT 1/3: ESQUELETO NARRATIVO E HOOKS
1) Posicionamento em 3 frases: por que este conteúdo existe, para quem exatamente, e o que muda para o leitor.
2) 5 opções de hook de abertura. Para cada uma, informe o tipo e escreva 2 frases de exemplo: [tese contra-intuitiva] [cena concreta] [número que surpreende] [pergunta que incomoda] [erro comum do público].
3) Esqueleto completo por seções. Para cada seção: título provisório, função narrativa (abrir tensão / prometer / escalar / virar / provar / aterrissar) e a âncora que ela vai carregar.
4) ${MISSAO_BLOCK[missao]}
5) Um mini-cliffhanger para cada transição entre seções.
6) Fechamento: retomada literal da promessa + CTA único adequado a ${canalLabel}.

REGRAS
- NÃO escreva o texto completo ainda: entregue apenas o esqueleto.
- Aberturas proibidas: ${BANIDAS}.
- Se faltar âncora para sustentar uma seção, marque [ÂNCORA NECESSÁRIA] e diga o que pesquisar.
- Termine fazendo 3 perguntas que afinam o rumo antes do rascunho.`,
  };

  const p2: Prompt = {
    id: "rascunho",
    fase: "Etapa 4.2",
    titulo: "Rascunho guiado",
    objetivo: "Escrever o texto completo a partir do esqueleto, com voz, canal e âncoras travados.",
    texto: `PAPEL
Você é ghostwriter sênior, especialista em marketing e storytelling. Escreva como quem viveu o tema — nunca como um resumo de enciclopédia.

${ctx}

TAREFA — PROMPT 2/3: RASCUNHO GUIADO
Escreva o rascunho completo a partir do esqueleto aprovado no Prompt 1, seção por seção.

DIRETRIZES DE FORMATO — ${LABELS.formato[formato]}
${FORMATO_BLOCK[formato]}

DIRETRIZES DE VOZ — ${tomLabel}
${TOM_BLOCK[tom]}

DIRETRIZES DE CANAL — ${canalLabel}
${CANAL_BLOCK[canal]}

ÂNCORAS E PROVAS
${ANCORAS_BLOCK[ancoras]}

STORYTELLING (obrigatório)
- Toda seção precisa mover o leitor: tensão, progresso ou recompensa.
- Prefira cenas a resumos: mostre o momento, depois explique.
- Alterne frases curtas de impacto com frases de desenvolvimento.

PROIBIDO — corte na hora
${BANIDAS}

TESTE DO TRANSPLANTE
Antes de entregar, releia cada parágrafo: ele funcionaria, sem nenhuma mudança, em qualquer outro blog do mesmo nicho? Se sim, reescreva com um detalhe, caso ou posição que só este conteúdo tem.

ENTREGA
Rascunho completo + lista final das âncoras usadas e das pendências marcadas.`,
  };

  const p3: Prompt = {
    id: "revisao",
    fase: "Etapa 4.3",
    titulo: "Revisão avançada pelos 5 Must-Haves",
    objetivo: "Cortar o genérico, pontuar o texto e preparar a publicação.",
    texto: `PAPEL
Você é editor-chefe implacável de uma publicação de referência. Sua função é cortar, não elogiar.

${ctx}

TAREFA — PROMPT 3/3: REVISÃO AVANÇADA PELOS 5 MUST-HAVES
Revise o rascunho usando exclusivamente estes 5 critérios:

1. HOOK MAGNÉTICO — as 3 primeiras linhas criam tensão ou curiosidade real, sem clickbait vazio?
2. UMA PROMESSA, UM LEITOR — a transformação prometida está explícita, específica e feita para um leitor definido?
3. ÂNCORAS CONCRETAS — cada argumento importante está apoiado em dado, caso ou experiência? Sobrou parágrafo que passaria no teste do transplante?
4. ARCO EMOCIONAL — existe problema, escalada, virada e resolução? O leitor sente progresso o tempo todo?
5. CTA ÚNICO — existe uma única ação final, específica e adequada a ${canalLabel}?

ENTREGUE NESTA ORDEM
A) Nota 0–10 para cada Must-Have, com justificativa de 1 frase.
B) Lista de cortes: clichês, redundâncias, aberturas fracas e parágrafos transplantáveis (cite o trecho).
C) Versão final reescrita, aplicando todos os cortes e fortalecendo o hook.
D) CTA final e — se o canal for blog — meta description de até 155 caracteres.
E) Veredito do teste do transplante por seção: [ESPECÍFICO] ou [GENÉRICO — reescrever].

REGRAS
- Não adicione afirmação nova que exija âncora inexistente; sinalize [ÂNCORA NECESSÁRIA].
- Mantenha o tom ${tomLabel}.
- Qualquer nota abaixo de 7 deve vir acompanhada do que falta, exatamente, para chegar lá.`,
  };

  return [p1, p2, p3];
}
