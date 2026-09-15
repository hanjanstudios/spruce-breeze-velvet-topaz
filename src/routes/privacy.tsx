import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { AGENT } from "@/lib/brand";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl">Privacy</h1>
        <p className="mt-4 text-ink-soft">
          {AGENT.name} (“Hannah”) collects personal information through this
          site so she can respond to inquiries and schedule consultations. This
          notice is for California visitors under the CCPA/CPRA.
        </p>
        <h2 className="mt-10 font-display text-2xl">What we collect</h2>
        <p className="mt-3 text-ink-soft">
          Identifiers (name, email, phone), commercial information (whether you
          are buying or selling, timeline, city, notes you type), and records of
          your concierge conversation. We do not collect Social Security
          numbers, precise geolocation, or biometric data.
        </p>
        <h2 className="mt-10 font-display text-2xl">Why</h2>
        <p className="mt-3 text-ink-soft">
          To contact you about the inquiry you submitted, book a meeting, and
          provide real estate services if you choose to work together. We do not
          sell or share personal information as those terms are defined in the
          CPRA, and we do not use it for cross-context behavioral advertising.
        </p>
        <h2 className="mt-10 font-display text-2xl">Retention</h2>
        <p className="mt-3 text-ink-soft">
          Inquiry records are kept as long as needed to follow up and to meet
          brokerage record-keeping duties, then deleted or archived according
          to {AGENT.brokerage.licensedName} policy.
        </p>
        <h2 className="mt-10 font-display text-2xl">Your rights</h2>
        <p className="mt-3 text-ink-soft">
          California residents may request access, correction, or deletion, and
          may not be discriminated against for exercising those rights. Use the
          concierge or booking form to reach Hannah, or the agent workspace
          contact path she publishes. If we cannot verify you, we may ask for
          more information before fulfilling a request.
        </p>
        <h2 className="mt-10 font-display text-2xl">Texts and calls</h2>
        <p className="mt-3 text-ink-soft">
          Phone and SMS contact happen only if you consent on the form. Message
          frequency varies. Message and data rates may apply. Reply STOP to opt
          out of texts.
        </p>
        <p className="mt-10 text-sm text-muted">
          {AGENT.name} · DRE {AGENT.dreNumber} · {AGENT.brokerage.licensedName}{" "}
          · DRE {AGENT.brokerage.dreNumber}
        </p>
      </article>
    </SiteShell>
  );
}
