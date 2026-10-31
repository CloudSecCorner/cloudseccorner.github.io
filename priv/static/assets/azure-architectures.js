// Azure Architecture Best Practices Catalog Controller (Powered by Obsidian Pele)
// Features: Responsive Pele SVG Diagrams, OPA Rego Policies, Hardened Terraform Modules, 1-Click SVG Download & Token-Safe Highlighting

(function () {
  let container = null;

  const STATE = {
    allData: [],
    filteredData: [],
    query: '',
    domain: 'all',
    category: 'all',
    pillar: 'all',
    severity: 'all',
    compliance: 'all',
    page: 1,
    pageSize: 12,
    activeTabs: {}, // item.id -> active tab name ('diagram', 'opa', 'tf', 'compliance')
    modalItem: null,
    modalTab: 'diagram'
  };

  const DOMAINS = [
    { id: 'all', name: 'All Domains', icon: '⚡', categoryIds: [] },
    { id: 'identity-governance', name: 'Identity & Governance', icon: '🔑', categoryIds: ['azure-ad', 'azure-policy'] },
    { id: 'compute-containers', name: 'Compute & Containers', icon: '⚡', categoryIds: ['azure-vm', 'azure-aks', 'azure-container-apps'] },
    { id: 'storage-databases', name: 'Storage & Databases', icon: '🗄️', categoryIds: ['azure-blob', 'azure-sql', 'azure-cosmosdb'] },
    { id: 'network-perimeter', name: 'Network & Perimeter', icon: '🌐', categoryIds: ['azure-vnet', 'azure-appgateway', 'azure-frontdoor', 'azure-firewall', 'azure-dns'] },
    { id: 'security-kms-posture', name: 'Security, KMS & Posture', icon: '🔒', categoryIds: ['azure-keyvault', 'azure-defender', 'azure-backup'] },
    { id: 'telemetry-siem', name: 'Telemetry & SIEM', icon: '📊', categoryIds: ['azure-activity-log', 'azure-monitor', 'azure-sentinel', 'azure-synapse'] },
    { id: 'serverless-ai', name: 'Serverless & AI Workloads', icon: '🧠', categoryIds: ['azure-functions', 'azure-servicebus', 'azure-eventgrid', 'azure-openai'] }
  ];

  const PILLARS = [
    'all',
    'Security',
    'Reliability',
    'Operational Excellence',
    'Cost Optimization',
    'Performance Efficiency'
  ];

  const COMPLIANCE_FRAMEWORKS = [
    { id: 'all', name: 'All Compliance Frameworks' },
    { id: 'CIS', name: 'CIS Microsoft Azure Foundations Benchmark v2.0' },
    { id: 'NIST', name: 'NIST SP 800-53 / 800-171' },
    { id: 'PCI-DSS', name: 'PCI-DSS v4.0' },
    { id: 'SOC 2', name: 'SOC 2 Type II' },
    { id: 'HIPAA', name: 'HIPAA Security Rule' },
    { id: 'FedRAMP', name: 'FedRAMP High' },
    { id: 'ISO 27001', name: 'ISO/IEC 27001:2022' }
  ];

  const CATEGORIES = [
    { id: 'all', name: 'All 24 Domains', icon: null, domain: 'all' },
    { id: 'azure-blob', name: 'Blob Storage & Data Lake Gen2', icon: '/images/azure-icons/azure-blob.svg', domain: 'storage-databases' },
    { id: 'azure-ad', name: 'Microsoft Entra ID & PIM', icon: '/images/azure-icons/azure-ad.svg', domain: 'identity-governance' },
    { id: 'azure-vnet', name: 'Virtual Network & NSGs', icon: '/images/azure-icons/azure-vnet.svg', domain: 'network-perimeter' },
    { id: 'azure-vm', name: 'Virtual Machines & Dedicated Hosts', icon: '/images/azure-icons/azure-vm.svg', domain: 'compute-containers' },
    { id: 'azure-sql', name: 'Azure SQL & Managed Instance', icon: '/images/azure-icons/azure-sql.svg', domain: 'storage-databases' },
    { id: 'azure-cosmosdb', name: 'Azure Cosmos DB Multi-Model', icon: '/images/azure-icons/azure-cosmosdb.svg', domain: 'storage-databases' },
    { id: 'azure-aks', name: 'Azure Kubernetes Service (AKS)', icon: '/images/azure-icons/azure-aks.svg', domain: 'compute-containers' },
    { id: 'azure-container-apps', name: 'Azure Container Apps & ACA', icon: '/images/azure-icons/azure-container-apps.svg', domain: 'compute-containers' },
    { id: 'azure-functions', name: 'Azure Functions & Serverless', icon: '/images/azure-icons/azure-functions.svg', domain: 'serverless-ai' },
    { id: 'azure-appgateway', name: 'Application Gateway & WAF v2', icon: '/images/azure-icons/azure-appgateway.svg', domain: 'network-perimeter' },
    { id: 'azure-frontdoor', name: 'Azure Front Door & CDN', icon: '/images/azure-icons/azure-frontdoor.svg', domain: 'network-perimeter' },
    { id: 'azure-firewall', name: 'Azure Firewall Premium', icon: '/images/azure-icons/azure-firewall.svg', domain: 'network-perimeter' },
    { id: 'azure-keyvault', name: 'Key Vault, HSM & Managed Keys', icon: '/images/azure-icons/azure-keyvault.svg', domain: 'security-kms-posture' },
    { id: 'azure-activity-log', name: 'Activity Log & Control Plane', icon: '/images/azure-icons/azure-activity-log.svg', domain: 'telemetry-siem' },
    { id: 'azure-monitor', name: 'Azure Monitor & Log Analytics', icon: '/images/azure-icons/azure-monitor.svg', domain: 'telemetry-siem' },
    { id: 'azure-defender', name: 'Defender for Cloud & CSPM', icon: '/images/azure-icons/azure-defender.svg', domain: 'security-kms-posture' },
    { id: 'azure-sentinel', name: 'Microsoft Sentinel Cloud SIEM', icon: '/images/azure-icons/azure-sentinel.svg', domain: 'telemetry-siem' },
    { id: 'azure-backup', name: 'Azure Backup & Vault Resilience', icon: '/images/azure-icons/azure-backup.svg', domain: 'security-kms-posture' },
    { id: 'azure-servicebus', name: 'Service Bus & Enterprise Queues', icon: '/images/azure-icons/azure-servicebus.svg', domain: 'serverless-ai' },
    { id: 'azure-eventgrid', name: 'Event Grid & Pub/Sub Mesh', icon: '/images/azure-icons/azure-eventgrid.svg', domain: 'serverless-ai' },
    { id: 'azure-openai', name: 'Azure OpenAI & Cognitive Services', icon: '/images/azure-icons/azure-openai.svg', domain: 'serverless-ai' },
    { id: 'azure-policy', name: 'Azure Policy & Regulatory Governance', icon: '/images/azure-icons/azure-policy.svg', domain: 'identity-governance' },
    { id: 'azure-dns', name: 'Azure Private DNS & Resolver', icon: '/images/azure-icons/azure-dns.svg', domain: 'network-perimeter' },
    { id: 'azure-synapse', name: 'Synapse Analytics & Data Factory', icon: '/images/azure-icons/azure-synapse.svg', domain: 'telemetry-siem' }
  ];

  const QUICK_CHIPS = [
    { label: '⚡ Critical Only', filter: { severity: 'Critical' } },
    { label: '🛡️ Security Pillar', filter: { pillar: 'Security' } },
    { label: '🔐 Key Vault & HSM', filter: { category: 'azure-keyvault', domain: 'security-kms-posture' } },
    { label: '🗄️ Blob Storage', filter: { category: 'azure-blob', domain: 'storage-databases' } },
    { label: '☸️ AKS Defense', filter: { category: 'azure-aks', domain: 'compute-containers' } },
    { label: '🌐 Hub-Spoke VNet', filter: { category: 'azure-vnet', domain: 'network-perimeter' } },
    { label: '🛡️ Defender CSPM', filter: { category: 'azure-defender', domain: 'security-kms-posture' } },
    { label: '👁️ Sentinel SIEM', filter: { category: 'azure-sentinel', domain: 'telemetry-siem' } }
  ];

  function readUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('q')) STATE.query = params.get('q');
      if (params.has('domain')) STATE.domain = params.get('domain');
      if (params.has('category')) STATE.category = params.get('category');
      if (params.has('pillar')) STATE.pillar = params.get('pillar');
      if (params.has('severity')) STATE.severity = params.get('severity');
      if (params.has('compliance')) STATE.compliance = params.get('compliance');
      if (params.has('page')) STATE.page = parseInt(params.get('page'), 10) || 1;
    } catch (_) {}
  }

  function updateUrlParams() {
    try {
      const params = new URLSearchParams();
      if (STATE.query) params.set('q', STATE.query);
      if (STATE.domain !== 'all') params.set('domain', STATE.domain);
      if (STATE.category !== 'all') params.set('category', STATE.category);
      if (STATE.pillar !== 'all') params.set('pillar', STATE.pillar);
      if (STATE.severity !== 'all') params.set('severity', STATE.severity);
      if (STATE.compliance !== 'all') params.set('compliance', STATE.compliance);
      if (STATE.page > 1) params.set('page', STATE.page);

      const qs = params.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    } catch (_) {}
  }

  // Load dataset
  async function init() {
    container = document.getElementById('azure-architecture-app');
    if (!container) return;
    readUrlParams();

    try {
      let resp = await fetch('/data/azure-best-practices.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status + ' loading Azure dataset');
      STATE.allData = await resp.json();
      applyFilters();
      renderApp();
    } catch (err) {
      console.error('Azure Architecture Catalog Error:', err);
      if (container) {
        container.innerHTML = `
          <div class="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-300">
            <p class="font-bold text-lg">Failed to load Azure Architecture dataset</p>
            <p class="text-sm mt-1 text-slate-400">${escapeHtml(err.message)}</p>
            <p class="text-xs mt-3 text-slate-500">Please verify that /data/azure-best-practices.json is accessible.</p>
          </div>
        `;
      }
    }
  }

  function applyFilters() {
    const q = STATE.query.toLowerCase().trim();
    STATE.filteredData = STATE.allData.filter(item => {
      if (STATE.domain !== 'all') {
        const dom = DOMAINS.find(d => d.id === STATE.domain);
        if (dom && !dom.categoryIds.includes(item.category)) return false;
      }
      if (STATE.category !== 'all' && item.category !== STATE.category) return false;
      if (STATE.pillar !== 'all' && item.pillar !== STATE.pillar) return false;
      if (STATE.severity !== 'all' && item.severity !== STATE.severity) return false;
      if (STATE.compliance !== 'all') {
        if (!item.compliance || !item.compliance.some(c => c.toLowerCase().includes(STATE.compliance.toLowerCase()))) {
          return false;
        }
      }
      if (q) {
        const match =
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.service.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.pillar && item.pillar.toLowerCase().includes(q)) ||
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
        return { pill: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 dark:bg-rose-500/15', dot: 'bg-rose-500 animate-pulse' };
      case 'High':
        return { pill: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:bg-amber-500/15', dot: 'bg-amber-500' };
      case 'Medium':
        return { pill: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 dark:bg-yellow-500/15', dot: 'bg-yellow-500' };
      default:
        return { pill: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30 dark:bg-slate-500/15', dot: 'bg-slate-400' };
    }
  }

  function highlightCode(code, type) {
    if (!code) return '';
    let safe = escapeHtml(code);
    if (type === 'rego') {
      safe = safe
        .replace(/(#.*$)/gm, '<span class="text-slate-500 italic">$1</span>')
        .replace(/\b(package|default|allow|deny|import|input|data|not|else|some|in)\b/g, '<span class="text-cyan-400 font-bold">$1</span>')
        .replace(/(&quot;.*?&quot;)/g, '<span class="text-emerald-300">$1</span>')
        .replace(/(\b[a-zA-Z_][a-zA-Z0-9_]*\b)(?=\s*:=)/g, '<span class="text-purple-300 font-semibold">$1</span>');
    } else if (type === 'tf') {
      safe = safe
        .replace(/(#.*$)/gm, '<span class="text-slate-500 italic">$1</span>')
        .replace(/\b(resource|data|variable|output|locals|module|terraform|lifecycle|prevent_destroy)\b/g, '<span class="text-cyan-400 font-bold">$1</span>')
        .replace(/(&quot;.*?&quot;)/g, '<span class="text-emerald-300">$1</span>')
        .replace(/([a-zA-Z_][a-zA-Z0-9_-]*)\s*=/g, '<span class="text-blue-300 font-medium">$1</span> =');
    }
    return safe;
  }

  function copyText(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = btnElement.innerHTML;
      btnElement.innerHTML = '✓ Copied!';
      btnElement.classList.add('text-emerald-400');
      setTimeout(() => {
        btnElement.innerHTML = orig;
        btnElement.classList.remove('text-emerald-400');
      }, 2000);
    });
  }

  function downloadSvg(svgContent, id) {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}-azure-architecture.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function getDomainCount(domId) {
    if (domId === 'all') return STATE.allData.length;
    const dom = DOMAINS.find(d => d.id === domId);
    return STATE.allData.filter(x => dom && dom.categoryIds.includes(x.category)).length;
  }

  function getCategoryCount(catId) {
    if (catId === 'all') {
      if (STATE.domain === 'all') return STATE.allData.length;
      const dom = DOMAINS.find(d => d.id === STATE.domain);
      return STATE.allData.filter(x => dom && dom.categoryIds.includes(x.category)).length;
    }
    return STATE.allData.filter(x => x.category === catId).length;
  }

  function renderApp() {
    if (!container) return;

    const totalCount = STATE.filteredData.length;
    const totalPages = Math.ceil(totalCount / STATE.pageSize) || 1;
    const startIndex = (STATE.page - 1) * STATE.pageSize;
    const pageItems = STATE.filteredData.slice(startIndex, startIndex + STATE.pageSize);

    const visibleCategories = STATE.domain === 'all'
      ? CATEGORIES
      : [CATEGORIES[0], ...CATEGORIES.slice(1).filter(c => c.domain === STATE.domain)];

    let html = `
      <!-- Search & Filter Controls -->
      <div class="space-y-6">
        <!-- Search Input -->
        <div class="relative">
          <input
            type="text"
            id="az-search-input"
            value="${escapeHtml(STATE.query)}"
            placeholder="Search by Azure service, defensive pattern, OPA rule, CIS benchmark, or NIST control..."
            class="w-full rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-3.5 pl-11 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
          <svg class="absolute left-4 top-4 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          ${STATE.query ? `
            <button id="az-clear-search" class="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white">
              Clear
            </button>
          ` : ''}
        </div>

        <!-- Quick Filter Chips -->
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="font-semibold text-slate-500 dark:text-slate-400 mr-1">Quick Filters:</span>
          ${QUICK_CHIPS.map((chip, idx) => `
            <button
              data-chip-idx="${idx}"
              class="az-quick-chip rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              ${chip.label}
            </button>
          `).join('')}
          ${(STATE.domain !== 'all' || STATE.category !== 'all' || STATE.pillar !== 'all' || STATE.severity !== 'all' || STATE.compliance !== 'all' || STATE.query) ? `
            <button id="az-reset-all" class="ml-auto text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Reset All Filters
            </button>
          ` : ''}
        </div>

        <!-- 7 Core Security Domains Bar -->
        <div class="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-100/80 dark:bg-[#050811] p-3 shadow-xs">
          <div class="flex items-center justify-between mb-2 px-1">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>🛡️</span> Core Security Domains
            </span>
            <span class="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              ${STATE.domain === 'all' ? 'All 7 Domains' : DOMAINS.find(d => d.id === STATE.domain)?.name}
            </span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${DOMAINS.map(dom => {
              const active = STATE.domain === dom.id;
              const count = getDomainCount(dom.id);
              return `
                <button
                  data-domain-id="${dom.id}"
                  class="az-domain-tab flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-white/[0.06]'
                  }"
                >
                  <span>${dom.icon}</span>
                  <span>${dom.name}</span>
                  <span class="rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                  }">${count}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 24 Azure Domains Filter Pills with Real Icons -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Service Categories ${STATE.domain !== 'all' ? `(${DOMAINS.find(d => d.id === STATE.domain)?.name})` : ''}
            </h3>
            <span class="text-xs text-slate-500 dark:text-slate-400">Showing ${totalCount} matching architectures</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${visibleCategories.map(cat => {
              const active = STATE.category === cat.id;
              const count = getCategoryCount(cat.id);
              return `
                <button
                  data-cat-id="${cat.id}"
                  class="az-cat-btn flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition border ${
                    active
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-400 hover:bg-blue-50/40 dark:hover:bg-white/[0.06]'
                  }"
                >
                  ${cat.icon ? `<img src="${cat.icon}" alt="" class="h-4 w-4 shrink-0" />` : ''}
                  <span>${cat.name}</span>
                  <span class="rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }">${count}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Pillars & Severity Filter Bar -->
        <div class="flex flex-wrap items-center gap-4 text-xs pt-3 border-t border-slate-200 dark:border-white/[0.06]">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-500 dark:text-slate-400">Pillar:</span>
            <div class="flex flex-wrap gap-1">
              ${PILLARS.map(p => `
                <button
                  data-pillar="${p}"
                  class="az-pillar-btn rounded-lg px-2.5 py-1 capitalize transition ${
                    STATE.pillar === p
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40 font-semibold'
                      : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent hover:text-slate-900 dark:hover:text-white'
                  }"
                >
                  ${p}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="flex items-center gap-2 ml-auto">
            <span class="font-semibold text-slate-500 dark:text-slate-400">Severity:</span>
            <div class="flex flex-wrap gap-1">
              ${['all', 'Critical', 'High', 'Medium', 'Low'].map(s => `
                <button
                  data-severity="${s}"
                  class="az-sev-btn rounded-lg px-2.5 py-1 capitalize transition ${
                    STATE.severity === s
                      ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 font-semibold'
                      : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-transparent hover:text-slate-900 dark:hover:text-white'
                  }"
                >
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Architecture Cards Grid -->
      <div class="mt-8">
        ${totalCount === 0 ? `
          <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-16 text-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">No Azure architectures match your filter</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Try clearing your search query or choosing "All Domains".</p>
            <button id="az-empty-reset" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500">
              Reset Filters
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            ${pageItems.map(item => {
              const activeTab = STATE.activeTabs[item.id] || 'diagram';
              const sevBadge = getSeverityBadge(item.severity);

              return `
                <div class="flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all overflow-hidden">
                  <!-- Card Header -->
                  <div class="p-5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01]">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <div class="flex items-center gap-2">
                        <img src="${item.icon_url}" alt="" class="h-5 w-5 shrink-0" />
                        <span class="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">${item.id}</span>
                        <span class="text-slate-400">•</span>
                        <span class="text-xs text-slate-500 dark:text-slate-400">${item.category_name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sevBadge.pill}">
                          <span class="h-1.5 w-1.5 rounded-full ${sevBadge.dot}"></span>
                          ${item.severity}
                        </span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300">
                          ${item.pillar}
                        </span>
                      </div>
                    </div>

                    <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug">${escapeHtml(item.title)}</h3>
                    <p class="mt-1 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">${escapeHtml(item.description)}</p>
                  </div>

                  <!-- Tab Navigation Header -->
                  <div class="flex items-center justify-between border-b border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-[#050811] px-4 py-2">
                    <div class="flex items-center gap-1">
                      <button
                        data-item-tab="diagram"
                        data-item-id="${item.id}"
                        class="az-tab-btn px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === 'diagram' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }"
                      >
                        📐 Diagram
                      </button>
                      <button
                        data-item-tab="opa"
                        data-item-id="${item.id}"
                        class="az-tab-btn px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === 'opa' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }"
                      >
                        🛡️ OPA Rego
                      </button>
                      <button
                        data-item-tab="tf"
                        data-item-id="${item.id}"
                        class="az-tab-btn px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === 'tf' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }"
                      >
                        🏗️ Terraform
                      </button>
                      <button
                        data-item-tab="compliance"
                        data-item-id="${item.id}"
                        class="az-tab-btn px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === 'compliance' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }"
                      >
                        📋 Compliance
                      </button>
                    </div>

                    <div class="flex items-center gap-2">
                      <button
                        data-download-id="${item.id}"
                        class="az-download-svg text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-300 flex items-center gap-1 transition"
                        title="Download SVG"
                      >
                        <span>Download SVG</span> ⭳
                      </button>
                      <button
                        data-inspect-id="${item.id}"
                        class="az-inspect-btn text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white flex items-center gap-1 transition"
                        title="Fullscreen Inspection"
                      >
                        ⛶
                      </button>
                    </div>
                  </div>

                  <!-- Tab Body -->
                  <div class="flex-1 p-4 bg-slate-50/50 dark:bg-[#04070e]">
                    ${activeTab === 'diagram' ? `
                      <div
                        class="blueprint-canvas relative flex items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#070b16] overflow-x-auto min-h-[220px]"
                        style="background-image: radial-gradient(rgba(14, 165, 233, 0.16) 1px, transparent 0); background-size: 20px 20px;"
                      >
                        <div class="w-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto">
                          ${item.svg}
                        </div>
                      </div>
                    ` : ''}

                    ${activeTab === 'opa' ? `
                      <div class="relative rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#070b16] p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[240px]">
                        <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 dark:border-white/5">
                          <div class="flex items-center gap-1.5">
                            <span class="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block"></span>
                            <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
                            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                            <span class="text-[11px] text-slate-400 ml-2 font-mono">policy.rego</span>
                          </div>
                          <button
                            data-copy-code="${escapeHtml(item.opa_policy)}"
                            class="az-copy-btn px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                          >
                            Copy Rego
                          </button>
                        </div>
                        <pre><code>${highlightCode(item.opa_policy, 'rego')}</code></pre>
                      </div>
                    ` : ''}

                    ${activeTab === 'tf' ? `
                      <div class="relative rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#070b16] p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[240px]">
                        <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 dark:border-white/5">
                          <div class="flex items-center gap-1.5">
                            <span class="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block"></span>
                            <span class="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
                            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                            <span class="text-[11px] text-slate-400 ml-2 font-mono">main.tf</span>
                          </div>
                          <button
                            data-copy-code="${escapeHtml(item.terraform)}"
                            class="az-copy-btn px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                          >
                            Copy Terraform
                          </button>
                        </div>
                        <pre><code>${highlightCode(item.terraform, 'tf')}</code></pre>
                      </div>
                    ` : ''}

                    ${activeTab === 'compliance' ? `
                      <div class="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070b16] p-4 text-xs space-y-3">
                        <div>
                          <span class="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Mapped Compliance Frameworks:</span>
                          <div class="flex flex-wrap gap-1.5">
                            ${(item.compliance || []).map(c => `
                              <span class="px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 text-[11px] font-mono">
                                ${escapeHtml(c)}
                              </span>
                            `).join('')}
                          </div>
                        </div>
                        <div>
                          <span class="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Architecture Remediation Guide:</span>
                          <p class="text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(item.remediation)}</p>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Pagination Controls -->
          ${totalPages > 1 ? `
            <div class="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-white/10 pt-4 text-xs">
              <span class="text-slate-500 dark:text-slate-400 font-mono">
                Page ${STATE.page} of ${totalPages} (${totalCount} blueprints)
              </span>
              <div class="flex items-center gap-2">
                <button
                  id="az-prev-page"
                  ${STATE.page <= 1 ? 'disabled' : ''}
                  class="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  ← Prev
                </button>
                <button
                  id="az-next-page"
                  ${STATE.page >= totalPages ? 'disabled' : ''}
                  class="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  Next →
                </button>
              </div>
            </div>
          ` : ''}
        `}
      </div>

      <!-- Modal Container -->
      <div id="az-modal-wrapper"></div>
    `;

    container.innerHTML = html;
    bindEvents();
  }

  function bindEvents() {
    // Search input
    const searchInput = document.getElementById('az-search-input');
    if (searchInput) {
      let debounce;
      searchInput.addEventListener('input', e => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          STATE.query = e.target.value;
          STATE.page = 1;
          applyFilters();
          renderApp();
          const next = document.getElementById('az-search-input');
          if (next) {
            next.focus();
            next.setSelectionRange(next.value.length, next.value.length);
          }
        }, 220);
      });
    }

    // Clear search
    document.getElementById('az-clear-search')?.addEventListener('click', () => {
      STATE.query = '';
      STATE.page = 1;
      applyFilters();
      renderApp();
    });

    // Quick chips
    document.querySelectorAll('.az-quick-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-chip-idx'), 10);
        const chip = QUICK_CHIPS[idx];
        if (chip && chip.filter) {
          if (chip.filter.domain) STATE.domain = chip.filter.domain;
          if (chip.filter.severity) STATE.severity = chip.filter.severity;
          if (chip.filter.pillar) STATE.pillar = chip.filter.pillar;
          if (chip.filter.category) STATE.category = chip.filter.category;
          STATE.page = 1;
          applyFilters();
          renderApp();
        }
      });
    });

    // Domain tabs
    document.querySelectorAll('.az-domain-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.domain = btn.getAttribute('data-domain-id');
        STATE.category = 'all';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Reset all
    const resetFn = () => {
      STATE.query = '';
      STATE.domain = 'all';
      STATE.category = 'all';
      STATE.pillar = 'all';
      STATE.severity = 'all';
      STATE.compliance = 'all';
      STATE.page = 1;
      applyFilters();
      renderApp();
    };
    document.getElementById('az-reset-all')?.addEventListener('click', resetFn);
    document.getElementById('az-empty-reset')?.addEventListener('click', resetFn);

    // Category pills
    document.querySelectorAll('.az-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.category = btn.getAttribute('data-cat-id');
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Pillar buttons
    document.querySelectorAll('.az-pillar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.pillar = btn.getAttribute('data-pillar');
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Severity buttons
    document.querySelectorAll('.az-sev-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.severity = btn.getAttribute('data-severity');
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Tab buttons inside cards
    document.querySelectorAll('.az-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-item-id');
        const tab = btn.getAttribute('data-item-tab');
        STATE.activeTabs[id] = tab;
        renderApp();
      });
    });

    // Download SVG
    document.querySelectorAll('.az-download-svg').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-download-id');
        const item = STATE.allData.find(x => x.id === id);
        if (item && item.svg) {
          downloadSvg(item.svg, item.id);
        }
      });
    });

    // Copy buttons
    document.querySelectorAll('.az-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-copy-code');
        if (code) copyText(code, btn);
      });
    });

    // Inspect buttons
    document.querySelectorAll('.az-inspect-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-inspect-id');
        const item = STATE.allData.find(x => x.id === id);
        if (item) {
          STATE.modalItem = item;
          openModal(item);
        }
      });
    });

    // Pagination
    document.getElementById('az-prev-page')?.addEventListener('click', () => {
      if (STATE.page > 1) {
        STATE.page--;
        renderApp();
        document.getElementById('azure-architecture-app')?.scrollIntoView({ behavior: 'smooth' });
      }
    });

    document.getElementById('az-next-page')?.addEventListener('click', () => {
      const totalPages = Math.ceil(STATE.filteredData.length / STATE.pageSize) || 1;
      if (STATE.page < totalPages) {
        STATE.page++;
        renderApp();
        document.getElementById('azure-architecture-app')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  function openModal(item) {
    const wrapper = document.getElementById('az-modal-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = `
      <div
        id="az-modal-backdrop"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 dark:bg-black/85 p-4 backdrop-blur-md"
      >
        <div
          class="relative flex max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-slate-200 dark:border-white/20 bg-white dark:bg-[#080d1a] shadow-2xl overflow-hidden"
          onclick="event.stopPropagation()"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-slate-200 dark:border-white/10 p-5 bg-slate-50 dark:bg-[#060a14]">
            <div class="flex items-center gap-3">
              <img src="${item.icon_url}" alt="" class="h-7 w-7 object-contain" />
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">${item.id}</span>
                  <span class="text-slate-400 dark:text-slate-600">•</span>
                  <span class="text-xs text-slate-600 dark:text-slate-300">${item.service}</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">${escapeHtml(item.title)}</h3>
              </div>
            </div>
            <button
              id="az-modal-close"
              class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <!-- Modal Content -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div
              class="blueprint-canvas relative flex items-center justify-center p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070b16]"
              style="background-image: radial-gradient(rgba(14, 165, 233, 0.2) 1px, transparent 0); background-size: 24px 24px;"
            >
              <div class="w-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto">
                ${item.svg}
              </div>
            </div>

            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Architecture Defense Pattern</h4>
              <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(item.description)}</p>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#070b16] p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-cyan-400 font-mono">Open Policy Agent (OPA Rego)</span>
                  <button
                    id="az-modal-copy-opa"
                    data-copy="${escapeHtml(item.opa_policy)}"
                    class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                  >
                    Copy
                  </button>
                </div>
                <pre class="text-xs font-mono text-slate-200 overflow-x-auto max-h-[220px]"><code>${highlightCode(item.opa_policy, 'rego')}</code></pre>
              </div>

              <div class="rounded-xl border border-slate-800 dark:border-white/10 bg-slate-950 dark:bg-[#070b16] p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-bold text-amber-400 font-mono">Terraform IaC Baseline</span>
                  <button
                    id="az-modal-copy-tf"
                    data-copy="${escapeHtml(item.terraform)}"
                    class="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition"
                  >
                    Copy
                  </button>
                </div>
                <pre class="text-xs font-mono text-slate-200 overflow-x-auto max-h-[220px]"><code>${highlightCode(item.terraform, 'tf')}</code></pre>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex items-center justify-between border-t border-slate-200 dark:border-white/10 p-4 bg-slate-50 dark:bg-[#060a14]">
            <span class="text-xs text-slate-600 dark:text-slate-400">
              Pillar: <strong class="text-slate-900 dark:text-white">${escapeHtml(item.pillar)}</strong> • Severity:
              <strong class="text-rose-600 dark:text-rose-400">${escapeHtml(item.severity)}</strong>
            </span>
            <button
              id="az-modal-download-svg"
              class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition flex items-center gap-1.5"
            >
              <span>Download Vector SVG</span> ⭳
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('az-modal-backdrop')?.addEventListener('click', closeModal);
    document.getElementById('az-modal-close')?.addEventListener('click', closeModal);

    document.getElementById('az-modal-copy-opa')?.addEventListener('click', function () {
      const code = this.getAttribute('data-copy');
      if (code) copyText(code, this);
    });

    document.getElementById('az-modal-copy-tf')?.addEventListener('click', function () {
      const code = this.getAttribute('data-copy');
      if (code) copyText(code, this);
    });

    document.getElementById('az-modal-download-svg')?.addEventListener('click', function () {
      if (item && item.svg) downloadSvg(item.svg, item.id);
    });
  }

  function closeModal() {
    const wrapper = document.getElementById('az-modal-wrapper');
    if (wrapper) wrapper.innerHTML = '';
    STATE.modalItem = null;
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && STATE.modalItem) {
      closeModal();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
