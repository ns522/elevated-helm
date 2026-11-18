"use client";

import Image from "next/image";
import { useState } from "react";

type MobileScene = {
  id: string;
  label: string;
  device: "phone" | "tablet" | "checklist";
  deviceBadge: string;
  title: string;
  body: string;
  highlights: readonly string[];
  shot?: string;
  secondaryShot?: string;
};

const SCENES: readonly MobileScene[] = [
  {
    id: "floor-phone",
    label: "Phone layout & alerts",
    device: "phone",
    deviceBadge: "Dedicated Phone layout · Sales, Service & Managers",
    title: "Separate Phone dashboard layout, timeclock & SMS",
    body: "Every login saves a dedicated Phone dashboard layout independent of its desktop monitor — putting your Timeclock punch card, personal To-Do list, overdue follow-ups, recent SMS & call summaries, and campaign approvals one thumb-tap away.",
    highlights: [
      "Saved Phone layout separate from your desktop widget grid",
      "Clock in, manage to-dos & answer customer texts from the lot",
      "Approve multi-channel marketing campaigns on the go",
    ],
    shot: "/shots/sales-mobile.png",
    secondaryShot: "/shots/marketing-mobile.png",
  },
  {
    id: "ipad-fi",
    label: "iPad 4-Square & F&I",
    device: "tablet",
    deviceBadge: "Synced showroom iPad · Sales desk",
    title: "Hand an iPad across the desk for F&I & e-signing",
    body: "Present cash vs. finance options, down-payment sliders, and a guided Protection & Accessories menu formatted for tablets — showing exact amortized monthly payment impact while keeping dealer cost locked behind a manager PIN, right through touch e-signature.",
    highlights: [
      "Live tokenized tablet view synced to the desk manager",
      "True amortized monthly payment math — zero exposed costlines",
      "Touch signature pad for Buyer's Orders, storage & consignments",
    ],
    shot: "/shots/sales-fi-menu.png",
  },
  {
    id: "checkin",
    label: "Service ramp & RO mobile",
    device: "checklist",
    deviceBadge: "Phone & tablet camera · Service lane",
    title: "Guided boat check-in, mobile ROs & customer approvals",
    body: "Advisors walk every arriving boat or unit with a phone or tablet: capture 5 canonical walkaround slots, read HIN/VIN and serials over the camera, check multi-point condition cards (Good / Needs Attention / Critical) with required defect photos, match live OEM bulletins, and text owners a one-tap mobile estimate approval link.",
    highlights: [
      "5 canonical walkaround slots saved permanently to the Unit File",
      "Mandatory reason notes + defect photos on flagged items",
      "Zero-login owner link to Approve, Decline, or Defer each job",
    ],
  },
  {
    id: "website-mobile",
    label: "Mobile storefront",
    device: "phone",
    deviceBadge: "Shopper phone · Public Website",
    title: "Fast mobile inventory search, compare & AI chat",
    body: "Most buyers browse your inventory from a phone first. Shoppers filter live Sales Module stock, compare units, view monthly payment examples, upload service photos on the 5-step booking form, or chat with your AI shopper assistant.",
    highlights: [
      "Instant mobile filters, payment examples & unit compare",
      "5-step mobile service booking with camera photo upload",
      "On-site AI shopper chat with 1-tap live staff takeover",
    ],
    shot: "/shots/website-mobile.png",
  },
];

export function MobileShowcase({ initialScene = "floor-phone" }: { initialScene?: string }) {
  const [sceneId, setSceneId] = useState(
    SCENES.some((scene) => scene.id === initialScene) ? initialScene : "floor-phone",
  );
  const scene = SCENES.find((item) => item.id === sceneId) ?? SCENES[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Phone and tablet workflows">
        {SCENES.map((item) => {
          const selected = item.id === scene.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setSceneId(item.id)}
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

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-accent uppercase">
            {scene.deviceBadge}
          </p>
          <h3 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">{scene.title}</h3>
          <p className="mt-4 leading-7 text-muted">{scene.body}</p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {scene.highlights.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-frame text-xs font-semibold text-accent">
                  ✓
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-line bg-[radial-gradient(circle_at_50%_15%,#1e3a8a_0%,#0b1120_75%)] p-6 shadow-[0_24px_60px_-36px_rgba(36,81,245,0.45)] sm:p-8">
          {scene.device === "tablet" && scene.shot ? (
            <div className="mx-auto max-w-xl">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border-[6px] border-[#263248] bg-[#0e1116] shadow-2xl">
                <Image
                  key={scene.shot}
                  src={scene.shot}
                  alt={scene.title}
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="swap object-contain"
                />
              </div>
            </div>
          ) : scene.device === "phone" && scene.shot ? (
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="relative w-[220px] shrink-0 sm:w-[240px] aspect-[1170/2159] overflow-hidden rounded-[2rem] border-[5px] border-[#2d3b55] bg-[#0b1320] shadow-2xl">
                <Image
                  key={scene.shot}
                  src={scene.shot}
                  alt={scene.title}
                  fill
                  sizes="260px"
                  className="swap object-cover object-top"
                />
              </div>
              {scene.secondaryShot ? (
                <div className="relative hidden w-[195px] shrink-0 aspect-[1170/2159] overflow-hidden rounded-[1.85rem] border-[5px] border-[#243047] bg-[#0b1320] opacity-95 shadow-xl sm:block">
                  <Image
                    key={scene.secondaryShot}
                    src={scene.secondaryShot}
                    alt={`${scene.title} companion screen`}
                    fill
                    sizes="220px"
                    className="swap object-cover object-top"
                  />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="grid gap-3 text-white">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs font-semibold tracking-wide text-sky-300 uppercase">
                  Stage 1 · Primary walkaround slots
                </p>
                <p className="mt-1 text-sm text-white/90">
                  Port, Starboard, Bow, Stern &amp; Interior photos + HIN, Trailer VIN, Engine &amp; Key
                  Code camera capture (1-tap reuse on return visits).
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs font-semibold tracking-wide text-amber-300 uppercase">
                  Stage 2 · Multi-point condition matrix
                </p>
                <p className="mt-1 text-sm text-white/90">
                  Touch cards for Good, Needs Attention, Critical &amp; Not Equipped — automatically
                  requiring a reason note and defect photo when an issue is flagged.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs font-semibold tracking-wide text-emerald-300 uppercase">
                  Stage 3 · Live bulletins &amp; mobile owner approval
                </p>
                <p className="mt-1 text-sm text-white/90">
                  Matches OEM service bulletins automatically, promotes the RO to Checked In, and texts the
                  owner a mobile link to Approve, Decline, or Defer each job.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
