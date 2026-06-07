"use client";

import Link from "next/link";
import { TallyButton } from "@/components/LeadForms";

export function HomeUpdatesForm() {
  return (
    <div className="home-v4-email-form">
      <label>Email Address</label>
      <div>
        <TallyButton form="reports">
          Get Industry Signals
        </TallyButton>
      </div>
      <Link className="button-secondary" href="/insights">
        Explore Signals
      </Link>
    </div>
  );
}
