"use client";
import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

/*
 * Centered glass card over a lightly dimmed, blurred page. Same surface recipe as .card:hover.
 * Escape or a backdrop click closes it; focus moves to the close button on open and back to
 * the opener (returnFocus, or whatever was focused) on close; Tab is kept inside while it's up. Sets data-modal-open on <html>
 * so ScrollForward stops driving the column behind it.
 */
export default function Modal({ title, onClose, returnFocus, children }: { title: string; onClose: () => void; returnFocus?: RefObject<HTMLElement | null>; children: ReactNode }) {
  const titleId = useId();
  const card = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = returnFocus?.current ?? (document.activeElement as HTMLElement | null);
    document.documentElement.setAttribute("data-modal-open", "");
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && card.current) {
        const f = card.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-modal-open");
      opener?.focus();
    };
  }, [onClose, returnFocus]);

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={card}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2 id={titleId}>{title}</h2>
          <button ref={closeBtn} type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
