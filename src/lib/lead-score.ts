export type LeadFields = {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  intent?: string | null;
  timeline?: string | null;
  location?: string | null;
  preapproved?: string | null;
  stage?: string | null;
};

export function scoreLead(fields: LeadFields): number {
  let score = 0;
  if (fields.name?.trim()) score += 15;
  if (fields.email?.trim()) score += 20;
  if (fields.phone?.trim()) score += 25;
  if (fields.location?.trim()) score += 8;
  if (fields.intent === "sell") score += 18;
  else if (fields.intent === "both") score += 20;
  else if (fields.intent === "buy") score += 12;
  if (fields.timeline === "now") score += 22;
  else if (fields.timeline === "0-3") score += 16;
  else if (fields.timeline === "3-6") score += 8;
  if (fields.preapproved && /yes|pre-?approved/i.test(fields.preapproved)) {
    score += 12;
  }
  if (fields.stage === "appointment") score += 18;
  return Math.min(100, score);
}

export function inferStage(fields: LeadFields, hasAppointment: boolean): string {
  if (fields.stage === "closed" || fields.stage === "archived") {
    return fields.stage;
  }
  if (hasAppointment) return "appointment";
  const hasContact = Boolean(fields.email?.trim() || fields.phone?.trim());
  const hasIntent = Boolean(fields.intent && fields.intent !== "other");
  if (hasContact && hasIntent) return "qualified";
  if (hasContact || hasIntent) return "engaged";
  return "new";
}
