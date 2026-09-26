import { DemoForm } from "@/components/demo-form";
import { Editable } from "@/components/editor/editable";
import { JsonLd } from "@/components/json-ld";
import { ModuleSwitcher } from "@/components/module-switcher";
import { faqJsonLd, getSiteContent, softwareJsonLd } from "@/lib/content/load";
import Link from "next/link";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <JsonLd data={softwareJsonLd(content)} />
      <JsonLd data={faqJsonLd(content)} />
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-8 sm:pt-24">
        <p className="text-sm font-medium text-accent">For marine dealerships</p>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl tracking-tight sm:text-6xl">
          <Editable path="promise" value={content.promise}>
            {content.promise}
          </Editable>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          <Editable path="lede" value={content.lede}>
            {content.lede}
          </Editable>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-button px-5 py-2.5 text-sm font-medium text-button-ink transition hover:brightness-95"
          >
            See pricing
          </Link>
          <Link
            href="#demo"
            className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent"
          >
            Request a demo
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20" aria-labelledby="modules-heading">
        <div className="mb-8">
          <h2 id="modules-heading" className="font-serif text-3xl tracking-tight">
            Modules
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            <Editable path="includedLine" value={content.includedLine}>
              {content.includedLine}
            </Editable>
          </p>
        </div>
        <ModuleSwitcher modules={content.modules} />
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-accent">Coming soon</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">
              <Editable path="dealershipOs.name" value={content.dealershipOs.name}>
                {content.dealershipOs.name}
              </Editable>
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-8">
              <Editable path="dealershipOs.definition" value={content.dealershipOs.definition}>
                {content.dealershipOs.definition}
              </Editable>
            </p>
            <p className="mt-3 max-w-xl leading-7 text-muted">
              <Editable path="dealershipOs.body" value={content.dealershipOs.body}>
                {content.dealershipOs.body}
              </Editable>
            </p>
            <Link href="/dealership-os" className="mt-6 inline-block text-sm font-medium text-accent">
              Read about {content.dealershipOs.name}
            </Link>
          </div>
          <ol className="grid gap-3">
            {content.modules.map((module, index) => (
              <li
                key={module.slug}
                className="flex items-center gap-4 rounded-2xl border border-line bg-bg px-4 py-3"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-medium">{module.name}</span>
                <span className="ml-auto text-xs text-muted">Available</span>
              </li>
            ))}
            <li className="flex items-center gap-4 rounded-2xl border border-dashed border-line px-4 py-3">
              <span className="pulse-dot size-8 rounded-full bg-frame" />
              <span className="text-sm font-medium">{content.dealershipOs.name}</span>
              <span className="ml-auto text-xs text-accent">Coming soon</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20" aria-labelledby="questions-heading">
        <h2 id="questions-heading" className="font-serif text-3xl tracking-tight">
          Questions
        </h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {content.faqs.map((faq, index) => (
            <details key={faq.question} className="group py-4">
              <summary className="cursor-pointer list-none text-base font-medium [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  <Editable path={`faqs.${index}.question`} value={faq.question}>
                    {faq.question}
                  </Editable>
                  <span className="text-accent transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                <Editable path={`faqs.${index}.answer`} value={faq.answer}>
                  {faq.answer}
                </Editable>
              </p>
            </details>
          ))}
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
