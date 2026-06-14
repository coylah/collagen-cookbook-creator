import type { Ingredient, Recipe } from "./recipe-types";

// Parse "1", "1/2", "1.5", "7-8" into a number (use lower bound for ranges).
export function parseQty(qty: string): number | null {
  if (!qty) return null;
  const s = qty.trim();
  if (!s) return null;
  if (s.includes("/")) {
    const [a, b] = s.split("/").map((x) => parseFloat(x));
    if (!isNaN(a) && !isNaN(b) && b !== 0) return a / b;
  }
  if (s.includes("-")) {
    const [a] = s.split("-").map((x) => parseFloat(x));
    if (!isNaN(a)) return a;
  }
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

export function formatQty(n: number): string {
  if (Math.abs(n - Math.round(n)) < 0.01) return String(Math.round(n));
  const fracs: [number, string][] = [
    [0.25, "¼"],
    [0.33, "⅓"],
    [0.5, "½"],
    [0.66, "⅔"],
    [0.75, "¾"],
  ];
  const whole = Math.floor(n);
  const rem = n - whole;
  const f = fracs.find(([v]) => Math.abs(rem - v) < 0.05);
  if (f) return whole ? `${whole} ${f[1]}` : f[1];
  return n.toFixed(1);
}

export function scaleIngredient(ing: Ingredient, factor: number): Ingredient {
  const n = parseQty(ing.qty);
  if (n == null) return ing;
  return { ...ing, qty: formatQty(n * factor) };
}

export function scaleRecipe(r: Recipe, newServings: number) {
  const factor = newServings / r.servings;
  return r.ingredients.map((i) => scaleIngredient(i, factor));
}

// --- Shopping list aggregation ---

export type ShoppingItem = {
  item: string;
  unit: string;
  qty: number | null;
  qtyText: string; // displayed
  category: string;
  fromRecipes: string[];
  staple: boolean; // cupboard/seasoning/oil — no quantity shown
  key: string;
};

function normItem(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
}

const STAPLE_CATEGORIES = new Set(["cupboard", "pantry", "herbs", "spices", "fats"]);
const STAPLE_UNITS = new Set([
  "tsp", "tbsp", "teaspoon", "tablespoon",
  "pinch", "pinches", "dash", "splash", "drizzle",
  "handful", "handfuls",
]);
// Produce items that come in discrete whole units when unit is empty
const PRODUCE_CATEGORIES = new Set(["produce"]);

function isStaple(ing: { category: string; unit: string }): boolean {
  if (STAPLE_CATEGORIES.has(ing.category.toLowerCase())) return true;
  if (STAPLE_UNITS.has(ing.unit.toLowerCase())) return true;
  return false;
}

export function shoppingItemKey(item: string, unit: string, staple: boolean) {
  return staple
    ? `staple|${normItem(item)}`
    : `${normItem(item)}|${unit.toLowerCase()}`;
}

export function buildShoppingList(
  entries: { recipe: Recipe; servings: number }[],
): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();
  for (const { recipe, servings } of entries) {
    const factor = servings / recipe.servings;
    for (const ing of recipe.ingredients) {
      const staple = isStaple(ing);
      const key = shoppingItemKey(ing.item, ing.unit, staple);
      const n = parseQty(ing.qty);
      const scaled = n != null ? n * factor : null;
      const existing = map.get(key);
      if (existing) {
        if (!staple && existing.qty != null && scaled != null) {
          existing.qty += scaled;
        }
        if (!existing.fromRecipes.includes(recipe.name))
          existing.fromRecipes.push(recipe.name);
      } else {
        map.set(key, {
          item: ing.item,
          unit: ing.unit,
          qty: scaled,
          qtyText: "",
          category: ing.category || "other",
          fromRecipes: [recipe.name],
          staple,
          key,
        });
      }
    }
  }

  // Compute display quantity per item with smart rounding
  for (const item of map.values()) {
    if (item.staple) {
      item.qtyText = "";
      continue;
    }
    if (item.qty == null) {
      item.qtyText = "";
      continue;
    }
    // Produce with empty unit → round up to whole (you don't buy half a cauliflower)
    if (PRODUCE_CATEGORIES.has(item.category.toLowerCase()) && !item.unit) {
      item.qty = Math.ceil(item.qty);
      item.qtyText = String(item.qty);
      continue;
    }
    item.qtyText = formatQty(item.qty);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.category.localeCompare(b.category) || a.item.localeCompare(b.item),
  );
}
