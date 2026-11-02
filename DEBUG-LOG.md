# 10X Shop — Debugging & Engineering Log

### Issue #001: Deprecated `React.FormEvent` Type in React 19
- **Date**: October 21, 2026
- **Symptom**: VS Code displayed a strikethrough (deprecated warning) on `React.FormEvent` in the `handleSubmit` event signature.
- **Root Cause**: React 19 typings updated HTML form event signatures to prefer native `SubmitEvent` or explicit generic binding (`React.FormEvent<HTMLFormElement>`).
- **Resolution**: Updated the event parameter typing to `SubmitEvent` (or `React.FormEvent<HTMLFormElement>`), eliminating the warning and ensuring future-proof compliance.

---

### Issue #002: Form State Duplication & Maintenance Overhead
- **Date**: October 21, 2026
- **Symptom**: Modifying input styling required editing three separate JSX blocks with identical Tailwind classes.
- **Root Cause**: Tight coupling of form layout and input presentation within a single monolithic page.
- **Resolution**: Created `src/components/FormField.tsx`. Prop-driven API allows passing `label`, `value`, `placeholder`, and `error`, centralizing input styles in one file.

---

### Issue #003: Auth State Missing Context Boundary
- **Date**: October 21, 2026
- **Symptom**: `useAuth must be used within an AuthProvider` runtime error safeguard.
- **Root Cause**: `LoginPage` consumed `useAuth()` without being enclosed by `<AuthProvider>` in the component tree.
- **Resolution**: Wrapped the root view inside `<AuthProvider>` in `src/App.tsx`.

## 📅 Progress Report — Session Highlights

### 1. Features & Components Implemented
- **Orders History (`/orders`)**:
  - Implemented dynamic order history screen restricted to authenticated users.
  - Added deterministic real-time delivery status timeline based on elapsed time:
    - `0–1 min`: Processing (animated clock)
    - `1–3 min`: Shipped (transit truck badge)
    - `3+ min`: Delivered (success checkmark badge)
  - Extracted modular `OrderCard.tsx` component following Single Responsibility principle.
  - Implemented persistent mock order creation stored in `localStorage`.

- **Global Header Search (`SearchBar.tsx`)**:
  - Built standalone `SearchBar` component embedded within the persistent header.
  - Implemented 400ms debounce navigation that routes external queries directly to catalog (`/?q=...`).

- **Products API Layer (`src/api/products.api.ts`)**:
  - Structured standard `fetchProducts` service connected to DummyJSON API.
  - Implemented pagination math (`skip = (page - 1) * limit`), parameterized search (`?q=`), category filtering (`/category/:slug`), and server sorting with client fallback.
  - Integrated `AbortSignal` support for race-condition prevention.

---

### 2. Bugs Identified & Resolved
1. **Controlled Input Freezing in Formik**:
   - *Cause*: `FormField.tsx` omitted the `name` attribute and HTML rest props, preventing Formik's `handleChange` from identifying target inputs.
   - *Resolution*: Extended `React.InputHTMLAttributes<HTMLInputElement>` and passed `{...props}` to the `<input>` element.

2. **Auth Property Mismatch (`isAuthenticated` vs `isLoggedIn`)**:
   - *Cause*: `OrdersPage` attempted to destructure non-existent `isAuthenticated` from `AuthContextType`.
   - *Resolution*: Updated to retrieve `user.isLoggedIn` directly from `useAuth()`.

3. **Browser Native Password Reveal Duplication**:
   - *Cause*: Windows/Chromium default password reveal button conflicted with custom toggle eye icon.
   - *Resolution*: Added CSS pseudo-element rule `input::-ms-reveal { display: none; }
   
   `.

   ---

### Case 5: Client-Side Sorting Fallback Compromise on Paginated Results (API Limitation / Architecture Trade-Off)
- **Symptom**: Upstream DummyJSON API does not reliably support server-side multi-parameter combinations (e.g. `/products/search?q=...` or specific `/products/category/...` combined with `sortBy` and `order`). In some environments or query combinations, the upstream API ignores `sortBy`/`order` parameters and returns items in default insertion order.
- **Reproduction**:
  1. Trigger search query with sort option: `/products/search?q=phone&sortBy=price&order=asc`.
  2. Inspect API response; observe items are not ordered strictly by price.
- **Tool**: Network inspector / REST API contract verification with DummyJSON.
- **Root Cause & Limitation**: The third-party DummyJSON API documentation notes that `sortBy` and `order` query params are only guaranteed on the primary `/products` endpoint. Combined endpoints (`/products/search` or older mock handlers) do not perform full-database server-side ordering.
- **Architectural Compromise / Fallback**:
  In `products.api.ts`, a client-side sort fallback was implemented:
  ```typescript
  if (params.sort && response.products) {
    const sorted = [...response.products];
    if (params.sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (params.sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (params.sort === 'rating-desc') sorted.sort((a, b) => b.rating - a.rating);
    else if (params.sort === 'title-asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return { ...response, products: sorted };
  }
  ```
- **Why this is a compromise, not a complete replacement for server-side sorting**: the API response is paginated before this fallback runs, so the fallback only sorts the current page. If the server ignores `sortBy` and `order`, items across different pages are not guaranteed to be globally ordered. Server-side sorting should remain enabled; this client-side sort only makes the visible page deterministic.