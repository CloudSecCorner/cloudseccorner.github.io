// CloudSecCorner Vanilla Tools Directory Controller (KubeDaily architecture)

const TOOL_CATEGORIES = [
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
    description: "Encryption utilities, cryptographic primitives, SSL/TLS auditing, PKI, hash analysis, and data defense.",
    matcher: (tag, desc, title) =>
      /cryptography|encryption|cipher|hash analysis|hashcat|tls|ssl|pki|certificate|data recovery|exfiltration/i.test(
        `${tag} ${desc} ${title}`
      ),
  },
];

const pageSize = 30;
let page = 1;
let entries = [];
let categoryCounts = {};
let subcategories = [];

function escape(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[c])
  );
}

function projectUrl(value) {
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

function getToolBadge(entry) {
  const tag = (entry.tag || "").trim();
  const title = (entry.title || "").trim();
  const desc = (entry.description || "").trim();
  const combined = `${tag} ${title} ${desc}`.toLowerCase();

  if (tag && tag !== "Cybersecurity Tools") {
    if (tag.includes(",")) {
      return {
        label: tag.split(",")[0].trim(),
        filter: tag.split(",")[0].trim(),
        colorClass: "bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#3d4449]",
      };
    }
    return {
      label: tag,
      filter: tag,
      colorClass: "bg-purple/10 text-purple dark:bg-purple/20 dark:text-brand-purple-100 border-purple/20",
    };
  }

  if (/\bagentic\b|\bagent\b|\bmcp\b|\bllm\b|\bllms\b|\blangchain\b|prompt inject|guardrail|\bopenai\b|\banthropic\b|\bai security\b/i.test(combined)) {
    return {
      label: "Agentic & AI",
      filter: "agentic-ai",
      colorClass: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-800",
    };
  }
  if (/cve-\d{4}-\d+|cve_\d{4}_\d+|\bcve\b/i.test(title)) {
    return {
      label: "CVE Advisory & PoC",
      filter: "vuln-cve",
      colorClass: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-800",
    };
  }
  if (/kubernetes|docker|container|k8s|cloud security|aws|azure|gcp|cspm|ciem|helm|pod security/i.test(combined)) {
    return {
      label: "Cloud & Containers",
      filter: "cloud-container",
      colorClass: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800",
    };
  }
  if (/identity|iam|secret|credential|password|oauth|jwt|auth|pam/i.test(combined)) {
    return {
      label: "Identity & Access",
      filter: "identity-access",
      colorClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    };
  }
  if (/web security|api security|waf|dast|sast|xss|sql injection|csrf|owasp/i.test(combined)) {
    return {
      label: "Application Security",
      filter: "app-api",
      colorClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    };
  }
  if (/penetration testing|exploitation|c2|payload|fuzzing|red team/i.test(combined)) {
    return {
      label: "Exploits & Red Team",
      filter: "pentest-redteam",
      colorClass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-800",
    };
  }
  if (/pfsense|firewall|snort|suricata|intrusion detection|ids|ips|packet|sniff|nmap|wireshark/i.test(combined)) {
    return {
      label: "Network & Firewall",
      filter: "network-perimeter",
      colorClass: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800",
    };
  }
  if (/osint|threat intelligence|reconnaissance|recon|whois|shodan/i.test(combined)) {
    return {
      label: "Threat Intel & OSINT",
      filter: "threat-intel-osint",
      colorClass: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300 border-violet-300 dark:border-violet-800",
    };
  }
  if (/reverse engineering|malware|decompiler|disassembler|ghidra|radare|yara/i.test(combined)) {
    return {
      label: "Malware & Reverse Eng",
      filter: "malware-reverse",
      colorClass: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300 dark:border-teal-800",
    };
  }
  if (/forensic|incident response|dfir|siem|soc|edr|volatility/i.test(combined)) {
    return {
      label: "IR & Forensics",
      filter: "forensics-ir",
      colorClass: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300 dark:border-orange-800",
    };
  }
  if (/cryptograph|encrypt|cipher|tls|ssl|hashcat/i.test(combined)) {
    return {
      label: "Cryptography",
      filter: "crypto-privacy",
      colorClass: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-300 dark:border-sky-800",
    };
  }

  return {
    label: "Security Tool",
    filter: "",
    colorClass: "bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#3d4449]",
  };
}

function card(entry) {
  const link = projectUrl(entry.link);
  const badgeUrl = getGitHubStarsBadge(entry.link, entry.github);
  const badge = getToolBadge(entry);

  const starBadge = badgeUrl
    ? `<span class="kube-tool-stars"><img class="kube-stars-image" loading="lazy" width="95" height="20" src="${escape(
        badgeUrl
      )}" alt="GitHub stars"></span>`
    : "";

  return `
    <article class="kube-tool-card">
      <div class="kube-tool-card-meta">
        <button type="button" data-category="${escape(badge.filter)}" class="kube-label inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-[11px] font-semibold transition hover:opacity-85 ${escape(
    badge.colorClass
  )} ${badge.filter ? "cursor-pointer" : "cursor-default"}">
          <span>${escape(badge.label)}</span>
        </button>
        ${starBadge}
      </div>
      <h2>${escape(entry.title)}</h2>
      <p>${escape(entry.description || "Explore this project's official documentation and source.")}</p>
      ${
        link
          ? `<a href="${escape(link)}" target="_blank" rel="noopener noreferrer">Visit official project <span aria-hidden="true">↗</span></a>`
          : `<span class="mt-auto pt-7 text-xs text-slate-400">Documentation link pending</span>`
      }
    </article>
  `;
}

async function init() {
  const root = document.querySelector("#kube-tools");
  if (!root) return;

  root.innerHTML = `
    <div class="py-12 text-center text-slate-500 dark:text-slate-400 font-semibold">
      <span class="inline-block animate-spin mr-2">⚙️</span> Loading 37,000+ security and agentic tools…
    </div>
  `;

  try {
    const res = await fetch("/data/security-entries.json");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    entries = await res.json();
  } catch (err) {
    root.innerHTML = `
      <div class="kube-tool-empty py-12 text-center">
        <h2>Unable to load tools directory</h2>
        <p>Please check your connection or refresh the page.</p>
      </div>
    `;
    return;
  }

  // Precompute category counts
  for (const cat of TOOL_CATEGORIES) {
    if (cat.id === "all") {
      categoryCounts[cat.id] = entries.length;
    } else {
      let count = 0;
      for (const e of entries) {
        if (cat.matcher(e.tag || "", e.description || "", e.title || "")) {
          count++;
        }
      }
      categoryCounts[cat.id] = count;
    }
  }

  // Precompute specific subcategories (exclude generic Cybersecurity Tools)
  const tagCounts = {};
  for (const e of entries) {
    const tag = (e.tag || "").trim();
    if (tag && tag !== "Cybersecurity Tools" && !tag.includes(",")) {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }
  }
  subcategories = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([name, count]) => ({ name, count }));

  // Render scaffold
  root.innerHTML = `
    <!-- Category Pills -->
    <div id="kube-pills" class="flex flex-wrap gap-2" role="group" aria-label="Curated security category filters"></div>

    <!-- Active Category Banner -->
    <div id="kube-category-banner" class="hidden mt-5 rounded-2xl border border-purple/30 bg-gradient-to-r from-purple/10 via-purple/5 to-transparent dark:from-purple/20 dark:via-purple/10 dark:to-transparent p-4 sm:p-5 text-slate-800 dark:text-brand-purple-100 shadow-sm transition"></div>

    <!-- Form Controls -->
    <form class="kube-tool-controls mt-6" role="search" aria-label="Find security tools">
      <label for="tool-query">
        Search tools
        <input id="tool-query" name="q" type="search" placeholder="Try Agentic, Zero-Trust, Falco, IAM, Recon…" autocomplete="off">
      </label>

      <label for="tool-category">
        Category
        <select id="tool-category" name="category">
          <optgroup label="Core Security Domains (12)">
            ${TOOL_CATEGORIES.map(
              (c) =>
                `<option value="${c.id === "all" ? "" : c.id}">${c.icon} ${c.label} (${(
                  categoryCounts[c.id] || 0
                ).toLocaleString()})</option>`
            ).join("")}
          </optgroup>
          <optgroup label="Specific Subcategories (25)">
            ${subcategories
              .map(
                (s) =>
                  `<option value="${escape(s.name)}">${escape(s.name)} (${s.count.toLocaleString()})</option>`
              )
              .join("")}
          </optgroup>
        </select>
      </label>

      <label for="tool-sort">
        Sort by
        <select id="tool-sort" name="sort">
          <option value="az">Name: A–Z</option>
          <option value="za">Name: Z–A</option>
        </select>
      </label>
    </form>

    <!-- Active Filter Chips -->
    <div id="kube-filter-chips" class="hidden mt-4 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-[#3d4449]/60"></div>

    <!-- Results Toolbar -->
    <div class="kube-results-toolbar">
      <p class="kube-tool-count" role="status" aria-live="polite" aria-atomic="true"></p>
      <button type="button" class="kube-filter-reset">Clear filters</button>
    </div>

    <!-- Results Grid -->
    <div class="kube-tool-grid" id="tool-results"></div>

    <!-- More Button -->
    <div class="kube-directory-more">
      <button type="button" class="kube-button" id="tool-more">Show more tools</button>
    </div>
  `;

  const input = root.querySelector("#tool-query");
  const categorySelect = root.querySelector("#tool-category");
  const sortSelect = root.querySelector("#tool-sort");
  const pillsContainer = root.querySelector("#kube-pills");
  const bannerContainer = root.querySelector("#kube-category-banner");
  const chipsContainer = root.querySelector("#kube-filter-chips");
  const countDisplay = root.querySelector('[role="status"]');
  const resultsGrid = root.querySelector("#tool-results");
  const moreButton = root.querySelector("#tool-more");
  const resetButton = root.querySelector(".kube-filter-reset");

  function restore() {
    const params = new URLSearchParams(location.search);
    input.value = params.get("q") || "";
    categorySelect.value = params.get("category") || "";
    sortSelect.value = params.get("sort") === "za" ? "za" : "az";
    page = 1;
  }

  function updateUrl() {
    const url = new URL(location.href);
    if (input.value) url.searchParams.set("q", input.value);
    else url.searchParams.delete("q");

    if (categorySelect.value) url.searchParams.set("category", categorySelect.value);
    else url.searchParams.delete("category");

    if (sortSelect.value === "za") url.searchParams.set("sort", "za");
    else url.searchParams.delete("sort");

    history.replaceState(null, "", url);
  }

  function renderPills(activeCat) {
    pillsContainer.innerHTML = TOOL_CATEGORIES.map((cat) => {
      const isActive =
        cat.id === "all"
          ? !activeCat || activeCat === "all"
          : activeCat === cat.id ||
            activeCat.toLowerCase() === cat.label.toLowerCase() ||
            activeCat.toLowerCase() === cat.shortLabel.toLowerCase();

      const count = categoryCounts[cat.id];

      return `
        <button
          type="button"
          data-category="${cat.id}"
          class="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
            isActive
              ? "bg-purple text-white shadow-md ring-2 ring-purple/30 scale-105"
              : "bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#3d4449]"
          }"
        >
          <span aria-hidden="true">${cat.icon}</span>
          <span>${cat.shortLabel}</span>
          <span class="rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
            isActive ? "bg-white/25 text-white" : "bg-slate-200/80 dark:bg-[#22272e] text-slate-500 dark:text-slate-400"
          }">
            ${(count || 0).toLocaleString()}
          </span>
        </button>
      `;
    }).join("");
  }

  function renderBanner(activeCat) {
    const catObj = TOOL_CATEGORIES.find(
      (c) =>
        c.id === activeCat ||
        c.label.toLowerCase() === activeCat.toLowerCase() ||
        c.shortLabel.toLowerCase() === activeCat.toLowerCase()
    );

    if (catObj && catObj.id !== "all") {
      bannerContainer.classList.remove("hidden");
      bannerContainer.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div class="flex items-start sm:items-center gap-3">
            <span class="text-2xl" aria-hidden="true">${catObj.icon}</span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-sm sm:text-base text-slate-900 dark:text-white">${catObj.label}</h3>
                <span class="rounded-full bg-purple text-white px-2 py-0.5 text-[11px] font-bold">
                  ${(categoryCounts[catObj.id] || 0).toLocaleString()} tools
                </span>
              </div>
              <p class="mt-1 text-xs text-slate-600 dark:text-slate-300 max-w-2xl">${catObj.description}</p>
            </div>
          </div>
          <button type="button" id="clear-banner-cat" class="inline-flex items-center gap-1.5 self-start sm:self-center rounded-lg border border-purple/30 bg-white dark:bg-[#22272e] px-3 py-1.5 text-xs font-bold text-purple-700 dark:text-brand-purple-100 hover:bg-purple/10 transition shrink-0">
            ✕ Clear category
          </button>
        </div>
      `;
      root.querySelector("#clear-banner-cat")?.addEventListener("click", () => {
        categorySelect.value = "";
        page = 1;
        updateUrl();
        render();
      });
    } else {
      bannerContainer.classList.add("hidden");
      bannerContainer.innerHTML = "";
    }
  }

  function renderChips() {
    const isFiltering = Boolean(input.value || categorySelect.value || sortSelect.value === "za");
    if (!isFiltering) {
      chipsContainer.classList.add("hidden");
      chipsContainer.innerHTML = "";
      return;
    }

    chipsContainer.classList.remove("hidden");
    let chipsHtml = `<span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Active filters:</span>`;

    if (categorySelect.value) {
      const catObj = TOOL_CATEGORIES.find((c) => c.id === categorySelect.value);
      chipsHtml += `
        <span class="inline-flex items-center gap-1.5 rounded-full bg-purple/15 text-purple-700 dark:text-brand-purple-100 border border-purple/30 px-3 py-1 text-xs font-semibold">
          <span>${catObj ? `${catObj.icon} ${catObj.label}` : categorySelect.value}</span>
          <button type="button" id="chip-clear-cat" class="hover:text-red-500 font-bold ml-0.5">✕</button>
        </span>
      `;
    }

    if (input.value) {
      chipsHtml += `
        <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#4d555c] px-3 py-1 text-xs font-semibold">
          <span>Query: "${escape(input.value)}"</span>
          <button type="button" id="chip-clear-q" class="hover:text-red-500 font-bold ml-0.5">✕</button>
        </span>
      `;
    }

    if (sortSelect.value === "za") {
      chipsHtml += `
        <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#4d555c] px-3 py-1 text-xs font-semibold">
          <span>Sort: Z to A</span>
          <button type="button" id="chip-clear-sort" class="hover:text-red-500 font-bold ml-0.5">✕</button>
        </span>
      `;
    }

    chipsHtml += `<button type="button" id="chip-reset-all" class="text-xs font-bold text-purple-600 dark:text-brand-purple-100 hover:underline ml-2">Reset all</button>`;
    chipsContainer.innerHTML = chipsHtml;

    root.querySelector("#chip-clear-cat")?.addEventListener("click", () => {
      categorySelect.value = "";
      page = 1;
      updateUrl();
      render();
    });
    root.querySelector("#chip-clear-q")?.addEventListener("click", () => {
      input.value = "";
      page = 1;
      updateUrl();
      render();
    });
    root.querySelector("#chip-clear-sort")?.addEventListener("click", () => {
      sortSelect.value = "az";
      page = 1;
      updateUrl();
      render();
    });
    root.querySelector("#chip-reset-all")?.addEventListener("click", () => {
      input.value = "";
      categorySelect.value = "";
      sortSelect.value = "az";
      page = 1;
      updateUrl();
      render();
    });
  }

  function render({ append = false } = {}) {
    const words = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const catLower = (categorySelect.value || "").toLowerCase().trim();

    const curated = TOOL_CATEGORIES.find(
      (c) =>
        c.id === catLower ||
        c.label.toLowerCase() === catLower ||
        c.shortLabel.toLowerCase() === catLower
    );

    const visible = entries.filter((entry) => {
      const title = entry.title || "";
      const desc = entry.description || "";
      const tag = entry.tag || "";

      let matchesCategory = true;
      if (catLower && catLower !== "all") {
        if (curated && curated.id !== "all") {
          matchesCategory = curated.matcher(tag, desc, title);
        } else {
          const badge = getToolBadge(entry);
          matchesCategory =
            badge.label.toLowerCase() === catLower ||
            badge.filter.toLowerCase() === catLower ||
            tag.toLowerCase() === catLower ||
            tag.toLowerCase().includes(catLower);
        }
      }

      const haystack = `${title} ${desc} ${tag}`.toLowerCase();
      const matchesWords = words.length === 0 || words.every((w) => haystack.includes(w));
      return matchesCategory && matchesWords;
    }).sort((a, b) => (sortSelect.value === "za" ? -1 : 1) * (a.title || "").localeCompare(b.title || ""));

    const limit = Math.min(page * pageSize, visible.length);
    const cardsHtml = visible
      .slice(append ? (page - 1) * pageSize : 0, limit)
      .map(card)
      .join("");

    if (append) {
      resultsGrid.insertAdjacentHTML("beforeend", cardsHtml);
    } else {
      resultsGrid.innerHTML =
        cardsHtml ||
        `
        <div class="col-span-full kube-tool-empty py-12 text-center">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No matching security tools</h2>
          <p class="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-4">
            Try a broader keyword or clear your filters to explore the catalog.
          </p>
          <button type="button" class="kube-button inline-block reset-empty-btn">Clear all filters</button>
        </div>
      `;
      root.querySelector(".reset-empty-btn")?.addEventListener("click", () => {
        input.value = "";
        categorySelect.value = "";
        sortSelect.value = "az";
        page = 1;
        updateUrl();
        render();
      });
    }

    countDisplay.innerHTML = `Showing <strong>${limit.toLocaleString()}</strong> of <strong>${visible.length.toLocaleString()}</strong> matching tools · ${entries.length.toLocaleString()} in the directory`;
    moreButton.hidden = limit >= visible.length;
    if (limit < visible.length) {
      moreButton.textContent = `Show more tools (${(visible.length - limit).toLocaleString()} remaining)`;
    }
    resetButton.disabled = !input.value && !categorySelect.value && sortSelect.value === "az";

    renderPills(categorySelect.value);
    renderBanner(categorySelect.value);
    renderChips();

    // Attach card badge click listener
    resultsGrid.querySelectorAll("button[data-category]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const cat = btn.getAttribute("data-category");
        if (cat) {
          categorySelect.value = cat;
          page = 1;
          updateUrl();
          render();
          root.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  // Event handlers
  root.querySelector("form").addEventListener("submit", (e) => e.preventDefault());

  input.addEventListener("input", () => {
    page = 1;
    updateUrl();
    render();
  });

  categorySelect.addEventListener("change", () => {
    page = 1;
    updateUrl();
    render();
  });

  sortSelect.addEventListener("change", () => {
    page = 1;
    updateUrl();
    render();
  });

  resetButton.addEventListener("click", () => {
    input.value = "";
    categorySelect.value = "";
    sortSelect.value = "az";
    page = 1;
    updateUrl();
    render();
    input.focus();
  });

  moreButton.addEventListener("click", () => {
    page += 1;
    render({ append: true });
  });

  pillsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-category]");
    if (btn) {
      const cat = btn.getAttribute("data-category");
      categorySelect.value = cat === "all" ? "" : cat;
      page = 1;
      updateUrl();
      render();
    }
  });

  window.addEventListener("popstate", () => {
    restore();
    render();
  });

  restore();
  render();
}

// Global GitHub star counter
const starCounter = document.querySelector("#kube-github-stars");
if (starCounter) {
  fetch("https://api.github.com/repos/CloudSecCorner/cloudseccorner.github.io", {
    signal: AbortSignal.timeout(5000),
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((repo) => {
      if (Number.isFinite(repo?.stargazers_count)) {
        starCounter.textContent = `${repo.stargazers_count.toLocaleString()} GitHub stars`;
      }
    })
    .catch(() => {});
}

// Initialize on DOM load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
