import { useState, type FormEvent, type ReactNode } from "react";
import {
  cx,
  Button,
  Field,
  Label,
  Separator,
  Spinner,
  Checkbox,
  IArrowRight,
} from "uicean";

/* ------------------------------------------------------------------ */
/* AuthCard                                                            */
/*                                                                     */
/* The sign-in screen every product needs on day one, and the one page  */
/* where getting the markup wrong costs real users: a form that does    */
/* not submit on Enter, inputs a password manager cannot recognise, an  */
/* error nobody hears.                                                  */
/*                                                                     */
/* So it is a real <form> with a real submit button, the autocomplete   */
/* tokens a password manager looks for, and the error in a live region. */
/* Everything visual is UICean's — hairline card, flat surface, the one */
/* accent — and everything structural is what the browser already knows */
/* how to do.                                                           */
/*                                                                     */
/* Nothing here authenticates anything. `onSubmit` hands you the values */
/* and the block gets out of the way.                                    */
/* ------------------------------------------------------------------ */

export type AuthValues = { email: string; password: string; remember: boolean };

export type AuthCardProps = {
  mode?: "signin" | "signup";
  title?: ReactNode;
  /**
   * Standalone this block is the page, so its title is the page heading and
   * h1 is right. Embedded in a document that already has one — a docs demo,
   * a modal — pass a lower level, because a page may only have one h1.
   */
  titleAs?: "h1" | "h2" | "h3";
  subtitle?: ReactNode;
  /** the marque above the title */
  brand?: ReactNode;
  /** social buttons, drawn above the divider */
  providers?: Array<{ id: string; label: string; icon?: ReactNode }>;
  onProvider?: (id: string) => void;
  /**
   * Return a rejected promise, or throw, to show an error. Resolving is
   * taken as success and the block stops spinning.
   */
  onSubmit?: (values: AuthValues) => void | Promise<void>;
  /** the "no account yet" line under the card */
  footer?: ReactNode;
  forgotHref?: string;
  className?: string;
};

export function AuthCard({
  mode = "signin",
  title,
  titleAs: TitleTag = "h1",
  subtitle,
  brand,
  providers = [
    { id: "google", label: "Continue with Google" },
    { id: "github", label: "Continue with GitHub" },
  ],
  onProvider,
  onSubmit,
  footer,
  forgotHref = "#",
  className,
}: AuthCardProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* Checkbox is a UICean control rather than a bare input, so it carries no
     name for FormData to find — its value comes from state instead */
  const [remember, setRemember] = useState(true);
  const signup = mode === "signup";

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setError(null);
    setBusy(true);
    try {
      await onSubmit?.({
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
        remember,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={cx("w-full max-w-95", className)}>
      {brand && <div className="mb-7 flex justify-center">{brand}</div>}

      <div className="rounded-[calc(var(--radius)+8px)] border border-line bg-surface p-7">
        <TitleTag className="text-[22px] font-bold tracking-[-0.02em] text-ink">
          {title ?? (signup ? "Create your account" : "Sign in to UICean")}
        </TitleTag>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
          {subtitle ??
            (signup
              ? "Free while it is in beta. No card, no call."
              : "Welcome back. Pick up where you left off.")}
        </p>

        {providers.length > 0 && (
          <>
            <div className="mt-6 flex flex-col gap-2.5">
              {providers.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onProvider?.(p.id)}
                  className="inline-flex h-10.5 w-full items-center justify-center gap-2.5 rounded-[var(--radius)] border border-line-strong bg-surface text-[13.5px] font-medium text-ink transition-colors hover:bg-elev focus-visible:ring-2 focus-visible:ring-brand/45 focus-visible:outline-none"
                >
                  {p.icon}
                  {p.label}
                </button>
              ))}
            </div>
            <Separator label="or" className="my-6" />
          </>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <Field label="Email" required>
            {(p) => (
              <input
                {...p}
                name="email"
                type="email"
                /* the token a password manager looks for. Without it the
                   field is a text box and the browser has nothing to fill. */
                autoComplete="email"
                placeholder="you@company.com"
                className="h-10.5 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand focus:ring-[3px] focus:ring-brand/15"
              />
            )}
          </Field>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <Label htmlFor="uicean-auth-password" required>
                Password
              </Label>
              {!signup && (
                <a
                  href={forgotHref}
                  className="text-[12.5px] font-medium text-ink-3 transition-colors hover:text-ink"
                >
                  Forgot?
                </a>
              )}
            </div>
            <input
              id="uicean-auth-password"
              name="password"
              type="password"
              required
              /* new-password on sign-up, so a manager offers to generate one
                 instead of filling the old one in */
              autoComplete={signup ? "new-password" : "current-password"}
              placeholder={signup ? "At least 12 characters" : "••••••••••••"}
              className="h-10.5 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-brand focus:ring-[3px] focus:ring-brand/15"
            />
          </div>

          {!signup && (
            /* Checkbox's `label` is the accessible name, not visible text —
               it renders a control with no words of its own. The words go
               beside it, and clicking them has to toggle it too. */
            <span className="flex items-center gap-2.5">
              <Checkbox checked={remember} onChange={setRemember} label="Keep me signed in" />
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                tabIndex={-1}
                className="text-[13px] text-ink-2 transition-colors hover:text-ink"
              >
                Keep me signed in
              </button>
            </span>
          )}

          {error && (
            /* role="alert" so a failed sign-in is spoken. A red line under a
               form that a screen reader never mentions is a dead end. */
            <p
              role="alert"
              className="rounded-[var(--radius)] border border-red-500/30 bg-red-500/8 px-3 py-2 text-[12.5px] leading-relaxed text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}

          {/* a real submit button: Enter in either field posts the form,
              which is the behaviour every person expects and every
              div-with-onClick version of this screen breaks */}
          <Button
            type="submit"
            variant="green"
            className="mt-1 w-full"
            disabled={busy}
            iconRight={busy ? undefined : <IArrowRight size={15} />}
          >
            {busy ? <Spinner size={14} label={null} /> : null}
            {busy ? "One moment…" : signup ? "Create account" : "Sign in"}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-[13px] text-ink-2">
        {footer ??
          (signup ? (
            <>
              Already have an account?{" "}
              <a href="#" className="font-medium text-ink underline underline-offset-3">
                Sign in
              </a>
            </>
          ) : (
            <>
              New here?{" "}
              <a href="#" className="font-medium text-ink underline underline-offset-3">
                Create an account
              </a>
            </>
          ))}
      </p>
    </div>
  );
}
