import { DemoForm } from "@/components/demo-form";
import { Editable } from "@/components/editor/editable";
import { PriceTag } from "@/components/chrome";
import { getSiteContent } from "@/lib/content/load";
import type { Metadata } from "next";

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
      <article className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-medium text-accent">Add-on · in development</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">
          <Editable path="agents.name" value={product.name}>
            {product.name}
          </Editable>
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-8">
          <Editable path="agents.definition" value={product.definition}>
            {product.definition}
          </Editable>
        </p>
        <p className="mt-8 text-lg">
          <Editable path="pricing.agentPrice" kind="number" value={String(content.pricing.agentPrice)}>
            <PriceTag amount={content.pricing.agentPrice} />
          </Editable>
          <span className="text-sm text-muted"> a month for the account</span>
        </p>
        <p className="mt-3 max-w-2xl leading-7 text-muted">
          <Editable path="agents.body" value={product.body}>
            {product.body}
          </Editable>
        </p>

        <section className="mt-16 grid gap-10 lg:grid-cols-3" aria-labelledby="command-heading">
          <div>
            <h2 id="command-heading" className="font-serif text-2xl tracking-tight">
              Command center
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              <Editable path="agents.commandCenter" value={product.commandCenter}>
                {product.commandCenter}
              </Editable>
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl tracking-tight">Approval</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              <Editable path="agents.approval" value={product.approval}>
                {product.approval}
              </Editable>
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl tracking-tight">One case</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              <Editable path="agents.handoff" value={product.handoff}>
                {product.handoff}
              </Editable>
            </p>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="roster-heading">
          <h2 id="roster-heading" className="font-serif text-3xl tracking-tight">
            The six agents
          </h2>
          <ul className="mt-8 grid gap-4 lg:grid-cols-2">
            {product.roster.map((agent) => (
              <li key={agent.name} className="rounded-3xl border border-line bg-surface p-6">
                <p className="text-sm font-medium text-accent">{agent.role}</p>
                <h3 className="mt-2 font-serif text-3xl tracking-tight">{agent.name}</h3>
                <p className="mt-4 leading-7">{agent.summary}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{agent.limit}</p>
              </li>
            ))}
          </ul>
        </section>
      </article>
      <section id="demo" className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <DemoForm
            modules={content.modules}
            osName={content.dealershipOs.name}
            agentName={product.name}
            defaultAgent
            heading="Request a demo"
            submitLabel="Request a demo"
            sourcePath="/agents"
          />
        </div>
      </section>
    </>
  );
}
