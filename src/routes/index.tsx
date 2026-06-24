import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Filter, Salad, BookOpen, Info } from "lucide-react";
import { listRecipes } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { RecipeCard } from "@/components/recipe-card";
import { Input } from "@/components/ui/input";

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
        (a, b) => (MEAL_ORDER.indexOf(a) + 99) - (MEAL_ORDER.indexOf(b) + 99),
      ),
    [recipes],
  );

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes) {
      for (const t of r.tags) {
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
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-serif text-xl">Recipes coming soon</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Hero — dark, confident, editorial */}
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <p className="font-script text-2xl text-secondary mb-1">Love Coylah</p>
          <h1 className="font-serif text-6xl sm:text-7xl font-light leading-[1.0] mb-6">
            The Collagen<br/>Kitchen
          </h1>
          <p className="max-w-xl text-base text-background/70 leading-relaxed mb-8">
            Skin-food recipes to help you age slow &amp; reclaim your glow — built around food that actually does something for your skin.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/build/glow-bowl"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              <Salad className="h-4 w-4" />
              Build a Glow Bowl
            </Link>
            <button
              onClick={() => setShowGuide(v => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-background/20 px-5 py-2.5 text-sm text-background/70 hover:bg-background/10 transition-colors"
            >
              <Info className="h-4 w-4" />
              {showGuide ? "Hide guide" : "How to use this cookbook"}
            </button>
          </div>

          {showGuide && (
            <div className="mt-6 max-w-2xl rounded-2xl border border-background/10 bg-background/5 p-6">
              <p className="font-serif text-lg text-background mb-4">Getting the best from this cookbook</p>
              <ul className="space-y-3 text-sm text-background/70">
                <li className="flex gap-3"><span className="text-secondary mt-0.5">✦</span><span><strong className="text-background">Cookbook</strong> — every recipe is built around food that actively supports your skin. Browse, filter and explore.</span></li>
                <li className="flex gap-3"><span className="text-secondary mt-0.5">✦</span><span><strong className="text-background">Save</strong> — tap the heart on any recipe to save it to your Saved tab.</span></li>
                <li className="flex gap-3"><span className="text-secondary mt-0.5">✦</span><span><strong className="text-background">Planner</strong> — add recipes to plan your week. Your shopping list builds automatically.</span></li>
                <li className="flex gap-3"><span className="text-secondary mt-0.5">✦</span><span><strong className="text-background">Shopping list</strong> — everything from your plan in one clean list, grouped and ready to shop.</span></li>
                <li className="flex gap-3"><span className="text-secondary mt-0.5">✦</span><span><strong className="text-background">Glow Bowl</strong> — build a collagen-supporting lunch from whatever's in your fridge.</span></li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-[63px] z-30 border-b border-border bg-background/98 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search recipes or ingredients…"
                className="pl-9 bg-muted/40 border-border"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Filter:</span>
            <FilterChip label="All" active={meal === "all"} onClick={() => setMeal("all")} />
            {mealTypes.map((m) => (
              <FilterChip key={m} label={m} active={meal === m} onClick={() => setMeal(m)} />
            ))}
            <span className="mx-1 h-4 w-px bg-border" />
            {tags.length > 0 && (
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="h-8 rounded-full border border-border bg-background px-3 text-xs text-foreground"
              >
                <option value="all">Tag: all</option>
                {tags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
            <select
              value={maxTime}
              onChange={(e) => setMaxTime(Number(e.target.value))}
              className="h-8 rounded-full border border-border bg-background px-3 text-xs text-foreground"
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
          <p className="py-16 text-center text-muted-foreground">No recipes match those filters yet.</p>
        ) : (
          <div className="space-y-14">
            {Object.entries(grouped).map(([mealType, items]) => (
              <div key={mealType}>
                <div className="mb-6 flex items-center gap-4">
                  <h2 className="font-serif text-3xl capitalize">{mealType}</h2>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {items.length} {items.length === 1 ? "recipe" : "recipes"}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full border px-3.5 py-1 text-xs capitalize transition-colors font-medium " +
        (active
          ? "border-secondary bg-secondary text-secondary-foreground"
          : "border-border bg-background text-foreground/60 hover:border-secondary/40 hover:text-foreground")
      }
    >
      {label}
    </button>
  );
}
