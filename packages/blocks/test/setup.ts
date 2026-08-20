/* jsdom has neither IntersectionObserver nor matchMedia, and the hooks under
   test are built entirely around them. Both stubs are driveable: a test can
   fire an intersection or flip the motion preference and assert what happens,
   which is the only way to check a fail-safe that exists precisely for the
   case where the observer never fires. */
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

type IOCallback = (entries: { isIntersecting: boolean }[]) => void;

const observers: Array<{ cb: IOCallback; disconnected: boolean }> = [];

/** Fire an intersection on every live observer. */
export function intersect(isIntersecting = true) {
  observers
    .filter((o) => !o.disconnected)
    .forEach((o) => o.cb([{ isIntersecting }]));
}

/** How many observers are still watching — a disconnect leak shows up here. */
export const liveObservers = () => observers.filter((o) => !o.disconnected).length;

class FakeIntersectionObserver {
  private entry: { cb: IOCallback; disconnected: boolean };
  constructor(cb: IOCallback) {
    this.entry = { cb, disconnected: false };
    observers.push(this.entry);
  }
  observe() {}
  unobserve() {}
  disconnect() {
    this.entry.disconnected = true;
  }
  takeRecords() {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

let media: Record<string, boolean> = {};
export function setMedia(query: string, value: boolean) {
  media[query] = value;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    get matches() {
      return media[query] ?? false;
    },
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});

afterEach(() => {
  cleanup();
  observers.length = 0;
  media = {};
});
