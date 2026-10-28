"use client";

import { SignalCard } from "@/components/signal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { HelloResponse } from "@/lib/hello";
import { useCallback, useRef, useState } from "react";

type Phase =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "live"; data: HelloResponse; elapsedMs: number }
  | { status: "down"; detail: string };

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function StackCheck() {
  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>({ status: "idle" });
  const requestId = useRef(0);

  const load = useCallback(async (nextName: string, target: "hello" | "missing") => {
    const id = ++requestId.current;
    const started = performance.now();
    const params = new URLSearchParams();
    const trimmed = nextName.trim();
    if (trimmed && target === "hello") params.set("name", trimmed);
    const path = target === "hello" ? "/api/hello" : "/api/missing";
    const url = params.size > 0 ? `${path}?${params}` : path;

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (id !== requestId.current) return;
      if (!response.ok) {
        setPhase({
          status: "down",
          detail:
            target === "missing"
              ? "Preview only. /api/missing is not a real route, so this is the failure state. Ask the backend again to recover."
              : `The backend replied with HTTP ${response.status}.`,
        });
        return;
      }

      const data = (await response.json()) as Partial<HelloResponse>;
      if (id !== requestId.current) return;
      if (!data.message || !data.time || !data.node) {
        setPhase({
          status: "down",
          detail: "The backend replied, but not with a hello payload.",
        });
        return;
      }

      setPhase({
        status: "live",
        data: data as HelloResponse,
        elapsedMs: Math.max(1, Math.round(performance.now() - started)),
      });
    } catch {
      if (id !== requestId.current) return;
      setPhase({
        status: "down",
        detail: "The request never reached the backend. The frontend is still running.",
      });
    }
  }, []);

  function ask(nextName: string, target: "hello" | "missing") {
    setPhase({ status: "loading" });
    void load(nextName, target);
  }

  const tone = phase.status === "live" ? "live" : phase.status === "down" ? "down" : "wait";
  const status =
    phase.status === "live"
      ? "Live"
      : phase.status === "down"
        ? "No reply"
        : phase.status === "loading"
          ? "Asking"
          : "Waiting";

  return (
    <div className="mt-10 flex flex-col gap-6">
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <SignalCard label="Frontend" status="Rendering" tone="live">
          <p className="font-serif text-3xl leading-tight tracking-tight">Hello from the frontend.</p>
          <p className="mt-auto pt-8 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            React · painted in the browser
          </p>
        </SignalCard>

        <SignalCard label="Backend" status={status} tone={tone}>
          <div aria-live="polite" className="flex flex-1 flex-col">
            {phase.status === "idle" ? (
              <>
                <p className="font-serif text-3xl leading-tight tracking-tight">Waiting for a request.</p>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                  Ask the backend. The reply, the Node version, and the time come back from{" "}
                  <span className="font-mono whitespace-nowrap text-foreground">GET&nbsp;/api/hello</span>.
                </p>
              </>
            ) : null}
            {phase.status === "loading" ? (
              <p className="font-serif text-3xl leading-tight tracking-tight text-muted-foreground">
                Asking the backend…
              </p>
            ) : null}
            {phase.status === "live" ? (
              <>
                <p className="font-serif text-3xl leading-tight tracking-tight">{phase.data.message}</p>
                <ul className="mt-auto space-y-1 pt-8 font-mono text-xs leading-6 text-muted-foreground">
                  <li>
                    <span className="tracking-[0.14em] uppercase">Runtime </span>
                    <span className="text-foreground">{phase.data.node}</span>
                  </li>
                  <li>
                    <span className="tracking-[0.14em] uppercase">Round trip </span>
                    <span className="text-foreground">{phase.elapsedMs} ms</span>
                  </li>
                  <li>
                    <span className="tracking-[0.14em] uppercase">Replied </span>
                    <span className="text-foreground">{formatWhen(phase.data.time)}</span>
                  </li>
                </ul>
                <details className="mt-5">
                  <summary className="cursor-pointer font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                    Response JSON
                  </summary>
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-muted p-3 text-xs leading-5 text-foreground">
                    {JSON.stringify(phase.data, null, 2)}
                  </pre>
                </details>
              </>
            ) : null}
            {phase.status === "down" ? (
              <>
                <p className="font-serif text-3xl leading-tight tracking-tight">The frontend is up.</p>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{phase.detail}</p>
              </>
            ) : null}
          </div>
        </SignalCard>
      </div>

      <form
        className="flex flex-col gap-3 lg:flex-row lg:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          void ask(name, "hello");
        }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <label
            htmlFor="name"
            className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase"
          >
            Name to send
          </label>
          <Input
            id="name"
            name="name"
            value={name}
            maxLength={40}
            autoComplete="name"
            placeholder="Optional"
            onChange={(event) => setName(event.target.value)}
            className="h-11 bg-card px-3"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="submit"
            size="lg"
            className="h-11 w-full px-4 sm:flex-1 lg:w-auto lg:flex-none"
            disabled={phase.status === "loading"}
          >
            {phase.status === "loading"
              ? "Asking…"
              : phase.status === "down"
                ? "Try the backend again"
                : phase.status === "live"
                  ? "Ask the backend again"
                  : "Ask the backend"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-11 w-full px-4 sm:flex-1 lg:w-auto lg:flex-none"
            disabled={phase.status === "loading"}
            onClick={() => void ask(name, "missing")}
          >
            Show the error state
          </Button>
        </div>
      </form>
    </div>
  );
}
