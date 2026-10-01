import { CHANNEL_LABEL, VERTICAL_LABEL, findBenchmark } from './benchmarks';
import { offerMath } from './breakEven';
import { buildComplianceReport } from './compliance';
import { actualMetrics, decide } from './decision';
import { NETWORKS } from './networks';
import { scoreCampaign } from './offerScore';
import { STEPS } from './steps';
import type { AppState, Campaign, TestSnapshot } from './types';
import { money, num, pct } from './format';

/**
 * Gera o relatório "Campanha Validada em 14 Dias" — o artefato do Passo 16.
 * Sair em Markdown de propósito: cola em Notion, vira PDF, entra no Git.
 */
export function campaignReport(campaign: Campaign, state: AppState): string {
  const cur = state.workspace.currency;
  const math = offerMath(campaign.offer, campaign.traffic);
  const score = scoreCampaign(campaign);
  const compliance = buildComplianceReport(campaign);
  const bench = findBenchmark(campaign.offer.channel, campaign.offer.vertical, campaign.offer.geoTier);
  const last = campaign.snapshots[campaign.snapshots.length - 1];
  const agg = aggregate(campaign.snapshots);
  const decision = last ? decide(campaign, agg, bench.geoAdjusted, cur) : null;
  const net = NETWORKS[campaign.offer.network];

  const done = STEPS.filter((s) => state.tasks[`step-${s.id}`]).map((s) => s.n);

  const L: string[] = [];
  L.push(`# Campanha Validada em 14 Dias — ${campaign.name}`);
  L.push('');
  L.push(`Gerado pelo VALIDA OS em ${new Date().toISOString().slice(0, 10)} · Score V.A.L.I.D.A.: **${score.total}/100**`);
  L.push('');
  L.push('## 1. Oferta (Passo 5 — comissão mínima viável)');
  L.push('');
  L.push('| Item | Valor |');
  L.push('| --- | --- |');
  L.push(`| Oferta | ${campaign.offer.name} |`);
  L.push(`| Rede | ${net.label} (${campaign.offer.network}) |`);
  L.push(`| Preço no país-alvo | ${money(campaign.offer.price, cur)} |`);
  L.push(
    `| Comissão | ${campaign.offer.commissionMode === 'percent' ? `${campaign.offer.commissionValue}%` : money(campaign.offer.commissionValue, cur)} |`,
  );
  L.push(`| Comissão bruta | ${money(math.grossCommission, cur)} |`);
  L.push(`| Taxa da rede | ${money(math.networkFee, cur)} |`);
  L.push(`| Comissão líquida (após estorno de ${campaign.offer.refundRate}%) | ${money(math.commissionAfterRefunds, cur)} |`);
  L.push(`| Vertical / Geo | ${VERTICAL_LABEL[campaign.offer.vertical]} / ${campaign.offer.geoTier} |`);
  L.push(`| Canal | ${CHANNEL_LABEL[campaign.offer.channel]} |`);
  L.push('');
  L.push('## 2. Matemática de corte');
  L.push('');
  L.push('| Métrica | Valor |');
  L.push('| --- | --- |');
  L.push(`| Conversão de empate | ${pct(math.breakEvenCr, 3)} |`);
  L.push(`| CPC máximo no empate | ${money(math.breakEvenCpc, cur)} |`);
  L.push(`| EPC de empate | ${money(math.breakEvenEpc, cur)} |`);
  L.push(`| Cliques por venda no empate | ${num(math.clicksToBreakEvenPerSale, 1)} |`);
  L.push(`| CPC planejado | ${money(campaign.traffic.cpc, cur)} |`);
  L.push(`| EPC esperado | ${money(math.expectedEpc, cur)} |`);
  L.push(`| CPA esperado | ${money(math.expectedCpa, cur)} |`);
  L.push(`| Margem por clique | ${money(math.marginPerClick, cur)} |`);
  L.push(`| Veredito da oferta | **${math.verdict.toUpperCase()}** |`);
  L.push('');
  if (bench.geoAdjusted) {
    L.push('### Benchmark de referência');
    L.push('');
    L.push(
      `Fonte: ${bench.geoAdjusted.source} (${bench.geoAdjusted.year})${bench.geoAdjusted.derived ? ` — ajustado para ${campaign.offer.geoTier} com multiplicador próprio` : ''}.`,
    );
    L.push('');
    L.push('| Métrica | Benchmark | Sua régua de corte |');
    L.push('| --- | --- | --- |');
    L.push(`| CTR | ${pct(bench.geoAdjusted.ctr)} | ${pct(campaign.cutMetrics.minCtr)} |`);
    L.push(`| CPC | ${money(bench.geoAdjusted.cpc, 'USD')} | ${money(campaign.traffic.cpc, cur)} |`);
    L.push(`| CPA | ${money(bench.geoAdjusted.cpa, 'USD')} | ${money(campaign.cutMetrics.maxCpa, cur)} |`);
    L.push('');
  }
  L.push('## 3. Ângulo (Passo 7)');
  L.push('');
  L.push(`- **Ângulo central:** ${campaign.angle.statement || '—'}`);
  L.push(`- **Promessa:** ${campaign.angle.promise || '—'}`);
  L.push(`- **Público:** ${campaign.angle.audience || '—'}`);
  L.push(`- **Prova:** ${campaign.angle.proof || '—'}`);
  L.push(`- **Por que este canal:** ${campaign.angle.channelRationale || '—'}`);
  L.push('');
  L.push('## 4. Rastreamento (Passo 9)');
  L.push('');
  L.push(`- Landing: ${campaign.tracking.landingUrl || '—'}`);
  L.push(`- Esquema de sub-ID: ${campaign.tracking.subIdScheme || '—'}`);
  L.push(`- Postback: ${campaign.tracking.postbackUrl || '—'}`);
  L.push(`- Pixel instalado: ${campaign.tracking.pixelInstalled ? 'sim' : 'não'}`);
  L.push(`- Postback da rede configurado: ${campaign.tracking.networkPostbackConfigured ? 'sim' : 'não'}`);
  L.push(`- Clique de teste validado (S2S): ${campaign.tracking.s2sTested ? 'sim' : 'não'}`);
  L.push('');
  L.push('## 5. Compliance (Passo 6)');
  L.push('');
  L.push(`Cobertura do checklist: **${compliance.coverage}%** (${compliance.checked.length}/${compliance.applicable.length} regras).`);
  if (compliance.criticalMissing.length) {
    L.push('');
    L.push('**Pendências críticas:**');
    for (const r of compliance.criticalMissing) L.push(`- ${r.title} — ${r.authority}`);
  }
  L.push('');
  L.push(`> Disclosure em uso: ${compliance.disclosure}`);
  L.push('');
  L.push('## 6. Teste de 72 horas (Passos 13–15)');
  L.push('');
  if (last) {
    const m = actualMetrics(agg);
    L.push('| Métrica | Medido | Corte | Status |');
    L.push('| --- | --- | --- | --- |');
    for (const r of decision!.reads) {
      const status = r.passed === null ? '—' : r.passed ? 'ok' : 'falhou';
      L.push(
        `| ${r.label} | ${Number.isFinite(r.actual) ? num(r.actual, 3) : '—'}${r.unit === '%' ? '%' : ''} | ${num(r.threshold, 2)}${r.unit === '%' ? '%' : ''} | ${status} |`,
      );
    }
    L.push('');
    L.push(`- Impressões: ${num(agg.impressions, 0)} · Cliques: ${num(agg.clicks, 0)} · Conversões: ${num(agg.conversions, 0)}`);
    L.push(`- Gasto: ${money(agg.spend, cur)} · Receita: ${money(agg.revenue, cur)}`);
    L.push(`- CPC médio: ${money(m.cpc, cur)} · CTR: ${pct(m.ctr)} · CVR: ${pct(m.cvr)} · CPA: ${money(m.cpa, cur)} · EPC: ${money(m.epc, cur)}`);
    L.push('');
    L.push(`### Veredito: **${decision!.verdict.toUpperCase()}** (confiança ${pct(decision!.confidence * 100, 0)})`);
    L.push('');
    for (const r of decision!.reasons) L.push(`- ${r}`);
    L.push('');
    L.push(`**Próxima ação:** ${decision!.nextAction}`);
  } else {
    L.push('_Nenhum dado de teste lançado._');
  }
  L.push('');
  L.push('## 7. Decisão de escala (Passo 19)');
  L.push('');
  if (campaign.scale) {
    L.push(
      `- Orçamento base: ${money(campaign.scale.baseBudget, cur)}/dia · CPA de guarda: ${money(campaign.scale.guardCpa, cur)} · degraus de 20% ao dia.`,
    );
  } else {
    L.push('- Escala não configurada.');
  }
  L.push('');
  L.push('## 8. Progresso do plano de 14 dias');
  L.push('');
  L.push(`Passos concluídos: ${done.length}/${STEPS.length}${done.length ? ` (${done.join(', ')})` : ''}`);
  L.push('');
  L.push('## 9. Aprendizado (o que fica depois que a campanha morre)');
  L.push('');
  L.push('- Ângulo testado:');
  L.push('- Criativo que performou:');
  L.push('- Público/país com melhor EPC:');
  L.push('- O que eu faria diferente no próximo teste:');
  L.push('');
  L.push('---');
  L.push('');
  L.push(
    '_Relatório gerado pelo VALIDA OS. Benchmarks citados com fonte; números de campanha são seus. Isto não é aconselhamento jurídico ou financeiro._',
  );
  return L.join('\n');
}

export function aggregate(snaps: Array<TestSnapshot>): TestSnapshot {
  return snaps.reduce(
    (acc, s) => ({
      impressions: acc.impressions + s.impressions,
      clicks: acc.clicks + s.clicks,
      conversions: acc.conversions + s.conversions,
      spend: acc.spend + s.spend,
      revenue: acc.revenue + s.revenue,
    }),
    { impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 },
  );
}

/** O lead magnet: template em branco, entregue em troca do e-mail. */
export function templateMarkdown(): string {
  return `# Campanha Validada em 14 Dias — template

> Regra: teste é custo de aprendizado, não aposta. Defina o teto de perda antes do primeiro clique.

## Bloco 1 — Dias 1–3 · Mapear
- [ ] Rede escolhida: ____________________
- [ ] Vertical: ____________________
- [ ] Canal principal (UM): Google / Meta / TikTok / Microsoft
- [ ] País-alvo: ____________________

## Bloco 2 — Dias 4–6 · Filtrar a oferta
- [ ] Demanda real verificada (fonte: ____________)
- [ ] Preço no país-alvo: __________
- [ ] Comissão bruta: __________  Taxa da rede: __________  Estorno: ____%
- [ ] Comissão líquida: __________
- [ ] CPC estimado: __________
- [ ] Conversão de empate = CPC / comissão líquida = ____%
- [ ] CR que eu consigo provar: ____%  →  ( ) passa  ( ) não passa
- [ ] Compliance: FTC / GDPR / LGPD / termos da rede revisados

## Bloco 3 — Dias 7–9 · Funil e rastreamento
- [ ] Ângulo central (uma frase): ____________________
- [ ] Promessa mensurável: ____________________
- [ ] Prova: ____________________
- [ ] Landing própria (não a da rede): ____________________
- [ ] Sequência: isca → e-mail → oferta
- [ ] UTM + sub-ID por criativo|público|país
- [ ] Pixel instalado e evento de conversão testado
- [ ] Postback da rede testado de ponta a ponta
- [ ] 3 variações de criativo do MESMO ângulo

## Bloco 4 — Dias 10–12 · Teste de 72h
- [ ] Teto de perda aceitável: __________
- [ ] Orçamento diário = máx(piso da plataforma, learning phase, piso estatístico) = __________
- [ ] Régua de corte: CTR ≥ ____%  ·  CPA ≤ ______  ·  EPC ≥ ______
- [ ] Amostra mínima: 1.000 impressões E 100 cliques por criativo
- [ ] Rodou 72h sem alteração?  ( ) sim  ( ) não — e por quê

## Bloco 5 — Dias 13–14 · Cortar e decidir
- [ ] Veredito: SCALE / ITERATE / KILL
- [ ] Motivo (métrica, não opinião): ____________________
- [ ] Se SCALE: orçamento base ______ · CPA de guarda ______ · +20%/dia
- [ ] Se ITERATE: qual ÚNICO eixo muda (criativo OU página OU oferta)
- [ ] Documentado: ângulo, criativo, público, país, métricas

## O que fica (mesmo se a campanha morrer)
- Ângulo testado:
- Criativo que performou:
- Melhor EPC por país:
- O que eu mudaria no próximo teste:
`;
}
