# 10X Shop — Browser & Device Compatibility

## Test setup

- Playwright ran in Google Chrome 156.0.8078.76 and Microsoft Edge 156.0.4314.58 on Windows. Product API responses are replaced with local fixtures so route checks do not depend on network availability.
- The linked `edge-*.png` files are the existing screenshot set; they were not recaptured during this rerun. They predate the mobile/tablet category dropdown and still show the previous horizontal category strip.
- Mobile viewport: 375 × 812 CSS pixels.
- Responsive grid checks: 375, 480, 481, 767, 768, 1024, 1025, and 1280 pixels.
- Protected routes were opened with demo user, cart, and order data in local storage.
- The checks measured document width, visible buttons and form-control sizes, and unintended horizontal overflow. They are layout checks, not a full functional or accessibility audit.

## Page × device × browser results

| Page | Route | Chrome 375px | Chrome 768px | Chrome 1280px | Edge 375px | Edge 768px | Edge 1280px | Mobile screenshot |
|---|---|---|---|---|---|---|---|---|
| Catalog | `/` | Pass | Pass | Pass | Pass | Pass | Pass | [Products loaded](./docs/compat/edge-mobile-catalog-products.png), [loading state](./docs/compat/edge-mobile-catalog.png) |
| Product details | `/products/1` | Pass | Pass | Pass | Pass | Pass | Pass | [Product details](./docs/compat/edge-mobile-product.png) |
| Cart | `/cart` | Pass | Pass | Pass | Pass | Pass | Pass | [Cart](./docs/compat/edge-mobile-cart.png) |
| Checkout | `/checkout` | Pass | Pass | Pass | Pass | Pass | Pass | [Checkout](./docs/compat/edge-mobile-checkout.png) |
| Order history | `/orders` | Pass | Pass | Pass | Pass | Pass | Pass | [Orders](./docs/compat/edge-mobile-orders.png) |
| Order details | `/orders/123` | Pass | Pass | Pass | Pass | Pass | Pass | [Order details](./docs/compat/edge-mobile-order-details.png) |
| Profile | `/profile` | Pass | Pass | Pass | Pass | Pass | Pass | [Profile](./docs/compat/edge-mobile-profile.png) |
| Login | `/login` | Pass | Pass | Pass | Pass | Pass | Pass | [Login](./docs/compat/edge-mobile-login.png) |

The automated checks verified page content and `document.documentElement.scrollWidth` at all listed sizes. At 375px, visible buttons and form controls, including the catalog pagination buttons, were at least 44 × 44px, and no unintended horizontal overflow was found. The category list is now a click-to-open vertical dropdown below 1024px; on larger screens it remains a vertical sidebar. The existing mobile navigation drawer capture is [here](./docs/compat/edge-mobile-drawer.png).

Screenshots in the table are available for the 375px mobile viewport only.

The catalog grid check uses 12 local fixture products and a 194-product total so pagination is rendered without relying on the live API; the loading skeleton uses the same breakpoints. The screenshots are existing captures and do not guarantee that the upstream API or image CDN is available.

## Catalog grid breakpoints observed in the current implementation

| Viewport width | Columns | Chrome 156 | Edge 156 |
|---:|---:|---|---|
| 375px | 1 | Pass | Pass |
| 480px | 1 | Pass | Pass |
| 481px | 2 | Pass | Pass |
| 767px | 2 | Pass | Pass |
| 768px | 3 | Pass | Pass |
| 1024px | 3 | Pass | Pass |
| 1025px | 4 | Pass | Pass |
| 1280px | 4 | Pass | Pass |

The catalog loading skeleton uses the same breakpoints as the loaded product grid. Below 1024px, categories are available from the collapsible dropdown; at 1024px and wider, the category list is shown as a vertical sidebar.

The repository does not contain a separate acceptance specification for the grid breakpoints. This matrix verifies the current CSS thresholds (481px, 768px, and 1025px); it should not be treated as evidence that these are the required product breakpoints.

## Run the automated checks

From the VS Code terminal, in the project folder, run the Chrome and Edge checks:

```powershell
npm.cmd run test:e2e -- --project=chrome --project=edge
```

Google Chrome and Microsoft Edge must be installed. The command checks all eight routes at 375px, 768px, and 1280px, plus catalog grid columns at the documented widths. A failure includes its browser project and viewport; Playwright saves a screenshot and trace for failed checks under `test-results/`.

To also test Firefox and WebKit, install their browsers once and run the full suite:

```powershell
npx.cmd playwright install firefox webkit
npm.cmd run test:e2e
```

WebKit is Safari's engine, but it does not replace testing on Apple Safari itself. Append `-- --project=chrome`, `-- --project=edge`, `-- --project=firefox`, or `-- --project=webkit` to `npm.cmd run test:e2e` to select one project.

## Browser coverage

| Browser | Tested coverage | Status |
|---|---|---|
| Google Chrome 156 | All eight routes at 375/768/1280px; grid at the widths above | Verified |
| Microsoft Edge 156 | All eight routes at 375/768/1280px; grid at the widths above | Verified |
| Playwright Firefox | Run locally with `npm.cmd run test:e2e -- --project=firefox` | Browser install pending |
| Playwright WebKit | Safari-engine approximation; run locally with `npm.cmd run test:e2e -- --project=webkit` | Browser install pending |
| Apple Safari | WebKit engine approximation only; no Safari run | Not independently verified |

Passing Playwright projects verifies the listed checks in those engines, not every browser-specific behavior or full accessibility. “Pending” does not mean “failed”; update this table from actual test results before claiming coverage.
