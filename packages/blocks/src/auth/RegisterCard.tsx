import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  cx,
  Button,
  Field,
  Label,
  Separator,
  Spinner,
  Checkbox,
  InputOTP,
  ICheck,
  IArrowRight,
} from "uicean";

/* ------------------------------------------------------------------ */
/* RegisterCard                                                        */
/*                                                                     */
/* Sign-up is not sign-in with a different heading. It asks for more,   */
/* it can fail per field rather than once at the end, and it is the     */
/* only form most people will ever fill in badly enough to abandon.     */
/*                                                                     */
/* Three things it does that the sign-in card does not:                 */
/*                                                                     */
/*   - the password meter scores what was typed, live, and says why —  */
/*     a bar with no words tells someone their password is weak and    */
/*     nothing about what would fix it                                  */
/*   - the terms checkbox blocks submission, and says so in a live      */
/*     region rather than by silently disabling the button, because a   */
/*     disabled button with no explanation is a dead end                */
/*   - `autocomplete="new-password"`, so a manager offers to generate    */
/*     one instead of filling the old one back in                       */
/* ------------------------------------------------------------------ */

export type RegisterValues = {
  name: string;
  email: string;
  password: string;
  accepted: boolean;
};

/* Length first, because it is the only thing that reliably matters, then
   variety. Deliberately not a dictionary check — that belongs on a server
   that can afford the list, and a block that pretends to do it is worse
   than one that admits it does not. */
function score(pw: string) {
  if (!pw) return { level: 0, label: "", hint: "" };
  let n = 0;
  if (pw.length >= 8) n++;
  if (pw.length >= 12) n++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) n++;
  if (/\d/.test(pw)) n++;
  if (/[^\w\s]/.test(pw)) n++;

  if (pw.length < 8)
    return { level: 1, label: "Too short", hint: "Eight characters is the minimum; twelve is better." };
  if (n <= 2) return { level: 1, label: "Weak", hint: "Add length before anything else — it counts for more than symbols." };
  if (n === 3) return { level: 2, label: "Fair", hint: "Longer, or mix in a number or a symbol." };
  if (n === 4) return { level: 3, label: "Good", hint: "" };
  return { level: 4, label: "Strong", hint: "" };
}

const BARS = ["bg-red-500", "bg-amber-500", "bg-yellow-500", "bg-brand"];

export type RegisterCardProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  brand?: ReactNode;
  /** Standalone this block is the page; embedded, pass a lower level. */
  titleAs?: "h1" | "h2" | "h3";
  providers?: Array<{ id: string; label: string; icon?: ReactNode }>;
  onProvider?: (id: string) => void;
  /** Throw, or reject, to show an error under the form. */
  onSubmit?: (values: RegisterValues) => void | Promise<void>;
  termsHref?: string;
  privacyHref?: string;
  footer?: ReactNode;
  className?: string;
};

export function RegisterCard({
  title,
  subtitle,
  brand,
  titleAs: TitleTag = "h1",
  providers = [{ id: "google", label: "Continue with Google" }],
  onProvider,
  onSubmit,
  termsHref = "#",
  privacyHref = "#",
  footer,
  className,
}: RegisterCardProps) {
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [touchedTerms, setTouchedTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => score(password), [password]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!accepted) {
      /* not a disabled button: the reason is stated, and the reason is
         what someone needs in order to get past it */
      setTouchedTerms(true);
      return;
    }
    const data = new FormData(e.currentTarget);
    setError(null);
    setBusy(true);
    try {
      await onSubmit?.({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        password: String(data.get("password") ?? ""),
        accepted,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const input =
    "h-10.5 w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3.5 text-sm text-ink " +
    "outline-none transition-colors placeholder:text-ink-3 focus:border-brand focus:ring-[3px] focus:ring-brand/15";

  return (
    <div className={cx("w-full max-w-95", className)}>
      {brand && <div className="mb-7 flex justify-center">{brand}</div>}

      <div className="rounded-[calc(var(--radius)+8px)] border border-line bg-surface p-7">
        <TitleTag className="text-[22px] font-bold tracking-[-0.02em] text-ink">
          {title ?? "Create your account"}
        </TitleTag>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
          {subtitle ?? "Free while it is in beta. No card, no call."}
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
          <Field label="Full name" required>
            {(p) => (
              <input {...p} name="name" autoComplete="name" placeholder="Ada Lovelace" className={input} />
            )}
          </Field>

          <Field label="Work email" required>
            {(p) => (
              <input
                {...p}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className={input}
              />
            )}
          </Field>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="uicean-register-password" required>
              Password
            </Label>
            <input
              id="uicean-register-password"
              name="password"
              type="password"
              required
              /* new-password, not current-password: this is where a manager
                 should offer to invent one */
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-describedby="uicean-register-strength"
              placeholder="At least 12 characters"
              className={input}
            />

            <div id="uicean-register-strength">
              <span aria-hidden className="mt-1 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cx(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < strength.level ? BARS[strength.level - 1] : "bg-line",
                    )}
                  />
                ))}
              </span>
              {/* the words, not just the bar. A bar says "weak" and nothing
                  about what would fix it, and it says nothing at all to a
                  screen reader. */}
              <p role="status" className="mt-1.5 text-[12px] leading-relaxed text-ink-3">
                {strength.label && (
                  <span className="font-medium text-ink-2">{strength.label}. </span>
                )}
                {strength.hint}
              </p>
            </div>
          </div>

          <span className="flex items-start gap-2.5">
            <span className="pt-0.5">
              <Checkbox
                checked={accepted}
                onChange={(v) => {
                  setAccepted(v);
                  if (v) setTouchedTerms(false);
                }}
                label="Accept the terms and the privacy policy"
              />
            </span>
            <button
              type="button"
              onClick={() => setAccepted((v) => !v)}
              tabIndex={-1}
              className="text-left text-[12.5px] leading-relaxed text-ink-2"
            >
              I agree to the{" "}
              <a href={termsHref} className="font-medium text-ink underline underline-offset-2">
                terms
              </a>{" "}
              and the{" "}
              <a href={privacyHref} className="font-medium text-ink underline underline-offset-2">
                privacy policy
              </a>
              .
            </button>
          </span>

          {touchedTerms && !accepted && (
            <p role="alert" className="text-[12.5px] text-red-600 dark:text-red-400">
              Accept the terms to continue.
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-[var(--radius)] border border-red-500/30 bg-red-500/8 px-3 py-2 text-[12.5px] leading-relaxed text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="green"
            className="mt-1 w-full"
            disabled={busy}
            iconRight={busy ? undefined : <IArrowRight size={15} />}
          >
            {busy ? <Spinner size={14} label={null} /> : null}
            {busy ? "Creating your account…" : "Create account"}
          </Button>
        </form>
      </div>

      <p className="mt-5 text-center text-[13px] text-ink-2">
        {footer ?? (
          <>
            Already have an account?{" "}
            <a href="#" className="font-medium text-ink underline underline-offset-3">
              Sign in
            </a>
          </>
        )}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VerifyCard — the screen after RegisterCard                          */
/* ------------------------------------------------------------------ */

export function VerifyCard({
  email = "you@company.com",
  length = 6,
  titleAs: TitleTag = "h1",
  onVerify,
  onResend,
  className,
}: {
  email?: string;
  length?: number;
  titleAs?: "h1" | "h2" | "h3";
  /** Throw to show an error. Resolving is taken as verified. */
  onVerify?: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
  className?: string;
}) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const verify = async (value: string) => {
    setError(null);
    setBusy(true);
    try {
      await onVerify?.(value);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code did not work.");
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    await onResend?.();
    /* a countdown rather than a disabled button, because "wait" is the
       information and a greyed-out control does not carry it */
    setCooldown(30);
    const id = window.setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <div className={cx("w-full max-w-95 text-center", className)}>
      <div className="rounded-[calc(var(--radius)+8px)] border border-line bg-surface p-7">
        {done ? (
          <>
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <ICheck size={22} />
            </span>
            <TitleTag className="text-[20px] font-bold tracking-[-0.02em] text-ink">
              You are verified
            </TitleTag>
            <p className="mt-1.5 text-[13.5px] text-ink-2">Taking you to your workspace…</p>
          </>
        ) : (
          <>
            <TitleTag className="text-[20px] font-bold tracking-[-0.02em] text-ink">
              Check your email
            </TitleTag>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
              We sent a {length}-digit code to{" "}
              <span className="font-medium text-ink">{email}</span>.
            </p>

            <div className="mt-6 flex justify-center">
              <InputOTP
                length={length}
                value={code}
                onChange={setCode}
                onComplete={verify}
                disabled={busy}
              />
            </div>

            {busy && (
              <p role="status" className="mt-4 flex items-center justify-center gap-2 text-[12.5px] text-ink-3">
                <Spinner size={13} label={null} />
                Checking…
              </p>
            )}

            {error && (
              <p role="alert" className="mt-4 text-[12.5px] text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <p className="mt-6 text-[12.5px] text-ink-3">
              {cooldown > 0 ? (
                <span role="status">Send another in {cooldown}s</span>
              ) : (
                <>
                  Nothing arrived?{" "}
                  <button
                    type="button"
                    onClick={resend}
                    className="font-medium text-ink underline underline-offset-3"
                  >
                    Send another
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
