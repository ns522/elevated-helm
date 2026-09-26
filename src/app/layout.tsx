import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { LiveEditor } from "@/components/editor/live-editor";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteName } from "@/content/site";
import { editorEnabled } from "@/lib/editor/session";
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

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description:
    "Elevated Helm is software for marine dealerships. Buy Sales CRM, Service CRM, Marketing, and Website. The full dealership operating system is coming soon.",
};

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
