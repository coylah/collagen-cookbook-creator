import type { Ingredient, Recipe } from "./recipe-types";

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
  qtyText: string;
  category: string;
  fromRecipes: string[];
  staple: boolean;
  key: string;
};

// Normalise item names so similar ingredients merge
// e.g. "chicken breast" and "chicken thighs" both become "chicken"
// e.g. "greek yoghurt" and "greek yogurt" merge
const ITEM_ALIASES: Record<string, string> = {
  "chicken breast": "chicken",
  "chicken breasts": "chicken",
  "chicken thighs": "chicken",
  "chicken thigh": "chicken",
  "chicken fillets": "chicken",
  "chicken fillet": "chicken",
  "roast chicken thighs": "chicken",
  "grilled chicken": "chicken",
  "greek yogurt": "greek yoghurt",
  "full fat greek yogurt": "greek yoghurt",
  "full-fat greek yoghurt": "greek yoghurt",
  "natural yoghurt": "greek yoghurt",
  "salmon fillet": "salmon",
  "salmon fillets": "salmon",
  "beef mince": "beef mince",
  "lean beef mince": "beef mince",
  "spring onions": "spring onion",
  "cherry tomatoes": "cherry tomatoes",
  "olive oil": "olive oil",
  "extra virgin olive oil": "olive oil",
};

function normItem(s: string): string {
  const lower = s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  return ITEM_ALIASES[lower] ?? lower;
}

const UNIT_ALIASES: Record<string, string> = {
  grams: "g",
  gram: "g",
  kilograms: "kg",
  kilogram: "kg",
  millilitres: "ml",
  milliliters: "ml",
  millilitre: "ml",
  milliliter: "ml",
  litres: "l",
  liters: "l",
  litre: "l",
  liter: "l",
  tablespoons: "tbsp",
  tablespoon: "tbsp",
  teaspoons: "tsp",
  teaspoon: "tsp",
  ounces: "oz",
  ounce: "oz",
  pounds: "lb",
  pound: "lb",
  pinches: "pinch",
  pinches: "pinch",
  handfuls: "handful",
  cups: "cup",
};

function normUnit(u: string): string {
  const lower = u.toLowerCase().trim();
  return UNIT_ALIASES[lower] ?? lower;
}

// Staple categories — show on list but no qty needed
const STAPLE_CATEGORIES = new Set(["cupboard", "pantry", "herbs", "spices", "fats"]);

// Very small units — show as staple (just "have in cupboard")
const STAPLE_UNITS = new Set([
  "tsp", "tbsp", "teaspoon", "tablespoon",
  "pinch", "pinches", "dash", "splash", "drizzle",
  "handful", "handfuls",
]);

const PRODUCE_CATEGORIES = new Set(["produce"]);

function isStaple(ing: { category: string; unit: string }): boolean {
  if (STAPLE_CATEGORIES.has(ing.category.toLowerCase())) return true;
  if (STAPLE_UNITS.has(normUnit(ing.unit))) return true;
  return false;
}

export function shoppingItemKey(item: string, unit: string, staple: boolean) {
  // Staples group by name only — don't split by unit
  return staple
    ? `staple|${normItem(item)}`
    : `${normItem(item)}|${normUnit(unit)}`;
}

// Get a clean display name for the shopping list
// Removes "half a", "small", "large" etc — shopping list friendly
function shoppingDisplayName(item: string): string {
  const normed = normItem(item);
  // Capitalise first letter
  return normed.charAt(0).toUpperCase() + normed.slice(1);
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
        // Merge quantities
        if (!staple && existing.qty != null && scaled != null) {
          existing.qty += scaled;
        }
        if (!existing.fromRecipes.includes(recipe.name))
          existing.fromRecipes.push(recipe.name);
      } else {
        map.set(key, {
          item: shoppingDisplayName(ing.item),
          unit: normUnit(ing.unit),
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

  // Format display quantities
  for (const item of map.values()) {
    // Staples — no qty shown, just the item name
    if (item.staple) {
      item.qtyText = "";
      continue;
    }
    if (item.qty == null) {
      item.qtyText = "";
      continue;
    }
    // Produce with no unit — round up to whole items
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
