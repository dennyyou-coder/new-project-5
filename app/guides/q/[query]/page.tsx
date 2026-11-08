import { decodeQuerySegment } from "@/lib/queryRoute";
import { GuidesListing, guidesListingMetadata } from "../../listing";

// A filtered view, rendered on first request and cached; middleware.ts routes ?query URLs here.
export const revalidate = 3600;

export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ query: string }> };

export async function generateMetadata({ params }: Props) {
  const { query } = await params;
  return guidesListingMetadata({ searchParams: Promise.resolve(decodeQuerySegment(query)) });
}

export default async function Page({ params }: Props) {
  const { query } = await params;
  return GuidesListing({ searchParams: Promise.resolve(decodeQuerySegment(query)) });
}
