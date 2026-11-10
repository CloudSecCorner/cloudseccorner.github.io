import ArchitectureHeader from "./ArchitectureHeader";
import { Network, ShieldCheck, Braces, FileCode, BookOpen, AlertTriangle, CheckCircle2, Copy, Download, Maximize, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import referenceArchitectures from "../data/reference-architectures.json";
import DiagramViewer from "./DiagramViewer";
import ReferenceRunbook from "./ReferenceRunbook";
import DeveloperGuide from "./DeveloperGuide";
import React, { useEffect, useState, useMemo } from "react";
import OpenGraph from "./OpenGraph";
import { useStackBuilder } from "../context/StackBuilderContext";

export default function CnappArchitectures() {
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
    fetch("/data/cnapp-best-practices.json")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((items) => {
        const cnappRef = referenceArchitectures.cnapp || [];
        setData([...cnappRef, ...items]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load CNAPP architectures:", err);
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
    { id: "kspm-workloads", name: "KSPM & Workloads", icon: "🛡️", categoryIds: ["k8s-pod", "k8s-deployment", "k8s-admission", "k8s-networkpolicy", "k8s-rbac", "container-docker", "container-eks", "container-ecs"] },
    { id: "cspm-storage", name: "CSPM & Perimeter", icon: "☁️", categoryIds: ["storage-s3", "network-vpc", "security-kms", "waf-shield", "perimeter-apigateway", "azure-blob", "azure-vnet", "gcp-gcs", "gcp-vpc"] },
    { id: "cwpp-runtime", name: "CWPP Runtime & eBPF", icon: "👁️", categoryIds: ["threat-guardduty", "observability-cloudwatch", "logging-cloudtrail", "container-ebpf", "k8s-falco", "azure-defender", "gcp-scc"] },
    { id: "ciem-identity", name: "CIEM Identity & Tokens", icon: "🔑", categoryIds: ["iam-access", "azure-ad", "gcp-iam", "k8s-serviceaccount", "k8s-role"] },
    { id: "supply-chain", name: "Supply Chain & SBOM", icon: "📦", categoryIds: ["container-cosign", "container-sbom", "container-trivy", "container-registry"] }
  ];

  const quickChips = [
    { label: "⭐ Flagship ATT&CK Reference", filter: { id: "CNAPP-REF-0001" } },
    { label: "⚡ Critical Severity", filter: { severity: "Critical" } },
    { label: "🛡️ KSPM Non-Root & Caps", filter: { category: "k8s-pod", domain: "kspm-workloads" } },
    { label: "🌐 CNI Default-Deny", filter: { category: "k8s-networkpolicy", domain: "kspm-workloads" } },
    { label: "🔒 S3 KMS CMK Encryption", filter: { category: "storage-s3", domain: "cspm-storage" } },
    { label: "👁️ GuardDuty & CloudTrail", filter: { category: "threat-guardduty", domain: "cwpp-runtime" } },
    { label: "🔑 Least-Privilege IAM", filter: { category: "iam-access", domain: "ciem-identity" } },
    { label: "📦 Cosign Signature Verify", filter: { category: "container-cosign", domain: "supply-chain" } }
  ];

  const pillars = ["all", "Security", "Reliability", "Operational Excellence", "Cost Optimization"];
  const severities = ["all", "Critical", "High", "Medium", "Low"];
  const complianceStandards = ["all", "MITRE", "CIS", "NIST", "SOC 2", "PCI-DSS"];

  const domainCounts = useMemo(() => {
    const counts = { all: data.length };
    domains.forEach((dom) => {
      if (dom.id !== "all") {
        counts[dom.id] = data.filter((item) => dom.categoryIds.some((cid) => item.category?.includes(cid))).length;
      }
    });
    return counts;
  }, [data]);

  const filteredData = useMemo(() => {
    const q = query.toLowerCase().trim();
    return data.filter((item) => {
      if (selectedDomain !== "all") {
        const dom = domains.find((d) => d.id === selectedDomain);
        if (dom && !dom.categoryIds.some((cid) => item.category?.includes(cid))) return false;
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
          item.id?.toLowerCase().includes(q) ||
          item.title?.toLowerCase().includes(q) ||
          item.service?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.developer_guide?.name?.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [data, selectedDomain, category, pillar, severity, compliance, query]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  const copyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case "Critical":
        return { pill: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30", dot: "bg-rose-500" };
      case "High":
        return { pill: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30", dot: "bg-amber-500" };
      case "Medium":
        return { pill: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30", dot: "bg-blue-500" };
      default:
        return { pill: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30", dot: "bg-emerald-500" };
    }
  };

  return (
    <div className="dev-page developer-catalog min-h-screen bg-slate-50 dark:bg-[#0c0814] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <OpenGraph
        title="CNAPP & MITRE ATT&CK Developer Architectures | CloudSecCorner"
        description="Unified CNAPP defense architectures mapping MITRE ATT&CK techniques with Obsidian Pele vector diagrams and OPA Gatekeeper auto-remediation."
        tags={["CNAPP", "MITRE ATT&CK", "OPA Gatekeeper", "Auto Remediation", "KSPM", "CSPM", "CWPP"]}
      />

      <ArchitectureHeader
        provider="CNAPP"
        count={data.length || 1516}
        services={domains.length - 1}
        references={1}
      />

      {/* Flagship Architecture Hero Banner */}
      <section className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-10">
        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-purple-950/30 to-slate-900/60 p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40">
                ⭐ Flagship Reference Architecture
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                CNAPP Defense-in-Depth &amp; MITRE ATT&CK Auto-Remediation with OPA
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                Complete 12-step defense lifecycle: perimeter WAF/ALB filtering, KSPM admission hardening (runAsNonRoot, capabilities drop ALL, read-only rootfs), CNI default-deny microsegmentation, GuardDuty threat detection, and EventBridge + Lambda automated OPA quarantine containment.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono text-slate-300">
                <span className="bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">MITRE: T1190, T1078, T1068, T1552, T1530</span>
                <span className="bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">Engine: Obsidian Pele + TerraVision</span>
                <span className="bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">Enforcement: OPA Gatekeeper Rego v1</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
              <a
                href="/reference-architectures/cnapp/diagram.svg"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-red-600 hover:bg-red-500 text-white text-center shadow-lg shadow-red-500/20 transition flex items-center justify-center gap-2"
              >
                <Network className="w-4 h-4" />
                View Pele SVG
              </a>
              <a
                href="/reference-architectures/cnapp/policy.rego"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white text-center border border-white/20 transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Download Rego
              </a>
              <a
                href="/reference-architectures/cnapp/workload.yaml"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white text-center border border-white/20 transition flex items-center justify-center gap-2"
              >
                <FileCode className="w-4 h-4" />
                Download YAML
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Grid Container */}
      <main id="main-content" className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-10">
        {/* Domain Filter Bar */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 rounded-2xl bg-white/60 dark:bg-white/[0.02] p-2 border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur">
          {domains.map((dom) => {
            const active = selectedDomain === dom.id;
            return (
              <button
                key={dom.id}
                onClick={() => { setSelectedDomain(dom.id); setCategory("all"); setPage(1); }}
                className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center transition ${
                  active
                    ? "bg-white dark:bg-red-500/20 text-red-700 dark:text-red-300 shadow-sm border border-red-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-base">{dom.icon}</span>
                <span className="text-xs font-semibold leading-tight line-clamp-1">{dom.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    active ? "bg-red-500/15 text-red-700 dark:text-red-300" : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {domainCounts[dom.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {quickChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                if (chip.filter.id) {
                  setQuery(chip.filter.id);
                } else {
                  if (chip.filter.severity) setSeverity(chip.filter.severity);
                  if (chip.filter.category) setCategory(chip.filter.category);
                  if (chip.filter.domain) setSelectedDomain(chip.filter.domain);
                }
                setPage(1);
              }}
              className="rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-300 transition"
            >
              {chip.label}
            </button>
          ))}
          {(selectedDomain !== "all" || category !== "all" || pillar !== "all" || severity !== "all" || query) && (
            <button
              onClick={() => { setSelectedDomain("all"); setCategory("all"); setPillar("all"); setSeverity("all"); setQuery(""); setPage(1); }}
              className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-300 hover:bg-red-500/20 transition"
            >
              Reset Filters ✕
            </button>
          )}
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <input
            type="search"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search 1,516 CNAPP architectures by service, MITRE technique, OPA rule, or keyword..."
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Results Counter */}
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Showing {paginatedData.length} of {filteredData.length} architectures</span>
          <span>Page {page} of {totalPages}</span>
        </div>

        {/* Architecture Grid */}
        {loading ? (
          <div className="flex justify-center p-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center text-slate-500">
            No CNAPP architectures match your search criteria.
          </div>
        ) : (
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {item.id}
                        </span>
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${sev.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
                          {item.severity || "Defense"}
                        </span>
                        <span className="rounded-md bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20 px-2 py-0.5 text-[10px] font-medium">
                          {item.pillar || "Security"}
                        </span>
                      </div>

                      <button
                        onClick={() => setModalItem(item)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
                        title="Expand into full-screen dialog"
                      >
                        <Maximize className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {item.developer_guide ? item.developer_guide.name : item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {item.reference ? item.description : item.title}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      {item.icon_url && <img src={item.icon_url} alt="" className="h-4 w-4 rounded" />}
                      <span className="font-medium text-slate-700 dark:text-slate-300">{item.service}</span>
                      <span>•</span>
                      <span className="truncate">{item.category_name || item.category}</span>
                    </div>
                  </div>

                  {/* Card Description */}
                  <div className="px-5 py-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-b border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01]">
                    {item.description}
                  </div>

                  {/* View Tabs Bar */}
                  <div className="architecture-card-tabs flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] px-4 py-1.5 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveTabs((prev) => ({ ...prev, [item.id]: "diagram" }))}
                        className={`rounded-md px-2.5 py-1 font-semibold transition flex items-center gap-1.5 ${
                          activeTab === "diagram"
                            ? "bg-white dark:bg-red-500/20 text-red-700 dark:text-red-300 shadow-sm border border-red-500/30"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <Network size={13} /> Architecture
                      </button>
                      <button
                        onClick={() => setActiveTabs((prev) => ({ ...prev, [item.id]: "opa" }))}
                        className={`rounded-md px-2.5 py-1 font-semibold transition flex items-center gap-1.5 ${
                          activeTab === "opa"
                            ? "bg-white dark:bg-red-500/20 text-red-700 dark:text-red-300 shadow-sm border border-red-500/30"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <ShieldCheck size={13} /> OPA Rego
                      </button>
                      {item.developer_guide && (
                        <button
                          onClick={() => setActiveTabs((prev) => ({ ...prev, [item.id]: "guide" }))}
                          className={`rounded-md px-2.5 py-1 font-semibold transition flex items-center gap-1.5 ${
                            activeTab === "guide"
                              ? "bg-white dark:bg-red-500/20 text-red-700 dark:text-red-300 shadow-sm border border-red-500/30"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          <BookOpen size={13} /> Runbook
                        </button>
                      )}
                    </div>
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
                  </div>

                  {/* Tab Body */}
                  <div className="p-4 flex-1">
                    {activeTab === "diagram" && (
                      <DiagramViewer
                        svg={item.svg}
                        title={item.title}
                        filename={item.id}
                        reference={item.reference}
                        details={item.diagram_details}
                        architecture={item}
                        fitToViewport={true}
                      />
                    )}

                    {activeTab === "opa" && (
                      <div className="relative rounded-xl bg-slate-950 p-3 font-mono text-xs text-slate-200 max-h-[320px] overflow-auto border border-slate-800">
                        <button
                          onClick={() => copyCode(item.opa_policy, item.id)}
                          className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white flex items-center gap-1"
                        >
                          {copiedId === item.id ? "✓ Copied" : <><Copy size={11} /> Copy</>}
                        </button>
                        <pre className="whitespace-pre-wrap text-[11px] leading-relaxed">
                          {item.opa_policy || "# OPA Rego rule active"}
                        </pre>
                      </div>
                    )}

                    {activeTab === "guide" && item.developer_guide && (
                      <div className="max-h-[320px] overflow-auto">
                        <DeveloperGuide guide={item.developer_guide} />
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-between text-xs">
                    <span className="text-slate-400 truncate max-w-[200px]">{item.service}</span>
                    <button
                      onClick={() => setModalItem(item)}
                      className="text-red-600 dark:text-red-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      Inspect Full Blueprint →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Previous
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Modal Inspector */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <div className="absolute top-4 right-4 flex items-center gap-2">
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
                className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-red-500 font-bold uppercase">{modalItem.id}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">{modalItem.service}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">{modalItem.title}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">{modalItem.description}</p>

            {/* Diagram Viewer Inside Modal */}
            <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 p-2">
              <DiagramViewer
                svg={modalItem.svg}
                title={modalItem.title}
                filename={modalItem.id}
                reference={modalItem.reference}
                details={modalItem.diagram_details}
                architecture={modalItem}
                fitToViewport={false}
              />
            </div>

            {/* Modal Rego Policy */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Production OPA Rego Policy</h3>
                <button
                  onClick={() => copyCode(modalItem.opa_policy, modalItem.id)}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                >
                  {copiedId === modalItem.id ? "✓ Copied!" : <><Copy size={12} /> Copy Rego</>}
                </button>
              </div>
              <pre className="rounded-xl bg-slate-950 p-4 font-mono text-xs text-slate-200 overflow-x-auto border border-slate-800">
                {modalItem.opa_policy}
              </pre>
            </div>

            {/* Developer Guide / Runbook */}
            {modalItem.developer_guide && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Developer Integration Guide</h3>
                <DeveloperGuide guide={modalItem.developer_guide} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
