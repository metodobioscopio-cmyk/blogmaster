import type { Campaign } from '../lib/types';

type Primitive = string | number | boolean | null | undefined;

/** Partial recursivo: os testes passam só os campos que importam para o caso. */
export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<U>
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

/** Fábrica de campanha para os testes do motor. */
export function makeCampaign(overrides: DeepPartial<Campaign> = {}): Campaign {
  const base: Campaign = {
    id: 'c1',
    name: 'Teste',
    createdAt: new Date('2026-01-01').toISOString(),
    status: 'rascunho',
    offer: {
      id: 'o1',
      name: 'Oferta',
      network: 'clickbank',
      price: 100,
      commissionMode: 'percent',
      commissionValue: 50,
      networkFeePercent: 0,
      networkFeeFixed: 0,
      payoutFee: 0,
      refundRate: 0,
      geoTier: 'T1',
      vertical: 'info_product',
      channel: 'meta',
    },
    traffic: { channel: 'meta', cpc: 1, ctr: 2, cvr: 2, dailyBudget: 100 },
    angle: { statement: '', promise: '', audience: '', proof: '', channelRationale: '' },
    tracking: {
      subIdScheme: '',
      landingUrl: '',
      postbackUrl: '',
      pixelInstalled: false,
      networkPostbackConfigured: false,
      s2sTested: false,
    },
    compliance: { geos: [], checkedRuleIds: [], disclosureText: '' },
    audit: {
      competitors: [],
      saturationNote: '',
      networkTermsRead: false,
      logisticsChecked: false,
      legal: { cnpj: false, w8ben: false, contract: false, taxRegime: '' },
    },
    creatives: [],
    cutMetrics: { minCtr: 1, maxCpa: 40, minEpc: 1, minImpressions: 1000 },
    snapshots: [],
  };

  return {
    ...base,
    ...(overrides as Partial<Campaign>),
    offer: { ...base.offer, ...(overrides.offer ?? {}) },
    traffic: { ...base.traffic, ...(overrides.traffic ?? {}) },
    angle: { ...base.angle, ...(overrides.angle ?? {}) },
    tracking: { ...base.tracking, ...(overrides.tracking ?? {}) },
    compliance: { ...base.compliance, ...(overrides.compliance ?? {}) },
    audit: {
      ...base.audit,
      ...(overrides.audit ?? {}),
      legal: { ...base.audit.legal, ...(overrides.audit?.legal ?? {}) },
    } as Campaign['audit'],
    cutMetrics: { ...base.cutMetrics, ...(overrides.cutMetrics ?? {}) },
    creatives: overrides.creatives ?? base.creatives,
    snapshots: overrides.snapshots ?? base.snapshots,
  };
}
