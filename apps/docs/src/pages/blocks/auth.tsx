import { Section, Demo } from "@/components/Section";
import { Card } from "uicean";
import { AuthCard, AuthSplit, RegisterCard, VerifyCard } from "uicean-blocks";

const BLEED = "!block !min-h-0 !p-0";

/* the split block is a full screen by design, so the demo frames it */
function SplitFrame() {
  return (
    <div className="h-[560px] w-full overflow-hidden rounded-[15px] border border-line">
      <div className="h-full w-full origin-top-left scale-[0.72]" style={{ width: "138.9%", height: "138.9%" }}>
        <AuthSplit
          titleAs="h2"
          marks={
            <>
              <span className="font-mono text-[12px] tracking-wide">NORTHWIND</span>
              <span className="font-mono text-[12px] tracking-wide">GLOBEX</span>
              <span className="font-mono text-[12px] tracking-wide">INITECH</span>
            </>
          }
        />
      </div>
    </div>
  );
}

async function fakeRegister({ email }: { email: string }) {
  await new Promise((r) => setTimeout(r, 900));
  if (email.endsWith("@example.com")) throw new Error("That domain is not allowed.");
  throw new Error("An account with that address already exists.");
}

async function fakeVerify(code: string) {
  await new Promise((r) => setTimeout(r, 700));
  if (code !== "000000") throw new Error("That code did not work. Check the email again.");
}

async function fakeSignIn({ email }: { email: string }) {
  await new Promise((r) => setTimeout(r, 900));
  if (!email.includes("@")) throw new Error("That does not look like an email address.");
  throw new Error("No account found for that address.");
}

export default function BlocksAuthPage() {
  return (
    <>
      <Section
        id="auth-card"
        eyebrow="Blocks"
        title="AuthCard"
        desc="The sign-in screen every product needs on day one — a real form, with the autocomplete tokens a password manager looks for and an error a screen reader hears."
        registry="auth-card"
        pkg="blocks"
        source="auth/AuthCard.tsx"
      >
        <Demo
          label="AuthCard — submit it to see the error state"
          imports={["AuthCard"]}
          code={`<AuthCard
  onSubmit={async ({ email, password, remember }) => {
    await signIn(email, password, remember);   // throw to show an error
  }}
  providers={[{ id: "google", label: "Continue with Google" }]}
/>`}
        >
          <div className="flex w-full justify-center py-6">
            <AuthCard titleAs="h2" onSubmit={fakeSignIn} />
          </div>
        </Demo>

        <Demo
          label="AuthCard — sign-up mode"
          imports={["AuthCard"]}
          code={`<AuthCard mode="signup" titleAs="h2" providers={[]} />`}
        >
          <div className="flex w-full justify-center py-6">
            <AuthCard mode="signup" titleAs="h2" providers={[]} />
          </div>
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">It is a form, not a div with a click handler.</span>{" "}
            Enter in either field submits, because that is what a{" "}
            <code className="font-mono">&lt;form&gt;</code> and a{" "}
            <code className="font-mono">type=&quot;submit&quot;</code> button do
            for free — and it is the single most commonly broken thing on a
            sign-in screen.
          </p>
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">
              <code className="font-mono">autocomplete</code> is not decoration.
            </span>{" "}
            <code className="font-mono">email</code> and{" "}
            <code className="font-mono">current-password</code> are the tokens a
            password manager matches on; without them the fields are anonymous
            boxes and nothing offers to fill them.{" "}
            <code className="font-mono">mode=&quot;signup&quot;</code> switches to{" "}
            <code className="font-mono">new-password</code>, so a manager offers
            to generate one instead of pasting the old one back in.
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The error is announced.</span>{" "}
            It sits in <code className="font-mono">role=&quot;alert&quot;</code>,
            so a failed sign-in is spoken rather than left as a red line someone
            has to go looking for. Throw from{" "}
            <code className="font-mono">onSubmit</code> and the message is
            whatever your error says.
          </p>
        </Card>
      </Section>

      <Section
        id="auth-split"
        level={2}
        eyebrow="Blocks"
        title="AuthSplit"
        desc="The same form with the other half of the screen doing the selling. Below lg the panel is dropped rather than stacked — a testimonial above a password field is three scrolls of preamble."
        registry="auth-split"
        pkg="blocks"
        source="auth/AuthSplit.tsx"
      >
        <Demo
          label="AuthSplit — scaled to fit the frame"
          imports={["AuthSplit"]}
          contentClassName={BLEED}
          code={`<AuthSplit
  side="right"
  quote="We replaced four internal component libraries with this one."
  attribution="Deniz Aksoy · Head of Design, Northwind"
  onSubmit={signIn}
/>`}
        >
          <SplitFrame />
        </Demo>

        <Card className="p-5">
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The form comes first in the DOM</span>{" "}
            whichever side it is shown on — the panel is placed with{" "}
            <code className="font-mono">order</code> rather than by putting it
            first in the markup. Someone tabbing into the page lands on the
            email field, and the panel is{" "}
            <code className="font-mono">aria-hidden</code> because nothing in it
            is needed to sign in. The wash is a gradient built from{" "}
            <code className="font-mono">--brand-soft</code>, so it re-tints with
            the accent and ships no image.
          </p>
        </Card>
      </Section>

      <Section
        id="register-card"
        level={2}
        eyebrow="Blocks"
        title="RegisterCard"
        desc="Sign-up is not sign-in with a different heading: it asks for more, it can fail per field, and it is the only form most people will fill in badly enough to abandon."
        registry="register-card"
        pkg="blocks"
        source="auth/RegisterCard.tsx"
      >
        <Demo
          label="RegisterCard — type a password, then submit without accepting the terms"
          imports={["RegisterCard"]}
          code={`<RegisterCard onSubmit={async ({ name, email, password }) => {
  await createAccount(name, email, password);   // throw to show an error
}} />`}
        >
          <div className="flex w-full justify-center py-6">
            <RegisterCard titleAs="h2" onSubmit={fakeRegister} />
          </div>
        </Demo>

        <Card className="p-5">
          <p className="mb-3 text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The meter says why, not just how much.</span>{" "}
            A bar with no words tells someone their password is weak and nothing
            about what would fix it — and tells a screen-reader user nothing at
            all. The wording is in a{" "}
            <code className="font-mono">role=&quot;status&quot;</code>, and it
            leads with length, because length is the only thing that reliably
            matters.
          </p>
          <p className="text-[13.5px] leading-relaxed text-ink-2">
            <span className="font-semibold text-ink">The terms checkbox blocks the submit and says so.</span>{" "}
            The usual build disables the button, which is a dead end: nothing on
            screen explains what would enable it. This lets the submit happen and
            answers it.
          </p>
        </Card>
      </Section>

      <Section
        id="verify-card"
        level={2}
        eyebrow="Blocks"
        title="VerifyCard"
        desc="The screen after RegisterCard. One real input behind six boxes, so a pasted code and an SMS autofill both land, and a countdown instead of a greyed-out resend button."
        registry="register-card"
        pkg="blocks"
        source="auth/RegisterCard.tsx"
      >
        <Demo
          label="VerifyCard — paste “483920” to fail, “000000” to pass"
          imports={["VerifyCard"]}
          code={`<VerifyCard email="you@company.com" onVerify={async (code) => {
  await confirm(code);   // throw to reject the code
}} />`}
        >
          <div className="flex w-full justify-center py-6">
            <VerifyCard titleAs="h2" onVerify={fakeVerify} onResend={async () => {}} />
          </div>
        </Demo>
      </Section>
    </>
  );
}
