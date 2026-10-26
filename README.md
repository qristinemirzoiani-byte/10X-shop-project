# 10X Shop — Frontend Diploma Project (2026 Batch)

A modern, responsive e-commerce web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **React Router**. This project represents the comprehensive capstone diploma defense for the 10X Front-end Academy.

---

## 🚀 Live Demo & Status
- **Current Milestone**: Phase 1 — Authentication, State Management & Design System.
- **Node Environment**: Node.js 20+ / Vite.

---

## 🛠️ Tech Stack & Architecture

- **Core Library**: React 19 (`strict: true`)
- **Language**: TypeScript with strict type-safety
- **Styling**: Tailwind CSS v4 (Glassmorphic dark design system with neon accents)
- **State Management**: React Context API (`AuthContext`, `CartContext`)
- **Routing**: React Router (`react-router`)
- **API Source**: [DummyJSON Products API](https://dummyjson.com/products)
- **Icons**: Lucide React (`lucide-react`)
- **Build Tool**: Vite

---

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI primitives (FormField, Button, Logo, Header)
├── contexts/            # Global state providers (AuthContext, CartContext)
├── pages/               # Application view routes (LoginPage, CatalogPage, CartPage)
├── types/               # TypeScript data interfaces (products.ts, auth.ts)
├── App.tsx              # Root component wrapped with Providers
├── main.tsx             # Application bootstrap entry point
└── index.css            # Tailwind CSS v4 configuration

✨ Key Features Implemented
Modular Design System:
FormField: Reusable controlled input with real-time validation and error states.
Button: Gradient action button with customizable variants.
Logo: Vector-based 10X brand asset.

**Authentication Flow (AuthContext):
Single source of truth for user authentication state.
Login, Sign Up, and Logout state handlers.
Guest vs authenticated user session awareness.

** Interactive Validation:
Required field checks with visual asterisks.
Password length validation (minimum 6 characters).
Email format checking in sign-up mode.

💻 Getting Started Locally
Clone the repository:
git clone <https://github.com/qristinemirzoiani-byte/10X-shop-project>
cd 10X-shop-project

Install dependencies:
npm install

Start the development server:
npm run dev

Build for production:
npm run build

📚 Project Documentation
PLAN.md: 28-step roadmap and milestone tracking.
REPORT.md: Architectural decisions and technical trade-offs.
DEBUG-LOG.md: Issue tracking, bug fixes, and React 19 type migrations.
COMPATIBILITY.md: Browser and device compatibility audit.

## 📌 Progress Update (Sprint 1 - Layout & Core Architecture)
- **Theme Management**: Implemented `ThemeContext` with dark/light mode toggling, HTML class sync, and localStorage persistence.
- **Header & Navigation**: Built responsive header with custom Logo, theme toggle switch, cart indicator, and authentication state navigation.
- **Sidebar & Categories**: Integrated full-height categories sidebar with deep-linking query params (`?category=...`).
- **Layout Architecture**: Unified responsive layout using React Router `<Outlet />`, resolving margin offsets and styling consistency.
- **TypeScript Optimization**: Strict type checking with clean imports (`react-router`) and comprehensive English documentation.

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
   - *Resolution*: Added CSS pseudo-element rule `input::-ms-reveal { display: none; }`.