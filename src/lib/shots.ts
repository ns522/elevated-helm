import fs from "node:fs";
import path from "node:path";

const defaultModuleShots: Record<string, string[]> = {
  "sales-crm": [
    "sales-desking.png",
    "sales-fi-menu.png",
    "sales-mobile.png",
    "sales-crm-1790459929914.png",
    "sales-crm.png",
  ],
  "service-crm": [
    "service-crm-1790459988833.png",
    "website-service.png",
  ],
  marketing: [
    "marketing-campaign.png",
    "marketing-creative.png",
    "marketing-mobile.png",
    "marketing-1790460044373.png",
  ],
  website: [
    "website-inventory.png",
    "website-mobile.png",
    "website.png",
    "website-service.png",
    "website-events.png",
  ],
  agents: ["agents-owner-review.png"],
  "dealership-os": [],
};

export function shotSrcs(slug: string) {
  const dir = path.join(process.cwd(), "public", "shots");
  const names = defaultModuleShots[slug] ?? [`${slug}.png`];
  return names
    .filter((name) => fs.existsSync(path.join(dir, name)))
    .map((name) => `/shots/${name}`);
}
