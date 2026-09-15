import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, MessageCircle, Shield } from "lucide-react";
import { ConciergeChat } from "@/components/chat/concierge-chat";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { AGENT, LICENSE_LINE } from "@/lib/brand";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteShell>
      <section className="relative isolate overflow-hidden bg-navy-deep text-paper">
        <img
          src="/images/hero-home.jpg"
          alt="A Southern California home at golden hour"
          className="absolute inset-0 size-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-navy-deep/75" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-widest text-paper/75">
              {AGENT.designation} · DRE {AGENT.dreNumber}
            </p>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-medium sm:text-5xl lg:text-6xl">
              Ask first.
              <br />
              Then sit down with Hannah.
            </h1>
            <p className="mt-5 max-w-lg text-base text-paper/85 sm:text-lg">
              For homeowners and buyers in {AGENT.serviceArea}. The concierge
              can take questions and book a consultation. Licensed advice comes
              from {AGENT.name} — {AGENT.brokerage.licensedName}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="paper" size="lg">
                <a href="#concierge">Open the concierge</a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-paper/40 text-paper hover:bg-paper/10"
              >
                <Link to="/book">Book a time</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-paper/70">{LICENSE_LINE}</p>
          </div>
          <div className="lg:pt-4">
            <ConciergeChat />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-3">
        {[
          {
            icon: MessageCircle,
            title: "Ask without pressure",
            body: "The concierge is an AI assistant. It can collect details and set a meeting. It cannot value a home, negotiate, or represent you.",
          },
          {
            icon: Calendar,
            title: "Book real time",
            body: "Choose a video, phone, or in-person consult. Hannah reviews every request and follows up personally.",
          },
          {
            icon: Shield,
            title: "Licensed, disclosed",
            body: "Name, DRE number, and responsible broker appear on every page, as California first-point-of-contact rules require.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-line bg-paper p-6 shadow-soft"
          >
            <item.icon className="size-5 text-sage" />
            <h2 className="mt-4 font-display text-2xl">{item.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="bg-paper-deep">
        <div className="mx-auto grid max-w-6xl gap-0 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <article className="overflow-hidden rounded-t-xl border border-line bg-paper lg:rounded-l-xl lg:rounded-tr-none">
            <img
              src="/images/neighborhood.jpg"
              alt="A tree-lined Southern California residential street"
              className="h-56 w-full object-cover"
            />
            <div className="p-7">
              <p className="text-xs font-medium uppercase tracking-widest text-muted">
                For buyers
              </p>
              <h2 className="mt-2 font-display text-3xl">
                Find the next place with a local advocate
              </h2>
              <p className="mt-3 text-ink-soft">
                Tell the concierge where you’re looking and your timeline.
                Hannah will meet you to talk neighborhoods, process, and
                representation — never through an automated price or a promise
                she can’t keep.
              </p>
            </div>
          </article>
          <article className="overflow-hidden rounded-b-xl border border-t-0 border-line bg-paper lg:rounded-r-xl lg:rounded-bl-none lg:border-l-0 lg:border-t">
            <img
              src="/images/living-room.jpg"
              alt="A sunlit living room in a California home"
              className="h-56 w-full object-cover"
            />
            <div className="p-7">
              <p className="text-xs font-medium uppercase tracking-widest text-muted">
                For homeowners
              </p>
              <h2 className="mt-2 font-display text-3xl">
                A conversation before a listing
              </h2>
              <p className="mt-3 text-ink-soft">
                If you’re considering a sale, book a consult. California agency
                disclosure comes before any listing agreement. This site does
                not take a listing or create agency by itself.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            How it works
          </p>
          <h2 className="mt-2 font-display text-4xl">Three quiet steps</h2>
          <ol className="mt-6 space-y-5">
            {[
              "Share what you’re exploring — buying, selling, or both.",
              "Leave a way to reach you, only if you want Hannah to follow up.",
              "Pick a time. Hannah confirms and takes it from there.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-navy font-display text-paper">
                  {i + 1}
                </span>
                <p className="pt-1.5 text-ink-soft">{step}</p>
              </li>
            ))}
          </ol>
          <Button asChild className="mt-8" size="lg">
            <Link to="/book">
              Skip ahead to booking
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <img
          src="/images/kitchen.jpg"
          alt="A bright California kitchen"
          className="h-80 w-full rounded-xl object-cover shadow-soft sm:h-96"
        />
      </section>
    </SiteShell>
  );
}
