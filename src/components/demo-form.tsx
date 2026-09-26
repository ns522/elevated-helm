"use client";

import { buttonClass } from "@/components/chrome";
import { siteName, type Module } from "@/content/site";
import { useState, type FormEvent } from "react";

export function DemoForm({
  modules,
  heading,
  submitLabel,
  email = "hello@elevatedhelm.com",
  osName = "Dealership OS",
  defaultOs = false,
}: {
  modules: readonly Pick<Module, "slug" | "name">[];
  heading: string;
  submitLabel: string;
  email?: string;
  osName?: string;
  defaultOs?: boolean;
}) {
  const [opened, setOpened] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const dealership = String(data.get("dealership") ?? "").trim();
    const from = String(data.get("email") ?? "").trim();
    const interest = data.getAll("interest").map(String);
    const body = [
      `Name: ${name}`,
      `Dealership: ${dealership}`,
      `Email: ${from}`,
      `Interest: ${interest.length ? interest.join(", ") : "Not specified"}`,
    ].join("\n");
    const href = `mailto:${email}?subject=${encodeURIComponent(`${siteName} demo`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
    window.location.href = href;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <h2 className="font-serif text-4xl tracking-tight">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Name
          <input
            name="name"
            required
            autoComplete="name"
            className="rounded-xl border border-line bg-surface px-3 py-2.5 text-base text-ink"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Dealership
          <input
            name="dealership"
            required
            autoComplete="organization"
            className="rounded-xl border border-line bg-surface px-3 py-2.5 text-base text-ink"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-xl border border-line bg-surface px-3 py-2.5 text-base text-ink"
        />
      </label>
      <fieldset>
        <legend className="text-sm">Modules</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {modules.map((module) => (
            <label key={module.slug} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="interest"
                value={module.name}
                className="size-4 accent-[var(--accent)]"
              />
              {module.name}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="interest"
                value={`${osName} (coming soon)`}
              defaultChecked={defaultOs}
              className="size-4 accent-[var(--accent)]"
            />
            {osName} (coming soon)
          </label>
        </div>
      </fieldset>
      <div>
        <button type="submit" className={buttonClass}>
          {submitLabel}
        </button>
        <p className="mt-3 text-sm text-muted">
          This opens an email to {email}.
          {opened ? " If your mail app did not open, use that address directly." : null}
        </p>
      </div>
    </form>
  );
}
