# Phase 5 — Polish, Performance & Launch Readiness

**Goal:** take the fully-functional site from Phases 1-4 and make it feel
finished — the last 10% that separates "working" from "premium and ready to
show real customers."

Prerequisite: Phases 1-4 are done.

---

## What this phase delivers

1. **Responsive & cross-device pass:** manually re-check every page
   (landing, menu, item detail, login/signup, account, cart, checkout,
   admin dashboard + all admin sub-pages) at mobile, tablet, and desktop
   widths. Fix any overlap, overflow, or awkward breakpoints.
2. **Motion polish:** tasteful, subtle transitions — page/section fade-ins
   on scroll, smooth hero slider transitions, hover states on cards/buttons,
   smooth cart drawer open/close. Nothing bouncy, nothing that delays the
   user from acting.
3. **Loading & error states everywhere:** skeleton loaders or on-brand
   spinners for anything fetching data, a proper on-brand 404 page (React
   Router catch-all route), a proper on-brand generic error boundary, empty
   states for "no orders yet" etc.
4. **SEO & metadata:** since this is a Vite SPA, use `react-helmet-async` (or
   similar) to set `<title>`/meta description per route, Open Graph tags
   for social sharing (using a hero food image), and a favicon generated
   from the logo/wordmark. Note in the README that true SEO crawlability
   would benefit from server-side rendering later (e.g. migrating the
   client to Next.js or adding prerendering) — not required now.
5. **Accessibility check:** color contrast against the palette, alt text on
   every food image (pulling from item name/description), form labels,
   keyboard navigation through the hero slider, menu filters, and cart.
6. **Performance check:** lazy-load route-level React components with
   `React.lazy`/`Suspense`, use responsive/optimized image sizes, avoid
   obvious layout shift on load, confirm the Vite production bundle is
   reasonably sized (`npm run build` and check output).
7. **Security/production check on the server:** confirm `.env` is
   gitignored, CORS is configured to only allow the real client origin
   (`CLIENT_URL`), rate-limiting on `/api/auth/*` (e.g. `express-rate-limit`)
   to blunt brute-force attempts, and helmet.js middleware for sane HTTP
   security headers.
8. **Production build check:** run `npm run build` in `/client` and confirm
   `/server` serves the built client (or document that they're deployed
   separately — e.g. client on Vercel/Netlify, server on Render/Railway —
   whichever approach Antigravity takes, document it clearly). Confirm the
   whole stack starts cleanly end to end against production builds.
9. **Documentation:** a top-level project `README.md` (different from this
   prompts folder) explaining how to run `/client` and `/server` locally,
   how to seed MongoDB, the default admin login, required `.env` values,
   and deployment notes.

## Explicit constraints for this phase

- Don't introduce new features here — this phase only refines what already
  exists from Phases 1-4.
- Don't change the color palette or fonts; polish means refining spacing,
  motion, and consistency, not redesigning.

---

## PROMPT TO PASTE INTO ANTIGRAVITY

```
Read 00-MASTER-BRIEF.md and 05-PHASE-5-POLISH-PERFORMANCE-LAUNCH.md in this
project folder. Confirm Phases 1-4 are already implemented by checking the
existing /client and /server code before continuing. This phase only
refines existing features — do not add new functionality or change the
color palette/fonts.

Now execute Phase 5:

1. Do a full responsive pass across every page (landing, menu, item detail,
   login, signup, account, cart, checkout, and every admin page) at mobile,
   tablet, and desktop widths. Fix any layout issues found.
2. Add tasteful, subtle motion: scroll fade-ins, smooth hero slider
   transitions, hover states on cards/buttons, smooth cart drawer
   open/close. Keep it restrained, not bouncy or distracting.
3. Add proper loading states (skeletons/on-brand spinners) for anything
   fetching data, an on-brand custom 404 page via a React Router catch-all
   route, an on-brand error boundary, and empty states (e.g. "no orders
   yet", "cart is empty").
4. Add react-helmet-async (or equivalent) for per-route <title>/meta
   description and Open Graph tags using a real hero image, and generate a
   favicon from the Food Court wordmark/logo. Note in the project README
   that true crawlable SEO would need SSR/prerendering as a future upgrade.
5. Do an accessibility pass: alt text on every food image, correct form
   labels, sufficient color contrast, and confirm the hero slider, menu
   filters, and cart are fully keyboard-navigable.
6. Add React.lazy/Suspense for route-level code-splitting, check for
   layout shift on load, and confirm the production Vite bundle size is
   reasonable.
7. On the server, add helmet.js, configure CORS to only allow CLIENT_URL,
   and add rate-limiting (express-rate-limit) on /api/auth/* routes.
   Double check .env is gitignored and no secrets are committed.
8. Run `npm run build` in /client and confirm the server can either serve
   the built client or document a clear separate-deployment approach
   (e.g. client on a static host, server on a Node host) — whichever you
   choose, document it. Confirm the whole stack runs cleanly against the
   production build.
9. Write a proper project-level README.md (separate from the prompts
   folder) with setup instructions for both /client and /server, the seed
   command, the default admin login, required .env values, and deployment
   notes.
10. Give me a final summary of the whole build and anything you'd
    recommend doing next before this goes live to real customers.
```

---

## Definition of Done — full project

- [ ] Every page works and looks correct at mobile/tablet/desktop widths.
- [ ] Motion feels premium and restrained, not gimmicky.
- [ ] Loading, empty, and error states are all styled on-brand.
- [ ] `npm run build` in `/client` completes with no errors.
- [ ] Server has helmet, CORS locked to the client origin, and rate
      limiting on auth routes.
- [ ] Favicon and page titles/meta descriptions are set.
- [ ] Project README explains how to run, seed, and log in as admin, plus
      required `.env` values and deployment notes.
- [ ] The site, end to end, does not look like a generic AI-generated
      template — it looks like a real, premium restaurant's website.

**You now have a complete, working Food Court website on the MERN stack.**
