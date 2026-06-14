import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Sparkles, Filter, Salad, ArrowRight } from "lucide-react";
import { listRecipes } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { RecipeCard } from "@/components/recipe-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const recipesQuery = queryOptions({
  queryKey: ["recipes"],
  queryFn: () => listRecipes(),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Collagen Kitchen — Love Coylah" },
      {
        name: "description",
        content:
          "Skin-food recipes to help you age slow and reclaim your glow. Browse, save, plan and shop collagen-supporting meals.",
      },
      { property: "og:title", content: "The Collagen Kitchen — Love Coylah" },
      {
        property: "og:description",
        content: "Skin-food recipes to help you age slow and reclaim your glow.",
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
});

const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snack", "dessert"];

function Cookbook() {
  const { data: recipes } = useSuspenseQuery(recipesQuery);
  const [search, setSearch] = useState("");
  const [meal, setMeal] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");
  const [maxTime, setMaxTime] = useState<number>(0);
  const [boostOnly, setBoostOnly] = useState(false);

  const mealTypes = useMemo(
    () =>
      Array.from(new Set(recipes.map((r) => r.meal_type))).sort(
        (a, b) => (MEAL_ORDER.indexOf(a) + 99) - (MEAL_ORDER.indexOf(b) + 99),
      ),
    [recipes],
  );
  const tags = useMemo(
    () => Array.from(new Set(recipes.flatMap((r) => r.tags))).sort(),
    [recipes],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes
      .filter((r) => {
        if (meal !== "all" && r.meal_type !== meal) return false;
        if (tag !== "all" && !r.tags.includes(tag)) return false;
        if (boostOnly && !r.collagen_boost) return false;
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
  }, [recipes, search, meal, tag, maxTime, boostOnly]);

  // Group filtered recipes by meal type for section headers
  const grouped = useMemo(() => {
    const g: Record<string, typeof filtered> = {};
    for (const r of filtered) (g[r.meal_type] ??= []).push(r);
    return g;
  }, [filtered]);

  return (
    <AppShell>
      {/* Hero */}
      <section className="border-b border-border/50 bg-gradient-to-br from-background via-background to-primary/20">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="font-serif text-[11px] uppercase tracking-[0.28em] text-secondary">
            Beauty starts in the kitchen
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">
            The Collagen Kitchen
          </h1>
          <p className="mt-5 max-w-2xl text-base text-foreground/75 sm:text-lg">
            Skin-food recipes to help you age slow &amp; reclaim your glow — and build
            collagen from the inside out.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Browse, save, plan your week and build a shopping list from simple
            collagen-supporting meals.
          </p>
        </div>
      </section>

      {/* Build Your Own callout */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <Link
          to="/build/glow-bowl"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-secondary/30 bg-gradient-to-r from-primary/30 via-primary/15 to-transparent p-5 transition-colors hover:border-secondary/60"
        >
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-secondary-foreground">
              <Salad className="h-5 w-5" />
            </span>
            <div>
              <p className="font-serif text-lg">Build Your Own Glow Bowl</p>
              <p className="text-sm text-muted-foreground">
                Mix &amp; match a collagen-loaded lunch in six tiny steps.
              </p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-secondary transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Filters */}
      <section className="sticky top-[63px] z-30 mt-6 border-y border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes or ingredients (e.g. eggs, spinach)"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <FilterChip
              label="All meals"
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
            <Button
              variant={boostOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setBoostOnly((v) => !v)}
              className={boostOnly ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : ""}
            >
              <Sparkles className="h-3.5 w-3.5" /> Super Boost
            </Button>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value="all">Any tag</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={maxTime}
              onChange={(e) => setMaxTime(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              <option value={0}>Any time</option>
              <option value={15}>≤ 15 min</option>
              <option value={30}>≤ 30 min</option>
              <option value={45}>≤ 45 min</option>
              <option value={60}>≤ 60 min</option>
            </select>
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Filter className="h-3 w-3" /> {filtered.length} of {recipes.length}
            </span>
          </div>
        </div>
      </section>

      {/* Grid grouped by meal type */}
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
          ? "border-foreground bg-foreground text-background"
          : "border-input bg-background text-foreground/70 hover:bg-accent")
      }
    >
      {label}
    </button>
  );
}
