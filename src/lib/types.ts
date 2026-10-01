/** Tipos de domínio do VALIDA OS. */

export type ChannelId =
  | 'google_search'
  | 'google_shopping'
  | 'meta'
  | 'tiktok'
  | 'tiktok_shop'
  | 'microsoft'
  | 'seo'
  | 'email';

export type VerticalId =
  | 'ecommerce'
  | 'beauty'
  | 'health'
  | 'finance'
  | 'saas'
  | 'local'
  | 'info_product'
  | 'gaming'
  | 'home'
  | 'electronics';

export type GeoTier = 'T1' | 'T2' | 'T3';

export type NetworkId =
  | 'amazon'
  | 'clickbank'
  | 'impact'
  | 'awin'
  | 'shareasale'
  | 'cj'
  | 'digistore24'
  | 'direct'
  | 'other';

export interface Offer {
  id: string;
  name: string;
  network: NetworkId;
  /** Preço de venda no país-alvo, na moeda da conta. */
  price: number;
  /** Comissão anunciada: percentual (0-100) ou valor fixo. */
  commissionMode: 'percent' | 'flat';
  commissionValue: number;
  /** Taxa da rede deduzida antes do split (% sobre o preço). `undefined` usa o padrão da rede; 0 é zero. */
  networkFeePercent?: number;
  /** Taxa fixa da rede por transação. `undefined` usa o padrão da rede; 0 é zero. */
  networkFeeFixed?: number;
  /** Taxa por ciclo de pagamento (wire/processing). */
  payoutFee: number;
  /** Taxa de reembolso/estorno estimada (%). */
  refundRate: number;
  geoTier: GeoTier;
  vertical: VerticalId;
  channel: ChannelId;
  notes?: string;
}

export interface TrafficPlan {
  channel: ChannelId;
  /** CPC estimado na moeda da conta. */
  cpc: number;
  /** CTR esperado (%). */
  ctr: number;
  /** Taxa de conversão esperada da landing (%). */
  cvr: number;
  /** CPM, quando o canal cobra por impressão. */
  cpm?: number;
  /** Orçamento diário. */
  dailyBudget: number;
}

export interface OfferMath {
  grossCommission: number;
  networkFee: number;
  netCommission: number;
  commissionAfterRefunds: number;
  breakEvenCr: number;
  breakEvenCpc: number;
  breakEvenEpc: number;
  expectedCr: number;
  expectedEpc: number;
  expectedCpa: number;
  marginPerClick: number;
  roasBreakEven: number;
  clicksToBreakEvenPerSale: number;
  verdict: 'ok' | 'apertado' | 'inviavel';
}

export interface Benchmark {
  channel: ChannelId;
  vertical: VerticalId;
  geo: GeoTier;
  ctr: number;
  cpc: number;
  cpa: number;
  cvr?: number;
  cpm?: number;
  roas?: number;
  source: string;
  sourceUrl: string;
  year: string;
}

export interface TestSnapshot {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
}

export type Verdict = 'scale' | 'iterate' | 'kill' | 'indefinido';

export interface MetricRead {
  label: string;
  actual: number;
  benchmark: number;
  threshold: number;
  passed: boolean | null;
  unit: string;
  detail: string;
}

export interface Decision {
  verdict: Verdict;
  confidence: number;
  reads: MetricRead[];
  reasons: string[];
  nextAction: string;
  sampleSufficient: boolean;
  projectedDailyProfit: number;
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  status: 'rascunho' | 'validando' | 'testando' | 'escalando' | 'morto';
  offer: Offer;
  traffic: TrafficPlan;
  angle: {
    statement: string;
    promise: string;
    audience: string;
    proof: string;
    channelRationale: string;
  };
  tracking: {
    subIdScheme: string;
    landingUrl: string;
    postbackUrl: string;
    pixelInstalled: boolean;
    networkPostbackConfigured: boolean;
    s2sTested: boolean;
  };
  compliance: {
    geos: string[];
    checkedRuleIds: string[];
    disclosureText: string;
    reviewedAt?: string;
  };
  audit: {
    competitors: Array<{ name: string; angle: string; channel: string; offer: string; gap: string }>;
    saturationNote: string;
    networkTermsRead: boolean;
    logisticsChecked: boolean;
    legal: { cnpj: boolean; w8ben: boolean; contract: boolean; taxRegime: string };
  };
  creatives: Array<{ id: string; name: string; hook: string; format: string; status: 'ideia' | 'pronto' | 'rodando' | 'morto' }>;
  cutMetrics: {
    minCtr: number;
    maxCpa: number;
    minEpc: number;
    minImpressions: number;
  };
  snapshots: Array<{ at: string; label: string } & TestSnapshot>;
  testStartedAt?: string;
  decision?: Decision;
  scale?: { baseBudget: number; guardCpa: number; days: number };
}

export interface TaskState {
  [taskId: string]: boolean;
}

export interface AppState {
  campaigns: Campaign[];
  activeCampaignId: string | null;
  tasks: TaskState;
  plan: 'free' | 'pro' | 'agency';
  workspace: {
    currency: string;
    /** Quantas unidades da moeda da conta equivalem a US$ 1 (BRL ≈ 5,4). */
    usdRate: number;
    ownerEmail: string;
  };
  referralCode: string;
}
