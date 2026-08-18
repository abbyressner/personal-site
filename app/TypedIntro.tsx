"use client";
import { useCallback, useEffect, useRef, useState } from "react";

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

interface TypedIntroProps {
  greeting?: string;
  lead?: string;
  descriptors?: string[];
  holdMs?: number;
  className?: string;
}

export default function TypedIntro({
  greeting = "Hi! My name is Abby.",
  lead = "I am a",
  descriptors = [
    "engineer",
    "synesthete",
    "U.S. healthcare system critic",
    "Apple Shortcuts enthusiast",
    "detail-oriented developer",
  ],
  holdMs = 2200,
  className,
}: TypedIntroProps) {
  const [w, setW] = useState(0);
  const [chars, setChars] = useState(0);
  const deleting = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const seq = useCallback(
    (i: number) => {
      const word = descriptors[i % descriptors.length];
      return (needsAn(word) ? "n" : "") + " " + word + ".";
    },
    [descriptors]
  );

  useEffect(() => {
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
  }, [w, chars, holdMs, seq, descriptors.length]);

  const full = seq(w);
  const g = full.startsWith("n") ? 1 : 0;

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
        <span style={{ fontWeight: "var(--weight-body)" as React.CSSProperties["fontWeight"], color: "var(--text-muted)" }}>{lead}</span>
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
