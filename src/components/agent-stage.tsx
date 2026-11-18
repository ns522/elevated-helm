"use client";

import { shotCaption } from "@/lib/shot-captions";
import Image from "next/image";
import { useState } from "react";

type Mode = "case" | "queue" | "team" | "intel" | "shot";

type CaseStep = {
  id: string;
  agent: string;
  role: string;
  action: string;
  title: string;
  summary: string;
  citedRecord: string;
  guardrail: string;
  auditId: string;
};

const CASE_STEPS: readonly CaseStep[] = [
  {
    id: "step-1",
    agent: "Sally",
    role: "Sales",
    action: "quote.propose",
    title: "Quick Quote & rep follow-up",
    summary:
      "Stock U-26018 · Selling price $64,500 (verified above costline). Opens case-1 on approval and schedules a 2-day call follow-up for Morgan Keel.",
    citedRecord: "Lead #L-4410 · Inventory Stock U-26018 · Quote #Q-884",
    guardrail: "Dealer cost hidden from customer output. Sold units and below-costline prices refused.",
    auditId: "aud-101",
  },
  {
    id: "step-2",
    agent: "Sven",
    role: "Service",
    action: "estimate.draft",
    title: "Pre-delivery service estimate",
    summary:
      "Reads linked RO-3001, normalizes pre-delivery inspection and hitch install into itemized labor ($450) and tax ($36) = $486 total.",
    citedRecord: "Repair Order RO-3001 · Estimate #EST-3001 ($486)",
    guardrail: "RO remains unchanged until an authorized manager approves the draft.",
    auditId: "aud-104",
  },
  {
    id: "step-3",
    agent: "Sven",
    role: "Service",
    action: "service_task.create",
    title: "Assigned shop task",
    summary:
      "Routes the approved RO-3001 work plan onto technician Reese Dock's workboard with promised delivery deadline.",
    citedRecord: "Repair Order RO-3001 · Tech Task #T-912 (Reese Dock)",
    guardrail: "Idempotent key prevents duplicate shop tasks if retried.",
    auditId: "aud-107",
  },
  {
    id: "step-4",
    agent: "Karen",
    role: "Communications",
    action: "message.draft",
    title: "Case-grounded customer draft",
    summary:
      "“Hi Riley, your quote on stock U-26018 ($64,500) and $486 delivery prep estimate are ready to review whenever you are.”",
    citedRecord: "Approved Quote #Q-884 ($64,500) · Approved Estimate #EST-3001 ($486)",
    guardrail: "Outbound SMS and email routes stay hard-gated; a person reviews and sends.",
    auditId: "aud-109",
  },
  {
    id: "step-5",
    agent: "Jim",
    role: "General manager",
    action: "exception.propose",
    title: "Cited GM exception task",
    summary:
      "Flags overdue quote follow-up alongside open $486 prep item on RO-3001 so delivery timing does not slip.",
    citedRecord: "RO-3001 · Observed 08:15 MT · Amount $486 · Owner: Morgan Keel",
    guardrail: "Every exception requires a real record ID, timestamp, and accountable owner.",
    auditId: "aud-112",
  },
];

type QueueItem = {
  approvalId: string;
  caseId: string;
  caseLabel: string;
  requester: string;
  agent: string;
  action: string;
  summary: string;
  evidence: string;
};

const INITIAL_QUEUE: readonly QueueItem[] = [
  {
    approvalId: "apr-case-1",
    caseId: "case-1",
    caseLabel: "Unit purchase · Stock U-26018 ($64,500)",
    requester: "Casey Mercer · Jim (GM)",
    agent: "jim",
    action: "exception.propose",
    summary: "Create GM follow-up task on overdue $64,500 quote & $486 delivery prep RO-3001.",
    evidence: "Cited Quote #Q-884 + RO-3001 · Assigned to Morgan Keel",
  },
  {
    approvalId: "apr-case-2",
    caseId: "case-2",
    caseLabel: "Seasonal service on existing owned unit · RO-3009",
    requester: "Taylor Brooks · Sven (Service)",
    agent: "sven",
    action: "estimate.draft",
    summary: "Approve $620 seasonal maintenance & fluid package on customer's current unit.",
    evidence: "Cited RO-3009 · Separate case for same customer (Riley Skiff)",
  },
];

type QueueDecision = {
  approvalId: string;
  caseId: string;
  agent: string;
  action: string;
  decision: "Approved" | "Rejected";
};

export function AgentStage({ shots }: { shots: string[] }) {
  const [mode, setMode] = useState<Mode>("case");
  const [approvedCount, setApprovedCount] = useState(3);
  const [focusedStep, setFocusedStep] = useState(3);
  const [decisions, setDecisions] = useState<QueueDecision[]>([]);
  const [teamActor, setTeamActor] = useState<"morgan" | "reese">("morgan");
  const [edQuestion, setEdQuestion] = useState<"lien" | "waiver">("lien");
  const [shotIndex, setShotIndex] = useState(0);

  const tabs: { id: Mode; label: string }[] = [
    { id: "case", label: "Shared work case" },
    { id: "queue", label: "Owner approval queue" },
    { id: "team", label: "Team My Work" },
    { id: "intel", label: "Ask Ed & Manny" },
    ...(shots.length > 0 ? [{ id: "shot" as const, label: "App screenshot" }] : []),
  ];

  function approveNextStep() {
    const next = Math.min(CASE_STEPS.length, approvedCount + 1);
    setApprovedCount(next);
    setFocusedStep(Math.min(CASE_STEPS.length - 1, next));
  }

  function resetWalkthrough() {
    setApprovedCount(0);
    setFocusedStep(0);
  }

  function decideQueueItem(item: QueueItem, decision: "Approved" | "Rejected") {
    setDecisions((current) => {
      if (current.some((entry) => entry.approvalId === item.approvalId)) return current;
      return [
        {
          approvalId: item.approvalId,
          caseId: item.caseId,
          agent: item.agent,
          action: item.action,
          decision,
        },
        ...current,
      ];
    });
  }

  const pendingStep = CASE_STEPS[approvedCount] ?? null;
  const inspectedStep = CASE_STEPS[focusedStep] ?? CASE_STEPS[0];
  const remainingQueue = INITIAL_QUEUE.filter(
    (item) => !decisions.some((entry) => entry.approvalId === item.approvalId),
  );
  const activeShot = shots[shotIndex] ?? shots[0];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="AI Command Center views">
        {tabs.map((tab) => {
          const selected = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setMode(tab.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selected
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface text-ink hover:border-accent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {mode === "case" ? (
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-[0_24px_60px_-36px_rgba(36,81,245,0.35)]">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                  AI Command Center · Work case case-1
                </p>
                <h3 className="mt-1 font-serif text-3xl tracking-tight">Riley Skiff</h3>
                <p className="mt-1 text-sm text-muted">
                  Stock U-26018 · Selling price $64,500 · Linked Repair Order RO-3001
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-frame px-3 py-1 text-xs font-medium text-ink">
                  {approvedCount} of {CASE_STEPS.length} steps approved
                </span>
                <button
                  type="button"
                  onClick={resetWalkthrough}
                  className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-xs font-medium text-ink transition hover:border-accent"
                >
                  Start from step 1
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-bg px-4 py-3 text-sm">
              <span className="text-xs font-semibold tracking-wide text-accent uppercase">
                Derived next action:{" "}
              </span>
              {pendingStep ? (
                <span>
                  <strong>Pat Owner (Owner / GM)</strong> — Review {pendingStep.agent}&apos;s{" "}
                  {pendingStep.title.toLowerCase()} ({pendingStep.action})
                </span>
              ) : (
                <span>
                  <strong>Morgan Keel (Sales)</strong> — Call Riley Skiff on approved quote #Q-884 &amp;
                  confirm delivery window (Due in shop hours)
                </span>
              )}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
              <ol className="space-y-2.5" aria-label="Shared work case timeline">
                {CASE_STEPS.map((step, index) => {
                  const isApproved = index < approvedCount;
                  const isCurrent = index === approvedCount;
                  const isFocused = index === focusedStep;
                  return (
                    <li key={step.id}>
                      <button
                        type="button"
                        onClick={() => setFocusedStep(index)}
                        className={`flex w-full items-start gap-3.5 rounded-2xl border p-3.5 text-left transition ${
                          isFocused
                            ? "border-accent bg-frame/70"
                            : "border-line bg-bg/60 hover:border-accent"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            isApproved
                              ? "bg-accent text-white"
                              : isCurrent
                                ? "border border-accent bg-surface text-accent"
                                : "bg-surface text-muted"
                          }`}
                        >
                          {isApproved ? "✓" : index + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-medium text-accent">
                              {step.agent} · {step.role}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                                isApproved
                                  ? "bg-surface text-ink"
                                  : isCurrent
                                    ? "bg-accent text-white"
                                    : "bg-surface text-muted"
                              }`}
                            >
                              {isApproved ? "Approved" : isCurrent ? "Awaiting approval" : "Queued"}
                            </span>
                          </span>
                          <span className="mt-1 block text-sm font-semibold text-ink">{step.title}</span>
                          <span className="mt-1 block text-xs leading-5 text-muted">{step.summary}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="flex flex-col justify-between gap-4 rounded-2xl border border-line bg-bg p-5">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                    Step {focusedStep + 1} inspection · {inspectedStep.action}
                  </p>
                  <h4 className="mt-2 font-serif text-2xl tracking-tight">
                    {inspectedStep.agent}: {inspectedStep.title}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-ink">{inspectedStep.summary}</p>
                  <dl className="mt-4 space-y-3 border-t border-line pt-4 text-xs">
                    <div>
                      <dt className="font-semibold text-ink">Cited dealership records</dt>
                      <dd className="mt-0.5 text-muted">{inspectedStep.citedRecord}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-ink">Server-side guardrail</dt>
                      <dd className="mt-0.5 text-muted">{inspectedStep.guardrail}</dd>
                    </div>
                  </dl>
                </div>

                <div className="border-t border-line pt-4">
                  {pendingStep ? (
                    <button
                      type="button"
                      onClick={approveNextStep}
                      className="w-full rounded-full bg-button px-5 py-2.5 text-sm font-medium text-button-ink transition hover:brightness-95"
                    >
                      Approve step {approvedCount + 1}: {pendingStep.agent} ({pendingStep.title})
                    </button>
                  ) : (
                    <p className="rounded-2xl border border-line bg-surface px-4 py-3 text-xs leading-5 text-ink">
                      All 5 decisions are recorded on <strong>case-1</strong>. Outbound message send stays
                      gated until a staff member hits Send.
                    </p>
                  )}

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                      Immutable audit ledger ({approvedCount} approved)
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs text-muted">
                      {CASE_STEPS.slice(0, approvedCount).map((entry) => (
                        <li key={entry.auditId} className="flex items-center justify-between gap-2">
                          <span className="truncate">
                            <strong className="text-ink">{entry.action}</strong> · Pat Owner
                          </span>
                          <span className="shrink-0 font-mono text-[11px]">{entry.auditId}</span>
                        </li>
                      ))}
                      {approvedCount === 0 ? (
                        <li>No approvals recorded yet — click Approve above to step through the case.</li>
                      ) : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {mode === "queue" ? (
          <div className="rounded-3xl border border-line bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                  Two cases, one customer · strict case isolation
                </p>
                <h3 className="mt-1 font-serif text-3xl tracking-tight">Owner approval queue</h3>
                <p className="mt-1 max-w-2xl text-sm text-muted">
                  Riley Skiff has both an active unit purchase (<strong>case-1</strong>) and seasonal
                  service on their current unit (<strong>case-2</strong>). Approving one never mutates the
                  other, and requesters cannot approve their own proposals.
                </p>
              </div>
              {decisions.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setDecisions([])}
                  className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-xs font-medium text-ink transition hover:border-accent"
                >
                  Reset queue
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Pending owner review ({remainingQueue.length})
                </p>
                {remainingQueue.length === 0 ? (
                  <p className="rounded-2xl border border-line bg-bg p-5 text-sm text-muted">
                    Queue clear. Every decision was logged to its own work case — click Reset queue to try
                    another combination.
                  </p>
                ) : (
                  remainingQueue.map((item) => (
                    <div key={item.approvalId} className="rounded-2xl border border-line bg-bg p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold text-accent">
                          Work case {item.caseId} · {item.caseLabel}
                        </span>
                        <span className="font-mono text-muted">{item.action}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-ink">{item.summary}</p>
                      <p className="mt-1 text-xs text-muted">
                        Requested by {item.requester} · {item.evidence}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => decideQueueItem(item, "Approved")}
                          className="rounded-full bg-button px-4 py-1.5 text-xs font-medium text-button-ink"
                        >
                          Approve {item.caseId}
                        </button>
                        <button
                          type="button"
                          onClick={() => decideQueueItem(item, "Rejected")}
                          className="rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-ink hover:border-accent"
                        >
                          Reject (leave record unchanged)
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="rounded-2xl border border-line bg-bg p-5">
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">
                  Decision &amp; separation-of-duties log
                </p>
                <p className="mt-2 text-xs leading-5 text-muted">
                  Only designated owners and department managers can approve. Server rules block{" "}
                  <code className="rounded bg-surface px-1 py-0.5 text-[11px]">requesterId === deciderId</code>.
                </p>
                <ul className="mt-4 divide-y divide-line border-t border-line text-xs">
                  {decisions.length === 0 ? (
                    <li className="py-3 text-muted">
                      Approve case-1 and reject case-2 to see independent case persistence.
                    </li>
                  ) : (
                    decisions.map((entry) => (
                      <li key={entry.approvalId} className="py-3">
                        <span className="font-semibold text-ink">{entry.decision}</span> · {entry.caseId} ·{" "}
                        <span className="text-muted">
                          {entry.agent}.{entry.action} (Actor: Pat Owner)
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {mode === "team" ? (
          <div className="rounded-3xl border border-line bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                  Role-scoped floor view · Need-to-know boundaries
                </p>
                <h3 className="mt-1 font-serif text-3xl tracking-tight">Team My Work</h3>
                <p className="mt-1 text-sm text-muted">
                  Each employee sees only their assigned actions and relevant deal or RO context — never
                  owner approval queues, unpublished drafts, or another employee&apos;s coaching notes.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTeamActor("morgan")}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    teamActor === "morgan"
                      ? "border-accent bg-frame text-ink"
                      : "border-line bg-bg text-muted"
                  }`}
                >
                  Morgan Keel · Sales
                </button>
                <button
                  type="button"
                  onClick={() => setTeamActor("reese")}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    teamActor === "reese"
                      ? "border-accent bg-frame text-ink"
                      : "border-line bg-bg text-muted"
                  }`}
                >
                  Reese Dock · Service Tech
                </button>
              </div>
            </div>

            {teamActor === "morgan" ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <p className="text-xs font-semibold text-accent uppercase">Due today · Case case-1</p>
                  <h4 className="mt-1 text-base font-semibold">Follow up on approved Quick Quote</h4>
                  <p className="mt-2 text-sm text-muted">
                    Call Riley Skiff regarding Stock U-26018 ($64,500 approved quote #Q-884) and confirm
                    trade payoff paperwork.
                  </p>
                </div>
                <div className="rounded-2xl border border-dashed border-line p-4 text-xs leading-6 text-muted">
                  <strong className="block text-sm text-ink">What stays hidden from this view</strong>
                  Dealer costline math behind manager PIN, unapproved Karen message drafts, Jim&apos;s owner
                  exception queue, and coworker coaching scores.
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-bg p-4">
                  <p className="text-xs font-semibold text-accent uppercase">Upcoming · Case case-1</p>
                  <h4 className="mt-1 text-base font-semibold">Complete approved RO-3001 prep plan</h4>
                  <p className="mt-2 text-sm text-muted">
                    Pre-delivery inspection and receiver hitch install ($486 approved estimate #EST-3001).
                    Clock labor and attach walkaround media on Tech Workboard.
                  </p>
                </div>
                <div className="rounded-2xl border border-dashed border-line p-4 text-xs leading-6 text-muted">
                  <strong className="block text-sm text-ink">What stays hidden from this view</strong>
                  Sales deal margin, buyer finance structure, owner approval history, and customer SMS send
                  controls.
                </div>
              </div>
            )}
          </div>
        ) : null}

        {mode === "intel" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-line bg-surface p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                    Ed · Training &amp; SOP Q&amp;A
                  </p>
                  <h3 className="mt-1 font-serif text-2xl tracking-tight">
                    Cited policy or honest abstention
                  </h3>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEdQuestion("lien")}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      edQuestion === "lien"
                        ? "border-accent bg-frame font-medium text-ink"
                        : "border-line bg-bg text-muted"
                    }`}
                  >
                    Covered SOP
                  </button>
                  <button
                    type="button"
                    onClick={() => setEdQuestion("waiver")}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      edQuestion === "waiver"
                        ? "border-accent bg-frame font-medium text-ink"
                        : "border-line bg-bg text-muted"
                    }`}
                  >
                    Missing SOP
                  </button>
                </div>
              </div>

              {edQuestion === "lien" ? (
                <div className="mt-4 rounded-2xl border border-line bg-bg p-4 text-sm">
                  <p className="font-medium text-ink">
                    “How do we verify a trade-in with an active bank payoff?”
                  </p>
                  <p className="mt-2 leading-6 text-muted">
                    Obtain a 10-day written payoff quote directly from the lienholder, attach the payoff PDF
                    to the trade record before F&amp;I Preflight, and collect signed power-of-attorney title
                    authorization at closing.
                  </p>
                  <p className="mt-3 text-xs font-medium text-accent">
                    Cited source: Dealership Trade &amp; Title SOP · Section 3.2 · Version 2.4
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-line bg-bg p-4 text-sm">
                  <p className="font-medium text-ink">
                    “Can we waive seasonal storage late fees after 45 days?”
                  </p>
                  <p className="mt-2 leading-6 text-muted">
                    No approved dealership policy covers late-fee waivers past 30 days. Ed will not guess —
                    please check with the General Manager.
                  </p>
                  <p className="mt-3 text-xs font-medium text-accent">
                    Logged to ed_knowledge_gaps (3 staff asks) so leadership knows which SOP to write next.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-line bg-surface p-6">
              <p className="text-xs font-medium tracking-[0.12em] text-accent uppercase">
                Manny · Deduplicated model intelligence
              </p>
              <h3 className="mt-1 font-serif text-2xl tracking-tight">
                Transparent lead-to-sale math
              </h3>
              <p className="mt-2 text-xs leading-5 text-muted">
                Window: Last 90 days · Repeat inquiries from the same buyer on the same model count once.
              </p>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-bg">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-line text-muted">
                      <th className="px-3 py-2.5 font-medium">Model</th>
                      <th className="px-3 py-2.5 font-medium">Unique leads</th>
                      <th className="px-3 py-2.5 font-medium">Sold</th>
                      <th className="px-3 py-2.5 font-medium">Conv.</th>
                      <th className="px-3 py-2.5 font-medium">Avg lot days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    <tr>
                      <td className="px-3 py-2.5 font-medium text-ink">2500 Crew Cab</td>
                      <td className="px-3 py-2.5 tabular-nums">14 (18 raw)</td>
                      <td className="px-3 py-2.5 tabular-nums">5</td>
                      <td className="px-3 py-2.5 tabular-nums font-medium text-accent">35.7%</td>
                      <td className="px-3 py-2.5 tabular-nums">22d</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2.5 font-medium text-ink">Tandem Utility 24</td>
                      <td className="px-3 py-2.5 tabular-nums">9 (9 raw)</td>
                      <td className="px-3 py-2.5 tabular-nums">1</td>
                      <td className="px-3 py-2.5 tabular-nums">11.1%</td>
                      <td className="px-3 py-2.5 tabular-nums">68d</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted">
                Proposed action: Review 8 unquoted leads on Tandem Utility 24 — Manny never alters unit
                pricing automatically.
              </p>
            </div>
          </div>
        ) : null}

        {mode === "shot" && activeShot ? (
          <div>
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-[#0b141a] shadow-[0_24px_60px_-36px_rgba(36,81,245,0.45)]"
              data-edit-path="agents.shots"
              data-edit-media="true"
            >
              <Image
                key={activeShot}
                src={activeShot}
                alt="DealerAgent AI Command Center owner review and audit trail"
                fill
                sizes="(min-width: 1024px) 960px, 100vw"
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
