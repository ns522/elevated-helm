import { siteName } from "@/content/site";
import { getSiteContent } from "@/lib/content/load";
import { Editable } from "@/components/editor/editable";
import Link from "next/link";

export async function SiteFooter() {
  const content = await getSiteContent();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-serif text-xl tracking-tight">{siteName}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
            Software for marine dealerships.
          </p>
        </div>
        <ul className="space-y-2 text-sm">
          {content.modules.map((module) => (
            <li key={module.slug}>
              <Link href={`/modules/${module.slug}`} className="hover:text-accent">
                {module.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="space-y-2 text-sm">
          <li>
            <Link href="/pricing" className="hover:text-accent">
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/dealership-os" className="hover:text-accent">
              Dealership OS
            </Link>
          </li>
          <li>
            <a href={`mailto:${content.contactEmail}`} className="hover:text-accent">
              <Editable path="contactEmail" value={content.contactEmail}>
                {content.contactEmail}
              </Editable>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
