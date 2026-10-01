import type { RouteId } from '../components/Sidebar';
import { CHANNEL_LABEL, findBenchmark } from '../lib/benchmarks';
import { offerMath } from '../lib/breakEven';
import { aggregate } from '../lib/report';
import { scoreCampaign } from '../lib/offerScore';
import { money, num, pct } from '../lib/format';
import { STEPS } from '../lib/steps';
import { useActiveCampaign, useStore } from '../state/store';
import { Badge, Bar, Callout, Card, Stat, Verdict } from '../components/ui';

const LETTER_ROUTE: Record<number, RouteId> = {
  0: 'demand',
  1: 'audit',
  2: 'angle',
  3: 'tracking',
  4: 'decide',
  5: 'scale',
};

export default function Dashboard({ go }: { go: (r: RouteId) => void }) {
  const { state } = useStore();
  const campaign = useActiveCampaign();
  const cur = state.workspace.currency;

  if (!campaign) {
    return (
      <Card title="Nenhuma campanha">
        <p className="dim">Crie uma campanha na barra lateral para começar.</p>
      </Card>
    );
  }

  const score = scoreCampaign(campaign);
  const math = offerMath(campaign.offer, campaign.traffic);
  const bench = findBenchmark(campaign.offer.channel, campaign.offer.vertical, campaign.offer.geoTier);
  const agg = aggregate(campaign.snapshots);
  const doneSteps = STEPS.filter((s) => state.tasks[`step-${s.id}`]).length;
  const gaps = score.letters.flatMap((l) => l.gaps.map((g) => ({ letter: l.letter, gap: g, idx: score.letters.indexOf(l) })));

  return (
    <>
      <div className="hero">
        <h1>{campaign.name}</h1>
        <p className="lead">
          Uma campanha só vai para o leilão depois que as cinco primeiras letras estão de pé. Este console transforma
          cada letra do método em número, checklist e veredito — e recusa escalar o que não foi validado.
        </p>
        <div className="pill-row" style={{ marginTop: 10 }}>
          <Badge tone="info">{CHANNEL_LABEL[campaign.offer.channel]}</Badge>
          <Badge>{campaign.offer.geoTier}</Badge>
          <Badge tone="ghost">{campaign.status}</Badge>
          <Badge tone={score.readyToTest ? 'ok' : 'warn'}>
            {score.readyToTest ? 'liberada para o teste de 72h' : 'bloqueada para teste'}
          </Badge>
          <Badge tone="ghost">
            plano 14 dias: {doneSteps}/{STEPS.length} passos
          </Badge>
        </div>
      </div>

      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Stat
          k="Comissão líquida"
          v={money(math.commissionAfterRefunds, cur)}
          note={`bruta ${money(math.grossCommission, cur)} − rede ${money(math.networkFee, cur)} − estorno`}
        />
        <Stat
          k="Conversão de empate"
          v={pct(math.breakEvenCr, 3)}
          note={`${num(math.clicksToBreakEvenPerSale, 1)} cliques por venda no CPC atual`}
          tone={math.verdict === 'ok' ? 'ok' : math.verdict === 'apertado' ? 'warn' : 'bad'}
        />
        <Stat
          k="Margem por clique"
          v={money(math.marginPerClick, cur)}
          note={`EPC esperado ${money(math.expectedEpc, cur)} vs CPC ${money(campaign.traffic.cpc, cur)}`}
          tone={math.marginPerClick > 0 ? 'ok' : 'bad'}
        />
        <Stat
          k="Benchmark CTR"
          v={bench.geoAdjusted ? pct(bench.geoAdjusted.ctr) : '—'}
          note={bench.geoAdjusted ? `CPA ${money(bench.geoAdjusted.cpa, 'USD')} · ${bench.geoAdjusted.year}` : 'sem linha publicada'}
        />
      </div>

      <h2>As seis letras</h2>
      <div className="grid g3">
        {score.letters.map((l, i) => (
          <div className="letter" key={`${l.letter}-${l.title}`}>
            <div className={`letter__k letter__k--${l.status}`}>{l.letter}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row" style={{ justifyContent: 'space-between', gap: 8 }}>
                <strong className="small">{l.title}</strong>
                <span className="mono tiny">{l.score}</span>
              </div>
              <div style={{ margin: '6px 0' }}>
                <Bar value={l.score} tone={l.score < 40 ? 'bad' : l.score < 70 ? 'warn' : undefined} />
              </div>
              <div className="tiny muted" style={{ minHeight: 32 }}>
                {l.gaps[0] ?? 'Sem pendências.'}
                {l.gaps.length > 1 && ` (+${l.gaps.length - 1})`}
              </div>
              <button className="btn btn--sm btn--ghost" style={{ marginTop: 6 }} type="button" onClick={() => go(LETTER_ROUTE[i])}>
                Abrir módulo →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <Card title="Próximas ações" hint="Ordenadas pelo que mais trava a campanha">
          {gaps.length === 0 ? (
            <Callout tone="ok" title="Nada pendente">
              Tudo preenchido. Rode o teste de 72h e registre os dados.
            </Callout>
          ) : (
            <ol style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
              {gaps.slice(0, 6).map((g, i) => (
                <li key={i} className="small">
                  <Badge tone="ghost">{g.letter}</Badge> <span className="dim">{g.gap}</span>{' '}
                  <a
                    href={`#/${LETTER_ROUTE[g.idx]}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(LETTER_ROUTE[g.idx]);
                    }}
                  >
                    resolver
                  </a>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card title="Estado do teste" hint="Últimos dados lançados">
          {campaign.snapshots.length === 0 ? (
            <Callout tone="warn" title="Sem dados ainda">
              O teste de 72h começa quando você registra o primeiro dia. Vá em <strong>Teste de 72h</strong> para abrir o
              cronômetro e lançar impressões, cliques, conversões e gasto.
            </Callout>
          ) : (
            <>
              <div className="grid g2" style={{ gap: 8 }}>
                <Stat k="Impressões" v={num(agg.impressions, 0)} />
                <Stat k="Cliques" v={num(agg.clicks, 0)} note={`CTR ${pct(agg.impressions ? (agg.clicks / agg.impressions) * 100 : 0)}`} />
                <Stat k="Conversões" v={num(agg.conversions, 0)} />
                <Stat
                  k="Lucro acumulado"
                  v={money(agg.revenue - agg.spend, cur)}
                  tone={agg.revenue - agg.spend > 0 ? 'ok' : 'bad'}
                  note={`gasto ${money(agg.spend, cur)} · receita ${money(agg.revenue, cur)}`}
                />
              </div>
              {campaign.decision && (
                <div className="row" style={{ marginTop: 10 }}>
                  <Verdict v={campaign.decision.verdict} />
                  <span className="small dim">{campaign.decision.nextAction}</span>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      <div className="divider" />
      <Callout tone="info" title="Como este console funciona">
        Nada aqui é conselho mágico. Cada número vem de uma fórmula explícita (comissão líquida ÷ CPC, intervalo de
        Wilson sobre o CTR, learning phase × 50 eventos) e cada benchmark traz a fonte e o ano. Quando o dado não
        sustenta a decisão, o console diz <strong>colete mais dado</strong> em vez de mandar você pausar — matar campanha
        por ruído é o prejuízo mais comum do tráfego pago.
      </Callout>
    </>
  );
}
