import { Link } from "@tanstack/react-router";
import { Heart, BookOpen, CalendarDays, ShoppingBasket, Salad } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="group flex flex-col leading-none">
          <span className="font-script text-base text-secondary/80 -mb-1">Love Coylah</span>
          <span className="font-serif text-xl tracking-tight text-foreground">
            The Collagen Kitchen
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/" icon={<BookOpen className="h-4 w-4" />} label="Cookbook" />
          <NavLink to="/build/glow-bowl" icon={<Salad className="h-4 w-4" />} label="Build" />
          <NavLink to="/favourites" icon={<Heart className="h-4 w-4" />} label="Saved" />
          <NavLink to="/planner" icon={<CalendarDays className="h-4 w-4" />} label="Planner" />
          <NavLink
            to="/shopping"
            icon={<ShoppingBasket className="h-4 w-4" />}
            label="Shopping"
          />
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-border/60 py-10 text-center">
      <p className="font-script text-2xl text-secondary/80">Love Coylah</p>
      <p className="mt-1 font-serif text-sm tracking-[0.2em] uppercase text-muted-foreground">
        Age Slow · Reclaim Your Glow
      </p>
      <p className="mt-3 text-xs text-muted-foreground/80">
        The Collagen Kitchen · Skin-food recipes from the inside out.
      </p>
    </footer>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/" }}
      className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
      activeProps={{
        className:
          "inline-flex items-center gap-1.5 rounded-md px-3 py-2 bg-accent text-accent-foreground font-medium",
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
