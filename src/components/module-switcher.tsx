"use client";

import type { Module } from "@/content/site";
import { ProductStage } from "@/components/product-stage";
import { money } from "@/lib/money";
import Link from "next/link";
import { useEffect, useState } from "react";

export type SwitcherModule = Module & { shots: string[] };

const tourMs = 4800;

export function ModuleSwitcher({ modules }: { modules: readonly SwitcherModule[] }) {
  const [slug, setSlug] = useState(modules[0]?.slug ?? "");
  const [playing, setPlaying] = useState(true);
  const active = modules.find((module) => module.slug === slug) ?? modules[0];

  useEffect(() => {
    if (!playing || modules.length < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => {
      setSlug((current) => {
        const index = modules.findIndex((module) => module.slug === current);
        return modules[(index + 1) % modules.length]?.slug ?? current;
      });
    }, tourMs);
    return () => window.clearInterval(id);
  }, [playing, modules]);

  if (!active) return null;

  function choose(next: string) {
    setSlug(next);
    setPlaying(false);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {modules.map((module) => {
          const selected = module.slug === active.slug;
          return (
            <button
              key={module.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => choose(module.slug)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selected
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface text-ink hover:border-accent"
              }`}
            >
              {module.name}
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={playing}
          onClick={() => setPlaying((current) => !current)}
          className="ml-auto text-xs font-medium text-muted"
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        {playing ? <div key={active.slug} className="tour-bar" /> : null}
      </div>
      <div key={active.slug} className="swap mt-8 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p
            className="text-sm tabular-nums text-muted"
            data-edit-path={`modules.${active.slug}.price`}
            data-edit-kind="number"
            data-edit-value={String(active.price)}
          >
            {money(active.price)}
            <span> per rooftop / month</span>
          </p>
          <h3
            className="mt-2 font-serif text-4xl tracking-tight"
            data-edit-path={`modules.${active.slug}.name`}
            data-edit-value={active.name}
          >
            {active.name}
          </h3>
          <p
            className="mt-4 text-lg leading-8"
            data-edit-path={`modules.${active.slug}.definition`}
            data-edit-value={active.definition}
          >
            {active.definition}
          </p>
          <p
            className="mt-3 leading-7 text-muted"
            data-edit-path={`modules.${active.slug}.story`}
            data-edit-value={active.story}
          >
            {active.story}
          </p>
          <ul
            className="mt-6 flex flex-wrap gap-2"
            data-edit-path={`modules.${active.slug}.features`}
            data-edit-kind="lines"
            data-edit-value={active.features.join("\n")}
          >
            {active.features.map((feature) => (
              <li key={feature} className="rounded-full bg-frame px-3 py-1 text-xs text-ink">
                {feature}
              </li>
            ))}
          </ul>
          <Link
            href={`/modules/${active.slug}`}
            className="mt-6 inline-block text-sm font-medium text-accent"
          >
            See {active.name}
          </Link>
        </div>
        <ProductStage slug={active.slug} name={active.name} shots={active.shots} />
      </div>
    </div>
  );
}
