"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/*
 * Ported from design-system/components/content/TypedIntro.jsx — "the brand's one animated
 * element... use it once, at the top of a page." Same typing/caret logic; the only adaptation is
 * minHeight in em (was a hardcoded 56px tuned for the 46px hero size) so it still holds its line
 * height when re-scaled smaller via the --size-display token (see .hero-intro in globals.css).
 */

function needsAn(word: string) {
  const isInitialism = /^[A-Z]\.?[A-Z]/.test(word);
  return isInitialism ? /^[AEFHILMNORSX]/.test(word) && !/^U/.test(word) : /^[aeiou]/i.test(word);
}

// "a"/"an" is picked per descriptor, not hardcoded into `lead` — that's what lets a descriptor
// opt out of an article entirely (via noArticleDescriptors) and still share the same muted-article
// + accent-word typing mechanism as every other descriptor.
function articleFor(word: string, noArticleSet: Set<string>): "a" | "an" | "" {
  if (noArticleSet.has(word)) return "";
  return needsAn(word) ? "an" : "a";
}

interface TypedIntroProps {
  greeting?: string;
  lead?: string;
  descriptors?: string[];
  /** Descriptors that already read as a complete predicate — no "a"/"an" gets typed before them. */
  noArticleDescriptors?: string[];
  holdMs?: number;
  className?: string;
}

export default function TypedIntro({
  greeting = "Hi! My name is Abby.",
  lead = "I am",
  descriptors = [
    "engineer",
    "synesthete",
    "Apple Shortcuts enthusiast",
    "detail-oriented developer",
  ],
  noArticleDescriptors = [],
  holdMs = 2200,
  className,
}: TypedIntroProps) {
  const noArticleSet = useMemo(() => new Set(noArticleDescriptors), [noArticleDescriptors]);
  const [w, setW] = useState(0);
  const [chars, setChars] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const deleting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const seq = useCallback(
    (i: number) => {
      const word = descriptors[i % descriptors.length];
      const art = articleFor(word, noArticleSet);
      // No leading space here — the space between the static "I am" and this sequence is a
      // literal {" "} in the JSX below, so a no-article word doesn't end up with a double space.
      return (art ? art + " " : "") + word + ".";
    },
    [descriptors, noArticleSet]
  );

  // Respect the merged OS-preference + manual-toggle state (data-motion, set by MOTION_INIT_SCRIPT
  // and MotionToggle.tsx): skip the typing/cycling loop entirely and show the first descriptor
  // fully typed, statically. A MutationObserver (not just a one-time check) makes this react
  // immediately if the user clicks "pause animations" while already on the page — the WCAG 2.2.2
  // control this component exists to satisfy would be pointless if it only applied on reload.
  useEffect(() => {
    const apply = () => {
      const isReduced = document.documentElement.getAttribute("data-motion") === "reduced";
      setReducedMotion(isReduced);
      if (isReduced) setChars(seq(0).length);
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => observer.disconnect();
  }, [seq]);

  useEffect(() => {
    if (reducedMotion) return;
    const full = seq(w).length;
    const next = () => {
      if (!deleting.current) {
        if (chars < full) timer.current = setTimeout(() => setChars((c) => c + 1), 42 + Math.random() * 46);
        else {
          deleting.current = true;
          timer.current = setTimeout(() => setChars((c) => c - 1), holdMs);
        }
      } else if (chars > 0) {
        timer.current = setTimeout(() => setChars((c) => c - 1), 24);
      } else {
        deleting.current = false;
        timer.current = setTimeout(() => setW((v) => (v + 1) % descriptors.length), 320);
      }
    };
    next();
    return () => clearTimeout(timer.current);
  }, [w, chars, holdMs, seq, descriptors.length, reducedMotion]);

  const full = seq(w);
  const g = articleFor(descriptors[w % descriptors.length], noArticleSet).length;

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: "var(--weight-display-max)" as React.CSSProperties["fontWeight"],
          fontSize: "var(--size-hero)",
          lineHeight: "var(--leading-hero)",
          letterSpacing: "var(--track-hero)",
          color: "var(--text-strong)",
        }}
      >
        {greeting}
      </h1>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--size-display)",
          lineHeight: 1.2,
          letterSpacing: "var(--track-tight)",
          minHeight: "1.2em",
        }}
      >
        <span style={{ fontWeight: "var(--weight-body)" as React.CSSProperties["fontWeight"], color: "var(--text-muted)" }}>{lead}</span>{" "}
        <span
          style={{
            fontWeight: "var(--weight-body)" as React.CSSProperties["fontWeight"],
            color: "var(--text-muted)",
            whiteSpace: "pre",
          }}
        >
          {full.slice(0, Math.min(chars, g))}
        </span>
        <span
          style={{
            fontWeight: "var(--weight-display)" as React.CSSProperties["fontWeight"],
            color: "var(--accent)",
            whiteSpace: "pre-wrap",
          }}
        >
          {full.slice(g, Math.max(chars, g))}
        </span>
        <span
          className="caret"
          style={{
            display: "inline-block",
            width: "4px",
            height: "0.86em",
            background: "var(--caret)",
            marginLeft: "4px",
            verticalAlign: "-0.06em",
            animation: "ar-caret-blink var(--caret-blink) steps(2, jump-none) infinite",
          }}
        />
      </div>
    </div>
  );
}
