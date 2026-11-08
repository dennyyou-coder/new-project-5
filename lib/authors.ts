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
    role: "Founder of WCB Expo and World Clean Biz · China's most influential cleaning-industry blogger · 20 years in cleaning appliances",
    bio: [
      "Denny You (游丹尼) is China's most influential cleaning-industry blogger and the founder of WCB Expo, the cleaning appliance industry conference and supply-chain exhibition held in Suzhou. He has worked in cleaning appliances for 20 years.",
      "He began in vacuum cleaner export sales, selling more than a million units, started writing about the industry in 2017 and later led product development at Glorison Innovation. Through his articles, videos, forums and trade shows he connects brands, manufacturers, component suppliers and buyers across floor care, pool, lawn and commercial cleaning.",
      "He founded World Clean Biz, writes its analysis and approves every news story before it is published."
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
