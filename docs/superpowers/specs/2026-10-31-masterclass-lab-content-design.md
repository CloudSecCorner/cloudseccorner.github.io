# Design Document: Masterclass Hands-on Security Labs Overhaul

**Date:** 2026-10-31  
**Author:** Antigravity  
**Status:** Approved (Architecture & Scope Finalized)  
**Target Path:** `docs/superpowers/specs/2026-10-31-masterclass-lab-content-design.md`

---

## 1. Context & Background

CloudSecCorner provides practical cloud and AI security resources, architectures, and hands-on labs. Currently, the site serves six labs across both Phoenix SSR and React SPA:
1. `Agentic-Cloud-Security` (`agentic-cloud-security.md` ~21 KB)
2. `Zero-Trust-Architecture` (`Zero-Trust-Architecture.md` ~93 KB)
3. `Security-Engineering-Fundamentals` (`Security-Engineering-Fundamentals.md` ~86 KB)
4. `Threat-Modeling` (`threat-modeling.md` ~11 KB)
5. `Nmap-Practical-Labs` (`NMAP-Practical-Labs.md` ~14 KB)
6. `ethical-hacker-easy-way` (`ethical-hacker-easy-way.md` ~12 KB)

While `Zero-Trust-Architecture` and `Security-Engineering-Fundamentals` possess deep architectural foundations, `Threat-Modeling`, `Nmap-Practical-Labs`, and `ethical-hacker-easy-way` are brief conceptual overviews. The user requested to "update Lab content and write top notch content" across "all one by one".

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- Elevate all six labs sequentially to publication-grade, production-engineering masterclass quality.
- Standardize every lab with:
  - **Pele Native Cloud Architecture Diagrams** (`architecture-beta`) with service icons and clear trust boundaries.
  - **Enterprise Threat Scenarios** mapped to MITRE ATT&CK / ATLAS, NIST SP 800 series, and OWASP standards.
  - **Copy-Paste Runnable CLI Commands & Scripts** with realistic outputs.
  - **Defensive Infrastructure Code** (e.g. OPA Rego rules, iptables/eBPF filters, IAM policies, Python verification tools).
  - **Auditable Verification & Self-Assessment Checklists**.
- Maintain strict dual-engine synchronization between Phoenix SSR (`priv/static/labs/`) and Vite React SPA (`public/labs/`).
- Ensure all automated test suites pass without regression (`npm test`, `npm run build`, `mix test`, `mix compile`, `mix site.export`).

### Non-Goals
- Changing URL slugs or routing schemes (labs must keep their current IDs and URLs).
- Altering the React or Phoenix rendering components unless needed to support new markdown formatting features.
- Writing generic, superficial "glossary-style" definitions; all labs must feature deep, actionable, production-grade engineering workflows.

### Anti-Goals
- Introducing breaking changes to existing links or metadata in `priv/data/labs.json` or `public/data/labs.json`.
- Sacrificing performance or introducing unvalidated syntax errors into markdown parsers (Earmark in Elixir and ReactMarkdown in Node).

---

## 3. Approaches Considered & Selected Approach

### Approach 1 (Selected): Impact-First Sequential Upgrade
Upgrade the labs one by one starting with the three labs that currently have the highest gap between current brevity and masterclass depth, followed by polishing the foundational labs:
1. **Lab 1: Threat Modeling Practical Guide** (`threat-modeling.md`)
2. **Lab 2: NMAP Practical Auditing Labs** (`NMAP-Practical-Labs.md`)
3. **Lab 3: Ethical Hacking Practical Lab** (`ethical-hacker-easy-way.md`)
4. **Lab 4: Agentic Cloud Security Essentials** (`agentic-cloud-security.md`)
5. **Lab 5: Zero-Trust Architecture** (`Zero-Trust-Architecture.md`)
6. **Lab 6: Security Engineering Fundamentals** (`Security-Engineering-Fundamentals.md`)

*Rationale*: Rapidly delivers the highest observable quality improvement across the catalog while allowing focused verification and human review after every individual lab.

### Approach 2 (Rejected): Strict Catalog Order (1 through 6)
Follows literal JSON catalog order (`Agentic-Cloud-Security` -> `Zero-Trust` -> `Threat-Modeling` -> `Security-Engineering` -> `Nmap` -> `Ethical-Hacker`).
*Why rejected*: Spends initial cycles expanding labs that are already 20–90 KB before touching the ones that are currently short summaries.

---

## 4. Key Architectural Decisions (Approved)

1. **Target Execution Environment & Prerequisites**:
   - **Zero-cost local sandbox**: Hands-on CLI commands and practical labs are authored to run in zero-cost local containerized environments (Docker, Docker Compose, KinD, and LocalStack) to ensure immediate execution on macOS, Linux, and Windows without cloud costs or permission friction.
   - Live cloud equivalents (AWS/Azure/GCP) and hardware virtualization caveats (e.g. `/dev/kvm` for Firecracker) are explicitly noted alongside the local sandbox execution commands.

2. **Modernization Strategy for Labs 5 & 6 (`Zero-Trust` & `Security-Engineering`)**:
   - **Clean Replacement**: The legacy informal conversational blog prose (~90 KB each) is cleanly replaced with the standardized, concise (~25–35 KB) production masterclass format. This eliminates repetitive introductory blog text and elevates both labs to senior engineering caliber.

3. **Code & Policy Artifact Delivery Architecture**:
   - **Strictly Inline within Markdown**: All policies, automation scripts (Python, Lua, Bash, Rego), and manifests are embedded directly in markdown using runnable, copy-pasteable `cat << 'EOF' > <filename>` code blocks. This keeps each lab completely self-contained, offline-readable, and avoids introducing complex companion asset directories.

---

## 5. Masterclass Lab Specification Standard

Each upgraded lab must strictly include the following structured sections:

1. **Header & Enterprise Context**:
   - Production track metadata, target audience, key frameworks (NIST, CIS, OWASP, MITRE), and rules of engagement.
2. **Architecture Blueprint**:
   - Fenced Pele architecture diagram (`architecture-beta`) defining actors, services, and trust boundaries.
   - Accompanying Mermaid flowcharts for process/pipeline execution.
3. **Deep Technical Foundations**:
   - Detailed conceptual explanation of mechanisms, protocols, and underlying threat models.
4. **Hands-on Laboratory Phases**:
   - Structured into 4–5 progressive execution phases (e.g. Setup & Pre-flight, Discovery & Attack Surface Mapping, Exploitation/Simulation, Hardening & Policy Enforcement, Automated Telemetry).
   - Real-world commands, configuration files, and realistic terminal outputs.
5. **Policy as Code & Defensive Automation**:
   - Production-ready code artifacts (e.g., OPA Rego rules, Python analysis scripts, Terraform/Kubernetes manifests).
6. **Hardening Checklist & Verification**:
   - Specific commands to audit compliance and confirm remediation efficacy.

---

## 6. Lab-by-Lab Upgrade Blueprints

### Lab 1: Threat Modeling Practical Guide (`threat-modeling.md`)
- **Focus**: Multi-tier cloud microservice & AI agent threat modeling.
- **Components**:
  - Full STRIDE-per-element matrix with cloud threat vectors (e.g., IMDSv2 spoofing, JWT tampering, S3 bucket enumeration).
  - DREAD & CVSS v4 risk quantification calculator with worked examples.
  - Automated Threat Modeling as Code using Python (`pytm`) model definition.
  - Pele trust boundary diagram with Internet, DMZ, App Mesh, and Data tiers.
  - Remediation mapping to NIST SP 800-53 Rev 5 and MITRE ATT&CK mitigations.

### Lab 2: Nmap Practical Auditing & Reconnaissance (`NMAP-Practical-Labs.md`)
- **Focus**: Enterprise network perimeter auditing, evasion analysis, and NSE scripting.
- **Components**:
  - Detailed TCP 3-way handshake packet analysis (SYN, ACK, FIN, NULL, XMAS, Idle/Zombie scan).
  - Timing template tuning (`-T0` through `-T5`) and IDS evasion mechanics (`--mtu`, `--data-length`, decoy `-D`).
  - Custom Lua NSE script development for detecting exposed cloud metadata endpoints.
  - Linux firewall defense: iptables / nftables rate-limiting rules and Snort/Suricata alert signatures.

### Lab 3: Ethical Hacking & Applied Defense (`ethical-hacker-easy-way.md`)
- **Focus**: Full 5-phase offensive security and container/cloud penetration testing workflow.
- **Components**:
  - Passive and active OSINT automation scripts (DNS reconnaissance, subfinder, httpx).
  - Container breakout & Kubernetes privilege escalation scenarios (Docker socket mount, hostPID exploitation).
  - Practical ARP poisoning analysis and dynamic ARP inspection (DAI) defense.
  - Automated bash remediation and threat validation harness.

### Lab 4: Agentic Cloud Security Essentials (`agentic-cloud-security.md`)
- **Focus**: Hardened execution environments for LLM agents and MCP tool invocations.
- **Components**:
  - L7 MCP (Model Context Protocol) reverse proxy filter specification and schema validation.
  - Firecracker microVM sandboxing configuration with jailer, cgroups v2, and seccomp profiles.
  - Indirect prompt injection defense pipelines with dual-LLM evaluator patterns.
  - eBPF Tetragon security observability policies for syscall monitoring.

### Lab 5: Zero-Trust Architecture (`Zero-Trust-Architecture.md`)
- **Focus**: Continuous workload attestation and identity-centric cloud boundaries.
- **Components**:
  - SPIFFE/SPIRE deployment architecture with X.509 SVID generation and Envoy mTLS proxy.
  - Open Policy Agent (OPA) fine-grained authorization policies.
  - CISA Zero Trust Maturity Model assessment template.

### Lab 6: Security Engineering Fundamentals (`Security-Engineering-Fundamentals.md`)
- **Focus**: Enterprise-grade infrastructure hardening, cryptographic hygiene, and CI/CD supply chain defense.
- **Components**:
  - Hardware-backed KMS envelope encryption workflow with AES-256-GCM.
  - SLSA Level 3 CI/CD pipeline defense, Cosign image signing, and Syft/Trivy SBOM validation.
  - Defense-in-depth matrix across network, compute, IAM, and data stores.

---

## 7. Execution & Verification Workflow

For each lab in sequence:
1. Update `public/labs/<filename>` (React SPA target).
2. Mirror identically to `priv/static/labs/<filename>` (Phoenix SSR target).
3. If title, description, or tags improve, sync `priv/data/labs.json` and `public/data/labs.json`.
4. Run verification commands:
   - `npm test` (validates all JSON structures and content markdown paths)
   - `mix test` (runs all 10 Phoenix controller/renderer test cases)
   - `mix site.export --output _site` (confirms Earmark HTML parser renders the markdown cleanly)
5. Review output and commit.

---

## 8. What Is Left to the Implementer
- Selection of specific realistic IP subnets, sample domain names (`corp.internal`), and vulnerability examples (e.g. Log4Shell, CVE-2024-3094, IMDSv2).
- Fine-tuning of Pele icon mappings to match available Pele syntax.

