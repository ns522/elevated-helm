import { money } from "@/lib/money";

export const siteName = "DealerAgent";
export const contactEmail = "hello@elevatedhelm.com";

export const promise = "Run your dealership from one system.";

export const lede =
  "Sales, service, and marketing share one $99 user seat. Add the public website, add extra rooftops as you grow, and turn on six human-approved AI agents for the whole store.";

export const includedLine =
  "Every user seat includes shared customer and unit records, two-way SMS and call logs, master search, a dealership calendar, tasks, payments, and scorecards.";

export const annualNote =
  "Annual billing is ten months of the monthly price. Two months are included.";

export type Billing = "user" | "flat" | "included";

export type WorkflowBlock = {
  title: string;
  body: string;
};

export type Module = {
  slug: string;
  name: string;
  navLabel: string;
  billing: Billing;
  price: number;
  definition: string;
  story: string;
  features: readonly string[];
  workflows: readonly WorkflowBlock[];
  agentRoles: readonly string[];
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
  const monthlyTotal = usersTotal + websiteTotal + rooftopsTotal + agentsTotal;
  return {
    users,
    rooftops,
    additionalRooftops,
    usersTotal,
    websiteTotal,
    rooftopsTotal,
    agentsTotal,
    total: monthlyTotal,
    annualTotal: monthlyTotal * 10,
    annualSavings: monthlyTotal * 2,
  };
}

export const sharedCore = [
  {
    title: "3-column customer & unit history",
    body: "Sales deals, service repair orders, and every conversation sit side by side on one profile. Spouse and co-owner accounts link cleanly, duplicate files merge without losing history, and owned units keep their full service timeline when sold to a new owner.",
  },
  {
    title: "Shared two-way SMS, MMS & call logs",
    body: "Text customers across department numbers, run group MMS threads with co-buyers and advisors, play call recordings with AI transcripts inside the timeline, and keep a live response wallboard on the floor.",
  },
  {
    title: "Master ⌘K search, calendar & routines",
    body: "Jump straight to any customer, VIN/HIN/serial, stock unit, quote, or repair order. A shared calendar layers demos, deliveries, service drop-offs, mobile techs, and staff meetings alongside daily task cadences.",
  },
  {
    title: "Payments, review recovery & scorecards",
    body: "Send Stripe deposit or invoice links by text or QR code. Post-visit surveys send 4–5 star owners to Google Reviews and route 1–3 star feedback into a manager recovery queue before it goes public.",
  },
] as const satisfies readonly WorkflowBlock[];

export type AgentProfile = {
  name: string;
  role: string;
  summary: string;
  limit: string;
  triggers: readonly string[];
};

export type RiskTier = {
  tier: string;
  rule: string;
  examples: string;
};

export const agents = {
  name: "AI agents",
  definition:
    "Six specialized dealership managers share one Command Center and one Work Case — drafting quotes, repair estimates, customer replies, SOP answers, and exception reviews while a person approves every store change.",
  body: "The AI agents add-on is a flat $299 a month for the entire account. Every user and every rooftop on your account gets the full six-agent team without per-seat or per-token add-on fees.",
  commandCenter:
    "Instead of scattering alerts across four tabs, related work lands on one AI Work Case. Each case links the customer, the stock or customer-owned unit, the Quick Quote, the repair order, assigned staff tasks, message drafts, and cited evidence — exposing one clear Next Action with a named owner and due date.",
  approval:
    "Server-side permissions enforce four risk tiers. Agents read scoped records and run math immediately, log low-risk internal follow-ups with idempotent keys, pause medium-risk CRM writes in Awaiting Approval, and hard-gate outbound texts, emails, financing, and pricing. No agent or requester can approve its own proposal.",
  handoff:
    "Sally's approved quote, Sven's pre-delivery or seasonal estimate, Karen's grounded customer message draft, and Jim's cited GM exception stay on the same case timeline. When signals conflict — such as high repair spend paired with a customer text saying they plan to keep their unit — confidence drops automatically instead of pushing unwanted sales outreach.",
  riskTiers: [
    {
      tier: "1 · Read & analyze",
      rule: "Runs immediately within role permissions",
      examples:
        "Pre-arrival service briefs, unanswered SMS episode checks, model conversion math, and natural-language ⌘K lookups. Confidential dealer cost stays hidden from customer-facing outputs.",
    },
    {
      tier: "2 · Low-risk internal support",
      rule: "Logged with idempotent replay protection",
      examples:
        "Scheduling a rep follow-up after a quote is approved, answering a staff policy question with section citations, or logging an undocumented SOP gap for leadership.",
    },
    {
      tier: "3 · Medium-risk CRM writes",
      rule: "Halts in Awaiting Approval until a person confirms",
      examples:
        "Saving a Quick Quote, writing labor and parts lines to a service estimate, assigning a technician task, or opening a GM exception task. Requesters cannot self-approve.",
    },
    {
      tier: "4 · Outbound & financial gates",
      rule: "Hard-blocked from silent execution",
      examples:
        "Sending customer SMS or email, submitting lender financing, placing supplier POs, quoting sold units, or pricing below dealer costline. Ambiguous names or stock units always pause to ask.",
    },
  ] as const satisfies readonly RiskTier[],
  roster: [
    {
      name: "Sally",
      role: "Sales",
      summary:
        "Builds real Quick Quotes by selling price or target margin using live inventory, fee and tax defaults, rebates, and trade equity — updating the same quote cleanly as deals evolve. Opens the rep follow-up on approval, ranks daily Next Best Actions, scores Opportunity Health, and spots 30-month or service-triggered upgrade windows.",
      limit:
        "Refuses sold units and below-costline prices, keeps dealer cost confidential, and never submits financing or sends a quote out on her own.",
      triggers: [
        "Conversational Quick Quote by price or margin",
        "Automatic 2-day rep follow-up after quote approval",
        "Overdue lead & upgrade-window prioritization",
      ],
    },
    {
      name: "Sven",
      role: "Service",
      summary:
        "Reads open repair orders, rewrites raw check-in complaints into structured tech verification steps, drafts itemized labor and parts estimates, and routes technician tasks once approved. Preps advisor pre-arrival briefs with prior declined-work memory and compares parts vendors by true landed cost against promised pickup dates.",
      limit:
        "Never messages the customer directly, alters an unapproved RO, pitches sales during a service visit, or places a supplier order without approval.",
      triggers: [
        "Pre-arrival check-in brief & declined-work recall",
        "Itemized RO estimate draft & post-approval tech task",
        "Stalled RO, promised-date risk & landed-cost parts check",
      ],
    },
    {
      name: "Karen",
      role: "Communications",
      summary:
        "Composes customer SMS and email drafts strictly from verified quotes and approved service estimates on the work case — inserting explicit human-review flags if a figure is missing. Watches open threads in shop working hours to catch unanswered customer questions, missed staff promises, and sentiment drops.",
      limit:
        "Outbound send routes stay hard-gated; a person reviews and sends every message, and a quick reply never falsely closes an underlying follow-up task.",
      triggers: [
        "Case-grounded quote & estimate message drafts",
        "Shop-hours unanswered question & promise watch",
        "Employee alert queue with manager dispute review",
      ],
    },
    {
      name: "Jim",
      role: "General manager",
      summary:
        "Audits overdue leads, aging repair orders, margin anomalies, and missed commitments across the dealership — requiring a cited record ID, observed timestamp, accountable owner, and dollar amount on every exception. Isolates concurrent sales and service cases for the same customer so decisions never bleed across departments.",
      limit:
        "Rejects uncited claims, never invents numbers, and waits for explicit owner or GM approval before creating corrective tasks.",
      triggers: [
        "Cited sales, service & SLA exception proposals",
        "Per-case isolation when one customer has two active jobs",
        "Owner approval queue & immutable decision history",
      ],
    },
    {
      name: "Ed",
      role: "Training & policy",
      summary:
        "Answers staff 'How do we do this?' questions strictly from approved dealership SOPs and manufacturer guides, citing the exact document, section, and version — abstaining and logging a Knowledge Gap when no policy covers it. Runs personalized ~12-minute daily lessons (Learn, AI role-play, server-graded quiz) and a manager Skill Map.",
      limit:
        "Enforces role-based document access, never fabricates store rules, and never changes employee roles, pay, or HR records.",
      triggers: [
        "Ask Ed policy Q&A with exact section & version citations",
        "4-stage role-play & server-graded daily training",
        "Department Skill Map & key-person coverage risk",
      ],
    },
    {
      name: "Manny",
      role: "Sales intelligence",
      summary:
        "Aggregates lead volume, sold units, conversion rates, and lot aging by model with transparent date windows and denominators — automatically deduplicating repeat inquiries from the same shopper so conversion math stays accurate. Proposes stocking and follow-up actions tied to real demand.",
      limit:
        "Read-only over pricing and accounting; never mutates live unit prices or inventory visibility autonomously.",
      triggers: [
        "Deduplicated model-level lead-to-sale conversion",
        "Days-on-lot aging & demand breakdowns",
        "Transparent denominators with zero-lead safety",
      ],
    },
  ],
} as const;

export const modules = [
  {
    slug: "sales-crm",
    name: "Sales CRM",
    navLabel: "Sales",
    billing: "user",
    price: 99,
    definition:
      "Sales CRM takes a buyer from first inquiry to funded delivery: lead routing, major-unit inventory, PIN-protected Quick Quotes, 4-square desking, F&I menus, appraisals, consignments, and events.",
    story:
      "Capture web, phone, ad, and show QR leads without duplicates — repeat inquiries merge onto the existing buyer and wake up dormant files. Price in-stock or custom-order units with confidential dealer costlines, present an interactive 4-square and customer F&I protection menu with true monthly payment math, and track every stipulation through delivery.",
    features: [
      "Lead routing, repeat-inquiry merge & Day-1 cadences",
      "Major-unit & bundled package inventory (VIN / HIN / serial)",
      "AI factory build-sheet & invoice PDF extraction",
      "PIN-protected Quick Quotes & window sticker PDFs",
      "9-stage 4-Square Desking & customer F&I menu",
      "Trade appraisals, consignments & service-lane sourcing",
      "Off-site shows, demo days & QR booth capture",
      "Customers and the units they own",
    ],
    workflows: [
      {
        title: "Speed-to-lead without duplicate clutter",
        body: "Website forms, marketplace leads, and booth QR scans route round-robin and schedule a 4-step Day-1 call/text/email cadence (with drafts waiting for human confirmation). Repeat inquiries merge onto the original record, flag 'Submitted again', and revive closed leads on schedule.",
      },
      {
        title: "Inventory, AI build sheets & PIN cost protection",
        body: "Track new, pre-owned, on-order, and consignment units — including bundled parent/child packages like trailers or attachments. Upload OEM build sheets or invoices to extract options automatically, print QR window stickers, and keep dealer cost locked behind a manager PIN on the showroom floor.",
      },
      {
        title: "9-stage Desking & customer F&I menu",
        body: "Move from Quick Quote into a guided Deal Completion workflow: cash vs. finance 4-square with trade equity and payoff math, tablet-friendly Protection & Accessories menu showing exact amortized monthly impact, preflight ID/doc checks, lender stipulations, and service PDI clearance.",
      },
      {
        title: "Appraisals, consignments & portfolio sourcing",
        body: "Build market evaluations from owned units on file, run consignment prep across Sales and Service with digital e-sign contracts, and search past service units for trade-up matches with owner contact details masked until a manager approves outreach.",
      },
    ],
    agentRoles: ["Sally", "Manny", "Karen", "Jim"],
  },
  {
    slug: "service-crm",
    name: "Service CRM",
    navLabel: "Service",
    billing: "user",
    price: 99,
    definition:
      "Service CRM runs the shop and mobile lane: online requests, arrival check-in, mobile photo/video estimate approvals, a distraction-free tech workboard, digital inspections, and automated owner updates.",
    story:
      "Move every customer unit and internal sales PDI across a visual Kanban board with configurable SLA aging timers that turn yellow and red before a job stalls. Text owners a tokenized link to approve or defer individual jobs on their phone, keep deferred work saved for the next visit, and give technicians a clean clock-in, checklist, and video workspace.",
    features: [
      "Shop & mobile Kanban board with SLA aging alerts",
      "Guided arrival check-in & walkaround media",
      "Mobile customer estimate approval (approve / defer per job)",
      "Saved-for-later declined work memory on the unit",
      "Distraction-free Tech Workboard & labor clock-in",
      "Digital multi-point inspections & customer report links",
      "Automated 3-day owner updates & waiting-parts chases",
      "Internal sales PDI & consignment recon tracking",
    ],
    workflows: [
      {
        title: "Visual lane control from drop-off to pickup",
        body: "Track Scheduled, Dropped Off, Checked In, Needs Attention, Invoice Sent, Waiting Parts, Ready to Work, In Progress, Courtesy Clean, and Ready for Pickup — plus a dedicated Mobile Service pipeline. Per-stage hour and shop-day thresholds highlight aging units automatically.",
      },
      {
        title: "One-tap mobile estimate approval with photos",
        body: "Send customers a clean link showing technician photos and itemized jobs. Owners approve, decline, or defer individual lines on their phone; warranty lines show no charge, shop supplies recalculate automatically, and deferred jobs stay pinned to the unit for next season.",
      },
      {
        title: "Built for technicians, not paperwork",
        body: "Technicians open a focused workboard showing assigned ROs, multi-point inspection matrices (Good / Needs Attention / Critical with required photos), OEM service bulletins, streaming video walkarounds, and one-tap completion handoff back to the advisor.",
      },
      {
        title: "No black-hole repair orders",
        body: "Recurring 3-day customer update reminders and waiting-parts vendor chases keep advisors ahead of calls, backed by morning digests and end-of-day accountability summaries for service leadership.",
      },
    ],
    agentRoles: ["Sven", "Karen", "Jim", "Ed"],
  },
  {
    slug: "marketing",
    name: "Marketing",
    navLabel: "Marketing",
    billing: "included",
    price: 99,
    definition:
      "Marketing is included with every user seat: a Master Planner, Brand Book, social and event studio, CRM audience sync, paid ad handoffs, and multi-touch sold-deal attribution.",
    story:
      "Keep your brand standards, floor walkaround photos, event campaigns, email/SMS outreach, and ad creative in the same system as your live inventory and customer list. Back-calculated production deadlines keep creative on schedule, while live CRM sync suppresses recent buyers from prospect ads and ties sold units back to the campaign that started the conversation.",
    features: [
      "Included with every $99 sales & service user seat",
      "Master Planner with back-calculated production deadlines",
      "Interactive Brand Book (logos, colors, fonts, photo library)",
      "Guided campaign, event & floor-social workflows",
      "Live CRM audience sync & sold-buyer suppression",
      "Ready-to-publish Meta, Google, email, SMS & Metricool packages",
      "Campaign landing pages & multi-touch deal attribution",
    ],
    workflows: [
      {
        title: "Marketing Calendar meets Production Calendar",
        body: "Plan customer-facing go-live dates alongside automatic internal production and approval deadlines across Planned, In Production, Awaiting Approval, Approved, Scheduled, and Published — so campaigns stop turning into last-minute fire drills.",
      },
      {
        title: "Floor-to-social capture & Brand Book guardrails",
        body: "Sales and service staff snap real unit walkarounds from the floor; AI drafts channel-specific copy in your Brand Book voice, checks media consent rules, and routes creative for manager sign-off before handoff.",
      },
      {
        title: "Event promotion before, during, and after",
        body: "Spin up coordinated save-the-dates, invitations, RSVP reminders, and post-event thank-you sequences tied directly to dealership open houses, demo tours, and seasonal service clinics.",
      },
      {
        title: "CRM-synced audiences & real deal attribution",
        body: "Segment current owners, service customers, and active prospects directly from CRM records, automatically pull buyers out of prospect ad spend once their deal closes, and track 365-day first-touch to closed-deal ROI.",
      },
    ],
    agentRoles: ["Karen", "Manny"],
  },
  {
    slug: "website",
    name: "Website",
    navLabel: "Website",
    billing: "flat",
    price: 399,
    definition:
      "Website is your high-converting public storefront — reading the exact same inventory, events, and service intake as your CRM so you never enter a unit twice.",
    story:
      "Publish new, pre-owned, and certified inventory the moment it is marked web-visible in Sales CRM, with dealer cost stripped at the database layer. Shoppers filter, compare up to three units side by side, estimate payments, chat with an AI shopper assistant that live staff can join, book service with photo uploads, RSVP to events, and buy from the parts counter.",
    features: [
      "Zero-double-entry live inventory sync from Sales CRM",
      "Instant search workbench, guided unit finder & 3-unit compare",
      "Immersive VDPs with video, 360 views & payment estimator",
      "AI shopper chat with live dealership staff takeover",
      "Hold Unit, Value My Trade, Demo & Financing lead forms",
      "Guided online service scheduling with photo/video upload",
      "Event RSVP pages, parts counter checkout & inline live editor",
    ],
    workflows: [
      {
        title: "One canonical inventory table — zero double entry",
        body: "Your website reads directly from CRM inventory visibility and merchandising controls. Mark a unit available or sold once: active listings update immediately, confidential cost fields never touch public queries, and sold URLs stay live recommending similar in-stock units.",
      },
      {
        title: "Built for how modern buyers actually shop",
        body: "Shoppers toggle between a fast faceted workbench (make, model, year, hours/mileage, price, condition) and a guided 'Help me find it' matcher, save favorites, compare three units side by side, or ask the on-site AI shopper assistant — with one-click live takeover from your team.",
      },
      {
        title: "Every form lands straight in the right rotation",
        body: "Hold This Unit, Value My Trade, Request a Demo, Contact Sales, and Financing forms merge directly into Sales CRM leads; Schedule Service uploads owner photos and symptoms straight into the Service Leads inbox.",
      },
      {
        title: "Click-to-edit pages & AI-ready SEO",
        body: "Sign in to edit headlines, photos, and events directly on the live page. Ships with structured Schema.org vehicle/offer metadata, XML sitemaps, Google Shopping feeds, IndexNow, and /llms.txt out of the box.",
      },
    ],
    agentRoles: ["Sally", "Sven", "Karen"],
  },
] as const satisfies readonly Module[];

export type ModuleSlug = (typeof modules)[number]["slug"];

export const dealershipOs = {
  name: "Dealership OS",
  definition:
    "Dealership OS completes the rooftop: parts counter and barcoding, purchasing, double-entry accounting, lot GPS and floorplan audits, service RFID, and a private dealer-to-dealer inventory exchange.",
  body: "Sales CRM, Service CRM, Marketing, Website, and AI Agents already run on the canonical Dealership OS customer, unit, and deal model. When the back-office operating system opens for general release, stores upgrade in place with zero data migration.",
  pillars: [
    {
      title: "Parts counter, kits & barcode inventory",
      body: "Full SKU master with bin locations, printable Code-128 barcode labels, kits, supersession chains, core charge & RMA tracking, walk-in counter tickets, min/max seasonal reorder POs, mobile cycle counts, and special orders linked directly to Service ROs.",
    },
    {
      title: "Purchasing, payables & native GL accounting",
      body: "Major-unit and parts purchase orders, partial/damaged receiving, vendor bills, and a double-entry General Ledger that auto-posts funded deals, RO invoices, counter sales, and Stripe payments across departmental P&Ls — plus Plaid bank feeds, annual Profit Plan variance lights, and QuickBooks, Sage 50, or Lightspeed bridges.",
    },
    {
      title: "Lot GPS, floorplan rules & service RFID",
      body: "Geofenced unit and coupled-trailer tracking reconciles lot movement against scheduled demos and deliveries, triggers immediate accounting payoff tasks when a sold unit departs, automates weekly physical floorplan audits, and tracks customer service dwell time across yard and shop RFID zones.",
    },
    {
      title: "Private dealer-to-dealer inventory exchange",
      body: "Search and trade wholesale or brand-authorized new units across verified dealerships on the same canonical inventory record. Upload a factory production sheet once, score exact buyer-spec matches with landed transport cost, and keep true dealer cost and unsold leads private.",
    },
  ] as const satisfies readonly WorkflowBlock[],
} as const;

export function moduleBySlug(slug: string) {
  return modules.find((module) => module.slug === slug) ?? null;
}

export const faqs = [
  {
    question: "Who is DealerAgent for?",
    answer:
      "Major-unit dealerships — including automotive, powersports, RV, marine, trailer, heavy equipment, and agricultural stores — running one rooftop or a multi-store group.",
  },
  {
    question: "How does pricing work?",
    answer: `Sales, Service, and Marketing access is ${money(pricing.userPrice)} per user each month — the same employee is never billed twice across departments, and your first rooftop is included. The public Website is ${money(pricing.websitePrice)} a month flat. Each additional rooftop is ${money(pricing.additionalRooftopPrice)} a month, and the six-agent AI Command Center add-on is ${money(pricing.agentPrice)} a month flat for the entire account.`,
  },
  {
    question: "What do the AI agents do — and can they act without permission?",
    answer:
      "Sally builds Quick Quotes and schedules sales follow-ups, Sven drafts repair estimates and shop tasks, Karen writes case-grounded customer texts and watches for unanswered threads, Jim cites overdue sales/service exceptions for the GM, Ed answers staff questions with exact SOP citations, and Manny reconciles model-level conversion and aging. They collaborate on one shared Work Case, and server-side guardrails require a person to approve quotes, estimates, tasks, and outbound messages before anything is saved or sent.",
  },
  {
    question: "How are our dealership data and Legacy DMS history handled?",
    answer:
      "Each dealership runs in an isolated tenant environment with role-based permissions and PIN-protected dealer costlines. Onboarding imports your existing customers, customer-owned units, active inventory, parts, and historical sales and service records from Lightspeed or CSV exports.",
  },
  {
    question: "Is Dealership OS available today?",
    answer:
      "Parts, purchasing, double-entry accounting, floorplan GPS, and the Dealer Exchange are in final rollout as Dealership OS. Every module sold today already shares the same database foundation, so you can start with Sales, Service, Website, and AI Agents now and turn on Dealership OS later without migrating.",
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
    description: `${siteName} is software and human-approved AI management for dealerships. ${promise}`,
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Dealerships",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Sales, service, and marketing access",
        price: String(pricing.userPrice),
        priceCurrency: "USD",
        description: "Sales CRM, Service CRM, Marketing, and shared core tools for one user each month. First rooftop included.",
      },
      {
        "@type": "Offer",
        name: "Website",
        price: String(pricing.websitePrice),
        priceCurrency: "USD",
        description: "The public inventory, service, events, and parts website, billed once each month.",
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
        description: `${agents.definition} ${money(pricing.agentPrice)} a month flat for the account.`,
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
    `${siteName} is software and human-approved AI management for dealerships.`,
    "",
    promise,
    lede,
    "",
    "Pricing, billed monthly:",
    `- Sales, Service, and Marketing access: ${money(pricing.userPrice)} per user. One person is never billed twice across departments, and the first rooftop is included.`,
    `- Website: ${money(pricing.websitePrice)} per month flat.`,
    `- Additional rooftop: ${money(pricing.additionalRooftopPrice)} per month. The first rooftop is included.`,
    `- ${agents.name}: ${money(pricing.agentPrice)} per month flat for the entire account (all users and rooftops).`,
    "",
    "Shared core included with every user:",
    includedLine,
    ...sharedCore.map((item) => `- ${item.title}: ${item.body}`),
    "",
    "AI Command Center & six specialized agents:",
    agents.definition,
    agents.commandCenter,
    agents.approval,
    agents.handoff,
    ...agents.roster.map((agent) => `- ${agent.name} (${agent.role}): ${agent.summary} ${agent.limit}`),
    "",
    "Modules:",
    ...modules.map((module) => `- ${module.name}: ${module.definition} ${module.story}`),
    "",
    annualNote,
    "",
    `${dealershipOs.name} (coming soon): ${dealershipOs.definition} ${dealershipOs.body}`,
    ...dealershipOs.pillars.map((pillar) => `- ${pillar.title}: ${pillar.body}`),
    "",
  ];

  return lines.join("\n");
}
