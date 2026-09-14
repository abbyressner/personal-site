"use client";
import { useEffect } from "react";

/*
 * The right column (.content) is the only scroll container on desktop, so a wheel over the rail
 * did nothing. Forward wheel events from anywhere outside .content into it. Passive listener: we
 * never preventDefault, so native scrolling inside .content (and on mobile, where .content is not
 * a scroll container) is untouched.
 */
export default function ScrollForward() {
  useEffect(() => {
    const content = document.querySelector<HTMLElement>(".content");
    if (!content) return;
    const onWheel = (e: WheelEvent) => {
      if (content.contains(e.target as Node)) return;
      if (document.documentElement.hasAttribute("data-modal-open")) return;
      // deltaMode 1 = lines (Firefox), 2 = pages; normalise to pixels.
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? content.clientHeight : 1;
      content.scrollBy({ top: e.deltaY * scale, behavior: "instant" });
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);
  return null;
}
