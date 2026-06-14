# Collagen Kitchen — Test Build Plan

Yes, exactly right. We build the whole app once, seed it with your 5 test recipes, you click around and break it, then I drop in the full JSON in one go (no rebuild, just data).

## What gets built (one pass)

**Design**
- Soft, warm, feminine — cream/sand background, sage + terracotta accents, serif headings (Fraunces) + clean body (Inter)
- Photo placeholder = gradient block + meal-type icon (so empty photos still look intentional)

**Pages**
1. **Home / Cookbook** — recipe grid, search bar, filter bar
   - Filters: meal type · tag (high-protein, low-carb, quick…) · max total time · collagen-boost toggle · ingredient search ("what's in my fridge")
   - Sort: name, time, newest
2. **Recipe detail** — hero, meta (prep/cook/servings), serving scaler (±, scales all qty), ingredients (checkable), method (checkable steps), notes, collagen tip callout, "♥ Save", "+ Add to meal plan"
3. **Favourites** — saved recipes (localStorage)
4. **Meal Planner** — Mon–Sun × Breakfast/Lunch/Dinner/Snack grid, drag-or-tap to assign, "people cooking for" number
5. **Shopping List** — auto-generated from the week's plan, grouped by category (produce / protein / dairy / pantry), aggregated quantities where units match, checkable, printable
6. **Admin / Import** (hidden link) — paste JSON → preview → import. This is how I load your test 5 now and your full set later.

**Data**
- Lovable Cloud (Postgres) for recipes
- localStorage for favourites + meal plan + servings (no login needed)

**Schema (one table)**
```
recipes
  id · name · slug · meal_type · tags[] · servings · prep_min · cook_min
  ingredients (jsonb: [{qty, unit, item, category}])
  method (jsonb: string[])
  notes · collagen_boost · collagen_tip · image_url · created_at
```

## Order of work

1. Enable Lovable Cloud + create `recipes` table
2. Build design system + layout shell + nav
3. Cookbook page (grid + filters + search)
4. Recipe detail (scaler + check-off)
5. Favourites
6. Meal planner
7. Shopping list (aggregation logic)
8. Admin import page
9. Import your 5 test recipes — we test everything end-to-end
10. You send full JSON → I paste into admin → done

## What you'll test on the 5 recipes

- Cards render, photos placeholder looks good
- Filter by breakfast / high-protein / quick / collagen-boost all return correct results
- Ingredient search ("eggs") finds the right recipes
- Open recipe → bump servings 1 → 4, all quantities scale
- Save 2 favourites, refresh page, still there
- Drop recipes into Mon breakfast, Tue lunch etc.
- Shopping list aggregates (e.g. eggs from two recipes combine)
- Print shopping list looks clean

## Not in this build (on purpose, saves credits)

- User accounts / login
- AI photo generation
- Nutrition calculation
- Sharing / social

## Approve & I'll start

Reply "go" and I'll build it, seed your 5 recipes, and hand you a preview link to break.