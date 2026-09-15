import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import {
  INTENTS,
  MEETING_TYPES,
  TIMELINES,
  AGENT,
} from "@/lib/brand";
import { listOpenSlots, requestAppointment } from "@/lib/server/leads";
import type { OpenSlot } from "@/lib/time";
import { cn } from "@/lib/utils";

type Props = {
  conversationId?: string;
  leadId?: string | null;
  compact?: boolean;
  onBooked?: () => void;
};

export function AppointmentForm({
  conversationId,
  leadId,
  compact,
  onBooked,
}: Props) {
  const slotsQuery = useQuery({
    queryKey: ["open-slots"],
    queryFn: () => listOpenSlots(),
  });
  const [startsAt, setStartsAt] = useState("");
  const [meetingType, setMeetingType] = useState("video");
  const [intent, setIntent] = useState("");
  const [timeline, setTimeline] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [consentContact, setConsentContact] = useState(false);
  const [consentSms, setConsentSms] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, OpenSlot[]>();
    for (const slot of slotsQuery.data ?? []) {
      const list = map.get(slot.dayLabel) ?? [];
      list.push(slot);
      map.set(slot.dayLabel, list);
    }
    return [...map.entries()];
  }, [slotsQuery.data]);

  const book = useMutation({
    mutationFn: () =>
      requestAppointment({
        data: {
          name,
          email,
          phone,
          startsAt,
          meetingType,
          intent: intent || undefined,
          timeline: timeline || undefined,
          location: location || undefined,
          notes: notes || undefined,
          consentContact,
          consentSms,
          conversationId,
          leadId: leadId ?? undefined,
        },
      }),
    onSuccess: (res) => {
      setDone(res.whenLabel);
      toast.success("Request sent to Hannah.");
      onBooked?.();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not book.");
    },
  });

  if (done) {
    return (
      <div className="rounded-lg border border-line bg-paper p-6">
        <p className="font-display text-2xl text-ink">You’re on the calendar</p>
        <p className="mt-2 text-ink-soft">
          {done} Pacific · {AGENT.appointmentMinutes} minutes. Hannah will
          confirm and follow up using the details you shared. This request does
          not create an agency relationship.
        </p>
        <p className="mt-4 text-sm text-muted">
          {AGENT.name} · DRE {AGENT.dreNumber} · {AGENT.brokerage.licensedName}
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        book.mutate();
      }}
    >
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink-soft">
          Available times (Pacific)
        </legend>
        {slotsQuery.isLoading ? (
          <p className="text-sm text-muted">Loading times…</p>
        ) : grouped.length === 0 ? (
          <p className="text-sm text-muted">
            No open times in the next two weeks. Leave a message through the
            concierge and Hannah will reach out.
          </p>
        ) : (
          <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {grouped.map(([day, slots]) => (
              <div key={day}>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
                  {day}
                </p>
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.startsAt}
                      type="button"
                      onClick={() => setStartsAt(slot.startsAt)}
                      className={cn(
                        "h-10 rounded-sm border px-3 text-sm",
                        startsAt === slot.startsAt
                          ? "border-navy bg-navy text-paper"
                          : "border-line bg-paper text-ink hover:border-navy/40",
                      )}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink-soft">
          How should you meet?
        </legend>
        <div className="flex flex-wrap gap-2">
          {MEETING_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setMeetingType(t.id)}
              className={cn(
                "h-10 rounded-sm border px-3 text-sm",
                meetingType === t.id
                  ? "border-navy bg-navy text-paper"
                  : "border-line bg-paper text-ink hover:border-navy/40",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      {!compact && (
        <>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink-soft">
              I am
            </legend>
            <div className="flex flex-wrap gap-2">
              {INTENTS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setIntent(t.id)}
                  className={cn(
                    "h-10 rounded-sm border px-3 text-sm",
                    intent === t.id
                      ? "border-sage bg-sage text-paper"
                      : "border-line bg-paper text-ink hover:border-sage/40",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink-soft">
              Timeline
            </legend>
            <div className="flex flex-wrap gap-2">
              {TIMELINES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTimeline(t.id)}
                  className={cn(
                    "h-10 rounded-sm border px-3 text-sm",
                    timeline === t.id
                      ? "border-sage bg-sage text-paper"
                      : "border-line bg-paper text-ink hover:border-sage/40",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="bk-name">Name</Label>
          <Input
            id="bk-name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bk-email">Email</Label>
          <Input
            id="bk-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bk-phone">Phone</Label>
          <Input
            id="bk-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bk-loc">City or area</Label>
          <Input
            id="bk-loc"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Irvine, Huntington Beach…"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bk-notes">Anything Hannah should know</Label>
        <Textarea
          id="bk-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-navy"
          checked={consentContact}
          onChange={(e) => setConsentContact(e.target.checked)}
          required
        />
        <span>
          Hannah may contact me by email or phone about this inquiry. I
          understand this does not create an agency relationship. TCPA: if I
          also check SMS below, I agree to receive texts; message/data rates
          may apply; I can opt out anytime.
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-navy"
          checked={consentSms}
          onChange={(e) => setConsentSms(e.target.checked)}
        />
        <span>It’s okay to text me at the number I provided.</span>
      </label>

      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={!startsAt || book.isPending}
      >
        {book.isPending ? "Sending…" : "Request this time"}
      </Button>
    </form>
  );
}
