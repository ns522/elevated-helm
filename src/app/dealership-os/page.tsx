import { buttonClass, quietButtonClass } from "@/components/chrome";
import { DealershipOsStage } from "@/components/dealership-os-stage";
import { DemoForm } from "@/components/demo-form";
import { Editable } from "@/components/editor/editable";
import { getSiteContent } from "@/lib/content/load";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.dealershipOs.name,
    description: `${content.dealershipOs.definition} Coming soon.`,
  };
}

const accountingConnections = [
  "Built-in Double-Entry GL",
  "QuickBooks Online & Desktop",
  "Sage 50",
  "Xero",
  "Lightspeed Cutover Bridge",
  "Plaid / CSV Bank Feeds",
] as const;

const liveFoundation = [
  {
    name: "Sales Module",
    href: "/modules/sales-crm",
    detail: "Canonical Customer & Unit Files, major-unit VIN/HIN/serials, Quick Quotes, and 4-Square deals.",
  },
  {
    name: "Service Module",
    href: "/modules/service-crm",
    detail: "Guided arrival check-ins, 10-tab RO detail pages, appointment calendar, and mobile approvals.",
  },
  {
    name: "Marketing",
    href: "/modules/marketing",
    detail: "Live CRM audience segments, Brand Book assets, event RSVPs, and closed-deal attribution.",
  },
  {
    name: "Website",
    href: "/modules/website",
    detail: "Public inventory workbench, AI shopper chat, online service intake, and parts counter storefront.",
  },
  {
    name: "AI agents",
    href: "/agents",
    detail: "Six human-approved managers collaborating on one shared Work Case across departments.",
  },
] as const;

export default async function DealershipOsPage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-20">
        <p className="text-sm font-medium text-accent">Coming soon · Full-package DMS</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight sm:text-6xl">
          <Editable path="dealershipOs.name" value={content.dealershipOs.name}>
            {content.dealershipOs.name}
          </Editable>
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-8">
          <Editable path="dealershipOs.definition" value={content.dealershipOs.definition}>
            {content.dealershipOs.definition}
          </Editable>
        </p>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          <Editable path="dealershipOs.body" value={content.dealershipOs.body}>
            {content.dealershipOs.body}
          </Editable>
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {accountingConnections.map((item) => (
            <span
              key={item}
              className="rounded-full border border-line bg-surface px-3.5 py-1 text-xs font-medium text-ink"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#demo" className={buttonClass}>
            Join the waitlist
          </a>
          <Link href="/pricing" className={quietButtonClass}>
            See what ships today
          </Link>
        </div>

        <div className="mt-14">
          <DealershipOsStage shots={content.dealershipOs.shots} />
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="pillars-heading">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium text-accent">Complete back office</p>
          <h2 id="pillars-heading" className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
            Every function needed to run the entire dealership
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Accounting, invoicing, parts ordering and receiving, attendance, payroll, and unit floorplan
            operations built into the exact same database as your sales floor and service lane.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.dealershipOs.pillars.map((pillar, index) => (
              <li key={pillar.title} className="rounded-3xl border border-line bg-surface p-6">
                <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-serif text-2xl tracking-tight">
                  <Editable path={`dealershipOs.pillars.${index}.title`} value={pillar.title}>
                    {pillar.title}
                  </Editable>
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  <Editable path={`dealershipOs.pillars.${index}.body`} value={pillar.body}>
                    {pillar.body}
                  </Editable>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-line bg-surface" aria-labelledby="upgrade-heading">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-accent">Zero migration path</p>
            <h2 id="upgrade-heading" className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              Start today, upgrade into the full DMS in place
            </h2>
            <p className="mt-4 text-lg leading-8">
              Every dealership running Sales Module, Service Module, Marketing, Website, and AI agents today is
              already writing to the canonical Dealership OS data model.
            </p>
            <p className="mt-3 leading-7 text-muted">
              Customer households, VIN/HIN/serial units, desked deals, repair orders, parts requests, and
              Stripe payments stay right where they are when Dealership OS unlocks — plus guided Lightspeed
              and CSV import tools bring over your historical vendors, parts bins, closed ROs, and GL
              balances.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
              <Link href="/pricing" className="text-accent">
                See today&apos;s pricing
              </Link>
              <Link href="/agents" className="text-accent">
                Explore the six AI agents
              </Link>
            </div>
          </div>

          <ol className="grid gap-3">
            {liveFoundation.map((item, index) => (
              <li
                key={item.href}
                className="flex items-start gap-4 rounded-2xl border border-line bg-bg p-4"
              >
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <Link href={item.href} className="text-sm font-medium hover:text-accent">
                      {item.name}
                    </Link>
                    <span className="shrink-0 text-xs font-medium text-muted">Live today</span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.detail}</p>
                </div>
              </li>
            ))}
            <li className="flex items-start gap-4 rounded-2xl border border-dashed border-accent/50 bg-frame/40 p-4">
              <span className="pulse-dot mt-0.5 size-7 shrink-0 rounded-full bg-accent/20" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{content.dealershipOs.name}</span>
                  <span className="shrink-0 text-xs font-medium text-accent">Unlocks in place</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Built-in GL &amp; QuickBooks/Sage 50/Xero sync, invoicing, parts ordering &amp; receiving,
                  geofenced timeclock, payroll, and unit floorplan turn on directly atop your live records.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section id="demo">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <DemoForm
            modules={content.modules.map(({ slug, name }) => ({ slug, name }))}
            osName={content.dealershipOs.name}
            agentName={content.agents.name}
            heading="Join the Dealership OS waitlist"
            submitLabel="Join the waitlist"
            defaultOs
            sourcePath="/dealership-os"
          />
        </div>
      </section>
    </>
  );
}
