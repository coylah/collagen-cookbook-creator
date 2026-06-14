
# Love Coylah · The Collagen Kitchen — Plan v3 (locked)

Your answers are baked in. Ready to build on your "go".

---

## Decisions locked

- **Glow Bowl → shopping:** Pattern A — build your bowl, tap "Add bowl to shopping list", done.
- **Signature font:** elegant script — I'll use **Pinyon Script** (delicate, editorial) for the "Love Coylah" signature. If it feels too thin in preview I'll swap to Allura.
- **Collagen boost filter:** keep, but rename to **"Super Boost"** and reserve only for the top collagen-density recipes (bone broth, salmon, slow-cooked beef etc.). I'll re-flag the database so only ~5–8 recipes carry it.
- **Wording:** no "pantry" anywhere. Replace with **"Cupboard staples"** (shopping list section) and **"cupboard"** as the ingredient category label.

---

## Build order

### 1. Data
- Import the 15 new lunches from your attached JSON.
- Re-flag `collagen_boost = true` on only the genuine top-collagen recipes; clear it on the rest.
- Rename the ingredient `category: "pantry"` → `"cupboard"` across all recipes.

### 2. Cookbook ordering
- Group by meal type (Breakfast → Lunch → Dinner → Snack → Dessert), alphabetical within each group, with soft section headers.

### 3. Rebrand (Love Coylah premium editorial)
- Palette: off-white `#FBF7F4`, charcoal `#1F1A1A`, blush `#E8C7C0`, rose `#C9485B`, occasional deep navy `#1B2240`. Sage retired.
- Fonts: Fraunces (display), Inter (body), **Pinyon Script** (signature only).
- Header: small "Love Coylah" script signature, "The Collagen Kitchen" wordmark, tagline "Age Slow · Reclaim Your Glow".
- Footer: signature + tagline.
- Homepage hero: your exact copy (BEAUTY STARTS IN THE KITCHEN / The Collagen Kitchen / sub / supporting line).
- Recipe cards: slimmer image area, soft blush gradient + thin line icon placeholder (no cartoon emoji).
- Recipe page: "WHY YOUR SKIN WILL LOVE THIS" + **Coylah's Tips** (script flourish on "Coylah's").
- Super Boost filter chip restyled in rose.

### 4. Overnight Beauty Oats — Build Your Beauty Oats
- One recipe page, base recipe stays at top.
- Below: "BUILD YOUR BEAUTY OATS" section with your intro, 5 topping categories as chip groups, frozen fruit tip callout, 8 flavour combo tiles.

### 5. Build Your Own Glow Bowl (new page under Lunches)
- 6-step builder (Base → Protein → Colour → Fats → Crunch → Dressing).
- Sticky "Your bowl" summary panel.
- 10 ready-made bowl preset tiles at the top (tap to pre-fill, then tweak).
- "Add bowl to shopping list" button.

### 6. Shopping list intelligence
- **Quantity logic:**
  - Show exact quantity for: protein, produce in discrete units (peppers, lemons, avocados, sweet potatoes), and items measured in g/kg/ml/L above threshold.
  - Show as cupboard staple (no quantity) for: oils, vinegars, spices, herbs, seeds, condiments, tsp/tbsp items.
  - Produce rounds up to whole units (½ + ½ tomato = 1; lone ½ cauliflower = 1).
  - Handfuls / pinches → cupboard staple style.
- **"I have this" toggle:** each item gets a second action that moves it to a collapsed **"Already in my cupboard"** section at the bottom. Remembered in local storage. Reset button clears it.
- Section headings reworded: "Cupboard staples" replaces any "Pantry" label.

---

## Estimated passes
~1 small (data + ordering), ~1 medium (rebrand), ~1 medium (two Build-Your-Own pages), ~1 small (shopping logic). I'll batch aggressively to keep credits low.

Reply **"go"** and I'll start.
