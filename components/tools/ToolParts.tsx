"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { ToolId } from "@/lib/tools/catalog";

type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;

export function trackTool(name: string, tool: ToolId, extra: Record<string, unknown> = {}) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag === "function") gtag("event", name, { tool, ...extra });
}

/** Fires `tool_use` once, the first time the reader changes an input. */
export function useFirstUse(tool: ToolId) {
  const used = useRef(false);
  return () => {
    if (used.current) return;
    used.current = true;
    trackTool("tool_use", tool);
  };
}

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  prefix,
  step = "any",
  hint
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  prefix?: string;
  step?: string;
  hint?: string;
}) {
  return (
    <label className="tool-field">
      <span className="tool-label">{label}</span>
      <span className="tool-input">
        {prefix ? <span className="tool-affix">{prefix}</span> : null}
        <input type="number" inputMode="decimal" min="0" step={step} value={value} onChange={(event) => onChange(event.target.value)} />
        {suffix ? <span className="tool-affix">{suffix}</span> : null}
      </span>
      {hint ? <span className="tool-hint">{hint}</span> : null}
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="tool-field">
      <span className="tool-label">{label}</span>
      <select className="tool-select" value={value} onChange={(event) => onChange(event.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="tool-field" role="group" aria-label={label}>
      <span className="tool-label">{label}</span>
      <span className="tool-segmented">
        {options.map((option) => (
          <button key={option.value} type="button" className={option.value === value ? "is-on" : undefined} aria-pressed={option.value === value} onClick={() => onChange(option.value)}>
            {option.label}
          </button>
        ))}
      </span>
    </div>
  );
}

export function ResultRow({ label, value, note, strong }: { label: ReactNode; value: ReactNode; note?: ReactNode; strong?: boolean }) {
  return (
    <div className={strong ? "tool-row is-strong" : "tool-row"}>
      <span className="tool-row-label">
        {label}
        {note ? <small>{note}</small> : null}
      </span>
      <span className="tool-row-value">{value}</span>
    </div>
  );
}

/** "Email me this result", with an unticked opt-in to the weekly brief. */
export function ToolEmailForm({ tool, inputs, label = "Email me this result" }: { tool: ToolId; inputs: Record<string, unknown>; label?: string }) {
  const [email, setEmail] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [state, setState] = useState<{ status: "idle" | "sending" | "done" | "error"; message?: string }>({ status: "idle" });
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setState({ status: "error", message: "Enter a valid email address" });
    const website = (event.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    setState({ status: "sending" });
    try {
      const response = await fetch("/api/tools/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tool, email, subscribe, inputs, website, startedAt: startedAt.current })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) return setState({ status: "error", message: data.error || "Something went wrong. Please try again." });
      trackTool("tool_email", tool, { subscribed: subscribe });
      setState({ status: "done" });
    } catch {
      setState({ status: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  if (state.status === "done") {
    return (
      <div className="tool-email is-done" role="status">
        <strong>Sent to {email}</strong>
        <span>{subscribe ? "You're also subscribed to the WCB weekly brief." : "Check your inbox in a minute or two."}</span>
      </div>
    );
  }
  return (
    <form className="tool-email" onSubmit={send} noValidate>
      <span className="tool-label">{label}</span>
      <div className="tool-email-row">
        <label className="wcb-lead-sr" htmlFor={`tool-email-${tool}`}>Email</label>
        <input id={`tool-email-${tool}`} type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} />
        <button type="submit" disabled={state.status === "sending"}>{state.status === "sending" ? "Sending…" : "Send"}</button>
      </div>
      <div className="wcb-lead-hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="tool-check">
        <input type="checkbox" checked={subscribe} onChange={(event) => setSubscribe(event.target.checked)} />
        <span>Also send me the free WCB weekly brief. <Link href="/privacy">Privacy</Link></span>
      </label>
      {state.status === "error" ? <p className="tool-error" role="alert">{state.message}</p> : null}
    </form>
  );
}
