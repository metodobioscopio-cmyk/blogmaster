# Growth Design Playbook

## The complete system for building exponential websites with AI

---

**How to read this.** This playbook is the course in text form. It does not replace the videos — it
replaces the need to rewatch a lesson to recall a detail. Every chapter ends with what to do and how
to know you did it right.

**Disclaimer.** Educational material. This product teaches a method and the use of third-party tools.
There is no guarantee of traffic, search ranking, sales or income: results depend on execution, market
conditions and the behaviour of platforms we do not control. The APIs presented are third-party
services purchased directly by the student — not included in the course.

---

## Contents

1. The end of linear design
2. The AI Growth Stack ecosystem
3. Vibe Design — extract
4. Vibe Design — recombine and build
5. The growth funnel
6. Diagnosis: reading the SEO score
7. Conversion: where visitors give up
8. Copy: what AI does not do for you
9. Landing page: the refinement
10. Social amplification
11. Technical setup, cost and risk
12. From service to revenue

---

## Chapter 1 — The end of linear design

### The problem is not the layout

Picture two websites that look identical. One was delivered and abandoned. The other receives a
round of diagnosis and correction every month. A year later, the first looks exactly as it did on
delivery day — only older. The second has accumulated thirty improvement cycles.

The first is **linear**. The second is **exponential**. The difference was never in the design; it
sits in what happens **after** launch.

Linear design has three recognisable traits:

1. It is measured once — on delivery day, and by opinion ("I liked it", "it looks modern").
2. It cannot answer the question "what has changed since then?".
3. Every fix starts from scratch, because no decision was recorded.

### Why this became unsustainable

Traditional consulting solves the problem with specialists: an SEO analyst, a copywriter, a conversion
expert. Each looks at one dimension. The work is good, but expensive and slow — and most businesses
below a certain size simply never hire it.

What changed: **the three readings that supported that work became APIs.** One API reads meta tags,
structure and content signals and returns a score with specific recommendations. Another evaluates
forms, CTAs and trust signals. A third writes the copy. A fourth optimizes the page, a fifth amplifies
on social.

Each capability existed before, scattered across consultancies. Technology made them **accessible,
repeatable and measurable**.

### What you start selling instead

The value shift is not "using AI". It is that your work stops being an **event** (the site delivery)
and becomes a **system** (the site as an organism that is measured and corrected). That changes three
things in the commercial relationship:

- the scope, which no longer ends;
- the price, which is no longer paid once;
- the proof, which stops being aesthetic and becomes numerical.

> **Common mistake.** Starting with design. The correct order is: measure (what is wrong?), produce
> (what to say?), refine (how to present?), amplify (who else sees it?). Starting with design means
> designing a solution to a problem you have not diagnosed yet.

### Chapter exercise

Pick one of your sites or a client's. Answer in writing, without asking anyone:

1. What was the goal of this site in numbers? (leads/month, sales/month, signups/month)
2. What is the number today — and how old is that data?
3. What changed on the site in the last 12 months, and why?

If you could not answer question 3, the site is linear. That is your starting point.

---

## Chapter 2 — The AI Growth Stack ecosystem

### Six capabilities, not six tools

The stack covers the complete growth cycle. The table below uses category names — commercial names,
endpoints and plans change over time and live in the provider's panel, where you should check them
**on the day you use them**.

| # | Capability | Input | Output | Phase |
|---|---|---|---|---|
| 1 | Website data extraction | URL | meta tags, contacts, links, images, structured SEO data | Intelligence |
| 2 | SEO analysis | URL | score 1–100 + recommendations + improvement plan | Diagnosis |
| 3 | Conversion optimization | URL | score + analysis of forms, CTAs, structure, trust signals | Friction |
| 4 | Website copywriting | brief/context | titles, meta descriptions, headings, CTAs, full page | Production |
| 5 | Landing page optimization | URL | headline, CTA, layout and conversion path analysis | Refinement |
| 6 | Social content generation | site content | platform-specific posts + hashtags | Amplification |

### The chain rule

Six independent services would each be worth little alone. The value is in the **chain**: one's output
feeds the next one's input.

```
EXTRACT → ANALYZE → WRITE → OPTIMIZE → CONVERT → AMPLIFY
```

Reading a competitor (1) reveals what they prioritise. Comparing the SEO score (2) turns that into a
concrete gap. The gap becomes a content brief (4). The produced page goes through refinement (5) and a
friction audit (3). The result is distributed (6), which brings new data into the next round.

### What the stack does not do

Be explicit about this with clients — and with yourself:

- **It does not replace strategy.** If the offer is weak, no optimization saves it.
- **It does not guarantee search positions.** Nobody controls the algorithm.
- **It does not know your business.** The API measures the page; it does not know your margin, your
  sales cycle or what your customer values.
- **It does not fix the page by itself.** It points; you edit.

### Chapter exercise

Draw the six-stage funnel for a real project. Next to each stage, write (a) the artifact it produces
and (b) who owns it in your process. If you cannot name (b), you have a bottleneck — and that is where
the next project will stall.

---

## Chapter 3 — Vibe Design: extract

### What extracting means

Extracting means reading a reference site and capturing **decisions**, not pixels. That is the
difference between learning and copying.

A good extract answers nine questions:

| Dimension | Question | Useful answer |
|---|---|---|
| Concept | What central idea does the site chase? | "Technical authority without arrogance" |
| Palette | How many colors, with what function? | 6: paper, ink, secondary, accent, line, state |
| Typography | What scale and what contrast? | High-contrast serif in headings, sans in body, ratio ~1.25 |
| Spacing | Base unit and rhythm? | Base 8, airy density, 6rem sections |
| Form | Radius and shadow? | Zero radius, shadow only on floating elements |
| Motion | What moves, and to what purpose? | Scroll reveal fade; nothing bounces |
| Layout | Width and columns? | 72rem content, two asymmetric columns |
| Voice | What tone, with what evidence? | Direct, technical, no superlatives — evidence: the headings |
| Limit | What only works there? | A dark background would fail on a long-read page |

### The tool: the Data Extraction API

The extraction API (stage 1) returns the raw stratum: meta tags, titles, contacts, links, images and
SEO data. It does not return aesthetics — it returns **structure and language**. The aesthetic reading
is yours.

The strongest use is not a beautiful reference site: it is your **client's competitor**. Where they
lose SEO points, which pages exist, how they write the call to action. That is competitive
intelligence — and it is the stage almost nobody does before designing.

### The Thousand-Dollar Prompt

The prompt that does the heavy lifting is in the kit library (§1, prompt 01). It forces the model to
return tokens instead of adjectives. Three rules when using it:

1. **Paste real data.** Without the API return, the model describes what it imagines.
2. **Demand the "not inferable" column.** It prevents inventing values that do not exist.
3. **Ask what NOT to copy.** A good system in one context can be terrible in another.

### The line you do not cross

Extracting proportion, rhythm, contrast and temperature is legitimate learning — like a musician
picking out a harmony by ear. Copying logos, illustration, photography, source code or literal text is
copyright infringement.

The practical distinction: **a system is learning, an asset is property.** Write that somewhere
visible in your process. You will need to justify that difference to a client one day.

### Chapter exercise

Choose three reference sites from different segments. For each, fill in the nine-dimension table —
writing "not inferable" where there is no evidence. Then answer: which of the three decisions would
you carry into a project in a different field, and why?

---

## Chapter 4 — Vibe Design: recombine and build

### Recombining is the step almost nobody takes

Most professionals extract from **one** reference and reproduce it. That is derivative — and the result
remembers its source. Recombining means swapping variables across different sources until the outcome
resembles none of them.

| Axis | Sources | Caution |
|---|---|---|
| Typography | A, B, C | two display families compete with each other |
| Palette | A, B | the accent must come from a single source |
| Rhythm and spacing | A | mixing a 4 and an 8 base creates visual holes |
| Motion | the most contained | two animation languages become noise |

**Traceability rule.** Keep a record of which reference each variable came from. This is not
bureaucracy — it is the proof of your originality, and it is what you show if anyone asks why the
result looks the way it does.

### Building as code

The build order is not negotiable:

```
tokens → layout primitives → components → pages
```

**Tokens** are the decisions: color with function, type scale, spacing, radius, motion. They live in a
`:root` block. Nothing else in the project is allowed to define a value.

**Primitives** are the skeleton: container, grid, section, stack.

**Components** are the reusable pieces: button, card, accordion, form field.

**Pages** are assembly. If the three layers above are right, assembling a new page becomes an
afternoon's work.

### Why starting with a page fails

Designing page by page means making a color, size and spacing decision on every new screen. After five
pages there are forty different values in the project and no system — just a collection of isolated
decisions that do not talk to each other. By the sixth client, people start noticing that your sites
"all look the same" — or worse, that each one looks like a different template.

### A concrete example

This product is built that way:

- `tokens.css` — 3 paper tones, 3 ink tones, 1 accent, 3 states, 8 type sizes, 12 spacing steps,
  3 radii, 3 motion durations. Nothing else.
- `base.css` — reset, container, section, grid, editorial typography.
- `components.css` — button, navigation, card, accordion, form, footer.
- pages — assembly.

Any change to the entire identity happens by editing one file. That is the difference between having a
system and having a site.

### Chapter exercise

Take the three references from the previous chapter. Build a 4×3 matrix and pick one variable per axis.
Write the resulting tokens into a `:root` block. Then apply it to **one** simple page and verify the
contrast of every text/background pair: minimum 4.5:1 in body text.

---

## Chapter 5 — The growth funnel

### The sequence, and why it is that one

```
1 EXTRACT → 2 ANALYZE → 3 WRITE → 4 OPTIMIZE → 5 CONVERT → 6 AMPLIFY
```

Three principles govern the order:

**Measure first, produce second.** Writing copy before the diagnosis means producing text for a problem
you have not identified.

**Produce before optimizing.** Optimizing a page with a confusing offer is polishing the wrong place.

**Amplify last.** Distributing bad content multiplies the damage. Distributing good content multiplies
the result.

### Phase 1 — Research (extract + analyze)

Goal: know who you are competing with and where the gap is.

- Run extraction on 3 direct competitors.
- Run SEO analysis on your page and theirs.
- Produce a one-page dossier: the three exploitable gaps and the three advantages you already have.

**Completion criterion:** you can say, in one sentence, why someone would choose your page over the
competitor's.

### Phase 2 — Content (write)

- Define the page's dominant intent (informational, comparative, transactional).
- Generate the text with the diagnosis as context, not a generic prompt.
- Review for: truth, specificity, voice. All three, in that order.

**Completion criterion:** a stranger scanning the headings understands the page without reading the body.

### Phase 3 — Optimization (refine)

- Run the page through the landing page optimizer.
- Compare its recommendation list with your conversion checklist.
- Fix what appears on both lists.

**Completion criterion:** the first fold alone answers the four questions — what it is, who it's for,
what you get, what to do.

### Phase 4 — Amplification

- Generate social content from the already-optimized page.
- Build a 30-day calendar with a 70/20/10 split (useful / proof / offer).
- Record what generated clicks, not just what generated reach.

**Completion criterion:** new traffic is reaching the page, and it is recorded.

### The cycle, not the line

Step 6 feeds step 1: social data shows what the audience cares about, and that changes your next
content brief. That feedback is what turns a delivery into a system.

### Chapter exercise

Run the full funnel on one of your pages. Time each phase and record the initial and final scores. The
time each phase took is your real estimate for the next commercial proposal — not the time you think
it takes.

---

## Chapter 6 — Diagnosis: reading the SEO score

### What the number means (and does not)

The SEO analysis returns a 1–100 score with recommendations. Three wrong readings, in order of frequency:

1. **Chasing 100.** The score is an average of factors, not a measure of outcome.
2. **Optimizing for the API.** The page exists for the visitor. The score is a means.
3. **Ignoring intent.** A technically perfect page that answers the wrong question does not rank.

### Turning a number into work

The path is always the same: finding → impact → effort → owner → deadline → completion criterion.

| Finding | Impact | Effort | Completion criterion |
|---|---|---|---|
| Missing meta description on 12 pages | Medium | 3 h | 12 metas rewritten, keyword near the start |
| Missing H1 on the service page | High | 20 min | Single H1 with the main promise |
| Price image with no text equivalent | High | 1 h | Price in text, verified on mobile |
| Thin content on a ranking page | High | 6 h | New section answering the main question |

Note the difference between "improve SEO" (not a task) and "rewrite the metas on 12 pages with the
keyword near the start" (a task, and you can tell when it is done).

### The 30-day plan

Four weeks, at most four items per week:

- **Week 1 — foundation.** Indexing, titles, metas, heading structure, broken internal links.
- **Week 2 — priority content.** The two pages with the highest potential and lowest score.
- **Week 3 — experience.** Image weight, mobile legibility, contrast, forms.
- **Week 4 — re-analysis.** Run the API again, compare, and pick next month's brief.

### How to measure again (without fooling yourself)

Compare **the same page**, with **the same keyword**, over a 30-day interval. A score without a
comparison says nothing. And log the round in the dashboard — in three months you will not remember the
initial score, and that is exactly the number the client will ask for in the meeting.

### Chapter exercise

Run the analysis on one of your pages. Pick the three highest-impact, lowest-effort recommendations.
Implement them today. Run the analysis again in 7 days and compare.

---

## Chapter 7 — Conversion: where visitors give up

### Order of diagnosis matters

Nine out of ten pages that "don't convert" have a problem in the first three items below — and the
professional usually starts editing item seven.

1. **Offer clarity.** In 5 seconds, did they understand what it is, who it's for, what they get, what to do?
2. **Audience fit.** Does the promise match what the visitor clicked to get here?
3. **Trust signals.** Is there real proof that you exist and deliver?
4. **Call to action.** One primary action, clear, with microcopy that reduces fear of clicking.
5. **Form.** Only necessary fields, visible labels, errors that say what to do.
6. **Structure and reading.** Short paragraphs, headings that work out of context.
7. **Price and terms.** Stated before the final button, not hidden behind "contact us".
8. **Technical.** Speed, contrast, working on mobile.

### The asymmetry between SEO and conversion

SEO brings people. Conversion turns people into customers. An elementary mistake: buying traffic for a
page that does not convert. You pay more for every lead — and the ad platform reads the poor result as
a poor audience, making everything more expensive.

If the page has a clarity problem, **fix it before buying traffic.** That order saves money.

### Trust signals: strong versus decorative

| Signal | Real strength | Note |
|---|---|---|
| Testimonial with name, context and a number | Strong | requires written permission |
| Address, company ID, phone visible | Strong | proof of existence |
| Real photo of the team or premises | Strong | verifiable |
| Purchased badge with no verification | Decorative (and risky) | legal liability, not trust |
| "Over 10,000 customers" with no source | Decorative | destroys trust when doubted |
| Scarcity counter that resets | Negative | breaks the relationship at first detail |

### About A/B testing

A/B testing needs volume. Below a few hundred conversions in the period, the difference you see is
usually noise. If volume cannot produce a conclusion within four weeks, use heuristic review, a
5-second test or an interview. Declaring victory without a sample is the most expensive way to learn
something wrong.

### Chapter exercise

Walk through the eight items on your main page and mark what is solved. Then show the page to someone
who does not know the business, for 5 seconds, and ask what they understood. Compare with what you
thought was written.

---

## Chapter 8 — Copy: what AI does not do for you

### AI writes fast. You decide what is true

The fourth API generates titles, meta descriptions, headings, CTAs and full pages. It solves the
production bottleneck. It does **not** solve:

- what is true about your product;
- what your audience values;
- what your brand cannot say;
- what you are willing to promise.

Those four are human decisions, and they are still the work.

### Three questions before publishing

1. **Is it true?** Every product claim must be verifiable.
2. **Is it specific?** Sentences that would fit any company in the sector are noise.
3. **Does it sound like the brand?** If the client distrusts the tone, they will not publish it.

### The copy production flow

```
diagnosis → brief by intent → generation → truth review → voice review → publication
```

Every arrow is a step that consumes time. Professionals who "generate and publish" produce volume at
average quality — and the volume of generic text on the internet is already large enough.

### Structure that works in most cases

| Block | Purpose | Common mistake |
|---|---|---|
| Eyebrow | contextualises in 3–5 words | repeating the heading |
| Heading | a concrete promise | describing the product |
| Sub | how and for whom | adjectives with no number |
| Body | objection → answer, in blocks | a long story about the company |
| FAQ | removes the doubt blocking purchase | decorative questions |
| CTA | action and next step | "click here" |

### Writing for search without becoming a robot

The keyword goes where it makes sense — almost always in the title and the first paragraph. Forced
density reads to the visitor as strangeness, and strangeness is the opposite of conversion. The
practical rule: read it out loud. If you would not say that sentence to a client, cut it.

### Chapter exercise

Take an AI-generated text for one of your pages. Mark in red every claim you cannot prove and in yellow
every sentence that would fit any competitor. Rewrite everything marked.

---

## Chapter 9 — Landing page: the refinement

### The first fold decides

Before any test, there is an uncomfortable truth: most visitors will not scroll. The first fold has to
work on its own.

Four questions, answered in 5 seconds:

1. **What is it?**
2. **Who is it for?**
3. **What do I get?**
4. **What do I do now?**

If answering any of these takes effort, the page loses before the second paragraph.

### Block order

The order that works in most cases — with the reason, so you can adapt instead of memorising:

1. **Promise** — the decision to keep reading happens here.
2. **Problem** — those who have the pain recognise themselves and continue.
3. **Mechanism** — why your solution works. Reduces perceived risk.
4. **Proof** — what reduces distrust.
5. **Offer** — what is included, what is not, the price.
6. **Objections** — the questions blocking the decision, answered before they are asked.
7. **Action** — the request, repeated.

### Negative scope is a sign of competence

State what is **not** included. It looks like selling less and sells more: it removes the wrong
expectation, avoids post-sale friction and signals that you know exactly what you do.

### Conversion path

The path is the journey between arriving and converting. Every extra step is a drop-off. Three
principles:

- **Fewer fields, more conversions** — as long as the remaining fields are actually used.
- **One destination.** Every CTA on the page goes to the same place.
- **Fear reduction in the microcopy.** "Reply within one business day" beats "no obligation".

### What to do when there is no traffic

Optimizing conversion with little traffic is tuning an instrument you cannot read. In that case: work
on clarity (which is objective), collect objections in real conversations and use the first leads as a
source of qualitative data.

### Chapter exercise

Rewrite the first fold of one of your pages, answering the four questions in order. Then show it to
someone for 5 seconds and ask them to repeat what they understood. Fix and repeat — three rounds.

---

## Chapter 10 — Social amplification

### One source, four formats

The social generator turns site content into posts per platform. The classic mistake is publishing the
same text everywhere. Each network has a behaviour:

| Platform | What works | What does not |
|---|---|---|
| X / Twitter | one idea, surgical cut, conversation | long institutional text |
| LinkedIn | professional context, strong first line | decorative hashtags, emoji overload |
| Instagram | visual first, caption supporting the artwork | "link in bio" when the goal is different |
| Facebook | explanatory tone, clickable link | technical jargon |

### The 70/20/10 split

In one month of content:

- **70% useful** — teaches, solves, shows;
- **20% proof and authority** — results, behind the scenes, lessons with real data;
- **10% offer** — the direct invitation.

Inverting that proportion turns an audience into a tired public. Three invitations a month in a
thirty-piece calendar is enough.

### What to measure (and what is vanity)

| Metric | Used for | Caution |
|---|---|---|
| Reach | channel distribution | high reach with zero action is a bad diagnosis |
| Clicks | intent | the metric that matters for traffic |
| Saves | perceived value | strong on Instagram, signals useful content |
| Conversions | business outcome | the only one that pays the bills |

Reach is the most watched and least decisive metric. If a post had 50,000 views and no clicks, what you
learned is that it was interesting — not that it worked.

### The cycle

Social content closes the funnel: it brings a new visitor to the optimized page. And it brings
information back — what the audience comments on indicates what they want, and that changes your next
content brief. That feedback is what makes the system exponential rather than linear.

### Chapter exercise

Take your best-performing page. Generate twelve pieces from it and build the 30-day calendar with the
70/20/10 split. Record performance in the dashboard and, at the end of the month, drop the three worst
pieces and repeat the format of the three best.

---

## Chapter 11 — Technical setup, cost and risk

### What you need to know before starting

The six APIs are third-party services hosted on a marketplace. You subscribe to each in your own name.
Before confirming any plan, answer:

- How many requests does the plan include?
- What is the per-second or per-minute limit?
- What happens when the quota runs out: does it stop, or does it charge overage?
- What is the cost per thousand requests above the plan?

Without those four answers you do not know the cost of your service — and you will find out on the
invoice.

### Cost estimate per project

The full funnel on one page consumes between 6 and 12 calls, depending on how many APIs you use. For
five pages and three rounds: 90 to 180 calls. Put the cost of those calls into the proposal before
you set the price.

### Cache: the detail that separates the professional

Without cache, every time you run the same diagnosis you pay again. With a cache keyed on URL + stage +
date (24 h validity), cost drops and the second query is instant. The kit's code clients already
implement this.

### Error handling

The most important rule: **when an API fails, the flow stops.** Never "continue anyway". A flow that
proceeds with an empty response produces a beautiful and false report — and the client finds out in the
meeting, in front of the decision maker.

| Status | Meaning | Action |
|---|---|---|
| 429 | Quota exceeded | check the limit; wait or upgrade |
| 403 | Plan has no access to the endpoint | check the subscription |
| 404 | Endpoint changed | read the current documentation |
| 200 with empty body | The target site blocked the bot | change the test URL; document it |

### Dependency risk

Third-party services change prices, limits and — eventually — shut down. You do not control that, and
you should say so when a client asks. The protection is not picking the eternal provider: it is that
the **method** survives the tool. The six-stage funnel stays valid when a specific vendor is replaced.

### Key security

The API key is a billing credential. It does not go in the front end, does not appear in screenshots,
does not show up in videos and is not pasted into AI prompts. The browser talks to your server; your
server talks to the API.

### Chapter exercise

Build the cost spreadsheet: for each of the six APIs, plan, limit, unit cost and estimated cost in your
typical project. Calculate the cost per analyzed page. That number goes into your proposal.

---

## Chapter 12 — From service to revenue

### The "Exponential Site" package

The most direct way to turn the skill into revenue is to package it in three tiers. Each tier's logic is
to remove a different client objection.

| Tier | Scope | Objection it removes |
|---|---|---|
| **Diagnosis** | audit with the extraction, SEO and conversion APIs; report and 30-day plan | "I don't know if this is worth touching" |
| **Exponential Site** | diagnosis + rewrite + page optimization + 30 days of social content | "I have nobody to execute it" |
| **Continuous Growth** | monthly: new pages, continuous optimization, progress report | "I want someone to take care of this" |

### Price for value, not hours

Hourly pricing punishes exactly the people who got good. If you solve in two hours what a competitor
solves in ten, hourly you earn five times less.

The path is to anchor on value: what is the cost of the problem to the client? How much do they lose
per month while the page does not convert? Your price is a fraction of the cost of the problem, not a
fraction of your time.

**Practical anchoring:** present three bands (essential, recommended, complete) with different scopes.
The middle band is chosen most often — build your proposal knowing that.

### What never to promise

- search position;
- traffic volume;
- revenue;
- ranking timeline;
- "first place on Google".

Promising any of those is selling what you do not control. What you do control: measuring, diagnosing,
fixing, recording and reporting. Promise that.

### Recurring revenue: why it is the most important decision

A project paid once ends and you are back to zero on prospecting. A recurring contract funds the next
improvement and reduces commercial pressure. What sustains recurrence is not the monthly fee: it is the
perception of value **every month**. Deliver something visible each month — a report, a new page, a
measured improvement.

### Scaling without multiplying the team

Scaling has three levers, in this order:

1. **Standardize** — the same six-stage flow for every project.
2. **Automate** — the API calls inside the flow; judgement stays with you.
3. **Delegate** — only after 1 and 2 are documented. Without process, delegating multiplies error.

Human review remains mandatory at three points: reading the diagnosis, deciding scope and approving the
final published text.

### One-page proposal

1. Current situation in 5 lines, with numbers.
2. What we will do, in 3 phases, with verifiable deliverables.
3. What is **not** included.
4. Timeline and what depends on the client.
5. Investment in three options.
6. How we measure success and when we read the result.
7. Next steps with a date.

### Chapter exercise

Write your price table in three bands. For each, define: scope, timeline, deliverable, success criterion
and what is not included. Show it to a trusted client and ask for their reaction — not to approve the
price, but so you can hear the first question they ask.

---

## Appendix — Compliance and ethics

This appendix is not fine print. It is what keeps your business standing.

### 1. No fabricated testimonials
Invented testimonials are misleading advertising. Real testimonials require written permission —
including for the use of name and image. If you do not yet have a student or client with results, show
the empty space or remove the section. Do not fill it.

### 2. No fabricated results
No traffic, revenue or timeline number that has not been measured. Every claim with a number needs a
source and context. "In 6 weeks, quote requests from the site went from 4 to 11 per month, in sector X,
during period Y" is verifiable. "Multiply your results by 10" is not.

### 3. Guarantee
In Brazil, the right of withdrawal for purchases outside a commercial establishment is 7 days (art. 49
of the Consumer Protection Code). Declare it and honour it, without bureaucracy.

### 4. Transparency about what is not included
API subscriptions belong to the student, not the course. That must be on the sales page, in the FAQ and
in the first lesson of the technical module. The most predictable complaint about a product like this is
the student who bought believing the subscription was included.

### 5. Copyright in Vibe Design
Extracting a system is learning. Copying an asset is infringement. The distinction is detailed in
Chapter 3. Materialize it in your process: keep a record of variable provenance and never carry
third-party files into a client project.

### 6. Independence
This product is not affiliated with, sponsored by or endorsed by the API marketplace, the service
providers or the payment platforms mentioned. Trademarks belong to their owners and are named only to
identify the services.

### 7. Privacy
If you collect personal data (forms, lists, analytics), you are the controller of that data: you need a
declared purpose, a legal basis, a retention period and a path for the data subject to request deletion.
On any page that collects data, the privacy policy must be one click away.

---

## Closing

You have finished the playbook. What separates this material from one more watched course is what
happens in the next 48 hours.

**Do this today:** pick a real page and run the full funnel — all six stages, in order. Record the
initial and final scores, what you changed and what you learned. Then repeat with a client.

The method is only worth anything when it becomes a habit. And habit is what turns a website from a
delivery into a system.

---

*Growth Design Playbook · Growth Design Pro · v1.0 · Editorial Premium identity*
*Support: hello@growthdesignpro.com · Toolkit licence at site/legal/licenca.html*
