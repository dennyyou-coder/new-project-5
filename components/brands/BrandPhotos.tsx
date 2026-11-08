import type { BrandProfile } from "@/lib/brands";
import { Icon } from "@/components/Icon";

const small = (src: string) => src.replace(/\.webp$/, "-600.webp");

/** Real-world photographs of the company (stands, stores, products in use), each with its credit. */
export function BrandPhotos({ profile }: { profile: BrandProfile }) {
  const photos = profile.photos ?? [];
  if (!photos.length) return null;
  return (
    <section className="bp-card bp-photos" id="photos" aria-labelledby="photos-title">
      <div className="bp-card-head">
        <h2 id="photos-title"><span className="bp-card-icon"><Icon name="image" /></span>{profile.name} in photos</h2>
      </div>
      <ul className={`bp-photos-grid is-${Math.min(photos.length, 3)}`}>
        {photos.map((photo) => (
          <li key={photo.src}>
            <figure>
              <span className="bp-photos-frame">
                <img src={small(photo.src)} srcSet={`${small(photo.src)} 600w, ${photo.src} 1200w`} sizes="(max-width: 760px) 100vw, 360px" alt={photo.caption} loading="lazy" decoding="async" />
              </span>
              <figcaption>
                <span>{photo.caption}</span>
                {photo.creditUrl ? <a href={photo.creditUrl} target="_blank" rel="noopener noreferrer">{photo.credit}</a> : <small>{photo.credit}</small>}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
