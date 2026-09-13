# Phase 3 — Admin Panel & CRUD

**Goal:** a protected `/admin` section of the React app where you (the
owner) manage every piece of content on the site without touching code:
food items, categories, today's special / popular flags, and the site's
logo & name — with images uploaded straight to Cloudinary.

Prerequisite: Phases 1 and 2 are done.

---

## What this phase delivers

1. **Admin authentication (backend):**
   - `POST /api/auth/login` — validates email/password against the `User`
     model (bcrypt compare), issues a JWT set as an httpOnly cookie.
   - `POST /api/auth/logout` — clears the cookie.
   - `GET /api/auth/me` — returns the current logged-in user (or 401).
   - `protect` middleware (valid JWT required) and `isAdmin` middleware
     (role must be "ADMIN") applied to every admin-only route.
   - Seed one admin user in the seed script with a clearly documented
     default password, e.g. `admin@foodcourt.com` / `ChangeMe123!` — with a
     visible comment/README note to change this before going live.
2. **Admin authentication (frontend):**
   - `/admin/login` page (on-brand, not a bare form).
   - An `AuthContext` that checks `/api/auth/me` on load and exposes the
     current user + role to the rest of the app.
   - A protected route wrapper so any `/admin/*` React route redirects to
     `/admin/login` if there's no logged-in ADMIN user. (Note: this is a
     UX convenience — the real security boundary is the server-side
     `protect`/`isAdmin` middleware, since a client-side redirect alone
     doesn't stop a malicious API call.)
3. **Cloudinary image upload endpoint:** `POST /api/upload` (admin-only),
   using `multer` to receive the file and the `cloudinary` SDK to stream it
   up, returning the resulting secure URL for the client to attach to a
   FoodItem, SiteSettings logo, or hero image.
4. **Admin dashboard layout:** a distinct sidebar/top-nav shell (still
   on-brand, not a bare default admin template) with sections:
   - Dashboard/overview (basic counts: total items, categories, orders)
   - Food Items
   - Categories
   - Site Settings
5. **Food Items CRUD** (`/api/food-items` POST/PUT/DELETE, admin-only):
   - Table/list of all items with quick toggles for isPopular,
     isTodaysSpecial, isAvailable.
   - "Add New Item" form: name, description, price, category (select),
     image upload (via the Cloudinary upload endpoint), veg/non-veg, spice
     level.
   - Edit existing item (same form, pre-filled).
   - Delete item with a confirmation step (no silent destructive actions).
6. **Categories CRUD** (`/api/categories` POST/PUT/DELETE, admin-only):
   - List, add, rename, reorder (simple up/down or drag-and-drop), delete
     (block or warn if a category still has items in it).
7. **Site Settings** (`/api/settings` PUT, admin-only):
   - Change site name (currently "Food Court").
   - Upload/change logo via Cloudinary (falls back to the text wordmark if
     no logo image is set).
   - Manage the hero slider images (add/remove/reorder the poster images
     used in the landing page's hero carousel).
8. All changes must reflect immediately on the public site (landing + menu
   pages), since they all read from the same MongoDB data via the API.
9. Basic form validation and clear success/error feedback (styled toasts or
   inline messages, on-brand — no default browser `alert()`).

## Explicit constraints for this phase

- Admin UI should still feel like it belongs to the same premium brand —
  simpler and more utilitarian than the public site is fine, but not an
  unstyled default table.
- Do not expose any admin-only API route to non-admin/unauthenticated
  requests under any circumstance — verify this with server middleware,
  not just hiding a link in the UI.
- Don't build multi-admin roles/permissions granularity beyond a single
  ADMIN role for now — keep it simple.
- Do not store uploaded images on local disk — everything goes through the
  Cloudinary upload endpoint.

---

## PROMPT TO PASTE INTO ANTIGRAVITY

```
Read 00-MASTER-BRIEF.md and 03-PHASE-3-ADMIN-PANEL-CRUD.md in this project
folder. Confirm Phases 1 and 2 are already implemented by checking the
existing /client and /server code before continuing.

Now execute Phase 3:

1. On the server: build POST /api/auth/login (bcrypt compare, issue a JWT
   as an httpOnly cookie), POST /api/auth/logout, and GET /api/auth/me.
   Build `protect` middleware (valid JWT required) and `isAdmin` middleware
   (role must be ADMIN). Add an admin user to the seed script (email
   admin@foodcourt.com, a placeholder strong password, role ADMIN).
2. Build a Cloudinary-backed upload endpoint, POST /api/upload
   (protect + isAdmin), using multer to receive the file and the
   cloudinary SDK to upload it, returning the secure URL.
3. Add full CRUD endpoints (protect + isAdmin) for Food Items and
   Categories, and a PUT endpoint for the SiteSettings singleton (name,
   logoUrl, heroImages array).
4. On the client: build an AuthContext that checks /api/auth/me on load,
   an on-brand /admin/login page, and a protected-route wrapper so
   /admin/* redirects to /admin/login when there's no logged-in admin.
5. Build an on-brand admin dashboard shell (sidebar or top nav) with
   sections: Overview, Food Items, Categories, Site Settings.
6. Build full CRUD UI for Food Items: list with quick toggles for Popular /
   Today's Special / Available, an add/edit form (name, description, price,
   category select, image upload via the Cloudinary endpoint, veg/non-veg,
   spice level), and delete with a confirmation step.
7. Build full CRUD UI for Categories: list, add, rename, reorder, delete
   (warn if the category still has items).
8. Build the Site Settings UI: edit site name, upload/replace logo via
   Cloudinary (fallback to text wordmark if none set), and manage the hero
   slider's poster images (add/remove/reorder), all via Cloudinary uploads.
9. Make sure every change here is immediately reflected on the public
   landing and menu pages, since they read from the same MongoDB data —
   verify this by testing an edit end to end.
10. Use styled on-brand success/error feedback, never a raw browser
    alert().
11. Confirm `npm run dev` still runs both client and server cleanly, that
    admin API routes are genuinely protected (test by calling one directly
    without a valid admin session and confirming a 401/403), and summarize
    what you built plus the admin login credentials to use.
```

---

## Definition of Done

- [ ] Visiting `/admin` while logged out redirects to `/admin/login`.
- [ ] Logging in as the seeded admin user reaches the dashboard.
- [ ] Calling an admin API endpoint directly without a valid session
      returns 401/403, not data.
- [ ] Can add a new food item with a Cloudinary-uploaded image and see it
      appear on `/menu` immediately.
- [ ] Can mark an item as Today's Special / Popular and see the landing
      page update.
- [ ] Can add/rename/delete a category and see `/menu`'s filter bar update.
- [ ] Can change the site name and logo in Site Settings and see the header
      update across the public site.
- [ ] Can add/remove hero slider images and see the landing page carousel
      update.
- [ ] No image is ever written to local disk — everything goes through
      Cloudinary.
