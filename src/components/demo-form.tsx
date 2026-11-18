"use client";

import { buttonClass } from "@/components/chrome";
import { submitDemoLead } from "@/lib/demo-lead";
import { useActionState } from "react";
import type { Module } from "@/content/site";

export function DemoForm({
  modules,
  heading,
  submitLabel,
  osName = "Dealership OS",
  defaultOs = false,
  agentName = "AI agents",
  defaultAgent = false,
  defaultModule,
  sourcePath,
}: {
  modules: readonly Pick<Module, "slug" | "name">[];
  heading: string;
  submitLabel: string;
  osName?: string;
  defaultOs?: boolean;
  agentName?: string;
  defaultAgent?: boolean;
  defaultModule?: string;
  sourcePath: string;
}) {
  const [state, action, pending] = useActionState(
    async (_previous: { error?: string; ok?: boolean } | null, formData: FormData) => submitDemoLead(formData),
    null,
  );

  return (
    <form action={action} className="grid gap-5">
      <h2 className="font-serif text-4xl tracking-tight">{heading}</h2>
      <input type="hidden" name="sourcePath" value={sourcePath} />
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
                defaultChecked={module.name === defaultModule}
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
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="interest"
              value={`${agentName} add-on`}
              defaultChecked={defaultAgent}
              className="size-4 accent-[var(--accent)]"
            />
            {agentName} add-on
          </label>
        </div>
      </fieldset>
      <div>
        <button type="submit" className={buttonClass} disabled={pending}>
          {pending ? "Sending…" : submitLabel}
        </button>
        {state?.ok ? <p className="mt-3 text-sm text-muted">Thanks. We&apos;ll be in touch.</p> : null}
        {state?.error ? <p className="mt-3 text-sm text-muted">{state.error}</p> : null}
      </div>
    </form>
  );
}
