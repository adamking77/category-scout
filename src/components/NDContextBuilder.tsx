import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { MetaLabel, PrimaryButton } from "./ui";
import { ContextProfileOutput } from "./output/ContextProfileOutput";
import type {
  NDProfile,
  NDTrait,
  NDTraitManifestation,
  ActivationPattern,
  ShutdownTrigger,
  TimePattern,
  InfoDensity,
  InfoFormat,
  SupportCondition,
  GateState,
} from "../types";
import {
  createEmptyNDProfile,
  loadNDProfile,
  saveNDProfile,
  clearNDProfile,
  TRAIT_LABELS,
  MANIFESTATION_LABELS,
  MANIFESTATIONS_BY_TRAIT,
  ACTIVATION_LABELS,
  SHUTDOWN_LABELS,
  TIME_PATTERN_LABELS,
  INFO_DENSITY_LABELS,
  INFO_FORMAT_LABELS,
  SUPPORT_CONDITION_LABELS,
} from "../lib/nd-profile";

type StepId = "intro" | "gate" | "traits" | "activation" | "shutdown" | "time" | "history" | "info" | "done";

const STEP_ORDER: StepId[] = ["intro", "gate", "traits", "activation", "shutdown", "time", "history", "info", "done"];

const STEP_LABELS: Record<StepId, string> = {
  intro: "Context Builder",
  gate: "How today feels",
  traits: "Your profile",
  activation: "What activates you",
  shutdown: "What to avoid",
  time: "Time and energy",
  history: "What you've tried",
  info: "How you take in information",
  done: "Your profile is ready",
};

// Reusable checkbox group
function CheckGroup<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (value: T, checked: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {options.map(({ value, label }) => {
        const isChecked = selected.includes(value);
        return (
          <label
            key={value}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              cursor: "pointer",
              padding: "8px 12px",
              border: `1px solid ${isChecked ? "var(--teal)" : "var(--rule)"}`,
              background: isChecked ? "rgba(91, 138, 138, 0.05)" : "transparent",
              transition: "border-color 0.12s, background 0.12s",
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                border: `1.5px solid ${isChecked ? "var(--teal)" : "rgba(26,26,24,0.25)"}`,
                borderRadius: 3,
                flexShrink: 0,
                marginTop: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isChecked ? "var(--teal)" : "transparent",
                transition: "all 0.12s",
              }}
            >
              {isChecked && (
                <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                  <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => onChange(value, e.target.checked)}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
              tabIndex={-1}
            />
            <span style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.55 }}>{label}</span>
          </label>
        );
      })}
    </div>
  );
}

// Radio group for single-select
function RadioGroup<T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { value: T; label: string }[];
  selected: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {options.map(({ value, label }) => {
        const isChecked = selected === value;
        return (
          <label
            key={value}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              cursor: "pointer",
              padding: "8px 12px",
              border: `1px solid ${isChecked ? "var(--teal)" : "var(--rule)"}`,
              background: isChecked ? "rgba(91, 138, 138, 0.05)" : "transparent",
              transition: "border-color 0.12s, background 0.12s",
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                border: `1.5px solid ${isChecked ? "var(--teal)" : "rgba(26,26,24,0.25)"}`,
                borderRadius: "50%",
                flexShrink: 0,
                marginTop: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.12s",
              }}
            >
              {isChecked && (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--teal)",
                    display: "block",
                  }}
                />
              )}
            </span>
            <input
              type="radio"
              checked={isChecked}
              onChange={() => onChange(value)}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
              tabIndex={-1}
            />
            <span style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.55 }}>{label}</span>
          </label>
        );
      })}
    </div>
  );
}



function FieldHint({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: "var(--ink-light)", margin: "6px 0 0", lineHeight: 1.6 }}>
      {children}
    </p>
  );
}

function Field({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ marginBottom: 32, ...style }}>
      {children}
    </div>
  );
}

function StepNav({
  onBack,
  onContinue,
  continueLabel = "Continue",
  showBack = true,
  continueDisabled = false,
}: {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  showBack?: boolean;
  continueDisabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--rule)" }}>
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="btn-text"
          style={{ fontSize: 13, color: "var(--ink-muted)", display: "flex", alignItems: "center", gap: 6 }}
        >
          <ArrowLeft size={13} />
          Back
        </button>
      )}
      {onContinue && (
        <PrimaryButton onClick={onContinue} disabled={continueDisabled}>
          {continueLabel}
        </PrimaryButton>
      )}
    </div>
  );
}

// Step: Intro
function IntroStep({ onBegin, hasExisting, wasMigrated }: { onBegin: () => void; hasExisting: boolean; wasMigrated: boolean }) {
  return (
    <div style={{ maxWidth: 600 }}>
      <p style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.75, margin: "0 0 20px" }}>
        Most AI tools treat everyone the same. This one treats you like you.
      </p>
      <p style={{ fontSize: 14, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 20px" }}>
        Answer questions about what energizes you, what shuts you down, and how you take in information. You get a profile file. Paste it into any AI you use. That AI will then respond in ways that match how you work.
      </p>
      {wasMigrated && (
        <p style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.6, margin: "0 0 20px" }}>
          We updated your saved profile to the new format. Everything you had is still there; a few new sections are ready whenever you want to fill them.
        </p>
      )}
      <p style={{ fontSize: 14, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 10px" }}>
        10 to 15 minutes. Stop whenever. Skip anything you do not want to answer.
      </p>
      <p style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.6, margin: "0 0 36px" }}>
        Everything you answer stays in this browser, on this device. Nothing is uploaded or stored anywhere else.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <PrimaryButton onClick={onBegin}>
          {hasExisting ? "Continue where I left off" : "Begin"}
        </PrimaryButton>
        {hasExisting && (
          <button
            onClick={() => {
              if (window.confirm("Start a new profile? Your current one will be cleared.")) {
                clearNDProfile();
                onBegin();
              }
            }}
            className="btn-text"
            style={{ fontSize: 12, color: "var(--ink-muted)" }}
          >
            Start fresh
          </button>
        )}
      </div>
    </div>
  );
}

// Step: Gate — the felt-level first gesture. The user is seen before they
// volunteer anything. They do not type until they have chosen to type.
function GateStep({
  profile,
  onChange,
  onNameChange,
  onBack,
  onContinue,
}: {
  profile: NDProfile;
  onChange: (update: Partial<NDProfile["gates"]>) => void;
  onNameChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const gateOptions: { value: GateState; label: string }[] = [
    { value: "bored", label: "Bored. Nothing here feels relevant right now" },
    { value: "confused", label: "Confused. The shape of things is wrong or unclear" },
    { value: "heavy", label: "Heavy. Everything costs more than it should" },
    { value: "panicked", label: "Panicked. Too much is trying to happen at once" },
    { value: "clear", label: "Clear. I'm fine, just here to set up" },
  ];

  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560 }}>
        Before we get to questions, one honest check. How does today actually feel? Not how it should feel. There's no wrong answer, and it won't be used against you.
      </p>

      <Field>
        <MetaLabel size="section">How does today feel right now?</MetaLabel>
        <RadioGroup
          options={gateOptions}
          selected={profile.gates.today}
          onChange={(v) => onChange({ today: v })}
        />
        <FieldHint>Whatever you pick, the agents reading this will work with it, not against it.</FieldHint>
      </Field>

      <Field>
        <MetaLabel size="section">What should we call you?</MetaLabel>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Your name, a nickname, or leave it blank"
          style={{ fontSize: 13, padding: "9px 12px" }}
        />
        <FieldHint>This is what shows at the top of your profile. Use whatever name you want here.</FieldHint>
      </Field>

      <StepNav onBack={onBack} onContinue={onContinue} continueLabel="Continue" />
    </div>
  );
}

// Step: Traits
function TraitsStep({
  profile,
  onChange,
  onBack,
  onContinue,
}: {
  profile: NDProfile;
  onChange: (update: Partial<NDProfile["traits"]>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const traitOptions = (Object.entries(TRAIT_LABELS) as [NDTrait, string][]).map(([value, label]) => ({ value, label }));
  const selected = profile.traits.selected;

  function toggleTrait(trait: NDTrait, checked: boolean) {
    const next = checked ? [...selected, trait] : selected.filter((t) => t !== trait);
    onChange({ selected: next });
  }

  function toggleManifestation(m: NDTraitManifestation, checked: boolean) {
    const current = profile.traits.manifestations;
    const next = checked ? [...current, m] : current.filter((x) => x !== m);
    onChange({ manifestations: next });
  }

  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560 }}>
        Start with the broad strokes. Which of these apply to you?
      </p>

      <Field>
        <CheckGroup
          options={traitOptions}
          selected={selected}
          onChange={toggleTrait}
        />
        <div style={{ marginTop: 14 }}>
          <input
            type="text"
            value={profile.traits.other}
            onChange={(e) => onChange({ other: e.target.value })}
            placeholder="Something else not listed here"
            style={{ fontSize: 13, padding: "9px 12px" }}
          />
        </div>
      </Field>

      {selected.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <MetaLabel size="section">How do these actually show up for you?</MetaLabel>
          <p style={{ fontSize: 13, color: "var(--ink-muted)", margin: "0 0 16px", lineHeight: 1.6 }}>
            Select what applies. These become the specific instructions in your profile.
          </p>
          {selected.map((trait) => (
            <div key={trait} style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--teal-deep)", margin: "0 0 10px", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
                {TRAIT_LABELS[trait].toUpperCase()}
              </p>
              <CheckGroup
                options={MANIFESTATIONS_BY_TRAIT[trait].map((m) => ({ value: m, label: MANIFESTATION_LABELS[m] }))}
                selected={profile.traits.manifestations}
                onChange={toggleManifestation}
              />
            </div>
          ))}
        </div>
      )}

      <Field>
        <MetaLabel size="section">Anything else about how these show up for you?</MetaLabel>
        <textarea
          value={profile.traits.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Optional. Your own words, whatever didn't fit the options above"
          rows={3}
          style={{ fontSize: 13 }}
        />
        <FieldHint>This is optional. Skip it if the checkboxes covered it.</FieldHint>
      </Field>

      <StepNav onBack={onBack} onContinue={onContinue} />
    </div>
  );
}

// Step: Activation
function ActivationStep({
  profile,
  onChange,
  onBack,
  onContinue,
}: {
  profile: NDProfile;
  onChange: (update: Partial<NDProfile["activation"]>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const activationOptions = (Object.entries(ACTIVATION_LABELS) as [ActivationPattern, string][]).map(([value, label]) => ({ value, label }));
  const showOtherField = profile.activation.patterns.includes("other");

  function togglePattern(p: ActivationPattern, checked: boolean) {
    const next = checked
      ? [...profile.activation.patterns, p]
      : profile.activation.patterns.filter((x) => x !== p);
    onChange({ patterns: next });
  }

  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560 }}>
        What actually gets you started? Not what should motivate you. What actually does.
      </p>

      <Field>
        <MetaLabel size="section">What pulls you in</MetaLabel>
        <CheckGroup options={activationOptions} selected={profile.activation.patterns} onChange={togglePattern} />
        {showOtherField && (
          <div style={{ marginTop: 12 }}>
            <input
              type="text"
              value={profile.activation.patternOther}
              onChange={(e) => onChange({ patternOther: e.target.value })}
              placeholder="What else activates you?"
              style={{ fontSize: 13, padding: "9px 12px" }}
            />
          </div>
        )}
      </Field>

      <Field>
        <MetaLabel size="section">What does a good working session feel like?</MetaLabel>
        <textarea
          value={profile.activation.goodDayDescription}
          onChange={(e) => onChange({ goodDayDescription: e.target.value })}
          placeholder="Describe it in your own words. What's different when it's actually going well?"
          rows={4}
          style={{ fontSize: 13 }}
        />
        <FieldHint>Describe what it actually looks like when work is going well. Not the ideal version; the real one.</FieldHint>
      </Field>

      <StepNav onBack={onBack} onContinue={onContinue} />
    </div>
  );
}

// Step: Shutdown
function ShutdownStep({
  profile,
  onChange,
  onNotDoingChange,
  onLanesChange,
  onRoomSafetyChange,
  onBack,
  onContinue,
}: {
  profile: NDProfile;
  onChange: (update: Partial<NDProfile["shutdown"]>) => void;
  onNotDoingChange: (value: string) => void;
  onLanesChange: (update: Partial<NDProfile["lanes"]>) => void;
  onRoomSafetyChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const shutdownOptions = (Object.entries(SHUTDOWN_LABELS) as [ShutdownTrigger, string][]).map(([value, label]) => ({ value, label }));
  const showOtherField = profile.shutdown.triggers.includes("other");

  // Lanes are parsed on blur or continue, never on every keystroke. Parsing on
  // change trims a trailing space out of state, so the space vanishes until
  // the next letter makes it internal. The raw text stays in draft state while
  // typing; the clean array is committed when the field is left.
  const [draftActive, setDraftActive] = useState(() => profile.lanes.active.join("\n"));
  const [draftClosed, setDraftClosed] = useState(() => profile.lanes.closedDoors.join("\n"));

  function parseLanes(raw: string): string[] {
    return raw.split("\n").map((s) => s.trim()).filter(Boolean);
  }

  function commitLanes() {
    onLanesChange({ active: parseLanes(draftActive), closedDoors: parseLanes(draftClosed) });
  }

  function handleContinue() {
    commitLanes();
    onContinue();
  }

  function toggleTrigger(t: ShutdownTrigger, checked: boolean) {
    const next = checked
      ? [...profile.shutdown.triggers, t]
      : profile.shutdown.triggers.filter((x) => x !== t);
    onChange({ triggers: next });
  }

  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560 }}>
        What makes you want to disappear? This is important. Knowing what to avoid is as useful as knowing what works.
      </p>

      <Field>
        <MetaLabel size="section">Task types that cause avoidance</MetaLabel>
        <CheckGroup options={shutdownOptions} selected={profile.shutdown.triggers} onChange={toggleTrigger} />
        {showOtherField && (
          <div style={{ marginTop: 12 }}>
            <input
              type="text"
              value={profile.shutdown.triggerOther}
              onChange={(e) => onChange({ triggerOther: e.target.value })}
              placeholder="What else triggers avoidance for you?"
              style={{ fontSize: 13, padding: "9px 12px" }}
            />
          </div>
        )}
      </Field>

      <Field>
        <MetaLabel size="section">What does shutdown or avoidance actually look like?</MetaLabel>
        <textarea
          value={profile.shutdown.shutdownDescription}
          onChange={(e) => onChange({ shutdownDescription: e.target.value })}
          placeholder="Not what causes it. What happens when you're in it. Describe your specific pattern."
          rows={4}
          style={{ fontSize: 13 }}
        />
        <FieldHint>Optional. The more specific you are, the more useful to the agents that read it.</FieldHint>
      </Field>

      <Field>
        <MetaLabel size="section">What are you keeping out right now?</MetaLabel>
        <textarea
          value={profile.notDoing}
          onChange={(e) => onNotDoingChange(e.target.value)}
          placeholder="The things you keep out on purpose. One per line."
          rows={3}
          style={{ fontSize: 13 }}
        />
        <FieldHint>Not a limitation list. Naming the no's is what makes the rest possible.</FieldHint>
      </Field>

      <Field>
        <MetaLabel size="section">What are you actively working on right now?</MetaLabel>
        <textarea
          value={draftActive}
          onChange={(e) => setDraftActive(e.target.value)}
          onBlur={() => onLanesChange({ active: parseLanes(draftActive) })}
          placeholder="One to three. The things you're actually showing up for. One per line."
          rows={3}
          style={{ fontSize: 13 }}
        />
        <FieldHint>List one to three. An agent reading your profile will narrow to these when you ask for help with what to do next.</FieldHint>
      </Field>

      <Field>
        <MetaLabel size="section">What are you setting aside, for now?</MetaLabel>
        <textarea
          value={draftClosed}
          onChange={(e) => setDraftClosed(e.target.value)}
          onBlur={() => onLanesChange({ closedDoors: parseLanes(draftClosed) })}
          placeholder="Things you're choosing not to do this season. One per line."
          rows={3}
          style={{ fontSize: 13 }}
        />
        <FieldHint>It's allowed to hurt to name these. That's the grief step. Naming them protects your active lanes.</FieldHint>
      </Field>

      <Field>
        <MetaLabel size="section">Which rooms are safe to be accurate in, and which ones aren't?</MetaLabel>
        <textarea
          value={profile.roomSafety}
          onChange={(e) => onRoomSafetyChange(e.target.value)}
          placeholder="The rooms and settings you're in. For each: safe to be precise, or do you soften first?"
          rows={3}
          style={{ fontSize: 13 }}
        />
        <FieldHint>This is per room, not a fixed trait. Agents that read your profile treat each context as its own room.</FieldHint>
      </Field>

      <StepNav onBack={onBack} onContinue={handleContinue} />
    </div>
  );
}

// Step: Time and Energy
function TimeStep({
  profile,
  onChange,
  onBaselineChange,
  onBack,
  onContinue,
}: {
  profile: NDProfile;
  onChange: (update: Partial<NDProfile["timeEnergy"]>) => void;
  onBaselineChange: (update: Partial<NDProfile["baseline"]>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const timeOptions = (Object.entries(TIME_PATTERN_LABELS) as [TimePattern, string][]).map(([value, label]) => ({ value, label }));
  const showOtherField = profile.timeEnergy.patterns.includes("other");

  function togglePattern(p: TimePattern, checked: boolean) {
    const next = checked
      ? [...profile.timeEnergy.patterns, p]
      : profile.timeEnergy.patterns.filter((x) => x !== p);
    onChange({ patterns: next });
  }

  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560 }}>
        How does time and energy actually work for you? Not how you want it to. How it actually does.
      </p>

      <Field>
        <MetaLabel size="section">Which of these sound like you?</MetaLabel>
        <CheckGroup options={timeOptions} selected={profile.timeEnergy.patterns} onChange={togglePattern} />
        {showOtherField && (
          <div style={{ marginTop: 12 }}>
            <input
              type="text"
              value={profile.timeEnergy.patternOther}
              onChange={(e) => onChange({ patternOther: e.target.value })}
              placeholder="Your pattern in your own words"
              style={{ fontSize: 13, padding: "9px 12px" }}
            />
          </div>
        )}
      </Field>

      <Field>
        <MetaLabel size="section">When do you actually tend to sit down and work?</MetaLabel>
        <textarea
          value={profile.timeEnergy.activationWindows}
          onChange={(e) => onChange({ activationWindows: e.target.value })}
          placeholder="Time of day, day of week, conditions. Whatever describes when work actually happens for you"
          rows={3}
          style={{ fontSize: 13 }}
        />
      </Field>

      <Field>
        <MetaLabel size="section">When do you know you'll be unavailable?</MetaLabel>
        <textarea
          value={profile.timeEnergy.unavailablePeriods}
          onChange={(e) => onChange({ unavailablePeriods: e.target.value })}
          placeholder="Burnout periods, recovery days, times when nothing gets done no matter what. Anything predictable"
          rows={3}
          style={{ fontSize: 13 }}
        />
        <FieldHint>These are protected. Any process built from your profile will treat silence here as planned rest.</FieldHint>
      </Field>

      <Field>
        <MetaLabel size="section">What used to be easy a year ago that now takes real effort?</MetaLabel>
        <textarea
          value={profile.baseline.changedSinceYearAgo}
          onChange={(e) => onBaselineChange({ changedSinceYearAgo: e.target.value })}
          placeholder="Focus, energy, rest, getting started. What got harder?"
          rows={3}
          style={{ fontSize: 13 }}
        />
        <FieldHint>The target is a new baseline, not getting back to the old one. If rest doesn't restore the way it used to, that's expected.</FieldHint>
      </Field>

      <StepNav onBack={onBack} onContinue={onContinue} />
    </div>
  );
}

// Step: History
function HistoryStep({
  profile,
  onChange,
  onInvisibleLaborChange,
  onBack,
  onContinue,
}: {
  profile: NDProfile;
  onChange: (update: Partial<NDProfile["history"]>) => void;
  onInvisibleLaborChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560 }}>
        Most neurodivergent people have tried a lot of systems. The history is useful. It stops anything new from recommending something that's already failed.
      </p>

      <Field>
        <MetaLabel size="section">What systems or approaches have you tried?</MetaLabel>
        <textarea
          value={profile.history.triedSystems}
          onChange={(e) => onChange({ triedSystems: e.target.value })}
          placeholder="Apps, methods, structures, routines. Anything you've genuinely tried to stay on track or get things done"
          rows={4}
          style={{ fontSize: 13 }}
        />
      </Field>

      <Field>
        <MetaLabel size="section">What worked, even partially?</MetaLabel>
        <textarea
          value={profile.history.whatWorked}
          onChange={(e) => onChange({ whatWorked: e.target.value })}
          placeholder="It doesn't have to have been sustainable. Just anything that helped for a while"
          rows={3}
          style={{ fontSize: 13 }}
        />
      </Field>

      <Field>
        <MetaLabel size="section">What fell apart?</MetaLabel>
        <textarea
          value={profile.history.whatFailed}
          onChange={(e) => onChange({ whatFailed: e.target.value })}
          placeholder="What specifically caused things to break down? The pattern behind the failures is useful"
          rows={3}
          style={{ fontSize: 13 }}
        />
      </Field>

      <Field>
        <MetaLabel size="section">What did you notice and fix this week without being asked?</MetaLabel>
        <textarea
          value={profile.invisibleLabor}
          onChange={(e) => onInvisibleLaborChange(e.target.value)}
          placeholder="Small things nobody noticed. Refilled the coffee, caught the typo, kept the project moving."
          rows={3}
          style={{ fontSize: 13 }}
        />
        <FieldHint>The things that keep everything running and never get credited. Naming them makes them visible instead of automatic.</FieldHint>
      </Field>

      <StepNav onBack={onBack} onContinue={onContinue} />
    </div>
  );
}

// Step: Information preferences and support conditions
function InfoStep({
  profile,
  onChange,
  onBack,
  onContinue,
}: {
  profile: NDProfile;
  onChange: (update: Partial<NDProfile["infoConditions"]>) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const densityOptions = (Object.entries(INFO_DENSITY_LABELS) as [InfoDensity, string][]).map(([value, label]) => ({ value, label }));
  const formatOptions = (Object.entries(INFO_FORMAT_LABELS) as [InfoFormat, string][]).map(([value, label]) => ({ value, label }));
  const conditionOptions = (Object.entries(SUPPORT_CONDITION_LABELS) as [SupportCondition, string][]).map(([value, label]) => ({ value, label }));

  const showFormatOther = profile.infoConditions.formats.includes("any");
  const showConditionOther = profile.infoConditions.supportConditions.includes("other");

  function toggleFormat(f: InfoFormat, checked: boolean) {
    const next = checked
      ? [...profile.infoConditions.formats, f]
      : profile.infoConditions.formats.filter((x) => x !== f);
    onChange({ formats: next });
  }

  function toggleCondition(c: SupportCondition, checked: boolean) {
    const next = checked
      ? [...profile.infoConditions.supportConditions, c]
      : profile.infoConditions.supportConditions.filter((x) => x !== c);
    onChange({ supportConditions: next });
  }

  return (
    <div>
      <p style={{ fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560 }}>
        Two quick topics. How you prefer information, and what helps you actually work.
      </p>

      <Field>
        <MetaLabel size="section">When taking in information, what works best?</MetaLabel>
        <RadioGroup
          options={densityOptions}
          selected={profile.infoConditions.density}
          onChange={(v) => onChange({ density: v })}
        />
      </Field>

      <Field>
        <MetaLabel size="section">Format that works best for you</MetaLabel>
        <CheckGroup options={formatOptions} selected={profile.infoConditions.formats} onChange={toggleFormat} />
        {showFormatOther && (
          <div style={{ marginTop: 12 }}>
            <input
              type="text"
              value={profile.infoConditions.formatOther}
              onChange={(e) => onChange({ formatOther: e.target.value })}
              placeholder="Anything specific about format?"
              style={{ fontSize: 13, padding: "9px 12px" }}
            />
          </div>
        )}
      </Field>

      <Field>
        <MetaLabel size="section">What conditions help you actually work?</MetaLabel>
        <CheckGroup options={conditionOptions} selected={profile.infoConditions.supportConditions} onChange={toggleCondition} />
        {showConditionOther && (
          <div style={{ marginTop: 12 }}>
            <input
              type="text"
              value={profile.infoConditions.conditionOther}
              onChange={(e) => onChange({ conditionOther: e.target.value })}
              placeholder="What else helps?"
              style={{ fontSize: 13, padding: "9px 12px" }}
            />
          </div>
        )}
      </Field>

      <StepNav onBack={onBack} onContinue={onContinue} continueLabel="Build my profile" />
    </div>
  );
}

// Step: Done — profile artifact and download
function DoneStep({
  profile,
  onRestart,
  onBack,
}: {
  profile: NDProfile;
  onRestart: () => void;
  onBack: () => void;
}) {
  const isEmpty = !profile.traits.selected.length && !profile.traits.other.trim();

  return (
    <div>
      {isEmpty ? (
        <p style={{ fontSize: 15, color: "var(--ink-light)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 560 }}>
          You haven't filled anything in yet. Go back and complete at least the traits section to generate a useful profile.
        </p>
      ) : (
        <>
          <ContextProfileOutput profile={profile} />

          <div style={{ marginTop: 24 }}>
            <button
              onClick={onRestart}
              className="btn-text"
              style={{ fontSize: 12, color: "var(--ink-muted)" }}
            >
              Start over
            </button>
          </div>
        </>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--rule)" }}>
        <button
          onClick={onBack}
          className="btn-text"
          style={{ fontSize: 13, color: "var(--ink-muted)", display: "flex", alignItems: "center", gap: 6 }}
        >
          <ArrowLeft size={13} />
          Back
        </button>
      </div>
    </div>
  );
}

export function NDContextBuilder() {
  const [step, setStep] = useState<StepId>("intro");
  const [profile, setProfile] = useState<NDProfile>(() => loadNDProfile() ?? createEmptyNDProfile());
  const [hasExisting] = useState(() => loadNDProfile() !== null);
  const [wasMigrated] = useState(() => {
    try {
      const raw = localStorage.getItem("nd-profile");
      if (!raw) return false;
      const parsed = JSON.parse(raw) as { version?: unknown };
      return parsed && parsed.version === 1;
    } catch {
      return false;
    }
  });

  // Auto-save whenever profile changes (not on intro/done steps)
  useEffect(() => {
    if (step !== "intro") {
      saveNDProfile(profile);
    }
  }, [profile, step]);

  const updateTraits = useCallback((update: Partial<NDProfile["traits"]>) => {
    setProfile((p) => ({ ...p, traits: { ...p.traits, ...update } }));
  }, []);

  const updateActivation = useCallback((update: Partial<NDProfile["activation"]>) => {
    setProfile((p) => ({ ...p, activation: { ...p.activation, ...update } }));
  }, []);

  const updateShutdown = useCallback((update: Partial<NDProfile["shutdown"]>) => {
    setProfile((p) => ({ ...p, shutdown: { ...p.shutdown, ...update } }));
  }, []);

  const updateGates = useCallback((update: Partial<NDProfile["gates"]>) => {
    setProfile((p) => ({ ...p, gates: { ...p.gates, ...update } }));
  }, []);

  const updateName = useCallback((name: string) => {
    setProfile((p) => ({ ...p, name }));
  }, []);

  const updateNotDoing = useCallback((notDoing: string) => {
    setProfile((p) => ({ ...p, notDoing }));
  }, []);

  const updateLanes = useCallback((update: Partial<NDProfile["lanes"]>) => {
    setProfile((p) => ({ ...p, lanes: { ...p.lanes, ...update } }));
  }, []);

  const updateBaseline = useCallback((update: Partial<NDProfile["baseline"]>) => {
    setProfile((p) => ({ ...p, baseline: { ...p.baseline, ...update } }));
  }, []);

  const updateInvisibleLabor = useCallback((invisibleLabor: string) => {
    setProfile((p) => ({ ...p, invisibleLabor }));
  }, []);

  const updateRoomSafety = useCallback((roomSafety: string) => {
    setProfile((p) => ({ ...p, roomSafety }));
  }, []);

  const updateTimeEnergy = useCallback((update: Partial<NDProfile["timeEnergy"]>) => {
    setProfile((p) => ({ ...p, timeEnergy: { ...p.timeEnergy, ...update } }));
  }, []);

  const updateHistory = useCallback((update: Partial<NDProfile["history"]>) => {
    setProfile((p) => ({ ...p, history: { ...p.history, ...update } }));
  }, []);

  const updateInfoConditions = useCallback((update: Partial<NDProfile["infoConditions"]>) => {
    setProfile((p) => ({ ...p, infoConditions: { ...p.infoConditions, ...update } }));
  }, []);

  const contentRef = useRef<HTMLDivElement>(null);

  // The tool sits below site chrome, so an absolute scroll-to-top lands the
  // user on the page header, not the form. Scroll the step content to the top
  // of the viewport instead, so the next step appears in place.
  function scrollStepIntoView() {
    const el = contentRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function goToStep(id: StepId) {
    setStep(id);
    scrollStepIntoView();
  }

  function next() {
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex < STEP_ORDER.length - 1) {
      goToStep(STEP_ORDER[currentIndex + 1]);
    }
  }

  function back() {
    const currentIndex = STEP_ORDER.indexOf(step);
    if (currentIndex > 0) {
      goToStep(STEP_ORDER[currentIndex - 1]);
    }
  }

  function handleRestart() {
    if (window.confirm("Start a new profile? Your current one will be cleared.")) {
      clearNDProfile();
      setProfile(createEmptyNDProfile());
      goToStep("intro");
    }
  }

  const stepIndex = STEP_ORDER.indexOf(step);
  const isFormStep = step !== "intro" && step !== "done";
  const formStepIndex = isFormStep ? STEP_ORDER.indexOf(step) - 1 : null;
  const formStepCount = STEP_ORDER.length - 2; // exclude intro and done

  return (
    <div ref={contentRef}>
      {step !== "intro" && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
            <h2 style={{
              fontSize: 18,
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: 0,
              margin: 0,
              lineHeight: 1.2,
            }}>
              {STEP_LABELS[step]}
            </h2>
            {isFormStep && formStepIndex !== null && (
              <span className="mono" style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                {formStepIndex} of {formStepCount}
              </span>
            )}
          </div>
          {step !== "done" && (
            <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
              {STEP_ORDER.slice(1, -1).map((s) => {
                const idx = STEP_ORDER.indexOf(s);
                const currentIdx = stepIndex;
                const isDone = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div
                    key={s}
                    style={{
                      height: 2,
                      flex: 1,
                      background: isDone
                        ? "var(--teal)"
                        : isCurrent
                        ? "rgba(91, 138, 138, 0.4)"
                        : "var(--rule)",
                      transition: "background 0.2s",
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {step === "intro" && (
        <IntroStep onBegin={() => goToStep("gate")} hasExisting={hasExisting} wasMigrated={wasMigrated} />
      )}
      {step === "gate" && (
        <GateStep profile={profile} onChange={updateGates} onNameChange={updateName} onBack={back} onContinue={next} />
      )}
      {step === "traits" && (
        <TraitsStep profile={profile} onChange={updateTraits} onBack={back} onContinue={next} />
      )}
      {step === "activation" && (
        <ActivationStep profile={profile} onChange={updateActivation} onBack={back} onContinue={next} />
      )}
      {step === "shutdown" && (
        <ShutdownStep profile={profile} onChange={updateShutdown} onNotDoingChange={updateNotDoing} onLanesChange={updateLanes} onRoomSafetyChange={updateRoomSafety} onBack={back} onContinue={next} />
      )}
      {step === "time" && (
        <TimeStep profile={profile} onChange={updateTimeEnergy} onBaselineChange={updateBaseline} onBack={back} onContinue={next} />
      )}
      {step === "history" && (
        <HistoryStep profile={profile} onChange={updateHistory} onInvisibleLaborChange={updateInvisibleLabor} onBack={back} onContinue={next} />
      )}
      {step === "info" && (
        <InfoStep profile={profile} onChange={updateInfoConditions} onBack={back} onContinue={next} />
      )}
      {step === "done" && (
        <DoneStep profile={profile} onRestart={handleRestart} onBack={back} />
      )}
    </div>
  );
}
