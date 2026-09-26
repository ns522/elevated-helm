import { Editable } from "@/components/editor/editable";
import { PriceTag, quietButtonClass } from "@/components/chrome";
import { ProductStage } from "@/components/product-stage";
import { getSiteContent } from "@/lib/content/load";
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

  return (
    <article className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-sm font-medium text-accent">Module</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight">
        <Editable path={`modules.${product.slug}.name`} value={product.name}>
          {product.name}
        </Editable>
      </h1>
      <p className="mt-6 max-w-2xl text-xl leading-8">
        <Editable path={`modules.${product.slug}.definition`} value={product.definition}>
          {product.definition}
        </Editable>
      </p>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        <Editable path="includedLine" value={content.includedLine}>
          {content.includedLine}
        </Editable>
      </p>
      <p className="mt-8 text-lg">
        <Editable path={`modules.${product.slug}.price`} kind="number" value={String(product.price)}>
          <PriceTag amount={product.price} />
        </Editable>
        <span className="text-sm text-muted"> per rooftop, each month</span>
      </p>
      <ul
        className="mt-10 grid gap-3 sm:grid-cols-2"
        data-edit-path={`modules.${product.slug}.features`}
        data-edit-kind="lines"
        data-edit-value={product.features.join("\n")}
      >
        {product.features.map((feature) => (
          <li key={feature} className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-12">
        <ProductStage slug={product.slug} name={product.name} shots={product.shots} />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/pricing" className={quietButtonClass}>
          See pricing
        </Link>
        <Link href="/#demo" className={quietButtonClass}>
          Request a demo
        </Link>
      </div>
    </article>
  );
}
