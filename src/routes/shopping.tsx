import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Printer, ShoppingBasket, RotateCcw, Check, X, Trash2 } from "lucide-react";
import { listRecipes } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useMealPlan, useHaveList, useShoppingExtras, type ExtraItem } from "@/lib/user-state";
import { buildShoppingList, shoppingItemKey, type ShoppingItem } from "@/lib/recipe-math";
import { cn } from "@/lib/utils";

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
  cupboard: "Cupboard staples",
  pantry: "Cupboard staples",
  spices: "Cupboard staples",
  herbs: "Herbs & seasoning",
  fats: "Cupboard staples",
  nuts_seeds: "Nuts & seeds",
  other: "Other",
};
const CATEGORY_ORDER = [
  "produce",
  "protein",
  "dairy",
  "grains",
  "herbs",
  "cupboard",
  "fats",
  "spices",
  "pantry",
  "nuts_seeds",
  "other",
];

function ShoppingPage() {
  const { data: recipes } = useSuspenseQuery(recipesQuery);
  const bySlug = new Map(recipes.map((r) => [r.slug, r]));
  const { plan } = useMealPlan();
  const { isHad, toggle: toggleHave, reset } = useHaveList();
  const { extras, remove: removeExtra, clear: clearExtras } = useShoppingExtras();
  const [bought, setBought] = useState<Record<string, boolean>>({});

  const entries = useMemo(() => {
    return Object.values(plan)
      .filter((e): e is { slug: string; servings: number } => !!e)
      .map((e) => {
        const r = bySlug.get(e.slug);
        return r ? { recipe: r, servings: e.servings } : null;
      })
      .filter((x): x is { recipe: (typeof recipes)[number]; servings: number } => !!x);
  }, [plan, bySlug, recipes]);

  const fullList = useMemo(() => buildShoppingList(entries), [entries]);

  const active = fullList.filter((i) => !isHad(i.key));
  const had = fullList.filter((i) => isHad(i.key));

  const grouped = useMemo(() => {
    const g: Record<string, ShoppingItem[]> = {};
    for (const item of active) {
      const c = item.category || "other";
      (g[c] ??= []).push(item);
    }
    return CATEGORY_ORDER.filter((c) => g[c]).map((c) => [c, g[c]] as const);
  }, [active]);

  const extrasByCategory = useMemo(() => {
    const g: Record<string, ExtraItem[]> = {};
    for (const e of extras) (g[e.category] ??= []).push(e);
    return g;
  }, [extras]);

  const hasContent = entries.length > 0 || extras.length > 0;

  function clearAll() {
    clearExtras();
    reset();
    setBought({});
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">Shopping list</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              From {entries.length} meal{entries.length === 1 ? "" : "s"} on your plan
              {extras.length > 0 ? ` + ${extras.length} extras` : ""}.
            </p>
          </div>
          {hasContent && (
            <div className="flex items-center gap-2">
              {had.length > 0 && (
                <Button variant="ghost" size="sm" onClick={reset}>
                  <RotateCcw className="h-4 w-4" /> Reset "I have"
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Clear list
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4" /> Print
              </Button>
            </div>
          )}
        </div>

        {!hasContent ? (
          <div className="mt-12 rounded-2xl border bg-card p-12 text-center">
            <ShoppingBasket className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              Your meal plan is empty.
            </p>
            <Link
              to="/planner"
              className="mt-4 inline-block text-sm font-medium text-secondary underline"
            >
              Plan your week
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {grouped.map(([cat, items]) => (
              <div key={cat} className="rounded-2xl border bg-card p-5">
                <h2 className="font-serif text-lg">
                  {CATEGORY_LABEL[cat] ?? cat}
                </h2>
                <ul className="mt-3 divide-y divide-border/60">
                  {items.map((item) => (
                    <ShoppingRow
                      key={item.key}
                      item={item}
                      checked={!!bought[item.key]}
                      onCheck={() =>
                        setBought((b) => ({ ...b, [item.key]: !b[item.key] }))
                      }
                      onHave={() => toggleHave(item.key)}
                    />
                  ))}
                </ul>
              </div>
            ))}

            {extras.length > 0 && (
              <div className="rounded-2xl border border-secondary/30 bg-card p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg">From your Glow Bowls</h2>
                  <button
                    onClick={clearExtras}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </button>
                </div>
                {Object.entries(extrasByCategory).map(([cat, items]) => (
                  <div key={cat} className="mt-3">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {CATEGORY_LABEL[cat] ?? cat}
                    </p>
                    <ul className="mt-1 divide-y divide-border/60">
                      {items.map((e) => (
                        <li key={e.item} className="flex items-center justify-between py-2 text-sm">
                          <span>{e.item}</span>
                          <button
                            onClick={() => removeExtra(e.item)}
                            className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Remove"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {had.length > 0 && (
              <details className="rounded-2xl border bg-muted/30 p-5">
                <summary className="cursor-pointer font-serif text-base">
                  Already in my cupboard ({had.length})
                </summary>
                <ul className="mt-3 divide-y divide-border/40">
                  {had.map((item) => (
                    <li key={item.key} className="flex items-center justify-between py-2 text-sm text-muted-foreground">
                      <span>
                        {item.qtyText && <strong className="text-foreground/70">{item.qtyText} </strong>}
                        {item.unit && !item.staple && <span>{item.unit} </span>}
                        {item.item}
                      </span>
                      <button
                        onClick={() => toggleHave(item.key)}
                        className="text-xs text-secondary hover:underline"
                      >
                        Bring back
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function ShoppingRow({
  item,
  checked,
  onCheck,
  onHave,
}: {
  item: ShoppingItem;
  checked: boolean;
  onCheck: () => void;
  onHave: () => void;
}) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-secondary"
        checked={checked}
        onChange={onCheck}
      />
      <div className="flex-1">
        <p className={cn("text-sm", checked && "text-muted-foreground line-through")}>
          {item.qtyText && <strong>{item.qtyText} </strong>}
          {item.unit && !item.staple && <span>{item.unit} </span>}
          {item.item}
        </p>
        <p className="text-[11px] text-muted-foreground">
          for: {item.fromRecipes.join(", ")}
        </p>
      </div>
      <button
        onClick={onHave}
        className="no-print inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
        title="I already have this"
      >
        <Check className="h-3 w-3" /> I have
      </button>
    </li>
  );
}
