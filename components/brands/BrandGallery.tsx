import Link from "next/link";
import { Icon } from "@/components/Icon";
import { responsiveImageProps } from "@/lib/articleImages";
import type { GalleryImage } from "@/lib/brandGallery";

/** Graphics from WCB analysis of the company, shown whole (they carry text), each linking to its article. */
export function BrandGallery({ name, images }: { name: string; images: GalleryImage[] }) {
  if (images.length < 3) return null;
  return (
    <section className="bp-card bp-gallery" id="pictures" aria-labelledby="pictures-title">
      <div className="bp-card-head">
        <h2 id="pictures-title"><span className="bp-card-icon"><Icon name="image" /></span>{name} in WCB analysis</h2>
      </div>
      <ul className="bp-gallery-grid">
        {images.map((image) => (
          <li key={image.src}>
            <Link href={image.href}>
              <span className="bp-gallery-frame"><img {...responsiveImageProps(image.src, "card")} alt="" /></span>
              <span className="bp-gallery-caption">{image.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
