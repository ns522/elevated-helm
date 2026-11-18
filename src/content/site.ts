import { money } from "@/lib/money";

export const siteName = "DealerAgent";
export const contactEmail = "hello@elevatedhelm.com";

export const promise = "Run your dealership from one system.";

export const lede =
  "Sales, service, and marketing share one $99 user seat — built for desktops, tablets, and phones across the lot and service lane. Add the public website, extra rooftops, or six human-approved AI agents.";

export const includedLine =
  "Every user seat includes lifetime Customer & Unit Files, two-way SMS and call logs, a unified appointment calendar, master search, tasks, payments, and full phone & tablet access.";

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
    title: "Lifetime Customer & Unit Files",
    body: "Sales deals, service repair orders, and every conversation sit side by side on a 3-column customer profile with spouse and co-owner household linking. Every VIN/HIN/serial gets a permanent Unit File holding 5-slot walkaround photos, Primary / Co-Owner / Previous owner timelines that preserve service history across resales, serial and key codes, warranty dates, and saved-for-later jobs.",
  },
  {
    title: "Guided arrival check-in on every visit",
    body: "Every boat or unit arriving for service goes through the same phone-and-tablet check-in walkthrough: 5 canonical walkaround photo slots (reusing primary photos on return visits), fuel/hours/key verification, multi-point condition checks requiring photos and notes on any issue, and live OEM service bulletin matching.",
  },
  {
    title: "Appointment calendar, two-way SMS & call logs",
    body: "Color-coded Month, Week, and Mobile Day calendars layer drop-offs, pick-ups, mobile service, demos, deliveries, and staff time off — with 1-tap missed-appointment reschedule texts, shared SMS/MMS lines, group co-buyer threads, and call recordings with AI transcripts.",
  },
  {
    title: "Native-feel phone & tablet workflows",
    body: "Staff switch seamlessly between desktop monitors, showroom iPads, and lot or shop phones with dedicated mobile layouts, pinned bottom navigation, camera VIN/HIN capture, Stripe QR/SMS payment links, and post-visit review recovery.",
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
    name: "Sales Module",
    navLabel: "Sales",
    billing: "user",
    price: 99,
    definition:
      "Sales Module takes a buyer from first inquiry to funded delivery — on desktop, showroom tablet, or lot phone — with lead routing, major-unit inventory, PIN-protected Quick Quotes, 4-square desking, F&I menus, appraisals, consignments, and shared Customer & Unit Files.",
    story:
      "Capture web, phone, ad, and show QR leads without duplicates — repeat inquiries merge onto the existing Customer File and wake up dormant leads. Price in-stock or custom-order units with confidential dealer costlines, hand an iPad across the desk for guided 4-square and F&I protection selection, and transfer sold units cleanly onto the buyer's permanent Unit File.",
    features: [
      "Lead routing, repeat-inquiry merge & Day-1 cadences",
      "Major-unit & bundled package inventory (VIN / HIN / serial)",
      "AI factory build-sheet & invoice PDF extraction",
      "PIN-protected Quick Quotes & QR window sticker PDFs",
      "9-stage 4-Square Desking & tablet Customer F&I menu",
      "Trade appraisals, consignments & service-lane sourcing",
      "Off-site shows, demo days & mobile QR booth capture",
      "Shared Customer & Unit Files (household, ownership & RO history)",
    ],
    workflows: [
      {
        title: "Speed-to-lead from desk or lot phone",
        body: "Website forms, marketplace leads, and booth QR scans route round-robin and schedule a 4-step Day-1 call/text/email cadence (with drafts waiting for human confirmation). Repeat inquiries merge onto the original Customer File, flag 'Submitted again', and revive closed leads on schedule.",
      },
      {
        title: "Inventory, AI build sheets & PIN cost protection",
        body: "Track new, pre-owned, on-order, and consignment units — including bundled parent/child packages like trailers or outboards/attachments. Upload OEM build sheets or invoices to extract options automatically, print QR window stickers, and keep dealer cost locked behind a manager PIN.",
      },
      {
        title: "9-stage Desking & iPad customer F&I menu",
        body: "Move from Quick Quote into a guided Deal Completion workflow: cash vs. finance 4-square with trade equity and payoff math, live synced tablet Protection & Accessories menu showing exact amortized monthly impact, preflight ID/doc checks, lender stipulations, and service PDI clearance.",
      },
      {
        title: "Customer & Unit Files, trades & consignments",
        body: "Build trade evaluations directly from the customer's existing Unit File (with prior check-in photos and RO history already attached), run consignment prep across Sales and Service with mobile e-sign contracts, and mine service-lane units with masked PII until a manager approves outreach.",
      },
    ],
    agentRoles: ["Sally", "Manny", "Karen", "Jim"],
  },
  {
    slug: "service-crm",
    name: "Service Module",
    navLabel: "Service",
    billing: "user",
    price: 99,
    definition:
      "Service Module runs the shop, ramp, and mobile lane: guided arrival check-ins on every boat or unit, deep Repair Order detail workspaces, a color-coded appointment calendar, one-tap mobile customer approvals, and a tablet Tech Workboard.",
    story:
      "Every unit arriving on the ramp goes through a guided phone-or-tablet check-in that captures walkaround photos, hours, condition, defect photos, and live OEM service bulletins straight onto its permanent Unit File. Advisors work from a complete RO detail page with live customer SMS and @mention internal comms on the right rail, while owners approve or defer jobs from their phone.",
    features: [
      "Guided Arrival Check-In on every visit (walkaround slots, MPI & bulletins)",
      "Full RO detail page (10 tabs + right-rail Customer SMS & @mentions)",
      "Color-coded appointment calendar & 1-tap missed-visit SMS",
      "Mobile customer estimate approval (approve / decline / defer per job)",
      "Permanent Unit Files (5-slot photos, multi-owner history & saved jobs)",
      "Shop & mobile Kanban board with SLA aging alerts",
      "Phone & tablet Tech Workboard, labor clocks & video walkarounds",
      "Automated 3-day owner updates & waiting-parts vendor chases",
    ],
    workflows: [
      {
        title: "Comprehensive guided check-in on every visit",
        body: "Every boat or unit gets a structured 3-stage arrival walkthrough on a phone or tablet: verify HIN/VIN/hours/fuel/keys, capture 5 canonical walkaround slots (Port, Starboard, Bow, Stern, Interior — reusing primary photos on return visits with 1-tap accept or retake), require notes and defect photos on any Needs Attention / Critical item, and match live OEM service bulletins before promoting the RO to Checked In.",
      },
      {
        title: "Repair Order detail workspace & live right-rail comms",
        body: "Open any RO to see its visual stage pipeline, days on lot, and 10 instant tabs — Customer & Unit, Appointment Details, Jobs (with Labor, Parts, Form, Warranty, and Job Photos), Labor Time clocked vs. billed, Parts Pick with printable bin tags, Forms, Media, Mobile site/gate codes, Storage, and split Customer/Warranty/Internal Invoicing — beside live Customer SMS and @mention team chat.",
      },
      {
        title: "Color-coded appointment & lane calendar",
        body: "Manage Drop-offs, Pick-ups, Mobile Service dispatches, Promised Completion targets, Sales Demos, Deliveries, and Approved Time Off across Month, Week, and touch-friendly Mobile Day views. Past-due arrivals flag automatically with a 1-tap 'Send Missed Text & Mark No-Show' action.",
      },
      {
        title: "One-tap mobile estimate approval & Unit File memory",
        body: "Text owners a zero-login phone link with technician inspection photos and itemized jobs. Customers tap Approve, Decline, or Defer per line — warranty jobs show No charge, shop supplies recalculate live, and deferred jobs stay pinned to the Unit File's 'Saved for next service' banner for their next visit.",
      },
      {
        title: "Kanban lane control & SLA aging timers",
        body: "Move customer units and internal sales PDIs across Scheduled, Dropped Off, Checked In, Invoice Sent, Waiting Parts, Ready to Work, In Progress, Courtesy Clean, and Ready for Pickup. Configurable hour and shop-day thresholds highlight aging cards yellow and red before promises slip.",
      },
      {
        title: "Phone & tablet Tech Workboard + 3-day updates",
        body: "Technicians work from a distraction-free mobile or tablet board: clock in/out of jobs, snap camera photos or streaming walkaround videos, complete inspection matrices, and tap Complete to alert the advisor — backed by automated 3-day owner update reminders and parts-chase queues.",
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
      "Publish new, pre-owned, and certified inventory the moment it is marked web-visible in Sales Module, with dealer cost stripped at the database layer. Shoppers filter, compare up to three units side by side on phone or desktop, estimate payments, chat with an AI shopper assistant that live staff can join, book service with photo uploads, RSVP to events, and buy from the parts counter.",
    features: [
      "Zero-double-entry live inventory sync from Sales Module",
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
        body: "Hold This Unit, Value My Trade, Request a Demo, Contact Sales, and Financing forms merge directly into Sales Module leads; Schedule Service uploads owner photos and symptoms straight into the Service Module leads inbox.",
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
    "Dealership OS is a full-package dealer management system — built-in accounting, links to QuickBooks, Sage 50, and Xero, invoicing, parts ordering and receiving, geofenced timeclock, and payroll in one place.",
  body: "Run your official books inside DealerAgent or sync cleanly with QuickBooks, Sage 50, Xero, and Lightspeed. Every front-counter module sold today already writes to the same customer, unit, repair order, and deal records, so stores upgrade into the full DMS with zero data migration.",
  pillars: [
    {
      title: "Built-in accounting + QuickBooks, Sage 50 & Xero",
      body: "Use the native double-entry General Ledger as your books of record — complete with departmental P&Ls, Trial Balance, Balance Sheet, AR/AP aging, period close, Profit Plan variance lights, and Plaid/CSV bank reconciliation — or link directly to QuickBooks, Sage 50, Xero, and Lightspeed.",
    },
    {
      title: "Parts inventory, ordering & receiving",
      body: "Manage your full SKU master, bin locations, printable barcode labels, kits, supersessions, and core/RMA returns. Generate min/max seasonal reorder POs, receive partial or damaged shipments into stock, lock RO special orders until parts arrive, and run mobile barcode cycle counts.",
    },
    {
      title: "Invoicing, billing & vendor payables",
      body: "Bill service repair orders (automatically splitting Customer Pay, Warranty Receivable, and Internal Shop Expense), ring up walk-in parts counter tickets, run recurring storage billing, collect Stripe card/ACH/QR payments, and track vendor bills through payment.",
    },
    {
      title: "Geofenced timeclock, overtime & PTO",
      body: "Track attendance separately from technician RO billing clocks with server-verified GPS geofences, a live clocked-in board, missed clock-out and meal-break compliance prompts, automatic daily and weekly overtime rules, and vacation/sick leave approvals.",
    },
    {
      title: "Payroll, commissions & pay plans",
      body: "Prepare weekly, biweekly, or bimonthly payroll in one workspace combining hourly and salary timesheets, technician flagged labor hours, spiffs, configurable sales draw/commission plans, and funded-deal commission sign-off.",
    },
    {
      title: "Unit receiving, titles & floorplan control",
      body: "Track factory unit purchase orders from order to lot arrival, verify MSO, title, and trade lien payoff checklists, post funded deal recaps, monitor lender floorplan curtailments and payoffs, and manage multi-rooftop transfers.",
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
      "Dealership OS — our full-package DMS with built-in accounting, QuickBooks/Sage 50/Xero links, invoicing, parts ordering and receiving, geofenced timeclock, and payroll — is in final rollout. Every module sold today already shares the same database foundation, so you can start now and turn on Dealership OS later without migrating.",
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
        description: "Sales Module, Service Module, Marketing, and shared core tools for one user each month. First rooftop included.",
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
