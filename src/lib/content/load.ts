import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import {
  annualNote,
  contactEmail,
  dealershipOs,
  faqs,
  includedLine,
  lede,
  modules,
  pricing,
  promise,
  siteName,
  type Billing,
  type Pricing,
} from "@/content/site";
import { money } from "@/lib/money";
import { shotSrcs } from "@/lib/shots";

export type EditableModule = {
  slug: string;
  name: string;
  navLabel: string;
  billing: Billing;
  price: number;
  definition: string;
  story: string;
  features: string[];
  shots: string[];
};

export type SiteContent = {
  promise: string;
  lede: string;
  includedLine: string;
  annualNote: string;
  contactEmail: string;
  pricing: Pricing;
  modules: EditableModule[];
  dealershipOs: {
    name: string;
    definition: string;
    body: string;
  };
  faqs: { question: string; answer: string }[];
};

const filePath = path.join(process.cwd(), "data", "content.json");

function defaults(): SiteContent {
  return {
    promise,
    lede,
    includedLine,
    annualNote,
    contactEmail,
    pricing: { ...pricing },
    modules: modules.map((module) => ({
      slug: module.slug,
      name: module.name,
      navLabel: module.navLabel,
      billing: module.billing,
      price: module.price,
      definition: module.definition,
      story: module.story,
      features: [...module.features],
      shots: shotSrcs(module.slug),
    })),
    dealershipOs: {
      name: dealershipOs.name,
      definition: dealershipOs.definition,
      body: dealershipOs.body,
    },
    faqs: faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  };
}

function merge(base: SiteContent, saved: Partial<SiteContent>): SiteContent {
  const modulesBySlug = new Map((saved.modules ?? []).map((module) => [module.slug, module]));
  return {
    ...base,
    ...saved,
    pricing: { ...base.pricing, ...saved.pricing },
    dealershipOs: { ...base.dealershipOs, ...saved.dealershipOs },
    faqs: saved.faqs?.length ? saved.faqs : base.faqs,
    modules: base.modules.map((module) => {
      const override = modulesBySlug.get(module.slug);
      if (!override) return module;
      return {
        ...module,
        ...override,
        billing: override.billing ?? module.billing,
        features: override.features?.length ? override.features : module.features,
        shots: override.shots?.length ? override.shots : module.shots,
      };
    }),
  };
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const base = defaults();
  if (!fs.existsSync(filePath)) return base;
  const saved = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<SiteContent>;
  return merge(base, saved);
});

export async function writeSiteContent(content: SiteContent) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, `${JSON.stringify(content, null, 2)}\n`);
}

export function softwareJsonLd(content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: `${siteName} is software for dealerships. ${content.promise}`,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Dealerships",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Sales and service access",
        price: String(content.pricing.userPrice),
        priceCurrency: "USD",
        description: "Sales CRM, Service CRM, and Marketing for one user each month.",
      },
      {
        "@type": "Offer",
        name: "Website",
        price: String(content.pricing.websitePrice),
        priceCurrency: "USD",
        description: "The public website, billed once each month.",
      },
      {
        "@type": "Offer",
        name: "Additional rooftop",
        price: String(content.pricing.additionalRooftopPrice),
        priceCurrency: "USD",
        description: "Each rooftop after the first, each month. The first rooftop is included.",
      },
    ],
  };
}

export function faqJsonLd(content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function llmsText(content: SiteContent) {
  return [
    `# ${siteName}`,
    "",
    `${siteName} is software for dealerships.`,
    "",
    content.promise,
    "",
    "Pricing, billed monthly:",
    `- Sales and service access: ${money(content.pricing.userPrice)} per user. Marketing is included. One person is not billed twice.`,
    `- Website: ${money(content.pricing.websitePrice)} per month.`,
    `- Additional rooftop: ${money(content.pricing.additionalRooftopPrice)} per month. The first rooftop is included.`,
    "",
    "Modules:",
    ...content.modules.map((module) => `- ${module.name}. ${module.definition}`),
    "",
    content.includedLine,
    "",
    content.annualNote,
    "",
    `${content.dealershipOs.name} is coming soon and is not for sale yet. ${content.dealershipOs.definition}`,
    "",
  ].join("\n");
}
