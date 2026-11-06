import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link, useNavigate } from "react-router-dom";
import MarkdownRenderer from "./MarkdownRenderer";
import OpenGraph from "./OpenGraph";
import PageHeader from './PageHeader';
import { REPOSITORY_URL, SITE_URL } from "../utils/socialSharing";
import labIndex from "../../priv/data/labs.json";

// Fallback data in case the fetch fails
const fallbackLabsData = labIndex.labs;

// 4-Tier Cloud AI Security Engineer Career & Learning Roadmap
const roadmapTiers = [
  {
    id: "tier-1",
    tier: "Tier 1",
    level: "Inventory & Evidence",
    role: "Developers and platform engineers",
    badge: "Foundation",
    title: "Measure Exposure and Verify the Fix",
    summary: "Build an evidence loop: identify the owned target, observe a reachable service, make a controlled change, and verify the result from the same vantage point.",
    topics: [
      "Bounded loopback TCP connect scans",
      "Before/after XML evidence and port-state interpretation",
      "Asset applicability, KEV, EPSS, and remediation ownership",
      "Artifact identity and digest verification"
    ],
    regulations: ["Nmap reference guide", "CISA KEV", "FIRST EPSS"],
    primaryLabId: "Nmap-Practical-Labs",
    primaryLabTitle: "NMAP Practical Auditing Labs",
    secondaryLabId: "Security-Engineering-Fundamentals",
    secondaryLabTitle: "Security Engineering Fundamentals"
  },
  {
    id: "tier-2",
    tier: "Tier 2",
    level: "Architecture & Verification",
    role: "Application and identity engineers",
    badge: "Integration",
    title: "Zero-Trust Architecture & Threat Modeling",
    summary: "Separate workload authentication from request permission, then map retrieval, cache, and data-lifecycle boundaries to owners and executable regression tests.",
    topics: [
      "Real local mutual TLS and certificate URI identities",
      "Route authorization and forged-header rejection",
      "RAG tenant and document permissions",
      "Cache policy revisions, deletion, and threat ownership"
    ],
    regulations: ["SPIFFE / SPIRE", "OWASP threat modeling", "OWASP GenAI data security v2"],
    primaryLabId: "Zero-Trust-Architecture",
    primaryLabTitle: "Zero-Trust Architecture",
    secondaryLabId: "Threat-Modeling",
    secondaryLabTitle: "Threat Modeling Practical Guide"
  },
  {
    id: "tier-3",
    tier: "Tier 3",
    level: "Agent Authorization",
    role: "Agent and tool developers",
    badge: "Action boundaries",
    title: "MCP Integration and Action-Bound Approvals",
    summary: "Validate tool schemas, tenant scope, resource limits, approvals, expiry, and replay before side effects. Connect local checks to the versioned MCP authorization contract.",
    topics: [
      "Tool allowlists, argument schemas, and tenant boundaries",
      "Action-bound approvals and atomic replay prevention",
      "MCP token audiences, scopes, and downstream identity",
      "Task budgets, cancellation, and correlated decision evidence"
    ],
    regulations: ["MCP 2026-07-28", "OWASP Agentic Applications 2026"],
    primaryLabId: "Agentic-Cloud-Security",
    primaryLabTitle: "Agentic Cloud Security Essentials",
    secondaryLabId: null,
    secondaryLabTitle: null
  },
  {
    id: "tier-4",
    tier: "Tier 4",
    level: "Release & Runtime Verification",
    role: "Release and runtime owners",
    badge: "Deployment review",
    title: "Trusted Artifacts and Container Boundaries",
    summary: "Verify exact artifact bytes, signer and builder policy, source revision, and selected container controls. Extend local fixtures to real CI, admission, and network enforcement tests.",
    topics: [
      "Signature, digest, approved-builder, and source checks",
      "SLSA provenance, attestations, and constrained CI identity",
      "Privilege, host access, credentials, and init-container policy",
      "Admission results and actual allowed/denied runtime behavior"
    ],
    regulations: ["SLSA v1.2", "Sigstore verification", "Kubernetes Pod Security Standards"],
    primaryLabId: "Security-Engineering-Fundamentals",
    primaryLabTitle: "Security Engineering Fundamentals",
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
      <PageHeader title="Hands-On Labs" description="Practical exercises in cloud identity, application security, agent tool boundaries, and network auditing." stats={[{ label: "Labs", value: labsData.length || "--" }, { label: "Learning Tracks", value: roadmapTiers.length }]} />

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
        <div className="dev-filter-options flex flex-wrap gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
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
                {lab.updated && <p className="text-xs text-slate-500 dark:text-slate-400">{lab.duration} · Reviewed <time dateTime={lab.updated}>{lab.updated}</time></p>}
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

      {/* Cloud AI Security Engineer Career & Learning Roadmap */}
      <section className="dev-roadmap kube-library-container my-10" aria-label="Cloud AI Security Engineer Roadmap">
        <div className="rounded-2xl border border-slate-200/90 dark:border-[#26203b] bg-white dark:bg-[#13111c] p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100 dark:border-[#26203b]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
                Cloud security learning tracks
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Cloud AI Security Engineer Curriculum
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
                Four connected tracks: exposure evidence, workload identity and data boundaries, agent authorization, and release/runtime verification.
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
                    Reference guidance
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
                    Practice goals
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
  const [activeSection, setActiveSection] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cloudsec_lab_font_size");
      if (saved === "normal" || saved === "large" || saved === "xlarge") return saved;
    }
    return "normal"; // 'normal' | 'large' | 'xlarge'
  });
  const [widthMode, setWidthMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cloudsec_lab_width_mode");
      if (saved === "reading" || saved === "full") return saved;
    }
    return "reading"; // 'reading' (optimal ~75-80ch) | 'full' (expanded canvas)
  });
  const [focusMode, setFocusMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cloudsec_lab_zen_mode");
      if (saved !== null) {
        return saved === "true";
      }
    }
    return true; // Zen mode is true by default!
  });
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  const toggleFocusMode = () => {
    setFocusMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("cloudsec_lab_zen_mode", String(next));
      }
      return next;
    });
  };

  const handleWidthMode = (mode) => {
    setWidthMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("cloudsec_lab_width_mode", mode);
    }
  };

  const handleFontSize = (size) => {
    setFontSize(size);
    if (typeof window !== "undefined") {
      localStorage.setItem("cloudsec_lab_font_size", size);
    }
  };

  // Close outline drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOutlineOpen(false);
      }
    };
    if (outlineOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [outlineOpen]);

  // Track window scroll progress for reader bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((window.pageYOffset / totalHeight) * 100)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parse markdown headings for dynamic Table of Contents
  const headings = useMemo(() => {
    if (!content || typeof content !== 'string') return [];
    const lines = content.split('\n');
    const items = [];
    let inCodeBlock = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length; // 2 or 3
        const rawText = match[2].trim().replace(/[*_`]/g, '');
        const slug = rawText
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        items.push({ level, text: rawText, slug });
      }
    }
    return items;
  }, [content]);

  // Compute estimated reading time & word count
  const { readingTime, wordCount } = useMemo(() => {
    if (!content || typeof content !== 'string') return { readingTime: 1, wordCount: 0 };
    const words = content.trim().split(/\s+/).length;
    return {
      readingTime: Math.max(1, Math.ceil(words / 180)),
      wordCount: words,
    };
  }, [content]);

  // Scroll-spy observer for headings
  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0% -60% 0%',
        threshold: 0,
      }
    );

    headings.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings, content]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const scrollToHeading = (slug) => {
    const el = document.getElementById(slug);
    if (el) {
      const yOffset = -120; // Clearance for sticky site header + sticky toolbar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    if (window.innerWidth < 1024) {
      setOutlineOpen(false);
    }
  };

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
            const rawVal = typeof val === 'string' ? val : (val && typeof val.default === 'string' ? val.default : '');
            if (rawVal) {
              loadedMarkdown = rawVal;
              break;
            }
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
            if (typeof text === 'string' && !text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
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
    <div id="reader-top" className="min-h-screen bg-slate-50 dark:bg-[#0c0915] text-slate-800 dark:text-slate-100">
      <OpenGraph
        title={`${lab.title} | Cloud Security Corner Labs`}
        description={lab.description}
        url={`/labs/${lab.id}`}
        type="article"
        tags={lab.tags || []}
      />

      {/* Top Floating Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none">
        <div
          className="dev-reader-progress h-full transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Classic Reader Header (Only shown when Zen Mode is toggled off) */}
      {!focusMode && (
        <header className="kube-lab-reader-header w-full border-b border-slate-200 dark:border-[#26203b] bg-white dark:bg-[#130f1c]">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <nav className="kube-lab-breadcrumb" aria-label="Breadcrumb">
              <Link to="/labs">Labs</Link>
              <span aria-hidden="true">/</span>
              <span className="capitalize">{lab.category}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-3 mt-3 mb-2">
              <span className="kube-label !mb-0">Self-paced lab</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                ⏱️ {readingTime} min read
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#1f1b2e] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2b243f]">
                {wordCount.toLocaleString()} words
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 mb-3">
              {lab.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-4xl leading-relaxed">
              {lab.description}
            </p>
            <div className="kube-lab-reader-tags mt-4" aria-label="Lab topics">
              {lab.tags && lab.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        </header>
      )}

      {/* Classic Reader Steps Guide (Only shown when Zen Mode is toggled off) */}
      {!focusMode && (
        <section className="kube-lab-steps border-b border-slate-200 dark:border-[#26203b] bg-slate-100/60 dark:bg-[#0f0c18]" aria-label="How to use this lab">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
      )}

      {/* Ergonomic Reader Sticky Toolbar (Always persistent navigation, Width, Font Size, Outline, Zen Mode) */}
      <div className="sticky top-16 z-40 w-full border-b border-slate-200/90 dark:border-[#26203b] bg-white/95 dark:bg-[#130f1c]/95 backdrop-blur-md transition-all shadow-xs">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Always Back to All Labs + Breadcrumb / Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/labs"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200/80 dark:border-[#2b243f] transition shrink-0 cursor-pointer"
              title="Return to Labs Library"
            >
              <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>← All Labs</span>
            </Link>

            <span className="text-slate-300 dark:text-[#2e2646] hidden sm:inline-block">|</span>

            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50 shrink-0">
                {lab.category}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs md:max-w-sm lg:max-w-md text-xs">
                {lab.title}
              </span>
            </div>
          </div>

          {/* Right: Controls (Outline Drawer, Scroll %, Font Size, Width Measure, Zen Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap ml-auto">
            {/* Outline / Table of Contents Button */}
            <button
              type="button"
              onClick={() => setOutlineOpen(!outlineOpen)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                outlineOpen
                  ? "bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700 shadow-xs"
                  : "bg-white dark:bg-[#1a1528] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2b243f] hover:border-purple-400 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-300"
              }`}
              title="Table of Contents / Section Outline"
            >
              <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h14" />
              </svg>
              <span>Outline</span>
              {headings.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-purple-200/70 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-bold">
                  {headings.length}
                </span>
              )}
            </button>

            {/* Scroll % */}
            <div className="hidden lg:flex items-center gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400 select-none">
              <span>{scrollProgress}% read</span>
            </div>

            {/* Font Size Selector */}
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#2b243f] p-0.5 bg-slate-100/70 dark:bg-[#1a1528]">
              <button
                type="button"
                title="Default Font (17px body)"
                onClick={() => handleFontSize("normal")}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition ${
                  fontSize === "normal"
                    ? "bg-white dark:bg-[#2a223f] text-purple-700 dark:text-purple-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                A
              </button>
              <button
                type="button"
                title="Large Font (19px body)"
                onClick={() => handleFontSize("large")}
                className={`px-2 py-0.5 rounded text-xs font-bold transition ${
                  fontSize === "large"
                    ? "bg-white dark:bg-[#2a223f] text-purple-700 dark:text-purple-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                A+
              </button>
              <button
                type="button"
                title="X-Large Font (21px body)"
                onClick={() => handleFontSize("xlarge")}
                className={`px-2 py-0.5 rounded text-xs font-black transition ${
                  fontSize === "xlarge"
                    ? "bg-white dark:bg-[#2a223f] text-purple-700 dark:text-purple-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                A++
              </button>
            </div>

            {/* Width Mode Selector */}
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#2b243f] p-0.5 bg-slate-100/70 dark:bg-[#1a1528]">
              <button
                type="button"
                title="Optimal ~75-80 char line measure for deep reading"
                onClick={() => handleWidthMode("reading")}
                className={`px-2.5 py-0.5 rounded text-xs transition ${
                  widthMode === "reading"
                    ? "bg-white dark:bg-[#2a223f] text-purple-700 dark:text-purple-300 shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                }`}
              >
                Optimal
              </button>
              <button
                type="button"
                title="Expanded monitor width for architecture diagrams and code"
                onClick={() => handleWidthMode("full")}
                className={`px-2.5 py-0.5 rounded text-xs transition ${
                  widthMode === "full"
                    ? "bg-white dark:bg-[#2a223f] text-purple-700 dark:text-purple-300 shadow-xs font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                }`}
              >
                Full Width
              </button>
            </div>

            {/* Zen Mode Toggle Button */}
            <button
              type="button"
              title={focusMode ? "Zen Mode is Active (Click to switch to Classic 2-column view)" : "Enable Zen Mode (Distraction-free reading)"}
              onClick={toggleFocusMode}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                focusMode
                  ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 shadow-xs"
                  : "bg-white dark:bg-[#1a1528] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2b243f] hover:bg-slate-50 dark:hover:bg-[#231c36]"
              }`}
            >
              <span>{focusMode ? "🧘 Zen: On" : "🧘 Zen: Off"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Over Outline Drawer (Accessible in both Zen & Classic modes) */}
      {outlineOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setOutlineOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-[#130f1c] border-l border-slate-200 dark:border-[#26203b] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-[#201a30]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block animate-pulse" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Table of Contents
                </h3>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  ({headings.length} sections)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOutlineOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e192c] transition"
                title="Close drawer (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions */}
            <div className="p-3 bg-slate-50 dark:bg-[#181324] border-b border-slate-200/80 dark:border-[#201a30] flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                type="button"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#201a30] text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200 dark:border-[#2b243f] transition shadow-2xs cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
              </button>

              <a
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#201a30] text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200 dark:border-[#2b243f] transition shadow-2xs"
                href={`${REPOSITORY_URL}/blob/main/priv/static${lab.path}`}
                target="_blank"
                rel="noreferrer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit GitHub</span>
              </a>
            </div>

            {/* Headings List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
              {headings.length === 0 ? (
                <div className="text-center py-8 text-slate-400">No sections found</div>
              ) : (
                headings.map(({ level, text, slug }) => {
                  const isActive = activeSection === slug;
                  return (
                    <button
                      key={slug}
                      onClick={() => scrollToHeading(slug)}
                      type="button"
                      className={`w-full text-left py-2 px-3 rounded-lg transition flex items-start gap-2.5 cursor-pointer ${
                        level === 3 ? "pl-6 text-slate-500 dark:text-slate-400 text-[11.5px]" : "font-semibold"
                      } ${
                        isActive
                          ? "bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200 font-bold border-l-2 border-purple-600 dark:border-purple-400"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c172b] hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="truncate">{text}</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-[#201a30] bg-slate-50/70 dark:bg-[#161122] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>⏱️ {readingTime} min read</span>
              <span>{wordCount.toLocaleString()} words</span>
            </div>
          </aside>
        </div>
      )}

      {/* Reader Shell - Zen Mode Centered or Classic 2-Column Mode */}
      <article
        className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 transition-all duration-200 ${
          focusMode
            ? widthMode === "reading"
              ? "max-w-4xl xl:max-w-5xl"
              : "max-w-7xl xl:max-w-[1550px]"
            : widthMode === "reading"
            ? "max-w-[1500px]"
            : "max-w-[1750px]"
        }`}
      >
        <div className={`flex ${focusMode ? "flex-col" : "flex-col lg:flex-row gap-8 lg:gap-12"} items-start`}>
          {/* Classic Mode Left Column: Interactive Sticky Navigation & Table of Contents */}
          {!focusMode && (
            <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-28 max-h-[calc(100vh-8rem)] lg:overflow-y-auto space-y-6 order-2 lg:order-1">
              {/* Back link & Actions */}
              <div className="rounded-xl border border-slate-200 dark:border-[#26203b] bg-white dark:bg-[#130f1c] p-4 shadow-xs">
                <Link
                  to="/labs"
                  className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to All Labs
                </Link>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#201a30] flex flex-col gap-2">
                  <button
                    onClick={handleCopyLink}
                    type="button"
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-[#1a1528] text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-[#26203b] transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      {copiedLink ? "Link Copied!" : "Copy Lab Link"}
                    </span>
                    {copiedLink && (
                      <span className="text-[10px] text-emerald-500 font-bold">✓</span>
                    )}
                  </button>

                  <a
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition"
                    href={`${REPOSITORY_URL}/blob/main/priv/static${lab.path}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit on GitHub →
                  </a>
                </div>
              </div>

              {/* Dynamic Table of Contents */}
              {headings.length > 0 && (
                <nav className="rounded-xl border border-slate-200 dark:border-[#26203b] bg-white dark:bg-[#130f1c] p-4 shadow-xs" aria-label="Table of Contents">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-[#201a30]">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      On This Page
                    </span>
                    <span className="ml-auto text-[10px] font-mono text-slate-400 dark:text-slate-500">
                      {headings.length} sections
                    </span>
                  </div>

                  <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-1 text-xs">
                    {headings.map(({ level, text, slug }) => {
                      const isActive = activeSection === slug;
                      return (
                        <button
                          key={slug}
                          onClick={() => scrollToHeading(slug)}
                          type="button"
                          className={`w-full text-left py-1.5 px-2.5 rounded-md transition flex items-start gap-2 cursor-pointer ${
                            level === 3 ? "pl-5 text-slate-500 dark:text-slate-400" : "font-medium"
                          } ${
                            isActive
                              ? "bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-200 font-bold border-l-2 border-purple-600 dark:border-purple-400"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c172b] hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <span className="truncate">{text}</span>
                        </button>
                      );
                    })}
                  </div>
                </nav>
              )}

              {/* Contribution Guide */}
              <div className="px-2">
                <a
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition flex items-center gap-1.5"
                  href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>📖</span> Community contribution guide →
                </a>
              </div>
            </aside>
          )}

          {/* Reading Content */}
          <div className="flex-1 min-w-0 w-full order-1 lg:order-2">
            {/* Minimalist Metadata Strip in Zen Mode */}
            {focusMode && (
              <div className="mb-8 pb-6 border-b border-slate-200/90 dark:border-[#26203b]">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Link to="/labs" className="hover:text-purple-600 dark:hover:text-purple-400 transition">
                      Labs
                    </Link>
                    <span className="text-slate-300 dark:text-slate-700">/</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{lab.category}</span>
                  </nav>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60">
                      ⏱️ {readingTime} min read
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#1f1b2e] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#2b243f]">
                      {wordCount.toLocaleString()} words
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
                  {lab.description}
                </p>

                {lab.tags && lab.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {lab.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-[#1a1528] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#2e2646]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Production Safety Protocol Callout */}
            <div className="rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/70 dark:bg-[#1a1429] p-4 sm:p-5 mb-8 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 shadow-xs flex items-start gap-3">
              <span className="text-xl sm:text-2xl shrink-0 mt-0.5 select-none" aria-hidden="true">
                🛡️
              </span>
              <div>
                <strong className="text-slate-900 dark:text-white font-bold block mb-0.5">
                  Exercise scope
                </strong>
                These exercises use local fixtures and owned loopback services. Each lab identifies its prerequisites, expected results, cleanup, and the additional verification needed for a real deployment.
              </div>
            </div>

            {/* Markdown Body */}
            <div className="kube-markdown w-full bg-white dark:bg-[#130f1c] rounded-2xl border border-slate-200 dark:border-[#26203b] p-6 sm:p-10 lg:p-12 shadow-sm transition-all">
              <MarkdownRenderer content={content} fontSize={fontSize} />
            </div>

            {/* Reader Footer Navigation */}
            <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-[#26203b] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase font-extrabold tracking-wider text-slate-500 dark:text-slate-400">
                  Ready for another topic?
                </p>
                <Link
                  to="/labs"
                  className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline mt-1 inline-block"
                >
                  Browse full cloud AI security curriculum →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOutlineOpen(true)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition border border-purple-200 dark:border-purple-800 cursor-pointer"
                >
                  📑 Table of Contents
                </button>
                <a
                  href="#reader-top"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1f1b2e] hover:bg-slate-200 dark:hover:bg-[#2b243f] transition border border-slate-200 dark:border-[#2b243f]"
                >
                  Back to top ↑
                </a>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
}

// Main Component Router
function Labs() {
  const { labId } = useParams();
  return <div className="dev-page dev-labs">{!labId ? <LabsList /> : <LabDetail />}</div>;
}

export default Labs;
