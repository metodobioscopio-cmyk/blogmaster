# STARTER-KIT #1 — Freelancer OS (base para terminar)

> Complete este arquivo até virar o produto. Quando terminar, exporte o Quickstart para PDF e grave o Loom seguindo o roteiro abaixo.

## A. Schema Notion (crie exatamente assim)

**DB: Leads (table + board by Status)**
- Props: Name(title), Status(select: New/Contacted/Proposal Sent/Negotiating/Won/Lost), Source(select: Upwork/Fiverr/Referral/X/LinkedIn/Other), Value(number $), Next Follow-up(date), Notes(text), Created(time)
- View `🔥 Follow-up Today`: filter Next Follow-up ≤ today AND Status ≠ Won/Lost, sort by date asc
- View `💰 Pipeline`: board by Status, sum Value

**DB: Proposals**
- Props: Name, Client(relation Leads), Type(select: Hourly/Fixed/Retainer), Amount($), Status(select: Draft/Sent/Accepted/Declined), Link(url), Sent date, Valid until
- Template buttons: `New Hourly`, `New Fixed`, `New Retainer` (page template com copy do STARTER C)

**DB: Projects (board)**
- Props: Name, Client(relation Leads), Status(Backlog/Doing/In Review/Done), Priority(High/Med/Low), Deadline(date), Fee($), Proposal(relation Proposals), Progress(formula: done tasks/total), Link(url)
- View `This Week`: Deadline within 7 days AND Status ≠ Done

**DB: Invoices**
- Props: Number(title: INV-001…), Project(relation Projects), Client(relation Leads via rollup), Amount($), Issue date, Due date, Status(Draft/Sent/Paid/Overdue), Payment link(url), Notes
- Formula `Days overdue`: if(Status="Overdue", dateBetween(now(), Due date, "days"), 0)
- View `🚨 Needs action`: Status = Sent (due ≤7d) OR Overdue

**DB: Tasks**
- Props: Task(title), Project(relation), Due(date), Priority, Done(checkbox), Context(select: Deep/Shallow/Admin)

**DB: Transactions (finance)**
- Props: Name, Type(Income/Expense), Amount($), Date, Category(select: Client work/Tools/Fees/Learning/Other), Relation Invoice (optional)
- Rollup no Dashboard: `Revenue MTD` = sum Income where month = this month

**Dashboard Home (page com linked views):**
1. H1 `Good morning, [Name] ☀️` + quote rotativo
2. 3 KPI callouts: `💰 Cash in (MTD)` / `⏳ To collect` / `🎯 Goal %`
3. `🔥 Today`: linked Tasks due today + Follow-ups today (2 colunas)
4. `💰 Pipeline`: linked Leads board mini (4 colunas)
5. `🚨 Invoices needing action`: linked table (5 linhas)
6. `📅 This week`: linked Projects mini
7. Buttons: `+ New Lead` `+ New Invoice` `+ Log Expense`

## B. Dummy data (pré-carregar — delete em 1 clique)

- Leads: `Acme Co (Upwork, $1,200, Proposal Sent)`, `Lena — Coach (Referral, $800, Negotiating)`, `DevShop (X, $2,500, Contacted)`
- Projects: `Acme landing copy (Doing, due +4d, $1,200)`, `Lena sales page (Backlog, $800)`
- Invoices: `INV-014 Acme $600 Paid`, `INV-015 Lena deposit $400 Overdue (due -6d)`
- Transactions: 6 linhas exemplo (2 income, 4 expense: Notion $0, Canva $15, Stripe fee $18, Domain $12)
- Settings page: botão `🗑️ Clear demo data (1 click)` = instruções para deletar view filtrada `Demo=true` (adicione checkbox Demo em todas DBs).

## C. Copy pronta (EN) — colar nos templates

**Proposal — Fixed (template):**
> Hi [Name] — here's the plan for [Outcome] in [Timeline].
> **Scope:** [3 bullets]. **Out of scope:** [1 line]. **Investment:** $[X] (50% to start, 50% on delivery). **Timeline:** kickoff [date], delivery [date]. **Next step:** reply "approved" and I'll send the invoice + kickoff form. — [You]

**Follow-up 3 days (swipe):**
> Hi [Name], floating this up — happy to start [date] if helpful. Want me to hold your slot? If timing changed, just say the word and I'll close the loop. 🙏

**Overdue 7 days:**
> Hi [Name], quick nudge — invoice [INV] for $[X] was due [date]. Here's the link again: [link]. If already paid, ignore me! Otherwise, could you confirm a payment date? Thanks so much.

**Onboarding e-mail:**
> You're in! 🎉 1) Pay deposit [link] 2) Fill 5-min brief [link] 3) Book kickoff [link]. I start within 48h of all 3. Talk soon — [You]

**Briefing form (5 perguntas):** goal / audience / examples you love / must-have vs nice-to-have / deadline + budget range.

## D. Roteiro Loom 15min (capítulos)

1. 0:00 — "What you got + what you'll have in 15min" (mostrar dashboard final)
2. 1:30 — Duplicate + tour 60s (apontar 3 KPIs)
3. 4:00 — Add your first lead (live, 1 exemplo real do viewer)
4. 6:30 — Proposal → Project → Invoice flow (1 fluxo completo, sem teoria)
5. 11:00 — Log expense + goal bar (money dashboard)
6. 12:30 — Customize: rename, colors, delete demo (Settings)
7. 14:00 — "Your 10-min homework" + onde pedir ajuda (reply e-mail)

## E. Quickstart PDF 6 páginas (estrutura)

1. Capa + "setup in 15min" checklist
2. Duplicate + tour com screenshot anotado
3. Seu primeiro fluxo (lead→paid) em 5 passos
4. Dinheiro: metas + собираемость (collect) semanal ritual 20min (sexta)
5. Customização + Client Portal (share settings corretos)
6. FAQ + suporte + link Plus/bump

## F. Checklist de qualidade antes do upload

- [ ] Duplicate testado em conta Notion zerada (janela anônima)
- [ ] Todas relations funcionam após duplicate (bug #1: relation quebrada)
- [ ] Mobile: dashboard legível no app (screenshots iPhone)
- [ ] Nomes EN sem typo, $ como moeda, datas MM/DD
- [ ] Links: Loom (unlisted) + PDF hospedado no Lemon (não Drive público)
