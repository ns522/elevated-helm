const knownCaptions: Record<string, string> = {
  "/shots/sales-desking.png": "4-Square desking & deal stages",
  "/shots/sales-fi-menu.png": "Customer F&I protection menu",
  "/shots/sales-crm-1790459929914.png": "All leads & pipeline status",
  "/shots/sales-crm.png": "Daily tasks & lead heat board",
  "/shots/service-crm-1790459988833.png": "Service lane Kanban & aging",
  "/shots/marketing-campaign.png": "Campaign timeline & approvals",
  "/shots/marketing-creative.png": "Creative review & channel handoff",
  "/shots/marketing-1790460044373.png": "Marketing Studio overview",
  "/shots/website-inventory.png": "Inventory workbench & AI shopper",
  "/shots/website.png": "Dealership storefront",
  "/shots/website-service.png": "Guided online service intake",
  "/shots/website-events.png": "Events & demo day RSVPs",
  "/shots/agents-owner-review.png": "Owner review & case audit trail",
  "/shots/dealership-exchange.png": "Dealer-to-dealer inventory exchange",
};

export function shotCaption(src: string, index: number) {
  return knownCaptions[src] ?? `View ${index + 1}`;
}
