import { NextResponse, type NextRequest } from "next/server";
import { encodeQuerySegment, listingPairs } from "@/lib/queryRoute";

/** Filtered listing requests are served from a cacheable internal path (see lib/queryRoute.ts). */
export function middleware(request: NextRequest) {
  const pairs = listingPairs(request.nextUrl.searchParams);
  if (!pairs.length) return NextResponse.next();
  const target = request.nextUrl.clone();
  target.pathname = `${request.nextUrl.pathname.replace(/\/$/, "")}/q/${encodeQuerySegment(pairs)}`;
  target.search = "";
  return NextResponse.rewrite(target);
}

export const config = {
  matcher: ["/news", "/blog/archive", "/guides", "/guides/:type"]
};
