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
      title: "OWASP ZAP",
      link: "https://github.com/zaproxy/zaproxy",
      description: "A full-featured, free, and open-source DAST tool that includes both automated scanning for vulnerabilities and tools for manual web app penetration testing",
      github: "zaproxy",
      tag: "DAST"
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
      title: "Nikto",
      link: "https://github.com/sullo/nikto",
      description: "An open-source web server scanner which performs comprehensive tests against web servers for multiple items, including over 6700 potentially dangerous files/CGIs",
      github: "sullo",
      tag: "Web Server Security"
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
      title: "Burp Suite",
      link: "https://portswigger.net/burp",
      description: "Combines manual and automated tools for thorough vulnerability analysis, excelling in web application security",
      tag: "Web Security Testing"
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
      title: "bumpgen",
      link: "https://github.com/xeol-io/bumpgen",
      description: "An AI agent that upgrades npm packages",
      tag: "AI Agent"
    }
];

