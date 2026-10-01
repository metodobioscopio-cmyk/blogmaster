import { describe, expect, it } from 'vitest';
import { dailyProjection, maxCpcFor, minCommissionFor, offerMath, testBudgetFor } from '../lib/breakEven';
import { makeCampaign } from '../test/factory';

describe('offerMath — Passo 5, comissão mínima viável', () => {
  it('reproduz o exemplo do roadmap: comissão US$12 e CPC US$2 exigem 1 conversão em 6', () => {
    // 1/6 = 16,667% de conversão de empate
    const campaign = makeCampaign({
      offer: { commissionMode: 'flat', commissionValue: 12 },
      traffic: { cpc: 2 },
    });
    const m = offerMath(campaign.offer, campaign.traffic);
    expect(m.breakEvenCr).toBeCloseTo(16.667, 2);
    expect(m.clicksToBreakEvenPerSale).toBeCloseTo(6, 1);
    expect(m.verdict).toBe('inviavel');
  });

  it('desconta a taxa da rede antes do split (ClickBank 7,5% + US$1)', () => {
    const campaign = makeCampaign({
      offer: {
        price: 100,
        commissionMode: 'percent',
        commissionValue: 50,
        networkFeePercent: 7.5,
        networkFeeFixed: 1,
      },
    });
    const m = offerMath(campaign.offer, campaign.traffic);
    // 100 − (7,5 + 1) = 91,5 → 50% = 45,75
    expect(m.grossCommission).toBe(50);
    expect(m.networkFee).toBeCloseTo(8.5, 2);
    expect(m.netCommission).toBeCloseTo(45.75, 2);
    expect(m.commissionAfterRefunds).toBeCloseTo(45.75, 2);
  });

  it('aplica estorno sobre a comissão líquida', () => {
    const campaign = makeCampaign({
      offer: { price: 100, commissionValue: 50, refundRate: 20 },
    });
    const m = offerMath(campaign.offer, campaign.traffic);
    expect(m.netCommission).toBe(50);
    expect(m.commissionAfterRefunds).toBe(40);
  });

  it('em CPA fixo a taxa da rede não é deduzida do afiliado', () => {
    const campaign = makeCampaign({
      offer: { commissionMode: 'flat', commissionValue: 30, networkFeePercent: 7.5, networkFeeFixed: 1 },
    });
    const m = offerMath(campaign.offer, campaign.traffic);
    expect(m.netCommission).toBe(30);
    expect(m.networkFee).toBe(0);
  });

  it('EPC de empate é igual ao CPC — abaixo disso você paga para trabalhar', () => {
    const campaign = makeCampaign({ traffic: { cpc: 1.5 } });
    const m = offerMath(campaign.offer, campaign.traffic);
    expect(m.breakEvenEpc).toBe(1.5);
  });

  it('classifica a margem: ok com 25%+ de folga, apertado entre 0 e 25%, inviável abaixo de zero', () => {
    const inviavel = offerMath(
      makeCampaign({ offer: { commissionMode: 'flat', commissionValue: 10 }, traffic: { cpc: 2, cvr: 10 } }).offer,
      { channel: 'meta', cpc: 2, ctr: 2, cvr: 10, dailyBudget: 100 },
    );
    // EPC = 10 × 10% = 1,00 com CPC 2 → margem −1,00
    expect(inviavel.verdict).toBe('inviavel');

    const apertado = offerMath(
      makeCampaign({ offer: { commissionMode: 'flat', commissionValue: 10 } }).offer,
      { channel: 'meta', cpc: 1.8, ctr: 2, cvr: 20, dailyBudget: 100 },
    );
    // EPC = 2,00 com CPC 1,80 → margem 0,20 = 11% do CPC
    expect(apertado.verdict).toBe('apertado');

    const ok = offerMath(
      makeCampaign({ offer: { commissionMode: 'flat', commissionValue: 10 } }).offer,
      { channel: 'meta', cpc: 1, ctr: 2, cvr: 30, dailyBudget: 100 },
    );
    // EPC = 3,00 com CPC 1,00 → margem 2,00 = 200% do CPC
    expect(ok.verdict).toBe('ok');
  });

  it('marca inviável quando a comissão é zero', () => {
    const campaign = makeCampaign({ offer: { commissionMode: 'flat', commissionValue: 0 } });
    const m = offerMath(campaign.offer, campaign.traffic);
    expect(m.breakEvenCr).toBe(Infinity);
    expect(m.verdict).toBe('inviavel');
  });
});

describe('engenharia reversa de comissão e CPC', () => {
  it('calcula a comissão mínima dado o CR provado', () => {
    // CPC 2 com 4% de conversão exige comissão de 50 para empatar
    expect(minCommissionFor(2, 4)).toBe(50);
  });

  it('calcula o CPC máximo preservando 25% de margem', () => {
    // comissão 50, CR 4% → EPC 2; com 25% de margem → CPC máx 1,50
    expect(maxCpcFor(50, 4, 0.25)).toBe(1.5);
  });
});

describe('projeção diária', () => {
  it('projeta cliques, conversões, receita e lucro', () => {
    const campaign = makeCampaign({
      offer: { commissionMode: 'flat', commissionValue: 20 },
      traffic: { cpc: 1, cvr: 5, dailyBudget: 100 },
    });
    const p = dailyProjection(campaign.offer, campaign.traffic);
    expect(p.clicks).toBe(100);
    expect(p.conversions).toBe(5);
    expect(p.revenue).toBe(100);
    expect(p.profit).toBe(0);
  });
});

describe('orçamento de teste', () => {
  it('respeita o piso do canal quando ele é maior', () => {
    const r = testBudgetFor(0.2, 100, 3, 50);
    // 0,2 × 100 = 20 de mídia, mas o piso do canal é 50/dia × 3 = 150
    expect(r.total).toBe(150);
    expect(r.perDay).toBe(50);
  });

  it('usa o custo de mídia quando ele supera o piso', () => {
    const r = testBudgetFor(5, 100, 3, 20);
    expect(r.total).toBe(500);
    expect(r.perDay).toBeCloseTo(166.67, 2);
  });
});
