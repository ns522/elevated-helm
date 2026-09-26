"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const salesRows = [
  { name: "New lead", detail: "Center console", hot: true },
  { name: "Quote sent", detail: "Pontoon", hot: false },
  { name: "Appraisal", detail: "Trade-in", hot: false },
  { name: "Event guest", detail: "Open house", hot: false },
];

export function ProductStage({
  slug,
  name,
  shots,
}: {
  slug: string;
  name: string;
  shots: string[];
}) {
  const [index, setIndex] = useState(0);
  const shot = shots[index] ?? shots[0];

  useEffect(() => {
    setIndex(0);
  }, [slug]);

  useEffect(() => {
    if (shots.length < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % shots.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [shots]);

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_24px_60px_-36px_rgba(36,81,245,0.45)]"
      data-edit-path={`modules.${slug}.shots`}
      data-edit-media="true"
    >
      {shot ? (
        <Image
          key={shot}
          src={shot}
          alt={`${name} in Elevated Helm`}
          fill
          sizes="(min-width: 1024px) 720px, 100vw"
          className="swap object-cover object-top"
        />
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="size-2 rounded-full bg-line" />
            <span className="size-2 rounded-full bg-line" />
            <span className="size-2 rounded-full bg-line" />
            <span className="ml-2 text-xs text-muted">{name}</span>
            <span className="ml-auto text-[10px] font-medium tracking-[0.14em] text-accent uppercase">
              Preview
            </span>
          </div>
          <div key={slug} className="swap min-h-0 flex-1 p-4">
            <StageBody slug={slug} />
          </div>
        </div>
      )}
    </div>
  );
}

function StageBody({ slug }: { slug: string }) {
  if (slug === "service-crm") return <ServiceBoard />;
  if (slug === "marketing") return <MarketingBoard />;
  if (slug === "website") return <WebsiteBoard />;
  return <SalesBoard />;
}

function SalesBoard() {
  return (
    <div className="grid h-full grid-cols-[1.15fr_0.85fr] gap-3">
      <ul className="space-y-2">
        {salesRows.map((row) => (
          <li
            key={row.name}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs ${
              row.hot ? "bg-frame text-ink" : "bg-bg text-muted"
            }`}
          >
            <span className={row.hot ? "font-medium" : undefined}>{row.name}</span>
            <span>{row.detail}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col justify-between rounded-2xl bg-ink p-4 text-white">
        <p className="text-[10px] tracking-[0.14em] text-white/60 uppercase">Quote</p>
        <div>
          <p className="text-sm">24 ft center console</p>
          <p className="mt-2 font-serif text-3xl tracking-tight">On the desk</p>
        </div>
      </div>
    </div>
  );
}

function ServiceBoard() {
  const columns = [
    { title: "Request", cards: ["Spring service", "Detail"] },
    { title: "Estimate", cards: ["Gelcoat"] },
    { title: "Board", cards: ["Oil service", "Impeller"] },
  ];

  return (
    <div className="grid h-full grid-cols-3 gap-2">
      {columns.map((column) => (
        <div key={column.title} className="rounded-2xl bg-bg p-2">
          <p className="px-1 text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
            {column.title}
          </p>
          <ul className="mt-2 space-y-2">
            {column.cards.map((card, index) => (
              <li
                key={card}
                className={`rounded-xl px-2 py-3 text-xs ${
                  column.title === "Estimate" && index === 0
                    ? "bg-accent text-white"
                    : "bg-surface text-ink"
                }`}
              >
                {card}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MarketingBoard() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div key={day} className="text-center">
            <p className="text-[10px] text-muted">{day}</p>
            <div
              className={`mt-2 h-16 rounded-xl ${
                index === 2 || index === 5 ? "bg-accent" : index === 4 ? "bg-frame" : "bg-bg"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-bg px-4 py-3 text-xs">
        <span>Open house campaign</span>
        <span className="font-medium text-accent">Scheduled</span>
      </div>
    </div>
  );
}

function WebsiteBoard() {
  return (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-2">
      <div className="col-span-2 row-span-2 flex flex-col justify-end rounded-2xl bg-frame p-4">
        <p className="text-[10px] tracking-[0.14em] text-accent uppercase">Find my boat</p>
        <p className="mt-1 font-serif text-2xl tracking-tight">Inventory</p>
      </div>
      <div className="rounded-2xl bg-bg p-3 text-xs">
        <p className="text-muted">Event</p>
        <p className="mt-1 font-medium">Dock party</p>
      </div>
      <div className="rounded-2xl bg-ink p-3 text-xs text-white">
        <p className="text-white/60">Pro shop</p>
        <p className="mt-1">Live</p>
      </div>
    </div>
  );
}
