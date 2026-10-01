export const dynamic = "force-dynamic";

const MODRINTH_USER = "Ellipog";
// Ellipog on CurseForge — all published projects are counted by author, not slug:
// https://www.curseforge.com/members/ellipog/projects
const CURSEFORGE_AUTHOR_ID = 30254096;
const CACHE_TTL_MS = 60_000;
const USER_AGENT = "aaenz.no downloads counter (elliot@aaenz.no)";

type Counts = { downloads: number | null };

let cache: { at: number; counts: Counts } | null = null;
let lastGood: Counts | null = null;

async function modrinthDownloads(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.modrinth.com/v2/user/${MODRINTH_USER}/projects`, {
      headers: { "User-Agent": USER_AGENT },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const projects = (await res.json()) as { downloads?: number }[];
    return projects.reduce((sum, project) => sum + (project.downloads ?? 0), 0);
  } catch {
    return null;
  }
}

async function searchCurseforge(
  base: string,
  headers: Record<string, string>,
): Promise<number | null> {
  try {
    const res = await fetch(
      `${base}/mods/search?gameId=432&authorId=${CURSEFORGE_AUTHOR_ID}&pageSize=50`,
      {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...headers },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: { downloadCount?: number }[] };
    if (!body.data?.length) return null;
    return body.data.reduce((sum, mod) => sum + (mod.downloadCount ?? 0), 0);
  } catch {
    return null;
  }
}

async function curseforgeDownloads(): Promise<number | null> {
  const key = process.env.CURSEFORGE_API_KEY;
  if (key) {
    const official = await searchCurseforge("https://api.curseforge.com/v1", { "x-api-key": key });
    if (official !== null) return official;
  }
  // Public read-only mirror of the same API, used while the official key is missing or rejected.
  return searchCurseforge("https://api.curse.tools/v1/cf", {});
}

export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return Response.json(cache.counts);
  }

  const [modrinth, curseforge] = await Promise.all([modrinthDownloads(), curseforgeDownloads()]);
  if (modrinth !== null && curseforge !== null) {
    lastGood = { downloads: modrinth + curseforge };
  }
  const counts = lastGood ?? { downloads: null };

  cache = { at: Date.now(), counts };
  return Response.json(counts);
}
