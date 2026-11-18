import { buttonClass, quietButtonClass } from "@/components/chrome";
import { DemoForm } from "@/components/demo-form";
import { Editable } from "@/components/editor/editable";
import { JsonLd } from "@/components/json-ld";
import { MobileShowcase } from "@/components/mobile-showcase";
import { ModuleSwitcher } from "@/components/module-switcher";
import { ProductStage } from "@/components/product-stage";
import { faqJsonLd, getSiteContent, softwareJsonLd } from "@/lib/content/load";
import { money } from "@/lib/money";
import Link from "next/link";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <>
      <JsonLd data={softwareJsonLd(content)} />
      <JsonLd data={faqJsonLd(content)} />

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 sm:pt-24">
        <p className="text-sm font-medium text-accent">
          For dealerships · automotive, powersports, RV, marine &amp; equipment
        </p>
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
          <Link href="/pricing" className={buttonClass}>
            See pricing
          </Link>
          <Link href="/agents" className={quietButtonClass}>
            Explore AI agents
          </Link>
          <Link href="#demo" className={quietButtonClass}>
            Request a demo
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20" aria-labelledby="modules-heading">
        <div className="mb-8">
          <h2 id="modules-heading" className="font-serif text-3xl tracking-tight sm:text-4xl">
            Modules
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            <Editable path="includedLine" value={content.includedLine}>
              {content.includedLine}
            </Editable>
          </p>
        </div>
        <ModuleSwitcher modules={content.modules} pricing={content.pricing} />
      </section>

      <section className="border-t border-line" aria-labelledby="shared-core-heading">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium text-accent">Shared core</p>
          <h2 id="shared-core-heading" className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
            Included with every {money(content.pricing.userPrice)} user seat
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
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

          <div className="mt-8 grid items-center gap-8 rounded-3xl border border-line bg-surface p-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-accent uppercase">
                Customer &amp; Unit Files
              </p>
              <h3 className="mt-2 font-serif text-3xl tracking-tight">
                Every household, every unit, and every check-in in one file
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                Sales history, active and past repair orders, saved-for-later service items, spouse and
                co-owner SMS threads, and AI call transcripts live together. When a boat or vehicle is sold
                to a new owner, its 5-slot walkaround gallery, serials, key codes, and check-in history stay
                intact on the permanent Unit File.
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
                <Link href="/modules/service-crm" className="text-accent">
                  See Service Module &amp; guided check-in →
                </Link>
                <Link href="/modules/sales-crm" className="text-accent">
                  See Sales Module →
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="text-xs font-semibold text-accent uppercase">3-column Customer File</p>
                <p className="mt-1.5 text-xs leading-5 text-muted">
                  Sales deals, Service ROs, and Conversations (SMS, email, recorded calls &amp; AI
                  transcripts) side by side with spouse/partner household links.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="text-xs font-semibold text-accent uppercase">5-slot Unit gallery</p>
                <p className="mt-1.5 text-xs leading-5 text-muted">
                  Port, Starboard, Bow, Stern &amp; Interior slots plus HIN, Trailer VIN, Engine &amp;
                  Ignition Code records verified at arrival check-in.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="text-xs font-semibold text-accent uppercase">Multi-owner timeline</p>
                <p className="mt-1.5 text-xs leading-5 text-muted">
                  Tracks Primary, Co-Owner, and Previous owners — transferring a sold unit preserves its
                  lifetime check-in and service history without duplicates.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="text-xs font-semibold text-accent uppercase">Saved for next service</p>
                <p className="mt-1.5 text-xs leading-5 text-muted">
                  Declined or deferred jobs stay pinned to the Unit File and surface automatically the next
                  time that unit books an appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="mobile-heading">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium text-accent">Phones &amp; tablets</p>
          <h2 id="mobile-heading" className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
            Built for the service ramp, the lot, and the showroom desk
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Your team is rarely sitting behind a desktop monitor. DealerAgent runs natively in the browser
            on iPhones, Android phones, and iPads — from camera check-ins and technician workboards to
            tablet F&amp;I presentations and customer mobile approvals.
          </p>
          <div className="mt-8">
            <MobileShowcase initialScene="floor-phone" />
          </div>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="agents-heading">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-accent">Add-on</p>
              <h2 id="agents-heading" className="mt-3 font-serif text-4xl tracking-tight">
                <Editable path="agents.name" value={content.agents.name}>
                  {content.agents.name}
                </Editable>
              </h2>
            </div>
            <p className="text-2xl tabular-nums text-price">
              <Editable
                path="pricing.agentPrice"
                kind="number"
                value={String(content.pricing.agentPrice)}
              >
                {money(content.pricing.agentPrice)}
              </Editable>
              <span className="text-sm text-muted"> / month flat for the account</span>
            </p>
          </div>

          <p className="mt-4 max-w-3xl text-lg leading-8">
            <Editable path="agents.definition" value={content.agents.definition}>
              {content.agents.definition}
            </Editable>
          </p>

          <div className="mt-10 space-y-6">
            <ProductStage
              slug="agents"
              name={content.agents.name}
              shots={content.agents.shots}
              editPath="agents.shots"
            />
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-3xl border border-line bg-surface p-6">
                <h3 className="font-serif text-2xl tracking-tight">Shared Work Cases</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  <Editable path="agents.commandCenter" value={content.agents.commandCenter}>
                    {content.agents.commandCenter}
                  </Editable>
                </p>
              </div>
              <div className="rounded-3xl border border-line bg-surface p-6">
                <h3 className="font-serif text-2xl tracking-tight">Human-gated approvals</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  <Editable path="agents.approval" value={content.agents.approval}>
                    {content.agents.approval}
                  </Editable>
                </p>
              </div>
              <div className="rounded-3xl border border-line bg-surface p-6">
                <h3 className="font-serif text-2xl tracking-tight">Cross-agent handoffs</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  <Editable path="agents.handoff" value={content.agents.handoff}>
                    {content.agents.handoff}
                  </Editable>
                </p>
              </div>
            </div>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.agents.roster.map((agent, index) => (
              <li
                key={`${agent.name}-${index}`}
                className="flex flex-col rounded-3xl border border-line bg-surface p-6"
              >
                <p className="text-sm font-medium text-accent">
                  <Editable path={`agents.roster.${index}.role`} value={agent.role}>
                    {agent.role}
                  </Editable>
                </p>
                <h3 className="mt-1 font-serif text-2xl tracking-tight">
                  <Editable path={`agents.roster.${index}.name`} value={agent.name}>
                    {agent.name}
                  </Editable>
                </h3>
                <p className="mt-3 text-sm leading-6 text-ink">
                  <Editable path={`agents.roster.${index}.summary`} value={agent.summary}>
                    {agent.summary}
                  </Editable>
                </p>
                <div className="mt-auto pt-4">
                  <p className="border-t border-line pt-3 text-xs leading-5 text-muted">
                    <span className="font-medium text-ink">Guardrail: </span>
                    <Editable path={`agents.roster.${index}.limit`} value={agent.limit}>
                      {agent.limit}
                    </Editable>
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/agents" className={buttonClass}>
              Explore the Command Center
            </Link>
            <Link href="/pricing#calculator" className={quietButtonClass}>
              Calculate monthly total
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface" aria-labelledby="os-heading">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-accent">Coming soon</p>
            <h2 id="os-heading" className="mt-3 font-serif text-4xl tracking-tight">
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
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
                  {index + 1}
                </span>
                <Link href={`/modules/${module.slug}`} className="text-sm font-medium hover:text-accent">
                  {module.name}
                </Link>
                <span className="ml-auto text-xs text-muted">Available</span>
              </li>
            ))}
            <li className="flex items-center gap-4 rounded-2xl border border-line bg-bg px-4 py-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
                {content.modules.length + 1}
              </span>
              <Link href="/agents" className="text-sm font-medium hover:text-accent">
                {content.agents.name}
              </Link>
              <span className="ml-auto text-xs text-muted">Available · add-on</span>
            </li>
            <li className="flex items-center gap-4 rounded-2xl border border-dashed border-line px-4 py-3">
              <span className="pulse-dot size-8 shrink-0 rounded-full bg-frame" />
              <Link href="/dealership-os" className="text-sm font-medium hover:text-accent">
                {content.dealershipOs.name}
              </Link>
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
            modules={content.modules.map(({ slug, name }) => ({ slug, name }))}
            osName={content.dealershipOs.name}
            agentName={content.agents.name}
            heading="Request a demo"
            submitLabel="Request a demo"
            sourcePath="/"
          />
        </div>
      </section>
    </>
  );
}
