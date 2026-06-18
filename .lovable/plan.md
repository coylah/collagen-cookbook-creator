# Restore the Supabase service role key

## Good news first
Your database is safe. Your `recipes` table and all 47 rows are untouched — this is purely an environment-variable / connection issue, not a data issue. Nothing I propose here deletes, recreates, or overwrites any table.

## Why you can't see the key in Cloud → Secrets
`SUPABASE_SERVICE_ROLE_KEY` is a **managed secret** — it's auto-provisioned by Lovable Cloud and injected into your server runtime. The Cloud → Secrets panel only lists **user-added** secrets (like `LOVABLE_API_KEY`), so managed ones never show up there even when they're present and working. So "I don't see it in the UI" does **not** mean it's missing from the backend.

On the backend side, the key *is* registered for this project (I can see `SUPABASE_SERVICE_ROLE_KEY` in the project's secret list). The error you're hitting means the **running dev server process** didn't pick it up — most likely the backend went to sleep / the dev server cached an old env snapshot from before the key was provisioned.

## What to do (no credits, no code changes)

Try these in order, stop as soon as the preview loads:

1. **Hard refresh the preview** (Cmd/Ctrl + Shift + R). Sometimes the previous error page is just cached.
2. **Restart the backend**: Cloud → Overview → look for a Restart / Status control, click Restart. Wait ~30s.
3. **Reload the editor tab** entirely (full browser refresh of lovable.dev). This re-spawns the dev server with a fresh env snapshot.
4. If still broken, reply "restart" and I'll trigger the backend restart + dev server restart from my side — that's a zero-credit action, no code edits.

## What I will NOT do
- Not create a new Supabase project or database.
- Not run any migration.
- Not modify `recipes` or any other table.
- Not edit application code to "work around" the missing key.

## If steps 1–3 don't fix it
The remaining root cause is almost always the dev-server env cache. At that point the fix is a tooling-side restart (step 4), still no code changes and no Try-to-Fix credits.

Want me to proceed with the backend + dev server restart?