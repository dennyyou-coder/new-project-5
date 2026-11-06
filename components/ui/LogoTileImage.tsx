import { brandLogoTile, logoTileStyle } from "@/lib/brandLogoTiles";

/**
 * A brand logo for a small card: the trimmed tile sized by area when one
 * exists, otherwise the official logo file.
 */
export function LogoTileImage({
  slug,
  fallbackSrc,
  alt = "",
  boxRatio,
  eager = false
}: {
  slug: string;
  fallbackSrc: string;
  alt?: string;
  boxRatio?: number;
  eager?: boolean;
}) {
  const tile = brandLogoTile(slug);
  return (
    <img
      src={tile?.src ?? fallbackSrc}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={logoTileStyle(tile?.ratio, boxRatio, tile?.light)}
    />
  );
}
