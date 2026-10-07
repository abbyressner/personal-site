// "Now playing" is manually updated in a small Notion database (one row per song, most recent
// "Updated" date wins) rather than pulled live from Spotify's API — no OAuth to babysit, just
// edit a Notion row. Reuses NOTION_API_KEY; needs its own NOTION_NOW_PLAYING_DATABASE_ID since the
// schema (song/artist/art) doesn't fit the garden links database.

export type NowPlaying = {
  title: string;
  artist: string;
  url: string | null;
  albumArt: string | null;
  updatedAt: string;
};

type NotionRichText = { plain_text: string }[];

type NotionPropertyValue = {
  title?: NotionRichText;
  rich_text?: NotionRichText;
  url?: string;
  date?: { start?: string };
};

type NotionPage = {
  created_time: string;
  properties: Record<string, NotionPropertyValue>;
};

function plainText(richText: unknown): string {
  if (!Array.isArray(richText)) return "";
  return (richText as NotionRichText).map((t) => t.plain_text).join("");
}

export async function getNowPlaying(): Promise<NowPlaying | null> {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_NOW_PLAYING_DATABASE_ID;

  if (!apiKey || !databaseId) {
    throw new Error(
      "Missing NOTION_API_KEY or NOTION_NOW_PLAYING_DATABASE_ID. See docs/garden-setup.md."
    );
  }

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sorts: [{ property: "Updated", direction: "descending" }],
      page_size: 1,
    }),
    // manually edited, not constantly changing — a short revalidate window is plenty
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Notion API error ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { results: NotionPage[] };
  const page = data.results[0];
  if (!page) return null;

  const props = page.properties;
  const title = plainText(props.Title?.title);
  const artist = plainText(props.Artist?.rich_text);
  if (!title || !artist) return null;

  return {
    title,
    artist,
    url: props.URL?.url ?? null,
    albumArt: props["Album Art URL"]?.url ?? null,
    updatedAt: props.Updated?.date?.start ?? page.created_time,
  };
}
