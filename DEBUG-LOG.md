# 10X Shop — Debugging Log

## Evidence and reproduction notes

The five fixes below were verified against the repository's Git history. The reproduction steps are manual regression procedures for checking the corrected behavior; they are not claims that the historical bug was re-created during this documentation review. The evidence recorded for each issue is the result of `git show <commit>`, which confirms the commit and the changed files. No pre-fix screenshots, browser traces, or automated regression-test results were retained for these historical fixes.

## Issue 1 — Checkout opened with an empty cart

- **Symptom**: Opening checkout without cart items left the user on a checkout screen that could not produce an order.
- **Reproduction steps (regression check)**:
  1. Sign in and clear all items from the cart.
  2. Open `/checkout` directly.
  3. Verify the app navigates to `/cart` and explains that products must be added first.
- **Tool used**: Git CLI — `git show 76c11fc31208138445cf500e068408d06538e942`.
- **Tool result**: Confirmed commit `fix(checkout): redirect empty cart to cart page`; it changes `src/pages/CheckoutPage.tsx` and `src/pages/CartPage.tsx` to redirect to the cart and pass a message in router state. This was source-history inspection, not a browser run.
- **Root cause**: Checkout handled the empty state separately instead of sending the user to the page where they can manage the cart.
- **Fix commit**: [76c11fc31208138445cf500e068408d06538e942](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/76c11fc31208138445cf500e068408d06538e942) — redirect empty checkout to the cart page.
- **What I learned**: Guard invalid page state at the route/page boundary and guide the user to the next useful action.

## Issue 2 — Order-save failure could look like a successful checkout

- **Symptom**: If saving an order to browser storage failed, the user could still see a success state and lose the cart contents.
- **Reproduction steps (regression check)**:
  1. Add an item to the cart and open checkout.
  2. In DevTools, temporarily make `Storage.prototype.setItem` throw for the `shop_orders` key.
  3. Submit valid checkout details.
  4. Verify an error is shown, no success state appears, and the cart remains intact. Restore the original `setItem` implementation after the check.
- **Tool used**: Git CLI — `git show 50c7e164710fa0865141d27a82ba20b786121caf`.
- **Tool result**: Confirmed commit `fix(checkout): show order placement errors`; it changes `src/pages/CheckoutPage.tsx` so a failed save is reported and the success/cart-clear path does not continue. This was source-history inspection, not a browser run.
- **Root cause**: Persistence errors were swallowed, and the success path was not conditional on storage succeeding.
- **Fix commit**: [50c7e164710fa0865141d27a82ba20b786121caf](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/50c7e164710fa0865141d27a82ba20b786121caf) — show order-placement errors.
- **What I learned**: Treat persistence as part of the checkout transaction; do not show success or discard user data after a failed save.

## Issue 3 — Persisted cart data could contain unavailable or invalid quantities

- **Symptom**: Cart contents restored from older localStorage data could include products with no available stock or quantities outside the available range.
- **Reproduction steps (regression check)**:
  1. In DevTools → Application → Local Storage, edit `shop_cart` so an item has `stock: 0`.
  2. Repeat with an available item whose `quantity` is greater than its `stock`.
  3. Reload the app and open the cart.
  4. Verify out-of-stock items are discarded and restored quantities do not exceed stock.
- **Tool used**: Git CLI — `git show 27111a3822703e01f4dd5ebc1ea457a9b57ebe7e`.
- **Tool result**: Confirmed commit `fix(cart): handle out-of-stock items safely`; it changes `src/contexts/CartContext.tsx` and `src/contexts/cart.reducer.ts` to filter unavailable items and bound quantities. This was source-history inspection, not a browser run.
- **Root cause**: Data read from localStorage was trusted without normalizing it against current stock constraints.
- **Fix commit**: [27111a3822703e01f4dd5ebc1ea457a9b57ebe7e](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/27111a3822703e01f4dd5ebc1ea457a9b57ebe7e) — handle out-of-stock cart items safely.
- **What I learned**: Browser storage can be stale or edited; validate and normalize persisted state before using it.

## Issue 4 — Reordering could add only part of an old order

- **Symptom**: If an order had multiple products and one was unavailable, earlier products could already have been added to the cart before the reorder failed.
- **Reproduction steps (regression check)**:
  1. Sign in and open an order containing at least two products.
  2. Arrange for one requested product quantity to exceed its available stock.
  3. Choose **Reorder Items**.
  4. Verify the reorder reports failure and none of that order's items are added to the cart.
- **Tool used**: Git CLI — `git show eb82ae79d5519fa2b26ea86075a5eb54f781843c`.
- **Tool result**: Confirmed commit `fix(orders): make reorder atomic`; it changes `src/contexts/CartContext.tsx` and `src/orders/OrderDetailsPage.tsx` to validate all additions before dispatching cart updates. This was source-history inspection, not a browser run.
- **Root cause**: Reorder was implemented as independent item additions, so a later failure could leave earlier updates applied.
- **Fix commit**: [eb82ae79d5519fa2b26ea86075a5eb54f781843c](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/eb82ae79d5519fa2b26ea86075a5eb54f781843c) — make reorder atomic.
- **What I learned**: Validate a multi-item operation completely before applying any state changes.

## Issue 5 — Clearing profile data left the cart visible in the current session

- **Symptom**: After clearing saved profile/shop data, the cart badge and in-memory cart could still show items until a reload.
- **Reproduction steps (regression check)**:
  1. Sign in and add a product to the cart.
  2. Open Profile and choose **Clear Local Data**; confirm the action.
  3. Verify the cart badge updates immediately and the cart is empty without reloading.
- **Tool used**: Git CLI — `git show 64cdb5d46eda931cdae720684b9d14f16392ac20`.
- **Tool result**: Confirmed commit `fix(profile): clear cart context with local data`; it changes `src/profile/ProfilePage.tsx` to clear the in-memory cart through its context as well as clearing local data. This was source-history inspection, not a browser run.
- **Root cause**: The profile page changed storage directly, bypassing the state owner responsible for the live cart.
- **Fix commit**: [64cdb5d46eda931cdae720684b9d14f16392ac20](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/64cdb5d46eda931cdae720684b9d14f16392ac20) — clear cart context together with local data.
- **What I learned**: Update shared state through its context/API rather than modifying its storage behind the state owner's back.
