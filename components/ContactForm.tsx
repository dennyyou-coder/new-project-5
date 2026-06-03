"use client";

import { FormEvent, useState } from "react";

const inquiryTypes = [
  "Industry Information",
  "Sourcing / OEM",
  "Market Reports",
  "World Clean Expo",
  "Media Cooperation",
  "General Cooperation"
];

export function ContactForm() {
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(
      `World Clean Biz inquiry: ${data.get("inquiryType") || "General"}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${data.get("name") || ""}`,
        `Company: ${data.get("company") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Country: ${data.get("country") || ""}`,
        `Inquiry Type: ${data.get("inquiryType") || ""}`,
        "",
        `${data.get("message") || ""}`
      ].join("\n")
    );

    window.location.href = `mailto:denny@worldcleanbiz.com?subject=${subject}&body=${body}`;
    setStatus("Your email client should open with the inquiry details.");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" placeholder="Your name" required />
      </label>
      <label>
        Company
        <input name="company" placeholder="Company or organization" required />
      </label>
      <label>
        Email
        <input name="email" placeholder="name@company.com" type="email" required />
      </label>
      <label>
        Country
        <input name="country" placeholder="Country or region" required />
      </label>
      <label>
        Inquiry Type
        <select name="inquiryType" required>
          {inquiryTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <label>
        Message
        <textarea
          name="message"
          placeholder="Share the category, market, business question, timeline, or cooperation idea you want to discuss."
          required
        />
      </label>
      <button className="button" type="submit">
        Send Message
      </button>
      {status ? (
        <p className="form-status" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
