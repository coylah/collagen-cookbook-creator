import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { listRecipes } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  DAYS,
  SLOTS,
  planKey,
  useMealPlan,
  type Slot,
} from "@/lib/user-state";

const recipesQuery = queryOptions({
  queryKey: ["recipes"],
  queryFn: () => listRecipes(),
});

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Weekly meal planner — The Collagen Kitchen" },
      {
        name: "description",
        content: "Plan your week of collagen-supporting meals and generate a shopping list.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(recipesQuery),
  component: PlannerPage,
  errorComponent: ({ error }) => (
    <AppShell>
      <p className="mx-auto max-w-6xl p-8 text-destructive">{error.message}</p>
    </AppShell>
  ),
  notFoundComponent: () => (
    <AppShell>
      <p className="mx-auto max-w-6xl p-8">No recipes available yet.</p>
    </AppShell>
  ),
});

function PlannerPage() {
  const { data: recipes } = useSuspenseQuery(recipesQuery);
  const bySlug = new Map(recipes.map((r) => [r.slug, r]));
  const { plan, set, clear, people, setPeople } = useMealPlan();

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">Weekly meal planner</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick a recipe for each meal, then head to your shopping list.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border bg-background px-1 py-1">
              <button
                onClick={() => setPeople(Math.max(1, people - 1))}
                className="grid h-7 w-7 place-items-center rounded-full hover:bg-accent"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[6rem] text-center text-sm">
                Cooking for {people}
              </span>
              <button
                onClick={() => setPeople(people + 1)}
                className="grid h-7 w-7 place-items-center rounded-full hover:bg-accent"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={clear}>
              <Trash2 className="h-4 w-4" /> Clear week
            </Button>
            <Link to="/shopping">
              <Button size="sm">View shopping list</Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <div className="grid min-w-[760px] grid-cols-[80px_repeat(4,1fr)] gap-2">
            <div />
            {SLOTS.map((s) => (
              <div
                key={s}
                className="px-2 py-1 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground"
              >
                {s}
              </div>
            ))}
            {DAYS.map((d) => (
              <DayRow
                key={d}
                day={d}
                plan={plan}
                bySlug={bySlug}
                onSet={set}
                people={people}
                recipes={recipes}
              />
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function DayRow({
  day,
  plan,
  bySlug,
  onSet,
  people,
  recipes,
}: {
  day: string;
  plan: ReturnType<typeof useMealPlan>["plan"];
  bySlug: Map<string, ReturnType<typeof useSuspenseQuery<typeof recipesQuery>>["data"][number]>;
  onSet: ReturnType<typeof useMealPlan>["set"];
  people: number;
  recipes: ReturnType<typeof useSuspenseQuery<typeof recipesQuery>>["data"];
}) {
  return (
    <>
      <div className="flex items-center px-2 py-2 font-serif text-sm">{day}</div>
      {SLOTS.map((s) => {
        const entry = plan[planKey(day, s)];
        const r = entry ? bySlug.get(entry.slug) : null;
        return (
          <div
            key={s}
            className="min-h-[88px] rounded-lg border bg-card p-2 text-xs"
          >
            {r ? (
              <div className="flex h-full flex-col justify-between">
                <Link
                  to="/recipes/$slug"
                  params={{ slug: r.slug }}
                  className="line-clamp-2 font-medium hover:text-primary"
                >
                  {r.name}
                </Link>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">×{entry?.servings ?? people}</span>
                  <button
                    onClick={() => onSet(day, s, null)}
                    className="grid h-6 w-6 place-items-center rounded-full hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <select
                className="h-full w-full cursor-pointer bg-transparent text-muted-foreground outline-none"
                value=""
                onChange={(e) => {
                  if (e.target.value)
                    onSet(day, s, { slug: e.target.value, servings: people });
                }}
              >
                <option value="">+ add</option>
                {recipes.map((rc) => (
                  <option key={rc.id} value={rc.slug}>
                    {rc.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </>
  );
}
