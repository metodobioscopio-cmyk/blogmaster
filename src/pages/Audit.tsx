import { Badge, Callout, Card, Check, CopyButton, Select, Source, Stat, Text, toast } from '../components/ui';
import { buildComplianceReport, suggestedDisclosure } from '../lib/compliance';
import { useActiveCampaign, useStore } from '../state/store';

const GEO_OPTIONS = [
  { value: 'US', label: 'Estados Unidos (FTC)' },
  { value: 'EU', label: 'União Europeia (GDPR)' },
  { value: 'BR', label: 'Brasil (LGPD)' },
];

export default function Audit() {
  const { dispatch } = useStore();
  const c = useActiveCampaign();
  if (!c) return null;
  const report = buildComplianceReport(c);
  const setAudit = (patch: Partial<typeof c.audit>) => dispatch({ type: 'campaign/audit', id: c.id, patch });
  const setCompliance = (patch: Partial<typeof c.compliance>) => dispatch({ type: 'campaign/compliance', id: c.id, patch });

  const toggleGeo = (g: string) => {
    const has = c.compliance.geos.includes(g);
    setCompliance({ geos: has ? c.compliance.geos.filter((x) => x !== g) : [...c.compliance.geos, g] });
  };
  const toggleRule = (id: string) => {
    const has = c.compliance.checkedRuleIds.includes(id);
    setCompliance({
      checkedRuleIds: has ? c.compliance.checkedRuleIds.filter((x) => x !== id) : [...c.compliance.checkedRuleIds, id],
      reviewedAt: new Date().toISOString(),
    });
  };

  return (
    <>
      <p className="lead">
        Dois riscos matam campanha aqui: saturação (todo mundo já usa o mesmo ângulo) e compliance (a rede bloqueia ou a
        lei multa). O passo 3 pede 5 concorrentes; o passo 6 pede as regras do país-alvo. Os dois viram registro auditável.
      </p>

      <Card
        title="Passo 3 — auditoria de 5 concorrentes diretos"
        hint="O objetivo não é copiar: é achar a lacuna"
        right={
          <span className="badge badge--ghost">
            {c.audit.competitors.filter((x) => x.name.trim()).length}/5 preenchidos
          </span>
        }
      >
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th style={{ width: 170 }}>Concorrente</th>
                <th style={{ width: 230 }}>Ângulo usado</th>
                <th style={{ width: 130 }}>Canal</th>
                <th style={{ width: 180 }}>Oferta/criativo</th>
                <th>Lacuna que ele deixa</th>
              </tr>
            </thead>
            <tbody>
              {c.audit.competitors.map((comp, i) => (
                <tr key={i}>
                  {(['name', 'angle', 'channel', 'offer', 'gap'] as const).map((key) => (
                    <td key={key}>
                      <input
                        value={comp[key]}
                        placeholder={key === 'gap' ? 'o que ninguém respondeu' : ''}
                        onChange={(e) => {
                          const next = [...c.audit.competitors];
                          next[i] = { ...comp, [key]: e.target.value };
                          setAudit({ competitors: next });
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divider" />
        <Text
          label="Leitura de saturação"
          area
          value={c.audit.saturationNote}
          onChange={(v) => setAudit({ saturationNote: v })}
          placeholder="3 dos 5 usam o mesmo hook de emagrecimento. Nenhum fala de custo mensal. Nenhum atende público 55+."
          hint="Se todos usam o mesmo ângulo, o problema não é o canal — é que você entrou tarde."
        />
        <div className="row" style={{ marginTop: 10 }}>
          <Check label="Li os termos da rede (não só a página de cadastro)" checked={c.audit.networkTermsRead} onChange={(v) => setAudit({ networkTermsRead: v })} />
          <Check label="Conferi logística/entrega no país-alvo (produto chega, sem imposto surpresa)" checked={c.audit.logisticsChecked} onChange={(v) => setAudit({ logisticsChecked: v })} />
        </div>
        <Callout tone="warn" title="Armadilha do Passo 3">
          Copiar criativo alheio é violação de direito autoral <em>e</em> política de anúncio. Anote o ângulo, escreva o
          seu. E se for usar antes/depois, veja a regra <code>ftc-results</code> e a política do canal abaixo.
        </Callout>
      </Card>

      <h2>Passo 6 — compliance por jurisdição</h2>
      <div className="grid g2">
        <Card title="Países-alvo" hint="A régua muda por jurisdição, não por idioma">
          <div className="row">
            {GEO_OPTIONS.map((g) => (
              <button
                key={g.value}
                type="button"
                className={`btn btn--sm ${c.compliance.geos.includes(g.value) ? 'btn--primary' : ''}`}
                onClick={() => toggleGeo(g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>
          <div className="divider" />
          <Text
            label="Texto de disclosure em uso"
            area
            value={c.compliance.disclosureText}
            onChange={(v) => setCompliance({ disclosureText: v })}
            placeholder="Cole aqui a frase que vai ANTES do primeiro link de afiliado"
          />
          <div className="row" style={{ marginTop: 8 }}>
            <button
              className="btn btn--sm"
              type="button"
              onClick={() => {
                setCompliance({ disclosureText: suggestedDisclosure(c.compliance.geos, c.offer.network) });
                toast('Disclosure sugerido gerado para país + rede selecionados.');
              }}
            >
              Gerar texto recomendado
            </button>
            <CopyButton text={report.disclosure} label="Copiar disclosure" />
          </div>
          <div className="tiny muted" style={{ marginTop: 8 }}>
            A frase precisa aparecer antes do link, no mesmo meio da recomendação. Bio, rodapé e página "Sobre" não contam.
          </div>
        </Card>

        <Card title="Cobertura do checklist">
          <div className="grid g3" style={{ gap: 8 }}>
            <Stat k="Regras aplicáveis" v={report.applicable.length} />
            <Stat k="Verificadas" v={report.checked.length} note={`${report.coverage}%`} tone={report.coverage >= 80 ? 'ok' : 'warn'} />
            <Stat k="Críticas pendentes" v={report.criticalMissing.length} tone={report.criticalMissing.length ? 'bad' : 'ok'} />
          </div>
          {report.criticalMissing.length > 0 && (
            <Callout tone="bad" title="Não suba a campanha com isto em aberto">
              <ul style={{ margin: '6px 0 0', paddingLeft: 18, display: 'grid', gap: 4 }}>
                {report.criticalMissing.map((r) => (
                  <li key={r.id}>{r.title}</li>
                ))}
              </ul>
            </Callout>
          )}
        </Card>
      </div>

      <Card
        title="Regras aplicáveis a esta campanha"
        hint={`Filtradas por país (${c.compliance.geos.join(', ') || 'nenhum'}), rede (${c.offer.network}) e canal (${c.offer.channel})`}
        right={
          <button
            className="btn btn--sm"
            type="button"
            onClick={() => {
              const all = report.applicable.map((r) => r.id);
              const allChecked = all.every((id) => c.compliance.checkedRuleIds.includes(id));
              setCompliance({
                checkedRuleIds: allChecked ? [] : Array.from(new Set([...c.compliance.checkedRuleIds, ...all])),
                reviewedAt: new Date().toISOString(),
              });
            }}
          >
            Marcar/desmarcar todas
          </button>
        }
      >
        {report.applicable.length === 0 ? (
          <Callout tone="warn">Selecione ao menos um país-alvo para calcular as regras aplicáveis.</Callout>
        ) : (
          <div className="stack">
            {report.applicable.map((r) => {
              const on = c.compliance.checkedRuleIds.includes(r.id);
              return (
                <div key={r.id} className="card card--tight" style={{ background: 'var(--panel-2)' }}>
                  <div className="row" style={{ alignItems: 'flex-start' }}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleRule(r.id)}
                      style={{ marginTop: 3, flex: 'none' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row" style={{ gap: 6 }}>
                        <strong className="small">{r.title}</strong>
                        <Badge tone={r.severity === 'critica' ? 'bad' : r.severity === 'alta' ? 'warn' : 'ghost'}>
                          {r.severity}
                        </Badge>
                        <Badge tone="ghost">{r.jurisdiction}</Badge>
                      </div>
                      <div className="small dim" style={{ marginTop: 4 }}>
                        <strong>O que exige:</strong> {r.requirement}
                      </div>
                      <div className="small muted" style={{ marginTop: 3 }}>
                        <strong>Por quê:</strong> {r.why}
                      </div>
                      <div className="small" style={{ marginTop: 3, color: 'var(--accent)' }}>
                        <strong>Ação:</strong> {r.action}
                      </div>
                      <div className="tiny muted" style={{ marginTop: 4 }}>{r.authority}</div>
                      <Source source={r.source} url={r.sourceUrl} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <h2>Passo 18 — proteção do que você construiu</h2>
      <div className="grid g2">
        <Card title="Estrutura fiscal e contratual">
          <div className="stack">
            <Check label="CNPJ aberto com CNAE adequado (7319-0/02 promoção de vendas)" checked={c.audit.legal.cnpj} onChange={(v) => setAudit({ legal: { ...c.audit.legal, cnpj: v } })} hint="Afiliado digital em regra NÃO cabe no MEI." />
            <Check label="W-8BEN entregue ao pagador americano" checked={c.audit.legal.w8ben} onChange={(v) => setAudit({ legal: { ...c.audit.legal, w8ben: v } })} hint="Sem ele a rede retém 30% na fonte." />
            <Check label="Contrato/termos assinados (rede, revisor local, parceiros)" checked={c.audit.legal.contract} onChange={(v) => setAudit({ legal: { ...c.audit.legal, contract: v } })} />
            <Select
              label="Regime tributário em uso"
              value={c.audit.legal.taxRegime}
              onChange={(v) => setAudit({ legal: { ...c.audit.legal, taxRegime: v } })}
              options={[
                { value: '', label: '— selecione —' },
                { value: 'pf', label: 'Pessoa física (IRPF até 27,5% + INSS)' },
                { value: 'simples3', label: 'Simples Nacional — Anexo III (a partir de 6%, exige Fator R ≥ 28%)' },
                { value: 'simples5', label: 'Simples Nacional — Anexo V (a partir de 15,5%)' },
                { value: 'presumido', label: 'Lucro Presumido (~13,3–16,3%)' },
                { value: 'exterior', label: 'Estrutura no exterior' },
              ]}
            />
          </div>
          <div className="divider" />
          <div className="small dim">
            Comissão vinda do exterior é exportação de serviço: <strong>ISS e PIS/COFINS isentos</strong> (LC 116/2003,
            art. 2º, I), IRPJ/CSLL seguem o regime e o <strong>IOF de câmbio é 0,38%</strong>. Some o IOF ao custo da
            operação — ele corrói margem apertada.
          </div>
          <Source source="ContabilidadeZen — Contabilidade para afiliado digital 2026" url="https://www.contabilidadezen.com.br/blog/contabilidade-afiliado-digital-pj-2026/" />
          <div className="tiny muted" style={{ marginTop: 8 }}>
            Assinatura de contrato: <code>docusealco/docuseal</code> (18.637★, AGPL-3.0) ou <code>documenso/documenso</code>{' '}
            (15.280★, AGPL-3.0). Veja em <a href="#/stack">Stack OSS</a>.
          </div>
        </Card>

        <Card title="Custo de errar aqui" hint="Por que este módulo não é opcional">
          <ul className="small dim" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }}>
            <li>
              <strong>FTC:</strong> multa civil de até <strong>US$ 53.088 por violação</strong>, e cada link sem disclosure
              pode contar como violação separada. Marca e criador respondem juntos desde a revisão de outubro de 2023.
            </li>
            <li>
              <strong>Amazon:</strong> a frase é literal — <em>"As an Amazon Associate, I earn from qualifying purchases."</em>{' '}
              Sem ela, encerramento e confisco das comissões acumuladas.
            </li>
            <li>
              <strong>ClickBank:</strong> 7,5% + US$ 1 saem do valor da venda <em>antes</em> do split, US$ 2,50 por ciclo de
              pagamento e US$ 35 por wire internacional. Em margem apertada isso vira o lucro.
            </li>
            <li>
              <strong>Google Ads:</strong> landing que só redireciona para a rede é doorway page — derruba a conta inteira,
              não só o anúncio.
            </li>
          </ul>
          <div className="divider" />
          <Callout tone="info">
            Nada aqui substitui parecer jurídico. É um checklist operacional para você chegar à conversa com o contador e
            o advogado sabendo exatamente o que perguntar.
          </Callout>
        </Card>
      </div>
    </>
  );
}
