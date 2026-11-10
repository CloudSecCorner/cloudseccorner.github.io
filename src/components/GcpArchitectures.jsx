import ArchitectureHeader from "./ArchitectureHeader";
import { Network, ShieldCheck, Braces, FileCode, BookOpen } from "lucide-react";
import referenceArchitectures from "../data/reference-architectures.json";
import DiagramViewer from "./DiagramViewer";
import React, { useEffect, useState, useMemo } from "react";
import OpenGraph from "./OpenGraph";
import { useStackBuilder } from "../context/StackBuilderContext";

export default function GcpArchitectures() {
  const { addToStack, removeFromStack, isInStack } = useStackBuilder();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [category, setCategory] = useState("all");
  const [pillar, setPillar] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [compliance, setCompliance] = useState("all");
  const [page, setPage] = useState(1);
  const [activeTabs, setActiveTabs] = useState({});
  const [modalItem, setModalItem] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const pageSize = 12;

  useEffect(() => {
    fetch("/data/gcp-best-practices.json")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((items) => {
        setData([...referenceArchitectures.gcp, ...items]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load GCP architectures:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!modalItem) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setModalItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalItem]);

  const domains = [
    { id: "all", name: "All Domains", icon: "⚡", categoryIds: [] },
    { id: "identity-governance", name: "Identity & Governance", icon: "🔑", categoryIds: ["gcp-iam", "gcp-org-policy", "gcp-iap"] },
    { id: "compute-containers", name: "Compute & Containers", icon: "⚡", categoryIds: ["gcp-gce", "gcp-gke", "gcp-artifact"] },
    { id: "storage-databases", name: "Storage & Databases", icon: "🗄️", categoryIds: ["gcp-gcs", "gcp-sql", "gcp-spanner"] },
    { id: "network-perimeter", name: "Network & Perimeter", icon: "🌐", categoryIds: ["gcp-vpc", "gcp-armor", "gcp-psc", "gcp-dns"] },
    { id: "security-kms-posture", name: "Security, KMS & Posture", icon: "🔒", categoryIds: ["gcp-kms", "gcp-secrets", "gcp-scc", "gcp-dlp"] },
    { id: "telemetry-siem", name: "Telemetry & SIEM", icon: "📊", categoryIds: ["gcp-logging", "gcp-monitoring", "gcp-chronicle"] },
    { id: "serverless-ai", name: "Serverless & AI Workloads", icon: "🧠", categoryIds: ["gcp-cloudrun", "gcp-pubsub", "gcp-vertex", "gcp-bigquery"] }
  ];

  const categories = [
    { id: "all", name: "All 24 Domains", icon: null, domain: "all" },
    { id: "gcp-iam", name: "Cloud IAM & Workload Identity", icon: "/images/gcp-icons/gcp-iam.svg", domain: "identity-governance" },
    { id: "gcp-org-policy", name: "Org Policy & Hierarchy", icon: "/images/gcp-icons/gcp-org-policy.svg", domain: "identity-governance" },
    { id: "gcp-iap", name: "Identity-Aware Proxy (IAP)", icon: "/images/gcp-icons/gcp-iap.svg", domain: "identity-governance" },
    { id: "gcp-gce", name: "Compute Engine & Shielded VM", icon: "/images/gcp-icons/gcp-gce.svg", domain: "compute-containers" },
    { id: "gcp-gke", name: "GKE Enterprise & Autopilot", icon: "/images/gcp-icons/gcp-gke.svg", domain: "compute-containers" },
    { id: "gcp-artifact", name: "Artifact Registry & BinAuth", icon: "/images/gcp-icons/gcp-artifact.svg", domain: "compute-containers" },
    { id: "gcp-gcs", name: "Cloud Storage & Bucket Lock", icon: "/images/gcp-icons/gcp-gcs.svg", domain: "storage-databases" },
    { id: "gcp-sql", name: "Cloud SQL & AlloyDB Enclaves", icon: "/images/gcp-icons/gcp-sql.svg", domain: "storage-databases" },
    { id: "gcp-spanner", name: "Cloud Spanner & Bigtable", icon: "/images/gcp-icons/gcp-spanner.svg", domain: "storage-databases" },
    { id: "gcp-vpc", name: "VPC & Hierarchical Firewalls", icon: "/images/gcp-icons/gcp-vpc.svg", domain: "network-perimeter" },
    { id: "gcp-armor", name: "Cloud Armor WAF & Adaptive DDoS", icon: "/images/gcp-icons/gcp-armor.svg", domain: "network-perimeter" },
    { id: "gcp-psc", name: "Private Service Connect (PSC)", icon: "/images/gcp-icons/gcp-psc.svg", domain: "network-perimeter" },
    { id: "gcp-dns", name: "Cloud DNS & DNSSEC Defense", icon: "/images/gcp-icons/gcp-dns.svg", domain: "network-perimeter" },
    { id: "gcp-kms", name: "Cloud KMS & Cloud HSM", icon: "/images/gcp-icons/gcp-kms.svg", domain: "security-kms-posture" },
    { id: "gcp-secrets", name: "Secret Manager & Rotation", icon: "/images/gcp-icons/gcp-secrets.svg", domain: "security-kms-posture" },
    { id: "gcp-scc", name: "Security Command Center (SCC)", icon: "/images/gcp-icons/gcp-scc.svg", domain: "security-kms-posture" },
    { id: "gcp-dlp", name: "Cloud DLP / Sensitive Data", icon: "/images/gcp-icons/gcp-dlp.svg", domain: "security-kms-posture" },
    { id: "gcp-logging", name: "Cloud Logging & Audit Sinks", icon: "/images/gcp-icons/gcp-logging.svg", domain: "telemetry-siem" },
    { id: "gcp-monitoring", name: "Cloud Monitoring & Alerts", icon: "/images/gcp-icons/gcp-monitoring.svg", domain: "telemetry-siem" },
    { id: "gcp-chronicle", name: "Chronicle SIEM & SOAR", icon: "/images/gcp-icons/gcp-chronicle.svg", domain: "telemetry-siem" },
    { id: "gcp-cloudrun", name: "Cloud Run & Serverless Sandboxes", icon: "/images/gcp-icons/gcp-cloudrun.svg", domain: "serverless-ai" },
    { id: "gcp-pubsub", name: "Cloud Pub/Sub & Eventarc Bus", icon: "/images/gcp-icons/gcp-pubsub.svg", domain: "serverless-ai" },
    { id: "gcp-vertex", name: "Vertex AI & Generative Defense", icon: "/images/gcp-icons/gcp-vertex.svg", domain: "serverless-ai" },
    { id: "gcp-bigquery", name: "BigQuery & Column-Level Security", icon: "/images/gcp-icons/gcp-bigquery.svg", domain: "serverless-ai" }
  ];

  const pillars = ["all", "Security", "Reliability", "Operational Excellence", "Cost Optimization", "Performance Efficiency"];
  const severities = ["all", "Critical", "High", "Medium", "Low"];
  const complianceStandards = ["all", "CIS GCP", "NIST", "PCI-DSS", "SOC 2", "ISO 27001", "FedRAMP"];

  const quickChips = [
    { label: "⚡ Critical Only", filter: { severity: "Critical" } },
    { label: "🛡️ Security Pillar", filter: { pillar: "Security" } },
    { label: "🔐 Cloud KMS & HSM", filter: { category: "gcp-kms", domain: "security-kms-posture" } },
    { label: "🗄️ Cloud Storage Lock", filter: { category: "gcp-gcs", domain: "storage-databases" } },
    { label: "☸️ GKE Autopilot", filter: { category: "gcp-gke", domain: "compute-containers" } },
    { label: "🌐 VPC Service Controls", filter: { category: "gcp-psc", domain: "network-perimeter" } },
    { label: "🛡️ SCC Premium", filter: { category: "gcp-scc", domain: "security-kms-posture" } },
    { label: "👁️ Chronicle SIEM", filter: { category: "gcp-chronicle", domain: "telemetry-siem" } }
  ];

  const visibleCategories = useMemo(() => {
    if (selectedDomain === "all") return categories;
    return [
      categories[0],
      ...categories.filter((c) => {
        const dom = domains.find((d) => d.id === selectedDomain);
        return dom && dom.categoryIds.includes(c.id);
      })
    ];
  }, [selectedDomain]);

  const domainCounts = useMemo(() => {
    const counts = { all: data.length };
    domains.forEach((dom) => {
      if (dom.id !== "all") {
        counts[dom.id] = data.filter((item) => dom.categoryIds.includes(item.category)).length;
      }
    });
    return counts;
  }, [data]);

  const categoryCounts = useMemo(() => {
    const counts = { all: data.length };
    categories.forEach((cat) => {
      if (cat.id !== "all") {
        counts[cat.id] = data.filter((item) => item.category === cat.id).length;
      }
    });
    return counts;
  }, [data]);

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    return data.filter((item) => {
      if (selectedDomain !== "all") {
        const dom = domains.find((d) => d.id === selectedDomain);
        if (dom && !dom.categoryIds.includes(item.category)) return false;
      }
      if (category !== "all" && item.category !== category) return false;
      if (pillar !== "all" && item.pillar !== pillar) return false;
      if (severity !== "all" && item.severity !== severity) return false;
      if (compliance !== "all") {
        if (!item.compliance || !item.compliance.some((c) => c.toLowerCase().includes(compliance.toLowerCase()))) {
          return false;
        }
      }
      if (q) {
        const match =
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.service.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.developer_guide && [item.developer_guide.name, item.developer_guide.contract, ...item.developer_guide.dependencies, ...item.developer_guide.failures].join(" ").toLowerCase().includes(q)) ||
          (item.pillar && item.pillar.toLowerCase().includes(q)) ||
          (item.compliance && item.compliance.some((c) => c.toLowerCase().includes(q)));
        if (!match) return false;
      }
      return true;
    });
  }, [data, selectedDomain, category, pillar, severity, compliance, query]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case "Critical":
        return {
          pill: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 dark:bg-rose-500/15",
          dot: "bg-rose-500 animate-pulse"
        };
      case "High":
        return {
          pill: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:bg-amber-500/15",
          dot: "bg-amber-500"
        };
      case "Medium":
        return {
          pill: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 dark:bg-yellow-500/15",
          dot: "bg-yellow-500"
        };
      default:
        return {
          pill: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30 dark:bg-slate-500/15",
          dot: "bg-slate-400"
        };
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const downloadSvg = (svgContent, id) => {
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}-gcp-architecture.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  function highlightCode(code, lang) {
    if (!code) return "";
    let safe = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const tokens = [];
    safe = safe.replace(/(#.*$)/gm, (match) => {
      const id = `___TOK${tokens.length}___`;
      tokens.push(`<span class="text-slate-500 italic">${match}</span>`);
      return id;
    });

    safe = safe.replace(/(&quot;.*?&quot;|".*?")/g, (match) => {
      const id = `___TOK${tokens.length}___`;
      tokens.push(`<span class="text-emerald-400 font-medium">${match}</span>`);
      return id;
    });

    let out = safe;
    if (lang === "rego") {
      out = out.replace(/\b(package|default|import|not|some|in|every|if|else)\b/g, '<span class="text-emerald-400 font-bold">$1</span>');
      out = out.replace(/\b(allow|deny|msg)\b/g, '<span class="text-rose-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(input|data)\b/g, '<span class="text-blue-300 font-semibold">$1</span>');
    } else if (lang === "tf") {
      out = out.replace(/\b(resource|data|variable|output|locals|provider|terraform|module|lifecycle|prevent_destroy)\b/g, '<span class="text-emerald-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(var|local|each|count)\b/g, '<span class="text-blue-300 font-semibold">$1</span>');
      out = out.replace(/([a-zA-Z_][a-zA-Z0-9_-]*)\s*=/g, '<span class="text-sky-300 font-medium">$1</span> =');
    }

    tokens.forEach((t, i) => {
      out = out.replace(`___TOK${i}___`, t);
    });

    return out;
  }

  const isFiltered = selectedDomain !== "all" || category !== "all" || pillar !== "all" || severity !== "all" || compliance !== "all" || query;

  return (
    <div className="dev-page developer-catalog min-h-screen bg-slate-50 dark:bg-[#060a14] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <OpenGraph
        title="Google Cloud Developer Architectures | CloudSecCorner"
        description="Google Cloud application integration patterns with service dependencies, deployment workflows, integration tests and debugging notes."
        tags={["GCP Architecture", "Obsidian Pele", "Google Cloud Best Practices", "OPA Rego", "Terraform", "CIS GCP Benchmark"]}
      />

      <ArchitectureHeader provider="Google Cloud" count={data.length} services={new Set(data.map(item => item.category)).size} references={referenceArchitectures.gcp.length} />

      {/* Explorer Main Section */}
      <section id="architecture-catalog" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {/* Search & Filter Header */}
        <div className="space-y-6 mb-8">
          {/* Main Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search services, integration patterns, dependencies, or controls..."
              className="w-full rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-3.5 pl-11 pr-24 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm dark:shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
            />
            <svg className="absolute left-4 top-4 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="absolute right-3.5 top-3 flex items-center gap-2">
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                  className="rounded-md bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition"
                >
                  Clear
                </button>
              )}
              <span className="hidden sm:inline-block rounded px-1.5 py-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
                ⌘K
              </span>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1">Quick Filters:</span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (chip.filter.domain) setSelectedDomain(chip.filter.domain);
                  if (chip.filter.category) setCategory(chip.filter.category);
                  if (chip.filter.severity) setSeverity(chip.filter.severity);
                  if (chip.filter.pillar) setPillar(chip.filter.pillar);
                  setPage(1);
                }}
                className="rounded-lg px-2.5 py-1 font-medium transition border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* 7 Core Security Domains Tab Strip */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.02] p-1.5 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
              {domains.map((d) => {
                const active = selectedDomain === d.id;
                const count = domainCounts[d.id] || 0;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDomain(d.id);
                      setCategory("all");
                      setPage(1);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center transition ${
                      active
                        ? "bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    <span className="text-base">{d.icon}</span>
                    <span className="text-xs font-semibold leading-tight line-clamp-1">{d.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        active
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 24 GCP Services Sub-Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {visibleCategories.map((cat) => {
              const active = category === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    setPage(1);
                  }}
                  className={`shrink-0 flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition border ${
                    active
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm"
                      : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  {cat.icon && <img src={cat.icon} alt="" className="h-4 w-4 shrink-0 rounded" />}
                  <span>{cat.name}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                      active
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                        : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 dark:border-white/10 py-3.5">
            <div className="flex flex-wrap items-center gap-3">
              {/* Pillar */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span>Pillar:</span>
                <select
                  value={pillar}
                  onChange={(e) => {
                    setPillar(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121826] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                >
                  {pillars.map((p) => (
                    <option key={p} value={p}>
                      {p === "all" ? "All Pillars" : p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Severity */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span>Severity:</span>
                <select
                  value={severity}
                  onChange={(e) => {
                    setSeverity(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121826] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                >
                  {severities.map((s) => (
                    <option key={s} value={s}>
                      {s === "all" ? "All Severities" : s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Compliance */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <span>Compliance:</span>
                <select
                  value={compliance}
                  onChange={(e) => {
                    setCompliance(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121826] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                >
                  {complianceStandards.map((c) => (
                    <option key={c} value={c}>
                      {c === "all" ? "All Frameworks" : c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Counter and Reset */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Showing <strong className="text-slate-900 dark:text-white">{filteredData.length}</strong> of {data.length} patterns
              </span>
              {isFiltered && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedDomain("all");
                    setCategory("all");
                    setPillar("all");
                    setSeverity("all");
                    setCompliance("all");
                    setPage(1);
                  }}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content State: Loading, Empty, or Cards Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-16 text-slate-500 dark:text-slate-400">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
              <p className="font-medium text-sm">Loading 1,000+ GCP Architecture Best Practices...</p>
            </div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-12 text-center">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No architecture patterns matched your filter criteria.</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try adjusting your search terms or clearing domain and severity filters.</p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedDomain("all");
                setCategory("all");
                setPillar("all");
                setSeverity("all");
                setCompliance("all");
                setPage(1);
              }}
              className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {paginatedData.map((item) => {
                const activeTab = activeTabs[item.id] || "diagram";
                const sev = getSeverityBadge(item.severity);

                return (
                  <div
                    key={item.id}
                  data-architecture-card
                    className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="p-5 border-b border-slate-100 dark:border-white/[0.06]">
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {item.id}
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${sev.pill}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
                            {item.severity}
                          </span>
                          <span className="rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium">
                            {item.pillar}
                          </span>
                        </div>

                        {/* Modal Zoom Button */}
                        <button
                          onClick={() => setModalItem(item)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
                          title="Expand into full-screen dialog"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">{item.developer_guide ? item.developer_guide.name : item.title}</h3>
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{item.reference ? item.description : item.title}</p>

                      <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        {item.icon_url && <img src={item.icon_url} alt="" className="h-4 w-4 rounded" />}
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.service}</span>
                        <span>•</span>
                        <span className="truncate">{item.category_name}</span>
                      </div>
                    </div>

                    {/* Description Box */}
                    <div className="px-5 py-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-b border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01]">
                      {item.description}
                    </div>

                    {/* View Tabs Bar */}
                    <div className="architecture-card-tabs flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] px-4 py-1.5 text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setActiveTabs((prev) => ({ ...prev, [item.id]: "diagram" }))}
                          className={`rounded-md px-2.5 py-1 font-semibold transition ${
                            activeTab === "diagram"
                              ? "bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <Network size={14} /> Architecture
                        </button>
                        <button
                          onClick={() => setActiveTabs((prev) => ({ ...prev, [item.id]: "opa" }))}
                          className={`rounded-md px-2.5 py-1 font-semibold transition ${
                            activeTab === "opa"
                              ? "bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <ShieldCheck size={14} /> Policy
                        </button>
                        <button
                          onClick={() => setActiveTabs((prev) => ({ ...prev, [item.id]: "tf" }))}
                          className={`rounded-md px-2.5 py-1 font-semibold transition ${
                            activeTab === "tf"
                              ? "bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <Braces size={14} /> Terraform
                        </button>
                        <button
                          onClick={() => setActiveTabs((prev) => ({ ...prev, [item.id]: "compliance" }))}
                          className={`rounded-md px-2.5 py-1 font-semibold transition ${
                            activeTab === "compliance"
                              ? "bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <BookOpen size={14} /> Context
                        </button>
                      </div>

                      {/* Quick Actions on Card */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInStack(item.id)) {
                              removeFromStack(item.id);
                            } else {
                              addToStack(item);
                            }
                          }}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                            isInStack(item.id)
                              ? "bg-purple-600 text-white"
                              : "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20"
                          }`}
                          title={isInStack(item.id) ? "Remove from IaC Stack" : "Add to IaC Stack"}
                        >
                          {isInStack(item.id) ? "✓ Stack" : "+ Stack"}
                        </button>
                        {activeTab === "diagram" && (
                          <button
                            onClick={() => downloadSvg(item.svg, item.id)}
                            className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                            title="Download Vector SVG"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            SVG
                          </button>
                        )}
                        {activeTab === "opa" && (
                          <button
                            onClick={() => copyToClipboard(item.opa_policy, `opa-${item.id}`)}
                            className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            {copiedId === `opa-${item.id}` ? "✓ Copied!" : "Copy Rego"}
                          </button>
                        )}
                        {activeTab === "tf" && (
                          <button
                            onClick={() => copyToClipboard(item.terraform, `tf-${item.id}`)}
                            className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            {copiedId === `tf-${item.id}` ? "✓ Copied!" : "Copy IaC"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Tab Content Body */}
                    <div className="p-4 bg-slate-950 flex-1 flex flex-col justify-center min-h-[260px] overflow-x-auto text-slate-100">
                      {activeTab === "diagram" && (
                        <DiagramViewer svg={item.svg} title={item.title} filename={item.id} reference={item.reference} details={item.diagram_details} architecture={item} />
                      )}

                      {activeTab === "opa" && (
                        <div className="relative w-full">
                          <pre
                            className="font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto max-h-[320px] p-2"
                            dangerouslySetInnerHTML={{ __html: highlightCode(item.opa_policy, "rego") }}
                          />
                        </div>
                      )}

                      {activeTab === "tf" && (
                        <div className="relative w-full">
                          <pre
                            className="font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto max-h-[320px] p-2"
                            dangerouslySetInnerHTML={{ __html: highlightCode(item.terraform, "tf") }}
                          />
                        </div>
                      )}

                      {activeTab === "compliance" && (
                        <div className="space-y-3 p-2 text-xs">
                          <div>
                            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1.5">Mapped Security Standards</span>
                            <div className="flex flex-wrap gap-1.5">
                              {(item.compliance || []).map((c, i) => (
                                <span key={i} className="rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-1 font-mono text-[11px]">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/10">
                            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">Remediation Workflow</span>
                            <p className="text-slate-300 font-mono text-[11px] bg-white/[0.03] p-2 rounded-lg border border-white/5">
                              {item.remediation}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Page <strong className="text-slate-900 dark:text-white">{page}</strong> of {totalPages}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page <= 1}
                    onClick={() => {
                      setPage((p) => Math.max(1, p - 1));
                      document.getElementById("architecture-catalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-medium ${
                      page <= 1
                        ? "opacity-40 cursor-not-allowed text-slate-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pNum;
                    if (totalPages <= 5) pNum = i + 1;
                    else if (page <= 3) pNum = i + 1;
                    else if (page >= totalPages - 2) pNum = totalPages - 4 + i;
                    else pNum = page - 2 + i;

                    const active = pNum === page;
                    return (
                      <button
                        key={pNum}
                        onClick={() => {
                          setPage(pNum);
                          document.getElementById("architecture-catalog")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${
                          active
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage((p) => Math.min(totalPages, p + 1));
                      document.getElementById("architecture-catalog")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-medium ${
                      page >= totalPages
                        ? "opacity-40 cursor-not-allowed text-slate-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Full-Screen Modal Dialog */}
      {modalItem && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalItem(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c121e] shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10">
                    {modalItem.id}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getSeverityBadge(modalItem.severity).pill}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${getSeverityBadge(modalItem.severity).dot}`} />
                    {modalItem.severity}
                  </span>
                  <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium">
                    {modalItem.pillar}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {modalItem.title}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {modalItem.icon_url && <img src={modalItem.icon_url} alt="" className="h-4 w-4 rounded" />}
                  <strong className="text-slate-700 dark:text-slate-300">{modalItem.service}</strong>
                  <span>•</span>
                  <span>{modalItem.category_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isInStack(modalItem.id)) {
                      removeFromStack(modalItem.id);
                    } else {
                      addToStack(modalItem);
                    }
                  }}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                    isInStack(modalItem.id)
                      ? "bg-purple-600 text-white"
                      : "bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30"
                  }`}
                >
                  {isInStack(modalItem.id) ? "✓ In Stack" : "+ Add to Stack"}
                </button>
                <button
                  onClick={() => setModalItem(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Description */}
            <div className="px-6 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {modalItem.description}
            </div>

            {/* Modal Body with Architecture Diagram */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-950 text-slate-100 flex flex-col justify-center items-center min-h-[380px]">
              <DiagramViewer svg={modalItem.svg} title={modalItem.title} filename={modalItem.id} reference={modalItem.reference} details={modalItem.diagram_details} architecture={modalItem} />
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0f19] flex items-center justify-between">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {modalItem.compliance?.[0]}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadSvg(modalItem.svg, modalItem.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download SVG
                </button>
                <button
                  onClick={() => copyToClipboard(modalItem.opa_policy, `modal-opa-${modalItem.id}`)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  {copiedId === `modal-opa-${modalItem.id}` ? "✓ Copied Rego!" : "Copy OPA Rego"}
                </button>
                <button
                  onClick={() => copyToClipboard(modalItem.terraform, `modal-tf-${modalItem.id}`)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  {copiedId === `modal-tf-${modalItem.id}` ? "✓ Copied IaC!" : "Copy Terraform"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
