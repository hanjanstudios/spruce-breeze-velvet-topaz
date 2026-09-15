import { AGENT } from "@/lib/brand";

const ZONE = AGENT.timezone;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function zoneParts(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = fmt.formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  let hour = Number(get("hour"));
  if (get("hour") === "24") hour = 0;
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: get("weekday"),
    hour,
    minute: Number(get("minute")),
  };
}

/** Convert a Pacific wall-clock date+time into a UTC Date. */
export function pacificWallToUtc(ymd: string, hm: string): Date {
  const [year, month, day] = ymd.split("-").map(Number);
  const [hour, minute] = hm.split(":").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const shown = zoneParts(new Date(utcGuess));
  const shownUtc = Date.UTC(
    shown.year,
    shown.month - 1,
    shown.day,
    shown.hour,
    shown.minute,
    0,
  );
  return new Date(utcGuess - (shownUtc - utcGuess));
}

export function formatPacific(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    timeZone: ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function ymdInPacific(date: Date): string {
  const p = zoneParts(date);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function addPacificDays(from: Date, days: number): string {
  const p = zoneParts(from);
  const utc = Date.UTC(p.year, p.month - 1, p.day + days);
  return ymdInPacific(new Date(utc));
}

const WEEKDAY_SLOTS: Record<string, string[]> = {
  Tue: ["10:00", "11:00", "13:00", "14:30", "16:00"],
  Wed: ["10:00", "11:00", "13:00", "14:30", "16:00"],
  Thu: ["10:00", "11:00", "13:00", "14:30", "16:00"],
  Fri: ["10:00", "11:00", "13:00", "14:30", "16:00"],
  Sat: ["09:00", "10:30", "12:00"],
};

export type OpenSlot = {
  startsAt: string;
  ymd: string;
  hm: string;
  label: string;
  dayLabel: string;
};

export function buildOpenSlots(
  takenIso: string[],
  now = new Date(),
): OpenSlot[] {
  const taken = new Set(takenIso.map((s) => new Date(s).toISOString()));
  const slots: OpenSlot[] = [];
  for (let i = 0; i < 16; i += 1) {
    const ymd = addPacificDays(now, i);
    const noon = pacificWallToUtc(ymd, "12:00");
    const weekday = zoneParts(noon).weekday;
    const hours = WEEKDAY_SLOTS[weekday];
    if (!hours) continue;
    const dayLabel = new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE,
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(noon);
    for (const hm of hours) {
      const starts = pacificWallToUtc(ymd, hm);
      if (starts.getTime() < now.getTime() + 2 * 60 * 60 * 1000) continue;
      if (taken.has(starts.toISOString())) continue;
      slots.push({
        startsAt: starts.toISOString(),
        ymd,
        hm,
        dayLabel,
        label: new Intl.DateTimeFormat("en-US", {
          timeZone: ZONE,
          hour: "numeric",
          minute: "2-digit",
        }).format(starts),
      });
    }
  }
  return slots;
}
