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