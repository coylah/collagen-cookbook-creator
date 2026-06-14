import { Link } from "@tanstack/react-router";
import { Clock, Sparkles, Heart } from "lucide-react";
import type { Recipe } from "@/lib/recipe-types";
import { useFavourites } from "@/lib/user-state";
import { cn } from "@/lib/utils";

const MEAL_GRADIENTS: Record<string, string> = {
  breakfast: "from-amber-200 via-orange-200 to-rose-200",
  lunch: "from-lime-200 via-emerald-200 to-teal-200",
  dinner: "from-indigo-200 via-purple-200 to-rose-200",
  snack: "from-yellow-200 via-amber-200 to-orange-200",
  dessert: "from-pink-200 via-rose-200 to-fuchsia-200",
};

const MEAL_EMOJI: Record<string, string> = {
  breakfast: "🍳",
  lunch: "🥗",
  dinner: "🍽️",
  snack: "🥜",
  dessert: "🍓",
};

export function RecipePlaceholder({
  mealType,
  className,
}: {
  mealType: string;
  className?: string;
}) {
  const gradient = MEAL_GRADIENTS[mealType] ?? "from-stone-200 to-stone-300";
  const emoji = MEAL_EMOJI[mealType] ?? "🍴";
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br text-5xl",
        gradient,
        className,
      )}
    >
      <span aria-hidden>{emoji}</span>
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
      className="group block overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
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
              fav ? "fill-primary text-primary" : "text-foreground/60",
            )}
          />
        </button>
        {recipe.collagen_boost && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground shadow-sm">
            <Sparkles className="h-3 w-3" /> Collagen boost
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {recipe.meal_type}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-tight">{recipe.name}</h3>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {total} min
          </span>
          <span>·</span>
          <span>Serves {recipe.servings}</span>
        </div>
        {recipe.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
