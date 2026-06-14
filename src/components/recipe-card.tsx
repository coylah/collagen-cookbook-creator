import { Link } from "@tanstack/react-router";
import { Clock, Sparkles, Heart, Leaf } from "lucide-react";
import type { Recipe } from "@/lib/recipe-types";
import { useFavourites } from "@/lib/user-state";
import { cn } from "@/lib/utils";

export function RecipePlaceholder({
  mealType: _mealType,
  className,
}: {
  mealType: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className,
      )}
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--blush) 60%, white) 0%, color-mix(in oklab, var(--blush) 30%, white) 55%, color-mix(in oklab, var(--rose) 18%, white) 100%)",
      }}
    >
      <Leaf
        className="h-10 w-10 text-foreground/15"
        strokeWidth={1.25}
        aria-hidden
      />
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_60%)]" />
    </div>
  );
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { isFav, toggle } = useFavourites();
  const fav = isFav(recipe.slug);
  const total = recipe.prep_min + recipe.cook_min;

  return (
    <Link
      to="/recipes/$slug"
      params={{ slug: recipe.slug }}
      className="group block overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <RecipePlaceholder mealType={recipe.meal_type} className="h-full w-full" />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggle(recipe.slug);
          }}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 shadow-sm transition-colors hover:bg-background"
          aria-label={fav ? "Remove from favourites" : "Save recipe"}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              fav ? "fill-secondary text-secondary" : "text-foreground/60",
            )}
          />
        </button>
        {recipe.collagen_boost && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground shadow-sm">
            <Sparkles className="h-3 w-3" /> Super Boost
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {recipe.meal_type}
        </p>
        <h3 className="mt-1.5 font-serif text-lg leading-tight">{recipe.name}</h3>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {total} min
          </span>
          <span>·</span>
          <span>Serves {recipe.servings}</span>
        </div>
      </div>
    </Link>
  );
}
