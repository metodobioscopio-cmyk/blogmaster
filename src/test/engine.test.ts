import { describe, expect, it } from 'vitest';
import { MIN_BUDGET, findBenchmark, GEO_MULTIPLIER, BENCHMARKS } from '../lib/benchmarks';
import { planTestBudget } from '../lib/budget';
import { scoreCampaign } from '../lib/offerScore';
import { doublingsFor, simulateScale } from '../lib/scaleLadder';
import { buildTrackedUrl, postbackTemplate, suggestedSubIdScheme } from '../lib/tracking';
import { aggregate, campaignReport, templateMarkdown } from '../lib/report';
import { STEPS, FINAL_CHECKLIST } from '../lib/steps';
import { HF_ASSETS, OSS_TOOLS } from '../lib/catalog';
import { makeCampaign } from '../test/factory';
import type { AppState } from '../lib/types';

describe('base de benchmarks', () => {
  it('toda linha publicada cita fonte com URL e ano', () => {
    for (const b of BENCHMARKS) {
      expect(b.source.length).toBeGreaterThan(5);
      expect(b.sourceUrl.startsWith('http')).toBe(true);
      expect(b.year).toBe('2026');
    }
  });

  it('encontra linha específica quando existe e cai no canal quando não existe', () => {
    const especifico = findBenchmark('tiktok', 'beauty', 'T1');
    expect(especifico.row?.vertical).toBe('beauty');

    const fallback = findBenchmark('google_search', 'gaming', 'T1');
    expect(fallback.row).not.toBeNull();
    expect(fallback.row?.channel).toBe('google_search');
  });

  it('ajusta para T2 e T3 e marca como derivação', () => {
    const t1 = findBenchmark('meta', 'ecommerce', 'T1');
    const t2 = findBenchmark('meta', 'ecommerce', 'T2');
    const t3 = findBenchmark('meta', 'ecommerce', 'T3');
    expect(t2.geoAdjusted!.cpc).toBeLessThan(t1.geoAdjusted!.cpc);
    expect(t3.geoAdjusted!.cpc).toBeLessThan(t2.geoAdjusted!.cpc);
    expect(t2.row!.cpc).toBe(t1.row!.cpc); // a linha original não é mutada
    expect(GEO_MULTIPLIER.T1.cpc).toBe(1);
  });

  it('não devolve nada para canal sem leilão pago', () => {
    expect(findBenchmark('seo', 'ecommerce', 'T1').row).toBeNull();
    expect(MIN_BUDGET.seo.technical).toBe(0);
  });
});

describe('planTestBudget — Passo 13', () => {
  it('o piso da learning phase domina no Meta com CPA alto', () => {
    const b = planTestBudget({ channel: 'meta', cpc: 1, targetCpa: 40 });
    // 40 × 50 / 7 = 285,7
    expect(b.learningFloor).toBe(286);
    expect(b.daily).toBe(286);
    expect(b.rationale.join(' ')).toMatch(/Learning phase/i);
  });

  it('o piso técnico do TikTok vale quando os outros são menores', () => {
    const b = planTestBudget({ channel: 'tiktok', cpc: 1, targetCpa: 10 });
    expect(b.technicalFloor).toBe(20);
    // learning floor 10×50/7 = 72 > 20, então a learning phase domina
    expect(b.daily).toBe(b.learningFloor);
  });

  it('o piso estatístico domina quando o CPC é alto', () => {
    const b = planTestBudget({ channel: 'google_search', cpc: 5, targetCpa: 50 });
    // 5 × 100 / 3 = 167
    expect(b.statisticalFloor).toBe(167);
    expect(b.daily).toBe(167);
  });

  it('total de 72h é 3× o diário e projeta conversões pelo CPA alvo', () => {
    const b = planTestBudget({ channel: 'meta', cpc: 1, targetCpa: 40, days: 3 });
    expect(b.total72h).toBeCloseTo(b.daily * 3, 0);
    // 858 de gasto com CPA alvo de 40 → ~21 conversões no período
    expect(b.expectedConversions72h).toBeGreaterThan(20);
    expect(b.expectedConversions72h).toBeLessThan(23);
  });
});

describe('scoreCampaign', () => {
  it('campanha vazia tem score baixo e não passa no portão do teste', () => {
    const s = scoreCampaign(makeCampaign());
    expect(s.total).toBeLessThan(50);
    expect(s.readyToTest).toBe(false);
    expect(s.blocking.length).toBeGreaterThan(0);
  });

  it('campanha completa libera o teste', () => {
    const c = makeCampaign({
      offer: { commissionMode: 'flat', commissionValue: 60, price: 97, refundRate: 5 },
      traffic: { cpc: 2, ctr: 2, cvr: 6, dailyBudget: 100 },
      angle: {
        statement: 'Aposentadoria aos 40 sem herdar nada',
        promise: 'R$ 500 por mês virando renda em 90 dias',
        audience: 'CLT 30-40 anos com sobra de R$ 300 no fim do mês',
        proof: 'Backtest de 20 anos + planilha aberta',
        channelRationale: 'Busca ativa por "como investir com pouco" no Google',
      },
      tracking: {
        subIdScheme: 'oferta_us_publico_a',
        landingUrl: 'https://exemplo.com',
        postbackUrl: 'https://trk.exemplo.com/postback',
        pixelInstalled: true,
        networkPostbackConfigured: true,
        s2sTested: true,
      },
      compliance: {
        geos: ['US'],
        checkedRuleIds: ['ftc-per-content', 'ftc-placement', 'ftc-wording', 'meta-policy'],
        disclosureText: 'Paid link: I earn a commission.',
      },
      cutMetrics: { minCtr: 1, maxCpa: 40, minEpc: 2, minImpressions: 1000 },
      snapshots: [{ at: new Date().toISOString(), label: 'dia 1', impressions: 2000, clicks: 50, conversions: 3, spend: 100, revenue: 180 }],
    });
    const s = scoreCampaign(c);
    expect(s.readyToTest).toBe(true);
    expect(s.total).toBeGreaterThan(70);
  });

  it('oferece gaps acionáveis em vez de só uma nota', () => {
    const s = scoreCampaign(makeCampaign());
    const all = s.letters.flatMap((l) => l.gaps).join(' ');
    expect(all).toMatch(/CPC/i);
    expect(all).toMatch(/compliance|país-alvo/i);
    expect(all).toMatch(/pixel|Postback/i);
  });
});

describe('simulateScale — Passo 19', () => {
  it('cresce 20% ao dia enquanto o CPA respeita a guarda', () => {
    const dias = simulateScale({ baseBudget: 100, observedCpa: 30, guardCpa: 50, days: 4, commissionNet: 60 });
    expect(dias[0].budget).toBe(100);
    expect(dias[1].budget).toBeCloseTo(120, 2);
    expect(dias[2].budget).toBeCloseTo(144, 2);
    // budget 100 e CPA 30 → 3,33 conversões × 60 = 200 de receita
    expect(dias[0].revenue).toBeCloseTo(200, 1);
    expect(dias[0].profit).toBeCloseTo(100, 1);
  });

  it('trava a escala quando o CPA passa da guarda', () => {
    const dias = simulateScale({ baseBudget: 100, observedCpa: 60, guardCpa: 50, days: 3, commissionNet: 60 });
    expect(dias[0].status).toBe('pausar');
    expect(dias[1].status).toBe('segurar');
    expect(dias[1].budget).toBe(100);
  });

  it('segura o orçamento quando o CPA chega a 90% da guarda', () => {
    const dias = simulateScale({ baseBudget: 100, observedCpa: 46, guardCpa: 50, days: 2, commissionNet: 60 });
    expect(dias[0].status).toBe('segurar');
    expect(dias[1].budget).toBe(100);
  });

  it('respeita passo customizado', () => {
    const dias = simulateScale({ baseBudget: 100, observedCpa: 30, guardCpa: 100, days: 3, commissionNet: 60, step: 0.5 });
    expect(dias[1].budget).toBe(150);
  });

  it('a degradação de CPA corrói o lucro acumulado', () => {
    const estavel = simulateScale({ baseBudget: 100, observedCpa: 30, guardCpa: 100, days: 10, commissionNet: 60, cpaDrift: 0 });
    const degradado = simulateScale({ baseBudget: 100, observedCpa: 30, guardCpa: 100, days: 10, commissionNet: 60, cpaDrift: 0.05 });
    const lucroEstavel = estavel[estavel.length - 1].cumulativeProfit;
    const lucroDegradado = degradado[degradado.length - 1].cumulativeProfit;
    expect(lucroDegradado).toBeLessThan(lucroEstavel);
  });
});

describe('doublingsFor', () => {
  it('a 20% ao dia, dobrar leva 4 dias', () => {
    expect(doublingsFor(0.2).toDouble).toBe(4);
    expect(doublingsFor(0.2).toFiveX).toBe(9);
  });
});

describe('tracking', () => {
  it('monta a URL com UTM e sub-ID com macro do canal', () => {
    const url = buildTrackedUrl({
      baseUrl: 'https://exemplo.com/oferta',
      source: 'meta',
      medium: 'cpc',
      campaign: 'omega3',
      content: 'criativo-a',
      subIdParam: 'subid',
      channel: 'meta',
    });
    expect(url).toContain('utm_source=meta');
    expect(url).toContain('utm_campaign=omega3');
    expect(url).toContain('subid=%7Bsubid%3A%7B%7Bfbclid%7D%7D%7D');
  });

  it('aceita URL sem protocolo', () => {
    const url = buildTrackedUrl({ baseUrl: 'exemplo.com/x', source: 's', medium: 'm', campaign: 'c' });
    expect(url.startsWith('https://exemplo.com/x')).toBe(true);
  });

  it('gera esquema de sub-ID legível', () => {
    expect(suggestedSubIdScheme({ offer: 'omega3', geo: 'us', audience: 'homens45', creative: 'a' })).toBe('omega3_us_homens45_a');
  });

  it('monta postback com os placeholders do tracker', () => {
    const p = postbackTemplate('https://trk.exemplo.com/', 'clickid');
    expect(p).toBe('https://trk.exemplo.com/postback?clickid={clickid}&payout={payout}&status={status}&currency={currency}');
  });
});

describe('relatório e template', () => {
  const state: AppState = {
    campaigns: [],
    activeCampaignId: null,
    tasks: { 'step-s1': true },
    plan: 'pro',
    workspace: { currency: 'BRL', usdRate: 5.4, ownerEmail: 'teste@exemplo.com' },
    referralCode: 'ABC123',
  };

  it('gera relatório com as seções obrigatórias do Passo 16', () => {
    const c = makeCampaign({
      snapshots: [{ at: new Date().toISOString(), label: 'Dia 1', impressions: 5000, clicks: 120, conversions: 4, spend: 150, revenue: 200 }],
      compliance: { geos: ['BR'], checkedRuleIds: ['lgpd-basis'], disclosureText: 'texto' },
    });
    const md = campaignReport(c, state);
    for (const section of ['## 1.', '## 2.', '## 3.', '## 4.', '## 5.', '## 6.', '## 7.', '## 9.']) {
      expect(md).toContain(section);
    }
    expect(md).toMatch(/VEREDITO|Veredito/);
    expect(md).toContain('Aprendizado');
  });

  it('menciona conversão de empate e cliques por venda', () => {
    const md = campaignReport(makeCampaign(), state);
    expect(md).toContain('Conversão de empate');
    expect(md).toContain('Cliques por venda no empate');
  });

  it('o template cobre os cinco blocos do plano de 14 dias', () => {
    const t = templateMarkdown();
    expect(t).toContain('Dias 1–3');
    expect(t).toContain('Dias 4–6');
    expect(t).toContain('Dias 7–9');
    expect(t).toContain('Dias 10–12');
    expect(t).toContain('Dias 13–14');
    expect(t).toContain('CTR');
  });
});

describe('aggregate', () => {
  it('soma snapshots e devolve zeros quando vazio', () => {
    expect(aggregate([])).toEqual({ impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 });
    const total = aggregate([
      { impressions: 100, clicks: 10, conversions: 1, spend: 5, revenue: 20 },
      { impressions: 200, clicks: 20, conversions: 2, spend: 10, revenue: 40 },
    ]);
    expect(total).toEqual({ impressions: 300, clicks: 30, conversions: 3, spend: 15, revenue: 60 });
  });
});

describe('plano de 14 dias', () => {
  it('tem 19 passos numerados sem lacuna', () => {
    expect(STEPS).toHaveLength(19);
    expect(STEPS.map((s) => s.n)).toEqual(Array.from({ length: 19 }, (_, i) => i + 1));
  });

  it('todo passo aponta para um módulo existente', () => {
    const modulos = ['demand', 'audit', 'angle', 'tracking', 'decide', 'scale', 'test72', 'export'];
    for (const s of STEPS) expect(modulos).toContain(s.moduleId);
  });

  it('todo passo pertence a um bloco de dias do roadmap', () => {
    for (const s of STEPS) {
      expect(s.day[0]).toBeLessThanOrEqual(14);
      expect(s.day[1]).toBeGreaterThanOrEqual(s.day[0]);
    }
  });

  it('o checklist final tem os oito itens do manual', () => {
    expect(FINAL_CHECKLIST).toHaveLength(8);
    expect(FINAL_CHECKLIST.map((c) => c.label)).toContain('Compliance verificado');
  });
});

describe('catálogo de stack', () => {
  it('todo repositório cita licença, estrelas e passo do método', () => {
    for (const t of OSS_TOOLS) {
      expect(t.stars).toBeGreaterThan(0);
      expect(t.license.length).toBeGreaterThan(2);
      expect(t.step).toMatch(/Passo \d+/);
      expect(t.url.startsWith('https://github.com/')).toBe(true);
    }
  });

  it('todo ativo do Hugging Face aponta para o HF com tipo válido', () => {
    for (const a of HF_ASSETS) {
      expect(a.url.startsWith('https://huggingface.co/')).toBe(true);
      expect(['model', 'dataset']).toContain(a.kind);
    }
  });

  it('marca os projetos sem manutenção recente com ressalva', () => {
    const parados = OSS_TOOLS.filter((t) => t.lastPush < '2024-01-01');
    expect(parados.length).toBeGreaterThan(0);
    for (const t of parados) expect(t.caution.length).toBeGreaterThan(20);
  });
});
