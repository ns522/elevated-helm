import { Editable } from "@/components/editor/editable";
import { PriceTag, buttonClass } from "@/components/chrome";
import { DemoForm } from "@/components/demo-form";
import { JsonLd } from "@/components/json-ld";
import { PricingCalculator } from "@/components/pricing-calculator";
import { bundle } from "@/content/site";
import { getSiteContent, separatePrice, softwareJsonLd } from "@/lib/content/load";
import { money } from "@/lib/money";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Sales CRM, Service CRM, Marketing, and Website, priced per rooftop.",
};

export default async function PricingPage() {
  const content = await getSiteContent();
  const separate = separatePrice(content);
  return (
    <>
      <JsonLd data={softwareJsonLd(content)} />
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h1 className="font-serif text-5xl tracking-tight">Pricing</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          Prices are per rooftop, billed monthly.{" "}
          <Editable path="includedLine" value={content.includedLine}>
            {content.includedLine}
          </Editable>
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {content.modules.map((module) => (
            <li key={module.slug} className="rounded-3xl border border-line bg-surface p-6">
              <h2 className="font-serif text-2xl tracking-tight">{module.name}</h2>
              <p className="mt-4 text-3xl">
                <Editable path={`modules.${module.slug}.price`} kind="number" value={String(module.price)}>
                  <PriceTag amount={module.price} />
                </Editable>
                <span className="text-sm text-muted"> / month</span>
              </p>
              <ul
                className="mt-5 space-y-2 text-sm text-muted"
                data-edit-path={`modules.${module.slug}.features`}
                data-edit-kind="lines"
                data-edit-value={module.features.join("\n")}
              >
                {module.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link href={`/modules/${module.slug}`} className="mt-6 inline-block text-sm font-medium text-accent">
                See {module.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-3xl border border-accent bg-surface p-6">
          <h2 className="font-serif text-2xl tracking-tight">{bundle.name}</h2>
          <p className="mt-2 text-sm text-muted">All four modules, one rooftop.</p>
          <p className="mt-4 text-3xl">
            <Editable path="bundlePrice" kind="number" value={String(content.bundlePrice)}>
              <PriceTag amount={content.bundlePrice} />
            </Editable>
            <span className="text-sm text-muted"> / month</span>
          </p>
          <p className="mt-3 text-sm leading-6">
            Bought separately, the four modules are {money(separate)}.
          </p>
          <a href="#calculator" className={`${buttonClass} mt-6`}>
            Build a total
          </a>
        </div>
      </section>

      <section id="calculator" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-3xl tracking-tight">Monthly total</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Select the modules for one rooftop. Choosing all four uses the {bundle.name} price.
          </p>
          <div className="mt-8">
            <PricingCalculator modules={content.modules} bundlePrice={content.bundlePrice} />
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
              <caption className="sr-only">Module prices and included features</caption>
              <thead>
                <tr className="border-b border-line text-muted">
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Module
                  </th>
                  <th scope="col" className="py-3 pr-4 font-medium">
                    Monthly, per rooftop
                  </th>
                  <th scope="col" className="py-3 font-medium">
                    Includes
                  </th>
                </tr>
              </thead>
              <tbody>
                {content.modules.map((module) => (
                  <tr key={module.slug} className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-medium">
                      {module.name}
                    </th>
                    <td className="py-4 pr-4 tabular-nums text-price">{money(module.price)}</td>
                    <td className="py-4 text-muted">{module.features.join(", ")}</td>
                  </tr>
                ))}
                <tr className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-4 font-medium">
                    {bundle.name}
                  </th>
                  <td className="py-4 pr-4 tabular-nums text-price">{money(content.bundlePrice)}</td>
                  <td className="py-4 text-muted">Sales CRM, Service CRM, Marketing, and Website</td>
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
            email={content.contactEmail}
            osName={content.dealershipOs.name}
            heading="Request a demo"
            submitLabel="Request a demo"
          />
        </div>
      </section>
    </>
  );
}
