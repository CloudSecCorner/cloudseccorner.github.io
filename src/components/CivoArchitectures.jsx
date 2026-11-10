import ArchitectureHeader from "./ArchitectureHeader";
import { Network, ShieldCheck, Braces, FileCode, BookOpen } from "lucide-react";
import referenceArchitectures from "../data/reference-architectures.json";
import DiagramViewer from "./DiagramViewer";
import React, { useEffect, useState, useMemo } from "react";
import OpenGraph from "./OpenGraph";
import { useStackBuilder } from "../context/StackBuilderContext";

export default function CivoArchitectures() {
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
    fetch("/data/civo-best-practices.json")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((items) => {
        setData([...(referenceArchitectures.civo || []), ...items]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Civo architectures:", err);
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
    { id: "k3s-compute", name: "Kubernetes & Micro-VMs", icon: "☸️", categoryIds: ["civo-k3s", "civo-instances", "civo-gpu", "civo-autoscaling", "civo-marketplace"] },
    { id: "storage-databases", name: "Storage & DBaaS", icon: "🗄️", categoryIds: ["civo-object-storage", "civo-volumes", "civo-database", "civo-deep-lake", "civo-redis"] },
    { id: "network-security", name: "Networks & Firewalls", icon: "🌐", categoryIds: ["civo-network", "civo-firewall", "civo-loadbalancer", "civo-dns"] },
    { id: "governance-audit", name: "IAM, Keys & Audit", icon: "🔒", categoryIds: ["civo-iam", "civo-keys", "civo-security", "civo-compliance", "civo-audit"] },
    { id: "telemetry-events", name: "Observability & Events", icon: "📊", categoryIds: ["civo-monitoring", "civo-backup", "civo-events", "civo-kafka", "civo-registry"] }
  ];

  const categories = [
    { id: "all", name: "All 24 Domains", icon: null, domain: "all" },
    { id: "civo-k3s", name: "K3s Managed Kubernetes", icon: "/images/civo-icons/civo-k3s.svg", domain: "k3s-compute" },
    { id: "civo-instances", name: "Compute Instances", icon: "/images/civo-icons/civo-instances.svg", domain: "k3s-compute" },
    { id: "civo-gpu", name: "GPU & AI Clusters", icon: "/images/civo-icons/civo-gpu.svg", domain: "k3s-compute" },
    { id: "civo-object-storage", name: "Object Storage", icon: "/images/civo-icons/civo-object-storage.svg", domain: "storage-databases" },
    { id: "civo-volumes", name: "NVMe Block Volumes", icon: "/images/civo-icons/civo-volumes.svg", domain: "storage-databases" },
    { id: "civo-network", name: "Private VPC Networks", icon: "/images/civo-icons/civo-network.svg", domain: "network-security" },
    { id: "civo-firewall", name: "Cloud Firewalls", icon: "/images/civo-icons/civo-firewall.svg", domain: "network-security" },
    { id: "civo-loadbalancer", name: "Load Balancers & TLS", icon: "/images/civo-icons/civo-loadbalancer.svg", domain: "network-security" },
    { id: "civo-database", name: "Managed DBaaS", icon: "/images/civo-icons/civo-database.svg", domain: "storage-databases" },
    { id: "civo-registry", name: "Container Registry", icon: "/images/civo-icons/civo-registry.svg", domain: "telemetry-events" },
    { id: "civo-dns", name: "Cloud DNS Anycast", icon: "/images/civo-icons/civo-dns.svg", domain: "network-security" },
    { id: "civo-iam", name: "Teams & API Tokens", icon: "/images/civo-icons/civo-iam.svg", domain: "governance-audit" },
    { id: "civo-audit", name: "Audit Trail Logging", icon: "/images/civo-icons/civo-audit.svg", domain: "governance-audit" },
    { id: "civo-marketplace", name: "Marketplace Apps", icon: "/images/civo-icons/civo-marketplace.svg", domain: "k3s-compute" },
    { id: "civo-events", name: "Webhooks & Events", icon: "/images/civo-icons/civo-events.svg", domain: "telemetry-events" },
    { id: "civo-keys", name: "SSH Keys & Access", icon: "/images/civo-icons/civo-keys.svg", domain: "governance-audit" },
    { id: "civo-autoscaling", name: "Node Auto-Scaling", icon: "/images/civo-icons/civo-autoscaling.svg", domain: "k3s-compute" },
    { id: "civo-backup", name: "Backups & Snapshots", icon: "/images/civo-icons/civo-backup.svg", domain: "telemetry-events" },
    { id: "civo-monitoring", name: "Prometheus Metrics", icon: "/images/civo-icons/civo-monitoring.svg", domain: "telemetry-events" },
    { id: "civo-security", name: "Security Guardrails", icon: "/images/civo-icons/civo-security.svg", domain: "governance-audit" },
    { id: "civo-kafka", name: "Kafka Streams DBaaS", icon: "/images/civo-icons/civo-kafka.svg", domain: "telemetry-events" },
    { id: "civo-redis", name: "Redis In-Memory Cache", icon: "/images/civo-icons/civo-redis.svg", domain: "storage-databases" },
    { id: "civo-deep-lake", name: "Deep Lake Vector Store", icon: "/images/civo-icons/civo-deep-lake.svg", domain: "storage-databases" },
    { id: "civo-compliance", name: "CIS Hardening Baseline", icon: "/images/civo-icons/civo-compliance.svg", domain: "governance-audit" }
  ];

  const filteredCategories = useMemo(() => {
    if (selectedDomain === "all") return categories;
    const currentDomain = domains.find((d) => d.id === selectedDomain);
    if (!currentDomain) return categories;
    return categories.filter((c) => c.id === "all" || currentDomain.categoryIds.includes(c.id));
  }, [selectedDomain]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (selectedDomain !== "all") {
        const currentDomain = domains.find((d) => d.id === selectedDomain);
        if (currentDomain && !currentDomain.categoryIds.includes(item.category)) return false;
      }
      if (category !== "all" && item.category !== category) return false;
      if (pillar !== "all" && item.pillar !== pillar) return false;
      if (severity !== "all" && item.severity !== severity) return false;
      if (compliance !== "all" && !item.compliance?.includes(compliance)) return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchId = item.id?.toLowerCase().includes(q);
        const matchCategory = item.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchId && !matchCategory) return false;
      }
      return true;
    });
  }, [data, selectedDomain, category, pillar, severity, compliance, query]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <OpenGraph
        title="Civo Cloud Architecture Best Practices - CloudSecCorner"
        description="1,000+ developer architecture patterns for Civo Cloud with Obsidian Pele SVGs, OPA Rego policies, and Terraform."
        url="https://cloudsecuritycorner.com/civo-architectures"
      />
      <ArchitectureHeader
        provider="Civo Cloud"
        tagline="1,000+ Civo Cloud Architecture Best Practices with Pele, OPA &amp; Terraform"
        description="Explore developer-grade Civo Cloud architectures with K3s Kubernetes, Deep Lake GPU clusters, and fast micro-VMs."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Domain Selection Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
          {domains.map((dom) => (
            <button
              key={dom.id}
              onClick={() => {
                setSelectedDomain(dom.id);
                setCategory("all");
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition ${
                selectedDomain === dom.id
                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              }`}
            >
              <span>{dom.icon}</span>
              <span>{dom.name}</span>
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filteredCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                category === cat.id
                  ? "bg-sky-600/30 text-sky-400 border border-sky-500/50"
                  : "bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-200"
              }`}
            >
              {cat.icon && <img src={cat.icon} alt="" className="w-3.5 h-3.5" />}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
          <input
            type="text"
            placeholder="Search Civo architectures, Rego, Terraform..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 w-full sm:w-72 focus:outline-none focus:border-sky-500"
          />

          <div className="flex flex-wrap gap-3 text-xs">
            <select
              value={severity}
              onChange={(e) => {
                setSeverity(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
            </select>

            <select
              value={pillar}
              onChange={(e) => {
                setPillar(e.target.value);
                setPage(1);
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 focus:outline-none"
            >
              <option value="all">All Pillars</option>
              <option value="Security">Security</option>
              <option value="Reliability">Reliability</option>
              <option value="Operational Excellence">Operational Excellence</option>
              <option value="Cost Optimization">Cost Optimization</option>
            </select>
          </div>
        </div>

        {/* Architecture Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sky-500 border-t-transparent mb-4"></div>
            <p className="text-slate-400">Loading Civo Cloud Architecture Blueprints...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No architecture blueprints match your filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => {
              const currentTab = activeTabs[item.id] || "diagram";
              return (
                <div
                  key={item.id}
                  className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 hover:border-sky-500/40 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{item.id}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-100 mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4">{item.description}</p>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 border-b border-slate-700/60 pb-2 mb-3">
                      <button
                        onClick={() => setActiveTabs({ ...activeTabs, [item.id]: "diagram" })}
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          currentTab === "diagram" ? "bg-slate-700 text-sky-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Diagram
                      </button>
                      <button
                        onClick={() => setActiveTabs({ ...activeTabs, [item.id]: "opa" })}
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          currentTab === "opa" ? "bg-slate-700 text-sky-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        OPA Rego
                      </button>
                      <button
                        onClick={() => setActiveTabs({ ...activeTabs, [item.id]: "tf" })}
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          currentTab === "tf" ? "bg-slate-700 text-sky-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Terraform
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="h-44 overflow-hidden rounded-lg bg-slate-950 p-2 mb-4 flex items-center justify-center">
                      {currentTab === "diagram" && (
                        <div
                          className="w-full h-full flex items-center justify-center overflow-auto cursor-pointer"
                          onClick={() => setModalItem(item)}
                          dangerouslySetInnerHTML={{ __html: item.svg }}
                        />
                      )}
                      {currentTab === "opa" && (
                        <pre className="text-[10px] font-mono text-emerald-400 overflow-auto w-full h-full p-2">
                          {item.opa_policy}
                        </pre>
                      )}
                      {currentTab === "tf" && (
                        <pre className="text-[10px] font-mono text-amber-300 overflow-auto w-full h-full p-2">
                          {item.terraform}
                        </pre>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setModalItem(item)}
                      className="text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      View Details →
                    </button>
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
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          isInStack(item.id)
                            ? "bg-purple-600 text-white"
                            : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                        }`}
                      >
                        {isInStack(item.id) ? "✓ In Stack" : "+ Stack"}
                      </button>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                        {item.severity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-800 mt-8 pt-4">
          <p className="text-xs text-slate-400">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of{" "}
            {filtered.length} blueprints
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detail Drawer */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-sky-400">{modalItem.id}</span>
                <h2 className="text-xl font-bold">{modalItem.title}</h2>
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
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6">{modalItem.description}</p>

            <div className="mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center">
              <div
                className="w-full flex justify-center"
                dangerouslySetInnerHTML={{ __html: modalItem.svg }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Open Policy Agent (Rego)</h4>
                  <button
                    onClick={() => copyToClipboard(modalItem.opa_policy, "modal-opa")}
                    className="text-xs text-sky-400 hover:text-sky-300"
                  >
                    {copiedId === "modal-opa" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-emerald-400 max-h-60 overflow-auto">
                  {modalItem.opa_policy}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Terraform Configuration</h4>
                  <button
                    onClick={() => copyToClipboard(modalItem.terraform, "modal-tf")}
                    className="text-xs text-sky-400 hover:text-sky-300"
                  >
                    {copiedId === "modal-tf" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800 text-amber-300 max-h-60 overflow-auto">
                  {modalItem.terraform}
                </pre>
              </div>
            </div>

            {modalItem.remediation && (
              <div className="bg-sky-950/30 border border-sky-800/40 p-4 rounded-xl text-xs text-sky-200">
                <strong className="block mb-1 text-sky-400 font-semibold">Verification &amp; Remediation:</strong>
                <code>{modalItem.remediation}</code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
