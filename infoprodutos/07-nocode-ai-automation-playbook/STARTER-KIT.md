# STARTER-KIT #7 — Automation Playbook (base: 3 blueprints spec + padrão doc)

## A. Stack canônica (use em todos os 12)

- Forms: Tally (free) → webhook. Alt: Google Forms.
- DB: Google Sheets (leads) + Notion (#1 OS Leads) — ensine 1, mencione outro.
- E-mail: Gmail. Chat: Slack (free) ou Telegram.
- Automação: Make (primary, visual + free tier) + Zapier port notes.
- AI: OpenAI GPT-4o-mini (cheap) com fallback Claude prompt (copy-paste).
- Scheduler: Built-in Make scheduling + Google Calendar.
Documente credenciais 1x no cap 0 (OAuth screenshots) e referencie (não repita 12x).

## B. Padrão de doc por workflow (4 páginas — replique 12x)

1. **Map:** diagrama (caixas numeradas ①→⑥) + "what fires when" + cost (ops/run, runs/mo example).
2. **Import:** blueprint file/link + field-map table (THEIR field → YOUR field) + 3 screenshots (import, map, schedule ON).
3. **Prompts:** prompt(s) full + eval checklist (good output has X/Y/Z; bad = vague/no CTA) + 1 good/1 bad example.
4. **Test & Fix:** fake-lead test script (5 steps) + top 3 breaks table (symptom → cause → fix + screenshot).

## C. W1 — Lead → Instant Reply + CRM (spec pronta)

- Trigger: Tally `New lead` (name, e-mail, budget, message).
- ① Create Sheets row (map all + timestamp). ② Router: budget ≥$500? → Hot : Nurture.
- ③ AI draft (GPT-4o-mini): prompt → personalized 80-word reply referencing [message] + 1 question + booking link.
- ④ Send Gmail instantly + Slack notify `#leads` (hot = @channel).
- ⑤ Create Notion Lead (optional) + follow-up date +3d.
- Cost: ~4 ops/run. Test: submit fake "Acme $1,200 landing" → row + e-mail in <2min + Slack ping.
- Prompt W1 (starter):
> You are a freelance SDR. Lead: [name], budget [X], message: "[msg]". Write ≤80-word first reply: 1 line referencing their message specifically, 1 credibility line ([proof]), 1 question to qualify, booking link line. Warm, short sentences, no hype. Service: [service].

## D. W2 — Auto Follow-up 3/7 Dias (spec)

- Trigger: Daily 9am → Search Sheets `Status=Contacted AND Next follow-up=today`.
- Loop: ① AI personalizer (reference last message + days since) → ② Gmail follow-up (thread? new) → ③ update Next +7d + touch count → ④ if touches≥3 → move to Long-term + stop.
- Guardrails: skip if Status changed to Won/Lost/Proposal (filter), max 1/day/lead, unsubscribe line.
- Templates: Day-3 nudge + Day-7 breakup ("close the loop?") — copy pronta no playbook.

## E. W3 — Invoice → Reminder → Thank You (spec)

- Trigger: Sheets/Notion `Invoice Status=Sent AND Due=today+3/today-1/-7` (3 paths).
- T+3: friendly reminder + payment link. T-1: firm nudge + late note. T-7: final + pause-work line (template!). On `Paid`: thank e-mail + review ask (link) + update Dashboard.
- Copy EN pronta (3 e-mails, <100 words each) + "pause work" script sem queimar cliente.

## F. W4–W12 ( outlines para completar no mesmo padrão)

- W4 Booking + reminders (Cal.com → e-mail/SMS T-24h/T-1h + no-show rescue).
- W5 Idea → draft → calendar (form/voice → AI draft → Notion #6 calendar + Slack review).
- W6 Repurpose (blog URL → X thread + LinkedIn + Reel script → Sheets queue).
- W7 Testimonial engine (project Done → ask → wall + social draft).
- W8 Cart/DM nudge (Beacons/Lemon webhook → 24h nudge + FAQ).
- W9 Money digest (Sun 6pm: week income/spent/top clients → e-mail + Slack).
- W10 Support triage (Gmail label → AI draft → Sheets log, human approve).
- W11 Proposal generator (brief form → AI proposal → Docs draft → e-mail).
- W12 Churn saver (retainer end-14d → value recap + renew offer).
Plus W13–W16: FAQ bot (RAG-lite via Sheets Q/A), affiliate digest, content recycle, lead scoring v2.

## G. Cost calculator (sheet 1 aba)

Inputs: workflows ativos, runs/mês cada, ops/run. Outputs: total ops, plano Make (Free 1k/Core 10k), custo AI (~tokens × $/1k), total $/mês + horas salvas × $/h = ROI. Pré-preencha exemplo: 200 leads/mês = ~1.1k ops = Free/Core + $2 AI → 12h salvas.

## H. Vídeos (6 × 5–8min)

1. Zero→Make: conta, OAuth, 1º cenário W1 import live. 2. W1 test end-to-end. 3. W2 loop+filters. 4. W3 reminders. 5. W5 content pipeline. 6. Debug clinic: 3 breaks reais + fix. Grave com zoom 125%, narração IA ok, captions on.
