// AWS Architecture Best Practices Catalog Controller (Powered by Obsidian Pele)
// Ultra-Polished Professional Edition with Syntax Highlighting, Real AWS Icons & Blueprint Canvas

(function () {
  let container = null;

  const STATE = {
    allData: [],
    filteredData: [],
    query: '',
    category: 'all',
    pillar: 'all',
    severity: 'all',
    page: 1,
    pageSize: 12,
    activeTabs: {}, // item.id -> active tab name ('diagram', 'opa', 'tf', 'compliance')
    modalItem: null,
    modalTab: 'diagram'
  };

  // Categories config with official AWS Service Icons
  const CATEGORIES = [
    { id: 'all', name: 'All Categories', icon: null },
    { id: 'storage-s3', name: 'S3 & Storage', icon: '/images/aws-icons/storage-s3.svg' },
    { id: 'iam-access', name: 'IAM & Identity', icon: '/images/aws-icons/iam-access.svg' },
    { id: 'network-vpc', name: 'VPC & Perimeter', icon: '/images/aws-icons/network-vpc.svg' },
    { id: 'compute-ec2', name: 'EC2 Hardening', icon: '/images/aws-icons/compute-ec2.svg' },
    { id: 'database-rds', name: 'RDS & Aurora', icon: '/images/aws-icons/database-rds.svg' },
    { id: 'nosql-dynamodb', name: 'DynamoDB NoSQL', icon: '/images/aws-icons/nosql-dynamodb.svg' },
    { id: 'container-eks', name: 'EKS Defense', icon: '/images/aws-icons/container-eks.svg' },
    { id: 'container-ecs', name: 'ECS Containers', icon: '/images/aws-icons/container-ecs.svg' },
    { id: 'serverless-lambda', name: 'Lambda Serverless', icon: '/images/aws-icons/serverless-lambda.svg' },
    { id: 'perimeter-apigateway', name: 'API Gateway', icon: '/images/aws-icons/perimeter-apigateway.svg' },
    { id: 'edge-cloudfront', name: 'CloudFront Edge', icon: '/images/aws-icons/edge-cloudfront.svg' },
    { id: 'waf-shield', name: 'WAF & Shield', icon: '/images/aws-icons/waf-shield.svg' },
    { id: 'security-kms', name: 'KMS & Secrets', icon: '/images/aws-icons/security-kms.svg' },
    { id: 'logging-cloudtrail', name: 'CloudTrail Audit', icon: '/images/aws-icons/logging-cloudtrail.svg' },
    { id: 'observability-cloudwatch', name: 'CloudWatch Metrics', icon: '/images/aws-icons/observability-cloudwatch.svg' },
    { id: 'threat-guardduty', name: 'GuardDuty Threats', icon: '/images/aws-icons/threat-guardduty.svg' },
    { id: 'compliance-sechub', name: 'Security Hub', icon: '/images/aws-icons/compliance-sechub.svg' },
    { id: 'backup-resilience', name: 'AWS Backup WORM', icon: '/images/aws-icons/backup-resilience.svg' },
    { id: 'messaging-sns-sqs', name: 'SNS & SQS', icon: '/images/aws-icons/messaging-sns-sqs.svg' },
    { id: 'decoupled-eventbridge', name: 'EventBridge', icon: '/images/aws-icons/decoupled-eventbridge.svg' },
    { id: 'aiml-sagemaker', name: 'SageMaker AI', icon: '/images/aws-icons/aiml-sagemaker.svg' },
    { id: 'governance-org', name: 'AWS Organizations', icon: '/images/aws-icons/governance-org.svg' },
    { id: 'dns-route53', name: 'Route 53 DNS', icon: '/images/aws-icons/dns-route53.svg' },
    { id: 'analytics-opensearch', name: 'OpenSearch', icon: '/images/aws-icons/analytics-opensearch.svg' }
  ];

  const PILLARS = ['all', 'Security', 'Reliability', 'Operational Excellence', 'Cost Optimization', 'Performance Efficiency'];
  const SEVERITIES = ['all', 'Critical', 'High', 'Medium', 'Low'];

  // Quick chips for one-click discovery
  const QUICK_CHIPS = [
    { label: '⚡ Critical Only', filter: { severity: 'Critical' } },
    { label: '🛡️ Security Pillar', filter: { pillar: 'Security' } },
    { label: '🪣 S3 Storage', filter: { category: 'storage-s3' } },
    { label: '🔑 IAM Least Privilege', filter: { category: 'iam-access' } },
    { label: '🔐 KMS & Secrets', filter: { category: 'security-kms' } },
    { label: '☸️ EKS Defense', filter: { category: 'container-eks' } },
    { label: '🌐 Zero Trust VPC', filter: { category: 'network-vpc' } }
  ];

  // Syntax highlighting for OPA Rego and Terraform IaC
  function highlightCode(code, lang) {
    if (!code) return '';
    let out = escapeHtml(code);
    const tokens = [];

    // Comments (#...)
    out = out.replace(/(#[^\n]*)/g, match => {
      const id = `___TOK${tokens.length}___`;
      tokens.push(`<span class="text-slate-500 italic">${match}</span>`);
      return id;
    });

    // Double quoted strings ("...")
    out = out.replace(/(".*?"|'.*?')/g, match => {
      const id = `___TOK${tokens.length}___`;
      tokens.push(`<span class="text-emerald-400 font-medium">${match}</span>`);
      return id;
    });

    if (lang === 'rego') {
      out = out.replace(/\b(package|default|import|not|some|in|every|if|else)\b/g, '<span class="text-purple-400 font-bold">$1</span>');
      out = out.replace(/\b(allow|deny|msg)\b/g, '<span class="text-rose-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(input|data)\b/g, '<span class="text-cyan-400 font-semibold">$1</span>');
    } else if (lang === 'tf') {
      out = out.replace(/\b(resource|data|variable|output|locals|provider|terraform|module)\b/g, '<span class="text-purple-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(var|local|each|count)\b/g, '<span class="text-cyan-400 font-semibold">$1</span>');
    }

    tokens.forEach((t, i) => {
      out = out.replace(`___TOK${i}___`, t);
    });

    return out;
  }

  // Instant SVG file download helper
  function downloadSvgFile(svgStr, filename) {
    try {
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (filename || 'aws-architecture') + '.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }

  // Parse URL params
  function readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) STATE.query = params.get('q');
    if (params.has('category')) STATE.category = params.get('category');
    if (params.has('pillar')) STATE.pillar = params.get('pillar');
    if (params.has('severity')) STATE.severity = params.get('severity');
    if (params.has('page')) STATE.page = parseInt(params.get('page'), 10) || 1;
  }

  function updateUrlParams() {
    const params = new URLSearchParams();
    if (STATE.query) params.set('q', STATE.query);
    if (STATE.category !== 'all') params.set('category', STATE.category);
    if (STATE.pillar !== 'all') params.set('pillar', STATE.pillar);
    if (STATE.severity !== 'all') params.set('severity', STATE.severity);
    if (STATE.page > 1) params.set('page', STATE.page);

    const newQuery = params.toString();
    const newUrl = window.location.pathname + (newQuery ? '?' + newQuery : '') + window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }

  // Load dataset
  async function init() {
    container = document.getElementById('aws-architecture-app');
    if (!container) return;
    readUrlParams();
    try {
      const resp = await fetch('/data/aws-best-practices.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status + ' while fetching /data/aws-best-practices.json');
      STATE.allData = await resp.json();
      applyFilters();
      renderApp();
    } catch (err) {
      console.error('AWS Architecture Catalog Error:', err);
      if (container) {
        container.innerHTML = `
          <div class="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-300">
            <p class="font-bold text-lg">Failed to load AWS Architecture dataset</p>
            <p class="text-sm mt-1 text-slate-400">${escapeHtml(err.message)}</p>
            <p class="text-xs mt-3 text-slate-500">Please verify that /data/aws-best-practices.json is accessible.</p>
          </div>
        `;
      }
    }
  }

  function applyFilters() {
    const q = STATE.query.toLowerCase().trim();
    STATE.filteredData = STATE.allData.filter(item => {
      // Category
      if (STATE.category !== 'all' && item.category !== STATE.category) return false;
      // Pillar
      if (STATE.pillar !== 'all' && item.pillar !== STATE.pillar) return false;
      // Severity
      if (STATE.severity !== 'all' && item.severity !== STATE.severity) return false;
      // Search
      if (q) {
        const match =
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.service.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.compliance && item.compliance.some(c => c.toLowerCase().includes(q)));
        if (!match) return false;
      }
      return true;
    });

    const totalPages = Math.ceil(STATE.filteredData.length / STATE.pageSize) || 1;
    if (STATE.page > totalPages) STATE.page = totalPages;
    if (STATE.page < 1) STATE.page = 1;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getSeverityBadge(sev) {
    switch (sev) {
      case 'Critical':
        return {
          pill: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-500 animate-pulse'
        };
      case 'High':
        return {
          pill: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-500'
        };
      case 'Medium':
        return {
          pill: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
          dot: 'bg-yellow-500'
        };
      default:
        return {
          pill: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-500'
        };
    }
  }

  function getPillarBadge(pillar) {
    switch (pillar) {
      case 'Security':
        return {
          pill: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400'
        };
      case 'Reliability':
        return {
          pill: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'Operational Excellence':
        return {
          pill: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400'
        };
      case 'Cost Optimization':
        return {
          pill: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400'
        };
      default:
        return {
          pill: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
          dot: 'bg-teal-400'
        };
    }
  }

  function getCategoryCount(catId) {
    if (catId === 'all') return STATE.allData.length;
    return STATE.allData.filter(x => x.category === catId).length;
  }

  function renderApp() {
    updateUrlParams();

    const startIdx = (STATE.page - 1) * STATE.pageSize;
    const pageItems = STATE.filteredData.slice(startIdx, startIdx + STATE.pageSize);
    const totalPages = Math.ceil(STATE.filteredData.length / STATE.pageSize) || 1;

    const hasActiveFilters = STATE.query || STATE.category !== 'all' || STATE.pillar !== 'all' || STATE.severity !== 'all';

    let html = `
      <!-- Search, Quick Chips & Filter Controls -->
      <div class="mb-8 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#161120] p-5 sm:p-6 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search Bar -->
          <div class="relative flex-1">
            <svg class="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              id="aws-search-input"
              type="text"
              value="${escapeHtml(STATE.query)}"
              placeholder="Search 1,000+ blueprints (e.g. S3, KMS, IMDSv2, CIS AWS, Zero Trust, EKS)..."
              class="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition"
            />
            ${STATE.query ? `
              <button id="aws-clear-search" class="absolute right-3 top-3 h-5 w-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-white flex items-center justify-center text-xs">✕</button>
            ` : ''}
          </div>

          <!-- Dropdowns Row -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <!-- Severity Filter -->
            <select id="aws-severity-filter" class="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
              <option value="all">Severity: All Severities</option>
              ${SEVERITIES.filter(s => s !== 'all').map(s => `<option value="${s}" ${STATE.severity === s ? 'selected' : ''}>Severity: ${s}</option>`).join('')}
            </select>

            <!-- Pillar Filter -->
            <select id="aws-pillar-filter" class="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
              <option value="all">Pillar: All Pillars</option>
              ${PILLARS.filter(p => p !== 'all').map(p => `<option value="${p}" ${STATE.pillar === p ? 'selected' : ''}>Pillar: ${p}</option>`).join('')}
            </select>

            <!-- Reset Button -->
            ${hasActiveFilters ? `
              <button id="aws-reset-filters" class="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition">
                Reset All
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Quick Filter Tags -->
        <div class="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-white/5">
          <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">Quick Filters:</span>
          ${QUICK_CHIPS.map(chip => `
            <button
              data-quick-chip="${escapeHtml(JSON.stringify(chip.filter))}"
              class="quick-chip-btn rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-purple-500/40 hover:text-purple-300 transition"
            >
              ${chip.label}
            </button>
          `).join('')}
        </div>

        <!-- Categories Pill Bar with Official AWS SVG Icons & Dynamic Counts -->
        <div class="mt-4 border-t border-slate-100 dark:border-white/5 pt-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Filter by AWS Domain (Official AWS Service Icons)</p>
            <span class="text-[11px] text-slate-400 font-mono">${CATEGORIES.length - 1} Domains</span>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            ${CATEGORIES.map(cat => {
              const count = getCategoryCount(cat.id);
              const isActive = STATE.category === cat.id;
              return `
                <button
                  data-cat-id="${cat.id}"
                  class="aws-cat-pill inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 ring-2 ring-purple-400/50'
                      : 'border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/[0.07]'
                  }"
                >
                  ${cat.icon
                    ? `<img src="${cat.icon}" class="w-4 h-4 shrink-0 rounded object-contain" alt="" loading="lazy" />`
                    : `<svg class="w-3.5 h-3.5 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`
                  }
                  <span>${cat.name}</span>
                  <span class="rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }">${count}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Results Header & Active Filter Pills -->
      <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Showing <span class="font-extrabold text-purple-600 dark:text-purple-400">${STATE.filteredData.length}</span> of <span class="font-bold">${STATE.allData.length}</span> blueprints
            ${STATE.category !== 'all' ? ` in <span class="text-purple-400 font-bold">${CATEGORIES.find(c => c.id === STATE.category)?.name}</span>` : ''}
          </p>
        </div>
        <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span class="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Vector SVGs pre-rendered with Obsidian Pele</span>
        </div>
      </div>

      <!-- Empty State -->
      ${pageItems.length === 0 ? `
        <div class="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-12 text-center bg-slate-50/50 dark:bg-white/[0.01]">
          <div class="mx-auto h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl mb-3">🔍</div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">No architecture blueprints match your filter</h3>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">Try broadening your search term or resetting domain and severity filters.</p>
          <button id="aws-reset-empty" class="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition">
            Reset All Filters
          </button>
        </div>
      ` : `
        <!-- Cards Grid -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          ${pageItems.map(item => renderCard(item)).join('')}
        </div>

        <!-- Pagination -->
        ${renderPagination(totalPages)}
      `}

      <!-- Modal Container -->
      <div id="aws-modal-container"></div>
    `;

    container.innerHTML = html;
    attachEvents();
  }

  function renderCard(item) {
    const activeTab = STATE.activeTabs[item.id] || 'diagram';
    const sev = getSeverityBadge(item.severity);
    const pillar = getPillarBadge(item.pillar);
    const iconPath = item.icon_url || ('/images/aws-icons/' + item.category + '.svg');

    return `
      <div class="group flex flex-col rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#15101e] p-5 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/40 transition-all duration-300">
        <!-- Top Metadata Row -->
        <div class="flex items-start justify-between gap-3 mb-3">
          <!-- Service Icon + Service Info -->
          <div class="flex items-center gap-3">
            <div class="h-11 w-11 shrink-0 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 p-2 flex items-center justify-center shadow-inner group-hover:border-purple-500/40 transition">
              <img src="${iconPath}" class="w-full h-full object-contain" alt="${escapeHtml(item.service)}" loading="lazy" />
            </div>
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="rounded font-mono text-[11px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-white/[0.05] text-purple-600 dark:text-purple-300 border border-slate-200 dark:border-white/10">
                  ${escapeHtml(item.id)}
                </span>
                <span class="inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${pillar.pill}">
                  <span class="h-1.5 w-1.5 rounded-full ${pillar.dot}"></span>
                  ${escapeHtml(item.pillar)}
                </span>
              </div>
              <span class="text-xs font-bold text-slate-900 dark:text-white">
                ${escapeHtml(item.service)}
              </span>
              <span class="text-[11px] text-slate-400 ml-1">
                &bull; ${escapeHtml(item.category_name)}
              </span>
            </div>
          </div>

          <!-- Severity Badge -->
          <span class="inline-flex items-center gap-1.5 rounded-full text-[11px] font-semibold px-2.5 py-1 border ${sev.pill} shrink-0">
            <span class="h-1.5 w-1.5 rounded-full ${sev.dot}"></span>
            ${escapeHtml(item.severity)}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-purple-400 transition">
          ${escapeHtml(item.title)}
        </h3>

        <!-- Description -->
        <p class="text-xs text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 leading-relaxed">
          ${escapeHtml(item.description)}
        </p>

        <!-- Segmented Tab Switcher (macOS / Vercel pill style) -->
        <div class="bg-slate-100 dark:bg-[#0c0914] p-1 rounded-xl flex gap-1 mb-3 border border-slate-200/60 dark:border-white/5 text-xs font-semibold">
          <button
            data-tab-switch="${item.id}"
            data-tab-target="diagram"
            class="flex-1 py-1.5 px-2 rounded-lg text-center transition ${
              activeTab === 'diagram'
                ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
          >
            📐 Diagram
          </button>
          <button
            data-tab-switch="${item.id}"
            data-tab-target="opa"
            class="flex-1 py-1.5 px-2 rounded-lg text-center transition ${
              activeTab === 'opa'
                ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
          >
            🛡️ OPA Rego
          </button>
          <button
            data-tab-switch="${item.id}"
            data-tab-target="tf"
            class="flex-1 py-1.5 px-2 rounded-lg text-center transition ${
              activeTab === 'tf'
                ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
          >
            🏗️ Terraform
          </button>
          <button
            data-tab-switch="${item.id}"
            data-tab-target="compliance"
            class="flex-1 py-1.5 px-2 rounded-lg text-center transition ${
              activeTab === 'compliance'
                ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }"
          >
            📋 Compliance
          </button>
        </div>

        <!-- Tab Content Body -->
        <div class="flex-1 flex flex-col rounded-xl overflow-hidden">
          ${renderTabContent(item, activeTab)}
        </div>
      </div>
    `;
  }

  function renderTabContent(item, tab) {
    if (tab === 'diagram') {
      return `
        <div class="relative flex flex-col flex-1 rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden">
          <!-- Top Diagram Toolbar -->
          <div class="flex items-center justify-between px-3 py-2 bg-slate-100/90 dark:bg-white/[0.03] border-b border-slate-200/80 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1.5 font-mono text-[10px] text-purple-400 font-semibold">
              <span class="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse"></span>
              PELE ARCHITECTURE-BETA
            </span>
            <div class="flex items-center gap-2">
              <button
                data-copy-mermaid="${escapeHtml(item.mermaid)}"
                class="copy-btn hover:text-purple-400 transition"
                title="Copy Mermaid source"
              >
                Copy Mermaid
              </button>
              <button
                data-download-svg="${item.id}"
                class="hover:text-purple-400 transition font-medium"
                title="Download SVG vector file"
              >
                Download SVG ⭳
              </button>
              <button
                data-open-modal="${item.id}"
                class="hover:text-purple-300 transition font-bold text-purple-500 dark:text-purple-400"
              >
                Fullscreen ↗
              </button>
            </div>
          </div>

          <!-- Pele Vector SVG on Blueprint Canvas Grid -->
          <div class="blueprint-canvas flex-1 flex items-center justify-center p-4 overflow-x-auto min-h-[180px]">
            <div class="pele-svg-container w-full flex justify-center">
              ${item.svg}
            </div>
          </div>
        </div>
      `;
    }

    if (tab === 'opa') {
      return `
        <div class="flex flex-col flex-1 rounded-xl border border-slate-200/80 dark:border-white/10 bg-[#0d0915] overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/5 text-[11px]">
            <div class="flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              <span class="font-mono text-purple-400 font-bold ml-1.5">policy.rego</span>
            </div>
            <button
              data-copy-text="${escapeHtml(item.opa_policy)}"
              class="copy-btn px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              Copy Policy
            </button>
          </div>
          <pre class="custom-scrollbar overflow-x-auto p-3 text-xs font-mono text-slate-200 leading-relaxed max-h-[220px]"><code>${highlightCode(item.opa_policy, 'rego')}</code></pre>
        </div>
      `;
    }

    if (tab === 'tf') {
      return `
        <div class="flex flex-col flex-1 rounded-xl border border-slate-200/80 dark:border-white/10 bg-[#0d0915] overflow-hidden">
          <div class="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-b border-white/5 text-[11px]">
            <div class="flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
              <span class="font-mono text-amber-400 font-bold ml-1.5">main.tf</span>
            </div>
            <button
              data-copy-text="${escapeHtml(item.terraform)}"
              class="copy-btn px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold transition"
            >
              Copy HCL
            </button>
          </div>
          <pre class="custom-scrollbar overflow-x-auto p-3 text-xs font-mono text-slate-200 leading-relaxed max-h-[220px]"><code>${highlightCode(item.terraform, 'tf')}</code></pre>
        </div>
      `;
    }

    // Compliance Tab
    return `
      <div class="flex flex-col flex-1 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] p-3 text-xs space-y-3">
        <div>
          <strong class="block text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider text-[10px] font-bold">Compliance Benchmarks:</strong>
          <div class="flex flex-wrap gap-1.5">
            ${(item.compliance || []).map(c => `
              <span class="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 text-[11px] font-mono">
                ${escapeHtml(c)}
              </span>
            `).join('')}
          </div>
        </div>

        <div>
          <strong class="block text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider text-[10px] font-bold">Remediation Action:</strong>
          <div class="rounded-lg bg-white dark:bg-[#0c0814] p-2.5 border border-slate-200 dark:border-white/10 flex items-start gap-2">
            <span class="text-purple-400 text-sm">🛡️</span>
            <p class="text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
              ${escapeHtml(item.remediation)}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) return '';

    let pages = [];
    const cur = STATE.page;

    pages.push(1);
    if (cur > 3) pages.push('...');
    for (let p = Math.max(2, cur - 1); p <= Math.min(totalPages - 1, cur + 1); p++) {
      pages.push(p);
    }
    if (cur < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return `
      <div class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80 dark:border-white/10">
        <span class="text-xs text-slate-500 dark:text-slate-400">
          Page <strong class="text-purple-400">${cur}</strong> of <strong>${totalPages}</strong> (${STATE.filteredData.length} blueprints)
        </span>

        <div class="flex items-center gap-1.5">
          <button
            id="aws-prev-page"
            ${cur <= 1 ? 'disabled' : ''}
            class="rounded-xl border border-slate-200 dark:border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>

          ${pages.map(p => {
            if (p === '...') {
              return `<span class="px-2 text-xs text-slate-400 font-mono">…</span>`;
            }
            return `
              <button
                data-page-target="${p}"
                class="page-num-btn h-8 w-8 rounded-xl text-xs font-bold transition ${
                  cur === p
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-400/40'
                    : 'border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                }"
              >
                ${p}
              </button>
            `;
          }).join('')}

          <button
            id="aws-next-page"
            ${cur >= totalPages ? 'disabled' : ''}
            class="rounded-xl border border-slate-200 dark:border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    // Search input (debounced)
    const searchInput = document.getElementById('aws-search-input');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', e => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          STATE.query = e.target.value;
          STATE.page = 1;
          applyFilters();
          renderApp();
          const newSearch = document.getElementById('aws-search-input');
          if (newSearch) {
            newSearch.focus();
            newSearch.setSelectionRange(newSearch.value.length, newSearch.value.length);
          }
        }, 220);
      });
    }

    // Clear search button
    document.getElementById('aws-clear-search')?.addEventListener('click', () => {
      STATE.query = '';
      STATE.page = 1;
      applyFilters();
      renderApp();
    });

    // Quick filter chips
    document.querySelectorAll('.quick-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const filter = JSON.parse(btn.getAttribute('data-quick-chip'));
          if (filter.severity) STATE.severity = filter.severity;
          if (filter.pillar) STATE.pillar = filter.pillar;
          if (filter.category) STATE.category = filter.category;
          STATE.page = 1;
          applyFilters();
          renderApp();
        } catch {}
      });
    });

    // Severity filter
    const sevFilter = document.getElementById('aws-severity-filter');
    if (sevFilter) {
      sevFilter.addEventListener('change', e => {
        STATE.severity = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Pillar filter
    const pillarFilter = document.getElementById('aws-pillar-filter');
    if (pillarFilter) {
      pillarFilter.addEventListener('change', e => {
        STATE.pillar = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Reset filters
    const resetBtn = document.getElementById('aws-reset-filters') || document.getElementById('aws-reset-empty');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        STATE.query = '';
        STATE.category = 'all';
        STATE.pillar = 'all';
        STATE.severity = 'all';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Category pills
    document.querySelectorAll('.aws-cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.category = btn.getAttribute('data-cat-id');
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Tab switcher
    document.querySelectorAll('[data-tab-switch]').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-tab-switch');
        const targetTab = btn.getAttribute('data-tab-target');
        STATE.activeTabs[itemId] = targetTab;
        renderApp();
      });
    });

    // Pagination
    const prevBtn = document.getElementById('aws-prev-page');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (STATE.page > 1) {
          STATE.page--;
          renderApp();
          document.getElementById('architecture-catalog')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    const nextBtn = document.getElementById('aws-next-page');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        STATE.page++;
        renderApp();
        document.getElementById('architecture-catalog')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    document.querySelectorAll('.page-num-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.page = parseInt(btn.getAttribute('data-page-target'), 10);
        renderApp();
        document.getElementById('architecture-catalog')?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Copy text
    document.querySelectorAll('[data-copy-text]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy-text');
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.innerHTML;
          btn.innerHTML = 'Copied ✓';
          btn.classList.add('text-emerald-400');
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.classList.remove('text-emerald-400');
          }, 2000);
        } catch {
          btn.textContent = 'Failed';
        }
      });
    });

    document.querySelectorAll('[data-copy-mermaid]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy-mermaid');
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.innerHTML;
          btn.innerHTML = 'Copied ✓';
          btn.classList.add('text-emerald-400');
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.classList.remove('text-emerald-400');
          }, 2000);
        } catch {
          btn.textContent = 'Failed';
        }
      });
    });

    // Download SVG
    document.querySelectorAll('[data-download-svg]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-download-svg');
        const item = STATE.allData.find(x => x.id === id);
        if (item && item.svg) {
          downloadSvgFile(item.svg, item.id);
        }
      });
    });

    // Modal open
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-modal');
        const item = STATE.allData.find(x => x.id === id);
        if (item) {
          STATE.modalItem = item;
          STATE.modalTab = 'diagram';
          openModal(item);
        }
      });
    });
  }

  function openModal(item) {
    const modalContainer = document.getElementById('aws-modal-container');
    if (!modalContainer) return;

    const sev = getSeverityBadge(item.severity);
    const pillar = getPillarBadge(item.pillar);
    const iconPath = item.icon_url || ('/images/aws-icons/' + item.category + '.svg');

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
        <div class="relative flex flex-col w-full max-w-5xl max-h-[92vh] rounded-3xl border border-white/10 bg-[#161120] shadow-2xl overflow-hidden">
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 p-2 shrink-0 flex items-center justify-center shadow-inner">
                <img src="${iconPath}" class="w-full h-full object-contain" alt="${escapeHtml(item.service)}" />
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-mono text-xs font-bold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30">${item.id}</span>
                  <span class="text-xs text-slate-300 font-semibold">${item.service} &bull; ${item.category_name}</span>
                  <span class="inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${sev.pill}">
                    <span class="h-1.5 w-1.5 rounded-full ${sev.dot}"></span>
                    ${item.severity}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${pillar.pill}">
                    <span class="h-1.5 w-1.5 rounded-full ${pillar.dot}"></span>
                    ${item.pillar}
                  </span>
                </div>
                <h2 class="text-base sm:text-lg font-bold text-white tracking-tight">${escapeHtml(item.title)}</h2>
              </div>
            </div>
            <button id="aws-modal-close" class="h-9 w-9 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition">
              ✕
            </button>
          </div>

          <!-- Modal Body with Full Blueprint Canvas -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <!-- Blueprint Canvas -->
            <div class="blueprint-canvas rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center relative group min-h-[280px]">
              <div class="absolute top-3 right-3 flex items-center gap-2">
                <button data-copy-mermaid="${escapeHtml(item.mermaid)}" class="copy-btn px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-purple-300 hover:text-white transition">
                  Copy Mermaid
                </button>
                <button data-download-svg="${item.id}" class="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-semibold text-white transition shadow-md shadow-purple-500/20">
                  Download SVG ⭳
                </button>
              </div>

              <div class="pele-svg-container w-full flex justify-center py-4">
                ${item.svg}
              </div>
            </div>

            <!-- Description & Remediation -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Architectural Blueprint Description</h4>
                <p class="text-xs text-slate-300 leading-relaxed">${escapeHtml(item.description)}</p>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Remediation &amp; Guardrail Guidance</h4>
                <div class="rounded-xl bg-black/30 p-3 border border-white/5 flex items-start gap-2">
                  <span class="text-purple-400">🛡️</span>
                  <p class="text-xs font-mono text-slate-300 leading-relaxed">${escapeHtml(item.remediation)}</p>
                </div>
              </div>
            </div>

            <!-- Code Artifacts (Side-by-Side: OPA Rego & Terraform) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- OPA Rego -->
              <div class="rounded-2xl border border-white/10 bg-[#0d0915] overflow-hidden">
                <div class="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/5 text-xs">
                  <span class="font-mono text-purple-400 font-bold">policy.rego (OPA Guardrail)</span>
                  <button data-copy-text="${escapeHtml(item.opa_policy)}" class="copy-btn text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition">
                    Copy Policy
                  </button>
                </div>
                <pre class="custom-scrollbar p-3.5 text-xs font-mono text-slate-200 leading-relaxed max-h-[220px] overflow-x-auto"><code>${highlightCode(item.opa_policy, 'rego')}</code></pre>
              </div>

              <!-- Terraform HCL -->
              <div class="rounded-2xl border border-white/10 bg-[#0d0915] overflow-hidden">
                <div class="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/5 text-xs">
                  <span class="font-mono text-cyan-400 font-bold">main.tf (Compliant IaC)</span>
                  <button data-copy-text="${escapeHtml(item.terraform)}" class="copy-btn text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium transition">
                    Copy HCL
                  </button>
                </div>
                <pre class="custom-scrollbar p-3.5 text-xs font-mono text-slate-200 leading-relaxed max-h-[220px] overflow-x-auto"><code>${highlightCode(item.terraform, 'tf')}</code></pre>
              </div>
            </div>

            <!-- Mermaid Source DSL -->
            <div class="rounded-2xl border border-white/10 bg-[#0d0915] overflow-hidden">
              <div class="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border-b border-white/5 text-xs">
                <span class="font-mono text-slate-300 font-semibold">Obsidian Pele Mermaid Topology Source</span>
                <button data-copy-mermaid="${escapeHtml(item.mermaid)}" class="copy-btn text-xs text-purple-400 hover:text-purple-300 transition">
                  Copy Mermaid
                </button>
              </div>
              <pre class="custom-scrollbar p-3.5 text-xs font-mono text-slate-300 overflow-x-auto"><code>${escapeHtml(item.mermaid)}</code></pre>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('aws-modal-close')?.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', e => {
      if (e.target === modalContainer.firstElementChild) closeModal();
    });

    // Bind modal copy and download
    modalContainer.querySelectorAll('[data-copy-text]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy-text');
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.innerHTML;
          btn.innerHTML = 'Copied ✓';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        } catch {}
      });
    });

    modalContainer.querySelectorAll('[data-copy-mermaid]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy-mermaid');
        try {
          await navigator.clipboard.writeText(text);
          const orig = btn.innerHTML;
          btn.innerHTML = 'Copied ✓';
          setTimeout(() => { btn.innerHTML = orig; }, 2000);
        } catch {}
      });
    });

    modalContainer.querySelectorAll('[data-download-svg]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-download-svg');
        const it = STATE.allData.find(x => x.id === id);
        if (it && it.svg) downloadSvgFile(it.svg, it.id);
      });
    });
  }

  function closeModal() {
    const modalContainer = document.getElementById('aws-modal-container');
    if (modalContainer) modalContainer.innerHTML = '';
    STATE.modalItem = null;
  }

  // Escape key closes modal
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && STATE.modalItem) {
      closeModal();
    }
  });

  function boot() {
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
