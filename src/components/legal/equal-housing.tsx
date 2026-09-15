import { cn } from "@/lib/utils";

export function EqualHousingMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("size-9", className)}
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="4" className="fill-navy" />
      <path
        d="M8 22.5 24 10l16 12.5V38H8V22.5Z"
        className="fill-none stroke-paper"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 28h16M16 32.5h16"
        className="stroke-paper"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
