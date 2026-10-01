/**
 * Estatística de decisão: quanta amostra é preciso antes de cortar.
 *
 * O roadmap diz "CTR < 1% após 1.000 impressões = pause". Isso é uma régua de
 * bolso. Aqui calculamos se a amostra realmente sustenta a decisão — e quando
 * não sustenta, dizemos "continue coletando" em vez de matar uma campanha por ruído.
 */

const Z_975 = 1.959964;

/** Aproximação da CDF normal padrão (Abramowitz & Stegun 7.1.26). */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - p : p;
}

/** Intervalo de Wilson para uma proporção — melhor que Wald para p pequeno. */
export function wilsonInterval(
  successes: number,
  trials: number,
  z = Z_975,
): { low: number; high: number; point: number } {
  if (trials <= 0) return { low: 0, high: 1, point: 0 };
  const p = successes / trials;
  const z2 = z * z;
  const denom = 1 + z2 / trials;
  const center = p + z2 / (2 * trials);
  const spread = z * Math.sqrt((p * (1 - p) + z2 / (4 * trials)) / trials);
  return {
    low: Math.max(0, (center - spread) / denom),
    high: Math.min(1, (center + spread) / denom),
    point: p,
  };
}

/**
 * Tamanho de amostra por grupo para teste de duas proporções.
 * p0 = benchmark, mde = diferença mínima que queremos ser capazes de detectar.
 */
export function minSampleSize(
  p0: number,
  mde: number,
  alpha = 0.05,
  power = 0.8,
): number {
  const p1 = p0 + mde;
  if (p1 <= 0 || p1 >= 1 || p0 <= 0 || p0 >= 1 || mde === 0) return Infinity;
  const zA = normalCdfInv(1 - alpha / 2);
  const zB = normalCdfInv(power);
  const pBar = (p0 + p1) / 2;
  const num =
    (zA * Math.sqrt(2 * pBar * (1 - pBar)) + zB * Math.sqrt(p0 * (1 - p0) + p1 * (1 - p1))) ** 2;
  return Math.ceil(num / (mde * mde));
}

/** Inverso aproximado da CDF normal (Acklam). */
export function normalCdfInv(p: number): number {
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= 1 - pl) {
    const q = p - 0.5;
    const r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

/** Teste z de duas proporções. Retorna z e p-valor bicaudal. */
export function twoProportionZ(
  x1: number,
  n1: number,
  x2: number,
  n2: number,
): { z: number; pValue: number } {
  if (n1 <= 0 || n2 <= 0) return { z: 0, pValue: 1 };
  const p1 = x1 / n1;
  const p2 = x2 / n2;
  const pPool = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
  if (se === 0) return { z: 0, pValue: 1 };
  const z = (p1 - p2) / se;
  return { z, pValue: 2 * (1 - normalCdf(Math.abs(z))) };
}

/**
 * Cliques mínimos para ler o CTR com uma precisão relativa aceitável.
 * Ex.: 1.000 impressões a 1% de CTR = 10 cliques → IC95 vai de 0,5% a 1,8%.
 * Ou seja: a régua "CTR < 1% = pause" NÃO é decidível nessa amostra.
 */
export function ctrPrecision(impressions: number, ctrPercent: number) {
  const clicks = (impressions * ctrPercent) / 100;
  const ci = wilsonInterval(Math.round(clicks), Math.max(impressions, 0));
  return {
    clicks: Math.round(clicks),
    ciLow: ci.low * 100,
    ciHigh: ci.high * 100,
    relativeWidth: clicks > 0 ? ((ci.high - ci.low) * 100) / (2 * ctrPercent || 1) : Infinity,
    decidable: clicks >= 100,
  };
}

/**
 * Impressões mínimas para ler o CTR com erro relativo ≤ `targetRelative`.
 * n = z² · (1−p) / (p · r²) — precisão RELATIVA, não margem absoluta.
 * Ex.: para separar 1% de 1,2% (r = 20%) são ~9.510 impressões.
 */
export function impressionsForCtrPrecision(ctrPercent: number, targetRelative = 0.2): number {
  const p = ctrPercent / 100;
  if (p <= 0) return Infinity;
  const n = (Z_975 ** 2 * (1 - p)) / (p * targetRelative ** 2);
  return Math.ceil(n);
}
