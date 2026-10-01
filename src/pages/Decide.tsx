import { useState } from 'react';
import { Badge, Bar, Callout, Card, CopyButton, Num, Source, Stat, Verdict, toast } from '../components/ui';
import { findBenchmark } from '../lib/benchmarks';
import { offerMath } from '../lib/breakEven';
import { planTestBudget } from '../lib/budget';
import { actualMetrics, decide } from '../lib/decision';
import { aggregate } from '../lib/report';
import { ctrPrecision, impressionsForCtrPrecision, minSampleSize, twoProportionZ } from '../lib/sampleSize';
import { money, num, pct } from '../lib/format';
import { useActiveCampaign, useStore } from '../state/store';

export default function Decide() {
  const { state, dispatch } = useStore();
  const c = useActiveCampaign();
  if (!c) return null;
  const cur = state.workspace.currency;
  const rate = state.workspace.usdRate || 1;
  const setCut = (patch: Partial<typeof c.cutMetrics>) => dispatch({ type: 'campaign/cut', id: c.id, patch });

  const bench = findBenchmark(c.offer.channel, c.offer.vertical, c.offer.geoTier);
  const agg = aggregate(c.snapshots);
  const m = actualMetrics(agg);
  const decision = decide(c, agg, bench.geoAdjusted, cur);
  const math = offerMath(c.offer, c.traffic);
  const precision = ctrPrecision(agg.impressions, m.ctr || 0.0001);
  const budget = planTestBudget({
    channel: c.offer.channel,
    cpc: c.traffic.cpc,
    targetCpa: c.cutMetrics.maxCpa || 40,
    dailyBudget: c.traffic.dailyBudget,
  });

  const [form, setForm] = useState({ label: '', impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 });

  const addSnapshot = () => {
    if (form.impressions <= 0 && form.clicks <= 0 && form.spend <= 0) {
      toast('Informe ao menos impressões, cliques ou gasto.');
      return;
    }
    dispatch({
      type: 'campaign/snapshot',
      id: c.id,
      snap: { ...form, at: new Date().toISOString(), label: form.label || `Registro ${c.snapshots.length + 1}` },
    });
    setForm({ label: '', impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 });
    toast('Registro lançado. Veredito recalculado.');
  };

  const benchClicks = bench.geoAdjusted ? Math.round((bench.geoAdjusted.ctr / 100) * agg.impressions) : 0;
  const ztest = bench.geoAdjusted && agg.impressions > 0 ? twoProportionZ(agg.clicks, agg.impressions, benchClicks, agg.impressions) : null;
  const minN = bench.geoAdjusted ? minSampleSize(bench.geoAdjusted.ctr / 100, (bench.geoAdjusted.ctr / 100) * 0.3) : Infinity;

  return (
    <>
      <p className="lead">
        Passo 15 com a disciplina que falta na maioria: a régua é definida <strong>antes</strong> de rodar, e nenhuma
        campanha morre por ruído. Se a amostra não sustenta a leitura, o veredito é "colete mais dado".
      </p>

      <Card title="Régua de corte" hint="Definida antes do primeiro clique — depois disso, mudar é racionalização">
        <div className="grid g4">
          <Num label="CTR mínimo" value={c.cutMetrics.minCtr} onChange={(v) => setCut({ minCtr: v })} suffix="%" step={0.1} hint={bench.geoAdjusted ? `benchmark: ${pct(bench.geoAdjusted.ctr)}` : undefined} />
          <Num label="CPA máximo" value={c.cutMetrics.maxCpa} onChange={(v) => setCut({ maxCpa: v })} suffix={cur} step={1} hint={bench.geoAdjusted ? `benchmark: ${money(bench.geoAdjusted.cpa * rate, cur)}` : undefined} />
          <Num label="EPC mínimo" value={c.cutMetrics.minEpc} onChange={(v) => setCut({ minEpc: v })} suffix={cur} step={0.05} hint={`piso absoluto: ${money(math.breakEvenEpc, cur)} (= CPC)`} />
          <Num label="Impressões mínimas" value={c.cutMetrics.minImpressions} onChange={(v) => setCut({ minImpressions: v })} step={500} hint="por criativo" />
        </div>
        <div className="divider" />
        <div className="row">
          <button
            className="btn btn--sm"
            type="button"
            onClick={() => {
              setCut({
                minCtr: Number((bench.geoAdjusted?.ctr ?? 1).toFixed(2)),
                maxCpa: Number(((bench.geoAdjusted?.cpa ?? 40) * rate).toFixed(2)),
                minEpc: Number(math.breakEvenEpc.toFixed(2)),
                minImpressions: 1000,
              });
              toast('Régua calibrada pelo benchmark + EPC de empate.');
            }}
          >
            Calibrar pelo benchmark
          </button>
          <button
            className="btn btn--sm"
            type="button"
            onClick={() => {
              setCut({ minCtr: 1, maxCpa: Number((math.expectedCpa * 1.2).toFixed(2)), minEpc: Number(math.breakEvenEpc.toFixed(2)), minImpressions: 1000 });
              toast('Régua padrão do roadmap aplicada (CTR 1% / 1.000 impressões).');
            }}
          >
            Usar padrão do roadmap
          </button>
          <span className="small dim">
            Amostra mínima para detectar ±30% de diferença no CTR do benchmark: <strong>{Number.isFinite(minN) ? num(minN, 0) : '—'}</strong> impressões por grupo.
          </span>
        </div>
      </Card>

      <div className="grid g2" style={{ marginTop: 12 }}>
        <Card title="Veredito" hint="Recalculado a cada registro">
          <div className="row" style={{ marginBottom: 10 }}>
            <Verdict v={decision.verdict} />
            <span className="small dim">
              confiança {pct(decision.confidence * 100, 0)} ·{' '}
              {decision.sampleSufficient ? 'amostra suficiente' : 'amostra insuficiente'}
            </span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <Bar value={decision.confidence * 100} tone={decision.confidence < 0.5 ? 'warn' : undefined} />
          </div>
          <ul className="small dim" style={{ margin: '0 0 10px', paddingLeft: 18, display: 'grid', gap: 5 }}>
            {decision.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <Callout tone={decision.verdict === 'scale' ? 'ok' : decision.verdict === 'kill' ? 'bad' : decision.verdict === 'iterate' ? 'warn' : 'info'}>
            <strong>Próxima ação:</strong> {decision.nextAction}
          </Callout>
          <div className="divider" />
          <table>
            <thead>
              <tr>
                <th>Métrica</th>
                <th className="right">Medido</th>
                <th className="right">Corte</th>
                <th className="right">Benchmark</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {decision.reads.map((r) => (
                <tr key={r.label}>
                  <td>
                    <strong>{r.label}</strong>
                    <div className="tiny muted">{r.detail}</div>
                  </td>
                  <td className="right mono">{Number.isFinite(r.actual) ? num(r.actual, 3) : '—'}{r.unit === '%' ? '%' : ''}</td>
                  <td className="right mono">{num(r.threshold, 2)}{r.unit === '%' ? '%' : ''}</td>
                  <td className="right mono">{num(r.benchmark, 2)}{r.unit === '%' ? '%' : ''}</td>
                  <td>
                    {r.passed === null ? <Badge tone="ghost">sem leitura</Badge> : r.passed ? <Badge tone="ok">ok</Badge> : <Badge tone="bad">falhou</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn btn--sm" type="button" onClick={() => dispatch({ type: 'campaign/decision', id: c.id, decision })}>
              Salvar decisão na campanha
            </button>
            {decision.verdict === 'scale' && (
              <a className="btn btn--sm btn--primary" href="#/scale">
                Ir para ampliação →
              </a>
            )}
          </div>
        </Card>

        <Card title="Leitura estatística" hint="O que o número medido realmente significa">
          <div className="grid g2" style={{ gap: 8 }}>
            <Stat k="CTR medido" v={pct(m.ctr)} note={`${precision.clicks} cliques em ${num(agg.impressions, 0)} impressões`} />
            <Stat k="IC95 do CTR" v={`${pct(precision.ciLow)} – ${pct(precision.ciHigh)}`} tone={precision.decidable ? 'ok' : 'warn'} note={precision.decidable ? 'legível' : 'menos de 100 cliques'} />
            <Stat k="CPC médio" v={money(m.cpc, cur)} note={`planejado ${money(c.traffic.cpc, cur)}`} />
            <Stat k="ROAS" v={num(m.roas, 2)} note={`receita ${money(agg.revenue, cur)} / gasto ${money(agg.spend, cur)}`} tone={m.roas >= 1 ? 'ok' : 'bad'} />
          </div>
          <div className="divider" />
          <div className="small dim">
            <strong>Teste contra o benchmark:</strong>{' '}
            {ztest
              ? `z = ${num(ztest.z, 2)}, p = ${num(ztest.pValue, 4)}. ${ztest.pValue < 0.05 ? 'Diferença estatisticamente distinguível do benchmark.' : 'Não há diferença distinguível do benchmark nesta amostra.'}`
              : 'sem benchmark ou sem impressões.'}
          </div>
          <div className="small dim" style={{ marginTop: 6 }}>
            <strong>Impressões para ler o CTR com ±20% de precisão relativa:</strong>{' '}
            {num(impressionsForCtrPrecision(c.cutMetrics.minCtr), 0)}.
          </div>
          {bench.geoAdjusted && <Source source={`${bench.geoAdjusted.source} (${bench.geoAdjusted.year})`} url={bench.geoAdjusted.sourceUrl} />}
          <div className="divider" />
          <Callout tone="info" title="Por que isto importa">
            Com 1.000 impressões a 1% de CTR você tem ~10 cliques. O IC95 vai de 0,5% a 1,8%: a régua "CTR &lt; 1% = pause"
            simplesmente não é decidível nessa amostra. Cortar aí é pagar para aprender ruído.
          </Callout>
        </Card>
      </div>

      <h2>Lançar dados</h2>
      <div className="grid g2">
        <Card title="Novo registro" hint="Um por dia, ou por turno se a campanha for grande">
          <input
            style={{ marginBottom: 8 }}
            placeholder="Rótulo (ex.: Dia 1 · criativo A · US)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <div className="grid g3" style={{ gap: 8 }}>
            <Num label="Impressões" value={form.impressions} onChange={(v) => setForm({ ...form, impressions: v })} step={100} />
            <Num label="Cliques" value={form.clicks} onChange={(v) => setForm({ ...form, clicks: v })} step={10} />
            <Num label="Conversões" value={form.conversions} onChange={(v) => setForm({ ...form, conversions: v })} step={1} />
          </div>
          <div className="grid g3" style={{ gap: 8, marginTop: 8 }}>
            <Num label={`Gasto (${cur})`} value={form.spend} onChange={(v) => setForm({ ...form, spend: v })} step={5} />
            <Num label={`Receita (${cur})`} value={form.revenue} onChange={(v) => setForm({ ...form, revenue: v })} step={5} />
            <div />
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn btn--primary" type="button" onClick={addSnapshot}>
              Lançar registro
            </button>
            <span className="tiny muted">Fica salvo neste navegador.</span>
          </div>
        </Card>

        <Card title="Histórico" hint={`${c.snapshots.length} registro(s)`}>
          {c.snapshots.length === 0 ? (
            <Callout tone="warn">Nenhum dado ainda. Rode as 72 horas e lance um registro por dia.</Callout>
          ) : (
            <>
              <div className="scroll-x">
                <table>
                  <thead>
                    <tr>
                      <th>Rótulo</th>
                      <th className="right">Imp.</th>
                      <th className="right">Cliques</th>
                      <th className="right">Conv.</th>
                      <th className="right">Gasto</th>
                      <th className="right">Receita</th>
                      <th className="right">CTR</th>
                      <th className="right">CPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.snapshots.map((s, i) => {
                      const sm = actualMetrics(s);
                      return (
                        <tr key={i}>
                          <td>{s.label}</td>
                          <td className="right mono">{num(s.impressions, 0)}</td>
                          <td className="right mono">{num(s.clicks, 0)}</td>
                          <td className="right mono">{num(s.conversions, 0)}</td>
                          <td className="right mono">{money(s.spend, cur)}</td>
                          <td className="right mono">{money(s.revenue, cur)}</td>
                          <td className="right mono">{pct(sm.ctr)}</td>
                          <td className="right mono">{money(sm.cpa, cur)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <Stat k="Total gasto" v={money(agg.spend, cur)} />
                <Stat k="Total receita" v={money(agg.revenue, cur)} />
                <Stat k="Lucro" v={money(agg.revenue - agg.spend, cur)} tone={agg.revenue - agg.spend >= 0 ? 'ok' : 'bad'} />
              </div>
              <div className="row" style={{ marginTop: 8 }}>
                <CopyButton
                  text={c.snapshots.map((s) => `${s.label}\t${s.impressions}\t${s.clicks}\t${s.conversions}\t${s.spend}\t${s.revenue}`).join('\n')}
                  label="Copiar como TSV"
                />
              </div>
            </>
          )}
        </Card>
      </div>

      <h2>Orçamento do teste</h2>
      <Card title="Passo 13 — o maior dos três pisos vence" hint="Teste é custo de aprendizado, não aposta">
        <div className="grid g4">
          <Stat k="Piso da plataforma" v={money(budget.technicalFloor, cur)} note={`${budget.technicalFloor}/dia`} />
          <Stat k="Learning phase" v={money(budget.learningFloor, cur)} note="targetCPA × 50 eventos ÷ 7 dias" />
          <Stat k="Estatístico" v={money(budget.statisticalFloor, cur)} note="100 cliques ÷ 3 dias" />
          <Stat k="Recomendado" v={money(budget.daily, cur)} note={`total 72h ${money(budget.total72h, cur)}`} tone="ok" />
        </div>
        <ul className="small dim" style={{ marginTop: 10, paddingLeft: 18, display: 'grid', gap: 5 }}>
          {budget.rationale.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <Source source={budget.source} url={budget.sourceUrl} />
      </Card>
    </>
  );
}
