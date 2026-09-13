# Phase 4 — User Accounts, Profiles & Ordering

**Goal:** customers can sign up, log in, save their details once, add items
to a cart from the menu, and place an order without retyping their info
every time.

Prerequisite: Phases 1, 2, and 3 are done.

---

## What this phase delivers

1. **Backend auth for customers:**
   - `POST /api/auth/signup` — creates a `User` with role `CUSTOMER`,
     hashes the password with `bcryptjs`, issues the same JWT httpOnly
     cookie flow built in Phase 3.
   - Reuse the existing `/api/auth/login`, `/api/auth/logout`,
     `/api/auth/me` endpoints (already role-agnostic from Phase 3).
   - `PUT /api/users/me` (protect) — update name, phone, address.
2. **Orders backend:**
   - `POST /api/orders` (protect) — creates an `Order` from the cart
     payload sent by the client (snapshotting item name/price at order
     time), tied to `req.user`.
   - `GET /api/orders/mine` (protect) — returns the logged-in user's order
     history.
3. **Sign up / Log in (`/signup`, `/login` React routes):** on-brand forms
   (replacing the placeholder page from Phase 1), using the `AuthContext`
   built in Phase 3. Include basic validation (email format, password
   length) and clear on-brand error states (wrong password, email already
   in use, etc).
4. **Profile page (`/account`):**
   - View/edit name, phone, address, email (calls `PUT /api/users/me`).
   - This is the data that gets reused automatically at checkout so
     returning users don't retype it.
   - Order history list (calls `GET /api/orders/mine`) — date, items,
     total, status.
5. **Cart (`CartContext`):**
   - Wire up the "Add to Cart" buttons from Phase 2's menu/detail views to
     a real `CartContext`: persist to `localStorage` for guests, and if the
     user is logged in keep it associated with their session so it survives
     a refresh (simplest correct approach: keep cart in `localStorage`
     regardless of auth state, and simply require login before checkout —
     document whichever approach is taken).
   - A cart drawer/page showing items, quantities (editable), line totals,
     and a running total.
6. **Checkout:**
   - If the user is logged in, pre-fill their contact/delivery details from
     `/api/users/me` automatically.
   - If not logged in, prompt them to log in before checking out (simplest
     correct behavior, and it's what makes "save details for next time"
     actually work — guest checkout is not required).
   - "Place Order" calls `POST /api/orders`, then shows a clear on-brand
     confirmation (order number, summary, estimated total) — no real
     payment processing needed at this stage.
7. Nav header updates to reflect logged-in state (show user's name / avatar
   initials + a link to `/account`, plus a cart icon with item count badge).

## Explicit constraints for this phase

- Passwords must be hashed with `bcryptjs` — never store plaintext.
- Keep the checkout flow simple and real: no fake payment form theatrics,
  no third-party payment SDK unless explicitly asked for later.
- Reuse existing design system components; the account/checkout pages
  should feel like the same brand, not a bolted-on generic form template.

---

## PROMPT TO PASTE INTO ANTIGRAVITY

```
Read 00-MASTER-BRIEF.md and 04-PHASE-4-USER-ACCOUNTS-PROFILES.md in this
project folder. Confirm Phases 1-3 are already implemented by checking the
existing /client and /server code before continuing.

Now execute Phase 4:

1. On the server: build POST /api/auth/signup (role CUSTOMER, bcryptjs
   hashing, same JWT cookie flow as login), PUT /api/users/me (protect),
   POST /api/orders (protect, snapshots item name/price at order time,
   tied to req.user), and GET /api/orders/mine (protect).
2. On the client: build on-brand /signup and /login pages replacing the
   Phase 1 placeholder, using the existing AuthContext. Add clear, styled
   validation/error states (invalid email, short password, email already
   registered, wrong credentials).
3. Build /account: view and edit name, phone, address, email (calling
   PUT /api/users/me), and an order history list (calling
   GET /api/orders/mine).
4. Build a CartContext and wire up the "Add to Cart" buttons already
   present in the Phase 2 menu and item-detail views to it. Persist the
   cart to localStorage. Build a cart drawer or page with editable
   quantities and a running total.
5. Build checkout: if the user is logged in, pre-fill their saved
   contact/delivery details from their profile; if not logged in, prompt
   them to log in first (no separate guest flow needed). "Place Order"
   calls POST /api/orders and shows an on-brand confirmation screen with an
   order number and summary. No real payment processing.
6. Update the site header to show logged-in state (name/initials, link to
   /account) and a cart icon with a live item-count badge.
7. Confirm `npm run dev` runs both client and server cleanly, do a full
   manual walkthrough (sign up -> add items to cart -> checkout -> see
   order in /account history), and summarize what was built.
```

---

## Definition of Done

- [ ] Can sign up as a new customer and log in.
- [ ] Profile details saved in `/account` are reused automatically at
      checkout on a later order.
- [ ] Cart correctly reflects items added from the menu, with editable
      quantities and correct running total.
- [ ] Placing an order creates a real MongoDB `Order` document visible in
      the user's order history.
- [ ] Header reflects logged-in state and live cart count.
- [ ] Passwords are hashed with bcryptjs, never stored in plaintext.
