"use client";

import { TallyButton } from "@/components/LeadForms";
import { SubscribeForm, useNativeLeads } from "@/components/leads/WcbLeadForms";
import type { TopicFollow as TopicFollowData } from "@/lib/topics";

/**
 * "Follow this topic" signup. The reader joins the newsletter and, when the topic
 * has a Brevo list, that topic's list too; topic updates go out in the Friday brief.
 * `compact` is the one-line version placed near the top of an article or topic page.
 */
export function TopicFollow({ follow, topic, ctaLocation, compact = false }: { follow: TopicFollowData; topic: string; ctaLocation: string; compact?: boolean }) {
  const native = useNativeLeads();
  const heading = compact ? follow.short ?? follow.heading : follow.heading;
  return (
    <aside className={`topic-follow${compact ? " topic-follow--compact" : ""}`} aria-label={follow.heading}>
      {native ? (
        <SubscribeForm ctaLocation={ctaLocation} topic={topic} compact={compact} heading={heading} note={compact ? "" : follow.note} />
      ) : (
        <>
          <p className="wcb-lead-title">{heading}</p>
          {compact ? null : <p className="wcb-lead-note">{follow.note}</p>}
          <TallyButton form="newsletter" ctaLocation={ctaLocation}>Get updates</TallyButton>
        </>
      )}
    </aside>
  );
}
