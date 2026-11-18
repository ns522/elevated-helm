import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { LiveEditor } from "@/components/editor/live-editor";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteName } from "@/content/site";
import { getSiteContent } from "@/lib/content/load";
import { editorEnabled } from "@/lib/editor/session";
import { money } from "@/lib/money";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: {
      default: siteName,
      template: `%s · ${siteName}`,
    },
    description: `${siteName} is software and human-approved AI management for dealerships. Sales CRM, Service CRM, and Marketing share one ${money(content.pricing.userPrice)}/month user seat, Website is ${money(content.pricing.websitePrice)}/month, and the ${content.agents.name} add-on is ${money(content.pricing.agentPrice)}/month flat for the account.`,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const editing = await editorEnabled();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {editing ? <LiveEditor /> : null}
      </body>
    </html>
  );
}
