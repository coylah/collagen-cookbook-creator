import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { importRecipes } from "@/lib/recipes.functions";

export const Route = createFileRoute("/admin/import")({
  component: ImportPage,
});

function ImportPage() {
  const [json, setJson] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    setStatus(null);
    try {
      const data = JSON.parse(json);
      const result = await importRecipes({ data: { recipes: data } });
      setStatus(`Done — ${result.imported} recipe${result.imported === 1 ? "" : "s"} imported.`);
      setJson("");
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-serif text-3xl mb-2">Import recipes</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Paste a JSON array of recipes matching the cookbook schema. Existing recipes with the same slug will be updated.
        </p>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          className="w-full h-64 rounded-xl border border-border bg-muted/30 p-4 font-mono text-xs outline-none focus:border-secondary"
          placeholder='[{ "name": "...", "meal_type": "...", ... }]'
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !json.trim()}
          className="mt-4 w-full rounded-xl bg-secondary py-3 text-sm font-medium text-secondary-foreground disabled:opacity-40 hover:bg-secondary/90"
        >
          {loading ? "Importing…" : "Import recipes"}
        </button>
        {status && (
          <p className={`mt-4 text-sm ${status.startsWith("Error") ? "text-destructive" : "text-secondary"}`}>
            {status}
          </p>
        )}
      </div>
    </AppShell>
  );
}
