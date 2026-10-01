import { scoreCampaign } from '../lib/offerScore';
import { PLAN_LIMITS, useActiveCampaign, useStore } from '../state/store';
import { toast } from './ui';

export type RouteId =
  | 'dashboard'
  | 'demand'
  | 'audit'
  | 'angle'
  | 'tracking'
  | 'decide'
  | 'scale'
  | 'test72'
  | 'plan14'
  | 'benchmarks'
  | 'stack'
  | 'export'
  | 'pricing'
  | 'settings';

export const ROUTES: Array<{ id: RouteId; k?: string; label: string; title: string; sub: string; group: string }> = [
  { id: 'dashboard', label: 'Console', title: 'Console de validação', sub: 'Onde a campanha está e o que falta fazer', group: 'geral' },
  { id: 'demand', k: 'V', label: 'Demanda & comissão', title: 'V — Verificar demanda e comissão', sub: 'Passos 1, 2, 4 e 5 · a matemática que mata oferta ruim antes do clique', group: 'metodo' },
  { id: 'audit', k: 'A', label: 'Auditoria & compliance', title: 'A — Auditar concorrência e compliance', sub: 'Passos 3, 6 e 18 · concorrência, leis e proteção', group: 'metodo' },
  { id: 'angle', k: 'L', label: 'Ângulo & canal', title: 'L — Ligar ângulo, oferta e canal', sub: 'Passos 7, 8, 11 e 12 · um ângulo, um canal, um idioma', group: 'metodo' },
  { id: 'tracking', k: 'I', label: 'Instrumentação', title: 'I — Instrumentar funil e rastreamento', sub: 'Passos 9 e 10 · UTM, sub-ID, postback e pixel', group: 'metodo' },
  { id: 'decide', k: 'D', label: 'Decisão por métrica', title: 'D — Decidir com métricas de corte', sub: 'Passos 13 e 15 · régua de corte, amostra e veredito', group: 'metodo' },
  { id: 'scale', k: 'A', label: 'Ampliação', title: 'A — Ampliar o que lucra', sub: 'Passos 17 e 19 · degraus de 20% e guarda de CPA', group: 'metodo' },
  { id: 'test72', label: 'Teste de 72h', title: 'Teste de 72 horas', sub: 'Passo 14 · rode sem mexer, registre e corte', group: 'operacao' },
  { id: 'plan14', label: 'Plano de 14 dias', title: 'Plano de 14 dias', sub: 'Os 19 passos em sequência, com armadilha e exemplo', group: 'operacao' },
  { id: 'export', label: 'Relatório & template', title: 'Relatório e template', sub: 'Passo 16 · documente o que funcionou', group: 'operacao' },
  { id: 'benchmarks', label: 'Benchmarks 2026', title: 'Base de benchmarks', sub: 'CTR, CPC, CPA e CPM por canal, vertical e geografia — com fonte', group: 'dados' },
  { id: 'stack', label: 'Stack OSS & HF', title: 'Stack open-source e Hugging Face', sub: 'Ferramentas verificadas para cada passo do método', group: 'dados' },
  { id: 'pricing', label: 'Planos', title: 'Planos e checkout', sub: 'Do teste único à operação de agência', group: 'conta' },
  { id: 'settings', label: 'Ajustes', title: 'Ajustes do workspace', sub: 'Moeda, câmbio, dados e programa de indicação', group: 'conta' },
];

const GROUPS: Array<{ id: string; label: string }> = [
  { id: 'geral', label: '' },
  { id: 'metodo', label: 'Método V.A.L.I.D.A.' },
  { id: 'operacao', label: 'Operação' },
  { id: 'dados', label: 'Dados' },
  { id: 'conta', label: 'Conta' },
];

export function Sidebar({ route, go }: { route: RouteId; go: (r: RouteId) => void }) {
  const { state, dispatch } = useStore();
  const campaign = useActiveCampaign();
  const score = campaign ? scoreCampaign(campaign) : null;
  const limits = PLAN_LIMITS[state.plan];

  const addCampaign = () => {
    if (state.campaigns.length >= limits.campaigns) {
      toast(`O plano ${limits.label} permite ${limits.campaigns} campanha(s). Faça upgrade em Planos.`);
      go('pricing');
      return;
    }
    dispatch({ type: 'campaign/add' });
  };

  return (
    <aside className="shell__side">
      <div className="brand">
        <div className="brand__mark">V</div>
        <div>
          <div className="brand__name">VALIDA OS</div>
          <div className="brand__sub">método V.A.L.I.D.A. aplicado</div>
        </div>
      </div>

      <div className="card card--tight" style={{ marginBottom: 10 }}>
        <label className="tiny muted" style={{ display: 'block', marginBottom: 5 }}>
          Campanha ativa
        </label>
        <select
          value={campaign?.id ?? ''}
          onChange={(e) => dispatch({ type: 'campaign/select', id: e.target.value })}
          style={{ marginBottom: 8 }}
        >
          {state.campaigns.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {score && (
          <div style={{ marginBottom: 8 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <span className="tiny muted">Score V.A.L.I.D.A.</span>
              <span className="mono tiny" style={{ fontWeight: 700 }}>
                {score.total}/100
              </span>
            </div>
            <div className={`bar ${score.total < 40 ? 'bar--bad' : score.total < 70 ? 'bar--warn' : ''}`}>
              <i style={{ width: `${score.total}%` }} />
            </div>
          </div>
        )}
        <div className="row" style={{ gap: 6 }}>
          <button className="btn btn--sm" onClick={addCampaign} type="button">
            + Nova
          </button>
          {campaign && (
            <>
              <button
                className="btn btn--sm"
                type="button"
                onClick={() => dispatch({ type: 'campaign/duplicate', id: campaign.id })}
              >
                Duplicar
              </button>
              <button
                className="btn btn--sm btn--danger"
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${campaign.name}"?`)) dispatch({ type: 'campaign/remove', id: campaign.id });
                }}
              >
                Excluir
              </button>
            </>
          )}
        </div>
      </div>

      {GROUPS.map((g) => {
        const items = ROUTES.filter((r) => r.group === g.id);
        if (!items.length) return null;
        return (
          <div key={g.id}>
            {g.label && <div className="nav-group">{g.label}</div>}
            {items.map((r) => (
              <a
                key={r.id}
                className={`nav-item ${route === r.id ? 'nav-item--on' : ''}`}
                href={`#/${r.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(r.id);
                }}
              >
                {r.k && <span className="nav-item__k">{r.k}</span>}
                <span>{r.label}</span>
              </a>
            ))}
          </div>
        );
      })}
    </aside>
  );
}
