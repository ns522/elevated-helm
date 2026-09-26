import { getSiteContent } from "@/lib/content/load";
import { siteName } from "@/content/site";
import Link from "next/link";
import { Menu, NavLinks, buttonClass, quietButtonClass } from "@/components/chrome";

const demoLoginUrl = "https://elevatedhelm.app";

export async function SiteHeader() {
  const content = await getSiteContent();
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-tight">
          {siteName}
        </Link>
        <NavLinks
          modules={content.modules}
          className="hidden items-center gap-5 text-sm md:flex"
        />
        <div className="flex items-center gap-3">
          <a href={demoLoginUrl} className={quietButtonClass}>
            Demo Login
          </a>
          <Link href="/#demo" className={buttonClass}>
            Request a demo
          </Link>
          <Menu modules={content.modules} />
        </div>
      </div>
    </header>
  );
}
