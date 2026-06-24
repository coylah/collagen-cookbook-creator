import { Link } from "@tanstack/react-router";
import { Heart, Clock } from "lucide-react";
import type { Recipe } from "@/lib/recipe-types";
import { useFavourites } from "@/lib/user-state";
import { cn } from "@/lib/utils";

function SmoothieIllo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 64 76" fill="none" aria-hidden="true">
      <path d="M16 14 L20 60 Q20 64 32 64 Q44 64 44 60 L48 14 Z" stroke="#1C1917" strokeWidth="1" fill="none" strokeLinejoin="round"/>
      <path d="M16 14 L48 14" stroke="#1C1917" strokeWidth="1" strokeLinecap="round"/>
      <path d="M18 26 L46 26" stroke="#EDE5DC" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M19 38 L45 38" stroke="#EDE5DC" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M32 14 L43 5" stroke="#1C1917" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="43.5" cy="4.5" r="2" fill="#C9485B"/>
      <path d="M18 64 L18 70 Q18 72 32 72 Q46 72 46 70 L46 64" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function BreakfastIllo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 64 76" fill="none" aria-hidden="true">
      <path d="M8 36 Q8 60 32 60 Q56 60 56 36" stroke="#1C1917" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M8 36 L56 36" stroke="#1C1917" strokeWidth="1" strokeLinecap="round"/>
      <path d="M20 36 Q20 50 32 50 Q44 50 44 36" stroke="#EDE5DC" strokeWidth="0.8" fill="none"/>
      <path d="M24 36 Q22 28 26 24 Q30 21 32 26 Q34 21 38 24 Q42 28 40 36" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="32" cy="25" r="2" fill="#C9485B"/>
      <path d="M48 26 Q54 24 56 30 L58 42" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M16 60 L16 68 Q16 70 32 70 Q48 70 48 68 L48 60" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function LunchIllo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 64 76" fill="none" aria-hidden="true">
      <path d="M8 40 Q8 64 32 64 Q56 64 56 40" stroke="#1C1917" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M8 40 L56 40" stroke="#1C1917" strokeWidth="1" strokeLinecap="round"/>
      <path d="M14 40 Q12 30 20 26 Q26 23 28 30" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M28 30 Q30 24 36 26 Q42 28 40 36" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M40 36 Q46 28 52 34 Q55 38 54 40" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <circle cx="32" cy="29" r="2" fill="#C9485B"/>
      <path d="M16 64 L16 72 Q16 74 32 74 Q48 74 48 72 L48 64" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function DinnerIllo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.05} viewBox="0 0 72 76" fill="none" aria-hidden="true">
      <ellipse cx="38" cy="54" rx="24" ry="8" stroke="#1C1917" strokeWidth="1" fill="none"/>
      <ellipse cx="38" cy="52" rx="18" ry="5.5" stroke="#EDE5DC" strokeWidth="0.8" fill="none"/>
      <path d="M14 54 L6 46" stroke="#1C1917" strokeWidth="1" strokeLinecap="round"/>
      <path d="M14 50 Q14 38 38 36 Q62 38 62 50" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M24 46 Q30 40 38 42 Q46 44 52 40" stroke="#1C1917" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <circle cx="38" cy="38" r="2" fill="#C9485B"/>
      <path d="M30 30 Q30 24 32 22" stroke="#1C1917" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      <path d="M38 28 Q38 22 38 18" stroke="#1C1917" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
      <path d="M46 30 Q46 24 44 22" stroke="#1C1917" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function SnackIllo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 64 76" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="60" rx="22" ry="5" stroke="#1C1917" strokeWidth="1" fill="none"/>
      <ellipse cx="32" cy="58" rx="16" ry="3.5" stroke="#EDE5DC" strokeWidth="0.8" fill="none"/>
      <circle cx="24" cy="50" r="6" stroke="#1C1917" strokeWidth="0.9" fill="none"/>
      <circle cx="24" cy="50" r="2.5" stroke="#EDE5DC" strokeWidth="0.7" fill="none"/>
      <circle cx="40" cy="52" r="5" stroke="#1C1917" strokeWidth="0.9" fill="none"/>
      <circle cx="40" cy="52" r="2" stroke="#EDE5DC" strokeWidth="0.7" fill="none"/>
      <circle cx="32" cy="46" r="4" stroke="#1C1917" strokeWidth="0.9" fill="none"/>
      <circle cx="32" cy="46" r="1.5" fill="#C9485B" opacity="0.5"/>
    </svg>
  );
}

function GlowBowlIllo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 100 110" fill="none" aria-hidden="true">
      <path d="M8 52 Q8 82 50 82 Q92 82 92 52" stroke="#1C1917" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M8 52 L92 52" stroke="#1C1917" strokeWidth="1" strokeLinecap="round"/>
      <path d="M20 52 Q20 70 50 70 Q80 70 80 52" stroke="#EDE5DC" strokeWidth="0.8" fill="none"/>
      <path d="M16 52 Q14 40 22 34 Q30 28 36 36" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M36 36 Q40 28 50 30 Q60 28 64 36" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M64 36 Q70 28 78 34 Q86 40 84 52" stroke="#1C1917" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M28 44 Q34 38 42 42 Q50 46 58 40 Q66 36 72 42" stroke="#1C1917" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="34" r="2" fill="#C9485B"/>
    </svg>
  );
}

function StampIllustration({ mealType }: { mealType: string }) {
  const type = mealType.toLowerCase();
  if (type === "smoothie") return <SmoothieIllo />;
  if (type === "breakfast") return <BreakfastIllo />;
  if (type === "lunch") return <LunchIllo />;
  if (type === "snack") return <SnackIllo />;
  if (type.includes("glow")) return <GlowBowlIllo />;
  return <DinnerIllo />;
}

export function RecipePlaceholder({ mealType, className }: { mealType: string; className?: string }) {
  return (
    <div className={cn("flex items-center justify-center bg-muted/30", className)}>
      <StampIllustration mealType={mealType} />
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
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-secondary/30"
    >
      <div className="flex min-h-[200px] flex-col justify-between p-5">

        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-block rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-secondary">
            {recipe.meal_type}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(recipe.slug);
            }}
            className={cn(
              "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all",
              fav
                ? "border-secondary bg-secondary/10 text-secondary"
                : "border-border bg-background text-foreground/20 hover:border-secondary/40 hover:text-secondary/60"
            )}
            aria-label={fav ? "Remove from saved" : "Save recipe"}
          >
            <Heart className={cn("h-4 w-4 transition-all", fav && "fill-secondary")} />
          </button>
        </div>

        {/* Name + tease */}
        <div className="mt-4">
          <h3 className="font-serif text-[21px] leading-tight text-foreground group-hover:text-secondary transition-colors">
            {recipe.name}
          </h3>
          {recipe.collagen_tip && (
            <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
              {recipe.collagen_tip}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-end justify-between border-t border-border/60 pt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {total} min · Serves {recipe.servings}
          </div>
          <div className="opacity-50 group-hover:opacity-80 transition-opacity">
            <StampIllustration mealType={recipe.meal_type} />
          </div>
        </div>
      </div>
    </Link>
  );
}
