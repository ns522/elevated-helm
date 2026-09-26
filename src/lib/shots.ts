import fs from "node:fs";
import path from "node:path";

const extraShots: Record<string, string[]> = {
  website: ["website.png", "website-events.png"],
};

export function shotSrcs(slug: string) {
  const dir = path.join(process.cwd(), "public", "shots");
  const names = extraShots[slug] ?? [`${slug}.png`];
  return names
    .filter((name) => fs.existsSync(path.join(dir, name)))
    .map((name) => `/shots/${name}`);
}
