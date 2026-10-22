/**
 * Cybersecurity tools collection structured as entries
 * 
 * Each entry has the following structure:
 * {
 *     title: string // display name
 *     link: string // the link for the website which contain learning resources
 *     description?: string // description that will be listed with your entry
 *     github?: string // username on github that will display a link to your repo
 *     tag: string // category/tag of the tool
 * }
 */

export const securityEntries = [
  {
    title: "OWASP",
    link: "https://owasp.org/",
    description: "The Open Worldwide Application Security Project is dedicated to improving software security with tools, documents, and communities.",
    github: "OWASP",
    tag: "Application Security"
  },
  {
    title: "Metasploit",
    link: "https://www.metasploit.com/",
    description: "Advanced open-source penetration testing platform that enables you to find, exploit, and validate vulnerabilities.",
    github: "rapid7/metasploit-framework",
    tag: "Penetration Testing"
  },
  {
    title: "Kali Linux",
    link: "https://www.kali.org/",
    description: "Linux distribution designed for digital forensics and penetration testing with hundreds of pre-installed tools.",
    github: "kalilinux",
    tag: "Security Distribution"
  },
  {
    title: "Nmap",
    link: "https://nmap.org/",
    description: "Network mapper that discovers hosts and services on a computer network by sending packets and analyzing responses.",
    github: "nmap/nmap",
    tag: "Network Security"
  },
  {
    title: "Wireshark",
    link: "https://www.wireshark.org/",
    description: "Network protocol analyzer that lets you see what's happening on your network at a microscopic level.",
    github: "wireshark/wireshark",
    tag: "Network Analysis"
  },
  {
    title: "Burp Suite",
    link: "https://portswigger.net/burp",
    description: "Integrated platform for performing security testing of web applications with various tools for the entire testing process.",
    tag: "Web Security"
  },
  {
    title: "OSSEC",
    link: "https://www.ossec.net/",
    description: "Open-source host-based intrusion detection system that performs log analysis, integrity checking, and more.",
    github: "ossec/ossec-hids",
    tag: "Intrusion Detection"
  },
  {
    title: "OWASP ZAP",
    link: "https://www.zaproxy.org/",
    description: "Open-source web application security scanner for finding vulnerabilities in web applications.",
    github: "zaproxy/zaproxy",
    tag: "Web Security"
  },
  {
    title: "Snort",
    link: "https://www.snort.org/",
    description: "Open-source network intrusion prevention and detection system capable of real-time traffic analysis.",
    github: "snort3/snort3",
    tag: "Network Security"
  },
  {
    title: "OpenVAS",
    link: "https://www.openvas.org/",
    description: "Open-source vulnerability scanner and manager for detecting security issues in systems and web applications.",
    github: "greenbone/openvas",
    tag: "Vulnerability Scanner"
  },
  {
    title: "Lynis",
    link: "https://cisofy.com/lynis/",
    description: "Security auditing tool for systems running Linux, macOS, or Unix-based operating systems.",
    github: "CISOfy/lynis",
    tag: "System Auditing"
  },
  {
    title: "Nikto",
    link: "https://cirt.net/Nikto2",
    description: "Open-source web server scanner that performs comprehensive tests against web servers for multiple vulnerabilities.",
    github: "sullo/nikto",
    tag: "Web Security"
  },
  {
    title: "ModSecurity",
    link: "https://modsecurity.org/",
    description: "Open-source web application firewall (WAF) that monitors HTTP traffic and protects against attacks.",
    github: "SpiderLabs/ModSecurity",
    tag: "Web Application Firewall"
  },
  {
    title: "Hashcat",
    link: "https://hashcat.net/hashcat/",
    description: "World's fastest and most advanced password recovery utility supporting over 300 hash types.",
    github: "hashcat/hashcat",
    tag: "Password Cracking"
  },
  {
    title: "Aircrack-ng",
    link: "https://www.aircrack-ng.org/",
    description: "Network software suite for assessment of WiFi network security with monitoring, testing, and attacking capabilities.",
    github: "aircrack-ng/aircrack-ng",
    tag: "Wireless Security"
  },
  {
    title: "Shodan",
    link: "https://www.shodan.io/",
    description: "Search engine for Internet-connected devices, allowing searches for specific types of computers and services.",
    tag: "Reconnaissance"
  },
  {
    title: "Falco",
    link: "https://falco.org/",
    description: "Cloud-native runtime security tool designed to detect anomalous activity in containerized applications.",
    github: "falcosecurity/falco",
    tag: "Cloud Security"
  },
  {
    title: "Trivy",
    link: "https://github.com/aquasecurity/trivy",
    description: "Comprehensive vulnerability scanner for container images, file systems, and Git repositories.",
    github: "aquasecurity/trivy",
    tag: "Container Security"
  },
  {
    title: "DefectDojo",
    link: "https://www.defectdojo.org/",
    description: "Open-source vulnerability management tool that streamlines the testing process and offers metrics and reporting.",
    github: "DefectDojo/django-DefectDojo",
    tag: "Vulnerability Management"
  },
  {
    title: "MISP",
    link: "https://www.misp-project.org/",
    description: "Open-source threat intelligence platform for sharing, storing, and correlating IOCs and threat intelligence.",
    github: "MISP/MISP",
    tag: "Threat Intelligence"
  }

  ,
    {
      title: "OWASP Top Ten",
      link: "https://owasp.org/www-project-top-ten/",
      description: "A standard awareness document for developers and web application security, representing broad consensus about the most critical security risks to web applications",
      tag: "Security Guidelines"
    },
    {
      title: "W3af",
      link: "https://github.com/andresriancho/w3af",
      description: "An open-source web application security scanner that helps secure web applications by finding and exploiting all web application vulnerabilities",
      github: "andresriancho",
      tag: "Web Application Security"
    },
    {
      title: "Arachni",
      link: "https://github.com/Arachni/arachni",
      description: "A feature-rich, modular, high-performance Ruby framework aimed towards helping penetration testers and administrators evaluate web application security",
      github: "Arachni",
      tag: "Web Application Security"
    },
    {
      title: "Wapiti",
      link: "https://github.com/wapiti-scanner/wapiti",
      description: "A web application vulnerability scanner that performs black-box scans to audit the security of web applications",
      github: "wapiti-scanner",
      tag: "Web Application Security"
    },
    {
      title: "Nuclei",
      link: "https://github.com/projectdiscovery/nuclei",
      description: "A fast and customizable vulnerability scanner based on simple YAML-based DSL",
      github: "projectdiscovery",
      tag: "Vulnerability Scanner"
    },
    {
      title: "Vega",
      link: "https://github.com/subgraph/Vega",
      description: "An open-source web security scanner and testing platform to test the security of web applications",
      github: "subgraph",
      tag: "Web Security"
    },
    {
      title: "XSStrike",
      link: "https://github.com/s0md3v/XSStrike",
      description: "The most advanced XSS detection suite with a powerful fuzzing engine and context analysis engine",
      github: "s0md3v",
      tag: "XSS Detection"
    },
    {
      title: "Sqlmap",
      link: "https://github.com/sqlmapproject/sqlmap",
      description: "An open-source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws",
      github: "sqlmapproject",
      tag: "SQL Injection"
    },
    {
      title: "SANS Institute Training",
      link: "https://www.sans.org",
      description: "Comprehensive cybersecurity training offering more than 60 courses across all practice areas including web security",
      tag: "Training"
    },
    {
      title: "Web Security Academy",
      link: "https://portswigger.net/web-security",
      description: "A free online training center for web application security, including content from PortSwigger's in-house research team",
      tag: "Training"
    },
    {
      title: "OWASP ASVS",
      link: "https://owasp.org/www-project-application-security-verification-standard/",
      description: "The OWASP Application Security Verification Standard provides a framework for testing web application security controls",
      tag: "Security Framework"
    },
    {
      title: "TCM Security Academy",
      link: "https://academy.tcm-sec.com",
      description: "Practical, job-focused cybersecurity training designed by industry-leading instructors",
      tag: "Training"
    },
    {
      title: "Cybrary",
      link: "https://www.cybrary.it",
      description: "Online cybersecurity courses and training for individuals and teams, including certification preparation",
      tag: "Training"
    },
    {
      title: "OWASP API Security Top 10",
      link: "https://owasp.org/www-project-api-security/",
      description: "A standard reference guide highlighting the most critical web API vulnerabilities",
      tag: "API Security"
    },
    {
      title: "Acunetix",
      link: "https://www.acunetix.com",
      description: "A commercial tool focusing on web application vulnerability scanning, identifying issues such as SQL injection and XSS",
      tag: "DAST"
    },
    {
      title: "Qualys VMDR",
      link: "https://www.qualys.com/apps/vulnerability-management-detection-response/",
      description: "Combines vulnerability scanning with AI-driven risk prioritization, ideal for large IT infrastructures",
      tag: "Vulnerability Management"
    },
    {
      title: "Paragonie Awesome AppSec",
      link: "https://github.com/paragonie/awesome-appsec",
      description: "A curated list of resources for learning about application security, including books, websites, blog posts, and self-assessment quizzes",
      github: "paragonie",
      tag: "Learning Resources"
    } , 

    {
      title: "OWASP Agentic Security Initiative",
      link: "https://genai.owasp.org/initiatives/agentic-security-initiative/",
      description: "Community research, standards, threat models, and implementation guidance for securing autonomous agents and multi-step AI workflows.",
      tag: "Agentic Security"
    },
    {
      title: "OWASP Secure Agent Playbook",
      link: "https://github.com/OWASP/secure-agent-playbook",
      description: "An open playbook of practical security checks for AI agents, including prompt injection, tool misuse, secrets, and business integrity testing.",
      github: "OWASP/secure-agent-playbook",
      tag: "Agentic Security"
    },
    {
      title: "Garak",
      link: "https://github.com/NVIDIA/garak",
      description: "An LLM vulnerability scanner that probes models and applications for prompt injection, data leakage, jailbreaks, hallucination, and other failure modes.",
      github: "NVIDIA/garak",
      tag: "LLM Security"
    },
    {
      title: "PyRIT",
      link: "https://github.com/microsoft/PyRIT",
      description: "Microsoft's extensible framework for automated and human-led red teaming of generative AI systems, including multi-turn attacks and repeatable scenarios.",
      github: "microsoft/PyRIT",
      tag: "AI Security Testing"
    },
    {
      title: "Promptfoo",
      link: "https://github.com/promptfoo/promptfoo",
      description: "An open-source evaluation and red-team framework for prompts, agents, and RAG systems with adversarial testing and CI integration.",
      github: "promptfoo/promptfoo",
      tag: "AI Security Testing"
    },
    {
      title: "Snyk Agent Scan",
      link: "https://github.com/snyk/agent-scan",
      description: "Discovers agent components, MCP servers, and skills, then scans them for risks such as prompt injection, tool poisoning, unsafe data access, and malicious instructions.",
      github: "snyk/agent-scan",
      tag: "Agent Security"
    },
    // Curated from Kitploit's AI Security, Secret Detection, and IAM catalogs.
    // Descriptions and links are normalized against the projects' official sources.
    {
      title: "PurpleLlama",
      link: "https://github.com/meta-llama/PurpleLlama",
      description: "Meta's collection of evaluations and safeguards for assessing and improving generative AI security, including CyberSecEval, Prompt Guard, and Code Shield.",
      github: "meta-llama/PurpleLlama",
      tag: "AI Security"
    },
    {
      title: "Giskard",
      link: "https://github.com/Giskard-AI/giskard-oss",
      description: "An open-source testing library for evaluating and red-teaming LLM agents, RAG systems, and multi-turn AI workflows.",
      github: "Giskard-AI/giskard-oss",
      tag: "AI Security Testing"
    },
    {
      title: "AI-Infra-Guard",
      link: "https://github.com/Tencent/AI-Infra-Guard",
      description: "A full-stack AI red-team platform for scanning agents, skills, MCP servers, AI infrastructure, and LLM jailbreak exposure.",
      github: "Tencent/AI-Infra-Guard",
      tag: "Agentic Security"
    },
    {
      title: "Promptmap",
      link: "https://github.com/utkusen/promptmap",
      description: "A prompt-injection scanner that automatically tests custom LLM applications for attack paths and unsafe instruction handling.",
      github: "utkusen/promptmap",
      tag: "LLM Security"
    },
    {
      title: "Agentic Radar",
      link: "https://github.com/splx-ai/agentic-radar",
      description: "A security scanner that analyzes agentic workflows and visualizes tools, prompts, data flows, and potential security weaknesses.",
      github: "splx-ai/agentic-radar",
      tag: "Agent Security"
    },
    {
      title: "NeMo Guardrails",
      link: "https://github.com/NVIDIA-NeMo/Guardrails",
      description: "An open-source toolkit for adding programmable input, output, retrieval, dialog, and execution safeguards to AI applications.",
      github: "NVIDIA-NeMo/Guardrails",
      tag: "AI Security"
    },
    {
      title: "SkillSpector",
      link: "https://github.com/NVIDIA/skillspector",
      description: "A security scanner for AI agent skills that detects prompt injection, unsafe behaviors, data exfiltration, and malicious patterns.",
      github: "NVIDIA/skillspector",
      tag: "Agent Security"
    },
    {
      title: "OpenShell",
      link: "https://github.com/NVIDIA/OpenShell",
      description: "A sandboxed runtime for autonomous agents with declarative policies for filesystem, network, and process access.",
      github: "NVIDIA/OpenShell",
      tag: "Agent Sandbox"
    },
    {
      title: "Gitleaks",
      link: "https://github.com/gitleaks/gitleaks",
      description: "A fast secret scanner for detecting passwords, API keys, and tokens in Git history, files, and standard input.",
      github: "gitleaks/gitleaks",
      tag: "Secret Detection"
    },
    {
      title: "TruffleHog",
      link: "https://github.com/trufflesecurity/trufflehog",
      description: "Finds, verifies, and analyzes exposed credentials across source repositories, cloud storage, container images, and other data sources.",
      github: "trufflesecurity/trufflehog",
      tag: "Secret Detection"
    },
    {
      title: "detect-secrets",
      link: "https://github.com/Yelp/detect-secrets",
      description: "An extensible secret-detection tool that supports baseline files and pre-commit workflows to prevent new credentials from entering a codebase.",
      github: "Yelp/detect-secrets",
      tag: "Secret Detection"
    },
    {
      title: "SOPS",
      link: "https://github.com/getsops/sops",
      description: "An editor for encrypted configuration files that integrates with cloud key services and keeps sensitive values protected in version control.",
      github: "getsops/sops",
      tag: "Secrets Management"
    },
    {
      title: "Checkov",
      link: "https://github.com/bridgecrewio/checkov",
      description: "Static analysis for infrastructure as code that detects cloud misconfigurations, vulnerable dependencies, and exposed secrets.",
      github: "bridgecrewio/checkov",
      tag: "Cloud Security"
    },
    {
      title: "Keycloak",
      link: "https://github.com/keycloak/keycloak",
      description: "An open-source identity and access management platform for authentication, federation, single sign-on, and fine-grained authorization.",
      github: "keycloak/keycloak",
      tag: "Identity & Access Management"
    },
    {
      title: "HashiCorp Vault",
      link: "https://github.com/hashicorp/vault",
      description: "A secrets and encryption platform for centrally controlling access to credentials, keys, tokens, and privileged operations.",
      github: "hashicorp/vault",
      tag: "Secrets Management"
    }
];

