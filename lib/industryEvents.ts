/**
 * Trade shows that matter to the cleaning appliance industry, for the homepage events list and /events.
 * Dates were checked against the organisers' sites or announcements in November 2026; `confirmed: false`
 * marks dates that only come from listings and still need the organiser's confirmation.
 * Remove or update an event once it has passed; past events drop off the page automatically.
 */

export type IndustryEvent = {
  slug: string;
  name: string;
  /** ISO dates, local to the venue. */
  start: string;
  end: string;
  city: string;
  country: string;
  venue: string;
  focus: string;
  url: string;
  confirmed: boolean;
  /** WCB's own show, highlighted in lists. */
  wcb?: boolean;
};

export const INDUSTRY_EVENTS: IndustryEvent[] = [
  {
    slug: "issa-show-north-america-2026",
    name: "ISSA Show North America 2026",
    start: "2026-11-16",
    end: "2026-11-19",
    city: "Las Vegas",
    country: "United States",
    venue: "Mandalay Bay Convention Center",
    focus: "Commercial cleaning and facility care",
    url: "https://www.issashow.com/",
    confirmed: true
  },
  {
    slug: "pool-spa-patio-expo-2026",
    name: "International Pool | Spa | Patio Expo 2026",
    start: "2026-11-17",
    end: "2026-11-19",
    city: "New Orleans",
    country: "United States",
    venue: "Ernest N. Morial Convention Center",
    focus: "Pool equipment and pool robots",
    url: "https://www.poolspapatio.com/",
    confirmed: true
  },
  {
    slug: "piscine-global-europe-2026",
    name: "Piscine Global Europe 2026",
    start: "2026-11-17",
    end: "2026-11-20",
    city: "Lyon",
    country: "France",
    venue: "Eurexpo Lyon",
    focus: "Pool equipment and pool robots",
    url: "https://www.piscine-global-europe.com/",
    confirmed: true
  },
  {
    slug: "wcb-expo-2026",
    name: "WCB Expo 2026",
    start: "2026-11-18",
    end: "2026-11-20",
    city: "Suzhou",
    country: "China",
    venue: "Suzhou Shishan Convention Center",
    focus: "Cleaning appliances and their supply chains",
    url: "/wcb-expo",
    confirmed: true,
    wcb: true
  },
  {
    slug: "ces-2027",
    name: "CES 2027",
    start: "2027-01-06",
    end: "2027-01-09",
    city: "Las Vegas",
    country: "United States",
    venue: "Las Vegas Convention Center",
    focus: "Consumer tech, robot vacuums and smart home",
    url: "https://www.ces.tech/",
    confirmed: true
  },
  {
    slug: "awe-2027",
    name: "AWE 2027 (Appliance & Electronics World Expo)",
    start: "2027-03-17",
    end: "2027-03-20",
    city: "Shanghai",
    country: "China",
    venue: "Shanghai New International Expo Centre",
    focus: "Home appliances and consumer electronics",
    url: "https://www.awe.com.cn/",
    confirmed: true
  },
  {
    slug: "china-clean-expo-2027",
    name: "CCE 2027 (China Clean Expo)",
    start: "2027-03-30",
    end: "2027-04-02",
    city: "Shanghai",
    country: "China",
    venue: "Shanghai New International Expo Centre",
    focus: "Commercial cleaning equipment",
    url: "https://www.chinacleanexpo.com/",
    confirmed: true
  },
  {
    slug: "hk-electronics-fair-spring-2027",
    name: "Hong Kong Electronics Fair (Spring Edition) 2027",
    start: "2027-04-13",
    end: "2027-04-16",
    city: "Hong Kong",
    country: "China",
    venue: "Hong Kong Convention and Exhibition Centre",
    focus: "Consumer electronics and small appliances",
    url: "https://www.hktdc.com/event/hkelectronicsfairse/",
    confirmed: false
  },
  {
    slug: "canton-fair-spring-2027-phase-1",
    name: "Canton Fair, spring 2027 (Phase 1)",
    start: "2027-04-15",
    end: "2027-04-19",
    city: "Guangzhou",
    country: "China",
    venue: "China Import and Export Fair Complex",
    focus: "Household appliances, hardware and tools",
    url: "https://www.cantonfair.org.cn/",
    confirmed: false
  },
  {
    slug: "spoga-gafa-2027",
    name: "spoga+gafa 2027",
    start: "2027-06-15",
    end: "2027-06-17",
    city: "Cologne",
    country: "Germany",
    venue: "Koelnmesse",
    focus: "Garden, outdoor power and robotic mowers",
    url: "https://www.spogagafa.com/",
    confirmed: true
  },
  {
    slug: "ifa-2027",
    name: "IFA 2027",
    start: "2027-09-03",
    end: "2027-09-07",
    city: "Berlin",
    country: "Germany",
    venue: "Messe Berlin",
    focus: "Consumer electronics and home appliances",
    url: "https://www.ifa-berlin.com/",
    confirmed: true
  },
  {
    slug: "cms-berlin-2027",
    name: "CMS Berlin 2027",
    start: "2027-09-21",
    end: "2027-09-24",
    city: "Berlin",
    country: "Germany",
    venue: "Messe Berlin",
    focus: "Commercial cleaning and cleaning robots",
    url: "https://www.cms-berlin.de/en/",
    confirmed: true
  },
  {
    slug: "equip-exposition-2027",
    name: "Equip Exposition 2027",
    start: "2027-10-19",
    end: "2027-10-22",
    city: "Louisville",
    country: "United States",
    venue: "Kentucky Exposition Center",
    focus: "Outdoor power equipment and robotic mowers",
    url: "https://www.equipexposition.com/",
    confirmed: false
  },
  {
    slug: "interclean-amsterdam-2028",
    name: "Interclean Amsterdam 2028",
    start: "2028-04-04",
    end: "2028-04-07",
    city: "Amsterdam",
    country: "Netherlands",
    venue: "RAI Amsterdam",
    focus: "Commercial cleaning and hygiene",
    url: "https://www.intercleanshow.com/amsterdam/",
    confirmed: true
  }
];

/** "Today" at the venue is close enough to UTC for a list of multi-day shows. */
function isoDay(now: Date) {
  return now.toISOString().slice(0, 10);
}

/** Events that have not ended yet, soonest first. */
export function upcomingEvents(now = new Date(), limit?: number) {
  const today = isoDay(now);
  const events = INDUSTRY_EVENTS.filter((event) => event.end >= today).sort((a, b) => a.start.localeCompare(b.start));
  return limit ? events.slice(0, limit) : events;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const parts = (iso: string) => {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
};

/** "16–19 Nov 2026", "30 Mar – 2 Apr 2027". */
export function eventDateRange(event: Pick<IndustryEvent, "start" | "end">) {
  const a = parts(event.start);
  const b = parts(event.end);
  if (a.year === b.year && a.month === b.month) return `${a.day}–${b.day} ${MONTHS[b.month - 1]} ${b.year}`;
  if (a.year === b.year) return `${a.day} ${MONTHS[a.month - 1]} – ${b.day} ${MONTHS[b.month - 1]} ${b.year}`;
  return `${a.day} ${MONTHS[a.month - 1]} ${a.year} – ${b.day} ${MONTHS[b.month - 1]} ${b.year}`;
}

/** "November 2026": the heading an event is grouped under on /events. */
export function eventMonth(event: Pick<IndustryEvent, "start">) {
  const { year, month } = parts(event.start);
  return `${new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-GB", { month: "long", timeZone: "UTC" })} ${year}`;
}

/** Day and short month for a date badge. */
export function eventBadge(event: Pick<IndustryEvent, "start">) {
  const { month, day } = parts(event.start);
  return { day: String(day), month: MONTHS[month - 1] };
}
