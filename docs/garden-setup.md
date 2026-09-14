# Setting up /garden

The garden page (`app/garden/page.tsx`) pulls from two Notion databases you own — nothing here
needs a third-party OAuth flow. Set both up once; after that the page stays in sync as you edit
Notion.

## 1. Notion — shared setup

1. Go to <https://www.notion.so/my-integrations> → **New integration** → give it a name (e.g.
   "personal-site") → copy the **Internal Integration Secret**. That's `NOTION_API_KEY`.
   (Skip this if you already made one for the links database below.)

## 2. Links list — "Currently interested in" / "Favorites"

1. Create a database in Notion (any page → `/database`) with these exact property names
   (lowercase, matching the existing database):
   - **title** — title
   - **url** — url
   - **section** — select, with two options: `interests` and `favorites`
   - **type** — select, e.g. `article`, `video`, `report`, `repo`, `skill`
   - **text** — text (optional, a short line on why it's there)
   - **date** — date (optional — falls back to Notion's created time if left blank)
2. Open the database → **···** menu → **Connections** → connect the integration from step 1.
   (Without this step the API call returns 404, not an auth error.)
3. Copy the database ID out of its URL: `notion.so/<workspace>/<DATABASE_ID>?v=...` — the 32-char
   id right after the workspace name, before the `?v=`. That's `NOTION_DATABASE_ID`.
4. Add a few rows — anything with `Section` set to `Interested in` or `Favorites` shows up.

## 3. Now playing — manually updated

A second, separate database, since a song's fields (artist, art) don't fit the links schema.

1. Create another database with these exact property names:
   - **Title** — title (the song title)
   - **Artist** — text
   - **URL** — url (optional — a link to the track, e.g. on Spotify/Apple Music/YouTube)
   - **Album Art URL** — url (optional — a direct image link; leave blank for a plain icon)
   - **Updated** — date (required — the page always shows whichever row has the latest date)
2. Connect the same integration to this database too (**···** → **Connections**).
3. Copy its database ID the same way as above. That's `NOTION_NOW_PLAYING_DATABASE_ID`.
4. To change what's showing, add a new row (or edit the existing one) with today's date in
   **Updated** — the most recent row always wins, so old rows can just stay as history.

## 4. Wire the env vars

Local dev:

```bash
cp .env.example .env.local
# fill in the three values, then:
npm run dev
```

Production (Vercel):

```bash
vercel env add NOTION_API_KEY production
vercel env add NOTION_DATABASE_ID production
vercel env add NOTION_NOW_PLAYING_DATABASE_ID production
```

Until these are set, `/garden` still renders — it shows an honest "not wired up yet" line in
place of each section instead of failing the build or faking data.
