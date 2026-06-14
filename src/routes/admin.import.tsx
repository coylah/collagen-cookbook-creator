import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { importRecipes } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/import")({
  head: () => ({
    meta: [{ title: "Import recipes — Admin" }],
  }),
  component: AdminImport,
});

function AdminImport() {
  const importFn = useServerFn(importRecipes);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "ok"; count: number } | { kind: "err"; msg: string }
  >({ kind: "idle" });
  const [busy, setBusy] = useState(false);

  async function onImport() {
    setBusy(true);
    setStatus({ kind: "idle" });
    try {
      const parsed = JSON.parse(text);
      const recipes = Array.isArray(parsed) ? parsed : parsed.recipes;
      if (!Array.isArray(recipes)) throw new Error("JSON must be an array of recipes");
      const result = await importFn({ data: { recipes } });
      setStatus({ kind: "ok", count: result.imported });
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-serif text-3xl">Import recipes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Paste a JSON array of recipes (matching the cookbook schema). Existing
          recipes with the same slug will be updated.
        </p>

        <div className="mt-6 rounded-2xl border bg-card p-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='[{ "name": "...", "meal_type": "breakfast", "tags": [...], "servings": 2, ... }]'
            className="h-80 w-full resize-y rounded-lg border bg-background p-3 font-mono text-xs"
          />
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={onImport} disabled={busy || !text.trim()}>
              <Upload className="h-4 w-4" />
              {busy ? "Importing…" : "Import"}
            </Button>
            {status.kind === "ok" && (
              <span className="inline-flex items-center gap-1.5 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" /> Imported {status.count}{" "}
                {status.count === 1 ? "recipe" : "recipes"}
              </span>
            )}
            {status.kind === "err" && (
              <span className="inline-flex items-center gap-1.5 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" /> {status.msg}
              </span>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
