import { buildRss, feedItems } from "@/lib/feeds";

export const revalidate = 3600;

export function GET() {
  return new Response(buildRss(feedItems()), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" }
  });
}
