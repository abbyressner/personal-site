"use client";
import { useEffect, useId, useState, type ReactNode } from "react";

/*
 * Inline expand/collapse for a run of About paragraphs. The trigger reads like a line of the
 * section; the panel animates via grid-template-rows and is inert while closed so nothing
 * inside it (glossary buttons, links) is reachable by Tab until it is opened. The panel clips
 * (overflow hidden) only while animating: once open and settled, the clip is released so a
 * glossary popover on the first line can rise above it.
 */
export default function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!open) { setSettled(false); return; }
    // Reduced motion has no transition to wait for; otherwise the timeout is a safety net.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setSettled(true), reduced ? 0 : 450);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div className="disclosure" data-open={open || undefined} data-settled={settled || undefined}>
      <button
        type="button"
        className="disclosure-trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <svg className="disclosure-caret" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div id={id} className="disclosure-panel" inert={!open}>
        <div className="disclosure-inner">{children}</div>
      </div>
    </div>
  );
}
