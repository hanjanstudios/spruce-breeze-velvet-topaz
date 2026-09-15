import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/site-shell";
import { AGENT, DRE_LOOKUP } from "@/lib/brand";

export const Route = createFileRoute("/disclosures")({
  component: DisclosuresPage,
});

function DisclosuresPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-4xl">Disclosures</h1>
        <p className="mt-4 text-ink-soft">
          This page is part of the first-point-of-contact material for{" "}
          {AGENT.name}.
        </p>

        <h2 className="mt-10 font-display text-2xl">License identification</h2>
        <p className="mt-3 text-ink-soft">
          {AGENT.name}, {AGENT.designation}, California DRE {AGENT.dreNumber} (
          {AGENT.licenseType}). Responsible broker:{" "}
          {AGENT.brokerage.licensedName}, DRE {AGENT.brokerage.dreNumber}.
          Confirm status on the{" "}
          <a
            className="underline underline-offset-2"
            href={DRE_LOOKUP}
            target="_blank"
            rel="noreferrer"
          >
            DRE public license lookup
          </a>
          . Required by Bus. & Prof. Code §10140.6 and 10 CCR §2773. License
          numbers on this site are set no smaller than surrounding body text.
        </p>

        <h2 className="mt-10 font-display text-2xl">AI concierge</h2>
        <p className="mt-3 text-ink-soft">
          The Home Concierge is an artificial-intelligence assistant. It is not
          a licensed real estate professional. Under California DRE guidance,
          using AI to perform licensed activity is treated like using an
          unlicensed assistant. The concierge may schedule appointments, collect
          contact details, and share general process information. It may not
          negotiate, give opinions of value, discuss terms of a specific
          property as advice, or represent you. {AGENT.name} supervises this
          tool and is responsible for the advertising on this site.
        </p>

        <h2 className="mt-10 font-display text-2xl">Agency</h2>
        <p className="mt-3 text-ink-soft">
          Using this website, chatting, or requesting an appointment does not
          create an agency relationship. California requires a statutory agency
          disclosure before a listing is taken or an offer is presented. That
          conversation happens with Hannah, not with the assistant.
        </p>

        <h2 className="mt-10 font-display text-2xl">Advertising standards</h2>
        <p className="mt-3 text-ink-soft">
          Nothing here is a guarantee of sale, price, or timing. No property
          images on this site are digitally altered listings. If a future
          listing image is altered, it will be disclosed as required by Bus.
          & Prof. Code §10140.8.
        </p>

        <h2 className="mt-10 font-display text-2xl">Fair housing</h2>
        <p className="mt-3 text-ink-soft">
          We do business in accordance with the Fair Housing Act and California
          fair housing law, including the Unruh Civil Rights Act. We do not
          discriminate based on race, color, religion, sex, gender, gender
          identity, gender expression, sexual orientation, marital status,
          national origin, ancestry, familial status, source of income,
          disability, veteran or military status, immigration status, primary
          language, citizenship, genetic information, or any other protected
          characteristic.
        </p>

        <h2 className="mt-10 font-display text-2xl">REALTOR®</h2>
        <p className="mt-3 text-ink-soft">
          REALTOR® is a registered collective membership mark that may be used
          only by members of the National Association of REALTORS®. Use on this
          site refers to {AGENT.name} in that capacity.
        </p>
      </article>
    </SiteShell>
  );
}
