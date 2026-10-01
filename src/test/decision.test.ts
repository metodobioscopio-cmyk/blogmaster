import { describe, expect, it } from 'vitest';
import { actualMetrics, decide } from '../lib/decision';
import { makeCampaign } from '../test/factory';
import type { BenchmarkRow } from '../lib/benchmarks';

const bench: BenchmarkRow = {
  channel: 'meta',
  vertical: 'info_product',
  geo: 'T1',
  ctr: 1.72,
  cpc: 1.18,
  cpa: 40,
  cvr: 1.5,
  source: 'fonte de teste',
  sourceUrl: '',
  year: '2026',
};

describe('actualMetrics', () => {
  it('calcula CTR, CVR, CPC, CPA, EPC, ROAS e CPM', () => {
    const m = actualMetrics({ impressions: 10000, clicks: 200, conversions: 8, spend: 400, revenue: 500 });
    expect(m.ctr).toBeCloseTo(2, 3);
    expect(m.cvr).toBeCloseTo(4, 3);
    expect(m.cpc).toBeCloseTo(2, 3);
    expect(m.cpa).toBeCloseTo(50, 3);
    expect(m.epc).toBeCloseTo(2.5, 3);
    expect(m.roas).toBeCloseTo(1.25, 3);
    expect(m.cpm).toBeCloseTo(40, 3);
  });

  it('não divide por zero', () => {
    const m = actualMetrics({ impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 });
    expect(m.ctr).toBe(0);
    expect(m.cpa).toBe(Infinity);
  });
});

describe('decide — Passo 15', () => {
  it('manda coletar mais dado quando a amostra é insuficiente, em vez de pausar', () => {
    const c = makeCampaign();
    const d = decide(c, { impressions: 500, clicks: 6, conversions: 0, spend: 12, revenue: 0 }, bench, 'USD');
    expect(d.verdict).toBe('indefinido');
    expect(d.sampleSufficient).toBe(false);
    expect(d.nextAction).toMatch(/não mexa/i);
  });

  it('veredito SCALE quando as três métricas passam com amostra suficiente', () => {
    const c = makeCampaign({
      cutMetrics: { minCtr: 1, maxCpa: 40, minEpc: 1, minImpressions: 1000 },
    });
    // CTR 2,2% · CPA 25 · EPC 1,60
    const d = decide(c, { impressions: 25000, clicks: 550, conversions: 22, spend: 550, revenue: 880 }, bench, 'USD');
    expect(d.verdict).toBe('scale');
    expect(d.reads.every((r) => r.passed)).toBe(true);
  });

  it('veredito ITERATE quando exatamente uma métrica falha', () => {
    const c = makeCampaign({ cutMetrics: { minCtr: 1, maxCpa: 12, minEpc: 1, minImpressions: 1000 } });
    // CPA 25 passa de 12 (falha), CTR e EPC ok
    const d = decide(c, { impressions: 25000, clicks: 550, conversions: 22, spend: 550, revenue: 880 }, bench, 'USD');
    expect(d.verdict).toBe('iterate');
    expect(d.nextAction).toMatch(/landing|clique/i);
  });

  it('veredito KILL quando duas ou mais métricas falham', () => {
    const c = makeCampaign({ cutMetrics: { minCtr: 2, maxCpa: 10, minEpc: 2, minImpressions: 1000 } });
    const d = decide(c, { impressions: 25000, clicks: 250, conversions: 5, spend: 500, revenue: 250 }, bench, 'USD');
    expect(d.verdict).toBe('kill');
    expect(d.nextAction).toMatch(/pause/i);
  });

  it('dispara a guarda de queima com gasto alto e zero conversão', () => {
    const c = makeCampaign({ cutMetrics: { minCtr: 1, maxCpa: 40, minEpc: 1, minImpressions: 1000 } });
    // gastou 150 = 3,75× o CPA máximo sem nenhuma conversão
    const d = decide(c, { impressions: 900, clicks: 40, conversions: 0, spend: 150, revenue: 0 }, bench, 'USD');
    expect(d.verdict).toBe('kill');
    expect(d.reasons.join(' ')).toMatch(/sem uma única conversão/i);
  });

  it('não marca CPA como falha antes de haver evidência estatística', () => {
    const c = makeCampaign({ cutMetrics: { minCtr: 1, maxCpa: 40, minEpc: 1, minImpressions: 1000 } });
    // Comissão 50 e CPC 1 → empate em 2%. Zero conversão em 60 cliques ainda é azar plausível.
    const d = decide(c, { impressions: 3000, clicks: 60, conversions: 0, spend: 60, revenue: 0 }, bench, 'USD');
    const cpaRead = d.reads.find((r) => r.label === 'CPA');
    expect(cpaRead?.passed).toBeNull();
    expect(cpaRead?.detail).toMatch(/ainda dentro do esperado/);
  });

  it('marca CPA como falha quando zero conversão deixa de ser plausível', () => {
    const c = makeCampaign({ cutMetrics: { minCtr: 1, maxCpa: 40, minEpc: 1, minImpressions: 1000 } });
    // Acima de 114 cliques, zero conversão já é evidência contra o empate de 2%
    const d = decide(c, { impressions: 7000, clicks: 140, conversions: 0, spend: 140, revenue: 0 }, bench, 'USD');
    const cpaRead = d.reads.find((r) => r.label === 'CPA');
    expect(cpaRead?.passed).toBe(false);
  });

  it('mostra o intervalo de confiança do CTR na justificativa', () => {
    const c = makeCampaign();
    const d = decide(c, { impressions: 1000, clicks: 10, conversions: 0, spend: 12, revenue: 0 }, bench, 'USD');
    const ctrRead = d.reads.find((r) => r.label === 'CTR');
    expect(ctrRead?.detail).toMatch(/IC95/);
    expect(ctrRead?.detail).toMatch(/ruído/);
  });

  it('reduz a confiança quando a amostra é insuficiente', () => {
    const c = makeCampaign();
    const d = decide(c, { impressions: 500, clicks: 20, conversions: 0, spend: 20, revenue: 0 }, bench, 'USD');
    expect(d.confidence).toBeLessThanOrEqual(0.35);
  });
});
