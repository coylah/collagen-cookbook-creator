import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Clock,
  Heart,
  Minus,
  Plus,
  Sparkles,
  CalendarPlus,
  ChefHat,
} from "lucide-react";
import { getRecipeBySlug } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { RecipePlaceholder } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { useFavourites, useMealPlan, DAYS, SLOTS, type Slot } from "@/lib/user-state";
import { scaleRecipe } from "@/lib/recipe-math";
import { cn } from "@/lib/utils";
import { BuildYourBeautyOats } from "@/components/build-your-beauty-oats";

const recipeQuery = (slug: string) =>
  queryOptions({
    queryKey: ["recipe", slug],
    queryFn: () => getRecipeBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/recipes/$slug")({
  loader: async ({ params, context }) => {
    const r = await context.queryClient.ensureQueryData(recipeQuery(params.slug));
    if (!r) throw notFound();
    return r;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — The Collagen Kitchen` },
          {
            name: "description",
            content:
              loaderData.notes?.slice(0, 160) ??
              `${loaderData.name} — a collagen-supporting recipe.`,
          },
          { property: "og:title", content: loaderData.name },
          {
            property: "og:description",
            content: loaderData.collagen_tip ?? loaderData.notes ?? "",
          },
        ]
      : [],
  }),
  component: RecipePage,
  errorComponent: ({ error }) => (
    <AppShell>
      <p className="mx-auto max-w-3xl p-8 text-destructive">{error.message}</p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl p-8 text-center">
        <p className="text-muted-foreground">Recipe not found.</p>
        <Link to="/" className="mt-4 inline-block text-secondary underline">
          Back to cookbook
        </Link>
      </div>
    </AppShell>
  ),
});

function RecipePage() {
  const recipe = Route.useLoaderData() as import("@/lib/recipe-types").Recipe;
  const { isFav, toggle } = useFavourites();
  const { set: setPlan, people } = useMealPlan();
  const [servings, setServings] = useState(recipe.servings);
  const [checkedIng, setCheckedIng] = useState<Record<number, boolean>>({});
  const [checkedStep, setCheckedStep] = useState<Record<number, boolean>>({});
  const [showPlanPicker, setShowPlanPicker] = useState(false);

  const scaledIngredients = useMemo(
    () => scaleRecipe(recipe, servings),
    [recipe, servings],
  );

  const total = recipe.prep_min + recipe.cook_min;
  const isOats = recipe.slug === "overnight-beauty-oats";

  return (
    <AppShell>
      <article className="mx-auto max-w-4xl px-4 py-8">
        <Link
          to="/"
          className="no-print mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to cookbook
        </Link>

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
          <div className="relative aspect-[16/9] w-full">
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <RecipePlaceholder mealType={recipe.meal_type} className="h-full w-full" />
            )}
          </div>
          <div className="p-6 sm:p-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-secondary">
              {recipe.meal_type}
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{recipe.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {total} min ({recipe.prep_min} prep ·{" "}
                {recipe.cook_min} cook)
              </span>
              {recipe.collagen_boost && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                  <Sparkles className="h-3 w-3" /> Super Boost
                </span>
              )}
            </div>

            {recipe.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {recipe.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Action bar */}
            <div className="no-print mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-6">
              <Button
                variant={isFav(recipe.slug) ? "default" : "outline"}
                size="sm"
                onClick={() => toggle(recipe.slug)}
                className={isFav(recipe.slug) ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : ""}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isFav(recipe.slug) && "fill-secondary-foreground",
                  )}
                />
                {isFav(recipe.slug) ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPlanPicker((v) => !v)}
              >
                <CalendarPlus className="h-4 w-4" /> Add to meal plan
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.print()}>
                Print
              </Button>
            </div>

            {showPlanPicker && (
              <PlanPicker
                onPick={(day, slot) => {
                  setPlan(day, slot, { slug: recipe.slug, servings: people });
                  setShowPlanPicker(false);
                }}
              />
            )}

            {isOats && (
              <p className="mt-6 rounded-xl border border-secondary/30 bg-primary/15 p-3 text-sm text-foreground/80">
                This is the <strong>base recipe</strong>. Scroll down for the
                Build Your Beauty Oats guide with toppings &amp; flavour combos.
              </p>
            )}

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
              {/* Ingredients */}
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl">Ingredients</h2>
                  <div className="no-print flex items-center gap-1 rounded-full border bg-background px-1 py-1">
                    <button
                      onClick={() => setServings((s) => Math.max(1, s - 1))}
                      className="grid h-7 w-7 place-items-center rounded-full hover:bg-accent"
                      aria-label="Fewer servings"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[5rem] text-center text-sm">
                      Serves {servings}
                    </span>
                    <button
                      onClick={() => setServings((s) => s + 1)}
                      className="grid h-7 w-7 place-items-center rounded-full hover:bg-accent"
                      aria-label="More servings"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {scaledIngredients.map((ing, i) => (
                    <li key={i}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/60">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 accent-secondary"
                          checked={!!checkedIng[i]}
                          onChange={() =>
                            setCheckedIng((c) => ({ ...c, [i]: !c[i] }))
                          }
                        />
                        <span
                          className={cn(
                            "text-sm",
                            checkedIng[i] &&
                              "text-muted-foreground line-through decoration-muted-foreground/60",
                          )}
                        >
                          {ing.qty && <strong>{ing.qty} </strong>}
                          {ing.unit && <span>{ing.unit} </span>}
                          {ing.item}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Method */}
              <section>
                <h2 className="font-serif text-xl">Method</h2>
                <ol className="mt-4 space-y-3">
                  {recipe.method.map((step, i) => (
                    <li key={i}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted/60">
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                            checkedStep[i]
                              ? "border-secondary bg-secondary text-secondary-foreground"
                              : "border-input text-foreground/70",
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            setCheckedStep((c) => ({ ...c, [i]: !c[i] }));
                          }}
                        >
                          {i + 1}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={!!checkedStep[i]}
                          onChange={() =>
                            setCheckedStep((c) => ({ ...c, [i]: !c[i] }))
                          }
                        />
                        <span
                          className={cn(
                            "text-sm leading-relaxed",
                            checkedStep[i] && "text-muted-foreground line-through",
                          )}
                        >
                          {step}
                        </span>
                      </label>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {recipe.notes && (
              <aside className="mt-10 rounded-2xl border bg-muted/40 p-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <ChefHat className="h-3.5 w-3.5" /> Chef's note
                </p>
                <p className="mt-2 text-sm leading-relaxed">{recipe.notes}</p>
              </aside>
            )}

            {recipe.collagen_tip && (
              <aside className="mt-4 rounded-2xl border border-secondary/30 bg-primary/20 p-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                  <Sparkles className="h-3.5 w-3.5" /> Why your skin will love this
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  {recipe.collagen_tip}
                </p>
              </aside>
            )}

            <aside className="mt-4 rounded-2xl border border-border/70 bg-card p-5">
              <p className="flex items-baseline gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <span className="font-script text-xl normal-case tracking-normal text-secondary/90">
                  Coylah's
                </span>
                Tips
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                Pair this with a glass of water, a vitamin C–rich fruit, or a small
                handful of nuts to extend the collagen-supporting hit. Real food
                first, supplements second.
              </p>
            </aside>
          </div>
        </div>

        {isOats && <BuildYourBeautyOats />}
      </article>
    </AppShell>
  );
}

function PlanPicker({ onPick }: { onPick: (day: string, slot: Slot) => void }) {
  return (
    <div className="mt-3 rounded-xl border bg-muted/40 p-3">
      <p className="mb-2 text-xs text-muted-foreground">
        Tap a slot to add this recipe to your week:
      </p>
      <div className="grid grid-cols-[auto_repeat(4,1fr)] gap-1 text-xs">
        <div />
        {SLOTS.map((s) => (
          <div key={s} className="px-1 text-center capitalize text-muted-foreground">
            {s}
          </div>
        ))}
        {DAYS.map((d) => (
          <Row key={d} day={d} onPick={onPick} />
        ))}
      </div>
    </div>
  );
}

function Row({ day, onPick }: { day: string; onPick: (d: string, s: Slot) => void }) {
  return (
    <>
      <div className="px-1 py-1 text-muted-foreground">{day}</div>
      {SLOTS.map((s) => (
        <button
          key={s}
          onClick={() => onPick(day, s)}
          className="rounded-md border bg-background py-1 transition-colors hover:border-secondary hover:bg-secondary/10"
        >
          +
        </button>
      ))}
    </>
  );
}
