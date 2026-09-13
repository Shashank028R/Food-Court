# Phase 2 — Full Menu Experience

**Goal:** the `/menu` page where customers can browse everything, filter by
category, search, and open a full detail view of any dish.

Prerequisite: Phase 1 is done and its Definition of Done checklist is
checked off.

---

## What this phase delivers

1. **Expanded API:** extend `GET /api/food-items` to support `?category=`
   (slug) and `?search=` (matches name/description, case-insensitive) query
   params, plus `?veg=true`, `?spiceLevel=`. Add `GET /api/food-items/:slug`
   for a single item's full detail.
2. **`/menu` React route:**
   - Sticky category filter bar (All + each category fetched from
     `/api/categories`), visually matching the design system (not default
     browser-style tabs).
   - Search input filtering by name/description — call the API with
     `?search=` (debounced) rather than filtering only client-side, so it
     stays correct as the catalog grows.
   - Optional secondary filters: veg/non-veg toggle, spice level.
   - Responsive grid of food item cards (image, name, short description,
     price, veg/non-veg dot, popular/special badge if applicable).
   - Empty state ("No dishes match your filters") styled on-brand.
   - Category tiles clicked on the landing page should deep-link here with
     the right filter pre-applied via a URL query param (e.g.
     `/menu?category=desserts`), read with React Router's `useSearchParams`.
3. **Item detail view:** either a modal/drawer or a dedicated
   `/menu/:slug` route (Antigravity's choice, but be consistent) showing:
   - Larger image, full description, price, veg/non-veg, spice level.
   - Quantity selector and an "Add to Cart" / "Add to Order" button. If
     Phase 4 (accounts/cart) hasn't been built yet, this button can show a
     toast like "Sign in to start an order" for now — wire it fully once
     Phase 4 lands (note that in code with a clear TODO/comment).
4. Loading and empty states styled consistently, not default browser/React
   fallbacks.
5. Keep using the same data-fetching pattern from Phase 1 (fetch from the
   Express API) — nothing hardcoded.

## Explicit constraints for this phase

- Reuse the card, badge, and button components already established in
  Phase 1 rather than creating parallel new styles for the same concepts.
- Don't introduce a new color or font outside the palette/system in
  `00-MASTER-BRIEF.md`.
- Cart/ordering logic itself belongs to Phase 4 — this phase just needs the
  "Add to Cart" UI to exist and be visually complete, even if not fully wired
  to persistent state yet.

---

## PROMPT TO PASTE INTO ANTIGRAVITY

```
Read 00-MASTER-BRIEF.md and 02-PHASE-2-FULL-MENU-EXPERIENCE.md in this
project folder. Confirm Phase 1 (Express + MongoDB API, landing page) is
already in place before continuing — check the existing /client and /server
code rather than re-scaffolding anything.

Now execute Phase 2:

1. Extend GET /api/food-items on the server to support ?category= (slug),
   ?search= (case-insensitive match on name/description), ?veg=true, and
   ?spiceLevel= query params. Add GET /api/food-items/:slug for a single
   item's full detail.
2. Build the /menu route in the React client: a sticky, on-brand category
   filter bar (All plus every category from /api/categories), a debounced
   live search input calling the API's ?search= param, and optional
   veg/non-veg and spice-level filters.
3. Support deep-linking via a ?category= URL query param (read with
   useSearchParams) so the "Browse by Category" tiles on the landing page
   link here pre-filtered.
4. Render the filtered results as a responsive grid of food item cards
   reusing the card component style from Phase 1. Show popular/special
   badges where applicable.
5. Build a styled, on-brand empty state for when no items match the
   filters.
6. Build an item detail view (your choice of modal/drawer or a
   /menu/:slug route, but be consistent) showing the full description,
   price, spice level, veg/non-veg, a quantity selector, and an "Add to
   Cart" button. If persistent cart/auth isn't built yet, make the button
   show a toast ("Sign in to start an order") and leave a clear TODO
   comment for Phase 4 to wire it up fully.
7. Keep everything responsive and consistent with the existing design
   system — no new colors/fonts, reuse existing components where they fit.
8. Confirm `npm run dev` still runs both client and server cleanly, and the
   landing page's category links now correctly land on a pre-filtered menu
   page. Summarize what was built.
```

---

## Definition of Done

- [ ] `/menu` shows all seeded items, filterable by category and searchable
      by name via the API.
- [ ] Category tiles from the landing page correctly deep-link to a
      pre-filtered `/menu` view.
- [ ] Clicking/opening any item shows a complete detail view.
- [ ] Empty-filter state is styled on-brand, not a raw browser message.
- [ ] No new colors/fonts introduced outside the master brief's system.
- [ ] `npm run dev` still runs cleanly; Phase 1 landing page still works.
