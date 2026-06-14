import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Printer, ShoppingBasket } from "lucide-react";
import { listRecipes } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useMealPlan } from "@/lib/user-state";
import { buildShoppingList } from "@/lib/recipe-math";

const recipesQuery = queryOptions({
  queryKey: ["recipes"],
  queryFn: () => listRecipes(),
});

export const Route = createFileRoute("/shopping")({
  head: () => ({
    meta: [
      { title: "Shopping list — The Collagen Kitchen" },
      {
        name: "description",
        content: "An auto-generated shopping list from your weekly meal plan.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(recipesQuery),
  component: ShoppingPage,
  errorComponent: ({ error }) => (
    <AppShell>
      <p className="mx-auto max-w-6xl p-8 text-destructive">{error.message}</p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <p className="mx-auto max-w-6xl p-8">Nothing here yet.</p>
    </AppShell>
  ),
});

const CATEGORY_LABEL: Record<string, string> = {
  produce: "Fruit & veg",
  protein: "Protein",
  dairy: "Dairy",
  grains: "Grains",
  pantry: "Pantry",
  spices: "Spices",
  nuts_seeds: "Nuts & seeds",
  other: "Other",
};

function ShoppingPage() {
  const { data: recipes } = useSuspenseQuery(recipesQuery);
  const bySlug = new Map(recipes.map((r) => [r.slug, r]));
  const { plan } = useMealPlan();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const entries = useMemo(() => {
    return Object.values(plan)
      .filter((e): e is { slug: string; servings: number } => !!e)
      .map((e) => {
        const r = bySlug.get(e.slug);
        return r ? { recipe: r, servings: e.servings } : null;
      })
      .filter((x): x is { recipe: (typeof recipes)[number]; servings: number } => !!x);
  }, [plan, bySlug, recipes]);

  const list = useMemo(() => buildShoppingList(entries), [entries]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof list> = {};
    for (const item of list) {
      const c = item.category || "other";
      (g[c] ??= []).push(item);
    }
    return g;
  }, [list]);

  return (
    <AppShell>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">Shopping list</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              From {entries.length} meal{entries.length === 1 ? "" : "s"} on your plan.
            </p>
          </div>
          {entries.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print
            </Button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="mt-12 rounded-2xl border bg-card p-12 text-center">
            <ShoppingBasket className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Your meal plan is empty.
            </p>
            <Link
              to="/planner"
              className="mt-4 inline-block text-sm font-medium text-primary underline"
            >
              Plan your week
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="rounded-2xl border bg-card p-5">
                <h2 className="font-serif text-lg">
                  {CATEGORY_LABEL[cat] ?? cat}
                </h2>
                <ul className="mt-3 divide-y">
                  {items.map((item, i) => {
                    const key = `${cat}-${i}`;
                    return (
                      <li key={key}>
                        <label className="flex cursor-pointer items-start gap-3 py-2">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 accent-primary"
                            checked={!!checked[key]}
                            onChange={() =>
                              setChecked((c) => ({ ...c, [key]: !c[key] }))
                            }
                          />
                          <div className="flex-1">
                            <p
                              className={
                                "text-sm " +
                                (checked[key]
                                  ? "text-muted-foreground line-through"
                                  : "")
                              }
                            >
                              <strong>{item.qtyText}</strong>{" "}
                              {item.unit && <span>{item.unit} </span>}
                              {item.item}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              for: {item.fromRecipes.join(", ")}
                            </p>
                          </div>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
