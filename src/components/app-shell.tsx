import { Link } from "@tanstack/react-router";
import { Heart, BookOpen, CalendarDays, ShoppingBasket } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="no-print mt-16 border-t py-8 text-center text-sm text-muted-foreground">
        <p>The Collagen Kitchen · Eat well, glow well.</p>
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header className="no-print sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="font-serif text-2xl tracking-tight text-primary">
          The Collagen Kitchen
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/" icon={<BookOpen className="h-4 w-4" />} label="Cookbook" />
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
