# Phase 1 — Foundation & Landing Page

**Goal:** a real, running, good-looking website with a public landing page,
backed by a real Express + MongoDB API. No admin, no login yet — just the
polished front door of the restaurant.

Prerequisite: Antigravity has read `00-MASTER-BRIEF.md` in this same folder.

---

## What this phase delivers

1. **Monorepo scaffold:** `/client` (Vite + React + TypeScript + Tailwind)
   and `/server` (Node + Express + Mongoose), plus a root `package.json`
   that runs both together in dev with one command (`concurrently`).
2. **MongoDB models:** Category, FoodItem, User, Order, SiteSettings, as
   described in `00-MASTER-BRIEF.md`, connected via Mongoose to
   `MONGODB_URI` from `.env`.
3. **Seed script** creating realistic sample data: at least 4 categories,
   16+ food items spread across them, 3 marked `isPopular`, 2 marked
   `isTodaysSpecial`, and a SiteSettings singleton (siteName "Food Court",
   5 hero image URLs). Use real-sounding dish names/descriptions and real
   Unsplash image URLs — not lorem ipsum, not "Item 1".
4. **Read-only API endpoints** needed for the landing page:
   - `GET /api/categories`
   - `GET /api/food-items` (support `?popular=true`, `?special=true` query
     filters)
   - `GET /api/settings`
5. **React client landing page (`/`)** with these sections, in this order:
   - **Header/nav:** logo wordmark "Food Court" in the display serif font
     (pulled from `/api/settings`, falling back to text if no logo image),
     nav links (Home, Menu, Login/Account placeholder), mobile hamburger
     menu.
   - **Hero section:** full-bleed sliding poster carousel of food images
     from `SiteSettings.heroImages`, auto-advancing every ~5s with manual
     prev/next controls and dot indicators, a short premium headline +
     subheadline overlaid, and a primary CTA button ("View Full Menu").
   - **Today's Special:** visually distinct section (gold accent)
     highlighting the items where `isTodaysSpecial` is true, larger imagery
     and description.
   - **Most Popular:** a grid/carousel of items where `isPopular` is true,
     each as a card with image, name, short description, price, veg/non-veg
     indicator, spice level if set.
   - **Browse by Category:** a row of category tiles (image + name)
     linking to the (not-yet-built) full menu filtered to that category.
   - **A little bit of everything else:** a compact preview grid of a few
     more menu items with a "View Full Menu" CTA at the end.
   - **Footer:** restaurant name, short tagline, contact/location
     placeholder info, simple link list, copyright.
6. Fully responsive (mobile, tablet, desktop) with the hero slider working
   with touch swipe on mobile.
7. All content is fetched live from the Express API — nothing hardcoded in
   React components — because Phase 3 (admin) will edit this same data and
   it must reflect live here.

## Explicit constraints for this phase

- Do NOT build login/signup yet — nav shows a plain "Login" link that can
  route to a placeholder page for now.
- Do NOT build the admin panel yet.
- DO follow the color palette, type system, and "don't look AI-generated"
  rules in `00-MASTER-BRIEF.md` exactly.
- Do NOT store any uploaded images on local disk — this phase only needs
  direct Unsplash URLs in the seed data, so Cloudinary wiring isn't required
  until Phase 3 (admin uploads), but keep that in mind for the models.

---

## PROMPT TO PASTE INTO ANTIGRAVITY

```
Read 00-MASTER-BRIEF.md in this project folder fully before starting — it
defines the design system, MERN tech stack, monorepo folder structure, and
data model. Follow it exactly.

Now execute Phase 1 as described in 01-PHASE-1-FOUNDATION-AND-LANDING.md
in this same folder:

1. Scaffold the monorepo exactly as laid out in the master brief's folder
   structure section: a /client app (Vite + React + TypeScript + Tailwind
   CSS) and a /server app (Node + Express + Mongoose), plus a root-level
   package.json with a "dev" script that runs both concurrently using the
   `concurrently` package. Create a .env.example in /server listing
   MONGODB_URI, JWT_SECRET, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
   CLOUDINARY_API_SECRET, PORT, CLIENT_URL (leave real .env for me to fill
   in, and make sure .env is gitignored).
2. Configure Tailwind theme tokens in /client for the exact color palette
   and Google Fonts (Fraunces for display/headings, Inter for body) from
   the master brief.
3. Create Mongoose models in /server/src/models for Category, FoodItem,
   User, Order, and SiteSettings exactly as described in the master brief's
   data model section, with a Mongoose connection helper in
   /server/src/config/db.js.
4. Write a seed script (/server/src/seed.js, runnable via an npm script)
   that creates a SiteSettings singleton (siteName "Food Court", 5 hero
   image URLs), at least 4 categories, and at least 16 food items with
   realistic names, short appetizing descriptions, prices, veg/non-veg
   flags, spice levels, and real Unsplash image URLs that plausibly match
   each dish. Mark 3 items isPopular=true and 2 items isTodaysSpecial=true.
5. Build the read-only REST endpoints: GET /api/categories, GET
   /api/food-items (supporting ?popular=true and ?special=true query
   filters), and GET /api/settings.
6. Build the React landing page exactly as specified in
   01-PHASE-1-FOUNDATION-AND-LANDING.md: header/nav (logo from
   /api/settings, falling back to text), sliding hero with real poster
   images and controls, Today's Special section, Most Popular section,
   Browse by Category section, a preview grid of more items with a "View
   Full Menu" CTA, and a footer. Fetch all content from the Express API —
   nothing hardcoded.
7. Make everything fully responsive and keyboard/screen-reader reasonable.
8. Follow the "non-negotiable design rules" in the master brief strictly —
   no glassmorphism, no generic AI-startup look, no lorem ipsum in the
   final rendered site.
9. Confirm `npm run dev` from the project root starts both the Express
   server and the Vite client cleanly with no errors, confirm the seed
   script runs successfully against MongoDB, and give me a short summary of
   what was built and exactly how to run it (including how/where to put my
   real MongoDB URI).

Do not build login/signup or the admin panel yet — those are later phases.
```

---

## Definition of Done (check before moving to Phase 2)

- [ ] `npm run dev` from the project root starts both client and server
      with zero errors.
- [ ] Seed script successfully populates MongoDB with realistic data.
- [ ] Landing page shows a working, auto-advancing hero slider with visible
      controls, using real food images pulled from the API.
- [ ] Today's Special and Most Popular sections show real seeded data, not
      placeholders.
- [ ] Category tiles are present and visually distinct from item cards.
- [ ] Site looks premium and specific — not like a generic template. Fonts
      are Fraunces (headings) + Inter (body), palette matches the brief.
- [ ] Fully responsive at mobile width (test at ~375px).
- [ ] Admin and login are NOT yet functional (expected at this stage).
