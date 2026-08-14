export function MetaLabel({
  children,
  marginBottom,
  color,
  size = "meta",
  style,
}: {
  children: React.ReactNode;
  marginBottom?: number;
  color?: string;
  /** "meta" = eyebrow for true metadata; "section" = readable heading
   * label for intake form sections and grouped headers. Section labels are
   * larger, darker, and sentence-case because they carry the structure of
   * the form — long uppercase strings are hard for ND readers to scan. */
  size?: "meta" | "section";
  style?: React.CSSProperties;
}) {
  const isSection = size === "section";
  return (
    <p
      style={{
        fontSize: 12,
        fontWeight: isSection ? 600 : 500,
        letterSpacing: isSection ? "0.04em" : "0.12em",
        textTransform: isSection ? "none" : "uppercase",
        color: color ?? (isSection ? "var(--ink)" : "var(--ink-light)"),
        margin: `0 0 ${marginBottom ?? (isSection ? 14 : 8)}px`,
        fontFamily: "var(--font-mono)",
        lineHeight: isSection ? 1.35 : 1,
        ...style,
      }}
    >
      {children}
    </p>
  );
}
