import React, { useState, useMemo } from "react";
import OpenGraph from "./OpenGraph";
import matrixData from "../data/cross-cloud-matrix.json";

const ALL_PROVIDERS = [
  { id: "aws", name: "AWS", logo: "/images/provider-logos/aws.svg", color: "border-amber-500/50" },
  { id: "azure", name: "Azure", logo: "/images/provider-logos/azure.svg", color: "border-cyan-500/50" },
  { id: "gcp", name: "Google Cloud", logo: "/images/provider-logos/gcp.svg", color: "border-emerald-500/50" },
  { id: "kspm", name: "Kubernetes", logo: "/images/provider-logos/kspm.svg", color: "border-blue-500/50" },
  { id: "cnapp", name: "CNAPP & MITRE", logo: "/images/provider-logos/cnapp.svg", color: "border-purple-500/50" },
  { id: "vultr", name: "Vultr", logo: "/images/provider-logos/vultr.svg", color: "border-blue-600/50" },
  { id: "oracle", name: "Oracle Cloud", logo: "/images/provider-logos/oracle.svg", color: "border-red-500/50" },
  { id: "digitalocean", name: "DigitalOcean", logo: "/images/provider-logos/digitalocean.svg", color: "border-sky-500/50" },
  { id: "alicloud", name: "Alibaba Cloud", logo: "/images/provider-logos/alicloud.svg", color: "border-orange-500/50" },
  { id: "civo", name: "Civo Cloud", logo: "/images/provider-logos/civo.svg", color: "border-sky-400/50" },
  { id: "hetzner", name: "Hetzner Cloud", logo: "/images/provider-logos/hetzner.svg", color: "border-red-600/50" }
];

export default function CrossCloudMatrix() {
  const [selectedDomain, setSelectedDomain] = useState("iam");
  const [activeTab, setActiveTab] = useState("tf"); // 'tf', 'cli', 'rego'
  const [activeProviders, setActiveProviders] = useState(ALL_PROVIDERS.map((p) => p.id));
  const [copiedKey, setCopiedKey] = useState(null);
  const [search, setSearch] = useState("");

  const currentDomainData = useMemo(() => {
    return matrixData.find((d) => d.id === selectedDomain) || matrixData[0];
  }, [selectedDomain]);

  const toggleProvider = (id) => {
    setActiveProviders((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((p) => p !== id) : prev) : [...prev, id]
    );
  };

  const copyCode = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <OpenGraph
        title="Cross-Cloud Security Rosetta Stone Matrix - CloudSecCorner"
        description="Side-by-side security controls, CLI commands, Terraform IaC, and OPA Rego policies across all 11 cloud providers."
        url="https://cloudsecuritycorner.com/cross-cloud-matrix"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 mb-4">
            <span>🌐 Unified Multi-Cloud Security Standard</span>
            <span>•</span>
            <span>11 Platforms Compared</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Cross-Cloud Security Rosetta Stone Matrix
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto">
            Compare how AWS, Azure, Google Cloud, Kubernetes, CNAPP, Vultr, Oracle, DigitalOcean, Alibaba Cloud, Civo, and Hetzner implement foundational security baselines side-by-side.
          </p>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {matrixData.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
                selectedDomain === d.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25 border border-purple-500"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <span>{d.icon}</span>
              <span>{d.title}</span>
            </button>
          ))}
        </div>

        {/* Provider Filter Bar & Code View Switcher */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-bold text-white text-sm">Select Cloud Providers to Compare:</h3>
              <p className="text-xs text-slate-400">Toggle providers on or off to inspect side-by-side architectures</p>
            </div>

            {/* View Mode Switcher */}
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab("tf")}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === "tf" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Terraform IaC
              </button>
              <button
                onClick={() => setActiveTab("cli")}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === "cli" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                CLI Audit
              </button>
              <button
                onClick={() => setActiveTab("rego")}
                className={`px-3 py-1.5 rounded-md font-semibold transition ${
                  activeTab === "rego" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                OPA Rego
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_PROVIDERS.map((p) => {
              const selected = activeProviders.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProvider(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                    selected
                      ? "bg-slate-800 text-slate-100 border border-purple-500/50 shadow-sm"
                      : "bg-slate-950 text-slate-600 border border-slate-800 hover:text-slate-400"
                  }`}
                >
                  <img src={p.logo} alt="" className="w-3.5 h-3.5" />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_PROVIDERS.filter((p) => activeProviders.includes(p.id)).map((p) => {
            const ctrl = currentDomainData.providers?.[p.id];
            if (!ctrl) return null;
            const copyKey = `${p.id}-${selectedDomain}-${activeTab}`;

            return (
              <div
                key={p.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <img src={p.logo} alt={p.name} className="w-5 h-5" />
                      <span className="font-bold text-white text-sm">{p.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {ctrl.compliance || "CIS Benchmark"}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-purple-400 mb-1">{ctrl.service}</h4>
                  <p className="text-xs text-slate-300 mb-4">{ctrl.control}</p>

                  <div className="relative rounded-lg bg-slate-950 border border-slate-800/80 p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase text-slate-500">
                        {activeTab === "tf" ? "Terraform" : activeTab === "cli" ? "CLI Audit" : "OPA Policy"}
                      </span>
                      <button
                        onClick={() =>
                          copyCode(
                            activeTab === "tf" ? ctrl.tf : activeTab === "cli" ? ctrl.cli : ctrl.rego,
                            copyKey
                          )
                        }
                        className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold"
                      >
                        {copiedKey === copyKey ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <pre className="text-[11px] font-mono text-slate-200 overflow-x-auto max-h-44">
                      {activeTab === "tf" && ctrl.tf}
                      {activeTab === "cli" && ctrl.cli}
                      {activeTab === "rego" && ctrl.rego}
                    </pre>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>Domain: {currentDomainData.title}</span>
                  <a
                    href={`/${p.id === "kspm" ? "kspm" : p.id === "cnapp" ? "cnapp" : p.id}-architectures`}
                    className="text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    All 1,000+ blueprints →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
