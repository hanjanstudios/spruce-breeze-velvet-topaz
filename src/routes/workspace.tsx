import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { AGENT, STAGES, type StageId } from "@/lib/brand";
import {
  listLeadMessages,
  listWorkspace,
  unlockWorkspace,
  updateAppointmentStatus,
  updateLeadStage,
  type AppointmentRow,
  type LeadRow,
} from "@/lib/server/leads";
import { formatPacific } from "@/lib/time";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workspace")({
  component: WorkspacePage,
});

const KEY_STORAGE = "hj-workspace-key";

function WorkspacePage() {
  const [key, setKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(KEY_STORAGE) ?? "";
    if (stored) {
      setKey(stored);
      setUnlocked(true);
    }
    setReady(true);
  }, []);

  const unlock = useMutation({
    mutationFn: () => unlockWorkspace({ data: { key: draft } }),
    onSuccess: () => {
      sessionStorage.setItem(KEY_STORAGE, draft);
      setKey(draft);
      setUnlocked(true);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Could not unlock.");
    },
  });

  if (!ready) {
    return <main className="min-h-dvh bg-paper" />;
  }

  if (!unlocked) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Private
        </p>
        <h1 className="mt-2 font-display text-4xl">Agent workspace</h1>
        <p className="mt-3 text-sm text-ink-soft">
          For {AGENT.name} only. This is where new conversations, contact
          details, and appointment requests land.
        </p>
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            unlock.mutate();
          }}
        >
          <Label htmlFor="ws-key">Workspace key</Label>
          <Input
            id="ws-key"
            type="password"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoComplete="current-password"
          />
          <Button type="submit" disabled={unlock.isPending}>
            {unlock.isPending ? "Checking…" : "Open pipeline"}
          </Button>
        </form>
      </main>
    );
  }

  return (
    <Pipeline
      keyValue={key}
      onLock={() => {
        sessionStorage.removeItem(KEY_STORAGE);
        setKey("");
        setUnlocked(false);
      }}
    />
  );
}

function Pipeline({
  keyValue,
  onLock,
}: {
  keyValue: string;
  onLock: () => void;
}) {
  const qc = useQueryClient();
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const data = useQuery({
    queryKey: ["workspace", keyValue],
    queryFn: () => listWorkspace({ data: { key: keyValue } }),
  });

  const leads = data.data?.leads ?? [];
  const appointments = data.data?.appointments ?? [];
  const selectedLead = leads.find((l) => l.id === selected) ?? leads[0];

  const visible = useMemo(
    () =>
      stageFilter === "all"
        ? leads
        : leads.filter((l) => l.stage === stageFilter),
    [leads, stageFilter],
  );

  const hot = leads.filter((l) => l.score >= 60 && l.stage !== "archived");
  const upcoming = appointments.filter(
    (a) =>
      a.status !== "cancelled" &&
      a.status !== "completed" &&
      new Date(a.starts_at).getTime() >= Date.now() - 60 * 60 * 1000,
  );

  return (
    <div className="min-h-dvh bg-paper">
      <header className="border-b border-line bg-navy text-paper">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="font-display text-2xl">Lead pipeline</p>
            <p className="text-sm text-paper/70">
              {AGENT.name} · DRE {AGENT.dreNumber}
            </p>
          </div>
          <Button variant="paper" size="sm" onClick={onLock}>
            Lock
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-4">
        <Stat label="New conversations" value={leads.length} />
        <Stat label="Need outreach" value={hot.length} />
        <Stat label="Upcoming meetings" value={upcoming.length} />
        <Stat
          label="With phone or email"
          value={leads.filter((l) => l.email || l.phone).length}
        />
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_1.15fr]">
        <section className="rounded-lg border border-line bg-paper">
          <div className="flex flex-wrap gap-2 border-b border-line p-3">
            <FilterChip
              active={stageFilter === "all"}
              onClick={() => setStageFilter("all")}
            >
              All
            </FilterChip>
            {STAGES.map((s) => (
              <FilterChip
                key={s.id}
                active={stageFilter === s.id}
                onClick={() => setStageFilter(s.id)}
              >
                {s.label}
              </FilterChip>
            ))}
          </div>
          <ul className="divide-y divide-line">
            {data.isLoading && (
              <li className="p-5 text-sm text-muted">Loading pipeline…</li>
            )}
            {!data.isLoading && visible.length === 0 && (
              <li className="p-5 text-sm text-muted">
                No leads in this view yet. When someone uses the concierge or
                booking page, they appear here.
              </li>
            )}
            {visible.map((lead) => (
              <li key={lead.id}>
                <button
                  type="button"
                  onClick={() => setSelected(lead.id)}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-paper-deep",
                    selectedLead?.id === lead.id && "bg-paper-deep",
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {lead.name || "Visitor"}
                    </p>
                    <p className="truncate text-sm text-muted">
                      {intentLabel(lead.intent)}
                      {lead.location ? ` · ${lead.location}` : ""}
                      {lead.timeline ? ` · ${timelineLabel(lead.timeline)}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge tone={scoreTone(lead.score)}>{lead.score}</Badge>
                    <span className="text-xs text-muted">
                      {stageLabel(lead.stage)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {selectedLead ? (
          <LeadDetail
            key={selectedLead.id}
            lead={selectedLead}
            appointments={appointments.filter(
              (a) => a.lead_id === selectedLead.id,
            )}
            workspaceKey={keyValue}
            onChanged={() => qc.invalidateQueries({ queryKey: ["workspace"] })}
          />
        ) : (
          <section className="rounded-lg border border-line p-8 text-sm text-muted">
            Select a lead to see contact details, chat, and next steps.
          </section>
        )}
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="font-display text-2xl">Appointments</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-3xl text-left text-sm">
            <thead className="bg-paper-deep text-ink-soft">
              <tr>
                <th className="px-3 py-2 font-medium">When</th>
                <th className="px-3 py-2 font-medium">Who</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-muted" colSpan={5}>
                    No appointment requests yet.
                  </td>
                </tr>
              )}
              {appointments.map((a) => (
                <AppointmentRowView
                  key={a.id}
                  appointment={a}
                  workspaceKey={keyValue}
                  onChanged={() =>
                    qc.invalidateQueries({ queryKey: ["workspace"] })
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function LeadDetail({
  lead,
  appointments,
  workspaceKey,
  onChanged,
}: {
  lead: LeadRow;
  appointments: AppointmentRow[];
  workspaceKey: string;
  onChanged: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [stage, setStage] = useState<StageId>(
    (STAGES.some((s) => s.id === lead.stage) ? lead.stage : "new") as StageId,
  );

  const save = useMutation({
    mutationFn: () =>
      updateLeadStage({
        data: { key: workspaceKey, leadId: lead.id, stage, notes },
      }),
    onSuccess: () => {
      toast.success("Lead updated.");
      onChanged();
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Update failed."),
  });

  const thread = useQuery({
    queryKey: ["thread", lead.conversation_id],
    enabled: Boolean(lead.conversation_id),
    queryFn: () =>
      listLeadMessages({
        data: { key: workspaceKey, conversationId: lead.conversation_id as string },
      }),
  });

  return (
    <section className="rounded-lg border border-line bg-paper p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl">{lead.name || "Visitor"}</h2>
          <p className="text-sm text-muted">
            Score {lead.score} · {stageLabel(lead.stage)} ·{" "}
            {lead.source === "booking" ? "Booking form" : "Concierge"}
          </p>
        </div>
        <WhyReach lead={lead} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <Field
          label="Email"
          value={lead.email}
          href={lead.email ? `mailto:${lead.email}` : undefined}
        />
        <Field
          label="Phone"
          value={lead.phone}
          href={lead.phone ? `tel:${lead.phone}` : undefined}
        />
        <Field label="Intent" value={intentLabel(lead.intent)} />
        <Field label="Timeline" value={timelineLabel(lead.timeline)} />
        <Field label="Area" value={lead.location} />
        <Field label="Price range they mentioned" value={lead.price_range} />
        <Field label="Pre-approved" value={lead.preapproved} />
        <Field
          label="Contact permission"
          value={
            lead.consent_contact
              ? lead.consent_sms
                ? "Call, email, and text"
                : "Call and email"
              : "Not given"
          }
        />
      </dl>

      {appointments.length > 0 && (
        <div className="mt-5 rounded-md bg-paper-deep p-3 text-sm">
          <p className="font-medium">Meetings</p>
          {appointments.map((a) => (
            <p key={a.id} className="mt-1 text-ink-soft">
              {formatPacific(a.starts_at)} · {a.meeting_type} · {a.status}
            </p>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="stage">Stage</Label>
          <select
            id="stage"
            className="h-11 w-full rounded-md border border-line bg-paper px-3"
            value={stage}
            onChange={(e) => setStage(e.target.value as StageId)}
          >
            {STAGES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <Button
          type="button"
          onClick={() => save.mutate()}
          disabled={save.isPending}
        >
          Save
        </Button>
      </div>
      <div className="mt-3 space-y-1.5">
        <Label htmlFor="notes">Your notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <h3 className="font-medium">Conversation</h3>
        <div className="mt-2 max-h-80 space-y-2 overflow-y-auto rounded-md border border-line p-3">
          {!lead.conversation_id && (
            <p className="text-sm text-muted">No chat attached.</p>
          )}
          {thread.data?.map((m) => (
            <p
              key={m.id}
              className={cn(
                "rounded-sm px-3 py-2 text-sm",
                m.role === "assistant" ? "bg-paper-deep" : "bg-navy/10",
              )}
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {m.role === "assistant" ? "Concierge" : "Visitor"}
              </span>
              <br />
              {m.content}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppointmentRowView({
  appointment,
  workspaceKey,
  onChanged,
}: {
  appointment: AppointmentRow;
  workspaceKey: string;
  onChanged: () => void;
}) {
  const mut = useMutation({
    mutationFn: (status: "confirmed" | "completed" | "cancelled") =>
      updateAppointmentStatus({
        data: {
          key: workspaceKey,
          appointmentId: appointment.id,
          status,
        },
      }),
    onSuccess: onChanged,
  });
  return (
    <tr className="border-t border-line">
      <td className="px-3 py-3">{formatPacific(appointment.starts_at)}</td>
      <td className="px-3 py-3">
        <p>{appointment.name}</p>
        <p className="text-muted">{appointment.email}</p>
      </td>
      <td className="px-3 py-3 capitalize">
        {appointment.meeting_type.replace("_", " ")}
      </td>
      <td className="px-3 py-3 capitalize">{appointment.status}</td>
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-1">
          {appointment.status === "requested" && (
            <Button
              size="sm"
              variant="sage"
              onClick={() => mut.mutate("confirmed")}
            >
              Confirm
            </Button>
          )}
          {appointment.status !== "cancelled" &&
            appointment.status !== "completed" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => mut.mutate("cancelled")}
              >
                Cancel
              </Button>
            )}
        </div>
      </td>
    </tr>
  );
}

function WhyReach({ lead }: { lead: LeadRow }) {
  let reason = "Warm — nurture";
  if (!lead.email && !lead.phone) reason = "No contact yet — keep chatting";
  else if (lead.score >= 70) reason = "Hot — reach out today";
  else if (lead.intent === "sell" || lead.intent === "both")
    reason = "Seller-side interest";
  else if (lead.timeline === "now" || lead.timeline === "0-3")
    reason = "Near-term timeline";
  else if (lead.consent_contact) reason = "Gave permission to contact";

  return (
    <p className="max-w-xs rounded-sm bg-sage/12 px-3 py-2 text-sm text-sage">
      {reason}
    </p>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-paper px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p className="font-display text-3xl tabular-nums">{value}</p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-sm px-3 text-sm",
        active ? "bg-navy text-paper" : "bg-paper-deep text-ink-soft",
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value?: string | null;
  href?: string;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5">
        {href && value ? (
          <a className="underline-offset-2 hover:underline" href={href}>
            {value}
          </a>
        ) : (
          value || "—"
        )}
      </dd>
    </div>
  );
}

function stageLabel(id: string) {
  return STAGES.find((s) => s.id === id)?.label ?? id;
}
function intentLabel(id?: string | null) {
  if (id === "buy") return "Buying";
  if (id === "sell") return "Selling";
  if (id === "both") return "Buying and selling";
  if (id === "other") return "Other";
  return "Intent unknown";
}
function timelineLabel(id?: string | null) {
  if (id === "now") return "Ready now";
  if (id === "0-3") return "Next 3 months";
  if (id === "3-6") return "3–6 months";
  if (id === "6-12") return "6–12 months";
  if (id === "exploring") return "Exploring";
  return id ?? "";
}
function scoreTone(score: number): "sage" | "navy" | "muted" {
  if (score >= 70) return "sage";
  if (score >= 40) return "navy";
  return "muted";
}
