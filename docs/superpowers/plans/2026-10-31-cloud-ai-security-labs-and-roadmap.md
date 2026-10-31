# Cloud AI Security Engineer Curriculum, Roadmap & Labs Masterclass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the CloudSecCorner Labs section into a top-tier, Netflix/Cloudflare-caliber engineering resource for Cloud AI Security Engineers, featuring an interactive 4-stage Career & Learning Roadmap, an exhaustive architectural masterclass lab (`agentic-cloud-security.md`) with production defense topologies, executable guardrail policies, eBPF telemetry, and full regulatory mapping (NIST AI RMF 1.0, ISO/IEC 42001, OWASP LLM Top 10, MITRE ATLAS).

**Architecture:**
1. **Interactive UI Roadmap (`Labs.jsx`)**: Add a responsive, dual-theme interactive 4-Tier Career & Competency Roadmap to the Labs library overview, guiding engineers from Cloud & Identity fundamentals up to Autonomous Red Teaming & AI Governance.
2. **Deep Masterclass Content (`agentic-cloud-security.md`)**: Expand into a comprehensive technical reference featuring detailed ASCII architecture diagrams, Zero-Trust identity token brokering, MCP Tool-Call Firewalls, Firecracker microVM/eBPF runtime isolation, executable OPA Rego guardrails, and regulatory compliance matrices.
3. **Phoenix Static Parity (`index.html.heex`)**: Mirror roadmap components in Phoenix HEEx templates for clean static export (`_site/labs/`).
4. **Metadata & Data Integrity (`labs.json`)**: Update tags, difficulty indicators, and metadata to align with the curriculum.

**Tech Stack:** React 18, Tailwind CSS, Phoenix Framework (Elixir/HEEx), Markdown (react-markdown), Open Policy Agent (Rego), eBPF Tetragon, SPIFFE/SPIRE, NIST AI RMF, MITRE ATLAS.

**Spec:** User request: "improve labs section make it perfect for security cloud ai engineer write content with well explained diagram that can boost there confidence and in depth undertanding with all cloud security rules and reculation think like cloudflare or netflixs best engineer" & "you choose and update content create roadmap and comple content with diagrams".

## Global Constraints

- **Theme Compliance**: All new UI components must strictly adhere to dual-theme support (light mode `bg-white`, `text-slate-900`, `border-slate-200`; dark mode `dark:bg-[#13111c]`, `dark:text-white`, `dark:border-[#26203b]`). No raw un-themed white or dark elements.
- **Diagram Readability**: Since `react-markdown` operates with `skipHtml: true`, all architecture topologies in markdown files must be clean, high-precision ASCII / Unicode box-drawing diagrams inside ````text` or ````mermaid` blocks, ensuring identical crisp rendering in both React and static Phoenix HTML.
- **Dataset Integrity**: `priv/data/labs.json` must remain valid JSON passing `npm test` (`node scripts/validate-content.mjs`).
- **Zero Regression**: Pass all static builds (`mix site.export --output _site`), Elixir unit tests (`mix test`), and git whitespace checks (`git diff --check`).

## Review Focus

- Light and dark mode contrast across new roadmap cards, badges, and toggle tabs.
- Proper mobile responsiveness: flex-wrap and horizontal scrolling prevention on mobile viewports.
- Architectural realism: diagrams and patterns must accurately reflect industry-standard defense in depth (not toy scripts, but real Netflix/Cloudflare patterns like zero ambient credentials, MCP firewalls, Firecracker/gVisor microVMs, IMDSv2 blocking).
- Regulatory accuracy: exact mappings to NIST AI RMF 1.0 (GOVERN, MAP, MEASURE, MANAGE), ISO/IEC 42001 clauses, MITRE ATLAS tactics, and OWASP Top 10 for LLMs.

---

### Task 1: Update Lab Metadata & Learning Tracks in `priv/data/labs.json` and `fallbackLabsData`

**Files:**
- Modify: `priv/data/labs.json`
- Modify: `src/components/Labs.jsx:8-64`
- Test: `npm test`

- [ ] **Step 1: Update `priv/data/labs.json`**
  Enrich metadata for `Agentic-Cloud-Security` and related labs with targeted Cloud AI Security tracks, competencies, and difficulty levels.
- [ ] **Step 2: Sync `fallbackLabsData` in `src/components/Labs.jsx`**
  Update the fallback array in `Labs.jsx` so client-side state is identical even if network fetch fails.
- [ ] **Step 3: Verify content validation**
  Run `npm test` to verify `scripts/validate-content.mjs` passes without warnings.

---

### Task 2: Masterclass Content Overhaul in `priv/static/labs/agentic-cloud-security.md`

**Files:**
- Modify: `priv/static/labs/agentic-cloud-security.md`
- Test: Verify markdown formatting, ASCII diagram integrity, and syntax.

- [ ] **Step 1: Write Production Architecture Topologies**
  Include multi-tier defense topology ASCII diagrams:
  - Client / Ingress -> LLM Guardrail Gateway -> Agent Runtime -> MCP Tool Call Firewall -> Firecracker MicroVM / eBPF Tetragon Sandbox -> Cloud APIs.
  - Zero-Trust Identity Token Exchange (SPIFFE/SPIRE SVID -> AWS STS / Azure Entra Workload Identity -> Scoped Session Policies).
- [ ] **Step 2: Deep-Dive Defense Mechanics & Real Policy Artifacts**
  - Concrete OPA Rego policy for L7 MCP tool call authorization (validating tool name, approved namespace, bounded parameters, preventing command injection).
  - AWS IAM Scoped Session Policy JSON template restricting cloud blast radius.
  - eBPF Tetragon TracingPolicy YAML snippet blocking sandbox egress to `169.254.169.254` (IMDSv2 defense) and unapproved network CIDRs.
- [ ] **Step 3: Global Regulatory & Compliance Mapping Table**
  Provide an exhaustive cross-walk matrix covering:
  - NIST AI RMF 1.0 (GOVERN, MAP, MEASURE, MANAGE)
  - ISO/IEC 42001 (AI Management System controls)
  - OWASP Top 10 for LLMs (LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM06 Excessive Agency, LLM08 Vector and Embedding Weaknesses, etc.)
  - MITRE ATLAS (AML.T0051 LLM Prompt Injection, AML.T0053 LLM Data Exfiltration, AML.T0054 Excessive Agency Exploitation)
  - Cloudflare & Netflix Production Operational Principles (Zero ambient credentials, deterministic policy, ephemeral runtimes).
- [ ] **Step 4: Real-World Hands-On Red Team / Blue Team Exercises**
  Write 5 structured hands-on scenarios with step-by-step verification and remediation.

---

### Task 3: Build the Interactive Cloud AI Security Engineer Roadmap in `src/components/Labs.jsx`

**Files:**
- Modify: `src/components/Labs.jsx`
- Test: `npm run build`

- [ ] **Step 1: Design the 4-Tier Roadmap Data Structure**
  Define the 4 progressive tiers:
  - Tier 1: Cloud & Perimeter Fundamentals (IAM, VPC Isolation, IMDSv2, CIS Benchmarks)
  - Tier 2: Zero Trust Architecture & Threat Modeling (STRIDE, OPA Rego, Ephemeral Credentials, SPIFFE)
  - Tier 3: Agentic Defense & MCP Tool Firewalls (LLM Gateway, L7 MCP Proxy, Firecracker MicroVMs, eBPF Syscall Defense)
  - Tier 4: Autonomous Red Teaming & Regulatory Posture (PyRIT/Garak, NIST AI RMF, ISO 42001, MITRE ATLAS, Tamper-Evident Telemetry)
- [ ] **Step 2: Implement Roadmap Component in `LabsList`**
  Add interactive tier tabs, competency checklists, recommended labs links, and career milestone badges with responsive light/dark styling.
- [ ] **Step 3: Test Build & Style Consistency**
  Run `npm run build` to verify JSX compilation and Tailwind bundle integrity.

---

### Task 4: Mirror Roadmap in Phoenix Static Templates (`lib/cloud_security_corner_web/labs_html/index.html.heex`)

**Files:**
- Modify: `lib/cloud_security_corner_web/labs_html/index.html.heex`
- Test: `mix test` and `mix site.export --output _site`

- [ ] **Step 1: Add Roadmap Section to `index.html.heex`**
  Implement the semantic HTML / Tailwind markup in HEEx for static generation matching the React component.
- [ ] **Step 2: Run ExUnit Tests**
  Run `mix test` to confirm all controller tests pass.
- [ ] **Step 3: Run Static Export**
  Run `mix site.export --output _site` to verify static pages generate cleanly with the new content and roadmap.

---

### Task 5: Final Review, Whitespace Checks & Git Commit

**Files:**
- Test: `git diff --check`
- Test: `npm test`
- Commit and push to `origin/main`

- [ ] **Step 1: Check git diff and whitespace**
  Ensure no trailing whitespaces or syntax issues.
- [ ] **Step 2: Run full test suite**
  Run `npm test`, `mix test`, and `npm run check`.
- [ ] **Step 3: Commit and Push**
  Create a clean, descriptive git commit and push to `origin/main`.
