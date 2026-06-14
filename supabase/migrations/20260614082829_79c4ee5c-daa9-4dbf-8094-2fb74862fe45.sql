
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  meal_type TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  servings INTEGER NOT NULL DEFAULT 1,
  prep_min INTEGER NOT NULL DEFAULT 0,
  cook_min INTEGER NOT NULL DEFAULT 0,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  method JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  collagen_boost BOOLEAN NOT NULL DEFAULT false,
  collagen_tip TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.recipes TO anon;
GRANT SELECT ON public.recipes TO authenticated;
GRANT ALL ON public.recipes TO service_role;

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipes are publicly readable"
ON public.recipes FOR SELECT
USING (true);

CREATE INDEX recipes_meal_type_idx ON public.recipes(meal_type);
CREATE INDEX recipes_tags_idx ON public.recipes USING gin(tags);
