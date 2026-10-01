import { useState } from 'react';
import { Badge, Callout, Card, Select, Stat } from '../components/ui';
import { CATALOG_SNAPSHOT, HF_ASSETS, OSS_TOOLS } from '../lib/catalog';

const LETTERS = [
  { value: 'all', label: 'Todas as letras' },
  { value: 'V', label: 'V — demanda e comissão' },
  { value: 'A', label: 'A — auditoria, compliance e escala' },
  { value: 'L', label: 'L — ângulo e canal' },
  { value: 'I', label: 'I — instrumentação' },
  { value: 'D', label: 'D — decisão' },
];

export default function Stack() {
  const [letter, setLetter] = useState<string>('all');
  const [kind, setKind] = useState<'all' | 'self' | 'managed'>('all');

  const tools = OSS_TOOLS.filter((t) => (letter === 'all' || t.letter === letter) && (kind === 'all' || (kind === 'self' ? t.stars < 5000 : t.stars >= 5000)));
  const models = HF_ASSETS.filter((a) => letter === 'all' || a.letter === letter);

  return (
    <>
      <p className="lead">
        Você não precisa pagar Voluum, RedTrack e um CRM no primeiro teste. Existe infraestrutura aberta para quase todo
        passo do método — o trabalho é saber qual peça encaixa em qual letra. Abaixo, cada item vem com estrelas, licença,
        último push e a ressalva que importa.
      </p>

      <div className="grid g4">
        <Stat k="Repositórios" v={OSS_TOOLS.length} note="verificados via API do GitHub" />
        <Stat k="Ativos Hugging Face" v={HF_ASSETS.length} note="verificados via API do HF" />
        <Stat k="Snapshot" v={CATALOG_SNAPSHOT} note="estrelas e datas mudam" />
        <Stat k="Custo de licença" v="US$ 0" note="licenças AGPL/MIT/Apache — leia antes de revender" />
      </div>

      <div className="grid g2" style={{ marginTop: 12 }}>
        <Select label="Filtrar por letra do método" value={letter} onChange={setLetter} options={LETTERS} />
        <Select
          label="Tamanho do projeto"
          value={kind}
          onChange={setKind}
          options={[
            { value: 'all', label: 'Todos' },
            { value: 'managed', label: 'Maduros (5.000★+)' },
            { value: 'self', label: 'Pequenos / de referência (<5.000★)' },
          ]}
        />
      </div>

      <h2>Repositórios no GitHub</h2>
      <div className="grid g2">
        {tools.map((t) => (
          <Card key={t.repo} title={t.repo} hint={t.step} right={<Badge tone="ghost">{t.letter}</Badge>}>
            <div className="row" style={{ gap: 6, marginBottom: 8 }}>
              <Badge tone="ok">{t.stars.toLocaleString('pt-BR')}★</Badge>
              <Badge tone="ghost">{t.license}</Badge>
              <Badge tone="ghost">push {t.lastPush}</Badge>
            </div>
            <div className="small dim">{t.what}</div>
            <div className="small" style={{ marginTop: 8, color: 'var(--accent)' }}>
              <strong>Como usar no método:</strong> {t.howToUse}
            </div>
            <div className="small pit" style={{ marginTop: 6 }}>
              <strong>Ressalva:</strong> {t.caution}
            </div>
            <a className="btn btn--sm" style={{ marginTop: 10 }} href={t.url} target="_blank" rel="noreferrer noopener">
              Abrir repositório →
            </a>
          </Card>
        ))}
        {tools.length === 0 && <Callout tone="warn">Nenhum repositório com esse filtro.</Callout>}
      </div>

      <h2>Hugging Face</h2>
      <div className="grid g2">
        {models.map((a) => (
          <Card key={a.id} title={a.id} hint={a.step} right={<Badge tone="violet">{a.letter}</Badge>}>
            <div className="row" style={{ gap: 6, marginBottom: 8 }}>
              <Badge tone={a.kind === 'model' ? 'info' : 'ghost'}>{a.kind === 'model' ? 'modelo' : 'dataset'}</Badge>
              <Badge tone="ghost">{a.license}</Badge>
            </div>
            <div className="tiny muted">{a.meta}</div>
            <div className="small dim" style={{ marginTop: 6 }}>{a.what}</div>
            <div className="small" style={{ marginTop: 8, color: 'var(--accent)' }}>
              <strong>Como usar no método:</strong> {a.howToUse}
            </div>
            <div className="small pit" style={{ marginTop: 6 }}>
              <strong>Ressalva:</strong> {a.caution}
            </div>
            <a className="btn btn--sm" style={{ marginTop: 10 }} href={a.url} target="_blank" rel="noreferrer noopener">
              Abrir no Hugging Face →
            </a>
          </Card>
        ))}
        {models.length === 0 && <Callout tone="warn">Nenhum ativo com esse filtro.</Callout>}
      </div>

      <h2>Stack mínima para o primeiro teste</h2>
      <Card title="O que dá para rodar com US$ 0 de software" hint="Custo real do teste é mídia, não ferramenta">
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th>Letra</th>
                <th>Necessidade</th>
                <th>Opção paga</th>
                <th>Opção aberta</th>
                <th>Quando migrar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>V</td>
                <td>Medir demanda</td>
                <td>Semrush, Ahrefs</td>
                <td>Google Trends + <code>pat310/google-trends-api</code></td>
                <td>Quando precisar de volume absoluto e dificuldade de keyword</td>
              </tr>
              <tr>
                <td>L</td>
                <td>Landing e funil</td>
                <td>ClickFunnels, System.io</td>
                <td><code>unfolding-io/StarFunnel</code> + <code>knadh/listmonk</code></td>
                <td>Quando o volume justificar entregabilidade gerenciada</td>
              </tr>
              <tr>
                <td>I</td>
                <td>Rastreamento</td>
                <td>Voluum, RedTrack, Bemob</td>
                <td><code>dubinc/dub</code> + <code>umami-software/umami</code></td>
                <td>Quando precisar de postback em escala e anti-fraude</td>
              </tr>
              <tr>
                <td>D</td>
                <td>Teste A/B</td>
                <td>Optimizely, VWO</td>
                <td><code>growthbook/growthbook</code></td>
                <td>Raramente — o self-hosted atende bem</td>
              </tr>
              <tr>
                <td>A</td>
                <td>Relatórios e automação</td>
                <td>Zapier, Looker Studio</td>
                <td><code>n8n-io/n8n</code> + <code>kestra-io/kestra</code></td>
                <td>Quando o n8n fair-code limitar a revenda</td>
              </tr>
              <tr>
                <td>A</td>
                <td>Contratos</td>
                <td>DocuSign</td>
                <td><code>docusealco/docuseal</code></td>
                <td>Quando precisar de fluxo jurídico complexo</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout tone="info" title="A conta que ninguém faz">
          Um tracker pago custa de US$ 50 a US$ 300 por mês. Se o seu orçamento de teste é US$ 150, a ferramenta é 30–200%
          do teste. Comece aberto, migre quando a operação pagar.
        </Callout>
      </Card>
    </>
  );
}
