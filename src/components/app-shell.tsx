import { Link } from "@tanstack/react-router";
import { Heart, BookOpen, CalendarDays, ShoppingBasket, Salad, HelpCircle } from "lucide-react";
import type { ReactNode } from "react";
import { WelcomeModal } from "@/components/welcome-modal";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <WelcomeModal />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  function openWelcome() {
    localStorage.removeItem("ck.welcomed");
    window.location.reload();
  }

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-background/98 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex flex-col leading-none shrink-0">
          <span className="font-script text-lg text-secondary -mb-1">Love Coylah</span>
          <span className="font-serif text-xl font-light tracking-tight text-foreground">
            The Collagen Kitchen
          </span>
        </Link>
        <nav className="flex items-center gap-0.5">
          <NavLink to="/" icon={<BookOpen className="h-4 w-4" />} label="Recipes" />
          <NavLink to="/build/glow-bowl" icon={<Salad className="h-4 w-4" />} label="Build" />
          <NavLink to="/favourites" icon={<Heart className="h-4 w-4" />} label="Saved" />
          <NavLink to="/planner" icon={<CalendarDays className="h-4 w-4" />} label="Planner" />
          <NavLink to="/shopping" icon={<ShoppingBasket className="h-4 w-4" />} label="Shopping" />
          <button
            onClick={openWelcome}
            className="inline-flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="How to use this app"
            aria-label="How to use this app"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-[9px] uppercase tracking-wide">Help</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="no-print mt-20 border-t border-border py-12 text-center bg-[#FAFAF8]">
      <p className="font-script text-3xl text-secondary">Love Coylah</p>
      <p className="mt-1 font-serif text-sm tracking-[0.2em] uppercase text-muted-foreground">
        Age Slow · Reclaim Your Glow
      </p>
      <p className="mt-3 text-xs text-muted-foreground/60 max-w-md mx-auto">
        The Collagen Kitchen · Skin-food recipes from the inside out.
      </p>
      <p className="mt-2 text-xs text-muted-foreground/40 max-w-md mx-auto px-4">
        Coylah is not a doctor, dermatologist or registered nutritionist. Always speak to your GP before making changes to your diet or skincare.
      </p>
    </footer>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="inline-flex flex-col items-center gap-0.5 rounded-md px-2.5 py-1.5 text-foreground/50 transition-colors hover:bg-accent hover:text-foreground"
      activeProps={{
        className:
          "inline-flex flex-col items-center gap-0.5 rounded-md px-2.5 py-1.5 bg-secondary/10 text-secondary border border-secondary/20",
      }}
    >
      {icon}
      <span className="text-[9px] uppercase tracking-wide">{label}</span>
    </Link>
  );
}
