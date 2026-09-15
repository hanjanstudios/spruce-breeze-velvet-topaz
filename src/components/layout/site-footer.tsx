import { Link } from "@tanstack/react-router";
import { AGENT, DRE_LOOKUP, LICENSE_LINE } from "@/lib/brand";
import { EqualHousingMark } from "@/components/legal/equal-housing";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-navy text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="font-display text-2xl font-medium">{AGENT.name}</p>
          <p className="mt-2 max-w-md text-sm text-paper/80">
            {AGENT.designation} · DRE {AGENT.dreNumber}
            <br />
            {AGENT.brokerage.licensedName} · DRE {AGENT.brokerage.dreNumber}
          </p>
          <p className="mt-4 max-w-lg text-sm text-paper/75">
            First-point-of-contact advertising on this site identifies the
            licensee and responsible broker as required by California Business
            and Professions Code §10140.6 and 10 CCR §2773. Verify a license at
            the{" "}
            <a
              className="underline decoration-paper/40 underline-offset-2"
              href={DRE_LOOKUP}
              target="_blank"
              rel="noreferrer"
            >
              California DRE public lookup
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <EqualHousingMark />
            <p className="text-sm text-paper/80">
              Equal Housing Opportunity. We do business in accordance with
              federal, state, and local fair housing laws.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link to="/book" className="underline-offset-2 hover:underline">
              Book
            </Link>
            <Link
              to="/disclosures"
              className="underline-offset-2 hover:underline"
            >
              Disclosures
            </Link>
            <Link to="/privacy" className="underline-offset-2 hover:underline">
              Privacy
            </Link>
            <Link
              to="/workspace"
              className="underline-offset-2 hover:underline"
            >
              Agent workspace
            </Link>
          </nav>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-paper/70 sm:px-6">
          {LICENSE_LINE}. The concierge on this site is an AI assistant, not a
          licensed real estate professional, and cannot perform licensed
          activity. Chatting or booking does not create an agency relationship.
        </p>
      </div>
    </footer>
  );
}
