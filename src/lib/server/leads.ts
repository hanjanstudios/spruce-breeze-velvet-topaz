import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { AGENT, type StageId } from "@/lib/brand";
import { inferStage, scoreLead } from "@/lib/lead-score";
import { newId } from "@/lib/utils";
import { buildOpenSlots, formatPacific } from "@/lib/time";

export type LeadRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  intent: string | null;
  timeline: string | null;
  location: string | null;
  property_type: string | null;
  price_range: string | null;
  preapproved: string | null;
  notes: string | null;
  source: string;
  stage: string;
  score: number;
  tags: string;
  consent_contact: boolean;
  consent_sms: boolean;
  conversation_id: string | null;
  created_at: string;
  updated_at: string;
};

export type AppointmentRow = {
  id: string;
  lead_id: string | null;
  conversation_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  starts_at: string;
  duration_min: number;
  meeting_type: string;
  topic: string | null;
  notes: string | null;
  status: string;
  consent_contact: boolean;
  created_at: string;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  created_at: string;
};

function keysMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

function assertWorkspace(key: string) {
  if (!keysMatch(key.trim(), AGENT.workspaceKey)) {
    throw new Error("Workspace key is not valid.");
  }
}

function asBool(value: unknown): boolean {
  return value === true || value === "t" || value === "true" || value === 1;
}

function normalizeLead(row: LeadRow): LeadRow {
  return {
    ...row,
    score: Number(row.score),
    consent_contact: asBool(row.consent_contact),
    consent_sms: asBool(row.consent_sms),
  };
}

export async function upsertLeadFromPartial(input: {
  leadId?: string | null;
  conversationId?: string | null;
  source?: string;
  fields: Partial<LeadRow> & {
    consent_contact?: boolean;
    consent_sms?: boolean;
  };
}): Promise<LeadRow> {
  const sql = await getSql();
  const existingRaw = input.leadId
    ? (
        await sql<LeadRow>`select * from leads where id = ${input.leadId} limit 1`
      )[0]
    : input.conversationId
      ? (
          await sql<LeadRow>`select * from leads where conversation_id = ${input.conversationId} limit 1`
        )[0]
      : undefined;
  const existing = existingRaw ? normalizeLead(existingRaw) : undefined;

  const merged: Partial<LeadRow> = {
    ...(existing ?? {}),
    ...Object.fromEntries(
      Object.entries(input.fields).filter(([, v]) => v !== undefined && v !== ""),
    ),
  };

  const hasAppt = existing
    ? (
        await sql<{ n: number }>`
          select count(*)::int as n from appointments
          where lead_id = ${existing.id} and status != 'cancelled'
        `
      )[0]?.n > 0
    : false;

  const stage = inferStage(merged, hasAppt);
  const score = scoreLead({ ...merged, stage });
  const now = new Date().toISOString();

  if (existing) {
    const rows = await sql<LeadRow>`
      update leads set
        name = ${merged.name ?? existing.name},
        email = ${merged.email ?? existing.email},
        phone = ${merged.phone ?? existing.phone},
        intent = ${merged.intent ?? existing.intent},
        timeline = ${merged.timeline ?? existing.timeline},
        location = ${merged.location ?? existing.location},
        property_type = ${merged.property_type ?? existing.property_type},
        price_range = ${merged.price_range ?? existing.price_range},
        preapproved = ${merged.preapproved ?? existing.preapproved},
        notes = ${merged.notes ?? existing.notes},
        stage = ${stage},
        score = ${score},
        consent_contact = ${Boolean(merged.consent_contact) || existing.consent_contact},
        consent_sms = ${Boolean(merged.consent_sms) || existing.consent_sms},
        conversation_id = ${existing.conversation_id ?? input.conversationId ?? null},
        updated_at = ${now}
      where id = ${existing.id}
      returning *
    `;
    return normalizeLead(rows[0]);
  }

  const id = newId();
  const rows = await sql<LeadRow>`
    insert into leads (
      id, name, email, phone, intent, timeline, location, property_type,
      price_range, preapproved, notes, source, stage, score, tags,
      consent_contact, consent_sms, conversation_id, created_at, updated_at
    ) values (
      ${id},
      ${merged.name ?? null},
      ${merged.email ?? null},
      ${merged.phone ?? null},
      ${merged.intent ?? null},
      ${merged.timeline ?? null},
      ${merged.location ?? null},
      ${merged.property_type ?? null},
      ${merged.price_range ?? null},
      ${merged.preapproved ?? null},
      ${merged.notes ?? null},
      ${input.source ?? "chat"},
      ${stage},
      ${score},
      ${"[]"},
      ${Boolean(merged.consent_contact)},
      ${Boolean(merged.consent_sms)},
      ${input.conversationId ?? null},
      ${now},
      ${now}
    )
    returning *
  `;
  if (input.conversationId) {
    await sql`
      update conversations set lead_id = ${id} where id = ${input.conversationId}
    `;
  }
  return normalizeLead(rows[0]);
}

export const startConversation = createServerFn({ method: "POST" }).handler(
  async () => {
    const sql = await getSql();
    const id = newId();
    await sql`insert into conversations (id) values (${id})`;
    return { conversationId: id };
  },
);

export const listOpenSlots = createServerFn({ method: "GET" }).handler(
  async () => {
    const sql = await getSql();
    const taken = await sql<{ starts_at: string }>`
      select starts_at from appointments where status != 'cancelled'
    `;
    return buildOpenSlots(taken.map((r) => r.starts_at));
  },
);

export const requestAppointment = createServerFn({ method: "POST" })
  .validator(
    (input: {
      name: string;
      email: string;
      phone?: string;
      startsAt: string;
      meetingType: string;
      topic?: string;
      notes?: string;
      intent?: string;
      location?: string;
      timeline?: string;
      consentContact: boolean;
      consentSms?: boolean;
      conversationId?: string;
      leadId?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    const name = data.name.trim();
    const email = data.email.trim().toLowerCase();
    if (!name || !email || !data.consentContact) {
      throw new Error("Name, email, and permission to contact are required.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Please use a valid email.");
    }
    const starts = new Date(data.startsAt);
    if (Number.isNaN(starts.getTime())) throw new Error("That time is not valid.");
    if (starts.getTime() < Date.now()) {
      throw new Error("Please choose a future time.");
    }

    const sql = await getSql();
    const clash = await sql<{ id: string }>`
      select id from appointments
      where starts_at = ${starts.toISOString()} and status != 'cancelled'
      limit 1
    `;
    if (clash[0]) throw new Error("That time was just taken. Please pick another.");

    const lead = await upsertLeadFromPartial({
      leadId: data.leadId,
      conversationId: data.conversationId,
      source: "booking",
      fields: {
        name,
        email,
        phone: data.phone?.trim() || null,
        intent: data.intent ?? null,
        location: data.location ?? null,
        timeline: data.timeline ?? null,
        notes: data.notes ?? null,
        consent_contact: true,
        consent_sms: Boolean(data.consentSms),
        stage: "appointment",
      },
    });

    const id = newId();
    const rows = await sql<AppointmentRow>`
      insert into appointments (
        id, lead_id, conversation_id, name, email, phone, starts_at,
        duration_min, meeting_type, topic, notes, status, consent_contact
      ) values (
        ${id}, ${lead.id}, ${data.conversationId ?? null}, ${name}, ${email},
        ${data.phone?.trim() || null}, ${starts.toISOString()},
        ${AGENT.appointmentMinutes}, ${data.meetingType}, ${data.topic ?? null},
        ${data.notes ?? null}, ${"requested"}, ${true}
      )
      returning *
    `;

    await sql`
      update leads set stage = 'appointment', score = ${scoreLead({
        ...lead,
        stage: "appointment",
      })}, updated_at = ${new Date().toISOString()}
      where id = ${lead.id}
    `;

    return {
      appointment: rows[0],
      leadId: lead.id,
      whenLabel: formatPacific(starts),
    };
  });

export const unlockWorkspace = createServerFn({ method: "POST" })
  .validator((input: { key: string }) => input)
  .handler(async ({ data }) => {
    assertWorkspace(data.key);
    return { ok: true as const };
  });

export const listWorkspace = createServerFn({ method: "POST" })
  .validator((input: { key: string }) => input)
  .handler(async ({ data }) => {
    assertWorkspace(data.key);
    const sql = await getSql();
    const leads = await sql<LeadRow>`
      select * from leads order by updated_at desc
    `;
    const appointments = await sql<AppointmentRow>`
      select * from appointments order by starts_at desc
    `;
    return {
      leads: leads.map(normalizeLead),
      appointments: appointments.map((a) => ({
        ...a,
        duration_min: Number(a.duration_min),
        consent_contact: asBool(a.consent_contact),
      })),
    };
  });

export const listLeadMessages = createServerFn({ method: "POST" })
  .validator((input: { key: string; conversationId: string }) => input)
  .handler(async ({ data }) => {
    assertWorkspace(data.key);
    const sql = await getSql();
    return sql<MessageRow>`
      select * from messages
      where conversation_id = ${data.conversationId}
      order by created_at asc
    `;
  });

export const updateLeadStage = createServerFn({ method: "POST" })
  .validator((input: { key: string; leadId: string; stage: StageId; notes?: string }) => input)
  .handler(async ({ data }) => {
    assertWorkspace(data.key);
    const sql = await getSql();
    const existing = (
      await sql<LeadRow>`select * from leads where id = ${data.leadId} limit 1`
    )[0];
    if (!existing) throw new Error("Lead not found.");
    const notes =
      data.notes !== undefined ? data.notes : existing.notes;
    const score = scoreLead({ ...existing, stage: data.stage });
    const rows = await sql<LeadRow>`
      update leads
      set stage = ${data.stage}, notes = ${notes}, score = ${score},
          updated_at = ${new Date().toISOString()}
      where id = ${data.leadId}
      returning *
    `;
    return normalizeLead(rows[0]);
  });

export const updateAppointmentStatus = createServerFn({ method: "POST" })
  .validator(
    (input: {
      key: string;
      appointmentId: string;
      status: "requested" | "confirmed" | "completed" | "cancelled";
    }) => input,
  )
  .handler(async ({ data }) => {
    assertWorkspace(data.key);
    const sql = await getSql();
    const rows = await sql<AppointmentRow>`
      update appointments set status = ${data.status}
      where id = ${data.appointmentId}
      returning *
    `;
    if (!rows[0]) throw new Error("Appointment not found.");
    return rows[0];
  });
