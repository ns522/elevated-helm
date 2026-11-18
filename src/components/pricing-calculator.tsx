"use client";

import { buttonClass } from "@/components/chrome";
import { quoteMonthly, type Pricing } from "@/content/site";
import { money } from "@/lib/money";
import { type Dispatch, type SetStateAction, useState } from "react";

export function PricingCalculator({ pricing }: { pricing: Pricing }) {
  const [cadence, setCadence] = useState<"monthly" | "annual">("monthly");
  const [users, setUsers] = useState(1);
  const [rooftops, setRooftops] = useState(1);
  const [website, setWebsite] = useState(true);
  const [agents, setAgents] = useState(false);
  const quote = quoteMonthly(pricing, { users, rooftops, website, agents });
  const effectiveMonthly = Math.round(quote.annualTotal / 12);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="grid gap-3">
        <div
          role="group"
          aria-label="Billing cadence"
          className="mb-1 inline-flex w-fit flex-wrap rounded-full border border-line bg-surface p-1"
        >
          <button
            type="button"
            aria-pressed={cadence === "monthly"}
            onClick={() => setCadence("monthly")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              cadence === "monthly" ? "bg-accent text-white" : "text-muted hover:text-ink"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={cadence === "annual"}
            onClick={() => setCadence("annual")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              cadence === "annual" ? "bg-accent text-white" : "text-muted hover:text-ink"
            }`}
          >
            Annual (2 months included)
          </button>
        </div>

        <Stepper label="Users" value={users} min={1} onChange={setUsers} />
        <Stepper label="Rooftops" value={rooftops} min={1} onChange={setRooftops} />
        <p className="-mt-1 text-sm text-muted">The first rooftop is included.</p>
        <label
          className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-4 transition ${
            website ? "border-accent bg-frame" : "border-line bg-surface hover:border-accent"
          }`}
        >
          <span className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={website}
              onChange={() => setWebsite((current) => !current)}
              className="size-4 accent-[var(--accent)]"
            />
            <span>Website</span>
          </span>
          <span className="shrink-0 tabular-nums text-price">{money(pricing.websitePrice)}</span>
        </label>
        <label
          className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-4 transition ${
            agents ? "border-accent bg-frame" : "border-line bg-surface hover:border-accent"
          }`}
        >
          <span className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={agents}
              onChange={() => setAgents((current) => !current)}
              className="size-4 accent-[var(--accent)]"
            />
            <span>
              AI agents
              <span className="mt-1 block text-sm text-muted">
                One flat price for the whole account — all users and rooftops.
              </span>
            </span>
          </span>
          <span className="shrink-0 tabular-nums text-price">{money(pricing.agentPrice)}</span>
        </label>
      </div>

      <div aria-live="polite" className="rounded-3xl border border-line bg-surface p-6 lg:sticky lg:top-6">
        <p className="text-sm text-muted">
          {cadence === "monthly" ? "Monthly total" : "Effective monthly (billed annually)"}
        </p>
        <p key={`${cadence}-${quote.total}`} className="swap mt-2 flex items-baseline gap-1.5">
          <span className="font-serif text-5xl tracking-tight tabular-nums text-price">
            {cadence === "monthly" ? money(quote.total) : money(effectiveMonthly)}
          </span>
          <span className="text-sm text-muted">/ month</span>
        </p>
        {cadence === "annual" ? (
          <p className="mt-2 text-sm leading-6 text-accent">
            {money(quote.annualTotal)} billed annually — you save {money(quote.annualSavings)} (2 months included)
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-muted">
            Save {money(quote.annualSavings)}/year with annual billing
          </p>
        )}

        <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm leading-6">
          <li>
            {quote.users} {quote.users === 1 ? "user" : "users"} × {money(pricing.userPrice)} sales, service &amp; marketing
          </li>
          <li>{website ? `Website ${money(pricing.websitePrice)}` : "Website not included"}</li>
          <li>
            {quote.additionalRooftops === 0
              ? "First rooftop included"
              : `${quote.additionalRooftops} additional ${quote.additionalRooftops === 1 ? "rooftop" : "rooftops"} × ${money(pricing.additionalRooftopPrice)}`}
          </li>
          <li>{agents ? `AI agents ${money(pricing.agentPrice)}` : "AI agents not included"}</li>
        </ul>

        <a href="#demo" className={`${buttonClass} mt-6 w-full`}>
          Request a demo
        </a>
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: Dispatch<SetStateAction<number>>;
}) {
  function set(next: number) {
    if (!Number.isFinite(next)) return;
    onChange(Math.min(999, Math.max(min, Math.floor(next))));
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange((current) => Math.max(min, current - 1))}
          className="flex size-9 items-center justify-center rounded-full border border-line text-lg disabled:opacity-40"
        >
          −
        </button>
        <input
          aria-label={label}
          type="number"
          min={min}
          max={999}
          inputMode="numeric"
          value={value}
          onChange={(event) => set(Number(event.target.value))}
          className="w-14 bg-transparent text-center text-lg tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label={`More ${label.toLowerCase()}`}
          onClick={() => onChange((current) => Math.min(999, current + 1))}
          className="flex size-9 items-center justify-center rounded-full border border-line text-lg"
        >
          +
        </button>
      </div>
    </div>
  );
}
