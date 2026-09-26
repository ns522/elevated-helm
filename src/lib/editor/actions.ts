"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";
import { getSiteContent, writeSiteContent, type SiteContent } from "@/lib/content/load";
import { EDITOR_COOKIE, adminPassword, editorEnabled, editorToken } from "@/lib/editor/session";

const fieldPattern =
  /^(promise|lede|includedLine|annualNote|contactEmail|bundlePrice|dealershipOs\.(name|definition|body)|modules\.[a-z0-9-]+\.(name|navLabel|price|definition|story|features)|faqs\.\d+\.(question|answer))$/;

function applyField(content: SiteContent, field: string, raw: string) {
  const value = raw.trim();
  if (field === "promise") content.promise = value;
  else if (field === "lede") content.lede = value;
  else if (field === "includedLine") content.includedLine = value;
  else if (field === "annualNote") content.annualNote = value;
  else if (field === "contactEmail") content.contactEmail = value;
  else if (field === "bundlePrice") content.bundlePrice = Number(value);
  else if (field.startsWith("dealershipOs.")) {
    const key = field.slice("dealershipOs.".length) as "name" | "definition" | "body";
    content.dealershipOs[key] = value;
  } else if (field.startsWith("modules.")) {
    const [, slug, key] = field.split(".");
    const module = content.modules.find((item) => item.slug === slug);
    if (!module || !key) return false;
    if (key === "price") module.price = Number(value);
    else if (key === "features") module.features = value.split("\n").map((line) => line.trim()).filter(Boolean);
    else if (key === "name" || key === "navLabel" || key === "definition" || key === "story") module[key] = value;
    else return false;
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
  if (field.endsWith(".price") || field === "bundlePrice") {
    const amount = field === "bundlePrice" ? content.bundlePrice : content.modules.find((item) => field.includes(item.slug))?.price;
    if (!amount || Number.isNaN(amount) || amount < 0) return { ok: false as const, error: "Enter a price in dollars." };
  }
  await writeSiteContent(content);
  revalidatePath("/", "layout");
  return { ok: true as const };
}

export async function saveContentMedia(formData: FormData) {
  const session = await requireEditor();
  if (!session.ok) return session;
  const field = String(formData.get("path") ?? "");
  const match = field.match(/^modules\.([a-z0-9-]+)\.shots$/);
  if (!match) return { ok: false as const, error: "That image cannot be replaced." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false as const, error: "Choose an image." };
  if (file.size > 8 * 1024 * 1024) return { ok: false as const, error: "Images need to be under 8 MB." };
  if (!file.type.startsWith("image/")) return { ok: false as const, error: "Upload an image." };
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${match[1]}-${Date.now()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const directory = path.join(process.cwd(), "public", "shots");
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, filename), bytes);
  const content = await getSiteContent();
  const module = content.modules.find((item) => item.slug === match[1]);
  if (!module) return { ok: false as const, error: "That module was not found." };
  const src = `/shots/${filename}`;
  module.shots = [src, ...module.shots.filter((shot) => shot !== src)];
  await writeSiteContent(content);
  revalidatePath("/", "layout");
  return { ok: true as const };
}
