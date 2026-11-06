"use client";

import { useEffect } from "react";

/** Opens a folded <details> when a link points at something inside it (for example a source footnote). */
export function OpenDetailsOnHash() {
  useEffect(() => {
    function open() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      let parent = target?.parentElement ?? null;
      let opened = false;
      while (parent) {
        if (parent instanceof HTMLDetailsElement && !parent.open) {
          parent.open = true;
          opened = true;
        }
        parent = parent.parentElement;
      }
      if (opened) target?.scrollIntoView();
    }
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
