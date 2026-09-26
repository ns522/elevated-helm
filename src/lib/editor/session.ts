import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const EDITOR_COOKIE = "helm_editor";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === "production" ? "" : "elevated-helm");
}

function token() {
  return createHmac("sha256", adminPassword() || "helm").update("helm-editor").digest("hex");
}

export async function editorEnabled() {
  const password = adminPassword();
  if (!password) return false;
  const store = await cookies();
  const value = store.get(EDITOR_COOKIE)?.value ?? "";
  const expected = token();
  if (value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export function editorToken() {
  return token();
}
