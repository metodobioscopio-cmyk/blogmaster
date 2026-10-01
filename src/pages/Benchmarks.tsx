import { useMemo, useState } from 'react';
import { Badge, Callout, Card, Select, Source, Stat } from '../components/ui';
import { BENCHMARKS, CHANNEL_LABEL, GEO_LABEL, GEO_MULTIPLIER, MIN_BUDGET, RETARGETING_LIFT, VERTICAL_LABEL } from '../lib/benchmarks';
import { money, num, pct } from '../lib/format';
import type { ChannelId, VerticalId } from '../lib/types';
import { useStore } from '../state/store';

export default function Benchmarks() {
  const { state } = useStore();
  const rate = state.workspace.usdRate || 1;
  const cur = state.workspace.currency;
  const [channel, setChannel] = useState<ChannelId | 'all'>('all');
  const [vertical, setVertical] = useState<VerticalId | 'all'>('all');

  const rows = useMemo(
    () =>
      BENCHMARKS.filter((b) => (channel === 'all' || b.channel === channel) && (vertical === 'all' || b.vertical === vertical)),
    [channel, vertical],
  );

  const sources = useMemo(() => {
    const map = new Map<string, { url: string; year: string; count: number }>();
    for (const b of BENCHMARKS) {
      const cur2 = map.get(b.source) ?? { url: b.sourceUrl, year: b.year, count: 0 };
      map.set(b.source, { ...cur2, count: cur2.count + 1 });
    }
    return Array.from(map.entries()).map(([source, v]) => ({ source, ...v }));
  }, []);

  return (
    <>
      <p className="lead">
        Toda régua de corte deste console sai daqui. Cada linha traz a fonte, o ano e a faixa publicada — quando a fonte dá
        intervalo, usamos o ponto médio e registramos a faixa na observação. Nada de número inventado.
      </p>

      <div className="grid g2">
        <Card title="Filtros">
          <div className="grid g2">
            <Select<ChannelId | 'all'>
              label="Canal"
              value={channel}
              onChange={setChannel}
              options={[{ value: 'all', label: 'Todos' }, ...(Object.keys(CHANNEL_LABEL) as ChannelId[]).map((k) => ({ value: k, label: CHANNEL_LABEL[k] }))]}
            />
            <Select<VerticalId | 'all'>
              label="Vertical"
              value={vertical}
              onChange={setVertical}
              options={[{ value: 'all', label: 'Todas' }, ...(Object.keys(VERTICAL_LABEL) as VerticalId[]).map((k) => ({ value: k, label: VERTICAL_LABEL[k] }))]}
            />
          </div>
          <div className="divider" />
          <div className="grid g3" style={{ gap: 8 }}>
            <Stat k="Linhas na base" v={BENCHMARKS.length} />
            <Stat k="Linhas filtradas" v={rows.length} />
            <Stat k="Fontes" v={sources.length} />
          </div>
        </Card>
        <Card title="Como usar sem se enganar" hint="Benchmark é ponto de partida, não meta">
          <ul className="small dim" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
            <li>
              As fontes discordam entre si — e isso é informação. O TikTok tem CTR de 0,61% (Silverback) e 1,77% (Triple
              Whale) porque medem bases diferentes. Use a faixa, não o ponto.
            </li>
            <li>
              Benchmark de e-commerce não vale para finanças. No Meta, CPA de e-commerce é US$ 28 e de SaaS é US$ 85 — três
              vezes de diferença no mesmo canal.
            </li>
            <li>
              CPA baixo não é canal bom: Pets &amp; Animals tem o menor CPA do TikTok (US$ 13,46) e o pior ROAS (0,08).
            </li>
            <li>Valores em {cur} usam o câmbio do seu workspace (US$ 1 = {num(rate, 2)}). Confira antes de comparar.</li>
          </ul>
        </Card>
      </div>

      <h2>Linhas publicadas</h2>
      <Card>
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th>Canal</th>
                <th>Vertical</th>
                <th className="right">CTR</th>
                <th className="right">CPC</th>
                <th className="right">CPA</th>
                <th className="right">CVR</th>
                <th className="right">CPM</th>
                <th className="right">ROAS</th>
                <th>Fonte</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b, i) => (
                <tr key={i}>
                  <td className="small">{CHANNEL_LABEL[b.channel]}</td>
                  <td className="small">{VERTICAL_LABEL[b.vertical]}</td>
                  <td className="right mono">{pct(b.ctr)}</td>
                  <td className="right mono">{money(b.cpc * rate, cur)}</td>
                  <td className="right mono">{money(b.cpa * rate, cur)}</td>
                  <td className="right mono">{b.cvr ? pct(b.cvr) : '—'}</td>
                  <td className="right mono">{b.cpm ? money(b.cpm * rate, cur) : '—'}</td>
                  <td className="right mono">{b.roas ? num(b.roas, 2) : '—'}</td>
                  <td className="small">
                    <a href={b.sourceUrl} target="_blank" rel="noreferrer noopener">
                      {b.source.split('—')[0].trim()}
                    </a>{' '}
                    <span className="muted">{b.year}</span>
                    {b.note && <div className="tiny muted">{b.note}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid g2" style={{ marginTop: 12 }}>
        <Card title="Retargeting vs prospecting (Meta, Q1/2026)" hint="Onde a margem do afiliado costuma aparecer">
          <div className="grid g4" style={{ gap: 8 }}>
            <Stat k="CTR" v={pct(RETARGETING_LIFT.ctr)} note={RETARGETING_LIFT.deltas.ctr} tone="ok" />
            <Stat k="CPC" v={money(RETARGETING_LIFT.cpc * rate, cur)} note={RETARGETING_LIFT.deltas.cpc} tone="ok" />
            <Stat k="CPA" v={money(RETARGETING_LIFT.cpa * rate, cur)} note={RETARGETING_LIFT.deltas.cpa} tone="ok" />
            <Stat k="ROAS" v={num(RETARGETING_LIFT.roas, 1)} note={RETARGETING_LIFT.deltas.roas} tone="ok" />
          </div>
          <Source source={RETARGETING_LIFT.source} url={RETARGETING_LIFT.sourceUrl} />
          <div className="tiny muted" style={{ marginTop: 8 }}>
            Implicação prática: a primeira venda raramente paga o teste. O lucro mora na segunda e na terceira exposição —
            por isso o Passo 8 insiste no funil com captura de e-mail.
          </div>
        </Card>

        <Card title="Orçamento mínimo por canal" hint="Piso técnico vs piso prático">
          <div className="scroll-x">
            <table>
              <thead>
                <tr>
                  <th>Canal</th>
                  <th className="right">Técnico/dia</th>
                  <th className="right">Prático/dia</th>
                  <th>Regra</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(MIN_BUDGET).map(([k, v]) => (
                  <tr key={k}>
                    <td className="small">{CHANNEL_LABEL[k as ChannelId]}</td>
                    <td className="right mono">{money(v.technical * rate, cur)}</td>
                    <td className="right mono">{money(v.practical * rate, cur)}</td>
                    <td className="small dim">
                      {v.rule}
                      <div className="tiny muted">{v.source}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <h2>Derivação geográfica</h2>
      <Card
        title="Multiplicadores T2/T3"
        hint="Derivação própria para planejamento — NÃO é dado publicado"
        right={<Badge tone="warn">derivação interna</Badge>}
      >
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th>Geografia</th>
                <th className="right">CPC ×</th>
                <th className="right">CPM ×</th>
                <th className="right">CTR ×</th>
                <th className="right">CVR ×</th>
              </tr>
            </thead>
            <tbody>
              {(Object.keys(GEO_MULTIPLIER) as Array<keyof typeof GEO_MULTIPLIER>).map((g) => (
                <tr key={g}>
                  <td>{GEO_LABEL[g]}</td>
                  <td className="right mono">{GEO_MULTIPLIER[g].cpc}</td>
                  <td className="right mono">{GEO_MULTIPLIER[g].cpm}</td>
                  <td className="right mono">{GEO_MULTIPLIER[g].ctr}</td>
                  <td className="right mono">{GEO_MULTIPLIER[g].cvr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout tone="warn" title="Leia antes de usar">
          Todas as linhas publicadas acima são de mercados T1. Não existe base pública confiável de CTR/CPA por país para T2
          e T3 — então este console aplica multiplicadores explícitos e marca o resultado como derivação. O número certo é o
          do seu gerenciador de anúncios depois de 100 cliques de sondagem.
        </Callout>
      </Card>

      <h2>Fontes</h2>
      <Card>
        <ul className="small dim" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
          {sources.map((s) => (
            <li key={s.source}>
              <a href={s.url} target="_blank" rel="noreferrer noopener">
                {s.source}
              </a>{' '}
              <span className="muted">
                ({s.year}) — {s.count} linha(s) nesta base
              </span>
            </li>
          ))}
        </ul>
        <div className="tiny muted" style={{ marginTop: 10 }}>
          Consulta realizada em 01/10/2026. Benchmarks de mídia mudam trimestralmente; revise a base antes de cada novo
          ciclo de teste.
        </div>
      </Card>
    </>
  );
}
