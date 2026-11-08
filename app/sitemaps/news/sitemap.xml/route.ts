import { buildNewsSitemap } from "@/lib/feeds";

export const revalidate = 1800;

export function GET() {
  return new Response(buildNewsSitemap(), {
    headers: { "content-type": "application/xml; charset=utf-8" }
  });
}
