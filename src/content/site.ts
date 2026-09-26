import { money } from "@/lib/money";

export const siteName = "Elevated Helm";
export const contactEmail = "hello@elevatedhelm.com";

export const promise = "Run your marine dealership from one helm.";

export const lede =
  "Buy the modules you need now — sales, service, marketing, and your website. The full operating system is on the way.";

export const includedLine =
  "Any paid module includes customers, the boats your customers own, a calendar, and tasks.";

export const annualNote =
  "Annual billing is ten months of the monthly price. Two months are included.";

export type Module = {
  slug: string;
  name: string;
  navLabel: string;
  price: number;
  definition: string;
  story: string;
  features: readonly string[];
};

export const modules = [
  {
    slug: "sales-crm",
    name: "Sales CRM",
    navLabel: "Sales",
    price: 549,
    definition:
      "Sales CRM is the path from a new lead to a sold boat: inventory, quotes, and the customers you already know.",
    story:
      "Work a lead through the inventory, a quote, and the close. The customer record keeps every boat they have owned beside the deal.",
    features: [
      "Leads",
      "Inventory",
      "Desking and quotes",
      "Appraisals",
      "Consignments and trades",
      "Events",
      "Customers and the boats they own",
    ],
  },
  {
    slug: "service-crm",
    name: "Service CRM",
    navLabel: "Service",
    price: 549,
    definition:
      "Service CRM runs the service lane: requests, estimates your customer can approve, and the work on the board.",
    story:
      "Take a request, send an estimate the owner can approve, and keep the day visible on the tech workboard.",
    features: [
      "Requests and appointments",
      "Estimates with customer approval",
      "Tech workboard",
      "Follow-ups and reminders",
      "Forms",
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    navLabel: "Marketing",
    price: 399,
    definition:
      "Marketing keeps the brand, the ads, and the social plan in the same place as the boats and the events.",
    story:
      "Write the brand once, then plan ads and social posts around the inventory and events already on the floor.",
    features: [
      "Brand book",
      "Ads",
      "Social planning and scheduling",
      "Event campaigns",
    ],
  },
  {
    slug: "website",
    name: "Website",
    navLabel: "Website",
    price: 349,
    definition:
      "Website is the public site for your inventory, events, and pro shop, and it sends new leads back into the helm.",
    story:
      "Publish the boats, the events, and the pro shop. Find my boat and the lead forms bring the next conversation back to the store.",
    features: [
      "Public inventory",
      "Lead forms",
      "Event pages",
      "Pro shop",
      "Find my boat",
    ],
  },
] as const satisfies readonly Module[];

export type ModuleSlug = (typeof modules)[number]["slug"];

export const bundle = {
  name: "Helm",
  price: 1399,
} as const;

export const dealershipOs = {
  name: "Dealership OS",
  definition:
    "Dealership OS is the full store: the sales floor, the service lane, and the books, in one system.",
  body: "The four modules cover how you sell, how you service, how you market, and the site customers see. The operating system is the rest of the rooftop, including parts and the books. It is coming soon and is not for sale yet.",
} as const;

export function separatePrice() {
  return modules.reduce((sum, module) => sum + module.price, 0);
}

export function moduleBySlug(slug: string) {
  return modules.find((module) => module.slug === slug) ?? null;
}

const bundleSavings = separatePrice() - bundle.price;

export const faqs = [
  {
    question: "Who is Elevated Helm for?",
    answer:
      "Marine dealerships. The modules cover sales, service, marketing, and the public website.",
  },
  {
    question: "Can I start with one module?",
    answer: `Yes. ${includedLine}`,
  },
  {
    question: "What does the Helm bundle cost?",
    answer: `The Helm bundle is ${money(bundle.price)} per rooftop each month for Sales CRM, Service CRM, Marketing, and Website. Bought separately, those four are ${money(separatePrice())}.`,
  },
  {
    question: "Is the dealership operating system available?",
    answer: "Dealership OS is coming soon and is not for sale yet.",
  },
  {
    question: "How does annual billing work?",
    answer: annualNote,
  },
] as const;

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: `${siteName} is software for marine dealerships. ${promise}`,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Marine dealerships",
    },
    offers: [
      ...modules.map((module) => ({
        "@type": "Offer",
        name: module.name,
        price: String(module.price),
        priceCurrency: "USD",
        description: module.definition,
      })),
      {
        "@type": "Offer",
        name: bundle.name,
        price: String(bundle.price),
        priceCurrency: "USD",
        description: `Sales CRM, Service CRM, Marketing, and Website for one rooftop. Separate price is ${money(separatePrice())}.`,
      },
    ],
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function llmsText() {
  const lines = [
    `# ${siteName}`,
    "",
    `${siteName} is software for marine dealerships.`,
    "",
    promise,
    "",
    "Modules for sale, priced per rooftop per month:",
    ...modules.map(
      (module) => `- ${module.name}: ${money(module.price)}. ${module.definition}`,
    ),
    `- ${bundle.name} bundle (all four): ${money(bundle.price)} per month (${money(separatePrice())} if bought separately, a savings of ${money(bundleSavings)}).`,
    "",
    includedLine,
    "",
    annualNote,
    "",
    `${dealershipOs.name} is coming soon and is not for sale yet. ${dealershipOs.definition}`,
    "",
  ];

  return lines.join("\n");
}
