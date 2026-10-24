import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { REPOSITORY_URL, getAbsoluteUrl } from "../utils/socialSharing";

function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Cloud Security Corner",
      url: getAbsoluteUrl(),
      description: "Practical learning, hands-on labs, and curated tools for cloud security and agentic AI systems.",
      sameAs: ["https://github.com/CloudSecCorner"]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => script.remove();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/tools");
    }
  };

  return (
    <main id="main-content" tabIndex={-1}>
      {/* 1. Hero Section with Live Agentic Shield Terminal */}
      <section className="kube-home-hero">
        <div className="relative mx-auto grid items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-20 max-w-7xl">
          {/* Left Column Copy */}
          <div className="kube-home-copy lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-950/40 text-xs font-bold text-purple-300 mb-4 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>THE AGENTIC AI &amp; CLOUD DEFENSE PLATFORM</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Make agentic cloud security <span>practical &amp; bounded.</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Practical engineering blueprints, threat models, and hands-on defense tracks for AI agents, autonomous toolchains, and multi-cloud infrastructure—backed by a searchable catalogue of 37,000+ curated tools.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link className="kube-button shadow-lg shadow-purple-500/20" to="/labs/Agentic-Cloud-Security">
                Start Agentic Security Lab <span aria-hidden="true">→</span>
              </Link>
              <Link className="kube-button kube-button-outline" to="/tools">
                <svg className="w-4 h-4 mr-1 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse 37,000+ Tools
              </Link>
              <Link className="text-xs font-bold text-purple-300 hover:text-white transition flex items-center gap-1 py-2 px-3" to="/labs/Threat-Modeling">
                Threat Modeling Guide ↗
              </Link>
            </div>

            <div className="kube-home-proof mt-10 pt-6 border-t border-brand-gray-700/80" aria-label="CloudSecCorner resource summary">
              <div>
                <strong className="text-2xl sm:text-3xl font-extrabold text-white">37,750+</strong>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Curated Tools</span>
              </div>
              <div>
                <strong className="text-2xl sm:text-3xl font-extrabold text-white">6</strong>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Hands-on Labs</span>
              </div>
              <div>
                <strong className="text-2xl sm:text-3xl font-extrabold text-white">11</strong>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Defense Domains</span>
              </div>
              <div>
                <strong className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</strong>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Open Source</span>
              </div>
            </div>
          </div>

          {/* Right Column Interactive Terminal / Shield Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-purple-500/30 bg-[#1c162b]/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-purple-600/20 filter blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-indigo-600/20 filter blur-3xl pointer-events-none" />

              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-brand-gray-700/70 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] font-semibold text-purple-300">AGENT_RUNTIME_SHIELD</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  POLICY ENFORCED
                </span>
              </div>

              {/* Real-Time Inspection Feed */}
              <div className="space-y-3 font-mono text-xs">
                {/* Step 1 */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 transition hover:border-purple-500/40">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span>01 · INGRESS GUARDRAIL</span>
                    <span className="text-emerald-400 font-bold">CLEAN</span>
                  </div>
                  <div className="text-white font-medium">Input intent verified</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">0 indirect prompt injections detected across user context.</div>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-lg bg-black/40 border border-purple-500/30 bg-purple-950/20 transition hover:border-purple-500/60">
                  <div className="flex items-center justify-between text-purple-300 text-[10px] mb-1">
                    <span>02 · MCP TOOL GATEWAY</span>
                    <span className="text-purple-300 font-bold">CLOAKED</span>
                  </div>
                  <div className="text-white font-medium flex items-center justify-between">
                    <span>mcp::aws_iam::assume_role</span>
                    <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-200">OneCLI Proxy</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Ephemeral token injected in-flight; raw secrets inaccessible to model.</div>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 transition hover:border-purple-500/40">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span>03 · ACTION BOUNDARY</span>
                    <span className="text-cyan-400 font-bold">BOUNDED</span>
                  </div>
                  <div className="text-white font-medium">Privilege escalation check</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Tool invocation constrained to read-only VPC telemetry.</div>
                </div>

                {/* Step 4 */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 transition hover:border-purple-500/40">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] mb-1">
                    <span>04 · EXECUTION ISOLATION</span>
                    <span className="text-emerald-400 font-bold">ENCLOSED</span>
                  </div>
                  <div className="text-white font-medium">Firecracker MicroVM Sandbox</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Process and filesystem sandboxed; zero local network egress.</div>
                </div>
              </div>

              {/* Terminal Bottom Links */}
              <div className="mt-4 pt-3 border-t border-brand-gray-700/60 flex items-center justify-between text-[11px] font-sans">
                <span className="text-slate-400 font-medium">Recommended next step:</span>
                <Link to="/labs/Agentic-Cloud-Security" className="text-purple-300 font-bold hover:text-white transition flex items-center gap-1">
                  Open Agentic Defense Lab <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Quick Navigation Pills */}
      <section className="border-y border-brand-gray-700/60 bg-[#161220] py-4 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
            <span className="text-purple-400">⚡</span> Explore by Defense Domain:
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Link to="/tools?category=agentic-ai" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-950/40 text-purple-200 border border-purple-500/30 hover:bg-purple-800/40 hover:text-white transition">
              <span>🤖</span> Agentic &amp; AI Sec
            </Link>
            <Link to="/tools?category=cloud-container" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-gray-800/70 text-slate-300 border border-brand-gray-700 hover:border-purple-400 hover:text-white transition">
              <span>☁️</span> Cloud &amp; Containers
            </Link>
            <Link to="/tools?category=identity-access" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-gray-800/70 text-slate-300 border border-brand-gray-700 hover:border-purple-400 hover:text-white transition">
              <span>🔑</span> Identity &amp; Zero Trust
            </Link>
            <Link to="/tools?category=app-api" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-gray-800/70 text-slate-300 border border-brand-gray-700 hover:border-purple-400 hover:text-white transition">
              <span>🛡️</span> App &amp; API Security
            </Link>
            <Link to="/tools?category=devsecops-supplychain" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-gray-800/70 text-slate-300 border border-brand-gray-700 hover:border-purple-400 hover:text-white transition">
              <span>📦</span> Supply Chain &amp; SBOM
            </Link>
            <Link to="/tools?category=vuln-cve" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-gray-800/70 text-slate-300 border border-brand-gray-700 hover:border-purple-400 hover:text-white transition">
              <span>🔍</span> Vuln &amp; CVE
            </Link>
            <Link to="/tools" className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold text-purple-300 hover:text-white transition">
              All 11 domains →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Core Defense Architecture: Four Pillars */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="kube-home-section-heading">
          <div>
            <p className="kube-label text-purple-400 font-bold tracking-widest text-xs uppercase">Core Architecture Blueprint</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
              Four pillars of agentic &amp; cloud defense.
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl">
            Autonomous AI workloads can use credentials, invoke cloud APIs, and modify systems. Defense requires end-to-end boundaries from prompt ingestion to cloud execution.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Pillar 1 */}
          <div className="group relative rounded-2xl border border-brand-gray-700/80 bg-[#211a2e]/60 p-6 transition-all duration-300 hover:border-purple-500/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-2xl text-purple-300 mb-5 group-hover:scale-110 transition-transform">
              🔑
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-1">Pillar 01 · Identity</span>
            <h3 className="text-lg font-bold text-white mb-2">Scoped Credential Vaults</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prevent secret exfiltration. Agents never hold raw API credentials; short-lived, just-in-time tokens are injected via proxy gateways with strict role boundaries.
            </p>
            <div className="mt-4 pt-3 border-t border-brand-gray-700/50 text-[11px] font-semibold text-purple-300">
              Tools: OneCLI · Cerbos · ToolHive
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="group relative rounded-2xl border border-brand-gray-700/80 bg-[#211a2e]/60 p-6 transition-all duration-300 hover:border-purple-500/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-2xl text-purple-300 mb-5 group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-1">Pillar 02 · Gateway</span>
            <h3 className="text-lg font-bold text-white mb-2">MCP &amp; Tool Call Firewalls</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Intercept and validate tool manifests, arguments, and responses before execution. Enforce schema boundaries to stop tool poisoning and unauthorized mutations.
            </p>
            <div className="mt-4 pt-3 border-t border-brand-gray-700/50 text-[11px] font-semibold text-purple-300">
              Tools: Polaxis MCP · mcp-scan · Adrian
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="group relative rounded-2xl border border-brand-gray-700/80 bg-[#211a2e]/60 p-6 transition-all duration-300 hover:border-purple-500/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-2xl text-purple-300 mb-5 group-hover:scale-110 transition-transform">
              📦
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-1">Pillar 03 · Runtime</span>
            <h3 className="text-lg font-bold text-white mb-2">MicroVM Sandboxing &amp; TEEs</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Isolate untrusted code generated by agents inside ephemeral Firecracker microVMs. Run sensitive inference inside attested hardware enclaves (Intel TDX / GPU TEE).
            </p>
            <div className="mt-4 pt-3 border-t border-brand-gray-700/50 text-[11px] font-semibold text-purple-300">
              Tools: E2B · microsandbox · OpenPCC
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="group relative rounded-2xl border border-brand-gray-700/80 bg-[#211a2e]/60 p-6 transition-all duration-300 hover:border-purple-500/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/40">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-2xl text-purple-300 mb-5 group-hover:scale-110 transition-transform">
              👁️
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-1">Pillar 04 · Assurance</span>
            <h3 className="text-lg font-bold text-white mb-2">Reasoning Audit &amp; Red Teaming</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Capture full execution traces, detect indirect prompt injections, monitor privilege drift, and continuously evaluate multi-agent workflows with automated harnesses.
            </p>
            <div className="mt-4 pt-3 border-t border-brand-gray-700/50 text-[11px] font-semibold text-purple-300">
              Tools: Garak · AI-Infra-Guard · Vulnhuntr
            </div>
          </div>
        </div>
      </section>

      {/* 3. Open Source Tool Spotlight */}
      <section className="border-t border-brand-gray-700/60 bg-[#161220] py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="kube-label text-purple-400 font-bold tracking-widest text-xs uppercase">Curated Stack Spotlight</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Open-source tools leading modern defense.
              </h2>
            </div>
            <Link to="/tools" className="inline-flex items-center gap-1 text-sm font-bold text-purple-300 hover:text-white transition">
              Browse all 37,750+ tools in the directory <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Spotlight Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Tool 1 */}
            <div className="rounded-xl border border-brand-gray-700 bg-[#211a2e]/70 p-5 flex flex-col justify-between hover:border-purple-500/50 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Agentic Vault · Rust</span>
                  <span className="text-[11px] font-semibold text-slate-400">Open Source</span>
                </div>
                <h3 className="text-lg font-bold text-white">OneCLI</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Credential vault for AI agents. Intercepts agent HTTP requests, cloaks raw secrets, and injects AES-256-GCM tokens with scoped access controls and audit logs.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-gray-700/50 flex items-center justify-between">
                <a href="https://github.com/onecli/onecli" target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                  GitHub Repo ↗
                </a>
                <Link to="/tools?q=onecli" className="text-xs text-slate-400 hover:text-purple-300">
                  View in Catalog →
                </Link>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="rounded-xl border border-brand-gray-700 bg-[#211a2e]/70 p-5 flex flex-col justify-between hover:border-purple-500/50 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Agentic Scanner · Python</span>
                  <span className="text-[11px] font-semibold text-slate-400">Open Source</span>
                </div>
                <h3 className="text-lg font-bold text-white">Agentic Radar</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Security scanner analyzing agentic workflows, visualizing data flows, tools, prompts, and detecting potential security weaknesses and tool exfiltration.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-gray-700/50 flex items-center justify-between">
                <a href="https://github.com/splx-ai/agentic-radar" target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                  GitHub Repo ↗
                </a>
                <Link to="/tools?q=agentic-radar" className="text-xs text-slate-400 hover:text-purple-300">
                  View in Catalog →
                </Link>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="rounded-xl border border-brand-gray-700 bg-[#211a2e]/70 p-5 flex flex-col justify-between hover:border-purple-500/50 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Red Team Platform · Go</span>
                  <span className="text-[11px] font-semibold text-slate-400">Tencent</span>
                </div>
                <h3 className="text-lg font-bold text-white">AI-Infra-Guard</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Full-stack red-teaming platform: scans AI infrastructure across 30+ components (~400 CVEs), evaluates MCP server risks across 9 categories, and tests jailbreaks.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-gray-700/50 flex items-center justify-between">
                <a href="https://github.com/Tencent/AI-Infra-Guard" target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                  GitHub Repo ↗
                </a>
                <Link to="/tools?q=ai-infra-guard" className="text-xs text-slate-400 hover:text-purple-300">
                  View in Catalog →
                </Link>
              </div>
            </div>

            {/* Tool 4 */}
            <div className="rounded-xl border border-brand-gray-700 bg-[#211a2e]/70 p-5 flex flex-col justify-between hover:border-purple-500/50 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">MCP Firewall · Python</span>
                  <span className="text-[11px] font-semibold text-slate-400">Open Source</span>
                </div>
                <h3 className="text-lg font-bold text-white">Polaxis MCP Firewall</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Wraps Model Context Protocol agents with a 7-layer security firewall. Stops prompt injection, PII leakage, and memory poisoning at the tool-call layer before tools run.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-gray-700/50 flex items-center justify-between">
                <a href="https://github.com/nishant6118/Polaxis-SDK-MCP" target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                  GitHub Repo ↗
                </a>
                <Link to="/tools?q=polaxis" className="text-xs text-slate-400 hover:text-purple-300">
                  View in Catalog →
                </Link>
              </div>
            </div>

            {/* Tool 5 */}
            <div className="rounded-xl border border-brand-gray-700 bg-[#211a2e]/70 p-5 flex flex-col justify-between hover:border-purple-500/50 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">LLM Vuln Scanner · Python</span>
                  <span className="text-[11px] font-semibold text-slate-400">NVIDIA</span>
                </div>
                <h3 className="text-lg font-bold text-white">Garak</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  LLM vulnerability scanner that dynamically probes models for hallucination, prompt injection, jailbreaks, data leakage, and toxic responses.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-gray-700/50 flex items-center justify-between">
                <a href="https://github.com/NVIDIA/garak" target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                  GitHub Repo ↗
                </a>
                <Link to="/tools?q=garak" className="text-xs text-slate-400 hover:text-purple-300">
                  View in Catalog →
                </Link>
              </div>
            </div>

            {/* Tool 6 */}
            <div className="rounded-xl border border-brand-gray-700 bg-[#211a2e]/70 p-5 flex flex-col justify-between hover:border-purple-500/50 transition">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Runtime Policy · Python</span>
                  <span className="text-[11px] font-semibold text-slate-400">NVIDIA</span>
                </div>
                <h3 className="text-lg font-bold text-white">NeMo Guardrails</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Open-source toolkit for adding programmable guardrails to LLM applications. Defines safe dialogue flows, prevents toxic outputs, and enforces action policies.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-gray-700/50 flex items-center justify-between">
                <a href="https://github.com/NVIDIA/NeMo-Guardrails" target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-300 hover:text-white flex items-center gap-1">
                  GitHub Repo ↗
                </a>
                <Link to="/tools?q=nemo" className="text-xs text-slate-400 hover:text-purple-300">
                  View in Catalog →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive Learning Paths: All 6 Labs */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto" aria-labelledby="learning-path-title">
        <div className="kube-home-section-heading">
          <div>
            <p className="kube-label text-purple-400 font-bold tracking-widest text-xs uppercase">Interactive Defense Labs</p>
            <h2 id="learning-path-title" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-1">
              A clear path through cloud &amp; agentic security.
            </h2>
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl">
            Hands-on guides and step-by-step security walkthroughs designed for engineers building resilient cloud platforms and autonomous systems. Self-paced and 100% free.
          </p>
        </div>

        {/* 6 Labs Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Lab 1 */}
          <Link to="/labs/Agentic-Cloud-Security" className="group rounded-2xl border border-purple-500/40 bg-[#231b33]/80 p-6 flex flex-col justify-between hover:border-purple-400 hover:shadow-xl hover:shadow-purple-950/40 transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">01 · AGENTIC DEFENSE</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">INTERMEDIATE</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition">Agentic Cloud Security Essentials</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Threat-model an AI agent with cloud access. Design defense-in-depth controls for agent identity, tools, sandboxing, approvals, and incident response.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-gray-700/60 flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-white transition">
              <span>Start Lab Guide</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>

          {/* Lab 2 */}
          <Link to="/labs/Threat-Modeling" className="group rounded-2xl border border-brand-gray-700 bg-[#211a2e]/60 p-6 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-xl transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">02 · STRATEGY</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gray-800 text-slate-300 border border-brand-gray-700">INTERMEDIATE</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition">Threat Modeling with STRIDE</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Learn how to deconstruct modern distributed systems, uncover hidden attack surfaces, and develop practical risk mitigation matrices using STRIDE.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-gray-700/60 flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-white transition">
              <span>Start Lab Guide</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>

          {/* Lab 3 */}
          <Link to="/labs/Zero-Trust-Architecture" className="group rounded-2xl border border-brand-gray-700 bg-[#211a2e]/60 p-6 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-xl transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">03 · ARCHITECTURE</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gray-800 text-slate-300 border border-brand-gray-700">FOUNDATIONAL</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition">Zero-Trust Cloud Architecture</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Eliminate implicit perimeter trust. Implement explicit verification, workload identity (SPIFFE), least-privilege IAM, and continuous attestation.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-gray-700/60 flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-white transition">
              <span>Start Lab Guide</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>

          {/* Lab 4 */}
          <Link to="/labs/Security-Engineering-Fundamentals" className="group rounded-2xl border border-brand-gray-700 bg-[#211a2e]/60 p-6 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-xl transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">04 · SYSTEMS</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gray-800 text-slate-300 border border-brand-gray-700">FOUNDATIONAL</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition">Security Engineering Fundamentals</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Master the foundational building blocks of security engineering: public key cryptography, defense-in-depth, pipeline hardening, and resilient protocols.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-gray-700/60 flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-white transition">
              <span>Start Lab Guide</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>

          {/* Lab 5 */}
          <Link to="/labs/ethical-hacker-easy-way" className="group rounded-2xl border border-brand-gray-700 bg-[#211a2e]/60 p-6 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-xl transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">05 · OFFENSIVE RECON</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gray-800 text-slate-300 border border-brand-gray-700">HANDS-ON</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition">Ethical Hacker Practical Way</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Understand adversary methodology. Walk through surface reconnaissance, vulnerability scanning, and vulnerability exploitation mechanics safely.
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-gray-700/60 flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-white transition">
              <span>Start Lab Guide</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>

          {/* Lab 6 */}
          <Link to="/labs/Nmap-Practical-Labs" className="group rounded-2xl border border-brand-gray-700 bg-[#211a2e]/60 p-6 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-xl transition">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider">06 · NETWORK AUDIT</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gray-800 text-slate-300 border border-brand-gray-700">HANDS-ON</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition">Nmap Practical Defense</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Conduct perimeter reconnaissance, audit open ports, fingerprint services, and automate security checks using the Nmap Scripting Engine (NSE).
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-brand-gray-700/60 flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-white transition">
              <span>Start Lab Guide</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        </div>

        {/* Search Directory Callout */}
        <form className="kube-home-search mt-12 p-6 sm:p-8 rounded-2xl border border-brand-gray-700 bg-[#211a2e]/80 shadow-xl" onSubmit={handleSearchSubmit} role="search" aria-label="Search the tool directory">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <label htmlFor="home-tool-search" className="text-lg font-bold text-white">Looking for a specific security tool or framework?</label>
            <span className="text-xs text-purple-300 font-semibold">37,750+ open-source &amp; defensive tools indexed</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="home-tool-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search CSPM, MCP firewall, OneCLI, guardrails, Zero Trust, SAST, Nmap…"
              className="flex-1 rounded-xl border border-brand-gray-700 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 transition"
            />
            <button className="kube-button font-bold whitespace-nowrap" type="submit">
              Find Tools <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>Popular queries:</span>
            <Link to="/tools?q=agentic" className="text-purple-300 hover:underline">agentic</Link>
            <span>·</span>
            <Link to="/tools?q=mcp" className="text-purple-300 hover:underline">mcp</Link>
            <span>·</span>
            <Link to="/tools?q=guardrails" className="text-purple-300 hover:underline">guardrails</Link>
            <span>·</span>
            <Link to="/tools?q=zero+trust" className="text-purple-300 hover:underline">zero trust</Link>
            <span>·</span>
            <Link to="/tools?q=cspm" className="text-purple-300 hover:underline">cspm</Link>
            <span>·</span>
            <Link to="/tools?q=red+team" className="text-purple-300 hover:underline">red team</Link>
          </div>
        </form>
      </section>

      {/* 5. Research & Field Notes Spotlight */}
      <section className="border-t border-brand-gray-700/60 bg-[#161220] py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="kube-label text-purple-400 font-bold tracking-widest text-xs uppercase">Research &amp; Field Notes</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Engineering deep-dives into modern threat vectors.
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              We analyze real-world exploit mechanics, model isolation frameworks, and the evolving security boundaries required when AI systems are granted tool-execution capabilities.
            </p>
            <div className="mt-6 p-5 rounded-xl border border-brand-gray-700 bg-[#211a2e]/60">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block mb-1">Featured Teardown</span>
              <h3 className="text-base font-bold text-white">
                <Link to="/blog/Safeguarding-the-AI-Frontier" className="hover:text-purple-300 transition">
                  Safeguarding the AI Frontier: An In-Depth Analysis of Straiker's Revolutionary Security Solutions ↗
                </Link>
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Teardown of runtime guardrails, prompt injection barriers, and autonomous agent monitoring in multi-tenant environments.
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs font-semibold">
                <Link to="/blog/Safeguarding-the-AI-Frontier" className="text-purple-300 hover:text-white flex items-center gap-1">
                  Read Field Note <span aria-hidden="true">→</span>
                </Link>
                <Link to="/blog" className="text-slate-400 hover:text-white">
                  All Field Notes
                </Link>
              </div>
            </div>
          </div>

          {/* Machine-Readable Discovery Callout */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-brand-gray-700 bg-[#1c162b] p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <h3 className="text-base font-bold text-white">Machine-Readable &amp; LLM-Ready</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                CloudSecCorner is designed for human engineers and autonomous agents alike. Discover our public standardized endpoints for model retrieval and automation:
              </p>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-black/40 border border-brand-gray-700">
                  <span className="text-slate-300">/llm.txt</span>
                  <a href="/llm.txt" target="_blank" rel="noreferrer" className="text-purple-300 hover:text-white font-bold">Standard Index ↗</a>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-black/40 border border-brand-gray-700">
                  <span className="text-slate-300">/sitemap.xml</span>
                  <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-purple-300 hover:text-white font-bold">XML Sitemap ↗</a>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-black/40 border border-brand-gray-700">
                  <span className="text-slate-300">/priv/data/security-entries.json</span>
                  <span className="text-emerald-400 font-bold">37k+ JSON</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Community & Open Contributions */}
      <section className="kube-contribute">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-18">
          <div className="kube-contribute-copy max-w-3xl">
            <p className="kube-label text-purple-400 font-bold tracking-widest text-xs uppercase">Community Driven Defense</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Know a tool or pattern the security community should discover?
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Recommend a maintained project, submit a new hands-on lab, improve an agentic threat model, or help verify security categories for teams building autonomous cloud systems.
            </p>
          </div>
          <div className="kube-contribute-actions mt-8 flex flex-wrap items-center gap-4">
            <a
              className="kube-contribute-primary kube-button"
              href={`${REPOSITORY_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noreferrer"
            >
              Contribution Guide <span aria-hidden="true">↗</span>
            </a>
            <a
              className="kube-button kube-button-outline"
              href={`${REPOSITORY_URL}/issues/new/choose`}
              target="_blank"
              rel="noreferrer"
            >
              Recommend a Tool <span aria-hidden="true">↗</span>
            </a>
            <a
              className="text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1 py-2 px-3"
              href="https://discord.gg/aUD4hkYYGt"
              target="_blank"
              rel="noreferrer"
            >
              Join Discord Community ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandingPage;
