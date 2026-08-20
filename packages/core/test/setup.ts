/* jsdom has no matchMedia, and three things in this package ask for it:
   the theme provider, useReducedMotion, and anything reading the colour
   scheme. A stub that can be driven from a test is more useful than one
   that always answers false. */
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
let matches: Record<string, boolean> = {};

export function setMedia(query: string, value: boolean) {
  matches[query] = value;
  listeners.get(query)?.forEach((l) => l());
}

/* ssr.test.tsx runs under `environment: node`, where touching window is the
   very thing being tested for. Everything below is DOM-only. */
const hasDOM = typeof window !== "undefined";

if (hasDOM) {
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return matches[query] ?? false;
    },
    media: query,
    onchange: null,
    addEventListener: (_: string, l: Listener) => {
      if (!listeners.has(query)) listeners.set(query, new Set());
      listeners.get(query)!.add(l);
    },
    removeEventListener: (_: string, l: Listener) => listeners.get(query)?.delete(l),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })),
});
}

afterEach(() => {
  if (!hasDOM) return;
  cleanup();
  matches = {};
  listeners.clear();
  localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.removeAttribute("data-accent");
});
