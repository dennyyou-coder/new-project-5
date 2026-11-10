"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createLeadAttribution, trackLeadEvent, type LeadFormType } from "@/lib/leadTracking";
import { INTERESTS, NEEDS, ROLES, leadKindForForm, type ExpoRole, type LeadKind } from "@/lib/leads";

const ENV_FLAG = process.env.NEXT_PUBLIC_LEAD_FORMS === "wcb";

/** New forms are on when the site flag is set, and always on preview deployments and localhost. */
export function useNativeLeads() {
  const [native, setNative] = useState(ENV_FLAG);
  useEffect(() => {
    const host = window.location.hostname;
    if (host.endsWith(".vercel.app") || host === "localhost" || host === "127.0.0.1") setNative(true);
  }, []);
  return native;
}

function formTypeFor(kind: LeadKind, extra: { reportId?: string; need?: string; expoRole?: ExpoRole }): LeadFormType {
  if (kind === "subscribe") return extra.reportId ? "reports" : "newsletter";
  if (kind === "expo") return extra.expoRole === "exhibitor" ? "wce_exhibitor" : "wce_visitor";
  return extra.need === "supplier" ? "sourcing" : "contact";
}

type Status = { state: "idle" | "sending" | "done" | "error"; message?: string; field?: string };

function useLeadSubmit(kind: LeadKind, ctaLocation: string) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  async function submit(fields: Record<string, unknown>) {
    const attribution = createLeadAttribution({
      formType: formTypeFor(kind, fields as { reportId?: string; need?: string; expoRole?: ExpoRole }),
      sourcePage: window.location.pathname,
      ctaLocation,
      language: document.documentElement.lang || "en",
      search: window.location.search,
      reportId: String(fields.reportId ?? ""),
      inquiryType: String(fields.need ?? fields.expoRole ?? "")
    });
    setStatus({ state: "sending" });
    trackLeadEvent("form_submit", attribution);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, ctaLocation, sourcePage: window.location.pathname, startedAt: startedAt.current, ...fields })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        setStatus({ state: "error", message: data.error || "Something went wrong. Please try again.", field: data.field });
        trackLeadEvent("form_error", { ...attribution, error_reason: data.code || `status_${response.status}` });
        return false;
      }
      trackLeadEvent("form_success", { ...attribution, conversion_value: 1 });
      setStatus({ state: "done" });
      return true;
    } catch {
      setStatus({ state: "error", message: "Couldn't reach the server. Check your connection and try again." });
      return false;
    }
  }
  return { status, setStatus, submit };
}

function Honeypot() {
  return (
    <div className="wcb-lead-hp" aria-hidden="true">
      <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}

function FieldError({ status, field }: { status: Status; field?: string }) {
  if (status.state !== "error" || (field && status.field !== field) || (!field && status.field)) return null;
  return <p className="wcb-lead-error" role="alert">{status.message}</p>;
}

function Done({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="wcb-lead-done" role="status">
      <span className="wcb-lead-done-mark" aria-hidden="true">✓</span>
      <p className="wcb-lead-title">{title}</p>
      <p className="wcb-lead-note">{children}</p>
    </div>
  );
}

const honeypotValue = (form: HTMLFormElement) => (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";

/* 1. Subscribe: email first, then an optional profile in the same form. */
export function SubscribeForm({ ctaLocation, reportId, heading = "Get the WCB weekly brief" }: { ctaLocation: string; reportId?: string; heading?: string }) {
  const { status, setStatus, submit } = useLeadSubmit("subscribe", ctaLocation);
  const [step, setStep] = useState<"email" | "profile">("email");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [role, setRole] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setStatus({ state: "error", message: "Enter a valid email address", field: "email" });
    if (!consent) return setStatus({ state: "error", message: "Tick the box to receive WCB emails", field: "consent" });
    setStatus({ state: "idle" });
    setStep("profile");
  }
  async function finish(event: FormEvent<HTMLFormElement>, skip = false) {
    event.preventDefault();
    await submit({ email, consent, reportId, website: honeypotValue(event.currentTarget), ...(skip ? {} : { role, interests, name, company }) });
  }

  if (status.state === "done") {
    return (
      <Done title="You're subscribed">
        Welcome! A first email with this week&apos;s WCB stories is on its way to {email}{reportId ? ", with your report link" : ""}. The brief arrives every Friday.
      </Done>
    );
  }
  if (step === "email") {
    return (
      <form className="wcb-lead-form" onSubmit={next} noValidate>
        <p className="wcb-lead-title">{heading}</p>
        <p className="wcb-lead-note">Five stories and one analysis every Friday. Free, and you can unsubscribe any time.</p>
        <div className="wcb-lead-row">
          <label className="wcb-lead-sr" htmlFor={`sub-email-${ctaLocation}`}>Work email</label>
          <input id={`sub-email-${ctaLocation}`} type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={status.field === "email"} />
          <button className="wcb-lead-primary" type="submit">Subscribe</button>
        </div>
        <FieldError status={status} field="email" />
        <label className="wcb-lead-check">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>I agree to receive emails from World Clean Biz. See our <Link href="/privacy">privacy policy</Link>.</span>
        </label>
        <FieldError status={status} field="consent" />
      </form>
    );
  }
  return (
    <form className="wcb-lead-form" onSubmit={(event) => finish(event)} noValidate>
      <Honeypot />
      <p className="wcb-lead-title">One more step (optional)</p>
      <p className="wcb-lead-note">Tell us who you are and we&apos;ll send what matters to you.</p>
      <label className="wcb-lead-label">I am a
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="">Choose one</option>
          {ROLES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
      <fieldset className="wcb-lead-chips">
        <legend>Interested in</legend>
        {INTERESTS.map((item) => (
          <label key={item.value} className={interests.includes(item.value) ? "is-on" : undefined}>
            <input type="checkbox" checked={interests.includes(item.value)} onChange={(event) => setInterests(event.target.checked ? [...interests, item.value] : interests.filter((value) => value !== item.value))} />
            {item.label}
          </label>
        ))}
      </fieldset>
      <div className="wcb-lead-grid">
        <label className="wcb-lead-label">Name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="wcb-lead-label">Company<input autoComplete="organization" value={company} onChange={(event) => setCompany(event.target.value)} /></label>
      </div>
      <FieldError status={status} />
      <div className="wcb-lead-actions">
        <button className="wcb-lead-primary" type="submit" disabled={status.state === "sending"}>{status.state === "sending" ? "Sending…" : "Finish"}</button>
        <button className="wcb-lead-ghost" type="button" disabled={status.state === "sending"} onClick={(event) => finish(event as unknown as FormEvent<HTMLFormElement>, true)}>Skip</button>
      </div>
    </form>
  );
}

/* 2. Business inquiry */
export function InquiryForm({ ctaLocation, defaultNeed = "" }: { ctaLocation: string; defaultNeed?: string }) {
  const { status, submit } = useLeadSubmit("inquiry", ctaLocation);
  const [need, setNeed] = useState(defaultNeed);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await submit({
      need,
      name: data.get("name"),
      email: data.get("email"),
      company: data.get("company"),
      country: data.get("country"),
      category: data.get("category") || undefined,
      message: data.get("message"),
      subscribe: data.get("subscribe") === "on",
      consent: data.get("subscribe") === "on",
      website: data.get("website")
    });
  }
  if (status.state === "done") return <Done title="Thanks, we've got it">We usually reply within two working days. Replies come from the WCB team.</Done>;
  return (
    <form className="wcb-lead-form" onSubmit={onSubmit} noValidate>
      <Honeypot />
      <p className="wcb-lead-title">How can we help?</p>
      <label className="wcb-lead-label">I need to
        <select value={need} onChange={(event) => setNeed(event.target.value)} aria-invalid={status.field === "need"}>
          <option value="">Choose one</option>
          {NEEDS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </label>
      <FieldError status={status} field="need" />
      <div className="wcb-lead-grid">
        <label className="wcb-lead-label">Name<input name="name" autoComplete="name" aria-invalid={status.field === "name"} /></label>
        <label className="wcb-lead-label">Work email<input name="email" type="email" autoComplete="email" placeholder="name@company.com" aria-invalid={status.field === "email"} /></label>
        <label className="wcb-lead-label">Company<input name="company" autoComplete="organization" aria-invalid={status.field === "company"} /></label>
        <label className="wcb-lead-label">Country or region<input name="country" autoComplete="country-name" /></label>
      </div>
      <FieldError status={status} field="name" />
      <FieldError status={status} field="email" />
      <FieldError status={status} field="company" />
      {need === "supplier" ? (
        <label className="wcb-lead-label">Product category
          <select name="category" defaultValue="">
            <option value="">Choose one</option>
            {INTERESTS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </label>
      ) : null}
      <label className="wcb-lead-label">What do you need? <span className="wcb-lead-optional">Optional</span>
        <textarea name="message" rows={3} />
      </label>
      <label className="wcb-lead-check"><input type="checkbox" name="subscribe" /><span>Also send me the WCB weekly brief</span></label>
      <FieldError status={status} />
      <button className="wcb-lead-primary" type="submit" disabled={status.state === "sending"}>{status.state === "sending" ? "Sending…" : "Send"}</button>
    </form>
  );
}

/* 3. WCB Expo registration */
export function ExpoForm({ ctaLocation, defaultRole = "visitor" }: { ctaLocation: string; defaultRole?: ExpoRole }) {
  const { status, submit } = useLeadSubmit("expo", ctaLocation);
  const [expoRole, setExpoRole] = useState<ExpoRole>(defaultRole);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await submit({
      expoRole,
      name: data.get("name"),
      email: data.get("email"),
      company: data.get("company"),
      phone: data.get("phone"),
      subscribe: data.get("subscribe") === "on",
      consent: data.get("subscribe") === "on",
      website: data.get("website")
    });
  }
  if (status.state === "done") {
    return (
      <Done title={expoRole === "exhibitor" ? "Thanks, we'll be in touch" : "You're on the list"}>
        {expoRole === "exhibitor" ? "Our team will send booth options and the exhibitor pack shortly." : "We'll email your visitor details and reminders before 18 November."}
      </Done>
    );
  }
  return (
    <form className="wcb-lead-form" onSubmit={onSubmit} noValidate>
      <Honeypot />
      <p className="wcb-lead-title">Register for WCB Expo 2026</p>
      <p className="wcb-lead-note">18–20 November · Suzhou Shishan Convention Center</p>
      <div className="wcb-lead-toggle" role="radiogroup" aria-label="Register as">
        {(["visitor", "exhibitor"] as const).map((value) => (
          <button key={value} type="button" role="radio" aria-checked={expoRole === value} className={expoRole === value ? "is-on" : undefined} onClick={() => setExpoRole(value)}>
            {value === "visitor" ? "Visit" : "Exhibit"}
          </button>
        ))}
      </div>
      <div className="wcb-lead-grid">
        <label className="wcb-lead-label">Name<input name="name" autoComplete="name" aria-invalid={status.field === "name"} /></label>
        <label className="wcb-lead-label">Work email<input name="email" type="email" autoComplete="email" placeholder="name@company.com" aria-invalid={status.field === "email"} /></label>
        <label className="wcb-lead-label">Company<input name="company" autoComplete="organization" aria-invalid={status.field === "company"} /></label>
        <label className="wcb-lead-label">Phone or WeChat <span className="wcb-lead-optional">Optional</span><input name="phone" autoComplete="tel" /></label>
      </div>
      <FieldError status={status} field="name" />
      <FieldError status={status} field="email" />
      <FieldError status={status} field="company" />
      <label className="wcb-lead-check"><input type="checkbox" name="subscribe" /><span>Also send me the WCB weekly brief</span></label>
      <FieldError status={status} />
      <button className="wcb-lead-primary" type="submit" disabled={status.state === "sending"}>{status.state === "sending" ? "Sending…" : "Register"}</button>
    </form>
  );
}

/** The right new form for one of the old Tally form keys. */
export function WcbLeadForm({ form, ctaLocation, reportId, inquiryType }: { form: string; ctaLocation: string; reportId?: string; inquiryType?: string }) {
  const mapped = leadKindForForm(form);
  if (mapped.kind === "subscribe") return <SubscribeForm ctaLocation={ctaLocation} reportId={reportId} heading={form === "reports" ? "Get the free WCB reports" : undefined} />;
  if (mapped.kind === "expo") return <ExpoForm ctaLocation={ctaLocation} defaultRole={mapped.expoRole} />;
  const need = mapped.need ?? (inquiryType === "media" ? "media" : inquiryType === "correction" ? "correction" : inquiryType === "general" ? "partnership" : "");
  return <InquiryForm ctaLocation={ctaLocation} defaultNeed={need} />;
}

/** A modal holding one form, opened from an existing call-to-action button. */
export function WcbLeadDialog({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  return (
    <dialog ref={ref} className="wcb-lead-dialog" onClose={onClose} onClick={(event) => { if (event.target === ref.current) ref.current?.close(); }}>
      <div className="wcb-lead-dialog-body">
        <button className="wcb-lead-close" type="button" aria-label="Close" onClick={() => ref.current?.close()}>×</button>
        {children}
      </div>
    </dialog>
  );
}
