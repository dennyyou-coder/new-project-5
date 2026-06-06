"use client";

import { FormEvent, useState } from "react";

const recipient = "denny@worldcleanbiz.com";

function submitMailto(
  event: FormEvent<HTMLFormElement>,
  subjectPrefix: string,
  fields: string[]
) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(subjectPrefix);
  const body = encodeURIComponent(
    fields
      .map((field) => `${field}: ${data.get(field) || ""}`)
      .join("\n")
  );

  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
}

export function ReportsLeadForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    submitMailto(event, "World Clean Biz report request", ["Email"]);
    setStatus("Your email client should open with the report request.");
  }

  return (
    <form className="reports-v1-hero-form" onSubmit={handleSubmit}>
      <label htmlFor="reports-v1-email">Email address</label>
      <div>
        <input
          id="reports-v1-email"
          name="Email"
          placeholder="name@company.com"
          required
          type="email"
        />
        <button type="submit">Get Free Reports</button>
      </div>
      <p>Enter your email to receive the download link.</p>
      {status ? (
        <p className="form-status" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}

export function ExpoLeadForm({ roles }: { roles: string[] }) {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    submitMailto(event, "World Clean Expo update request", [
      "Email",
      "Company",
      "Country",
      "Role"
    ]);
    setStatus("Your email client should open with the expo update request.");
  }

  return (
    <form className="form expo-interest-form expo-capture-form" onSubmit={handleSubmit}>
      <label>
        Email
        <input name="Email" placeholder="name@company.com" type="email" required />
      </label>
      <label>
        Company
        <input name="Company" placeholder="Company name" required />
      </label>
      <label>
        Country
        <input name="Country" placeholder="Country or region" required />
      </label>
      <label>
        Role
        <select name="Role" required>
          {roles.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <button className="button" type="submit">
        Get Expo Updates
      </button>
      {status ? (
        <p className="form-status" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}

export function NewsletterLeadForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    submitMailto(event, "World Clean Biz newsletter and report request", ["Email"]);
    setStatus("Your email client should open with the request.");
  }

  return (
    <form className="insights-newsletter-cta" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">Newsletter & Reports</p>
        <h2>Stay Ahead Of The Cleaning Industry</h2>
        <p>
          Get field-informed signals, analysis and free market reports straight
          to your inbox.
        </p>
      </div>
      <div className="newsletter-form-row">
        <input aria-label="Email Address" name="Email" placeholder="Email Address" type="email" required />
        <button className="button" type="submit">
          Get Free Reports
        </button>
      </div>
      {status ? (
        <p className="form-status" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
