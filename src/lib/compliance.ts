import type { Campaign, ChannelId, NetworkId } from './types';

export type Jurisdiction = 'US' | 'EU' | 'BR' | 'GLOBAL';

export interface ComplianceRule {
  id: string;
  title: string;
  jurisdiction: Jurisdiction;
  authority: string;
  requirement: string;
  why: string;
  action: string;
  severity: 'critica' | 'alta' | 'media';
  appliesTo: {
    geos?: Jurisdiction[];
    networks?: NetworkId[];
    channels?: ChannelId[];
  };
  source: string;
  sourceUrl: string;
}

export const COMPLIANCE_RULES: ComplianceRule[] = [
  // ---------------- FTC (EUA) ----------------
  {
    id: 'ftc-per-content',
    title: 'Cada peça de conteúdo precisa do próprio disclosure',
    jurisdiction: 'US',
    authority: 'FTC — 16 CFR Part 255 (Endorsement Guides, revisão de out/2023)',
    requirement:
      'Todo conteúdo que contenha link de afiliado deve ter disclosure próprio. Uma página "Sobre" ou a bio não cobre os demais posts.',
    why:
      'A revisão de 2023 deixou explícito que a divulgação tem de estar na mesma peça em que a recomendação aparece. Comissão de qualquer tamanho já é conexão material — §255.5, Exemplo 11.',
    action:
      'Coloque a frase de disclosure no topo de cada landing, post e vídeo — antes do primeiro link.',
    severity: 'critica',
    appliesTo: { geos: ['US', 'GLOBAL'] },
    source: 'Promise Legal — FTC Endorsement Rules',
    sourceUrl: 'https://blog.promise.legal/ftc-endorsement-rules-product-sellers/',
  },
  {
    id: 'ftc-placement',
    title: 'Disclosure ANTES do link, no mesmo meio',
    jurisdiction: 'US',
    authority: 'FTC — 16 CFR §255.0 ("clear and conspicuous")',
    requirement:
      'A divulgação precisa ser inevitável: mesma mídia da recomendação, acima da dobra, sem ficar atrás de "ver mais".',
    why:
      'Quem para de ler antes do disclosure nunca o viu. Hashtag enterrada no fim da legenda não atende o padrão.',
    action:
      'Em vídeo, o disclosure tem de aparecer na tela e/ou na fala. Em post, antes do corte de "ver mais".',
    severity: 'critica',
    appliesTo: { geos: ['US', 'GLOBAL'] },
    source: 'Gordon Law — New FTC Endorsement Guidelines',
    sourceUrl: 'https://gordonlaw.com/learn/ftc-endorsement-guidelines/',
  },
  {
    id: 'ftc-wording',
    title: 'Linguagem: "paid link" sim, "affiliate link" talvez não',
    jurisdiction: 'US',
    authority: 'FTC — Disclosures 101',
    requirement:
      'Aceito: "Ad", "Sponsored", "#ad", "Paid link", "I earn a commission". Não aceito: "spon", "sp", "collab", "ambassador" sozinho, "#love", "#thanks".',
    why:
      'O teste é o consumidor médio entender que houve dinheiro. "Affiliate link" e "commissionable link" podem falhar nesse teste.',
    action: 'Use a frase gerada pelo VALIDA OS e mantenha o mesmo texto em todos os criativos.',
    severity: 'alta',
    appliesTo: { geos: ['US', 'GLOBAL'] },
    source: 'LegalForge — FTC Affiliate Disclosure Compliance Guide',
    sourceUrl: 'https://www.legalforge.app/blog/ftc-affiliate-disclosure-compliance',
  },
  {
    id: 'ftc-penalty',
    title: 'Penalidade por violação: até US$ 53.088 por infração',
    jurisdiction: 'US',
    authority: 'FTC — ajuste anual de penalidades civis (vigente jan/2025)',
    requirement:
      'Cada link sem disclosure pode ser contado como violação separada. Marca e criador respondem juntos.',
    why: 'A responsabilidade é solidária desde a revisão de 2023 — "não sabia o que o afiliado postou" não é defesa.',
    action: 'Audite os links já publicados antes de escalar o orçamento.',
    severity: 'critica',
    appliesTo: { geos: ['US'] },
    source: 'GeniusLink — Amazon Affiliate Disclosure Guide',
    sourceUrl: 'https://geniuslink.com/blog/amazon-affiliate-disclosure-guide/',
  },
  {
    id: 'ftc-results',
    title: 'Promessa de resultado precisa de substanciação',
    jurisdiction: 'US',
    authority: 'FTC — Endorsement Guides (experiência típica do consumidor)',
    requirement:
      'Se você mostra resultado, precisa de evidência de que é o típico — ou declarar expressamente que resultados variam.',
    why: '"Antes e depois" sem prova é publicidade enganosa, disclosure não resolve.',
    action: 'Guarde prints datados do painel. Sem prova, troque o criativo por demonstração.',
    severity: 'alta',
    appliesTo: { geos: ['US', 'GLOBAL'] },
    source: 'LegalForge — FTC Affiliate Disclosure Compliance Guide',
    sourceUrl: 'https://www.legalforge.app/blog/ftc-affiliate-disclosure-compliance',
  },
  {
    id: 'ftc-ai',
    title: 'Conteúdo gerado por IA entra na mesma regra',
    jurisdiction: 'US',
    authority: 'FTC — revisão de 2023',
    requirement: 'Personas virtuais e conteúdo sintético têm a mesma obrigação de disclosure que um criador humano.',
    why: 'A regra cobre o efeito sobre o consumidor, não a autoria.',
    action: 'Se usar IA para gerar copy ou criativo, mantenha o disclosure e a substanciação.',
    severity: 'media',
    appliesTo: { geos: ['US', 'GLOBAL'] },
    source: 'Launchpoint — 2026 FTC Influencer Disclosure Rules',
    sourceUrl: 'https://www.launchpointhq.com/blog/ftc-influencer-disclosure-guide',
  },

  // ---------------- Amazon Associates ----------------
  {
    id: 'amazon-verbatim',
    title: 'Amazon exige a frase literal',
    jurisdiction: 'GLOBAL',
    authority: 'Amazon Associates Program Operating Agreement, seção 5',
    requirement:
      'Exibir "As an Amazon Associate, I earn from qualifying purchases." em cada página/app/comunicação que contenha link de afiliado Amazon.',
    why: 'É a única rede que prescreve o texto exato. Sem ele: encerramento e confisco de comissões.',
    action: 'Inclua a frase no rodapé e no bloco de disclosure da landing.',
    severity: 'critica',
    appliesTo: { networks: ['amazon'] },
    source: 'AuditSocials — FTC Affiliate Disclosure Requirements 2026',
    sourceUrl: 'https://www.auditsocials.com/blog/ftc-affiliate-disclosure-requirements-2026-guide',
  },
  {
    id: 'amazon-no-cloak',
    title: 'Amazon proíbe esconder o destino do link',
    jurisdiction: 'GLOBAL',
    authority: 'Amazon Associates Operating Agreement',
    requirement:
      'Não usar cloak/redirect que oculte que o destino é a Amazon. Redirecionadores têm de deixar o destino visível.',
    why: 'Cloaking que esconde o destino é violação contratual e derruba a conta.',
    action: 'Se usar encurtador, o domínio de destino precisa aparecer ou ser declarado ao lado do link.',
    severity: 'critica',
    appliesTo: { networks: ['amazon'] },
    source: 'LegalForge — FTC Affiliate Disclosure Compliance Guide',
    sourceUrl: 'https://www.legalforge.app/blog/ftc-affiliate-disclosure-compliance',
  },
  {
    id: 'amazon-no-email',
    title: 'Amazon: sem link em e-mail, offline ou PDF',
    jurisdiction: 'GLOBAL',
    authority: 'Amazon Associates Operating Agreement',
    requirement:
      'Links de afiliado Amazon não podem ir em e-mail marketing, material offline ou PDFs (salvo critérios específicos).',
    why: 'Restrição contratual clássica que muita automação de funil viola sem perceber.',
    action: 'Na sequência de e-mails, mande para a SUA página — e o link Amazon vive lá.',
    severity: 'alta',
    appliesTo: { networks: ['amazon'] },
    source: 'LegalForge — FTC Affiliate Disclosure Compliance Guide',
    sourceUrl: 'https://www.legalforge.app/blog/ftc-affiliate-disclosure-compliance',
  },
  {
    id: 'amazon-3-sales',
    title: 'Amazon: 3 vendas nos primeiros 180 dias',
    jurisdiction: 'GLOBAL',
    authority: 'Amazon Associates Operating Agreement',
    requirement: 'Conta nova precisa gerar 3 vendas qualificadas em 180 dias ou é encerrada.',
    why: 'Mata a conta de quem valida devagar demais.',
    action: 'Planeje o teste de 72h dentro dessa janela e registre as datas.',
    severity: 'media',
    appliesTo: { networks: ['amazon'] },
    source: 'Biztoolkit — Amazon Associates Affiliate Earnings 2026',
    sourceUrl: 'https://www.biztoolkit.co/post/amazon-associates-affiliate-earnings-in-2026',
  },

  // ---------------- GDPR / LGPD ----------------
  {
    id: 'gdpr-consent',
    title: 'GDPR: consentimento antes de rastrear',
    jurisdiction: 'EU',
    authority: 'GDPR (UE 2016/679) + ePrivacy',
    requirement:
      'Cookies e identificadores de rastreamento exigem base legal — na prática, consentimento prévio, granular e revogável.',
    why: 'Pixel disparando antes do consentimento é a infração mais comum em funil de afiliado na Europa.',
    action: 'Instale CMP, dispare o pixel só após aceite e registre a prova do consentimento.',
    severity: 'critica',
    appliesTo: { geos: ['EU'] },
    source: 'Regra consolidada — GDPR/ePrivacy',
    sourceUrl: 'https://gdpr.eu/what-is-gdpr/',
  },
  {
    id: 'gdpr-dsr',
    title: 'GDPR: direitos do titular e registros',
    jurisdiction: 'EU',
    authority: 'GDPR arts. 12–22 e 30',
    requirement:
      'Você precisa responder a acesso/retificação/apagamento e manter registro das atividades de tratamento.',
    why: 'O sub-ID do seu tracker é dado pessoal quando identifica pessoa.',
    action: 'Tenha uma página de privacidade e um fluxo para pedidos de apagamento.',
    severity: 'alta',
    appliesTo: { geos: ['EU'] },
    source: 'Regra consolidada — GDPR',
    sourceUrl: 'https://gdpr.eu/what-is-gdpr/',
  },
  {
    id: 'lgpd-basis',
    title: 'LGPD: base legal para tratar dados de lead',
    jurisdiction: 'BR',
    authority: 'Lei 13.709/2018 (LGPD), arts. 7º e 9º',
    requirement:
      'Captura de e-mail/telefone precisa de base legal declarada e informação clara sobre finalidade e compartilhamento.',
    why: 'A ANPD já autuou por captação sem base legal; a fiscalização atinge quem compra tráfego também.',
    action: 'Formulário de captura com finalidade explícita e link para política de privacidade.',
    severity: 'alta',
    appliesTo: { geos: ['BR'] },
    source: 'Lei 13.709/2018',
    sourceUrl: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
  },
  {
    id: 'lgpd-transfer',
    title: 'LGPD: transferência internacional de dados',
    jurisdiction: 'BR',
    authority: 'LGPD arts. 33–36',
    requirement:
      'Enviar dados de leads brasileiros para tracker/rede no exterior exige uma das hipóteses do art. 33.',
    why: 'Tracker hospedado nos EUA com lead brasileiro é transferência internacional.',
    action: 'Documente a hipótese usada e mantenha cláusula contratual com o fornecedor.',
    severity: 'media',
    appliesTo: { geos: ['BR'] },
    source: 'Lei 13.709/2018',
    sourceUrl: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
  },

  // ---------------- Canais ----------------
  {
    id: 'meta-policy',
    title: 'Meta: sem atributos pessoais nem antes/depois',
    jurisdiction: 'GLOBAL',
    authority: 'Meta Advertising Standards',
    requirement:
      'Criativo não pode implicar conhecimento de atributos pessoais (saúde, religião, situação financeira) nem usar antes/depois em categorias restritas.',
    why: 'É a reprovação mais comum em funil de afiliado de saúde e finanças.',
    action: 'Reescreva o hook na terceira pessoa e troque antes/depois por demonstração.',
    severity: 'alta',
    appliesTo: { channels: ['meta'] },
    source: 'Meta Advertising Standards',
    sourceUrl: 'https://transparency.meta.com/policies/ad-standards/',
  },
  {
    id: 'google-policy',
    title: 'Google: landing page com valor próprio',
    jurisdiction: 'GLOBAL',
    authority: 'Google Ads — política de destino e de afiliados',
    requirement:
      'A página de destino precisa ter conteúdo original e valor próprio. Página-ponte que só redireciona para a rede é violação.',
    why: 'Doorway pages derrubam a conta inteira, não só o anúncio.',
    action: 'Sua landing precisa ter texto, prova e CTA próprios antes do link de afiliado.',
    severity: 'critica',
    appliesTo: { channels: ['google_search', 'google_shopping'] },
    source: 'Google Ads Help — políticas de afiliados',
    sourceUrl: 'https://support.google.com/adspolicy/answer/6118429',
  },
  {
    id: 'tiktok-policy',
    title: 'TikTok: claims de resultado e saúde',
    jurisdiction: 'GLOBAL',
    authority: 'TikTok Advertising Policies',
    requirement:
      'Promessas de resultado financeiro ou de saúde precisam de substanciação; categorias reguladas exigem autorização prévia.',
    why: 'Vertical de finanças e suplementos é a de maior taxa de reprovação.',
    action: 'Anexe a fonte do claim no criativo e evite números absolutos.',
    severity: 'alta',
    appliesTo: { channels: ['tiktok', 'tiktok_shop'] },
    source: 'TikTok for Business — Advertising Policies',
    sourceUrl: 'https://ads.tiktok.com/help/article/advertising-policies',
  },

  // ---------------- Fiscal ----------------
  {
    id: 'tax-w8ben',
    title: 'W-8BEN para receber de pagador americano',
    jurisdiction: 'US',
    authority: 'IRS — formulário W-8BEN',
    requirement:
      'Prestador não residente precisa entregar o W-8BEN ao pagador dos EUA para reduzir/eliminar retenção na fonte.',
    why: 'Sem o formulário, a rede retém 30% da comissão.',
    action: 'Preencha o W-8BEN no painel da rede antes do primeiro pagamento.',
    severity: 'alta',
    appliesTo: { geos: ['US', 'GLOBAL'] },
    source: 'Contabilidade.com — trabalho remoto para o exterior',
    sourceUrl: 'https://contabilidade.com/blog/como-trabalhar-remoto-para-o-exterior-veja-como-se-regularizar-e-receber-seu-pagamento-em-seguranca/',
  },
  {
    id: 'tax-br-cnae',
    title: 'Brasil: CNAE correto — e MEI geralmente não serve',
    jurisdiction: 'BR',
    authority: 'Receita Federal / CGSN',
    requirement:
      'Afiliado digital em regra não se enquadra no MEI. CNAE usual: 7319-0/02 (promoção de vendas); 7319-0/03 (marketing direto) cai no Anexo III.',
    why: 'MEI tem lista fechada de ocupações e teto de R$ 81 mil/ano — estourou, desenquadrou.',
    action: 'Abra CNPJ como SLU/LTDA com o CNAE adequado antes de escalar.',
    severity: 'alta',
    appliesTo: { geos: ['BR'] },
    source: 'Contabilidade.com — Afiliado pode ser MEI em 2026?',
    sourceUrl: 'https://contabilidade.com/blog/afiliado-pode-ser-mei-em-2026-veja-como-abrir-seu-cnpj-corretamente-pagar-menos-impostos-e-emitir-nota-fiscal/',
  },
  {
    id: 'tax-br-simples',
    title: 'Brasil: Anexo III (6%) exige Fator R ≥ 28%',
    jurisdiction: 'BR',
    authority: 'LC 123/2006 — Simples Nacional',
    requirement:
      'Com Fator R ≥ 28% a atividade entra no Anexo III a partir de 6%; abaixo disso vai para o Anexo V, a partir de 15,5%.',
    why: 'A diferença de 6% para 15,5% é maior que a margem de muita campanha.',
    action: 'Fale com contador sobre pró-labore para atingir o Fator R antes de escalar receita.',
    severity: 'alta',
    appliesTo: { geos: ['BR'] },
    source: 'Contabilidade.com — quanto um afiliado paga de imposto',
    sourceUrl: 'https://contabilidade.com/blog/quanto-um-afiliado-digital-paga-de-imposto/',
  },
  {
    id: 'tax-br-export',
    title: 'Brasil: comissão do exterior é exportação de serviço',
    jurisdiction: 'BR',
    authority: 'LC 116/2003, art. 2º, I',
    requirement:
      'ISS e PIS/COFINS são isentos na exportação de serviço com ingresso de divisas; IRPJ/CSLL seguem o regime. IOF de câmbio 0,38%.',
    why: 'Muita gente paga ISS que não devia — ou esquece o IOF no fechamento de câmbio.',
    action: 'Registre o ingresso de divisas e some o IOF ao custo da operação.',
    severity: 'media',
    appliesTo: { geos: ['BR'] },
    source: 'ContabilidadeZen — Contabilidade para afiliado digital 2026',
    sourceUrl: 'https://www.contabilidadezen.com.br/blog/contabilidade-afiliado-digital-pj-2026/',
  },
];

const GEO_OF: Record<string, Jurisdiction> = {
  US: 'US',
  EU: 'EU',
  BR: 'BR',
};

export interface ComplianceReport {
  applicable: ComplianceRule[];
  checked: ComplianceRule[];
  missing: ComplianceRule[];
  criticalMissing: ComplianceRule[];
  disclosure: string;
  coverage: number;
}

/** Regras aplicáveis a uma campanha, dado país-alvo, rede e canal. */
export function applicableRules(campaign: Campaign): ComplianceRule[] {
  const geos = campaign.compliance.geos as string[];
  const selected = geos.map((g) => GEO_OF[g]).filter(Boolean) as Jurisdiction[];
  return COMPLIANCE_RULES.filter((rule) => {
    const a = rule.appliesTo;
    const geoOk = !a.geos || a.geos.some((g) => g === 'GLOBAL' || selected.includes(g));
    const netOk = !a.networks || a.networks.includes(campaign.offer.network);
    const chanOk = !a.channels || a.channels.includes(campaign.offer.channel);
    return geoOk && netOk && chanOk;
  });
}

export function buildComplianceReport(campaign: Campaign): ComplianceReport {
  const applicable = applicableRules(campaign);
  const checkedIds = new Set(campaign.compliance.checkedRuleIds);
  const checked = applicable.filter((r) => checkedIds.has(r.id));
  const missing = applicable.filter((r) => !checkedIds.has(r.id));
  return {
    applicable,
    checked,
    missing,
    criticalMissing: missing.filter((r) => r.severity === 'critica'),
    disclosure:
      campaign.compliance.disclosureText.trim() ||
      suggestedDisclosure(campaign.compliance.geos, campaign.offer.network),
    coverage: applicable.length ? Math.round((checked.length / applicable.length) * 100) : 0,
  };
}

/** Gera o texto de disclosure recomendado para a combinação país + rede. */
export function suggestedDisclosure(geos: string[], network: NetworkId): string {
  const parts: string[] = [];
  if (network === 'amazon') {
    parts.push('As an Amazon Associate, I earn from qualifying purchases.');
  }
  if (geos.includes('BR')) {
    parts.push(
      'Esta página contém links pagos: se você comprar por eles, eu recebo uma comissão sem custo adicional para você.',
    );
  } else if (geos.includes('EU')) {
    parts.push(
      'Paid link: I may earn a commission if you buy through the links on this page, at no extra cost to you.',
    );
  } else {
    parts.push(
      'Paid link: I earn a commission for purchases made through links in this page, at no extra cost to you.',
    );
  }
  parts.push('Resultados variam de pessoa para pessoa; nada aqui é promessa de rendimento.');
  return parts.join(' ');
}
