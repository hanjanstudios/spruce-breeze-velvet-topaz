import { t as AGENT } from "./brand-DfHBys0n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/time-CBApnNHP.js
var ZONE = AGENT.timezone;
function pad(n) {
	return String(n).padStart(2, "0");
}
function zoneParts(date) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);
	const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
	let hour = Number(get("hour"));
	if (get("hour") === "24") hour = 0;
	return {
		year: Number(get("year")),
		month: Number(get("month")),
		day: Number(get("day")),
		weekday: get("weekday"),
		hour,
		minute: Number(get("minute"))
	};
}
/** Convert a Pacific wall-clock date+time into a UTC Date. */
function pacificWallToUtc(ymd, hm) {
	const [year, month, day] = ymd.split("-").map(Number);
	const [hour, minute] = hm.split(":").map(Number);
	const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
	const shown = zoneParts(new Date(utcGuess));
	const shownUtc = Date.UTC(shown.year, shown.month - 1, shown.day, shown.hour, shown.minute, 0);
	return new Date(utcGuess - (shownUtc - utcGuess));
}
function formatPacific(date) {
	const d = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("en-US", {
		timeZone: ZONE,
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(d);
}
function ymdInPacific(date) {
	const p = zoneParts(date);
	return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}
function addPacificDays(from, days) {
	const p = zoneParts(from);
	const utc = Date.UTC(p.year, p.month - 1, p.day + days);
	return ymdInPacific(new Date(utc));
}
var WEEKDAY_SLOTS = {
	Tue: [
		"10:00",
		"11:00",
		"13:00",
		"14:30",
		"16:00"
	],
	Wed: [
		"10:00",
		"11:00",
		"13:00",
		"14:30",
		"16:00"
	],
	Thu: [
		"10:00",
		"11:00",
		"13:00",
		"14:30",
		"16:00"
	],
	Fri: [
		"10:00",
		"11:00",
		"13:00",
		"14:30",
		"16:00"
	],
	Sat: [
		"09:00",
		"10:30",
		"12:00"
	]
};
function buildOpenSlots(takenIso, now = /* @__PURE__ */ new Date()) {
	const taken = new Set(takenIso.map((s) => new Date(s).toISOString()));
	const slots = [];
	for (let i = 0; i < 16; i += 1) {
		const ymd = addPacificDays(now, i);
		const noon = pacificWallToUtc(ymd, "12:00");
		const hours = WEEKDAY_SLOTS[zoneParts(noon).weekday];
		if (!hours) continue;
		const dayLabel = new Intl.DateTimeFormat("en-US", {
			timeZone: ZONE,
			weekday: "long",
			month: "long",
			day: "numeric"
		}).format(noon);
		for (const hm of hours) {
			const starts = pacificWallToUtc(ymd, hm);
			if (starts.getTime() < now.getTime() + 72e5) continue;
			if (taken.has(starts.toISOString())) continue;
			slots.push({
				startsAt: starts.toISOString(),
				ymd,
				hm,
				dayLabel,
				label: new Intl.DateTimeFormat("en-US", {
					timeZone: ZONE,
					hour: "numeric",
					minute: "2-digit"
				}).format(starts)
			});
		}
	}
	return slots;
}
//#endregion
export { formatPacific as n, buildOpenSlots as t };
