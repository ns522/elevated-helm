"use client";

import { exitLiveEditor, saveContentField, saveContentMedia } from "@/lib/editor/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Target = {
  path: string;
  kind: "text" | "lines" | "number" | "media";
  value: string;
};

export function LiveEditor() {
  const router = useRouter();
  const [target, setTarget] = useState<Target | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    document.body.dataset.editing = "true";
    return () => {
      delete document.body.dataset.editing;
    };
  }, []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const origin = event.target as HTMLElement | null;
      if (!origin || origin.closest("[data-editor-chrome]")) return;
      const node = origin.closest<HTMLElement>("[data-edit-path]");
      if (!node) return;
      event.preventDefault();
      event.stopPropagation();
      const path = node.dataset.editPath ?? "";
      const kind = (node.dataset.editMedia === "true" ? "media" : node.dataset.editKind) || "text";
      setError("");
      setText(node.dataset.editValue ?? "");
      setTarget({ path, kind: kind as Target["kind"], value: node.dataset.editValue ?? "" });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  function refresh() {
    setTarget(null);
    router.refresh();
  }

  return (
    <div data-editor-chrome>
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-full border border-line bg-ink px-4 py-3 text-sm text-white">
        <p>Click a headline, price, or photo.</p>
        <form action={exitLiveEditor}>
          <button type="submit" className="text-xs font-medium text-white/70">
            Done
          </button>
        </form>
      </div>
      {target ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center">
          <form
            className="w-full max-w-lg rounded-3xl border border-line bg-surface p-5"
            action={
              target.kind === "media"
                ? async (formData) => {
                    const result = await saveContentMedia(formData);
                    if (!result.ok) {
                      setError(result.error);
                      return;
                    }
                    refresh();
                  }
                : undefined
            }
            onSubmit={
              target.kind === "media"
                ? undefined
                : (event) => {
                    event.preventDefault();
                    startTransition(async () => {
                      const result = await saveContentField(target.path, text);
                      if (!result.ok) {
                        setError(result.error);
                        return;
                      }
                      refresh();
                    });
                  }
            }
          >
            <p className="text-xs font-medium tracking-[0.14em] text-accent uppercase">
              {target.kind === "media" ? "Replace image" : "Edit text"}
            </p>
            {target.kind === "media" ? (
              <div className="mt-4">
                <input type="hidden" name="path" value={target.path} />
                <label className="block text-sm">
                  Upload a screenshot
                  <input name="file" type="file" accept="image/*" required className="mt-2 block w-full text-sm" />
                </label>
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={target.kind === "lines" ? 8 : 4}
                className="mt-4 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm"
              />
            )}
            {target.kind === "lines" ? (
              <p className="mt-2 text-xs text-muted">One feature per line.</p>
            ) : null}
            {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
            <div className="mt-4 flex gap-2">
              <button type="submit" disabled={pending} className="rounded-full bg-button px-4 py-2 text-sm font-medium text-button-ink">
                {pending ? "Saving" : "Save"}
              </button>
              <button type="button" onClick={() => setTarget(null)} className="px-4 py-2 text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
