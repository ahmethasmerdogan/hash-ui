<div align="center">

# uicean

**A design foundation, distilled from the wild.**

A flat, shadow-free **React + Tailwind CSS v4** design system — 96 components
and 82 hand-drawn icons, rebuilt from 36 curated interface references.

[Documentation](https://uicean.vercel.app) ·
[GitHub](https://github.com/ahmethasmerdogan/uicean) ·
[Registry](https://uicean.vercel.app/docs/registry)

</div>

---

## Install

```bash
npm install uicean
```

Peer requirements: **React 18 or 19** and **Tailwind CSS v4**. `three` is an
optional peer, needed only by `<ThreeOrb />`.

```css
/* src/index.css — order matters, uicean/css comes after Tailwind */
@import "tailwindcss";
@import "uicean/css";
```

```tsx
import { ThemeProvider, ToastProvider, Button, StatusPill } from "uicean";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Button variant="green">Get started for Free</Button>
        <StatusPill tone="green">Accepted</StatusPill>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

`uicean/css` also points Tailwind at this package's bundle, so the component
utilities are generated even though Tailwind skips `node_modules` by default.

To avoid a flash of the wrong theme, set the class before React boots:

```html
<script>
  (function () {
    var s = localStorage.getItem("uicean-theme");
    if (s === "dark" || ((s === null || s === "system") &&
        matchMedia("(prefers-color-scheme: dark)").matches))
      document.documentElement.classList.add("dark");
  })();
</script>
```

[Full installation guide, including Next.js →](https://uicean.vercel.app/docs/installation)

## Prefer to own the code?

Every component is also a shadcn registry item:

```bash
npx shadcn@latest add https://uicean.vercel.app/r/button.json
npx shadcn@latest add https://uicean.vercel.app/r/uicean.json   # everything
```

## Theming

One block of CSS rebrands the system:

```css
:root {
  --brand: #059669;
  --canvas: #f4f4f2;
  --surface: #ffffff;
  --line: #e6e5e1;
  --ink: #1c1b18;
}
```

Already have your own tokens? Alias them instead of restyling components:

```css
@import "uicean/css";
@import "uicean/presets/brand-bridge.css";
```

## Notes

- ESM only. Types resolve with TypeScript's `"moduleResolution": "bundler"`
  (the Vite and Next.js default).
- No drop shadows anywhere — depth is `canvas › surface › elev › inset` plus a
  1px hairline. This is a rule, not an oversight.
- Six exports share a name with shadcn/ui (`Alert`, `Button`, `Card`,
  `EmptyState`, `Modal`, `Skeleton`). Alias one side where both are needed.

MIT © [Ahmet Hâşim Erdoğan](https://github.com/ahmethasmerdogan)
