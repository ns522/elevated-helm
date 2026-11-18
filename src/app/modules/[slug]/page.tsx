import { buttonClass, quietButtonClass } from "@/components/chrome";
import { DemoForm } from "@/components/demo-form";
import { Editable } from "@/components/editor/editable";
import { ModulePrice } from "@/components/module-price";
import { ProductStage } from "@/components/product-stage";
import { agents as defaultAgents } from "@/content/site";
import { getSiteContent } from "@/lib/content/load";
import { money } from "@/lib/money";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const content = await getSiteContent();
  return content.modules.map((module) => ({ slug: module.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = content.modules.find((module) => module.slug === slug);
  if (!product) return { title: "Module" };
  return {
    title: product.name,
    description: product.definition,
  };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getSiteContent();
  const product = content.modules.find((module) => module.slug === slug);
  if (!product) notFound();

  const matchingAgents = product.agentRoles.flatMap((roleName) => {
    const rosterIndex = content.agents.roster.findIndex(
      (agent, idx) =>
        agent.name === roleName || defaultAgents.roster[idx]?.name === roleName,
    );
    if (rosterIndex === -1) return [];
    return [{ agent: content.agents.roster[rosterIndex], rosterIndex }];
  });

  const otherModules = content.modules.filter((item) => item.slug !== product.slug);
  const defaultModuleProp: { defaultModule?: string } = { defaultModule: product.name };

  return (
    <>
      <article>
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-20">
          <p className="text-sm font-medium text-accent">Module</p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight sm:text-6xl">
            <Editable path={`modules.${product.slug}.name`} value={product.name}>
              {product.name}
            </Editable>
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-8">
            <Editable path={`modules.${product.slug}.definition`} value={product.definition}>
              {product.definition}
            </Editable>
          </p>
          <p className="mt-4 max-w-3xl leading-7 text-muted">
            <Editable path={`modules.${product.slug}.story`} value={product.story}>
              {product.story}
            </Editable>
          </p>

          <ModulePrice billing={product.billing} pricing={content.pricing} className="mt-8 text-lg" />
          {product.billing === "user" ? (
            <p className="mt-2 max-w-2xl text-sm text-muted">
              One {money(content.pricing.userPrice)} user seat includes Sales CRM, Service CRM, and
              Marketing — the same employee is never billed twice.
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#demo" className={buttonClass}>
              Request a demo
            </Link>
            <Link href="/pricing" className={quietButtonClass}>
              See pricing
            </Link>
          </div>

          <div className="mt-12">
            <ProductStage slug={product.slug} name={product.name} shots={product.shots} />
          </div>
        </section>

        <section className="border-t border-line" aria-labelledby="workflows-heading">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-sm font-medium text-accent">Department workflows</p>
            <h2 id="workflows-heading" className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              How it works on the floor
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {product.workflows.map((workflow, index) => (
                <li key={workflow.title} className="rounded-3xl border border-line bg-surface p-6">
                  <h3 className="font-serif text-2xl tracking-tight">
                    <Editable
                      path={`modules.${product.slug}.workflows.${index}.title`}
                      value={workflow.title}
                    >
                      {workflow.title}
                    </Editable>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    <Editable
                      path={`modules.${product.slug}.workflows.${index}.body`}
                      value={workflow.body}
                    >
                      {workflow.body}
                    </Editable>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line" aria-labelledby="included-heading">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-sm font-medium text-accent">Capabilities</p>
            <h2 id="included-heading" className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">
              What is included
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              <Editable path="includedLine" value={content.includedLine}>
                {content.includedLine}
              </Editable>
            </p>
            <ul
              className="mt-8 grid gap-3 sm:grid-cols-2"
              data-edit-path={`modules.${product.slug}.features`}
              data-edit-kind="lines"
              data-edit-value={product.features.join("\n")}
            >
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="rounded-2xl border border-line bg-surface px-4 py-3.5 text-sm font-medium text-ink"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {matchingAgents.length > 0 ? (
          <section className="border-t border-line" aria-labelledby="module-agents-heading">
            <div className="mx-auto max-w-6xl px-6 py-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-accent">Human-approved AI</p>
                  <h2
                    id="module-agents-heading"
                    className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl"
                  >
                    AI agents in {product.name}
                  </h2>
                </div>
                <Link href="/agents" className="text-sm font-medium text-accent">
                  See all six AI agents · {money(content.pricing.agentPrice)}/mo add-on
                </Link>
              </div>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {matchingAgents.map(({ agent, rosterIndex }) => (
                  <li
                    key={`${agent.name}-${rosterIndex}`}
                    className="flex flex-col rounded-3xl border border-line bg-surface p-6"
                  >
                    <p className="text-sm font-medium text-accent">
                      <Editable path={`agents.roster.${rosterIndex}.role`} value={agent.role}>
                        {agent.role}
                      </Editable>
                    </p>
                    <h3 className="mt-1 font-serif text-2xl tracking-tight">
                      <Editable path={`agents.roster.${rosterIndex}.name`} value={agent.name}>
                        {agent.name}
                      </Editable>
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ink">
                      <Editable
                        path={`agents.roster.${rosterIndex}.summary`}
                        value={agent.summary}
                      >
                        {agent.summary}
                      </Editable>
                    </p>
                    <div className="mt-auto pt-4">
                      <p className="border-t border-line pt-3 text-xs leading-5 text-muted">
                        <span className="font-medium text-ink">Guardrail: </span>
                        <Editable path={`agents.roster.${rosterIndex}.limit`} value={agent.limit}>
                          {agent.limit}
                        </Editable>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="border-t border-line bg-surface" aria-labelledby="other-modules-heading">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-sm font-medium text-accent">Connected suite</p>
            <h2
              id="other-modules-heading"
              className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl"
            >
              Other modules
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {otherModules.map((item) => (
                <Link
                  key={item.slug}
                  href={`/modules/${item.slug}`}
                  className="group flex flex-col justify-between rounded-3xl border border-line bg-bg p-6 transition hover:border-accent"
                >
                  <div>
                    <h3 className="font-serif text-2xl tracking-tight group-hover:text-accent">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.definition}</p>
                  </div>
                  <span className="mt-5 text-xs font-medium text-accent">
                    Explore {item.name} →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </article>

      <section id="demo" className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <DemoForm
            modules={content.modules.map(({ slug, name }) => ({ slug, name }))}
            osName={content.dealershipOs.name}
            agentName={content.agents.name}
            {...defaultModuleProp}
            heading={`See ${product.name} in action`}
            submitLabel="Request a demo"
            sourcePath={`/modules/${product.slug}`}
          />
        </div>
      </section>
    </>
  );
}
