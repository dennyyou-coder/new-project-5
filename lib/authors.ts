export type AuthorProfile = {
  slug: string;
  name: string;
  aliases: string[];
  type: "Person" | "Organization";
  role: string;
  bio: string[];
  covers: string[];
  image?: string;
  sameAs: string[];
};

export const AUTHORS: AuthorProfile[] = [
  {
    slug: "denny-you",
    name: "Denny You",
    aliases: ["You Denny", "游丹尼"],
    type: "Person",
    role: "Founder and editor, World Clean Biz",
    bio: [
      "Denny You (游丹尼) has worked in cleaning appliances for 20 years. He began in vacuum cleaner export sales, started writing about the industry in 2017 and later led product development at Glorison Innovation.",
      "He founded World Clean Biz and WCB Expo to connect brands, manufacturers, component suppliers and buyers across floor care, pool, lawn and commercial cleaning. He writes WCB's analysis and approves every news story before it is published."
    ],
    covers: ["Company strategy and ownership", "Chinese cleaning appliance makers", "Supply chains and OEM/ODM", "Trade policy and market shifts"],
    image: "/images/site-refresh/about/about-hero-denny.webp",
    sameAs: ["https://www.youtube.com/@WCBdenny"]
  },
  {
    slug: "wcb-editorial",
    name: "World Clean Biz Editorial",
    aliases: ["World Clean Biz", "WCB Editorial"],
    type: "Organization",
    role: "News desk",
    bio: [
      "The World Clean Biz news desk reports product launches, company results, regulation and market developments across the cleaning industry.",
      "Stories are written from company releases, regulatory documents and financial filings, and each one is approved by the editor, Denny You, before publication."
    ],
    covers: ["Product launches", "Quarterly and annual results", "Regulation and standards", "Trade shows and events"],
    sameAs: []
  }
];

/** The profile for a byline as it appears in content ("Denny You", "You Denny", "World Clean Biz Editorial"). */
export function authorFor(name: string | undefined): AuthorProfile {
  const key = (name ?? "").trim().toLowerCase();
  return (
    AUTHORS.find((author) => author.name.toLowerCase() === key || author.aliases.some((alias) => alias.toLowerCase() === key)) ??
    AUTHORS[1]
  );
}

export function authorHref(name: string | undefined) {
  return `/authors/${authorFor(name).slug}`;
}

export function getAuthor(slug: string) {
  return AUTHORS.find((author) => author.slug === slug);
}
