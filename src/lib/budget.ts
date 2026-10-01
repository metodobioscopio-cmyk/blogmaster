import { MIN_BUDGET } from './benchmarks';
import type { ChannelId } from './types';

export interface BudgetPlan {
  channel: ChannelId;
  /** Piso técnico imposto pela plataforma. */
  technicalFloor: number;
  /** Piso que gera dado suficiente (regra da learning phase). */
  learningFloor: number;
  /** Piso estatístico: cliques necessários para ler CTR/CPA. */
  statisticalFloor: number;
  daily: number;
  total72h: number;
  clicks72h: number;
  expectedConversions72h: number;
  rationale: string[];
  source: string;
  sourceUrl: string;
}

/**
 * Passo 13 — Orçamento de teste.
 *
 * Três pisos competem entre si e o maior vence:
 *  1. piso técnico da plataforma (TikTok >US$50/campanha, Meta US$1–20/dia);
 *  2. piso de learning phase (Meta: targetCPA × 50 eventos ÷ 7 dias);
 *  3. piso estatístico (100 cliques para ler CTR com IC aceitável).
 */
export function planTestBudget(params: {
  channel: ChannelId;
  cpc: number;
  targetCpa: number;
  dailyBudget?: number;
  days?: number;
}): BudgetPlan {
  const { channel, cpc, targetCpa } = params;
  const days = params.days ?? 3;
  const rule = MIN_BUDGET[channel];

  const technicalFloor = rule.technical;
  // Meta e TikTok exigem ~50 eventos de otimização por semana por conjunto.
  const learningFloor = channel === 'meta' || channel === 'tiktok' || channel === 'tiktok_shop'
    ? Math.ceil((targetCpa * 50) / 7)
    : 0;
  // 100 cliques no total para uma leitura de CTR com IC95 de largura aceitável.
  const statisticalFloor = Math.ceil((cpc * 100) / days);

  const daily = Math.max(technicalFloor, learningFloor, statisticalFloor, params.dailyBudget ?? 0);
  const total72h = daily * days;
  const clicks72h = cpc > 0 ? total72h / cpc : 0;
  const expectedConversions72h = targetCpa > 0 ? total72h / targetCpa : 0;

  const rationale: string[] = [];
  if (technicalFloor === daily) rationale.push(`Piso técnico da plataforma venceu: ${rule.rule}`);
  if (learningFloor === daily && learningFloor > 0)
    rationale.push(
      `Learning phase venceu: targetCPA ${round(targetCpa, 2)} × 50 eventos ÷ 7 dias = ${learningFloor}/dia.`,
    );
  if (statisticalFloor === daily)
    rationale.push(`Piso estatístico venceu: 100 cliques ÷ ${days} dias × CPC ${round(cpc, 2)} = ${statisticalFloor}/dia.`);
  if (params.dailyBudget && params.dailyBudget > daily)
    rationale.push(`Seu orçamento declarado (${params.dailyBudget}/dia) está acima de todos os pisos — ok.`);
  rationale.push(rule.rule);

  return {
    channel,
    technicalFloor,
    learningFloor,
    statisticalFloor,
    daily: round(daily, 2),
    total72h: round(total72h, 2),
    clicks72h: Math.round(clicks72h),
    expectedConversions72h: round(expectedConversions72h, 1),
    rationale,
    source: rule.source,
    sourceUrl: rule.sourceUrl,
  };
}

/**
 * Regra de bolso do roadmap: "teste com valor que você aceita perder".
 * Converte o teto de perda mensal aceitável em orçamento diário de teste.
 */
export function affordableTest(monthlyLossCeiling: number, testsPerMonth = 4): {
  perTest: number;
  perDay: number;
} {
  const perTest = monthlyLossCeiling / Math.max(testsPerMonth, 1);
  return { perTest: round(perTest, 2), perDay: round(perTest / 3, 2) };
}

function round(n: number, d: number): number {
  const f = 10 ** d;
  return Number.isFinite(n) ? Math.round(n * f) / f : n;
}
