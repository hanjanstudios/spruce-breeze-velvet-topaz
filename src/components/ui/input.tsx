import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-line bg-paper px-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-navy/50 focus:ring-2 focus:ring-navy/15",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md border border-line bg-paper px-3.5 py-3 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-navy/50 focus:ring-2 focus:ring-navy/15",
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("block text-sm font-medium text-ink-soft", className)}
      {...props}
    />
  );
}
