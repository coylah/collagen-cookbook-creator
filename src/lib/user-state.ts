import { useLocalStorage } from "@/hooks/use-local-storage";

export function useFavourites() {
  const [favs, setFavs] = useLocalStorage<string[]>("ck.favs", []);
  const toggle = (slug: string) =>
    setFavs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  const isFav = (slug: string) => favs.includes(slug);
  return { favs, toggle, isFav };
}

export type Slot = "breakfast" | "lunch" | "dinner" | "snack";
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const SLOTS: Slot[] = ["breakfast", "lunch", "dinner", "snack"];

export type PlanEntry = {
  slug: string;
  servings: number;
};

export type MealPlan = Record<string, PlanEntry | null>; // key = `${day}-${slot}`

export function planKey(day: string, slot: Slot) {
  return `${day}-${slot}`;
}

export function useMealPlan() {
  const [plan, setPlan] = useLocalStorage<MealPlan>("ck.plan", {});
  const [people, setPeople] = useLocalStorage<number>("ck.people", 2);
  const set = (day: string, slot: Slot, entry: PlanEntry | null) =>
    setPlan((p) => ({ ...p, [planKey(day, slot)]: entry }));
  const clear = () => setPlan({});
  return { plan, setPlan, set, clear, people, setPeople };
}
