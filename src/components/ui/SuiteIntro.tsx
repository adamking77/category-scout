import { TOOL_ROUTES } from "../../lib/tool-routes";
import { MetaLabel } from "./MetaLabel";

const ORDER_STEPS = [
  {
    title: "Build context profile.",
    body: "Names what activates you, what shuts you down, how you take in information.",
  },
  {
    title: "Design a process.",
    body: "One goal, shaped around your profile. Step menus for each working mode.",
  },
] as const;

/**
 * The suite's recommended order, shown on every tool's intro step so the
 * relationship between the tools is explicit: profile first, then process,
 * then the Skill Suite carries it into your own AI. Recommended, never
 * enforced. The Session Loop is a skill, not a web-tool step.
 */
export function SuiteOrder() {
  return (
    <div
      style={{
        border: "1px solid rgba(91, 138, 138, 0.25)",
        background: "rgba(91, 138, 138, 0.06)",
        borderRadius: 0,
        padding: "18px 20px",
        margin: "0 0 20px",
      }}
    >
      <MetaLabel size="section">How the suite fits together</MetaLabel>
      {ORDER_STEPS.map((step, i) => (
        <div key={i} style={{ display: "flex", gap: 12, margin: "0 0 10px" }}>
          <span
            className="mono"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "var(--teal-deep)",
              lineHeight: 1.55,
              minWidth: 16,
              textAlign: "right",
            }}
          >
            {i + 1}
          </span>
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--ink)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {step.title}
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-light)",
                lineHeight: 1.6,
                margin: "2px 0 0",
              }}
            >
              {step.body}
            </p>
          </div>
        </div>
      ))}
      <p
        style={{
          fontSize: 14,
          color: "var(--ink-light)",
          lineHeight: 1.6,
          margin: "12px 0 0",
          paddingTop: 12,
          borderTop: "1px solid rgba(91, 138, 138, 0.2)",
        }}
      >
        The profile is what makes the plan yours. Without one, this tool asks a few extra questions to cover the basics.
      </p>
    </div>
  );
}

/**
 * A single line pointing at the Skill Suite, shown at the bottom of each
 * tool's intro step. Same-origin navigation, no new network requests.
 */
export function SkillsCallout() {
  return (
    <p style={{ fontSize: 14, color: "var(--ink-light)", lineHeight: 1.6, margin: "28px 0 0" }}>
      Want this as a skill inside your own AI?{" "}
      <a href={TOOL_ROUTES.skills} style={{ color: "var(--teal-deep)", textDecoration: "none" }}>
        See the Skill Suite
      </a>
    </p>
  );
}
