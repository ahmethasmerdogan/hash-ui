import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ThemeProvider, themeScript, useTheme, ACCENTS } from "../src/theme.js";
import { setMedia } from "./setup.js";

/* These cover the two things that have actually gone wrong here: reading a
   browser global during render, and an accent that persists but never
   reaches the document. */

function Probe() {
  const { mode, resolved, accent, setMode, setAccent } = useTheme();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <span data-testid="resolved">{resolved}</span>
      <span data-testid="accent">{accent}</span>
      <button onClick={() => setMode("dark")}>dark</button>
      <button onClick={() => setAccent("violet")}>violet</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("renders with defaults before any preference is stored", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("mode").textContent).toBe("system");
    expect(screen.getByTestId("accent").textContent).toBe("emerald");
  });

  it("picks up a stored preference after mount", async () => {
    localStorage.setItem("hashui-theme", "dark");
    localStorage.setItem("hashui-accent", "rose");
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await act(async () => {});
    expect(screen.getByTestId("mode").textContent).toBe("dark");
    expect(screen.getByTestId("accent").textContent).toBe("rose");
  });

  it("ignores a stored value that is not one of the presets", async () => {
    localStorage.setItem("hashui-accent", "chartreuse");
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await act(async () => {});
    expect(screen.getByTestId("accent").textContent).toBe("emerald");
  });

  it("puts the accent on <html>, and leaves the default off it", async () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await act(async () => {});
    /* emerald is the :root palette; setting an attribute for it would only be
       something extra to explain in devtools */
    expect(document.documentElement.hasAttribute("data-accent")).toBe(false);

    await act(async () => {
      screen.getByText("violet").click();
    });
    expect(document.documentElement.getAttribute("data-accent")).toBe("violet");
    expect(localStorage.getItem("hashui-accent")).toBe("violet");
  });

  it("follows the system scheme while the mode is 'system'", async () => {
    setMedia("(prefers-color-scheme: dark)", true);
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    await act(async () => {});
    expect(screen.getByTestId("resolved").textContent).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("survives a localStorage that throws, as Safari's private mode does", async () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error("denied");
    };
    try {
      render(
        <ThemeProvider>
          <Probe />
        </ThemeProvider>,
      );
      await act(async () => {});
      expect(screen.getByTestId("mode").textContent).toBe("system");
    } finally {
      Storage.prototype.getItem = original;
    }
  });
});

describe("themeScript", () => {
  it("is syntactically valid JavaScript", () => {
    expect(() => new Function(themeScript)).not.toThrow();
  });

  it("applies the stored theme the same way the provider would", () => {
    localStorage.setItem("hashui-theme", "dark");
    localStorage.setItem("hashui-accent", "amber");
    new Function(themeScript)();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.getAttribute("data-accent")).toBe("amber");
  });

  it("names every accent the presets define", () => {
    /* the script hard-codes the default so it can skip the attribute; if a
       preset is ever renamed this is where it would silently drift */
    for (const id of Object.keys(ACCENTS)) {
      if (id === "emerald") continue;
      localStorage.setItem("hashui-accent", id);
      document.documentElement.removeAttribute("data-accent");
      new Function(themeScript)();
      expect(document.documentElement.getAttribute("data-accent")).toBe(id);
    }
  });
});
