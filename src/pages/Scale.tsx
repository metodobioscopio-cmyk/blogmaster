import { useState } from 'react';
import { Badge, Callout, Card, Check, Num, Source, Stat } from '../components/ui';
import { offerMath } from '../lib/breakEven';
import { actualMetrics } from '../lib/decision';
import { doublingsFor, scaleRisk, simulateScale } from '../lib/scaleLadder';
import { aggregate } from '../lib/report';
import { money, num, pct } from '../lib/format';
import { useActiveCampaign, useStore } from '../state/store';

export default function Scale() {
  const { state, dispatch } = useStore();
  const c = useActiveCampaign();
  const [step, setStep] = useState(20);
  const [drift, setDrift] = useState(0);
  const [days, setDays] = useState(10);
  if (!c) return null;
  const cur = state.workspace.currency;

  const agg = aggregate(c.snapshots);
  const m = actualMetrics(agg);
  const math = offerMath(c.offer, c.traffic);
  const scale = c.scale ?? { baseBudget: c.traffic.dailyBudget, guardCpa: c.cutMetrics.maxCpa, days };
  const setScale = (patch: Partial<typeof scale>) => dispatch({ type: 'campaign/scale', id: c.id, scale: { ...scale, ...patch } });

  const observedCpa = Number.isFinite(m.cpa) && m.cpa > 0 ? m.cpa : math.expectedCpa;
  const ladder = simulateScale({
    baseBudget: scale.baseBudget,
    observedCpa,
    guardCpa: scale.guardCpa,
    days,
    commissionNet: math.commissionAfterRefunds,
    step: step / 100,
    cpaDrift: drift / 100,
  });
  const risk = scaleRisk(
    { baseBudget: scale.baseBudget, observedCpa, guardCpa: scale.guardCpa, days, commissionNet: math.commissionAfterRefunds, step: step / 100 },
    drift / 100,
  );
  const doublings = doublingsFor(step / 100);
  const gated = c.decision?.verdict !== 'scale';

  return (
    <>
      <p className="lead">
        Passo 19: aumente 20% ao dia enquanto o CPA segurar. Passo 17: automatize só o que já é repetível. A ordem importa —
        automatizar antes de validar é escalar o prejuízo com eficiência.
      </p>

      {gated && (
        <Callout tone="warn" title="Escala bloqueada pelo método">
          O veredito atual desta campanha é <strong>{(c.decision?.verdict ?? 'nenhum')}</strong>. O VALIDA OS deixa você
          simular — mas a armadilha declarada do Passo 19 é escalar campanha não validada. Rode o teste de 72h primeiro.
        </Callout>
      )}

      <div className="grid g2" style={{ marginTop: 12 }}>
        <Card title="Parâmetros da escala">
          <div className="grid g2" style={{ gap: 8 }}>
            <Num label="Orçamento base/dia" value={scale.baseBudget} onChange={(v) => setScale({ baseBudget: v })} suffix={cur} step={10} />
            <Num label="CPA de guarda" value={scale.guardCpa} onChange={(v) => setScale({ guardCpa: v })} suffix={cur} step={1} hint={`CPA observado: ${money(observedCpa, cur)}`} />
            <Num label="Degrau diário" value={step} onChange={setStep} suffix="%" step={5} hint="o roadmap usa 20%" />
            <Num label="Degradação de CPA/dia" value={drift} onChange={setDrift} suffix="%" step={1} hint="0 = estável; 5 = piora 5% a cada dia" />
            <Num label="Dias simulados" value={days} onChange={setDays} step={1} />
            <div />
          </div>
          <div className="divider" />
          <div className="grid g3" style={{ gap: 8 }}>
            <Stat k="Dias até dobrar" v={doublings.toDouble} note={`a ${step}%/dia`} />
            <Stat k="Dias até 3×" v={doublings.toTriple} />
            <Stat k="Dias até 5×" v={doublings.toFiveX} />
          </div>
          <Callout tone="info" title="Por que não dobrar de uma vez">
            O algoritmo do canal aprende com o volume anterior. Dobrar o orçamento de um dia para o outro reinicia a
            learning phase e você paga duas vezes para descobrir a mesma coisa.
          </Callout>
        </Card>

        <Card title="Risco da escala" hint="O mesmo degrau, com e sem degradação de CPA">
          <div className="grid g2" style={{ gap: 8 }}>
            <Stat k="Lucro acumulado — CPA estável" v={money(risk.profitStable, cur)} tone={risk.profitStable >= 0 ? 'ok' : 'bad'} />
            <Stat
              k={`Lucro acumulado — CPA +${drift}%/dia`}
              v={money(risk.profitDrift, cur)}
              tone={risk.profitDrift >= 0 ? 'ok' : 'bad'}
              note={`diferença de ${money(risk.profitStable - risk.profitDrift, cur)}`}
            />
          </div>
          <div className="divider" />
          <div className="small dim">
            Toda escala degrada um pouco o CPA — você compra alcance mais caro. A pergunta não é "vai degradar?", é "quanto
            degrada antes de a guarda disparar?". Simule 3–5% por dia e veja se o plano ainda fecha.
          </div>
          <div className="divider" />
          <div className="stack">
            <Check
              label="Automatizei a sequência de e-mails (Passo 17)"
              checked={!!state.tasks['a-email']}
              onChange={() => dispatch({ type: 'task/toggle', taskId: 'a-email' })}
              hint="knadh/listmonk — 23.643★, AGPL-3.0"
            />
            <Check
              label="Automatizei o relatório diário de CPA/EPC"
              checked={!!state.tasks['a-report']}
              onChange={() => dispatch({ type: 'task/toggle', taskId: 'a-report' })}
              hint="n8n-io/n8n — 206.430★; kestra-io/kestra — 28.594★, Apache-2.0"
            />
            <Check
              label="Documentei o que funcionou antes de escalar (Passo 16)"
              checked={!!state.tasks['a-doc']}
              onChange={() => dispatch({ type: 'task/toggle', taskId: 'a-doc' })}
            />
            <Check
              label="Regularizei impostos e pagamentos internacionais (Passo 18)"
              checked={!!state.tasks['a-legal']}
              onChange={() => dispatch({ type: 'task/toggle', taskId: 'a-legal' })}
            />
          </div>
        </Card>
      </div>

      <h2>Escada de escala</h2>
      <Card>
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th>Dia</th>
                <th className="right">Orçamento</th>
                <th className="right">CPA projetado</th>
                <th className="right">Conversões</th>
                <th className="right">Receita</th>
                <th className="right">Lucro do dia</th>
                <th className="right">Acumulado</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ladder.map((d) => (
                <tr key={d.day}>
                  <td className="mono">{d.day}</td>
                  <td className="right mono">{money(d.budget, cur)}</td>
                  <td className="right mono">{money(d.cpa, cur)}</td>
                  <td className="right mono">{num(d.conversions, 1)}</td>
                  <td className="right mono">{money(d.revenue, cur)}</td>
                  <td className="right mono" style={{ color: d.profit >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
                    {money(d.profit, cur)}
                  </td>
                  <td className="right mono">{money(d.cumulativeProfit, cur)}</td>
                  <td>
                    {d.status === 'subir' ? (
                      <Badge tone="ok">subir {pct(step, 0)}</Badge>
                    ) : d.status === 'segurar' ? (
                      <Badge tone="warn">segurar</Badge>
                    ) : (
                      <Badge tone="bad">pausar</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divider" />
        <div className="small dim">
          <strong>Regra de execução:</strong> só suba no dia seguinte se o CPA do dia anterior ficou abaixo da guarda. Se a
          guarda disparar, volte ao último degrau válido e refaça o criativo — não insista no orçamento.
        </div>
        <div className="tiny muted" style={{ marginTop: 6 }}>
          Meta: aumentos de no máximo 20% a cada 3–4 dias para não desestabilizar a otimização (Optifox, 2026).
        </div>
        <Source source="Optifox — Meta Ads Best Practices 2026" url="https://optifox.in/blog/meta-ads-best-practices-2026/" />
      </Card>
    </>
  );
}
