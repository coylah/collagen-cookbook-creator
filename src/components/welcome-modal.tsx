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
      title: "Browse the cookbook",
      body: "Every recipe is built around ingredients that actively support your skin. Filter by meal type, search by ingredient, or just scroll and explore.",
    },
    {
      icon: <Heart className="h-8 w-8 text-secondary" />,
      title: "Save your favourites",
      body: "Tap the heart on any recipe to save it. Find everything you've saved under the Saved tab whenever you need it.",
    },
    {
      icon: <CalendarDays className="h-8 w-8 text-secondary" />,
      title: "Plan your week",
      body: "Add recipes to your weekly planner — breakfast, lunch, dinner and snacks. Your shopping list builds automatically from whatever you plan.",
    },
    {
      icon: <ShoppingBasket className="h-8 w-8 text-secondary" />,
      title: "Shop in one go",
      body: "Your shopping list groups all your ingredients by category, removes duplicates, and lets you add anything else you need that week too.",
    },
    {
      icon: <Salad className="h-8 w-8 text-secondary" />,
      title: "Build a Glow Bowl",
      body: "Not sure what to have for lunch? Build your own collagen-supporting bowl from whatever's in the fridge — pick a base, protein, veg, fat, crunch and dressing.",
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-xl">

        {/* Close */}
        <button
          onClick={close}
          className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center pt-6 px-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step
                  ? "w-6 bg-secondary"
                  : i < step
                  ? "w-1.5 bg-secondary/40"
                  : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-8 py-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary/10">
              {current.icon}
            </div>
          </div>
          <h2 className="font-serif text-2xl mb-3">{current.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {current.body}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-8 pb-8">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:bg-accent"
            >
              Back
            </button>
          )}
          {!isLast ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 rounded-lg bg-secondary py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
            >
              Next
            </button>
          ) : (
            <button
              onClick={close}
              className="flex-1 rounded-lg bg-secondary py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
            >
              Let's get cooking →
            </button>
          )}
        </div>

        {/* Skip */}
        {!isLast && (
          <div className="pb-6 text-center">
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
