const siteUrl = "https://worldcleanbiz.com";

export type CollectionItem = { name: string; url?: string };

const absolute = (url: string) => (url.startsWith("http") ? url : `${siteUrl}${url}`);

// CollectionPage + ItemList + BreadcrumbList for list pages. Items without a URL are listed by name only.
export function buildCollectionSchemas({ name, description, path, items }: { name: string; description: string; path: string; items: readonly CollectionItem[] }) {
  const url = `${siteUrl}${path}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": url,
      name,
      description,
      url,
      isPartOf: { "@type": "WebSite", name: "World Clean Biz", url: siteUrl },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, ...(item.url ? { url: absolute(item.url) } : {}) }))
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name, item: url }
      ]
    }
  ];
}
