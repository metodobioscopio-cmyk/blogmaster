import type { Benchmark, ChannelId, GeoTier, VerticalId } from './types';

/**
 * Base de benchmarks 2026.
 *
 * Cada linha carrega a fonte e o ano. Quando a fonte publica faixa, usamos o
 * ponto médio e registramos a faixa em `note`. Linhas com `derived: true` são
 * derivações nossas para planejamento (multiplicador geográfico) e NÃO devem
 * ser citadas como dado publicado.
 */
export interface BenchmarkRow extends Benchmark {
  note?: string;
  derived?: boolean;
}

export const CHANNEL_LABEL: Record<ChannelId, string> = {
  google_search: 'Google Ads — Search',
  google_shopping: 'Google Ads — Shopping',
  meta: 'Meta Ads (Facebook/Instagram)',
  tiktok: 'TikTok Ads — In-Feed',
  tiktok_shop: 'TikTok Shop Ads',
  microsoft: 'Microsoft Ads',
  seo: 'SEO / conteúdo',
  email: 'E-mail / lista própria',
};

export const VERTICAL_LABEL: Record<VerticalId, string> = {
  ecommerce: 'E-commerce',
  beauty: 'Beleza & skincare',
  health: 'Saúde & suplementos',
  finance: 'Finanças',
  saas: 'SaaS / B2B',
  local: 'Serviços locais',
  info_product: 'Infoproduto',
  gaming: 'Games',
  home: 'Casa & jardim',
  electronics: 'Eletrônicos',
};

export const GEO_LABEL: Record<GeoTier, string> = {
  T1: 'T1 — US, UK, CA, AU, DE',
  T2: 'T2 — BR, MX, ES, IT, PL, TR',
  T3: 'T3 — IN, ID, PH, NG, PK',
};

const SRC = {
  silverback: {
    source: 'Silverback Marketing — 2026 Paid Media Benchmark Report',
    sourceUrl: 'https://silverbackmarketing.com/resources/2026-paid-media-benchmark-report',
    year: '2026',
  },
  whatagraph: {
    source: 'Whatagraph — 100+ PPC Benchmarks 2026',
    sourceUrl: 'https://whatagraph.com/blog/articles/ppc-benchmarks',
    year: '2026',
  },
  redclawey: {
    source: 'RedClawey — Meta Ads Benchmarks 2026 (US$50M+ em spend gerenciado)',
    sourceUrl: 'https://redclawey.com/en/blog/meta-ads-benchmarks-2026-industry-data/',
    year: '2026',
  },
  adlibrary: {
    source: 'AdLibrary — Meta Ad Benchmarks Ecommerce 2026',
    sourceUrl: 'https://adlibrary.com/posts/meta-ad-benchmarks-ecommerce-2026',
    year: '2026',
  },
  triplewhale: {
    source: 'Triple Whale — TikTok Ads Benchmarks (5.900+ marcas, ago/2025–jul/2026)',
    sourceUrl: 'https://www.triplewhale.com/blog/tiktok-benchmarks',
    year: '2026',
  },
};

/** Linhas T1 (mercados de custo alto), medidas publicadas. */
const T1: BenchmarkRow[] = [
  // ---------- Google Ads ----------
  {
    channel: 'google_search',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 3.52,
    cpc: 3.59,
    cpa: 53.52,
    cvr: 4.4,
    note: 'Faixa publicada: CPC US$2,96–4,22; CVR 4,40% → CPA US$53,52 (média cross-industry).',
    ...SRC.silverback,
  },
  {
    channel: 'google_search',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 6.64,
    cpc: 5.42,
    cpa: 66.69,
    cvr: 8.18,
    note: 'CPC ponderado por indústria. Média histórica: US$2,32 (2016) → US$5,42 (2026).',
    ...SRC.whatagraph,
  },
  {
    channel: 'google_search',
    vertical: 'local',
    geo: 'T1',
    ctr: 6.64,
    cpc: 4.35,
    cpa: 29.96,
    cvr: 15.51,
    note: 'Setor: reparo automotivo — contraexemplo de CPC alto com conversão muito acima da média.',
    ...SRC.whatagraph,
  },
  {
    channel: 'google_shopping',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 0.86,
    cpc: 0.86,
    cpa: 38.87,
    cvr: 1.91,
    ...SRC.silverback,
  },
  {
    channel: 'google_shopping',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 2.75,
    cpc: 0.86,
    cpa: 38.87,
    cvr: 1.91,
    note: 'Link CTR e-commerce: faixa publicada 1,5–4,0% (intenção de compra alta).',
    ...SRC.adlibrary,
  },

  // ---------- Meta Ads ----------
  {
    channel: 'meta',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 2.19,
    cpc: 1.31,
    cpa: 38.17,
    cvr: 1.57,
    note: 'Faixa publicada: CPC US$0,70–1,92 (cross-industry).',
    ...SRC.silverback,
  },
  {
    channel: 'meta',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 1.72,
    cpc: 1.18,
    cpa: 38.5,
    cvr: 1.57,
    note: 'Mediana Q1/2026. Top 25%: CTR 2,80%+ / CPC US$0,65 / CPA US$15. Bottom 25%: 0,90% / US$2,10 / US$85.',
    ...SRC.redclawey,
  },
  {
    channel: 'meta',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 2.2,
    cpc: 0.55,
    cpa: 28.0,
    cvr: 3.1,
    roas: 3.8,
    cpm: 12.0,
    note: 'Único vertical com custo caindo YoY (CPC −3%, CPA −3%) por causa do Advantage+ Shopping.',
    ...SRC.redclawey,
  },
  {
    channel: 'meta',
    vertical: 'saas',
    geo: 'T1',
    ctr: 1.2,
    cpc: 2.35,
    cpa: 85.0,
    cvr: 1.2,
    note: 'CPA de trial. Top 25% US$45 / bottom 25% US$180.',
    ...SRC.redclawey,
  },
  {
    channel: 'meta',
    vertical: 'finance',
    geo: 'T1',
    ctr: 1.4,
    cpc: 2.1,
    cpa: 65.0,
    note: 'CPA de aplicação/cadastro. Top 25% US$35 / bottom 25% US$140.',
    ...SRC.redclawey,
  },
  {
    channel: 'meta',
    vertical: 'gaming',
    geo: 'T1',
    ctr: 1.8,
    cpc: 1.0,
    cpa: 45.0,
    note: 'iGaming — CPA de primeiro depósito. Top 25% US$25 / bottom 25% US$90.',
    ...SRC.redclawey,
  },
  {
    channel: 'meta',
    vertical: 'local',
    geo: 'T1',
    ctr: 2.4,
    cpc: 0.35,
    cpa: 12.0,
    cvr: 4.2,
    cpm: 8.5,
    note: 'Melhor eficiência de qualquer vertical: menor CPM, CPC e CPA; maior CTR e CVR.',
    ...SRC.redclawey,
  },
  {
    channel: 'meta',
    vertical: 'beauty',
    geo: 'T1',
    ctr: 2.05,
    cpc: 0.9,
    cpa: 40.0,
    note: 'Faixas publicadas: link CTR 1,6–2,5%; CPC €0,55–1,10; CPA €18–55.',
    ...SRC.adlibrary,
  },
  {
    channel: 'meta',
    vertical: 'electronics',
    geo: 'T1',
    ctr: 1.25,
    cpc: 1.1,
    cpa: 62.0,
    note: 'Faixas publicadas: link CTR 0,9–1,6%; CPC €0,65–1,40; CPA €25–90. Compra de alta consideração.',
    ...SRC.adlibrary,
  },
  {
    channel: 'meta',
    vertical: 'health',
    geo: 'T1',
    ctr: 1.8,
    cpc: 1.25,
    cpa: 48.0,
    note: 'Faixas publicadas (suplementos): link CTR 1,4–2,2%; CPC €0,75–1,60; CPA €22–68.',
    ...SRC.adlibrary,
  },
  {
    channel: 'meta',
    vertical: 'home',
    geo: 'T1',
    ctr: 1.45,
    cpc: 0.95,
    cpa: 50.0,
    note: 'Faixas publicadas: link CTR 1,0–1,9%; CPC €0,55–1,20; CPA €20–75.',
    ...SRC.adlibrary,
  },

  // ---------- TikTok ----------
  {
    channel: 'tiktok',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 0.61,
    cpc: 1.02,
    cpa: 42.6,
    cvr: 1.92,
    cpm: 9.16,
    note: 'In-Feed padrão. Spark Ads entregam 2,4× o CTR e +44% de CVR sobre este baseline.',
    ...SRC.silverback,
  },
  {
    channel: 'tiktok',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 1.77,
    cpc: 7.49,
    cpa: 32.74,
    cvr: 2.01,
    cpm: 13.26,
    roas: 2.21,
    note: 'E-commerce full-year 2025. CPA +8,64% YoY, CTR +13,74% YoY. CPC derivado de CPM/CTR.',
    ...SRC.triplewhale,
  },
  {
    channel: 'tiktok',
    vertical: 'beauty',
    geo: 'T1',
    ctr: 0.58,
    cpc: 0.91,
    cpa: 18.82,
    cvr: 2.19,
    cpm: 5.28,
    roas: 0.74,
    ...SRC.triplewhale,
  },
  {
    channel: 'tiktok',
    vertical: 'home',
    geo: 'T1',
    ctr: 0.68,
    cpc: 0.84,
    cpa: 21.36,
    cvr: 2.42,
    cpm: 5.69,
    roas: 1.97,
    ...SRC.triplewhale,
  },
  {
    channel: 'tiktok',
    vertical: 'electronics',
    geo: 'T1',
    ctr: 0.73,
    cpc: 0.71,
    cpa: 31.25,
    cvr: 1.85,
    cpm: 5.17,
    roas: 1.68,
    ...SRC.triplewhale,
  },
  {
    channel: 'tiktok',
    vertical: 'health',
    geo: 'T1',
    ctr: 0.57,
    cpc: 0.94,
    cpa: 16.87,
    cvr: 1.68,
    cpm: 5.34,
    roas: 0.72,
    note: 'Menor CPA do conjunto — mas ROAS 0,72. CPA baixo não garante canal lucrativo.',
    ...SRC.triplewhale,
  },
  {
    channel: 'tiktok_shop',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 1.24,
    cpc: 0.68,
    cpa: 7.14,
    cvr: 3.7,
    note: 'Formato de maior CVR publicado (3,70%) e menor CPA.',
    ...SRC.silverback,
  },

  // ---------- Microsoft ----------
  {
    channel: 'microsoft',
    vertical: 'ecommerce',
    geo: 'T1',
    ctr: 3.1,
    cpc: 1.54,
    cpa: 41.44,
    roas: 2.53,
    note: 'CPC 33% abaixo do Google Search; CPA ~30% abaixo. Audiência mais velha e de renda maior.',
    ...SRC.silverback,
  },
  {
    channel: 'microsoft',
    vertical: 'finance',
    geo: 'T1',
    ctr: 3.1,
    cpc: 1.54,
    cpa: 41.44,
    roas: 2.53,
    note: 'Canal desproporcionalmente valioso para finanças, B2B, saúde e jurídico.',
    ...SRC.silverback,
  },
];

/**
 * Multiplicadores geográficos para planejamento.
 * DERIVAÇÃO PRÓPRIA — não é número publicado. Ajuste com os dados reais da conta.
 */
export const GEO_MULTIPLIER: Record<
  GeoTier,
  { cpc: number; cpm: number; ctr: number; cvr: number }
> = {
  T1: { cpc: 1, cpm: 1, ctr: 1, cvr: 1 },
  T2: { cpc: 0.42, cpm: 0.38, ctr: 1.15, cvr: 0.78 },
  T3: { cpc: 0.22, cpm: 0.2, ctr: 1.35, cvr: 0.55 },
};

export const BENCHMARKS: BenchmarkRow[] = T1;

/** Retargeting Meta vs prospecting (RedClawey, Q1/2026). */
export const RETARGETING_LIFT = {
  ctr: 3.4,
  cpc: 0.75,
  cpa: 18.0,
  roas: 7.2,
  deltas: { ctr: '+95%', cpc: '−40%', cpa: '−55%', roas: '+100%' },
  source: SRC.redclawey.source,
  sourceUrl: SRC.redclawey.sourceUrl,
};

/** Regras oficiais de orçamento mínimo por canal. */
export const MIN_BUDGET: Record<
  ChannelId,
  { technical: number; practical: number; rule: string; source: string; sourceUrl: string }
> = {
  google_search: {
    technical: 1,
    practical: 50,
    rule:
      'Google não impõe mínimo oficial. O mínimo real é o orçamento que entrega 10–20 cliques/dia — com CPC de US$5, isso são US$50/dia.',
    source: 'NewFrame Digital — Google Ads Cost in 2026',
    sourceUrl: 'https://newframedigital.com/google-ads-budget-how-much-to-spend/',
  },
  google_shopping: {
    technical: 1,
    practical: 30,
    rule: 'Shopping tem CPC médio de US$0,86; 30 cliques/dia custam ~US$26.',
    source: 'Silverback Marketing — 2026 Paid Media Benchmark Report',
    sourceUrl: 'https://silverbackmarketing.com/resources/2026-paid-media-benchmark-report',
  },
  meta: {
    technical: 10,
    practical: 100,
    rule:
      'Mínimo técnico US$1/dia (awareness) a US$10–20/dia (conversão). Mínimo prático: targetCPA × 50 eventos ÷ 7 dias — a learning phase exige 50 eventos de otimização por semana por conjunto.',
    source: 'Peretz Agency / Optifox — Meta Ads Best Practices 2026',
    sourceUrl: 'https://peretz.agency/blog/media-strategy-generates-leads-2026',
  },
  tiktok: {
    technical: 20,
    practical: 50,
    rule: 'Regra oficial do TikTok: orçamento de campanha deve exceder US$50 e o diário do ad group deve exceder US$20/dia.',
    source: 'Admanage — TikTok Ads Cost 2026 (docs oficiais TikTok)',
    sourceUrl: 'https://admanage.ai/blog/tiktok-ads-cost',
  },
  tiktok_shop: {
    technical: 20,
    practical: 50,
    rule: 'Mesma régua do TikTok Ads: >US$50 por campanha e >US$20/dia por ad group.',
    source: 'Admanage — TikTok Ads Cost 2026 (docs oficiais TikTok)',
    sourceUrl: 'https://admanage.ai/blog/tiktok-ads-cost',
  },
  microsoft: {
    technical: 1,
    practical: 30,
    rule: 'Sem mínimo oficial; CPC ~US$1,54 → US$30/dia compra ~20 cliques.',
    source: 'Silverback Marketing — 2026 Paid Media Benchmark Report',
    sourceUrl: 'https://silverbackmarketing.com/resources/2026-paid-media-benchmark-report',
  },
  seo: {
    technical: 0,
    practical: 0,
    rule: 'Canal orgânico: o custo é tempo e produção de conteúdo, não leilão. Meça EPC e receita por 1.000 sessões.',
    source: 'Regra interna do VALIDA OS',
    sourceUrl: '',
  },
  email: {
    technical: 0,
    practical: 0,
    rule: 'Lista própria: custo marginal ≈ 0. A métrica de corte é receita por e-mail enviado (RPM).',
    source: 'Regra interna do VALIDA OS',
    sourceUrl: '',
  },
};

/** Seleciona a linha mais específica disponível para a combinação pedida. */
export function findBenchmark(
  channel: ChannelId,
  vertical: VerticalId,
  geo: GeoTier,
): { row: BenchmarkRow | null; geoAdjusted: BenchmarkRow | null } {
  const candidates = BENCHMARKS.filter((b) => b.channel === channel);
  const row =
    candidates.find((b) => b.vertical === vertical && b.geo === 'T1') ??
    candidates.find((b) => b.geo === 'T1') ??
    null;
  if (!row) return { row: null, geoAdjusted: null };
  const m = GEO_MULTIPLIER[geo];
  return {
    row,
    geoAdjusted: {
      ...row,
      geo,
      cpc: round(row.cpc * m.cpc, 3),
      cpa: row.cpa ? round(row.cpa * m.cpc, 2) : row.cpa,
      ctr: round(row.ctr * m.ctr, 2),
      cvr: row.cvr ? round(row.cvr * m.cvr, 2) : row.cvr,
      cpm: row.cpm ? round(row.cpm * m.cpm, 2) : row.cpm,
      derived: geo !== 'T1',
      note:
        geo === 'T1'
          ? row.note
          : `${row.note ?? ''} [Ajustado para ${geo} com multiplicador próprio cpc×${m.cpc}, ctr×${m.ctr}, cvr×${m.cvr}]`.trim(),
    },
  };
}

function round(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}
