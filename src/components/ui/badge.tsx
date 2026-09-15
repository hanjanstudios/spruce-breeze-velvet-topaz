import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "muted",
  ...props
}: React.ComponentProps<"span"> & {
  tone?: "muted" | "navy" | "sage" | "warm" | "danger";
}) {
  const tones = {
    muted: "bg-paper-deep text-ink-soft",
    navy: "bg-navy/10 text-navy",
    sage: "bg-sage/12 text-sage",
    warm: "bg-paper text-ink-soft border border-line",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
