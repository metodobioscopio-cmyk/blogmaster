import { useState } from 'react';
import { Badge, Callout, Card, Check, Field, Num, Select, Source, Stat, Text, toast } from '../components/ui';
import { CHANNEL_LABEL, GEO_LABEL, MIN_BUDGET, VERTICAL_LABEL, findBenchmark } from '../lib/benchmarks';
import { offerMath, dailyProjection, minCommissionFor, maxCpcFor } from '../lib/breakEven';
import { planTestBudget } from '../lib/budget';
import { AMAZON_CATEGORIES, NETWORKS } from '../lib/networks';
import { money, num, pct } from '../lib/format';
import type { ChannelId, GeoTier, NetworkId, VerticalId } from '../lib/types';
import { useActiveCampaign, useStore } from '../state/store';

const DEMAND_CHECKS = [
  { id: 'd-trend', label: 'Curva de 12 meses verificada (demanda consistente, não pico passageiro)' },
  { id: 'd-volume', label: 'Volume de busca medido no país-alvo (não no Brasil por engano)' },
  { id: 'd-intent', label: 'Intenção de compra confirmada (termos "comprar", "melhor", "preço", review)' },
  { id: 'd-competition', label: 'Concorrência mapeada: há espaço ou o SERP está tomado?' },
  { id: 'd-angel', label: 'Existe ângulo que ainda não foi saturado' },
];

export default function Demand() {
  const { state, dispatch } = useStore();
  const c = useActiveCampaign();
  const [showAmazon, setShowAmazon] = useState(false);
  if (!c) return null;
  const cur = state.workspace.currency;
  const rate = state.workspace.usdRate || 1;
  const math = offerMath(c.offer, c.traffic);
  const proj = dailyProjection(c.offer, c.traffic);
  const bench = findBenchmark(c.offer.channel, c.offer.vertical, c.offer.geoTier);
  const net = NETWORKS[c.offer.network];
  const budget = planTestBudget({
    channel: c.offer.channel,
    cpc: c.traffic.cpc,
    targetCpa: c.cutMetrics.maxCpa || math.expectedCpa || 40,
    dailyBudget: c.traffic.dailyBudget,
  });

  const setOffer = (patch: Partial<typeof c.offer>) => dispatch({ type: 'campaign/offer', id: c.id, patch });
  const setTraffic = (patch: Partial<typeof c.traffic>) => dispatch({ type: 'campaign/traffic', id: c.id, patch });

  const useBenchmark = () => {
    if (!bench.geoAdjusted) {
      toast('Não há benchmark publicado para este canal — informe o CPC manualmente.');
      return;
    }
    const b = bench.geoAdjusted;
    setTraffic({ cpc: Number((b.cpc * rate).toFixed(3)), ctr: b.ctr, cvr: b.cvr ?? c.traffic.cvr });
    toast(`CPC/CTR/CVR preenchidos com ${b.source} (${b.year}).`);
  };

  return (
    <>
      <p className="lead">
        Passo 5 do roadmap, sem atalho: <strong>divida a comissão pelo custo do clique</strong>. Se o número pedir uma
        conversão que você não consegue provar, a oferta morre aqui — antes de qualquer criativo.
      </p>

      <div className="grid g2">
        <Card title="1. A oferta" hint="Preço e comissão no país-alvo, não no Brasil">
          <div className="stack">
            <Text label="Nome da oferta" value={c.offer.name} onChange={(v) => setOffer({ name: v })} placeholder="Ex.: protocolo ômega-3 90 cápsulas" />
            <div className="grid g2">
              <Select<NetworkId>
                label="Rede"
                value={c.offer.network}
                onChange={(v) => {
                  const n = NETWORKS[v];
                  setOffer({ network: v, networkFeePercent: n.feePercent, networkFeeFixed: n.feeFixed, payoutFee: n.payoutFee });
                }}
                options={(Object.keys(NETWORKS) as NetworkId[]).map((k) => ({ value: k, label: NETWORKS[k].label }))}
              />
              <Select<ChannelId>
                label="Canal principal (um só)"
                value={c.offer.channel}
                onChange={(v) => setOffer({ channel: v })}
                options={(Object.keys(CHANNEL_LABEL) as ChannelId[]).map((k) => ({ value: k, label: CHANNEL_LABEL[k] }))}
              />
            </div>
            <div className="grid g2">
              <Select<VerticalId>
                label="Vertical"
                value={c.offer.vertical}
                onChange={(v) => setOffer({ vertical: v })}
                options={(Object.keys(VERTICAL_LABEL) as VerticalId[]).map((k) => ({ value: k, label: VERTICAL_LABEL[k] }))}
              />
              <Select<GeoTier>
                label="Geografia"
                value={c.offer.geoTier}
                onChange={(v) => setOffer({ geoTier: v })}
                options={(Object.keys(GEO_LABEL) as GeoTier[]).map((k) => ({ value: k, label: GEO_LABEL[k] }))}
              />
            </div>
            <div className="grid g3">
              <Num label="Preço de venda" value={c.offer.price} onChange={(v) => setOffer({ price: v })} suffix={cur} step={1} />
              <Select<'percent' | 'flat'>
                label="Comissão é"
                value={c.offer.commissionMode}
                onChange={(v) => setOffer({ commissionMode: v })}
                options={[
                  { value: 'percent', label: '% do preço' },
                  { value: 'flat', label: 'valor fixo (CPA)' },
                ]}
              />
              <Num
                label={c.offer.commissionMode === 'percent' ? 'Percentual' : 'Valor fixo'}
                value={c.offer.commissionValue}
                onChange={(v) => setOffer({ commissionValue: v })}
                suffix={c.offer.commissionMode === 'percent' ? '%' : cur}
                step={c.offer.commissionMode === 'percent' ? 1 : 0.5}
              />
            </div>
            <div className="grid g3">
              <Num
                label="Taxa da rede"
                value={c.offer.networkFeePercent ?? 0}
                onChange={(v) => setOffer({ networkFeePercent: v })}
                suffix="%"
                step={0.1}
                hint={`padrão de ${net.label}: ${net.feePercent}% + ${net.feeFixed}`}
              />
              <Num label="Taxa fixa/transação" value={c.offer.networkFeeFixed ?? 0} onChange={(v) => setOffer({ networkFeeFixed: v })} suffix={cur} step={0.1} />
              <Num label="Estorno estimado" value={c.offer.refundRate} onChange={(v) => setOffer({ refundRate: v })} suffix="%" step={1} />
            </div>
            {c.offer.network === 'amazon' && (
              <button className="btn btn--sm" type="button" onClick={() => setShowAmazon((s) => !s)}>
                {showAmazon ? 'Esconder' : 'Ver'} tabela de comissões Amazon 2026
              </button>
            )}
          </div>
        </Card>

        <Card
          title="2. O tráfego"
          hint="O custo do clique decide tudo"
          right={
            <button className="btn btn--sm" type="button" onClick={useBenchmark}>
              Usar benchmark
            </button>
          }
        >
          <div className="stack">
            <div className="grid g2">
              <Num label="CPC estimado" value={c.traffic.cpc} onChange={(v) => setTraffic({ cpc: v })} suffix={cur} step={0.01} />
              <Num label="CTR esperado" value={c.traffic.ctr} onChange={(v) => setTraffic({ ctr: v })} suffix="%" step={0.1} />
            </div>
            <div className="grid g2">
              <Num label="Conversão da landing" value={c.traffic.cvr} onChange={(v) => setTraffic({ cvr: v })} suffix="%" step={0.1} />
              <Num label="Orçamento diário" value={c.traffic.dailyBudget} onChange={(v) => setTraffic({ dailyBudget: v })} suffix={cur} step={5} />
            </div>

            {bench.geoAdjusted && (
              <Callout tone="info">
                <div className="callout__t">Referência para esta combinação</div>
                <div className="small">
                  CTR <strong>{pct(bench.geoAdjusted.ctr)}</strong> · CPC{' '}
                  <strong>{money(bench.geoAdjusted.cpc * rate, cur)}</strong> · CPA{' '}
                  <strong>{money(bench.geoAdjusted.cpa * rate, cur)}</strong>
                  {bench.geoAdjusted.cvr ? <> · CVR <strong>{pct(bench.geoAdjusted.cvr)}</strong></> : null}
                </div>
                {bench.geoAdjusted.note && <div className="tiny muted" style={{ marginTop: 5 }}>{bench.geoAdjusted.note}</div>}
                <Source source={`${bench.geoAdjusted.source} (${bench.geoAdjusted.year})`} url={bench.geoAdjusted.sourceUrl} />
                {bench.geoAdjusted.derived && (
                  <div className="tiny" style={{ color: 'var(--warn)', marginTop: 4 }}>
                    Valores de {c.offer.geoTier} são derivação nossa para planejamento — confira no seu gerenciador de anúncios.
                  </div>
                )}
              </Callout>
            )}
            {!bench.geoAdjusted && (
              <Callout tone="warn">
                Não há benchmark publicado para {CHANNEL_LABEL[c.offer.channel]}. Use o CPC real de uma campanha anterior
                ou rode 100 cliques de sondagem antes de decidir.
              </Callout>
            )}
          </div>
        </Card>
      </div>

      <h2>A matemática do Passo 5</h2>
      <div className="grid g4">
        <Stat k="Comissão bruta" v={money(math.grossCommission, cur)} note={`taxa da rede ${money(math.networkFee, cur)}`} />
        <Stat
          k="Comissão líquida"
          v={money(math.commissionAfterRefunds, cur)}
          note={`após ${c.offer.refundRate}% de estorno`}
          tone={math.commissionAfterRefunds > 0 ? 'ok' : 'bad'}
        />
        <Stat
          k="Conversão de empate"
          v={pct(math.breakEvenCr, 3)}
          note={`${num(math.clicksToBreakEvenPerSale, 1)} cliques por venda`}
          tone={math.verdict === 'ok' ? 'ok' : math.verdict === 'apertado' ? 'warn' : 'bad'}
        />
        <Stat
          k="CPC máximo no empate"
          v={money(math.breakEvenCpc, cur)}
          note={`seu CPC: ${money(c.traffic.cpc, cur)}`}
          tone={c.traffic.cpc <= math.breakEvenCpc ? 'ok' : 'bad'}
        />
      </div>

      <div className="grid g2" style={{ marginTop: 12 }}>
        <Card title="Veredito da oferta">
          <div className="row" style={{ marginBottom: 10 }}>
            <Badge tone={math.verdict === 'ok' ? 'ok' : math.verdict === 'apertado' ? 'warn' : 'bad'}>
              {math.verdict.toUpperCase()}
            </Badge>
            <span className="small dim">
              EPC esperado {money(math.expectedEpc, cur)} vs EPC de empate {money(math.breakEvenEpc, cur)} · ROAS esperado{' '}
              {num(math.roasBreakEven, 2)}
            </span>
          </div>
          <dl className="kv">
            <dt>Margem por clique</dt>
            <dd>
              <strong style={{ color: math.marginPerClick >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
                {money(math.marginPerClick, cur)}
              </strong>
            </dd>
            <dt>CPA esperado</dt>
            <dd>{money(math.expectedCpa, cur)}</dd>
            <dt>Cliques/dia no orçamento atual</dt>
            <dd>{num(proj.clicks, 0)}</dd>
            <dt>Conversões/dia esperadas</dt>
            <dd>{num(proj.conversions, 2)}</dd>
            <dt>Lucro/dia projetado</dt>
            <dd>
              <strong style={{ color: proj.profit >= 0 ? 'var(--accent)' : 'var(--danger)' }}>{money(proj.profit, cur)}</strong>
            </dd>
          </dl>
          <div className="divider" />
          <div className="small dim">
            <strong>Engenharia reversa:</strong> com {pct(c.traffic.cvr, 2)} de conversão, a comissão mínima para o clique
            de {money(c.traffic.cpc, cur)} valer a pena é{' '}
            <strong>{money(minCommissionFor(c.traffic.cpc, c.traffic.cvr), cur)}</strong>. Para ter 25% de margem, o CPC
            máximo é <strong>{money(maxCpcFor(math.commissionAfterRefunds, c.traffic.cvr, 0.25), cur)}</strong>.
          </div>
        </Card>

        <Card title="Orçamento do teste de 72h" hint="Passo 13 — o maior dos três pisos vence">
          <div className="grid g3" style={{ gap: 8 }}>
            <Stat k="Piso da plataforma" v={money(budget.technicalFloor, cur)} />
            <Stat k="Piso learning phase" v={money(budget.learningFloor, cur)} />
            <Stat k="Piso estatístico" v={money(budget.statisticalFloor, cur)} />
          </div>
          <div className="divider" />
          <div className="row">
            <Stat k="Orçamento/dia recomendado" v={money(budget.daily, cur)} />
            <Stat k="Total 72h" v={money(budget.total72h, cur)} note={`${num(budget.clicks72h, 0)} cliques · ~${budget.expectedConversions72h} conversões`} />
          </div>
          <ul className="small dim" style={{ marginTop: 10, paddingLeft: 18, display: 'grid', gap: 5 }}>
            {budget.rationale.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
          <Source source={budget.source} url={budget.sourceUrl} />
          <button
            className="btn btn--sm"
            style={{ marginTop: 10 }}
            type="button"
            onClick={() => {
              setTraffic({ dailyBudget: budget.daily });
              toast(`Orçamento diário ajustado para ${money(budget.daily, cur)}.`);
            }}
          >
            Aplicar este orçamento
          </button>
          <div className="tiny muted" style={{ marginTop: 8 }}>
            Mínimos por canal — {Object.keys(MIN_BUDGET)
              .filter((k) => MIN_BUDGET[k as ChannelId].technical > 0)
              .map((k) => `${CHANNEL_LABEL[k as ChannelId].split('—')[0].trim()}: ${money(MIN_BUDGET[k as ChannelId].technical, 'USD')}/dia`)
              .join(' · ')}
          </div>
        </Card>
      </div>

      <div className="grid g2" style={{ marginTop: 12 }}>
        <Card title="Passo 4 — filtro de demanda real" hint="O que separa demanda de curiosidade">
          <div className="stack">
            {DEMAND_CHECKS.map((d) => (
              <Check
                key={d.id}
                label={d.label}
                checked={!!state.tasks[d.id]}
                onChange={() => dispatch({ type: 'task/toggle', taskId: d.id })}
              />
            ))}
          </div>
          <div className="divider" />
          <Field label="Onde você verificou a demanda (deixe rastreável)">
            <textarea
              value={c.offer.notes ?? ''}
              onChange={(e) => setOffer({ notes: e.target.value })}
              placeholder="Google Trends 12 meses · Keyword Planner US · Biblioteca de Anúncios do Meta · subreddit do nicho"
            />
          </Field>
          <div className="tiny muted" style={{ marginTop: 8 }}>
            Ferramenta sugerida: <code>pat310/google-trends-api</code> (974★, MIT) automatiza a curva de 12 meses por país.
            Veja em <a href="#/stack">Stack OSS</a>.
          </div>
        </Card>

        <Card title="Rede selecionada" hint="Dados que mudam a matemática">
          <dl className="kv">
            <dt>Comissão típica</dt>
            <dd>{net.commissionRange}</dd>
            <dt>Cookie</dt>
            <dd>{net.cookie}</dd>
            <dt>Pagamento</dt>
            <dd>{net.payout}</dd>
            <dt>Mínimo de saque</dt>
            <dd>{net.minPayout}</dd>
            <dt>Taxa por transação</dt>
            <dd>
              {net.feePercent}% + {net.feeFixed} {net.payoutFee ? `· ${net.payoutFee}/ciclo` : ''}
            </dd>
            <dt>Estorno</dt>
            <dd>{net.refundWindow}</dd>
          </dl>
          <div className="divider" />
          <ul className="small dim" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
            {net.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
          <Source source={net.source} url={net.sourceUrl} />
        </Card>
      </div>

      {showAmazon && (
        <Card title="Amazon Associates — comissões por categoria (2026)" hint="Efetivo médio entre contas: 2,5–3,5%">
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th className="right">Comissão</th>
                  <th className="right">Comissão em US$ 100</th>
                  <th className="right">Cliques/venda no empate (CPC {money(c.traffic.cpc, 'USD')})</th>
                </tr>
              </thead>
              <tbody>
                {AMAZON_CATEGORIES.map((row) => {
                  const comm = (100 * row.rate) / 100;
                  const perSale = comm;
                  return (
                    <tr key={row.category}>
                      <td>{row.category}</td>
                      <td className="right mono">{row.rate}%</td>
                      <td className="right mono">{money(perSale, 'USD')}</td>
                      <td className="right mono">{perSale > 0 ? num(1 / (perSale / c.traffic.cpc), 1) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Source source="Amazon Associates fee schedule via Money-Forge (2026)" url="https://www.money-forge.org/blog/amazon-associates-complete-guide-2026" />
        </Card>
      )}
    </>
  );
}
