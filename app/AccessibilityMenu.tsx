"use client";
import { useEffect, useId, useRef, useState } from "react";

/*
 * A single accessibility icon replacing the standalone pause button — opens a small panel of
 * independent toggles instead. Each setting follows the same shape as DarkModeToggle: an explicit
 * localStorage choice, a data-* attribute on <html> as the one thing every consumer (CSS, or a
 * component like TypedIntro/CursorGlow) reads back, and — where a real OS preference exists
 * (motion, contrast) — that preference as the first-visit default. See A11Y_INIT_SCRIPT in
 * layout.tsx for the before-paint half of this.
 *
 * A plain disclosure (aria-expanded/aria-controls, like Disclosure.tsx), not a full ARIA menu —
 * these are settings to flip, not navigable actions, so ordinary tab order through real <button>s
 * is more robust than reimplementing roving-tabindex menu semantics.
 */

type SettingKey = "motion" | "font" | "textSize" | "contrast";

const SETTINGS: {
  key: SettingKey;
  attr: string;
  onValue: string;
  storageKey: string;
  label: string;
  description: string;
}[] = [
  {
    key: "motion",
    attr: "data-motion",
    onValue: "reduced",
    storageKey: "motion",
    label: "Pause animations",
    description: "Stops the typed intro and other motion.",
  },
  {
    key: "font",
    attr: "data-font",
    onValue: "dyslexic",
    storageKey: "font",
    label: "Dyslexia-friendly font",
    description: "Switches body text to OpenDyslexic.",
  },
  {
    key: "textSize",
    attr: "data-text-size",
    onValue: "large",
    storageKey: "text-size",
    label: "Larger text",
    description: "Bigger text and more spacing site-wide.",
  },
  {
    key: "contrast",
    attr: "data-contrast",
    onValue: "high",
    storageKey: "contrast",
    label: "High contrast",
    description: "Stronger text, visible borders, underlined links.",
  },
];

export default function AccessibilityMenu() {
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<SettingKey, boolean>>({
    motion: false,
    font: false,
    textSize: false,
    contrast: false,
  });

  // Read the state A11Y_INIT_SCRIPT already applied (OS preference or a stored choice) so the
  // panel's switches match what's actually showing, without re-deciding anything themselves.
  useEffect(() => {
    const next = {} as Record<SettingKey, boolean>;
    for (const s of SETTINGS) {
      next[s.key] = document.documentElement.getAttribute(s.attr) === s.onValue;
    }
    setValues(next);
  }, []);

  useEffect(() => {
    if (!open) return;
    firstRowRef.current?.focus();
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (setting: (typeof SETTINGS)[number]) => {
    const next = !values[setting.key];
    if (next) {
      document.documentElement.setAttribute(setting.attr, setting.onValue);
      localStorage.setItem(setting.storageKey, setting.onValue);
    } else {
      document.documentElement.removeAttribute(setting.attr);
      localStorage.setItem(setting.storageKey, "default");
    }
    setValues((v) => ({ ...v, [setting.key]: next }));
  };

  return (
    <div className="a11y-menu" ref={wrapRef}>
      <button
        ref={triggerRef}
        type="button"
        className="icon-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Accessibility settings"
        title="Accessibility settings"
        onClick={() => setOpen((o) => !o)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="7.4" r="1.15" fill="currentColor" stroke="none" />
          <path d="M8.1 10.3c1.2.65 2.5.95 3.9.95s2.7-.3 3.9-.95" />
          <path d="M12 11.25v4.1" />
          <path d="M12 15.35 9.4 19" />
          <path d="M12 15.35l2.6 3.65" />
        </svg>
      </button>
      {open && (
        <div id={panelId} className="a11y-panel" role="group" aria-label="Accessibility settings">
          <p className="a11y-panel-title">Accessibility</p>
          {SETTINGS.map((setting, i) => (
            <button
              key={setting.key}
              ref={i === 0 ? firstRowRef : undefined}
              type="button"
              role="switch"
              aria-checked={values[setting.key]}
              className="a11y-row"
              onClick={() => toggle(setting)}
            >
              <span>
                <span className="a11y-row-label">{setting.label}</span>
                <span className="a11y-row-desc">{setting.description}</span>
              </span>
              <span className="a11y-switch" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
