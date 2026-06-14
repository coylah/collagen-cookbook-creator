import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Salad, ShoppingBasket, Sparkles, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useShoppingExtras } from "@/lib/user-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/build/glow-bowl")({
  head: () => ({
    meta: [
      { title: "Build Your Own Glow Bowl — The Collagen Kitchen" },
      {
        name: "description",
        content:
          "Mix and match a collagen-supporting lunch bowl in six steps. Choose a base, protein, colour, fats, crunch and dressing.",
      },
      {
        property: "og:title",
        content: "Build Your Own Glow Bowl — The Collagen Kitchen",
      },
      {
        property: "og:description",
        content:
          "Mix and match a collagen-supporting lunch bowl in six steps.",
      },
    ],
  }),
  component: GlowBowlBuilder,
});

type Step = {
  key: string;
  title: string;
  intro: string;
  max: number;
  category: string;
  options: string[];
};

const STEPS: Step[] = [
  {
    key: "base",
    title: "1 · Choose your base",
    intro: "Pick one.",
    max: 1,
    category: "grains",
    options: [
      "Brown rice",
      "Quinoa",
      "Couscous",
      "Giant couscous",
      "Pearl barley",
      "Sweet potato cubes",
      "Baby potatoes",
      "Sourdough croutons",
      "Mixed leaves",
      "Spinach",
      "Kale",
      "Rocket",
      "Lentils",
      "Chickpeas",
      "Butter beans",
    ],
  },
  {
    key: "protein",
    title: "2 · Add your protein",
    intro: "Pick one.",
    max: 1,
    category: "protein",
    options: [
      "Grilled chicken",
      "Roast chicken thighs",
      "Turkey mince",
      "Turkey meatballs",
      "Tuna",
      "Salmon",
      "Mackerel",
      "Sardines",
      "Prawns",
      "Boiled eggs",
      "Beef strips",
      "Leftover slow-cooked beef",
      "Pork slices",
      "Halloumi",
      "Cottage cheese",
      "Greek yogurt dressing on the side",
    ],
  },
  {
    key: "colour",
    title: "3 · Add colour & vitamin C",
    intro: "Pick two or three.",
    max: 3,
    category: "produce",
    options: [
      "Red pepper",
      "Yellow pepper",
      "Cherry tomatoes",
      "Cucumber",
      "Red onion",
      "Carrot ribbons",
      "Roasted butternut squash",
      "Roasted sweet potato",
      "Broccoli",
      "Tenderstem broccoli",
      "Spinach",
      "Kale",
      "Rocket",
      "Beetroot",
      "Mango",
      "Strawberries",
      "Kiwi",
      "Orange segments",
      "Pomegranate seeds",
      "Fresh coriander, parsley, basil or mint",
    ],
  },
  {
    key: "fats",
    title: "4 · Add healthy fats",
    intro: "Pick one.",
    max: 1,
    category: "fats",
    options: [
      "Avocado",
      "Olive oil",
      "Olives",
      "Feta",
      "Nuts",
      "Seeds",
      "Peanut butter dressing",
      "Tahini dressing",
      "Greek yogurt dressing",
      "Salmon or mackerel",
    ],
  },
  {
    key: "crunch",
    title: "5 · Add crunch & minerals",
    intro: "Pick one.",
    max: 1,
    category: "cupboard",
    options: [
      "Pumpkin seeds",
      "Sunflower seeds",
      "Sesame seeds",
      "Chia seeds",
      "Flaxseed",
      "Crushed almonds",
      "Cashews",
      "Walnuts",
      "Toasted chickpeas",
      "Sourdough croutons",
      "Crispy chicken skin (if using roast chicken)",
    ],
  },
  {
    key: "dressing",
    title: "6 · Add a dressing",
    intro: "Pick one.",
    max: 1,
    category: "cupboard",
    options: [
      "Lemon Yogurt — Greek yogurt, lemon juice, garlic, salt, pepper, parsley",
      "Honey Mustard — olive oil, ACV, Dijon, honey, salt, pepper",
      "Tahini Lemon — tahini, lemon, garlic, water, salt, pepper",
      "Satay Style — peanut butter, lime, soy/tamari, ginger, water",
      "Balsamic Glow — olive oil, balsamic, Dijon, salt, pepper",
      "ACV Glow — olive oil, ACV, lemon, garlic, salt, pepper",
    ],
  },
];

type Preset = { name: string; pick: Partial<Record<string, string[]>> };

const PRESETS: Preset[] = [
  {
    name: "Chicken Sweet Potato Glow",
    pick: {
      base: ["Sweet potato cubes"],
      protein: ["Grilled chicken"],
      colour: ["Spinach", "Red pepper"],
      fats: ["Avocado"],
      crunch: ["Pumpkin seeds"],
      dressing: ["Lemon Yogurt — Greek yogurt, lemon juice, garlic, salt, pepper, parsley"],
    },
  },
  {
    name: "Tuna Crunch Glow",
    pick: {
      base: ["Mixed leaves"],
      protein: ["Tuna"],
      colour: ["Cucumber", "Cherry tomatoes", "Red onion"],
      fats: ["Olive oil"],
      crunch: ["Sunflower seeds"],
      dressing: ["ACV Glow — olive oil, ACV, lemon, garlic, salt, pepper"],
    },
  },
  {
    name: "Salmon Skin Glow",
    pick: {
      base: ["Brown rice"],
      protein: ["Salmon"],
      colour: ["Broccoli", "Cucumber"],
      fats: ["Avocado"],
      crunch: ["Sesame seeds"],
      dressing: ["Tahini Lemon — tahini, lemon, garlic, water, salt, pepper"],
    },
  },
  {
    name: "Turkey Taco Glow",
    pick: {
      base: ["Brown rice"],
      protein: ["Turkey mince"],
      colour: ["Red pepper", "Cherry tomatoes"],
      fats: ["Avocado"],
      crunch: ["Pumpkin seeds"],
      dressing: ["Lemon Yogurt — Greek yogurt, lemon juice, garlic, salt, pepper, parsley"],
    },
  },
  {
    name: "Prawn Mango Glow",
    pick: {
      base: ["Quinoa"],
      protein: ["Prawns"],
      colour: ["Mango", "Cucumber", "Red pepper"],
      fats: ["Avocado"],
      crunch: ["Sesame seeds"],
      dressing: ["ACV Glow — olive oil, ACV, lemon, garlic, salt, pepper"],
    },
  },
  {
    name: "Chicken Caesar-ish",
    pick: {
      base: ["Mixed leaves"],
      protein: ["Grilled chicken"],
      colour: ["Cucumber"],
      fats: ["Olive oil"],
      crunch: ["Sourdough croutons"],
      dressing: ["Lemon Yogurt — Greek yogurt, lemon juice, garlic, salt, pepper, parsley"],
    },
  },
  {
    name: "Mackerel Beetroot Glow",
    pick: {
      base: ["Lentils"],
      protein: ["Mackerel"],
      colour: ["Beetroot", "Rocket", "Cucumber"],
      fats: ["Olive oil"],
      crunch: ["Walnuts"],
      dressing: ["Balsamic Glow — olive oil, balsamic, Dijon, salt, pepper"],
    },
  },
  {
    name: "Halloumi Chickpea Glow",
    pick: {
      base: ["Chickpeas"],
      protein: ["Halloumi"],
      colour: ["Spinach", "Cherry tomatoes"],
      fats: ["Olive oil"],
      crunch: ["Pumpkin seeds"],
      dressing: ["Tahini Lemon — tahini, lemon, garlic, water, salt, pepper"],
    },
  },
  {
    name: "Beef Protein Glow",
    pick: {
      base: ["Brown rice"],
      protein: ["Beef strips"],
      colour: ["Broccoli", "Red pepper"],
      fats: ["Olive oil"],
      crunch: ["Sesame seeds"],
      dressing: ["Satay Style — peanut butter, lime, soy/tamari, ginger, water"],
    },
  },
  {
    name: "Egg & Avocado Lunch",
    pick: {
      base: ["Mixed leaves"],
      protein: ["Boiled eggs"],
      colour: ["Cherry tomatoes", "Cucumber"],
      fats: ["Avocado"],
      crunch: ["Pumpkin seeds"],
      dressing: ["Honey Mustard — olive oil, ACV, Dijon, honey, salt, pepper"],
    },
  },
];

type Picks = Record<string, string[]>;

function GlowBowlBuilder() {
  const [picks, setPicks] = useState<Picks>({});
  const [added, setAdded] = useState(false);
  const { add } = useShoppingExtras();

  function togglePick(stepKey: string, option: string, max: number) {
    setAdded(false);
    setPicks((prev) => {
      const cur = prev[stepKey] ?? [];
      if (cur.includes(option)) {
        return { ...prev, [stepKey]: cur.filter((o) => o !== option) };
      }
      const next = max === 1 ? [option] : [...cur, option].slice(-max);
      return { ...prev, [stepKey]: next };
    });
  }

  function applyPreset(p: Preset) {
    setAdded(false);
    setPicks(p.pick as Picks);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function reset() {
    setPicks({});
    setAdded(false);
  }

  const allPicked = useMemo(() => {
    const out: { item: string; category: string }[] = [];
    for (const step of STEPS) {
      for (const it of picks[step.key] ?? []) {
        out.push({ item: it, category: step.category });
      }
    }
    return out;
  }, [picks]);

  function addToShopping() {
    if (allPicked.length === 0) return;
    add(allPicked);
    setAdded(true);
  }

  const totalPicked = allPicked.length;

  return (
    <AppShell>
      {/* Hero */}
      <section className="border-b border-border/50 bg-gradient-to-br from-background via-background to-primary/20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <p className="font-serif text-[11px] uppercase tracking-[0.28em] text-secondary">
            Lunch, your way
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
            Build Your Own Glow Bowl
          </h1>
          <p className="mt-4 max-w-2xl text-foreground/75">
            The easiest way to build a collagen-supporting lunch without
            overthinking it. Choose one base, one protein, two or three
            colourful plants, one healthy fat, one crunch and a dressing. Mix
            and match depending on what you have in the fridge.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
        {/* Steps */}
        <div className="space-y-10">
          {/* Presets */}
          <section>
            <h2 className="font-serif text-xl">Or start from a preset</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap to pre-fill the bowl, then tweak.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-sm transition-colors hover:border-secondary hover:bg-secondary/10"
                >
                  <Sparkles className="h-3.5 w-3.5 text-secondary" />
                  {p.name}
                </button>
              ))}
            </div>
          </section>

          {STEPS.map((step) => {
            const sel = picks[step.key] ?? [];
            return (
              <section key={step.key}>
                <h2 className="font-serif text-xl">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.intro}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {step.options.map((opt) => {
                    const active = sel.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => togglePick(step.key, opt, step.max)}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-sm transition-all",
                          active
                            ? "border-secondary bg-secondary text-secondary-foreground"
                            : "border-border bg-card text-foreground/80 hover:border-secondary/50",
                        )}
                      >
                        {active && <Check className="mr-1 inline h-3 w-3" />}
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Sticky summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/40">
                <Salad className="h-4 w-4 text-secondary" />
              </span>
              <div>
                <p className="font-serif text-lg">Your bowl</p>
                <p className="text-xs text-muted-foreground">
                  {totalPicked} item{totalPicked === 1 ? "" : "s"} picked
                </p>
              </div>
            </div>

            {totalPicked === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Start picking ingredients from the steps. Your bowl will appear
                here.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {STEPS.map((s) => {
                  const items = picks[s.key] ?? [];
                  if (!items.length) return null;
                  return (
                    <li key={s.key}>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {s.title.replace(/^\d+ · /, "")}
                      </p>
                      <ul className="mt-1 space-y-1">
                        {items.map((it) => (
                          <li
                            key={it}
                            className="flex items-start justify-between gap-2 text-sm"
                          >
                            <span>{it}</span>
                            <button
                              onClick={() => togglePick(s.key, it, s.max)}
                              className="text-muted-foreground hover:text-foreground"
                              aria-label="Remove"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-5 flex flex-col gap-2">
              <Button
                onClick={addToShopping}
                disabled={totalPicked === 0}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                <ShoppingBasket className="h-4 w-4" />
                {added ? "Added!" : "Add bowl to shopping list"}
              </Button>
              {added && (
                <Link
                  to="/shopping"
                  className="text-center text-xs text-secondary underline"
                >
                  View shopping list →
                </Link>
              )}
              {totalPicked > 0 && (
                <button
                  onClick={reset}
                  className="text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset bowl
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
