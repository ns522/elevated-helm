"use server";

const projectKey = "elevated-crm";

export async function submitDemoLead(formData: FormData) {
  const url = process.env.BUILDBOARD_LEADS_URL;
  const secret = process.env.LEAD_INTAKE_SECRET;
  if (!url || !secret) return { error: "Demo requests are not set up yet." };

  const name = String(formData.get("name") ?? "").trim();
  const dealership = String(formData.get("dealership") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const sourceDetail = String(formData.get("sourcePath") ?? "/").trim() || "/";
  const interests = formData.getAll("interest").map(String);
  if (!name || !dealership || !email) return { error: "Name, dealership, and email are required." };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        projectKey,
        company: dealership,
        contactName: name,
        email,
        interests,
        sourceDetail,
      }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      return { error: payload?.error || "Could not send the request." };
    }
    return { ok: true };
  } catch {
    return { error: "Could not reach Buildboard." };
  }
}
