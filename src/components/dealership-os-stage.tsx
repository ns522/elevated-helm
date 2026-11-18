"use client";

import { shotCaption } from "@/lib/shot-captions";
import Image from "next/image";
import { useState } from "react";

type DmsTab = "accounting" | "parts" | "invoicing" | "payroll" | "shot";
type BooksMode = "native" | "quickbooks" | "sage50" | "xero";

const BOOKS_MODES: Record<
  BooksMode,
  {
    name: string;
    badge: string;
    summary: string;
    postingRule: string;
  }
> = {
  native: {
    name: "Built-in General Ledger",
    badge: "Official books of record",
    summary:
      "Every funded deal recap, closed repair order, counter ticket, vendor bill, and Stripe settlement posts directly to departmental GL accounts with Plaid/CSV bank reconciliation and period close.",
    postingRule: "Real-time double-entry journals · Chase / Plaid bank feed matching without duplicate entries",
  },
  quickbooks: {
    name: "QuickBooks Online / Desktop",
    badge: "Connected accounting sync",
    summary:
      "Keep your CPA in QuickBooks while running daily sales, service, parts, invoicing, and payroll prep inside DealerAgent. Mapped revenue, COGS, tax, and AR/AP journals sync cleanly by department.",
    postingRule: "Mapped chart-of-accounts bridge + live departmental Profit Plan inside DealerAgent",
  },
  sage50: {
    name: "Sage 50",
    badge: "Journal & period bridge",
    summary:
      "Maintain departmental dealership subledgers inside DealerAgent and export balanced, account-mapped journals to Sage 50 on your daily or month-end close schedule.",
    postingRule: "Balanced departmental journal batches (-10 New, -20 Used, -30 Service, -40 Parts, -50 F&I)",
  },
  xero: {
    name: "Xero",
    badge: "Cloud ledger connector",
    summary:
      "Push finalized invoices, vendor bills, tax liabilities, and Stripe payouts to Xero with clean contact, tracking-category, and inventory valuation mapping.",
    postingRule: "Department tracking categories + automated payment & bank clearing reconciliation",
  },
};

export function DealershipOsStage({ shots }: { shots: string[] }) {
  const [tab, setTab] = useState<DmsTab>("accounting");
  const [booksMode, setBooksMode] = useState<BooksMode>("native");
  const [payrollView, setPayrollView] = useState<"timeclock" | "payroll">("timeclock");
  const [shotIndex, setShotIndex] = useState(0);

  const tabs: { id: DmsTab; label: string }[] = [
    { id: "accounting", label: "Accounting & software links" },
    { id: "parts", label: "Parts ordering & receiving" },
    { id: "invoicing", label: "Invoicing & payables" },
    { id: "payroll", label: "Timeclock & payroll" },
    ...(shots.length > 0 ? [{ id: "shot" as const, label: "DMS preview" }] : []),
  ];

  const activeBooks = BOOKS_MODES[booksMode];
  const activeShot = shots[shotIndex] ?? shots[0];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Dealership OS DMS modules">
        {tabs.map((item) => {
          const selected = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(item.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selected
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface text-ink hover:border-accent"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {tab === "accounting" ? (
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_60px_-36px_rgba(36,81,245,0.35)]">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                  Dealership OS · Financials, P&amp;L &amp; external ledger sync
                </p>
                <h3 className="mt-1 font-serif text-3xl tracking-tight">
                  Run built-in books or link your accounting suite
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Accounting ledger mode">
                {(
                  [
                    ["native", "Built-in GL"],
                    ["quickbooks", "QuickBooks"],
                    ["sage50", "Sage 50"],
                    ["xero", "Xero"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBooksMode(key)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                      booksMode === key
                        ? "border-accent bg-frame text-ink"
                        : "border-line bg-bg text-muted hover:border-accent"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_1.15fr]">
              <div className="flex flex-col justify-between rounded-2xl border border-line bg-bg p-5">
                <div>
                  <span className="inline-flex rounded-full bg-surface px-3 py-1 text-xs font-medium text-accent">
                    {activeBooks.badge}
                  </span>
                  <h4 className="mt-3 font-serif text-2xl tracking-tight">{activeBooks.name}</h4>
                  <p className="mt-3 text-sm leading-6 text-muted">{activeBooks.summary}</p>
                </div>
                <div className="mt-5 border-t border-line pt-4 text-xs text-muted">
                  <strong className="block text-ink">Ledger rule</strong>
                  <span className="mt-1 block">{activeBooks.postingRule}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Departmental P&amp;L &amp; automatic operational journals
                </p>
                <div className="overflow-x-auto rounded-2xl border border-line bg-bg">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line text-muted">
                        <th className="px-3.5 py-2.5 font-medium">Dept</th>
                        <th className="px-3.5 py-2.5 font-medium">Source event</th>
                        <th className="px-3.5 py-2.5 font-medium">Debit / Credit</th>
                        <th className="px-3.5 py-2.5 font-medium">Profit plan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      <tr>
                        <td className="px-3.5 py-2.5 font-medium text-ink">-10 New Units</td>
                        <td className="px-3.5 py-2.5 text-muted">Funded deal recap #1042</td>
                        <td className="px-3.5 py-2.5 tabular-nums"> Floorplan payoff + Front gross</td>
                        <td className="px-3.5 py-2.5 font-medium text-accent">On plan</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-2.5 font-medium text-ink">-30 Service</td>
                        <td className="px-3.5 py-2.5 text-muted">Closed RO-3001 invoice</td>
                        <td className="px-3.5 py-2.5 tabular-nums">Splits Customer AR / Warranty / Internal</td>
                        <td className="px-3.5 py-2.5 font-medium text-accent">+8.4%</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-2.5 font-medium text-ink">-40 Parts</td>
                        <td className="px-3.5 py-2.5 text-muted">PO-819 received + Counter #412</td>
                        <td className="px-3.5 py-2.5 tabular-nums">Inventory asset ↔ AP accrual &amp; COGS</td>
                        <td className="px-3.5 py-2.5 font-medium text-accent">On plan</td>
                      </tr>
                      <tr>
                        <td className="px-3.5 py-2.5 font-medium text-ink">Bank feed</td>
                        <td className="px-3.5 py-2.5 text-muted">Plaid / CSV deposit match</td>
                        <td className="px-3.5 py-2.5 tabular-nums">Reconciles Stripe batch to GL line</td>
                        <td className="px-3.5 py-2.5 text-muted">Matched</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "parts" ? (
          <div className="rounded-3xl border border-line bg-surface p-6">
            <div className="border-b border-line pb-5">
              <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                Parts counter · Purchasing · Barcode receiving
              </p>
              <h3 className="mt-1 font-serif text-3xl tracking-tight">
                From RO special order to shelf bin and vendor bill
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                Track bins, kits, supersessions, core returns, and min/max levels. Special orders stay linked
                to the technician&apos;s repair order so jobs never stall silently waiting on a box.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="text-xs font-semibold text-accent uppercase">1 · Reorder &amp; RO special orders</p>
                <h4 className="mt-1 text-base font-semibold">PO-819 · OEM Parts Dist.</h4>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Auto-builds from seasonal min/max rules plus 3 reserved special-order lines tied to RO-3001
                  and RO-3008. Blocks RO close until parts are issued or on PO.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="text-xs font-semibold text-accent uppercase">2 · Barcode receiving &amp; labels</p>
                <h4 className="mt-1 text-base font-semibold">Partial &amp; damaged check-in</h4>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Scan incoming cartons, print 2×1 or 3×2 Code-128 bin labels, flag backordered or damaged
                  quantities cleanly, and alert the assigned service advisor immediately.
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-bg p-4">
                <p className="text-xs font-semibold text-accent uppercase">3 · Cores, RMAs &amp; cycle counts</p>
                <h4 className="mt-1 text-base font-semibold">Dirty-core &amp; variance tracking</h4>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Track customer core charges through vendor RMA credit, log lost walk-in counter sales to
                  guide stocking, and walk bins with mobile cycle-count worksheets.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "invoicing" ? (
          <div className="rounded-3xl border border-line bg-surface p-6">
            <div className="border-b border-line pb-5">
              <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                Invoicing · Receivables · Accounts payable
              </p>
              <h3 className="mt-1 font-serif text-3xl tracking-tight">
                Every customer invoice and vendor bill in one ledger
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-muted">
                Collect deposits, counter sales, service invoices, and recurring storage via Stripe links, QR
                codes, card, or ACH while tracking vendor bills from receiving to payment.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-bg p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-accent uppercase">Service &amp; counter invoicing</span>
                  <span className="text-muted">Auto-split billing</span>
                </div>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                  <li>
                    <strong className="text-ink">RO-3001 Invoice ($1,420):</strong> Automatically separates
                    Customer Pay ($980), OEM Warranty Receivable ($320), and Internal Recon ($120).
                  </li>
                  <li>
                    <strong className="text-ink">Parts Counter Ticket #412:</strong> Retail, wholesale, and
                    internal shop price matrices with instant Stripe QR checkout.
                  </li>
                  <li>
                    <strong className="text-ink">Storage &amp; Dock/Lot Contracts:</strong> Monthly autopay or
                    seasonal batch invoicing with digital contract e-sign.
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-line bg-bg p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-accent uppercase">Payables &amp; unit floorplan</span>
                  <span className="text-muted">AP &amp; curtailment</span>
                </div>
                <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                  <li>
                    <strong className="text-ink">Three-way PO match:</strong> Reconciles received parts and
                    factory units against vendor bills, clearing received-not-billed accruals cleanly.
                  </li>
                  <li>
                    <strong className="text-ink">Floorplan &amp; title desk:</strong> Tracks unit curtailment
                    dates, MSO/title checklists, trade lien payoffs, and immediate payoff tasks on delivery.
                  </li>
                  <li>
                    <strong className="text-ink">AR / AP aging:</strong> Live 30 / 60 / 90-day receivables and
                    upcoming vendor due dates in one screen.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {tab === "payroll" ? (
          <div className="rounded-3xl border border-line bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                  Workforce operations · Geofenced attendance &amp; pay runs
                </p>
                <h3 className="mt-1 font-serif text-3xl tracking-tight">
                  Timeclock, tech efficiency &amp; commissions
                </h3>
              </div>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setPayrollView("timeclock")}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    payrollView === "timeclock"
                      ? "border-accent bg-frame text-ink"
                      : "border-line bg-bg text-muted"
                  }`}
                >
                  Geofenced timeclock
                </button>
                <button
                  type="button"
                  onClick={() => setPayrollView("payroll")}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    payrollView === "payroll"
                      ? "border-accent bg-frame text-ink"
                      : "border-line bg-bg text-muted"
                  }`}
                >
                  Payroll &amp; commissions
                </button>
              </div>
            </div>

            {payrollView === "timeclock" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <p className="text-xs font-semibold text-accent uppercase">Server GPS geofence</p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    Staff punch in from phone or workstation inside each rooftop&apos;s street-address
                    radius. Off-site punches allow written overrides that wait in an Admin approval queue.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <p className="text-xs font-semibold text-accent uppercase">Overtime &amp; meal rules</p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    Calculates daily (&gt;12h) and weekly (&gt;40h) 1.5× overtime without double-counting,
                    flags missed clock-outs or unpaid lunch breaks, and separates attendance from RO labor
                    billing clocks.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <p className="text-xs font-semibold text-accent uppercase">PTO &amp; sick leave</p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    Tenure-based vacation tiers and accrued sick balances with employee time-off requests,
                    manager approvals, and automatic sync onto the Dealership Calendar.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <p className="text-xs font-semibold text-accent uppercase">Hourly &amp; salary sheets</p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    Weekly, biweekly, or semi-monthly pay periods with live period estimators, admin punch
                    audit trails, and one-click payroll CSV export.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <p className="text-xs font-semibold text-accent uppercase">Tech flag &amp; billed hours</p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    Compare clocked attendance hours against billed RO flat-rate hours per technician for
                    efficiency tracking, spiffs, and month-end variable pay.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <p className="text-xs font-semibold text-accent uppercase">Sales draws &amp; commissions</p>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    Configurable front-end/F&amp;I gross commission plans and draws synced directly to funded
                    deal recaps with manager sign-off before payout.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {tab === "shot" && activeShot ? (
          <div>
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-[#0e1116] shadow-[0_24px_60px_-36px_rgba(36,81,245,0.45)]"
              data-edit-path="dealershipOs.shots"
              data-edit-media="true"
            >
              <Image
                key={activeShot}
                src={activeShot}
                alt={`Dealership OS — ${shotCaption(activeShot, shotIndex)}`}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="swap object-contain"
              />
            </div>
            {shots.length > 1 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {shots.map((src, idx) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setShotIndex(idx)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      idx === shotIndex
                        ? "border-accent bg-frame font-medium text-ink"
                        : "border-line bg-surface text-muted hover:border-accent"
                    }`}
                  >
                    {shotCaption(src, idx)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
