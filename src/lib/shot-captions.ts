export type ShotDevice = "desktop" | "phone";

const knownCaptions: Record<string, string> = {
  "/shots/sales-desking.png": "4-Square desking & deal stages",
  "/shots/sales-fi-menu.png": "Tablet: Customer F&I menu",
  "/shots/sales-crm-1790459929914.png": "All leads & pipeline status",
  "/shots/sales-crm.png": "Daily tasks & lead heat board",
  "/shots/sales-mobile.png": "Mobile: Phone dashboard & to-do",
  "/shots/service-crm-1790459988833.png": "Service lane Kanban & aging",
  "/shots/marketing-campaign.png": "Campaign timeline & approvals",
  "/shots/marketing-creative.png": "Creative review & channel handoff",
  "/shots/marketing-mobile.png": "Mobile: Campaign approval",
  "/shots/marketing-1790460044373.png": "Marketing Studio overview",
  "/shots/website-inventory.png": "Inventory workbench & AI shopper",
  "/shots/website-mobile.png": "Mobile: Inventory & AI shopper",
  "/shots/website.png": "Dealership storefront",
  "/shots/website-service.png": "Guided online service intake",
  "/shots/website-events.png": "Events & demo day RSVPs",
  "/shots/agents-owner-review.png": "Owner review & case audit trail",
};

const phoneShots = new Set<string>([
  "/shots/sales-mobile.png",
  "/shots/marketing-mobile.png",
  "/shots/website-mobile.png",
]);

export function shotCaption(src: string, index: number) {
  return knownCaptions[src] ?? `View ${index + 1}`;
}

export function shotDevice(src: string): ShotDevice {
  return phoneShots.has(src) || src.includes("-mobile") ? "phone" : "desktop";
}
