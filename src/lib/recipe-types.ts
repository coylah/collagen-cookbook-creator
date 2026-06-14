export type Ingredient = {
  qty: string;
  unit: string;
  item: string;
  category: string;
};

export type Recipe = {
  id: string;
  name: string;
  slug: string;
  meal_type: string;
  tags: string[];
  servings: number;
  prep_min: number;
  cook_min: number;
  ingredients: Ingredient[];
  method: string[];
  notes: string | null;
  collagen_boost: boolean;
  collagen_tip: string | null;
  image_url: string | null;
};
