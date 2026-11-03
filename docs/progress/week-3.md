# Week 3 — Cart, checkout, and orders

> Retrospective summary based on the implementation and the four-week WBS in `PLAN.md`. Actual dates and hours worked were not tracked; the 18 hours below are the plan estimate, not a timesheet.

## Planned scope

- Implement cart state, persistence, quantity/stock rules, and totals (8 h).
- Implement checkout validation and local order creation (5 h).
- Implement order history/details, status, and reorder (5 h).
- **Planned effort:** 18 hours.

## Progress and outcome

- **Status: Complete** for the planned Week 3 scope.
- The cart supports persisted items, quantity and stock constraints, and totals.
- Checkout validates order details and creates orders in browser storage.
- Signed-in demo users can view order history/details and reorder; order data and checkout remain local/demo flows.

## Evidence

- [Cart context](../../src/contexts/CartContext.tsx)
- [Cart page](../../src/pages/CartPage.tsx)
- [Checkout form](../../src/checkout/CheckoutForm.tsx)
- [Order pages and components](../../src/orders/)
- [Work breakdown and status](../../PLAN.md)

## Carryover and risks

- No Week 3 implementation item is listed as open in the current WBS.
- Cart, checkout, and order persistence use browser storage; they do not provide server-side transactions, payment processing, or production account security.
