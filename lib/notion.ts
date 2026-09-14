// Reads the "garden" links database directly via Notion's REST API (no SDK — the query is a
// single POST and the response shape is stable). Requires NOTION_API_KEY (an internal integration
// token, shared with the database) and NOTION_DATABASE_ID as env vars.

export type GardenSection = "interests" | "favorites";

export type GardenEntry = {
  id: string;
  title: string;
  url: string;
  section: GardenSection;
  type: string;
  note: string | null;
  addedAt: string;
};

type NotionRichText = { plain_text: string }[];

type NotionPropertyValue = {
  title?: NotionRichText;
  url?: string;
  select?: { name?: string };
  rich_text?: NotionRichText;
  date?: { start?: string };
};

type NotionPage = {
  id: string;
  created_time: string;
  properties: Record<string, NotionPropertyValue>;
};

function plainText(richText: unknown): string {
  if (!Array.isArray(richText)) return "";
  return (richText as NotionRichText).map((t) => t.plain_text).join("");
}

function selectName(prop: unknown): string | null {
  if (!prop || typeof prop !== "object") return null;
  const select = (prop as { select?: { name?: string } }).select;
  return select?.name ?? null;
}

function mapPage(page: NotionPage): GardenEntry | null {
  const props = page.properties;
  const title = plainText(props.title?.title);
  const url = props.url?.url as string | undefined;
  const section = selectName(props.section) as GardenSection | null;
  if (!title || !url || !section) return null;

  return {
    id: page.id,
    title,
    url,
    section,
    type: selectName(props.type) ?? "link",
    note: plainText(props.text?.rich_text) || null,
    addedAt: (props.date?.date?.start as string | undefined) ?? page.created_time,
  };
}

export async function getGardenEntries(): Promise<GardenEntry[]> {
  const apiKey = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!apiKey || !databaseId) {
    throw new Error(
      "Missing NOTION_API_KEY or NOTION_DATABASE_ID. See lib/notion.ts / the garden page setup notes."
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
      sorts: [{ property: "date", direction: "descending" }],
      page_size: 100,
    }),
    // Notion content changes occasionally, not constantly — a short revalidate window keeps the
    // page fresh without hammering the API on every request.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Notion API error ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { results: NotionPage[] };
  return data.results
    .map(mapPage)
    .filter((entry): entry is GardenEntry => entry !== null);
}

export function groupBySection(entries: GardenEntry[]) {
  return {
    interested: entries.filter((e) => e.section === "interests"),
    favorites: entries.filter((e) => e.section === "favorites"),
  };
}
