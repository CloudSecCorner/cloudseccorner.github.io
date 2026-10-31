# Modern Responsive Navigation Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the site navigation into a modern, ultra-responsive navigation bar inspired by developer platforms like Vercel and Supabase, featuring an "Architectures ▾" dropdown on desktop (`≥ 1024px`) and a categorized card dropdown on mobile/tablet (`< 1024px`).

**Architecture:**
- **Desktop (`≥ 1024px`)**: Streamlined 6-item pill bar (`Home`, `Architectures ▾`, `Tools`, `Labs`, `Blog`, `About`) reducing width footprint by 50% so it fits comfortably on 1024px+ screens without wrapping. Clicking/hovering "Architectures ▾" opens an elegant floating mega-card with AWS, Azure, GCP, and KSPM items.
- **Mobile (`< 1024px`)**: Sleek header with fluid brand and animated hamburger toggle that opens a categorized attached card menu with 48px tap targets, provider icons, and smooth dimmed backdrop blur.
- **SSR & SPA Parity**: Implemented synchronously across Phoenix SSR (`app.html.heex` + `site.js`) and Vite React SPA (`Nav.jsx`).

---

### Tasks

- [ ] **Task 1: Define CSS classes for desktop dropdown and mobile layout**
  - Add `.kube-desktop-nav` (flex at `≥ 1024px`, none at `< 1024px`), `.kube-mobile-actions` (flex at `< 1024px`, none at `≥ 1024px`), and `.kube-desktop-dropdown` styling in `src/index.css`.
  - Sync `.kube-desktop-nav`, `.kube-mobile-actions`, `.kube-desktop-dropdown`, and `.kube-mobile-dropdown` to `priv/static/assets/app.css`.
  - Verify zero CSS errors or syntax violations.

- [ ] **Task 2: Implement modern navigation in React SPA (`src/components/Nav.jsx`)**
  - Add desktop "Architectures ▾" dropdown button with hover and click state, chevron flip animation, and floating card menu.
  - Implement categorized mobile attached dropdown with provider icons, sublabels, and badges.
  - Add click-outside listener and backdrop blur overlay.
  - Run `npm test` and `npm run build` to verify bundle and TypeScript/JSX validity.

- [ ] **Task 3: Implement modern navigation in Phoenix SSR (`app.html.heex` & `site.js`)**
  - Update `lib/cloud_security_corner_web/layouts/app.html.heex` with the matching desktop "Architectures ▾" dropdown and mobile menu.
  - Update `priv/static/site.js` to handle both desktop dropdown toggling/keyboard navigation and mobile menu toggling.
  - Run `mix format --check-formatted` and `mix test`.

- [ ] **Task 4: Export static site and verify full responsiveness**
  - Run `mix site.export --output _site`.
  - Validate mobile viewports (320px, 375px, 414px) and tablet viewports (768px, 1024px) and desktop (1280px, 1440px).
  - Check `git diff --check` for whitespace compliance.
  - Commit and push to `origin main`.
