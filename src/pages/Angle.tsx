import { Badge, Callout, Card, Check, Stat, Text, toast } from '../components/ui';
import { CHANNEL_LABEL } from '../lib/benchmarks';
import { useActiveCampaign, useStore } from '../state/store';

/** Matriz editorial: qual ângulo casa com qual canal. Posição do método, não dado publicado. */
const CHANNEL_FIT = [
  {
    channel: 'google_search',
    label: CHANNEL_LABEL.google_search,
    fit: 'Intenção declarada',
    angles: ['"melhor X para Y"', 'comparativo A vs B', 'quanto custa', 'review com defeito declarado'],
    avoid: [' storytelling emocional', 'antes/depois'],
    note: 'Quem busca já quer comprar. O criativo é a resposta, não a provocação.',
  },
  {
    channel: 'meta',
    label: CHANNEL_LABEL.meta,
    fit: 'Descoberta por interesse',
    angles: ['dor nomeada em primeira pessoa', 'demonstração em 15s', 'prova social com número'],
    avoid: ['atributos pessoais (saúde, renda)', 'promessa de resultado absoluto'],
    note: 'Retargeting entrega CTR 3,4% e CPA 55% menor — construa a lista antes de escalar.',
  },
  {
    channel: 'tiktok',
    label: CHANNEL_LABEL.tiktok,
    fit: 'Volume e atenção barata',
    angles: ['antes/depois em vídeo curto', 'demonstração crua', 'criador nativo (Spark Ads: 2,4× CTR)'],
    avoid: ['vídeo com cara de anúncio de TV', 'claim de saúde sem fonte'],
    note: 'CTR estruturalmente menor (0,61% in-feed) e CPA mais baixo. Julgue pelo benchmark do canal, não pelo do Meta.',
  },
  {
    channel: 'tiktok_shop',
    label: CHANNEL_LABEL.tiktok_shop,
    fit: 'Compra por impulso dentro do app',
    angles: ['demonstração com preço na tela', 'unboxing', 'prova de uso real'],
    avoid: ['funil longo fora do app'],
    note: 'Maior CVR publicado (3,70%) e menor CPA. Exige produto físico elegível.',
  },
  {
    channel: 'google_shopping',
    label: CHANNEL_LABEL.google_shopping,
    fit: 'Comparação de preço',
    angles: ['preço + frete + avaliação', 'bundle', 'especificação-chave no título'],
    avoid: ['copy criativa — o formato não lê copy'],
    note: 'CPC US$ 0,86 em média: barato, mas o jogo é feed e preço, não criativo.',
  },
  {
    channel: 'microsoft',
    label: CHANNEL_LABEL.microsoft,
    fit: 'Audiência mais velha e de renda maior',
    angles: ['mesmo copy do Google, tom mais sóbrio', 'B2B, finanças, saúde, jurídico'],
    avoid: ['gíria e estética jovem'],
    note: 'CPC 33% abaixo do Google e ROI de US$ 2,53 por US$ 1 gasto. O canal mais subusado do conjunto.',
  },
  {
    channel: 'seo',
    label: CHANNEL_LABEL.seo,
    fit: 'Intenção de pesquisa sem custo de clique',
    angles: ['guia definitivo', 'comparativo com tabela', 'resposta direta no topo'],
    avoid: ['página fina sem valor próprio'],
    note: 'Custo zero por clique — mas o Google exige conteúdo original na landing de afiliado.',
  },
  {
    channel: 'email',
    label: CHANNEL_LABEL.email,
    fit: 'Lista própria e repetição',
    angles: ['sequência isca → valor → oferta', 'reabertura de carrinho', 'bônus por tempo limitado'],
    avoid: ['link Amazon direto no e-mail (viola o acordo)'],
    note: 'Custo marginal ~zero. É onde a margem do afiliado mora depois do primeiro lucro.',
  },
];

const LOCALIZATION = [
  { id: 'l-native', label: 'Copy revisada por nativo (não tradução literal)' },
  { id: 'l-currency', label: 'Preço e moeda no formato local (US$ 19,90 ≠ R$ 19,90 na cabeça de ninguém)' },
  { id: 'l-date', label: 'Datas, medidas e referências culturais convertidas' },
  { id: 'l-payment', label: 'Meio de pagamento do país-alvo aceito pela oferta' },
  { id: 'l-restriction', label: 'Verifiquei se o país é permitido pela rede e pelo canal' },
  { id: 'l-holiday', label: 'Calendário local mapeado (feriado muda CPM e comportamento)' },
];

export default function Angle() {
  const { state, dispatch } = useStore();
  const c = useActiveCampaign();
  if (!c) return null;
  const setAngle = (patch: Partial<typeof c.angle>) => dispatch({ type: 'campaign/angle', id: c.id, patch });
  const fit = CHANNEL_FIT.find((f) => f.channel === c.offer.channel);
  const filled = [c.angle.statement, c.angle.promise, c.angle.audience, c.angle.proof, c.angle.channelRationale].filter(
    (v) => v.trim().length >= 8,
  ).length;

  return (
    <>
      <p className="lead">
        Passo 7: <strong>um</strong> ângulo, tudo em volta dele. Passo 11: <strong>um</strong> canal. Passo 12:{' '}
        <strong>um</strong> idioma por vez. A armadilha declarada do método é tentar estar em todos ao mesmo tempo — é por
        isso que este módulo não tem campo para "canal secundário".
      </p>

      <div className="grid g2">
        <Card
          title="Construtor de ângulo"
          hint="Cinco campos. Se um ficar vazio, o criativo fica genérico."
          right={<Badge tone={filled === 5 ? 'ok' : 'warn'}>{filled}/5 campos</Badge>}
        >
          <div className="stack">
            <Text
              label="Ângulo central"
              value={c.angle.statement}
              onChange={(v) => setAngle({ statement: v })}
              placeholder='Ruim: "investimento". Bom: "aposentadoria aos 40 sem herdar nada".'
              hint="Ângulo é uma posição. Tema é uma categoria. Só posição gera clique qualificado."
            />
            <Text
              label="Promessa específica e mensurável"
              area
              value={c.angle.promise}
              onChange={(v) => setAngle({ promise: v })}
              placeholder="O que muda, em quanto tempo, com qual evidência — sem absolutos."
            />
            <Text
              label="Público com dor nomeada"
              area
              value={c.angle.audience}
              onChange={(v) => setAngle({ audience: v })}
              placeholder='"Homens 45+ com o primeiro exame de colesterol alterado" — não "pessoas interessadas em saúde".'
            />
            <Text
              label="Prova"
              area
              value={c.angle.proof}
              onChange={(v) => setAngle({ proof: v })}
              placeholder="Dado, estudo, depoimento com laudo, demonstração. Se não tem prova, o criativo vira promessa vazia."
            />
            <Text
              label="Por que ESTE canal combina com o ângulo"
              area
              value={c.angle.channelRationale}
              onChange={(v) => setAngle({ channelRationale: v })}
              placeholder="O comportamento de compra do público acontece onde o canal o encontra?"
            />
          </div>
          <div className="divider" />
          <div className="row">
            <Stat k="Canal escolhido" v={CHANNEL_LABEL[c.offer.channel].split('(')[0]} />
            <Stat k="Adequação declarada" v={fit?.fit ?? '—'} />
          </div>
          {fit && (
            <Callout tone="info" title={fit.label}>
              <div className="small dim">
                <strong>Funciona:</strong> {fit.angles.join(' · ')}
              </div>
              <div className="small dim" style={{ marginTop: 4 }}>
                <strong>Evite:</strong> {fit.avoid.join(' · ')}
              </div>
              <div className="small" style={{ marginTop: 6 }}>{fit.note}</div>
            </Callout>
          )}
        </Card>

        <Card title="Passo 8 — funil mínimo" hint="Simples converte mais que complexo">
          <div className="stack">
            <div className="card card--tight" style={{ background: 'var(--panel-2)' }}>
              <strong className="small">1 · Isca digital</strong>
              <div className="tiny muted">Resolve um pedaço pequeno e imediato da dor. Entrega em 1 clique.</div>
            </div>
            <div className="card card--tight" style={{ background: 'var(--panel-2)' }}>
              <strong className="small">2 · E-mail</strong>
              <div className="tiny muted">3 a 5 mensagens: valor, objeção, prova, oferta. Automação só depois de validar.</div>
            </div>
            <div className="card card--tight" style={{ background: 'var(--panel-2)' }}>
              <strong className="small">3 · Oferta</strong>
              <div className="tiny muted">Aqui — e só aqui — entra o link de afiliado, com disclosure antes.</div>
            </div>
          </div>
          <Callout tone="bad" title="Armadilha explícita do Passo 8">
            Enviar tráfego direto para a página da rede. Além de perder o dado, é doorway page no Google e derruba a conta.
          </Callout>
          <div className="divider" />
          <div className="small dim">
            Stack sugerida: <code>knadh/listmonk</code> (23.643★, AGPL-3.0) para a sequência e{' '}
            <code>formbricks/formbricks</code> (13.047★) para descobrir a dor real antes de escrever o ângulo.
          </div>
        </Card>
      </div>

      <h2>Matriz de adequação ângulo × canal</h2>
      <Card>
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th>Canal</th>
                <th>O que ele é bom em</th>
                <th>Ângulos que funcionam</th>
                <th>O que reprova</th>
              </tr>
            </thead>
            <tbody>
              {CHANNEL_FIT.map((f) => (
                <tr key={f.channel} style={f.channel === c.offer.channel ? { background: 'rgba(55,224,161,.06)' } : undefined}>
                  <td>
                    <strong>{f.label}</strong>
                    {f.channel === c.offer.channel && <Badge tone="ok">seu canal</Badge>}
                    <div className="tiny muted">{f.note}</div>
                  </td>
                  <td className="small dim">{f.fit}</td>
                  <td className="small">{f.angles.join(' · ')}</td>
                  <td className="small pit">{f.avoid.join(' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tiny muted" style={{ marginTop: 8 }}>
          Matriz editorial do VALIDA OS. Os números citados vêm da base de <a href="#/benchmarks">benchmarks</a>.
        </div>
      </Card>

      <h2>Passo 12 — adaptação de idioma e cultura</h2>
      <div className="grid g2">
        <Card title="Checklist de localização">
          <div className="stack">
            {LOCALIZATION.map((l) => (
              <Check key={l.id} label={l.label} checked={!!state.tasks[l.id]} onChange={() => dispatch({ type: 'task/toggle', taskId: l.id })} />
            ))}
          </div>
          <div className="divider" />
          <button
            className="btn btn--sm"
            type="button"
            onClick={() =>
              toast('Tradução literal não vende. Leve o ângulo, não as palavras — e revise com nativo.')
            }
          >
            Lembrar a regra de ouro
          </button>
          <div className="tiny muted" style={{ marginTop: 8 }}>
            Para gerar hipóteses em lote: <code>marketeam/Qwen-Marketing</code> no Hugging Face (MIT, finetune de Qwen3-8B).
            Para classificar copy em pt-BR: <code>neuralmind/bert-base-portuguese-cased</code> (MIT, 192.853 downloads).
          </div>
        </Card>
        <Card title="Teste de transplante do seu ângulo" hint="O mesmo filtro editorial aplicado ao seu texto">
          <AngleAudit text={`${c.angle.statement} ${c.angle.promise} ${c.angle.proof}`} />
        </Card>
      </div>
    </>
  );
}

/** Heurística editorial: detecta ângulo genérico antes de gastar clique. */
function AngleAudit({ text }: { text: string }) {
  const t = text.toLowerCase();
  const generic = [
    'melhor produto',
    'qualidade',
    'inovador',
    'revolucionário',
    'o melhor do mercado',
    'imperdível',
    'aproveite',
    'transforme sua vida',
  ];
  const hits = generic.filter((g) => t.includes(g));
  const hasNumber = /\d/.test(text);
  const hasTime = /(dia|semana|m[êe]s|horas|minutos|ano)/.test(t);
  const hasPerson = /(eu|meu|minha|você|seu|sua)/.test(t);
  const specific = hasNumber || hasTime || hasPerson;
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  const verdict = words < 8 ? 'vazio' : hits.length > 0 ? 'generico' : specific ? 'especifico' : 'fraco';
  const tone = verdict === 'especifico' ? 'ok' : verdict === 'generico' || verdict === 'vazio' ? 'bad' : 'warn';
  const label =
    verdict === 'especifico'
      ? 'ESPECÍFICO'
      : verdict === 'generico'
        ? 'GENÉRICO — reescrever'
        : verdict === 'vazio'
          ? 'VAZIO'
          : 'FRACO — falta concreto';

  return (
    <div className="stack">
      <div className="row">
        <Badge tone={tone as 'ok' | 'bad' | 'warn'}>{label}</Badge>
        <span className="tiny muted">{words} palavras</span>
      </div>
      <ul className="small dim" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 5 }}>
        <li>Número ou prazo presente: {hasNumber || hasTime ? 'sim' : 'não'} — concretude é o que separa ângulo de tema.</li>
        <li>Pessoa gramatical presente: {hasPerson ? 'sim' : 'não'} — ângulo fala com alguém.</li>
        <li>
          Clichês detectados:{' '}
          {hits.length ? <span className="pit">{hits.join(', ')}</span> : 'nenhum'}
        </li>
      </ul>
      {verdict !== 'especifico' && (
        <Callout tone="warn">
          Reescreva com uma restrição: quem, em quanto tempo, com qual evidência. "Investimento" é tema; "aposentadoria aos
          40 com R$ 500 por mês" é ângulo.
        </Callout>
      )}
    </div>
  );
}
