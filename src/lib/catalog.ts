/**
 * Stack open-source e modelos públicos, verificados via API do GitHub e do
 * Hugging Face em 01/10/2026. Estrelas e datas mudam — os números aqui são o
 * snapshot daquela consulta.
 */

export interface OssTool {
  repo: string;
  url: string;
  stars: number;
  license: string;
  lastPush: string;
  step: string;
  letter: string;
  what: string;
  howToUse: string;
  caution: string;
}

export const OSS_TOOLS: OssTool[] = [
  {
    repo: 'dubinc/dub',
    url: 'https://github.com/dubinc/dub',
    stars: 24851,
    license: 'NOASSERTION (fonte aberta, licença não-OSI)',
    lastPush: '2026-10-01',
    step: 'Passo 9 — Configure rastreamento completo',
    letter: 'I',
    what: 'Plataforma de atribuição por link: short links, UTM, cliques, conversões e partner attribution.',
    howToUse:
      'Substitui o encurtador burro: cada link de afiliado vira um link Dub com sub-ID, e o clique chega ao seu banco com geolocalização e device. É a camada que falta entre o anúncio e o tracker de CPA.',
    caution: 'Licença não é OSI-standard: leia antes de vender como serviço.',
  },
  {
    repo: 'PostHog/posthog',
    url: 'https://github.com/PostHog/posthog',
    stars: 40060,
    license: 'NOASSERTION (MIT + parte enterprise)',
    lastPush: '2026-10-01',
    step: 'Passo 9 — Configure rastreamento completo',
    letter: 'I',
    what: 'Product analytics, funis, session replay e experimentação em um só lugar, self-hosted.',
    howToUse:
      'Monte o funil captura → e-mail → oferta e veja onde a pessoa cai. Session replay mostra por que a landing não converte — dado que o painel da rede nunca te dá.',
    caution: 'Self-host exige Postgres + ClickHouse. Para 1 campanha, o cloud free tier resolve.',
  },
  {
    repo: 'umami-software/umami',
    url: 'https://github.com/umami-software/umami',
    stars: 39107,
    license: 'MIT',
    lastPush: '2026-09-29',
    step: 'Passo 9 — Configure rastreamento completo',
    letter: 'I',
    what: 'Analytics privacy-first sem cookie, leve, com UTM e metas de conversão.',
    howToUse:
      'Camada de medição da landing sem depender de cookie de terceiro. Bom para geos onde o consentimento trava o pixel.',
    caution: 'Sem cookie não há retargeting — use junto com o pixel onde o consentimento permitir.',
  },
  {
    repo: 'plausible/analytics',
    url: 'https://github.com/plausible/analytics',
    stars: 29275,
    license: 'AGPL-3.0',
    lastPush: '2026-10-01',
    step: 'Passo 9 — Configure rastreamento completo',
    letter: 'I',
    what: 'Analytics leve, cookie-free, com metas de conversão e filtro por UTM.',
    howToUse: 'Alternativa ao Umami quando você quer o SaaS deles ou hospedar com suporte.',
    caution: 'AGPL: se você modificar e servir como serviço, o código modificado precisa ser aberto.',
  },
  {
    repo: 'matomo-org/matomo',
    url: 'https://github.com/matomo-org/matomo',
    stars: 21917,
    license: 'GPL-3.0',
    lastPush: '2026-10-01',
    step: 'Passo 6 — Verifique compliance e logística',
    letter: 'A',
    what: 'Analytics completo com modo de anonimização e configuração de consentimento por jurisdição.',
    howToUse:
      'Quando o alvo é Europa, o Matomo tem suporte nativo a anonimização de IP e exclusão — reduz o atrito do GDPR em relação a um pixel de terceiro.',
    caution: 'Consentimento ainda é obrigatório para identificador persistente; anonimizar não dispensa CMP.',
  },
  {
    repo: 'growthbook/growthbook',
    url: 'https://github.com/growthbook/growthbook',
    stars: 8462,
    license: 'NOASSERTION (MIT + parte enterprise)',
    lastPush: '2026-10-01',
    step: 'Passo 10 — Crie 3 variações de criativo por ângulo',
    letter: 'D',
    what: 'Feature flags e experimentação com análise bayesiana e frequentista embutida.',
    howToUse:
      'Rode as 3 variações de criativo como experimento de verdade, com tamanho de amostra e significância calculados — em vez de olhar o CTR a olho.',
    caution: 'Exige disciplina: um fator por teste, senão a significância não vale nada.',
  },
  {
    repo: 'knadh/listmonk',
    url: 'https://github.com/knadh/listmonk',
    stars: 23643,
    license: 'AGPL-3.0',
    lastPush: '2026-09-30',
    step: 'Passo 8 — Monte o funil mínimo',
    letter: 'L',
    what: 'Gerenciador de listas e campanhas de e-mail self-hosted, de alta performance.',
    howToUse:
      'A sequência isca → e-mail → oferta do Passo 8 roda aqui. Custo marginal zero, e a lista é sua — não da rede.',
    caution: 'Se promover Amazon, o link não pode ir no e-mail. Mande para a sua página.',
  },
  {
    repo: 'mautic/mautic',
    url: 'https://github.com/mautic/mautic',
    stars: 10643,
    license: 'NOASSERTION (GPL-3.0)',
    lastPush: '2026-10-01',
    step: 'Passo 17 — Automatize o que for repetível',
    letter: 'A',
    what: 'Automação de marketing: fluxos, segmentação, scoring e relatórios.',
    howToUse: 'Quando a campanha validou, o follow-up vira fluxo automático em vez de tarefa manual.',
    caution: 'Automatize só depois do veredito SCALE — automatizar campanha ruim escala o prejuízo.',
  },
  {
    repo: 'n8n-io/n8n',
    url: 'https://github.com/n8n-io/n8n',
    stars: 206430,
    license: 'NOASSERTION (fair-code)',
    lastPush: '2026-10-01',
    step: 'Passo 17 — Automatize o que for repetível',
    letter: 'A',
    what: 'Automação de workflows com nós para planilhas, e-mail, HTTP e bancos.',
    howToUse:
      'Ligue postback → planilha → alerta no Telegram. O relatório diário de CPA/EPC chega sozinho, sem você abrir três painéis.',
    caution: 'Fair-code: uso interno liberado, revenda como SaaS não.',
  },
  {
    repo: 'kestra-io/kestra',
    url: 'https://github.com/kestra-io/kestra',
    stars: 28594,
    license: 'Apache-2.0',
    lastPush: '2026-10-01',
    step: 'Passo 16 — Documente o que funcionou',
    letter: 'A',
    what: 'Orquestração e agendamento de pipelines orientados a evento.',
    howToUse:
      'Agende a consolidação diária dos dados de campanha num armazém. Documentação deixa de ser esforço e vira subproduto.',
    caution: 'Overkill para 1–2 campanhas; faz sentido a partir de dezenas.',
  },
  {
    repo: 'formbricks/formbricks',
    url: 'https://github.com/formbricks/formbricks',
    stars: 13047,
    license: 'NOASSERTION (AGPL + enterprise)',
    lastPush: '2026-10-01',
    step: 'Passo 8 — Monte o funil mínimo',
    letter: 'L',
    what: 'Pesquisas e formulários in-app, alternativa open-source ao Qualtrics.',
    howToUse:
      'Descubra a dor nomeada do público antes de escrever o ângulo. Pesquisa na landing responde "por que não converteu" com a voz do lead.',
    caution: 'Pergunta de pesquisa também é tratamento de dado — vale a mesma base legal.',
  },
  {
    repo: 'Cybrarist/InstantLand',
    url: 'https://github.com/Cybrarist/InstantLand',
    stars: 54,
    license: 'GPL-3.0',
    lastPush: '2025-02-08',
    step: 'Passo 8 — Monte o funil mínimo',
    letter: 'L',
    what: 'Landing page builder open-source com A/B testing e formulários próprios.',
    howToUse: 'Sai do "tráfego direto para a página da rede" — a armadilha explícita do Passo 8.',
    caution: 'Projeto pequeno e sem push recente: trate como ponto de partida, não como dependência.',
  },
  {
    repo: 'unfolding-io/StarFunnel',
    url: 'https://github.com/unfolding-io/StarFunnel',
    stars: 171,
    license: 'NOASSERTION',
    lastPush: '2024-07-08',
    step: 'Passo 8 — Monte o funil mínimo',
    letter: 'L',
    what: 'Landing page builder em Astro — páginas estáticas rápidas.',
    howToUse: 'Velocidade de landing pesa no CPC do Google e na reprovação do Meta.',
    caution: 'Sem manutenção recente; audite as dependências antes de usar em produção.',
  },
  {
    repo: 'pat310/google-trends-api',
    url: 'https://github.com/pat310/google-trends-api',
    stars: 974,
    license: 'MIT',
    lastPush: '2022-11-25',
    step: 'Passo 4 — Filtre por demanda real',
    letter: 'V',
    what: 'Camada de API sobre o Google Trends.',
    howToUse:
      'Automatiza a checagem de tendência do Passo 4: curva de 12 meses por país separa demanda consistente de pico passageiro.',
    caution: 'API não oficial: quebra quando o Google muda o endpoint. Sem push desde 2022 — valide antes de depender.',
  },
  {
    repo: 'DP6/Marketing-Attribution-Models',
    url: 'https://github.com/DP6/Marketing-Attribution-Models',
    stars: 370,
    license: 'Apache-2.0',
    lastPush: '2026-09-21',
    step: 'Passo 9 — Configure rastreamento completo',
    letter: 'I',
    what: 'Implementação em Python de modelos de atribuição (last click, linear, time decay, Markov).',
    howToUse:
      'Quando houver mais de um ponto de contato, o last click mente. Markov mostra qual canal realmente remove conversão.',
    caution: 'Atribuição multi-toque só paga depois de volume; em teste de 72h, last click é suficiente.',
  },
  {
    repo: 'snowplow/dbt-snowplow-fractribution',
    url: 'https://github.com/snowplow/dbt-snowplow-fractribution',
    stars: 13,
    license: 'Apache-2.0',
    lastPush: '2023-11-27',
    step: 'Passo 9 — Configure rastreamento completo',
    letter: 'I',
    what: 'Modelo dbt de atribuição fracionária sobre dados Snowplow.',
    howToUse: 'Referência de como modelar atribuição fracionária num warehouse, sem depender do painel da rede.',
    caution: 'Exige Snowplow + dbt. É referência de modelagem, não plug-and-play.',
  },
  {
    repo: 'maxlabelle/upleads',
    url: 'https://github.com/maxlabelle/upleads',
    stars: 7,
    license: 'MIT',
    lastPush: '2022-10-02',
    step: 'Passo 9 — Configure rastreamento completo',
    letter: 'I',
    what: 'Tracker de afiliados open-source (cliques, ofertas, afiliados).',
    howToUse: 'Modelo de esquema de dados para um tracker próprio se você não quiser pagar Voluum/RedTrack.',
    caution: 'Projeto pequeno, sem manutenção. Leia o código como referência de schema.',
  },
  {
    repo: 'tekrajchhetri/GDPR_compliance_tool',
    url: 'https://github.com/tekrajchhetri/GDPR_compliance_tool',
    stars: 9,
    license: 'MIT',
    lastPush: '2023-05-08',
    step: 'Passo 6 — Verifique compliance e logística',
    letter: 'A',
    what: 'Ferramenta de gestão de consentimento e auditoria de conformidade GDPR.',
    howToUse: 'Referência para estruturar o registro de consentimento que o módulo de compliance pede.',
    caution: 'Não substitui parecer jurídico; use como checklist técnico.',
  },
  {
    repo: 'docusealco/docuseal',
    url: 'https://github.com/docusealco/docuseal',
    stars: 18637,
    license: 'AGPL-3.0',
    lastPush: '2026-09-28',
    step: 'Passo 18 — Proteja o que você construiu',
    letter: 'A',
    what: 'Assinatura eletrônica de documentos, alternativa open-source ao DocuSign.',
    howToUse:
      'Contrato de afiliado direto, acordo de confidencialidade com revisor local e termos do funil assinados com trilha de auditoria.',
    caution: 'AGPL; para uso interno sem modificação o impacto é baixo.',
  },
  {
    repo: 'documenso/documenso',
    url: 'https://github.com/documenso/documenso',
    stars: 15280,
    license: 'AGPL-3.0',
    lastPush: '2026-10-01',
    step: 'Passo 18 — Proteja o que você construiu',
    letter: 'A',
    what: 'Segunda opção de assinatura eletrônica open-source, com API.',
    howToUse: 'Assinatura programática: o contrato de novo afiliado pode sair do próprio fluxo de onboarding.',
    caution: 'AGPL e API em evolução rápida.',
  },
];

export interface HfAsset {
  id: string;
  url: string;
  kind: 'model' | 'dataset';
  license: string;
  meta: string;
  step: string;
  letter: string;
  what: string;
  howToUse: string;
  caution: string;
}

export const HF_ASSETS: HfAsset[] = [
  {
    id: 'marketeam/Qwen-Marketing',
    url: 'https://huggingface.co/marketeam/Qwen-Marketing',
    kind: 'model',
    license: 'MIT',
    meta: 'Finetune de Qwen/Qwen3-8B · 5.650 downloads · criado em 30/06/2025',
    step: 'Passo 7 — Defina o ângulo central',
    letter: 'L',
    what: 'Modelo de linguagem ajustado para tarefas de marketing, com raciocínio e saída conversacional.',
    howToUse:
      'Rode localmente para gerar hipóteses de ângulo em lote e jogar no teste de 3 criativos do Passo 10. A máquina propõe, a métrica dispõe.',
    caution: 'Copy gerada por IA cai na regra de disclosure da FTC de 2023. E ângulo genérico morre em qualquer canal — edite.',
  },
  {
    id: 'neuralmind/bert-base-portuguese-cased',
    url: 'https://huggingface.co/neuralmind/bert-base-portuguese-cased',
    kind: 'model',
    license: 'MIT',
    meta: 'BERT pt-BR (brWaC) · 192.853 downloads · 239 curtidas',
    step: 'Passo 12 — Adapte idioma e cultura',
    letter: 'L',
    what: 'Encoder em português brasileiro, base para classificar intenção, sentimento e qualidade de copy.',
    howToUse:
      'Classifique as variações de hook em pt-BR antes de gastar clique: o classificador descarta o que soa a tradução literal.',
    caution: 'Encoder não gera texto. Para copy generativa em português, use um modelo decoder específico.',
  },
  {
    id: 'coastalcph/lex_glue',
    url: 'https://huggingface.co/datasets/coastalcph/lex_glue',
    kind: 'dataset',
    license: 'CC-BY-4.0',
    meta: 'Benchmark de NLP jurídico · classificação multi-rótulo e QA',
    step: 'Passo 6 — Verifique compliance e logística',
    letter: 'A',
    what: 'Coleção de tarefas de linguagem jurídica para treinar classificadores de texto legal.',
    howToUse:
      'Base para treinar um classificador que marca cláusulas de risco nos termos da rede — a leitura que hoje é manual.',
    caution: 'Inglês. Para LGPD você precisa de corpus próprio em português.',
  },
  {
    id: 'Angrybird12/ad-display_click-data_taobao.com',
    url: 'https://huggingface.co/datasets/Angrybird12/ad-display_click-data_taobao.com',
    kind: 'dataset',
    license: 'não declarado no card',
    meta: 'Impressões e cliques de anúncio (Taobao) · 233 downloads · criado em 14/06/2026',
    step: 'Passo 15 — Corte com base nas métricas',
    letter: 'D',
    what: 'Dados reais de exibição/clique de anúncio em marketplace.',
    howToUse:
      'Serve para calibrar um modelo de CTR esperado antes de subir a campanha — o prior do seu teste bayesiano.',
    caution: 'Licença não declarada: use para experimento interno, não em produto.',
  },
  {
    id: 'yothinS/gemma4-thai-marketing.gguf',
    url: 'https://huggingface.co/yothinS/gemma4-thai-marketing.gguf',
    kind: 'model',
    license: 'Apache-2.0',
    meta: 'Finetune de performance marketing em tailandês · criado em 24/09/2026',
    step: 'Passo 12 — Adapte idioma e cultura',
    letter: 'L',
    what: 'Prova concreta de que existe finetune de marketing por mercado, não só por idioma.',
    howToUse:
      'Modelo de referência: ao entrar num geo novo, procure (ou treine) um ajuste local em vez de traduzir o copy do T1.',
    caution: 'Mercado tailandês. A lição é o método, não o modelo em si.',
  },
];

export const CATALOG_SNAPSHOT = '2026-10-01';
