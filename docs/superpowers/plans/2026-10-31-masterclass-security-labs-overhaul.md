# Masterclass Hands-on Security Labs Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul all six CloudSecCorner hands-on security labs sequentially into publication-grade, production-engineering masterclass curricula with native Pele architecture diagrams (`architecture-beta`), copy-paste runnable CLI workflows, inline defensive policy-as-code, and auditable verification checklists.

**Architecture:** 
1. Upgrade labs sequentially in an impact-first order (Lab 1 Threat Modeling, Lab 2 Nmap Auditing, Lab 3 Ethical Hacking, Lab 4 Agentic Security, Lab 5 Zero Trust, Lab 6 Security Engineering).
2. Standardize each lab with the 6 mandatory masterclass sections: Enterprise Context, Pele Architecture Blueprint, Deep Technical Foundations, 4-5 Progressive Hands-on Execution Phases, Policy-as-Code & Defensive Automation, and Hardening Verification.
3. Maintain strict dual-engine file parity between Phoenix SSR (`priv/static/labs/`) and React SPA (`public/labs/`), with synchronized catalog metadata in `priv/data/labs.json`, `public/data/labs.json`, and `src/components/Labs.jsx`.

**Tech Stack:** Markdown (ReactMarkdown & Elixir Earmark), Pele Architecture DSL (`architecture-beta`), Mermaid.js, Open Policy Agent (Rego), Python (`pytm`, `cryptography`), Lua (Nmap NSE), Bash, Docker Compose, Linux iptables/nftables, SPIFFE/SPIRE, KMS AES-256-GCM.

**Spec:** `docs/superpowers/specs/2026-10-31-masterclass-lab-content-design.md`

## Global Constraints

- **Execution Environment**: All hands-on commands must execute in a zero-cost local sandbox (Docker, Docker Compose, KinD, LocalStack) with explicit callout notes for live enterprise cloud equivalents and hardware virtualization caveats.
- **Code Delivery**: All scripts, policies, and configs must be delivered strictly inline within markdown using self-contained `cat << 'EOF' > <filename>` code blocks; no external companion asset directories.
- **Modernization for Labs 5 & 6**: Clean replacement of legacy conversational blog prose (~90 KB each) with streamlined, professional ~25–35 KB masterclass documentation.
- **Dual-Engine Synchronization**: Any markdown edit to `public/labs/<filename>` must be mirrored byte-for-byte to `priv/static/labs/<filename>`.
- **Metadata Parity**: Changes to titles, descriptions, or tags must stay strictly identical across `priv/data/labs.json`, `public/data/labs.json`, and `src/components/Labs.jsx` (`fallbackLabsData`).
- **URL & Slug Stability**: Lab IDs and URL slugs (`Agentic-Cloud-Security`, `Zero-Trust-Architecture`, `Threat-Modeling`, `Security-Engineering-Fundamentals`, `Nmap-Practical-Labs`, `ethical-hacker-easy-way`) must not change.
- **Zero Build Regression**: All changes must pass `npm test`, `mix test`, and `mix site.export --output _site`.

## Review Focus

1. **Parser Compatibility (Earmark vs. ReactMarkdown)**: Deeply nested markdown lists, complex table formatting, or unescaped characters in code blocks breaking Earmark HTML generation during `mix site.export`.
2. **Pele Syntax Validity**: Ensure all ````architecture` code blocks use valid Pele `architecture-beta` syntax without unsupported group nesting or invalid node connections that could cause diagram render crashes.
3. **Copy-Paste Script Escaping**: Ensure multi-line `cat << 'EOF'` blocks preserve literal variables (`$1`, `${VAR}`) and do not accidentally evaluate or strip environment variables.
4. **Local Sandbox Self-Sufficiency**: Verify that every CLI command references locally containerized or mock endpoints (`localhost:8080`, `127.0.0.1:4566`, Docker networks) rather than requiring live billable cloud infrastructure.
5. **Dual-Path Sync Rigor**: Ensure no lab has diverging content between `priv/static/labs/` and `public/labs/`.

---

### Task 1: Overhaul Lab 1 - Threat Modeling Practical Guide (`threat-modeling.md`)

**Files:**
- Modify: `public/labs/threat-modeling.md`
- Modify: `priv/static/labs/threat-modeling.md`
- Modify: `priv/data/labs.json:22-29`
- Modify: `public/data/labs.json:22-29`
- Modify: `src/components/Labs.jsx:29-37`
- Test: `npm test && mix site.export --output _site`

**Interfaces:**
- Consumes: Masterclass Lab Specification Standard (Spec Section 5) and Lab 1 Blueprint (Spec Section 6).
- Produces: Production-grade threat modeling masterclass featuring multi-tier cloud microservice & AI agent trust boundaries, STRIDE-per-element matrix, DREAD/CVSS v4 scoring calculator, and inline Python `pytm` Threat-Model-as-Code automation.

- [ ] **Step 1: Verify current baseline**
  Run: `npm test && mix site.export --output _site`
  Expected: All checks pass cleanly with 6 validated labs.

- [ ] **Step 2: Author masterclass content in `public/labs/threat-modeling.md`**
  Structure the lab into the 6 standardized sections:
  1. *Header & Enterprise Context*: Track (Production Security Architecture), Target Audience, Standards (NIST SP 800-53 Rev 5, OWASP Top 10, MITRE ATT&CK & ATLAS).
  2. *Architecture Blueprint*: Pele `architecture-beta` diagram mapping Internet, Edge/DMZ, App Mesh, AI Inference Gateway, and Encrypted Data Tiers with clear trust boundaries.
  3. *Deep Technical Foundations*: STRIDE-per-element deep dive for cloud-native workloads (IMDSv2 spoofing, JWT tampering, S3 bucket enumeration, indirect prompt injection).
  4. *Hands-on Laboratory Phases*:
     - Phase 1: Environment Setup & Tooling (Docker sandbox, Python 3.11 virtualenv).
     - Phase 2: System Decomposition & Data Flow Diagramming (DFD levels 0 to 2).
     - Phase 3: Threat Identification via STRIDE & Cloud Threat Vector Mapping.
     - Phase 4: Risk Quantification using DREAD and CVSS v4 Calculators.
     - Phase 5: Mitigation Design & Security Controls Implementation.
  5. *Policy as Code & Defensive Automation*: Complete runnable Python `pytm` threat model script (`threat_model.py`) via `cat << 'EOF' > threat_model.py`.
  6. *Hardening Checklist & Verification*: Auditable checklist and verification commands validating threat model coverage.

- [ ] **Step 3: Mirror content to `priv/static/labs/threat-modeling.md`**
  Copy `public/labs/threat-modeling.md` to `priv/static/labs/threat-modeling.md`.

- [ ] **Step 4: Update catalog metadata in `priv/data/labs.json`, `public/data/labs.json`, and `src/components/Labs.jsx`**
  Update description and tags for `Threat-Modeling` to reflect masterclass content (e.g., tags: `["Threat Modeling", "STRIDE", "DREAD", "pytm", "MITRE ATLAS", "Cloud Security"]`).

- [ ] **Step 5: Run verification tests**
  Run: `npm test && mix site.export --output _site`
  Expected: Zero warnings, `scripts/validate-content.mjs` passes, and Earmark exports `_site/labs/threat-modeling/index.html`.

- [ ] **Step 6: Commit changes**
  ```bash
  git add public/labs/threat-modeling.md priv/static/labs/threat-modeling.md priv/data/labs.json public/data/labs.json src/components/Labs.jsx
  git commit -m "feat(labs): overhaul threat modeling lab with masterclass architecture and pytm automation"
  ```

---

### Task 2: Overhaul Lab 2 - Nmap Practical Auditing Labs (`NMAP-Practical-Labs.md`)

**Files:**
- Modify: `public/labs/NMAP-Practical-Labs.md`
- Modify: `priv/static/labs/NMAP-Practical-Labs.md`
- Modify: `priv/data/labs.json:40-47`
- Modify: `public/data/labs.json:40-47`
- Modify: `src/components/Labs.jsx:46-54`
- Test: `npm test && mix site.export --output _site`

**Interfaces:**
- Consumes: Spec Section 6 (Lab 2 Blueprint).
- Produces: Enterprise network auditing masterclass covering TCP 3-way handshake packet mechanics, scan mechanics (SYN, ACK, FIN, NULL, XMAS, Zombie/Idle), IDS evasion (`--mtu`, `--data-length`, decoys), custom Lua NSE script development for cloud metadata audits, and Linux iptables/nftables defense with Snort/Suricata rules.

- [ ] **Step 1: Author masterclass content in `public/labs/NMAP-Practical-Labs.md`**
  Structure the lab into the 6 standardized sections:
  1. *Header & Enterprise Context*: Track (Offensive Security & Network Defense), Standards (NIST SP 800-115, CIS Network Controls).
  2. *Architecture Blueprint*: Pele `architecture-beta` diagram with Auditor Node, Perimeter Firewall/IDS, DMZ Target Hosts, and Cloud Metadata Mock Services.
  3. *Deep Technical Foundations*: TCP state machine, packet flag bitmasks (SYN, ACK, RST, FIN, PSH, URG), and OS fingerprinting mechanics.
  4. *Hands-on Laboratory Phases*:
     - Phase 1: Local Dockerized Lab Testbed Setup (vulnerable target containers on isolated bridge network).
     - Phase 2: Host Discovery & Advanced Port Scanning (`-sS`, `-sT`, `-sU`, `-sN`, `-sF`, `-sX`).
     - Phase 3: Service Version Detection & Vulnerability Auditing with NSE.
     - Phase 4: Evasion Mechanics & Firewall Traversal (fragmentation, timing templates `-T0` to `-T5`, source port manipulation).
     - Phase 5: Custom Lua NSE Scripting for detecting exposed cloud metadata endpoints (`http-cloud-metadata.nse`).
  5. *Policy as Code & Defensive Automation*: Production iptables/nftables rate-limiting rules and Snort/Suricata detection signatures.
  6. *Hardening Checklist & Verification*: Defense validation scripts and post-audit hardening matrix.

- [ ] **Step 2: Mirror content to `priv/static/labs/NMAP-Practical-Labs.md`**
  Copy `public/labs/NMAP-Practical-Labs.md` to `priv/static/labs/NMAP-Practical-Labs.md`.

- [ ] **Step 3: Update catalog metadata**
  Sync tags and description across `priv/data/labs.json`, `public/data/labs.json`, and `src/components/Labs.jsx`.

- [ ] **Step 4: Run verification tests**
  Run: `npm test && mix site.export --output _site`
  Expected: Content validation passes, Earmark exports `_site/labs/nmap-practical-labs/index.html`.

- [ ] **Step 5: Commit changes**
  ```bash
  git add public/labs/NMAP-Practical-Labs.md priv/static/labs/NMAP-Practical-Labs.md priv/data/labs.json public/data/labs.json src/components/Labs.jsx
  git commit -m "feat(labs): overhaul nmap auditing lab with packet mechanics and custom nse scripts"
  ```

---

### Task 3: Overhaul Lab 3 - Ethical Hacking & Applied Defense (`ethical-hacker-easy-way.md`)

**Files:**
- Modify: `public/labs/ethical-hacker-easy-way.md`
- Modify: `priv/static/labs/ethical-hacker-easy-way.md`
- Modify: `priv/data/labs.json:49-56`
- Modify: `public/data/labs.json:49-56`
- Modify: `src/components/Labs.jsx:55-63`
- Test: `npm test && mix site.export --output _site`

**Interfaces:**
- Consumes: Spec Section 6 (Lab 3 Blueprint).
- Produces: 5-phase offensive security and container/cloud penetration testing workflow, passive/active OSINT automation, container breakout & K8s privilege escalation (hostPID, Docker socket mount), ARP poisoning and Dynamic ARP Inspection (DAI) defense, and automated remediation validation.

- [ ] **Step 1: Author masterclass content in `public/labs/ethical-hacker-easy-way.md`**
  Structure into the 6 standardized sections:
  1. *Header & Enterprise Context*: Track (Cloud & Container Penetration Testing), Frameworks (MITRE ATT&CK for Containers, OWASP Top 10, PTES).
  2. *Architecture Blueprint*: Pele `architecture-beta` diagram mapping Attacker workstation, External perimeter, Kubernetes node, and Container runtime boundary.
  3. *Deep Technical Foundations*: The 5 phases of ethical hacking (Reconnaissance, Scanning, Gaining Access, Maintaining Access, Covering Tracks/Reporting) applied to modern containerized cloud stacks.
  4. *Hands-on Laboratory Phases*:
     - Phase 1: Target Reconnaissance & OSINT Automation (subfinder, assetfinder, httpx scripting).
     - Phase 2: Vulnerability Analysis & Misconfiguration Identification.
     - Phase 3: Exploitation - Container Escape via Docker Socket (`/var/run/docker.sock`) & hostPID namespace traversal.
     - Phase 4: Network Man-in-the-Middle (MitM) & Dynamic ARP Inspection Defense.
     - Phase 5: Remediation Validation & Automated Defense Verification.
  5. *Policy as Code & Defensive Automation*: OPA Rego policy preventing privileged containers and Docker socket mounts in Kubernetes, plus automated bash defense validation harness.
  6. *Hardening Checklist & Verification*: NIST SP 800-190 container security compliance verification checklist.

- [ ] **Step 2: Mirror content to `priv/static/labs/ethical-hacker-easy-way.md`**
  Copy `public/labs/ethical-hacker-easy-way.md` to `priv/static/labs/ethical-hacker-easy-way.md`.

- [ ] **Step 3: Update catalog metadata**
  Sync tags and description across `priv/data/labs.json`, `public/data/labs.json`, and `src/components/Labs.jsx`.

- [ ] **Step 4: Run verification tests**
  Run: `npm test && mix site.export --output _site`
  Expected: Content validation passes, Earmark exports `_site/labs/ethical-hacker-easy-way/index.html`.

- [ ] **Step 5: Commit changes**
  ```bash
  git add public/labs/ethical-hacker-easy-way.md priv/static/labs/ethical-hacker-easy-way.md priv/data/labs.json public/data/labs.json src/components/Labs.jsx
  git commit -m "feat(labs): overhaul ethical hacking lab with container escape and k8s defense"
  ```

---

### Task 4: Polish & Synchronize Lab 4 - Agentic Cloud Security Essentials (`agentic-cloud-security.md`)

**Files:**
- Modify: `public/labs/agentic-cloud-security.md`
- Modify: `priv/static/labs/agentic-cloud-security.md`
- Test: `npm test && mix site.export --output _site`

**Interfaces:**
- Consumes: Existing agentic security lab + Spec Section 6 (Lab 4 Blueprint).
- Produces: Polished masterclass lab ensuring standard Pele `architecture-beta` syntax, L7 MCP reverse proxy schema validation, Firecracker microVM jailer configs, dual-LLM evaluator prompt injection defense pipeline, and eBPF Tetragon security observability policies.

- [ ] **Step 1: Verify and align `public/labs/agentic-cloud-security.md` with masterclass standards**
  Ensure the Pele architecture diagram renders cleanly with `architecture-beta`, all copy-paste scripts use `cat << 'EOF'`, and the 6 standard sections are fully formed.
- [ ] **Step 2: Mirror content to `priv/static/labs/agentic-cloud-security.md`**
  Copy `public/labs/agentic-cloud-security.md` to `priv/static/labs/agentic-cloud-security.md`.
- [ ] **Step 3: Run verification tests**
  Run: `npm test && mix site.export --output _site`
  Expected: Content validation passes, Earmark exports `_site/labs/agentic-cloud-security/index.html`.
- [ ] **Step 4: Commit changes**
  ```bash
  git add public/labs/agentic-cloud-security.md priv/static/labs/agentic-cloud-security.md
  git commit -m "feat(labs): standardize agentic cloud security lab with pele architecture and mcp firewalls"
  ```

---

### Task 5: Overhaul Lab 5 - Zero-Trust Architecture (`Zero-Trust-Architecture.md`)

**Files:**
- Modify: `public/labs/Zero-Trust-Architecture.md`
- Modify: `priv/static/labs/Zero-Trust-Architecture.md`
- Modify: `priv/data/labs.json:13-20`
- Modify: `public/data/labs.json:13-20`
- Modify: `src/components/Labs.jsx:20-28`
- Test: `npm test && mix site.export --output _site`

**Interfaces:**
- Consumes: Approved clean replacement decision + Spec Section 6 (Lab 5 Blueprint).
- Produces: Streamlined, production-grade ~25–35 KB masterclass lab cleanly replacing legacy informal blog prose, featuring SPIFFE/SPIRE workload attestation, Envoy mTLS sidecar proxy configuration, OPA fine-grained Rego authorization policies, and CISA Zero Trust Maturity Model assessment.

- [ ] **Step 1: Author streamlined masterclass replacement in `public/labs/Zero-Trust-Architecture.md`**
  Structure into the 6 standardized sections:
  1. *Header & Enterprise Context*: Track (Identity & Zero Trust Engineering), Standards (NIST SP 800-207, CISA ZTMM v2.0, DoD Zero Trust Reference).
  2. *Architecture Blueprint*: Pele `architecture-beta` diagram illustrating SPIRE Server, SPIRE Agent, Workload SVID issuance, Envoy mTLS proxy, and Open Policy Agent (OPA) decision engine.
  3. *Deep Technical Foundations*: Continuous workload identity vs. perimeter IP trust, X.509 SVID structure, SPIFFE ID URI format (`spiffe://corp.internal/ns/prod/sa/payment-api`), and mutual TLS handshake mechanics.
  4. *Hands-on Laboratory Phases*:
     - Phase 1: Local SPIRE & Envoy Testbed Deployment (Docker Compose with SPIRE Server, Agent, and upstream/downstream services).
     - Phase 2: Workload Registration & SVID Attestation via Unix Domain Socket.
     - Phase 3: Envoy Service Mesh mTLS Enforcement with dynamic SDS (Secret Discovery Service).
     - Phase 4: Fine-Grained Authorization with Open Policy Agent (OPA) sidecar.
     - Phase 5: Verification of Hostile Client Rejection & Revocation Simulation.
  5. *Policy as Code & Defensive Automation*: Production OPA Rego policy for HTTP method and path-level RBAC based on SPIFFE identity, plus Envoy cluster configuration.
  6. *Hardening Checklist & Verification*: CISA Zero Trust Maturity Model assessment checklist and automated verification commands.

- [ ] **Step 2: Mirror content to `priv/static/labs/Zero-Trust-Architecture.md`**
  Copy `public/labs/Zero-Trust-Architecture.md` to `priv/static/labs/Zero-Trust-Architecture.md`.

- [ ] **Step 3: Update catalog metadata**
  Sync tags and description across `priv/data/labs.json`, `public/data/labs.json`, and `src/components/Labs.jsx`.

- [ ] **Step 4: Run verification tests**
  Run: `npm test && mix site.export --output _site`
  Expected: Content validation passes, Earmark exports `_site/labs/zero-trust-architecture/index.html`.

- [ ] **Step 5: Commit changes**
  ```bash
  git add public/labs/Zero-Trust-Architecture.md priv/static/labs/Zero-Trust-Architecture.md priv/data/labs.json public/data/labs.json src/components/Labs.jsx
  git commit -m "feat(labs): overhaul zero trust architecture lab with spiffe spire envoy and opa rego"
  ```

---

### Task 6: Overhaul Lab 6 - Security Engineering Fundamentals (`Security-Engineering-Fundamentals.md`)

**Files:**
- Modify: `public/labs/Security-Engineering-Fundamentals.md`
- Modify: `priv/static/labs/Security-Engineering-Fundamentals.md`
- Modify: `priv/data/labs.json:31-38`
- Modify: `public/data/labs.json:31-38`
- Modify: `src/components/Labs.jsx:38-45`
- Test: `npm test && mix site.export --output _site`

**Interfaces:**
- Consumes: Approved clean replacement decision + Spec Section 6 (Lab 6 Blueprint).
- Produces: Streamlined, production-grade ~25–35 KB masterclass lab cleanly replacing legacy informal blog prose, featuring KMS envelope encryption (AES-256-GCM with hardware master key), SLSA Level 3 CI/CD supply chain hardening, Cosign container image signing, Syft/Trivy SBOM validation, and comprehensive defense-in-depth matrix.

- [ ] **Step 1: Author streamlined masterclass replacement in `public/labs/Security-Engineering-Fundamentals.md`**
  Structure into the 6 standardized sections:
  1. *Header & Enterprise Context*: Track (Core Security Engineering), Standards (NIST SP 800-53 Rev 5, CIS Benchmarks, SLSA v1.0, ISO/IEC 27001).
  2. *Architecture Blueprint*: Pele `architecture-beta` diagram showing CI/CD build runner, KMS Key Management Service, Artifact Registry, Signed Container Attestations, and Production Runtime.
  3. *Deep Technical Foundations*: Envelope encryption mechanics (Customer Master Key, Data Encryption Key DEK, AES-256-GCM cipher), cryptographic nonces and authentication tags, and Software Supply Chain Security (SLSA Framework).
  4. *Hands-on Laboratory Phases*:
     - Phase 1: Local Cryptographic Testbed Setup (Python 3.11 with `cryptography` library and mock KMS daemon).
     - Phase 2: Production Envelope Encryption & Decryption Implementation.
     - Phase 3: Software Bill of Materials (SBOM) Generation with Syft and Vulnerability Scanning with Trivy.
     - Phase 4: Container Image Signing and Keyless Attestation with Cosign.
     - Phase 5: CI/CD Guardrail Enforcement with GitHub Actions / OPA Conftest.
  5. *Policy as Code & Defensive Automation*: Standalone Python envelope encryption utility with AES-256-GCM, plus Conftest Rego policy enforcing SLSA provenance.
  6. *Hardening Checklist & Verification*: CIS Benchmark compliance verification checklist and audit script.

- [ ] **Step 2: Mirror content to `priv/static/labs/Security-Engineering-Fundamentals.md`**
  Copy `public/labs/Security-Engineering-Fundamentals.md` to `priv/static/labs/Security-Engineering-Fundamentals.md`.

- [ ] **Step 3: Update catalog metadata**
  Sync tags and description across `priv/data/labs.json`, `public/data/labs.json`, and `src/components/Labs.jsx`.

- [ ] **Step 4: Run verification tests**
  Run: `npm test && mix site.export --output _site`
  Expected: Content validation passes, Earmark exports `_site/labs/security-engineering-fundamentals/index.html`.

- [ ] **Step 5: Commit changes**
  ```bash
  git add public/labs/Security-Engineering-Fundamentals.md priv/static/labs/Security-Engineering-Fundamentals.md priv/data/labs.json public/data/labs.json src/components/Labs.jsx
  git commit -m "feat(labs): overhaul security engineering lab with envelope encryption and slsa supply chain"
  ```

---

### Task 7: Comprehensive Catalog Sync & End-to-End Build Verification

**Files:**
- Verify: `priv/data/labs.json`
- Verify: `public/data/labs.json`
- Verify: `src/components/Labs.jsx`
- Verify: `_site/labs/*`
- Test: `npm test && mix test && mix site.export --output _site && git diff --check`

**Interfaces:**
- Consumes: All 6 upgraded labs from Tasks 1–6.
- Produces: Complete end-to-end verification showing zero lint, test, or build regressions across Node and Elixir engines.

- [ ] **Step 1: Check diffs between `priv/data/labs.json` and `public/data/labs.json`**
  Run: `diff -u priv/data/labs.json public/data/labs.json`
  Expected: No diff output (files are identical).

- [ ] **Step 2: Verify `fallbackLabsData` in `src/components/Labs.jsx` matches `priv/data/labs.json`**
  Confirm all IDs, titles, descriptions, paths, and tags match the catalog JSON.

- [ ] **Step 3: Run Node test suite**
  Run: `npm test`
  Expected: `scripts/validate-content.mjs` validates all 6 labs with zero errors.

- [ ] **Step 4: Run Elixir Phoenix test suite**
  Run: `mix test`
  Expected: 10 passed tests with 0 failures.

- [ ] **Step 5: Export full static site**
  Run: `mix site.export --output _site`
  Expected: Successfully exported static site with all 6 labs rendered to `_site/labs/<id>/index.html`.

- [ ] **Step 6: Check for git whitespace errors**
  Run: `git diff --check`
  Expected: No whitespace errors.

- [ ] **Step 7: Commit any final sync adjustments**
  ```bash
  git add priv/data/labs.json public/data/labs.json src/components/Labs.jsx
  git commit -m "chore(labs): finalize catalog synchronization and static export verification"
  ```

