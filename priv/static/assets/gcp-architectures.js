// GCP Architecture Best Practices Catalog Controller (Powered by Obsidian Pele)
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
    { id: 'identity-governance', name: 'Identity & Governance', icon: '🔑', categoryIds: ['gcp-iam', 'gcp-org-policy', 'gcp-iap'] },
    { id: 'compute-containers', name: 'Compute & Containers', icon: '⚡', categoryIds: ['gcp-gce', 'gcp-gke', 'gcp-artifact'] },
    { id: 'storage-databases', name: 'Storage & Databases', icon: '🗄️', categoryIds: ['gcp-gcs', 'gcp-sql', 'gcp-spanner'] },
    { id: 'network-perimeter', name: 'Network & Perimeter', icon: '🌐', categoryIds: ['gcp-vpc', 'gcp-armor', 'gcp-psc', 'gcp-dns'] },
    { id: 'security-kms-posture', name: 'Security, KMS & Posture', icon: '🔒', categoryIds: ['gcp-kms', 'gcp-secrets', 'gcp-scc', 'gcp-dlp'] },
    { id: 'telemetry-siem', name: 'Telemetry & SIEM', icon: '📊', categoryIds: ['gcp-logging', 'gcp-monitoring', 'gcp-chronicle'] },
    { id: 'serverless-ai', name: 'Serverless & AI Workloads', icon: '🧠', categoryIds: ['gcp-cloudrun', 'gcp-pubsub', 'gcp-vertex', 'gcp-bigquery'] }
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
    { id: 'CIS', name: 'CIS Google Cloud Platform Foundation Benchmark v3.0' },
    { id: 'NIST', name: 'NIST SP 800-53 / 800-171' },
    { id: 'PCI-DSS', name: 'PCI-DSS v4.0' },
    { id: 'SOC 2', name: 'SOC 2 Type II' },
    { id: 'HIPAA', name: 'HIPAA Security Rule' },
    { id: 'FedRAMP', name: 'FedRAMP High' },
    { id: 'ISO 27001', name: 'ISO/IEC 27001:2022' }
  ];

  const CATEGORIES = [
    { id: 'all', name: 'All 24 Domains', icon: null, domain: 'all' },
    { id: 'gcp-iam', name: 'Cloud IAM & Workload Identity', icon: '/images/gcp-icons/gcp-iam.svg', domain: 'identity-governance' },
    { id: 'gcp-org-policy', name: 'Org Policy & Hierarchy', icon: '/images/gcp-icons/gcp-org-policy.svg', domain: 'identity-governance' },
    { id: 'gcp-iap', name: 'Identity-Aware Proxy (IAP)', icon: '/images/gcp-icons/gcp-iap.svg', domain: 'identity-governance' },
    { id: 'gcp-gce', name: 'Compute Engine & Shielded VM', icon: '/images/gcp-icons/gcp-gce.svg', domain: 'compute-containers' },
    { id: 'gcp-gke', name: 'GKE Enterprise & Autopilot', icon: '/images/gcp-icons/gcp-gke.svg', domain: 'compute-containers' },
    { id: 'gcp-artifact', name: 'Artifact Registry & BinAuth', icon: '/images/gcp-icons/gcp-artifact.svg', domain: 'compute-containers' },
    { id: 'gcp-gcs', name: 'Cloud Storage & Bucket Lock', icon: '/images/gcp-icons/gcp-gcs.svg', domain: 'storage-databases' },
    { id: 'gcp-sql', name: 'Cloud SQL & AlloyDB Enclaves', icon: '/images/gcp-icons/gcp-sql.svg', domain: 'storage-databases' },
    { id: 'gcp-spanner', name: 'Cloud Spanner & Bigtable', icon: '/images/gcp-icons/gcp-spanner.svg', domain: 'storage-databases' },
    { id: 'gcp-vpc', name: 'VPC & Hierarchical Firewalls', icon: '/images/gcp-icons/gcp-vpc.svg', domain: 'network-perimeter' },
    { id: 'gcp-armor', name: 'Cloud Armor WAF & Adaptive DDoS', icon: '/images/gcp-icons/gcp-armor.svg', domain: 'network-perimeter' },
    { id: 'gcp-psc', name: 'Private Service Connect (PSC)', icon: '/images/gcp-icons/gcp-psc.svg', domain: 'network-perimeter' },
    { id: 'gcp-dns', name: 'Cloud DNS & DNSSEC Defense', icon: '/images/gcp-icons/gcp-dns.svg', domain: 'network-perimeter' },
    { id: 'gcp-kms', name: 'Cloud KMS & Cloud HSM', icon: '/images/gcp-icons/gcp-kms.svg', domain: 'security-kms-posture' },
    { id: 'gcp-secrets', name: 'Secret Manager & Rotation', icon: '/images/gcp-icons/gcp-secrets.svg', domain: 'security-kms-posture' },
    { id: 'gcp-scc', name: 'Security Command Center (SCC)', icon: '/images/gcp-icons/gcp-scc.svg', domain: 'security-kms-posture' },
    { id: 'gcp-dlp', name: 'Cloud DLP / Sensitive Data', icon: '/images/gcp-icons/gcp-dlp.svg', domain: 'security-kms-posture' },
    { id: 'gcp-logging', name: 'Cloud Logging & Audit Sinks', icon: '/images/gcp-icons/gcp-logging.svg', domain: 'telemetry-siem' },
    { id: 'gcp-monitoring', name: 'Cloud Monitoring & Alerts', icon: '/images/gcp-icons/gcp-monitoring.svg', domain: 'telemetry-siem' },
    { id: 'gcp-chronicle', name: 'Chronicle SIEM & SOAR', icon: '/images/gcp-icons/gcp-chronicle.svg', domain: 'telemetry-siem' },
    { id: 'gcp-cloudrun', name: 'Cloud Run & Serverless Sandboxes', icon: '/images/gcp-icons/gcp-cloudrun.svg', domain: 'serverless-ai' },
    { id: 'gcp-pubsub', name: 'Cloud Pub/Sub & Eventarc Bus', icon: '/images/gcp-icons/gcp-pubsub.svg', domain: 'serverless-ai' },
    { id: 'gcp-vertex', name: 'Vertex AI & Generative Defense', icon: '/images/gcp-icons/gcp-vertex.svg', domain: 'serverless-ai' },
    { id: 'gcp-bigquery', name: 'BigQuery & Column-Level Security', icon: '/images/gcp-icons/gcp-bigquery.svg', domain: 'serverless-ai' }
  ];

  const QUICK_CHIPS = [
    { label: '⚡ Critical Only', filter: { severity: 'Critical' } },
    { label: '🛡️ Security Pillar', filter: { pillar: 'Security' } },
    { label: '🔐 Cloud KMS & HSM', filter: { category: 'gcp-kms', domain: 'security-kms-posture' } },
    { label: '🗄️ Cloud Storage Lock', filter: { category: 'gcp-gcs', domain: 'storage-databases' } },
    { label: '☸️ GKE Autopilot', filter: { category: 'gcp-gke', domain: 'compute-containers' } },
    { label: '🌐 VPC Service Controls', filter: { category: 'gcp-psc', domain: 'network-perimeter' } },
    { label: '🛡️ SCC Premium', filter: { category: 'gcp-scc', domain: 'security-kms-posture' } },
    { label: '👁️ Chronicle SIEM', filter: { category: 'gcp-chronicle', domain: 'telemetry-siem' } }
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
    container = document.getElementById('gcp-architecture-app');
    if (!container) return;
    readUrlParams();

    try {
      let resp = await fetch('/data/gcp-best-practices.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status + ' loading GCP dataset');
      STATE.allData = await resp.json();
      applyFilters();
      renderApp();
    } catch (err) {
      console.error('GCP Architecture Catalog Error:', err);
      if (container) {
        container.innerHTML = `
          <div class="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-300">
            <p class="font-bold text-lg">Failed to load GCP Architecture dataset</p>
            <p class="text-sm mt-1 text-slate-400">${escapeHtml(err.message)}</p>
            <p class="text-xs mt-3 text-slate-500">Please verify that /data/gcp-best-practices.json is accessible.</p>
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
        .replace(/\b(package|default|allow|deny|import|input|data|not|else|some|in)\b/g, '<span class="text-emerald-400 font-bold">$1</span>')
        .replace(/(&quot;.*?&quot;)/g, '<span class="text-cyan-300">$1</span>')
        .replace(/(\b[a-zA-Z_][a-zA-Z0-9_]*\b)(?=\s*:=)/g, '<span class="text-purple-300 font-semibold">$1</span>');
    } else if (type === 'tf') {
      safe = safe
        .replace(/(#.*$)/gm, '<span class="text-slate-500 italic">$1</span>')
        .replace(/\b(resource|data|variable|output|locals|module|terraform|lifecycle|prevent_destroy)\b/g, '<span class="text-emerald-400 font-bold">$1</span>')
        .replace(/(&quot;.*?&quot;)/g, '<span class="text-cyan-300">$1</span>')
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
    a.download = `${id}-gcp-architecture.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function getDomainCount(domId) {
    if (domId === 'all') return STATE.allData.length;
    const dom = DOMAINS.find(d => d.id === domId);
    if (!dom) return 0;
    return STATE.allData.filter(item => dom.categoryIds.includes(item.category)).length;
  }

  function getCategoryCount(catId) {
    if (catId === 'all') {
      if (STATE.domain === 'all') return STATE.allData.length;
      const dom = DOMAINS.find(d => d.id === STATE.domain);
      if (!dom) return 0;
      return STATE.allData.filter(item => dom.categoryIds.includes(item.category)).length;
    }
    return STATE.allData.filter(item => item.category === catId).length;
  }

  function renderApp() {
    if (!container) return;
    updateUrlParams();

    const visibleCategories = STATE.domain === 'all'
      ? CATEGORIES
      : [
          CATEGORIES[0],
          ...CATEGORIES.filter(c => {
            const dom = DOMAINS.find(d => d.id === STATE.domain);
            return dom && dom.categoryIds.includes(c.id);
          })
        ];

    const totalPages = Math.ceil(STATE.filteredData.length / STATE.pageSize) || 1;
    const startIdx = (STATE.page - 1) * STATE.pageSize;
    const endIdx = startIdx + STATE.pageSize;
    const pageItems = STATE.filteredData.slice(startIdx, endIdx);

    const isFiltered =
      STATE.query ||
      STATE.domain !== 'all' ||
      STATE.category !== 'all' ||
      STATE.pillar !== 'all' ||
      STATE.severity !== 'all' ||
      STATE.compliance !== 'all';

    let html = `
      <div class="space-y-6">
        <!-- Top Search Box & Quick Chips -->
        <div class="space-y-4">
          <div class="relative">
            <input
              type="text"
              id="gcp-search-input"
              value="${escapeHtml(STATE.query)}"
              placeholder="Search by GCP service, defensive title, OPA rule, CIS benchmark, or NIST control..."
              class="w-full rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.04] px-4 py-3.5 pl-11 pr-24 text-sm text-slate-900 dark:text-white placeholder-slate-400 shadow-sm dark:shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
            />
            <svg class="absolute left-4 top-4 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div class="absolute right-3.5 top-3 flex items-center gap-2">
              ${STATE.query ? `
                <button id="gcp-search-clear" class="rounded-md bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition">
                  Clear
                </button>
              ` : ''}
              <span class="hidden sm:inline-block rounded px-1.5 py-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
                ⌘K
              </span>
            </div>
          </div>

          <!-- Quick Filter Chips -->
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="font-semibold text-slate-500 dark:text-slate-400 mr-1">Quick Filters:</span>
            ${QUICK_CHIPS.map((chip, idx) => `
              <button
                data-chip-index="${idx}"
                class="gcp-quick-chip rounded-lg px-2.5 py-1 font-medium transition border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5"
              >
                ${chip.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 7 Core Security Domains Tab Strip -->
        <div class="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.02] p-1.5 shadow-sm">
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
            ${DOMAINS.map(d => {
              const active = STATE.domain === d.id;
              const count = getDomainCount(d.id);
              return `
                <button
                  data-domain-id="${d.id}"
                  class="gcp-domain-tab flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center transition ${
                    active
                      ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/[0.05]'
                  }"
                >
                  <span class="text-base">${d.icon}</span>
                  <span class="text-xs font-semibold leading-tight line-clamp-1">${escapeHtml(d.name)}</span>
                  <span class="text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }">
                    ${count}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 24 GCP Service Sub-Category Filters (Horizontally Scrollable) -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          ${visibleCategories.map(cat => {
            const active = STATE.category === cat.id;
            const count = getCategoryCount(cat.id);
            return `
              <button
                data-category-id="${cat.id}"
                class="gcp-cat-btn shrink-0 flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition border ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20'
                }"
              >
                ${cat.icon ? `<img src="${cat.icon}" alt="" class="h-4 w-4 shrink-0 rounded" />` : ''}
                <span>${escapeHtml(cat.name)}</span>
                <span class="rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                  active
                    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                }">
                  ${count}
                </span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Secondary Dropdown Filters -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 dark:border-white/10 py-3.5">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Pillar -->
            <div class="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span>Pillar:</span>
              <select id="gcp-pillar-select" class="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121826] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none">
                ${PILLARS.map(p => `
                  <option value="${p}" ${STATE.pillar === p ? 'selected' : ''}>
                    ${p === 'all' ? 'All Pillars' : p}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Severity -->
            <div class="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span>Severity:</span>
              <select id="gcp-severity-select" class="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121826] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none">
                <option value="all" ${STATE.severity === 'all' ? 'selected' : ''}>All Severities</option>
                <option value="Critical" ${STATE.severity === 'Critical' ? 'selected' : ''}>Critical</option>
                <option value="High" ${STATE.severity === 'High' ? 'selected' : ''}>High</option>
                <option value="Medium" ${STATE.severity === 'Medium' ? 'selected' : ''}>Medium</option>
                <option value="Low" ${STATE.severity === 'Low' ? 'selected' : ''}>Low</option>
              </select>
            </div>

            <!-- Compliance -->
            <div class="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span>Compliance:</span>
              <select id="gcp-compliance-select" class="rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-[#121826] px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none">
                ${COMPLIANCE_FRAMEWORKS.map(f => `
                  <option value="${f.id}" ${STATE.compliance === f.id ? 'selected' : ''}>
                    ${f.name}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Counter and Reset -->
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-500 dark:text-slate-400">
              Showing <strong class="text-slate-900 dark:text-white">${STATE.filteredData.length}</strong> of ${STATE.allData.length} patterns
            </span>
            ${isFiltered ? `
              <button id="gcp-reset-filters" class="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                Reset All Filters
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Architecture Cards Grid -->
        ${STATE.filteredData.length === 0 ? `
          <div class="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-12 text-center">
            <p class="text-base font-semibold text-slate-700 dark:text-slate-300">No architecture patterns matched your filter criteria.</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Try adjusting your search terms or clearing domain and severity filters.</p>
            <button id="gcp-empty-reset" class="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition">
              Reset Filters
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            ${pageItems.map(item => renderCard(item)).join('')}
          </div>

          <!-- Pagination Bar -->
          ${totalPages > 1 ? renderPagination(totalPages) : ''}
        `}
      </div>

      <!-- Modal Container Mount Point -->
      <div id="gcp-modal-container">
        ${STATE.modalItem ? renderModal(STATE.modalItem) : ''}
      </div>
    `;

    container.innerHTML = html;
    attachEventListeners();
  }

  function renderCard(item) {
    const activeTab = STATE.activeTabs[item.id] || 'diagram';
    const sev = getSeverityBadge(item.severity);

    return `
      <div class="gcp-card rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden">
        <!-- Card Header -->
        <div class="p-5 border-b border-slate-100 dark:border-white/[0.06]">
          <div class="flex items-start justify-between gap-3 mb-2.5">
            <div class="flex items-center gap-2">
              <span class="rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.05] px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">
                ${escapeHtml(item.id)}
              </span>
              <span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${sev.pill}">
                <span class="h-1.5 w-1.5 rounded-full ${sev.dot}"></span>
                ${escapeHtml(item.severity)}
              </span>
              <span class="rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-medium">
                ${escapeHtml(item.pillar)}
              </span>
            </div>

            <!-- Modal Zoom Button -->
            <button
              data-zoom-id="${item.id}"
              class="gcp-zoom-btn text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition"
              title="Expand into full-screen dialog"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
            </button>
          </div>

          <h3 class="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            ${escapeHtml(item.title)}
          </h3>

          <div class="mt-2.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            ${item.icon_url ? `<img src="${item.icon_url}" alt="" class="h-4 w-4 rounded" />` : ''}
            <span class="font-medium text-slate-700 dark:text-slate-300">${escapeHtml(item.service)}</span>
            <span>•</span>
            <span class="truncate">${escapeHtml(item.category_name)}</span>
          </div>
        </div>

        <!-- Description Box -->
        <div class="px-5 py-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-b border-slate-100 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.01]">
          ${escapeHtml(item.description)}
        </div>

        <!-- View Tabs Bar -->
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02] px-4 py-1.5 text-xs">
          <div class="flex items-center gap-1">
            <button
              data-tab-item="${item.id}"
              data-tab-type="diagram"
              class="gcp-tab-btn rounded-md px-2.5 py-1 font-semibold transition ${
                activeTab === 'diagram'
                  ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }"
            >
              📐 Pele Architecture
            </button>
            <button
              data-tab-item="${item.id}"
              data-tab-type="opa"
              class="gcp-tab-btn rounded-md px-2.5 py-1 font-semibold transition ${
                activeTab === 'opa'
                  ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }"
            >
              🛡️ OPA Rego
            </button>
            <button
              data-tab-item="${item.id}"
              data-tab-type="tf"
              class="gcp-tab-btn rounded-md px-2.5 py-1 font-semibold transition ${
                activeTab === 'tf'
                  ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }"
            >
              🏗️ Terraform
            </button>
            <button
              data-tab-item="${item.id}"
              data-tab-type="compliance"
              class="gcp-tab-btn rounded-md px-2.5 py-1 font-semibold transition ${
                activeTab === 'compliance'
                  ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }"
            >
              📋 Compliance
            </button>
          </div>

          <!-- Quick Actions on Card -->
          <div class="flex items-center gap-1.5">
            ${activeTab === 'diagram' ? `
              <button
                data-dl-id="${item.id}"
                class="gcp-dl-btn text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                title="Download Vector SVG"
              >
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                SVG
              </button>
            ` : ''}
            ${activeTab === 'opa' ? `
              <button
                data-copy-text="${encodeURIComponent(item.opa_policy)}"
                class="gcp-copy-btn text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Copy Rego
              </button>
            ` : ''}
            ${activeTab === 'tf' ? `
              <button
                data-copy-text="${encodeURIComponent(item.terraform)}"
                class="gcp-copy-btn text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Copy IaC
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Tab Content Body -->
        <div class="p-4 bg-slate-950 flex-1 flex flex-col justify-center min-h-[260px] overflow-x-auto text-slate-100">
          ${activeTab === 'diagram' ? `
            <div class="pele-svg-wrapper flex items-center justify-center w-full overflow-hidden">
              ${item.svg}
            </div>
          ` : ''}

          ${activeTab === 'opa' ? `
            <div class="relative w-full">
              <pre class="font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto max-h-[320px] p-2"><code>${highlightCode(item.opa_policy, 'rego')}</code></pre>
            </div>
          ` : ''}

          ${activeTab === 'tf' ? `
            <div class="relative w-full">
              <pre class="font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto max-h-[320px] p-2"><code>${highlightCode(item.terraform, 'tf')}</code></pre>
            </div>
          ` : ''}

          ${activeTab === 'compliance' ? `
            <div class="space-y-3 p-2 text-xs">
              <div>
                <span class="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1.5">Mapped Security Standards</span>
                <div class="flex flex-wrap gap-1.5">
                  ${(item.compliance || []).map(c => `
                    <span class="rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-1 font-mono text-[11px]">
                      ${escapeHtml(c)}
                    </span>
                  `).join('')}
                </div>
              </div>

              <div class="pt-2 border-t border-white/10">
                <span class="text-slate-400 uppercase tracking-wider text-[10px] font-bold block mb-1">Remediation Workflow</span>
                <p class="text-slate-300 font-mono text-[11px] bg-white/[0.03] p-2 rounded-lg border border-white/5">
                  ${escapeHtml(item.remediation)}
                </p>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  function renderModal(item) {
    const sev = getSeverityBadge(item.severity);
    const tab = STATE.modalTab;

    return `
      <div id="gcp-modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div class="relative w-full max-w-5xl max-h-[92vh] rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c121e] shadow-2xl flex flex-col overflow-hidden">
          <!-- Modal Header -->
          <div class="p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10">
                  ${escapeHtml(item.id)}
                </span>
                <span class="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${sev.pill}">
                  <span class="h-1.5 w-1.5 rounded-full ${sev.dot}"></span>
                  ${escapeHtml(item.severity)}
                </span>
                <span class="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium">
                  ${escapeHtml(item.pillar)}
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                ${escapeHtml(item.title)}
              </h2>
              <div class="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                ${item.icon_url ? `<img src="${item.icon_url}" alt="" class="h-4 w-4 rounded" />` : ''}
                <strong class="text-slate-700 dark:text-slate-300">${escapeHtml(item.service)}</strong>
                <span>•</span>
                <span>${escapeHtml(item.category_name)}</span>
              </div>
            </div>

            <button id="gcp-modal-close" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Modal Description -->
          <div class="px-6 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            ${escapeHtml(item.description)}
          </div>

          <!-- Modal Tabs Strip -->
          <div class="px-6 py-2 border-b border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/[0.01] flex items-center justify-between text-xs sm:text-sm">
            <div class="flex items-center gap-2">
              <button data-mtab="diagram" class="gcp-mtab-btn px-3 py-1.5 rounded-lg font-semibold transition ${tab === 'diagram' ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}">
                📐 Architecture Diagram (Pele)
              </button>
              <button data-mtab="opa" class="gcp-mtab-btn px-3 py-1.5 rounded-lg font-semibold transition ${tab === 'opa' ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}">
                🛡️ OPA Rego Policy
              </button>
              <button data-mtab="tf" class="gcp-mtab-btn px-3 py-1.5 rounded-lg font-semibold transition ${tab === 'tf' ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}">
                🏗️ Terraform IaC
              </button>
              <button data-mtab="compliance" class="gcp-mtab-btn px-3 py-1.5 rounded-lg font-semibold transition ${tab === 'compliance' ? 'bg-white dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-500/30' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}">
                📋 Compliance Standards
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button data-dl-id="${item.id}" class="gcp-dl-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Download Vector SVG
              </button>
            </div>
          </div>

          <!-- Modal Body Content -->
          <div class="p-6 overflow-y-auto flex-1 bg-slate-950 text-slate-100 flex flex-col justify-center items-center min-h-[380px]">
            ${tab === 'diagram' ? `
              <div class="pele-svg-wrapper w-full flex items-center justify-center p-4">
                ${item.svg}
              </div>
            ` : ''}

            ${tab === 'opa' ? `
              <div class="w-full relative">
                <div class="flex justify-end mb-2">
                  <button data-copy-text="${encodeURIComponent(item.opa_policy)}" class="gcp-copy-btn px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-emerald-400 transition">
                    Copy Rego
                  </button>
                </div>
                <pre class="font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto p-4 bg-slate-900 rounded-xl border border-white/10 max-h-[500px]"><code>${highlightCode(item.opa_policy, 'rego')}</code></pre>
              </div>
            ` : ''}

            ${tab === 'tf' ? `
              <div class="w-full relative">
                <div class="flex justify-end mb-2">
                  <button data-copy-text="${encodeURIComponent(item.terraform)}" class="gcp-copy-btn px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-xs font-mono text-emerald-400 transition">
                    Copy Terraform
                  </button>
                </div>
                <pre class="font-mono text-xs leading-relaxed text-slate-200 overflow-x-auto p-4 bg-slate-900 rounded-xl border border-white/10 max-h-[500px]"><code>${highlightCode(item.terraform, 'tf')}</code></pre>
              </div>
            ` : ''}

            ${tab === 'compliance' ? `
              <div class="w-full space-y-4 text-sm p-4 bg-slate-900 rounded-xl border border-white/10">
                <div>
                  <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Regulatory & Compliance Controls</h4>
                  <div class="flex flex-wrap gap-2">
                    ${(item.compliance || []).map(c => `
                      <span class="rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 font-mono text-xs">
                        ${escapeHtml(c)}
                      </span>
                    `).join('')}
                  </div>
                </div>

                <div class="pt-4 border-t border-white/10">
                  <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Remediation Guide</h4>
                  <div class="bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-xs text-slate-300">
                    ${escapeHtml(item.remediation)}
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function renderPagination(totalPages) {
    const cur = STATE.page;
    const pages = [];

    pages.push(1);
    if (cur > 3) pages.push('...');
    for (let p = Math.max(2, cur - 1); p <= Math.min(totalPages - 1, cur + 1); p++) {
      pages.push(p);
    }
    if (cur < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return `
      <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
        <span class="text-xs text-slate-500 dark:text-slate-400">
          Page <strong class="text-slate-900 dark:text-white">${cur}</strong> of ${totalPages}
        </span>

        <div class="flex items-center gap-1.5">
          <button
            id="gcp-prev-page"
            ${cur <= 1 ? 'disabled' : ''}
            class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-medium ${
              cur <= 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }"
          >
            Previous
          </button>

          ${pages.map(p => {
            if (p === '...') {
              return `<span class="px-2 text-xs text-slate-400">…</span>`;
            }
            const active = p === cur;
            return `
              <button
                data-page-num="${p}"
                class="gcp-page-btn h-8 w-8 rounded-lg text-xs font-semibold transition ${
                  active
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                }"
              >
                ${p}
              </button>
            `;
          }).join('')}

          <button
            id="gcp-next-page"
            ${cur >= totalPages ? 'disabled' : ''}
            class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-medium ${
              cur >= totalPages
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
            }"
          >
            Next
          </button>
        </div>
      </div>
    `;
  }

  function attachEventListeners() {
    // Search input
    const searchInput = document.getElementById('gcp-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        STATE.query = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    const clearBtn = document.getElementById('gcp-search-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        STATE.query = '';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Quick chips
    document.querySelectorAll('.gcp-quick-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.chipIndex, 10);
        const chip = QUICK_CHIPS[idx];
        if (chip) {
          if (chip.filter.severity) STATE.severity = chip.filter.severity;
          if (chip.filter.pillar) STATE.pillar = chip.filter.pillar;
          if (chip.filter.category) STATE.category = chip.filter.category;
          if (chip.filter.domain) STATE.domain = chip.filter.domain;
          STATE.page = 1;
          applyFilters();
          renderApp();
        }
      });
    });

    // Domain tabs
    document.querySelectorAll('.gcp-domain-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const domId = btn.dataset.domainId;
        STATE.domain = domId;
        STATE.category = 'all';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Category buttons
    document.querySelectorAll('.gcp-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.categoryId;
        STATE.category = catId;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Dropdowns
    const pillarSelect = document.getElementById('gcp-pillar-select');
    if (pillarSelect) {
      pillarSelect.addEventListener('change', (e) => {
        STATE.pillar = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    const severitySelect = document.getElementById('gcp-severity-select');
    if (severitySelect) {
      severitySelect.addEventListener('change', (e) => {
        STATE.severity = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    const complianceSelect = document.getElementById('gcp-compliance-select');
    if (complianceSelect) {
      complianceSelect.addEventListener('change', (e) => {
        STATE.compliance = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Reset buttons
    const resetBtn = document.getElementById('gcp-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAll);
    }
    const emptyReset = document.getElementById('gcp-empty-reset');
    if (emptyReset) {
      emptyReset.addEventListener('click', resetAll);
    }

    // Card Tabs
    document.querySelectorAll('.gcp-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.tabItem;
        const tabType = btn.dataset.tabType;
        STATE.activeTabs[itemId] = tabType;
        renderApp();
      });
    });

    // Zoom into Modal
    document.querySelectorAll('.gcp-zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.zoomId;
        const item = STATE.allData.find(d => d.id === itemId);
        if (item) {
          STATE.modalItem = item;
          STATE.modalTab = 'diagram';
          renderApp();
        }
      });
    });

    // Modal Close
    const modalClose = document.getElementById('gcp-modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        STATE.modalItem = null;
        renderApp();
      });
    }

    const modalBackdrop = document.getElementById('gcp-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          STATE.modalItem = null;
          renderApp();
        }
      });
    }

    // Modal Tabs
    document.querySelectorAll('.gcp-mtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.modalTab = btn.dataset.mtab;
        renderApp();
      });
    });

    // SVG Download
    document.querySelectorAll('.gcp-dl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.dlId;
        const item = STATE.allData.find(d => d.id === itemId);
        if (item && item.svg) {
          downloadSvg(item.svg, item.id);
        }
      });
    });

    // Copy Text
    document.querySelectorAll('.gcp-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const raw = decodeURIComponent(btn.dataset.copyText || '');
        if (raw) copyText(raw, btn);
      });
    });

    // Pagination
    const prevBtn = document.getElementById('gcp-prev-page');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (STATE.page > 1) {
          STATE.page--;
          renderApp();
          scrollToCatalog();
        }
      });
    }

    const nextBtn = document.getElementById('gcp-next-page');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(STATE.filteredData.length / STATE.pageSize) || 1;
        if (STATE.page < totalPages) {
          STATE.page++;
          renderApp();
          scrollToCatalog();
        }
      });
    }

    document.querySelectorAll('.gcp-page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.pageNum, 10);
        if (p && p !== STATE.page) {
          STATE.page = p;
          renderApp();
          scrollToCatalog();
        }
      });
    });
  }

  function resetAll() {
    STATE.query = '';
    STATE.domain = 'all';
    STATE.category = 'all';
    STATE.pillar = 'all';
    STATE.severity = 'all';
    STATE.compliance = 'all';
    STATE.page = 1;
    applyFilters();
    renderApp();
  }

  function scrollToCatalog() {
    const el = document.getElementById('architecture-catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // Keyboard escape closes modal
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
