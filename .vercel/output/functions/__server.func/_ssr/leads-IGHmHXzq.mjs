import { t as AGENT } from "./brand-DfHBys0n.mjs";
import { n as newId } from "./utils-DG8erAqy.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { n as inferStage, r as scoreLead, t as getSql } from "./lead-score-DI2cSlu0.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { n as formatPacific, t as buildOpenSlots } from "./time-CBApnNHP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-IGHmHXzq.js
function keysMatch(a, b) {
	if (a.length !== b.length) return false;
	let out = 0;
	for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return out === 0;
}
function assertWorkspace(key) {
	if (!keysMatch(key.trim(), AGENT.workspaceKey)) throw new Error("Workspace key is not valid.");
}
function asBool(value) {
	return value === true || value === "t" || value === "true" || value === 1;
}
function normalizeLead(row) {
	return {
		...row,
		score: Number(row.score),
		consent_contact: asBool(row.consent_contact),
		consent_sms: asBool(row.consent_sms)
	};
}
async function upsertLeadFromPartial(input) {
	const sql = await getSql();
	const existingRaw = input.leadId ? (await sql`select * from leads where id = ${input.leadId} limit 1`)[0] : input.conversationId ? (await sql`select * from leads where conversation_id = ${input.conversationId} limit 1`)[0] : void 0;
	const existing = existingRaw ? normalizeLead(existingRaw) : void 0;
	const merged = {
		...existing ?? {},
		...Object.fromEntries(Object.entries(input.fields).filter(([, v]) => v !== void 0 && v !== ""))
	};
	const hasAppt = existing ? (await sql`
          select count(*)::int as n from appointments
          where lead_id = ${existing.id} and status != 'cancelled'
        `)[0]?.n > 0 : false;
	const stage = inferStage(merged, hasAppt);
	const score = scoreLead({
		...merged,
		stage
	});
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (existing) return normalizeLead((await sql`
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
    `)[0]);
	const id = newId();
	const rows = await sql`
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
	if (input.conversationId) await sql`
      update conversations set lead_id = ${id} where id = ${input.conversationId}
    `;
	return normalizeLead(rows[0]);
}
var startConversation_createServerFn_handler = createServerRpc({
	id: "b999c4bf5b6f830bfdbc6eb773cec6dc09e57e4ccc8c32780f02a91d077fa1ee",
	name: "startConversation",
	filename: "src/lib/server/leads.ts"
}, (opts) => startConversation.__executeServer(opts));
var startConversation = createServerFn({ method: "POST" }).handler(startConversation_createServerFn_handler, async () => {
	const sql = await getSql();
	const id = newId();
	await sql`insert into conversations (id) values (${id})`;
	return { conversationId: id };
});
var listOpenSlots_createServerFn_handler = createServerRpc({
	id: "aa7b790675eca51e47d4971cd96774fe9bc95405e934f6dca105e412db14bcaa",
	name: "listOpenSlots",
	filename: "src/lib/server/leads.ts"
}, (opts) => listOpenSlots.__executeServer(opts));
var listOpenSlots = createServerFn({ method: "GET" }).handler(listOpenSlots_createServerFn_handler, async () => {
	const taken = await (await getSql())`
      select starts_at from appointments where status != 'cancelled'
    `;
	return buildOpenSlots(taken.map((r) => r.starts_at));
});
var requestAppointment_createServerFn_handler = createServerRpc({
	id: "a58177254c9f07491512a89aafa89f8ddbe2c401e1e10d7b373c51fbd23648aa",
	name: "requestAppointment",
	filename: "src/lib/server/leads.ts"
}, (opts) => requestAppointment.__executeServer(opts));
var requestAppointment = createServerFn({ method: "POST" }).validator((input) => input).handler(requestAppointment_createServerFn_handler, async ({ data }) => {
	const name = data.name.trim();
	const email = data.email.trim().toLowerCase();
	if (!name || !email || !data.consentContact) throw new Error("Name, email, and permission to contact are required.");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please use a valid email.");
	const starts = new Date(data.startsAt);
	if (Number.isNaN(starts.getTime())) throw new Error("That time is not valid.");
	if (starts.getTime() < Date.now()) throw new Error("Please choose a future time.");
	const sql = await getSql();
	if ((await sql`
      select id from appointments
      where starts_at = ${starts.toISOString()} and status != 'cancelled'
      limit 1
    `)[0]) throw new Error("That time was just taken. Please pick another.");
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
			stage: "appointment"
		}
	});
	const rows = await sql`
      insert into appointments (
        id, lead_id, conversation_id, name, email, phone, starts_at,
        duration_min, meeting_type, topic, notes, status, consent_contact
      ) values (
        ${newId()}, ${lead.id}, ${data.conversationId ?? null}, ${name}, ${email},
        ${data.phone?.trim() || null}, ${starts.toISOString()},
        ${AGENT.appointmentMinutes}, ${data.meetingType}, ${data.topic ?? null},
        ${data.notes ?? null}, ${"requested"}, ${true}
      )
      returning *
    `;
	await sql`
      update leads set stage = 'appointment', score = ${scoreLead({
		...lead,
		stage: "appointment"
	})}, updated_at = ${(/* @__PURE__ */ new Date()).toISOString()}
      where id = ${lead.id}
    `;
	return {
		appointment: rows[0],
		leadId: lead.id,
		whenLabel: formatPacific(starts)
	};
});
var unlockWorkspace_createServerFn_handler = createServerRpc({
	id: "a3af7743f9349ba1d23632d1310287ad7b7e949772c0d14330c0c524d9a41028",
	name: "unlockWorkspace",
	filename: "src/lib/server/leads.ts"
}, (opts) => unlockWorkspace.__executeServer(opts));
var unlockWorkspace = createServerFn({ method: "POST" }).validator((input) => input).handler(unlockWorkspace_createServerFn_handler, async ({ data }) => {
	assertWorkspace(data.key);
	return { ok: true };
});
var listWorkspace_createServerFn_handler = createServerRpc({
	id: "74f001469539205d53c725958a259b701c9ca9118cccd662ec032414e6fa4ec9",
	name: "listWorkspace",
	filename: "src/lib/server/leads.ts"
}, (opts) => listWorkspace.__executeServer(opts));
var listWorkspace = createServerFn({ method: "POST" }).validator((input) => input).handler(listWorkspace_createServerFn_handler, async ({ data }) => {
	assertWorkspace(data.key);
	const sql = await getSql();
	const leads = await sql`
      select * from leads order by updated_at desc
    `;
	const appointments = await sql`
      select * from appointments order by starts_at desc
    `;
	return {
		leads: leads.map(normalizeLead),
		appointments: appointments.map((a) => ({
			...a,
			duration_min: Number(a.duration_min),
			consent_contact: asBool(a.consent_contact)
		}))
	};
});
var listLeadMessages_createServerFn_handler = createServerRpc({
	id: "88a8368efe41f3765873a4be9df5f8cb1addb0e4e2202b8e4d3eedfc2011101f",
	name: "listLeadMessages",
	filename: "src/lib/server/leads.ts"
}, (opts) => listLeadMessages.__executeServer(opts));
var listLeadMessages = createServerFn({ method: "POST" }).validator((input) => input).handler(listLeadMessages_createServerFn_handler, async ({ data }) => {
	assertWorkspace(data.key);
	return (await getSql())`
      select * from messages
      where conversation_id = ${data.conversationId}
      order by created_at asc
    `;
});
var updateLeadStage_createServerFn_handler = createServerRpc({
	id: "4f8d852d8299d9191e77b4376adf957b3fbfeeea39a8fd93673800817ce31626",
	name: "updateLeadStage",
	filename: "src/lib/server/leads.ts"
}, (opts) => updateLeadStage.__executeServer(opts));
var updateLeadStage = createServerFn({ method: "POST" }).validator((input) => input).handler(updateLeadStage_createServerFn_handler, async ({ data }) => {
	assertWorkspace(data.key);
	const sql = await getSql();
	const existing = (await sql`select * from leads where id = ${data.leadId} limit 1`)[0];
	if (!existing) throw new Error("Lead not found.");
	const notes = data.notes !== void 0 ? data.notes : existing.notes;
	const score = scoreLead({
		...existing,
		stage: data.stage
	});
	return normalizeLead((await sql`
      update leads
      set stage = ${data.stage}, notes = ${notes}, score = ${score},
          updated_at = ${(/* @__PURE__ */ new Date()).toISOString()}
      where id = ${data.leadId}
      returning *
    `)[0]);
});
var updateAppointmentStatus_createServerFn_handler = createServerRpc({
	id: "a32f7d3669bcbbf380d716ab185dd12df770666a641c3719728e32d68c41095f",
	name: "updateAppointmentStatus",
	filename: "src/lib/server/leads.ts"
}, (opts) => updateAppointmentStatus.__executeServer(opts));
var updateAppointmentStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(updateAppointmentStatus_createServerFn_handler, async ({ data }) => {
	assertWorkspace(data.key);
	const rows = await (await getSql())`
      update appointments set status = ${data.status}
      where id = ${data.appointmentId}
      returning *
    `;
	if (!rows[0]) throw new Error("Appointment not found.");
	return rows[0];
});
//#endregion
export { listLeadMessages_createServerFn_handler, listOpenSlots_createServerFn_handler, listWorkspace_createServerFn_handler, requestAppointment_createServerFn_handler, startConversation_createServerFn_handler, unlockWorkspace_createServerFn_handler, updateAppointmentStatus_createServerFn_handler, updateLeadStage_createServerFn_handler };
