"use client";

import { type Module } from "@/content/site";
import { money } from "@/lib/money";
import { useState } from "react";

export function PricingCalculator({
  modules,
  bundlePrice,
}: {
  modules: readonly Pick<Module, "slug" | "name" | "price">[];
  bundlePrice: number;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const chosen = modules.filter((module) => selected.includes(module.slug));
  const sum = chosen.reduce((total, module) => total + module.price, 0);
  const allSelected = chosen.length === modules.length && modules.length > 0;
  const total = allSelected ? bundlePrice : sum;
  const separate = modules.reduce((total, module) => total + module.price, 0);
  const savings = separate - bundlePrice;

  function toggle(slug: string) {
    setSelected((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
    );
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_18rem]">
      <fieldset>
        <legend className="text-sm font-medium">Choose modules for this rooftop</legend>
        <div className="mt-4 grid gap-3">
          {modules.map((module) => {
            const checked = selected.includes(module.slug);
            return (
              <label
                key={module.slug}
                className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-4 transition ${
                  checked ? "border-accent bg-frame" : "border-line bg-surface hover:border-accent"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(module.slug)}
                    className="size-4 accent-[var(--accent)]"
                  />
                  <span>{module.name}</span>
                </span>
                <span className="tabular-nums text-price">{money(module.price)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div
        aria-live="polite"
        className={`rounded-3xl border bg-surface p-6 transition lg:sticky lg:top-6 ${
          allSelected ? "border-accent" : "border-line"
        }`}
      >
        <p className="text-sm text-muted">{allSelected ? "Helm" : "Monthly total"}</p>
        <p key={chosen.length === 0 ? "empty" : total} className="swap mt-2 font-serif text-5xl tracking-tight text-price">
          {chosen.length === 0 ? "—" : money(total)}
        </p>
        <p className="mt-2 text-sm text-muted">per rooftop, each month</p>
        {allSelected ? (
          <p className="mt-4 text-sm leading-6">
            You save {money(savings)} compared with {money(separate)} bought separately.
          </p>
        ) : (
          <p className="mt-4 text-sm leading-6 text-muted">
            All four modules are {money(bundlePrice)} a month on the Helm bundle.
          </p>
        )}
      </div>
    </div>
  );
}
