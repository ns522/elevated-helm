"use client";

import type { Module } from "@/content/site";
import { money } from "@/lib/money";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const buttonClass =
  "inline-flex items-center justify-center rounded-full bg-button px-5 py-2.5 text-sm font-medium text-button-ink transition hover:brightness-95";

export const quietButtonClass =
  "inline-flex items-center justify-center rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink transition hover:border-accent";

export function NavLinks({
  modules,
  className,
}: {
  modules: readonly Pick<Module, "slug" | "navLabel">[];
  className?: string;
}) {
  const pathname = usePathname();
  const items = [
    ...modules.map((module) => ({
      href: `/modules/${module.slug}`,
      label: module.navLabel,
    })),
    { href: "/pricing", label: "Pricing" },
    { href: "/dealership-os", label: "Dealership OS" },
  ];

  return (
    <nav className={className} aria-label="Primary">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={active ? "text-accent" : "text-ink hover:text-accent"}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function Menu({
  modules,
}: {
  modules: readonly Pick<Module, "slug" | "navLabel">[];
}) {
  return (
    <details className="relative md:hidden">
      <summary className="cursor-pointer list-none rounded-full border border-line bg-surface px-4 py-2 text-sm [&::-webkit-details-marker]:hidden">
        Menu
      </summary>
      <NavLinks
        modules={modules}
        className="absolute right-0 z-20 mt-2 flex w-52 flex-col gap-3 rounded-2xl border border-line bg-surface p-4 text-sm shadow-none"
      />
    </details>
  );
}

export function PriceTag({ amount }: { amount: number }) {
  return <span className="tabular-nums text-price">{money(amount)}</span>;
}
