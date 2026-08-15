export type ActiveTool =
  | "context-builder"
  | "process-designer"
  | "spine-finder"
  | "skills";

export const TOOL_ROUTES: Record<ActiveTool, string> = {
  "context-builder": "/context-builder",
  "process-designer": "/process-designer",
  "spine-finder": "/spine-finder",
  skills: "/skills",
};

export const TOOL_LINKS: Array<{ id: ActiveTool; label: string; group: "steps" | "options" }> = [
  { id: "context-builder", label: "Context Builder", group: "steps" },
  { id: "process-designer", label: "Process Designer", group: "steps" },
  { id: "spine-finder", label: "Spine-Finder", group: "options" },
  { id: "skills", label: "Skills", group: "options" },
];
