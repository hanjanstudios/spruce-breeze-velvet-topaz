import { t as AGENT } from "./brand-DfHBys0n.mjs";
import { n as newId } from "./utils-DG8erAqy.mjs";
import { t as createServerFn } from "./ssr.mjs";
import { t as getSql } from "./lead-score-DI2cSlu0.mjs";
import { u as upsertLeadFromPartial } from "./leads-C7tYUe_P.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-9IxjWvFD.js
var CONCIERGE_SYSTEM = `You are the Home Concierge on the website of ${AGENT.name}, a licensed California ${AGENT.designation} (DRE ${AGENT.dreNumber}) with ${AGENT.brokerage.licensedName} (DRE ${AGENT.brokerage.dreNumber}).

You are an AI assistant. You are NOT a licensed real estate broker or salesperson. You may not perform licensed real estate activity.

California DRE treats AI used for licensed acts the same as an unlicensed assistant. Stay inside that lane.

YOU MAY
- Greet visitors and explain how Hannah works with buyers and homeowners.
- Collect name, phone, email, city, timeline, and whether they are buying, selling, or both.
- Schedule a consultation with Hannah.
- Share general, non-property-specific process facts (escrow, inspections, and disclosures exist in a typical California purchase).
- Direct licensed questions to a meeting with Hannah.

YOU MUST NOT
- Give a home value, CMA, appraisal, or any dollar opinion of worth.
- Discuss terms, conditions, strategy, or features of a specific property as advice.
- Tell someone whether to buy, sell, list, offer, or wait.
- Negotiate or suggest offer/list prices, contingencies, or concessions.
- Guarantee results, timing, or sale price. Never use “guaranteed,” “insured,” “bonded,” or “risk-free.”
- Claim to be Hannah, a REALTOR®, or a licensee.
- Create an agency relationship or say you represent them.
- Steer toward or away from areas using protected class, school quality as a proxy for demographics, crime coded as people, or “good/bad neighborhoods.”
- Ask about race, color, religion, sex, gender identity, sexual orientation, familial status, disability, national origin, ancestry, immigration, source of income, marital status, or similar.
- Solicit a specific listing or property.

FAIR HOUSING
Serve every visitor equally. If asked to exclude people or areas for discriminatory reasons, refuse and restate equal housing.

DISCLOSURE
Your first reply must include: you are an AI assistant (not a licensed agent), and ${AGENT.name}, DRE ${AGENT.dreNumber}, ${AGENT.brokerage.licensedName}, can meet with them.

If asked for a value: “I can’t provide a value or appraisal. Hannah can walk through a market conversation with you — would you like to book that?”

TONE
Warm, calm, concise, professional. No slang dump. No emoji. 2–4 sentences unless they ask for more.

LEAD QUALIFICATION — ask naturally, not as a dump
1) Buying, selling, or both?
2) City or area
3) Timeline
4) Name
5) Phone and/or email
6) Optional: property type, the range they have in mind (their goal, not your opinion), pre-approval

When they share a detail, call update_lead with only the new fields.
When they want to meet, call propose_appointment.
Ask consent before saying Hannah will call, text, or email: “Is it okay for Hannah to contact you about this?”
If they decline contact, still answer allowed general questions.

Never invent Hannah’s phone, email, or office if they are not provided. Offer to take a message and book time instead.`;
var TOOLS = [{
	type: "function",
	function: {
		name: "update_lead",
		description: "Save visitor details when they share them. Only include fields they actually provided.",
		parameters: {
			type: "object",
			properties: {
				name: { type: "string" },
				email: { type: "string" },
				phone: { type: "string" },
				intent: {
					type: "string",
					enum: [
						"buy",
						"sell",
						"both",
						"other"
					]
				},
				timeline: {
					type: "string",
					enum: [
						"now",
						"0-3",
						"3-6",
						"6-12",
						"exploring"
					]
				},
				location: { type: "string" },
				property_type: { type: "string" },
				price_range: { type: "string" },
				preapproved: { type: "string" },
				notes: { type: "string" },
				consent_contact: { type: "boolean" },
				consent_sms: { type: "boolean" }
			}
		}
	}
}, {
	type: "function",
	function: {
		name: "propose_appointment",
		description: "Call when the visitor wants to book a consultation so the site can show available times.",
		parameters: {
			type: "object",
			properties: {
				topic: { type: "string" },
				meeting_type: {
					type: "string",
					enum: [
						"video",
						"phone",
						"in_person"
					]
				}
			}
		}
	}
}];
var FALLBACK_GREETING = `Hello — I’m an AI assistant for ${AGENT.name}, ${AGENT.designation}, DRE ${AGENT.dreNumber}, with ${AGENT.brokerage.licensedName}. I’m not a licensed agent. I can take a few details and help you book time with Hannah. Are you thinking about buying, selling, or both?`;
function cannedReply(text) {
	const t = text.toLowerCase();
	const propose = /\b(book|schedule|appointment|meet|available|consult)\b/.test(t);
	if (/\bsell(ing)?\b/.test(t) && /\bbuy/.test(t)) return {
		reply: `I can take a few details for Hannah — I can’t advise on whether to buy or sell, or on price. Are you in ${AGENT.serviceArea}, and what’s your timing? If you’d like, I can show times to meet.`,
		propose
	};
	if (/\bsell/.test(t)) return {
		reply: `Hannah meets with homeowners before any listing conversation. I can’t give a value. What city is the home in, and is it okay if she follows up? I can also show her open times.`,
		propose: true
	};
	if (/\bbuy/.test(t)) return {
		reply: `Hannah can walk you through buying in person. I can’t recommend properties or prices here. Which city are you considering, and would you like to book a consult?`,
		propose: true
	};
	if (propose) return {
		reply: `I can show Hannah’s open times. You’ll pick a slot and leave contact details so she can confirm. This does not create an agency relationship.`,
		propose: true
	};
	return {
		reply: `I can help you leave a message or book a consult with ${AGENT.name}, DRE ${AGENT.dreNumber}. Are you exploring buying, selling, or both?`,
		propose: false
	};
}
async function grokChat(messages, tools = true) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("AI_UNAVAILABLE");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .4,
			max_tokens: 420,
			messages,
			...tools ? {
				tools: TOOLS,
				tool_choice: "auto"
			} : {}
		})
	});
	if (!res.ok) throw new Error(`xAI API error ${res.status}`);
	return (await res.json()).choices[0]?.message ?? {
		role: "assistant",
		content: ""
	};
}
function parseArgs(raw) {
	try {
		return JSON.parse(raw);
	} catch {
		return {};
	}
}
function str(v) {
	return typeof v === "string" && v.trim() ? v.trim() : void 0;
}
var sendConciergeMessage_createServerFn_handler = createServerRpc({
	id: "b6f4bf86f30975fcdcffa6c733e14dbc9831261fd6ebc4483add46159932956f",
	name: "sendConciergeMessage",
	filename: "src/lib/server/chat.ts"
}, (opts) => sendConciergeMessage.__executeServer(opts));
var sendConciergeMessage = createServerFn({ method: "POST" }).validator((input) => input).handler(sendConciergeMessage_createServerFn_handler, async ({ data }) => {
	const text = data.message.trim().slice(0, 800);
	if (!text) throw new Error("Please type a message.");
	const sql = await getSql();
	const convo = (await sql`
        select id, lead_id from conversations where id = ${data.conversationId} limit 1
      `)[0];
	if (!convo) throw new Error("Conversation not found. Refresh and try again.");
	const prior = await sql`
      select * from messages
      where conversation_id = ${data.conversationId}
      order by created_at asc
    `;
	if (prior.length >= 28) throw new Error("This chat has reached its limit. Please book a time with Hannah to continue.");
	await sql`
      insert into messages (id, conversation_id, role, content)
      values (${newId()}, ${data.conversationId}, ${"user"}, ${text})
    `;
	const history = prior.map((m) => ({
		role: m.role === "assistant" ? "assistant" : "user",
		content: m.content
	}));
	history.push({
		role: "user",
		content: text
	});
	let lead = convo.lead_id ? (await sql`select * from leads where id = ${convo.lead_id} limit 1`)[0] ?? null : (await sql`
            select * from leads where conversation_id = ${data.conversationId} limit 1
          `)[0] ?? null;
	let propose = false;
	let reply = "";
	const aiAvailable = Boolean(process.env.XAI_API_KEY);
	try {
		const first = await grokChat([{
			role: "system",
			content: CONCIERGE_SYSTEM
		}, ...history]);
		if (first.tool_calls?.length) {
			const toolResults = [];
			for (const call of first.tool_calls) {
				const args = parseArgs(call.function.arguments);
				if (call.function.name === "update_lead") {
					lead = await upsertLeadFromPartial({
						leadId: lead?.id,
						conversationId: data.conversationId,
						source: "chat",
						fields: {
							name: str(args.name),
							email: str(args.email),
							phone: str(args.phone),
							intent: str(args.intent),
							timeline: str(args.timeline),
							location: str(args.location),
							property_type: str(args.property_type),
							price_range: str(args.price_range),
							preapproved: str(args.preapproved),
							notes: str(args.notes),
							consent_contact: Boolean(args.consent_contact),
							consent_sms: Boolean(args.consent_sms)
						}
					});
					toolResults.push({
						role: "tool",
						tool_call_id: call.id,
						content: JSON.stringify({
							ok: true,
							stage: lead.stage
						})
					});
				} else if (call.function.name === "propose_appointment") {
					propose = true;
					toolResults.push({
						role: "tool",
						tool_call_id: call.id,
						content: JSON.stringify({ ok: true })
					});
				}
			}
			reply = ((await grokChat([
				{
					role: "system",
					content: CONCIERGE_SYSTEM
				},
				...history,
				{
					role: "assistant",
					content: first.content ?? "",
					tool_calls: first.tool_calls
				},
				...toolResults
			], false)).content ?? "").trim();
		} else reply = (first.content ?? "").trim();
	} catch (err) {
		if ((err instanceof Error ? err.message : "") === "AI_UNAVAILABLE") {
			const canned = cannedReply(text);
			reply = canned.reply;
			propose = canned.propose;
		} else throw err;
	}
	if (!reply) {
		const canned = cannedReply(text);
		reply = canned.reply;
		propose = propose || canned.propose;
	}
	const wantsBooking = propose || /\b(book|schedule|appointment|available times|set up a time)\b/i.test(`${text} ${reply}`);
	await sql`
      insert into messages (id, conversation_id, role, content)
      values (${newId()}, ${data.conversationId}, ${"assistant"}, ${reply})
    `;
	return {
		reply,
		leadId: lead?.id ?? null,
		proposeAppointment: wantsBooking,
		aiAvailable
	};
});
var conciergeGreeting_createServerFn_handler = createServerRpc({
	id: "3cf3caabf0db25e4a558bed78278c609091da8750f9aa643997adf773ca8c2e9",
	name: "conciergeGreeting",
	filename: "src/lib/server/chat.ts"
}, (opts) => conciergeGreeting.__executeServer(opts));
var conciergeGreeting = createServerFn({ method: "GET" }).handler(conciergeGreeting_createServerFn_handler, async () => ({
	text: FALLBACK_GREETING,
	aiAvailable: Boolean(process.env.XAI_API_KEY)
}));
//#endregion
export { conciergeGreeting_createServerFn_handler, sendConciergeMessage_createServerFn_handler };
