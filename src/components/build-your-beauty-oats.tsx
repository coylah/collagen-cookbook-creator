import { useState } from "react";
import { Snowflake, ShoppingBasket, Check } from "lucide-react";
import { useShoppingExtras } from "@/lib/user-state";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const TOPPING_CATEGORIES: { title: string; items: { label: string; category: string }[] }[] = [
  {
    title: "Vitamin C Boosters",
    items: [
      { label: "Strawberries", category: "produce" },
      { label: "Raspberries", category: "produce" },
      { label: "Kiwi", category: "produce" },
      { label: "Mango", category: "produce" },
      { label: "Blueberries", category: "produce" },
      { label: "Cherries", category: "produce" },
    ],
  },
  {
    title: "Healthy Fats & Omega",
    items: [
      { label: "Chia seeds", category: "cupboard" },
      { label: "Flaxseeds", category: "cupboard" },
      { label: "Hemp seeds", category: "cupboard" },
      { label: "Walnuts", category: "cupboard" },
      { label: "Almond butter", category: "cupboard" },
      { label: "Peanut butter", category: "cupboard" },
    ],
  },
  {
    title: "Zinc, Copper & Minerals",
    items: [
      { label: "Pumpkin seeds", category: "cupboard" },
      { label: "Cashews", category: "cupboard" },
      { label: "Sesame seeds", category: "cupboard" },
      { label: "Pecans", category: "cupboard" },
      { label: "Almonds", category: "cupboard" },
      { label: "Sunflower seeds", category: "cupboard" },
    ],
  },
  {
    title: "Antioxidant Boosters",
    items: [
      { label: "Dark chocolate chips", category: "cupboard" },
      { label: "Cacao nibs", category: "cupboard" },
      { label: "Cinnamon", category: "cupboard" },
      { label: "Blueberries", category: "produce" },
      { label: "Crushed nuts", category: "cupboard" },
    ],
  },
  {
    title: "Texture & Crunch",
    items: [
      { label: "Toasted coconut flakes", category: "cupboard" },
      { label: "Granola", category: "cupboard" },
      { label: "Dark chocolate chips", category: "cupboard" },
      { label: "Toasted seeds", category: "cupboard" },
    ],
  },
];

const FLAVOUR_COMBOS: {
  name: string;
  description: string;
  items: { label: string; category: string }[];
}[] = [
  {
    name: "Peanut Butter Banana",
    description: "Banana, peanut butter, chia seeds, cinnamon and a few dark chocolate chips.",
    items: [
      { label: "Banana", category: "produce" },
      { label: "Peanut butter", category: "cupboard" },
      { label: "Chia seeds", category: "cupboard" },
      { label: "Cinnamon", category: "cupboard" },
      { label: "Dark chocolate chips", category: "cupboard" },
    ],
  },
  {
    name: "Berry Glow",
    description: "Strawberries, raspberries, blueberries, chia seeds and crushed almonds.",
    items: [
      { label: "Strawberries", category: "produce" },
      { label: "Raspberries", category: "produce" },
      { label: "Blueberries", category: "produce" },
      { label: "Chia seeds", category: "cupboard" },
      { label: "Almonds", category: "cupboard" },
    ],
  },
  {
    name: "Tropical Skin Glow",
    description: "Mango, kiwi, toasted coconut flakes, hemp seeds and cashews.",
    items: [
      { label: "Mango", category: "produce" },
      { label: "Kiwi", category: "produce" },
      { label: "Toasted coconut flakes", category: "cupboard" },
      { label: "Hemp seeds", category: "cupboard" },
      { label: "Cashews", category: "cupboard" },
    ],
  },
  {
    name: "Chocolate Cherry Glow",
    description: "Cherries, cacao nibs, flaxseed and walnuts.",
    items: [
      { label: "Cherries", category: "produce" },
      { label: "Cacao nibs", category: "cupboard" },
      { label: "Flaxseeds", category: "cupboard" },
      { label: "Walnuts", category: "cupboard" },
    ],
  },
  {
    name: "Apple Pie Glow",
    description: "Grated apple, cinnamon, chia seeds, pecans and a small drizzle of honey.",
    items: [
      { label: "Apple", category: "produce" },
      { label: "Cinnamon", category: "cupboard" },
      { label: "Chia seeds", category: "cupboard" },
      { label: "Pecans", category: "cupboard" },
      { label: "Honey", category: "cupboard" },
    ],
  },
  {
    name: "Blueberry Almond",
    description: "Blueberries, almond butter, pumpkin seeds and toasted coconut.",
    items: [
      { label: "Blueberries", category: "produce" },
      { label: "Almond butter", category: "cupboard" },
      { label: "Pumpkin seeds", category: "cupboard" },
      { label: "Toasted coconut flakes", category: "cupboard" },
    ],
  },
  {
    name: "Raspberry Dark Chocolate",
    description: "Raspberries, dark chocolate chips, chia seeds and crushed almonds.",
    items: [
      { label: "Raspberries", category: "produce" },
      { label: "Dark chocolate chips", category: "cupboard" },
      { label: "Chia seeds", category: "cupboard" },
      { label: "Almonds", category: "cupboard" },
    ],
  },
  {
    name: "Banana Cinnamon Crunch",
    description: "Banana, cinnamon, flaxseed, walnuts and toasted seeds.",
    items: [
      { label: "Banana", category: "produce" },
      { label: "Cinnamon", category: "cupboard" },
      { label: "Flaxseeds", category: "cupboard" },
      { label: "Walnuts", category: "cupboard" },
      { label: "Toasted seeds", category: "cupboard" },
    ],
  },
];

export function BuildYourBeautyOats() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [added, setAdded] = useState(false);
  const { add } = useShoppingExtras();

  function toggleItem(label: string, category: string) {
    setAdded(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }

  function applyCombo(combo: (typeof FLAVOUR_COMBOS)[0]) {
    setAdded(false);
    setSelected(new Set(combo.items.map((i) => i.label)));
  }

  function addToShopping() {
    if (selected.size === 0) return;
    const allItems = TOPPING_CATEGORIES.flatMap((c) => c.items);
    const itemsToAdd = Array.from(selected).map((label) => {
      const found = allItems.find((i) => i.label === label);
      return { item: label, category: found?.category ?? "cupboard" };
    });
    add(itemsToAdd);
    setAdded(true);
  }

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border bg-muted/30 px-8 py-8 sm:px-10">
        <p className="text-[9px] uppercase tracking-[0.22em] text-secondary">
          Make it yours
        </p>
        <h2 className="mt-2 font-serif text-3xl font-light">Build Your Beauty Oats</h2>
        <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-foreground/70">
          Start with the base recipe, then tap toppings to add them to your
          shopping list. Aim for one vitamin C fruit, one healthy fat or seed,
          and one crunch topping to make it properly collagen-supporting.
        </p>
      </div>

      <div className="space-y-8 px-8 py-8 sm:px-10">

        {/* Flavour combos — quick start */}
        <div>
          <h3 className="font-serif text-lg font-light">Start with a combination</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap one to pre-select all the toppings at once.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FLAVOUR_COMBOS.map((c) => (
              <button
                key={c.name}
                onClick={() => applyCombo(c)}
                className="rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-secondary/50 hover:bg-accent"
              >
                <p className="font-serif text-base">{c.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Topping categories */}
        <div>
          <h3 className="font-serif text-lg font-light">Or pick your own toppings</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap anything to add it to your shopping list.
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {TOPPING_CATEGORIES.map((cat) => (
              <div key={cat.title} className="rounded-xl border border-border bg-background p-5">
                <h4 className="font-serif text-base">{cat.title}</h4>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cat.items.map((it) => {
                    const isSelected = selected.has(it.label);
                    return (
                      <button
                        key={it.label}
                        onClick={() => toggleItem(it.label, it.category)}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all",
                          isSelected
                            ? "border-secondary bg-secondary/10 text-secondary font-medium"
                            : "border-border bg-card text-foreground/70 hover:border-secondary/40"
                        )}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5" />}
                        {it.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frozen fruit tip */}
        <aside className="flex items-start gap-3 rounded-xl border border-secondary/20 bg-secondary/5 p-4">
          <Snowflake className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          <p className="text-sm font-light leading-relaxed text-foreground/80">
            <strong className="font-medium">Frozen fruit works really well.</strong>{" "}
            Stir half a cup into the oats the night before so it softens and
            flavours the oats by morning.
          </p>
        </aside>

        {/* Add to shopping list */}
        {selected.size > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              {Array.from(selected).map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-1 text-xs text-secondary"
                >
                  <Check className="h-2.5 w-2.5" />
                  {label}
                </span>
              ))}
            </div>
            <button
              onClick={addToShopping}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-opacity hover:opacity-90"
            >
              <ShoppingBasket className="h-4 w-4" />
              {added ? "Added to shopping list!" : `Add ${selected.size} topping${selected.size === 1 ? "" : "s"} to shopping list`}
            </button>
            {added && (
              <Link
                to="/shopping"
                className="text-center text-xs text-secondary underline underline-offset-2"
              >
                View shopping list →
              </Link>
            )}
            <button
              onClick={() => { setSelected(new Set()); setAdded(false); }}
              className="text-center text-xs text-muted-foreground hover:text-foreground"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
