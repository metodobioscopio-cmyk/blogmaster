import type { Offer, OfferMath, TrafficPlan } from './types';
import { NETWORKS } from './networks';

/**
 * Passo 5 — Comissão mínima viável.
 *
 * A regra do roadmap: "comissão de US$ 12 e CPC de US$ 2 exigem conversão de
 * 1 em 6 para empatar". Formalizando: CR_empate = CPC / comissão_líquida.
 *
 * A comissão líquida desconta taxa da rede, taxa fixa por transação e estornos —
 * exatamente a "armadilha: ignorar taxas da rede e impostos internacionais".
 */
export function offerMath(offer: Offer, traffic: TrafficPlan): OfferMath {
  const net = NETWORKS[offer.network];
  // `??` e não `||`: uma taxa negociada de 0% é uma decisão, não um campo vazio.
  const feePercent = offer.networkFeePercent ?? net.feePercent;
  const feeFixed = offer.networkFeeFixed ?? net.feeFixed;

  const grossCommission =
    offer.commissionMode === 'percent' ? (offer.price * offer.commissionValue) / 100 : offer.commissionValue;

  // Em oferta de CPA fixo a taxa da rede é custo do anunciante, não do afiliado.
  const networkFee =
    offer.commissionMode === 'percent'
      ? (offer.price * feePercent) / 100 + feeFixed
      : 0;

  const netCommission =
    offer.commissionMode === 'percent'
      ? ((offer.price - networkFee) * offer.commissionValue) / 100
      : offer.commissionValue;

  const refundRate = clamp(offer.refundRate, 0, 90);
  const commissionAfterRefunds = netCommission * (1 - refundRate / 100);

  const expectedCr = traffic.cvr / 100;
  const cpc = traffic.cpc;

  const breakEvenCr = commissionAfterRefunds > 0 ? cpc / commissionAfterRefunds : Infinity;
  const breakEvenCpc = commissionAfterRefunds * expectedCr;
  const expectedEpc = commissionAfterRefunds * expectedCr;
  const expectedCpa = expectedCr > 0 ? cpc / expectedCr : Infinity;
  const marginPerClick = expectedEpc - cpc;

  const ratio = cpc > 0 ? marginPerClick / cpc : 0;
  const verdict: OfferMath['verdict'] = ratio >= 0.25 ? 'ok' : ratio >= 0 ? 'apertado' : 'inviavel';

  return {
    grossCommission: r2(grossCommission),
    networkFee: r2(networkFee),
    netCommission: r2(netCommission),
    commissionAfterRefunds: r2(commissionAfterRefunds),
    breakEvenCr: Number.isFinite(breakEvenCr) ? round(breakEvenCr * 100, 3) : Infinity,
    breakEvenCpc: r2(breakEvenCpc),
    breakEvenEpc: r2(cpc),
    expectedCr: round(expectedCr * 100, 3),
    expectedEpc: r2(expectedEpc),
    expectedCpa: Number.isFinite(expectedCpa) ? r2(expectedCpa) : Infinity,
    marginPerClick: r2(marginPerClick),
    roasBreakEven: cpc > 0 ? round(expectedEpc / cpc, 2) : Infinity,
    clicksToBreakEvenPerSale: cpc > 0 ? round(commissionAfterRefunds / cpc, 1) : Infinity,
    verdict,
  };
}

/** Quanto sobra por dia com o orçamento informado. */
export function dailyProjection(offer: Offer, traffic: TrafficPlan) {
  const m = offerMath(offer, traffic);
  if (!Number.isFinite(m.expectedCpa) || traffic.cpc <= 0) {
    return { clicks: 0, conversions: 0, revenue: 0, spend: traffic.dailyBudget, profit: 0, math: m };
  }
  const clicks = traffic.dailyBudget / traffic.cpc;
  const conversions = clicks * (traffic.cvr / 100);
  const revenue = conversions * m.commissionAfterRefunds;
  return {
    clicks: Math.round(clicks),
    conversions: round(conversions, 2),
    revenue: r2(revenue),
    spend: r2(traffic.dailyBudget),
    profit: r2(revenue - traffic.dailyBudget),
    math: m,
  };
}

/**
 * Comissão mínima para o clique ser viável dado o CR que você consegue provar.
 * Inverso do break-even: commission_min = CPC / CR.
 */
export function minCommissionFor(cpc: number, cvrPercent: number): number {
  const cr = cvrPercent / 100;
  return cr > 0 ? r2(cpc / cr) : Infinity;
}

/**
 * CPC máximo que a oferta aguenta dado o CR e a margem-alvo.
 * `margin` = fração do EPC que precisa sobrar (0,25 = 25% de margem sobre o clique).
 */
export function maxCpcFor(commissionNet: number, cvrPercent: number, margin = 0.25): number {
  const epc = commissionNet * (cvrPercent / 100);
  return r2(epc * (1 - margin));
}

/** Orçamento de teste que produz a amostra mínima sem ultrapassar o teto aceitável. */
export function testBudgetFor(
  cpc: number,
  minClicks: number,
  days: number,
  floorByChannel: number,
): { total: number; perDay: number; clicks: number } {
  const total = Math.max(cpc * minClicks, floorByChannel * days);
  return {
    total: r2(total),
    perDay: r2(total / Math.max(days, 1)),
    clicks: Math.round(total / Math.max(cpc, 0.0001)),
  };
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function r2(n: number): number {
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : n;
}

export function round(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}
