import { useState } from 'react';
import { Badge, Callout, Card, CopyButton, Stat, Text, toast } from '../components/ui';
import { campaignReport, templateMarkdown } from '../lib/report';
import { useActiveCampaign, useStore } from '../state/store';

function download(filename: string, content: string, type = 'text/markdown;charset=utf-8') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export default function ExportPage() {
  const { state, dispatch } = useStore();
  const c = useActiveCampaign();
  const [report, setReport] = useState('');
  const [email, setEmail] = useState(state.workspace.ownerEmail);
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  if (!c) return null;

  const generate = () => {
    const md = campaignReport(c, state);
    setReport(md);
    toast('Relatório gerado.');
  };

  const claimTemplate = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast('Informe um e-mail válido para receber o template.');
      return;
    }
    if (!consent) {
      toast('Confirme o consentimento — sem base legal a captura não pode acontecer (LGPD art. 7º).');
      return;
    }
    setSending(true);
    let status = 'local';
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'template-14-dias', referral: state.referralCode }),
      });
      status = res.ok ? 'servidor' : `servidor indisponível (${res.status}) — arquivo liberado mesmo assim`;
    } catch {
      status = 'offline — arquivo liberado mesmo assim';
    }
    setSending(false);
    dispatch({ type: 'workspace/patch', patch: { ownerEmail: email } });
    download('campanha-validada-14-dias-template.md', templateMarkdown());
    toast(`Template baixado (${status}).`);
  };

  return (
    <>
      <p className="lead">
        Passo 16: o que não é documentado não é replicável. O relatório abaixo é o artefato que sobra quando a campanha
        morre — e é o único motivo pelo qual o próximo teste começa melhor que este.
      </p>

      <div className="grid g2">
        <Card
          title="Relatório da campanha"
          hint={`Gerado a partir dos dados de "${c.name}"`}
          right={<button className="btn btn--sm btn--primary" type="button" onClick={generate}>Gerar relatório</button>}
        >
          <div className="row" style={{ gap: 6 }}>
            <Badge tone="ghost">{c.snapshots.length} registro(s) de teste</Badge>
            <Badge tone="ghost">{c.compliance.checkedRuleIds.length} regra(s) de compliance</Badge>
            <Badge tone="ghost">{c.creatives.length} criativo(s)</Badge>
          </div>
          {report ? (
            <>
              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn btn--sm" type="button" onClick={() => download(`relatorio-${c.name.replace(/\W+/g, '-').toLowerCase()}.md`, report)}>
                  Baixar .md
                </button>
                <CopyButton text={report} label="Copiar markdown" />
              </div>
              <pre style={{ marginTop: 10, maxHeight: 420, overflow: 'auto' }}>{report}</pre>
            </>
          ) : (
            <Callout tone="info" title="O que entra no relatório">
              Matemática da oferta, benchmark com fonte, ângulo, instrumentação, cobertura de compliance, tabela do teste de
              72h com veredito e confiança, plano de escala e os campos de aprendizado. Sai em Markdown: cola no Notion,
              vira PDF, entra no Git.
            </Callout>
          )}
        </Card>

        <Card title="Template «Campanha Validada em 14 Dias»" hint="O lead magnet do método">
          <div className="grid g3" style={{ gap: 8 }}>
            <Stat k="Blocos" v="5" note="dias 1–3, 4–6, 7–9, 10–12, 13–14" />
            <Stat k="Campos" v="28" note="todos com critério objetivo" />
            <Stat k="Formato" v=".md" note="Notion, PDF, Git" />
          </div>
          <div className="divider" />
          <Text label="Seu e-mail" value={email} onChange={setEmail} placeholder="voce@dominio.com" hint="Usado para enviar o template e as atualizações da base de benchmarks." />
          <label className="check" style={{ marginTop: 10 }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              Autorizo o contato por e-mail sobre este material. Posso cancelar a qualquer momento.
              <span className="tiny muted" style={{ display: 'block' }}>
                Base legal: consentimento (LGPD art. 7º, I). Se você vender para a UE, precisa de CMP e registro do aceite.
              </span>
            </span>
          </label>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn btn--primary" type="button" onClick={claimTemplate} disabled={sending}>
              {sending ? 'Preparando…' : 'Baixar template'}
            </button>
            <button className="btn btn--sm" type="button" onClick={() => download('campanha-validada-14-dias-template.md', templateMarkdown())}>
              Baixar sem registrar
            </button>
          </div>
          <Callout tone="info" title="Por que existe botão sem registrar">
            O método ensina que confiança converte mais que fricção. Um formulário obrigatório aqui seria incoerente com o
            que o próprio manual prega sobre disclosure e consentimento. O cadastro é opcional e o arquivo sai igual.
          </Callout>
        </Card>
      </div>

      <h2>Exportar tudo</h2>
      <Card title="Backup e portabilidade" hint="Seus dados ficam neste navegador — leve com você">
        <div className="row">
          <button
            className="btn btn--sm"
            type="button"
            onClick={() => download('valida-os-workspace.json', JSON.stringify(state, null, 2), 'application/json')}
          >
            Baixar workspace (.json)
          </button>
          <label className="btn btn--sm" style={{ cursor: 'pointer' }}>
            Restaurar backup
            <input
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const parsed = JSON.parse(await file.text());
                  if (parsed && Array.isArray(parsed.campaigns)) {
                    localStorage.setItem('valida-os:v1', JSON.stringify(parsed));
                    location.reload();
                  } else {
                    toast('Arquivo não parece um backup do VALIDA OS.');
                  }
                } catch {
                  toast('JSON inválido.');
                }
              }}
            />
          </label>
          <button
            className="btn btn--sm"
            type="button"
            onClick={() => {
              const rows = [['campanha', 'data', 'impressoes', 'cliques', 'conversoes', 'gasto', 'receita']];
              for (const camp of state.campaigns)
                for (const s of camp.snapshots)
                  rows.push([camp.name, s.at, String(s.impressions), String(s.clicks), String(s.conversions), String(s.spend), String(s.revenue)]);
              download('valida-os-dados.csv', rows.map((r) => r.map((x) => `"${x.replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv;charset=utf-8');
              toast('CSV exportado.');
            }}
          >
            Exportar dados (.csv)
          </button>
        </div>
        <div className="tiny muted" style={{ marginTop: 8 }}>
          Nada é enviado a servidor nenhum sem a sua ação. O único endpoint usado é o de captura de e-mail do template.
        </div>
      </Card>
    </>
  );
}
