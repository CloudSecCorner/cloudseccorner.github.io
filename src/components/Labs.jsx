import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";
import OpenGraph from "./OpenGraph";
import { REPOSITORY_URL, SITE_URL } from "../utils/socialSharing";

// Fallback data in case the fetch fails
const fallbackLabsData = [
  {
    id: "Agentic-Cloud-Security",
    title: "Agentic Cloud Security Essentials",
    description: "Architect enterprise-grade defenses for autonomous AI agents: Zero-Trust identity brokering, L7 MCP tool firewalls, Firecracker microVM sandboxing, eBPF telemetry, and NIST/ISO/OWASP governance.",
    category: "Agentic Security",
    path: "/labs/agentic-cloud-security.md",
    contributors: ["Sangam Biradar"],
    tags: ["Cloud AI Security", "Agentic Defense", "Zero Trust", "Firecracker", "MCP Firewall", "eBPF", "NIST AI RMF"]
  },
  {
    id: "Zero-Trust-Architecture",
    title: "Zero-Trust Architecture",
    description: "A security model assuming all users, devices, and agents are hostile. Enforce mutual attestation, least privilege, and continuous verification.",
    category: "Security Engineering",
    path: "/labs/Zero-Trust-Architecture.md",
    contributors: ["Sangam Biradar"],
    tags: ["Zero Trust", "Cloud Architecture", "IAM", "Mutual TLS", "SPIFFE"]
  },
  {
    id: "Threat-Modeling",
    title: "Threat Modeling Practical Guide",
    description: "Learn how to systematically create a threat model, map trust boundaries, and evaluate attack surfaces for real-world cloud architectures.",
    category: "Security Engineering",
    path: "/labs/threat-modeling.md",
    contributors: ["Sangam Biradar"],
    tags: ["Threat Modeling", "STRIDE", "Architecture", "MITRE ATLAS"]
  },
  {
    id: "Security-Engineering-Fundamentals",
    title: "Security Engineering Fundamentals",
    description: "Understand the core principles of security engineering and how to apply them to modern infrastructure and workload boundaries.",
    category: "Security Engineering",
    path: "/labs/Security-Engineering-Fundamentals.md",
    contributors: ["Sangam Biradar"],
    tags: ["Security Engineering", "Defense In Depth", "Identity", "CIS Benchmarks"]
  },
  {
    id: "Nmap-Practical-Labs",
    title: "NMAP Practical Auditing Labs",
    description: "Network reconnaissance, service discovery, open port auditing, and banner grabbing techniques for security engineers.",
    category: "Network Security",
    path: "/labs/NMAP-Practical-Labs.md",
    contributors: ["Sangam Biradar"],
    tags: ["Network Security", "Reconnaissance", "Auditing"]
  },
  {
    id: "ethical-hacker-easy-way",
    title: "Ethical Hacker Practical Lab",
    description: "Hands-on fundamentals of ethical hacking, penetration testing workflows, vulnerability assessment, and defense validation.",
    category: "Ethical Hacking",
    path: "/labs/ethical-hacker-easy-way.md",
    contributors: ["Sangam Biradar"],
    tags: ["Ethical Hacking", "Penetration Testing"]
  }
];

// 4-Tier Cloud AI Security Engineer Career & Learning Roadmap
const roadmapTiers = [
  {
    id: "tier-1",
    tier: "Tier 1",
    level: "Foundations & Perimeter",
    role: "Cloud Security Associate / SRE",
    badge: "L1 - L2 Track",
    title: "Cloud & Perimeter Security Fundamentals",
    summary: "Establish uncompromising infrastructure baseline security. Master identity boundary definitions, network microsegmentation, IMDSv2 protections, and automated CIS Benchmark audit scanning.",
    topics: [
      "AWS IAM & Azure Entra ID Least-Privilege Policies",
      "Network ACLs, Security Groups & Transit Gateway Egress",
      "Instance Metadata Service Hardening (IMDSv2 Hop Limit = 1)",
      "Automated CSPM Auditing against CIS Cloud Benchmarks"
    ],
    regulations: ["CIS Cloud Benchmarks v3.0", "NIST SP 800-53 (AC/SC)"],
    primaryLabId: "Security-Engineering-Fundamentals",
    primaryLabTitle: "Security Engineering Fundamentals",
    secondaryLabId: "Nmap-Practical-Labs",
    secondaryLabTitle: "NMAP Practical Auditing Labs"
  },
  {
    id: "tier-2",
    tier: "Tier 2",
    level: "Architecture & Verification",
    role: "Senior Cloud Security Engineer",
    badge: "L3 Track",
    title: "Zero-Trust Architecture & Threat Modeling",
    summary: "Shift from implicit perimeter trust to continuous attestation. Perform rigorous STRIDE and LINDDUN threat modeling on microservices, enforce mTLS, and implement Open Policy Agent (OPA) guardrails.",
    topics: [
      "BeyondCorp Zero-Trust Principles (Never Trust, Always Verify)",
      "STRIDE & Data Flow Threat Modeling for Distributed Systems",
      "SPIFFE/SPIRE Workload Attestation & Mutual TLS",
      "Policy-as-Code Guardrails with Open Policy Agent (Rego)"
    ],
    regulations: ["NIST SP 800-207 (Zero Trust)", "SOC 2 Type II Security Criteria"],
    primaryLabId: "Zero-Trust-Architecture",
    primaryLabTitle: "Zero-Trust Architecture",
    secondaryLabId: "Threat-Modeling",
    secondaryLabTitle: "Threat Modeling Practical Guide"
  },
  {
    id: "tier-3",
    tier: "Tier 3",
    level: "Agentic Systems & Isolation",
    role: "Staff Cloud AI Security Engineer (Netflix/Cloudflare Caliber)",
    badge: "L4 Core Specialist",
    title: "Agentic AI Defense, MCP Firewalls & MicroVMs",
    summary: "Architect enterprise defense envelopes for autonomous LLM agents. Implement L7 Model Guardrail Gateways, MCP Tool-Call Firewalls, Down-Scoped JIT Token Brokering, and Firecracker/eBPF runtime isolation.",
    topics: [
      "Multi-Tier LLM Gateway & Layer 7 Semantic Inspection",
      "Model Context Protocol (MCP) Tool-Call Firewall & OPA Validation",
      "Down-Scoped Just-In-Time (JIT) IAM Token Brokering",
      "Hardware MicroVM Sandboxing (AWS Firecracker / gVisor runsc)",
      "eBPF Tetragon Kernel Syscall Interception (Blocking IMDS SSRF)"
    ],
    regulations: ["OWASP Top 10 for LLMs / GenAI", "MITRE ATLAS Matrix (AML.T0051, AML.T0054)"],
    primaryLabId: "Agentic-Cloud-Security",
    primaryLabTitle: "Agentic Cloud Security & Defense",
    secondaryLabId: null,
    secondaryLabTitle: null
  },
  {
    id: "tier-4",
    tier: "Tier 4",
    level: "Red Teaming & Governance",
    role: "Principal AI Security Architect / Governance Lead",
    badge: "L5 / Principal Track",
    title: "Autonomous Red Teaming & Global AI Compliance",
    summary: "Execute continuous adversarial evaluation and cryptographic governance. Automate prompt injection jailbreaks, deploy RAG canary tripwires, enforce WORM audit trails, and ensure multi-framework regulatory alignment.",
    topics: [
      "Automated Prompt Injection & Jailbreak Fuzzing (PyRIT / Garak)",
      "Canary Token Tripwires for RAG Retrieval & Prompt Leakage",
      "Tamper-Evident WORM Audit Ledgers & OpenTelemetry GenAI Spans",
      "Cross-Framework Compliance (NIST AI RMF 1.0 & ISO/IEC 42001)"
    ],
    regulations: ["NIST AI RMF 1.0 (GOVERN, MAP, MEASURE, MANAGE)", "ISO/IEC 42001:2023", "EU AI Act High-Risk Controls"],
    primaryLabId: "Agentic-Cloud-Security",
    primaryLabTitle: "Agentic Security & Compliance",
    secondaryLabId: "ethical-hacker-easy-way",
    secondaryLabTitle: "Ethical Hacker Practical Lab"
  }
];

// 1. Labs Library Listing Component (matching KubeDaily's labs.html.heex)
function LabsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTierIndex, setActiveTierIndex] = useState(2); // Default to Tier 3 (Agentic AI)
  const [labsData, setLabsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabsData = async () => {
      try {
        setLoading(true);
        const potentialUrls = [
          '/data/labs.json',
          '/labs/index.json',
          `${window.location.origin}/data/labs.json`
        ];

        let fetchSuccess = false;
        for (const url of potentialUrls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              setLabsData(data.labs || []);
              fetchSuccess = true;
              break;
            }
          } catch (err) {
            console.log(`Failed to fetch from ${url}:`, err);
          }
        }

        if (!fetchSuccess) {
          setLabsData(fallbackLabsData);
        }
      } catch (error) {
        console.error("Error fetching labs data:", error);
        setLabsData(fallbackLabsData);
      } finally {
        setLoading(false);
      }
    };

    fetchLabsData();
  }, []);

  const categories = ["all", ...new Set(labsData.map(lab => lab.category))];

  const filteredLabs = labsData.filter(lab => {
    const matchesSearch =
      searchQuery === "" ||
      lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lab.tags && lab.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = activeCategory === "all" || lab.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const activeTier = roadmapTiers[activeTierIndex];

  return (
    <>
      {/* KubeDaily Library Header */}
      <header className="kube-library-header">
        <div className="kube-library-container">
          <p className="kube-label">The CloudSecCorner workshop</p>
          <h1>
            Less theory.<br />
            <span>More hands-on understanding.</span>
          </h1>
          <p className="kube-library-intro">
            Explore cloud and agentic security at your own pace. Start with Security Engineering Fundamentals, inspect agent boundaries, and build up to zero-trust architectures.
          </p>
          <div className="kube-library-links">
            <Link to="/labs/Agentic-Cloud-Security">Start with Agentic Security →</Link>
            <Link to="/blog">Looking for an explanation? Read the guides →</Link>
          </div>
        </div>
      </header>

      {/* Cloud AI Security Engineer Career & Learning Roadmap */}
      <section className="kube-library-container my-10" aria-label="Cloud AI Security Engineer Roadmap">
        <div className="rounded-2xl border border-slate-200/90 dark:border-[#26203b] bg-white dark:bg-[#13111c] p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#26203b]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
                Industry Roadmap • Cloudflare &amp; Netflix Engineering Caliber
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Cloud AI Security Engineer Curriculum
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
                A progressive 4-tier competency roadmap bridging cloud infrastructure defense, zero-trust attestation, autonomous agent sandboxing, and global AI governance.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-600 dark:bg-purple-400" />
              <span>Interactive Step-by-Step Tracks</span>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-6">
            {roadmapTiers.map((tier, idx) => {
              const isActive = activeTierIndex === idx;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setActiveTierIndex(idx)}
                  className={`text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 relative ${
                    isActive
                      ? "border-purple-600 dark:border-purple-500 bg-purple-50/70 dark:bg-purple-950/30 shadow-xs"
                      : "border-slate-200 dark:border-[#26203b] hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-[#1a1726]/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isActive ? "text-purple-700 dark:text-purple-300" : "text-slate-500 dark:text-slate-400"
                    }`}>
                      {tier.tier}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}>
                      {tier.badge}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {tier.level}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {tier.role}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Selected Tier Detail Panel */}
          {activeTier && (
            <div className="mt-6 rounded-xl border border-slate-200/90 dark:border-[#2e2747] bg-slate-50/60 dark:bg-[#151221] p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-5 border-b border-slate-200/80 dark:border-[#26203b]">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
                      {activeTier.tier} Focus
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Target Role: <strong className="text-slate-900 dark:text-slate-200">{activeTier.role}</strong>
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {activeTier.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {activeTier.summary}
                  </p>
                </div>

                {/* Regulatory Tags */}
                <div className="flex flex-wrap lg:flex-col lg:items-end gap-1.5 shrink-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Frameworks &amp; Regulations
                  </span>
                  {activeTier.regulations.map((reg) => (
                    <span
                      key={reg}
                      className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
                    >
                      {reg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grid: Competencies vs Applied Labs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Left: Competencies & Defense Topologies */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Production Defense Competencies
                  </h4>
                  <ul className="space-y-2.5">
                    {activeTier.topics.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 mt-2 shrink-0" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: Recommended Labs */}
                <div className="flex flex-col justify-between rounded-lg bg-white dark:bg-[#1a1728]/70 border border-slate-200/80 dark:border-[#2b243f] p-4 sm:p-5">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Applied Practice Labs
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                      Complete these self-paced scenarios in your isolated sandbox to validate this tier's controls:
                    </p>

                    <div className="space-y-2.5">
                      <Link
                        to={`/labs/${activeTier.primaryLabId}`}
                        className="group flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#201c30] border border-purple-200 dark:border-purple-800/50 hover:border-purple-500 transition shadow-xs"
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
                            Primary Lab
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                            {activeTier.primaryLabTitle}
                          </p>
                        </div>
                        <span className="text-purple-600 dark:text-purple-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>

                      {activeTier.secondaryLabId && (
                        <Link
                          to={`/labs/${activeTier.secondaryLabId}`}
                          className="group flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#201c30] border border-slate-200 dark:border-[#2b243f] hover:border-purple-500 transition shadow-xs"
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                              Complementary Track
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                              {activeTier.secondaryLabTitle}
                            </p>
                          </div>
                          <span className="text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 font-bold text-sm group-hover:translate-x-1 transition-transform">
                            →
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* KubeDaily Library Section */}
      <section id="lab-library" className="kube-library-container kube-library-section">
        <div className="kube-library-toolbar">
          <div>
            <p className="kube-label">Practice &amp; explore</p>
            <h2>Choose your next lab</h2>
          </div>
          <div className="kube-library-search">
            <label htmlFor="lab-search">Find a lab</label>
            <input
              id="lab-search"
              type="search"
              placeholder="Search Agentic, Threat, Zero-Trust…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition capitalize ${
                activeCategory === cat
                  ? "bg-purple text-white shadow-sm"
                  : "bg-slate-100 dark:bg-[#31373b] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#3d4449]"
              }`}
            >
              {cat === "all" ? "All Labs" : cat}
            </button>
          ))}
        </div>

        <p className="kube-library-count" role="status">
          {filteredLabs.length} {filteredLabs.length === 1 ? "lab" : "labs"} to explore
        </p>

        {/* Labs Grid */}
        <div className="kube-labs-grid">
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-500">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent mx-auto mb-3" />
              Loading labs…
            </div>
          ) : filteredLabs.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 dark:border-[#3d4449] p-10 text-center text-slate-600 dark:text-slate-400">
              No labs match that search. Try another query or clear the filter to see everything.
            </div>
          ) : (
            filteredLabs.map((lab) => (
              <article key={lab.id} className="kube-lab-card group">
                <div className="kube-lab-card-top">
                  <span className="kube-lab-number" aria-hidden="true">&gt;_</span>
                  <p className="kube-label">{lab.category}</p>
                </div>
                <h3>
                  <Link to={`/labs/${lab.id}`}>{lab.title}</Link>
                </h3>
                <p>{lab.description}</p>
                <div className="kube-lab-card-tags" aria-label="Topics">
                  {lab.tags && lab.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <Link className="kube-lab-card-link" to={`/labs/${lab.id}`}>
                  Open lab <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))
          )}
        </div>

        {/* Good Habit Callout */}
        <div className="kube-library-practice">
          <strong>A good defense habit</strong>
          <p>
            Use a disposable sandboxed environment. Verify IAM trust boundaries, read policies before applying them, and clean up temporary test resources when finished.
          </p>
        </div>
      </section>

      {/* Library Footer */}
      <section className="kube-library-container kube-library-footer">
        <div>
          <p className="kube-label">Learn in the open</p>
          <h2>Make the next step easier for someone.</h2>
          <p>Report an outdated policy, clarify a threat model, or contribute an exercise.</p>
        </div>
        <a href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
          Improve a lab →
        </a>
      </section>
    </>
  );
}

// Bundled raw markdown content for instant offline/SPA rendering
const bundledLabFiles = import.meta.glob('../../priv/static/labs/*.md', { query: '?raw', import: 'default', eager: true });

// 2. Individual Lab Reader Component (matching KubeDaily's lab.html.heex)
function LabDetail() {
  const { labId } = useParams();
  const [content, setContent] = useState("");
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        setLoading(true);
        let labsData = [];
        let fetchSuccess = false;

        const potentialUrls = [
          '/data/labs.json',
          '/labs/index.json',
          `${window.location.origin}/data/labs.json`
        ];

        for (const url of potentialUrls) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const data = await response.json();
              labsData = data.labs || [];
              fetchSuccess = true;
              break;
            }
          } catch (err) {
            console.log(`Failed to fetch from ${url}:`, err);
          }
        }

        if (!fetchSuccess) {
          labsData = fallbackLabsData;
        }

        const selectedLab = labsData.find((l) => l.id.toLowerCase() === labId.toLowerCase());
        if (!selectedLab) {
          navigate("/labs");
          return;
        }

        setLab(selectedLab);

        // 1. Check bundled files first (instant, guaranteed, zero network latency, no 404 HTML fallback)
        let loadedMarkdown = "";
        const labFileName = (selectedLab.path || '').split('/').pop();
        for (const [key, val] of Object.entries(bundledLabFiles)) {
          if (key.endsWith(labFileName) || key.toLowerCase().includes(selectedLab.id.toLowerCase())) {
            loadedMarkdown = val;
            break;
          }
        }

        if (loadedMarkdown) {
          setContent(loadedMarkdown);
          return;
        }

        // 2. Fallback to network fetch if not found in bundle
        try {
          const markdownResponse = await fetch(selectedLab.path);
          if (markdownResponse.ok) {
            const text = await markdownResponse.text();
            if (!text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
              setContent(text);
              return;
            }
          }
        } catch (fetchErr) {
          console.warn("Network fetch failed, attempting fallback paths:", fetchErr);
        }

        setContent(`# ${selectedLab.title}\n\n${selectedLab.description}`);
      } catch (error) {
        console.error("Error fetching lab details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabData();
  }, [labId, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (!lab) {
    return null;
  }

  return (
    <div>
      <OpenGraph
        title={`${lab.title} | Cloud Security Corner Labs`}
        description={lab.description}
        url={`/labs/${lab.id}`}
        type="article"
        tags={lab.tags || []}
      />

      {/* Reader Header - Full Wide Layout */}
      <header className="kube-lab-reader-header w-full border-b border-slate-200 dark:border-[#26203b]" id="reader-top">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <nav className="kube-lab-breadcrumb" aria-label="Breadcrumb">
            <Link to="/labs">Labs</Link>
            <span aria-hidden="true">/</span>
            <span>{lab.category}</span>
          </nav>
          <p className="kube-label">Self-paced lab</p>
          <h1>{lab.title}</h1>
          <p>{lab.description}</p>
          <div className="kube-lab-reader-tags" aria-label="Lab topics">
            {lab.tags && lab.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </header>

      {/* Reader Steps */}
      <section className="kube-lab-steps" aria-label="How to use this lab">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <ol>
            <li>
              <span>1</span>
              <div>
                <strong>Read the concept</strong>
                <small>Build the mental model first.</small>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <strong>Try the commands</strong>
                <small>Use a disposable sandboxed environment.</small>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <strong>Keep the notes</strong>
                <small>Return when you need a refresher.</small>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Reader Shell - Full Width */}
      <article className="kube-lab-reader-shell w-full max-w-[1600px] mx-auto">
        <aside className="kube-lab-outline" aria-label="Lesson contents">
          <Link className="kube-lab-outline-all" to="/labs">
            ← All labs
          </Link>
          <a
            className="kube-contribute-link"
            href={`${REPOSITORY_URL}/blob/main/priv/static${lab.path}`}
            target="_blank"
            rel="noreferrer"
          >
            Edit this lab on GitHub →
          </a>
          <a
            className="kube-contribute-link"
            href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}
            target="_blank"
            rel="noreferrer"
          >
            Contribution guide
          </a>
        </aside>

        <div className="kube-lab-reading w-full min-w-0">
          <div className="kube-lab-reading-note">
            <strong>Before you start:</strong> Read commands and policies before executing them. Avoid using production accounts for testing.
          </div>
          <div className="kube-markdown w-full text-base leading-relaxed">
            <MarkdownRenderer content={content} />
          </div>
          <footer className="kube-reader-end">
            <p>Ready for another topic?</p>
            <Link to="/labs">Browse all labs →</Link>
            <a href="#reader-top">Back to top ↑</a>
          </footer>
        </div>
      </article>
    </div>
  );
}

// Main Component Router
function Labs() {
  const { labId } = useParams();
  return !labId ? <LabsList /> : <LabDetail />;
}

export default Labs;
