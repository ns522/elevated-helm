import { buttonClass, quietButtonClass } from "@/components/chrome";
import { DemoForm } from "@/components/demo-form";
import { Editable } from "@/components/editor/editable";
import { ProductStage } from "@/components/product-stage";
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

const liveFoundation = [
  {
    name: "Sales CRM",
    href: "/modules/sales-crm",
    detail: "Canonical buyer, co-owner, major-unit VIN/HIN/serial, Quick Quote, and 4-Square deal records.",
  },
  {
    name: "Service CRM",
    href: "/modules/service-crm",
    detail: "Customer-owned unit history, itemized repair orders, technician labor lines, and deferred work.",
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
        <p className="text-sm font-medium text-accent">Coming soon</p>
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
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          <Editable path="dealershipOs.body" value={content.dealershipOs.body}>
            {content.dealershipOs.body}
          </Editable>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#demo" className={buttonClass}>
            Join the waitlist
          </a>
          <Link href="/pricing" className={quietButtonClass}>
            See what ships today
          </Link>
        </div>

        <div className="mt-12">
          <ProductStage
            slug="dealership-os"
            name={content.dealershipOs.name}
            shots={content.dealershipOs.shots}
            editPath="dealershipOs.shots"
          />
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="pillars-heading">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 id="pillars-heading" className="font-serif text-3xl tracking-tight sm:text-4xl">
            What Dealership OS brings to the rooftop
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Parts, purchasing, accounting, lot telemetry, and wholesale exchange capabilities engineered directly into the same database as your front-of-house CRM.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
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
              Start today, upgrade in place
            </h2>
            <p className="mt-4 text-lg leading-8">
              Every dealership running Sales CRM, Service CRM, Marketing, Website, and AI agents today is already writing to the canonical Dealership OS data model.
            </p>
            <p className="mt-3 leading-7 text-muted">
              Customer households, VIN/HIN/serial units, desked deals, repair orders, parts requests, and Stripe payments stay in place when Dealership OS unlocks — no CSV re-imports, no broken unit timelines, and no weekend cutover.
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
                  Parts barcoding, purchasing &amp; native GL accounting, lot GPS &amp; RFID, and the private Dealer Exchange turn on directly atop your live records.
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
            heading="Join the waitlist"
            submitLabel="Join the waitlist"
            defaultOs
            sourcePath="/dealership-os"
          />
        </div>
      </section>
    </>
  );
}
