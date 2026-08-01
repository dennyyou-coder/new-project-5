import Link from "next/link";
import type { BrandCategoryPageData } from "@/lib/brandCategories";

export function BrandCategoryCard({
  data
}: {
  data: BrandCategoryPageData;
}) {
  const { category, profiles } = data;

  return (
    <article className="brand-category-card">
      <Link href={`/brands/${category.slug}`}>
        <p className="brand-category-card__eyebrow">Browse by buying category</p>
        <h2>{category.name}</h2>
        <p>{category.description}</p>
        <small>{profiles.length} verified brand profiles</small>
      </Link>
    </article>
  );
}
