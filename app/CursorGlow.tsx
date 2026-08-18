"use client";
import { useEffect, useRef } from "react";

/**
 * Ports the mockup-C cursor-glow: a soft trailing viewport light (eased lag) plus a
 * cursor-tracked radial highlight on each .card, layered under the liquid-glass hover.
 * Disabled for touch pointers and prefers-reduced-motion, matching the mockup.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    let tx = 0, ty = 0, x = 0, y = 0, active = false;
    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!active) {
        glow.style.opacity = "1";
        active = true;
      }
    };
    const handleMouseLeave = () => {
      glow.style.opacity = "0";
    };
    const handleCardMouseMove = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousemove", handleCardMouseMove);

    function frame() {
      const ease = reduceMotion ? 1 : 0.15;
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      if (glow) glow.style.transform = `translate(${x}px,${y}px)`;
      frameId = requestAnimationFrame(frame);
    }
    frameId = requestAnimationFrame(frame);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousemove", handleCardMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <div id="cursor-glow" ref={glowRef} aria-hidden="true" />;
}
