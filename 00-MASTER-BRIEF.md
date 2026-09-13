# 00 — MASTER BRIEF (read this before every phase)

This file is the single source of truth for the whole project. Every phase
prompt refers back to it. If Antigravity ever seems to drift — wrong colors,
wrong stack, generic AI look — paste this file again and say "follow this."

---

## 1. What we're building

A restaurant menu website called **Food Court**.

- Public-facing site: browse categories, see popular dishes and today's
  special on the landing page, view the full menu, view item details.
- User accounts: customers can sign up / log in and save their details
  (name, phone, address) so they don't retype them every time they order.
- Admin panel: the restaurant owner can add, edit, and delete food items and
  categories, mark items as "Popular" or "Today's Special", and change the
  site logo and name — all without touching code.

This is a **menu + ordering-flow** site, not a payment gateway integration.
Checkout should end in an order summary / "Place Order" confirmation
(store the order in the database) — do not wire up real payment processing
unless a later phase explicitly asks for it.

---

## 2. Non-negotiable design rules

Read this section twice. The single biggest failure mode for AI-built sites
is looking generic and "AI-made." Avoid that specifically:

**Do:**
- Clean, premium, editorial restaurant-brand feel — think a Michelin-guide
  site or a high-end restaurant's own site, not a SaaS landing page template.
- Generous white space. Confident typography. Let the food photography be
  the hero, not decoration around it.
- A restrained, intentional color palette (below) used consistently.
- Subtle, tasteful motion (slow fades, gentle slide transitions) — nothing
  bouncy or gimmicky.
- Real layout variation between sections (don't repeat the same "card grid"
  pattern for every section on the page).

**Never do:**
- No glassmorphism (no frosted-glass blur panels).
- No neumorphism, no default-purple-gradient hero backgrounds, no generic
  "AI startup" look (rounded blobby gradients, emoji icons, stock hero
  copy like "Delicious food, delivered fast!!" with 3 exclamation marks).
- No default unstyled component-library look left as-is — everything must
  be reskinned to the palette and type system below.
- No lorem-ipsum-looking placeholder copy in the final result — write real,
  specific restaurant copy (dish names, short appetizing descriptions).
- Don't overuse drop shadows, don't overuse rounded-full pill buttons
  everywhere, don't use more than 2 typefaces.

### Color palette

| Role | Color | Hex |
|---|---|---|
| Base background | Warm white | `#FBF9F6` |
| Surface / cards | Pure white | `#FFFFFF` |
| Primary text | Near-black charcoal | `#1C1917` |
| Secondary text | Warm gray | `#6B6560` |
| Primary accent (CTAs, highlights) | Deep terracotta / burnt sienna | `#B3492B` |
| Secondary accent (special badges, highlights) | Antique gold | `#C9A227` |
| Border / hairline | Soft warm gray | `#E7E2DB` |
| Success / confirmation | Muted olive green | `#5B6E3A` |

Use terracotta sparingly and deliberately (primary buttons, active nav state,
price highlights). Gold is reserved for "Today's Special" / "Popular" badges
and premium accents. Everything else stays neutral (white/charcoal/warm gray)
so the palette reads as premium, not busy.

### Typography

- **Display / headings:** `Fraunces` (a warm, editorial serif with personality)
  from Google Fonts. Used for the logo, hero headline, section titles, item
  names on cards.
- **Body / UI text:** `Inter` or `Sora` from Google Fonts for paragraphs,
  nav links, buttons, form fields.
- Headings should be confidently large (don't undersize them to be "safe").
  Use real type scale, e.g. hero H1 ~56-72px desktop, section H2 ~36-40px.
- Logo wordmark "Food Court" is always set in the display serif, with a bit
  of letter-spacing, never in a generic sans-serif logo font.

### Layout language

- Max content width ~1280px, generous side padding.
- Section rhythm: alternate full-bleed image sections with contained
  white-space sections, so the page doesn't feel like a stack of identical
  cards.
- Cards: white surface, 1px hairline border in the border color (not a heavy
  shadow), subtle shadow only on hover, rounded corners kept modest (8–12px,
  not full pill rounding).
- Buttons: rectangular-ish with small radius (6–8px), solid terracotta fill
  for primary, outline/ghost style for secondary. No gradient buttons.

---

## 3. Tech stack — MERN (exact, don't substitute unless a hard blocker)

This is a **monorepo**: one project root containing a `/client` folder and a
`/server` folder, run together in development.

**Backend (`/server`):**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM). Use MongoDB Atlas connection string
  via an environment variable (`MONGODB_URI`) — local `mongod` also fine for
  dev, but write the connection code to just read from `.env` either way.
- **Auth:** JWT (`jsonwebtoken`) + `bcryptjs` for password hashing. Store the
  JWT in an httpOnly cookie (safer than localStorage). Middleware:
  `protect` (must be logged in) and `isAdmin` (must have role ADMIN).
- **Image uploads:** `multer` for handling multipart form uploads, streamed
  directly to **Cloudinary** (`cloudinary` SDK) — do not save images to
  local disk. Store the returned Cloudinary URL on the relevant document.
- **Validation:** basic request validation (e.g. `express-validator` or
  simple manual checks) on every write endpoint.
- **Environment variables (`.env`, never committed):** `MONGODB_URI`,
  `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`, `PORT`, `CLIENT_URL`.
- **API style:** REST, JSON, prefixed `/api/...` (e.g. `/api/food-items`,
  `/api/categories`, `/api/auth`, `/api/orders`, `/api/settings`).

**Frontend (`/client`):**
- **Tooling:** Vite + React + TypeScript.
- **Routing:** React Router v6.
- **Styling:** Tailwind CSS, configured with the palette and fonts above as
  custom theme tokens (don't hardcode hex codes all over components).
- **Data fetching:** a small typed API client wrapper around `fetch` (or
  `axios`) in `/client/src/lib/api.ts`; use React Query (`@tanstack/react-query`)
  for server-state caching if Antigravity judges it useful — otherwise plain
  hooks are fine, just be consistent everywhere.
- **State management:** React Context for auth state and cart state
  (persist cart to `localStorage` for guests, merge into the account on
  login). Don't add Redux.
- **Icons:** `lucide-react`.
- **Fonts:** load Fraunces + Inter via `@fontsource` packages or a Google
  Fonts `<link>` in `index.html` — either is fine, just be consistent.

**General:**
- **Package manager:** npm, in both `/client` and `/server`.
- **Dev workflow:** a root-level `package.json` with a `concurrently` script
  that runs both the Express server and the Vite dev server together with
  one command (e.g. `npm run dev` from the root).
- Keep the dependency list lean. Don't add UI kits that fight the custom
  design system.

---

## 4. Data model (Mongoose schemas — implement in Phase 1)

```
Category
  name              // e.g. "Starters", "Main Course", "Desserts", "Beverages"
  slug
  displayOrder
  timestamps

FoodItem
  name
  slug
  description
  price
  imageUrl          // Cloudinary URL
  category          -> ObjectId ref Category
  isPopular         // boolean, shown in "Most Popular" landing section
  isTodaysSpecial   // boolean, shown in "Today's Special" landing section
  isAvailable       // boolean, soft "out of stock" toggle
  spiceLevel        // optional enum: "MILD" | "MEDIUM" | "HOT"
  isVeg             // boolean, for the veg/non-veg indicator common on menus
  timestamps

User
  name
  email             // unique
  passwordHash
  phone
  address
  role              // "CUSTOMER" | "ADMIN"
  timestamps

Order
  user              -> ObjectId ref User
  items: [
    {
      foodItem      -> ObjectId ref FoodItem
      name          // snapshot at order time
      price         // snapshot at order time
      quantity
    }
  ]
  totalPrice
  status            // "PENDING" | "CONFIRMED"
  timestamps

SiteSettings        // singleton document (only one ever exists)
  siteName          // default "Food Court"
  logoUrl           // nullable Cloudinary URL, falls back to text wordmark
  heroImages         // array of Cloudinary URLs for the hero slider
```

Antigravity: create these as actual Mongoose schemas/models in Phase 1, and
write a seed script (`server/seed.js` or similar, run via `node seed.js` or
an npm script) that populates realistic sample data (real-sounding dish
names, prices, categories, 2–3 marked popular, 1–2 marked today's special)
so the site never looks empty during development. For seed-time images,
either reference direct Unsplash image URLs directly as `imageUrl` (simplest
for seeding) or upload a handful of sample images to Cloudinary via the seed
script — Antigravity's choice, document which was done.

---

## 5. Monorepo folder structure to establish in Phase 1

```
/food-court
  /client                     (Vite + React + TypeScript)
    /src
      /pages                  -> route-level components (Landing, Menu, ItemDetail, Login, Signup, Account, Admin/*)
      /components
        /ui                   -> reusable primitives (Button, Badge, Card, Input, Modal)
        /site                 -> landing/menu-specific components (HeroSlider, FoodCard, CategoryTile)
        /admin                -> admin-only components
      /context                -> AuthContext, CartContext
      /lib                    -> api client, utils
      /assets
    index.html
    package.json
  /server                     (Node + Express)
    /src
      /models                 -> Category.js, FoodItem.js, User.js, Order.js, SiteSettings.js
      /routes                 -> categories.js, foodItems.js, auth.js, orders.js, settings.js
      /controllers            -> matching controller logic per route
      /middleware             -> auth.js (protect/isAdmin), upload.js (multer+cloudinary)
      /config                 -> db.js (mongoose connect), cloudinary.js
      seed.js
      server.js
    package.json
    .env.example
  package.json                -> root, runs client+server concurrently
  README.md
```

---

## 6. General rules for every phase

- Always leave the app in a runnable state (`npm run dev` from the root
  starts both client and server) at the end of a phase — no half-finished
  imports or broken pages.
- Write TypeScript properly on the client; no `any` unless truly
  unavoidable. Server code in plain modern JavaScript (Node) is fine unless
  you'd rather use TypeScript there too — be consistent if so.
- Mobile-responsive from the start, not bolted on later.
- Accessible: proper alt text on food images, sufficient color contrast,
  keyboard-usable nav and forms.
- Never commit real secrets — use `.env` + `.env.example` with placeholder
  values, and make sure `.env` is in `.gitignore`.
- Every phase file has a "Definition of Done" checklist — verify against it
  before moving to the next phase.

Now open **`01-PHASE-1-FOUNDATION-AND-LANDING.md`**.
