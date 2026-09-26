import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import {
  annualNote,
  bundle,
  contactEmail,
  dealershipOs,
  faqs,
  includedLine,
  lede,
  modules,
  promise,
  siteName,
} from "@/content/site";
import { money } from "@/lib/money";
import { shotSrcs } from "@/lib/shots";

export type EditableModule = {
  slug: string;
  name: string;
  navLabel: string;
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
  bundlePrice: number;
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
    bundlePrice: bundle.price,
    modules: modules.map((module) => ({
      slug: module.slug,
      name: module.name,
      navLabel: module.navLabel,
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
    dealershipOs: { ...base.dealershipOs, ...saved.dealershipOs },
    faqs: saved.faqs?.length ? saved.faqs : base.faqs,
    modules: base.modules.map((module) => {
      const override = modulesBySlug.get(module.slug);
      if (!override) return module;
      return {
        ...module,
        ...override,
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

export function separatePrice(content: SiteContent) {
  return content.modules.reduce((sum, module) => sum + module.price, 0);
}

export function softwareJsonLd(content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: `${siteName} is software for marine dealerships. ${content.promise}`,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Marine dealerships",
    },
    offers: [
      ...content.modules.map((module) => ({
        "@type": "Offer",
        name: module.name,
        price: String(module.price),
        priceCurrency: "USD",
        description: module.definition,
      })),
      {
        "@type": "Offer",
        name: bundle.name,
        price: String(content.bundlePrice),
        priceCurrency: "USD",
        description: `Sales CRM, Service CRM, Marketing, and Website for one rooftop. Separate price is ${money(separatePrice(content))}.`,
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
  const separate = separatePrice(content);
  return [
    `# ${siteName}`,
    "",
    `${siteName} is software for marine dealerships.`,
    "",
    content.promise,
    "",
    "Modules for sale, priced per rooftop per month:",
    ...content.modules.map((module) => `- ${module.name}: ${money(module.price)}. ${module.definition}`),
    `- ${bundle.name} bundle (all four): ${money(content.bundlePrice)} per month (${money(separate)} if bought separately).`,
    "",
    content.includedLine,
    "",
    content.annualNote,
    "",
    `${content.dealershipOs.name} is coming soon and is not for sale yet. ${content.dealershipOs.definition}`,
    "",
  ].join("\n");
}
