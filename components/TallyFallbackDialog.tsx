"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { buildTallyUrl, type LeadAttribution } from "@/lib/leadTracking";
import { readTallyMessage, type TallySubmission } from "@/lib/tallySubmission";
import styles from "./TallyFallbackDialog.module.css";

export function TallyFallbackDialog({ formId, attribution, contactUrl, onOpen, onSubmit, onClose }: {
  formId: string;
  attribution: LeadAttribution;
  contactUrl: string;
  onOpen: () => void;
  onSubmit: (payload: TallySubmission) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const openedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const callbacks = useRef({ onOpen, onSubmit });
  callbacks.current = { onOpen, onSubmit };

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    function receive(event: MessageEvent) {
      if (event.origin !== "https://tally.so") return;
      if (!frameRef.current || event.source !== frameRef.current.contentWindow) return;
      const message = readTallyMessage(event.data, formId);
      if (!message) return;
      if (message.event === "loaded") {
        setLoaded(true);
        if (openedRef.current) return;
        openedRef.current = true;
        callbacks.current.onOpen();
      } else {
        callbacks.current.onSubmit({ id: message.id });
      }
    }
    window.addEventListener("message", receive);
    return () => {
      window.removeEventListener("message", receive);
      dialog?.close();
    };
  }, [formId]);

  return createPortal(
    <dialog ref={dialogRef} className={styles.dialog} aria-label="World Clean Biz inquiry form" onCancel={onClose}>
      <div className={styles.header}>
        <span>{loaded ? "Complete your request" : "Loading your form…"}</span>
        <button type="button" onClick={onClose} autoFocus aria-label="Close inquiry form">Close</button>
      </div>
      <iframe ref={frameRef} className={styles.frame} title="World Clean Biz inquiry form"
        src={buildTallyUrl(`https://tally.so/embed/${formId}?hideTitle=0`, attribution)} />
      <p className={styles.help}>Having trouble? <a href={contactUrl}>Contact World Clean Biz</a>.</p>
    </dialog>, document.body
  );
}
