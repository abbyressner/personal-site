import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Bricolage_Grotesque, Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import localFont from "next/font/local";
import DarkModeToggle from "./DarkModeToggle";
import AccessibilityMenu from "./AccessibilityMenu";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
});

const notoSansMono = Noto_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-mono",
});

// Self-hosted via @fontsource/opendyslexic (SIL OFL) rather than a runtime CDN fetch — same
// next/font optimization (preload, no CLS) as the three fonts above. Only swapped in when the
// "Dyslexia-friendly font" toggle in AccessibilityMenu is on; see globals.css [data-font="dyslexic"].
const openDyslexic = localFont({
  src: [
    { path: "../node_modules/@fontsource/opendyslexic/files/opendyslexic-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../node_modules/@fontsource/opendyslexic/files/opendyslexic-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-opendyslexic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abigail Ressner",
};

// Sets data-theme before paint so the initial render matches the stored/system preference —
// dark is the default (no attribute); light is the opt-in. Mirrors DarkModeToggle.tsx's logic.
// The attribute it sets is deliberately absent from the server HTML, hence suppressHydrationWarning
// on <html> (it only covers that element's own attributes, not its children).
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(!d)document.documentElement.setAttribute("data-theme","light");}catch(e){}})();`;

// Same pattern as THEME_INIT_SCRIPT, for the four AccessibilityMenu.tsx toggles — sets each
// data-* attribute before paint so nothing renders a frame of the "off" state first. Motion and
// contrast fall back to the matching OS preference on a first visit (no stored choice yet); font
// and text-size have no OS-level equivalent, so they simply default off until the user opts in.
const A11Y_INIT_SCRIPT = `(function(){try{
  var html = document.documentElement;
  var motion = localStorage.getItem("motion");
  if (motion ? motion === "reduced" : window.matchMedia("(prefers-reduced-motion: reduce)").matches) html.setAttribute("data-motion", "reduced");
  var contrast = localStorage.getItem("contrast");
  if (contrast ? contrast === "high" : window.matchMedia("(prefers-contrast: more)").matches) html.setAttribute("data-contrast", "high");
  if (localStorage.getItem("font") === "dyslexic") html.setAttribute("data-font", "dyslexic");
  if (localStorage.getItem("text-size") === "large") html.setAttribute("data-text-size", "large");
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${notoSans.variable} ${notoSansMono.variable} ${openDyslexic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Analytics />
        <link rel="icon" href="/favicon.ico" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: A11Y_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        <div className="a11y-toolbar">
          <DarkModeToggle />
          <AccessibilityMenu />
        </div>
        {children}
      </body>
    </html>
  );
}