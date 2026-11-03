# 10X Shop — Debugging Log

The cases below are real fixes from the Git history. Each linked commit shows the code before and after the fix. The reproduction steps are regression checks for the reported behavior; no pre-fix screenshots or browser traces were retained.

## Issue 1 — Checkout opened with an empty cart

- **Symptom**: Opening checkout without cart items left the user on a checkout screen that could not produce an order.
- **Reproduction / regression check**:
  1. Clear the cart.
  2. Open `/checkout` directly.
  3. Confirm the app redirects to `/cart` and explains that products must be added first.
- **Tool and result**: Inspected the route behavior in the before/after Git diff (`git show 76c11fc`). Before the fix, checkout rendered its own empty-cart message; the fix redirects to `/cart` and passes a helpful message in router state.
- **Root cause**: Checkout handled the empty state separately instead of sending the user to the page where they can manage the cart.
- **Fix**: [Commit 76c11fc](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/76c11fc) — redirect empty checkout to the cart page.
- **What I learned**: Guard invalid page state at the route/page boundary and guide the user to the next useful action.

## Issue 2 — Order-save failure could look like a successful checkout

- **Symptom**: If saving an order to browser storage failed, the user could still see a success state and lose the cart contents.
- **Reproduction / regression check**:
  1. Add an item to the cart and open checkout.
  2. In DevTools, make `localStorage.setItem` throw for the order-storage key.
  3. Submit the checkout form.
  4. Confirm an error is shown and the cart is not cleared.
- **Tool and result**: Inspected the before/after Git diff (`git show 50c7e16`). Before the fix, storage failure was only logged and execution continued to clear the cart and show confirmation. The fix catches the failure, displays an alert, and only clears the cart after a successful save.
- **Root cause**: Persistence errors were swallowed, and the success path was not conditional on storage succeeding.
- **Fix**: [Commit 50c7e16](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/50c7e16) — report order-placement failures.
- **What I learned**: Treat persistence as part of the checkout transaction; do not show success or discard user data after a failed save.

## Issue 3 — Persisted cart data could contain unavailable or invalid quantities

- **Symptom**: Cart contents restored from older localStorage data could include products with no available stock or quantities outside the available range.
- **Reproduction / regression check**:
  1. In DevTools → Application → Local Storage, edit the saved cart so an item has `stock: 0`, or a quantity greater than its stock.
  2. Reload the app and open the cart.
  3. Confirm unavailable items are discarded and remaining quantities are bounded by stock.
- **Tool and result**: Inspected the before/after Git diff (`git show 27111a3`). Before the fix, stored cart items were accepted with only an array check. The fix filters unavailable items and clamps restored quantities.
- **Root cause**: Data read from localStorage was trusted without normalizing it against current stock constraints.
- **Fix**: [Commit 27111a3](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/27111a3) — handle out-of-stock cart items safely.
- **What I learned**: Browser storage can be stale or edited; validate and normalize persisted state before using it.

## Issue 4 — Reordering could add only part of an old order

- **Symptom**: If an order had multiple products and one was unavailable, earlier products could already have been added to the cart before the reorder failed.
- **Reproduction / regression check**:
  1. Open an order containing at least two products.
  2. Make one product unavailable or set its requested quantity above current stock.
  3. Choose **Reorder Items**.
  4. Confirm the operation reports failure and adds none of the order's products.
- **Tool and result**: Inspected the before/after Git diff and parent version (`git show eb82ae7`). The previous code called `addItem` once per product; the fix validates all requested additions and available stock before dispatching any cart updates.
- **Root cause**: Reorder was implemented as independent item additions, so a later failure could leave earlier updates applied.
- **Fix**: [Commit eb82ae7](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/eb82ae7) — make reorder atomic.
- **What I learned**: Validate a multi-item operation completely before applying any state changes.

## Issue 5 — Clearing profile data left the cart visible in the current session

- **Symptom**: After clearing saved profile/shop data, the cart badge and in-memory cart could still show items until a reload.
- **Reproduction / regression check**:
  1. Add products to the cart and sign in.
  2. Open Profile and choose the action that clears local shop data.
  3. Confirm the cart badge and cart page update immediately without reloading.
- **Tool and result**: Inspected the before/after Git diff (`git show 64cdb5d`). Before the fix, the profile page removed the cart's localStorage key directly; the fix calls the Cart context's `clearCart` operation so persistent and in-memory state stay synchronized.
- **Root cause**: The profile page changed storage directly, bypassing the state owner responsible for the live cart.
- **Fix**: [Commit 64cdb5d](https://github.com/qristinemirzoiani-byte/10X-shop-project/commit/64cdb5d) — clear cart context together with local data.
- **What I learned**: Update shared state through its context/API rather than modifying its storage behind the state owner's back.
