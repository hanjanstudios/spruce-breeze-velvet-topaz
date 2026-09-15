import { n as newId } from "./utils-DG8erAqy.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as inferStage, r as scoreLead, t as getSql } from "./lead-score-DI2cSlu0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leads-C7tYUe_P.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var startConversation = createServerFn({ method: "POST" }).handler(createSsrRpc("b999c4bf5b6f830bfdbc6eb773cec6dc09e57e4ccc8c32780f02a91d077fa1ee"));
var listOpenSlots = createServerFn({ method: "GET" }).handler(createSsrRpc("aa7b790675eca51e47d4971cd96774fe9bc95405e934f6dca105e412db14bcaa"));
var requestAppointment = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a58177254c9f07491512a89aafa89f8ddbe2c401e1e10d7b373c51fbd23648aa"));
var unlockWorkspace = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a3af7743f9349ba1d23632d1310287ad7b7e949772c0d14330c0c524d9a41028"));
var listWorkspace = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("74f001469539205d53c725958a259b701c9ca9118cccd662ec032414e6fa4ec9"));
var listLeadMessages = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("88a8368efe41f3765873a4be9df5f8cb1addb0e4e2202b8e4d3eedfc2011101f"));
var updateLeadStage = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4f8d852d8299d9191e77b4376adf957b3fbfeeea39a8fd93673800817ce31626"));
var updateAppointmentStatus = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("a32f7d3669bcbbf380d716ab185dd12df770666a641c3719728e32d68c41095f"));
//#endregion
export { requestAppointment as a, updateAppointmentStatus as c, listWorkspace as i, updateLeadStage as l, listLeadMessages as n, startConversation as o, listOpenSlots as r, unlockWorkspace as s, createSsrRpc as t, upsertLeadFromPartial as u };
