const SITE = "https://worldcleanbiz.com";

/** Dataset markup for a tracker page, so search engines can list it as a data source. */
export function DatasetSchema({
  name,
  description,
  path,
  updated,
  from,
  sources,
  keywords
}: {
  name: string;
  description: string;
  path: string;
  updated: string;
  from: string;
  sources: { name: string; url: string }[];
  keywords: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url: `${SITE}${path}`,
    dateModified: updated,
    temporalCoverage: `${from}/${updated}`,
    isAccessibleForFree: true,
    inLanguage: "en",
    keywords,
    creator: { "@type": "Organization", name: "World Clean Biz", url: SITE },
    publisher: { "@type": "Organization", name: "World Clean Biz", url: SITE },
    isBasedOn: sources.map((source) => ({ "@type": "CreativeWork", name: source.name, url: source.url }))
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />;
}

/** One line telling readers they may quote the tracker and how to credit it. */
export function CiteNote({ name, path }: { name: string; path: string }) {
  return (
    <p className="radar-cite">
      Free to quote with a link. Cite as: {name}, World Clean Biz, worldcleanbiz.com{path}
    </p>
  );
}
