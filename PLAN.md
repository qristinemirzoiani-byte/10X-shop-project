# 10X Shop — Work Breakdown Structure

## Plan basis

- **Purpose:** replace the obsolete 28-step checklist with a status-based delivery plan.
- **Estimate:** 72 person-hours across four planning weeks (about 18 hours per week), assuming one developer. These are estimates from project start, not recorded actual hours.
- **Status reflects the repository at the last review:** completed work is checked off; remaining release verification stays open.
- **CORE** is the smallest usable, buildable shopping flow. **FULL** adds the complete feature, error/empty states, responsive behavior, and verification described below.
- Feature references point to the main implementation files; related components live beside them.

## Module scope and status

| Module | CORE scope | FULL scope | Current status |
|---|---|---|---|
| Foundation, layout & routing | Vite/React/TypeScript setup, shared layout, navigation, and working routes. | Lazy-loaded routes, protected pages, error boundary, 404, responsive shell. | CORE and FULL implemented. |
| Authentication, profile & preferences | Demo sign-in/sign-up flow, validation, and session state. | Persistent profile, logout, theme preference, and user-managed local data. | CORE and FULL implemented. Authentication is client-side demo behavior, not production identity/security. |
| Catalog & product discovery | Product API/types, product cards, catalog list. | Search, category filtering, sorting, pagination, responsive grid, loading/error/empty states, details, gallery, and reviews. | CORE and FULL implemented. Grid breakpoints are verified as implemented, not as an independently supplied product requirement. |
| Cart & checkout | Add/remove/change quantity and calculate totals. | Persisted cart, stock checks, promo code, validated checkout, order creation and saved shipping details. | CORE and FULL implemented. Orders and checkout are local/demo flows. |
| Orders & customer account | Show saved orders to the signed-in demo user. | Order details/status, reorder, profile editing, preferences, and local-data controls. | CORE and FULL implemented. |
| Quality & release | Type-check/build, lint, and route smoke checks. | Repeatable cross-browser/responsive suite, release evidence, accessibility/performance review. | Chrome/Edge responsive checks and build/lint pass. Firefox/WebKit execution and deployed Lighthouse verification remain open. |

### Main implementation entry points

- App routes and layout: [src/routes/AppRoutes.tsx](./src/routes/AppRoutes.tsx), [src/layout/Layout.tsx](./src/layout/Layout.tsx)
- Authentication and profile: [src/contexts/AuthContext.tsx](./src/contexts/AuthContext.tsx), [src/pages/LoginPage.tsx](./src/pages/LoginPage.tsx), [src/profile/](./src/profile/)
- Catalog and product: [src/pages/CatalogPage.tsx](./src/pages/CatalogPage.tsx), [src/pages/ProductPage.tsx](./src/pages/ProductPage.tsx), [src/api/products.api.ts](./src/api/products.api.ts)
- Cart, checkout, and orders: [src/contexts/CartContext.tsx](./src/contexts/CartContext.tsx), [src/pages/CartPage.tsx](./src/pages/CartPage.tsx), [src/checkout/CheckoutForm.tsx](./src/checkout/CheckoutForm.tsx), [src/orders/](./src/orders/)
- Responsive browser tests: [tests/responsive.spec.mjs](./tests/responsive.spec.mjs), [playwright.config.mjs](./playwright.config.mjs)

## WBS and estimates

Effort is estimated from a clean project start. The status column records what is already present; open work is not included in the estimates as “actual hours spent.”

| WBS | Work package | Module | Estimate | Planned week | Status / exit evidence |
|---|---|---|---:|---:|---|
| 1.1 | Initialize Vite, React, TypeScript, styling, and quality scripts | Foundation | 4 h | 1 | Done — application builds and lint is configured. |
| 1.2 | Implement shared layout, header, navigation, routing, and route guards | Foundation | 6 h | 1 | Done — public and protected routes are wired. |
| 1.3 | Implement demo authentication, profile, and theme preferences | Account | 8 h | 1 | Done — profile/session/preferences persist locally. |
| 2.1 | Define product types and API client; load catalog data | Catalog | 5 h | 2 | Done — API service and loading/error handling exist. |
| 2.2 | Implement search, category filters, sorting, and pagination | Catalog | 5 h | 2 | Done — URL-backed catalog controls exist. |
| 2.3 | Implement product details, gallery, and reviews | Product | 7 h | 2 | Done — product page and review components exist. |
| 3.1 | Implement cart state, persistence, quantity/stock rules, and totals | Cart | 8 h | 3 | Done — cart context, reducer, storage, and summary exist. |
| 3.2 | Implement checkout validation and local order creation | Checkout | 5 h | 3 | Done — checkout stores an order in browser storage. |
| 3.3 | Implement order history/details, status, and reorder | Orders | 5 h | 3 | Done — order routes and components exist. |
| 4.1 | Complete responsive layout and touch-target checks | Responsive UX | 5 h | 4 | Done for checked layouts — all eight routes at 375/768/1280px in Chrome/Edge; pagination is included in the 44px mobile check. |
| 4.2 | Add repeatable Playwright route and breakpoint checks | Quality | 5 h | 4 | Done for Chrome/Edge — 8 tests pass; Firefox/WebKit browser install and run remain open. |
| 4.3 | Build, lint, update compatibility evidence and project docs | Release | 4 h | 4 | Partially done — build/lint and Chrome/Edge matrix pass; Firefox/WebKit status is pending. |
| 4.4 | Run deployed Lighthouse audit and address release thresholds | Release | 5 h | 4 | Open — current report does not confirm the FULL Performance target. |
|  | **Total** |  | **72 h** | **4 weeks** | **Feature work complete; release verification remains.** |

## Remaining release work

1. Install and run Firefox and WebKit projects using the commands in [COMPATIBILITY.md](./COMPATIBILITY.md); record actual results. WebKit is not a substitute for real Safari.
2. Run Lighthouse against the deployed production site in an incognito session. Record repeatable results and resolve the FULL performance target (Performance ≥85) before marking it complete.
3. If any verification fails, fix the cause, rerun the affected check, and update the compatibility evidence; do not mark a check complete based only on screenshots or an unexecuted test.

## Risks and mitigations

| Risk | Likelihood / impact | Mitigation | Trigger / response |
|---|---|---|---|
| DummyJSON API or image CDN is unavailable, slow, or changes its response. | Medium / High | Keep explicit loading/error/empty UI; validate API payloads; use deterministic local fixtures for layout tests. | API smoke check fails or page stays loading: capture the failure, verify the error UI, and retest with fixtures separately from the live service. |
| Client-side demo authentication and localStorage may be mistaken for production-grade account, payment, or order security. | Medium / High | Clearly label flows as demos; do not store secrets or real payment data; use a trusted backend and server-side authorization before production. | Before real users or payments: block release until backend auth, authorization, and payment integration are reviewed. |
| Browser-engine differences, uninstalled browser binaries, or slow downloads leave cross-browser claims incomplete. | Medium / Medium | Run the checked-in Playwright suite; pin/review its dependency; keep browser statuses “pending” until executed; maintain a separate Safari check if Safari support is required. | Engine install/test fails: report the environment limitation and do not claim that engine passed. |
| External images, large assets, or variable network/device performance miss the performance target. | Medium / High | Measure the deployed build with repeated Lighthouse runs; compare medians; optimize the measured bottleneck rather than relying on one noisy local score. | Median Performance is below 85: profile the production page, address the largest measured opportunity, and rerun. |
| Responsive changes regress an existing route or touch target. | Medium / Medium | Run every route at 375/768/1280px in Chrome and Edge; keep overflow and 44px checks in the automated suite. | Any assertion fails: treat it as a release blocker, fix the affected layout, and rerun the full browser matrix. |

## Definition of Done

### CORE — usable application

- [x] Catalog, product details, cart, checkout, order history/details, profile, and login routes render their intended content.
- [x] Core product discovery, cart totals, checkout validation, and local order flow work with the current demo API/state model.
- [x] TypeScript production build and ESLint pass.

### FULL — release-ready verification

- [x] Chrome and Edge Playwright route checks pass at 375 × 812, 768 × 812, and 1280 × 812 for all eight documented routes.
- [x] At 375px, no unexpected horizontal overflow is present and visible buttons/form controls meet the 44 × 44px minimum.
- [x] Catalog grid columns match the tested implementation at 375, 480, 481, 767, 768, 1024, 1025, and 1280px.
- [ ] Firefox and WebKit Playwright projects have been installed, executed, and their real outcomes recorded. Safari-specific support is not claimed from WebKit alone.
- [ ] Deployed Lighthouse results are recorded from repeat runs; FULL performance median is at least 85. Accessibility and Best Practices results are also documented, with regressions from the measured baseline explained.
- [ ] Compatibility and release documents match the latest executed tests; no “pass” is based on an unrun check.

The project is **CORE complete** and **FULL release verification in progress** until all unchecked FULL criteria are evidenced.
