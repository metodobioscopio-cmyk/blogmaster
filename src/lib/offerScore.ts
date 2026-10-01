import { offerMath } from './breakEven';
import type { Campaign } from './types';

export type LetterStatus = 'bloqueado' | 'pendente' | 'andamento' | 'pronto';

export interface LetterScore {
  letter: string;
  title: string;
  score: number;
  status: LetterStatus;
  weight: number;
  gaps: string[];
}

export interface CampaignScore {
  total: number;
  letters: LetterScore[];
  blocking: string[];
  readyToTest: boolean;
}

/**
 * Score V.A.L.I.D.A. — cada letra vira um subscore auditável.
 * O objetivo não é dar nota bonita: é mostrar exatamente o que falta
 * antes de gastar o primeiro real.
 */
export function scoreCampaign(campaign: Campaign): CampaignScore {
  const letters: LetterScore[] = [];

  // ---------- V — Verificar demanda e comissão ----------
  {
    const math = offerMath(campaign.offer, campaign.traffic);
    const gaps: string[] = [];
    let score = 0;
    if (campaign.offer.price > 0) score += 15;
    else gaps.push('Informe o preço da oferta no país-alvo.');
    if (campaign.offer.commissionValue > 0) score += 15;
    else gaps.push('Informe a comissão anunciada.');
    if (campaign.traffic.cpc > 0) score += 15;
    else gaps.push('Estime o CPC do canal (use a base de benchmarks).');
    if (campaign.traffic.cvr > 0) score += 10;
    else gaps.push('Estime a conversão da landing page.');
    if (math.verdict === 'ok') score += 45;
    else if (math.verdict === 'apertado') {
      score += 20;
      gaps.push(
        `Margem apertada: sobram ${math.marginPerClick} por clique. Renegocie comissão ou reduza o CPC antes de escalar.`,
      );
    } else {
      gaps.push(
        `Matemática inviável: o empate exige ${fmtPct(math.breakEvenCr)} de conversão. Ou a comissão sobe, ou o CPC cai, ou a oferta morre aqui.`,
      );
    }
    letters.push({ letter: 'V', title: 'Verificar demanda e comissão', score, status: status(score), weight: 0.22, gaps });
  }

  // ---------- A — Auditar concorrência e compliance ----------
  {
    const gaps: string[] = [];
    let score = 0;
    if (campaign.compliance.geos.length > 0) score += 20;
    else gaps.push('Selecione os países-alvo — a régua legal muda por jurisdição.');
    if (campaign.compliance.disclosureText.trim().length > 0) score += 30;
    else gaps.push('Defina o texto de disclosure que vai antes do link.');
    if (campaign.compliance.reviewedAt) score += 10;
    const checked = campaign.compliance.checkedRuleIds.length;
    score += Math.min(40, checked * 5);
    if (checked < 8) gaps.push(`Apenas ${checked} regra(s) de compliance marcada(s). Rode o checklist completo.`);
    letters.push({ letter: 'A', title: 'Auditar concorrência e compliance', score, status: status(score), weight: 0.16, gaps });
  }

  // ---------- L — Ligar ângulo, oferta e canal ----------
  {
    const gaps: string[] = [];
    const a = campaign.angle;
    const fields: Array<[string, string]> = [
      [a.statement, 'Ângulo central (frase única, não o tema)'],
      [a.promise, 'Promessa específica e mensurável'],
      [a.audience, 'Público com dor nomeada'],
      [a.proof, 'Prova (dado, depoimento, demonstração)'],
      [a.channelRationale, 'Por que ESTE canal combina com o ângulo'],
    ];
    let score = 0;
    for (const [value, label] of fields) {
      if (value.trim().length >= 8) score += 20;
      else gaps.push(`Falta: ${label}.`);
    }
    letters.push({ letter: 'L', title: 'Ligar ângulo, oferta e canal', score, status: status(score), weight: 0.16, gaps });
  }

  // ---------- I — Instrumentar funil e rastreamento ----------
  {
    const gaps: string[] = [];
    const t = campaign.tracking;
    let score = 0;
    if (t.landingUrl.trim()) score += 20;
    else gaps.push('Informe a URL da sua página (não a da rede).');
    if (t.subIdScheme.trim()) score += 20;
    else gaps.push('Defina o esquema de sub-ID (criativo|público|país).');
    if (t.pixelInstalled) score += 20;
    else gaps.push('Pixel/evento de conversão não instalado na landing.');
    if (t.networkPostbackConfigured) score += 20;
    else gaps.push('Postback da rede não configurado — você ficaria dependente só do painel do afiliado.');
    if (t.s2sTested) score += 20;
    else gaps.push('Dispare um clique de teste e confirme que a conversão chegou no seu tracker.');
    letters.push({ letter: 'I', title: 'Instrumentar funil e rastreamento', score, status: status(score), weight: 0.16, gaps });
  }

  // ---------- D — Decidir com métricas de corte ----------
  {
    const gaps: string[] = [];
    const c = campaign.cutMetrics;
    let score = 0;
    if (c.minCtr > 0) score += 20;
    else gaps.push('Defina o CTR mínimo de corte.');
    if (c.maxCpa > 0) score += 20;
    else gaps.push('Defina o CPA máximo de corte.');
    if (c.minEpc > 0) score += 20;
    else gaps.push('Defina o EPC mínimo (piso = o CPC da oferta).');
    if (c.minImpressions >= 1000) score += 20;
    else gaps.push('A amostra mínima deve ser ≥ 1.000 impressões por criativo.');
    if (campaign.snapshots.length > 0) score += 20;
    else gaps.push('Nenhum dado de teste lançado ainda.');
    letters.push({
      letter: 'D',
      title: 'Decidir com métricas de corte',
      score: Math.min(100, score),
      status: status(score),
      weight: 0.15,
      gaps,
    });
  }

  // ---------- A2 — Ampliar o que lucra ----------
  {
    const gaps: string[] = [];
    let score = 0;
    if (campaign.scale && campaign.scale.baseBudget > 0) score += 30;
    else gaps.push('Defina o orçamento base da escala.');
    if (campaign.scale && campaign.scale.guardCpa > 0) score += 30;
    else gaps.push('Defina o CPA de guarda (o gatilho que interrompe a subida).');
    if (campaign.decision?.verdict === 'scale') score += 40;
    else gaps.push('Escala só depois do veredito SCALE no teste de 72h. Escalar campanha não validada multiplica o prejuízo.');
    letters.push({ letter: 'A', title: 'Ampliar o que lucra', score, status: status(score), weight: 0.15, gaps });
  }

  const total = Math.round(letters.reduce((acc, l) => acc + l.score * l.weight, 0));
  const blocking = letters.filter((l) => l.status === 'bloqueado').flatMap((l) => l.gaps);
  // Portão do teste: as cinco primeiras letras (V, A, L, I, D) precisam estar de pé.
  const readyToTest = letters.slice(0, 5).every((l) => l.score >= 60);

  return { total, letters, blocking, readyToTest };
}

function status(score: number): LetterStatus {
  if (score >= 85) return 'pronto';
  if (score >= 40) return 'andamento';
  if (score > 0) return 'pendente';
  return 'bloqueado';
}

function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return 'impossível';
  return `${(Math.round(n * 100) / 100).toFixed(2)}%`;
}
