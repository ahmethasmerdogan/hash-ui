/**
 * @vitest-environment node
 *
 * The regression this guards: ThemeProvider used to read localStorage and
 * document inside its useState initialisers, which run during render. The
 * installation page documents a Next.js App Router setup, so the documented
 * path threw before the first byte went out.
 *
 * `environment: node` is the point — there is no DOM here at all, which is
 * exactly the condition a server renders under.
 */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { ThemeProvider, themeScript } from "../src/theme.js";
import { Button } from "../src/Button.js";

describe("server rendering", () => {
  it("has no DOM, which is the condition under test", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
  });

  it("renders ThemeProvider and its children without a DOM", () => {
    const html = renderToString(
      createElement(
        ThemeProvider,
        null,
        createElement(Button, { variant: "green" }, "Server rendered"),
      ),
    );
    expect(html).toContain("Server rendered");
  });

  it("exports themeScript as a plain string, safe to inline in <head>", () => {
    expect(typeof themeScript).toBe("string");
    /* it is built at module scope from fixed literals — nothing is
       interpolated, so there is nothing that could need escaping */
    expect(themeScript).not.toContain("</script");
  });
});
