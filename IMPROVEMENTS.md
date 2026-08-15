# NeuroDiv OS — Improvement Doc

**Status:** Green-lit by Adam (2026-08-14). Consensus across all three review lanes (Nash/engineering, Isla/creative, Otto/general) was unanimous: proceed, as a **gap-list, not a redesign**.

**Execution status (2026-08-14, overnight):** Phases 0-3 landed on `main`. The canonical corpus (Lindsey Mackereth, 15+8 non-negotiables, three gates, changed-baseline) is vendored at `skills/_shared/corpus-source.md`; `non-negotiables.md` embeds the 15+8 verbatim; all four skills rewritten with the buyer-facing layer and safe-use READMEs; profile schema migrated to v2 with a lossless migration path and the two hard-no tensions reframed; the Context Builder opens on the gate probe; lanes/not-doing/baseline/invisible labor are collected and wired into the process artifact. Tests (13) and `astro build` pass. See commits after `c7ebb03`.

**Follow-up (2026-08-15, Fiona + Nash, green-lit by Adam after full-team input):** trust + readability + export pass.
- Privacy promise is now a first-class surface: front-door block ("Everything you type stays on this device. We can't see it. No cookies, no tracking, no account." + escape hatch + honest hosting footnote), footer line, Context Builder intro line. Fonts self-hosted (Satoshi + JetBrains Mono woff2 in `public/fonts/`) so no third party sees the visit.
- Readability: locked rule (no informational text below 11px, none in `--ink-muted`); `MetaLabel` default 12px `--ink-light`; new `size="section"` variant (12px/600/ink, sentence-case) applied to all 23 intake section headings + SpineFinder section heads; effort tags 9→11px; hint text 13px `--ink-light`.
- HTML visual export: `lib/export-html.ts` serializes the rendered artifact into a self-contained, print-ready HTML file (inline tokens, system fonts, no JS, no clinical language). Both outputs offer markdown (for the agent) + `Download page (HTML)` (for the person). Filenames date-stamped: `nd-profile-2026-08-14.md/.html`.
- Uniformity: teal/teal-deep usage rule codified in DESIGN.md §2; tool descriptions unified to second person; Spine-Finder em-dash removed from public copy; nav/step language verified user-first across tools.
- Bklit decision (recorded): keep the custom calm chart layer for NeuroDiv OS; Bklit stays on the IntelliZen side for internal analytics. No swap.

**Follow-up 2 (2026-08-15, Fiona + Nash + Isla, green-lit by Adam after his full test run):** bug-fix + copy pass. Four commits on top of the follow-up above (`c18123f`, `64bd429`, `8dae199`, `4a82ec6`).
- Input bug fixed: the two lanes fields trimmed text on every keystroke, so a space typed after a comma or period vanished until the next letter. Fields now hold raw typing and parse only on blur/continue (`NDContextBuilder.tsx` ShutdownStep).
- Scroll bug fixed: Continue/Back no longer jump to the absolute page top (which landed on the site header, not the form). Both tools scroll the step content to ~20px below the viewport top instead (`NDContextBuilder.tsx` + `NDProcessDesigner.tsx` `goToStep`).
- Readability violations fixed: "X of Y" step counters and saved-process timestamps were 9px muted; now 11px in both tools.
- Copy rewrite (the standard Adam set: the heading asks the specific question, the box says what to type in one breath, the hint says why): lanes, closed doors, room safety, and not-doing fields rewritten with one-line placeholders and field-guidance hints; "What are you not doing?" is now "What are you keeping out right now?"; baseline is now "What used to be easy a year ago that now takes real effort?"; invisible labor is now "What did you notice and fix this week without being asked?" Placeholders never clip (no multi-line placeholder text).
- Isla's hint audit landed: 10 finds, of which 4 were superseded by the rewrite, 6 applied (`8dae199`), plus 1 deeper catch found in verification — the recovery trait label used the banned "just push through"; now "I need rest to function" (`4a82ec6`). A sweep of `src` confirmed zero banned phrases, em-dashes only in dev comments, and the artifact's "Never just start" kept as the corpus's own prohibition.
- Onboarding: Process Designer now steers context-first structurally. No profile → primary button is "Build your profile first" with a teal callout; "Begin without a profile" remains the dignified secondary. No lockout, no urgency.
- Strategy considerations (filed, NOT built): all four lanes agree Spine Finder fits as the orientation layer, not a work-loop member; suggested tool order Spine → Context → Process → Session; candidate missing tools are Not-Today/boundary-decision surface, Let-Go/Regeneration tool, Work-Fit check, first-step tool, and Forward-Builder transition. These are roadmap considerations only — nothing built without a separate Adam go.
- Verified each round: tsc clean, 22/22 tests, `astro build`, copy linter clean, Vercel deploy confirmed serving the new copy live.

**Open decisions (ONE recommendation each):**
1. Tool order: reorder the suite pills to Spine → Context → Process → Session. **Recommend yes** — five-minute change, all four lanes agree it makes the progression visible.
2. Missing-tool roadmap: **recommend building the Not-Today/boundary-decision surface first** when the roadmap opens; nothing before then.
3. Full-app copy audit: the Context Builder is clean; the audit pattern (hints that characterize vs. guide) now exists to sweep the remaining surfaces — Process Designer, Spine Finder page, Skills catalog, output artifacts. **Recommend running it next copy pass.**

**How to read this:** the tool is closer to done than it looks. Section 2 lists what must not be touched. Sections 3-7 are the gaps, ordered by leverage. Section 8 is the anti-pattern red-line list. Section 9 is the sequencing plan with owners.

**Sources cited:**
- `DESIGN.md` — design system (calm is a feature; no urgency cues; tokens are source of truth)
- `PRODUCT.md` — product register (ND founders; distrust tools that feel sold to)
- `ND-Process-Framework.md` — the suite methodology (invitation-based; bursts beat schedules; dead zones protected; not-doing list)
- `docs/nd-research-synthesis.md` — research evidence base + the in-repo non-negotiables
- `skills/_shared/artifact-contracts.md` — the shared contract (the lever)
- `skills/_shared/architecture.md` — suite architecture + common operating rules
- `skills/*/SKILL.md` — the four downloadable skills
- `src/types.ts`, `src/lib/nd-profile.ts` — web profile schema + markdown builder
- `lib/skills-data.ts` — public skills catalog metadata

---

## 1. Status: what was reviewed and what was decided

Three lanes reviewed the same artifacts: the four skills, the shared contract, the profile schema, the design system, and the methodology. All three returned yes with conditions that converge rather than conflict. The combined decision:

1. **One document, not four.** The four skills are a suite. Shared standards are consolidated here; skill-specific changes only where necessary.
2. **Contract first.** `skills/_shared/artifact-contracts.md` is the single source of truth both surfaces write to. Change the contract, then both surfaces stay in sync. Piecemeal file edits cause drift.
3. **Additive, not rewrite.** Anything already working is protected (Section 2) and only gaps are added.
4. **spine-finder is exempt from the corpus pass.** All three lanes independently reached this. It gets a consistency preamble and nothing else.
5. **The web app's discovery moment is in scope.** The front door has to be the proof too, not just the skills.

**One flag that shaped the whole doc:** this lands as a contract change plus a version-2 migration, not a list of file tweaks. If it drifts into scattered edits, the web tool and the skills will build the inconsistency we are trying to avoid.

---

## 2. What is already right (the protect list)

Do not regress these. They are grounded in the files and in the research synthesis.

| Already working | Where it lives | Protect note |
|---|---|---|
| Calm is a feature; no urgency cues, no demand mechanics | `DESIGN.md` §1, `PRODUCT.md` | Core brand promise. Never add streaks, completion bars, or "you missed this" anywhere |
| PDA framing: "invitations, not instructions"; one thing at a time; bursts over schedules | `src/lib/nd-profile.ts` `buildAgentInstructions()` | Already correct. Extend, don't rewrite |
| "Silence is planned rest, not failure" | `nd-profile.ts` agent instructions (when `recovery-non-negotiable`), `architecture.md` common rules | Make it unconditional, not conditional on one trait (gap G-3) |
| "What's actually available today?" + `Not today` as a dignified finish | `nd-session-loop` SKILL.md | Already the right shape. Keep `Not today` exactly as-is |
| Trigger-based moves, not chronology; rescue moves; not-doing list as real boundary | `nd-process-designer` SKILL.md, `artifact-contracts.md` | Keep the move format: trigger / action / done signal / effort / why-this-fits-you |
| Spine-finder: voice section at top, load principle, resistance protocol, "candidate not conclusion", invitation-based | `spine-finder` SKILL.md | **Do not homogenize.** Only additions: non-negotiables preamble, never-praise-competence line |
| No streaks, no catch-up, no passive accountability | `docs/nd-research-synthesis.md` non-negotiables; `architecture.md` | These six in-repo non-negotiables are load-bearing |
| Stable artifact headings for handoff | `artifact-contracts.md` | Keep the heading contract stable; extend, don't re-key |
| Tool tokens and copy discipline (no em-dashes in public copy, copy-audit linter) | `DESIGN.md` §2, §8, §9 | Applies to the buyer-facing skill surfaces in Section 6 too |

**Protect-list rule:** if a proposed change touches anything in this table without a gap reference below, it is out of scope.

---

## 3. The shared contract change (the lever)

All three lanes agreed this is the first move. `skills/_shared/artifact-contracts.md` and `skills/_shared/architecture.md` get upgraded; then the skills and the web app implement against the new contract.

### 3.1 Add the non-negotiables block (the never-list)

Today the guardrails are partial and scattered: the context builder says "do not diagnose, do not turn into therapy," the architecture doc lists no-streaks/no-catch-up, and the research synthesis lists six non-negotiables. The full contract is not written anywhere as one block, so no skill and no surface carries all of it. Since the skills run inside the user's own agent where we control nothing, **the instruction text is the only enforcement that exists.**

Add a new shared file, `skills/_shared/non-negotiables.md`, embedded verbatim by every skill and mirrored by the web app's agent instructions. The block combines the research synthesis non-negotiables with the team-consensus items:

- No diagnosis. Never answer identity questions ("am I ADHD?"). Describe experience, never name it. Hold multi-engine uncertainty on every trait: "could be this, or that, or both."
- No demand mechanics. No "you should," no urgency cues, no "you're behind," no catch-up posture.
- No streaks, no completion scores, no passive accountability, no "you haven't done X."
- Never say "just start."
- Never go silent. Contact ritual: frequent, low-effort touchpoints; if there's a gap, explain it. This buyer reads silence as evidence, not neutrality.
- Never praise the user's competence as a lever. Competence is the loop that froze them. Acknowledge effort and choice, not capability.
- Treat silence as planned rest, not staleness or abandonment.
- `Not today` is a dignified finish. Accept it without redirect.
- Never recommend deadline-dependency or countdown pressure as a strategy. (See G-6.)
- Trait labels are working labels the user chose, not verdicts.
- Plain language. No framework jargon, no clinical posturing, no em-dashes in anything shown to the user.

**Citation gap (fix in this phase):** the team referenced a deeper corpus (Lindsey Mackereth material: the three gates, changed-baseline capacity, could/should/want, lanes and closed doors, room-safety, seasons-not-sprints, interest half-life, regeneration date). That file is not in this repo. Link the canonical corpus file (or its vault path) into `docs/` so every future contributor can see *why* a rule exists. If the corpus defines a canonical 15+8 list, that list supersedes and extends the block above verbatim.

### 3.2 Extend the profile artifact contract

`artifact-contracts.md` §1 gains sections (with plain-language headings, stable for downstream reads):

- `## What's different now than a year ago` (changed-baseline capacity: current baseline, explicitly not "normal"; lost abilities recorded as data, not failure; "rest doesn't restore like it used to" is expected data)
- `## The three gates` (bored / confused / heavy / panicked, what each means, what helps)
- `## Could / should / want` (per goal and generally: what I could do, what I should do, what I actually want)
- `## Lanes and closed doors` (1-3 active lanes the process defends; named closed doors with the grief step, never a hard block)
- `## Room safety` (per-context safety: what makes a space usable, what breaks it; RSD flag phrases)
- `## What I'm not doing` (the not-doing list, first-class)
- `## Invisible labor` (what I notice and fix before anyone else does)
- `## Working labels` (the traits section explicitly framed as "labels I chose, not verdicts")
- `## Regeneration date` (the profile's "systems are designed to be redesigned" date, 1-2 year horizon)

### 3.3 Extend the process artifact contract

`artifact-contracts.md` §2 gains:

- `## Lanes` (1-3 active lanes; the process defends them; anything outside gets a named closed door + grief step)
- `## Seasons, not sprints` (horizon framing; "return to the old load is never a designed outcome"; an obsolescence/regeneration date on the process)
- `## Dead zones` (unavailable periods upgraded to full dead zones: "planned, not a signal," hard-protected, nothing ever scheduled there)
- `## Could / should / want` and interest half-life ("what will carry this past novelty running out?") on goal intake, with a proceed-anyway path so they never become a gate
- `## Contact ritual` (expected-time touchpoints; frequency over depth)

### 3.4 Version the contract

Add a version line to `artifact-contracts.md` (v1 → v2 on first change) and a migration rule: v1 profiles keep loading, new fields default to "unknown," the user gets a gentle "want to refresh this?" nudge, never a demand to start over.

---

## 4. Profile schema migration (web app): trait-label spine → state-based spine

**Verified gap (Nash, confirmed in code):** `src/types.ts` `NDProfile` is organized around `traits.selected` (`adhd | autism | pda | dyslexia | dyscalculia | sensory`) as the spine of the whole profile. The corpus doctrine is multi-engine uncertainty, never diagnose, identity as state not label.

**The change is not deletion.** A person saying "I'm ADHD" is legitimate and useful. The label stops being the organizing spine and becomes one input under the state sections. The generated agent brief line `"You're working with someone with ADHD, Autism..."` becomes `"You're working with someone who identifies with ADHD and autism. These are working labels they chose, not verdicts. Hold them as 'could be this, or that, or both'."`

Concretely, in `src/types.ts` + `src/lib/nd-profile.ts`:

- Bump `version: 1` → `version: 2` (`NDProfile.version` literal; `createEmptyNDProfile()`)
- Add the Section 3.2 fields as typed state: `baseline`, `gates`, `couldShouldWant`, `lanes` (with `closedDoors`), `roomSafety`, `notDoing`, `invisibleLabor`, `regenerationDate`
- Keep traits/manifestations as-is structurally, but reorder markdown output so state sections lead and traits appear under a "working labels" heading
- Add a migration function: `migrateNDProfile(raw)` that detects v1, loads it, defaults new fields, and flags the nudge

**G-6 — the two hard-no tensions (decision required, recommendation below):**

1. **Deadline as neutral trait.** `adhd-deadline-engine` ("Deadlines are my main motivation engine"), activation `deadline`, `urgency`, and time pattern `deadline-engine` are currently offered as neutral facts. The corpus says deadline-dependency is the loop to unwind, not a fact to reinforce.
   **Recommendation: reframe, don't remove.** Keep the data point (honesty: the user said it's true). Change the label copy so it is not offered as a positive ("Deadlines are the main thing that gets me moving, and I'd like to rely on that less"), and treat it as a flag that tells the agent to avoid urgency framing and build alternate activation paths. Never activate on it as a designed lever.
2. **Timers as support condition.** `timers` ("Timers (Pomodoro, countdowns, time limits)") conflicts with the no-countdown hard no.
   **Recommendation: split the concept.** Reframe to "Pacing aids I choose myself (music, timers I set, movement breaks)". The distinction is self-chosen structure vs. imposed countdown pressure. Agent instructions: any timer is user-initiated and never a countdown demand.

---

## 5. Per-skill changes

### 5.1 spine-finder — minimal

- Add the non-negotiables preamble (Section 3.1) for consistency with the suite.
- Add one guardrail line: never praise the user's competence, because competence *is* the loop that froze them.
- **Everything else stays.** It is the most corpus-consistent file in the suite. The temptation to "improve" it is a risk, not an opportunity.

### 5.2 nd-context-builder — the real work

- Replace the "which ND traits apply" priority-1 intake with the corpus's three movements: **what pulls you, what blocks you** (asked as situations, not labels: "do you ever feel bored and unable to start? confused and stuck? heavy, like the timing is wrong?"), **what helps you** (dead zones, support conditions, room safety).
- Add changed-baseline questions to priority 1: "What's different now than a year ago? What used to be automatic that now takes effort?"
- Add the invisible-labor question: "What did you notice and fix this week before anyone else did?" (This is the buyer's core pain and the B2B pitch: the best person is a burnout risk because they are too capable.)
- Add the "too many directions" question (capacity-and-drive: this person can do almost anything, so they commit to nothing).
- Add could/should/want, lanes, closed doors, and the grief step.
- Add room-safety and RSD flag phrases.
- Strengthen "do not diagnose" to the full line: hold multi-engine uncertainty on every trait, never answer identity questions, describe experience, never name it.
- Add the working-labels line to the output rules.
- Add "never go silent" and "never praise competence" to the agent section it writes.
- Add a voice section near the top, inheriting spine-finder's discipline.

### 5.3 nd-process-designer

- Add could/should/want plus the interest half-life question to goal intake, with a proceed-anyway path so it never becomes a gate.
- Add lane enforcement: the process defends 1-3 lanes; work outside them gets a named closed door plus the grief step, never a hard block.
- Strengthen unavailable periods into full dead zones: "planned, not a signal," hard-protected, nothing ever scheduled there.
- Add seasons-not-sprints and "return to the old load is never a designed outcome," plus an obsolescence date on the process.
- Add the gate check-in to session-start guidance.
- Add "never say just start" as a hard rule.
- Add a contact-ritual line (expected-time touchpoints, frequency over depth).
- Embed the non-negotiables block.

### 5.4 nd-session-loop — best-written, needs the least

- Add the gate probe at session start: after "What's actually available today?", if the answer is "stuck," ask bored / confused / heavy / panicked and route to the matching unlock instead of pushing a move:
  - heavy → waiting is sanctioned; nothing is owed
  - confused → break it down, one small step
  - bored → check the meaning, not the motivation
  - panicked → the gates are fighting; reduce scope, no "just start"
- Add the visibility audit to reflection: "What did you notice and fix this week no one else clocked?"
- Add "leave one thing unresolved on purpose" to reflection.
- Add changed-baseline awareness: reflection treats "rest doesn't restore" as expected data, never a failure flag.
- Add the gifted-override intercept: if reflection turns into tracking or performance, name it.
- Make reflection treat quiet as planned rest, not staleness.
- Embed the non-negotiables block.

---

## 6. Buyer-facing skill presentation (the trust surface)

The skills are excellent as behavioral contracts. The problem: they are written for the agent, not the buyer. The buyer reads the skill before they install it. The buyer needs the trust; the agent needs the workflow. **Two surfaces, one contract.**

1. **Buyer-facing name + internal name.** `spine-finder`, `nd-context-builder`, `nd-process-designer`, `nd-session-loop` are team-internal. The buyer-facing names are plain verb-nouns: "Find your through-line," "Build your context profile," "Design a process for one goal," "Run a session." The agent keeps the internal name; the buyer sees the friendly name. Both live in the metadata block and in `lib/skills-data.ts`.
2. **"What this is for" paragraph at the top, before the workflow.** Three sentences: what it does, who it is for, what it will not do. The buyer's first thirty seconds must answer the question every burned buyer asks: *is this the same thing again?* The answer is no, in plain words.
3. **"What this will not do" section, early, in buyer's language.** No diagnostic. No demand. No streak. No completion score. No judgment. The limits are the corpus's hard rules expressed for the buyer.
4. **Voice instruction near the top of every skill** (the other three inherit spine-finder's discipline).
5. **One-page "how to use this safely" README per skill, separate from the SKILL.md.** Two pages max. Names the hard rules in plain English, gives the user the words to reset the agent if it breaks the contract, lists the contact for feedback. User reads the README before install; the agent reads the SKILL.md after. Ship these through the existing copy pipeline (`skills/` → `scripts/copy-skills.cjs` → `public/skills/`), and run the copy-audit linter per `DESIGN.md` §8.

---

## 7. Web app discovery redesign (the front door)

The corpus's brand move is the felt-level first gesture: the user is *seen* before they have volunteered anything. The web app's intake still reads as a form. Scope below is ranked by brand impact; the first item alone delivers the move.

1. **The first screen is a felt-level pick, not a form.** Open Context Builder with the gate probe ("How does today feel right now?" with bored / confused / heavy / panicked, or an equivalent body-state pick). The user recognizes themselves in the first screen, not the fifth. They do not type until they have chosen to type.
2. **The profile is the user's, not the tool's.** Headline = their name (or whatever they want to be called) and the date they started. Corpus vocabulary is a sidebar reference, not the body.
3. **The not-doing list ships in the profile from the first touch**, as a first-class section the user can fill in. When the user is in a not-doing window, the agent's first move is "acknowledged, see you when you're back," not "what's your capacity today."
4. **No completion bar, no streak, no daily minimum. Anywhere.** Explicitly non-negotiable.
5. **The session-start check-in is a default action.** One question, ignorable. A 60-second session must feel complete, not incomplete. The only temporal signal is a "last touched" line.
6. **Later (optional, not this phase):** image, color, and scene as first-class intake fields, so the user who cannot articulate their state in analysis can articulate it in a scene.

---

## 8. Cross-cutting anti-patterns (the never-list with red-line examples)

| Violation | Red line (what is forbidden) | Current status |
|---|---|---|
| Trait-label verdicts | Never answer identity questions; labels are working labels, "could be this, or that, or both" | **Exists today:** agent brief says "You're working with someone with ADHD..." (G-5) |
| Deadline-dependency as neutral fact | Never offer deadline/urgency as a strategy; reframe as the loop to unwind | **Exists today:** `adhd-deadline-engine`, activation `deadline`/`urgency`, time pattern `deadline-engine` (G-6) |
| Countdown pressure | No imposed timers/countdowns; pacing aids are user-chosen only | **Exists today:** `timers` support condition (G-6) |
| "Just start" | Never use it; route stuck states through the gates | Absent today, add as hard rule |
| Streaks / completion bars / "you missed this" | Nowhere, on any surface | Already absent; keep it that way |
| Silence treated as drift | Silence = planned rest; a gap is "planned, not a signal" | Partial: only when `recovery-non-negotiable` is set (G-3) |
| Silence from the agent | Never go silent; contact ritual with expected touchpoints | **Exists today:** no contact ritual anywhere |
| Praise of competence as a lever | Acknowledge effort and choice, never capability | Absent; add to all agent sections |
| Insight-product voice | Never declare a result; "you named X," "would you like to see this?" | Spine-finder holds this; extend to the suite |
| Framework jargon / em-dashes / AI tells | Plain language; copy-audit linter before shipping copy | Design rule exists; enforce on skill surfaces |

---

## 9. Sequencing plan

**Phase 0 — Land the contract (Nash owns).**
1. Add `skills/_shared/non-negotiables.md`; embed the block in `architecture.md` common rules.
2. Extend `artifact-contracts.md` (Sections 3.2, 3.3, 3.4); version it v2.
3. Link the canonical corpus file into `docs/` (citation gap).

**Phase 1 — Skills (Otto implements, Nash reviews).**
1. `nd-context-builder` first (biggest change: three movements, baseline, invisible labor, working labels, voice section, non-negotiables).
2. `nd-process-designer` (lanes, seasons, dead zones, could/should/want, contact ritual).
3. `nd-session-loop` (gate probe, visibility audit, changed-baseline reflection).
4. `spine-finder` (preamble + one guardrail line only).
5. Run `scripts/copy-skills.cjs` to push to `public/skills/`.

**Phase 2 — Web schema v2 (Nash owns schema, Otto implements, Isla designs the discovery).**
1. `src/types.ts` + `src/lib/nd-profile.ts`: version 2, state-based sections, G-6 reframes, migration function + nudge.
2. Discovery: gate probe as first screen, profile headline, not-doing in profile, no-streak audit.

**Phase 3 — Buyer-facing layer (Isla owns, Otto implements).**
1. Friendly names + "what this is for" + "what this will not do" in all four skills.
2. One-page safe-use READMEs per skill.
3. Catalog metadata in `lib/skills-data.ts`; copy pipeline + copy-audit linter.

**Definition of done:** the never-list exists in exactly one place (the contract), every skill embeds it verbatim, the web app mirrors it, a v1 profile loads into v2 without loss, and the discovery first screen is the felt-level pick. Quality bar: every "why this fits you" must trace to the user's actual stated constraints and research findings, not plausible-sounding generic justifications.

**Open decisions for Adam (recommendations included):**
1. G-6 deadline/timer handling: **reframe** (recommended) vs. remove.
2. Discovery scope: **gate probe first** (recommended this phase) vs. full felt-level fields now.
3. Owner for Phase 0-3 dispatch order: **Nash (contract + schema) → Otto (implementation) → Isla (presentation + discovery)** (recommended).

---

*Compiled by Fiona from the team consensus of 2026-08-14. Grounded in the files listed in Sources. Replace the Section 3.1 block verbatim with the canonical corpus 15+8 when the corpus file is linked into the repo (Phase 0, item 3).*
