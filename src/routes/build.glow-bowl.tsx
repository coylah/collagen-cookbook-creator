import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Check, Salad, ShoppingBasket, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useShoppingExtras } from "@/lib/user-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/build/glow-bowl")({
  head: () => ({
    meta: [
      { title: "Build Your Glow Bowl — The Collagen Kitchen" },
      {
        name: "description",
        content: "Six steps to a collagen-supporting lunch bowl.",
      },
    ],
  }),
  component: GlowBowlBuilder,
});

type Option = { label: string; ingredients?: string };

type Step = {
  key: string;
  pillar: string;
  title: string;
  subtitle: string;
  intro: string;
  category: string;
  options: Option[];
};

const STEPS: Step[] = [
  {
    key: "support",
    pillar: "1 · Support",
    title: "Your base",
    subtitle: "Steady energy, stable blood sugar, skin from the inside",
    intro: "Pick one or two.",
    category: "grains",
    options: [
      { label: "Brown rice" },
      { label: "Quinoa" },
      { label: "Couscous" },
      { label: "Giant couscous" },
      { label: "Lentils" },
      { label: "Chickpeas" },
      { label: "Butter beans" },
      { label: "Sweet potato cubes" },
      { label: "Mixed leaves" },
      { label: "Spinach" },
      { label: "Kale" },
      { label: "Rocket" },
    ],
  },
  {
    key: "build",
    pillar: "2 · Build",
    title: "Your protein",
    subtitle: "The amino acids collagen is literally made from",
    intro: "Pick one.",
    category: "protein",
    options: [
      { label: "Grilled chicken (skin on)" },
      { label: "Roast chicken thighs (skin on)" },
      { label: "Turkey mince" },
      { label: "Turkey meatballs" },
      { label: "Tuna" },
      { label: "Salmon" },
      { label: "Mackerel" },
      { label: "Sardines" },
      { label: "Prawns" },
      { label: "Boiled eggs" },
      { label: "Beef strips" },
      { label: "Halloumi" },
      { label: "Cottage cheese" },
    ],
  },
  {
    key: "activate",
    pillar: "3 · Activate",
    title: "Your vitamin C",
    subtitle: "Without this, collagen synthesis stops. Full stop.",
    intro: "Pick two or three — the more colour the better.",
    category: "produce",
    options: [
      { label: "Red pepper" },
      { label: "Yellow pepper" },
      { label: "Cherry tomatoes" },
      { label: "Cucumber" },
      { label: "Red onion" },
      { label: "Carrot ribbons" },
      { label: "Roasted butternut squash" },
      { label: "Roasted sweet potato" },
      { label: "Broccoli" },
      { label: "Tenderstem broccoli" },
      { label: "Beetroot" },
      { label: "Mango" },
      { label: "Strawberries" },
      { label: "Kiwi" },
      { label: "Orange segments" },
      { label: "Red/purple grapes" },
      { label: "Pomegranate seeds" },
      { label: "Fresh herbs" },
    ],
  },
  {
    key: "protect",
    pillar: "4 · Protect",
    title: "Your healthy fats",
    subtitle: "Omega-3s for your skin barrier, antioxidants to stop collagen breaking down",
    intro: "Pick one.",
    category: "fats",
    options: [
      { label: "Avocado" },
      { label: "Olive oil" },
      { label: "Olives" },
      { label: "Feta" },
      { label: "Mozzarella pearls" },
      { label: "Tahini drizzle" },
    ],
  },
  {
    key: "fortify",
    pillar: "5 · Fortify",
    title: "Your zinc & copper",
    subtitle: "The minerals that activate collagen-building enzymes",
    intro: "Pick one — this is your crunch layer too.",
    category: "cupboard",
    options: [
      { label: "Pumpkin seeds" },
      { label: "Sunflower seeds" },
      { label: "Sesame seeds" },
      { label: "Chia seeds" },
      { label: "Flaxseed" },
      { label: "Crushed almonds" },
      { label: "Cashews" },
      { label: "Walnuts" },
      { label: "Pecans" },
      { label: "Pine nuts" },
      { label: "Chickpeas" },
      { label: "Sourdough croutons" },
    ],
  },
  {
    key: "finish",
    pillar: "6 · Finish",
    title: "Your dressing",
    subtitle: "Just mix and pour",
    intro: "Pick one.",
    category: "cupboard",
    options: [
      { label: "Lemon Yogurt", ingredients: "Greek yogurt, lemon juice, garlic, salt, pepper, parsley" },
      { label: "Honey Mustard", ingredients: "Olive oil, apple cider vinegar, Dijon mustard, honey, salt, pepper" },
      { label: "Tahini Lemon", ingredients: "Tahini, lemon juice, garlic, water, salt, pepper" },
      { label: "Satay Style", ingredients: "Peanut butter, lime juice, soy sauce or tamari, ginger, water" },
      { label: "Balsamic Glow", ingredients: "Olive oil, balsamic vinegar, Dijon mustard, salt, pepper" },
      { label: "Apple Cider Vinegar Glow", ingredients: "Olive oil, apple cider vinegar, lemon juice, garlic, salt, pepper" },
    ],
  },
];

type Preset = { name: string; pick: Partial<Record<string, string[]>> };

const PRESETS: Preset[] = [
  { name: "Chicken & Sweet Potato Glow", pick: { support: ["Sweet potato cubes"], build: ["Grilled chicken (skin on)"], activate: ["Spinach", "Red pepper"], protect: ["Avocado"], fortify: ["Pumpkin seeds"], finish: ["Lemon Yogurt"] } },
  { name: "Tuna Crunch Bowl", pick: { support: ["Mixed leaves"], build: ["Tuna"], activate: ["Cucumber", "Cherry tomatoes", "Red onion"], protect: ["Olive oil"], fortify: ["Sunflower seeds"], finish: ["Apple Cider Vinegar Glow"] } },
  { name: "Salmon Skin Glow", pick: { support: ["Brown rice"], build: ["Salmon"], activate: ["Broccoli", "Cucumber"], protect: ["Avocado"], fortify: ["Sesame seeds"], finish: ["Tahini Lemon"] } },
  { name: "Turkey Taco Bowl", pick: { support: ["Brown rice"], build: ["Turkey mince"], activate: ["Red pepper", "Cherry tomatoes"], protect: ["Avocado"], fortify: ["Pumpkin seeds"], finish: ["Lemon Yogurt"] } },
  { name: "Prawn Mango Glow", pick: { support: ["Quinoa"], build: ["Prawns"], activate: ["Mango", "Cucumber", "Red pepper"], protect: ["Avocado"], fortify: ["Sesame seeds"], finish: ["Apple Cider Vinegar Glow"] } },
  { name: "Halloumi Chickpea Bowl", pick: { support: ["Chickpeas"], build: ["Halloumi"], activate: ["Cherry tomatoes"], protect: ["Tahini drizzle"], fortify: ["Pumpkin seeds"], finish: ["Tahini Lemon"] } },
  { name: "Mackerel Beetroot Bowl", pick: { support: ["Lentils"], build: ["Mackerel"], activate: ["Beetroot", "Rocket", "Cucumber"], protect: ["Olive oil"], fortify: ["Walnuts"], finish: ["Balsamic Glow"] } },
  { name: "Egg & Avocado Bowl", pick: { support: ["Mixed leaves"], build: ["Boiled eggs"], activate: ["Cherry tomatoes", "Cucumber"], protect: ["Avocado"], fortify: ["Pumpkin seeds"], finish: ["Honey Mustard"] } },
  { name: "Beef & Broccoli Bowl", pick: { support: ["Brown rice"], build: ["Beef strips"], activate: ["Broccoli", "Red pepper"], protect: ["Olive oil"], fortify: ["Sesame seeds"], finish: ["Satay Style"] } },
  { name: "Sardine & Lemon Bowl", pick: { support: ["Rocket"], build: ["Sardines"], activate: ["Cherry tomatoes", "Red onion", "Cucumber"], protect: ["Olive oil"], fortify: ["Pine nuts"], finish: ["Lemon Yogurt"] } },
];

type Picks = Record<string, string[]>;

function GlowBowlBuilder() {
  const [picks, setPicks] = useState<Picks>({});
  const [added, setAdded] = useState(false);
  const { add } = useShoppingExtras();

  useEffect(() => { setAdded(false); }, []);

  function togglePick(stepKey: string, optionLabel: string) {
    setAdded(false);
    setPicks((prev) => {
      const cur = prev[stepKey] ?? [];
      if (cur.includes(optionLabel))
        return { ...prev, [stepKey]: cur.filter((o) => o !== optionLabel) };
      return { ...prev, [stepKey]: [...cur, optionLabel] };
    });
  }

  function applyPreset(p: Preset) {
    setAdded(false);
    setPicks(p.pick as Picks);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() { setPicks({}); setAdded(false); }

  const allPicked = useMemo(() => {
    const out: { item: string; category: string }[] = [];
    for (const step of STEPS) {
      for (const label of picks[step.key] ?? []) {
        out.push({ item: label, category: step.category });
      }
    }
    return out;
  }, [picks]);

  function addToShopping() {
    if (allPicked.length === 0) return;
    add(allPicked);
    setAdded(true);
  }

  const totalPicked = Object.values(picks).flat().length;
  const stepsComplete = STEPS.filter(s => (picks[s.key]?.length ?? 0) > 0).length;

  function getDressingIngredients(label: string): string | undefined {
    const step = STEPS.find((s) => s.key === "finish");
    return step?.options.find((o) => o.label === label)?.ingredients;
  }

  return (
    <AppShell>
      {/* Hero — pure white */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-secondary" />
            <p className="text-[9px] uppercase tracking-[0.32em] text-secondary">Build your lunch</p>
            <div className="h-px w-6 bg-secondary" />
          </div>
          <p className="font-script text-2xl text-secondary -mb-1">Love Coylah</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light leading-tight text-foreground mb-3">
            Glow Bowl Builder
          </h1>
          <div className="w-8 h-px bg-secondary mb-4" />
          <p className="max-w-xl text-sm text-muted-foreground leading-relaxed font-light">
            Six steps. Support, Build, Activate, Protect, Fortify, Finish. Every step feeds a different part of your collagen story.
          </p>
          {stepsComplete > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <div className="flex gap-1">
                {STEPS.map((s) => (
                  <div key={s.key} className={`h-1.5 w-8 rounded-full transition-all ${(picks[s.key]?.length ?? 0) > 0 ? "bg-secondary" : "bg-border"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{stepsComplete} of 6 done</span>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4 min-w-0">
          {/* Presets */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-serif text-xl mb-1">Start from a preset</h2>
            <p className="text-sm text-muted-foreground mb-3">Tap one to pre-fill your bowl.</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-all hover:border-secondary hover:bg-secondary/5 hover:text-secondary"
                >
                  ✦ {p.name}
                </button>
              ))}
            </div>
          </section>

          {/* Steps */}
          {STEPS.map((step) => {
            const sel = picks[step.key] ?? [];
            const isDone = sel.length > 0;
            return (
              <section key={step.key} className={cn("rounded-2xl border p-5 transition-all", isDone ? "border-secondary/30 bg-secondary/5" : "border-border bg-card")}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-secondary font-medium mb-1">{step.pillar}</p>
                    <h2 className="font-serif text-xl">{step.title}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.subtitle}</p>
                  </div>
                  {isDone && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-secondary-foreground shrink-0">
                      <Check className="h-3 w-3" /> {sel.length} picked
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3 mb-3 italic">{step.intro}</p>
                <div className="flex flex-wrap gap-2">
                  {step.options.map((opt) => {
                    const active = sel.includes(opt.label);
                    return (
                      <div key={opt.label} className="flex flex-col gap-0.5">
                        <button
                          onClick={() => togglePick(step.key, opt.label)}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-sm transition-all",
                            active ? "border-secondary bg-secondary text-secondary-foreground font-medium" : "border-border bg-background text-foreground/70 hover:border-secondary/50 hover:bg-secondary/5"
                          )}
                        >
                          {active && <Check className="mr-1 inline h-3 w-3" />}
                          {opt.label}
                        </button>
                        {opt.ingredients && active && (
                          <p className="px-3 text-[11px] text-muted-foreground italic">{opt.ingredients}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Sticky summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary/10 shrink-0">
                <Salad className="h-4 w-4 text-secondary" />
              </span>
              <div>
                <p className="font-serif text-lg">Your bowl</p>
                <p className="text-xs text-muted-foreground">{totalPicked === 0 ? "Nothing picked yet" : `${totalPicked} ingredient${totalPicked === 1 ? "" : "s"}`}</p>
              </div>
            </div>

            {totalPicked === 0 ? (
              <p className="text-sm text-muted-foreground border border-dashed border-border rounded-xl p-4 text-center leading-relaxed">
                Pick from the steps on the left and your bowl builds up here.
              </p>
            ) : (
              <ul className="space-y-3 mb-4">
                {STEPS.map((s) => {
                  const items = picks[s.key] ?? [];
                  if (!items.length) return null;
                  return (
                    <li key={s.key}>
                      <p className="text-[9px] uppercase tracking-wider text-secondary mb-1">{s.pillar}</p>
                      <ul className="space-y-1">
                        {items.map((label) => (
                          <li key={label} className="flex flex-col gap-0.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm">{label}</span>
                              <button onClick={() => togglePick(s.key, label)} className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted" aria-label="Remove">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                            {s.key === "finish" && getDressingIngredients(label) && (
                              <p className="text-[11px] text-muted-foreground italic">{getDressingIngredients(label)}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex flex-col gap-2">
              <Button onClick={addToShopping} disabled={totalPicked === 0} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <ShoppingBasket className="h-4 w-4" />
                {added ? "Added to your list!" : "Add bowl to shopping list"}
              </Button>
              {added && <Link to="/shopping" className="text-center text-xs text-secondary underline underline-offset-2">View shopping list →</Link>}
              {totalPicked > 0 && <button onClick={reset} className="text-center text-xs text-muted-foreground hover:text-foreground">Start over</button>}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
