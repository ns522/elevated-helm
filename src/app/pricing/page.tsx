import { Editable } from "@/components/editor/editable";
import { PriceTag, buttonClass } from "@/components/chrome";
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
    description: `Sales and service are ${money(content.pricing.userPrice)} per user. The website is ${money(content.pricing.websitePrice)} a month. Each additional rooftop is ${money(content.pricing.additionalRooftopPrice)} a month. AI agents are ${money(content.pricing.agentPrice)} a month for the account.`,
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
          Billed monthly. One user price covers sales and service.{" "}
          <Editable path="includedLine" value={content.includedLine}>
            {content.includedLine}
          </Editable>
        </p>

        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          <li className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="font-serif text-2xl tracking-tight">Sales and service</h2>
            <p className="mt-4 text-3xl">
              <Editable path="pricing.userPrice" kind="number" value={String(content.pricing.userPrice)}>
                <PriceTag amount={content.pricing.userPrice} />
              </Editable>
              <span className="text-sm text-muted"> per user / month</span>
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">
              One person gets Sales CRM, Service CRM, and Marketing. The same person is not billed twice.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
              <Link href="/modules/sales-crm" className="text-accent">
                See Sales CRM
              </Link>
              <Link href="/modules/service-crm" className="text-accent">
                See Service CRM
              </Link>
            </div>
          </li>
          <li className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="font-serif text-2xl tracking-tight">Website</h2>
            <p className="mt-4 text-3xl">
              <Editable path="pricing.websitePrice" kind="number" value={String(content.pricing.websitePrice)}>
                <PriceTag amount={content.pricing.websitePrice} />
              </Editable>
              <span className="text-sm text-muted"> / month</span>
            </p>
            <p className="mt-4 text-sm leading-6 text-muted">
              The public site for the account. This price does not change with the user count.
            </p>
            <Link href="/modules/website" className="mt-6 inline-block text-sm font-medium text-accent">
              See Website
            </Link>
          </li>
          <li className="rounded-3xl border border-accent bg-surface p-6">
            <h2 className="font-serif text-2xl tracking-tight">Additional rooftop</h2>
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
              The first rooftop is included. Each store after that is this price.
            </p>
            <a href="#calculator" className={`${buttonClass} mt-6`}>
              Build a total
            </a>
          </li>
        </ul>

        <div className="mt-4 rounded-3xl border border-line bg-surface p-6">
          <p className="text-sm font-medium text-accent">Add-on</p>
          <h2 className="mt-3 font-serif text-2xl tracking-tight">
            <Editable path="agents.name" value={content.agents.name}>
              {content.agents.name}
            </Editable>
          </h2>
          <p className="mt-4 text-3xl">
            <Editable path="pricing.agentPrice" kind="number" value={String(content.pricing.agentPrice)}>
              <PriceTag amount={content.pricing.agentPrice} />
            </Editable>
            <span className="text-sm text-muted"> / month</span>
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
            <Editable path="agents.body" value={content.agents.body}>
              {content.agents.body}
            </Editable>
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6">
            <Editable path="agents.definition" value={content.agents.definition}>
              {content.agents.definition}
            </Editable>
          </p>
          <Link href="/agents" className="mt-6 inline-block text-sm font-medium text-accent">
            See the six agents
          </Link>
        </div>
      </section>

      <section id="calculator" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-3xl tracking-tight">Monthly total</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Set the users, the rooftops, and whether you want the website and the AI agents.
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

      <section className="border-t border-line" aria-labelledby="comparison-heading">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 id="comparison-heading" className="font-serif text-3xl tracking-tight">
            What each module includes
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <caption className="sr-only">Prices and included features</caption>
              <thead>
                <tr className="border-b border-line text-muted">
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Module
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
                      {sales.name}
                    </th>
                    <td className="py-4 pr-4 tabular-nums text-price">
                      {money(content.pricing.userPrice)} per user
                    </td>
                    <td className="py-4 text-muted">{sales.features.join(", ")}</td>
                  </tr>
                ) : null}
                {service ? (
                  <tr className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium">
                      {service.name}
                    </th>
                    <td className="py-4 pr-4 text-muted">Included with the user price</td>
                    <td className="py-4 text-muted">{service.features.join(", ")}</td>
                  </tr>
                ) : null}
                {marketing ? (
                  <tr className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium">
                      {marketing.name}
                    </th>
                    <td className="py-4 pr-4 text-muted">Included with the user price</td>
                    <td className="py-4 text-muted">{marketing.features.join(", ")}</td>
                  </tr>
                ) : null}
                {website ? (
                  <tr className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium">
                      {website.name}
                    </th>
                    <td className="py-4 pr-4 tabular-nums text-price">
                      {money(content.pricing.websitePrice)} / month
                    </td>
                    <td className="py-4 text-muted">{website.features.join(", ")}</td>
                  </tr>
                ) : null}
                <tr className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-4 font-medium">
                    Additional rooftop
                  </th>
                  <td className="py-4 pr-4 tabular-nums text-price">
                    {money(content.pricing.additionalRooftopPrice)} / month
                  </td>
                  <td className="py-4 text-muted">The first rooftop is included.</td>
                </tr>
                <tr className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-4 font-medium">
                    {content.agents.name}
                  </th>
                  <td className="py-4 pr-4 tabular-nums text-price">
                    {money(content.pricing.agentPrice)} / month
                  </td>
                  <td className="py-4 text-muted">
                    Sally, Sven, Karen, Jim, Ed, and Manny. One price for the account.{" "}
                    <Link href="/agents" className="font-medium text-accent">
                      See the agents
                    </Link>
                  </td>
                </tr>
                <tr className="align-top">
                  <th scope="row" className="py-4 pr-4 font-medium">
                    {content.dealershipOs.name}
                  </th>
                  <td className="py-4 pr-4">Coming soon</td>
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
            modules={content.modules}
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
