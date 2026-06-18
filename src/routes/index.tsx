import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Sparkles, Filter, Salad, BookOpen, Info } from "lucide-react";
import { listRecipes } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { RecipeCard } from "@/components/recipe-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const recipesQuery = queryOptions({
  queryKey: ["recipes"],
  queryFn: () => listRecipes(),
});

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "The Collagen Kitchen — Love Coylah" },
      {
        name: "description",
        content:
          "Skin-food recipes to help you age slow and reclaim your glow.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(recipesQuery),
  component: Cookbook,
  errorComponent: ({ error }) => (
    <AppShell>
      <p className="mx-auto max-w-6xl p-8 text-destructive">{error.message}</p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <p className="mx-auto max-w-6xl p-8">No recipes yet.</p>
    </AppShell>
  ),
}));

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack", "smoothie", "dessert"];
const MAX_TAGS = 20;

function Cookbook() {
  const { data: recipes } = useSuspenseQuery(recipesQuery);
  const [search, setSearch] = useState("");
  const [meal, setMeal] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");
  const [maxTime, setMaxTime] = useState<number>(0);
  const [showGuide, setShowGuide] = useState(false);

  const mealTypes = useMemo(
    () =>
      Array.from(new Set(recipes.map((r) => r.meal_type))).sort(
        (a, b) =>
          (MEAL_ORDER.indexOf(a) + 99) - (MEAL_ORDER.indexOf(b) + 99),
      ),
    [recipes],
  );

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes) {
      for (const t of r.tags) {
        // Skip generic collagen tags — every recipe is collagen-supporting
        if (["collagen-rich", "collagen-supporting", "collagen"].includes(t.toLowerCase()))
          continue;
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TAGS)
      .map(([t]) => t)
      .sort();
  }, [recipes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes
      .filter((r) => {
        if (meal !== "all" && r.meal_type !== meal) return false;
        if (tag !== "all" && !r.tags.includes(tag)) return false;
        if (maxTime > 0 && r.prep_min + r.cook_min > maxTime) return false;
        if (q) {
          const hay =
            r.name.toLowerCase() +
            " " +
            r.tags.join(" ").toLowerCase() +
            " " +
            r.ingredients.map((i) => i.item).join(" ").toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const ma = MEAL_ORDER.indexOf(a.meal_type);
        const mb = MEAL_ORDER.indexOf(b.meal_type);
        const oa = ma === -1 ? 99 : ma;
        const ob = mb === -1 ? 99 : mb;
        if (oa !== ob) return oa - ob;
        return a.name.localeCompare(b.name);
      });
  }, [recipes, search, meal, tag, maxTime]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof filtered> = {};
    for (const r of filtered) (g[r.meal_type] ??= []).push(r);
    return g;
  }, [filtered]);

  if (recipes.length === 0) {
    return (
      <AppShell>
        <section className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
            <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl">
              The Collagen Kitchen
            </h1>
          </div>
        </section>
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-serif text-xl">Recipes coming soon</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The cookbook is being filled with skin-food recipes. Check back soon.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Hero */}
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h1 className="font-serif text-5xl leading-[1.05] sm:text-6xl">
            The Collagen Kitchen
          </h1>
          <p className="mt-4 max-w-2xl text-base text-foreground/70 sm:text-lg">
            Skin-food recipes to help you age slow &amp; reclaim your glow.
          </p>
          <button
            onClick={() => setShowGuide((v) => !v)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-secondary underline underline-offset-2 hover:opacity-80"
          >
            <Info className="h-3.5 w-3.5" />
            {showGuide ? "Hide guide" : "How to use this cookbook"}
          </button>

          {showGuide && (
            <div className="mt-5 max-w-2xl rounded-2xl border border-border bg-card p-6">
              <p className="font-serif text-lg">Getting the best from this cookbook</p>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-0.5 text-secondary">✦</span>
                  <span>
                    <strong className="text-foreground">Cookbook</strong> — browse
                    all recipes by meal type, tag or cooking time. Every recipe is
                    built around ingredients that support collagen and skin health.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-secondary">✦</span>
                  <span>
                    <strong className="text-foreground">Build a Glow Bowl</strong> — 
                    mix and match a collagen-supporting lunch from whatever you have
                    in the fridge. Pick a base, protein, colour, fat, crunch and dressing.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-secondary">✦</span>
                  <span>
                    <strong className="text-foreground">Saved</strong> — tap the
                    heart on any recipe to save it. Find your saved recipes here
                    any time.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-secondary">✦</span>
                  <span>
                    <strong className="text-foreground">Planner</strong> — add
                    recipes to build your week. Set how many you're cooking for
                    and the shopping list updates automatically.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 text-secondary">✦</span>
                  <span>
                    <strong className="text-foreground">Shopping list</strong> — 
                    your ingredients pulled together from your plan, grouped by
                    category and ready to shop. Tick things off as you go.
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[63px] z-30 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes or ingredients…"
                className="pl-9"
              />
            </div>
            <Link
              to="/build/glow-bowl"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-secondary/50 bg-secondary/10 px-3.5 py-2 text-xs font-medium text-secondary transition-colors hover:bg-secondary/20"
            >
              <Salad className="h-3.5 w-3.5" />
              Build a Glow Bowl
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-xs text-muted-foreground">Filter by:</span>
            <FilterChip
              label="All"
              active={meal === "all"}
              onClick={() => setMeal("all")}
            />
            {mealTypes.map((m) => (
              <FilterChip
                key={m}
                label={m}
                active={meal === m}
                onClick={() => setMeal(m)}
              />
            ))}
            <span className="mx-1 h-5 w-px bg-border" />
            {tags.length > 0 && (
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="all">Tag: all</option>
                {tags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}
            <select
              value={maxTime}
              onChange={(e) => setMaxTime(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value={0}>Time: any</option>
              <option value={15}>Under 15 min</option>
              <option value={30}>Under 30 min</option>
              <option value={45}>Under 45 min</option>
              <option value={60}>Under 60 min</option>
            </select>
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3 w-3" /> {filtered.length} of {recipes.length}
            </span>
          </div>
        </div>
      </section>

      {/* Recipe grid */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No recipes match those filters yet.
          </p>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([mealType, items]) => (
              <div key={mealType}>
                <div className="mb-5 flex items-baseline gap-3">
                  <h2 className="font-serif text-2xl capitalize">{mealType}</h2>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {items.length} {items.length === 1 ? "recipe" : "recipes"}
                  </span>
                  <span className="ml-2 h-px flex-1 bg-border/60" />
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((r) => (
                    <RecipeCard key={r.id} recipe={r} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1 text-xs capitalize transition-colors " +
        (active
          ? "border-secondary bg-secondary text-secondary-foreground"
          : "border-border bg-background text-foreground/70 hover:border-secondary/50 hover:bg-accent")
      }
    >
      {label}
    </button>
  );
}
