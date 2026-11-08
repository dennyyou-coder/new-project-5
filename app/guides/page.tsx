import { GuidesListing, guidesListingMetadata } from "./listing";

// The unfiltered listing is static and refreshed hourly; filtered views go through /q (middleware.ts).
export const revalidate = 3600;

export function generateMetadata() {
  return guidesListingMetadata({ searchParams: Promise.resolve({}) });
}

export default function Page() {
  return GuidesListing({ searchParams: Promise.resolve({}) });
}
