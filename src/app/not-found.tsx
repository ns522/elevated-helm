import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="font-serif text-5xl tracking-tight">That page is not on the helm.</h1>
      <p className="mt-4 text-muted">The modules, pricing, and Dealership OS pages are still here.</p>
      <Link href="/" className="mt-8 inline-block text-sm font-medium text-accent">
        Back to Elevated Helm
      </Link>
    </section>
  );
}
