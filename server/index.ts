import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BENCHMARKS, GEO_MULTIPLIER, MIN_BUDGET } from '../src/lib/benchmarks';
import { STEPS, FINAL_CHECKLIST } from '../src/lib/steps';
import { COMPLIANCE_RULES } from '../src/lib/compliance';
import { templateMarkdown } from '../src/lib/report';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const PORT = Number(process.env.PORT ?? 8787);

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// ------------------------------------------------------------------ saúde
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'valida-os',
    version: '1.0.0',
    uptime: Math.round(process.uptime()),
    benchmarks: BENCHMARKS.length,
    complianceRules: COMPLIANCE_RULES.length,
    steps: STEPS.length,
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
  });
});

// ------------------------------------------------------------------ config
app.get('/api/config', (_req, res) => {
  res.json({
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    demoMode: !process.env.STRIPE_SECRET_KEY,
    plans: {
      free: { amount: 0, currency: 'BRL', limit: 1 },
      pro: { monthly: { BRL: 4700, USD: 1200 }, yearly: { BRL: 47000, USD: 12000 }, limit: 25 },
      agency: { monthly: { BRL: 14700, USD: 3700 }, yearly: { BRL: 147000, USD: 37000 }, limit: 999 },
    },
    affiliate: { commission: '30% recorrente por 12 meses', cookieDays: 90 },
    currency: process.env.DEFAULT_CURRENCY ?? 'BRL',
  });
});

// ------------------------------------------------------------------ benchmarks
app.get('/api/benchmarks', (req, res) => {
  const channel = req.query.channel as string | undefined;
  const vertical = req.query.vertical as string | undefined;
  const geo = (req.query.geo as string | undefined) ?? 'T1';
  const multiplier = GEO_MULTIPLIER[(geo as keyof typeof GEO_MULTIPLIER) ?? 'T1'] ?? GEO_MULTIPLIER.T1;

  const rows = BENCHMARKS.filter(
    (b) => (!channel || b.channel === channel) && (!vertical || b.vertical === vertical),
  ).map((b) => ({
    ...b,
    geo,
    derived: geo !== 'T1',
    ...(geo !== 'T1'
      ? {
          cpc: round(b.cpc * multiplier.cpc, 3),
          cpa: round(b.cpa * multiplier.cpc, 2),
          ctr: round(b.ctr * multiplier.ctr, 2),
          cpm: b.cpm ? round(b.cpm * multiplier.cpm, 2) : undefined,
          cvr: b.cvr ? round(b.cvr * multiplier.cvr, 2) : undefined,
        }
      : {}),
  }));

  res.json({ geo, count: rows.length, multiplier, rows, minBudget: channel ? MIN_BUDGET[channel as keyof typeof MIN_BUDGET] : MIN_BUDGET });
});

// ------------------------------------------------------------------ método
app.get('/api/method', (_req, res) => {
  res.json({ steps: STEPS, checklist: FINAL_CHECKLIST, rules: COMPLIANCE_RULES.length });
});

app.get('/api/template', (_req, res) => {
  res.type('text/markdown; charset=utf-8').send(templateMarkdown());
});

// ------------------------------------------------------------------ leads (lead magnet)
interface Lead {
  email: string;
  source: string;
  referral?: string;
  at: string;
  ipHint: string;
}

function readLeads(): Lead[] {
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8')) as Lead[];
  } catch {
    return [];
  }
}

app.post('/api/leads', (req, res) => {
  const { email, source, referral } = req.body ?? {};
  if (typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido.' });
  }
  const leads = readLeads();
  if (leads.some((l) => l.email.toLowerCase() === email.toLowerCase())) {
    return res.json({ ok: true, duplicate: true, total: leads.length });
  }
  leads.push({
    email,
    source: typeof source === 'string' ? source : 'desconhecido',
    referral: typeof referral === 'string' ? referral : undefined,
    at: new Date().toISOString(),
    ipHint: String(req.ip ?? '').slice(0, 12),
  });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  res.json({ ok: true, total: leads.length });
});

app.get('/api/leads/count', (_req, res) => {
  res.json({ total: readLeads().length });
});

// ------------------------------------------------------------------ checkout
app.post('/api/checkout', async (req, res) => {
  const { plan, billing, referral } = req.body ?? {};
  if (!['pro', 'agency'].includes(plan)) {
    return res.status(400).json({ error: 'Plano inválido.' });
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  const origin = req.headers.origin ?? `http://localhost:${PORT}`;

  if (!secret) {
    // Sem chave configurada o app roda em demonstração — nenhuma cobrança é feita.
    return res.json({
      demo: true,
      plan,
      billing: billing === 'yearly' ? 'yearly' : 'monthly',
      referral: referral ?? null,
      message:
        'Stripe não configurado. Defina STRIPE_SECRET_KEY e STRIPE_PRICE_PRO / STRIPE_PRICE_AGENCY para cobrar de verdade.',
    });
  }

  try {
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(secret);
    const priceId =
      plan === 'pro'
        ? billing === 'yearly'
          ? process.env.STRIPE_PRICE_PRO_YEARLY
          : process.env.STRIPE_PRICE_PRO
        : billing === 'yearly'
          ? process.env.STRIPE_PRICE_AGENCY_YEARLY
          : process.env.STRIPE_PRICE_AGENCY;

    if (!priceId) {
      return res.status(500).json({ error: `Price ID do plano ${plan} não configurado.` });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: referral ?? undefined,
      allow_promotion_codes: true,
      success_url: `${origin}/#/dashboard?checkout=sucesso`,
      cancel_url: `${origin}/#/pricing?checkout=cancelado`,
    });
    res.json({ url: session.url, id: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Falha ao criar a sessão de checkout.';
    res.status(500).json({ error: message });
  }
});

// ------------------------------------------------------------------ estáticos (produção)
const dist = path.join(ROOT, 'dist');
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

function round(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`VALIDA OS API ouvindo em http://0.0.0.0:${PORT}`);
  console.log(`Benchmarks: ${BENCHMARKS.length} · Regras de compliance: ${COMPLIANCE_RULES.length} · Passos: ${STEPS.length}`);
  console.log(process.env.STRIPE_SECRET_KEY ? 'Stripe: configurado' : 'Stripe: modo demonstração');
});
