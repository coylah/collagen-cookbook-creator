import { Snowflake } from "lucide-react";

const TOPPING_CATEGORIES: { title: string; items: string[] }[] = [
  {
    title: "Vitamin C Boosters",
    items: [
      "Strawberries",
      "Raspberries",
      "Kiwi",
      "Mango",
      "Blueberries",
      "Cherries",
    ],
  },
  {
    title: "Healthy Fats & Omega",
    items: [
      "Chia seeds",
      "Flaxseeds",
      "Hemp seeds",
      "Walnuts",
      "Almond butter",
      "Peanut butter",
    ],
  },
  {
    title: "Zinc, Copper & Minerals",
    items: [
      "Pumpkin seeds",
      "Cashews",
      "Sesame seeds",
      "Pecans",
      "Almonds",
      "Sunflower seeds",
    ],
  },
  {
    title: "Antioxidant Boosters",
    items: [
      "Dark chocolate chips",
      "Cacao nibs",
      "Cinnamon",
      "Blueberries",
      "Crushed nuts",
    ],
  },
  {
    title: "Texture & Crunch",
    items: [
      "Toasted coconut flakes",
      "Granola",
      "Crushed nuts",
      "Dark chocolate chips",
      "Toasted seeds",
    ],
  },
];

const FLAVOUR_COMBOS: { name: string; ingredients: string }[] = [
  {
    name: "Peanut Butter Banana Beauty Oats",
    ingredients:
      "Banana, peanut butter, chia seeds, cinnamon and a few dark chocolate chips.",
  },
  {
    name: "Berry Glow Oats",
    ingredients:
      "Strawberries, raspberries, blueberries, chia seeds and crushed almonds.",
  },
  {
    name: "Tropical Skin Glow Oats",
    ingredients: "Mango, kiwi, toasted coconut flakes, hemp seeds and cashews.",
  },
  {
    name: "Chocolate Cherry Glow Oats",
    ingredients:
      "Cherries, cacao nibs or dark chocolate chips, flaxseed and walnuts.",
  },
  {
    name: "Apple Pie Glow Oats",
    ingredients:
      "Grated apple, cinnamon, chia seeds, pecans and a small drizzle of honey.",
  },
  {
    name: "Blueberry Almond Glow Oats",
    ingredients:
      "Blueberries, almond butter, pumpkin seeds and toasted coconut.",
  },
  {
    name: "Raspberry Dark Chocolate Oats",
    ingredients:
      "Raspberries, dark chocolate chips, chia seeds and crushed hazelnuts or almonds.",
  },
  {
    name: "Banana Cinnamon Crunch Oats",
    ingredients: "Banana, cinnamon, flaxseed, walnuts and toasted seeds.",
  },
];

export function BuildYourBeautyOats() {
  return (
    <section className="mt-10 overflow-hidden rounded-3xl border border-border/60 bg-card">
      <div className="border-b border-border/60 bg-primary/15 p-6 sm:p-10">
        <p className="font-serif text-[11px] uppercase tracking-[0.28em] text-secondary">
          Make it yours
        </p>
        <h2 className="mt-2 font-serif text-3xl">Build Your Beauty Oats</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/75">
          Start with the base recipe, then choose your toppings depending on what
          you fancy. Try to include one vitamin C fruit, one healthy fat or seed,
          and one antioxidant or crunch topping to make it more
          collagen-supporting and filling.
        </p>
      </div>

      <div className="space-y-8 p-6 sm:p-10">
        {/* Topping categories */}
        <div className="grid gap-5 sm:grid-cols-2">
          {TOPPING_CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="rounded-2xl border border-border/60 bg-background p-5"
            >
              <h3 className="font-serif text-base">{cat.title}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cat.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs text-foreground/80"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Frozen fruit tip */}
        <aside className="flex items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
          <Snowflake className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
          <p className="text-sm leading-relaxed text-foreground/80">
            <strong>Frozen fruit tip.</strong> Frozen fruit works really well.
            Stir half a cup into the oats the night before so it softens and
            flavours the oats by morning.
          </p>
        </aside>

        {/* Flavour combos */}
        <div>
          <h3 className="font-serif text-xl">Suggested flavour combinations</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Quick inspiration — mix and match anything from above.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FLAVOUR_COMBOS.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl border border-border/60 bg-background p-4 transition-colors hover:border-secondary/40"
              >
                <p className="font-serif text-base">{c.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.ingredients}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
