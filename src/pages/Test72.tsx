import { useEffect, useState } from 'react';
import { Badge, Bar, Callout, Card, Check, Num, Stat, Verdict, toast } from '../components/ui';
import { findBenchmark } from '../lib/benchmarks';
import { planTestBudget } from '../lib/budget';
import { decide } from '../lib/decision';
import { aggregate } from '../lib/report';
import { hoursSince, money, num, pct } from '../lib/format';
import { useActiveCampaign, useStore } from '../state/store';

const DONT = [
  { id: 't72-nopause', label: 'Não pausei nada na primeira hora de dado ruim' },
  { id: 't72-nobudget', label: 'Não mexi no orçamento durante as 72 horas' },
  { id: 't72-notarget', label: 'Não mudei público nem geografia no meio do teste' },
  { id: 't72-nocreative', label: 'Não troquei criativo no meio do teste' },
  { id: 't72-nobid', label: 'Não ajustei lance manualmente (deixei o algoritmo trabalhar)' },
];

export default function Test72() {
  const { state, dispatch } = useStore();
  const c = useActiveCampaign();
  const [, force] = useState(0);
  useEffect(() => {
    const i = setInterval(() => force((n) => n + 1), 30000);
    return () => clearInterval(i);
  }, []);
  const [form, setForm] = useState({ label: '', impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 });
  if (!c) return null;
  const cur = state.workspace.currency;

  const elapsed = hoursSince(c.testStartedAt);
  const pctDone = Math.max(0, Math.min(100, (elapsed / 72) * 100));
  const done = elapsed >= 72;
  const agg = aggregate(c.snapshots);
  const bench = findBenchmark(c.offer.channel, c.offer.vertical, c.offer.geoTier);
  const decision = decide(c, agg, bench.geoAdjusted, cur);
  const budget = planTestBudget({ channel: c.offer.channel, cpc: c.traffic.cpc, targetCpa: c.cutMetrics.maxCpa, dailyBudget: c.traffic.dailyBudget });
  const burned = agg.spend;
  const burnPace = elapsed > 0 ? (burned / elapsed) * 72 : 0;

  const start = () => {
    if (!c.tracking.pixelInstalled || !c.tracking.s2sTested) {
      toast('Antes de gastar: pixel instalado e postback testado. Sem isso as 72 horas não produzem decisão.');
      return;
    }
    dispatch({ type: 'campaign/startTest', id: c.id });
    toast('Cronômetro de 72h iniciado. Agora a regra é não mexer.');
  };

  return (
    <>
      <p className="lead">
        Três dias, um orçamento que você aceita perder e métricas definidas antes. O teste de 72 horas não serve para
        ganhar dinheiro — serve para comprar uma decisão barata.
      </p>

      <div className="grid g2">
        <Card title="Cronômetro" hint="Passo 14 — rode sem mexer">
          {c.testStartedAt ? (
            <>
              <div className="row" style={{ marginBottom: 8 }}>
                <span className="stat__v mono" style={{ fontSize: 30 }}>
                  {elapsed.toFixed(1)}h
                </span>
                <Badge tone={done ? 'ok' : 'info'}>{done ? '72h completas' : 'em curso'}</Badge>
              </div>
              <Bar value={pctDone} />
              <div className="tiny muted" style={{ marginTop: 6 }}>
                Início: {new Date(c.testStartedAt).toLocaleString('pt-BR')} · término previsto:{' '}
                {new Date(new Date(c.testStartedAt).getTime() + 72 * 3600000).toLocaleString('pt-BR')}
              </div>
            </>
          ) : (
            <Callout tone="info" title="Teste não iniciado">
              Confira instrumentação, régua de corte e orçamento antes de abrir o cronômetro.
            </Callout>
          )}
          <div className="row" style={{ marginTop: 12 }}>
            {c.testStartedAt ? (
              <button
                className="btn btn--sm"
                type="button"
                onClick={() => dispatch({ type: 'campaign/patch', id: c.id, patch: { testStartedAt: undefined, status: 'rascunho' } })}
              >
                Reiniciar teste
              </button>
            ) : (
              <button className="btn btn--primary" type="button" onClick={start}>
                Iniciar teste de 72h
              </button>
            )}
          </div>
        </Card>

        <Card title="Disciplina do teste" hint="O que você prometeu não fazer">
          <div className="stack">
            {DONT.map((d) => (
              <Check key={d.id} label={d.label} checked={!!state.tasks[d.id]} onChange={() => dispatch({ type: 'task/toggle', taskId: d.id })} />
            ))}
          </div>
          <div className="divider" />
          <div className="small dim">
            Cada alteração no meio do teste reinicia o aprendizado do algoritmo e invalida a comparação entre criativos. Se
            precisar mudar, mude <em>depois</em> — e trate como teste novo.
          </div>
        </Card>
      </div>

      <h2>Painel do teste</h2>
      <div className="grid g4">
        <Stat k="Gasto até agora" v={money(burned, cur)} note={`${pct(pctDone, 0)} das 72h`} />
        <Stat
          k="Projeção de gasto em 72h"
          v={money(burnPace, cur)}
          note={`orçamento planejado ${money(budget.total72h, cur)}`}
          tone={burnPace <= budget.total72h * 1.15 ? 'ok' : 'warn'}
        />
        <Stat k="Impressões / cliques" v={`${num(agg.impressions, 0)} / ${num(agg.clicks, 0)}`} note={`mínimo ${num(c.cutMetrics.minImpressions, 0)} imp. e 100 cliques`} />
        <Stat k="Veredito parcial" v={<Verdict v={decision.verdict} />} note={`confiança ${pct(decision.confidence * 100, 0)}`} />
      </div>

      <div className="grid g2" style={{ marginTop: 12 }}>
        <Card title="Registrar o dia" hint="Um lançamento por dia mantém a leitura limpa">
          <input
            style={{ marginBottom: 8 }}
            placeholder="Rótulo (ex.: Dia 2 · criativo B)"
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
            <button
              className="btn btn--primary"
              type="button"
              onClick={() => {
                if (form.impressions + form.clicks + form.spend <= 0) {
                  toast('Nada para registrar.');
                  return;
                }
                dispatch({
                  type: 'campaign/snapshot',
                  id: c.id,
                  snap: { ...form, at: new Date().toISOString(), label: form.label || `Dia ${c.snapshots.length + 1}` },
                });
                setForm({ label: '', impressions: 0, clicks: 0, conversions: 0, spend: 0, revenue: 0 });
                toast('Dia registrado.');
              }}
            >
              Lançar dia
            </button>
            <span className="tiny muted">{c.snapshots.length} registro(s)</span>
          </div>
        </Card>

        <Card title="O que fazer agora" hint="Decisão do motor, não opinião">
          <ul className="small dim" style={{ margin: '0 0 10px', paddingLeft: 18, display: 'grid', gap: 5 }}>
            {decision.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <Callout tone={decision.verdict === 'scale' ? 'ok' : decision.verdict === 'kill' ? 'bad' : 'warn'}>
            {decision.nextAction}
          </Callout>
          {done && decision.verdict === 'indefinido' && (
            <Callout tone="warn" title="72h completas e amostra insuficiente">
              Isso é resposta, não fracasso: o orçamento não comprou dado suficiente. Ou o CPC está acima do planejado, ou
              o criativo não entrega impressão. Ajuste o orçamento pelo piso estatístico e rode de novo — sem mexer em mais nada.
            </Callout>
          )}
          <div className="divider" />
          <div className="small dim">
            <strong>Armazenamento:</strong> os dados ficam neste navegador. Para consolidar várias campanhas em planilha,
            use o botão "Copiar como TSV" em <a href="#/decide">Decisão por métrica</a> ou exporte o relatório em{' '}
            <a href="#/export">Relatório</a>.
          </div>
        </Card>
      </div>
    </>
  );
}
