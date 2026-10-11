"use client";

import { useEffect, useRef, useState } from "react";

type Photo = {
  src: string; caption: string; width: number; height: number;
  mobile?: { src: string; width: number; height: number };
};
type Edition = {
  id: string; date: string; place: string; title: string;
  facts: string[]; paras: string[]; photos: Photo[];
};

function PhotoImage({ photo, thumbnail = false, expanded = false }: { photo: Photo; thumbnail?: boolean; expanded?: boolean }) {
  return <img src={photo.src} alt={photo.caption} width={photo.width} height={photo.height}
    srcSet={photo.mobile ? `${photo.mobile.src} ${photo.mobile.width}w, ${photo.src} ${photo.width}w` : undefined}
    sizes={thumbnail ? "65px" : expanded ? "90vw" : "(max-width: 760px) 90vw, 650px"}
    loading={expanded ? "eager" : "lazy"} decoding="async" />;
}

export default function ExpoHistory({ events }: { events: Edition[] }) {
  const [edition, setEdition] = useState(0);
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const tabs = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const event = events[edition];
  const photo = event.photos[index];
  function selectEdition(next: number) { setEdition(next); setIndex(0); }
  function step(delta: number) { setIndex(current => (current + delta + event.photos.length) % event.photos.length); }
  useEffect(() => {
    const thumbnail = rail.current?.children[index] as HTMLElement | undefined;
    if (thumbnail && rail.current) rail.current.scrollTo({ left: Math.max(0, thumbnail.offsetLeft - rail.current.clientWidth / 2 + thumbnail.clientWidth / 2) });
  }, [index, edition]);
  useEffect(() => {
    if (!expanded) return;
    const modal = dialog.current;
    modal?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { modal?.close(); document.body.style.overflow = previous; trigger.current?.focus({ preventScroll: true }); };
  }, [expanded]);
  return <>
    <div ref={tabs} className="history-tabs" role="tablist" aria-label="Previous editions">
      {events.map((item, i) => <button key={item.id} type="button" id={`edition-tab-${i}`} role="tab"
        aria-selected={edition === i} aria-controls="history-panel" tabIndex={edition === i ? 0 : -1}
        onClick={() => selectEdition(i)} onKeyDown={key => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(key.key)) return;
          key.preventDefault();
          const next = key.key === "Home" ? 0 : key.key === "End" ? events.length - 1 : (i + (key.key === "ArrowRight" ? 1 : -1) + events.length) % events.length;
          selectEdition(next);
          (tabs.current?.children[next] as HTMLButtonElement)?.focus();
        }}><b>{item.date}</b><span>{item.place}</span></button>)}
    </div>
    <div className="history-panel" id="history-panel" role="tabpanel" aria-labelledby={`edition-tab-${edition}`}>
      <div className="history-copy"><span className="eyebrow">{event.date} · {event.place}</span>
        <h3>{event.title}</h3><div className="history-facts">{event.facts.map(fact => <strong key={fact}>{fact}</strong>)}</div>
        {event.paras.map(para => <p key={para}>{para}</p>)}
      </div>
      <div className="gallery" role="group" aria-label="Previous event photo gallery">
        <button ref={trigger} type="button" className="photo-open" aria-label={`Enlarge event photo: ${photo.caption}`}
          onClick={() => { if (Date.now() > suppressClickUntil.current) setExpanded(true); }}
          onKeyDown={key => { if (["ArrowLeft", "ArrowRight"].includes(key.key)) { key.preventDefault(); step(key.key === "ArrowRight" ? 1 : -1); } }}
          onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          onTouchEnd={e => {
            if (!touch.current) return;
            const dx = e.changedTouches[0].clientX - touch.current.x;
            const dy = e.changedTouches[0].clientY - touch.current.y;
            touch.current = null;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { suppressClickUntil.current = Date.now() + 400; step(dx < 0 ? 1 : -1); }
          }}><PhotoImage photo={photo} /><span>View photo</span></button>
        <p className="caption">{photo.caption}</p>
        <div className="gallery-controls"><span aria-live="polite">{index + 1} / {event.photos.length}</span><div>
          <button type="button" aria-label="Previous photo" onClick={() => step(-1)}>Previous</button>
          <button type="button" aria-label="Next photo" onClick={() => step(1)}>Next</button>
        </div></div>
        <div ref={rail} className="thumbs" aria-label="Choose a photo">{event.photos.map((item, i) =>
          <button type="button" key={item.src} aria-label={`Photo ${i + 1}: ${item.caption}`} aria-pressed={i === index} onClick={() => setIndex(i)}>
            <PhotoImage photo={item} thumbnail />
          </button>)}
        </div>
      </div>
    </div>
    <dialog ref={dialog} aria-label="Event photo viewer" onCancel={() => setExpanded(false)}
      onClick={e => { if (e.target === e.currentTarget) setExpanded(false); }}
      onKeyDown={key => { if (["ArrowLeft", "ArrowRight"].includes(key.key)) { key.preventDefault(); step(key.key === "ArrowRight" ? 1 : -1); } }}>
      <div className="lightbox-actions">
        <button type="button" aria-label="Previous enlarged photo" onClick={() => step(-1)}>Previous</button>
        <button type="button" autoFocus onClick={() => setExpanded(false)}>Close</button>
        <button type="button" aria-label="Next enlarged photo" onClick={() => step(1)}>Next</button>
      </div>
      {expanded && <><PhotoImage photo={photo} expanded /><p>{photo.caption}</p></>}
    </dialog>
  </>;
}
