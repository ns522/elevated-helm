import { Editable } from "@/components/editor/editable";
import { PriceTag, quietButtonClass } from "@/components/chrome";
import { DemoForm } from "@/components/demo-form";
import { JsonLd } from "@/components/json-ld";
import { PricingCalculator } from "@/components/pricing-calculator";
import { getSiteContent, softwareJsonLd } from "@/lib/content/load";
import { money } from "@/lib/money";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: "Pricing",
    description: `Sales, service, and marketing share one ${money(content.pricing.userPrice)} user seat. Website is ${money(content.pricing.websitePrice)} a month. AI agents are ${money(content.pricing.agentPrice)} a month flat for the account. Each additional rooftop is ${money(content.pricing.additionalRooftopPrice)} a month.`,
  };
}

export default async function PricingPage() {
  const content = await getSiteContent();
  const sales = content.modules.find((module) => module.slug === "sales-crm");
  const service = content.modules.find((module) => module.slug === "service-crm");
  const marketing = content.modules.find((module) => module.slug === "marketing");
  const website = content.modules.find((module) => module.slug === "website");

  return (
    <>
      <JsonLd data={softwareJsonLd(content)} />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="font-serif text-5xl tracking-tight">Pricing</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          Billed monthly or annually (two months included). One user seat covers sales, service, and marketing.{" "}
          <Editable path="includedLine" value={content.includedLine}>
            {content.includedLine}
          </Editable>
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          <li className="flex flex-col justify-between rounded-3xl border border-accent bg-surface p-6">
            <div>
              <p className="inline-flex rounded-full bg-frame px-3 py-1 text-xs font-medium text-accent">
                Core seat · First rooftop included
              </p>
              <h2 className="mt-3 font-serif text-2xl tracking-tight">Sales, service &amp; marketing</h2>
              <p className="mt-4 text-3xl">
                <Editable path="pricing.userPrice" kind="number" value={String(content.pricing.userPrice)}>
                  <PriceTag amount={content.pricing.userPrice} />
                </Editable>
                <span className="text-sm text-muted"> per user / month</span>
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                One employee gets Sales CRM, Service CRM, Marketing, and all shared core tools — never billed twice across departments, with your first rooftop included.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
              <Link href="/modules/sales-crm" className="text-accent">
                See Sales CRM
              </Link>
              <Link href="/modules/service-crm" className="text-accent">
                See Service CRM
              </Link>
              <Link href="/modules/marketing" className="text-accent">
                See Marketing
              </Link>
            </div>
          </li>

          <li className="flex flex-col justify-between rounded-3xl border border-line bg-surface p-6">
            <div>
              <p className="inline-flex rounded-full bg-bg px-3 py-1 text-xs font-medium text-muted">
                Public storefront
              </p>
              <h2 className="mt-3 font-serif text-2xl tracking-tight">Website</h2>
              <p className="mt-4 text-3xl">
                <Editable path="pricing.websitePrice" kind="number" value={String(content.pricing.websitePrice)}>
                  <PriceTag amount={content.pricing.websitePrice} />
                </Editable>
                <span className="text-sm text-muted"> / month</span>
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                Public inventory workbench, AI shopper chat with live staff takeover, lead and service intake forms, events, and parts counter — flat regardless of user count.
              </p>
            </div>
            <div className="mt-6">
              <Link href="/modules/website" className="text-sm font-medium text-accent">
                See Website
              </Link>
            </div>
          </li>

          <li className="flex flex-col justify-between rounded-3xl border border-line bg-surface p-6">
            <div>
              <p className="inline-flex rounded-full bg-frame px-3 py-1 text-xs font-medium text-accent">
                Add-on
              </p>
              <h2 className="mt-3 font-serif text-2xl tracking-tight">
                <Editable path="agents.name" value={content.agents.name}>
                  {content.agents.name}
                </Editable>
              </h2>
              <p className="mt-4 text-3xl">
                <Editable path="pricing.agentPrice" kind="number" value={String(content.pricing.agentPrice)}>
                  <PriceTag amount={content.pricing.agentPrice} />
                </Editable>
                <span className="text-sm text-muted"> / month flat for the account</span>
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                <Editable path="agents.body" value={content.agents.body}>
                  {content.agents.body}
                </Editable>
              </p>
            </div>
            <div className="mt-6">
              <Link href="/agents" className="text-sm font-medium text-accent">
                See the six agents
              </Link>
            </div>
          </li>

          <li className="flex flex-col justify-between rounded-3xl border border-line bg-surface p-6">
            <div>
              <p className="inline-flex rounded-full bg-bg px-3 py-1 text-xs font-medium text-muted">
                Multi-store
              </p>
              <h2 className="mt-3 font-serif text-2xl tracking-tight">Additional rooftop</h2>
              <p className="mt-4 text-3xl">
                <Editable
                  path="pricing.additionalRooftopPrice"
                  kind="number"
                  value={String(content.pricing.additionalRooftopPrice)}
                >
                  <PriceTag amount={content.pricing.additionalRooftopPrice} />
                </Editable>
                <span className="text-sm text-muted"> / month</span>
              </p>
              <p className="mt-4 text-sm leading-6 text-muted">
                First rooftop included. Add extra locations as you grow under one shared group account.
              </p>
            </div>
            <div className="mt-6">
              <a href="#calculator" className={quietButtonClass}>
                Build a total
              </a>
            </div>
          </li>
        </ul>
      </section>

      <section id="calculator" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-3xl tracking-tight">Estimate your store total</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Toggle monthly or annual billing, set your users and rooftops, and choose Website or the AI agents add-on.
          </p>
          <div className="mt-8">
            <PricingCalculator pricing={content.pricing} />
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-6 text-muted">
            <Editable path="annualNote" value={content.annualNote}>
              {content.annualNote}
            </Editable>
          </p>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="shared-core-heading">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 id="shared-core-heading" className="font-serif text-3xl tracking-tight">
            Included with every {money(content.pricing.userPrice)} user seat
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            <Editable path="includedLine" value={content.includedLine}>
              {content.includedLine}
            </Editable>
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {content.sharedCore.map((item, index) => (
              <li key={item.title} className="rounded-3xl border border-line bg-surface p-6">
                <h3 className="font-serif text-2xl tracking-tight">
                  <Editable path={`sharedCore.${index}.title`} value={item.title}>
                    {item.title}
                  </Editable>
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  <Editable path={`sharedCore.${index}.body`} value={item.body}>
                    {item.body}
                  </Editable>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="comparison-heading">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 id="comparison-heading" className="font-serif text-3xl tracking-tight">
            What each module and add-on includes
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <caption className="sr-only">Prices and included features across modules and add-ons</caption>
              <thead>
                <tr className="border-b border-line text-muted">
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Module or add-on
                  </th>
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Price
                  </th>
                  <th scope="col" className="py-3 font-medium">
                    Includes
                  </th>
                </tr>
              </thead>
              <tbody>
                {sales ? (
                  <tr className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium">
                      <Link href={`/modules/${sales.slug}`} className="hover:text-accent">
                        {sales.name}
                      </Link>
                    </th>
                    <td className="py-4 pr-4 tabular-nums text-price">
                      {money(content.pricing.userPrice)} / user / mo
                    </td>
                    <td className="py-4 text-muted">{sales.features.join(" · ")}</td>
                  </tr>
                ) : null}
                {service ? (
                  <tr className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium">
                      <Link href={`/modules/${service.slug}`} className="hover:text-accent">
                        {service.name}
                      </Link>
                    </th>
                    <td className="py-4 pr-4 text-muted">Included with user seat</td>
                    <td className="py-4 text-muted">{service.features.join(" · ")}</td>
                  </tr>
                ) : null}
                {marketing ? (
                  <tr className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium">
                      <Link href={`/modules/${marketing.slug}`} className="hover:text-accent">
                        {marketing.name}
                      </Link>
                    </th>
                    <td className="py-4 pr-4 text-muted">Included with user seat</td>
                    <td className="py-4 text-muted">{marketing.features.join(" · ")}</td>
                  </tr>
                ) : null}
                {website ? (
                  <tr className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium">
                      <Link href={`/modules/${website.slug}`} className="hover:text-accent">
                        {website.name}
                      </Link>
                    </th>
                    <td className="py-4 pr-4 tabular-nums text-price">
                      {money(content.pricing.websitePrice)} / month
                    </td>
                    <td className="py-4 text-muted">{website.features.join(" · ")}</td>
                  </tr>
                ) : null}
                <tr className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-4 font-medium">
                    <Link href="/agents" className="hover:text-accent">
                      {content.agents.name}
                    </Link>
                  </th>
                  <td className="py-4 pr-4 tabular-nums text-price">
                    {money(content.pricing.agentPrice)} / month flat
                  </td>
                  <td className="py-4 text-muted">
                    Sally, Sven, Karen, Jim, Ed, and Manny on one shared Command Center and AI Work Case for every user and rooftop on the account.{" "}
                    <Link href="/agents" className="font-medium text-accent">
                      See the six agents
                    </Link>
                  </td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-4 font-medium">
                    Additional rooftop
                  </th>
                  <td className="py-4 pr-4 tabular-nums text-price">
                    {money(content.pricing.additionalRooftopPrice)} / month
                  </td>
                  <td className="py-4 text-muted">
                    First rooftop included. Add extra dealership locations with shared customer files, inventory visibility, and account-wide AI agents.
                  </td>
                </tr>
                <tr className="align-top">
                  <th scope="row" className="py-4 pr-4 font-medium">
                    <Link href="/dealership-os" className="hover:text-accent">
                      {content.dealershipOs.name}
                    </Link>
                  </th>
                  <td className="py-4 pr-4 text-accent">Coming soon</td>
                  <td className="py-4 text-muted">
                    {content.dealershipOs.definition}{" "}
                    <Link href="/dealership-os" className="font-medium text-accent">
                      Join the waitlist
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="demo" className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <DemoForm
            modules={content.modules.map(({ slug, name }) => ({ slug, name }))}
            osName={content.dealershipOs.name}
            agentName={content.agents.name}
            heading="Request a demo"
            submitLabel="Request a demo"
            sourcePath="/pricing"
          />
        </div>
      </section>
    </>
  );
}
