# 10X Shop — Architecture & Technical Report

## 1. Executive Summary
The 10X Shop application is designed with modern React 19 principles, prioritizing component reusability, strict TypeScript type-safety, and single-source-of-truth state management.

## 2. Key Architecture Decisions

### A. Context API for Authentication (`AuthContext`)
- **Problem**: Need to access the authenticated user's state across multiple distant components (Header, LoginPage, CheckoutPage) without prop-drilling.
- **Solution**: Created a centralized `AuthContext` coupled with a custom hook `useAuth()`.
- **Benefit**: Ensures any component can securely read session data or trigger login/logout handlers with zero coupling.

### B. Component Decomposition & DRY Discipline
- **Initial State**: `LoginPage.tsx` originally contained repeated raw `<input>` elements and styling classes, bloating the file to nearly 180 lines.
- **Refactoring Strategy**: Extracted atomic primitives:
  1. `FormField`: Encapsulates label, input, optional indicators (`*`), and validation error feedback.
  2. `Button`: Standardizes primary gradient styling and button behaviors.
  3. `Logo`: Isolates brand vector graphics.
- **Outcome**: Reduced `LoginPage.tsx` complexity by ~65%, achieving clean separation of presentation and validation logic.

## 3. TypeScript Type Discipline
- Strict type definitions (`interface AuthUser`, `interface FormFieldProps`).
- Explicit distinction between mandatory props (`label: string`) and optional props (`type?: string`, `error?: string`).
- Type-safe event signatures (`onChange: (e: React.ChangeEvent<HTMLInputElement>) => void`).

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