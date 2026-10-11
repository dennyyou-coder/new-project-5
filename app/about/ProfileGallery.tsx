"use client";

import { useEffect, useRef, useState } from "react";

export type ProfilePhoto = {
  src: string;
  caption: string;
  width: number;
  height: number;
  mobile?: { src: string; width: number; height: number };
};

export function ProfileImage({ photo, priority = false, sizes = "(max-width: 800px) calc(100vw - 40px), 650px" }: { photo: ProfilePhoto; priority?: boolean; sizes?: string }) {
  return <img src={photo.src} alt={photo.caption} width={photo.width} height={photo.height}
    srcSet={photo.mobile ? `${photo.mobile.src} ${photo.mobile.width}w, ${photo.src} ${photo.width}w` : undefined}
    sizes={sizes} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />;
}

export function ProfileGallery({ photos, label, single = false, priority = false }: { photos: ProfilePhoto[]; label: string; single?: boolean; priority?: boolean }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const photo = photos[index];
  function step(delta: number) { setIndex(current => (current + delta + photos.length) % photos.length); }
  useEffect(() => {
    const thumbnail = rail.current?.children[index] as HTMLElement | undefined;
    if (thumbnail && rail.current) rail.current.scrollTo({ left: Math.max(0, thumbnail.offsetLeft - rail.current.clientWidth / 2 + thumbnail.clientWidth / 2) });
  }, [index]);
  useEffect(() => {
    if (!expanded) return;
    const modal = dialog.current;
    modal?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { modal?.close(); document.body.style.overflow = previous; trigger.current?.focus({ preventScroll: true }); };
  }, [expanded]);
  return <div className={single ? "single-photo" : "album"} role="group" aria-label={label}>
    <div className={single ? undefined : "album-slides"} tabIndex={single ? undefined : 0}
      onKeyDown={event => { if (!single && ["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); } }}
      onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={event => {
        if (!touch.current || single) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        touch.current = null;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { suppressClickUntil.current = Date.now() + 400; step(dx < 0 ? 1 : -1); }
      }}>
      <figure className={single ? undefined : "album-slide"}>
        <button ref={trigger} type="button" className="photo" aria-label={`Enlarge photo: ${photo.caption}`} onClick={() => { if (Date.now() > suppressClickUntil.current) setExpanded(true); }}>
          <ProfileImage photo={photo} priority={priority} /><span className="zoom">View photo</span>
        </button><figcaption>{photo.caption}</figcaption>
      </figure>
    </div>
    {!single && <>
      <div className="album-controls"><span className="album-count" aria-live="polite">{index + 1} / {photos.length}</span><span className="album-hint">Click photo to enlarge</span><div>
        <button className="album-prev" type="button" aria-label="Previous photo" onClick={() => step(-1)}>‹</button>
        <button className="album-next" type="button" aria-label="Next photo" onClick={() => step(1)}>›</button>
      </div></div>
      <div ref={rail} className="album-thumbs" aria-label="Choose a photo">{photos.map((item, i) => <button className="album-thumb" type="button" key={item.src} aria-label={`Show photo ${i + 1}: ${item.caption}`} aria-pressed={i === index} onClick={() => setIndex(i)}>
        <ProfileImage photo={item} sizes="76px" />
      </button>)}</div>
    </>}
    <dialog ref={dialog} aria-label={label} onCancel={() => setExpanded(false)} onClick={event => { if (event.target === event.currentTarget) setExpanded(false); }}
      onKeyDown={event => { if (!single && ["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); } }}>
      <button type="button" className="close" autoFocus onClick={() => setExpanded(false)}>Close ×</button>
      {expanded && <><ProfileImage photo={photo} sizes="94vw" priority /><p>{photo.caption}</p></>}
      {!single && <><button className="lightbox-step lightbox-prev" type="button" aria-label="Previous photo in gallery" onClick={() => step(-1)}>‹</button><button className="lightbox-step lightbox-next" type="button" aria-label="Next photo in gallery" onClick={() => step(1)}>›</button></>}
    </dialog>
  </div>;
}
