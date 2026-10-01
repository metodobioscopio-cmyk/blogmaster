import type { ChannelId, NetworkId } from './types';

/** Macros oficiais de cada canal para popular o sub-ID. Confirme no painel antes de subir. */
export const CHANNEL_MACROS: Record<ChannelId, { label: string; macros: Record<string, string> }> = {
  google_search: {
    label: 'Google Ads (ValueTrack)',
    macros: {
      click_id: '{gclid}',
      campaign: '{campaignid}',
      adgroup: '{adgroupid}',
      creative: '{creative}',
      keyword: '{keyword}',
      device: '{device}',
      network: '{network}',
    },
  },
  google_shopping: {
    label: 'Google Ads — Shopping (ValueTrack)',
    macros: {
      click_id: '{gclid}',
      campaign: '{campaignid}',
      adgroup: '{adgroupid}',
      product_id: '{product_id}',
      device: '{device}',
    },
  },
  meta: {
    label: 'Meta Ads',
    macros: {
      click_id: '{{fbclid}}',
      campaign: '{{campaign.name}}',
      adset: '{{adset.name}}',
      ad: '{{ad.name}}',
      placement: '{{placement}}',
    },
  },
  tiktok: {
    label: 'TikTok Ads',
    macros: {
      click_id: '{{CLICKID}}',
      campaign: '{{CAMPAIGN_NAME}}',
      adgroup: '{{AID_NAME}}',
      ad: '{{A_NAME}}',
    },
  },
  tiktok_shop: {
    label: 'TikTok Shop Ads',
    macros: {
      click_id: '{{CLICKID}}',
      campaign: '{{CAMPAIGN_NAME}}',
      product: '{{PRODUCT_ID}}',
    },
  },
  microsoft: {
    label: 'Microsoft Ads',
    macros: {
      click_id: '{msclkid}',
      campaign: '{campaignid}',
      adgroup: '{adgroupid}',
      keyword: '{keyword}',
    },
  },
  seo: {
    label: 'SEO / orgânico',
    macros: { source: 'google', medium: 'organic', content: '{slug-da-pagina}' },
  },
  email: {
    label: 'E-mail',
    macros: { source: 'newsletter', medium: 'email', campaign: '{nome-da-sequencia}' },
  },
};

/** Formato do link de afiliado e do postback por rede. */
export const NETWORK_TRACKING: Record<
  NetworkId,
  { label: string; linkTemplate: string; postbackHint: string; subIdParam: string }
> = {
  amazon: {
    label: 'Amazon Associates',
    linkTemplate: 'https://www.amazon.com/dp/ASIN?tag=SEUTAG-20&linkCode=ll1',
    postbackHint:
      'Amazon não oferece postback de venda em tempo real. Use até 100 Tracking IDs diferentes (um por campanha) e concilie pelo relatório diário.',
    subIdParam: 'tag',
  },
  clickbank: {
    label: 'ClickBank',
    linkTemplate: 'https://VENDOR.AFILIADO.hop.clickbank.net/?tid=SUBID',
    postbackHint:
      'O parâmetro `tid` carrega o seu sub-ID. Postback server-to-server é configurado pelo vendor; peça o endpoint antes de subir a campanha.',
    subIdParam: 'tid',
  },
  impact: {
    label: 'Impact.com',
    linkTemplate: 'https://BRAND.sjv.io/c/SEUID/OFERTAID?irclickid=CLICKID&irgwc=1&SubId=SUBID',
    postbackHint:
      'Impact usa rastreamento server-to-server por padrão. SubId1–5 aparecem no relatório e podem ser usados como chaves de otimização.',
    subIdParam: 'SubId',
  },
  awin: {
    label: 'Awin',
    linkTemplate: 'https://www.awin1.com/cread.php?awinmid=ID&awinaffid=SEUID&ued=URL_DESTINO&clickref=SUBID',
    postbackHint: 'O `clickref` é o seu sub-ID. Awin envia postback de conversão quando o anunciante habilita.',
    subIdParam: 'clickref',
  },
  shareasale: {
    label: 'ShareASale',
    linkTemplate: 'https://www.shareasale.com/r.cfm?B=ID&U=SEUID&M=ID&urllink=&afftrack=SUBID',
    postbackHint: '`afftrack` é o campo de sub-ID do ShareASale.',
    subIdParam: 'afftrack',
  },
  cj: {
    label: 'CJ Affiliate',
    linkTemplate: 'https://www.anrdoezrs.net/click-SEUID-OFERTAID?SRC=SUBID',
    postbackHint: 'CJ aceita parâmetros customizados (SRC, CJEVENT). O CJEVENT precisa ser propagado para a atribuição funcionar.',
    subIdParam: 'SRC',
  },
  digistore24: {
    label: 'Digistore24',
    linkTemplate: 'https://www.digistore24.com/product/OFERTAID/SEUID?campaignkey=SUBID',
    postbackHint: 'Postback configurável no painel do afiliado; use `campaignkey` como sub-ID.',
    subIdParam: 'campaignkey',
  },
  direct: {
    label: 'Acordo direto',
    linkTemplate: 'https://marca.com/?ref=SEUID&subid=SUBID',
    postbackHint: 'Negocie o postback no contrato: endpoint, parâmetros, janela de reprocessamento e tratamento de reembolso.',
    subIdParam: 'subid',
  },
  other: {
    label: 'Outra rede',
    linkTemplate: 'https://rede.com/?aff=SEUID&subid=SUBID',
    postbackHint: 'Leia a documentação de tracking da rede e preencha aqui.',
    subIdParam: 'subid',
  },
};

export interface UtmInput {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
  subId?: string;
  subIdParam?: string;
  channel?: ChannelId;
}

/** Constrói a URL final com UTM + sub-ID preenchido com a macro do canal. */
export function buildTrackedUrl(input: UtmInput): string {
  const url = new URL(input.baseUrl.startsWith('http') ? input.baseUrl : `https://${input.baseUrl}`);
  url.searchParams.set('utm_source', input.source);
  url.searchParams.set('utm_medium', input.medium);
  url.searchParams.set('utm_campaign', input.campaign);
  if (input.content) url.searchParams.set('utm_content', input.content);
  if (input.term) url.searchParams.set('utm_term', input.term);

  const macro = input.channel ? CHANNEL_MACROS[input.channel].macros.click_id : undefined;
  const subParam = input.subIdParam ?? 'subid';
  const subValue = input.subId || (macro ? `{subid:${macro}}` : '{subid}');
  url.searchParams.set(subParam, subValue);
  return url.toString();
}

/** Esquema de sub-ID recomendado: permite cortar por criativo, público e país. */
export function suggestedSubIdScheme(parts: {
  creative: string;
  audience: string;
  geo: string;
  offer: string;
}): string {
  return `${parts.offer}_${parts.geo}_${parts.audience}_${parts.creative}`;
}

export function pixelSnippet(kind: 'meta' | 'google' | 'tiktok', pixelId: string): string {
  if (kind === 'meta') {
    return `<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${pixelId}');
  fbq('track', 'PageView');
  fbq('track', 'Purchase', {value: 0.00, currency: 'USD'}); // dispare só na thank-you page
</script>`;
  }
  if (kind === 'google') {
    return `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${pixelId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${pixelId}', { send_page_view: true });
  // conversão:
  gtag('event', 'conversion', { send_to: '${pixelId}/CONVERSION_LABEL', value: 0.0, currency: 'USD' });
</script>`;
  }
  return `<!-- TikTok Pixel -->
<script>
  !function (w, d, t) {
    w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || [];
    ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group"];
    ttq.setAndDefer = function(t, e) { t[e] = function() { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } };
    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.load('${pixelId}');
    ttq.page();
    ttq.track('CompleteRegistration'); // troque pelo seu evento de conversão
  }(window, document, 'ttq');
</script>`;
}

/** Postback genérico no formato que a maioria dos trackers (Voluum/RedTrack/Bemob) aceita. */
export function postbackTemplate(trackerHost: string, networkParam: string): string {
  return `https://${trackerHost.replace(/^https?:\/\//, '').replace(/\/$/, '')}/postback?clickid={${networkParam}}&payout={payout}&status={status}&currency={currency}`;
}
