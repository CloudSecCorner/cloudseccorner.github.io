import ArchitectureHeader from "./ArchitectureHeader";
import { Network, ShieldCheck, Braces, FileCode, BookOpen } from "lucide-react";
import referenceArchitectures from "../data/reference-architectures.json";
import DiagramViewer from "./DiagramViewer";
import React, { useEffect, useState, useMemo } from "react";
import OpenGraph from "./OpenGraph";
import { useStackBuilder } from "../context/StackBuilderContext";

export default function HetznerArchitectures() {
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
    fetch("/data/hetzner-best-practices.json")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((items) => {
        setData([...(referenceArchitectures.hetzner || []), ...items]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Hetzner architectures:", err);
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
    { id: "compute-servers", name: "Servers & Robot", icon: "🖥️", categoryIds: ["hetzner-server", "hetzner-robot", "hetzner-placement-group", "hetzner-cloud-init", "hetzner-k8s"] },
    { id: "storage-backup", name: "Storage Box & Volumes", icon: "🗄️", categoryIds: ["hetzner-volume", "hetzner-storagebox", "hetzner-snapshot", "hetzner-backup"] },
    { id: "network-interconnect", name: "Networks & vSwitch", icon: "🌐", categoryIds: ["hetzner-network", "hetzner-firewall", "hetzner-loadbalancer", "hetzner-floating-ip", "hetzner-primary-ip", "hetzner-vswitch", "hetzner-dns"] },
    { id: "security-compliance", name: "IAM, TLS & EU Sovereignty", icon: "🔒", categoryIds: ["hetzner-iam", "hetzner-ssh-key", "hetzner-certificate", "hetzner-security", "hetzner-ddos", "hetzner-compliance"] },
    { id: "telemetry-audit", name: "Metrics & Audit Trail", icon: "📊", categoryIds: ["hetzner-metrics", "hetzner-audit"] }
  ];

  const categories = [
    { id: "all", name: "All 24 Domains", icon: null, domain: "all" },
    { id: "hetzner-server", name: "Cloud Servers CX/CPX", icon: "/images/hetzner-icons/hetzner-server.svg", domain: "compute-servers" },
    { id: "hetzner-network", name: "Private Cloud Networks", icon: "/images/hetzner-icons/hetzner-network.svg", domain: "network-interconnect" },
    { id: "hetzner-firewall", name: "Stateful Firewalls", icon: "/images/hetzner-icons/hetzner-firewall.svg", domain: "network-interconnect" },
    { id: "hetzner-volume", name: "NVMe Block Volumes", icon: "/images/hetzner-icons/hetzner-volume.svg", domain: "storage-backup" },
    { id: "hetzner-loadbalancer", name: "Load Balancers & TLS", icon: "/images/hetzner-icons/hetzner-loadbalancer.svg", domain: "network-interconnect" },
    { id: "hetzner-floating-ip", name: "Floating IP Failover", icon: "/images/hetzner-icons/hetzner-floating-ip.svg", domain: "network-interconnect" },
    { id: "hetzner-primary-ip", name: "Primary Static IP", icon: "/images/hetzner-icons/hetzner-primary-ip.svg", domain: "network-interconnect" },
    { id: "hetzner-ssh-key", name: "ED25519 SSH Keys", icon: "/images/hetzner-icons/hetzner-ssh-key.svg", domain: "security-compliance" },
    { id: "hetzner-certificate", name: "Managed TLS Certs", icon: "/images/hetzner-icons/hetzner-certificate.svg", domain: "security-compliance" },
    { id: "hetzner-placement-group", name: "Placement Groups", icon: "/images/hetzner-icons/hetzner-placement-group.svg", domain: "compute-servers" },
    { id: "hetzner-snapshot", name: "Image Snapshots", icon: "/images/hetzner-icons/hetzner-snapshot.svg", domain: "storage-backup" },
    { id: "hetzner-backup", name: "7-Day Backups", icon: "/images/hetzner-icons/hetzner-backup.svg", domain: "storage-backup" },
    { id: "hetzner-dns", name: "Anycast DNS API", icon: "/images/hetzner-icons/hetzner-dns.svg", domain: "network-interconnect" },
    { id: "hetzner-robot", name: "Robot Bare Metal", icon: "/images/hetzner-icons/hetzner-robot.svg", domain: "compute-servers" },
    { id: "hetzner-vswitch", name: "vSwitch Interconnect", icon: "/images/hetzner-icons/hetzner-vswitch.svg", domain: "network-interconnect" },
    { id: "hetzner-storagebox", name: "Storage Box (SFTP)", icon: "/images/hetzner-icons/hetzner-storagebox.svg", domain: "storage-backup" },
    { id: "hetzner-iam", name: "Project API Tokens", icon: "/images/hetzner-icons/hetzner-iam.svg", domain: "security-compliance" },
    { id: "hetzner-audit", name: "Action History Logs", icon: "/images/hetzner-icons/hetzner-audit.svg", domain: "telemetry-audit" },
    { id: "hetzner-metrics", name: "Telemetry & Graphing", icon: "/images/hetzner-icons/hetzner-metrics.svg", domain: "telemetry-audit" },
    { id: "hetzner-security", name: "Host OS Hardening", icon: "/images/hetzner-icons/hetzner-security.svg", domain: "security-compliance" },
    { id: "hetzner-ddos", name: "DDoS Protection", icon: "/images/hetzner-icons/hetzner-ddos.svg", domain: "security-compliance" },
    { id: "hetzner-k8s", name: "Hetzner Kubernetes", icon: "/images/hetzner-icons/hetzner-k8s.svg", domain: "compute-servers" },
    { id: "hetzner-cloud-init", name: "Cloud-Init Hardening", icon: "/images/hetzner-icons/hetzner-cloud-init.svg", domain: "compute-servers" },
    { id: "hetzner-compliance", name: "ISO 27001 & GDPR", icon: "/images/hetzner-icons/hetzner-compliance.svg", domain: "security-compliance" }
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
        title="Hetzner Cloud Architecture Best Practices - CloudSecCorner"
        description="1,000+ developer architecture patterns for Hetzner Cloud with Obsidian Pele SVGs, OPA Rego policies, and Terraform."
        url="https://cloudsecuritycorner.com/hetzner-architectures"
      />
      <ArchitectureHeader
        provider="Hetzner Cloud"
        tagline="1,000+ Hetzner Cloud Architecture Best Practices with Pele, OPA &amp; Terraform"
        description="Explore sovereign European Hetzner Cloud architectures with CX/CPX servers, private networks, firewalls, and Storage Box."
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
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
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
                  ? "bg-red-600/30 text-red-400 border border-red-500/50"
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
            placeholder="Search Hetzner architectures, Rego, Terraform..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 w-full sm:w-72 focus:outline-none focus:border-red-500"
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent mb-4"></div>
            <p className="text-slate-400">Loading Hetzner Cloud Architecture Blueprints...</p>
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
                  className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 hover:border-red-500/40 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
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
                          currentTab === "diagram" ? "bg-slate-700 text-red-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        Diagram
                      </button>
                      <button
                        onClick={() => setActiveTabs({ ...activeTabs, [item.id]: "opa" })}
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          currentTab === "opa" ? "bg-slate-700 text-red-400" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        OPA Rego
                      </button>
                      <button
                        onClick={() => setActiveTabs({ ...activeTabs, [item.id]: "tf" })}
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          currentTab === "tf" ? "bg-slate-700 text-red-400" : "text-slate-400 hover:text-slate-200"
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
                      className="text-red-400 hover:text-red-300 font-semibold"
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
                <span className="text-xs font-mono text-red-400">{modalItem.id}</span>
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
                    className="text-xs text-red-400 hover:text-red-300"
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
                    className="text-xs text-red-400 hover:text-red-300"
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
              <div className="bg-red-950/30 border border-red-800/40 p-4 rounded-xl text-xs text-red-200">
                <strong className="block mb-1 text-red-400 font-semibold">Verification &amp; Remediation:</strong>
                <code>{modalItem.remediation}</code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
