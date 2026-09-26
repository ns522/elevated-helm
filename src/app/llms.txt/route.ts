import { llmsText, getSiteContent } from "@/lib/content/load";

export async function GET() {
  const content = await getSiteContent();
  return new Response(llmsText(content), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
