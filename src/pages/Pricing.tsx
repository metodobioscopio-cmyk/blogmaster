import { useState } from 'react';
import { Badge, Callout, Card, CopyButton, Stat, toast } from '../components/ui';
import { PLAN_LIMITS, useStore } from '../state/store';

const PRICES = {
  free: { brl: 0, usd: 0 },
  pro: { brl: 47, usd: 12 },
  agency: { brl: 147, usd: 37 },
};

const FEATURES: Record<string, string[]> = {
  free: [
    '1 campanha ativa',
    'Até 3 registros de teste',
    'Calculadoras de break-even, amostra e escala',
    'Motor de compliance com 21 regras',
    'Base de benchmarks 2026 com fonte',
    'Template «Campanha Validada em 14 Dias»',
  ],
  pro: [
    'Tudo do Grátis',
    '25 campanhas ativas',
    'Registros de teste ilimitados',
    'Exportação de relatório e CSV',
    'Calibração automática da régua pelo benchmark',
    'Atualização trimestral da base de benchmarks',
  ],
  agency: [
    'Tudo do Pro',
    'Campanhas ilimitadas',
    '10 assentos no workspace',
    'Relatório com sua marca',
    'Importação de dados em lote (CSV)',
    'Prioridade em novas integrações',
  ],
};

export default function Pricing() {
  const { state, dispatch } = useStore();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const isBrl = state.workspace.currency === 'BRL';

  const price = (plan: 'free' | 'pro' | 'agency') => {
    const base = isBrl ? PRICES[plan].brl : PRICES[plan].usd;
    const value = billing === 'yearly' ? Math.round(base * 10) : base;
    return `${isBrl ? 'R$' : 'US$'} ${value}`;
  };

  const checkout = async (plan: 'pro' | 'agency') => {
    setLoading(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing, referral: state.referralCode }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.demo) {
        dispatch({ type: 'plan/set', plan });
        toast(`Modo demonstração: plano ${PLAN_LIMITS[plan].label} ativado localmente (Stripe não configurado neste ambiente).`);
      } else {
        toast(data.error ?? 'Não foi possível abrir o checkout.');
      }
    } catch {
      dispatch({ type: 'plan/set', plan });
      toast('API offline — plano ativado localmente em modo demonstração.');
    } finally {
      setLoading(null);
    }
  };

  const referralUrl = `${window.location.origin}${window.location.pathname}?ref=${state.referralCode}`;

  return (
    <>
      <p className="lead">
        O VALIDA OS se paga com a primeira campanha que você <strong>não</strong> sobe. Um teste de 72 horas mal decidido
        custa o valor de um ano de Pro — e é exatamente isso que o motor de corte evita.
      </p>

      <div className="row" style={{ marginBottom: 14 }}>
        <button className={`btn btn--sm ${billing === 'monthly' ? 'btn--primary' : ''}`} type="button" onClick={() => setBilling('monthly')}>
          Mensal
        </button>
        <button className={`btn btn--sm ${billing === 'yearly' ? 'btn--primary' : ''}`} type="button" onClick={() => setBilling('yearly')}>
          Anual (2 meses grátis)
        </button>
        <span className="tiny muted">Preços em {isBrl ? 'reais' : 'dólares'} — troque a moeda em Ajustes.</span>
      </div>

      <div className="grid g3">
        {(['free', 'pro', 'agency'] as const).map((plan) => {
          const limits = PLAN_LIMITS[plan];
          const current = state.plan === plan;
          return (
            <div className={`price ${plan === 'pro' ? 'price--hot' : ''}`} key={plan}>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{limits.label}</strong>
                {plan === 'pro' && <Badge tone="ok">mais escolhido</Badge>}
                {current && <Badge tone="info">seu plano</Badge>}
              </div>
              <div className="price__v">
                {price(plan)}
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-mute)' }}>
                  {plan === 'free' ? '' : billing === 'yearly' ? '/ano' : '/mês'}
                </span>
              </div>
              <ul>
                {FEATURES[plan].map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div style={{ marginTop: 'auto' }}>
                {plan === 'free' ? (
                  <button className="btn" type="button" disabled={current} onClick={() => dispatch({ type: 'plan/set', plan: 'free' })}>
                    {current ? 'Plano atual' : 'Voltar para o Grátis'}
                  </button>
                ) : (
                  <button className={`btn ${plan === 'pro' ? 'btn--primary' : ''}`} type="button" disabled={current || loading === plan} onClick={() => checkout(plan)}>
                    {loading === plan ? 'Abrindo checkout…' : current ? 'Plano atual' : `Assinar ${limits.label}`}
                  </button>
                )}
              </div>
              <div className="tiny muted">
                {limits.campaigns >= 999
                  ? 'Campanhas ilimitadas'
                  : `${limits.campaigns} campanha(s) · ${limits.seats} assento(s)`}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid g2" style={{ marginTop: 14 }}>
        <Card title="Programa de indicação do próprio app" hint="O método aplicado a si mesmo">
          <div className="small dim">
            Indique o VALIDA OS e receba <strong>30% recorrente</strong> por 12 meses. O link abaixo já sai com UTM e
            sub-ID no esquema que o Passo 9 ensina — é o mesmo padrão que você usa para as suas campanhas.
          </div>
          <div className="divider" />
          <div className="grid g3" style={{ gap: 8 }}>
            <Stat k="Seu código" v={state.referralCode} />
            <Stat k="Comissão" v="30%" note="recorrente por 12 meses" />
            <Stat k="Cookie" v="90 dias" note="last click" />
          </div>
          <input readOnly value={referralUrl} style={{ marginTop: 10 }} />
          <div className="row" style={{ marginTop: 8 }}>
            <CopyButton text={referralUrl} label="Copiar link" />
            <CopyButton
              text={`${referralUrl}&utm_source=afiliado&utm_medium=indicacao&utm_campaign=valida-os&subid=${state.referralCode}`}
              label="Copiar com UTM"
            />
          </div>
          <Callout tone="info" title="Disclosure vale aqui também">
            Ao divulgar este link, use o texto gerado no módulo de auditoria. A regra da FTC não tem exceção para
            indicar software.
          </Callout>
        </Card>

        <Card title="Como a cobrança funciona">
          <ul className="small dim" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 7 }}>
            <li>
              Checkout via Stripe (Cartões, Apple Pay, Google Pay; Pix quando a conta for brasileira). As chaves ficam no
              servidor em <code>STRIPE_SECRET_KEY</code> — nunca no navegador.
            </li>
            <li>
              Sem chaves configuradas, o app entra em <strong>modo demonstração</strong>: o plano é ativado localmente e
              nenhuma cobrança é feita. É assim que este ambiente está rodando agora.
            </li>
            <li>Cancelamento a qualquer momento, sem multa. Os dados continuam exportáveis em JSON e CSV.</li>
            <li>
              Impostos: se você comprar do Brasil para uma empresa no exterior, incide IOF de câmbio de 0,38% — o mesmo
              ponto que o módulo de auditoria pede para você não esquecer na sua operação.
            </li>
          </ul>
          <div className="divider" />
          <div className="row">
            <Badge tone={state.plan === 'free' ? 'ghost' : 'ok'}>Plano atual: {PLAN_LIMITS[state.plan].label}</Badge>
            <button className="btn btn--sm" type="button" onClick={() => dispatch({ type: 'plan/set', plan: 'free' })}>
              Voltar para o Grátis
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
