# GOLDEN PROMPT LIBRARY — 52 prompts for the Growth Stack
### Growth Design Pro · Tool Kit · English

---

## How to use this library

**What these are.** Structured instructions that turn the output of the six stack APIs into shippable
work: a diagnosis that was actually read, a content brief, copy that was edited, an optimized page and a
distribution plan. None of them replace the data the API returns — they all assume you already ran the call.

**Context before question.** A prompt without real data produces generic text, and generic text doesn't
sell. Always paste the analyzed URL, the returned score, the page excerpt, the audience and the offer.
If you don't have that data, the right move isn't to improvise — it's to run the API first.

**Markup.** `[INSIDE BRACKETS]` is a required field you fill in. Everything outside brackets can be used as is.

**Where to run it.** All of these work in ChatGPT, Claude, Gemini or Cursor / Claude Code. Agent prompts
(§6) are written for tools with file and terminal access.

**Human review before publishing.** Every AI output passes three questions before it becomes a live page:
(1) is it true? (2) is it verifiable? (3) does it sound like the client's brand? If any answer is "no", rewrite.

---

## Contents

| Section | Prompts | Purpose |
|---|---|---|
| §1 | 01–06 | Design system extraction (Vibe Design) |
| §2 | 07–12 | Diagnosis: SEO, conversion and competitors |
| §3 | 13–20 | Content and copy production |
| §4 | 21–26 | Landing page and conversion |
| §5 | 27–32 | Social and amplification |
| §6 | 33–38 | Orchestration with AI agents |
| §7 | 39–46 | Strategy, proposals and monetization |
| §8 | 47–52 | Quality, ethics and compliance |

---

# §1 — Design System Extraction (Vibe Design)

> Input: **Website Data Extraction API** output (meta tags, text, links, structure) plus a visual description.
> Without the API, paste the text and relevant HTML manually.

## 01. Full design system extraction
**When:** first step of any new project, before opening the code editor. **Goal:** turn a reference site into CSS tokens.

```
You are a senior systems designer specializing in reverse-engineering design systems.

Analyze the data below, extracted from [URL], and produce a REUSABLE design system — not an aesthetic review.

<data>
[META TAGS, TEXT, STRUCTURE, LINKS — paste the Extraction API output]
</data>

<visual_notes>
[DESCRIBE WHAT IS VISIBLE: dominant colors, type styles, density, use of borders and shadows]
</visual_notes>

Return, in this order:

## 1. Concept (2 sentences) — the site's central idea and the feeling it chases.
## 2. Palette — 6 colors in HEX with each one's FUNCTION: background, primary text, secondary text,
     accent, lines/borders, state (success/error). If you cannot infer safely, write "not inferable".
## 3. Typography — apparent families and classification (serif/sans/mono), likely weights, scale ratio
     between heading and body, perceived tracking. NEVER assert an exact font name: classify it.
## 4. Spacing — estimated base unit (4 or 8 px) and overall rhythm: dense, medium or airy. Justify with an example.
## 5. Form — radius patterns, use of border, use of shadow (none / subtle / dramatic).
## 6. Motion — what moves, how fast, to what purpose. If there is no evidence, write "not observable".
## 7. Layout — likely content width, column count, use of asymmetry.
## 8. Tone of voice — 5 adjectives, each with a short excerpt from the site as evidence.
## 9. What NOT to copy — 3 traits that only work in that context and should not be carried elsewhere.
## 10. Tokens — a complete CSS `:root` block with everything above, semantically named
      (`--paper`, `--ink`, `--accent`, `--fs-h1`, `--s-4`, `--r-md`, `--dur`).

CONSTRAINTS: do not describe pixels you cannot see; do not invent font names; do not reproduce more than
8 consecutive words of the site's literal text; no emoji.
```

## 02. Palette with contrast verification
```
From the colors below, organize a functional palette and VERIFY contrast.

Observed colors: [LIST THE HEX YOU PERCEIVED]
Use case: [CORPORATE SITE / E-COMMERCE / APP / LANDING PAGE]
Desired feel: [SOBRIETY / ENERGY / LUXURY / TECHNICAL]

Return a table: | token | hex | function | contrast over background | passes AA? |

Rules: body text pairs need 4.5:1 or better; large-heading-only pairs may sit at 3:1. If a pair fails,
propose the minimum luminosity adjustment that fixes it and show the new hex. End with a ready-to-paste
`:root` block. Do NOT invent colors that do not derive from the observed ones without flagging them as new.
```

## 03. Fluid type scale
```
Build a fluid (clamp) type scale for a design system.

Context: [PROJECT TYPE] · density [DENSE/MEDIUM/AIRY] · primary reading on [MOBILE/DESKTOP]
Families: display [FAMILY] · text [FAMILY] · mono [FAMILY]
Behavior target: hero heading should occupy [X]% of the viewport on mobile and [Y]% on desktop.

Return: (1) table | token | role | min size | max size | clamp() | line-height | tracking |;
(2) the corresponding `:root` block; (3) three display × text pairings that work together;
(4) a warning list of what NOT to do with this scale (e.g. display size in body copy, negative tracking on
light text, lines over 75 characters). Maximum 9 levels — do not create a token for every imaginable size.
```

## 04. Spacing rhythm and density
```
Diagnose the spacing rhythm described below and propose a scale.

Current layout: [HOW ELEMENTS ARE DISTRIBUTED — sections, cards, margins, inner padding]
Perceived problem: [E.G. EVERYTHING FEELS TIGHT / ODD GAPS BETWEEN SECTIONS]
Context: [PROJECT TYPE] · audience [AUDIENCE]

Return: (1) diagnosis — what exactly is inconsistent (mixed units? unrelated values?);
(2) a scale of 8 to 12 steps based on [4/8] px with semantic names and typical use;
(3) a VERTICAL spacing rule (heading→text, text→button, section→section); (4) the `:root` block;
(5) one golden rule in a single sentence the team can memorize.
```

## 05. Motion and interaction
```
Define the motion language for a design system.

Context: [PROJECT TYPE] · personality [CALM/AGILE/SOLEMN/PLAYFUL]
Moving elements: [MENU, BUTTON HOVER, CARDS, MODAL, SCROLL REVEAL]

For each element return one table row:
| element | trigger | duration | curve | offset/opacity | purpose |

Rules: duration between 100ms (feedback) and 700ms (revelation) — nothing above 700ms. Every animation
needs a declared purpose: orient, confirm or reveal. Nothing that delays reading or blocks clicking.
Return the CSS curves plus a `prefers-reduced-motion: reduce` version that disables motion.
```

## 06. Tone of voice from samples
```
Extract the tone of voice from the samples below and convert it into an operational instruction.

<samples>
[SITE OR BRAND TEXT — at least 300 words]
</samples>

Audience: [AUDIENCE] · Segment: [SEGMENT] · Objective: [OBJECTIVE]

Return: (1) five voice adjectives, each with the excerpt that proves it;
(2) a "we say / we don't say" table with 6 pairs of sentences;
(3) words the brand uses and words the brand avoids; (4) an 80-word reference paragraph written in that
voice about [TOPIC]; (5) negative instructions — 4 things a writer must not do in this voice.

Do not use marketing clichés ("innovative solutions", "excellence", "synergy") unless they appear in the samples.
```

---

# §2 — Diagnosis: SEO, Conversion and Competitors

> Input: **AI SEO Analysis API** (score + recommendations), **AI Conversion Optimization API**,
> **Website Data Extraction API** (competitor data).

## 07. Turn the SEO score into a work plan
```
You are a technical SEO analyst. Below is the raw SEO analysis output for [URL].

<analysis>
[PASTE THE FULL SEO API OUTPUT — score, dimensions and recommendations]
</analysis>

Business context: [BUSINESS] · primary keyword: [KEYWORD] · direct competitor: [COMPETITOR]

Convert it into a work plan:

## 1. Reading the score — explain the overall score in one sentence and identify the 2 dimensions that
     drag it down most. If per-dimension scores are absent from the output, say it cannot be analyzed by
     dimension instead of estimating.
## 2. Prioritization matrix — | # | Finding | Impact (high/medium/low) | Effort (hours) | Depends on | Deadline |
## 3. 30-day plan — Week 1 / 2 / 3 / 4, each with at most 4 tasks and a verifiable completion criterion
     ("meta description rewritten on the 8 main pages with the keyword near the start", not "improve SEO").
## 4. What NOT to do — 3 recommendations commonly made in this kind of analysis that are not worth the
     effort here, and why.
## 5. How to measure again — which URL to re-run, when, and what to compare.

CONSTRAINT: never promise Google positions, ranking timelines or traffic volume.
```

## 08. Competitor comparison
```
Compare my page with the competitor's, using ONLY the data below.

<my_page url="[URL]">[EXTRACTION OUTPUT + SEO SCORE]</my_page>
<competitor url="[URL]">[EXTRACTION OUTPUT + SEO SCORE]</competitor>

Niche: [NICHE] · Offer: [OFFER] · Audience: [AUDIENCE]

Return:
1. Comparison table: | dimension | mine | competitor | reading | — dimensions: title/meta, heading structure,
   content depth, social proof, call to action, trust signals, offer clarity.
2. The 3 gaps I can close in 30 days, with what to do in each.
3. The 3 advantages I already have that the client should know about.
4. A 5-title content brief exploring the gaps, each with search intent (informational, comparative, transactional).
5. What the competitor does better and I should NOT imitate, and why.

Use only the supplied data. Where data is missing, write "insufficient data".
```

## 09. Conversion audit ordered by impact
```
Read the conversion analysis below and rank the fixes by real impact on the outcome.

<conversion_analysis>[PASTE THE CONVERSION OPTIMIZATION API OUTPUT]</conversion_analysis>

Context: [BUSINESS TYPE] · average order value [VALUE] · monthly traffic [VISITS]
Page goal: [LEAD / SALE / BOOKING / SIGNUP]

Return: (1) the 5 highest-impact fixes in order, each with what to change, where, why it matters for THIS
business, and how to tell whether it worked; (2) split into "today" (under 2 h) and "project" (over 1 day);
(3) flag any listed problem that is actually a symptom of an earlier one — e.g. a weak button when what is
missing is offer clarity; (4) an honest warning: if monthly traffic is too low to measure a test, say so and
propose alternatives (user research, 5-second test, heuristic review).

Do NOT recommend A/B tests when volume cannot reach significance within 4 weeks.
```

## 10. Form diagnosis
```
Diagnose the form below with a focus on abandonment.

<data>
Fields: [LIST FIELDS AND WHICH ARE REQUIRED]
Position on page: [ABOVE THE FOLD / MIDDLE / BOTTOM / MODAL]
What the visitor gets: [OFFER]
Reported friction: [WHAT USERS SAY, IF ANYTHING]
</data>

Return: (1) each field rated essential, useful or removable today, with business justification;
(2) suggested microcopy for label, helper text, placeholder, error message and button text;
(3) perceived risk — 3 likely objections at the moment of filling and where to neutralize them on screen;
(4) recommended field order and why; (5) an alternative 3-field version where applicable, with final copy.

CONSTRAINT: never suggest collecting sensitive data without need; never use "no spam" as the primary trust signal.
```

## 11. Trust signals audit
```
Evaluate the trust signals on the page described.

<page url="[URL]">
Text content: [PASTE THE MAIN TEXT]
Visual elements mentioned: [TESTIMONIALS, LOGOS, BADGES, PHOTOS, CERTIFICATES, NUMBERS]
</page>

Sector: [SECTOR] · Price point: [VALUE] · Expected hesitation: [LOW/MEDIUM/HIGH]

Return: (1) inventory — each present signal rated for real strength (strong, weak, decorative);
(2) what is missing for this specific sector and price point; (3) a "minimum trust kit" that can be produced
in one week, with what to request from the client; (4) signals that only work if true — and therefore must
NOT be invented; (5) where to place each signal on the page, in order, and why.

Never suggest fake scarcity counters, invented buyer counts, or a countdown that resets.
```

## 12. Client-facing diagnostic report
```
Write a 2-page diagnostic report for [CLIENT NAME] from the data below.

<data>
SEO score: [SCORE] · Conversion score: [SCORE]
Main findings: [LIST 5 TO 10 REAL FINDINGS]
Competitor analyzed: [URL AND FINDINGS]
</data>

Tone: direct, professional, jargon-free. The reader is a business owner, not a technician.

Structure: (1) situation in one sentence (what works, what blocks); (2) the numbers — what they mean in
practice, not how the methodology works; (3) three priority problems, each with business impact, probable
cause and fix; (4) what is already good and should be kept; (5) a 30-day plan in a table with deliverable
and success criterion; (6) where the competitor is ahead and the concrete risk of that.

CONSTRAINT: no promises of results. Every claim must be anchored in the supplied data. If something was not
measured, write "not measured" instead of estimating.
```

---

# §3 — Content and Copy Production

> Input: **AI Website Copywriter API** plus the SEO diagnosis. These prompts perform the editorial review the API doesn't.

## 13. Title tags and meta descriptions at scale
```
Review and standardize the titles and descriptions below.

<pages>[ONE LINE PER PAGE: url | proposed title | proposed meta | target keyword]</pages>

Brand: [BRAND] · Tone: [TONE] · Site's main keyword: [KEYWORD]

Return a table: | url | final title | chars | final meta | chars | keyword | note |

Rules: title under 60 chars with the keyword as far left as it makes sense, no keyword stuffing; meta
between 140 and 158 chars written to be CLICKED, not to describe the page; no duplicate titles; no promise
the page does not keep; flag any two pages whose title and meta are identical.

Then list the 3 highest-traffic-potential pages that still have no content, and propose a title for each.
```

## 14. Full page from the diagnosis
```
Write the complete content of a page, from real diagnostic data.

<brief>
Page URL: [URL] · Single goal: [GOAL]
Audience: [AUDIENCE] · Main pain: [PAIN]
Offer: [OFFER] · Verifiable differentiator: [DIFFERENTIATOR]
</brief>

<diagnosis>[PASTE SEO AND CONVERSION FINDINGS — the specific recommendations]</diagnosis>
<voice>[PASTE THE TONE-OF-VOICE INSTRUCTIONS — prompt 06]</voice>

Return: (1) the page structure in blocks, with the purpose of each;
(2) the text of each block, publication-ready: eyebrow, heading, subheading, body, CTA;
(3) a page FAQ with 5 questions that remove real purchase objections, not decorative questions;
(4) an alternative headline for testing; (5) what was deliberately left out, and why.

Apply the diagnostic recommendations explicitly — if one cannot be met in the text (e.g. missing social
proof), list it in section 5. For every product claim, use only what is in the brief. If information is
missing, write "[CONFIRM WITH CLIENT: ...]" instead of inventing it.
```

## 15. Headlines by angle
```
Generate 10 headlines for [URL] across 5 angles (2 each).

<context>
Offer: [OFFER] · Audience: [AUDIENCE] · Pain: [PAIN] · Desired outcome: [OUTCOME]
Constraints: [E.G. NO TIME PROMISES, NO SUPERLATIVES]
</context>

Angles: pain, outcome, unique mechanism, proof, provocation.

For each headline return: | # | angle | headline | characters | hypothesis tested | risk |

Rules: max 12 words; every headline must contain something concrete (number, timeframe, mechanism or
audience); forbidden: "revolutionary", "secret", "you won't believe", "guaranteed"; no headline may claim an
unverifiable result. Finally, pick the 2 best to test first and explain the criteria in two sentences.
```

## 16. Rewrite for search intent
```
Rewrite the excerpt below to match search intent without losing conversion power.

<excerpt>[PASTE CURRENT TEXT — 150 to 400 words]</excerpt>

Keyword: [KEYWORD] · Dominant intent: [INFORMATIONAL / COMPARATIVE / TRANSACTIONAL]
Current ranking position: [POSITION, IF KNOWN] · Audience: [AUDIENCE]

Return: (1) diagnosis — is the page answering the dominant intent or a secondary one?
(2) the rewritten excerpt, preserving what works; (3) structural changes (headings, argument order);
(4) the CTA appropriate to the intent — an informational page should not sell in the first paragraph;
(5) three real questions the searcher still has that the text does not answer.

Do not insert the keyword more often than sounds natural. Density is not strategy.
```

## 17. CTA — variations and placement
```
Work on the call to action for [URL].

Context: goal [GOAL] · what the visitor gets [OFFER] · commitment level [LOW/MEDIUM/HIGH]
Current CTA: [CURRENT TEXT] · Perceived friction: [E.G. "IT LOOKS LIKE I'LL GET SPAM"]

Return: (1) 8 first-person button texts and 8 neutral ones, with the commitment level of each;
(2) the main recommendation and why it fits THIS audience; (3) four insertion points on the page, with the
CTA version suited to each and the visitor's state of mind at that point; (4) the microcopy under the button
that reduces fear of clicking; (5) three reasons the previous CTAs may be failing, evidenced in the context.

Do not use "Click here", "Submit" or "Learn more" as the primary CTA. No fake urgency.
```

## 18. Interface microcopy
```
Write the complete interface microcopy for the flow below.

Flow: [E.G. TWO-STEP QUOTE FORM]
Tone: [TONE] · Audience: [AUDIENCE] · Brand: [BRAND]

For each element, return final text: field labels and helper text; placeholders (only where they help, never
repeating the label); error messages (one per type: empty field, invalid format, already registered, server
failure); loading, empty and success states; button text at each step and back-button text.

Rules: an error never blames the user; success confirms the next step; no "Oops!"; every error message must
state what to do to fix it.
```

## 19. Capture email sequence
```
Write a 3-email capture sequence aligned with the offer below.

<offer>
Lead magnet: [ASSET] · Audience: [AUDIENCE] · Pain: [PAIN]
Landing page: [URL] · What they just read: [SUMMARY]
</offer>

Email 1 — immediate delivery (subject, short body, one next step).
Email 2 — 24 h later (deepens the problem, presents the mechanism, no selling yet).
Email 3 — 72 h later (invitation, with the offer, inclusions, price and one objection answered).

For each: subject (max 50 chars), preheader, body up to 200 words, single CTA.
CONSTRAINT: no fake scarcity, no "last chance" unless it truly is, no result promises.
```

## 20. Content library from one page
```
Turn the page content below into a library of 12 pieces.

<page url="[URL]">[PASTE THE FULL TEXT]</page>

Goal: [GOAL] · Audience: [AUDIENCE] · Main channel: [CHANNEL]

Return, in a table | # | format | title/hook | channel | effort (low/medium/high) | note |:
3 social posts (one per angle: data, opinion, step-by-step), 2 emails, 2 FAQ sections for the page itself,
1 short video script of 60 seconds (with time markers), 1 six-slide carousel (title of each slide),
1 derived checklist, 1 comparison, 1 update of the main page incorporating what we learn.

Do not repeat the same hook across formats: each piece needs its own angle.
```

---

# §4 — Landing Page and Conversion

> Input: **AI Landing Page Optimizer API** plus real behavioral data where it exists.

## 21. Headline and first-fold audit
```
Analyze the first fold of [URL] using the data below.

<first_fold>
Current headline: [...] · Subheadline: [...] · Visual: [DESCRIPTION]
CTA: [...] · Visible trust signals: [...]
</first_fold>

Audience: [AUDIENCE] · Offer: [OFFER] · Traffic source: [AD/ORGANIC/EMAIL]

Answer: (1) in 5 seconds, does the visitor understand what it is, who it's for, what they get and what to
do? (yes/no per item); (2) message-to-source fit — does the promise match what they clicked?
(3) three headline replacements, from most conservative to most aggressive, with the risk of each;
(4) what to remove from the first fold (elements competing with the decision); (5) the ideal order of
elements above the fold.

Be direct about what is bad. Praise does not help the client.
```

## 22. Conversion path restructuring
```
Restructure the page block order based on the goal and the observed behavior.

<current_blocks>[LIST THE BLOCKS IN CURRENT ORDER WITH ONE DESCRIPTION LINE EACH]</current_blocks>

Goal: [GOAL] · Traffic source: [SOURCE] · Awareness level: [UNAWARE / PROBLEM-AWARE / SOLUTION-AWARE / READY]
Where people stop: [REAL DATA, IF ANY]

Return: (1) the new block order, with the reason for each change in one line; (2) what to remove and what to
merge; (3) the 3 moments where the page should ask for action, and with what weight; (4) a missing block the
awareness level demands; (5) if awareness is "unaware", explain why selling directly fails and what to do instead.
```

## 23. Test hypotheses with decision criteria
```
Build a test plan for [URL].

Data: [VISITS/MONTH] · [CURRENT CONVERSION RATE] · [TARGET CONVERSION]
Business goal: [GOAL] · Time constraint: [DEADLINE]

Return a table | # | hypothesis (if... then... because...) | element | primary metric | required sample |
estimated duration | decision criterion | with 5 hypotheses ordered by expected impact; an honest sample-size
calculation for each; a WARNING if current volume cannot produce a reliable result within 4 weeks — then offer
alternatives (5-second test, heuristics, interviews, session recording); what to do with the result (keep,
discard, iterate); and one "never test this" decision — something that should be fixed on principle, not by testing.

Do not recommend declaring victory before the sample is reached. Do not use "the test is continuous" as an excuse.
```

## 24. Objection handling on the page
```
Map and address the purchase objections on [URL].

Offer: [OFFER] · Price: [PRICE] · Audience: [AUDIENCE] · Alternatives considered: [COMPETITORS]
What prospects ask today: [REAL QUESTIONS RECEIVED]

Return: (1) the 8 most likely objections, classified as price, trust, fit, time, effort, comparison;
(2) for each: where it arises in the journey, what the page says today (quote it) and what it should say;
(3) the primary objection and the block that must resolve it, with final copy; (4) three pieces of information
the client must gather to be able to answer; (5) one objection that should NOT be answered on the page,
because it signals the wrong audience.
```

## 25. Diagnosing a mid-page drop-off
```
Interpret this behavioral data and say what is probably happening.

<data>
Block order: [LIST]
Average time on page: [TIME] · Average scroll: [%]
Highest exit point: [BLOCK]
Traffic sources: [SOURCES]
Predominant device: [MOBILE/DESKTOP]
</data>

Return: (1) three hypotheses for the exit at that point, most to least likely; (2) what additional data would
confirm or kill each hypothesis; (3) the lowest-effort change that tests the primary hypothesis; (4) if there
are signs of a performance or mobile-legibility problem, flag that before touching copy; (5) one hypothesis
that seems true but usually isn't (e.g. "it's too long") and the data that resolves it.

If the data is insufficient to conclude, say so clearly instead of improvising an explanation.
```

## 26. Comparison with a competitor's page
```
Compare my landing page with [COMPETITOR URL].

<mine>[HEADLINE, BLOCKS IN ORDER, OFFER, PRICE, PROOF]</mine>
<theirs>[HEADLINE, BLOCKS IN ORDER, OFFER, PRICE, PROOF]</theirs>

Audience: [AUDIENCE] · Their purchase decision is: [RATIONAL/EMOTIONAL]

Return: (1) table | criterion | my page | competitor | who wins | across promise clarity, speed of
comprehension, objection handling, proof, ease of contact, price perception; (2) two points where the
competitor is better and what to do this week; (3) two where they are worse and that should be made EXPLICIT
on my page; (4) a positioning sentence that exploits their weakness without naming them; (5) what I must NOT
copy from them, and why.
```

---

# §5 — Social and Amplification

> Input: **AI Social Media Content Generator API**. These prompts teach you to edit the API output to brand
> voice, because the API optimizes for platform, not for voice.

## 27. X / Twitter post
```
Write 5 X posts from the content below.

<source>[PASTE THE PAGE EXCERPT OR ARTICLE]</source>
Brand: [BRAND] · Goal: [TRAFFIC/AUTHORITY/CONVERSATION] · Link: [URL]

Each post, within 260 characters: a first line that works without context; one concrete piece of information
(data, number, contrast); a closing that invites a reply or a click.

Return a table: | # | angle | post | characters |. Angles: surprising data, common mistake, before/after,
contrarian opinion, practical step.

Rules: no hashtag spam (max 1), no "thread 🧵" unless it really is one, no decorative emoji.
Do not reuse the same opening in two posts.
```

## 28. LinkedIn post
```
Write 2 LinkedIn posts from the material below.

<material>[CONTEXT, DATA, LESSON, STORY]</material>
Author: [NAME/ROLE OF THE POSTER] · Audience: [PROFESSIONAL AUDIENCE] · Goal: [GOAL]

Format for each: first line is what shows before "see more" (max 140 chars); 4 to 6 short paragraphs, one
idea each; closing is either a genuine question OR an invitation, never both.

One post data-driven (what we measured and what we found), one experience-driven. No "agree?" closings, no
emoji overload, no invented story. If real personal story is missing, write
"[SUGGESTION: narrate a concrete project situation]".
```

## 29. Instagram caption
```
Create 3 Instagram captions from the content below.

<content>[TOPIC AND CONTEXT]</content>
Profile: [PROFILE] · Goal: [SAVE/SHARE/COMMENT/LINK CLICK] · Tone: [TONE]

Each caption: one-line hook, body up to 120 words with line breaks, specific CTA, 8 to 12 hashtags mixing
high, medium and niche volume. Also return the visual concept of each post in one sentence and the text that
should appear INSIDE the artwork.

No "link in bio" when the goal is not clicks. No generic hashtags unrelated to the niche.
```

## 30. 30-day calendar
```
Build a 30-day editorial calendar for [BRAND] from existing content.

Available assets: [LIST PAGES/ARTICLES/PRODUCTS]
Channels: [CHANNELS] · Frequency per channel: [FREQUENCY] · Month goal: [GOAL]
Team capacity: [HOURS/WEEK]

Return a 30-row table: | day | channel | format | angle | title/hook | source asset | CTA | effort |

Rules: do not repeat the same angle within 7 days; 70% useful content, 20% proof/authority, 10% direct offer;
at most 20% of pieces may be new production; mark with ⚑ the pieces needing client approval.
After the calendar, list the 3 pieces you would bet on hardest, and why.
```

## 31. One source, four platforms
```
Adapt the content below for X, LinkedIn, Instagram and Facebook — respecting each channel's behavior, not
just trimming the same text.

<content>[PASTE THE PAGE OR ARTICLE]</content>
Brand: [BRAND] · Goal: [GOAL] · Link: [URL]

For each channel return: | channel | format (text/carousel/short video) | opening | body | CTA |
format specificity |

Rules per channel: X — single idea, surgical cut, conversation. LinkedIn — professional context, strong first
line, no decorative hashtags. Instagram — visual first, caption that supports the artwork, save-oriented CTA.
Facebook — explanatory tone, clickable link, less technical audience.

Finally, explain in 3 lines why the same text does not serve all four.
```

## 32. Reusing what performed
```
Analyze the numbers below and propose the next cycle.

<performance>[LIST: piece | channel | reach | saves | comments | clicks | conversions]</performance>

Goal: [GOAL] · Period: [PERIOD]

Return: (1) an honest read — what performed and what didn't; separate "high reach, low action" from "low
reach, good action", because they are different diagnoses; (2) the 3 pieces worth reusing, and in what format;
(3) the 3 to abandon even if they took effort; (4) one test for next month based on what the numbers suggest,
not on what the team prefers; (5) which metric is being tracked for vanity and should leave the report.
```

---

# §6 — Orchestration with AI Agents

> For Claude Code, Cursor and agents with file and terminal access. These prompts reduce risk: an agent
> without a clear contract produces a lot and verifies little.

## 33. System prompt for a project agent
```
You are the agent responsible for running the Growth Stack in this repository.

CONTEXT
- The project file `00-PROJETO.md` is the source of truth for identity, method and compliance.
- The design system lives in `site/assets/css/`. Tokens are the only source of visual values.
- Working prompts live in `kit/prompts/`.

NON-NEGOTIABLE RULES
1. Never invent data: if information is missing, write `[CONFIRM: ...]` and stop.
2. Never write a color, size or spacing value outside `tokens.css`.
3. Every visual change must run `python3 tools/verificar.py` and pass with no errors.
4. Never publish text with an unverifiable claim on any page.
5. Read any existing file in full before modifying it.
6. When a task ends, list the files changed and what could not be completed.

WORKFLOW
1. Read the task and restate it in one sentence.
2. List the files you will touch and why. Wait for approval if the list exceeds 5 files.
3. Execute in small steps, verifying between them.
4. Run verification and paste the output.
5. Summarize what changed and what remains.
```

## 34. Chained 6-API pipeline
```
Implement a pipeline that chains the six Growth Stack APIs for an input URL.

MANDATORY ORDER
1. Extraction → save to `data/01-extraction.json`
2. SEO Analysis → `data/02-seo.json`
3. Copywriter (fed by the data from 1 and 2) → `data/03-copy.json`
4. Landing Page Optimizer → `data/04-landing.json`
5. Conversion Optimization → `data/05-conversion.json`
6. Social Generator (fed by 3 and 4) → `data/06-social.json`

REQUIREMENTS
- A single client with exponential retry (3 attempts) and a 30 s timeout.
- API key read from an environment variable, never written into code.
- Cache by URL + stage; never repeat a call that already has a valid result on disk.
- If a stage fails, the pipeline stops and reports which stage and which error — it does not continue with empty data.
- Each output file stores: input, output, timestamp, estimated call cost.

DELIVERABLE: `kit/codigo/js/growth-stack.js` and `kit/codigo/python/growth_stack.py`.
BEFORE WRITING CODE: confirm the real endpoints, parameters and formats in each API's documentation.
```

## 35. Output reviewer agent
```
You are a critical reviewer. Your job is to find problems, not to give praise.

Review the piece below against the brief.

<brief>[AUDIENCE, OFFER, GOAL, CONSTRAINTS]</brief>
<piece>[PASTE THE TEXT OR PAGE]</piece>
<data>[SEO AND CONVERSION SCORES, IF ANY]</data>

Return, ordered by severity:
1. UNVERIFIABLE CLAIMS — literal excerpt plus why it is a problem.
2. AUDIENCE FIT — where the text speaks to someone who is not the buyer.
3. GENERALITIES — sentences that could appear on any site in the sector (quote 3).
4. CONTRADICTIONS with the brief or the data.
5. CONSTRAINT VIOLATIONS.
6. WHAT IS GOOD — only what is specific and defensible.

For each item: excerpt, problem, suggested fix. End with a verdict: SHIP / SHIP WITH CAVEATS / REWRITE — and
the reason in one sentence. Do not soften. Do not invent praise. If the piece is good, say so in one line and stop.
```

## 36. Debugging an API failure
```
An agent ran the pipeline and it failed. Help find the cause before changing code.

<context>
Stage that failed: [STAGE]
Returned error: [FULL MESSAGE, HIDE NOTHING]
Input sent: [PARAMETERS + PAYLOAD SNIPPET]
Did it work before? [YES/NO] · What changed since: [CHANGE]
</context>

Return, in order: (1) the 5 most likely causes, most to least probable, with the specific test that confirms
each; (2) which check to run FIRST (highest information per minute spent); (3) what NOT to do (e.g. increasing
timeout without investigating, catching the exception and continuing with empty data); (4) if it is a
plan/quota limit, how to confirm and what to do; (5) if it is a contract change (parameter renamed), how to
discover the current format.

Do not suggest rewriting the pipeline before the cause is identified.
```

## 37. Plan review before execution
```
Before executing, review the plan below and point out what will go wrong.

<plan>[DESCRIBE WHAT THE AGENT INTENDS TO DO, IN STEPS]</plan>
Constraints: [CALL BUDGET, DEADLINE, FILES THAT MUST NOT BE TOUCHED]

Return: (1) steps that depend on information that does not exist yet; (2) repeated or unnecessary API calls
(avoidable cost); (3) irreversible actions without a rollback point; (4) where human review is mandatory before
proceeding; (5) a corrected version of the plan in smaller steps with checkpoints; (6) a cost and time estimate.
```

## 38. Extracting lessons from a project
```
Turn this project into reusable knowledge.

<project>
Client/type: [...] · Goal: [...]
What was done: [LIST OF ACTIONS]
What worked: [WITH DATA]
What did not work: [WITH DATA]
Before/after scores: [SEO AND CONVERSION]
</project>

Return: (1) five reusable rules in the imperative, which any similar project should follow; (2) three pitfalls
specific to this type of project; (3) one update to a kit prompt or checklist that the lesson justifies;
(4) what was specific to this client and must NOT become a rule; (5) a 200-word case study ready to become
content — with the real numbers and no exaggeration.
```

---

# §7 — Strategy, Proposals and Monetization

## 39. Proposal structure
```
Build the commercial proposal for the project below.

<context>
Client: [NAME AND SECTOR] · Stated goal: [GOAL]
Diagnosis already done: [MAIN FINDINGS WITH SCORE]
Constraints: [DEADLINE, STATED BUDGET, CLIENT'S TEAM]
</context>

Structure: (1) current situation in 5 lines — the problem in numbers, not adjectives; (2) what we will do, in
3 phases, with a verifiable deliverable in each; (3) what is NOT included (explicit negative scope);
(4) realistic timeline, with what depends on the client and the expected response time; (5) investment — three
options (essential, recommended, complete) and what changes between them; (6) how we measure success: metrics,
reading period, and what we do if it does not improve; (7) next steps with a date.

Tone: clear, jargon-free, no result promises. Maximum 2 pages. If essential information is missing, write
"[CONFIRM: ...]" instead of estimating.
```

## 40. Value-based pricing
```
Help price the service below based on value, not hours.

<context>
Service: [DESCRIPTION] · Client profile: [SIZE AND SECTOR]
Execution level: [DIAGNOSIS / FULL PROJECT / RECURRING]
My direct cost: [APIS, TOOLS, HOURS]
My experience: [YEARS AND PORTFOLIO]
Local market: [YOUR OBSERVATION OF COMPETITORS AND RANGES]
</context>

Return: (1) three price bands (entry, core, premium) with the scope of each; (2) the value logic — what changes
in the client's business; (3) how to present the price for approval without discounting: anchoring, comparison
with the cost of the problem, division by outcome; (4) five questions to discover budget without asking about
budget; (5) how to answer "it's expensive", "let me think" and "my cousin does it cheaper"; (6) what to do if
the market practices half this value without destroying the margin.

CONSTRAINT: these numbers are a reference for a conversation, not an income promise — restate that in any
material that reaches the course buyer.
```

## 41. One-page client brief
```
Structure the raw notes below into a one-page brief to align before starting.

<notes>[MEETING TRANSCRIPT OR RAW NOTES]</notes>

Return: (1) business goal (not website goal) in one sentence; (2) audience — who decides the purchase and who
influences it, two profiles; (3) offer — what is sold, price point, decision cycle; (4) direct competitors and
why the client sees them as competitors; (5) constraints — deadline, current tooling, who approves, who executes,
what cannot change; (6) what the client thinks the problem is versus what the data showed; (7) agreed success
criterion, in numbers; (8) GAPS — the missing information and the exact question to ask.

Do not fill a gap with a guess. List it in section 8.
```

## 42. 90-day client plan
```
Build a 90-day growth plan for [CLIENT].

Starting point: [SEO AND CONVERSION SCORES, CURRENT TRAFFIC, CURRENT CONVERSION]
Business goal: [GOAL] · Weekly capacity: [CLIENT HOURS + YOURS]
Available tools: [TOOLS]

Return: Days 1–30 (foundation), 31–60 (production), 61–90 (amplification). For each phase: deliverables, who
does it, estimated hours, dependency, tracking metric, and an exit criterion.

Rules: do not schedule content production before the technical foundation is ready; every phase ends with an
API round to compare scores; include one buffer week per 30 days. End with the 3 risks that could stall the
plan and a plan B for each.
```

## 43. Scope description and limits
```
Write this project's scope so it protects the professional from an anxious client.

<project>[DESCRIPTION OF WHAT WILL BE DELIVERED]</project>

Return: (1) included scope, item by item, with delivery format and deadline; (2) EXCLUDED scope, explicitly —
list at least 8 items a client may presume are included but are not (hosting, unlimited copywriting, ad
management, platform support, changes after approval, visual identity creation, internal system integration,
ranking guarantee); (3) change rules — how many revision rounds are included and how extra requests work;
(4) what depends on the client and the effect of delay; (5) completion criteria — how the work formally ends.
Tone: firm and polite. Do not apologize for limiting scope.
```

## 44. Recurring revenue program
```
Design a recurring offer from the one-off service already delivered.

Delivered project: [DESCRIPTION] · Result achieved: [DATA] · Client: [PROFILE]
My capacity: [HOURS/MONTH] · Estimated monthly API cost: [VALUE]

Return: (1) what makes sense to charge monthly (and what does not) — work that degrades if it stops;
(2) three recurring formats, from entry to complete, with monthly deliverables; (3) a first-quarter schedule,
month by month; (4) how to present the transition to the client — the conversation, not the email; (5) how to
end it if the client wants to stop, without losing the referral; (6) one common trap: charging monthly for a
deliverable that generates no perceived value every month.
```

## 45. Selling the service to someone who doesn't know the method
```
Write the service explanation in three layers of depth.

Service: [SERVICE] · Interlocutor: [BUSINESS OWNER / MARKETING MANAGER / DEVELOPER]

1. In 20 seconds (elevator pitch): what it is, for whom, what problem it solves.
2. In 2 minutes (first meeting): problem → method → what they get → how long it takes.
3. In one page (emailed proposal): with deliverables and the success criterion.

Rules: no acronym without explanation; no "AI" as the main argument (the argument is the solved problem); no
result promises. Each layer must make sense read in sequence but be understandable on its own.
```

## 46. Answering "I already use ChatGPT"
```
Prepare the answer to the objection below, in three formats.

Objection: "I already use ChatGPT, I don't need this"
Interlocutor: [PROFILE] · Context: [WHERE THEY USE IT TODAY]

Return: (1) short answer (30 seconds, for conversation) — the difference between generating and measuring, with
a concrete example; (2) medium answer (2 minutes) — what the page gains from a per-dimension analysis a chatbot
does not perform; (3) technical answer — what the API returns (score, dimensions, specific recommendations) that
a conversational model cannot deliver for lack of page access; (4) a 5-minute live demonstration using the
interlocutor's own page; (5) what to concede as true in the objection — be honest about when ChatGPT is enough.
```

---

# §8 — Quality, Ethics and Compliance

## 47. Advertising honesty audit (CONAR / FTC)
```
You are an advertising compliance reviewer. Analyze the material below.

<material>[PASTE THE PAGE, AD, EMAIL OR POST TEXT]</material>

List: A) every claim of result (number, timeframe, comparison), with the literal excerpt; B) for each: is it
verifiable by a third party? Is there a source? Is there a caveat? C) implicit promises of income, ranking,
traffic or timeline; D) testimonials without traceable identification and without stated permission;
E) urgency or scarcity that is not real; F) unsubstantiated superlatives ("the best", "the only", "definitive");
G) transparency issues — hidden price, unannounced subscription, undeclared inclusion.

For each item: excerpt, risk, and a suggested rewrite that preserves commercial power but swaps guarantee for
condition ("if you do X, you tend to get Y" instead of "you will earn Y").

End with a verdict: PUBLISHABLE / PUBLISHABLE WITH EDITS / DO NOT PUBLISH — and the reason in one sentence.
```

## 48. Page accessibility audit
```
Audit the page below for accessibility, focusing on what can be fixed today.

<page url="[URL]">
[TEXT AND STRUCTURE — heading order, link texts, alt texts, form labels]
</page>

Check and report: (1) heading structure — in order? more than one h1? hierarchy meaningful out of context?
(2) contrast — list text/background pairs and the result (passes/fails AA); (3) link text — does it work out of
context? ("click here" fails); (4) images — which need descriptive alt, which need empty alt; (5) forms —
associated labels, error messages, focus order; (6) text that is not image-only — is critical information inside
an image?; (7) keyboard navigation — what is probably unreachable based on the structure.

Return a fix list ordered by severity, with the corrected code or text. Do not invent automated audit results:
if it cannot be verified from what was supplied, say so.
```

## 49. Basic technical SEO check
```
Run a technical SEO check on [URL] using the data below.

<data>
Title: [...] · Meta: [...] · H1: [...] · H2s: [...]
URL and structure: [...] · Canonical: [...] · Robots: [...]
Images without alt: [...] · Internal links: [...] · Perceived speed: [...]
Structured data: [...] · Sitemap provided: [...]
</data>

Return: (1) errors that block indexing or cause cannibalization; (2) structure problems that hinder content
understanding; (3) experience problems (speed, layout shift, excessive script) — only what could be observed;
(4) what is correct and should be preserved; (5) immediate action — at most 5 items, in order, with the likely
owner (writer, dev, designer); (6) what cannot be assessed from the supplied data.

Do not assert ranking positions or search volume. No generic advice ("produce quality content") — every
recommendation must be executable.
```

## 50. Critical evaluation of AI output
```
Evaluate the AI output below before I publish it.

<output>[PASTE THE FULL API OR MODEL OUTPUT]</output>
<context>[AUDIENCE, OFFER, CONSTRAINTS, AVAILABLE REAL DATA]</context>

Return: (1) facts that may be wrong and how to verify each; (2) invented or inflated numbers; (3) generic
sentences that would fit any company (quote 5 literally); (4) where the text contradicts the supplied context;
(5) where the tone is not the brand's; (6) what is usable and what should be discarded; (7) corrected versions
of the 3 worst passages.

Be skeptical by default: AI output is usually more confident than it should be.
```

## 51. Rewriting for readability
```
Rewrite the text below for readability without losing information or accuracy.

<text>[PASTE THE PASSAGE]</text>
Audience: [AUDIENCE] · Familiarity with the topic: [NOVICE / INFORMED / TECHNICAL]
Final format: [PAGE / PDF / EMAIL / DECK]

Rules: one idea per paragraph, paragraphs of at most 4 lines; sentences of at most 25 words; active voice; no
"in order to", "with regard to", "it is necessary that"; replace abstraction with a concrete example whenever
one is available in the text; keep every number and technical claim exactly as is; do not simplify to the point
of being wrong.

Return: (1) the rewritten text; (2) a "before / after / what changed" table for the 5 worst passages;
(3) terms needing a quick explanation and the one-line explanation for each.
```

## 52. Final review before publishing
```
Run the final pre-publication review of [URL] and issue a verdict.

<checklist>
[PASTE THE CONVERSION AND ON-PAGE SEO CHECKLIST OUTPUT, WITH CHECKED AND UNCHECKED ITEMS]
</checklist>

<context>[PAGE GOAL, AUDIENCE, LEGAL CONSTRAINTS]</context>

Return: (1) blockers — what prevents publication (broken link, unverifiable claim, form without error message,
missing privacy policy where personal data is collected); (2) risks — publishable but must be fixed within
7 days; (3) content pending — what still holds [CONFIRM] or is empty; (4) missing checks — what was not tested
and should be; (5) verdict: PUBLISH / PUBLISH WITH CAVEATS / DO NOT PUBLISH — with the mandatory action list
before the final click.

Never approve a page that collects personal data without an accessible privacy policy, or that promises an
unverifiable result.
```

---

## Appendix — Meta-prompt (generate new prompts)

```
You are a prompt engineer. Generate [N] prompts for [GOAL], to be used by [EXPERIENCE LEVEL] inside [TOOL].

Domain context: [DESCRIBE THE STACK, AUDIENCE AND FUNNEL]

Requirements for each prompt:
1. Explicit role ("You are..."), a single task.
2. Named inputs in [BRACKETS] for the user to fill.
3. Declared output format (JSON, markdown table, numbered list).
4. One explicit negative constraint — what NOT to do.
5. A rule for when essential data is missing: write [CONFIRM: ...] instead of inventing.
6. No promise of a result the tool cannot deliver.
7. Language: [LANGUAGE]. Maximum [N] words per prompt. No preamble.

Return a markdown table: | # | Name | Full prompt | When to use | Do not |
```

---

## Licence

This material is delivered under the Growth Design Pro **Toolkit Licence**: personal and professional use
allowed, including client projects; resale, redistribution or publication as your own product is prohibited.
Full text at `site/legal/licenca.html`.

Support: hello@growthdesignpro.com
