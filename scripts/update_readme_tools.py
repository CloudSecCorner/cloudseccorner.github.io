#!/usr/bin/env python3
"""
Automatically synchronizes the tools database (priv/data/security-entries.json)
with the markdown tables in README.md and keeps static assets in sync.

When any tool is added to priv/data/security-entries.json with a human-written
description (or tagged as featured), this script detects it and updates the
tables in README.md.

Usage:
    python3 scripts/update_readme_tools.py
"""

import json
import os
import re
import shutil
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(BASE_DIR, "priv", "data", "security-entries.json")
STATIC_DATA_FILE = os.path.join(BASE_DIR, "priv", "static", "data", "security-entries.json")
README_FILE = os.path.join(BASE_DIR, "README.md")

START_MARKER = "<!-- TOOLS_TABLE:START -->"
END_MARKER = "<!-- TOOLS_TABLE:END -->"

# Core showcase tools and their canonical descriptions
CORE_SHOWCASE_TOOLS = {
    "owasp agentic security initiative": {
        "title": "OWASP Agentic Security Initiative",
        "link": "https://genai.owasp.org/initiatives/agentic-security-initiative/",
        "description": "Community research, standards, threat models, and implementation guidance for securing autonomous agents and multi-step AI workflows.",
        "tag": "Agentic & AI Security",
        "github": None
    },
    "owasp secure agent playbook": {
        "title": "OWASP Secure Agent Playbook",
        "link": "https://github.com/OWASP/secure-agent-playbook",
        "description": "An open playbook of practical security checks for AI agents, covering prompt injection, tool misuse, credential leakage, and business integrity.",
        "tag": "Agentic & AI Security",
        "github": "OWASP/secure-agent-playbook"
    },
    "garak": {
        "title": "Garak",
        "link": "https://github.com/NVIDIA/garak",
        "description": "LLM vulnerability scanner probing hallucination, prompt injection, jailbreaks, data leakage, and toxic output.",
        "tag": "Agentic & AI Security",
        "github": "NVIDIA/garak"
    },
    "pyrit": {
        "title": "PyRIT",
        "link": "https://github.com/microsoft/PyRIT",
        "description": "Microsoft's Python Risk Identification Tool for automated generative AI red teaming and adversarial probing.",
        "tag": "Agentic & AI Security",
        "github": "microsoft/PyRIT"
    },
    "promptfoo": {
        "title": "Promptfoo",
        "link": "https://github.com/promptfoo/promptfoo",
        "description": "Test-driven security evaluation and red-teaming tool for LLMs, prompts, RAG systems, and agentic workflows.",
        "tag": "Agentic & AI Security",
        "github": "promptfoo/promptfoo"
    },
    "snyk agent scan": {
        "title": "Snyk Agent Scan",
        "link": "https://github.com/snyk/agent-scan",
        "description": "Discovers agent components, MCP servers, and skills, then scans them for risks such as prompt injection, tool poisoning, and unsafe actions.",
        "tag": "Agentic & AI Security",
        "github": "snyk/agent-scan"
    },
    "falco": {
        "title": "Falco",
        "link": "https://falco.org/",
        "description": "Cloud-native runtime security and behavioral threat detection engine for containers, Kubernetes, and Linux hosts.",
        "tag": "Cloud & Container Security",
        "github": "falcosecurity/falco"
    },
    "trivy": {
        "title": "Trivy",
        "link": "https://github.com/aquasecurity/trivy",
        "description": "Comprehensive vulnerability, misconfiguration, secret, and SBOM scanner for containers, Kubernetes, and code repos.",
        "tag": "Cloud & Container Security",
        "github": "aquasecurity/trivy"
    },
    "cnspec": {
        "title": "Cnspec",
        "link": "https://github.com/mondoohq/cnspec",
        "description": "Open-source cloud-native security and compliance scanner assessing Kubernetes, cloud accounts, and infrastructure as code.",
        "tag": "Cloud & Container Security",
        "github": "mondoohq/cnspec"
    },
    "docker-bench-security": {
        "title": "Docker Bench Security",
        "link": "https://github.com/docker/docker-bench-security",
        "description": "Script that checks for dozens of common best-practices around deploying Docker containers in production.",
        "tag": "Cloud & Container Security",
        "github": "docker/docker-bench-security"
    },
    "owasp": {
        "title": "OWASP",
        "link": "https://owasp.org/",
        "description": "The Open Worldwide Application Security Project dedicated to improving software security with tools, documents, and communities.",
        "tag": "Application & Web Security",
        "github": None
    },
    "burp suite": {
        "title": "Burp Suite",
        "link": "https://portswigger.net/burp",
        "description": "Industry-standard interactive proxy and automated vulnerability scanner for web application security assessments.",
        "tag": "Application & Web Security",
        "github": None
    },
    "owasp zap": {
        "title": "OWASP ZAP",
        "link": "https://www.zaproxy.org/",
        "description": "World's most widely used free, open-source dynamic web application security scanner and penetration testing proxy.",
        "tag": "Application & Web Security",
        "github": "zaproxy/zaproxy"
    },
    "nikto": {
        "title": "Nikto",
        "link": "https://cirt.net/Nikto2",
        "description": "Open-source web server scanner that tests for over 6,700 dangerous files, outdated server software, and version flaws.",
        "tag": "Application & Web Security",
        "github": "sullo/nikto"
    },
    "sqlmap": {
        "title": "Sqlmap",
        "link": "https://github.com/sqlmapproject/sqlmap",
        "description": "Automatic SQL injection and database takeover tool supporting diverse database management systems.",
        "tag": "Application & Web Security",
        "github": "sqlmapproject/sqlmap"
    },
    "xsstrike": {
        "title": "XSStrike",
        "link": "https://github.com/s0md3v/XSStrike",
        "description": "Advanced Cross-Site Scripting (XSS) detection suite equipped with an intelligent payload generation and context analysis engine.",
        "tag": "Application & Web Security",
        "github": "s0md3v/XSStrike"
    },
    "modsecurity": {
        "title": "ModSecurity",
        "link": "https://modsecurity.org/",
        "description": "Open-source web application firewall (WAF) providing HTTP traffic monitoring, logging, and real-time attack filtering.",
        "tag": "Application & Web Security",
        "github": "owasp-modsecurity/ModSecurity"
    },
    "openvas": {
        "title": "OpenVAS",
        "link": "https://www.openvas.org/",
        "description": "Full-featured vulnerability scanner and management suite with daily-updated network vulnerability tests.",
        "tag": "Vulnerability Assessment",
        "github": "greenbone/openvas-scanner"
    },
    "nuclei": {
        "title": "Nuclei",
        "link": "https://github.com/projectdiscovery/nuclei",
        "description": "Fast and customizable vulnerability scanner based on community-powered YAML templates for automated testing.",
        "tag": "Vulnerability Assessment",
        "github": "projectdiscovery/nuclei"
    },
    "defectdojo": {
        "title": "DefectDojo",
        "link": "https://www.defectdojo.org/",
        "description": "Open-source vulnerability management and DevSecOps correlation platform offering reports, metrics, and CI integrations.",
        "tag": "Vulnerability Assessment",
        "github": "DefectDojo/django-DefectDojo"
    },
    "lynis": {
        "title": "Lynis",
        "link": "https://cisofy.com/lynis/",
        "description": "Battle-tested security auditing and compliance scanner for Linux, macOS, and Unix-based operating systems.",
        "tag": "Vulnerability Assessment",
        "github": "CISOfy/lynis"
    },
    "metasploit": {
        "title": "Metasploit",
        "link": "https://www.metasploit.com/",
        "description": "World's most widely used penetration testing framework for discovering, validating, and exploiting vulnerabilities.",
        "tag": "Penetration Testing",
        "github": "rapid7/metasploit-framework"
    },
    "kali linux": {
        "title": "Kali Linux",
        "link": "https://www.kali.org/",
        "description": "Industry-standard open-source Linux distribution for penetration testing, digital forensics, and security research.",
        "tag": "Penetration Testing",
        "github": None
    },
    "nmap": {
        "title": "Nmap",
        "link": "https://nmap.org/",
        "description": "Network mapper and port scanner for network discovery, vulnerability detection, and service fingerprinting.",
        "tag": "Network Security",
        "github": "nmap/nmap"
    },
    "wireshark": {
        "title": "Wireshark",
        "link": "https://www.wireshark.org/",
        "description": "World's foremost network protocol analyzer for deep packet inspection, traffic troubleshooting, and security analysis.",
        "tag": "Network Security",
        "github": "wireshark/wireshark"
    },
    "snort": {
        "title": "Snort",
        "link": "https://www.snort.org/",
        "description": "Open-source network intrusion prevention and detection system capable of real-time packet logging and traffic analysis.",
        "tag": "Network Security",
        "github": "snort3/snort3"
    },
    "shodan": {
        "title": "Shodan",
        "link": "https://www.shodan.io/",
        "description": "Search engine for Internet-connected devices, industrial control systems, and open service infrastructure.",
        "tag": "OSINT & Threat Intelligence",
        "github": None
    },
    "misp": {
        "title": "MISP",
        "link": "https://www.misp-project.org/",
        "description": "Open-source threat intelligence platform for sharing, storing, and correlating Indicators of Compromise (IOCs).",
        "tag": "OSINT & Threat Intelligence",
        "github": "MISP/MISP"
    },
    "ossec": {
        "title": "OSSEC",
        "link": "https://www.ossec.net/",
        "description": "Open-source host-based intrusion detection system (HIDS) performing log analysis, rootkit detection, and file integrity monitoring.",
        "tag": "Incident Response & Forensics",
        "github": "ossec/ossec-hids"
    },
    "hashcat": {
        "title": "Hashcat",
        "link": "https://hashcat.net/hashcat/",
        "description": "World's fastest and most advanced password recovery utility supporting hundreds of hash modes and multi-GPU acceleration.",
        "tag": "Cryptography & Password Auditing",
        "github": "hashcat/hashcat"
    },
    "aircrack-ng": {
        "title": "Aircrack-ng",
        "link": "https://www.aircrack-ng.org/",
        "description": "Complete suite of tools for assessing and testing WiFi network security, packet capture, and cryptographic cracking.",
        "tag": "Cryptography & Password Auditing",
        "github": "aircrack-ng/aircrack-ng"
    },
    "john": {
        "title": "John the Ripper",
        "link": "https://www.openwall.com/john/",
        "description": "Fast offline password cracker supporting hundreds of hash and cipher types across multiple architectures.",
        "tag": "Cryptography & Password Auditing",
        "github": "openwall/john"
    },
    "owasp top ten": {
        "title": "OWASP Top Ten",
        "link": "https://owasp.org/www-project-top-ten/",
        "description": "Standard awareness document for developers and security teams representing the most critical risks to web applications.",
        "tag": "Security Guidelines & Training",
        "github": None
    },
    "owasp asvs": {
        "title": "OWASP ASVS",
        "link": "https://owasp.org/www-project-application-security-verification-standard/",
        "description": "Application Security Verification Standard providing a basis for designing, building, and testing technical security controls.",
        "tag": "Security Guidelines & Training",
        "github": "OWASP/ASVS"
    },
    "owasp api security top 10": {
        "title": "OWASP API Security Top 10",
        "link": "https://owasp.org/www-project-api-security/",
        "description": "Periodic consensus document on the most critical security risks facing modern web APIs and microservices.",
        "tag": "Security Guidelines & Training",
        "github": "OWASP/API-Security"
    }
}

# The 11 core defense domains
DOMAINS = [
    {
        "id": "agentic-ai",
        "title": "🤖 Agentic & AI Security",
        "description": "AI agent guardrails, LLM red teaming, MCP security, sandboxing, and prompt evaluation.",
        "regex": re.compile(r"\b(agentic|agent|mcp|llm|llms|langchain|prompt inject|guardrail|openai|anthropic|ai security|promptfoo|garak|pyrit|giskard|nemo)\b", re.I),
    },
    {
        "id": "cloud-container",
        "title": "☁️ Cloud & Container Security",
        "description": "Cloud security posture (CSPM), Kubernetes security, container runtime defense, and image scanning.",
        "regex": re.compile(r"\b(cloud|container|docker|kubernetes|k8s|helm|trivy|falco|runtime|aws|azure|gcp|cspm|cwpp|cnspec)\b", re.I),
    },
    {
        "id": "app-web-sec",
        "title": "🛡️ Application & Web Security",
        "description": "SAST, DAST, web scanners, API defense, WAFs, and software supply chain protection.",
        "regex": re.compile(r"\b(web|dast|sast|waf|api|burp|zap|nikto|modsecurity|owasp|arachni|wapiti|vega|w3af|xss|sql|sqlmap|xsstrike|injection|browser)\b", re.I),
    },
    {
        "id": "identity-zero-trust",
        "title": "🔑 Identity, Access & Zero Trust",
        "description": "Authentication, authorization, IAM auditing, credential security, and zero-trust boundary controls.",
        "regex": re.compile(r"\b(identity|iam|zero trust|oauth|jwt|saml|active directory|ad|ldap|access management|teampass|credential)\b", re.I),
    },
    {
        "id": "vuln-assessment",
        "title": "🔍 Vulnerability Assessment & Scanners",
        "description": "Vulnerability scanning, CVE intelligence, configuration auditing, and vulnerability management.",
        "regex": re.compile(r"\b(vulnerability|cve|scanner|openvas|nuclei|qualys|defectdojo|lynis|nessus|auditing|mr\.sip)\b", re.I),
    },
    {
        "id": "pentest-exploit",
        "title": "⚔️ Penetration Testing & Exploitation",
        "description": "Penetration testing frameworks, exploit tooling, post-exploitation, and security distributions.",
        "regex": re.compile(r"\b(pentest|penetration|exploit|metasploit|kali|netexec|impacket|linwinpwn|privilege escalation|c2|payload|shell|framework)\b", re.I),
    },
    {
        "id": "network-perimeter",
        "title": "📡 Network Security & Monitoring",
        "description": "Port scanning, traffic inspection, IDS/IPS, packet analysis, and perimeter security.",
        "regex": re.compile(r"\b(network|nmap|wireshark|snort|packet|sniffing|firewall|pfsense|traffic|ids|ips|pcap)\b", re.I),
    },
    {
        "id": "osint-threat-intel",
        "title": "👁️ OSINT & Threat Intelligence",
        "description": "Threat intelligence sharing, IOC correlation, attack surface mapping, and reconnaissance.",
        "regex": re.compile(r"\b(osint|threat intelligence|recon|reconnaissance|shodan|misp|ioc|scavenger|pwned|hacktricks|information gathering)\b", re.I),
    },
    {
        "id": "ir-forensics",
        "title": "🚨 Incident Response & Forensics",
        "description": "Digital forensics, memory analysis, disk investigation, log analysis, and incident triage.",
        "regex": re.compile(r"\b(forensic|forensics|incident response|ossec|memory forensics|disk forensics|donpapi|triage|malware)\b", re.I),
    },
    {
        "id": "crypto-password",
        "title": "🔐 Cryptography & Password Auditing",
        "description": "Password cracking, hash analysis, cryptographic verification, and WiFi assessment.",
        "regex": re.compile(r"\b(password|hashcat|aircrack|crypto|cryptography|hash|cracking|wifi|encryption|john|haiti|airgorah|hcxtools|hcxdumptool)\b", re.I),
    },
    {
        "id": "standards-learning",
        "title": "📚 Security Guidelines & Training",
        "description": "Security standards, verification guides, training academies, and benchmark lists.",
        "regex": re.compile(r"\b(top ten|asvs|sans|academy|training|learning|guidelines|standards|curated list|seclists)\b", re.I),
    },
]


def sanitize_markdown(text):
    """Escapes pipes and cleans excessive whitespace for Markdown table cells."""
    if not text:
        return ""
    text = text.replace("|", "\\|").replace("\n", " ").strip()
    return re.sub(r"\s+", " ", text)


def is_crawler_generic_description(desc):
    """Detects auto-crawled generic GitHub description templates."""
    if not desc:
        return True
    return bool(re.search(r"repository by\s+.*?\s+on git", desc, re.I))


def categorize_tool(tool):
    """Assigns tool to one of the 11 domain categories."""
    haystack = f"{tool.get('title', '')} {tool.get('tag', '')} {tool.get('description', '')}"

    for domain in DOMAINS:
        if domain["regex"].search(haystack):
            return domain["id"]

    return "app-web-sec"


def extract_github_repo(tool):
    """Extracts clean username/repo string if available."""
    github = tool.get("github")
    if github and "/" in github:
        return github.strip().strip("/")
    link = tool.get("link", "")
    match = re.search(r"github\.com/([^/]+/[^/#?]+)", link)
    if match:
        repo = match.group(1).rstrip(".git").strip("/")
        if "/" in repo and len(repo.split("/")) == 2:
            return repo
    return None


def build_markdown_table(domain_title, domain_desc, tools):
    """Renders a single domain's tools as a Markdown table."""
    lines = []
    lines.append(f"### {domain_title}")
    lines.append(f"_{domain_desc}_\n")
    lines.append("| Tool | Description | Repository / Link |")
    lines.append("| :--- | :--- | :--- |")

    sorted_tools = sorted(tools, key=lambda t: t.get("title", "").lower())

    for tool in sorted_tools:
        title = tool.get("title", "").strip()
        link = tool.get("link", "").strip()
        desc = sanitize_markdown(tool.get("description", ""))
        repo = extract_github_repo(tool)

        if len(desc) > 130:
            desc = desc[:127] + "..."

        tool_link = f"**[{title}]({link})**" if link else f"**{title}**"

        if repo:
            repo_link = f"[`{repo}`](https://github.com/{repo})"
        elif link:
            repo_link = f"[Website ↗]({link})"
        else:
            repo_link = "—"

        lines.append(f"| {tool_link} | {desc} | {repo_link} |")

    lines.append("")
    return "\n".join(lines)


def generate_tools_markdown(tools):
    """Builds the full tools section with summary and category tables."""
    seen_titles = set()
    curated_tools = []

    # 1. First add core showcase tools with verified canonical descriptions
    for key, data in CORE_SHOWCASE_TOOLS.items():
        seen_titles.add(data["title"].strip().lower())
        curated_tools.append(data)

    # 2. Iterate through security-entries.json:
    # If an entry has a human description (not crawler template) or is featured, include it!
    for tool in tools:
        title = tool.get("title", "").strip()
        title_lower = title.lower()

        if title_lower in seen_titles:
            continue

        desc = tool.get("description", "")
        is_curated = not is_crawler_generic_description(desc)
        is_featured = tool.get("featured", False)

        if is_curated or is_featured:
            seen_titles.add(title_lower)
            curated_tools.append(tool)

    # 3. Categorize into domain buckets
    buckets = {d["id"]: [] for d in DOMAINS}
    for tool in curated_tools:
        domain_id = categorize_tool(tool)
        buckets[domain_id].append(tool)

    total_curated = sum(len(b) for b in buckets.values())
    total_db = len(tools)

    output = []
    output.append(START_MARKER)
    output.append("## Curated Security Tools\n")
    output.append(
        f"This directory is **automatically synchronized** from [`priv/data/security-entries.json`](./priv/data/security-entries.json). "
        f"Below is a curated showcase of **{total_curated} community-highlighted tools** across 11 core security domains. "
        f"Search and filter the complete collection of **{total_db:,} tools** on **[cloudsecuritycorner.com/tools](https://cloudsecuritycorner.com/tools/)**.\n"
    )

    for domain in DOMAINS:
        domain_tools = buckets.get(domain["id"], [])
        if domain_tools:
            table_md = build_markdown_table(domain["title"], domain["description"], domain_tools)
            output.append(table_md)

    output.append("### ➕ How to Add a Tool to This Table")
    output.append("Contributions from the security community are welcome!\n")
    output.append("1. Add an entry to [`priv/data/security-entries.json`](./priv/data/security-entries.json):")
    output.append("   ```json")
    output.append("   {")
    output.append('     "title": "MySecurityTool",')
    output.append('     "link": "https://github.com/org/mysecuritytool",')
    output.append('     "description": "A clear 1-2 sentence description explaining what the tool secures or tests.",')
    output.append('     "tag": "Agentic & AI Security",')
    output.append('     "github": "org/mysecuritytool"')
    output.append("   }")
    output.append("   ```")
    output.append("2. Run `make readme` (or `python3 scripts/update_readme_tools.py`).")
    output.append("3. Submit a Pull Request. GitHub Actions will automatically validate the schema, update the table, and export the site.\n")
    output.append(END_MARKER)

    return "\n".join(output)


def update_readme():
    """Reads tools, generates table, and injects into README.md."""
    if not os.path.exists(DATA_FILE):
        print(f"Error: Data file {DATA_FILE} not found.")
        sys.exit(1)

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        tools = json.load(f)

    # Keep static assets in sync
    os.makedirs(os.path.dirname(STATIC_DATA_FILE), exist_ok=True)
    shutil.copyfile(DATA_FILE, STATIC_DATA_FILE)

    tools_markdown = generate_tools_markdown(tools)

    with open(README_FILE, "r", encoding="utf-8") as f:
        readme_content = f.read()

    if START_MARKER in readme_content and END_MARKER in readme_content:
        pattern = re.compile(f"{re.escape(START_MARKER)}.*?{re.escape(END_MARKER)}", re.DOTALL)
        new_readme = pattern.sub(tools_markdown, readme_content)
    elif "# Tools" in readme_content:
        parts = readme_content.split("# Tools", 1)
        new_readme = parts[0].rstrip() + "\n\n" + tools_markdown + "\n"
    else:
        new_readme = readme_content.rstrip() + "\n\n" + tools_markdown + "\n"

    with open(README_FILE, "w", encoding="utf-8") as f:
        f.write(new_readme)

    print(f"✅ Successfully updated {README_FILE} with curated tools tables ({len(tools):,} total tools indexed).")


if __name__ == "__main__":
    update_readme()
