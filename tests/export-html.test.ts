import { describe, expect, it } from "vitest";
import {
  artifactHtmlFileName,
  artifactMarkdownFileName,
  buildHtmlExport,
  localDateStamp,
} from "../src/lib/export-html";

describe("HTML export filename helpers", () => {
  it("stamps dates locally as YYYY-MM-DD", () => {
    expect(localDateStamp()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("names files with the artifact kind, a local date, and no spaces", () => {
    expect(artifactHtmlFileName("profile")).toMatch(/^nd-profile-\d{4}-\d{2}-\d{2}\.html$/);
    expect(artifactHtmlFileName("process")).toMatch(/^nd-process-\d{4}-\d{2}-\d{2}\.html$/);
    expect(artifactMarkdownFileName("profile")).toMatch(/^nd-profile-\d{4}-\d{2}-\d{2}\.md$/);
    expect(artifactMarkdownFileName("process")).toMatch(/^nd-process-\d{4}-\d{2}-\d{2}\.md$/);
  });
});

describe("buildHtmlExport", () => {
  it("returns a self-contained document: tokens, print CSS, system fonts, no scripts", () => {
    const html = buildHtmlExport({ title: "ND Profile", node: null });

    expect(html.startsWith("<!doctype html>")).toBe(true);
    // Inlined token block so serialized inline styles resolve (var(--teal) etc.)
    expect(html).toContain("--teal: #5b8a8a");
    expect(html).toContain("--font-display: system-ui");
    // Printable, calm on paper
    expect(html).toContain("@media print");
    // No interactivity, no web-font/CDN references, no tracking surface
    expect(html).not.toContain("<script");
    expect(html).not.toContain("fonts.googleapis.com");
    expect(html).not.toContain("fontshare");
    // The trust contract travels with the artifact
    expect(html).toContain("Nothing was sent to any server");
  });

  it("escapes the title so user text cannot break out of the document", () => {
    const html = buildHtmlExport({ title: "<script>alert(1)</script>", node: null });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("falls back cleanly when there is no rendered node", () => {
    const html = buildHtmlExport({ title: "Empty", node: null });
    expect(html).toContain("Nothing to export");
  });
});
