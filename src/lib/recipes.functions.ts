import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Recipe } from "./recipe-types";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const listRecipes = createServerFn({ method: "GET" }).handler(
  async (): Promise<Recipe[]> => {
    const { data, error } = await publicClient()
      .from("recipes")
      .select("*")
      .order("name");
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as Recipe[];
  },
);

export const getRecipeBySlug = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }): Promise<Recipe | null> => {
    const { data: row, error } = await publicClient()
      .from("recipes")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return ((row as unknown) as Recipe | null) ?? null;
  });

const RecipeImportSchema = z.object({
  name: z.string(),
  meal_type: z.string(),
  tags: z.array(z.string()).default([]),
  servings: z.number().default(1),
  prep_min: z.number().default(0),
  cook_min: z.number().default(0),
  ingredients: z.array(
    z.object({
      qty: z.string().default(""),
      unit: z.string().default(""),
      item: z.string(),
      category: z.string().default("other"),
    }),
  ),
  method: z.array(z.string()),
  notes: z.string().optional().nullable(),
  collagen_boost: z.boolean().default(false),
  collagen_tip: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const importRecipes = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ recipes: z.array(RecipeImportSchema) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const rows = data.recipes.map((r) => ({
      name: r.name,
      slug: slugify(r.name),
      meal_type: r.meal_type,
      tags: r.tags,
      servings: r.servings,
      prep_min: r.prep_min,
      cook_min: r.cook_min,
      ingredients: r.ingredients,
      method: r.method,
      notes: r.notes ?? null,
      collagen_boost: r.collagen_boost,
      collagen_tip: r.collagen_tip ?? null,
      image_url: r.image_url ?? null,
    }));
    const { error, data: out } = await supabaseAdmin
      .from("recipes")
      .upsert(rows, { onConflict: "slug" })
      .select("id");
    if (error) throw new Error(error.message);
    return { imported: out?.length ?? 0 };
  });
