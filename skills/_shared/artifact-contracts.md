# ND Skill Artifact Contracts

**Contract version: 2** (was v1).

These contracts are the stable handoff layer between tools and skills. Web output and skill output should match these headings and semantics closely enough that one surface can hand off cleanly to the other.

**Every skill embeds `_shared/non-negotiables.md` verbatim.** The artifact shape below is what the suite writes; the never-list is how the suite behaves.

**Migration rule (v1 → v2):** v1 profiles keep loading. New fields default to "unknown" (empty). The user gets a gentle "want to refresh this?" nudge, never a demand to start over. The web app's `migrateNDProfile()` handles this; skills should read a v1 artifact without error and treat missing sections as "not captured yet."

## 1. ND profile artifact

Recommended file name: `nd-profile.md`

Required sections:

- `# ND Profile`
- `## My Neurodivergent Profile` (traits as **working labels the user chose, not verdicts**)
- `## What Activates Me`
- `## What Causes Shutdown or Avoidance`
- `## My Relationship With Time and Energy`
- `## What's Different Now Than a Year Ago` (changed baseline: current baseline, explicitly not "normal"; lost abilities recorded as data, not failure; "rest doesn't restore like it used to" is expected data)
- `## The Three Gates` (bored / confused / heavy / panicked, what each means, what helps)
- `## Could / Should / Want` (what I could do, what I should do, what I actually want)
- `## Lanes and Closed Doors` (1-3 active lanes the process defends; named closed doors, never a hard block)
- `## Room Safety` (per-context safety; what makes a space usable, what breaks it; RSD flag phrases)
- `## What I'm Not Doing` (the not-doing list, first-class)
- `## Invisible Labor` (what I notice and fix before anyone else does)
- `## Systems I've Tried`
- `## How I Prefer to Receive Information`
- `## What Helps Me Work`
- `## For Any Agent Working With Me`
- `## Regeneration Date` (the "systems are designed to be redesigned" date, 1-2 year horizon)

Rules:

- Preserve the user's own language where it adds specificity.
- Distinguish structured labels from freeform narrative.
- Trait labels are the user's working words, never a verdict. Hold multi-engine uncertainty: "could be this, or that, or both."
- The final section must be written to the receiving agent, not to the user.
- Missing v2 sections in a v1 artifact are "not captured yet," never an error.

## 2. ND process artifact

Recommended file name: `nd-process-<slug>.md`

Required sections:

- `# ND Process Designer`
- `## What you're working with`
- `## Protected conditions` (includes **dead zones**: unavailable periods are "planned, not a signal," hard-protected, nothing ever scheduled there)
- `## Lanes` (1-3 active lanes; the process defends them; anything outside gets a named closed door plus the grief step, never a hard block)
- `## Seasons, not sprints` (horizon framing; "return to the old load is never a designed outcome"; an obsolescence / regeneration date on the process)
- `## What you're not doing`
- `## Session start` (gate check-in; never "just start")
- `## Move menu`
- `## Rescue moves`
- `## Measurement`
- `## Agent brief` (includes a contact ritual: expected-time touchpoints, frequency over depth)
- `## Source notes`

Strongly recommended additional sections:

- `## Outcomes log`
- `## Could / Should / Want` (per goal: what I could do, what I should do, what I actually want)
- `## Interest half-life` ("what will carry this past novelty running out?"; a proceed-anyway path, never a gate)

Move format:

- `### <group title>`
- `#### <move title>`
- `- Trigger`
- `- Action`
- `- Done signal`
- `- Effort`
- `- Why this fits you`

Rules:

- Moves are organized by condition, not chronology.
- There must be a dignified `Not today` path somewhere in the process.
- The not-doing list is a real boundary, not decoration.
- Lanes are defended, not enforced by hard block: work outside a lane gets a named closed door plus the grief step.
- Goal intake separates could / should / want and asks the interest half-life question, with a proceed-anyway path so neither becomes a gate.

## 3. Session loop updates

The `nd-session-loop` skill should update existing artifacts rather than creating a brand-new primary file.

Expected writes:

- append to `## Outcomes log` in the process artifact
- optionally propose updates to the ND profile when repeated patterns emerge

Session start uses the gate probe: after "What's actually available today?", if the user is stuck, ask bored / confused / heavy / panicked and route to the matching unlock instead of pushing a move:

- heavy → waiting is sanctioned; nothing is owed
- confused → break it down, one small step
- bored → check the meaning, not the motivation
- panicked → the gates are fighting; reduce scope, never "just start"

Reflection treats quiet as planned rest, not staleness, and logs changed-baseline observations ("rest doesn't restore like it used to") as expected data, never a failure flag.
