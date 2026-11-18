import { money } from "@/lib/money";

export const siteName = "DealerAgent";
export const contactEmail = "hello@elevatedhelm.com";

export const promise = "Run your dealership from one system.";

export const lede =
  "Sales and service are one price per user. Add the website, a rooftop for each extra store, or the AI agents for the whole account.";

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
  agentPrice: 299,
} as const;

export type Pricing = {
  userPrice: number;
  websitePrice: number;
  additionalRooftopPrice: number;
  agentPrice: number;
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
  input: { users: number; rooftops: number; website: boolean; agents: boolean },
) {
  const users = Math.min(999, Math.max(1, Math.floor(input.users) || 1));
  const rooftops = Math.min(999, Math.max(1, Math.floor(input.rooftops) || 1));
  const additionalRooftops = rooftops - 1;
  const usersTotal = users * rates.userPrice;
  const websiteTotal = input.website ? rates.websitePrice : 0;
  const rooftopsTotal = additionalRooftops * rates.additionalRooftopPrice;
  const agentsTotal = input.agents ? rates.agentPrice : 0;
  return {
    users,
    rooftops,
    additionalRooftops,
    usersTotal,
    websiteTotal,
    rooftopsTotal,
    agentsTotal,
    total: usersTotal + websiteTotal + rooftopsTotal + agentsTotal,
  };
}

export type AgentProfile = {
  name: string;
  role: string;
  summary: string;
  limit: string;
};

export const agents = {
  name: "AI agents",
  definition:
    "Six agents share one command center. They draft the work, cite the record, and wait for a person before the store changes.",
  body: "The add-on is one monthly price for the account. It does not change with the user count or the number of rooftops.",
  commandCenter:
    "Every job is a work case. The case holds the customer, the unit, the quote or repair order, the tasks, the draft, and the approval, with the evidence and the time beside each step.",
  approval:
    "An agent can read the dealership, prepare a draft, and propose the next step. Saving a quote, creating a service task, changing a price, or sending a message waits for a person. The approval is recorded on the case.",
  handoff:
    "Sally's quote, Sven's repair order, Karen's draft, and Jim's exception can stay on the same case. The timeline shows who acted, what they used, and what is still waiting.",
  roster: [
    {
      name: "Sally",
      role: "Sales",
      summary:
        "She turns a lead and an in-stock unit into a quote. If the lead or the unit is ambiguous, she asks before she prices it. The quote shows the selling price and the breakdown, and it is saved only after a person confirms. She can open the follow-up on that same case.",
      limit: "She does not submit financing and she does not send the quote out.",
    },
    {
      name: "Sven",
      role: "Service",
      summary:
        "He reads the repair order, drafts the estimate and the work plan, and routes that draft for approval. After a person approves, he creates the assigned service task and updates the case.",
      limit: "He does not message the customer and he does not place a supplier order.",
    },
    {
      name: "Karen",
      role: "Communications",
      summary:
        "She reads the case and the customer's contact preferences, then writes the message. The draft stays in review until a person approves it.",
      limit: "She does not send email or text on her own.",
    },
    {
      name: "Jim",
      role: "General manager",
      summary:
        "He finds an overdue sales or service exception and cites the record, the owner, and the time. He names who should act and proposes the task. A material edit waits for approval.",
      limit: "He does not invent a number that is not in the dealership's records.",
    },
    {
      name: "Ed",
      role: "Training",
      summary:
        "He answers a staff question from the dealership's approved policies and cites the source, the section, and the version. If the policy is not there, he says he does not have it.",
      limit: "He does not write a rule that was not approved, and he does not open a file the person is not allowed to see.",
    },
    {
      name: "Manny",
      role: "Sales intelligence",
      summary:
        "He counts leads, sales, conversion, and aging for a model, and he shows the dates and the totals those numbers come from. He proposes the next action.",
      limit: "He does not change a price on his own.",
    },
  ],
} as const satisfies {
  name: string;
  definition: string;
  body: string;
  commandCenter: string;
  approval: string;
  handoff: string;
  roster: readonly AgentProfile[];
};

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
    answer: `Sales and service access is ${money(pricing.userPrice)} per user each month, and marketing is included. The website is ${money(pricing.websitePrice)} a month. Each rooftop after the first is ${money(pricing.additionalRooftopPrice)} a month. The AI agents add-on is ${money(pricing.agentPrice)} a month for the whole account.`,
  },
  {
    question: "What do the AI agents do?",
    answer:
      "Sally quotes, Sven drafts the repair order, Karen writes the customer message, Jim cites exceptions for the general manager, Ed answers from approved policy, and Manny counts leads and sales by model. They share one case. A person approves a change before it is saved or sent.",
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
      {
        "@type": "Offer",
        name: agents.name,
        price: String(pricing.agentPrice),
        priceCurrency: "USD",
        description: `${agents.definition} ${money(pricing.agentPrice)} a month for the account.`,
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
    `- ${agents.name}: ${money(pricing.agentPrice)} per month for the account. The price does not change with users or rooftops.`,
    "",
    agents.definition,
    agents.commandCenter,
    agents.approval,
    agents.handoff,
    ...agents.roster.map((agent) => `- ${agent.name} (${agent.role}). ${agent.summary} ${agent.limit}`),
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
