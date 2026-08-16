import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Alert, Card, cx, ICheck, ISparkleFill } from "hash-ui";
import { Section } from "@/components/Section";
import { CodeBlock } from "@/components/Code";
import { InstallTabs } from "@/components/InstallTabs";
import { SITE } from "@/lib/site";

function Step({
  n,
  title,
  desc,
  last,
  children,
}: {
  n: number;
  title: string;
  desc: ReactNode;
  last?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700 text-[13px] font-bold text-white">
          {n}
        </span>
        {!last && <span className="mt-2 w-px flex-1 bg-line" />}
      </div>
      <div className={cx("min-w-0 flex-1", last ? "pb-1" : "pb-8")}>
        <div className="text-[15.5px] font-bold text-ink">{title}</div>
        <p className="mt-1 mb-3.5 text-[13.5px] leading-relaxed text-ink-2">
          {desc}
        </p>
        {children}
      </div>
    </div>
  );
}

export default function Installation() {
  return (
    <Section
      id="installation"
      eyebrow="Getting started"
      title="Installation"
      desc="HashUI needs React and Tailwind CSS v4 — nothing else. Install the package for the whole system, or use the CLI to copy individual components into your own repo."
    >
      <InstallTabs items={["hashui"]} defaultMode="npm" />

      <Alert tone="info" title="Tailwind CSS v4 is a hard requirement">
        The token layer is built on <code className="font-mono">@theme inline</code>{" "}
        and <code className="font-mono">@custom-variant</code>, which only exist in
        v4. On v3 the components render, but every semantic colour resolves to
        nothing.
      </Alert>

      <Card className="rounded-2xl p-6 md:p-8">
        <Step
          n={1}
          title="Install"
          desc={
            <>
              React 18 or 19, plus Tailwind v4. The Geist fonts are optional but
              the system is drawn for them — <code className="font-mono">three</code>{" "}
              is only needed if you use <code className="font-mono">&lt;ThreeOrb /&gt;</code>.
            </>
          }
        >
          <CodeBlock
            filename="terminal"
            code={`npm install ${SITE.pkg}

# the stack it expects
npm install -D tailwindcss @tailwindcss/vite
npm install @fontsource-variable/geist @fontsource-variable/geist-mono

# optional — only for <ThreeOrb />
npm install three`}
          />
        </Step>

        <Step
          n={2}
          title="Import the stylesheet after Tailwind"
          desc={
            <>
              Order matters: <code className="font-mono">hash-ui/css</code> declares
              the tokens and the <code className="font-mono">dark</code> variant on
              top of Tailwind's own layers. It also points Tailwind at the
              package bundle, so the component utilities are generated even
              though Tailwind skips <code className="font-mono">node_modules</code> by
              default.
            </>
          }
        >
          <CodeBlock
            filename="src/index.css"
            code={`@import "tailwindcss";
@import "hash-ui/css";`}
          />
        </Step>

        <Step
          n={3}
          title="Load the fonts and wrap the app"
          desc={
            <>
              <code className="font-mono">ThemeProvider</code> owns light / dark /
              system and the sans stack; <code className="font-mono">ToastProvider</code>{" "}
              owns the toast queue behind{" "}
              <code className="font-mono">useToast()</code>.
            </>
          }
        >
          <CodeBlock
            filename="src/main.tsx"
            code={`import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./index.css";

import { ThemeProvider, ToastProvider } from "${SITE.pkg}";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>,
);`}
          />
        </Step>

        <Step
          n={4}
          title="Kill the theme flash"
          desc="ThemeProvider resolves the theme on mount, which is one paint too late. This inline script in index.html sets the class before React boots."
        >
          <CodeBlock
            filename="index.html"
            code={`<script>
  (function () {
    var s = localStorage.getItem("hashui-theme");
    if (
      s === "dark" ||
      ((s === null || s === "system") &&
        matchMedia("(prefers-color-scheme: dark)").matches)
    )
      document.documentElement.classList.add("dark");
  })();
</script>`}
          />
        </Step>

        <Step
          n={5}
          last
          title="Use it"
          desc="Everything comes from one barrel — components, icons, hooks and the cx helper."
        >
          <CodeBlock
            filename="src/App.tsx"
            code={`import { Button, StatusPill, Modal, useToast, IZap } from "${SITE.pkg}";

export function Ticket() {
  const { push } = useToast();
  return (
    <>
      <Button
        variant="green"
        iconLeft={<IZap size={15} />}
        onClick={() => push({ tone: "success", title: "Saved" })}
      >
        Create ticket
      </Button>
      <StatusPill tone="amber">In Progress</StatusPill>
    </>
  );
}`}
          />
        </Step>
      </Card>

      {/* ---------------------------------------------------- next.js --- */}
      <div>
        <h2 className="mb-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          Next.js (App Router)
        </h2>
        <p className="mb-4 text-[14px] leading-relaxed text-ink-2">
          Same three moves, different files. Use{" "}
          <code className="font-mono">@tailwindcss/postcss</code> instead of the
          Vite plugin, and mark the providers as a client component.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock
            filename="app/providers.tsx"
            code={`"use client";

import { ThemeProvider, ToastProvider } from "${SITE.pkg}";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
}`}
          />
          <CodeBlock
            filename="app/layout.tsx"
            code={`import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`}
          />
        </div>
      </div>

      {/* ------------------------------------------------------ notes --- */}
      <div>
        <h2 className="mb-1 text-[20px] font-bold tracking-[-0.02em] text-ink">
          Good to know
        </h2>
        <div className="mt-4 flex flex-col gap-2.5">
          {[
            <>
              Prefer to own the code? Every component is also a registry item —{" "}
              <Link
                to="/docs/registry"
                className="font-semibold text-emerald-700 underline underline-offset-2 dark:text-emerald-400"
              >
                install it with the shadcn CLI
              </Link>{" "}
              and the source lands in your repo instead.
            </>,
            <>
              Six names collide with shadcn/ui —{" "}
              <code className="font-mono text-[12.5px]">
                Alert · Button · Card · EmptyState · Modal · Skeleton
              </code>
              . In a file that needs both, alias one side:{" "}
              <code className="font-mono text-[12.5px]">
                {`import { Button as HButton } from "${SITE.pkg}"`}
              </code>
              .
            </>,
            <>
              Rebranding is one block of CSS —{" "}
              <Link
                to="/docs/theming"
                className="font-semibold text-emerald-700 underline underline-offset-2 dark:text-emerald-400"
              >
                override the tokens
              </Link>{" "}
              in <code className="font-mono text-[12.5px]">:root</code> and{" "}
              <code className="font-mono text-[12.5px]">.dark</code>.
            </>,
            <>
              The package ships ESM only, with types at{" "}
              <code className="font-mono text-[12.5px]">
                dist/types/index.d.ts
              </code>
              . Use TypeScript's{" "}
              <code className="font-mono text-[12.5px]">
                "moduleResolution": "bundler"
              </code>{" "}
              (the Vite and Next defaults).
            </>,
          ].map((body, i) => (
            <span key={i} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-2">
              <ICheck
                size={12}
                strokeWidth={3}
                className="mt-1 shrink-0 rounded-full bg-emerald-500/15 p-0.5 text-emerald-600 dark:text-emerald-400"
              />
              <span className="min-w-0">{body}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4 rounded-2xl border border-line bg-elev p-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-2">
          <ISparkleFill size={15} />
        </span>
        <p className="pt-1.5 text-[13.5px] leading-relaxed text-ink-2">
          That is the whole setup — no config file, no plugin, no provider tree
          beyond those two. Toggle{" "}
          <code className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11.5px]">
            .dark
          </code>{" "}
          on{" "}
          <code className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11.5px]">
            &lt;html&gt;
          </code>{" "}
          and the entire system re-themes.
        </p>
      </div>
    </Section>
  );
}
