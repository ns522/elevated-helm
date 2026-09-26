import { DemoForm } from "@/components/demo-form";
import { Editable } from "@/components/editor/editable";
import { getSiteContent } from "@/lib/content/load";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.dealershipOs.name,
    description: `${content.dealershipOs.definition} Coming soon.`,
  };
}

export default async function DealershipOsPage() {
  const content = await getSiteContent();
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-sm font-medium text-accent">Coming soon</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">
          <Editable path="dealershipOs.name" value={content.dealershipOs.name}>
            {content.dealershipOs.name}
          </Editable>
        </h1>
        <p className="mt-6 text-xl leading-8">
          <Editable path="dealershipOs.definition" value={content.dealershipOs.definition}>
            {content.dealershipOs.definition}
          </Editable>
        </p>
        <p className="mt-4 leading-7 text-muted">
          <Editable path="dealershipOs.body" value={content.dealershipOs.body}>
            {content.dealershipOs.body}
          </Editable>
        </p>
      </article>
      <section id="demo" className="border-t border-line">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <DemoForm
            modules={content.modules}
            email={content.contactEmail}
            osName={content.dealershipOs.name}
            heading="Join the waitlist"
            submitLabel="Join the waitlist"
            defaultOs
          />
        </div>
      </section>
    </>
  );
}
