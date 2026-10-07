"use client";
import { useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Modal from "./Modal";

/*
 * Inline glossary term. Dotted underline, definition in a small popover that stems from the word.
 * Opens on hover or keyboard focus, closes on Escape / focus leaving; tap toggles on touch.
 * The trigger is a real <button> and the popover is always in the DOM (aria-describedby), so a
 * screen reader gets the definition whether or not the popover is visible. Not a link by design —
 * a `link` prop puts one *inside* the popover instead. With `modal`, a click opens that content in
 * a centered Modal (the popover then acts as the hover preview and says so).
 */

interface TermProps {
  children: ReactNode;
  def: ReactNode;
  link?: { href: string; label: string };
  modal?: { title: string; content: ReactNode };
}

export default function Term({ children, def, link, modal }: TermProps) {
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);
  const pop = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [below, setBelow] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const closeModal = useCallback(() => setModalOpen(false), []);

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
        ref={trigger}
        type="button"
        className="term-trigger"
        aria-describedby={id}
        aria-expanded={modal ? undefined : open}
        aria-haspopup={modal ? "dialog" : undefined}
        onClick={() => {
          if (modal) { setOpen(false); setModalOpen(true); }
          else setOpen((o) => !o);
        }}
      >
        {children}
      </button>
      <span ref={pop} role="tooltip" id={id} className="term-pop">
        {def}
        {modal && <span className="term-hint">Click to read more</span>}
        {link && (
          <>
            {" "}
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label} →
            </a>
          </>
        )}
      </span>
      {modal && modalOpen && (
        <Modal title={modal.title} onClose={closeModal} returnFocus={trigger}>
          {modal.content}
        </Modal>
      )}
    </span>
  );
}
