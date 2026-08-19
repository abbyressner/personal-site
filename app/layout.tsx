import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Bricolage_Grotesque, Noto_Sans, Noto_Sans_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Abigail Ressner",
};

// Sets data-theme before paint so the initial render matches the stored/system preference —
// dark is the default (no attribute); light is the opt-in. Mirrors DarkModeToggle.tsx's logic.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(!d)document.documentElement.setAttribute("data-theme","light");}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${notoSans.variable} ${notoSansMono.variable}`}>
      <head>
        <Analytics />
        <link rel="icon" href="/favicon.ico" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}