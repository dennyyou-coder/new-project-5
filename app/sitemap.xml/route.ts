const sitemapUrls = [
  "https://worldcleanbiz.com/sitemaps/blog/sitemap.xml",
  "https://worldcleanbiz.com/sitemaps/discovery/sitemap.xml",
  "https://worldcleanbiz.com/sitemaps/brands/sitemap.xml",
  "https://worldcleanbiz.com/sitemaps/technical/sitemap.xml"
];

export function GET() {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapUrls.map((url) => `  <sitemap><loc>${url}</loc></sitemap>`),
    "</sitemapindex>"
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
}
