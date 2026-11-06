/**
 * Brand marks: the one way pages show a company — its published logo when
 * there is one, otherwise a monogram built from its name.
 */

export type BrandMark = {
  slug?: string;
  name: string;
  logo?: string;
  href?: string;
};

type MarkSource = { slug: string; name: string; logoImage?: string };

export function buildBrandMarkIndex(profiles: readonly MarkSource[]): Map<string, BrandMark> {
  return new Map(
    profiles.map((profile) => [
      profile.slug,
      {
        slug: profile.slug,
        name: profile.name,
        logo: profile.logoImage || undefined,
        href: `/brands/${profile.slug}`
      }
    ])
  );
}

/** Mark for a slug, or a name-only mark (rendered as a monogram) when no profile exists. */
export function resolveBrandMark(
  index: ReadonlyMap<string, BrandMark>,
  slug: string | undefined,
  fallbackName?: string
): BrandMark | undefined {
  const found = slug ? index.get(slug) : undefined;
  if (found) return found;
  const name = fallbackName?.trim();
  return name ? { name } : undefined;
}

/** One or two letters for a company without a logo, e.g. "SharkNinja" -> "SN", "TTI" -> "TTI". */
export function brandMonogram(name: string): string {
  const cleaned = name.replace(/\(.*?\)/g, " ").replace(/[^\p{L}\p{N}\s&+-]/gu, " ").trim();
  if (!cleaned) return "?";
  const words = cleaned.split(/[\s&+-]+/).filter(Boolean);
  const first = words[0];
  if (words.length === 1) {
    if (first.length <= 4 && first === first.toUpperCase()) return first;
    const capitals = first.match(/\p{Lu}/gu) ?? [];
    if (capitals.length >= 2) return capitals.slice(0, 2).join("");
    return first.slice(0, 1).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

export type FigureDirection = "up" | "down" | "flat";

/** Reads the sign of a reported change such as "+10.61% YoY", "−72.43% YoY" or "flat". */
export function figureDirection(change: string | undefined): FigureDirection {
  const value = change?.trim() ?? "";
  if (/^[-−–↓]/.test(value)) return "down";
  if (/^[+↑]/.test(value)) return "up";
  if (/\b(down|decline|decrease|fall|loss)\b/i.test(value)) return "down";
  if (/\b(up|growth|increase|rise)\b/i.test(value)) return "up";
  return "flat";
}
