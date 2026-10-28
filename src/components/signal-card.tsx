import { cn } from "cn";
import type { ReactNode } from "react";

type Tone = "live" | "wait" | "down";

export function SignalCard({
  label,
  status,
  tone,
  children,
}: {
  label: string;
  status: string;
  tone: Tone;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "flex min-h-64 flex-col rounded-2xl border bg-card px-5 py-5 sm:px-6",
        tone === "down" ? "border-destructive/45" : "border-border",
      )}
      aria-busy={tone === "wait"}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          {label}
        </h2>
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase">
          <span
            className={cn(
              "size-1.5 rounded-full",
              tone === "live" && "bg-signal shadow-[0_0_0_4px] shadow-signal/15",
              tone === "wait" && "animate-pulse bg-muted-foreground/50",
              tone === "down" && "bg-destructive",
            )}
            aria-hidden
          />
          {status}
        </p>
      </div>
      <div className="mt-8 flex flex-1 flex-col">{children}</div>
    </section>
  );
}
