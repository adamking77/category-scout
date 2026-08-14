// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { createRoot } from "react-dom/client";
import { act } from "react";

// React's act() needs this flag in non-react-dom/test-utils environments.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

import { NDContextBuilder } from "../src/components/NDContextBuilder";
import { NDProcessDesigner } from "../src/components/NDProcessDesigner";
import { SpineFinder } from "../src/components/SpineFinder";
import { SkillsLibrary } from "../src/components/SkillsLibrary";

/**
 * Render smoke tests: every tool must mount without throwing and must render
 * visible content. A blank page in production is a mount crash; these catch
 * that class of bug at test time instead of on the live site.
 */

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length(): number {
    return this.values.size;
  }
  clear(): void {
    this.values.clear();
  }
  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }
  key(index: number): string | null {
    return Array.from(this.values.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.values.delete(key);
  }
  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", {
    value: new MemoryStorage(),
    configurable: true,
    writable: true,
  });
  // happy-dom lacks matchMedia; the chart layer may query it on mount.
  if (typeof window.matchMedia !== "function") {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
});

function mountWithoutCrash(node: React.ReactNode): string {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => {
    root.render(node);
  });
  const html = host.innerHTML;
  act(() => {
    root.unmount();
  });
  host.remove();
  return html;
}

describe("tool mount smoke tests", () => {
  it("Process Designer mounts and renders content", () => {
    const html = mountWithoutCrash(<NDProcessDesigner onOpenContextBuilder={() => {}} />);
    expect(html.length).toBeGreaterThan(0);
  });

  it("Context Builder mounts and renders content", () => {
    const html = mountWithoutCrash(<NDContextBuilder />);
    expect(html.length).toBeGreaterThan(0);
  });

  it("Spine-Finder mounts and renders content", () => {
    const html = mountWithoutCrash(<SpineFinder />);
    expect(html.length).toBeGreaterThan(0);
  });

  it("Skills Library mounts and renders content", () => {
    const html = mountWithoutCrash(<SkillsLibrary />);
    expect(html.length).toBeGreaterThan(0);
  });
});
