import { useMemo, useState } from 'react';
import { Badge, Callout, Card, Check, CopyButton, Field, Select, Source, Stat, Text, toast } from '../components/ui';
import { CHANNEL_MACROS } from '../lib/tracking';
import { NETWORK_TRACKING } from '../lib/tracking';
import { buildTrackedUrl, pixelSnippet, postbackTemplate, suggestedSubIdScheme } from '../lib/tracking';
import { useActiveCampaign, useStore } from '../state/store';
import { uid } from '../state/store';

export default function TrackingPage() {
  const { dispatch } = useStore();
  const c = useActiveCampaign();
  const [trackerHost, setTrackerHost] = useState('trk.seudominio.com');
  const [pixelKind, setPixelKind] = useState<'meta' | 'google' | 'tiktok'>('meta');
  const [pixelId, setPixelId] = useState('SEU_PIXEL_ID');
  if (!c) return null;

  const t = c.tracking;
  const setT = (patch: Partial<typeof t>) => dispatch({ type: 'campaign/tracking', id: c.id, patch });
  const netTrack = NETWORK_TRACKING[c.offer.network];
  const chanMacros = CHANNEL_MACROS[c.offer.channel];

  const utm = useMemo(() => {
    if (!t.landingUrl.trim()) return '';
    try {
      return buildTrackedUrl({
        baseUrl: t.landingUrl,
        source: c.offer.channel.split('_')[0],
        medium: c.offer.channel === 'seo' ? 'organic' : c.offer.channel === 'email' ? 'email' : 'cpc',
        campaign: c.name.replace(/\s+/g, '-').toLowerCase().slice(0, 40),
        content: 'criativo-a',
        subIdParam: netTrack.subIdParam,
        channel: c.offer.channel,
      });
    } catch {
      return '';
    }
  }, [t.landingUrl, c.offer.channel, c.name, netTrack.subIdParam]);

  const affiliateLink = netTrack.linkTemplate.replace('SUBID', t.subIdScheme || 'SUBID');
  const postback = t.postbackUrl || postbackTemplate(trackerHost, 'clickid');

  return (
    <>
      <p className="lead">
        Passo 9 sem meio-termo: se você não sabe qual criativo, público e país convertem, não está otimizando — está
        torcendo. E a armadilha declarada é rastrear só o clique, nunca a conversão.
      </p>

      <div className="grid g2">
        <Card title="Esquema de sub-ID" hint="A chave que permite cortar a campanha depois">
          <Text
            label="Padrão"
            value={t.subIdScheme}
            onChange={(v) => setT({ subIdScheme: v })}
            placeholder="oferta_geo_publico_criativo"
            hint="Sem sub-ID você sabe que a campanha foi mal. Com sub-ID você sabe qual criativo, para quem, em qual país."
          />
          <div className="row" style={{ marginTop: 8 }}>
            <button
              className="btn btn--sm"
              type="button"
              onClick={() => {
                setT({
                  subIdScheme: suggestedSubIdScheme({
                    offer: c.offer.name.split(' ')[0]?.toLowerCase().replace(/\W/g, '') || 'oferta',
                    geo: c.offer.geoTier.toLowerCase(),
                    audience: c.angle.audience.split(' ')[0]?.toLowerCase().replace(/\W/g, '') || 'publico',
                    creative: 'a',
                  }),
                });
                toast('Esquema sugerido aplicado.');
              }}
            >
              Gerar esquema sugerido
            </button>
            <CopyButton text={t.subIdScheme} />
          </div>
          <div className="divider" />
          <Field label={`Parâmetro de sub-ID em ${netTrack.label}`}>
            <input readOnly value={netTrack.subIdParam} />
          </Field>
          <Field label="Template do link de afiliado">
            <input readOnly value={affiliateLink} />
          </Field>
          <div className="row">
            <CopyButton text={affiliateLink} label="Copiar link" />
          </div>
          <div className="tiny muted" style={{ marginTop: 8 }}>{netTrack.postbackHint}</div>
        </Card>

        <Card title="URL rastreada (UTM + sub-ID)" hint="Passo 9 — parâmetros e macro do canal">
          <Text label="Sua landing page" value={t.landingUrl} onChange={(v) => setT({ landingUrl: v })} placeholder="https://seudominio.com/oferta" />
          <div className="divider" />
          <Field label="URL final para colar no gerenciador de anúncios">
            <textarea readOnly value={utm || 'Preencha a landing page para gerar a URL.'} style={{ minHeight: 92 }} />
          </Field>
          {utm && (
            <div className="row" style={{ marginTop: 8 }}>
              <CopyButton text={utm} label="Copiar URL" />
              <a className="btn btn--sm" href={utm} target="_blank" rel="noreferrer noopener">
                Testar em nova aba
              </a>
            </div>
          )}
          <div className="divider" />
          <div className="small dim">
            <strong>Macros de {chanMacros.label}:</strong>
            <div className="row" style={{ marginTop: 6, gap: 6 }}>
              {Object.entries(chanMacros.macros).map(([k, v]) => (
                <span key={k} className="badge badge--ghost mono">
                  {k}={v}
                </span>
              ))}
            </div>
          </div>
          <div className="tiny muted" style={{ marginTop: 8 }}>
            Sintaxe conferida na documentação pública de cada canal; confirme no painel antes de subir em volume.
          </div>
        </Card>
      </div>

      <div className="grid g2" style={{ marginTop: 12 }}>
        <Card title="Postback de conversão" hint="O que o painel da rede nunca te mostra em tempo real">
          <Field label="Host do seu tracker (Voluum, RedTrack, Bemob ou self-hosted)">
            <input value={trackerHost} onChange={(e) => setTrackerHost(e.target.value)} />
          </Field>
          <Field label="URL de postback">
            <textarea readOnly value={postback} style={{ minHeight: 60 }} />
          </Field>
          <div className="row" style={{ marginTop: 8 }}>
            <button className="btn btn--sm" type="button" onClick={() => setT({ postbackUrl: postback })}>
              Salvar na campanha
            </button>
            <CopyButton text={postback} label="Copiar postback" />
          </div>
          <div className="divider" />
          <div className="stack">
            <Check label="Pixel / evento de conversão instalado na landing" checked={t.pixelInstalled} onChange={(v) => setT({ pixelInstalled: v })} />
            <Check label="Postback da rede configurado" checked={t.networkPostbackConfigured} onChange={(v) => setT({ networkPostbackConfigured: v })} />
            <Check
              label="Clique de teste validado de ponta a ponta (S2S)"
              checked={t.s2sTested}
              onChange={(v) => setT({ s2sTested: v })}
              hint="Dispare um clique real, converta em modo teste e confirme que a conversão chegou no SEU tracker — não só no painel da rede."
            />
          </div>
          <Callout tone="warn" title="Armadilha do Passo 9">
            Confiar apenas no painel da rede de afiliados. A rede mede o que interessa a ela (venda validada, depois do
            período de estorno). Você precisa do clique e da conversão no seu banco, no mesmo fuso e com o mesmo sub-ID.
          </Callout>
        </Card>

        <Card title="Snippet de pixel">
          <div className="row" style={{ marginBottom: 10 }}>
            <Select
              label="Plataforma"
              value={pixelKind}
              onChange={setPixelKind}
              options={[
                { value: 'meta', label: 'Meta Pixel' },
                { value: 'google', label: 'Google tag (gtag)' },
                { value: 'tiktok', label: 'TikTok Pixel' },
              ]}
            />
            <Text label="ID do pixel" value={pixelId} onChange={setPixelId} />
          </div>
          <pre>{pixelSnippet(pixelKind, pixelId)}</pre>
          <div className="row" style={{ marginTop: 8 }}>
            <CopyButton text={pixelSnippet(pixelKind, pixelId)} label="Copiar snippet" />
          </div>
          <div className="tiny muted" style={{ marginTop: 8 }}>
            Em geo europeu, o pixel só pode disparar depois do consentimento (regra <code>gdpr-consent</code> no módulo de
            auditoria).
          </div>
        </Card>
      </div>

      <h2>Passo 10 — 3 variações de criativo do MESMO ângulo</h2>
      <Card
        title="Biblioteca de criativos"
        hint="Mudar ângulo e criativo ao mesmo tempo invalida o teste"
        right={
          <button
            className="btn btn--sm"
            type="button"
            onClick={() =>
              dispatch({
                type: 'campaign/patch',
                id: c.id,
                patch: {
                  creatives: [
                    ...c.creatives,
                    { id: uid('cr'), name: `Variação ${String.fromCharCode(65 + c.creatives.length)}`, hook: '', format: 'estático', status: 'ideia' },
                  ],
                },
              })
            }
          >
            + Criativo
          </button>
        }
      >
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th style={{ width: 130 }}>Nome</th>
                <th>Hook / primeira frase</th>
                <th style={{ width: 140 }}>Formato</th>
                <th style={{ width: 120 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {c.creatives.map((cr, i) => (
                <tr key={cr.id}>
                  <td>
                    <input
                      value={cr.name}
                      onChange={(e) => {
                        const next = [...c.creatives];
                        next[i] = { ...cr, name: e.target.value };
                        dispatch({ type: 'campaign/patch', id: c.id, patch: { creatives: next } });
                      }}
                    />
                  </td>
                  <td>
                    <input
                      value={cr.hook}
                      placeholder="A primeira frase que segura o dedo"
                      onChange={(e) => {
                        const next = [...c.creatives];
                        next[i] = { ...cr, hook: e.target.value };
                        dispatch({ type: 'campaign/patch', id: c.id, patch: { creatives: next } });
                      }}
                    />
                  </td>
                  <td>
                    <select
                      value={cr.format}
                      onChange={(e) => {
                        const next = [...c.creatives];
                        next[i] = { ...cr, format: e.target.value };
                        dispatch({ type: 'campaign/patch', id: c.id, patch: { creatives: next } });
                      }}
                    >
                      {['antes/depois', 'depoimento', 'demonstração', 'estático', 'vídeo curto', 'carrossel', 'UGC/criador'].map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={cr.status}
                      onChange={(e) => {
                        const next = [...c.creatives];
                        next[i] = { ...cr, status: e.target.value as typeof cr.status };
                        dispatch({ type: 'campaign/patch', id: c.id, patch: { creatives: next } });
                      }}
                    >
                      {['ideia', 'pronto', 'rodando', 'morto'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="divider" />
        <div className="grid g3">
          <Stat k="Criativos prontos" v={c.creatives.filter((x) => x.status === 'pronto' || x.status === 'rodando').length} note={`de ${c.creatives.length}`} />
          <Stat k="Amostra mínima por criativo" v="1.000 imp." note="regra do Passo 14" />
          <Stat k="Cliques para ler o CTR" v="100" note="abaixo disso o IC95 engole a diferença" />
        </div>
        <Callout tone="info" title="Por que 3 e não 10">
          Com 1.000 impressões por variação, 3 criativos cabem no orçamento de teste. Dez variações diluem a amostra e você
          termina sem saber nada — a versão cara de não testar. Para experimentação séria,{' '}
          <code>growthbook/growthbook</code> (8.462★) calcula significância por você.
        </Callout>
      </Card>

      <h2>Camada de medição sugerida</h2>
      <Card>
        <div className="scroll-x">
          <table>
            <thead>
              <tr>
                <th>Ferramenta</th>
                <th>O que resolve</th>
                <th className="right">Estrelas</th>
                <th>Licença</th>
                <th>Último push</th>
              </tr>
            </thead>
            <tbody>
              {[
                { r: 'dubinc/dub', w: 'Atribuição por link com sub-ID e conversão', s: '24.851', l: 'NOASSERTION', p: '2026-10-01' },
                { r: 'PostHog/posthog', w: 'Funil, replay de sessão e experimento', s: '40.060', l: 'MIT + enterprise', p: '2026-10-01' },
                { r: 'umami-software/umami', w: 'Analytics cookie-free para landing', s: '39.107', l: 'MIT', p: '2026-09-29' },
                { r: 'DP6/Marketing-Attribution-Models', w: 'Atribuição Markov quando houver multi-toque', s: '370', l: 'Apache-2.0', p: '2026-09-21' },
              ].map((row) => (
                <tr key={row.r}>
                  <td className="mono small">{row.r}</td>
                  <td className="small dim">{row.w}</td>
                  <td className="right mono">{row.s}</td>
                  <td className="small">{row.l}</td>
                  <td className="small muted">{row.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Source source="Consulta à API do GitHub em 01/10/2026" url="https://github.com/dubinc/dub" />
        <div className="row" style={{ marginTop: 8 }}>
          <Badge tone="ghost">Catálogo completo</Badge>
          <a className="btn btn--sm" href="#/stack">
            Abrir Stack OSS & Hugging Face
          </a>
        </div>
      </Card>
    </>
  );
}
