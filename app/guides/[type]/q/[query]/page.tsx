import { decodeQuerySegment } from "@/lib/queryRoute";
import { GuideTypeListing, guideTypeListingMetadata } from "../../listing";

// A filtered guide-type view, rendered on first request and cached; middleware.ts routes ?page URLs here.
export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ type: string; query: string }> };

export async function generateMetadata({ params }: Props) {
  const { type, query } = await params;
  return guideTypeListingMetadata({ params: Promise.resolve({ type }), searchParams: Promise.resolve(decodeQuerySegment(query)) });
}

export default async function Page({ params }: Props) {
  const { type, query } = await params;
  return GuideTypeListing({ params: Promise.resolve({ type }), searchParams: Promise.resolve(decodeQuerySegment(query)) });
}
