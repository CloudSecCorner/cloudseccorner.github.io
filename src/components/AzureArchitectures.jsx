import React, { useEffect, useState } from "react";
import OpenGraph from "./OpenGraph";

export default function AzureArchitectures() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [pillar, setPillar] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [page, setPage] = useState(1);
  const [activeTabs, setActiveTabs] = useState({});
  const [modalItem, setModalItem] = useState(null);
  const pageSize = 12;

  useEffect(() => {
    fetch("/data/azure-best-practices.json")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((items) => {
        setData(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Azure architectures:", err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: "all", name: "All Azure Domains", icon: null },
    { id: "azure-blob", name: "Blob Storage & Data Lake", icon: "/images/azure-icons/azure-blob.svg" },
    { id: "azure-ad", name: "Microsoft Entra ID & PIM", icon: "/images/azure-icons/azure-ad.svg" },
    { id: "azure-vnet", name: "Virtual Network & Hub-Spoke", icon: "/images/azure-icons/azure-vnet.svg" },
    { id: "azure-vm", name: "Virtual Machines & Compute", icon: "/images/azure-icons/azure-vm.svg" },
    { id: "azure-sql", name: "Azure SQL & Managed DB", icon: "/images/azure-icons/azure-sql.svg" },
    { id: "azure-cosmosdb", name: "Cosmos DB NoSQL", icon: "/images/azure-icons/azure-cosmosdb.svg" },
    { id: "azure-aks", name: "AKS Kubernetes Defense", icon: "/images/azure-icons/azure-aks.svg" },
    { id: "azure-container-apps", name: "Container Apps & ACR", icon: "/images/azure-icons/azure-container-apps.svg" },
    { id: "azure-functions", name: "Functions Serverless", icon: "/images/azure-icons/azure-functions.svg" },
    { id: "azure-appgateway", name: "Application Gateway WAF", icon: "/images/azure-icons/azure-appgateway.svg" },
    { id: "azure-frontdoor", name: "Front Door Edge CDN", icon: "/images/azure-icons/azure-frontdoor.svg" },
    { id: "azure-firewall", name: "Azure Firewall Premium", icon: "/images/azure-icons/azure-firewall.svg" },
    { id: "azure-keyvault", name: "Key Vault & Managed HSM", icon: "/images/azure-icons/azure-keyvault.svg" },
    { id: "azure-activity-log", name: "Activity Logs & Diagnostics", icon: "/images/azure-icons/azure-activity-log.svg" },
    { id: "azure-monitor", name: "Azure Monitor & Metrics", icon: "/images/azure-icons/azure-monitor.svg" },
    { id: "azure-defender", name: "Defender for Cloud (CSPM)", icon: "/images/azure-icons/azure-defender.svg" },
    { id: "azure-sentinel", name: "Microsoft Sentinel SIEM", icon: "/images/azure-icons/azure-sentinel.svg" },
    { id: "azure-backup", name: "Azure Backup & Recovery", icon: "/images/azure-icons/azure-backup.svg" },
    { id: "azure-servicebus", name: "Service Bus Messaging", icon: "/images/azure-icons/azure-servicebus.svg" },
    { id: "azure-eventgrid", name: "Event Grid Topics", icon: "/images/azure-icons/azure-eventgrid.svg" },
    { id: "azure-openai", name: "Azure OpenAI & Cognitive", icon: "/images/azure-icons/azure-openai.svg" },
    { id: "azure-policy", name: "Azure Policy & Governance", icon: "/images/azure-icons/azure-policy.svg" },
    { id: "azure-dns", name: "Azure DNS & Private Zones", icon: "/images/azure-icons/azure-dns.svg" },
    { id: "azure-synapse", name: "Synapse & Databricks", icon: "/images/azure-icons/azure-synapse.svg" }
  ];

  const pillars = ["all", "Security", "Reliability", "Operational Excellence", "Cost Optimization", "Performance Efficiency"];
  const severities = ["all", "Critical", "High", "Medium", "Low"];

  const quickChips = [
    { label: "⚡ Critical Only", filter: { severity: "Critical" } },
    { label: "🛡️ Security Pillar", filter: { pillar: "Security" } },
    { label: "🔐 Key Vault & HSM", filter: { category: "azure-keyvault" } },
    { label: "🗄️ Blob Storage", filter: { category: "azure-blob" } },
    { label: "☸️ AKS Defense", filter: { category: "azure-aks" } },
    { label: "🌐 Hub-Spoke VNet", filter: { category: "azure-vnet" } },
    { label: "🛡️ Defender CSPM", filter: { category: "azure-defender" } },
    { label: "👁️ Sentinel SIEM", filter: { category: "azure-sentinel" } }
  ];

  const filtered = data.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (pillar !== "all" && item.pillar !== pillar) return false;
    if (severity !== "all" && item.severity !== severity) return false;
    if (query) {
      const q = query.toLowerCase();
      const match =
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.service.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.compliance && item.compliance.some((c) => c.toLowerCase().includes(q)));
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case "Critical":
        return { pill: "bg-rose-500/10 text-rose-300 border-rose-500/30", dot: "bg-rose-500 animate-pulse" };
      case "High":
        return { pill: "bg-amber-500/10 text-amber-300 border-amber-500/30", dot: "bg-amber-500" };
      case "Medium":
        return { pill: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30", dot: "bg-yellow-500" };
      default:
        return { pill: "bg-slate-500/10 text-slate-300 border-slate-500/30", dot: "bg-slate-400" };
    }
  };

  const getActiveTab = (itemId) => activeTabs[itemId] || "diagram";
  const setActiveTab = (itemId, tab) => {
    setActiveTabs((prev) => ({ ...prev, [itemId]: tab }));
  };

  const copyToClipboard = (text, btnId) => {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.getElementById(btnId);
      if (btn) {
        const orig = btn.innerText;
        btn.innerText = "✓ Copied!";
        setTimeout(() => {
          btn.innerText = orig;
        }, 2000);
      }
    });
  };

  const downloadSvg = (svgContent, id) => {
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}-azure-architecture.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Syntax highlighter for OPA Rego & Terraform
  const highlightCode = (code, type) => {
    if (!code) return "";
    let safe = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (type === "rego") {
      safe = safe
        .replace(/(#.*$)/gm, '<span class="text-slate-500 italic">$1</span>')
        .replace(/\b(package|default|allow|deny|import|input|data|not|else|some|in)\b/g, '<span class="text-cyan-400 font-bold">$1</span>')
        .replace(/(".*?")/g, '<span class="text-emerald-300">$1</span>')
        .replace(/(\b[a-zA-Z_][a-zA-Z0-9_]*\b)(?=\s*:=)/g, '<span class="text-purple-300 font-semibold">$1</span>');
    } else if (type === "tf") {
      safe = safe
        .replace(/(#.*$)/gm, '<span class="text-slate-500 italic">$1</span>')
        .replace(/\b(resource|data|variable|output|locals|module|terraform|lifecycle|prevent_destroy)\b/g, '<span class="text-cyan-400 font-bold">$1</span>')
        .replace(/(".*?")/g, '<span class="text-emerald-300">$1</span>')
        .replace(/([a-zA-Z_][a-zA-Z0-9_-]*)\s*=/g, '<span class="text-blue-300 font-medium">$1</span> =');
    }
    return safe;
  };

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100">
      <OpenGraph
        title="1,000+ Azure Architecture Best Practices | Obsidian Pele, OPA & Terraform"
        description="Explore 1,000+ Microsoft Azure defensive architecture blueprints rendered with Obsidian Pele, verified OPA Rego policies, and hardened Terraform IaC modules across 24 Azure domains."
        tags={["Azure Architecture", "Obsidian Pele", "Azure Best Practices", "OPA Rego", "Terraform", "CIS Azure Benchmark"]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0b1329] via-[#091022] to-[#080d18] py-16 px-4 sm:px-6 lg:px-10">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-indigo-500/15 blur-3xl rounded-full" />

        <div className="relative mx-auto max-w-7xl">
          <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-200 border border-blue-500/30 shadow-sm backdrop-blur-sm">
            <span className="flex items-center gap-1.5 text-blue-300">
              <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Powered by Obsidian Pele
            </span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1 text-emerald-300">
              <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Official Azure Service Icons
            </span>
            <span className="opacity-40">•</span>
            <span className="text-white font-mono">1,032 Verified Blueprints</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            1,000+ Azure Architecture Best Practices <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              with Pele, OPA &amp; Terraform
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Explore enterprise Microsoft Azure defensive architecture blueprints and CIS Azure Benchmark controls. Every blueprint features deep multi-tier vector SVG diagrams rendered with Obsidian Pele, paired with production Open Policy Agent (OPA Rego) guardrails and complete Terraform IaC templates.
          </p>

          {/* Stats Highlight Grid */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] shadow-sm border border-white/10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Topologies</span>
              </div>
              <strong className="block text-3xl font-extrabold text-white">1,032</strong>
              <span className="text-xs text-slate-400 mt-1 block">Vector Pele SVGs</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] shadow-sm border border-white/10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Azure Domains</span>
              </div>
              <strong className="block text-3xl font-extrabold text-white">24</strong>
              <span className="text-xs text-slate-400 mt-1 block">Official Service Icons</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] shadow-sm border border-white/10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Guardrails</span>
              </div>
              <strong className="block text-3xl font-extrabold text-white">1,032</strong>
              <span className="text-xs text-slate-400 mt-1 block">OPA Rego Policies</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] shadow-sm border border-white/10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Infrastructure</span>
              </div>
              <strong className="block text-3xl font-extrabold text-white">1,032</strong>
              <span className="text-xs text-slate-400 mt-1 block">Terraform Modules</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Explorer Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {/* Search & Quick Chips Bar */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Azure service, security title, OPA rule, CIS benchmark, or framework..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3.5 pl-11 text-sm text-white placeholder-slate-400 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg className="absolute left-4 top-4 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
                className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-400 mr-1">Quick Filters:</span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (chip.filter.severity) setSeverity(chip.filter.severity);
                  if (chip.filter.pillar) setPillar(chip.filter.pillar);
                  if (chip.filter.category) setCategory(chip.filter.category);
                  setPage(1);
                }}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-200 transition"
              >
                {chip.label}
              </button>
            ))}
            {(category !== "all" || pillar !== "all" || severity !== "all" || query) && (
              <button
                onClick={() => {
                  setCategory("all");
                  setPillar("all");
                  setSeverity("all");
                  setQuery("");
                  setPage(1);
                }}
                className="ml-auto text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Domain Filter Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Filter by Azure Domain (24 Domains)</h2>
            <span className="text-xs text-slate-400">Showing {filtered.length} matching architectures</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition border ${
                    active
                      ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20"
                      : "bg-white/[0.03] text-slate-300 border-white/10 hover:border-blue-500/30 hover:bg-white/[0.06]"
                  }`}
                >
                  {cat.icon && <img src={cat.icon} alt="" className="h-4 w-4 shrink-0" />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pillar & Severity Selectors */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Pillar:</span>
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
                      ? "bg-blue-500/20 text-blue-200 border border-blue-500/40"
                      : "bg-white/[0.03] text-slate-400 border border-transparent hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="font-semibold text-slate-400">Severity:</span>
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
                      ? "bg-rose-500/20 text-rose-200 border border-rose-500/40"
                      : "bg-white/[0.03] text-slate-400 border border-transparent hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-400">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="mt-4 font-medium">Loading 1,000+ Azure Architecture Best Practices with Obsidian Pele…</p>
          </div>
        )}

        {/* No Results */}
        {!loading && filtered.length === 0 && (
          <div className="p-16 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white mb-2">No Azure architectures match your filter</h3>
            <p className="text-sm text-slate-400 mb-4">Try clearing your search query or selecting "All Azure Domains".</p>
            <button
              onClick={() => {
                setCategory("all");
                setPillar("all");
                setSeverity("all");
                setQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Architecture Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {currentItems.map((item) => {
              const activeTab = getActiveTab(item.id);
              const sevBadge = getSeverityBadge(item.severity);

              return (
                <div
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg hover:border-blue-500/30 transition-all overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-white/10 bg-white/[0.01]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <img src={item.icon_url} alt="" className="h-5 w-5 shrink-0" />
                        <span className="font-mono text-xs font-bold text-blue-300">{item.id}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-400">{item.category_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sevBadge.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sevBadge.dot}`} />
                          {item.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.05] text-slate-300">
                          {item.pillar}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-300 leading-relaxed line-clamp-2">{item.description}</p>
                  </div>

                  {/* Segmented Tabs Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#060a14] px-4 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveTab(item.id, "diagram")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === "diagram" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        📐 Architecture Diagram
                      </button>
                      <button
                        onClick={() => setActiveTab(item.id, "opa")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === "opa" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        🛡️ OPA Rego
                      </button>
                      <button
                        onClick={() => setActiveTab(item.id, "tf")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === "tf" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        🏗️ Terraform IaC
                      </button>
                      <button
                        onClick={() => setActiveTab(item.id, "compliance")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === "compliance" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        📋 Compliance
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadSvg(item.svg, item.id)}
                        className="text-[11px] font-medium text-slate-400 hover:text-blue-300 flex items-center gap-1"
                        title="Download Vector SVG"
                      >
                        <span>Download SVG</span> ⭳
                      </button>
                      <button
                        onClick={() => setModalItem(item)}
                        className="text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1"
                        title="Expand Fullscreen"
                      >
                        ⛶
                      </button>
                    </div>
                  </div>

                  {/* Card Tab Content */}
                  <div className="flex-1 p-4 bg-[#050811]">
                    {activeTab === "diagram" && (
                      <div
                        className="blueprint-canvas relative flex items-center justify-center p-4 rounded-xl border border-white/5 bg-[#090e1c] overflow-x-auto min-h-[220px]"
                        style={{
                          backgroundImage: "radial-gradient(rgba(59, 130, 246, 0.12) 1px, transparent 0)",
                          backgroundSize: "20px 20px"
                        }}
                      >
                        <div
                          className="w-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto"
                          dangerouslySetInnerHTML={{ __html: item.svg }}
                        />
                      </div>
                    )}

                    {activeTab === "opa" && (
                      <div className="relative rounded-xl border border-white/10 bg-[#090d1a] p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[240px]">
                        <button
                          id={`copy-opa-${item.id}`}
                          onClick={() => copyToClipboard(item.opa_policy, `copy-opa-${item.id}`)}
                          className="absolute right-3 top-3 px-2 py-1 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200"
                        >
                          Copy Rego
                        </button>
                        <pre dangerouslySetInnerHTML={{ __html: highlightCode(item.opa_policy, "rego") }} />
                      </div>
                    )}

                    {activeTab === "tf" && (
                      <div className="relative rounded-xl border border-white/10 bg-[#090d1a] p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[240px]">
                        <button
                          id={`copy-tf-${item.id}`}
                          onClick={() => copyToClipboard(item.terraform, `copy-tf-${item.id}`)}
                          className="absolute right-3 top-3 px-2 py-1 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200"
                        >
                          Copy Terraform
                        </button>
                        <pre dangerouslySetInnerHTML={{ __html: highlightCode(item.terraform, "tf") }} />
                      </div>
                    )}

                    {activeTab === "compliance" && (
                      <div className="rounded-xl border border-white/10 bg-[#090d1a] p-4 text-xs space-y-3">
                        <div>
                          <span className="font-semibold text-slate-400 block mb-1">Mapped Compliance Frameworks:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.compliance &&
                              item.compliance.map((c, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px]">
                                  {c}
                                </span>
                              ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-400 block mb-1">Architecture Remediation:</span>
                          <p className="text-slate-300 leading-relaxed">{item.remediation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs">
            <span className="text-slate-400">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} architectures
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-medium text-slate-300 disabled:opacity-40 hover:bg-white/10"
              >
                ← Previous
              </button>

              <span className="px-2 font-mono text-white">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-medium text-slate-300 disabled:opacity-40 hover:bg-white/10"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Fullscreen Modal View */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setModalItem(null)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-white/20 bg-[#0c1222] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 bg-[#090e1c]">
              <div className="flex items-center gap-3">
                <img src={modalItem.icon_url} alt="" className="h-6 w-6" />
                <div>
                  <span className="font-mono text-xs font-bold text-blue-400">{modalItem.id}</span>
                  <h3 className="text-lg font-bold text-white">{modalItem.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setModalItem(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div
                className="blueprint-canvas relative flex items-center justify-center p-6 rounded-2xl border border-white/10 bg-[#090e1c]"
                style={{
                  backgroundImage: "radial-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 0)",
                  backgroundSize: "24px 24px"
                }}
              >
                <div
                  className="w-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: modalItem.svg }}
                />
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Architecture Description</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{modalItem.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-[#080d1a] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-cyan-400">Open Policy Agent (OPA Rego)</span>
                    <button
                      id={`modal-copy-opa`}
                      onClick={() => copyToClipboard(modalItem.opa_policy, "modal-copy-opa")}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200"
                    >
                      Copy
                    </button>
                  </div>
                  <pre
                    className="text-xs font-mono text-slate-200 overflow-x-auto max-h-[220px]"
                    dangerouslySetInnerHTML={{ __html: highlightCode(modalItem.opa_policy, "rego") }}
                  />
                </div>

                <div className="rounded-xl border border-white/10 bg-[#080d1a] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-400">Terraform IaC Baseline</span>
                    <button
                      id={`modal-copy-tf`}
                      onClick={() => copyToClipboard(modalItem.terraform, "modal-copy-tf")}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200"
                    >
                      Copy
                    </button>
                  </div>
                  <pre
                    className="text-xs font-mono text-slate-200 overflow-x-auto max-h-[220px]"
                    dangerouslySetInnerHTML={{ __html: highlightCode(modalItem.terraform, "tf") }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-white/10 p-4 bg-[#090e1c]">
              <span className="text-xs text-slate-400">
                Pillar: <strong className="text-white">{modalItem.pillar}</strong> • Severity:{" "}
                <strong className="text-rose-400">{modalItem.severity}</strong>
              </span>
              <button
                onClick={() => downloadSvg(modalItem.svg, modalItem.id)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 flex items-center gap-1.5"
              >
                <span>Download Vector SVG</span> ⭳
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

