import { describe, expect, it } from 'vitest';
import {
  ctrPrecision,
  impressionsForCtrPrecision,
  minSampleSize,
  twoProportionZ,
  wilsonInterval,
} from '../lib/sampleSize';

describe('intervalo de Wilson', () => {
  it('devolve o ponto amostral quando não há distorção', () => {
    const ci = wilsonInterval(100, 10000);
    expect(ci.point).toBeCloseTo(0.01, 4);
    expect(ci.low).toBeLessThan(0.01);
    expect(ci.high).toBeGreaterThan(0.01);
  });

  it('trata amostra vazia sem quebrar', () => {
    expect(wilsonInterval(0, 0)).toEqual({ low: 0, high: 1, point: 0 });
  });

  it('estreita com o aumento da amostra', () => {
    const pequeno = wilsonInterval(10, 1000);
    const grande = wilsonInterval(1000, 100000);
    expect(grande.high - grande.low).toBeLessThan(pequeno.high - pequeno.low);
  });
});

describe('ctrPrecision — a régua "1.000 impressões" do roadmap', () => {
  it('mostra que 10 cliques NÃO sustentam decisão', () => {
    const p = ctrPrecision(1000, 1);
    expect(p.clicks).toBe(10);
    expect(p.decidable).toBe(false);
    expect(p.ciLow).toBeLessThan(1);
    expect(p.ciHigh).toBeGreaterThan(1);
  });

  it('sustenta a decisão a partir de ~100 cliques', () => {
    const p = ctrPrecision(10000, 1);
    expect(p.clicks).toBe(100);
    expect(p.decidable).toBe(true);
  });
});

describe('minSampleSize', () => {
  it('exige mais amostra para detectar diferenças pequenas', () => {
    const grande = minSampleSize(0.02, 0.01); // detectar 2% vs 3%
    const pequeno = minSampleSize(0.02, 0.02); // detectar 2% vs 4%
    expect(grande).toBeGreaterThan(pequeno);
    expect(grande).toBeGreaterThan(1000);
  });

  it('devolve Infinity para casos impossíveis', () => {
    expect(minSampleSize(0, 0.01)).toBe(Infinity);
    expect(minSampleSize(0.5, 0)).toBe(Infinity);
    expect(minSampleSize(0.99, 0.05)).toBe(Infinity);
  });
});

describe('twoProportionZ', () => {
  it('não distingue duas taxas iguais', () => {
    const { pValue } = twoProportionZ(100, 10000, 100, 10000);
    expect(pValue).toBeCloseTo(1, 3);
  });

  it('distingue taxas muito diferentes com amostra grande', () => {
    const { pValue, z } = twoProportionZ(500, 10000, 100, 10000);
    expect(z).toBeGreaterThan(10);
    expect(pValue).toBeLessThan(0.001);
  });

  it('é simétrico na troca de grupos', () => {
    const a = twoProportionZ(500, 10000, 100, 10000);
    const b = twoProportionZ(100, 10000, 500, 10000);
    expect(Math.abs(a.z)).toBeCloseTo(Math.abs(b.z), 6);
  });
});

describe('impressionsForCtrPrecision', () => {
  it('exige amostra maior para CTR menor', () => {
    expect(impressionsForCtrPrecision(0.5)).toBeGreaterThan(impressionsForCtrPrecision(2));
  });

  it('exige ~9.500 impressões para ler CTR de 1% com ±20% de erro relativo', () => {
    const n = impressionsForCtrPrecision(1, 0.2);
    expect(n).toBeGreaterThan(9000);
    expect(n).toBeLessThan(10000);
  });
});
