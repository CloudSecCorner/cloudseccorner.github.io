# Cloud Security Corner

[![Continuous Integration](https://github.com/CloudSecCorner/cloudseccorner.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/CloudSecCorner/cloudseccorner.github.io/actions/workflows/ci.yml)
[![Deploy GitHub Pages](https://github.com/CloudSecCorner/cloudseccorner.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/CloudSecCorner/cloudseccorner.github.io/actions/workflows/pages.yml)

Practical, community-led learning for **Agentic AI & Cloud Security**.

🌐 [cloudsecuritycorner.com](https://cloudsecuritycorner.com/) · 🧰 [Tool Directory](https://cloudsecuritycorner.com/tools/) · 🧪 [Hands-on Labs](https://cloudsecuritycorner.com/labs/) · 📝 [Field Notes & Blog](https://cloudsecuritycorner.com/blog/)

## What You'll Find

| Area | What it covers |
| :--- | :--- |
| **[Tools](https://cloudsecuritycorner.com/tools/)** | A searchable directory of 37,000+ security and agentic projects, with domain filters and GitHub badges. |
| **[Labs](https://cloudsecuritycorner.com/labs/)** | Guided hands-on labs for agentic security, zero trust, threat modeling, security engineering, and CEH. |
| **[Blog](https://cloudsecuritycorner.com/blog/)** | Research, field guides, and architecture teardowns for defensive cloud & agent engineering. |

## Run Locally

Requirements: Elixir/Erlang (`>= 1.16`) and Python 3.

```sh
# Setup dependencies
make setup

# Run local development server
make dev

# Update README tools tables
make readme

# Export static site for GitHub Pages
make export
```

Visit [http://localhost:4000](http://localhost:4000).

## Labs & Learning Paths

- [Agentic Cloud Security Essentials](https://cloudsecuritycorner.com/labs/Agentic-Cloud-Security) - Threat-model an AI agent with cloud access and design practical identity, tool, runtime, and governance controls.
- [Zero Trust Architecture](https://cloudsecuritycorner.com/labs/Zero-Trust-Architecture) - Security model assuming all users, devices, and applications are potentially hostile and must be verified.
- [Threat Modeling](https://cloudsecuritycorner.com/labs/Threat-Modeling) - Create threat models and STRIDE analysis for modern distributed systems.
- [Security Engineering Fundamentals](https://cloudsecuritycorner.com/labs/Security-Engineering-Fundamentals) - Core principles of security engineering and real-world implementation.
- [Ethical Hacker Easy Way](https://cloudsecuritycorner.com/labs/ethical-hacker-easy-way) - Introduction to ethical hacking principles, reconnaissance, and methodologies.
- [NMAP Practical Labs](https://cloudsecuritycorner.com/labs/Nmap-Practical-Labs) - Network scanner to identify open ports, services, and OS fingerprints.

## Field Notes & Blogs

- [Safeguarding the AI Frontier: An In-Depth Analysis of Straiker's Revolutionary Security Solutions](https://cloudsecuritycorner.com/blog/Safeguarding-the-AI-Frontier) - Exploring how enterprise AI applications are protected against prompt injection and tool misuse.

<!-- TOOLS_TABLE:START -->
## Curated Security Tools

This directory is **automatically synchronized** from [`priv/data/security-entries.json`](./priv/data/security-entries.json). Below is a curated showcase of **108 community-highlighted tools** across 11 core security domains. Search and filter the complete collection of **37,750 tools** on **[cloudsecuritycorner.com/tools](https://cloudsecuritycorner.com/tools/)**.

### 🤖 Agentic & AI Security
_AI agent guardrails, LLM red teaming, MCP security, sandboxing, and prompt evaluation._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[Agentic Radar](https://github.com/splx-ai/agentic-radar)** | A security scanner that analyzes agentic workflows and visualizes tools, prompts, data flows, and potential security weaknesses. | [`splx-ai/agentic-radar`](https://github.com/splx-ai/agentic-radar) |
| **[AI-Infra-Guard](https://github.com/Tencent/AI-Infra-Guard)** | A full-stack AI red-team platform for scanning agents, skills, MCP servers, AI infrastructure, and LLM jailbreak exposure. | [`Tencent/AI-Infra-Guard`](https://github.com/Tencent/AI-Infra-Guard) |
| **[AI-PASSWORD-TESTING-AGENT](https://github.com/insider77circle/ai-password-testing-agent)** | An intelligent agent for testing password strength, identifying vulnerabilities, and exploring patterns in password creation. | [`insider77circle/ai-password-testing-agent`](https://github.com/insider77circle/ai-password-testing-agent) |
| **[Garak](https://github.com/NVIDIA/garak)** | LLM vulnerability scanner probing hallucination, prompt injection, jailbreaks, data leakage, and toxic output. | [`NVIDIA/garak`](https://github.com/NVIDIA/garak) |
| **[Giskard](https://github.com/Giskard-AI/giskard-oss)** | An open-source testing library for evaluating and red-teaming LLM agents, RAG systems, and multi-turn AI workflows. | [`Giskard-AI/giskard-oss`](https://github.com/Giskard-AI/giskard-oss) |
| **[NeMo Guardrails](https://github.com/NVIDIA-NeMo/Guardrails)** | An open-source toolkit for adding programmable input, output, retrieval, dialog, and execution safeguards to AI applications. | [`NVIDIA-NeMo/Guardrails`](https://github.com/NVIDIA-NeMo/Guardrails) |
| **[OpenShell](https://github.com/NVIDIA/OpenShell)** | A sandboxed runtime for autonomous agents with declarative policies for filesystem, network, and process access. | [`NVIDIA/OpenShell`](https://github.com/NVIDIA/OpenShell) |
| **[OWASP Agentic Security Initiative](https://genai.owasp.org/initiatives/agentic-security-initiative/)** | Community research, standards, threat models, and implementation guidance for securing autonomous agents and multi-step AI work... | [Website ↗](https://genai.owasp.org/initiatives/agentic-security-initiative/) |
| **[OWASP Secure Agent Playbook](https://github.com/OWASP/secure-agent-playbook)** | An open playbook of practical security checks for AI agents, covering prompt injection, tool misuse, credential leakage, and bu... | [`OWASP/secure-agent-playbook`](https://github.com/OWASP/secure-agent-playbook) |
| **[Promptfoo](https://github.com/promptfoo/promptfoo)** | Test-driven security evaluation and red-teaming tool for LLMs, prompts, RAG systems, and agentic workflows. | [`promptfoo/promptfoo`](https://github.com/promptfoo/promptfoo) |
| **[Promptmap](https://github.com/utkusen/promptmap)** | A prompt-injection scanner that automatically tests custom LLM applications for attack paths and unsafe instruction handling. | [`utkusen/promptmap`](https://github.com/utkusen/promptmap) |
| **[PurpleLlama](https://github.com/meta-llama/PurpleLlama)** | Meta's collection of evaluations and safeguards for assessing and improving generative AI security, including CyberSecEval, Pro... | [`meta-llama/PurpleLlama`](https://github.com/meta-llama/PurpleLlama) |
| **[PyRIT](https://github.com/microsoft/PyRIT)** | Microsoft's Python Risk Identification Tool for automated generative AI red teaming and adversarial probing. | [`microsoft/PyRIT`](https://github.com/microsoft/PyRIT) |
| **[SkillSpector](https://github.com/NVIDIA/skillspector)** | A security scanner for AI agent skills that detects prompt injection, unsafe behaviors, data exfiltration, and malicious patterns. | [`NVIDIA/skillspector`](https://github.com/NVIDIA/skillspector) |
| **[Snyk Agent Scan](https://github.com/snyk/agent-scan)** | Discovers agent components, MCP servers, and skills, then scans them for risks such as prompt injection, tool poisoning, and un... | [`snyk/agent-scan`](https://github.com/snyk/agent-scan) |

### ☁️ Cloud & Container Security
_Cloud security posture (CSPM), Kubernetes security, container runtime defense, and image scanning._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[Checkov](https://github.com/bridgecrewio/checkov)** | Static analysis for infrastructure as code that detects cloud misconfigurations, vulnerable dependencies, and exposed secrets. | [`bridgecrewio/checkov`](https://github.com/bridgecrewio/checkov) |
| **[Cnspec](https://github.com/mondoohq/cnspec)** | Open-source cloud-native security and compliance scanner assessing Kubernetes, cloud accounts, and infrastructure as code. | [`mondoohq/cnspec`](https://github.com/mondoohq/cnspec) |
| **[Docker Bench Security](https://github.com/docker/docker-bench-security)** | Script that checks for dozens of common best-practices around deploying Docker containers in production. | [`docker/docker-bench-security`](https://github.com/docker/docker-bench-security) |
| **[Falco](https://falco.org/)** | Cloud-native runtime security and behavioral threat detection engine for containers, Kubernetes, and Linux hosts. | [`falcosecurity/falco`](https://github.com/falcosecurity/falco) |
| **[SOPS](https://github.com/getsops/sops)** | An editor for encrypted configuration files that integrates with cloud key services and keeps sensitive values protected in ver... | [`getsops/sops`](https://github.com/getsops/sops) |
| **[Trivy](https://github.com/aquasecurity/trivy)** | Comprehensive vulnerability, misconfiguration, secret, and SBOM scanner for containers, Kubernetes, and code repos. | [`aquasecurity/trivy`](https://github.com/aquasecurity/trivy) |
| **[TruffleHog](https://github.com/trufflesecurity/trufflehog)** | Finds, verifies, and analyzes exposed credentials across source repositories, cloud storage, container images, and other data s... | [`trufflesecurity/trufflehog`](https://github.com/trufflesecurity/trufflehog) |

### 🛡️ Application & Web Security
_SAST, DAST, web scanners, API defense, WAFs, and software supply chain protection._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[Acunetix](https://www.acunetix.com)** | A commercial tool focusing on web application vulnerability scanning, identifying issues such as SQL injection and XSS | [Website ↗](https://www.acunetix.com) |
| **[Arachni](https://github.com/Arachni/arachni)** | A feature-rich, modular, high-performance Ruby framework aimed towards helping penetration testers and administrators evaluate ... | [`Arachni/arachn`](https://github.com/Arachni/arachn) |
| **[Burp Suite](https://portswigger.net/burp)** | Industry-standard interactive proxy and automated vulnerability scanner for web application security assessments. | [Website ↗](https://portswigger.net/burp) |
| **[detect-secrets](https://github.com/Yelp/detect-secrets)** | An extensible secret-detection tool that supports baseline files and pre-commit workflows to prevent new credentials from enter... | [`Yelp/detect-secrets`](https://github.com/Yelp/detect-secrets) |
| **[DonPAPI](https://github.com/login-securite/donpapi)** | Automated remote credential dumper for Windows environments, extracting DPAPI secrets, browser credentials, certificates, and c... | [`login-securite/donpapi`](https://github.com/login-securite/donpapi) |
| **[Gitleaks](https://github.com/gitleaks/gitleaks)** | A fast secret scanner for detecting passwords, API keys, and tokens in Git history, files, and standard input. | [`gitleaks/gitleaks`](https://github.com/gitleaks/gitleaks) |
| **[HackBrowserData](https://github.com/moond4rk/hackbrowserdata)** | Extract and decrypt browser data, supporting multiple data types, runnable on various operating systems (macOS, Windows, Linux). | [`moond4rk/hackbrowserdata`](https://github.com/moond4rk/hackbrowserdata) |
| **[jwt-hack](https://github.com/hahwul/jwt-hack)** | JSON Web Token Hack Toolkit | [`hahwul/jwt-hack`](https://github.com/hahwul/jwt-hack) |
| **[Kousei](https://github.com/nu11secur1ty/kousei)** | Python/Go framework that generates SQL injection PoC requests, automates sqlmap attacks, and manages modular exploit scripts wi... | [`nu11secur1ty/kousei`](https://github.com/nu11secur1ty/kousei) |
| **[ModSecurity](https://modsecurity.org/)** | Open-source web application firewall (WAF) providing HTTP traffic monitoring, logging, and real-time attack filtering. | [`owasp-modsecurity/ModSecurity`](https://github.com/owasp-modsecurity/ModSecurity) |
| **[Nikto](https://cirt.net/Nikto2)** | Open-source web server scanner that tests for over 6,700 dangerous files, outdated server software, and version flaws. | [`sullo/nikto`](https://github.com/sullo/nikto) |
| **[OWASP](https://owasp.org/)** | The Open Worldwide Application Security Project dedicated to improving software security with tools, documents, and communities. | [Website ↗](https://owasp.org/) |
| **[OWASP API Security Top 10](https://owasp.org/www-project-api-security/)** | Periodic consensus document on the most critical security risks facing modern web APIs and microservices. | [`OWASP/API-Security`](https://github.com/OWASP/API-Security) |
| **[OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)** | Application Security Verification Standard providing a basis for designing, building, and testing technical security controls. | [`OWASP/ASVS`](https://github.com/OWASP/ASVS) |
| **[OWASP Top Ten](https://owasp.org/www-project-top-ten/)** | Standard awareness document for developers and security teams representing the most critical risks to web applications. | [Website ↗](https://owasp.org/www-project-top-ten/) |
| **[OWASP ZAP](https://www.zaproxy.org/)** | World's most widely used free, open-source dynamic web application security scanner and penetration testing proxy. | [`zaproxy/zaproxy`](https://github.com/zaproxy/zaproxy) |
| **[PGP-Tools](https://github.com/am-i-being-pwned/pgp-tools)** | Open-source browser extension for PGP encryption, decryption, and signing. Rust/WASM engine with WebAuthn PRF unlock, Argon2id ... | [`am-i-being-pwned/pgp-tools`](https://github.com/am-i-being-pwned/pgp-tools) |
| **[pwned](https://github.com/wkovacs64/pwned)** | CLI tool to query the Have I Been Pwned API for breached accounts, pastes, and password exposure, enabling rapid security asses... | [`wkovacs64/pwned`](https://github.com/wkovacs64/pwned) |
| **[PwnedCheck](https://github.com/mohamedation/pwnedcheck)** | A command-line tool to check if passwords have been exposed in data breaches using the Have I Been Pwned (HIBP) API. | [`mohamedation/pwnedcheck`](https://github.com/mohamedation/pwnedcheck) |
| **[SANS Institute Training](https://www.sans.org)** | Comprehensive cybersecurity training offering more than 60 courses across all practice areas including web security | [Website ↗](https://www.sans.org) |
| **[Sqlmap](https://github.com/sqlmapproject/sqlmap)** | Automatic SQL injection and database takeover tool supporting diverse database management systems. | [`sqlmapproject/sqlmap`](https://github.com/sqlmapproject/sqlmap) |
| **[Vega](https://github.com/subgraph/Vega)** | An open-source web security scanner and testing platform to test the security of web applications | [`subgraph/Vega`](https://github.com/subgraph/Vega) |
| **[W3af](https://github.com/andresriancho/w3af)** | An open-source web application security scanner that helps secure web applications by finding and exploiting all web applicatio... | [`andresriancho/w3af`](https://github.com/andresriancho/w3af) |
| **[Wapiti](https://github.com/wapiti-scanner/wapiti)** | A web application vulnerability scanner that performs black-box scans to audit the security of web applications | [`wapiti-scanner/wap`](https://github.com/wapiti-scanner/wap) |
| **[Web Security Academy](https://portswigger.net/web-security)** | A free online training center for web application security, including content from PortSwigger's in-house research team | [Website ↗](https://portswigger.net/web-security) |
| **[XSStrike](https://github.com/s0md3v/XSStrike)** | Advanced Cross-Site Scripting (XSS) detection suite equipped with an intelligent payload generation and context analysis engine. | [`s0md3v/XSStrike`](https://github.com/s0md3v/XSStrike) |

### 🔑 Identity, Access & Zero Trust
_Authentication, authorization, IAM auditing, credential security, and zero-trust boundary controls._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[ad-password-protection](https://github.com/lithnet/ad-password-protection)** | Active Directory password filter featuring breached password checking and custom complexity rules | [`lithnet/ad-password-protection`](https://github.com/lithnet/ad-password-protection) |
| **[gEnclave](https://gitlab.com/renich/genclave)** | Centralized, TPM 2.0 hardware-backed cryptographic identity enclave and multi-protocol bridge for Linux (FIDO2/CTAP2 WebAuthn P... | [`renich/genclave`](https://github.com/renich/genclave) |
| **[Keycloak](https://github.com/keycloak/keycloak)** | An open-source identity and access management platform for authentication, federation, single sign-on, and fine-grained authori... | [`keycloak/keycloak`](https://github.com/keycloak/keycloak) |
| **[linWinPwn](https://github.com/lefayjey/linwinpwn)** | Bash script wrapping Active Directory tools for automated enumeration, vulnerability checks, exploitation, and password dumping... | [`lefayjey/linwinpwn`](https://github.com/lefayjey/linwinpwn) |
| **[NetExec](https://github.com/pennyw0rth/netexec)** | Post-exploitation framework for automated network authentication testing, credential harvesting, and lateral movement across Wi... | [`pennyw0rth/netexec`](https://github.com/pennyw0rth/netexec) |
| **[Scavenger](https://github.com/rndinfosecguy/scavenger)** | Crawler (Bot) searching for credential leaks on paste sites. | [`rndinfosecguy/scavenger`](https://github.com/rndinfosecguy/scavenger) |
| **[TeamPass](https://github.com/nilsteampassnet/teampass)** | Collaborative Passwords Manager | [`nilsteampassnet/teampass`](https://github.com/nilsteampassnet/teampass) |

### 🔍 Vulnerability Assessment & Scanners
_Vulnerability scanning, CVE intelligence, configuration auditing, and vulnerability management._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[Aircrack-ng](https://www.aircrack-ng.org/)** | Complete suite of tools for assessing and testing WiFi network security, packet capture, and cryptographic cracking. | [`aircrack-ng/aircrack-ng`](https://github.com/aircrack-ng/aircrack-ng) |
| **[airgorah](https://github.com/martin-olivier/airgorah)** | Rust-based GUI tool for WiFi security auditing: captures traffic, discovers clients, performs deauthentication attacks, capture... | [`martin-olivier/airgorah`](https://github.com/martin-olivier/airgorah) |
| **[cmdchamp](https://github.com/mellen9999/cmdchamp)** | bash CLI trainer — 30 levels from ls to privilege escalation | [`mellen9999/cmdchamp`](https://github.com/mellen9999/cmdchamp) |
| **[DefectDojo](https://www.defectdojo.org/)** | Open-source vulnerability management and DevSecOps correlation platform offering reports, metrics, and CI integrations. | [`DefectDojo/django-DefectDojo`](https://github.com/DefectDojo/django-DefectDojo) |
| **[Hashcat](https://hashcat.net/hashcat/)** | World's fastest and most advanced password recovery utility supporting hundreds of hash modes and multi-GPU acceleration. | [`hashcat/hashcat`](https://github.com/hashcat/hashcat) |
| **[hcxdumptool](https://github.com/zerbea/hcxdumptool)** | Small tool to capture packets from wlan devices. | [`zerbea/hcxdumptool`](https://github.com/zerbea/hcxdumptool) |
| **[hcxtools](https://github.com/zerbea/hcxtools)** | A small set of tools to convert packets from capture files to hash files for use with Hashcat or John the Ripper. | [`zerbea/hcxtools`](https://github.com/zerbea/hcxtools) |
| **[John the Ripper](https://www.openwall.com/john/)** | Fast offline password cracker supporting hundreds of hash and cipher types across multiple architectures. | [`openwall/john`](https://github.com/openwall/john) |
| **[Lynis](https://cisofy.com/lynis/)** | Battle-tested security auditing and compliance scanner for Linux, macOS, and Unix-based operating systems. | [`CISOfy/lynis`](https://github.com/CISOfy/lynis) |
| **[Mr.SIP](https://github.com/meliht/mr.sip)** | SIP Security Assessment Framework for VoIP Pentesters. Presented at DEFCON, BlackHat & Offzone. | [`meliht/mr.sip`](https://github.com/meliht/mr.sip) |
| **[Nmap](https://nmap.org/)** | Network mapper and port scanner for network discovery, vulnerability detection, and service fingerprinting. | [`nmap/nmap`](https://github.com/nmap/nmap) |
| **[Nuclei](https://github.com/projectdiscovery/nuclei)** | Fast and customizable vulnerability scanner based on community-powered YAML templates for automated testing. | [`projectdiscovery/nuclei`](https://github.com/projectdiscovery/nuclei) |
| **[OpenVAS](https://www.openvas.org/)** | Full-featured vulnerability scanner and management suite with daily-updated network vulnerability tests. | [`greenbone/openvas-scanner`](https://github.com/greenbone/openvas-scanner) |
| **[pentoo-overlay](https://github.com/pentoo/pentoo-overlay)** | Gentoo overlay for security tools as well as the heart of the Pentoo Livecd | [`pentoo/pentoo-overlay`](https://github.com/pentoo/pentoo-overlay) |
| **[Qualys VMDR](https://www.qualys.com/apps/vulnerability-management-detection-response/)** | Combines vulnerability scanning with AI-driven risk prioritization, ideal for large IT infrastructures | [Website ↗](https://www.qualys.com/apps/vulnerability-management-detection-response/) |
| **[sippts](https://github.com/pepelux/sippts)** | Set of tools to audit SIP based VoIP Systems | [`pepelux/sippts`](https://github.com/pepelux/sippts) |
| **[VMkatz](https://github.com/nikaiw/vmkatz)** | Extract Windows credentials directly from VM memory snapshots and virtual disks | [`nikaiw/vmkatz`](https://github.com/nikaiw/vmkatz) |
| **[wifi_db](https://github.com/r4ulcl/wifi_db)** | Script to parse Aircrack-ng captures into a SQLite database and extract useful information like handshakes, MGT identities, int... | [`r4ulcl/wifi_db`](https://github.com/r4ulcl/wifi_db) |
| **[yellowkey-bitlocker](https://github.com/desireeontrial76/yellowkey-bitlocker)** | Manage and recover BitLocker encrypted drives with this tool for Windows 11 recovery key management and educational study of CV... | [`desireeontrial76/yellowkey-bitlocker`](https://github.com/desireeontrial76/yellowkey-bitlocker) |

### ⚔️ Penetration Testing & Exploitation
_Penetration testing frameworks, exploit tooling, post-exploitation, and security distributions._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[hacktricks](https://github.com/hacktricks-wiki/hacktricks)** | Welcome to the page where you will find each trick/technique/whatever I have learnt in CTFs, real life apps, and reading resear... | [`hacktricks-wiki/hacktricks`](https://github.com/hacktricks-wiki/hacktricks) |
| **[impacket](https://github.com/fortra/impacket)** | Python library for low-level network protocol manipulation, featuring SMB, MSRPC, Kerberos, and WMI implementations with tools ... | [`fortra/impacket`](https://github.com/fortra/impacket) |
| **[Kali Linux](https://www.kali.org/)** | Industry-standard open-source Linux distribution for penetration testing, digital forensics, and security research. | [Website ↗](https://www.kali.org/) |
| **[Metasploit](https://www.metasploit.com/)** | World's most widely used penetration testing framework for discovering, validating, and exploiting vulnerabilities. | [`rapid7/metasploit-framework`](https://github.com/rapid7/metasploit-framework) |
| **[rules](https://github.com/ibnaleem/rules)** | Curated collection of Hashcat password-cracking rules with benchmark data, designed to help red teams and penetration testers c... | [`ibnaleem/rules`](https://github.com/ibnaleem/rules) |
| **[server](https://github.com/hashtopolis/server)** | Hashtopolis - distributed password cracking with Hashcat | [`hashtopolis/server`](https://github.com/hashtopolis/server) |
| **[voidsec-proxy](https://github.com/voidsecsoftwares/voidsec-proxy)** | Multi-module offensive security toolkit for SOCKS5 proxy chaining, port scanning, DNS enumeration, hash cracking, reverse shell... | [`voidsecsoftwares/voidsec-proxy`](https://github.com/voidsecsoftwares/voidsec-proxy) |

### 📡 Network Security & Monitoring
_Port scanning, traffic inspection, IDS/IPS, packet analysis, and perimeter security._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[awesome-privacy](https://github.com/lissy93/awesome-privacy)** | 🦄 A curated list of privacy & security-focused software and services | [`lissy93/awesome-privacy`](https://github.com/lissy93/awesome-privacy) |
| **[Snort](https://www.snort.org/)** | Open-source network intrusion prevention and detection system capable of real-time packet logging and traffic analysis. | [`snort3/snort3`](https://github.com/snort3/snort3) |
| **[Wireshark](https://www.wireshark.org/)** | World's foremost network protocol analyzer for deep packet inspection, traffic troubleshooting, and security analysis. | [`wireshark/wireshark`](https://github.com/wireshark/wireshark) |

### 👁️ OSINT & Threat Intelligence
_Threat intelligence sharing, IOC correlation, attack surface mapping, and reconnaissance._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[bramble](https://github.com/flythenimbus/bramble)** | Local-first password manager with direct device-to-device sync | [`flythenimbus/bramble`](https://github.com/flythenimbus/bramble) |
| **[cyclepatrol](https://github.com/buybitart/cyclepatrol)** | Bash tool for on-foot Wi-Fi security checks in a loop, with evidence reports. (re-invented wifi WarDriving) | [`buybitart/cyclepatrol`](https://github.com/buybitart/cyclepatrol) |
| **[MISP](https://www.misp-project.org/)** | Open-source threat intelligence platform for sharing, storing, and correlating Indicators of Compromise (IOCs). | [`MISP/MISP`](https://github.com/MISP/MISP) |
| **[SecLists](https://github.com/danielmiessler/seclists)** | Curated collection of wordlists for security assessments, including usernames, passwords, URLs, fuzzing payloads, and sensitive... | [`danielmiessler/seclists`](https://github.com/danielmiessler/seclists) |
| **[Shodan](https://www.shodan.io/)** | Search engine for Internet-connected devices, industrial control systems, and open service infrastructure. | [Website ↗](https://www.shodan.io/) |

### 🚨 Incident Response & Forensics
_Digital forensics, memory analysis, disk investigation, log analysis, and incident triage._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[digital-forensics-lab](https://github.com/frankwxu/digital-forensics-lab)** | Free hands-on digital forensics labs for students and faculty | [`frankwxu/digital-forensics-lab`](https://github.com/frankwxu/digital-forensics-lab) |
| **[OSSEC](https://www.ossec.net/)** | Open-source host-based intrusion detection system (HIDS) performing log analysis, rootkit detection, and file integrity monitor... | [`ossec/ossec-hids`](https://github.com/ossec/ossec-hids) |
| **[walletool](https://github.com/qg5casz/walletool)** | Extracts cryptocurrency private keys and addresses from wallet.dat files for Bitcoin and Litecoin, enabling wallet recovery and... | [`qg5casz/walletool`](https://github.com/qg5casz/walletool) |

### 🔐 Cryptography & Password Auditing
_Password cracking, hash analysis, cryptographic verification, and WiFi assessment._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[apm](https://github.com/aaravmaloo/apm)** | A local password manager for everyone | [`aaravmaloo/apm`](https://github.com/aaravmaloo/apm) |
| **[dpapi-toolkit](https://github.com/crypt0p3g/dpapi-toolkit)** | Drop any Windows DPAPI artifact and it identifies the format and the exact master key it needs, then decrypts once you supply t... | [`crypt0p3g/dpapi-toolkit`](https://github.com/crypt0p3g/dpapi-toolkit) |
| **[GateX](https://github.com/abraxas/gatex)** | FortinetHunter (@YogSoth0) binary cracking application. Part of CTF for FortinetHunter. ELF door: a stripped Nuitka onefile, an... | [`abraxas/gatex`](https://github.com/abraxas/gatex) |
| **[GoFileX](https://github.com/abraxas/gofilex)** | Wordlist Bruteforcer for GoFile (gofile.io) Download Passwords | [`abraxas/gofilex`](https://github.com/abraxas/gofilex) |
| **[haiti](https://github.com/noraj/haiti)** | 🔑 Hash type identifier (CLI & lib) | [`noraj/haiti`](https://github.com/noraj/haiti) |
| **[HashcatRosetta](https://github.com/bandrel/hashcatrosetta)** | Hashcat rule analyzer and interpreter - A Rosetta Stone for decoding hashcat rule syntax | [`bandrel/hashcatrosetta`](https://github.com/bandrel/hashcatrosetta) |
| **[HashiCorp Vault](https://github.com/hashicorp/vault)** | A secrets and encryption platform for centrally controlling access to credentials, keys, tokens, and privileged operations. | [`hashicorp/vault`](https://github.com/hashicorp/vault) |
| **[hate_crack](https://github.com/trustedsec/hate_crack)** | A tool for automating cracking methodologies through Hashcat from the TrustedSec team. | [`trustedsec/hate_crack`](https://github.com/trustedsec/hate_crack) |
| **[john](https://github.com/openwall/john)** | John the Ripper jumbo - advanced offline password cracker, which supports hundreds of hash and cipher types, and runs on many o... | [`openwall/john`](https://github.com/openwall/john) |
| **[Klip](https://github.com/vid4l-07/klip)** | Minimal terminal-based password manager | [`vid4l-07/klip`](https://github.com/vid4l-07/klip) |
| **[krakenhashes](https://github.com/zerkereod/krakenhashes)** | Distributed password cracking platform coordinating GPU/CPU agents via Hashcat for high-speed hash recovery, with real-time job... | [`zerkereod/krakenhashes`](https://github.com/zerkereod/krakenhashes) |
| **[SHA256-CDP](https://github.com/jm00nj/sha256-cdp)** | GPU-accelerated SHA-256 rainbow table implementation based on CDP (Cyclic Digit-sum Projection) structural analysis. AMD RX 907... | [`jm00nj/sha256-cdp`](https://github.com/jm00nj/sha256-cdp) |
| **[sklad](https://github.com/rench321/sklad)** | Industrial-grade secure snippet warehouse for your system tray. 📦 Built with Rust (Tauri v2) & React. Offline-first, AES-256 en... | [`rench321/sklad`](https://github.com/rench321/sklad) |

### 📚 Security Guidelines & Training
_Security standards, verification guides, training academies, and benchmark lists._

| Tool | Description | Repository / Link |
| :--- | :--- | :--- |
| **[Cybrary](https://www.cybrary.it)** | Online cybersecurity courses and training for individuals and teams, including certification preparation | [Website ↗](https://www.cybrary.it) |
| **[Paragonie Awesome AppSec](https://github.com/paragonie/awesome-appsec)** | A curated list of resources for learning about application security, including books, websites, blog posts, and self-assessment... | [`paragonie/awesome-appsec`](https://github.com/paragonie/awesome-appsec) |
| **[TCM Security Academy](https://academy.tcm-sec.com)** | Practical, job-focused cybersecurity training designed by industry-leading instructors | [Website ↗](https://academy.tcm-sec.com) |

### ➕ How to Add a Tool to This Table
Contributions from the security community are welcome!

1. Add an entry to [`priv/data/security-entries.json`](./priv/data/security-entries.json):
   ```json
   {
     "title": "MySecurityTool",
     "link": "https://github.com/org/mysecuritytool",
     "description": "A clear 1-2 sentence description explaining what the tool secures or tests.",
     "tag": "Agentic & AI Security",
     "github": "org/mysecuritytool"
   }
   ```
2. Run `make readme` (or `python3 scripts/update_readme_tools.py`).
3. Submit a Pull Request. GitHub Actions will automatically validate the schema, update the table, and export the site.

<!-- TOOLS_TABLE:END -->
