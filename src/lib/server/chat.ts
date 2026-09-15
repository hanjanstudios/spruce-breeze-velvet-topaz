import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { AGENT } from "@/lib/brand";
import { newId } from "@/lib/utils";
import { CONCIERGE_SYSTEM } from "@/lib/server/chat-prompt";
import {
  type LeadRow,
  type MessageRow,
  upsertLeadFromPartial,
} from "@/lib/server/leads";

const TOOLS = [
  {
    type: "function",
    function: {
      name: "update_lead",
      description:
        "Save visitor details when they share them. Only include fields they actually provided.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          intent: {
            type: "string",
            enum: ["buy", "sell", "both", "other"],
          },
          timeline: {
            type: "string",
            enum: ["now", "0-3", "3-6", "6-12", "exploring"],
          },
          location: { type: "string" },
          property_type: { type: "string" },
          price_range: { type: "string" },
          preapproved: { type: "string" },
          notes: { type: "string" },
          consent_contact: { type: "boolean" },
          consent_sms: { type: "boolean" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "propose_appointment",
      description:
        "Call when the visitor wants to book a consultation so the site can show available times.",
      parameters: {
        type: "object",
        properties: {
          topic: { type: "string" },
          meeting_type: {
            type: "string",
            enum: ["video", "phone", "in_person"],
          },
        },
      },
    },
  },
];

type GrokMsg = {
  role: string;
  content?: string | null;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
};

type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

type Completion = {
  choices: { message: GrokMsg }[];
};

export const FALLBACK_GREETING = `Hello — I’m an AI assistant for ${AGENT.name}, ${AGENT.designation}, DRE ${AGENT.dreNumber}, with ${AGENT.brokerage.licensedName}. I’m not a licensed agent. I can take a few details and help you book time with Hannah. Are you thinking about buying, selling, or both?`;

function cannedReply(text: string): { reply: string; propose: boolean } {
  const t = text.toLowerCase();
  const propose = /\b(book|schedule|appointment|meet|available|consult)\b/.test(t);
  if (/\bsell(ing)?\b/.test(t) && /\bbuy/.test(t)) {
    return {
      reply: `I can take a few details for Hannah — I can’t advise on whether to buy or sell, or on price. Are you in ${AGENT.serviceArea}, and what’s your timing? If you’d like, I can show times to meet.`,
      propose,
    };
  }
  if (/\bsell/.test(t)) {
    return {
      reply: `Hannah meets with homeowners before any listing conversation. I can’t give a value. What city is the home in, and is it okay if she follows up? I can also show her open times.`,
      propose: true,
    };
  }
  if (/\bbuy/.test(t)) {
    return {
      reply: `Hannah can walk you through buying in person. I can’t recommend properties or prices here. Which city are you considering, and would you like to book a consult?`,
      propose: true,
    };
  }
  if (propose) {
    return {
      reply: `I can show Hannah’s open times. You’ll pick a slot and leave contact details so she can confirm. This does not create an agency relationship.`,
      propose: true,
    };
  }
  return {
    reply: `I can help you leave a message or book a consult with ${AGENT.name}, DRE ${AGENT.dreNumber}. Are you exploring buying, selling, or both?`,
    propose: false,
  };
}

async function grokChat(messages: GrokMsg[], tools = true): Promise<GrokMsg> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) throw new Error("AI_UNAVAILABLE");
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.4,
      max_tokens: 420,
      messages,
      ...(tools ? { tools: TOOLS, tool_choice: "auto" } : {}),
    }),
  });
  if (!res.ok) throw new Error(`xAI API error ${res.status}`);
  const body = (await res.json()) as Completion;
  return body.choices[0]?.message ?? { role: "assistant", content: "" };
}

function parseArgs(raw: string): Record<string, unknown> {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

export const sendConciergeMessage = createServerFn({ method: "POST" })
  .validator((input: { conversationId: string; message: string }) => input)
  .handler(async ({ data }) => {
    const text = data.message.trim().slice(0, 800);
    if (!text) throw new Error("Please type a message.");
    const sql = await getSql();

    const convo = (
      await sql<{ id: string; lead_id: string | null }>`
        select id, lead_id from conversations where id = ${data.conversationId} limit 1
      `
    )[0];
    if (!convo) throw new Error("Conversation not found. Refresh and try again.");

    const prior = await sql<MessageRow>`
      select * from messages
      where conversation_id = ${data.conversationId}
      order by created_at asc
    `;
    if (prior.length >= 28) {
      throw new Error(
        "This chat has reached its limit. Please book a time with Hannah to continue.",
      );
    }

    await sql`
      insert into messages (id, conversation_id, role, content)
      values (${newId()}, ${data.conversationId}, ${"user"}, ${text})
    `;

    const history: GrokMsg[] = prior.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));
    history.push({ role: "user", content: text });

    let lead: LeadRow | null = convo.lead_id
      ? (
          await sql<LeadRow>`select * from leads where id = ${convo.lead_id} limit 1`
        )[0] ?? null
      : (
          await sql<LeadRow>`
            select * from leads where conversation_id = ${data.conversationId} limit 1
          `
        )[0] ?? null;

    let propose = false;
    let reply = "";
    const aiAvailable = Boolean(process.env.XAI_API_KEY);

    try {
      const first = await grokChat([
        { role: "system", content: CONCIERGE_SYSTEM },
        ...history,
      ]);

      if (first.tool_calls?.length) {
        const toolResults: GrokMsg[] = [];
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
                consent_sms: Boolean(args.consent_sms),
              },
            });
            toolResults.push({
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify({ ok: true, stage: lead.stage }),
            });
          } else if (call.function.name === "propose_appointment") {
            propose = true;
            toolResults.push({
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify({ ok: true }),
            });
          }
        }

        const second = await grokChat(
          [
            { role: "system", content: CONCIERGE_SYSTEM },
            ...history,
            {
              role: "assistant",
              content: first.content ?? "",
              tool_calls: first.tool_calls,
            },
            ...toolResults,
          ],
          false,
        );
        reply = (second.content ?? "").trim();
      } else {
        reply = (first.content ?? "").trim();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message === "AI_UNAVAILABLE") {
        const canned = cannedReply(text);
        reply = canned.reply;
        propose = canned.propose;
      } else {
        throw err;
      }
    }

    if (!reply) {
      const canned = cannedReply(text);
      reply = canned.reply;
      propose = propose || canned.propose;
    }

    const wantsBooking =
      propose ||
      /\b(book|schedule|appointment|meet(ing)?|consult)\b/i.test(text);

    await sql`
      insert into messages (id, conversation_id, role, content)
      values (${newId()}, ${data.conversationId}, ${"assistant"}, ${reply})
    `;

    return {
      reply,
      leadId: lead?.id ?? null,
      proposeAppointment: wantsBooking,
      aiAvailable,
    };
  });

export const conciergeGreeting = createServerFn({ method: "GET" }).handler(
  async () => ({
    text: FALLBACK_GREETING,
    aiAvailable: Boolean(process.env.XAI_API_KEY),
  }),
);
