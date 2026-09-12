"use client";
import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/*
 * Inline glossary term. Dotted underline, definition in a small popover that stems from the word.
 * Opens on hover or keyboard focus, closes on Escape / focus leaving; tap toggles on touch.
 * The trigger is a real <button> and the popover is always in the DOM (aria-describedby), so a
 * screen reader gets the definition whether or not the popover is visible. Not a link by design —
 * a `link` prop puts one *inside* the popover instead.
 */

interface TermProps {
  children: ReactNode;
  def: ReactNode;
  link?: { href: string; label: string };
}

export default function Term({ children, def, link }: TermProps) {
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);
  const pop = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [below, setBelow] = useState(false);
  const [alignRight, setAlignRight] = useState(false);

  // Flip below / right-align when the popover would run off the viewport. Measured while still
  // invisible (visibility:hidden keeps layout), so the first paint is already in the right spot.
  useLayoutEffect(() => {
    if (!open || !pop.current) return;
    setBelow(false);
    setAlignRight(false);
    const r = pop.current.getBoundingClientRect();
    if (r.top < 8) setBelow(true);
    if (r.right > window.innerWidth - 8) setAlignRight(true);
  }, [open]);

  return (
    <span
      ref={wrap}
      className="term"
      data-open={open || undefined}
      data-below={below || undefined}
      data-right={alignRight || undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        className="term-trigger"
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {children}
      </button>
      <span ref={pop} role="tooltip" id={id} className="term-pop">
        {def}
        {link && (
          <>
            {" "}
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label} →
            </a>
          </>
        )}
      </span>
    </span>
  );
}
