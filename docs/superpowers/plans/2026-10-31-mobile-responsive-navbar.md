# Mobile-Responsive Navigation Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the navigation experience into a responsive, touch-optimized, accessible navigation bar with a grouped off-canvas mobile drawer across both React SPA and Phoenix SSR static layouts.

**Architecture:**
1. **Responsive Header Layout:** Move the 9-item center pill menu from `md:flex` to `xl:flex` (or `lg:flex` with optimized sizing) to eliminate horizontal overflow on tablet/mobile screens (768px-1280px).
2. **Accessible Mobile Slide-Over Drawer:** Implement a grouped slide-over drawer in React (`Nav.jsx`) with backdrop blur, scroll locking, Escape key handling, and touch targets (min 44px) categorized into Core, 4,000+ Cloud Architectures (AWS, Azure, GCP, KSPM), and Resources (Tools, Labs, Blog, About).
3. **Phoenix SSR & Static Site Parity:** Mirror the mobile hamburger toggle and slide-over drawer markup in `app.html.heex`, wired via vanilla JavaScript in `priv/static/site.js`.
4. **Announcement Bar Mobile Polish:** Enhance `#pick-up` padding and dismiss button positioning to prevent text overlap on compact screens.

**Tech Stack:** React 19, Tailwind CSS, Phoenix Framework HEEx templates, Vanilla JavaScript (`site.js`), ExUnit & Vitest/Content tests.

**Spec:** Responsive navigation specifications matching modern cloud-native documentation platforms (KubeDaily / Cloudflare style).

## Global Constraints
- Must maintain strict dark/light dual-theming consistency.
- Zero horizontal overflow on any viewport down to 320px width.
- Keyboard accessible (`Esc` closes drawer, `aria-expanded`, `aria-modal="true"`).
- All suites must pass: `npm test`, `npm run build`, `mix format --check-formatted`, `mix test`, and `mix site.export --output _site`.

## Review Focus
1. Tablet viewport (768px - 1024px): center pill menu must not overflow or collide with brand/actions.
2. Mobile viewport (320px - 480px): announcement banner and brand text must not clip or overflow.
3. Mobile Drawer Interaction: opening drawer must freeze background body scroll and dismiss on backdrop click or Escape.
4. Active route styling: current page route must be clearly highlighted in mobile drawer.
5. Phoenix SSR static export parity: drawer must function without React in static exports.

---

### Task 1: Responsive Breakpoints & CSS Enhancements in `index.css` & `app.css`
- [ ] Step 1.1: Add mobile drawer animation and utility classes in `src/index.css`.
- [ ] Step 1.2: Add announcement bar mobile ergonomics (padding for dismiss button).
- [ ] Step 1.3: Synchronize CSS additions to `priv/static/assets/app.css`.

### Task 2: React Component `Nav.jsx` Overhaul
- [ ] Step 2.1: Adjust header breakpoints to `hidden xl:flex` for the 9-item pill menu to prevent tablet breakage.
- [ ] Step 2.2: Implement the accessible off-canvas slide-over drawer with backdrop blur, touch-friendly items, and category groupings (Core, Cloud & K8s Architectures, Resources & Community).
- [ ] Step 2.3: Add body scroll lock, Escape key listener, and backdrop click handler.
- [ ] Step 2.4: Include integrated mobile theme toggle and GitHub link inside drawer footer.

### Task 3: Phoenix SSR & Static Site Synchronization
- [ ] Step 3.1: Update `lib/cloud_security_corner_web/layouts/app.html.heex` to hide `.kube-nav-menu` on mobile/tablet (`hidden xl:flex`), add hamburger toggle button, and render the mobile drawer markup.
- [ ] Step 3.2: Update `priv/static/site.js` with open/close/escape/backdrop mobile drawer logic and body scroll lock.

### Task 4: Verification, Test Suite & Deployment
- [ ] Step 4.1: Run `npm test` and `npm run build` to verify Vite bundle.
- [ ] Step 4.2: Run `mix format --check-formatted` and `mix test` to verify Phoenix backend.
- [ ] Step 4.3: Run `mix site.export --output _site` to verify static HTML export with mobile drawer.
- [ ] Step 4.4: Check `git diff --check` for whitespace cleanliness.
- [ ] Step 4.5: Commit and push changes to `origin/main`.
