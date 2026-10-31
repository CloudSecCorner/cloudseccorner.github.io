import React, { useEffect, useState, useMemo } from "react";
import OpenGraph from "./OpenGraph";

export default function AwsArchitectures() {
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

  const domains = [
    { id: "all", name: "All Domains", icon: "⚡", categoryIds: [] },
    { id: "identity-governance", name: "Identity & Governance", icon: "🔑", categoryIds: ["iam-access", "governance-org"] },
    { id: "compute-containers", name: "Compute & Containers", icon: "⚡", categoryIds: ["compute-ec2", "container-eks", "container-ecs"] },
    { id: "storage-databases", name: "Storage & Databases", icon: "🗄️", categoryIds: ["storage-s3", "database-rds", "nosql-dynamodb"] },
    { id: "network-perimeter", name: "Network & Perimeter", icon: "🌐", categoryIds: ["network-vpc", "perimeter-apigateway", "edge-cloudfront", "waf-shield", "dns-route53"] },
    { id: "security-kms-posture", name: "Security, KMS & Posture", icon: "🔒", categoryIds: ["security-kms", "compliance-sechub", "backup-resilience"] },
    { id: "telemetry-siem", name: "Telemetry & SIEM", icon: "📊", categoryIds: ["logging-cloudtrail", "observability-cloudwatch", "threat-guardduty", "analytics-opensearch"] },
    { id: "serverless-ai", name: "Serverless & AI Workloads", icon: "🧠", categoryIds: ["serverless-lambda", "messaging-sns-sqs", "decoupled-eventbridge", "aiml-sagemaker"] }
  ];

  const categories = [
    { id: "all", name: "All 24 Domains", icon: null, domain: "all" },
    { id: "storage-s3", name: "S3 & Object Storage", icon: "/images/aws-icons/storage-s3.svg", domain: "storage-databases" },
    { id: "iam-access", name: "IAM & Identity Governance", icon: "/images/aws-icons/iam-access.svg", domain: "identity-governance" },
    { id: "network-vpc", name: "VPC & Network Security", icon: "/images/aws-icons/network-vpc.svg", domain: "network-perimeter" },
    { id: "compute-ec2", name: "EC2 & Elastic Compute", icon: "/images/aws-icons/compute-ec2.svg", domain: "compute-containers" },
    { id: "database-rds", name: "RDS & Relational Databases", icon: "/images/aws-icons/database-rds.svg", domain: "storage-databases" },
    { id: "nosql-dynamodb", name: "DynamoDB & NoSQL Datastores", icon: "/images/aws-icons/nosql-dynamodb.svg", domain: "storage-databases" },
    { id: "container-eks", name: "EKS & Kubernetes Workloads", icon: "/images/aws-icons/container-eks.svg", domain: "compute-containers" },
    { id: "container-ecs", name: "ECS & Container Tasks", icon: "/images/aws-icons/container-ecs.svg", domain: "compute-containers" },
    { id: "serverless-lambda", name: "Lambda & Serverless Compute", icon: "/images/aws-icons/serverless-lambda.svg", domain: "serverless-ai" },
    { id: "perimeter-apigateway", name: "API Gateway & Ingress", icon: "/images/aws-icons/perimeter-apigateway.svg", domain: "network-perimeter" },
    { id: "edge-cloudfront", name: "CloudFront & Edge Defense", icon: "/images/aws-icons/edge-cloudfront.svg", domain: "network-perimeter" },
    { id: "waf-shield", name: "WAF & DDoS Protection", icon: "/images/aws-icons/waf-shield.svg", domain: "network-perimeter" },
    { id: "security-kms", name: "KMS, Encryption & Secrets", icon: "/images/aws-icons/security-kms.svg", domain: "security-kms-posture" },
    { id: "logging-cloudtrail", name: "CloudTrail & Audit Logging", icon: "/images/aws-icons/logging-cloudtrail.svg", domain: "telemetry-siem" },
    { id: "observability-cloudwatch", name: "CloudWatch & Telemetry", icon: "/images/aws-icons/observability-cloudwatch.svg", domain: "telemetry-siem" },
    { id: "threat-guardduty", name: "GuardDuty & Threat Detection", icon: "/images/aws-icons/threat-guardduty.svg", domain: "telemetry-siem" },
    { id: "compliance-sechub", name: "Security Hub & CSPM", icon: "/images/aws-icons/compliance-sechub.svg", domain: "security-kms-posture" },
    { id: "backup-resilience", name: "AWS Backup & DR Resilience", icon: "/images/aws-icons/backup-resilience.svg", domain: "security-kms-posture" },
    { id: "messaging-sns-sqs", name: "SQS, SNS & Event Queues", icon: "/images/aws-icons/messaging-sns-sqs.svg", domain: "serverless-ai" },
    { id: "decoupled-eventbridge", name: "EventBridge & Event-Driven", icon: "/images/aws-icons/decoupled-eventbridge.svg", domain: "serverless-ai" },
    { id: "aiml-sagemaker", name: "SageMaker & AI Workloads", icon: "/images/aws-icons/aiml-sagemaker.svg", domain: "serverless-ai" },
    { id: "governance-org", name: "Organizations & Control Tower", icon: "/images/aws-icons/governance-org.svg", domain: "identity-governance" },
    { id: "dns-route53", name: "Route 53 & DNS Security", icon: "/images/aws-icons/dns-route53.svg", domain: "network-perimeter" },
    { id: "analytics-opensearch", name: "OpenSearch & Log Analytics", icon: "/images/aws-icons/analytics-opensearch.svg", domain: "telemetry-siem" }
  ];

  const pillars = ["all", "Security", "Reliability", "Operational Excellence", "Cost Optimization", "Performance Efficiency"];
  const severities = ["all", "Critical", "High", "Medium", "Low"];
  const complianceStandards = ["all", "CIS AWS", "NIST", "PCI-DSS", "SOC 2", "ISO 27001", "FedRAMP"];

  const quickChips = [
    { label: "⚡ Critical Only", filter: { severity: "Critical" } },
    { label: "🛡️ Security Pillar", filter: { pillar: "Security" } },
    { label: "🪣 S3 Storage", filter: { category: "storage-s3", domain: "storage-databases" } },
    { label: "🔑 IAM Governance", filter: { category: "iam-access", domain: "identity-governance" } },
    { label: "🔐 KMS & HSM", filter: { category: "security-kms", domain: "security-kms-posture" } },
    { label: "☸️ EKS Defense", filter: { category: "container-eks", domain: "compute-containers" } },
    { label: "🌐 Zero Trust VPC", filter: { category: "network-vpc", domain: "network-perimeter" } }
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
      if (query) {
        const q = query.toLowerCase().trim();
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
  }, [data, selectedDomain, category, pillar, severity, compliance, query]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentItems = useMemo(() => {
    return filtered.slice((page - 1) * pageSize, page * pageSize);
  }, [filtered, page, pageSize]);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case "Critical":
        return {
          pill: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 dark:bg-rose-500/15",
          dot: "bg-rose-500 shadow-sm shadow-rose-500/50 animate-pulse"
        };
      case "High":
        return {
          pill: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:bg-amber-500/15",
          dot: "bg-amber-500 shadow-sm shadow-amber-500/50"
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
      a.download = `${filename || "aws-architecture"}.svg`;
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
      out = out.replace(/\b(resource|data|variable|output|locals|provider|terraform|module|lifecycle|prevent_destroy)\b/g, '<span class="text-purple-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(var|local|each|count)\b/g, '<span class="text-cyan-400 font-semibold">$1</span>');
      out = out.replace(/([a-zA-Z_][a-zA-Z0-9_-]*)\s*=/g, '<span class="text-blue-300 font-medium">$1</span> =');
    }

    tokens.forEach((t, i) => {
      out = out.replace(`___TOK${i}___`, t);
    });

    return out;
  }

  const isFiltered = selectedDomain !== "all" || category !== "all" || pillar !== "all" || severity !== "all" || compliance !== "all" || query;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08060d] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <OpenGraph
        title="1,000+ AWS Architecture Best Practices | Obsidian Pele, OPA & Terraform"
        description="Explore 1,000+ AWS Well-Architected and CIS Benchmark defensive architecture diagrams rendered with Obsidian Pele, paired with production OPA Rego policies and hardened Terraform IaC modules across 7 Core Security Domains."
        tags={["AWS Best Practices", "Obsidian Pele", "Architecture Diagrams", "OPA Rego", "Terraform", "Cloud Security"]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-white/[0.08] bg-gradient-to-b from-purple-50/70 via-white to-slate-50 dark:from-[#180e28] dark:via-[#100a1c] dark:to-[#08060d] py-16 px-4 sm:px-6 lg:px-10 transition-colors">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-r from-purple-600/15 via-amber-500/10 to-indigo-600/15 blur-3xl rounded-full" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-200 border border-purple-300 dark:border-purple-500/30 shadow-sm backdrop-blur-md">
              <span className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                <span className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
                Obsidian Pele Engine
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300 font-mono">
                Official AWS SVG Icons
              </span>
              <span className="opacity-40">•</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold">1,032 Architecture Blueprints</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              1,000+ AWS Architecture Best Practices <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-600 via-amber-600 to-indigo-600 dark:from-amber-400 dark:via-purple-300 dark:to-cyan-300 bg-clip-text text-transparent">
                with Pele, OPA &amp; Terraform
              </span>
            </h1>

            <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl font-normal">
              Enterprise defensive blueprints organized across 7 Core Security Domains and 24 AWS services. Every blueprint features responsive multi-tier vector SVG diagrams rendered with Obsidian Pele, executable OPA Rego policies for CI/CD gating, and hardened Terraform IaC modules.
            </p>

            {/* Quick Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 w-full">
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-4 sm:p-5 shadow-sm dark:shadow-none backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Topologies</span>
                </div>
                <strong className="block text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">1,032</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">Vector Pele SVGs</span>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-4 sm:p-5 shadow-sm dark:shadow-none backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Security Domains</span>
                </div>
                <strong className="block text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">7 Core / 24 Svcs</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">Official Service Icons</span>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-4 sm:p-5 shadow-sm dark:shadow-none backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Guardrails</span>
                </div>
                <strong className="block text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">1,032</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">OPA Rego Policies</span>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-4 sm:p-5 shadow-sm dark:shadow-none backdrop-blur-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Infrastructure</span>
                </div>
                <strong className="block text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">1,032</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">Terraform IaC Modules</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              placeholder="Search by AWS service, defensive title, OPA rule, CIS benchmark, or NIST control..."
              className="w-full rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-3.5 pl-11 pr-24 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm dark:shadow-inner focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition"
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
                  if (chip.filter.severity) setSeverity(chip.filter.severity);
                  if (chip.filter.pillar) setPillar(chip.filter.pillar);
                  if (chip.filter.category) setCategory(chip.filter.category);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-200 shadow-xs transition"
              >
                {chip.label}
              </button>
            ))}
            {isFiltered && (
              <button
                onClick={() => {
                  setSelectedDomain("all");
                  setCategory("all");
                  setPillar("all");
                  setSeverity("all");
                  setCompliance("all");
                  setQuery("");
                  setPage(1);
                }}
                className="ml-auto text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* 7 Core Cloud Security Domains Tabs Bar */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-100/80 dark:bg-[#07050d] p-3 shadow-xs">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span>🛡️</span> Core Security Domains
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {selectedDomain === "all" ? "All 7 Domains" : domains.find((d) => d.id === selectedDomain)?.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {domains.map((dom) => {
                const active = selectedDomain === dom.id;
                const count =
                  dom.id === "all"
                    ? data.length
                    : data.filter((x) => dom.categoryIds.includes(x.category)).length;

                return (
                  <button
                    key={dom.id}
                    onClick={() => {
                      setSelectedDomain(dom.id);
                      setCategory("all");
                      setPage(1);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                      active
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                        : "bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <span>{dom.icon}</span>
                    <span>{dom.name}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
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

          {/* 24 AWS Domain Selector Pills (Filtered by Domain) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Service Categories {selectedDomain !== "all" && `(${domains.find((d) => d.id === selectedDomain)?.name})`}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Showing {filtered.length} matching blueprints</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map((cat) => {
                const active = category === cat.id;
                const count =
                  cat.id === "all"
                    ? selectedDomain === "all"
                      ? data.length
                      : data.filter((x) => domains.find((d) => d.id === selectedDomain)?.categoryIds.includes(x.category)).length
                    : data.filter((x) => x.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategory(cat.id);
                      setPage(1);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition border ${
                      active
                        ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-500/30"
                        : "bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-purple-400 hover:bg-purple-50/40 dark:hover:bg-white/[0.06]"
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

          {/* Secondary Controls: Pillar, Severity & Compliance */}
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
                        ? "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-200 border border-purple-300 dark:border-purple-500/40 font-semibold"
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
                        ? "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-200 border border-rose-300 dark:border-rose-500/40 font-semibold"
                        : "bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Compliance:</span>
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
                        ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-500/40 font-semibold"
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

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center p-20 text-slate-500 dark:text-slate-400">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            <p className="mt-4 font-medium">Loading 1,000+ AWS Architecture Best Practices with Obsidian Pele…</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="p-16 text-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02]">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No AWS architectures match your filter criteria</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">Try clearing your search query or selecting "All Domains".</p>
            <button
              onClick={() => {
                setSelectedDomain("all");
                setCategory("all");
                setPillar("all");
                setSeverity("all");
                setCompliance("all");
                setQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Architecture Cards Grid */}
        {!loading && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {currentItems.map((item) => {
              const activeTab = activeTabs[item.id] || "diagram";
              const sevBadge = getSeverityBadge(item.severity);

              return (
                <div
                  key={item.id}
                  className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] shadow-sm dark:shadow-xl hover:border-purple-500/50 hover:shadow-md dark:hover:border-purple-500/40 transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] bg-slate-50/60 dark:bg-white/[0.01]">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                          <img src={item.icon_url} alt="" className="h-full w-full object-contain" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{item.id}</span>
                            <span className="text-slate-400 dark:text-slate-600">•</span>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.service}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.category_name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sevBadge.pill}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${sevBadge.dot}`} />
                          {item.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                          {item.pillar}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h3>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{item.description}</p>
                  </div>

                  {/* Segmented Tabs Bar */}
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] bg-slate-100/90 dark:bg-[#07050d] px-4 py-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setActiveTabs({ ...activeTabs, [item.id]: "diagram" })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === "diagram" ? "bg-purple-600 text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        📐 Blueprint Diagram
                      </button>
                      <button
                        onClick={() => setActiveTabs({ ...activeTabs, [item.id]: "opa" })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === "opa" ? "bg-purple-600 text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        🛡️ OPA Rego
                      </button>
                      <button
                        onClick={() => setActiveTabs({ ...activeTabs, [item.id]: "tf" })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === "tf" ? "bg-purple-600 text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        🏗️ Terraform IaC
                      </button>
                      <button
                        onClick={() => setActiveTabs({ ...activeTabs, [item.id]: "compliance" })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === "compliance" ? "bg-purple-600 text-white font-bold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        📋 Compliance
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadSvgFile(item.svg, item.id)}
                        className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-amber-300 flex items-center gap-1 transition"
                        title="Download Vector SVG"
                      >
                        <span>Download SVG</span> ⭳
                      </button>
                      <button
                        onClick={() => setModalItem(item)}
                        className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white flex items-center gap-1 transition"
                        title="Fullscreen Inspection"
                      >
                        ⛶
                      </button>
                    </div>
                  </div>

                  {/* Tab Body */}
                  <div className="flex-1 p-4 bg-slate-50/50 dark:bg-[#05030a]">
                    {activeTab === "diagram" && (
                      <div
                        className="blueprint-canvas relative flex items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#090613] overflow-x-auto min-h-[220px]"
                        style={{
                          backgroundImage: "radial-gradient(rgba(168, 85, 247, 0.14) 1px, transparent 0)",
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
                      <div className="relative rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#090613] p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[240px]">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 dark:border-white/5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                            <span className="text-[11px] text-slate-400 ml-2 font-mono">policy.rego</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(item.opa_policy, `opa-${item.id}`)}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                          >
                            {copiedId === `opa-${item.id}` ? "✓ Copied" : "Copy Rego"}
                          </button>
                        </div>
                        <pre dangerouslySetInnerHTML={{ __html: highlightCode(item.opa_policy, "rego") }} />
                      </div>
                    )}

                    {activeTab === "tf" && (
                      <div className="relative rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#090613] p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[240px]">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 dark:border-white/5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                            <span className="text-[11px] text-slate-400 ml-2 font-mono">main.tf</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(item.terraform, `tf-${item.id}`)}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                          >
                            {copiedId === `tf-${item.id}` ? "✓ Copied" : "Copy Terraform"}
                          </button>
                        </div>
                        <pre dangerouslySetInnerHTML={{ __html: highlightCode(item.terraform, "tf") }} />
                      </div>
                    )}

                    {activeTab === "compliance" && (
                      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090613] p-4 text-xs space-y-3">
                        <div>
                          <span className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Mapped Compliance Frameworks:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {item.compliance &&
                              item.compliance.map((c, i) => (
                                <span key={i} className="px-2.5 py-0.5 rounded bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 text-[11px] font-mono">
                                  {c}
                                </span>
                              ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Architecture Remediation Guide:</span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{item.remediation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-6 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} blueprints
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => {
                  setPage((p) => Math.max(p - 1, 1));
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-3.5 py-1.5 font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                ← Previous
              </button>

              <span className="px-3 font-mono text-slate-900 dark:text-white font-bold">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => {
                  setPage((p) => Math.min(p + 1, totalPages));
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
                className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-3.5 py-1.5 font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/10 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Fullscreen Inspection Modal */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setModalItem(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-slate-200 dark:border-white/20 bg-white dark:bg-[#0e0918] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 p-5 bg-slate-50 dark:bg-[#0a0614]">
              <div className="flex items-center gap-3">
                <img src={modalItem.icon_url} alt="" className="h-7 w-7 object-contain" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">{modalItem.id}</span>
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

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div
                className="blueprint-canvas relative flex items-center justify-center p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#090613]"
                style={{
                  backgroundImage: "radial-gradient(rgba(168, 85, 247, 0.18) 1px, transparent 0)",
                  backgroundSize: "24px 24px"
                }}
              >
                <div
                  className="w-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto"
                  dangerouslySetInnerHTML={{ __html: modalItem.svg }}
                />
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

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-white/10 p-4 bg-slate-50 dark:bg-[#0a0614]">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Pillar: <strong className="text-slate-900 dark:text-white">{modalItem.pillar}</strong> • Severity:{" "}
                <strong className="text-rose-600 dark:text-rose-400">{modalItem.severity}</strong>
              </span>
              <button
                onClick={() => downloadSvgFile(modalItem.svg, modalItem.id)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition flex items-center gap-1.5"
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
