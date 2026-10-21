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