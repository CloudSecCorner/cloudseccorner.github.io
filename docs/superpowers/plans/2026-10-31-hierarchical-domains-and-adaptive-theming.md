# 7-Domain Hierarchical Architecture & Adaptive Dual-Theming Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement full dual-theming (light/dark mode) across CloudSecCorner and reorganize the 2,064 AWS and Azure architecture blueprints into 7 Core Cloud Security Domains with full official category names, icons, and live counts.

**Architecture:** 
1. Fix theme bootstrap in HTML `<head>` and global CSS variables in `src/index.css` and `priv/static/assets/app.css`.
2. Convert all page components (`AwsArchitectures.jsx`, `AzureArchitectures.jsx`, `LandingPage.jsx`, and Phoenix templates) to reactive dual-theme Tailwind classes (`bg-slate-50 dark:bg-...`, `text-slate-900 dark:text-white`).
3. Group the 24 AWS and 24 Azure categories into 7 Core Security Domains with high-level domain tabs and updated full category names.
4. Synchronize client-side Phoenix static export controllers and verify.

**Tech Stack:** React 18, Vite, Tailwind CSS, Obsidian Pele, Phoenix / Elixir, Open Policy Agent (Rego), Terraform (HCL).

**Spec:** [`design-doc-hierarchical-domains-and-theming.md`](file:///Users/apple/.gemini/antigravity/brain/e3c0808f-7802-47ee-ae76-61945771bc74/design-doc-hierarchical-domains-and-theming.md)

## Global Constraints
- Preserve all 1,032 AWS and 1,032 Azure architecture blueprints without dataset modifications.
- Retain high-contrast dark macOS terminal chrome (`bg-slate-950 dark:bg-[#07040e]`) for OPA and Terraform code blocks in both light and dark themes for token-safe syntax contrast.
- Ensure zero-flash on page load in both light and dark themes.

---

## Tasks

### Task 1: Theme Bootstrap & CSS Variable Dual-Theming
- [ ] Step 1.1: Fix `index.html` to add inline theme bootstrap script in `<head>` that tests `localStorage.getItem('theme')` or `prefers-color-scheme: dark` and removes `dark` when light. Remove hardcoded `class="dark"` from `<html>`.
- [ ] Step 1.2: Fix `lib/cloud_security_corner_web/layouts/app.html.heex` to remove hardcoded `class="dark"` from `<html>`.
- [ ] Step 1.3: Update `priv/static/assets/initialize-theme.js` to explicitly remove `dark` class if theme is light.
- [ ] Step 1.4: Update `src/components/Nav.jsx` with a `useEffect` that synchronizes `document.documentElement.classList` on initial mount and theme toggle.
- [ ] Step 1.5: Update `src/index.css` and `priv/static/assets/app.css`:
  - Set `:root` CSS variables to light mode values (`--background: 0 0% 100%`, `--foreground: 222.2 84% 4.9%`).
  - Set `.dark` variables to dark mode values.
  - Add light mode support for `.kube-home-hero` (`html:not(.dark) .kube-home-hero`).
- [ ] Step 1.6: Run `npm run build` to verify CSS compilation.

### Task 2: Landing Page Light/Dark Dual-Theme Polish
- [ ] Step 2.1: Update `src/components/LandingPage.jsx`:
  - Change hardcoded `bg-[#161220]` sections to `bg-slate-50 dark:bg-[#161220] border-slate-200 dark:border-brand-gray-700/60`.
  - Change hardcoded `bg-[#1c162b]` cards to `bg-white dark:bg-[#1c162b] border-slate-200 dark:border-brand-gray-700 text-slate-900 dark:text-white`.
  - Ensure all domain pill links adapt cleanly in light mode (`bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-brand-gray-800/70 dark:text-slate-300`).
- [ ] Step 2.2: Mirror updates to `lib/cloud_security_corner_web/page_html/home.html.heex`.
- [ ] Step 2.3: Run `npm run build` and `mix test` to verify.

### Task 3: 7-Domain Hierarchical Architecture & Dual-Theming in AWS Architectures
- [ ] Step 3.1: Define the 7 Core Security Domains in `src/components/AwsArchitectures.jsx`:
  - 1. Identity & Governance (iam-access, governance-org)
  - 2. Compute & Containers (compute-ec2, container-eks, container-ecs)
  - 3. Storage & Databases (storage-s3, database-rds, nosql-dynamodb)
  - 4. Network & Perimeter (network-vpc, perimeter-apigateway, edge-cloudfront, waf-shield, dns-route53)
  - 5. Security, KMS & Posture (security-kms, compliance-sechub, backup-resilience)
  - 6. Telemetry & SIEM (logging-cloudtrail, observability-cloudwatch, threat-guardduty, analytics-opensearch)
  - 7. Serverless & AI Workloads (serverless-lambda, messaging-sns-sqs, decoupled-eventbridge, aiml-sagemaker)
- [ ] Step 3.2: Update all 24 AWS category titles to full official names and verify icons.
- [ ] Step 3.3: Add Domain Group Filter Tabs bar with live blueprint counters.
- [ ] Step 3.4: Implement dual-theming across `AwsArchitectures.jsx`:
  - Root: `bg-slate-50 dark:bg-[#08060d] text-slate-900 dark:text-slate-100`
  - Hero: `from-purple-50/70 via-white to-slate-50 dark:from-[#180e28] dark:via-[#100a1c] dark:to-[#08060d]`
  - Cards: `bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08]`
  - Header: `bg-slate-50/70 dark:bg-white/[0.01]`
  - Tabs: `bg-slate-100/90 dark:bg-[#07050d]`
  - Search: `bg-white dark:bg-white/[0.04] border-slate-300 dark:border-white/10 text-slate-900 dark:text-white`
  - Keep code blocks in macOS terminal dark chrome (`bg-slate-950 dark:bg-[#07040e]`).
- [ ] Step 3.5: Run `npm run build` to verify.

### Task 4: 7-Domain Hierarchical Architecture & Dual-Theming in Azure Architectures
- [ ] Step 4.1: Define the 7 Core Security Domains in `src/components/AzureArchitectures.jsx`:
  - 1. Identity & Governance (azure-ad, azure-policy)
  - 2. Compute & Containers (azure-vm, azure-aks, azure-container-apps)
  - 3. Storage & Databases (azure-blob, azure-sql, azure-cosmosdb)
  - 4. Network & Perimeter (azure-vnet, azure-appgateway, azure-frontdoor, azure-firewall, azure-dns)
  - 5. Security, KMS & Posture (azure-keyvault, azure-defender, azure-backup)
  - 6. Telemetry & SIEM (azure-activity-log, azure-monitor, azure-sentinel, azure-synapse)
  - 7. Serverless & AI Workloads (azure-functions, azure-servicebus, azure-eventgrid, azure-openai)
- [ ] Step 4.2: Update all 24 Azure category titles to full official names and verify icons.
- [ ] Step 4.3: Add Domain Group Filter Tabs bar with live blueprint counters.
- [ ] Step 4.4: Implement dual-theming across `AzureArchitectures.jsx`:
  - Root: `bg-slate-50 dark:bg-[#060a14] text-slate-900 dark:text-slate-100`
  - Hero: `from-blue-50/70 via-white to-slate-50 dark:from-[#091124] dark:via-[#080d1c] dark:to-[#060a14]`
  - Cards: `bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.08]`
  - Header: `bg-slate-50/70 dark:bg-white/[0.01]`
  - Tabs: `bg-slate-100/90 dark:bg-[#050811]`
  - Search: `bg-white dark:bg-white/[0.04] border-slate-300 dark:border-white/10 text-slate-900 dark:text-white`
  - Keep code blocks in macOS terminal dark chrome (`bg-slate-950 dark:bg-[#07040e]`).
- [ ] Step 4.5: Run `npm run build` to verify.

### Task 5: Static Exporter Synchronization & Final Verification
- [ ] Step 5.1: Update `priv/static/assets/aws-architectures.js` and `priv/static/aws-architectures.js` with the 7-domain hierarchy and dual theme styles.
- [ ] Step 5.2: Update `priv/static/assets/azure-architectures.js` and `priv/static/azure-architectures.js` with the 7-domain hierarchy and dual theme styles.
- [ ] Step 5.3: Run `npm test` (validate content).
- [ ] Step 5.4: Run `mix test` (Elixir tests).
- [ ] Step 5.5: Run `npm run build` (Vite build).
- [ ] Step 5.6: Run `mix site.export --output _site` (static export).
- [ ] Step 5.7: Run `git diff --check` to verify code quality.
- [ ] Step 5.8: Commit and push to `origin/main`.
