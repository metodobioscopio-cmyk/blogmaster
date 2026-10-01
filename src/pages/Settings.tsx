import { useState } from 'react';
import { Badge, Callout, Card, Num, Select, Stat, Text, toast } from '../components/ui';
import { PLAN_LIMITS, useStore } from '../state/store';

const CURRENCIES = [
  { code: 'BRL', label: 'Real brasileiro (R$)', rate: 5.4 },
  { code: 'USD', label: 'Dólar americano (US$)', rate: 1 },
  { code: 'EUR', label: 'Euro (€)', rate: 0.92 },
  { code: 'GBP', label: 'Libra esterlina (£)', rate: 0.79 },
  { code: 'MXN', label: 'Peso mexicano (MX$)', rate: 18.5 },
  { code: 'PLN', label: 'Zlóti polonês (zł)', rate: 4.0 },
];

export default function Settings() {
  const { state, dispatch } = useStore();
  const [checking, setChecking] = useState<string | null>(null);

  const ping = async (path: string) => {
    setChecking(path);
    try {
      const res = await fetch(path);
      const data = await res.json();
      toast(`${path} → ${res.status} · ${JSON.stringify(data).slice(0, 120)}`);
    } catch {
      toast(`${path} → sem resposta (servidor offline?)`);
    } finally {
      setChecking(null);
    }
  };

  return (
    <>
      <p className="lead">
        Todo o cálculo do console usa a moeda e o câmbio definidos aqui. Se você opera em reais e compara com benchmark em
        dólar, o câmbio é a variável que mais distorce a leitura — mantenha atualizado.
      </p>

      <div className="grid g2">
        <Card title="Workspace">
          <div className="grid g2" style={{ gap: 10 }}>
            <Select
              label="Moeda da conta"
              value={state.workspace.currency}
              onChange={(code) => {
                const c = CURRENCIES.find((x) => x.code === code)!;
                dispatch({ type: 'workspace/patch', patch: { currency: code, usdRate: c.rate } });
                toast(`Moeda alterada para ${code} com câmbio sugerido de ${c.rate} por US$ 1. Ajuste se necessário.`);
              }}
              options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
            />
            <Num
              label="Câmbio"
              value={state.workspace.usdRate}
              onChange={(v) => dispatch({ type: 'workspace/patch', patch: { usdRate: v } })}
              step={0.01}
              hint={`Quantas unidades de ${state.workspace.currency} valem US$ 1`}
            />
          </div>
          <div className="divider" />
          <Text
            label="E-mail do responsável"
            value={state.workspace.ownerEmail}
            onChange={(v) => dispatch({ type: 'workspace/patch', patch: { ownerEmail: v } })}
            placeholder="voce@dominio.com"
            hint="Usado no template e como contato padrão. Não sai deste navegador sem a sua ação."
          />
          <div className="divider" />
          <div className="grid g3" style={{ gap: 8 }}>
            <Stat k="Plano" v={PLAN_LIMITS[state.plan].label} />
            <Stat k="Campanhas" v={`${state.campaigns.length}/${PLAN_LIMITS[state.plan].campaigns >= 999 ? '∞' : PLAN_LIMITS[state.plan].campaigns}`} />
            <Stat k="Código de indicação" v={state.referralCode} />
          </div>
        </Card>

        <Card title="Diagnóstico do ambiente" hint="Bom para saber se o backend está de pé">
          <div className="row">
            <button className="btn btn--sm" type="button" onClick={() => ping('/api/health')} disabled={checking === '/api/health'}>
              Testar /api/health
            </button>
            <button className="btn btn--sm" type="button" onClick={() => ping('/api/benchmarks?channel=meta')} disabled={checking === '/api/benchmarks?channel=meta'}>
              Testar /api/benchmarks
            </button>
            <button className="btn btn--sm" type="button" onClick={() => ping('/api/config')} disabled={checking === '/api/config'}>
              Testar /api/config
            </button>
          </div>
          <div className="divider" />
          <div className="small dim">
            <strong>Arquitetura:</strong> front (Vite + React) faz o trabalho pesado no navegador; o servidor Express
            cuida de captura de lead, base de benchmarks por API, health check e checkout Stripe. Tudo o que é dado seu
            (campanhas, testes, compliance) fica no <code>localStorage</code>.
          </div>
          <div className="divider" />
          <ul className="small dim" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 5 }}>
            <li>Benchmarks citam fonte e ano em cada linha.</li>
            <li>Multiplicadores geográficos T2/T3 são marcados como derivação própria.</li>
            <li>Valores de imposto e compliance são operacionais, não substituem contador e advogado.</li>
          </ul>
        </Card>
      </div>

      <h2>Zona de risco</h2>
      <Card title="Dados locais">
        <div className="row">
          <button
            className="btn btn--sm btn--danger"
            type="button"
            onClick={() => {
              if (confirm('Apagar TODAS as campanhas e dados deste navegador? Não há como desfazer.')) {
                dispatch({ type: 'reset' });
                toast('Workspace reiniciado com a campanha de exemplo.');
              }
            }}
          >
            Apagar tudo e recomeçar
          </button>
          <Badge tone="warn">sem confirmação em nuvem — não há backup automático</Badge>
        </div>
        <Callout tone="warn" title="Antes de apagar">
          Baixe o backup em <a href="#/export">Relatório &amp; template</a> → "Baixar workspace (.json)". O navegador pode
          limpar o localStorage sem avisar.
        </Callout>
      </Card>
    </>
  );
}
