"use client";

import { quoteMonthly, type Pricing } from "@/content/site";
import { money } from "@/lib/money";
import { type Dispatch, type SetStateAction, useState } from "react";

export function PricingCalculator({ pricing }: { pricing: Pricing }) {
  const [users, setUsers] = useState(1);
  const [rooftops, setRooftops] = useState(1);
  const [website, setWebsite] = useState(true);
  const quote = quoteMonthly(pricing, { users, rooftops, website });

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="grid gap-3">
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
          <span className="tabular-nums text-price">{money(pricing.websitePrice)}</span>
        </label>
      </div>
      <div aria-live="polite" className="rounded-3xl border border-line bg-surface p-6 lg:sticky lg:top-6">
        <p className="text-sm text-muted">Monthly total</p>
        <p key={quote.total} className="swap mt-2 font-serif text-5xl tracking-tight text-price">
          {money(quote.total)}
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-6">
          <li>
            {quote.users} {quote.users === 1 ? "user" : "users"} × {money(pricing.userPrice)} sales and service
          </li>
          <li>{website ? `Website ${money(pricing.websitePrice)}` : "Website not included"}</li>
          <li>
            {quote.additionalRooftops === 0
              ? "First rooftop included"
              : `${quote.additionalRooftops} additional ${quote.additionalRooftops === 1 ? "rooftop" : "rooftops"} × ${money(pricing.additionalRooftopPrice)}`}
          </li>
        </ul>
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
