import Link from "next/link";
import { responsiveImageProps } from "@/lib/articleImages";

// Existing, prepared photographs already published with the linked Miele article.
const mielePhotographs = {
  "portfolio": {
    "src": "/images/articles/miele-two-families-company-story/05-kitchen.webp",
    "alt": "Miele Generation 7000 appliances in a fitted kitchen setting",
    "caption": "Miele's Generation 7000 kitchen appliances, including the TwoInOne induction hob with integrated extraction. Official Miele photograph.",
    "className": "company-kitchen-photo"
  },
  "manufacturing": {
    "src": "/images/articles/miele-two-families-company-story/08-manufacturing.webp",
    "alt": "A robot working at Miele's manufacturing site in Gütersloh",
    "caption": "A robot at Miele's Gütersloh production site in Germany. Photo: Miele, 2026 press materials.",
    "className": "company-factory-photo"
  },
  "ownership": {
    "src": "/images/articles/miele-two-families-company-story/02-fourth-generation.webp",
    "alt": "Markus Miele, Rebecca Steinhage and Reinhard Zinkann at the presentation of Miele's 2025 annual results",
    "caption": "Markus Miele, left, and Reinhard Zinkann, right, with fellow executive director Rebecca Steinhage at the presentation of the 2025 results. Photo: Miele, 2026 press materials.",
    "className": "company-leadership-photo"
  }
} as const;
export function BrandAdditionalPhoto({ slug, placement }: { slug: string; placement: keyof typeof mielePhotographs }) {
  if (slug !== "miele") return null;
  const photo = mielePhotographs[placement];
  return <figure className={`company-added-photo ${photo.className}`}><img {...responsiveImageProps(photo.src, "body")} alt={photo.alt} /><figcaption>{photo.caption} <Link href="/blog/miele-two-families-company-story">Source article</Link></figcaption></figure>;
}
