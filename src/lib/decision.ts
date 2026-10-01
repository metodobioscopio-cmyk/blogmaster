import type { BenchmarkRow } from './benchmarks';
import { offerMath } from './breakEven';
import { ctrPrecision, twoProportionZ } from './sampleSize';
import type { Campaign, Decision, MetricRead, TestSnapshot, Verdict } from './types';

export function actualMetrics(s: TestSnapshot) {
  const ctr = s.impressions > 0 ? (s.clicks / s.impressions) * 100 : 0;
  const cvr = s.clicks > 0 ? (s.conversions / s.clicks) * 100 : 0;
  const cpc = s.clicks > 0 ? s.spend / s.clicks : 0;
  const cpa = s.conversions > 0 ? s.spend / s.conversions : Infinity;
  const epc = s.clicks > 0 ? s.revenue / s.clicks : 0;
  const roas = s.spend > 0 ? s.revenue / s.spend : 0;
  const cpm = s.impressions > 0 ? (s.spend / s.impressions) * 1000 : 0;
  return { ctr, cvr, cpc, cpa, epc, roas, cpm };
}

/**
 * Passo 15 — Corte com base nas métricas.
 *
 * Regra central: nenhuma campanha morre por ruído. Se a amostra não sustenta a
 * leitura, o veredito é "continue coletando", não "pause".
 */
export function decide(
  campaign: Campaign,
  snapshot: TestSnapshot,
  benchmark: BenchmarkRow | null,
  currency = '',
): Decision {
  const m = actualMetrics(snapshot);
  const math = offerMath(campaign.offer, campaign.traffic);
  const cut = campaign.cutMetrics;
  const reads: MetricRead[] = [];
  const reasons: string[] = [];

  const precision = ctrPrecision(snapshot.impressions, m.ctr || 0.0001);

  // ---- CTR ----
  const ctrPassed = snapshot.impressions > 0 ? m.ctr >= cut.minCtr : null;
  reads.push({
    label: 'CTR',
    actual: round(m.ctr, 3),
    benchmark: benchmark ? benchmark.ctr : cut.minCtr,
    threshold: cut.minCtr,
    passed: ctrPassed,
    unit: '%',
    detail:
      snapshot.impressions > 0
        ? `IC95 do CTR medido: ${round(precision.ciLow, 2)}%–${round(precision.ciHigh, 2)}% (${precision.clicks} cliques). ${
            precision.decidable
              ? 'Amostra suficiente para decidir.'
              : 'Menos de 100 cliques: a leitura ainda é ruído.'
          }`
        : 'Sem impressões registradas.',
  });

  // ---- CPA ----
  // Quantos cliques sem conversão já são sinal e não azar? P(0 vendas | CR de empate)
  // cai abaixo de 10% a partir de `clicksForZeroConversionVerdict` cliques.
  const cpaDecidable = snapshot.conversions > 0 || snapshot.clicks >= clicksForZeroConversionVerdict(math.breakEvenCr);
  const cpaPassed = snapshot.conversions > 0 ? m.cpa <= cut.maxCpa : cpaDecidable ? false : null;
  reads.push({
    label: 'CPA',
    actual: Number.isFinite(m.cpa) ? round(m.cpa, 2) : Infinity,
    benchmark: benchmark ? benchmark.cpa : cut.maxCpa,
    threshold: cut.maxCpa,
    passed: cpaPassed,
    unit: currency,
    detail:
      snapshot.conversions > 0
        ? `${snapshot.conversions} conversão(ões) com ${round(m.cpc, 2)} de CPC médio.`
        : cpaDecidable
          ? `Zero conversão em ${snapshot.clicks} cliques — já passamos do ponto de empate teórico (${math.clicksToBreakEvenPerSale} cliques/venda).`
          : `Zero conversão em ${snapshot.clicks} cliques; ainda dentro do esperado (${math.clicksToBreakEvenPerSale} cliques/venda no empate).`,
  });

  // ---- EPC ----
  const epcPassed = snapshot.clicks > 0 ? m.epc >= cut.minEpc : null;
  reads.push({
    label: 'EPC',
    actual: round(m.epc, 3),
    benchmark: round(math.breakEvenEpc, 2),
    threshold: cut.minEpc,
    passed: epcPassed,
    unit: currency,
    detail: `EPC de empate desta oferta: ${round(math.breakEvenEpc, 2)} (= CPC). Abaixo disso você paga para trabalhar.`,
  });

  const failures = reads.filter((r) => r.passed === false).length;
  const sampleSufficient =
    snapshot.impressions >= cut.minImpressions && snapshot.clicks >= 100;

  // ---- Guarda de queima: muito gasto, nenhum sinal ----
  const burnGuard =
    snapshot.conversions === 0 && snapshot.spend > cut.maxCpa * 3 && snapshot.spend > 0;

  let verdict: Verdict;
  if (burnGuard) {
    verdict = 'kill';
    reasons.push(
      `Gasto de ${round(snapshot.spend, 2)} já é ${round(snapshot.spend / cut.maxCpa, 1)}× o CPA máximo sem uma única conversão. Isso não é teste, é hemorragia.`,
    );
  } else if (!sampleSufficient) {
    verdict = 'indefinido';
    reasons.push(
      `Amostra insuficiente: ${snapshot.impressions}/${cut.minImpressions} impressões e ${snapshot.clicks}/100 cliques.`,
    );
    if (ctrPassed === false && precision.clicks >= 100) {
      reasons.push('O CTR já está abaixo da régua com amostra legível — sinal precoce de criativo fraco.');
    }
  } else if (failures === 0) {
    verdict = 'scale';
    reasons.push('As três métricas de corte foram batidas com amostra suficiente.');
  } else if (failures === 1) {
    verdict = 'iterate';
    const failed = reads.find((r) => r.passed === false);
    reasons.push(`Uma métrica falhou (${failed?.label}). Um único eixo muda por vez — nunca ângulo e criativo juntos.`);
  } else {
    verdict = 'kill';
    reasons.push(`${failures} de 3 métricas de corte falharam com amostra suficiente.`);
  }

  // ---- Confiança estatística (CTR vs benchmark) ----
  let confidence = 0;
  if (benchmark && snapshot.impressions > 0 && benchmark.ctr > 0) {
    const benchClicks = Math.round((benchmark.ctr / 100) * snapshot.impressions);
    const { pValue } = twoProportionZ(snapshot.clicks, snapshot.impressions, benchClicks, snapshot.impressions);
    confidence = Math.max(0, Math.min(1, 1 - pValue));
  }
  if (!sampleSufficient) confidence = Math.min(confidence, 0.35);

  const clicksPerDay = campaign.traffic.cpc > 0 ? campaign.traffic.dailyBudget / campaign.traffic.cpc : 0;
  const projectedDailyProfit = clicksPerDay * (m.epc - m.cpc);

  return {
    verdict,
    confidence: round(confidence, 3),
    reads,
    reasons,
    sampleSufficient,
    projectedDailyProfit: round(projectedDailyProfit, 2),
    nextAction: nextAction(verdict, reads, math.clicksToBreakEvenPerSale),
  };
}

function nextAction(verdict: Verdict, reads: MetricRead[], clicksPerSale: number): string {
  switch (verdict) {
    case 'scale':
      return 'Entre no módulo A2 (Ampliação) e suba 20% ao dia enquanto o CPA segurar. Não dobre de uma vez.';
    case 'iterate': {
      const failed = reads.find((r) => r.passed === false);
      if (failed?.label === 'CTR') return 'Troque apenas o criativo: 3 variações novas do MESMO ângulo. Rode mais 1.000 impressões por variação.';
      if (failed?.label === 'CPA')
        return `O clique chega, a página não converte. Refaça a promessa da landing: a oferta precisa de ~${Math.ceil(clicksPerSale)} cliques por venda e você está pagando mais que isso.`;
      return 'Revise a oferta: comissão líquida baixa demais para o CPC do canal. Renegocie, troque de rede ou troque de canal.';
    }
    case 'kill':
      return 'Pause hoje. Documente ângulo, criativo, público e país no relatório — o aprendizado é o ativo, não a campanha.';
    default:
      return 'Não mexa. Deixe rodar até a amostra mínima e só então corte. Alterar antes disso ensina o algoritmo a errar.';
  }
}

/**
 * Cliques necessários para que observar ZERO conversões seja evidência (90% de
 * confiança) de que o CR real está abaixo do CR de empate.
 *   n = ln(1 − confiança) / ln(1 − CR_empate)
 */
export function clicksForZeroConversionVerdict(breakEvenCrPercent: number, confidence = 0.9): number {
  const p = breakEvenCrPercent / 100;
  if (!Number.isFinite(p) || p <= 0 || p >= 1) return p >= 1 ? 1 : Infinity;
  return Math.ceil(Math.log(1 - confidence) / Math.log(1 - p));
}

function round(n: number, d: number): number {
  const f = 10 ** d;
  return Number.isFinite(n) ? Math.round(n * f) / f : n;
}
