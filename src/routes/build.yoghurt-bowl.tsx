import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Check, ShoppingBasket, X } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useShoppingExtras } from "@/lib/user-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/build/yoghurt-bowl")({
  head: () => ({
    meta: [
      { title: "Build Your Yoghurt Bowl — The Collagen Kitchen" },
      {
        name: "description",
        content: "Five steps to a collagen-supporting breakfast bowl.",
      },
    ],
  }),
  component: YoghurtBowlBuilder,
});

type Option = { label: string; note?: string };
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
    key: "base",
    pillar: "1 · Base",
    title: "Your protein foundation",
    subtitle: "Start with something thick, creamy and high in protein",
    intro: "Pick one.",
    category: "dairy",
    options: [
      { label: "Greek yoghurt", note: "The classic. Around 10g protein per 100g. Thick, creamy, brilliant." },
      { label: "Skyr", note: "Icelandic style — even thicker than Greek yoghurt. Highest protein of all, around 11g per 100g." },
      { label: "Coconut yoghurt", note: "Dairy free. Naturally sweet and creamy. Lower in protein but great if you're avoiding dairy." },
    ],
  },
  {
    key: "fruit",
    pillar: "2 · Activate",
    title: "Your vitamin C and antioxidants",
    subtitle: "Vitamin C activates collagen synthesis — don't skip this step",
    intro: "Pick two or three. The more colour the better.",
    category: "produce",
    options: [
      { label: "Blueberries" },
      { label: "Raspberries" },
      { label: "Strawberries" },
      { label: "Blackberries" },
      { label: "Mixed berries" },
      { label: "Mango chunks" },
      { label: "Kiwi" },
      { label: "Banana" },
      { label: "Peach" },
      { label: "Cherries" },
      { label: "Pomegranate seeds" },
      { label: "Passion fruit" },
      { label: "Papaya" },
      { label: "Pineapple chunks" },
      { label: "Apple slices" },
      { label: "Pear slices" },
      { label: "Watermelon" },
      { label: "Goji berries" },
      { label: "Dried apricots" },
      { label: "Dried cranberries" },
      { label: "Fig slices" },
    ],
  },
  {
    key: "crunch",
    pillar: "3 · Fortify",
    title: "Your crunch and minerals",
    subtitle: "Zinc, copper, omega-3s and texture — your skin loves this layer",
    intro: "Pick two or three.",
    category: "cupboard",
    options: [
      { label: "Homemade granola" },
      { label: "Oats" },
      { label: "Crushed almonds" },
      { label: "Walnuts" },
      { label: "Pecans" },
      { label: "Cashews" },
      { label: "Hazelnuts" },
      { label: "Macadamia nuts" },
      { label: "Pumpkin seeds" },
      { label: "Sunflower seeds" },
      { label: "Chia seeds" },
      { label: "Flaxseed" },
      { label: "Hemp seeds" },
      { label: "Sesame seeds" },
      { label: "Coconut flakes" },
      { label: "Cacao nibs" },
      { label: "Dark chocolate chips (70%+)" },
    ],
  },
  {
    key: "drizzle",
    pillar: "4 · Protect",
    title: "Your healthy fats and sweetness",
    subtitle: "A little goes a long way — this is what makes it feel indulgent",
    intro: "Pick one.",
    category: "cupboard",
    options: [
      { label: "Honey" },
      { label: "Peanut butter" },
      { label: "Almond butter" },
      { label: "Cashew butter" },
      { label: "Tahini" },
      { label: "Maple syrup" },
      { label: "Melted dark chocolate" },
    ],
  },
  {
    key: "boost",
    pillar: "5 · Boost",
    title: "Your anti-inflammatory extras",
    subtitle: "Small additions, big skin benefits",
    intro: "Pick one or two — optional but brilliant.",
    category: "cupboard",
    options: [
      { label: "Cinnamon", note: "Anti-inflammatory and helps regulate blood sugar — a perfect pairing with fruit" },
      { label: "Ginger", note: "Fresh grated or ground — anti-inflammatory and great for gut health" },
      { label: "Vanilla extract", note: "A few drops makes everything taste more indulgent with zero sugar" },
      { label: "Cocoa powder", note: "Stir into your base for a chocolate yoghurt — rich in antioxidants" },
      { label: "Nutmeg", note: "A pinch adds warmth — lovely with banana or peach" },
      { label: "Maca powder", note: "Earthy and malty — balancing for hormones and energy" },
      { label: "Matcha powder", note: "Antioxidant-rich, gives a gentle energy boost without the crash" },
      { label: "Lemon zest", note: "Brightens everything — a tiny amount transforms a bowl" },
      { label: "Orange zest", note: "Sweet, fragrant and rich in flavonoids that support skin health" },
    ],
  },
];

type Preset = { name: string; pick: Partial<Record<string, string[]>> };

const PRESETS: Preset[] = [
  { name: "Berry Glow Bowl", pick: { base: ["Greek yoghurt"], fruit: ["Mixed berries", "Pomegranate seeds"], crunch: ["Homemade granola", "Pumpkin seeds"], drizzle: ["Honey"], boost: ["Cinnamon"] } },
  { name: "Tropical Skin Glow", pick: { base: ["Greek yoghurt"], fruit: ["Mango chunks", "Pineapple chunks", "Kiwi"], crunch: ["Coconut flakes", "Cashews"], drizzle: ["Honey"], boost: ["Lemon zest"] } },
  { name: "Chocolate Berry Fix", pick: { base: ["Greek yoghurt"], fruit: ["Raspberries", "Cherries"], crunch: ["Cacao nibs", "Walnuts"], drizzle: ["Melted dark chocolate"], boost: ["Cocoa powder"] } },
  { name: "Peanut Butter Banana", pick: { base: ["Greek yoghurt"], fruit: ["Banana", "Strawberries"], crunch: ["Homemade granola", "Chia seeds"], drizzle: ["Peanut butter"], boost: ["Cinnamon"] } },
  { name: "Skyr Power Bowl", pick: { base: ["Skyr"], fruit: ["Blueberries", "Kiwi", "Goji berries"], crunch: ["Hemp seeds", "Pumpkin seeds", "Crushed almonds"], drizzle: ["Honey"], boost: ["Matcha powder"] } },
  { name: "Peach & Almond Glow", pick: { base: ["Greek yoghurt"], fruit: ["Peach", "Raspberries"], crunch: ["Crushed almonds", "Flaxseed"], drizzle: ["Almond butter"], boost: ["Vanilla extract"] } },
  { name: "Fig & Walnut Glow", pick: { base: ["Skyr"], fruit: ["Fig slices", "Blackberries"], crunch: ["Walnuts", "Sesame seeds"], drizzle: ["Honey"], boost: ["Orange zest"] } },
  { name: "Dairy Free Mango Bowl", pick: { base: ["Coconut yoghurt"], fruit: ["Mango chunks", "Passion fruit", "Kiwi"], crunch: ["Coconut flakes", "Macadamia nuts"], drizzle: ["Maple syrup"], boost: ["Ginger"] } },
];

type Picks = Record<string, string[]>;

function YoghurtBowlBuilder() {
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

  return (
    <AppShell>
      {/* Hero — pure white */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-secondary" />
            <p className="text-[9px] uppercase tracking-[0.32em] text-secondary">Build your breakfast</p>
            <div className="h-px w-6 bg-secondary" />
          </div>
          <p className="font-script text-2xl text-secondary -mb-1">Love Coylah</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light leading-tight text-foreground mb-3">
            Yoghurt Bowl Builder
          </h1>
          <div className="w-8 h-px bg-secondary mb-4" />
          <p className="max-w-xl text-sm text-muted-foreground leading-relaxed font-light">
            Five steps to a collagen-supporting breakfast bowl. Base, Activate, Fortify, Protect, Boost — each layer doing something specific for your skin.
          </p>
          {stepsComplete > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <div className="flex gap-1">
                {STEPS.map((s) => (
                  <div key={s.key} className={`h-1.5 w-8 rounded-full transition-all ${(picks[s.key]?.length ?? 0) > 0 ? "bg-secondary" : "bg-border"}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{stepsComplete} of 5 done</span>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4 min-w-0">

          {/* Presets */}
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-serif text-xl mb-1">Start from a preset</h2>
            <p className="text-sm text-muted-foreground mb-3">Tap one to pre-fill your bowl, then tweak to taste.</p>
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
                            "rounded-full border px-3 py-1.5 text-sm transition-all text-left",
                            active ? "border-secondary bg-secondary text-secondary-foreground font-medium" : "border-border bg-background text-foreground/70 hover:border-secondary/50 hover:bg-secondary/5"
                          )}
                        >
                          {active && <Check className="mr-1 inline h-3 w-3" />}
                          {opt.label}
                        </button>
                        {opt.note && active && (
                          <p className="px-3 text-[11px] text-muted-foreground italic max-w-xs">{opt.note}</p>
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
              <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary/10 shrink-0 text-lg">🥣</span>
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
                          <li key={label} className="flex items-center justify-between gap-2">
                            <span className="text-sm">{label}</span>
                            <button onClick={() => togglePick(s.key, label)} className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-muted" aria-label="Remove">
                              <X className="h-3 w-3" />
                            </button>
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
