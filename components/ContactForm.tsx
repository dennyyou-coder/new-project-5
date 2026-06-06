"use client";

import { FormEvent, useEffect, useState } from "react";

const inquiryTypes = [
  "Sourcing Inquiry",
  "Expo Inquiry",
  "Media Inquiry",
  "General Inquiry"
];

const inquiryTypeMap: Record<string, string> = {
  sourcing: "Sourcing Inquiry",
  expo: "Expo Inquiry",
  media: "Media Inquiry",
  general: "General Inquiry"
};

export function ContactForm() {
  const [inquiryType, setInquiryType] = useState("Sourcing Inquiry");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (type && inquiryTypeMap[type]) {
      setInquiryType(inquiryTypeMap[type]);
    }
  }, []);

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
        `Website: ${data.get("website") || ""}`,
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
        Website / Product Category / Event Name
        <input
          name="website"
          placeholder="Optional: website, category, or event name"
        />
      </label>
      <label>
        Inquiry Type
        <select
          name="inquiryType"
          onChange={(event) => setInquiryType(event.target.value)}
          required
          value={inquiryType}
        >
          {inquiryTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <label>
        Message
        <textarea
          name="message"
          placeholder="Share your sourcing need, expo interest, media request, industry information, timeline, or cooperation idea."
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
