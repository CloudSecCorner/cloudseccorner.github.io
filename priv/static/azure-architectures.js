// Azure Architecture Best Practices Catalog Controller (Powered by Obsidian Pele)
// Features: Responsive Pele SVG Diagrams, OPA Rego Policies, Hardened Terraform Modules, 1-Click SVG Download & Token-Safe Highlighting

(function () {
  let container = null;

  const STATE = {
    allData: [],
    filteredData: [],
    query: '',
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
    { id: 'all', name: 'All Azure Domains', icon: null },
    { id: 'azure-blob', name: 'Blob Storage & Data Lake', icon: '/images/azure-icons/azure-blob.svg' },
    { id: 'azure-ad', name: 'Microsoft Entra ID & PIM', icon: '/images/azure-icons/azure-ad.svg' },
    { id: 'azure-vnet', name: 'Virtual Network & Hub-Spoke', icon: '/images/azure-icons/azure-vnet.svg' },
    { id: 'azure-vm', name: 'Virtual Machines & Compute', icon: '/images/azure-icons/azure-vm.svg' },
    { id: 'azure-sql', name: 'Azure SQL Database', icon: '/images/azure-icons/azure-sql.svg' },
    { id: 'azure-cosmosdb', name: 'Cosmos DB NoSQL', icon: '/images/azure-icons/azure-cosmosdb.svg' },
    { id: 'azure-aks', name: 'AKS Kubernetes Defense', icon: '/images/azure-icons/azure-aks.svg' },
    { id: 'azure-container-apps', name: 'Container Apps & ACR', icon: '/images/azure-icons/azure-container-apps.svg' },
    { id: 'azure-functions', name: 'Functions Serverless', icon: '/images/azure-icons/azure-functions.svg' },
    { id: 'azure-appgateway', name: 'Application Gateway WAF', icon: '/images/azure-icons/azure-appgateway.svg' },
    { id: 'azure-frontdoor', name: 'Front Door Edge CDN', icon: '/images/azure-icons/azure-frontdoor.svg' },
    { id: 'azure-firewall', name: 'Azure Firewall Premium', icon: '/images/azure-icons/azure-firewall.svg' },
    { id: 'azure-keyvault', name: 'Key Vault & Managed HSM', icon: '/images/azure-icons/azure-keyvault.svg' },
    { id: 'azure-activity-log', name: 'Activity Logs & Diagnostics', icon: '/images/azure-icons/azure-activity-log.svg' },
    { id: 'azure-monitor', name: 'Azure Monitor & Metrics', icon: '/images/azure-icons/azure-monitor.svg' },
    { id: 'azure-defender', name: 'Defender for Cloud (CSPM)', icon: '/images/azure-icons/azure-defender.svg' },
    { id: 'azure-sentinel', name: 'Microsoft Sentinel SIEM', icon: '/images/azure-icons/azure-sentinel.svg' },
    { id: 'azure-backup', name: 'Azure Backup & Recovery', icon: '/images/azure-icons/azure-backup.svg' },
    { id: 'azure-servicebus', name: 'Service Bus Messaging', icon: '/images/azure-icons/azure-servicebus.svg' },
    { id: 'azure-eventgrid', name: 'Event Grid Topics', icon: '/images/azure-icons/azure-eventgrid.svg' },
    { id: 'azure-openai', name: 'Azure OpenAI & Cognitive', icon: '/images/azure-icons/azure-openai.svg' },
    { id: 'azure-policy', name: 'Azure Policy & Governance', icon: '/images/azure-icons/azure-policy.svg' },
    { id: 'azure-dns', name: 'Azure DNS & Private Zones', icon: '/images/azure-icons/azure-dns.svg' },
    { id: 'azure-synapse', name: 'Synapse & Databricks', icon: '/images/azure-icons/azure-synapse.svg' }
  ];

  const QUICK_CHIPS = [
    { label: '⚡ Critical Only', filter: { severity: 'Critical' } },
    { label: '🛡️ Security Pillar', filter: { pillar: 'Security' } },
    { label: '🔐 Key Vault & HSM', filter: { category: 'azure-keyvault' } },
    { label: '🗄️ Blob Storage', filter: { category: 'azure-blob' } },
    { label: '☸️ AKS Defense', filter: { category: 'azure-aks' } },
    { label: '🌐 Hub-Spoke VNet', filter: { category: 'azure-vnet' } },
    { label: '🛡️ Defender CSPM', filter: { category: 'azure-defender' } },
    { label: '👁️ Sentinel SIEM', filter: { category: 'azure-sentinel' } }
  ];

  function readUrlParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.has('q')) STATE.query = params.get('q');
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
        return { pill: 'bg-rose-500/15 text-rose-300 border-rose-500/30', dot: 'bg-rose-500 animate-pulse' };
      case 'High':
        return { pill: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-500' };
      case 'Medium':
        return { pill: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30', dot: 'bg-yellow-500' };
      default:
        return { pill: 'bg-slate-500/15 text-slate-300 border-slate-500/30', dot: 'bg-slate-400' };
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

  function renderApp() {
    if (!container) return;

    const totalCount = STATE.filteredData.length;
    const totalPages = Math.ceil(totalCount / STATE.pageSize) || 1;
    const startIndex = (STATE.page - 1) * STATE.pageSize;
    const pageItems = STATE.filteredData.slice(startIndex, startIndex + STATE.pageSize);

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
              class="az-quick-chip rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              ${chip.label}
            </button>
          `).join('')}
          ${(STATE.category !== 'all' || STATE.pillar !== 'all' || STATE.severity !== 'all' || STATE.compliance !== 'all' || STATE.query) ? `
            <button id="az-reset-all" class="ml-auto text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Reset All Filters
            </button>
          ` : ''}
        </div>

        <!-- 24 Azure Domains Filter Pills with Real Icons -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Filter by Azure Domain (24 Domains)</h3>
            <span class="text-xs text-slate-500 dark:text-slate-400">Showing ${totalCount} matching architectures</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${CATEGORIES.map(cat => {
              const active = STATE.category === cat.id;
              return `
                <button
                  data-cat-id="${cat.id}"
                  class="az-cat-btn flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition border ${
                    active
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-500/30 hover:bg-slate-50 dark:hover:bg-white/[0.06]'
                  }"
                >
                  ${cat.icon ? `<img src="${cat.icon}" alt="" class="h-4 w-4 shrink-0" />` : ''}
                  <span>${cat.name}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Pillars & Severity Filter Bar -->
        <div class="flex flex-wrap items-center gap-4 text-xs">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-500 dark:text-slate-400">Pillar:</span>
            <div class="flex flex-wrap gap-1">
              ${PILLARS.map(p => `
                <button
                  data-pillar="${p}"
                  class="az-pillar-btn rounded-lg px-2.5 py-1 capitalize transition ${
                    STATE.pillar === p
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/40 font-semibold'
                      : 'bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white'
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
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/40 font-semibold'
                      : 'bg-slate-100 dark:bg-white/[0.03] text-slate-600 dark:text-slate-400 border border-transparent hover:text-slate-900 dark:hover:text-white'
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
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Try clearing your search query or choosing "All Azure Domains".</p>
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
                <div class="flex flex-col rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-md hover:border-blue-500/30 transition-all overflow-hidden">
                  <!-- Card Header -->
                  <div class="p-5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01]">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <div class="flex items-center gap-2">
                        <img src="${item.icon_url}" alt="" class="h-5 w-5 shrink-0" />
                        <span class="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">${item.id}</span>
                        <span class="text-slate-400">•</span>
                        <span class="text-xs text-slate-500 dark:text-slate-400">${item.category_name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${sevBadge.pill}">
                          <span class="h-1.5 w-1.5 rounded-full ${sevBadge.dot}"></span>
                          ${item.severity}
                        </span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-200 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300">
                          ${item.pillar}
                        </span>
                      </div>
                    </div>

                    <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug">${escapeHtml(item.title)}</h3>
                    <p class="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">${escapeHtml(item.description)}</p>
                  </div>

                  <!-- Segmented Tabs Bar -->
                  <div class="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-slate-100/70 dark:bg-[#060a14] px-4 py-2">
                    <div class="flex items-center gap-1">
                      <button
                        data-tab-item="${item.id}"
                        data-tab="diagram"
                        class="az-tab-btn px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === 'diagram' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }"
                      >
                        📐 Architecture Diagram
                      </button>
                      <button
                        data-tab-item="${item.id}"
                        data-tab="opa"
                        class="az-tab-btn px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === 'opa' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }"
                      >
                        🛡️ OPA Rego
                      </button>
                      <button
                        data-tab-item="${item.id}"
                        data-tab="tf"
                        class="az-tab-btn px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === 'tf' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }"
                      >
                        🏗️ Terraform IaC
                      </button>
                      <button
                        data-tab-item="${item.id}"
                        data-tab="compliance"
                        class="az-tab-btn px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                          activeTab === 'compliance' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }"
                      >
                        📋 Compliance
                      </button>
                    </div>

                    <div class="flex items-center gap-2">
                      <button
                        data-download-id="${item.id}"
                        class="az-download-svg-btn text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 flex items-center gap-1"
                        title="Download Vector SVG"
                      >
                        <span>Download SVG</span> ⭳
                      </button>
                      <button
                        data-modal-id="${item.id}"
                        class="az-modal-open-btn text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                        title="Expand Fullscreen"
                      >
                        ⛶
                      </button>
                    </div>
                  </div>

                  <!-- Tab Content Area -->
                  <div class="flex-1 p-4 bg-slate-50/50 dark:bg-[#050811]">
                    ${activeTab === 'diagram' ? `
                      <div
                        class="blueprint-canvas relative flex items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#090e1c] overflow-x-auto min-h-[220px]"
                        style="background-image: radial-gradient(rgba(59, 130, 246, 0.12) 1px, transparent 0); background-size: 20px 20px;"
                      >
                        <div class="w-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto">
                          ${item.svg}
                        </div>
                      </div>
                    ` : ''}

                    ${activeTab === 'opa' ? `
                      <div class="relative rounded-xl border border-slate-300 dark:border-white/10 bg-slate-900 p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[240px]">
                        <button
                          data-copy-text="${escapeHtml(item.opa_policy)}"
                          class="az-copy-btn absolute right-3 top-3 px-2 py-1 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200"
                        >
                          Copy Rego
                        </button>
                        <pre>${highlightCode(item.opa_policy, 'rego')}</pre>
                      </div>
                    ` : ''}

                    ${activeTab === 'tf' ? `
                      <div class="relative rounded-xl border border-slate-300 dark:border-white/10 bg-slate-900 p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[240px]">
                        <button
                          data-copy-text="${escapeHtml(item.terraform)}"
                          class="az-copy-btn absolute right-3 top-3 px-2 py-1 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200"
                        >
                          Copy Terraform
                        </button>
                        <pre>${highlightCode(item.terraform, 'tf')}</pre>
                      </div>
                    ` : ''}

                    ${activeTab === 'compliance' ? `
                      <div class="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#090d1a] p-4 text-xs space-y-3">
                        <div>
                          <span class="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Mapped Compliance Frameworks:</span>
                          <div class="flex flex-wrap gap-1.5">
                            ${(item.compliance || []).map(c => `
                              <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 text-[11px]">
                                ${escapeHtml(c)}
                              </span>
                            `).join('')}
                          </div>
                        </div>

                        <div>
                          <span class="font-semibold text-slate-600 dark:text-slate-400 block mb-1">Architecture Remediation:</span>
                          <p class="text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(item.remediation)}</p>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>

      <!-- Pagination -->
      ${totalPages > 1 ? `
        <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-white/10 pt-6 text-xs">
          <span class="text-slate-500 dark:text-slate-400">
            Showing ${startIndex + 1} to ${Math.min(startIndex + STATE.pageSize, totalCount)} of ${totalCount} architectures
          </span>

          <div class="flex items-center gap-2">
            <button
              id="az-prev-page"
              ${STATE.page === 1 ? 'disabled' : ''}
              class="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              ← Previous
            </button>

            <span class="px-2 font-mono text-slate-900 dark:text-white">
              Page ${STATE.page} of ${totalPages}
            </span>

            <button
              id="az-next-page"
              ${STATE.page === totalPages ? 'disabled' : ''}
              class="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] px-3 py-1.5 font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              Next →
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Fullscreen Modal View -->
      ${STATE.modalItem ? `
        <div id="az-modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div class="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-white/20 bg-[#0c1222] shadow-2xl overflow-hidden" onclick="event.stopPropagation()">
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-white/10 p-5 bg-[#090e1c]">
              <div class="flex items-center gap-3">
                <img src="${STATE.modalItem.icon_url}" alt="" class="h-6 w-6" />
                <div>
                  <span class="font-mono text-xs font-bold text-blue-400">${STATE.modalItem.id}</span>
                  <h3 class="text-lg font-bold text-white">${escapeHtml(STATE.modalItem.title)}</h3>
                </div>
              </div>
              <button id="az-modal-close" class="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
                ✕
              </button>
            </div>

            <!-- Modal Body -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
              <div
                class="blueprint-canvas relative flex items-center justify-center p-6 rounded-2xl border border-white/10 bg-[#090e1c]"
                style="background-image: radial-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 0); background-size: 24px 24px;"
              >
                <div class="w-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:h-auto">
                  ${STATE.modalItem.svg}
                </div>
              </div>

              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Architecture Description</h4>
                <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(STATE.modalItem.description)}</p>
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="rounded-xl border border-white/10 bg-[#080d1a] p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-cyan-400">Open Policy Agent (OPA Rego)</span>
                    <button data-copy-text="${escapeHtml(STATE.modalItem.opa_policy)}" class="az-copy-btn px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200">
                      Copy
                    </button>
                  </div>
                  <pre class="text-xs font-mono text-slate-200 overflow-x-auto max-h-[220px]">${highlightCode(STATE.modalItem.opa_policy, 'rego')}</pre>
                </div>

                <div class="rounded-xl border border-white/10 bg-[#080d1a] p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-blue-400">Terraform IaC Baseline</span>
                    <button data-copy-text="${escapeHtml(STATE.modalItem.terraform)}" class="az-copy-btn px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-200">
                      Copy
                    </button>
                  </div>
                  <pre class="text-xs font-mono text-slate-200 overflow-x-auto max-h-[220px]">${highlightCode(STATE.modalItem.terraform, 'tf')}</pre>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-between border-t border-white/10 p-4 bg-[#090e1c]">
              <span class="text-xs text-slate-400">
                Pillar: <strong class="text-white">${STATE.modalItem.pillar}</strong> • Severity: <strong class="text-rose-400">${STATE.modalItem.severity}</strong>
              </span>
              <button data-download-id="${STATE.modalItem.id}" class="az-download-svg-btn px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 flex items-center gap-1.5">
                <span>Download Vector SVG</span> ⭳
              </button>
            </div>
          </div>
        </div>
      ` : ''}
    `;

    container.innerHTML = html;
    bindEvents();
    updateUrlParams();
  }

  function bindEvents() {
    if (!container) return;

    // Search input
    const searchInput = container.querySelector('#az-search-input');
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          STATE.query = e.target.value;
          STATE.page = 1;
          applyFilters();
          renderApp();
          const nextInput = container.querySelector('#az-search-input');
          if (nextInput) {
            nextInput.focus();
            nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
          }
        }, 150);
      });
    }

    const clearSearchBtn = container.querySelector('#az-clear-search');
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        STATE.query = '';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    const resetAllBtn = container.querySelector('#az-reset-all');
    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', () => {
        STATE.category = 'all';
        STATE.pillar = 'all';
        STATE.severity = 'all';
        STATE.compliance = 'all';
        STATE.query = '';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    const emptyResetBtn = container.querySelector('#az-empty-reset');
    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', () => {
        STATE.category = 'all';
        STATE.pillar = 'all';
        STATE.severity = 'all';
        STATE.compliance = 'all';
        STATE.query = '';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Quick chips
    container.querySelectorAll('.az-quick-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-chip-idx'), 10);
        const chip = QUICK_CHIPS[idx];
        if (chip) {
          if (chip.filter.severity) STATE.severity = chip.filter.severity;
          if (chip.filter.pillar) STATE.pillar = chip.filter.pillar;
          if (chip.filter.category) STATE.category = chip.filter.category;
          STATE.page = 1;
          applyFilters();
          renderApp();
        }
      });
    });

    // Category pills
    container.querySelectorAll('.az-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.category = btn.getAttribute('data-cat-id');
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Pillar buttons
    container.querySelectorAll('.az-pillar-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.pillar = btn.getAttribute('data-pillar');
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Severity buttons
    container.querySelectorAll('.az-sev-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.severity = btn.getAttribute('data-severity');
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Segmented tab switching
    container.querySelectorAll('.az-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-tab-item');
        const tab = btn.getAttribute('data-tab');
        STATE.activeTabs[itemId] = tab;
        renderApp();
      });
    });

    // Copy buttons
    container.querySelectorAll('.az-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-copy-text');
        copyText(text, btn);
      });
    });

    // Download SVG buttons
    container.querySelectorAll('.az-download-svg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-download-id');
        const item = STATE.allData.find(d => d.id === id);
        if (item) downloadSvg(item.svg, item.id);
      });
    });

    // Modal open
    container.querySelectorAll('.az-modal-open-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-modal-id');
        const item = STATE.allData.find(d => d.id === id);
        if (item) {
          STATE.modalItem = item;
          renderApp();
        }
      });
    });

    // Modal close
    const modalBackdrop = container.querySelector('#az-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', () => {
        STATE.modalItem = null;
        renderApp();
      });
    }

    const modalCloseBtn = container.querySelector('#az-modal-close');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        STATE.modalItem = null;
        renderApp();
      });
    }

    // Pagination
    const prevBtn = container.querySelector('#az-prev-page');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (STATE.page > 1) {
          STATE.page--;
          renderApp();
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    const nextBtn = container.querySelector('#az-next-page');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(STATE.filteredData.length / STATE.pageSize);
        if (STATE.page < totalPages) {
          STATE.page++;
          renderApp();
          container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  // Keyboard listener for Escape to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && STATE.modalItem) {
      STATE.modalItem = null;
      renderApp();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
