import type { NetworkId } from './types';

export interface NetworkDef {
  id: NetworkId;
  label: string;
  commissionRange: string;
  cookie: string;
  payout: string;
  minPayout: string;
  /** % deduzido do valor da venda antes do split de comissão. */
  feePercent: number;
  /** Taxa fixa por transação. */
  feeFixed: number;
  /** Taxa por ciclo de pagamento. */
  payoutFee: number;
  refundWindow: string;
  notes: string[];
  source: string;
  sourceUrl: string;
}

export const NETWORKS: Record<NetworkId, NetworkDef> = {
  amazon: {
    id: 'amazon',
    label: 'Amazon Associates',
    commissionRange: '1–20% (maioria 3–4,5%)',
    cookie: '24 horas (90 dias se o item entrar no carrinho)',
    payout: 'Mensal, ~60 dias após o fim do mês',
    minPayout: 'US$ 10',
    feePercent: 0,
    feeFixed: 0,
    payoutFee: 0,
    refundWindow: 'Devolução cancela a comissão antes do pagamento',
    notes: [
      'Exige 3 vendas nos primeiros 180 dias para manter a conta.',
      'Comissão efetiva média entre contas: 2,5–3,5% — não os 10% do headline.',
      'EPC típico de conteúdo Amazon: US$ 0,15–0,50. Nichos de alta intenção: US$ 0,80–2,00.',
      'Cadastro por país: cada marketplace exige registro próprio.',
    ],
    source: 'Amazon Associates fee schedule / Biztoolkit & Money-Forge (2026)',
    sourceUrl: 'https://www.money-forge.org/blog/amazon-associates-complete-guide-2026',
  },
  clickbank: {
    id: 'clickbank',
    label: 'ClickBank',
    commissionRange: '10–90% (típico 50–75% em digital)',
    cookie: '60 dias',
    payout: 'Semanal ou quinzenal (net-15)',
    minPayout: 'US$ 100 (padrão; alguns anunciantes menos)',
    feePercent: 7.5,
    feeFixed: 1,
    payoutFee: 2.5,
    refundWindow: 'Conforme política do vendedor; chargeback reverte comissão',
    notes: [
      'A taxa de 7,5% + US$ 1 sai do valor da venda ANTES do split — reduz a comissão líquida do afiliado.',
      'Wire internacional: US$ 35 por remessa. Em margem apertada isso importa.',
      'Sem aprovação de anunciante para afiliar: entrada imediata, mas qualidade de oferta varia muito.',
    ],
    source: 'Affiliate Times / Track360 (2026)',
    sourceUrl: 'https://affiliate-times.com/clickbank-in-2026-still-the-king-of-digital-product-affiliates/',
  },
  impact: {
    id: 'impact',
    label: 'Impact.com',
    commissionRange: 'Definida pela marca (5–20%; 20–40% em software)',
    cookie: 'Definida pela marca (~30 dias no varejo)',
    payout: 'Agenda fixa (dia 1 ou 15) ou por threshold',
    minPayout: 'Definido pela marca',
    feePercent: 0,
    feeFixed: 0,
    payoutFee: 0,
    refundWindow: 'Período de validação da marca; comissão travada não é revertida',
    notes: [
      'Rastreamento server-to-server — configure o postback, não dependa de cookie.',
      'Fraude com scoring ML: sub-ID sujo derruba a conta.',
    ],
    source: 'Digistore24 — comparativo de redes (2026)',
    sourceUrl: 'https://www.digistore24.com/blog/clickbank-alternatives/',
  },
  awin: {
    id: 'awin',
    label: 'Awin',
    commissionRange: 'Definida pela marca (~5–30%)',
    cookie: '~30 dias (individual por anunciante)',
    payout: 'Duas vezes por mês (dia 1 ou 15)',
    minPayout: 'US$ 20 (mínimo da rede)',
    feePercent: 0,
    feeFixed: 0,
    payoutFee: 0,
    refundWindow: 'Validação da marca, tipicamente 30–67 dias',
    notes: [
      '30.000+ anunciantes; forte na Europa.',
      'A taxa de rede (30%) é paga pelo anunciante, não pelo afiliado.',
    ],
    source: 'Digistore24 — comparativo de redes (2026)',
    sourceUrl: 'https://www.digistore24.com/blog/clickbank-alternatives/',
  },
  shareasale: {
    id: 'shareasale',
    label: 'ShareASale (Awin)',
    commissionRange: '4–50%',
    cookie: 'Definida pelo merchant',
    payout: 'Dia 20 do mês seguinte ao lock',
    minPayout: 'US$ 50',
    feePercent: 0,
    feeFixed: 0,
    payoutFee: 0,
    refundWindow: 'Validação do merchant',
    notes: ['Pertence à Awin; 20% de taxa de rede paga pelo merchant.'],
    source: 'Sellvia — Amazon Associates Guide 2026',
    sourceUrl: 'https://sellvia.com/blog/amazon-associates-affiliate-program/',
  },
  cj: {
    id: 'cj',
    label: 'CJ Affiliate',
    commissionRange: '5–10% típico (até 90%)',
    cookie: 'Varia por anunciante',
    payout: 'Mensal, ~20 dias após o fim do mês',
    minPayout: 'US$ 50 (depósito) / US$ 100 (cheque)',
    feePercent: 0,
    feeFixed: 0,
    payoutFee: 0,
    refundWindow: 'Validação do anunciante',
    notes: ['3.000+ anunciantes, marcas grandes. Exige aprovação por programa.'],
    source: 'Sellvia — Amazon Associates Guide 2026',
    sourceUrl: 'https://sellvia.com/blog/amazon-associates-affiliate-program/',
  },
  digistore24: {
    id: 'digistore24',
    label: 'Digistore24',
    commissionRange: 'Até 70% (digital)',
    cookie: '180 dias',
    payout: 'Semanal, quinzenal ou mensal',
    minPayout: '€ 50',
    feePercent: 7.9,
    feeFixed: 1,
    payoutFee: 0,
    refundWindow: 'Conforme o vendedor',
    notes: ['Taxa 7,9% + US$ 1 é maior que a do ClickBank em ticket médio.'],
    source: 'AIFreeForever — comparativo de redes (2026)',
    sourceUrl: 'https://aifreeforever.com/softwares/affiliate-networks',
  },
  direct: {
    id: 'direct',
    label: 'Acordo direto com a marca',
    commissionRange: 'Negociado',
    cookie: 'Negociado',
    payout: 'Negociado',
    minPayout: 'Negociado',
    feePercent: 0,
    feeFixed: 0,
    payoutFee: 0,
    refundWindow: 'Negociado',
    notes: [
      'Melhor margem e melhor dado: você negocia postback, sub-ID e janela de atribuição.',
      'Exige contrato — use o módulo de compliance para o checklist documental.',
    ],
    source: 'Regra interna do VALIDA OS',
    sourceUrl: '',
  },
  other: {
    id: 'other',
    label: 'Outra rede',
    commissionRange: '—',
    cookie: '—',
    payout: '—',
    minPayout: '—',
    feePercent: 0,
    feeFixed: 0,
    payoutFee: 0,
    refundWindow: '—',
    notes: ['Preencha taxa e janela manualmente lendo o contrato da rede.'],
    source: 'Regra interna do VALIDA OS',
    sourceUrl: '',
  },
};

/** Tabela de comissões Amazon Associates por categoria (2026). */
export const AMAZON_CATEGORIES: Array<{ category: string; rate: number }> = [
  { category: 'Amazon Games', rate: 20 },
  { category: 'Luxury Beauty / Luxury Stores Beauty / Amazon Explore', rate: 10 },
  { category: 'Digital & Physical Music, Handmade, Digital Videos', rate: 5 },
  { category: 'Physical Books, Kitchen, Automotive', rate: 4.5 },
  { category: 'Kindle/Fire, apparel, relógios, joias, malas, calçados, bolsas', rate: 4 },
  { category: 'Toys, furniture, home, lawn & garden, pets, headphones, beauty, outdoors, tools, sports', rate: 3 },
  { category: 'PC e componentes', rate: 2.5 },
  { category: 'TVs, câmeras, telefones, áudio, video games', rate: 2 },
  { category: 'Amazon Fresh, grocery, health & personal care, jogos físicos e consoles', rate: 1 },
  { category: 'Gift cards e vários serviços', rate: 0 },
  { category: 'Todas as outras categorias', rate: 4 },
];
