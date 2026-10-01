import { describe, expect, it } from 'vitest';
import { COMPLIANCE_RULES, applicableRules, buildComplianceReport, suggestedDisclosure } from '../lib/compliance';
import { makeCampaign } from '../test/factory';

describe('base de regras', () => {
  it('não tem id duplicado', () => {
    const ids = COMPLIANCE_RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda regra traz fonte e ação', () => {
    for (const r of COMPLIANCE_RULES) {
      expect(r.source.length).toBeGreaterThan(3);
      expect(r.action.length).toBeGreaterThan(10);
      expect(r.requirement.length).toBeGreaterThan(10);
    }
  });
});

describe('applicableRules', () => {
  it('traz regras dos EUA quando o alvo é US', () => {
    const c = makeCampaign({ compliance: { geos: ['US'], checkedRuleIds: [], disclosureText: '' } });
    const ids = applicableRules(c).map((r) => r.id);
    expect(ids).toContain('ftc-per-content');
    expect(ids).toContain('ftc-penalty');
    expect(ids).not.toContain('lgpd-basis');
  });

  it('traz regras de GDPR quando o alvo é EU', () => {
    const c = makeCampaign({ compliance: { geos: ['EU'], checkedRuleIds: [], disclosureText: '' } });
    const ids = applicableRules(c).map((r) => r.id);
    expect(ids).toContain('gdpr-consent');
    expect(ids).not.toContain('ftc-penalty');
  });

  it('traz regras de LGPD e de exportação quando o alvo é BR', () => {
    const c = makeCampaign({ compliance: { geos: ['BR'], checkedRuleIds: [], disclosureText: '' } });
    const ids = applicableRules(c).map((r) => r.id);
    expect(ids).toContain('lgpd-basis');
    expect(ids).toContain('tax-br-cnae');
    expect(ids).toContain('tax-br-export');
  });

  it('aplica as regras específicas da rede Amazon', () => {
    const c = makeCampaign({ offer: { network: 'amazon' } });
    const ids = applicableRules(c).map((r) => r.id);
    expect(ids).toContain('amazon-verbatim');
    expect(ids).toContain('amazon-no-email');
    expect(ids).toContain('amazon-no-cloak');
  });

  it('não aplica regras da Amazon quando a rede é ClickBank', () => {
    const c = makeCampaign({ offer: { network: 'clickbank' } });
    const ids = applicableRules(c).map((r) => r.id);
    expect(ids).not.toContain('amazon-verbatim');
  });

  it('aplica as regras específicas do canal', () => {
    const meta = makeCampaign({ offer: { channel: 'meta' } });
    expect(applicableRules(meta).map((r) => r.id)).toContain('meta-policy');
    const google = makeCampaign({ offer: { channel: 'google_search' } });
    expect(applicableRules(google).map((r) => r.id)).toContain('google-policy');
    expect(applicableRules(google).map((r) => r.id)).not.toContain('meta-policy');
  });

  it('com rede ClickBank e canal Meta, as regras da Amazon ficam de fora', () => {
    const c = makeCampaign({ offer: { network: 'clickbank', channel: 'meta' }, compliance: { geos: ['US'], checkedRuleIds: [], disclosureText: '' } });
    const ids = applicableRules(c).map((r) => r.id);
    expect(ids.some((id) => id.startsWith('amazon-'))).toBe(false);
    expect(ids).toContain('meta-policy');
    expect(ids).toContain('ftc-per-content');
  });
});

describe('buildComplianceReport', () => {
  it('mede a cobertura do checklist', () => {
    const c = makeCampaign({ compliance: { geos: ['US'], checkedRuleIds: ['ftc-per-content'], disclosureText: '' } });
    const report = buildComplianceReport(c);
    expect(report.coverage).toBeGreaterThan(0);
    expect(report.coverage).toBeLessThan(100);
    expect(report.missing.length).toBeGreaterThan(0);
  });

  it('lista as pendências críticas separadamente', () => {
    const c = makeCampaign({ compliance: { geos: ['US'], checkedRuleIds: [], disclosureText: '' } });
    const report = buildComplianceReport(c);
    expect(report.criticalMissing.length).toBeGreaterThan(0);
    expect(report.criticalMissing.every((r) => r.severity === 'critica')).toBe(true);
  });

  it('chega a 100% quando todas as regras aplicáveis estão marcadas', () => {
    const base = makeCampaign({ compliance: { geos: ['US'], checkedRuleIds: [], disclosureText: 'ok' } });
    const all = applicableRules(base).map((r) => r.id);
    const report = buildComplianceReport(
      makeCampaign({ compliance: { geos: ['US'], checkedRuleIds: all, disclosureText: 'texto' } }),
    );
    expect(report.coverage).toBe(100);
    expect(report.criticalMissing).toHaveLength(0);
  });
});

describe('suggestedDisclosure', () => {
  it('usa a frase literal exigida pela Amazon', () => {
    expect(suggestedDisclosure(['US'], 'amazon')).toContain('As an Amazon Associate, I earn from qualifying purchases.');
  });

  it('usa "paid link" para os EUA — linguagem que o consumidor entende', () => {
    const t = suggestedDisclosure(['US'], 'clickbank');
    expect(t).toContain('Paid link');
    expect(t).toMatch(/commission/i);
    expect(t).not.toMatch(/commissionable link/i);
  });

  it('gera o texto em português quando o alvo é o Brasil', () => {
    const t = suggestedDisclosure(['BR'], 'clickbank');
    expect(t).toMatch(/comiss[ãa]o/i);
    expect(t).toMatch(/links pagos/i);
  });

  it('sempre inclui a ressalva de resultado variável', () => {
    for (const geo of [['US'], ['EU'], ['BR']]) {
      expect(suggestedDisclosure(geo, 'impact')).toMatch(/variam|vary/i);
    }
  });
});
