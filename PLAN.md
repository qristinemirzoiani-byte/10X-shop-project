# 10X Shop — 28-Step Development Roadmap

## Phase 0: Project Initialization & Tooling
- [x] **Step 1**: Initialize Vite + React 19 + TypeScript workspace.
- [x] **Step 2**: Configure Tailwind CSS v4 and global theme tokens.
- [x] **Step 3**: Establish Git version control and project documentation (`.md` files).

## Phase 1: Authentication & Core Design System
- [x] **Step 4**: Design `AuthContext` state store (`user`, `login`, `logout`).
- [x] **Step 5**: Create modular atomic UI components:
  - `FormField.tsx`: Controlled input with live error indicators.
  - `Button.tsx`: Reusable gradient action button.
  - `Logo.tsx`: 10X vector branding asset.
- [x] **Step 6**: Implement `LoginPage.tsx` with toggleable Login / Sign Up modes.
- [x] **Step 7**: Wire `AuthProvider` into root `App.tsx`.

## Phase 2: Navigation & Routing (Upcoming)
- [ ] **Step 8**: Configure React Router (`react-router`) with declarative browser routes.
- [ ] **Step 9**: Build persistent navigation `Header.tsx` (Logo, NavLinks, Cart Counter, User Profile).
- [ ] **Step 10**: Create `Layout.tsx` shell with `<Outlet />` and dynamic route rendering.

## Phase 3: Catalog & DummyJSON Integration
- [ ] **Step 11**: Define TypeScript interfaces for Product models.
- [ ] **Step 12**: Fetch product listings from `https://dummyjson.com/products`.
- [ ] **Step 13**: Build `ProductCard.tsx` with price, image, rating, and quick-add actions.
- [ ] **Step 14**: Implement `ProductGrid.tsx` with responsive breakpoints.
- [ ] **Step 15**: Implement search, category filters, and sorting.

## Phase 4: Cart & Persistent State
- [ ] **Step 16**: Implement `CartContext.tsx` with `localStorage` persistence.
- [ ] **Step 17**: Add to cart, increment, decrement, and remove operations.
- [ ] **Step 18**: Build `CartPage.tsx` and `CartItem.tsx` with live subtotal calculation.
- [ ] **Step 19**: Implement Checkout form with Formik and Yup validation.

## Phase 5: Polish & Final Defense Delivery
- [ ] **Step 20**: Error handling and 404 `NotFoundPage.tsx`.
- [ ] **Step 21**: Responsive layout audit across all breakpoints.
- [ ] **Step 22**: Production build verification (`npm run build`).