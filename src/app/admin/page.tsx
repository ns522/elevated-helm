import { enterLiveEditor, signIn } from "@/lib/editor/actions";
import { editorEnabled } from "@/lib/editor/session";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const signedIn = await editorEnabled();
  const { error } = await searchParams;

  return (
    <section className="mx-auto max-w-xl px-6 py-20">
      <p className="text-sm font-medium text-accent">Elevated Helm</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight">Edit the live site</h1>
      <p className="mt-4 text-muted">
        Open the public site and click a headline, price, or photo. Saved changes replace the text and screenshots on the pages.
      </p>
      {signedIn ? (
        <form action={enterLiveEditor} className="mt-8">
          <button type="submit" className="rounded-full bg-button px-5 py-3 text-sm font-medium text-button-ink">
            Edit the live site
          </button>
        </form>
      ) : (
        <form action={signIn} className="mt-8 grid max-w-sm gap-3">
          <label className="grid gap-2 text-sm">
            Password
            <input
              name="password"
              type="password"
              required
              className="rounded-xl border border-line bg-surface px-3 py-2.5"
            />
          </label>
          {error ? <p className="text-sm text-accent">That password did not match.</p> : null}
          <button type="submit" className="rounded-full bg-button px-5 py-3 text-sm font-medium text-button-ink">
            Sign in
          </button>
        </form>
      )}
    </section>
  );
}
