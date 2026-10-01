import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { NETWORKS } from '../lib/networks';
import type { AppState, Campaign } from '../lib/types';

const KEY = 'valida-os:v1';

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function emptyCampaign(name = 'Campanha sem nome'): Campaign {
  return {
    id: uid('cmp'),
    name,
    createdAt: new Date().toISOString(),
    status: 'rascunho',
    offer: {
      id: uid('off'),
      name: '',
      network: 'clickbank',
      price: 47,
      commissionMode: 'percent',
      commissionValue: 50,
      // Explícito desde o início: a taxa da rede é o que transforma comissão bruta em líquida.
      networkFeePercent: NETWORKS.clickbank.feePercent,
      networkFeeFixed: NETWORKS.clickbank.feeFixed,
      payoutFee: NETWORKS.clickbank.payoutFee,
      refundRate: 8,
      geoTier: 'T1',
      vertical: 'info_product',
      channel: 'meta',
      notes: '',
    },
    traffic: {
      channel: 'meta',
      cpc: 1.18,
      ctr: 1.72,
      cvr: 1.5,
      dailyBudget: 50,
    },
    angle: { statement: '', promise: '', audience: '', proof: '', channelRationale: '' },
    tracking: {
      subIdScheme: '',
      landingUrl: '',
      postbackUrl: '',
      pixelInstalled: false,
      networkPostbackConfigured: false,
      s2sTested: false,
    },
    compliance: { geos: [], checkedRuleIds: [], disclosureText: '' },
    audit: {
      competitors: [
        { name: '', angle: '', channel: '', offer: '', gap: '' },
        { name: '', angle: '', channel: '', offer: '', gap: '' },
        { name: '', angle: '', channel: '', offer: '', gap: '' },
        { name: '', angle: '', channel: '', offer: '', gap: '' },
        { name: '', angle: '', channel: '', offer: '', gap: '' },
      ],
      saturationNote: '',
      networkTermsRead: false,
      logisticsChecked: false,
      legal: { cnpj: false, w8ben: false, contract: false, taxRegime: '' },
    },
    creatives: [
      { id: 'cr1', name: 'Variação A', hook: '', format: 'antes/depois', status: 'ideia' },
      { id: 'cr2', name: 'Variação B', hook: '', format: 'depoimento', status: 'ideia' },
      { id: 'cr3', name: 'Variação C', hook: '', format: 'demonstração', status: 'ideia' },
    ],
    cutMetrics: { minCtr: 1, maxCpa: 40, minEpc: 1.18, minImpressions: 1000 },
    snapshots: [],
  };
}

function initialState(): AppState {
  const demo = emptyCampaign('Exemplo — suplemento T1 via Meta');
  demo.offer.name = 'Suplemento ômega-3 ( ClickBank )';
  demo.offer.price = 69;
  demo.offer.commissionValue = 65;
  demo.offer.vertical = 'health';
  demo.offer.channel = 'meta';
  demo.traffic = { channel: 'meta', cpc: 1.25, ctr: 1.8, cvr: 1.8, dailyBudget: 100 };
  demo.angle = {
    statement: 'Colesterol sob controle sem cortar o que você gosta de comer',
    promise: 'Marcadores de lipídios revistos em 90 dias com o protocolo de 3 passos',
    audience: 'Homens 45+ com primeiro exame alterado',
    proof: 'Estudo randomizado indexado + 412 depoimentos com laudo',
    channelRationale: 'Meta alcança o público por interesse em saúde sem exigir busca ativa',
  };
  demo.compliance.geos = ['US'];
  demo.compliance.disclosureText =
    'Paid link: I earn a commission for purchases made through links in this page, at no extra cost to you. Resultados variam.';
  demo.tracking.landingUrl = 'https://exemplo.com/omega3';
  demo.tracking.subIdScheme = 'omega3_us_homens45_antesdepois';
  demo.snapshots = [
    {
      at: new Date(Date.now() - 86400000 * 2).toISOString(),
      label: 'Dia 1',
      impressions: 14200,
      clicks: 268,
      conversions: 4,
      spend: 336,
      revenue: 168,
    },
    {
      at: new Date(Date.now() - 86400000).toISOString(),
      label: 'Dia 2',
      impressions: 16100,
      clicks: 322,
      conversions: 6,
      spend: 398,
      revenue: 252,
    },
    {
      at: new Date().toISOString(),
      label: 'Dia 3',
      impressions: 15400,
      clicks: 341,
      conversions: 7,
      spend: 421,
      revenue: 294,
    },
  ];
  demo.testStartedAt = new Date(Date.now() - 86400000 * 2).toISOString();
  demo.status = 'testando';

  return {
    ...baseState(),
    campaigns: [demo],
    activeCampaignId: demo.id,
    tasks: { 'step-s1': true, 'step-s2': true, 'step-s11': true },
  };
}

type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'campaign/add' }
  | { type: 'campaign/duplicate'; id: string }
  | { type: 'campaign/remove'; id: string }
  | { type: 'campaign/select'; id: string }
  | { type: 'campaign/patch'; id: string; patch: Partial<Campaign> }
  | { type: 'campaign/offer'; id: string; patch: Partial<Campaign['offer']> }
  | { type: 'campaign/traffic'; id: string; patch: Partial<Campaign['traffic']> }
  | { type: 'campaign/angle'; id: string; patch: Partial<Campaign['angle']> }
  | { type: 'campaign/tracking'; id: string; patch: Partial<Campaign['tracking']> }
  | { type: 'campaign/compliance'; id: string; patch: Partial<Campaign['compliance']> }
  | { type: 'campaign/audit'; id: string; patch: Partial<Campaign['audit']> }
  | { type: 'campaign/cut'; id: string; patch: Partial<Campaign['cutMetrics']> }
  | { type: 'campaign/scale'; id: string; scale: Campaign['scale'] }
  | { type: 'campaign/snapshot'; id: string; snap: Campaign['snapshots'][number] }
  | { type: 'campaign/startTest'; id: string }
  | { type: 'campaign/decision'; id: string; decision: Campaign['decision'] }
  | { type: 'task/toggle'; taskId: string }
  | { type: 'plan/set'; plan: AppState['plan'] }
  | { type: 'workspace/patch'; patch: Partial<AppState['workspace']> }
  | { type: 'reset' };

/** Estado base sem campanha — usado como molde na migração e no reset. */
function baseState(): AppState {
  return {
    campaigns: [],
    activeCampaignId: null,
    tasks: {},
    plan: 'free',
    workspace: { currency: 'USD', usdRate: 1, ownerEmail: '' },
    referralCode: uid('ref').toUpperCase().slice(0, 8),
  };
}

/** Preenche campos adicionados em versões novas para estados salvos no navegador. */
function migrate(state: AppState): AppState {
  const shell = baseState();
  const base = emptyCampaign();
  return {
    ...shell,
    ...state,
    workspace: { ...shell.workspace, ...(state.workspace ?? {}) },
    campaigns: (state.campaigns ?? []).map((c) => ({
      ...base,
      ...c,
      offer: {
        ...base.offer,
        ...(c.offer ?? {}),
        // Campanhas antigas podiam não ter taxa: assume o padrão da rede escolhida.
        networkFeePercent:
          c.offer?.networkFeePercent ?? NETWORKS[c.offer?.network ?? 'clickbank'].feePercent,
        networkFeeFixed: c.offer?.networkFeeFixed ?? NETWORKS[c.offer?.network ?? 'clickbank'].feeFixed,
      },
      traffic: { ...base.traffic, ...(c.traffic ?? {}) },
      angle: { ...base.angle, ...(c.angle ?? {}) },
      tracking: { ...base.tracking, ...(c.tracking ?? {}) },
      compliance: { ...base.compliance, ...(c.compliance ?? {}) },
      audit: { ...base.audit, ...(c.audit ?? {}), legal: { ...base.audit.legal, ...(c.audit?.legal ?? {}) } },
      creatives: c.creatives?.length ? c.creatives : base.creatives,
      cutMetrics: { ...base.cutMetrics, ...(c.cutMetrics ?? {}) },
      snapshots: c.snapshots ?? [],
    })),
  };
}

function reducer(state: AppState, action: Action): AppState {
  const map = (fn: (c: Campaign) => Campaign): AppState => ({
    ...state,
    campaigns: state.campaigns.map((c) => (c.id === idOf(action) ? fn(c) : c)),
  });
  const idOf = (a: Action): string => ('id' in a ? a.id : '');

  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'campaign/add': {
      const c = emptyCampaign(`Campanha ${state.campaigns.length + 1}`);
      return { ...state, campaigns: [...state.campaigns, c], activeCampaignId: c.id };
    }
    case 'campaign/duplicate': {
      const src = state.campaigns.find((c) => c.id === action.id);
      if (!src) return state;
      const copy: Campaign = {
        ...structuredClone(src),
        id: uid('cmp'),
        name: `${src.name} (cópia)`,
        createdAt: new Date().toISOString(),
        status: 'rascunho',
        snapshots: [],
        decision: undefined,
        testStartedAt: undefined,
      };
      return { ...state, campaigns: [...state.campaigns, copy], activeCampaignId: copy.id };
    }
    case 'campaign/remove': {
      const campaigns = state.campaigns.filter((c) => c.id !== action.id);
      return {
        ...state,
        campaigns,
        activeCampaignId:
          state.activeCampaignId === action.id ? (campaigns[0]?.id ?? null) : state.activeCampaignId,
      };
    }
    case 'campaign/select':
      return { ...state, activeCampaignId: action.id };
    case 'campaign/patch':
      return map((c) => ({ ...c, ...action.patch }));
    case 'campaign/offer':
      return map((c) => ({ ...c, offer: { ...c.offer, ...action.patch } }));
    case 'campaign/traffic':
      return map((c) => ({ ...c, traffic: { ...c.traffic, ...action.patch } }));
    case 'campaign/angle':
      return map((c) => ({ ...c, angle: { ...c.angle, ...action.patch } }));
    case 'campaign/tracking':
      return map((c) => ({ ...c, tracking: { ...c.tracking, ...action.patch } }));
    case 'campaign/compliance':
      return map((c) => ({ ...c, compliance: { ...c.compliance, ...action.patch } }));
    case 'campaign/audit':
      return map((c) => ({ ...c, audit: { ...c.audit, ...action.patch } }));
    case 'campaign/cut':
      return map((c) => ({ ...c, cutMetrics: { ...c.cutMetrics, ...action.patch } }));
    case 'campaign/scale':
      return map((c) => ({ ...c, scale: action.scale }));
    case 'campaign/snapshot':
      return map((c) => ({ ...c, snapshots: [...c.snapshots, action.snap] }));
    case 'campaign/startTest':
      return map((c) => ({ ...c, testStartedAt: new Date().toISOString(), status: 'testando' }));
    case 'campaign/decision':
      return map((c) => ({ ...c, decision: action.decision }));
    case 'task/toggle':
      return { ...state, tasks: { ...state.tasks, [action.taskId]: !state.tasks[action.taskId] } };
    case 'plan/set':
      return { ...state, plan: action.plan };
    case 'workspace/patch':
      return { ...state, workspace: { ...state.workspace, ...action.patch } };
    case 'reset':
      return initialState();
    default:
      return state;
  }
}

export const PLAN_LIMITS = {
  free: { campaigns: 1, snapshots: 3, export: false, benchmark: 'resumo', seats: 1, label: 'Grátis' },
  pro: { campaigns: 25, snapshots: 999, export: true, benchmark: 'completo', seats: 1, label: 'Pro' },
  agency: { campaigns: 999, snapshots: 999, export: true, benchmark: 'completo', seats: 10, label: 'Agência' },
} as const;

const StoreContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        if (parsed && Array.isArray(parsed.campaigns)) {
          dispatch({ type: 'hydrate', state: migrate(parsed) });
        }
      }
    } catch {
      /* estado corrompido: segue com o inicial */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota cheia: ignora */
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore fora do StoreProvider');
  return ctx;
}

export function useActiveCampaign(): Campaign | null {
  const { state } = useStore();
  return state.campaigns.find((c) => c.id === state.activeCampaignId) ?? state.campaigns[0] ?? null;
}
