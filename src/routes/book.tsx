import { createFileRoute } from "@tanstack/react-router";
import { AppointmentForm } from "@/components/booking/appointment-form";
import { SiteShell } from "@/components/layout/site-shell";
import { AGENT, LICENSE_LINE } from "@/lib/brand";

export const Route = createFileRoute("/book")({ component: BookPage });

function BookPage() {
  return (
    <SiteShell>
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Consultation
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">
            Sit down with Hannah
          </h1>
          <p className="mt-4 text-ink-soft">
            {AGENT.appointmentMinutes}-minute intro — video, phone, or in
            person. {AGENT.name}, {AGENT.designation}, DRE {AGENT.dreNumber},{" "}
            {AGENT.brokerage.licensedName}.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-soft">
            <li>No listing is taken on this page.</li>
            <li>No agency relationship is created until you and Hannah agree in writing.</li>
            <li>Times are Pacific. Hannah confirms every request.</li>
          </ul>
          <p className="mt-8 text-sm text-muted">{LICENSE_LINE}</p>
        </div>
        <div className="rounded-xl border border-line bg-paper p-5 shadow-soft sm:p-7">
          <AppointmentForm />
        </div>
      </main>
    </SiteShell>
  );
}
