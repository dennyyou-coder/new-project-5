import type { Metadata } from "next";
import Link from "next/link";
import { SiteIndexHero } from "@/components/SiteIndexList";
import { eventDateRange, eventMonth, upcomingEvents, type IndustryEvent } from "@/lib/industryEvents";
import "../styles/trust.css";
import "../styles/events.css";

export const metadata: Metadata = {
  title: "Cleaning Industry Events Calendar 2026–2027",
  description:
    "Trade shows for cleaning appliances, robot vacuums, pool robots, robotic mowers and commercial cleaning: CES, AWE, CCE, IFA, CMS Berlin, spoga+gafa, WCB Expo and more, with dates and venues.",
  alternates: { canonical: "/events" }
};

// Past shows drop off without a deploy.
export const revalidate = 21600;

export default function EventsPage() {
  const events = upcomingEvents();
  const months = new Map<string, IndustryEvent[]>();
  for (const event of events) {
    const month = eventMonth(event);
    months.set(month, [...(months.get(month) ?? []), event]);
  }
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.name,
        startDate: event.start,
        endDate: event.end,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: { "@type": "Place", name: event.venue, address: `${event.city}, ${event.country}` },
        url: event.url.startsWith("/") ? `https://worldcleanbiz.com${event.url}` : event.url
      }
    }))
  };

  return (
    <div className="trust-page events-page">
      <SiteIndexHero
        title="Cleaning industry events"
        lead="The trade shows where cleaning appliance, robot, pool, outdoor and commercial cleaning companies launch products and meet buyers."
      />
      <section className="section">
        <div className="container events-list">
          {[...months].map(([month, items]) => (
            <section key={month} className="events-month" aria-labelledby={`m-${month.replace(/\s/g, "-")}`}>
              <h2 id={`m-${month.replace(/\s/g, "-")}`}>{month}</h2>
              <ul>
                {items.map((event) => (
                  <li key={event.slug} className={event.wcb ? "events-item is-wcb" : "events-item"}>
                    <span className="events-date">{eventDateRange(event)}</span>
                    <span className="events-body">
                      {event.url.startsWith("/") ? (
                        <Link className="events-name" href={event.url}>{event.name}</Link>
                      ) : (
                        <a className="events-name" href={event.url} target="_blank" rel="noopener noreferrer">{event.name}</a>
                      )}
                      <span className="events-place">{event.venue} · {event.city}, {event.country}</span>
                      <span className="events-focus">{event.focus}</span>
                      {event.confirmed ? null : <span className="events-tbc">Dates to be confirmed by the organiser</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="events-note">
            Dates come from the organisers&apos; websites and announcements. Check the official site before you book travel.
            Missing a show? <Link href="/contact">Tell us</Link>.
          </p>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
