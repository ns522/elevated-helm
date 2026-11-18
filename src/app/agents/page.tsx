import { AgentStage } from "@/components/agent-stage";
import { PriceTag, buttonClass, quietButtonClass } from "@/components/chrome";
import { DemoForm } from "@/components/demo-form";
import { Editable } from "@/components/editor/editable";
import { JsonLd } from "@/components/json-ld";
import { getSiteContent, softwareJsonLd } from "@/lib/content/load";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.agents.name,
    description: content.agents.definition,
  };
}

export default async function AgentsPage() {
  const content = await getSiteContent();
  const product = content.agents;

  return (
    <>
      <JsonLd data={softwareJsonLd(content)} />
      <article className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-20">
        <p className="text-sm font-medium text-accent">Add-on · One flat price for the store</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight sm:text-6xl">
          <Editable path="agents.name" value={product.name}>
            {product.name}
          </Editable>
        </h1>
        <p className="mt-6 max-w-3xl text-xl leading-8">
          <Editable path="agents.definition" value={product.definition}>
            {product.definition}
          </Editable>
        </p>
        <p className="mt-8 text-2xl">
          <Editable path="pricing.agentPrice" kind="number" value={String(content.pricing.agentPrice)}>
            <PriceTag amount={content.pricing.agentPrice} />
          </Editable>
          <span className="text-sm text-muted"> / month flat for the account — all users &amp; rooftops</span>
        </p>
        <p className="mt-3 max-w-2xl leading-7 text-muted">
          <Editable path="agents.body" value={product.body}>
            {product.body}
          </Editable>
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#demo" className={buttonClass}>
            Request a demo
          </a>
          <Link href="/pricing#calculator" className={quietButtonClass}>
            Calculate monthly total
          </Link>
        </div>

        <section className="mt-14" aria-label="Interactive AI Command Center">
          <AgentStage shots={product.shots} />
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-3" aria-labelledby="command-heading">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <h2 id="command-heading" className="font-serif text-2xl tracking-tight">
              Shared Work Cases
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              <Editable path="agents.commandCenter" value={product.commandCenter}>
                {product.commandCenter}
              </Editable>
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="font-serif text-2xl tracking-tight">
              Human approval &amp; separation of duties
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              <Editable path="agents.approval" value={product.approval}>
                {product.approval}
              </Editable>
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="font-serif text-2xl tracking-tight">
              Cross-agent handoffs &amp; signal fusion
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              <Editable path="agents.handoff" value={product.handoff}>
                {product.handoff}
              </Editable>
            </p>
          </div>
        </section>
      </article>

      <section className="border-y border-line bg-surface" aria-labelledby="governance-heading">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-sm font-medium text-accent">Server-enforced guardrails</p>
          <h2 id="governance-heading" className="mt-3 font-serif text-4xl tracking-tight">
            What runs automatically vs. what waits for a person
          </h2>
          <p className="mt-3 max-w-2xl text-muted">
            Permissions are enforced on the server, not just hidden in the interface. Approval cannot be
            inferred from casual chat text, and every decision writes an immutable audit entry.
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {product.riskTiers.map((tier, index) => (
              <li key={tier.tier} className="rounded-3xl border border-line bg-bg p-6">
                <p className="text-xs font-semibold tracking-wide text-accent uppercase">
                  <Editable path={`agents.riskTiers.${index}.tier`} value={tier.tier}>
                    {tier.tier}
                  </Editable>
                </p>
                <h3 className="mt-2 font-serif text-2xl tracking-tight">
                  <Editable path={`agents.riskTiers.${index}.rule`} value={tier.rule}>
                    {tier.rule}
                  </Editable>
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  <Editable path={`agents.riskTiers.${index}.examples`} value={tier.examples}>
                    {tier.examples}
                  </Editable>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20" aria-labelledby="roster-heading">
        <p className="text-sm font-medium text-accent">Included in the $299 / month add-on</p>
        <h2 id="roster-heading" className="mt-3 font-serif text-4xl tracking-tight">
          The six AI managers
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Each manager owns a defined department role, reads live dealership records within user
          permissions, and hands context cleanly across shared Work Cases.
        </p>
        <ul className="mt-10 grid gap-5 lg:grid-cols-2">
          {product.roster.map((agent, index) => (
            <li key={agent.name} className="flex flex-col justify-between rounded-3xl border border-line bg-surface p-6">
              <div>
                <p className="text-sm font-medium text-accent">
                  <Editable path={`agents.roster.${index}.role`} value={agent.role}>
                    {agent.role}
                  </Editable>
                </p>
                <h3 className="mt-1 font-serif text-3xl tracking-tight">
                  <Editable path={`agents.roster.${index}.name`} value={agent.name}>
                    {agent.name}
                  </Editable>
                </h3>
                <p className="mt-4 text-sm leading-7">
                  <Editable path={`agents.roster.${index}.summary`} value={agent.summary}>
                    {agent.summary}
                  </Editable>
                </p>
                <ul
                  className="mt-5 flex flex-wrap gap-2"
                  data-edit-path={`agents.roster.${index}.triggers`}
                  data-edit-kind="lines"
                  data-edit-value={agent.triggers.join("\n")}
                >
                  {agent.triggers.map((trigger) => (
                    <li key={trigger} className="rounded-full bg-frame px-3 py-1 text-xs text-ink">
                      {trigger}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-5 border-t border-line pt-4 text-xs leading-5 text-muted">
                <strong className="font-semibold text-ink">Boundary: </strong>
                <Editable path={`agents.roster.${index}.limit`} value={agent.limit}>
                  {agent.limit}
                </Editable>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="demo" className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <DemoForm
            modules={content.modules.map(({ slug, name }) => ({ slug, name }))}
            osName={content.dealershipOs.name}
            agentName={product.name}
            defaultAgent
            heading="See the AI Command Center in action"
            submitLabel="Request a demo"
            sourcePath="/agents"
          />
        </div>
      </section>
    </>
  );
}
