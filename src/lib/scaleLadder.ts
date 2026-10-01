/**
 * Passo 19 — Escale em degraus.
 * Regra: +20% ao dia enquanto o CPA segurar. Dobrar de uma vez quebra a campanha.
 */

export interface ScaleDay {
  day: number;
  budget: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  profit: number;
  cumulativeProfit: number;
  cpa: number;
  status: 'subir' | 'segurar' | 'pausar';
  note: string;
}

export interface ScaleInput {
  baseBudget: number;
  /** CPA observado no teste de 72h. */
  observedCpa: number;
  /** CPA acima do qual a subida para. */
  guardCpa: number;
  days: number;
  /** Comissão líquida por conversão. */
  commissionNet: number;
  /** Aumento diário (0,2 = 20%). */
  step?: number;
  /** Deriva do CPA a cada dia (0 = estável, 0,05 = degradação de 5%/dia). */
  cpaDrift?: number;
}

export function simulateScale(input: ScaleInput): ScaleDay[] {
  const step = input.step ?? 0.2;
  const drift = input.cpaDrift ?? 0;
  const out: ScaleDay[] = [];
  let budget = input.baseBudget;
  let cpa = input.observedCpa;
  let cumulative = 0;
  let halted = false;

  for (let day = 1; day <= input.days; day++) {
    const conversions = cpa > 0 ? budget / cpa : 0;
    const revenue = conversions * input.commissionNet;
    const profit = revenue - budget;
    cumulative += profit;

    let status: ScaleDay['status'] = 'subir';
    let note = `+${Math.round(step * 100)}% sobre o dia anterior.`;

    if (halted) {
      status = 'segurar';
      note = 'Orçamento travado no último degrau válido — não escale com guarda estourada.';
    } else if (cpa > input.guardCpa) {
      status = 'pausar';
      note = `CPA projetado ${round(cpa, 2)} passou da guarda ${round(input.guardCpa, 2)}. Volte ao degrau anterior e refaça o criativo.`;
      halted = true;
    } else if (cpa > input.guardCpa * 0.9) {
      status = 'segurar';
      note = 'CPA a menos de 10% da guarda: congele o orçamento e observe mais um dia.';
    }

    out.push({
      day,
      budget: round(budget, 2),
      clicks: 0,
      conversions: round(conversions, 2),
      spend: round(budget, 2),
      revenue: round(revenue, 2),
      profit: round(profit, 2),
      cumulativeProfit: round(cumulative, 2),
      cpa: round(cpa, 2),
      status,
      note,
    });

    if (status === 'subir') budget *= 1 + step;
    cpa *= 1 + drift;
  }
  return out;
}

/**
 * Quantos degraus de 20% cabem antes de o orçamento dobrar / triplicar.
 * Útil para responder "quanto tempo leva para 5× o budget sem quebrar a campanha".
 */
export function doublingsFor(step = 0.2): { toDouble: number; toTriple: number; toFiveX: number } {
  const n = (target: number) => Math.ceil(Math.log(target) / Math.log(1 + step));
  return { toDouble: n(2), toTriple: n(3), toFiveX: n(5) };
}

/** Regra prática: quanto o lucro cresce se o CPA degradar x% a cada degrau. */
export function scaleRisk(input: ScaleInput, drift: number): { profitStable: number; profitDrift: number } {
  const stable = simulateScale({ ...input, cpaDrift: 0 });
  const risky = simulateScale({ ...input, cpaDrift: drift });
  return {
    profitStable: stable[stable.length - 1]?.cumulativeProfit ?? 0,
    profitDrift: risky[risky.length - 1]?.cumulativeProfit ?? 0,
  };
}

function round(n: number, d: number): number {
  const f = 10 ** d;
  return Number.isFinite(n) ? Math.round(n * f) / f : n;
}
