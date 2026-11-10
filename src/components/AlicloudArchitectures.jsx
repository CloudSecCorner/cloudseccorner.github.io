import ArchitectureHeader from "./ArchitectureHeader";
import { Network, ShieldCheck, Braces, FileCode, BookOpen } from "lucide-react";
import referenceArchitectures from "../data/reference-architectures.json";
import DiagramViewer from "./DiagramViewer";
import React, { useEffect, useState, useMemo } from "react";
import OpenGraph from "./OpenGraph";
import { useStackBuilder } from "../context/StackBuilderContext";

export default function AlicloudArchitectures() {
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
    fetch("/data/alicloud-best-practices.json")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((items) => {
        setData([...(referenceArchitectures.alicloud || []), ...items]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Alibaba Cloud architectures:", err);
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
    { id: "compute-instances", name: "Compute & Serverless", icon: "⚡", categoryIds: ["alicloud-ecs", "alicloud-ack", "alicloud-fc", "alicloud-pai"] },
    { id: "storage-databases", name: "Storage & Databases", icon: "🗄️", categoryIds: ["alicloud-oss", "alicloud-nas", "alicloud-rds", "alicloud-redis", "alicloud-mongodb"] },
    { id: "network-perimeter", name: "Network & Perimeter", icon: "🌐", categoryIds: ["alicloud-vpc", "alicloud-security-group", "alicloud-slb", "alicloud-dns", "alicloud-waf", "alicloud-ddos"] },
    { id: "security-keys-compliance", name: "Security, RAM & KMS", icon: "🔒", categoryIds: ["alicloud-ram", "alicloud-kms", "alicloud-security-center", "alicloud-hbr", "alicloud-governance"] },
    { id: "telemetry-streaming", name: "Telemetry & Streaming", icon: "📊", categoryIds: ["alicloud-actiontrail", "alicloud-cms", "alicloud-kafka", "alicloud-cr"] }
  ];

  const categories = [
    { id: "all", name: "All 24 Domains", icon: null, domain: "all" },
    { id: "alicloud-oss", name: "OSS Object Storage", icon: "/images/alicloud-icons/alicloud-oss.svg", domain: "storage-databases" },
    { id: "alicloud-ram", name: "RAM & Roles", icon: "/images/alicloud-icons/alicloud-ram.svg", domain: "security-keys-compliance" },
    { id: "alicloud-vpc", name: "VPC & Subnets", icon: "/images/alicloud-icons/alicloud-vpc.svg", domain: "network-perimeter" },
    { id: "alicloud-ecs", name: "ECS Compute", icon: "/images/alicloud-icons/alicloud-ecs.svg", domain: "compute-instances" },
    { id: "alicloud-rds", name: "ApsaraDB RDS", icon: "/images/alicloud-icons/alicloud-rds.svg", domain: "storage-databases" },
    { id: "alicloud-ack", name: "ACK Kubernetes", icon: "/images/alicloud-icons/alicloud-ack.svg", domain: "compute-instances" },
    { id: "alicloud-security-group", name: "Security Groups", icon: "/images/alicloud-icons/alicloud-security-group.svg", domain: "network-perimeter" },
    { id: "alicloud-slb", name: "SLB / ALB Load Balancer", icon: "/images/alicloud-icons/alicloud-slb.svg", domain: "network-perimeter" },
    { id: "alicloud-dns", name: "DNS & PrivateZone", icon: "/images/alicloud-icons/alicloud-dns.svg", domain: "network-perimeter" },
    { id: "alicloud-hbr", name: "HBR Backup & DR", icon: "/images/alicloud-icons/alicloud-hbr.svg", domain: "security-keys-compliance" },
    { id: "alicloud-actiontrail", name: "ActionTrail Auditing", icon: "/images/alicloud-icons/alicloud-actiontrail.svg", domain: "telemetry-streaming" },
    { id: "alicloud-cms", name: "CloudMonitor Alarms", icon: "/images/alicloud-icons/alicloud-cms.svg", domain: "telemetry-streaming" },
    { id: "alicloud-security-center", name: "Cloud Security Center", icon: "/images/alicloud-icons/alicloud-security-center.svg", domain: "security-keys-compliance" },
    { id: "alicloud-kms", name: "KMS & Secret Manager", icon: "/images/alicloud-icons/alicloud-kms.svg", domain: "security-keys-compliance" },
    { id: "alicloud-nas", name: "File Storage (NAS)", icon: "/images/alicloud-icons/alicloud-nas.svg", domain: "storage-databases" },
    { id: "alicloud-cr", name: "Container Registry (ACR)", icon: "/images/alicloud-icons/alicloud-cr.svg", domain: "telemetry-streaming" },
    { id: "alicloud-fc", name: "Function Compute (FC)", icon: "/images/alicloud-icons/alicloud-fc.svg", domain: "compute-instances" },
    { id: "alicloud-redis", name: "ApsaraDB for Redis", icon: "/images/alicloud-icons/alicloud-redis.svg", domain: "storage-databases" },
    { id: "alicloud-kafka", name: "Message Queue Kafka", icon: "/images/alicloud-icons/alicloud-kafka.svg", domain: "telemetry-streaming" },
    { id: "alicloud-mongodb", name: "ApsaraDB for MongoDB", icon: "/images/alicloud-icons/alicloud-mongodb.svg", domain: "storage-databases" },
    { id: "alicloud-waf", name: "WAF 3.0 Defense", icon: "/images/alicloud-icons/alicloud-waf.svg", domain: "network-perimeter" },
    { id: "alicloud-ddos", name: "Anti-DDoS Pro", icon: "/images/alicloud-icons/alicloud-ddos.svg", domain: "network-perimeter" },
    { id: "alicloud-pai", name: "Platform for AI (PAI)", icon: "/images/alicloud-icons/alicloud-pai.svg", domain: "compute-instances" },
    { id: "alicloud-governance", name: "Resource Directory", icon: "/images/alicloud-icons/alicloud-governance.svg", domain: "security-keys-compliance" }
  ];

  const pillars = ["all", "Security", "Reliability", "Operational Excellence", "Cost Optimization", "Performance Efficiency"];
  const severities = ["all", "Critical", "High", "Medium", "Low"];
  const complianceStandards = ["all", "CIS Alibaba Cloud", "NIST", "PCI-DSS", "SOC 2", "ISO 27001", "FedRAMP"];

  const quickChips = [
    { label: "⚡ Critical Only", filter: { severity: "Critical" } },
    { label: "🛡️ Security Pillar", filter: { pillar: "Security" } },
    { label: "🌐 VPC 2.0 Enclave", filter: { category: "alicloud-vpc", domain: "network-perimeter" } },
    { label: "☸️ VKE Hardening", filter: { category: "alicloud-kubernetes", domain: "compute-instances" } },
    { label: "🗄️ Object Storage", filter: { category: "alicloud-storage", domain: "storage-databases" } },
    { label: "🛡️ Firewall Groups", filter: { category: "alicloud-firewall", domain: "network-perimeter" } },
    { label: "🔒 DDoS Shield", filter: { category: "alicloud-security", domain: "security-keys-compliance" } },
    { label: "🔑 API Keys & IAM", filter: { category: "alicloud-iam", domain: "security-keys-compliance" } }
  ];

  const visibleCategories = useMemo(() => {
    if (selectedDomain === "all") return categories;
    return [
      categories[0],
      ...categories.slice(1).filter((c) => c.domain === selectedDomain)
    ];
  }, [selectedDomain]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (selectedDomain !== "all") {
        const domainObj = domains.find((d) => d.id === selectedDomain);
        if (domainObj && !domainObj.categoryIds.includes(item.category)) return false;
      }
      if (category !== "all" && item.category !== category) return false;
      if (pillar !== "all" && item.pillar !== pillar) return false;
      if (severity !== "all" && item.severity !== severity) return false;
      if (compliance !== "all") {
        if (!item.compliance || !item.compliance.some((c) => c.toLowerCase().includes(compliance.toLowerCase()))) {
          return false;
        }
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        const inTitle = item.title?.toLowerCase().includes(q);
        const inDesc = item.description?.toLowerCase().includes(q);
        const inService = item.service?.toLowerCase().includes(q);
        const inId = item.id?.toLowerCase().includes(q);
        const inCompliance = item.compliance?.some((c) => c.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inService && !inId && !inCompliance) return false;
      }
      return true;
    });
  }, [data, selectedDomain, category, pillar, severity, compliance, query]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const categoryCounts = useMemo(() => {
    const counts = { all: data.length };
    for (const item of data) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [data]);

  const getActiveTab = (itemId) => activeTabs[itemId] || "diagram";
  const setActiveTab = (itemId, tab) => {
    setActiveTabs((prev) => ({ ...prev, [itemId]: tab }));
  };

  const applyChipFilter = (filter) => {
    if (filter.domain) setSelectedDomain(filter.domain);
    if (filter.category) setCategory(filter.category);
    if (filter.pillar) setPillar(filter.pillar);
    if (filter.severity) setSeverity(filter.severity);
    setPage(1);
  };

  const resetAllFilters = () => {
    setQuery("");
    setSelectedDomain("all");
    setCategory("all");
    setPillar("all");
    setSeverity("all");
    setCompliance("all");
    setPage(1);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const downloadSvgFile = (svgStr, filename) => {
    try {
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename || "alicloud-architecture"}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  function highlightCode(code, lang) {
    if (!code) return "";
    let out = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const tokens = [];

    out = out.replace(/(#[^\n]*)/g, (match) => {
      const id = `___TOK${tokens.length}___`;
      tokens.push(`<span class="text-slate-500 italic">${match}</span>`);
      return id;
    });

    out = out.replace(/(".*?"|'.*?')/g, (match) => {
      const id = `___TOK${tokens.length}___`;
      tokens.push(`<span class="text-emerald-400 font-medium">${match}</span>`);
      return id;
    });

    if (lang === "rego") {
      out = out.replace(/\b(package|default|import|not|some|in|every|if|else)\b/g, '<span class="text-cyan-400 font-bold">$1</span>');
      out = out.replace(/\b(allow|deny|msg)\b/g, '<span class="text-rose-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(input|data)\b/g, '<span class="text-blue-300 font-semibold">$1</span>');
    } else if (lang === "tf") {
      out = out.replace(/\b(resource|data|variable|output|locals|provider|terraform|module|lifecycle|prevent_destroy)\b/g, '<span class="text-cyan-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(var|local|each|count)\b/g, '<span class="text-blue-300 font-semibold">$1</span>');
      out = out.replace(/([a-zA-Z_][a-zA-Z0-9_-]*)\s*=/g, '<span class="text-sky-300 font-medium">$1</span> =');
    }

    tokens.forEach((t, i) => {
      out = out.replace(`___TOK${i}___`, t);
    });

    return out;
  }

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case "Critical":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-300 border-rose-500/30";
      case "High":
        return "bg-orange-500/15 text-orange-600 dark:text-orange-300 border-orange-500/30";
      case "Medium":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30";
      case "Low":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30";
      default:
        return "bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d0914] text-slate-900 dark:text-slate-100 transition-colors">
      <OpenGraph
        title="1,000+ Alibaba Cloud Architecture Best Practices | Cloud Security Corner"
        description="Comprehensive collection of 1,000+ Alibaba Cloud cloud architectures with Obsidian Pele vector diagrams, OPA Rego policies, and Terraform modules."
      />

      <ArchitectureHeader
        provider="Alibaba Cloud"
        count={data.length}
        services={new Set(data.map((item) => item.category)).size}
        references={(referenceArchitectures.alicloud || []).length}
      />

      <section id="architecture-catalog" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="space-y-6 mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search services, VPC 2.0, bare metal, firewall groups, or policies..."
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-5 py-4 pl-12 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-sm transition"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
              Quick Filters:
            </span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => applyChipFilter(chip.filter)}
                className="rounded-full px-3 py-1 text-xs font-medium border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-white/[0.06] transition shadow-sm"
              >
                {chip.label}
              </button>
            ))}
            {(query || selectedDomain !== "all" || category !== "all" || pillar !== "all" || severity !== "all" || compliance !== "all") && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 ml-auto underline transition"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {domains.map((dom) => {
                const active = selectedDomain === dom.id;
                return (
                  <button
                    key={dom.id}
                    onClick={() => {
                      setSelectedDomain(dom.id);
                      setCategory("all");
                      setPage(1);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition border ${
                      active
                        ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/25"
                        : "bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <span>{dom.icon}</span>
                    <span>{dom.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-white/[0.06]">
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
                    className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition border ${
                      active
                        ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30"
                        : "bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    {cat.icon && <img src={cat.icon} alt="" className="h-4 w-4 shrink-0 object-contain" />}
                    <span>{cat.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                        active ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-3 border-t border-slate-200 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Pillar:</span>
              <div className="flex flex-wrap gap-1">
                {pillars.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPillar(p);
                      setPage(1);
                    }}
                    className={`rounded-lg px-2.5 py-1 capitalize transition ${
                      pillar === p
                        ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-500/40 font-semibold"
                        : "bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Severity:</span>
              <div className="flex flex-wrap gap-1">
                {severities.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSeverity(s);
                      setPage(1);
                    }}
                    className={`rounded-lg px-2.5 py-1 capitalize transition ${
                      severity === s
                        ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-500/40 font-semibold"
                        : "bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Standard:</span>
              <div className="flex flex-wrap gap-1">
                {complianceStandards.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCompliance(c);
                      setPage(1);
                    }}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      compliance === c
                        ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-500/40 font-semibold"
                        : "bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> architecture blueprints
            {category !== "all" && ` in ${category}`}
          </span>
          <span>
            Page <strong className="text-slate-900 dark:text-white">{page}</strong> of{" "}
            <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mb-3" />
            <p className="font-medium text-sm">Loading 1,000+ Alibaba Cloud Architecture Best Practices…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-16 text-center">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">No architecture patterns matched your criteria</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Try adjusting your search query or relaxing your filters.</p>
            <button onClick={resetAllFilters} className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {paginated.map((item) => {
              const activeTab = getActiveTab(item.id);
              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#120d1c] shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-200 overflow-hidden"
                >
                  <div className="p-5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 p-1.5 shrink-0 shadow-sm flex items-center justify-center">
                          <img src={item.icon_url} alt="" className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{item.id}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.service}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1 group-hover:text-blue-500 transition">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getSeverityBadgeClass(item.severity)}`}>
                        {item.severity}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                        {item.pillar}
                      </span>
                      {item.compliance && item.compliance.slice(0, 2).map((comp, cIdx) => (
                        <span key={cIdx} className="rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 text-[10px] font-medium">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] px-4 bg-slate-50/80 dark:bg-white/[0.01]">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveTab(item.id, "diagram")}
                        className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                          activeTab === "diagram"
                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Network className="h-3.5 w-3.5" />
                        <span>Integration View</span>
                      </button>
                      <button
                        onClick={() => setActiveTab(item.id, "deployment")}
                        className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                          activeTab === "deployment"
                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Deployment View</span>
                      </button>
                      <button
                        onClick={() => setActiveTab(item.id, "rego")}
                        className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                          activeTab === "rego"
                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Braces className="h-3.5 w-3.5" />
                        <span>OPA Rego</span>
                      </button>
                      <button
                        onClick={() => setActiveTab(item.id, "terraform")}
                        className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                          activeTab === "terraform"
                            ? "border-blue-500 text-blue-600 dark:text-blue-400"
                            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <FileCode className="h-3.5 w-3.5" />
                        <span>Terraform IaC</span>
                      </button>
                      {item.developer_guide && (
                        <button
                          onClick={() => setActiveTab(item.id, "guide")}
                          className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition ${
                            activeTab === "guide"
                              ? "border-blue-500 text-blue-600 dark:text-blue-400"
                              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Integration Guide</span>
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setModalItem(item)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Expand</span> ⤢
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    {activeTab === "diagram" ? (
                      <div
                        className="blueprint-canvas relative flex items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0713] min-h-[260px] overflow-hidden"
                        style={{
                          backgroundImage: "radial-gradient(rgba(0, 123, 252, 0.15) 1px, transparent 0)",
                          backgroundSize: "20px 20px"
                        }}
                      >
                        <DiagramViewer
                          svg={item.svg}
                          title={item.title}
                          filename={item.id}
                          reference={item.reference}
                          details={item.diagram_details}
                          architecture={item}
                        />
                      </div>
                    ) : activeTab === "deployment" ? (
                      <div
                        className="blueprint-canvas relative flex items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0713] min-h-[260px] overflow-hidden"
                        style={{
                          backgroundImage: "radial-gradient(rgba(14, 165, 233, 0.15) 1px, transparent 0)",
                          backgroundSize: "20px 20px"
                        }}
                      >
                        <DiagramViewer
                          svg={item.deployment_svg || item.svg}
                          title={item.title + " (Deployment)"}
                          filename={item.id + "-deployment"}
                          reference={item.reference}
                          details={item.diagram_details}
                          architecture={item}
                        />
                      </div>
                    ) : activeTab === "rego" ? (
                      <div className="relative rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#080511] p-4 text-xs font-mono text-slate-200 overflow-x-auto min-h-[260px]">
                        <button
                          onClick={() => copyToClipboard(item.opa_policy, item.id + "-rego")}
                          className="absolute right-3 top-3 px-2 py-1 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                        >
                          {copiedId === item.id + "-rego" ? "✓ Copied" : "Copy Rego"}
                        </button>
                        <pre dangerouslySetInnerHTML={{ __html: highlightCode(item.opa_policy, "rego") }} />
                      </div>
                    ) : activeTab === "terraform" ? (
                      <div className="relative rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#080511] p-4 text-xs font-mono text-slate-200 overflow-x-auto min-h-[260px]">
                        <button
                          onClick={() => copyToClipboard(item.terraform, item.id + "-tf")}
                          className="absolute right-3 top-3 px-2 py-1 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                        >
                          {copiedId === item.id + "-tf" ? "✓ Copied" : "Copy HCL"}
                        </button>
                        <pre dangerouslySetInnerHTML={{ __html: highlightCode(item.terraform, "tf") }} />
                      </div>
                    ) : activeTab === "guide" && item.developer_guide ? (
                      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#080511] p-4 text-xs text-slate-700 dark:text-slate-300 min-h-[260px] overflow-y-auto space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                          <span className="font-bold text-blue-600 dark:text-blue-400">{item.developer_guide.name}</span>
                          <span className="font-mono text-[11px] text-slate-500">{item.developer_guide.family}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic">{item.developer_guide.contract}</p>
                        <div>
                          <strong className="block text-[11px] uppercase tracking-wider text-slate-500 mb-1">Implementation Steps</strong>
                          <ol className="list-decimal list-inside space-y-1">
                            {item.developer_guide.steps.map((st, i) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <strong className="block text-[11px] uppercase tracking-wider text-slate-500 mb-1">Integration Tests</strong>
                          <ul className="list-disc list-inside space-y-1">
                            {item.developer_guide.tests.map((tt, i) => (
                              <li key={i}>{tt}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Rule: {item.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isInStack(item.id)) {
                              removeFromStack(item.id);
                            } else {
                              addToStack(item);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                            isInStack(item.id)
                              ? "bg-purple-600 text-white"
                              : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-purple-600 hover:text-white"
                          }`}
                        >
                          {isInStack(item.id) ? "✓ Stack" : "+ Stack"}
                        </button>
                        <button
                          onClick={() => downloadSvgFile(item.svg, item.id)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
                          title="Download SVG"
                        >
                          <span>SVG</span> ⭳
                        </button>
                        <button
                          onClick={() => setModalItem(item)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm"
                        >
                          Details &amp; Code
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500 px-3">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-semibold disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/10 transition"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex flex-col max-h-[90vh] w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-white/20 bg-white dark:bg-[#120d1c] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 p-5 bg-slate-50 dark:bg-[#0a0714]">
              <div className="flex items-center gap-3">
                <img src={modalItem.icon_url} alt="" className="h-8 w-8 object-contain" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{modalItem.id}</span>
                    <span className="text-slate-400 dark:text-slate-600">•</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{modalItem.service}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{modalItem.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div
                className="blueprint-canvas relative flex items-center justify-center p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#090613]"
                style={{
                  backgroundImage: "radial-gradient(rgba(0, 123, 252, 0.18) 1px, transparent 0)",
                  backgroundSize: "24px 24px"
                }}
              >
                <DiagramViewer svg={modalItem.svg} title={modalItem.title} filename={modalItem.id} reference={modalItem.reference} details={modalItem.diagram_details} architecture={modalItem} />
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Architecture Defense Pattern</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{modalItem.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#07040e] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-400 font-mono">Open Policy Agent (OPA Rego)</span>
                    <button
                      onClick={() => copyToClipboard(modalItem.opa_policy, "modal-opa")}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                    >
                      {copiedId === "modal-opa" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <pre
                    className="text-xs font-mono text-slate-200 overflow-x-auto max-h-[220px]"
                    dangerouslySetInnerHTML={{ __html: highlightCode(modalItem.opa_policy, "rego") }}
                  />
                </div>

                <div className="rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#07040e] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 font-mono">Terraform IaC Baseline</span>
                    <button
                      onClick={() => copyToClipboard(modalItem.terraform, "modal-tf")}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                    >
                      {copiedId === "modal-tf" ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <pre
                    className="text-xs font-mono text-slate-200 overflow-x-auto max-h-[220px]"
                    dangerouslySetInnerHTML={{ __html: highlightCode(modalItem.terraform, "tf") }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 p-4 bg-slate-50 dark:bg-[#0a0614]">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Pillar: <strong className="text-slate-900 dark:text-white">{modalItem.pillar}</strong> • Severity:{" "}
                <strong className="text-rose-600 dark:text-rose-400">{modalItem.severity}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isInStack(modalItem.id)) {
                      removeFromStack(modalItem.id);
                    } else {
                      addToStack(modalItem);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isInStack(modalItem.id)
                      ? "bg-purple-600 text-white"
                      : "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30"
                  }`}
                >
                  {isInStack(modalItem.id) ? "✓ In Stack" : "+ Add to Stack"}
                </button>
                <button
                  onClick={() => downloadSvgFile(modalItem.svg, modalItem.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition flex items-center gap-1.5"
                >
                  <span>Download Vector SVG</span> ⭳
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
