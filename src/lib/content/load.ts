import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import {
  agents,
  annualNote,
  contactEmail,
  dealershipOs,
  faqs,
  includedLine,
  lede,
  modules,
  pricing,
  promise,
  sharedCore,
  siteName,
  type AgentProfile,
  type Billing,
  type Pricing,
  type RiskTier,
  type WorkflowBlock,
} from "@/content/site";
import { money } from "@/lib/money";
import { shotSrcs } from "@/lib/shots";

export type EditableAgent = {
  name: string;
  role: string;
  summary: string;
  limit: string;
  triggers: string[];
};

export type EditableModule = {
  slug: string;
  name: string;
  navLabel: string;
  billing: Billing;
  price: number;
  definition: string;
  story: string;
  features: string[];
  workflows: WorkflowBlock[];
  agentRoles: string[];
  shots: string[];
};

export type SiteContent = {
  promise: string;
  lede: string;
  includedLine: string;
  annualNote: string;
  contactEmail: string;
  pricing: Pricing;
  sharedCore: WorkflowBlock[];
  modules: EditableModule[];
  dealershipOs: {
    name: string;
    definition: string;
    body: string;
    pillars: WorkflowBlock[];
    shots: string[];
  };
  agents: {
    name: string;
    definition: string;
    body: string;
    commandCenter: string;
    approval: string;
    handoff: string;
    riskTiers: RiskTier[];
    roster: EditableAgent[];
    shots: string[];
  };
  faqs: { question: string; answer: string }[];
};

const filePath = path.join(process.cwd(), "data", "content.json");

function toEditableAgent(agent: AgentProfile): EditableAgent {
  return {
    name: agent.name,
    role: agent.role,
    summary: agent.summary,
    limit: agent.limit,
    triggers: [...agent.triggers],
  };
}

function defaults(): SiteContent {
  return {
    promise,
    lede,
    includedLine,
    annualNote,
    contactEmail,
    pricing: { ...pricing },
    sharedCore: sharedCore.map((item) => ({ ...item })),
    modules: modules.map((module) => ({
      slug: module.slug,
      name: module.name,
      navLabel: module.navLabel,
      billing: module.billing,
      price: module.price,
      definition: module.definition,
      story: module.story,
      features: [...module.features],
      workflows: module.workflows.map((item) => ({ ...item })),
      agentRoles: [...module.agentRoles],
      shots: shotSrcs(module.slug),
    })),
    dealershipOs: {
      name: dealershipOs.name,
      definition: dealershipOs.definition,
      body: dealershipOs.body,
      pillars: dealershipOs.pillars.map((item) => ({ ...item })),
      shots: shotSrcs("dealership-os"),
    },
    agents: {
      name: agents.name,
      definition: agents.definition,
      body: agents.body,
      commandCenter: agents.commandCenter,
      approval: agents.approval,
      handoff: agents.handoff,
      riskTiers: agents.riskTiers.map((tier) => ({ ...tier })),
      roster: agents.roster.map(toEditableAgent),
      shots: shotSrcs("agents"),
    },
    faqs: faqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  };
}

function mergeShots(defaultShots: string[], savedShots?: string[]) {
  const existing = (savedShots ?? []).filter((src) =>
    fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, ""))),
  );
  const merged = [...existing];
  for (const shot of defaultShots) {
    if (!merged.includes(shot)) merged.push(shot);
  }
  return merged;
}

function merge(base: SiteContent, saved: Partial<SiteContent>): SiteContent {
  const modulesBySlug = new Map((saved.modules ?? []).map((module) => [module.slug, module]));
  const savedRoster = saved.agents?.roster ?? [];

  return {
    ...base,
    ...saved,
    pricing: { ...base.pricing, ...saved.pricing },
    sharedCore: saved.sharedCore?.length ? saved.sharedCore : base.sharedCore,
    dealershipOs: {
      ...base.dealershipOs,
      ...saved.dealershipOs,
      pillars: saved.dealershipOs?.pillars?.length ? saved.dealershipOs.pillars : base.dealershipOs.pillars,
      shots: mergeShots(base.dealershipOs.shots, saved.dealershipOs?.shots),
    },
    agents: {
      ...base.agents,
      ...saved.agents,
      riskTiers: saved.agents?.riskTiers?.length ? saved.agents.riskTiers : base.agents.riskTiers,
      roster: base.agents.roster.map((agent, index) => {
        const override = savedRoster[index];
        if (!override) return agent;
        return {
          ...agent,
          ...override,
          triggers: override.triggers?.length ? override.triggers : agent.triggers,
        };
      }),
      shots: mergeShots(base.agents.shots, saved.agents?.shots),
    },
    faqs: saved.faqs?.length ? saved.faqs : base.faqs,
    modules: base.modules.map((module) => {
      const override = modulesBySlug.get(module.slug);
      if (!override) return module;
      return {
        ...module,
        ...override,
        billing: override.billing ?? module.billing,
        features: override.features?.length ? override.features : module.features,
        workflows: override.workflows?.length ? override.workflows : module.workflows,
        agentRoles: override.agentRoles?.length ? override.agentRoles : module.agentRoles,
        shots: mergeShots(module.shots, override.shots),
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
    description: `${siteName} is software and human-approved AI management for dealerships. ${content.promise}`,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Dealerships",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Sales, service, and marketing access",
        price: String(content.pricing.userPrice),
        priceCurrency: "USD",
        description: "Sales CRM, Service CRM, Marketing, and shared core tools for one user each month. First rooftop included.",
      },
      {
        "@type": "Offer",
        name: "Website",
        price: String(content.pricing.websitePrice),
        priceCurrency: "USD",
        description: "The public inventory, service, events, and parts website, billed once each month.",
      },
      {
        "@type": "Offer",
        name: "Additional rooftop",
        price: String(content.pricing.additionalRooftopPrice),
        priceCurrency: "USD",
        description: "Each rooftop after the first, each month. The first rooftop is included.",
      },
      {
        "@type": "Offer",
        name: content.agents.name,
        price: String(content.pricing.agentPrice),
        priceCurrency: "USD",
        description: `${content.agents.definition} ${money(content.pricing.agentPrice)} a month flat for the account.`,
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
    `${siteName} is software and human-approved AI management for dealerships.`,
    "",
    content.promise,
    content.lede,
    "",
    "Pricing, billed monthly:",
    `- Sales, Service, and Marketing access: ${money(content.pricing.userPrice)} per user. One person is never billed twice across departments, and the first rooftop is included.`,
    `- Website: ${money(content.pricing.websitePrice)} per month flat.`,
    `- Additional rooftop: ${money(content.pricing.additionalRooftopPrice)} per month. The first rooftop is included.`,
    `- ${content.agents.name}: ${money(content.pricing.agentPrice)} per month flat for the entire account (all users and rooftops).`,
    "",
    "Shared core included with every user:",
    content.includedLine,
    ...content.sharedCore.map((item) => `- ${item.title}: ${item.body}`),
    "",
    "AI Command Center & six specialized agents:",
    content.agents.definition,
    content.agents.commandCenter,
    content.agents.approval,
    content.agents.handoff,
    ...content.agents.roster.map((agent) => `- ${agent.name} (${agent.role}): ${agent.summary} ${agent.limit}`),
    "",
    "Modules:",
    ...content.modules.map((module) => `- ${module.name}: ${module.definition} ${module.story}`),
    "",
    content.annualNote,
    "",
    `${content.dealershipOs.name} (coming soon): ${content.dealershipOs.definition} ${content.dealershipOs.body}`,
    ...content.dealershipOs.pillars.map((pillar) => `- ${pillar.title}: ${pillar.body}`),
    "",
  ].join("\n");
}
