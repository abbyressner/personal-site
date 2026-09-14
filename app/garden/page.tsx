import type { Metadata } from "next";
import Link from "next/link";
import CursorGlow from "../CursorGlow";
import PixelGarden from "./PixelGarden";
import { getGardenEntries, groupBySection, type GardenEntry } from "../../lib/notion";
import { getNowPlaying, type NowPlaying } from "../../lib/nowPlaying";

export const metadata: Metadata = {
  title: "Garden — Abigail Ressner",
};

// Periodically-updated, not real-time — see lib/notion.ts and lib/nowPlaying.ts revalidate windows.
export const revalidate = 300;

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function LinkList({ entries, emptyLabel }: { entries: GardenEntry[]; emptyLabel: string }) {
  if (entries.length === 0) {
    return <p className="garden-empty">{emptyLabel}</p>;
  }
  return (
    <ul className="garden-list">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a className="garden-row" href={entry.url} target="_blank" rel="noopener noreferrer">
            <span className="garden-row-top">
              <span className="garden-title">{entry.title}</span>
              <span className="garden-type">{entry.type}</span>
            </span>
            {entry.note ? <span className="garden-note">{entry.note}</span> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default async function GardenPage() {
  let interested: GardenEntry[] = [];
  let favorites: GardenEntry[] = [];
  let notionError: string | null = null;

  try {
    const entries = await getGardenEntries();
    ({ interested, favorites } = groupBySection(entries));
  } catch (err) {
    console.error("[garden] getGardenEntries failed:", err);
    notionError = "Not wired up yet — set NOTION_API_KEY and NOTION_DATABASE_ID to pull this list live.";
  }

  let nowPlaying: NowPlaying | null = null;
  let nowPlayingError: string | null = null;

  try {
    nowPlaying = await getNowPlaying();
  } catch (err) {
    console.error("[garden] getNowPlaying failed:", err);
    nowPlayingError = "Not wired up yet — set NOTION_NOW_PLAYING_DATABASE_ID.";
  }

  return (
    <main className="garden-page">
      <CursorGlow />
      <Link className="garden-back" href="/">← Abigail Ressner</Link>

      <header className="garden-header">
        <PixelGarden />
        <p className="label">Digital garden</p>
        <h1>What I&apos;m into right now</h1>
        <p className="garden-intro">
          A running, informal log — things I&apos;m reading and watching, tools I keep coming back
          to, and what&apos;s in my headphones. Updated straight from my own notes, not curated for
          appearances.
        </p>
      </header>

      <section aria-labelledby="interested-heading">
        <h2 className="label" id="interested-heading">Currently interested in</h2>
        {notionError ? <p className="garden-empty">{notionError}</p> : <LinkList entries={interested} emptyLabel="Nothing logged yet." />}
      </section>

      <section aria-labelledby="favorites-heading">
        <h2 className="label" id="favorites-heading">Favorite repos &amp; agents/skills</h2>
        {notionError ? <p className="garden-empty">{notionError}</p> : <LinkList entries={favorites} emptyLabel="Nothing logged yet." />}
      </section>

      <section aria-labelledby="tracks-heading">
        <h2 className="label" id="tracks-heading">Now playing</h2>
        {nowPlayingError ? (
          <p className="garden-empty">{nowPlayingError}</p>
        ) : !nowPlaying ? (
          <p className="garden-empty">Nothing logged yet.</p>
        ) : (
          <article className="card now-playing-card" tabIndex={0}>
            {nowPlaying.albumArt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="now-playing-art" src={nowPlaying.albumArt} alt="" width={56} height={56} />
            ) : (
              <span className="now-playing-art now-playing-art-placeholder" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </span>
            )}
            <span className="now-playing-info">
              <span className="now-playing-title">{nowPlaying.title}</span>
              <span className="now-playing-artist">{nowPlaying.artist}</span>
            </span>
            <span className="meta now-playing-time">{timeAgo(nowPlaying.updatedAt)}</span>
            {nowPlaying.url ? (
              <a className="card-link now-playing-link" href={nowPlaying.url} target="_blank" rel="noopener noreferrer">
                Listen →
              </a>
            ) : null}
          </article>
        )}
      </section>
    </main>
  );
}
