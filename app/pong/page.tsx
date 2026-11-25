import type { Metadata } from "next";
import Link from "next/link";
import CursorGlow from "../CursorGlow";
import Pong from "./Pong";

export const metadata: Metadata = {
  title: "Pong — abigail ressner",
};

export default function PongPage() {
  return (
    <main className="pong-page">
      <CursorGlow />
      <Link className="garden-back" href="/garden">← garden</Link>

      <header className="pong-header">
        <h1>Pong</h1>
        <p>
          you&apos;re the paddle on the right. use <kbd>↑</kbd> <kbd>↓</kbd> or <kbd>W</kbd> <kbd>S</kbd>, or
          move your mouse or finger over the board.
        </p>
      </header>

      <Pong />

      <p className="pong-note">
        originally written in Processing (Java) for a high school CS class.{" "}
        <a href="https://github.com/abbyressner/pong" target="_blank" rel="noopener noreferrer">view the source →</a>
      </p>
    </main>
  );
}
