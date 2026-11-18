"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";
import { getSiteContent, writeSiteContent, type SiteContent } from "@/lib/content/load";
import { EDITOR_COOKIE, adminPassword, editorEnabled, editorToken } from "@/lib/editor/session";

const fieldPattern =
  /^(promise|lede|includedLine|annualNote|contactEmail|pricing\.(userPrice|websitePrice|additionalRooftopPrice|agentPrice)|sharedCore\.\d+\.(title|body)|dealershipOs\.(name|definition|body)|dealershipOs\.pillars\.\d+\.(title|body)|agents\.(name|definition|body|commandCenter|approval|handoff)|agents\.riskTiers\.\d+\.(tier|rule|examples)|agents\.roster\.\d+\.(name|role|summary|limit|triggers)|modules\.[a-z0-9-]+\.(name|navLabel|price|definition|story|features)|modules\.[a-z0-9-]+\.workflows\.\d+\.(title|body)|faqs\.\d+\.(question|answer))$/;

function applyField(content: SiteContent, field: string, raw: string) {
  const value = raw.trim();
  if (field === "promise") content.promise = value;
  else if (field === "lede") content.lede = value;
  else if (field === "includedLine") content.includedLine = value;
  else if (field === "annualNote") content.annualNote = value;
  else if (field === "contactEmail") content.contactEmail = value;
  else if (field.startsWith("pricing.")) {
    const key = field.slice("pricing.".length) as keyof SiteContent["pricing"];
    if (!(key in content.pricing)) return false;
    content.pricing[key] = Number(value);
  } else if (field.startsWith("sharedCore.")) {
    const [, indexText, key] = field.split(".");
    const block = content.sharedCore[Number(indexText)];
    if (!block || (key !== "title" && key !== "body")) return false;
    block[key] = value;
  } else if (field.startsWith("dealershipOs.pillars.")) {
    const [, , indexText, key] = field.split(".");
    const pillar = content.dealershipOs.pillars[Number(indexText)];
    if (!pillar || (key !== "title" && key !== "body")) return false;
    pillar[key] = value;
  } else if (field.startsWith("dealershipOs.")) {
    const key = field.slice("dealershipOs.".length) as "name" | "definition" | "body";
    if (key !== "name" && key !== "definition" && key !== "body") return false;
    content.dealershipOs[key] = value;
  } else if (field.startsWith("agents.riskTiers.")) {
    const [, , indexText, key] = field.split(".");
    const tier = content.agents.riskTiers[Number(indexText)];
    if (!tier || (key !== "tier" && key !== "rule" && key !== "examples")) return false;
    tier[key] = value;
  } else if (field.startsWith("agents.roster.")) {
    const [, , indexText, key] = field.split(".");
    const agent = content.agents.roster[Number(indexText)];
    if (!agent) return false;
    if (key === "triggers") {
      agent.triggers = value.split("\n").map((line) => line.trim()).filter(Boolean);
    } else if (key === "name" || key === "role" || key === "summary" || key === "limit") {
      agent[key] = value;
    } else return false;
  } else if (field.startsWith("agents.")) {
    const key = field.slice("agents.".length) as
      | "name"
      | "definition"
      | "body"
      | "commandCenter"
      | "approval"
      | "handoff";
    if (!(key in content.agents)) return false;
    content.agents[key] = value;
  } else if (field.startsWith("modules.")) {
    const parts = field.split(".");
    const slug = parts[1];
    const mod = content.modules.find((item) => item.slug === slug);
    if (!mod) return false;
    if (parts[2] === "workflows") {
      const workflow = mod.workflows[Number(parts[3])];
      const key = parts[4];
      if (!workflow || (key !== "title" && key !== "body")) return false;
      workflow[key] = value;
    } else {
      const key = parts[2];
      if (!key) return false;
      if (key === "price") mod.price = Number(value);
      else if (key === "features") {
        mod.features = value.split("\n").map((line) => line.trim()).filter(Boolean);
      } else if (key === "name" || key === "navLabel" || key === "definition" || key === "story") {
        mod[key] = value;
      } else return false;
    }
  } else if (field.startsWith("faqs.")) {
    const [, indexText, key] = field.split(".");
    const faq = content.faqs[Number(indexText)];
    if (!faq || (key !== "question" && key !== "answer")) return false;
    faq[key] = value;
  } else return false;
  return true;
}

async function requireEditor() {
  if (await editorEnabled()) return { ok: true as const };
  return { ok: false as const, error: "Sign in on the admin page to edit the site." };
}

export async function signIn(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = adminPassword();
  if (!expected || password !== expected) redirect("/admin?error=1");
  const store = await cookies();
  store.set(EDITOR_COOKIE, editorToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  redirect("/admin");
}

export async function enterLiveEditor() {
  if (!(await editorEnabled())) redirect("/admin");
  redirect("/");
}

export async function exitLiveEditor() {
  const store = await cookies();
  store.set(EDITOR_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  redirect("/admin");
}

export async function saveContentField(field: string, rawValue: string) {
  const session = await requireEditor();
  if (!session.ok) return session;
  if (!fieldPattern.test(field)) return { ok: false as const, error: "That field cannot be edited." };
  if (rawValue.trim().length > 4000) return { ok: false as const, error: "That text is too long." };
  const content = await getSiteContent();
  if (!applyField(content, field, rawValue)) return { ok: false as const, error: "That field cannot be edited." };
  if (field.endsWith(".price") || field.startsWith("pricing.")) {
    const amount = field.startsWith("pricing.")
      ? content.pricing[field.slice("pricing.".length) as keyof SiteContent["pricing"]]
      : content.modules.find((item) => field.includes(item.slug))?.price;
    if (amount === undefined || Number.isNaN(amount) || amount < 0) {
      return { ok: false as const, error: "Enter a price in dollars." };
    }
  }
  await writeSiteContent(content);
  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function saveContentMedia(formData: FormData) {
  const session = await requireEditor();
  if (!session.ok) return session;
  const field = String(formData.get("path") ?? "");
  const moduleMatch = field.match(/^modules\.([a-z0-9-]+)\.shots$/);
  const isAgents = field === "agents.shots";
  const isOs = field === "dealershipOs.shots";
  if (!moduleMatch && !isAgents && !isOs) {
    return { ok: false as const, error: "That image cannot be replaced." };
  }
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false as const, error: "Choose an image." };
  if (file.size > 8 * 1024 * 1024) return { ok: false as const, error: "Images need to be under 8 MB." };
  if (!file.type.startsWith("image/")) return { ok: false as const, error: "Upload an image." };
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const prefix = moduleMatch ? moduleMatch[1] : isAgents ? "agents" : "dealership-os";
  const filename = `${prefix}-${Date.now()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const directory = path.join(process.cwd(), "public", "shots");
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, filename), bytes);
  const content = await getSiteContent();
  const src = `/shots/${filename}`;
  if (moduleMatch) {
    const mod = content.modules.find((item) => item.slug === moduleMatch[1]);
    if (!mod) return { ok: false as const, error: "That module was not found." };
    mod.shots = [src, ...mod.shots.filter((shot) => shot !== src)];
  } else if (isAgents) {
    content.agents.shots = [src, ...content.agents.shots.filter((shot) => shot !== src)];
  } else {
    content.dealershipOs.shots = [src, ...content.dealershipOs.shots.filter((shot) => shot !== src)];
  }
  await writeSiteContent(content);
  revalidatePath("/", "layout");
  return { ok: true as const };
}
