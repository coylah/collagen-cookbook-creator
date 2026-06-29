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

const ALLOWED_TAGS = new Set([
  "quick",
  "high-protein",
  "meal-prep",
  "one-pan",
  "no-cook",
  "omega-3",
  "vitamin-c",
  "antioxidants",
  "dairy-free",
  "gluten-free",
  "healthy-fats",
]);

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
        const lower = t.toLowerCase();
        if (!ALLOWED_TAGS.has(lower)) continue;
        counts.set(lower, (counts.get(lower) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .filter(([, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .map(([t]) => t);
  }, [recipes]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes
      .filter((r) => {
        if (meal !== "all" && r.meal_type !== meal) return false;
        if (tag !== "all" && !r.tags.map(t => t.toLowerCase()).includes(tag)) return false;
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
      {/* Hero — pure white */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-secondary" />
            <p className="text-[9px] uppercase tracking-[0.32em] text-secondary">Your skin-food cookbook</p>
            <div className="h-px w-6 bg-secondary" />
          </div>
          <p className="font-script text-2xl text-secondary -mb-1">Love Coylah</p>
          <h1 className="font-serif text-4xl sm:text-6xl font-light leading-[1.0] text-foreground mb-4">
            The Collagen<br/>Kitchen
          </h1>
          <div className="w-8 h-px bg-secondary mb-4" />
          <p className="max-w-lg text-sm text-muted-foreground leading-relaxed mb-6 font-light">
            Every recipe in here feeds your collagen, your skin barrier and your glow. Real food, real results — built from the inside out.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/build/glow-bowl"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              <Salad className="h-4 w-4" />
              Build a Glow Bowl
            </Link>
            <button
              onClick={() => setShowGuide(v => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground hover:border-secondary hover:text-secondary transition-colors"
            >
              <Info className="h-4 w-4" />
              {showGuide ? "Hide guide" : "How to use this"}
            </button>
          </div>

          {showGuide && (
            <div className="mt-5 max-w-xl rounded-2xl border border-border bg-white p-6">
              <p className="font-serif text-lg mb-4">Getting the best from this cookbook</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3"><span className="text-secondary mt-0.5 shrink-0">✦</span><span><strong className="text-foreground">Recipes</strong> — every recipe actively supports your skin. Browse, filter and explore.</span></li>
                <li className="flex gap-3"><span className="text-secondary mt-0.5 shrink-0">✦</span><span><strong className="text-foreground">Save</strong> — tap the heart on any recipe to save it to your Saved tab.</span></li>
                <li className="flex gap-3"><span className="text-secondary mt-0.5 shrink-0">✦</span><span><strong className="text-foreground">Planner</strong> — add recipes to plan your week. Your shopping list builds automatically.</span></li>
                <li className="flex gap-3"><span className="text-secondary mt-0.5 shrink-0">✦</span><span><strong className="text-foreground">Shopping</strong> — everything from your plan in one clean grouped list. Add anything else you need too.</span></li>
                <li className="flex gap-3"><span className="text-secondary mt-0.5 shrink-0">✦</span><span><strong className="text-foreground">Glow Bowl</strong> — build a collagen-supporting lunch from whatever's in your fridge.</span></li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-[63px] z-30 border-b border-border bg-white/98 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 space-y-2.5 overflow-x-auto">
          <div className="relative min-w-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes or ingredients…"
              className="pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground shrink-0">
              Meal type:
            </span>
            <FilterChip label="All" active={meal === "all"} onClick={() => setMeal("all")} />
            {mealTypes.map((m) => (
              <FilterChip key={m} label={m} active={meal === m} onClick={() => setMeal(m)} />
            ))}
            {tags.length > 0 && (
              <>
                <span className="mx-1 h-4 w-px bg-border shrink-0" />
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="h-8 rounded-full border border-border bg-background px-3 text-xs text-foreground shrink-0"
                >
                  <option value="all">Focus: all</option>
                  {tags.map((t) => (
                    <option key={t} value={t}>{t.replace(/-/g, " ")}</option>
                  ))}
                </select>
              </>
            )}
            <select
              value={maxTime}
              onChange={(e) => setMaxTime(Number(e.target.value))}
              className="h-8 rounded-full border border-border bg-background px-3 text-xs text-foreground shrink-0"
            >
              <option value={0}>Time: any</option>
              <option value={15}>Under 15 min</option>
              <option value={30}>Under 30 min</option>
              <option value={45}>Under 45 min</option>
              <option value={60}>Under 60 min</option>
            </select>
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Filter className="h-3 w-3" /> {filtered.length} of {recipes.length}
            </span>
          </div>
        </div>
      </section>

      {/* Recipe grid */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No recipes match those filters yet.
          </p>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([mealType, items]) => (
              <div key={mealType}>
                <div className="mb-5 flex items-center gap-4">
                  <h2 className="font-serif text-2xl sm:text-3xl font-light capitalize">{mealType}</h2>
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground shrink-0">
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
        "rounded-full border px-3 py-1 text-xs capitalize transition-colors shrink-0 " +
        (active
          ? "border-secondary bg-secondary text-secondary-foreground font-medium"
          : "border-border bg-background text-foreground/60 hover:border-secondary/40 hover:text-foreground")
      }
    >
      {label}
    </button>
  );
}
