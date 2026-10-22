import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { entries } from "../data/entries.js";
import OpenGraph from "./OpenGraph";
import { REPOSITORY_URL } from "../utils/socialSharing";

const PAGE_SIZE = 30;

export const TOOL_CATEGORIES = [
  {
    id: "all",
    label: "All Tools",
    shortLabel: "All Tools",
    icon: "🌐",
    description: "Explore the complete directory of 37,000+ security and agentic tools.",
    matcher: () => true,
  },
  {
    id: "agentic-ai",
    label: "Agentic & AI Security",
    shortLabel: "Agentic & AI",
    icon: "🤖",
    badge: "AI Security",
    description: "AI agent guardrails, sandboxing, MCP security, LLM red teaming, and autonomous workload governance.",
    matcher: (tag, desc, title) =>
      /\bagentic\b|\bagent\b|\bmcp\b|\bllm\b|\bllms\b|\blangchain\b|prompt inject|guardrail|\bopenai\b|\banthropic\b|\bai security\b|\bai testing\b|artificial intelligence/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "cloud-container",
    label: "Cloud & Container Security",
    shortLabel: "Cloud & Containers",
    icon: "☁️",
    badge: "Cloud Defense",
    description: "Kubernetes security, container isolation, Docker, AWS/Azure/GCP posture, CSPM, and cloud workload protection.",
    matcher: (tag, desc, title) =>
      /kubernetes|docker|container|k8s|cloud security|aws|azure|gcp|cspm|ciem|helm|pod security|workload protection/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "app-api",
    label: "Application & API Security",
    shortLabel: "App & API Sec",
    icon: "🛡️",
    badge: "AppSec",
    description: "Web application firewalls (WAF), API protection, DAST, SAST, XSS/SQLi defense, and OWASP Top 10 auditing.",
    matcher: (tag, desc, title) =>
      /web security|web application|application security|api security|waf|dast|sast|xss|sql injection|csrf|cors|graphql|ssrf|burp|owasp/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "devsecops-supplychain",
    label: "DevSecOps & Supply Chain",
    shortLabel: "DevSecOps",
    icon: "📦",
    badge: "Supply Chain",
    description: "Software supply chain, SBOM generation, image signing, dependency checking, and CI/CD pipeline defense.",
    matcher: (tag, desc, title) =>
      /devsecops|supply chain|sbom|sigstore|cosign|trivy|dependency-check|secret detection|secret scan|git-secret|ci\/cd|pipeline security/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "identity-access",
    label: "Identity, Access & Zero Trust",
    shortLabel: "Identity & Access",
    icon: "🔑",
    badge: "IAM & Auth",
    description: "IAM governance, authentication, secrets management, credential scanning, OAuth, PAM, and Zero Trust.",
    matcher: (tag, desc, title) =>
      /identity|iam|secret|credential|password|oauth|jwt|auth|privilege escalation|pam|saml|ldap|active directory|kerberos|zero trust/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "vuln-cve",
    label: "Vulnerability & CVE Intelligence",
    shortLabel: "Vuln & CVE",
    icon: "🔍",
    badge: "Vulnerability",
    description: "Automated vulnerability scanners, CVE advisories, exploit PoCs, and patch management intelligence.",
    matcher: (tag, desc, title) =>
      /vulnerability scanner|vulnerability management|vulnerability analysis|\bcve\b|cve-|cve_|patch management|nessus|nuclei/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "pentest-redteam",
    label: "Penetration Testing & Exploits",
    shortLabel: "Pentest & Red Team",
    icon: "⚔️",
    badge: "Red Team",
    description: "Exploitation frameworks, Command & Control (C2), payload generators, fuzzers, and offensive simulation tools.",
    matcher: (tag, desc, title) =>
      /penetration testing|exploitation|exploit|c2|command & control|payload|fuzzing|red team|post exploitation|reverse shell|metasploit|shellcode/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "network-perimeter",
    label: "Network & Perimeter Defense",
    shortLabel: "Network & Firewall",
    icon: "📡",
    badge: "Network Sec",
    description: "Firewalls, pfSense utilities, intrusion detection (IDS/IPS), packet analysis, Wi-Fi, and IoT/firmware defense.",
    matcher: (tag, desc, title) =>
      /pfsense|firewall|snort|suricata|intrusion detection|ids|ips|packet|sniff|nmap|wireshark|network security|pcap|router|wireless|wifi|iot|firmware/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "threat-intel-osint",
    label: "Threat Intelligence & OSINT",
    shortLabel: "Threat Intel & OSINT",
    icon: "👁️",
    badge: "OSINT",
    description: "Open-source intelligence (OSINT), threat intelligence feeds, reconnaissance, and attack surface mapping.",
    matcher: (tag, desc, title) =>
      /osint|threat intelligence|reconnaissance|recon|whois|shodan|subdomain|dorking|footprint|attack surface/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "forensics-ir",
    label: "Incident Response & Forensics",
    shortLabel: "IR & Forensics",
    icon: "🚨",
    badge: "DFIR",
    description: "Digital forensics, memory analysis, SIEM, SOC operations, timeline investigation, and incident triage.",
    matcher: (tag, desc, title) =>
      /digital forensics|memory forensics|disk forensics|incident response|dfir|siem|soc|edr|volatility|autopsy|timeline analysis/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "malware-reverse",
    label: "Malware Analysis & Reverse Eng",
    shortLabel: "Malware & Reverse",
    icon: "🔬",
    badge: "Malware Lab",
    description: "Binary reverse engineering, decompilers, disassemblers, Ghidra, YARA rules, and dynamic sandbox analysis.",
    matcher: (tag, desc, title) =>
      /reverse engineering|malware analysis|malware|decompiler|disassembler|ghidra|radare|yara|dynamic analysis sandboxing|binary analysis/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
  {
    id: "crypto-privacy",
    label: "Cryptography & Data Defense",
    shortLabel: "Cryptography",
    icon: "🔐",
    badge: "Cryptography",
    description: "Encryption utilities, cryptographic primitives, SSL/TLS auditing, PKI, hash analysis, and data defense.",
    matcher: (tag, desc, title) =>
      /cryptography|encryption|cipher|hash analysis|hashcat|tls|ssl|pki|certificate|data recovery|exfiltration/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
];

function escapeUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function getGitHubStarsBadge(link, github) {
  if (link && link.includes("github.com")) {
    try {
      const url = new URL(link);
      if (url.hostname === "github.com") {
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) {
          return `https://img.shields.io/github/stars/${encodeURIComponent(parts[0])}/${encodeURIComponent(
            parts[1].replace(/\.git$/, "")
          )}.svg?style=flat&label=stars&color=7c3aed`;
        }
      }
    } catch {}
  }

  if (github) {
    const trimmed = github.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, "");
    const parts = trimmed.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `https://img.shields.io/github/stars/${encodeURIComponent(parts[0])}/${encodeURIComponent(
        parts[1]
      )}.svg?style=flat&label=stars&color=7c3aed`;
    }
  }

  return null;
}

export function getToolBadges(entry) {
  const tag = (entry.tag || "").trim();
  const title = (entry.title || "").trim();
  const desc = (entry.description || "").trim();
  const combined = `${tag} ${title} ${desc}`.toLowerCase();

  // If already tagged with a specific curated subcategory
  if (tag && tag !== "Cybersecurity Tools") {
    if (tag.includes(",")) {
      return tag
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 2)
        .map((label) => ({
          label,
          categoryFilter: label,
          colorClass: "bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#3d4449]",
        }));
    }
    return [
      {
        label: tag,
        categoryFilter: tag,
        colorClass: "bg-purple/10 text-purple dark:bg-purple/20 dark:text-brand-purple-100 border-purple/20",
      },
    ];
  }

  // Derive domain-specific badge based on intelligence
  if (/\bagentic\b|\bagent\b|\bmcp\b|\bllm\b|\bllms\b|\blangchain\b|prompt inject|guardrail|\bopenai\b|\banthropic\b|\bai security\b/i.test(combined)) {
    return [{
      label: "Agentic & AI",
      categoryFilter: "agentic-ai",
      colorClass: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-800",
    }];
  }
  if (/cve-\d{4}-\d+|cve_\d{4}_\d+|\bcve\b/i.test(title)) {
    return [{
      label: "CVE Advisory & PoC",
      categoryFilter: "vuln-cve",
      colorClass: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-800",
    }];
  }
  if (/kubernetes|docker|container|k8s|cloud security|aws|azure|gcp|cspm|ciem|helm|pod security/i.test(combined)) {
    return [{
      label: "Cloud & Containers",
      categoryFilter: "cloud-container",
      colorClass: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800",
    }];
  }
  if (/identity|iam|secret|credential|password|oauth|jwt|auth|pam|active directory|kerberos/i.test(combined)) {
    return [{
      label: "Identity & Access",
      categoryFilter: "identity-access",
      colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    }];
  }
  if (/web security|api security|waf|dast|sast|xss|sql injection|csrf|ssrf|owasp/i.test(combined)) {
    return [{
      label: "Application Security",
      categoryFilter: "app-api",
      colorClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    }];
  }
  if (/penetration testing|exploitation|c2|payload|fuzzing|red team|reverse shell|metasploit/i.test(combined)) {
    return [{
      label: "Exploits & Red Team",
      categoryFilter: "pentest-redteam",
      colorClass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-800",
    }];
  }
  if (/pfsense|firewall|snort|suricata|intrusion detection|ids|ips|packet|sniff|nmap|wireshark|pcap|wireless|wifi/i.test(combined)) {
    return [{
      label: "Network & Firewall",
      categoryFilter: "network-perimeter",
      colorClass: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
    }];
  }
  if (/osint|threat intelligence|reconnaissance|recon|whois|shodan|dorking/i.test(combined)) {
    return [{
      label: "Threat Intel & OSINT",
      categoryFilter: "threat-intel-osint",
      colorClass: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 border-violet-300 dark:border-violet-800",
    }];
  }
  if (/reverse engineering|malware|decompiler|disassembler|ghidra|radare|yara/i.test(combined)) {
    return [{
      label: "Malware & Reverse Eng",
      categoryFilter: "malware-reverse",
      colorClass: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300 dark:border-teal-800",
    }];
  }
  if (/forensic|incident response|dfir|siem|soc|edr|volatility/i.test(combined)) {
    return [{
      label: "IR & Forensics",
      categoryFilter: "forensics-ir",
      colorClass: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300 dark:border-orange-800",
    }];
  }
  if (/cryptograph|encrypt|cipher|tls|ssl|hashcat/i.test(combined)) {
    return [{
      label: "Cryptography",
      categoryFilter: "crypto-privacy",
      colorClass: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-300 dark:border-sky-800",
    }];
  }

  return [{
    label: "Security Tool",
    categoryFilter: "",
    colorClass: "bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#3d4449]",
  }];
}

function ToolsSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "";
  const urlSort = searchParams.get("sort") === "za" ? "za" : "az";

  const [query, setQuery] = useState(urlQuery);
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState(urlSort);
  const [page, setPage] = useState(1);
  const [githubStars, setGithubStars] = useState(null);
  const [showContributeModal, setShowContributeModal] = useState(false);

  // Sync state when URL params change (e.g. browser back/forward)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "";
    const s = searchParams.get("sort") === "za" ? "za" : "az";
    setQuery(q);
    setCategory(cat);
    setSort(s);
  }, [searchParams]);

  // Fetch GitHub stars for repository badge
  useEffect(() => {
    fetch("https://api.github.com/repos/CloudSecCorner/cloudseccorner.github.io", {
      signal: AbortSignal.timeout(5000),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((repo) => {
        if (Number.isFinite(repo?.stargazers_count)) {
          setGithubStars(repo.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  // Compute tool counts per curated category
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const cat of TOOL_CATEGORIES) {
      if (cat.id === "all") {
        counts[cat.id] = entries.length;
      } else {
        let count = 0;
        for (const e of entries) {
          if (cat.matcher(e.tag || "", e.description || "", e.title || "")) {
            count++;
          }
        }
        counts[cat.id] = count;
      }
    }
    return counts;
  }, []);

  // Compute unique specific subcategories (excluding generic Cybersecurity Tools)
  const rawTags = useMemo(() => {
    const counts = {};
    for (const e of entries) {
      const tag = (e.tag || "").trim();
      if (tag && tag !== "Cybersecurity Tools" && !tag.includes(",")) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, []);

  // Active category object
  const activeCategoryObj = useMemo(() => {
    if (!category) return TOOL_CATEGORIES[0];
    return (
      TOOL_CATEGORIES.find(
        (c) =>
          c.id === category ||
          c.label.toLowerCase() === category.toLowerCase() ||
          c.shortLabel.toLowerCase() === category.toLowerCase()
      ) || null
    );
  }, [category]);

  // Update URL params
  const updateUrl = (newQuery, newCategory, newSort) => {
    const params = new URLSearchParams();
    if (newQuery) params.set("q", newQuery);
    if (newCategory) params.set("category", newCategory);
    if (newSort === "za") params.set("sort", "za");
    setSearchParams(params, { replace: true });
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setPage(1);
    updateUrl(val, category, sort);
  };

  const handleCategorySelect = (selectedId) => {
    const nextCat = selectedId === "all" ? "" : selectedId;
    setCategory(nextCat);
    setPage(1);
    updateUrl(query, nextCat, sort);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    setPage(1);
    updateUrl(query, category, val);
  };

  const handleClearFilters = () => {
    setQuery("");
    setCategory("");
    setSort("az");
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const catLower = category.toLowerCase().trim();

    const curated = TOOL_CATEGORIES.find(
      (c) =>
        c.id === catLower ||
        c.label.toLowerCase() === catLower ||
        c.shortLabel.toLowerCase() === catLower
    );

    return entries
      .filter((entry) => {
        const title = entry.title || "";
        const desc = entry.description || "";
        const tag = entry.tag || "";

        // Category matching
        let matchesCategory = true;
        if (catLower && catLower !== "all") {
          if (curated && curated.id !== "all") {
            matchesCategory = curated.matcher(tag, desc, title);
          } else {
            // Raw tag & badge fallback (support specific subcategories)
            const badges = getToolBadges(entry);
            const matchesBadge = badges.some(
              (b) =>
                b.label.toLowerCase() === catLower ||
                (b.categoryFilter && b.categoryFilter.toLowerCase() === catLower)
            );
            matchesCategory =
              matchesBadge ||
              tag.toLowerCase() === catLower ||
              tag.toLowerCase().includes(catLower);
          }
        }

        // Word query matching
        const haystack = `${title} ${desc} ${tag}`.toLowerCase();
        const matchesWords =
          words.length === 0 || words.every((word) => haystack.includes(word));

        return matchesCategory && matchesWords;
      })
      .sort((a, b) => {
        const order = sort === "za" ? -1 : 1;
        return order * (a.title || "").localeCompare(b.title || "");
      });
  }, [query, category, sort]);

  const visibleLimit = Math.min(page * PAGE_SIZE, filteredEntries.length);
  const visibleEntries = filteredEntries.slice(0, visibleLimit);
  const hasMore = visibleLimit < filteredEntries.length;
  const isFiltering = Boolean(query || category || sort === "za");

  return (
    <div className="w-full">
      <OpenGraph
        title="Security & Agentic Tools Directory | Cloud Security Corner"
        description="Search CloudSecCorner's curated collection of 37,000+ open-source tools across AI agent security, cloud defense, identity, runtime monitoring, and governance."
        tags={["AI Agent Security Tools", "Cloud Security Tools", "Runtime Security", "Zero Trust"]}
      />

      {/* Hero */}
      <section className="kube-tools-hero">
        <div className="mx-auto max-w-screen-xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="kube-tools-hero-copy">
            <p className="kube-label">Security &amp; Agentic Ecosystem Directory</p>
            <h1>
              Find the tools that help teams <span>secure cloud and AI agents.</span>
            </h1>
            <p>
              Search CloudSecCorner’s curated collection of 37,000+ projects across AI agent security, cloud defense, identity, runtime monitoring, and governance.
            </p>
            <a className="kube-tools-star" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
              <span aria-hidden="true">★</span>
              <strong>
                {githubStars !== null ? `${githubStars.toLocaleString()} GitHub stars` : "GitHub"}
              </strong>
              <small>Star CloudSecCorner on GitHub ↗</small>
            </a>
          </div>
        </div>
      </section>

      {/* Main Directory Container */}
      <section className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        {/* Directory Heading */}
        <div className="kube-tools-directory-heading">
          <div>
            <p className="kube-label">Explore the directory</p>
            <h2>Search by project or category.</h2>
          </div>
          <p>
            Filter by curated security domains, sort alphabetically, and share the URL to keep your filters. Every result links to the official project.
          </p>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Curated security category filters">
          {TOOL_CATEGORIES.map((cat) => {
            const isActive =
              cat.id === "all"
                ? !category || category === "all"
                : category === cat.id ||
                  category.toLowerCase() === cat.label.toLowerCase() ||
                  category.toLowerCase() === cat.shortLabel.toLowerCase();

            const count = categoryCounts[cat.id];

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-purple text-white shadow-md ring-2 ring-purple/30 scale-105"
                    : "bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#3d4449]"
                }`}
              >
                <span aria-hidden="true">{cat.icon}</span>
                <span>{cat.shortLabel}</span>
                {count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-200/80 dark:bg-[#22272e] text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {count.toLocaleString()}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Category Description Notice */}
        {activeCategoryObj && activeCategoryObj.id !== "all" && (
          <div className="mt-5 rounded-2xl border border-purple/30 bg-gradient-to-r from-purple/10 via-purple/5 to-transparent dark:from-purple/20 dark:via-purple/10 dark:to-transparent p-4 sm:p-5 text-slate-800 dark:text-brand-purple-100 shadow-sm transition">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <span className="text-2xl" aria-hidden="true">{activeCategoryObj.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {activeCategoryObj.label}
                    </h3>
                    <span className="rounded-full bg-purple text-white px-2 py-0.5 text-[11px] font-bold">
                      {categoryCounts[activeCategoryObj.id]?.toLocaleString() || 0} tools
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
                    {activeCategoryObj.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCategorySelect("all")}
                className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-lg border border-purple/30 bg-white dark:bg-[#22272e] px-3 py-1.5 text-xs font-bold text-purple-700 dark:text-brand-purple-100 hover:bg-purple/10 transition shrink-0"
              >
                ✕ Clear category
              </button>
            </div>
          </div>
        )}

        {/* Tool Controls Form */}
        <form
          className="kube-tool-controls mt-6"
          role="search"
          aria-label="Find security tools"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="tool-query">
            Search tools
            <input
              id="tool-query"
              name="q"
              type="search"
              placeholder="Try Agentic, Zero-Trust, Falco, IAM, Recon…"
              autoComplete="off"
              value={query}
              onChange={handleQueryChange}
            />
          </label>

          <label htmlFor="tool-category">
            Category
            <select
              id="tool-category"
              name="category"
              value={category}
              onChange={(e) => handleCategorySelect(e.target.value)}
            >
              <optgroup label="Core Security Domains (12)">
                {TOOL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id === "all" ? "" : cat.id}>
                    {cat.icon} {cat.label} ({categoryCounts[cat.id]?.toLocaleString() || 0})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Specific Subcategories (25)">
                {rawTags.slice(0, 25).map((rt) => (
                  <option key={rt.name} value={rt.name}>
                    {rt.name} ({rt.count.toLocaleString()})
                  </option>
                ))}
              </optgroup>
            </select>
          </label>

          <label htmlFor="tool-sort">
            Sort by
            <select
              id="tool-sort"
              name="sort"
              value={sort}
              onChange={handleSortChange}
            >
              <option value="az">Name: A–Z</option>
              <option value="za">Name: Z–A</option>
            </select>
          </label>
        </form>

        {/* Active Filter Chips */}
        {isFiltering && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-[#3d4449]/60">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active filters:</span>
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple/15 text-purple-700 dark:text-brand-purple-100 border border-purple/30 px-3 py-1 text-xs font-semibold">
                <span>{activeCategoryObj ? `${activeCategoryObj.icon || "🏷️"} ${activeCategoryObj.label}` : category}</span>
                <button
                  type="button"
                  onClick={() => handleCategorySelect("all")}
                  className="hover:text-red-500 font-bold ml-0.5"
                  aria-label="Remove category filter"
                >
                  ✕
                </button>
              </span>
            )}
            {query && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#4d555c] px-3 py-1 text-xs font-semibold">
                <span>Query: "{query}"</span>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                    updateUrl("", category, sort);
                  }}
                  className="hover:text-red-500 font-bold ml-0.5"
                  aria-label="Remove query filter"
                >
                  ✕
                </button>
              </span>
            )}
            {sort === "za" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#4d555c] px-3 py-1 text-xs font-semibold">
                <span>Sort: Z to A</span>
                <button
                  type="button"
                  onClick={() => {
                    setSort("az");
                    setPage(1);
                    updateUrl(query, category, "az");
                  }}
                  className="hover:text-red-500 font-bold ml-0.5"
                  aria-label="Reset sort order"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-bold text-purple-600 dark:text-brand-purple-100 hover:underline ml-2"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Results Toolbar */}
        <div className="kube-results-toolbar">
          <p className="kube-tool-count" role="status" aria-live="polite" aria-atomic="true">
            Showing <strong>{visibleLimit.toLocaleString()}</strong> of{" "}
            <strong>{filteredEntries.length.toLocaleString()}</strong> matching tools ·{" "}
            {entries.length.toLocaleString()} in the directory
          </p>
          <button
            type="button"
            className="kube-filter-reset"
            onClick={handleClearFilters}
            disabled={!isFiltering}
          >
            Clear filters
          </button>
        </div>

        {/* Tool Grid */}
        <div className="kube-tool-grid" id="tool-results">
          {visibleEntries.length === 0 ? (
            <div className="col-span-full kube-tool-empty py-12 text-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching security tools</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
                No projects matched your criteria {category ? `in "${category}"` : ""}{query ? ` for "${query}"` : ""}. Try a broader keyword or clear your filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="kube-button inline-block"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            visibleEntries.map((entry, idx) => {
              const link = escapeUrl(entry.link);
              const badgeUrl = getGitHubStarsBadge(entry.link, entry.github);
              const toolBadges = getToolBadges(entry);

              return (
                <article key={`${entry.title}-${idx}`} className="kube-tool-card">
                  <div className="kube-tool-card-meta">
                    <div className="flex flex-wrap gap-1.5">
                      {toolBadges.map((badge, bIdx) => (
                        <button
                          key={bIdx}
                          type="button"
                          onClick={() => badge.categoryFilter && handleCategorySelect(badge.categoryFilter)}
                          title={badge.categoryFilter ? `Filter by ${badge.label}` : undefined}
                          className={`kube-label inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-[11px] font-semibold transition hover:opacity-85 ${badge.colorClass} ${badge.categoryFilter ? "cursor-pointer" : "cursor-default"}`}
                        >
                          <span>{badge.label}</span>
                        </button>
                      ))}
                    </div>
                    {badgeUrl && (
                      <span className="kube-tool-stars">
                        <img
                          className="kube-stars-image"
                          loading="lazy"
                          width="95"
                          height="20"
                          src={badgeUrl}
                          alt="GitHub stars"
                        />
                      </span>
                    )}
                  </div>
                  <h2>{entry.title}</h2>
                  <p>{entry.description || "Explore this project's official documentation and source."}</p>
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer">
                      Visit official project <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="mt-auto pt-7 text-xs text-slate-400">Documentation link pending</span>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* Show More Tools Button */}
        {hasMore && (
          <div className="kube-directory-more">
            <button
              type="button"
              className="kube-button"
              id="tool-more"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Show more tools ({filteredEntries.length - visibleLimit} remaining)
            </button>
          </div>
        )}
      </section>

      {/* Contribute Callout Banner */}
      <section className="kube-contribute">
        <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-10 lg:py-14">
          <div className="kube-contribute-copy">
            <p className="kube-label">Grow the directory</p>
            <h2>Know a tool the security community should discover?</h2>
            <p>
              Recommend a maintained project, improve a description, or help keep links and categories useful for people evaluating their cloud &amp; agentic stack.
            </p>
          </div>
          <div className="kube-contribute-actions">
            <a
              className="kube-contribute-primary"
              href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noreferrer"
            >
              Contribution guide ↗
            </a>
            <button
              type="button"
              onClick={() => setShowContributeModal(true)}
              className="rounded-lg border border-slate-300 dark:border-brand-gray-700 bg-white dark:bg-brand-gray-800 px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white transition hover:border-brand-purple-300"
            >
              Recommend a tool ↗
            </button>
          </div>
        </div>
      </section>

      {/* Contribute Modal */}
      {showContributeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-[#3d4449] bg-white dark:bg-[#22272e] p-6 sm:p-8 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#3d4449] pb-4">
              <div>
                <p className="kube-label">Open Source Submission</p>
                <h3 className="text-xl font-bold">Contribute a Security Tool</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowContributeModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#31373b] hover:text-slate-900 dark:hover:text-white"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                CloudSecCorner maintains an index of over 37,000 security and AI agent projects. We welcome community additions and corrections!
              </p>
              <h4 className="font-bold text-slate-900 dark:text-white">How to submit:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Fork the repository on GitHub.</li>
                <li>Add your project entry into <code className="rounded bg-slate-100 dark:bg-[#31373b] px-1.5 py-0.5 font-mono text-purple-600 dark:text-purple-400">src/data/entries.js</code>.</li>
                <li>Ensure it includes a title, valid project URL, category tag, and concise description.</li>
                <li>Open a Pull Request with our PR template.</li>
              </ol>

              <div className="rounded-xl border border-slate-200 dark:border-[#3d4449] bg-slate-50 dark:bg-[#18131f] p-4 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto">
{`{
  title: "Your Tool Name",
  link: "https://your-tool.example.com",
  description: "Precise summary of what this security tool does.",
  github: "owner/repo",
  tag: "Agentic Security"
}`}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-slate-200 dark:border-[#3d4449] pt-4">
              <button
                type="button"
                onClick={() => setShowContributeModal(false)}
                className="rounded-lg border border-slate-300 dark:border-[#3d4449] px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#31373b]"
              >
                Close
              </button>
              <a
                href={`${REPOSITORY_URL}/issues/new?title=Tool+Recommendation&labels=tool-submission`}
                target="_blank"
                rel="noreferrer"
                className="kube-button"
              >
                Submit on GitHub ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ToolsSection;
