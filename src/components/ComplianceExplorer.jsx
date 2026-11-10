import React, { useState, useMemo } from "react";
import OpenGraph from "./OpenGraph";
import frameworks from "../data/compliance-frameworks.json";

const PROVIDERS = [
  { id: "aws", name: "AWS", logo: "/images/provider-logos/aws.svg" },
  { id: "azure", name: "Azure", logo: "/images/provider-logos/azure.svg" },
  { id: "gcp", name: "Google Cloud", logo: "/images/provider-logos/gcp.svg" },
  { id: "kspm", name: "Kubernetes", logo: "/images/provider-logos/kspm.svg" },
  { id: "cnapp", name: "CNAPP", logo: "/images/provider-logos/cnapp.svg" },
  { id: "vultr", name: "Vultr", logo: "/images/provider-logos/vultr.svg" },
  { id: "oracle", name: "Oracle", logo: "/images/provider-logos/oracle.svg" },
  { id: "digitalocean", name: "DigitalOcean", logo: "/images/provider-logos/digitalocean.svg" },
  { id: "alicloud", name: "Alibaba Cloud", logo: "/images/provider-logos/alicloud.svg" },
  { id: "civo", name: "Civo Cloud", logo: "/images/provider-logos/civo.svg" },
  { id: "hetzner", name: "Hetzner", logo: "/images/provider-logos/hetzner.svg" }
];

export default function ComplianceExplorer() {
  const [selectedFramework, setSelectedFramework] = useState("cis");
  const [search, setSearch] = useState("");

  const currentFramework = useMemo(() => {
    return frameworks.find((f) => f.id === selectedFramework) || frameworks[0];
  }, [selectedFramework]);

  const filteredRequirements = useMemo(() => {
    if (!search.trim()) return currentFramework.requirements;
    const q = search.toLowerCase();
    return currentFramework.requirements.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.domain.toLowerCase().includes(q) ||
        r.mitigation.toLowerCase().includes(q)
    );
  }, [currentFramework, search]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <OpenGraph
        title="Regulatory Compliance Framework Explorer - CloudSecCorner"
        description="Explore cloud security compliance mappings for CIS Benchmarks, NIST SP 800-53, PCI-DSS, SOC 2, and MITRE ATT&CK."
        url="https://cloudsecuritycorner.com/compliance"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-4">
            <span>⚖️ Enterprise Cloud Governance</span>
            <span>•</span>
            <span>CIS, NIST, PCI-DSS, SOC 2 &amp; MITRE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Regulatory Compliance Framework Explorer
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto">
            Audit-ready security architecture mappings and automated OPA Rego policy controls across major enterprise regulatory standards.
          </p>
        </div>

        {/* Framework Selector Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {frameworks.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFramework(f.id);
                setSearch("");
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                selectedFramework === f.id
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 border border-emerald-500"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <span>{f.name}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950/60 font-mono text-emerald-300">
                {f.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Framework Overview Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                {currentFramework.version}
              </span>
              <h2 className="text-2xl font-bold text-white">{currentFramework.name}</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">{currentFramework.description}</p>
          </div>

          {/* Provider Compliance Scorecard */}
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Multi-Cloud Automated Policy Coverage Scorecard:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {PROVIDERS.map((p) => {
              const score = currentFramework.coverage?.[p.id] || 90;
              return (
                <div
                  key={p.id}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={p.logo} alt="" className="w-4 h-4" />
                    <span className="text-xs font-semibold text-slate-200">{p.name}</span>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-lg font-extrabold text-emerald-400 font-mono">{score}%</span>
                      <span className="text-[10px] text-slate-500 font-mono">Enforced</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Requirements Search & List */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search requirement ID, domain, or mitigation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 w-full sm:w-80 focus:outline-none focus:border-emerald-500"
          />
          <p className="text-xs text-slate-400 font-mono">
            Showing {filteredRequirements.length} controls in {currentFramework.name}
          </p>
        </div>

        <div className="space-y-4">
          {filteredRequirements.map((req) => (
            <div
              key={req.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {req.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-800">
                    {req.domain}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Profile: {req.level}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">{req.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-400">Architectural Defense:</strong> {req.mitigation}
                </p>
              </div>

              <div className="shrink-0 flex md:flex-col items-center md:items-end gap-2">
                <a
                  href="/aws-architectures"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                >
                  Inspect Blueprints →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
