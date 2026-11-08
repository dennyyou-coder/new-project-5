import { GuideTypeListing, guideTypeListingMetadata, guideTypeStaticParams } from "./listing";

// Static per guide type and refreshed hourly; ?page views go through /q (middleware.ts).
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return guideTypeStaticParams();
}

type Props = { params: Promise<{ type: string }> };

export function generateMetadata({ params }: Props) {
  return guideTypeListingMetadata({ params, searchParams: Promise.resolve({}) });
}

export default function Page({ params }: Props) {
  return GuideTypeListing({ params, searchParams: Promise.resolve({}) });
}
