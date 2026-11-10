# Civo + Hetzner, Rosetta Stone Matrix, Compliance Explorer, Stack Exporter & Threat Modeling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand CloudSecCorner with 2 new cloud providers (Civo Cloud & Hetzner Cloud, 1,032 architecture blueprints each), an interactive Cross-Cloud Rosetta Stone comparison matrix across all 11 providers, a Regulatory Compliance Framework Explorer (CIS, NIST, PCI-DSS, SOC 2, MITRE ATT&CK), a Multi-Blueprint Unified Terraform & OPA Policy Pack Exporter, and an interactive STRIDE / MITRE ATT&CK Threat Modeling overlay in the diagram viewer.

**Architecture:** 
1. Provider Expansion: Generate 24 SVG service icons and provider logos for Civo and Hetzner; generate 1,032 architecture blueprints each with Obsidian Pele SVGs, OPA Rego, and Terraform IaC; create Phoenix Elixir controllers, HEEX templates, router endpoints, fallback scripts, and React frontend views.
2. Cross-Cloud Rosetta Stone: Implement `/cross-cloud-matrix` comparing security implementations across all 11 platforms with side-by-side CLI audit commands, Terraform IaC, and OPA Rego policies.
3. Compliance Explorer: Implement `/compliance` mapping all blueprints to CIS Benchmarks, NIST SP 800-53, PCI-DSS 4.0, SOC 2 Type II, and MITRE ATT&CK with coverage scorecards.
4. Unified Stack Exporter: Implement a global stack builder allowing users to select blueprints across providers and export a stitched Terraform module and unified OPA Rego policy bundle.
5. Threat Modeling Overlay: Enhance `DiagramViewer.jsx` with an interactive STRIDE and MITRE ATT&CK threat overlay visualizing entry points, attack paths, and defensive barriers.

**Tech Stack:**
- Elixir 1.17+ / Phoenix 1.7.14 (Controllers, HEEX views, router, Content module, static site exporter)
- React 18 / Vite 5 / Tailwind CSS (Components, state management, interactive canvas & drawers)
- Open Policy Agent (OPA) Rego v1
- HashiCorp Terraform IaC
- Obsidian Pele SVG & Mermaid.js diagram engines
- Node.js ESM validation scripts & Vitest

---

## Global Constraints
- Every provider must have >= 1,000 architecture blueprints in `priv/data/<provider>-best-practices.json` mirrored to `priv/static/data/` and `public/data/`.
- All routes must be registered in `CloudSecurityCornerWeb.Router` and `Mix.Tasks.Site.Export`.
- All HEEX templates for architecture views must include fallback `<script>` tags for non-Vite environments.
- All tests must pass: `npm test`, `npm run check`, `mix test`, `mix site.export --require-frontend`, and `npm run test:export`.
- Code changes must preserve existing comments, docstrings, and formatting.

## Review Focus
1. Icon directory resolution in `scripts/lib/diagram-icons.mjs` must include `'civo'` and `'hetzner'`.
2. Generator scripts must produce valid JSON with no missing fields (`id`, `title`, `category`, `description`, `terraform`, `policy`, `diagram`, `threat_model`, `compliance`).
3. Cross-Cloud Matrix must handle all 11 providers gracefully without throwing on undefined provider keys.
4. Stack Exporter must deduplicate provider blocks and resource addresses when generating unified Terraform configurations.
5. Elixir tests in `test/cloud_security_corner_test.exs` and `scripts/validate-site-export.mjs` must assert all new routes return HTTP 200.

---

### Task 1: Generate Civo & Hetzner Service Icons and Provider Logos

**Files:**
- Create: `scripts/generate_civo_hetzner_icons.js`
- Create: `priv/static/images/provider-logos/civo.svg`
- Create: `priv/static/images/provider-logos/hetzner.svg`
- Create: `public/images/provider-logos/civo.svg`
- Create: `public/images/provider-logos/hetzner.svg`
- Create: `priv/static/images/civo-icons/` (24 SVG icons)
- Create: `public/images/civo-icons/` (24 SVG icons)
- Create: `priv/static/images/hetzner-icons/` (24 SVG icons)
- Create: `public/images/hetzner-icons/` (24 SVG icons)
- Modify: `scripts/lib/diagram-icons.mjs`

**Interfaces:**
- Produces: 24 Civo SVG icons, 24 Hetzner SVG icons, 2 provider logos, updated `diagram-icons.mjs` supporting `'civo'` and `'hetzner'`.

- [ ] **Step 1: Write `scripts/generate_civo_hetzner_icons.js`**
  Implement SVG icon generator with brand palettes (Civo `#2293EE`, Hetzner `#D50C2D`).
- [ ] **Step 2: Run icon generator**
  Run: `node scripts/generate_civo_hetzner_icons.js`
  Expected: 24 Civo and 24 Hetzner icons created in `priv/static/images/` and `public/images/`.
- [ ] **Step 3: Update `scripts/lib/diagram-icons.mjs`**
  Add `'civo'` and `'hetzner'` to `directories` array.
- [ ] **Step 4: Commit icons**
  Run: `git add public/images/ priv/static/images/ scripts/ && git commit -m "feat: add Civo and Hetzner service icons and provider logos"`

---

### Task 2: Architecture Datasets for Civo & Hetzner (1,032 Blueprints Each)

**Files:**
- Create: `scripts/generate_civo_best_practices.js`
- Create: `scripts/generate_hetzner_best_practices.js`
- Create: `priv/data/civo-best-practices.json`
- Create: `priv/data/hetzner-best-practices.json`
- Create: `public/reference-architectures/civo/` (`main.tf`, `policy.rego`, `diagram.mmd`)
- Create: `public/reference-architectures/hetzner/` (`main.tf`, `policy.rego`, `diagram.mmd`)
- Modify: `scripts/lib/developer-architectures.mjs`
- Modify: `scripts/lib/control-diagrams.mjs`
- Modify: `scripts/generate-reference-architectures.mjs`
- Modify: `scripts/generate-home-catalog.mjs`
- Modify: `scripts/update-diagrams.mjs`
- Modify: `scripts/validate-content.mjs`

**Interfaces:**
- Produces: 1,032 Civo blueprints, 1,032 Hetzner blueprints with embedded STRIDE threat models and compliance tags, runnable reference architectures.

- [ ] **Step 1: Write Civo and Hetzner blueprint generators**
  Include 24 categories each (K3s, Instances, Deep Lake GPU, Storage, Firewalls, Networks, Databases, etc. for Civo; Servers, Networks, Firewalls, Load Balancers, Robot, Storage Box, etc. for Hetzner). Enrich each blueprint with `threat_model` (STRIDE) and `compliance` (CIS, NIST, PCI-DSS, SOC 2, MITRE).
- [ ] **Step 2: Run dataset generators and mirror to `priv/static/data/` and `public/data/`**
  Run: `node scripts/generate_civo_best_practices.js && node scripts/generate_hetzner_best_practices.js`
  Expected: Both JSON files contain 1,032 blueprints.
- [ ] **Step 3: Register platforms in `scripts/lib/developer-architectures.mjs` and `control-diagrams.mjs`**
  Register `platforms.civo` (`civo`) and `platforms.hetzner` (`hcloud`).
- [ ] **Step 4: Add runnable reference architectures in `generate-reference-architectures.mjs`**
  Run: `node scripts/generate-reference-architectures.mjs`
- [ ] **Step 5: Regenerate home catalog and update diagrams**
  Run: `node scripts/generate-home-catalog.mjs && node scripts/update-diagrams.mjs`
- [ ] **Step 6: Validate content and diagrams**
  Run: `node scripts/validate-diagrams.mjs && node scripts/validate-content.mjs`
  Expected: PASS
- [ ] **Step 7: Commit datasets and pipelines**
  Run: `git add scripts/ priv/data/ priv/static/data/ public/data/ public/reference-architectures/ && git commit -m "feat: generate 1,032 Civo and 1,032 Hetzner architecture blueprints"`

---

### Task 3: Elixir Backend Support for Civo & Hetzner

**Files:**
- Modify: `lib/cloud_security_corner/content.ex`
- Create: `lib/cloud_security_corner_web/controllers/civo_architecture_controller.ex`
- Create: `lib/cloud_security_corner_web/controllers/hetzner_architecture_controller.ex`
- Create: `lib/cloud_security_corner_web/civo_architecture_html.ex`
- Create: `lib/cloud_security_corner_web/civo_architecture_html/index.html.heex`
- Create: `lib/cloud_security_corner_web/hetzner_architecture_html.ex`
- Create: `lib/cloud_security_corner_web/hetzner_architecture_html/index.html.heex`
- Modify: `lib/cloud_security_corner_web/router.ex`
- Modify: `lib/cloud_security_corner_web/layouts/app.html.heex`
- Modify: `lib/cloud_security_corner_web/page_html/home.html.heex`
- Modify: `lib/mix/tasks/site.export.ex`
- Modify: `test/cloud_security_corner_test.exs`

**Interfaces:**
- Produces: `CloudSecurityCorner.Content.civo_best_practices/0`, `civo_practice_count/0`, `hetzner_best_practices/0`, `hetzner_practice_count/0`, routes `/civo-architectures` and `/hetzner-architectures`.

- [ ] **Step 1: Update `Content.ex`**
  Add ingestion of `civo-best-practices.json` and `hetzner-best-practices.json`, add count helpers.
- [ ] **Step 2: Create controllers and HEEX templates**
  Create `CivoArchitectureController`, `HetznerArchitectureController`, and corresponding HEEX templates with fallback `<script>` tags.
- [ ] **Step 3: Update `router.ex` and `site.export.ex`**
  Add `/civo-architectures` and `/hetzner-architectures`.
- [ ] **Step 4: Update navigation and hero in `app.html.heex` and `home.html.heex`**
  Add Civo and Hetzner to the Architecture dropdowns and hero buttons.
- [ ] **Step 5: Add ExUnit test assertions in `test/cloud_security_corner_test.exs`**
  Add tests for Civo and Hetzner practice counts and HTTP 200 responses.
- [ ] **Step 6: Run `mix test`**
  Run: `mix test`
  Expected: All ExUnit tests pass.
- [ ] **Step 7: Commit Elixir backend**
  Run: `git commit -am "feat: add Elixir backend, controllers, and tests for Civo and Hetzner"`

---

### Task 4: React Frontend Views for Civo & Hetzner

**Files:**
- Create: `src/components/CivoArchitectures.jsx`
- Create: `src/components/HetznerArchitectures.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Nav.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/LandingPage.jsx`

**Interfaces:**
- Produces: Interactive React architecture viewers for Civo and Hetzner, navigation links, and bundle chunks.

- [ ] **Step 1: Implement `CivoArchitectures.jsx` and `HetznerArchitectures.jsx`**
  Full interactive filtering, category tabs, drawer view, IaC copy, Rego policy inspection, and SVG diagrams.
- [ ] **Step 2: Wire routes in `App.jsx`**
  Add lazy routes for `/civo-architectures` and `/hetzner-architectures`.
- [ ] **Step 3: Update `Nav.jsx`, `Footer.jsx`, and `LandingPage.jsx`**
  Include Civo and Hetzner pills and cards.
- [ ] **Step 4: Run `npm run build`**
  Run: `npm run build`
  Expected: Vite builds successfully with zero errors.
- [ ] **Step 5: Commit React frontend**
  Run: `git commit -am "feat: add React frontend views and navigation for Civo and Hetzner"`

---

### Task 5: Cross-Cloud Security Rosetta Stone (Comparison Matrix)

**Files:**
- Create: `src/data/cross-cloud-matrix.json` (Structured control matrix across all 11 providers)
- Create: `src/components/CrossCloudMatrix.jsx`
- Create: `lib/cloud_security_corner_web/controllers/matrix_controller.ex`
- Create: `lib/cloud_security_corner_web/matrix_html.ex`
- Create: `lib/cloud_security_corner_web/matrix_html/index.html.heex`
- Modify: `lib/cloud_security_corner_web/router.ex`
- Modify: `lib/mix/tasks/site.export.ex`
- Modify: `src/App.jsx`
- Modify: `src/components/Nav.jsx`
- Modify: `scripts/validate-site-export.mjs`

**Interfaces:**
- Consumes: Provider configurations across all 11 providers.
- Produces: Route `/cross-cloud-matrix` with side-by-side control comparison, CLI audit commands, Terraform IaC, and OPA Rego rules.

- [ ] **Step 1: Create matrix dataset `src/data/cross-cloud-matrix.json`**
  Define 10 foundational security domains (IAM, Kubernetes, Storage, Networks, DBaaS, Secrets, Containers, Audit Logs, Firewalls, Edge/WAF) across AWS, Azure, GCP, KSPM, CNAPP, Vultr, Oracle, DigitalOcean, Alibaba, Civo, and Hetzner.
- [ ] **Step 2: Create `CrossCloudMatrix.jsx`**
  Build interactive matrix with provider selector pills, search filter, control deep-dive modal, and side-by-side code/CLI comparisons.
- [ ] **Step 3: Create Elixir Controller, HEEX template, and router endpoint**
  Add `/cross-cloud-matrix` to Phoenix router and `Site.Export`.
- [ ] **Step 4: Wire route in `App.jsx` and add nav link in `Nav.jsx`**
- [ ] **Step 5: Test and build**
  Run: `npm test && npm run build`
- [ ] **Step 6: Commit Rosetta Stone feature**
  Run: `git commit -am "feat: implement Cross-Cloud Security Rosetta Stone matrix across 11 providers"`

---

### Task 6: Regulatory Compliance Framework Explorer

**Files:**
- Create: `src/data/compliance-frameworks.json`
- Create: `src/components/ComplianceExplorer.jsx`
- Create: `lib/cloud_security_corner_web/controllers/compliance_controller.ex`
- Create: `lib/cloud_security_corner_web/compliance_html.ex`
- Create: `lib/cloud_security_corner_web/compliance_html/index.html.heex`
- Modify: `lib/cloud_security_corner_web/router.ex`
- Modify: `lib/mix/tasks/site.export.ex`
- Modify: `src/App.jsx`
- Modify: `src/components/Nav.jsx`

**Interfaces:**
- Produces: Route `/compliance` providing compliance framework browsing (CIS, NIST, PCI-DSS, SOC 2, MITRE ATT&CK) with interactive scorecards and direct blueprint links.

- [ ] **Step 1: Create compliance dataset `src/data/compliance-frameworks.json`**
  Map security controls to standard frameworks and calculate coverage scorecards across all 11 providers.
- [ ] **Step 2: Create `ComplianceExplorer.jsx`**
  Interactive framework tabs, compliance scorecards, searchable requirement tables, and direct links to blueprints.
- [ ] **Step 3: Register controller, HEEX template, and router endpoint `/compliance`**
- [ ] **Step 4: Wire route in `App.jsx` and nav link in `Nav.jsx`**
- [ ] **Step 5: Test and build**
  Run: `npm test && npm run build`
- [ ] **Step 6: Commit Compliance Explorer**
  Run: `git commit -am "feat: implement Regulatory Compliance Framework Explorer (CIS, NIST, PCI-DSS, SOC 2, MITRE)"`

---

### Task 7: Multi-Blueprint Unified Terraform & Policy Pack Exporter

**Files:**
- Create: `src/context/StackBuilderContext.jsx`
- Create: `src/components/StackBuilderDrawer.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Nav.jsx`
- Modify: `src/components/*Architectures.jsx` (Add "Add to Stack" action button)

**Interfaces:**
- Produces: Global Stack Builder context, floating drawer with item count, dynamic multi-resource `main.tf` generator, combined `policy.rego` bundle, and one-click ZIP / clipboard export.

- [ ] **Step 1: Create `StackBuilderContext.jsx`**
  Manage stack items in `localStorage`, provide `addToStack`, `removeFromStack`, `clearStack`, and generation methods for unified Terraform and Rego.
- [ ] **Step 2: Create `StackBuilderDrawer.jsx`**
  Collapsible drawer showing selected blueprints, total resource count, live combined syntax-highlighted `main.tf` & `policy.rego`, and "Export Stack" download button.
- [ ] **Step 3: Add "Add to Stack" button in architecture cards and detail drawer**
  Update blueprint card and drawer components so users can click to add any blueprint to their custom stack.
- [ ] **Step 4: Update `Nav.jsx` with active Stack pill counter**
- [ ] **Step 5: Test and build**
  Run: `npm test && npm run build`
- [ ] **Step 6: Commit Stack Exporter**
  Run: `git commit -am "feat: implement Multi-Blueprint Unified Terraform and Policy Pack Exporter"`

---

### Task 8: Interactive STRIDE / MITRE ATT&CK Threat Modeling Overlay

**Files:**
- Modify: `src/components/DiagramViewer.jsx`
- Modify: `src/components/DiagramViewer.css`
- Modify: `src/components/*Architectures.jsx`

**Interfaces:**
- Consumes: `blueprint.threat_model` with STRIDE attack vectors and mitigations.
- Produces: Three-way toggle in diagram viewer: `[Architecture]`, `[Threat Model (STRIDE)]`, `[MITRE ATT&CK]`, rendering interactive threat cards, attack path overlays, and defense barriers directly over diagrams.

- [ ] **Step 1: Enhance `DiagramViewer.jsx`**
  Add mode switcher: Architecture, STRIDE Threat Model, MITRE ATT&CK Matrix.
- [ ] **Step 2: Add threat overlay visuals in `DiagramViewer.css`**
  Pills for Spoofing (Red), Tampering (Orange), Repudiation (Yellow), Info Disclosure (Purple), DoS (Amber), Elevation of Privilege (Rose).
- [ ] **Step 3: Add threat vector inspection cards**
  Clicking an attack vector displays attacker goal, attack technique, impacted resource, and the OPA Rego rule / Terraform attribute preventing the exploit.
- [ ] **Step 4: Test and build**
  Run: `npm test && npm run build`
- [ ] **Step 5: Commit Threat Modeling Overlay**
  Run: `git commit -am "feat: implement interactive STRIDE and MITRE ATT&CK threat modeling diagram overlay"`

---

### Task 9: Full System Verification, Export & Production Deployment

**Files:**
- Modify: `scripts/validate-site-export.mjs`
- Modify: `test/cloud_security_corner_test.exs`

- [ ] **Step 1: Run comprehensive tests**
  Run: `npm test && npm run check && mix test`
  Expected: All tests pass.
- [ ] **Step 2: Run static site export and verify all exported routes**
  Run: `mix site.export --require-frontend --output _site && npm run test:export`
  Expected: All 56+ routes exported and verified with zero errors.
- [ ] **Step 3: Commit and push to `main`**
  Run: `git push origin main`
- [ ] **Step 4: Monitor GitHub Actions deployment workflows**
  Verify CI and Pages deployment finish with `conclusion: "success"`.
- [ ] **Step 5: Test live production URLs on `cloudsecuritycorner.com`**
  Confirm HTTP 200 OK across `/civo-architectures`, `/hetzner-architectures`, `/cross-cloud-matrix`, `/compliance`, and verify exporter and threat overlays.
