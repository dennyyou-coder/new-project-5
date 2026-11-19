"use client";

import { TallyButton } from "@/components/LeadForms";
import { SubscribeForm, useNativeLeads } from "@/components/leads/WcbLeadForms";
import type { TopicFollow as TopicFollowData } from "@/lib/topics";

/**
 * "Follow this topic" signup. It uses the normal newsletter list; the topic is
 * recorded through the CTA location and source page, so no separate list is needed.
 */
export function TopicFollow({ follow, ctaLocation }: { follow: TopicFollowData; ctaLocation: string }) {
  const native = useNativeLeads();
  return (
    <aside className="topic-follow" aria-label={follow.heading}>
      {native ? (
        <SubscribeForm ctaLocation={ctaLocation} heading={follow.heading} note={follow.note} />
      ) : (
        <>
          <p className="wcb-lead-title">{follow.heading}</p>
          <p className="wcb-lead-note">{follow.note}</p>
          <TallyButton form="newsletter" ctaLocation={ctaLocation}>Get updates</TallyButton>
        </>
      )}
    </aside>
  );
}
