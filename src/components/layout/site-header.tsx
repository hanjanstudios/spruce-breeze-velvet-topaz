import { Link } from "@tanstack/react-router";
import { AGENT, LICENSE_SHORT } from "@/lib/brand";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="min-w-0">
          <p className="font-display text-lg font-medium tracking-tight text-ink sm:text-xl">
            {AGENT.name}
          </p>
          <p className="truncate text-xs text-muted sm:text-sm">{LICENSE_SHORT}</p>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            hash="concierge"
            className="hidden h-11 items-center px-3 text-sm text-ink-soft hover:text-ink sm:inline-flex"
          >
            Ask
          </Link>
          <Button asChild size="sm">
            <Link to="/book">Book a time</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
