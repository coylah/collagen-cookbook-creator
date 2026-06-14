import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { listRecipes } from "@/lib/recipes.functions";
import { AppShell } from "@/components/app-shell";
import { RecipeCard } from "@/components/recipe-card";
import { useFavourites } from "@/lib/user-state";

const recipesQuery = queryOptions({
  queryKey: ["recipes"],
  queryFn: () => listRecipes(),
});

export const Route = createFileRoute("/favourites")({
  head: () => ({
    meta: [
      { title: "Saved recipes — The Collagen Kitchen" },
      { name: "description", content: "Your saved collagen-supporting recipes." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(recipesQuery),
  component: FavouritesPage,
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

function FavouritesPage() {
  const { data: recipes } = useSuspenseQuery(recipesQuery);
  const { favs } = useFavourites();
  const saved = recipes.filter((r) => favs.includes(r.slug));

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-3xl">Saved recipes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tap the heart on any recipe to save it here.
        </p>

        {saved.length === 0 ? (
          <div className="mt-12 rounded-2xl border bg-card p-12 text-center">
            <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              You haven't saved any recipes yet.
            </p>
            <Link
              to="/"
              className="mt-4 inline-block text-sm font-medium text-primary underline"
            >
              Browse the cookbook
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
