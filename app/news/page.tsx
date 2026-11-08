import { NewsListing, newsListingMetadata } from "./listing";

// The unfiltered listing is static and refreshed hourly; filtered views go through /q (middleware.ts).
export const revalidate = 3600;

export function generateMetadata() {
  return newsListingMetadata({ searchParams: Promise.resolve({}) });
}

export default function Page() {
  return NewsListing({ searchParams: Promise.resolve({}) });
}
