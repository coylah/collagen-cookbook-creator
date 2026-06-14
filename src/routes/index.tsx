import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Sparkles, Filter } from "lucide-react";
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
      { title: "The Collagen Kitchen — Recipes that love your skin" },
      {
        name: "description",
        content:
          "A beautiful, filterable cookbook of high-protein, collagen-supporting recipes. Save favourites, plan your week, generate a shopping list.",
      },
      { property: "og:title", content: "The Collagen Kitchen" },
      {
        property: "og:description",
        content: "Browse, filter and plan collagen-supporting recipes.",
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

function Cookbook() {
  const { data: recipes } = useSuspenseQuery(recipesQuery);
  const [search, setSearch] = useState("");
  const [meal, setMeal] = useState<string>("all");
  const [tag, setTag] = useState<string>("all");
  const [maxTime, setMaxTime] = useState<number>(0);
  const [collagenOnly, setCollagenOnly] = useState(false);

  const mealTypes = useMemo(
    () => Array.from(new Set(recipes.map((r) => r.meal_type))).sort(),
    [recipes],
  );
  const tags = useMemo(
    () => Array.from(new Set(recipes.flatMap((r) => r.tags))).sort(),
    [recipes],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes.filter((r) => {
      if (meal !== "all" && r.meal_type !== meal) return false;
      if (tag !== "all" && !r.tags.includes(tag)) return false;
      if (collagenOnly && !r.collagen_boost) return false;
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
    });
  }, [recipes, search, meal, tag, maxTime, collagenOnly]);

  return (
    <AppShell>
      {/* Hero */}
      <section className="border-b bg-gradient-to-br from-cream via-background to-accent/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="font-serif text-sm uppercase tracking-[0.2em] text-primary">
            Beauty starts in the kitchen
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
            Recipes that love your skin back.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Browse, filter, save your favourites and plan the week. Every recipe is
            built to support collagen, protein and a glowing routine.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[65px] z-30 border-b bg-background/90 backdrop-blur">
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
              variant={collagenOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setCollagenOnly((v) => !v)}
            >
              <Sparkles className="h-3.5 w-3.5" /> Collagen boost
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

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            No recipes match those filters yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
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
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background text-foreground/70 hover:bg-accent")
      }
    >
      {label}
    </button>
  );
}
