import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OpenGraph from "./OpenGraph";

export default function AwsArchitectures() {
  const [searchParams, setSearchParams] = useSearchParams();
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
    fetch("/data/aws-best-practices.json")
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((items) => {
        setData(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load AWS architectures:", err);
        setLoading(false);
      });
  }, []);

  // Keep explorer state in sync with the URL so filters and pages are shareable/bookmarkable
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "all";
    const pil = searchParams.get("pillar") || "all";
    const sev = searchParams.get("severity") || "all";
    const pg = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    setQuery(q);
    setCategory(cat);
    setPillar(pil);
    setSeverity(sev);
    setPage(pg);
  }, [searchParams]);

  const applyUrlFilters = (next) => {
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.category && next.category !== "all") params.set("category", next.category);
    if (next.pillar && next.pillar !== "all") params.set("pillar", next.pillar);
    if (next.severity && next.severity !== "all") params.set("severity", next.severity);
    if (next.page && next.page > 1) params.set("page", String(next.page));
    setSearchParams(params, { replace: true });
  };

  // Close the fullscreen blueprint modal with the Escape key
  useEffect(() => {
    if (!modalItem) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setModalItem(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalItem]);

  const categories = [
    { id: "all", name: "All Categories", icon: null },
    { id: "storage-s3", name: "S3 & Storage", icon: "/images/aws-icons/storage-s3.svg" },
    { id: "iam-access", name: "IAM & Identity", icon: "/images/aws-icons/iam-access.svg" },
    { id: "network-vpc", name: "VPC & Perimeter", icon: "/images/aws-icons/network-vpc.svg" },
    { id: "compute-ec2", name: "EC2 Hardening", icon: "/images/aws-icons/compute-ec2.svg" },
    { id: "database-rds", name: "RDS & Aurora", icon: "/images/aws-icons/database-rds.svg" },
    { id: "nosql-dynamodb", name: "DynamoDB NoSQL", icon: "/images/aws-icons/nosql-dynamodb.svg" },
    { id: "container-eks", name: "EKS Defense", icon: "/images/aws-icons/container-eks.svg" },
    { id: "container-ecs", name: "ECS Containers", icon: "/images/aws-icons/container-ecs.svg" },
    { id: "serverless-lambda", name: "Lambda Serverless", icon: "/images/aws-icons/serverless-lambda.svg" },
    { id: "perimeter-apigateway", name: "API Gateway", icon: "/images/aws-icons/perimeter-apigateway.svg" },
    { id: "edge-cloudfront", name: "CloudFront Edge", icon: "/images/aws-icons/edge-cloudfront.svg" },
    { id: "waf-shield", name: "WAF & Shield", icon: "/images/aws-icons/waf-shield.svg" },
    { id: "security-kms", name: "KMS & Secrets", icon: "/images/aws-icons/security-kms.svg" },
    { id: "logging-cloudtrail", name: "CloudTrail Audit", icon: "/images/aws-icons/logging-cloudtrail.svg" },
    { id: "observability-cloudwatch", name: "CloudWatch Metrics", icon: "/images/aws-icons/observability-cloudwatch.svg" },
    { id: "threat-guardduty", name: "GuardDuty Threats", icon: "/images/aws-icons/threat-guardduty.svg" },
    { id: "compliance-sechub", name: "Security Hub", icon: "/images/aws-icons/compliance-sechub.svg" },
    { id: "backup-resilience", name: "AWS Backup WORM", icon: "/images/aws-icons/backup-resilience.svg" },
    { id: "messaging-sns-sqs", name: "SNS & SQS", icon: "/images/aws-icons/messaging-sns-sqs.svg" },
    { id: "decoupled-eventbridge", name: "EventBridge", icon: "/images/aws-icons/decoupled-eventbridge.svg" },
    { id: "aiml-sagemaker", name: "SageMaker AI", icon: "/images/aws-icons/aiml-sagemaker.svg" },
    { id: "governance-org", name: "AWS Organizations", icon: "/images/aws-icons/governance-org.svg" },
    { id: "dns-route53", name: "Route 53 DNS", icon: "/images/aws-icons/dns-route53.svg" },
    { id: "analytics-opensearch", name: "OpenSearch", icon: "/images/aws-icons/analytics-opensearch.svg" }
  ];

  const pillars = ["all", "Security", "Reliability", "Operational Excellence", "Cost Optimization", "Performance Efficiency"];
  const severities = ["all", "Critical", "High", "Medium", "Low"];

  const quickChips = [
    { label: "⚡ Critical Only", filter: { severity: "Critical" } },
    { label: "🛡️ Security Pillar", filter: { pillar: "Security" } },
    { label: "🪣 S3 Storage", filter: { category: "storage-s3" } },
    { label: "🔑 IAM Least Privilege", filter: { category: "iam-access" } },
    { label: "🔐 KMS & Secrets", filter: { category: "security-kms" } },
    { label: "☸️ EKS Defense", filter: { category: "container-eks" } },
    { label: "🌐 Zero Trust VPC", filter: { category: "network-vpc" } }
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
        return { pill: "bg-blue-500/10 text-blue-300 border-blue-500/30", dot: "bg-blue-500" };
    }
  };

  const getPillarBadge = (p) => {
    switch (p) {
      case "Security":
        return { pill: "bg-purple-500/10 text-purple-300 border-purple-500/30", dot: "bg-purple-400" };
      case "Reliability":
        return { pill: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30", dot: "bg-emerald-400" };
      case "Operational Excellence":
        return { pill: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30", dot: "bg-cyan-400" };
      case "Cost Optimization":
        return { pill: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30", dot: "bg-indigo-400" };
      default:
        return { pill: "bg-teal-500/10 text-teal-300 border-teal-500/30", dot: "bg-teal-400" };
    }
  };

  const copyToClipboard = (text, e) => {
    navigator.clipboard.writeText(text);
    const target = e.currentTarget;
    const orig = target.innerHTML;
    target.innerHTML = "Copied ✓";
    setTimeout(() => { target.innerHTML = orig; }, 2000);
  };

  const downloadSvgFile = (svgStr, filename) => {
    try {
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (filename || "aws-architecture") + ".svg";
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
      out = out.replace(/\b(package|default|import|not|some|in|every|if|else)\b/g, '<span class="text-purple-400 font-bold">$1</span>');
      out = out.replace(/\b(allow|deny|msg)\b/g, '<span class="text-rose-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(input|data)\b/g, '<span class="text-cyan-400 font-semibold">$1</span>');
    } else if (lang === "tf") {
      out = out.replace(/\b(resource|data|variable|output|locals|provider|terraform|module)\b/g, '<span class="text-purple-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(var|local|each|count)\b/g, '<span class="text-cyan-400 font-semibold">$1</span>');
    }

    tokens.forEach((t, i) => {
      out = out.replace(`___TOK${i}___`, t);
    });

    return out;
  }

  const getCategoryCount = (catId) => {
    if (catId === "all") return data.length;
    return data.filter((x) => x.category === catId).length;
  };

  return (
    <div className="w-full">
      <OpenGraph
        title="1,000+ AWS Architecture Best Practices | Obsidian Pele, OPA & Terraform"
        description="Explore 1,000+ AWS Well-Architected and CIS Benchmark defensive architecture diagrams rendered with Obsidian Pele, paired with OPA Rego policies and Terraform IaC."
        tags={["AWS Best Practices", "Obsidian Pele", "Architecture Diagrams", "OPA Rego", "Terraform", "Cloud Security"]}
      />

      {/* Hero Section */}
      <section className="kube-tools-hero relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-cyan-500/15 blur-3xl rounded-full" aria-hidden="true" />
        <div className="relative mx-auto max-w-screen-xl px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="kube-tools-hero-copy">
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-200 border border-purple-500/30 shadow-sm backdrop-blur-sm">
              <span className="flex items-center gap-1.5 text-purple-300">
                <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>
                Powered by Obsidian Pele
              </span>
              <span className="opacity-40">•</span>
              <span className="text-emerald-300 flex items-center gap-1">
                <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                Official AWS Icons
              </span>
              <span className="opacity-40">•</span>
              <span className="text-white font-mono">1,032 Verified Blueprints</span>
            </div>
            <h1 className="tracking-tight">1,000+ AWS Architecture Best Practices <br className="hidden sm:inline" /><span>with Pele, OPA &amp; Terraform</span></h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">Production-ready AWS Well-Architected defensive patterns. Instant vector SVG rendering via Obsidian Pele, executable OPA Rego policies for CI/CD guardrails, and complete Terraform IaC templates.</p>

            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <a className="kube-contribute-primary inline-flex items-center gap-2 shadow-lg shadow-purple-500/20" href="#architecture-catalog">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                Browse 1,000+ Architectures
              </a>
              <a className="kube-tools-star inline-flex items-center gap-2" href="https://github.com/obsidianmd/pele" target="_blank" rel="noreferrer">
                <span aria-hidden="true" className="text-amber-400">★</span>
                <strong>Obsidian Pele</strong>
                <small>Lightning-Fast Mermaid Renderer ↗</small>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Highlight Grid */}
      <section className="border-y border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#15101d]">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] shadow-sm border border-slate-200/80 dark:border-white/10 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topologies</span>
              </div>
              <strong className="block text-3xl font-extrabold text-slate-900 dark:text-white">1,032</strong>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Vector Pele SVGs</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] shadow-sm border border-slate-200/80 dark:border-white/10 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AWS Domains</span>
              </div>
              <strong className="block text-3xl font-extrabold text-slate-900 dark:text-white">24</strong>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Official Service Icons</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] shadow-sm border border-slate-200/80 dark:border-white/10 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Guardrails</span>
              </div>
              <strong className="block text-3xl font-extrabold text-slate-900 dark:text-white">1,032</strong>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">OPA Rego Policies</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] shadow-sm border border-slate-200/80 dark:border-white/10 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Infrastructure</span>
              </div>
              <strong className="block text-3xl font-extrabold text-slate-900 dark:text-white">1,032</strong>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Terraform Modules</span>
            </div>
          </div>
        </div>
      </section>

      {/* Explorer Section */}
      <section id="architecture-catalog" className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="kube-tools-directory-heading mb-8">
          <div>
            <p className="kube-label">Architecture Catalog</p>
            <h2>Search, Filter &amp; Inspect Architecture Patterns</h2>
          </div>
          <p>Filter by AWS service domain, Well-Architected pillar, or severity. Inspect the Pele SVG architecture diagram, review and copy the OPA Rego policy to guard your CI/CD, or grab the Terraform IaC snippet.</p>
        </div>

        {/* Filter Card */}
        <div className="mb-8 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#161120] p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search 1,000+ architectures by service, title, compliance (e.g. S3, KMS, IMDSv2)..."
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              {query && (
                <button onClick={() => { setQuery(""); setPage(1); }} className="absolute right-3 top-3 h-5 w-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-white flex items-center justify-center text-xs">✕</button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={severity}
                onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
                className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:outline-none"
              >
                {severities.map((s) => (
                  <option key={s} value={s}>{s === "all" ? "Severity: All" : `Severity: ${s}`}</option>
                ))}
              </select>
              <select
                value={pillar}
                onChange={(e) => { setPillar(e.target.value); setPage(1); }}
                className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:outline-none"
              >
                {pillars.map((p) => (
                  <option key={p} value={p}>{p === "all" ? "Pillar: All" : `Pillar: ${p}`}</option>
                ))}
              </select>
              {(query || category !== "all" || pillar !== "all" || severity !== "all") && (
                <button
                  onClick={() => { setQuery(""); setCategory("all"); setPillar("all"); setSeverity("all"); setPage(1); }}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
                >
                  Reset All
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-white/5">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">Quick Filters:</span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (chip.filter.severity) setSeverity(chip.filter.severity);
                  if (chip.filter.pillar) setPillar(chip.filter.pillar);
                  if (chip.filter.category) setCategory(chip.filter.category);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-purple-500/40 hover:text-purple-300 transition"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Category Pill Bar with AWS Icons & Blueprint Counts */}
          <div className="mt-4 border-t border-slate-100 dark:border-white/5 pt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-brand-gray-400">Filter by AWS Domain (Official AWS Service Icons)</p>
              <span className="text-[11px] text-slate-400 font-mono">{categories.length - 1} Domains</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {categories.map((cat) => {
                const count = getCategoryCount(cat.id);
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setCategory(cat.id); setPage(1); }}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                      isActive
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-400/50"
                        : "border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.07]"
                    }`}
                  >
                    {cat.icon ? (
                      <img src={cat.icon} className="w-4 h-4 shrink-0 rounded object-contain" alt="" loading="lazy" />
                    ) : (
                      <svg className="w-3.5 h-3.5 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                    )}
                    <span>{cat.name}</span>
                    <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Header */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-3"></div>
            <p className="text-slate-400">Loading 1,000+ AWS Architecture Patterns with Obsidian Pele...</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Showing <span className="text-purple-400 font-bold">{filtered.length}</span> of {data.length} blueprints
                {category !== "all" && <span className="text-purple-400 font-bold ml-1">in {categories.find(c => c.id === category)?.name}</span>}
              </p>
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Direct vector Pele rendering
              </span>
            </div>

            {currentItems.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-12 text-center bg-slate-50/50 dark:bg-white/[0.01]">
                <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl mb-3">🔍</div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No architecture blueprints match your filter</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">Try broadening your search term or resetting domain and severity filters.</p>
                <button
                  onClick={() => { setQuery(""); setCategory("all"); setPillar("all"); setSeverity("all"); setPage(1); }}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {currentItems.map((item) => {
                  const activeTab = activeTabs[item.id] || "diagram";
                  const sev = getSeverityBadge(item.severity);
                  const pBadge = getPillarBadge(item.pillar);
                  const iconPath = item.icon_url || (`/images/aws-icons/${item.category}.svg`);

                  return (
                    <div key={item.id} className="group flex flex-col rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#15101e] p-5 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-300">
                      {/* Top Metadata Row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 p-2 flex items-center justify-center shadow-inner group-hover:border-purple-500/40 transition">
                            <img src={iconPath} className="w-full h-full object-contain" alt={item.service} loading="lazy" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="rounded font-mono text-[11px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-white/[0.05] text-purple-600 dark:text-purple-300 border border-slate-200 dark:border-white/10">
                                {item.id}
                              </span>
                              <span className={`inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${pBadge.pill}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${pBadge.dot}`}></span>
                                {item.pillar}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">{item.service}</span>
                            <span className="text-[11px] text-slate-400 ml-1">&bull; {item.category_name}</span>
                          </div>
                        </div>

                        <span className={`inline-flex items-center gap-1.5 rounded-full text-[11px] font-semibold px-2.5 py-1 border ${sev.pill} shrink-0`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`}></span>
                          {item.severity}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-purple-400 transition">{item.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>

                      {/* Segmented Tab Switcher */}
                      <div className="bg-slate-100 dark:bg-[#0c0914] p-1 rounded-xl flex gap-1 mb-3 border border-slate-200/60 dark:border-white/5 text-xs font-semibold">
                        {[
                          { id: "diagram", label: "📐 Diagram" },
                          { id: "opa", label: "🛡️ OPA Rego" },
                          { id: "tf", label: "🏗️ Terraform" },
                          { id: "compliance", label: "📋 Compliance" }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setActiveTabs({ ...activeTabs, [item.id]: t.id })}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-center transition ${
                              activeTab === t.id
                                ? "bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm font-bold"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content Canvas */}
                      <div className="flex-1 flex flex-col rounded-xl overflow-hidden">
                        {activeTab === "diagram" && (
                          <div className="relative flex flex-col flex-1 rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-100/90 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1.5 font-mono text-[10px] text-purple-400 font-semibold">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                                PELE ARCHITECTURE-BETA
                              </span>
                              <div className="flex items-center gap-2">
                                <button onClick={(e) => copyToClipboard(item.mermaid, e)} className="hover:text-purple-400 transition">Copy Mermaid</button>
                                <button onClick={() => downloadSvgFile(item.svg, item.id)} className="hover:text-purple-400 transition">Download SVG ⭳</button>
                                <button onClick={() => setModalItem(item)} className="text-purple-400 font-bold hover:text-purple-300">Fullscreen ↗</button>
                              </div>
                            </div>
                            <div className="blueprint-canvas flex-1 flex items-center justify-center p-4 overflow-x-auto min-h-[180px]">
                              <div className="pele-svg-container w-full flex justify-center" dangerouslySetInnerHTML={{ __html: item.svg }} />
                            </div>
                          </div>
                        )}

                        {activeTab === "opa" && (
                          <div className="flex flex-col flex-1 rounded-xl border border-slate-200/80 dark:border-white/10 bg-[#0d0915] overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/5 text-[11px]">
                              <span className="font-mono text-purple-400 font-bold">policy.rego</span>
                              <button onClick={(e) => copyToClipboard(item.opa_policy, e)} className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold transition">Copy Policy</button>
                            </div>
                            <pre className="custom-scrollbar overflow-x-auto p-3 text-xs font-mono text-slate-200 leading-relaxed max-h-[220px]">
                              <code dangerouslySetInnerHTML={{ __html: highlightCode(item.opa_policy, "rego") }} />
                            </pre>
                          </div>
                        )}

                        {activeTab === "tf" && (
                          <div className="flex flex-col flex-1 rounded-xl border border-slate-200/80 dark:border-white/10 bg-[#0d0915] overflow-hidden">
                            <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/5 text-[11px]">
                              <span className="font-mono text-cyan-400 font-bold">main.tf</span>
                              <button onClick={(e) => copyToClipboard(item.terraform, e)} className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold transition">Copy HCL</button>
                            </div>
                            <pre className="custom-scrollbar overflow-x-auto p-3 text-xs font-mono text-slate-200 leading-relaxed max-h-[220px]">
                              <code dangerouslySetInnerHTML={{ __html: highlightCode(item.terraform, "tf") }} />
                            </pre>
                          </div>
                        )}

                        {activeTab === "compliance" && (
                          <div className="flex flex-col flex-1 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-3 text-xs space-y-3">
                            <div>
                              <strong className="block text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[10px] font-bold">Compliance Benchmarks:</strong>
                              <div className="flex flex-wrap gap-1.5">
                                {item.compliance?.map((c) => (
                                  <span key={c} className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 text-[11px] font-mono">{c}</span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <strong className="block text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider text-[10px] font-bold">Remediation Action:</strong>
                              <div className="rounded-lg bg-white dark:bg-[#0c0814] p-2.5 border border-slate-200 dark:border-white/10 flex items-start gap-2">
                                <span className="text-purple-400 text-sm">🛡️</span>
                                <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">{item.remediation}</p>
                              </div>
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
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Page <strong className="text-purple-400">{page}</strong> of <strong>{totalPages}</strong> ({filtered.length} blueprints)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page <= 1}
                    onClick={() => { setPage((p) => p - 1); document.getElementById("architecture-catalog")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="rounded-xl border border-slate-200 dark:border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] disabled:opacity-40"
                  >
                    ← Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => { setPage((p) => p + 1); document.getElementById("architecture-catalog")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="rounded-xl border border-slate-200 dark:border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Modal with Fullscreen Blueprint Grid */}
      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative flex flex-col w-full max-w-5xl max-h-[92vh] rounded-3xl border border-white/10 bg-[#161120] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 p-2 shrink-0 flex items-center justify-center shadow-inner">
                  <img src={modalItem.icon_url || (`/images/aws-icons/${modalItem.category}.svg`)} className="w-full h-full object-contain" alt={modalItem.service} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30">{modalItem.id}</span>
                    <span className="text-xs text-slate-300 font-semibold">{modalItem.service} &bull; {modalItem.category_name}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${getSeverityBadge(modalItem.severity).pill}`}>
                      {modalItem.severity}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${getPillarBadge(modalItem.pillar).pill}`}>
                      {modalItem.pillar}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{modalItem.title}</h2>
                </div>
              </div>
              <button onClick={() => setModalItem(null)} className="h-9 w-9 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="blueprint-canvas rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center relative min-h-[280px]">
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button onClick={(e) => copyToClipboard(modalItem.mermaid, e)} className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-purple-300 hover:text-white transition">Copy Mermaid</button>
                  <button onClick={() => downloadSvgFile(modalItem.svg, modalItem.id)} className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition shadow-md shadow-purple-500/20">Download SVG ⭳</button>
                </div>
                <div className="pele-svg-container w-full flex justify-center py-4" dangerouslySetInnerHTML={{ __html: modalItem.svg }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Architectural Blueprint Description</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{modalItem.description}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Remediation &amp; Guardrail Guidance</h4>
                  <div className="rounded-xl bg-black/30 p-3 border border-white/5 flex items-start gap-2">
                    <span className="text-purple-400">🛡️</span>
                    <p className="text-xs font-mono text-slate-300 leading-relaxed">{modalItem.remediation}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-[#0d0915] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/5 text-xs">
                    <span className="font-mono text-purple-400 font-bold">policy.rego (OPA Guardrail)</span>
                    <button onClick={(e) => copyToClipboard(modalItem.opa_policy, e)} className="text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition">Copy Policy</button>
                  </div>
                  <pre className="custom-scrollbar p-3.5 text-xs font-mono text-slate-200 leading-relaxed max-h-[220px] overflow-x-auto">
                    <code dangerouslySetInnerHTML={{ __html: highlightCode(modalItem.opa_policy, "rego") }} />
                  </pre>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0d0915] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/5 text-xs">
                    <span className="font-mono text-cyan-400 font-bold">main.tf (Compliant IaC)</span>
                    <button onClick={(e) => copyToClipboard(modalItem.terraform, e)} className="text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition">Copy HCL</button>
                  </div>
                  <pre className="custom-scrollbar p-3.5 text-xs font-mono text-slate-200 leading-relaxed max-h-[220px] overflow-x-auto">
                    <code dangerouslySetInnerHTML={{ __html: highlightCode(modalItem.terraform, "tf") }} />
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
