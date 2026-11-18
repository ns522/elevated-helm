import { money } from "@/lib/money";

export const siteName = "DealerAgent";
export const contactEmail = "hello@elevatedhelm.com";

export const promise = "Run your dealership from one system.";

export const lede =
  "Sales and service are one price per user. Add the website, then add a rooftop for each extra store.";

export const includedLine =
  "Each user includes customers, the units they own, a calendar, and tasks.";

export const annualNote =
  "Annual billing is ten months of the monthly price. Two months are included.";

export type Billing = "user" | "flat" | "included";

export type Module = {
  slug: string;
  name: string;
  navLabel: string;
  billing: Billing;
  price: number;
  definition: string;
  story: string;
  features: readonly string[];
};

export const pricing = {
  userPrice: 99,
  websitePrice: 399,
  additionalRooftopPrice: 299,
} as const;

export type Pricing = {
  userPrice: number;
  websitePrice: number;
  additionalRooftopPrice: number;
};

export function moduleOffer(module: { billing: Billing }, rates: Pricing) {
  if (module.billing === "included") return { kind: "included" as const };
  if (module.billing === "flat") {
    return {
      kind: "flat" as const,
      amount: rates.websitePrice,
      path: "pricing.websitePrice",
      suffix: " each month",
    };
  }
  return {
    kind: "user" as const,
    amount: rates.userPrice,
    path: "pricing.userPrice",
    suffix: " per user, each month",
  };
}

export function quoteMonthly(
  rates: Pricing,
  input: { users: number; rooftops: number; website: boolean },
) {
  const users = Math.min(999, Math.max(1, Math.floor(input.users) || 1));
  const rooftops = Math.min(999, Math.max(1, Math.floor(input.rooftops) || 1));
  const additionalRooftops = rooftops - 1;
  const usersTotal = users * rates.userPrice;
  const websiteTotal = input.website ? rates.websitePrice : 0;
  const rooftopsTotal = additionalRooftops * rates.additionalRooftopPrice;
  return {
    users,
    rooftops,
    additionalRooftops,
    usersTotal,
    websiteTotal,
    rooftopsTotal,
    total: usersTotal + websiteTotal + rooftopsTotal,
  };
}

export const modules = [
  {
    slug: "sales-crm",
    name: "Sales CRM",
    navLabel: "Sales",
    billing: "user",
    price: 99,
    definition:
      "Sales CRM is the path from a new lead to a sold unit: inventory, quotes, and the customers you already know.",
    story:
      "Work a lead through the inventory, a quote, and the close. The customer record keeps every unit they have owned beside the deal.",
    features: [
      "Leads",
      "Inventory",
      "Desking and quotes",
      "Appraisals",
      "Consignments and trades",
      "Events",
      "Customers and the units they own",
    ],
  },
  {
    slug: "service-crm",
    name: "Service CRM",
    navLabel: "Service",
    billing: "user",
    price: 99,
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
    billing: "included",
    price: 99,
    definition:
      "Marketing keeps the brand, the ads, and the social plan in the same place as the inventory and the events.",
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
    billing: "flat",
    price: 399,
    definition:
      "Website is the public site for your inventory, events, and parts counter, and it sends new leads back into DealerAgent.",
    story:
      "Publish the inventory, the events, and the parts counter. Inventory search and the lead forms bring the next conversation back to the store.",
    features: [
      "Public inventory",
      "Lead forms",
      "Event pages",
      "Parts counter",
      "Inventory search",
    ],
  },
] as const satisfies readonly Module[];

export type ModuleSlug = (typeof modules)[number]["slug"];

export const dealershipOs = {
  name: "Dealership OS",
  definition:
    "Dealership OS is the full store: the sales floor, the service lane, and the books, in one system.",
  body: "The four modules cover how you sell, how you service, how you market, and the site customers see. The operating system is the rest of the rooftop, including parts and the books. It is coming soon and is not for sale yet.",
} as const;

export function moduleBySlug(slug: string) {
  return modules.find((module) => module.slug === slug) ?? null;
}

export const faqs = [
  {
    question: "Who is DealerAgent for?",
    answer:
      "Dealerships. The modules cover sales, service, marketing, and the public website.",
  },
  {
    question: "How does pricing work?",
    answer: `Sales and service access is ${money(pricing.userPrice)} per user each month, and marketing is included. The website is ${money(pricing.websitePrice)} a month. Each rooftop after the first is ${money(pricing.additionalRooftopPrice)} a month.`,
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
    description: `${siteName} is software for dealerships. ${promise}`,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Dealerships",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Sales and service access",
        price: String(pricing.userPrice),
        priceCurrency: "USD",
        description: "Sales CRM, Service CRM, and Marketing for one user each month.",
      },
      {
        "@type": "Offer",
        name: "Website",
        price: String(pricing.websitePrice),
        priceCurrency: "USD",
        description: "The public website, billed once each month.",
      },
      {
        "@type": "Offer",
        name: "Additional rooftop",
        price: String(pricing.additionalRooftopPrice),
        priceCurrency: "USD",
        description: "Each rooftop after the first, each month. The first rooftop is included.",
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
    `${siteName} is software for dealerships.`,
    "",
    promise,
    "",
    "Pricing, billed monthly:",
    `- Sales and service access: ${money(pricing.userPrice)} per user. Marketing is included. One person is not billed twice.`,
    `- Website: ${money(pricing.websitePrice)} per month.`,
    `- Additional rooftop: ${money(pricing.additionalRooftopPrice)} per month. The first rooftop is included.`,
    "",
    "Modules:",
    ...modules.map((module) => `- ${module.name}. ${module.definition}`),
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
