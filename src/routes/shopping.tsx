import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState, useRef } from "react";
import { Printer, ShoppingBasket, RotateCcw, Check, X, Trash2, Plus } from "lucide-react";
import { listRecipes } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useMealPlan, useHaveList, useShoppingExtras, useManualItems, type ExtraItem } from "@/lib/user-state";
import { buildShoppingList, type ShoppingItem } from "@/lib/recipe-math";
import { cn } from "@/lib/utils";

const recipesQuery = queryOptions({
  queryKey: ["recipes"],
  queryFn: () => listRecipes(),
});

export const Route = createFileRoute("/shopping")({
  head: () => ({
    meta: [
      { title: "Shopping list — The Collagen Kitchen" },
      { name: "description", content: "Your ingredients, grouped and ready to shop." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(recipesQuery),
  component: ShoppingPage,
  errorComponent: ({ error }) => (
    <AppShell>
      <p className="mx-auto max-w-6xl p-8 text-destructive">{error.message}</p>
    </AppShell>
  ),
});

const CATEGORY_LABEL: Record<string, string> = {
  produce: "Fruit & veg",
  protein: "Protein",
  dairy: "Dairy & chilled",
  grains: "Grains",
  cupboard: "Cupboard staples",
  pantry: "Cupboard staples",
  spices: "Cupboard staples",
  herbs: "Cupboard staples",
  fats: "Cupboard staples",
  nuts_seeds: "Cupboard staples",
  other: "Other",
};

const CATEGORY_ORDER = [
  "produce", "protein", "dairy", "grains",
  "cupboard", "pantry", "fats", "spices", "herbs", "nuts_seeds", "other",
];

function ShoppingPage() {
  const { data: recipes } = useSuspenseQuery(recipesQuery);
  const bySlug = new Map(recipes.map((r) => [r.slug, r]));
  const { plan } = useMealPlan();
  const { isHad, toggle: toggleHave, reset } = useHaveList();
  const { extras, remove: removeExtra, clear: clearExtras } = useShoppingExtras();
  const { items: manualItems, addItem, toggleItem, removeItem, clearAll: clearManual } = useManualItems();
  const [bought, setBought] = useState<Record<string, boolean>>({});
  const [manualInput, setManualInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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
      const rawCat = item.category || "other";
      const mergedCat = ["pantry", "spices", "herbs", "fats", "nuts_seeds"].includes(rawCat)
        ? "cupboard" : rawCat;
      (g[mergedCat] ??= []).push(item);
    }
    const seen = new Set<string>();
    return CATEGORY_ORDER.filter((c) => {
      const mc = ["pantry", "spices", "herbs", "fats", "nuts_seeds"].includes(c) ? "cupboard" : c;
      if (seen.has(mc)) return false;
      seen.add(mc);
      return !!g[mc];
    }).map((c) => {
      const mc = ["pantry", "spices", "herbs", "fats", "nuts_seeds"].includes(c) ? "cupboard" : c;
      return [mc, g[mc]] as const;
    });
  }, [active]);

  const extrasByCategory = useMemo(() => {
    const g: Record<string, ExtraItem[]> = {};
    for (const e of extras) (g[e.category] ??= []).push(e);
    return g;
  }, [extras]);

  const hasContent = entries.length > 0 || extras.length > 0 || manualItems.length > 0;

  function clearAll() {
    clearExtras();
    reset();
    clearManual();
    setBought({});
  }

  function handleAddManual(e: React.FormEvent) {
    e.preventDefault();
    if (!manualInput.trim()) return;
    addItem(manualInput);
    setManualInput("");
    inputRef.current?.focus();
  }

  const subtitle = hasContent
    ? entries.length > 0 && extras.length > 0
      ? "Your shopping list from your meal plan and Glow Bowl extras."
      : entries.length > 0
      ? "Your ingredients, grouped and ready to shop."
      : "Your Glow Bowl extras, ready to shop."
    : "";

  return (
    <AppShell>
      <section className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">Shopping list</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
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
            <p className="mt-3 font-serif text-lg">Your list is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add recipes to your planner or build a Glow Bowl to get started.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link to="/planner" className="text-sm text-secondary underline underline-offset-2">
                Plan your week
              </Link>
              <span className="text-muted-foreground">·</span>
              <Link to="/build/glow-bowl" className="text-sm text-secondary underline underline-offset-2">
                Build a Glow Bowl
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">

            {/* Recipe items grouped by category */}
            {grouped.map(([cat, items]) => (
              <div key={cat} className="rounded-2xl border bg-card p-5">
                <h2 className="font-serif text-lg">{CATEGORY_LABEL[cat] ?? cat}</h2>
                <ul className="mt-3 divide-y divide-border/60">
                  {items.map((item) => (
                    <ShoppingRow
                      key={item.key}
                      item={item}
                      checked={!!bought[item.key]}
                      onCheck={() => setBought((b) => ({ ...b, [item.key]: !b[item.key] }))}
                      onHave={() => toggleHave(item.key)}
                    />
                  ))}
                </ul>
              </div>
            ))}

            {/* Glow Bowl extras */}
            {extras.length > 0 && (
              <div className="rounded-2xl border border-secondary/30 bg-card p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg">Glow Bowl extras</h2>
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
                            className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-muted"
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

            {/* Already in cupboard */}
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
                      <button onClick={() => toggleHave(item.key)} className="text-xs text-secondary hover:underline">
                        Bring back
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {/* Manual items */}
            <div className="rounded-2xl border bg-card p-5">
              <h2 className="font-serif text-lg mb-4">Add anything else</h2>
              <form onSubmit={handleAddManual} className="flex gap-2 mb-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="e.g. coffee, washing up liquid, milk…"
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-secondary"
                />
                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground disabled:opacity-40 hover:bg-secondary/90"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </form>
              {manualItems.length > 0 && (
                <ul className="divide-y divide-border/60">
                  {manualItems.map((item) => (
                    <li key={item.addedAt} className="flex items-center gap-3 py-2.5">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-secondary"
                        checked={item.checked}
                        onChange={() => toggleItem(item.addedAt)}
                      />
                      <span className={cn(
                        "flex-1 text-sm",
                        item.checked && "text-muted-foreground line-through"
                      )}>
                        {item.text}
                      </span>
                      <button
                        onClick={() => removeItem(item.addedAt)}
                        className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-muted"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {manualItems.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Add coffee, toiletries, school snacks — anything else you need this week.
                </p>
              )}
            </div>

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
          {item.unit && !item.staple && <span className="text-muted-foreground">{item.unit} </span>}
          {item.item}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {item.fromRecipes.join(", ")}
        </p>
      </div>
      <button
        onClick={onHave}
        className="no-print inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-secondary hover:text-secondary"
      >
        <Check className="h-3 w-3" /> I have
      </button>
    </li>
  );
}
