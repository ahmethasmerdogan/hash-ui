import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useInView } from "../src/hooks.js";
import { useRise, RISE_ATTR } from "../src/parts.js";
import { intersect, liveObservers } from "./setup.js";

/* `useInView` is load-bearing for every entrance animation in the package,
   and its fail-safe exists for the case that is hardest to reproduce by
   hand: an observer that never fires at all. */

function Seen({ fallbackMs }: { fallbackMs?: number }) {
  const [ref, seen] = useInView<HTMLDivElement>("-8% 0px", fallbackMs);
  return (
    <div ref={ref} data-testid="box">
      {seen ? "seen" : "unseen"}
    </div>
  );
}

describe("useInView", () => {
  it("starts unseen and flips when the element intersects", () => {
    render(<Seen />);
    expect(screen.getByTestId("box").textContent).toBe("unseen");
    act(() => intersect(true));
    expect(screen.getByTestId("box").textContent).toBe("seen");
  });

  it("does not flip back once seen", () => {
    render(<Seen />);
    act(() => intersect(true));
    act(() => intersect(false));
    expect(screen.getByTestId("box").textContent).toBe("seen");
  });

  it("stops observing once it has fired", () => {
    render(<Seen />);
    expect(liveObservers()).toBe(1);
    act(() => intersect(true));
    expect(liveObservers()).toBe(0);
  });

  it("disconnects on unmount, so a scrolled-past block leaks nothing", () => {
    const view = render(<Seen />);
    expect(liveObservers()).toBe(1);
    view.unmount();
    expect(liveObservers()).toBe(0);
  });

  it("reports seen anyway once the fail-safe elapses", () => {
    vi.useFakeTimers();
    try {
      render(<Seen fallbackMs={1200} />);
      expect(screen.getByTestId("box").textContent).toBe("unseen");
      /* the observer is never fired: printing, content-visibility, and
         screenshot tools that capture beyond the viewport all behave this
         way, and without this the content would stay at opacity 0 forever */
      act(() => {
        vi.advanceTimersByTime(1300);
      });
      expect(screen.getByTestId("box").textContent).toBe("seen");
    } finally {
      vi.useRealTimers();
    }
  });

  it("waits indefinitely when no fail-safe is asked for", () => {
    vi.useFakeTimers();
    try {
      render(<Seen />);
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      /* deliberate: SplineScene gates a 2 MB download on this, and a block
         nobody scrolled to must not fetch it on a timer */
      expect(screen.getByTestId("box").textContent).toBe("unseen");
    } finally {
      vi.useRealTimers();
    }
  });

  it("reports seen immediately where IntersectionObserver does not exist", () => {
    const original = window.IntersectionObserver;
    // @ts-expect-error — deleting a global for the duration of one test
    delete window.IntersectionObserver;
    try {
      render(<Seen />);
      expect(screen.getByTestId("box").textContent).toBe("seen");
    } finally {
      window.IntersectionObserver = original;
    }
  });
});

/* `useRise` is what every block's entrance animation is written against. The
   thing worth pinning is that its hidden state is only ever temporary. */

function Risen({ index }: { index: number }) {
  const [ref, rise] = useRise<HTMLDivElement>();
  return (
    <div ref={ref}>
      <p data-testid="item" {...RISE_ATTR} style={rise(index)}>
        content
      </p>
    </div>
  );
}

describe("useRise", () => {
  it("starts hidden and offset, then settles once seen", () => {
    render(<Risen index={0} />);
    const el = screen.getByTestId("item");
    expect(el.style.opacity).toBe("0");
    expect(el.style.transform).toContain("translate3d");

    act(() => intersect(true));
    expect(el.style.opacity).toBe("1");
    expect(el.style.transform).toBe("none");
  });

  it("staggers by index rather than animating everything at once", () => {
    render(<Risen index={3} />);
    const el = screen.getByTestId("item");
    /* 3 × the 70ms default */
    expect(el.style.transition).toContain("210ms");
  });

  it("is marked so the reduced-motion rule can pin it", () => {
    /* the styles start at opacity 0; blocks.css overrides that with
       !important under the setting, and it finds the element by this
       attribute. Without the marker, reduced motion would hide the content
       rather than calm it. */
    render(<Risen index={0} />);
    expect(screen.getByTestId("item").hasAttribute("data-fx-rise")).toBe(true);
  });
});
