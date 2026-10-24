import type { Metadata } from "next";
import Link from "next/link";
import CursorGlow from "../CursorGlow";
import Pong from "./Pong";

export const metadata: Metadata = {
  title: "Pong — Abigail Ressner",
};

export default function PongPage() {
  return (
    <main className="pong-page">
      <CursorGlow />
      <Link className="garden-back" href="/">← Abigail Ressner</Link>

      <header className="pong-header">
        <h1>Pong</h1>
        <p>
          You&apos;re the paddle on the right. Use <kbd>↑</kbd> <kbd>↓</kbd> or <kbd>W</kbd> <kbd>S</kbd>, or
          move your mouse or finger over the board.
        </p>
      </header>

      <Pong />

      <p className="pong-note">
        Originally written in Processing (Java) for a high school CS class.{" "}
        <a href="https://github.com/abbyressner/pong" target="_blank" rel="noopener noreferrer">View the source →</a>
      </p>
    </main>
  );
}
