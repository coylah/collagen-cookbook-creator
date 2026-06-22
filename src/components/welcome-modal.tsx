import { useState, useEffect } from "react";
import { BookOpen, Heart, CalendarDays, ShoppingBasket, Salad, X } from "lucide-react";

const STORAGE_KEY = "ck.welcomed";

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setOpen(true);
  }, []);

  function close() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  const steps = [
    {
      icon: <BookOpen className="h-8 w-8 text-secondary" />,
      title: "Your cookbook",
      body: "Every single recipe in here is real food that actively feeds your glow — collagen, vitamin C, healthy fats, antioxidants. Browse by meal type, search by ingredient, or just have a nose around. There's a lot to love.\n\nWhen you're cooking, tap each ingredient or step to tick it off as you go. No more losing your place halfway through.",
    },
    {
      icon: <Heart className="h-8 w-8 text-secondary" />,
      title: "Save what you love",
      body: "See a recipe that's calling your name? Tap the little heart and it saves straight to your Saved tab. It'll be waiting for you every time you come back — no scrolling, no searching, just your favourites ready to go.",
    },
    {
      icon: <CalendarDays className="h-8 w-8 text-secondary" />,
      title: "Plan your week",
      body: "Add recipes to your weekly planner — breakfast, lunch, dinner, snacks — and your shopping list builds itself automatically. Tap any slot to add a meal. Tap the little x to remove it. Job done.\n\nNo more staring into the fridge wondering what to make.",
    },
    {
      icon: <ShoppingBasket className="h-8 w-8 text-secondary" />,
      title: "Your shopping list",
      body: "Everything from your planner comes together in one clean list, grouped by category and ready to shop. Tap items to tick them off as you go, or tap \"I have\" to move them out of the way.\n\nNeed to add anything else for the week? Type it straight into the list — it becomes a checkbox item just like everything else.",
    },
    {
      icon: <Salad className="h-8 w-8 text-secondary" />,
      title: "Build a Glow Bowl",
      body: "This one's a proper treat. Tap your way through six steps — base, protein, colour, fat, crunch, dressing — and you've built yourself a collagen-supporting lunch from whatever's in your fridge. Ten ready-made combinations to start from, or go completely your own way.\n\nAdd your bowl straight to the shopping list in one tap.",
    },
  ];

  const current = steps[step];
  const isFirst = step === 0;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={close}
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-xl">

        <button
          onClick={close}
          className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-accent"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Welcome header — only on first step */}
        {isFirst && (
          <div className="border-b border-border px-8 pt-8 pb-5 text-center">
            <p className="font-script text-2xl text-secondary">Love Coylah</p>
            <h2 className="mt-1 font-serif text-2xl font-light">
              Welcome, my lovely.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              You've just unlocked The Collagen Kitchen — your personal skin-food cookbook, meal planner and weekly shopping list, all in one place and all built around your skin.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Let me show you around. Tap through — I promise it's quick.
            </p>
          </div>
        )}

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center pt-5 px-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-secondary"
                  : i < step
                  ? "w-1.5 bg-secondary/40"
                  : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="px-8 py-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary/10">
              {current.icon}
            </div>
          </div>
          <h3 className="font-serif text-xl mb-3">{current.title}</h3>
          <div className="text-sm text-muted-foreground leading-relaxed text-left space-y-3">
            {current.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 pb-6">
          {!isFirst && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:bg-accent transition-colors"
            >
              Back
            </button>
          )}
          {!isLast ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 rounded-lg bg-secondary py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={close}
              className="flex-1 rounded-lg bg-secondary py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              I'm ready — show me the recipes! →
            </button>
          )}
        </div>

        {/* Skip */}
        {!isLast && (
          <div className="pb-5 text-center">
            <button
              onClick={close}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              Skip intro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
