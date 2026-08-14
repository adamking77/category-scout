// Self-contained HTML visual export for NeuroDiv OS artifacts.
//
// Serializes an already-rendered DOM node into a standalone .html file with
// inlined tokens, a system font stack, and a print stylesheet. No JavaScript,
// no interactivity, no web fonts, no clinical language. The on-screen charts
// are copied as rendered SVG, so the export mirrors the page exactly.

export type ArtifactKind = "profile" | "process";

/** Local date stamp, YYYY-MM-DD. */
export function localDateStamp(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** nd-profile-2026-08-14.html */
export function artifactHtmlFileName(kind: ArtifactKind): string {
  return `nd-${kind}-${localDateStamp()}.html`;
}

/** nd-profile-2026-08-14.md */
export function artifactMarkdownFileName(kind: ArtifactKind): string {
  return `nd-${kind}-${localDateStamp()}.md`;
}

// The :root token set copied from globals.css, with the two font variables
// swapped to system stacks (the export ships no web fonts). The color and chart
// tokens stay identical so the serialized inline styles (which reference
// var(--teal), var(--ink-light), etc.) resolve to the same palette.
const ROOT_TOKENS = `:root {
  --cream: #fdfbf7;
  --ink: #1a1a18;
  --ink-light: #4a4a45;
  --ink-muted: #8a8a82;
  --teal: #5b8a8a;
  --teal-deep: #3d6b6b;
  --terracotta: #c4725a;
  --warning: #b8860b;
  --warning-deep: #966f00;
  --warning-bg: rgba(196, 164, 132, 0.08);
  --warning-pill: rgba(196, 164, 132, 0.15);
  --rule: rgba(26, 26, 24, 0.1);
  --rule-strong: rgba(26, 26, 24, 0.3);
  --surface: rgba(255, 255, 255, 0.58);
  --surface-strong: rgba(255, 255, 255, 0.82);
  --chart-1: #5b8a8a;
  --chart-2: #c4725a;
  --chart-3: #3d6b6b;
  --chart-4: #b8860b;
  --chart-5: #8a8a82;
  --chart-background: oklch(1 0 0);
  --chart-foreground: oklch(0.145 0.004 285);
  --chart-foreground-muted: oklch(0.55 0.014 260);
  --chart-line-primary: var(--chart-1);
  --chart-line-secondary: var(--chart-2);
  --chart-crosshair: rgba(91, 138, 138, 0.72);
  --chart-grid: rgba(26, 26, 24, 0.12);
  --chart-brush-border: var(--chart-grid);
  --chart-tooltip-background: oklch(0.21 0.006 285 / 0.8);
  --chart-tooltip-foreground: oklch(0.985 0 0);
  --chart-tooltip-muted: oklch(0.65 0.01 260);
  --chart-marker-background: oklch(0.97 0.005 260);
  --chart-marker-border: oklch(0.85 0.01 260);
  --chart-marker-foreground: oklch(0.3 0.01 260);
  --chart-label: var(--ink-muted);
  --chart-scale-01: rgba(91, 138, 138, 0.08);
  --chart-scale-02: rgba(91, 138, 138, 0.18);
  --chart-scale-03: rgba(91, 138, 138, 0.32);
  --chart-scale-04: rgba(196, 114, 90, 0.48);
  --chart-scale-05: rgba(196, 114, 90, 0.68);
  --chart-scale-pattern-color: oklch(0.96 0.005 106);
  --font-display: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, "Liberation Mono", monospace;
}`;

const BASE_CSS = `*,
*::before,
*::after {
  box-sizing: border-box;
}
html {
  -webkit-text-size-adjust: 100%;
}
body {
  margin: 0;
  padding: 48px 28px 80px;
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-display);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.mono {
  font-family: var(--font-mono), monospace;
}
.nd-export-header {
  max-width: 720px;
  margin: 0 auto 48px;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--rule);
}
.nd-export-title {
  font-family: var(--font-mono), monospace;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.nd-export-date {
  margin-top: 6px;
  font-size: 14px;
  color: var(--ink-light);
}
.nd-export-note {
  margin-top: 10px;
  font-size: 13px;
  color: var(--ink-muted);
}
.nd-export-main {
  max-width: 720px;
  margin: 0 auto;
}`;

const PRINT_CSS = `@media print {
  body {
    background: #fff;
    padding: 0;
  }
  :root {
    --cream: #fff;
    --surface: #fff;
    --surface-strong: #fff;
  }
  .nd-export-header {
    border-color: #e0e0dc;
  }
  .nd-export-main {
    max-width: none;
  }
}`;

export interface HtmlExportOptions {
  title: string;
  node: HTMLElement | null;
  generatedAt?: Date;
}

/** Build a fully self-contained HTML document string from a rendered node. */
export function buildHtmlExport({ title, node, generatedAt = new Date() }: HtmlExportOptions): string {
  const dateLabel = generatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${escapeHtml(title)}</title>`,
    "<style>",
    ROOT_TOKENS,
    BASE_CSS,
    PRINT_CSS,
    "</style>",
    "</head>",
    "<body>",
    '<header class="nd-export-header">',
    `<div class="nd-export-title">${escapeHtml(title)}</div>`,
    `<div class="nd-export-date">${escapeHtml(dateLabel)}</div>`,
    '<div class="nd-export-note">Generated by NeuroDiv OS, in your own browser. Nothing was sent to any server.</div>',
    "</header>",
    '<main class="nd-export-main">',
    serializeArtifact(node),
    "</main>",
    "</body>",
    "</html>",
  ].join("\n");
}

function serializeArtifact(node: HTMLElement | null): string {
  if (!node) return "<p>Nothing to export.</p>";
  const clone = node.cloneNode(true) as HTMLElement;
  // Strip interactive elements so the artifact is static and clean.
  clone.querySelectorAll("[data-export-exclude], button").forEach((el) => el.remove());
  return clone.outerHTML;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Download a string as a file, entirely in the browser. */
export function downloadHtmlFile(filename: string, html: string): void {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
