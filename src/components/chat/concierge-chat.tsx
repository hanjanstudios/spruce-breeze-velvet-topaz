import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUp, Info } from "lucide-react";
import { toast } from "sonner";
import { AppointmentForm } from "@/components/booking/appointment-form";
import { Button } from "@/components/ui/button";
import { AGENT } from "@/lib/brand";
import { conciergeGreeting, sendConciergeMessage } from "@/lib/server/chat";
import { startConversation } from "@/lib/server/leads";
import { cn } from "@/lib/utils";

type Bubble = { id: string; role: "user" | "assistant"; content: string };

const STARTERS = [
  "I want to sell my home",
  "We’re looking to buy",
  "I have a few questions first",
];

export function ConciergeChat({
  variant = "panel",
}: {
  variant?: "panel" | "page";
}) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Bubble[]>([]);
  const [draft, setDraft] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const convo = await startConversation();
      const greet = await conciergeGreeting();
      if (cancelled) return;
      setConversationId(convo.conversationId);
      setMessages([{ id: "greet", role: "assistant", content: greet.text }]);
    })().catch(() => {
      toast.error("Could not start the concierge. Please refresh.");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, showBooking]);

  const send = useMutation({
    mutationFn: async (message: string) => {
      if (!conversationId) throw new Error("Still connecting…");
      return sendConciergeMessage({ data: { conversationId, message } });
    },
    onSuccess: (res, message) => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", content: message },
        { id: crypto.randomUUID(), role: "assistant", content: res.reply },
      ]);
      if (res.leadId) setLeadId(res.leadId);
      if (res.proposeAppointment) setShowBooking(true);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Message failed.");
    },
  });

  function submit(text?: string) {
    const message = (text ?? draft).trim();
    if (!message || send.isPending) return;
    setDraft("");
    send.mutate(message);
  }

  return (
    <section
      id="concierge"
      className={cn(
        "flex min-h-96 flex-col overflow-hidden border border-line bg-paper shadow-soft",
        variant === "panel" ? "rounded-xl" : "rounded-lg",
      )}
    >
      <div className="border-b border-line bg-navy px-5 py-4 text-paper">
        <p className="text-xs font-medium uppercase tracking-widest text-paper/70">
          Home concierge
        </p>
        <p className="font-display text-xl">Talk, then book a time</p>
        <p className="mt-1 text-sm text-paper/75">
          AI assistant for {AGENT.name} · DRE {AGENT.dreNumber}. Not a licensed
          agent.
        </p>
      </div>

      <div
        ref={scroller}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "w-fit max-w-prose rounded-md px-3.5 py-2.5 text-sm leading-relaxed",
              m.role === "assistant"
                ? "bg-paper-deep text-ink"
                : "ml-auto bg-navy text-paper",
            )}
          >
            {m.content}
          </div>
        ))}
        {send.isPending && (
          <div className="w-fit rounded-md bg-paper-deep px-3.5 py-2.5 text-sm text-muted">
            Hannah’s assistant is writing…
          </div>
        )}
        {messages.length === 1 && !send.isPending && (
          <div className="flex flex-wrap gap-2 pt-1">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => submit(s)}
                className="h-10 rounded-sm border border-line bg-paper px-3 text-sm text-ink hover:border-navy/40"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {showBooking && conversationId && (
          <div className="rounded-lg border border-line bg-paper p-4">
            <p className="mb-3 font-medium text-ink">Pick a time with Hannah</p>
            <AppointmentForm
              compact
              conversationId={conversationId}
              leadId={leadId}
            />
          </div>
        )}
      </div>

      <form
        className="border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="concierge-input">
            Message
          </label>
          <textarea
            id="concierge-input"
            rows={2}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="Ask about buying, selling, or booking a consult…"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-md border border-line bg-paper px-3 py-2.5 text-base outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/15"
          />
          <Button
            type="submit"
            size="sm"
            className="size-11 shrink-0 px-0"
            disabled={send.isPending || !draft.trim()}
            aria-label="Send"
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <Info className="size-3.5" />
          AI answers are informational. Licensed advice happens with Hannah.
          <Link
            to="/book"
            className="ml-auto text-navy underline-offset-2 hover:underline"
          >
            Skip to booking
          </Link>
        </p>
      </form>
    </section>
  );
}
