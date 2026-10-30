// Unified CNAPP Architecture Best Practices Catalog Controller (Powered by Obsidian Pele)
// Supports AWS, Azure, GCP, Kubernetes (KSPM), and Container / Supply Chain Security (CWPP)
// Features: Responsive Pele SVG Diagrams, OPA Rego Policies, Terraform & Kyverno Manifests, SVG Download & Token-Safe Highlighting

(function () {
  let container = null;

  const STATE = {
    allData: [],
    filteredData: [],
    query: '',
    provider: 'all', // 'all', 'AWS', 'Azure', 'GCP', 'Kubernetes', 'Container'
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

  const PROVIDERS = [
    { id: 'all', name: 'All Providers', icon: null, badge: 'from-purple-500 to-indigo-600' },
    { id: 'AWS', name: 'AWS Cloud', icon: '/images/cnapp-icons/aws-security-kms.svg', badge: 'from-amber-500 to-orange-600', color: 'text-amber-400' },
    { id: 'Azure', name: 'Microsoft Azure', icon: '/images/cnapp-icons/azure-defender.svg', badge: 'from-blue-500 to-cyan-600', color: 'text-blue-400' },
    { id: 'GCP', name: 'Google Cloud', icon: '/images/cnapp-icons/gcp-scc.svg', badge: 'from-sky-500 to-blue-600', color: 'text-sky-400' },
    { id: 'Kubernetes', name: 'Kubernetes (KSPM)', icon: '/images/cnapp-icons/k8s-pod.svg', badge: 'from-indigo-500 to-purple-600', color: 'text-indigo-400' },
    { id: 'Container', name: 'Containers & Supply Chain', icon: '/images/cnapp-icons/container-cosign.svg', badge: 'from-teal-500 to-emerald-600', color: 'text-teal-400' }
  ];

  const CNAPP_PILLARS = [
    'all',
    'CSPM',
    'CWPP',
    'CIEM',
    'KSPM',
    'DSPM',
    'Network & Zero Trust',
    'Supply Chain'
  ];

  const COMPLIANCE_FRAMEWORKS = [
    { id: 'all', name: 'All Compliance Frameworks' },
    { id: 'CIS', name: 'CIS Benchmarks (AWS / Azure / GCP / K8s / Docker)' },
    { id: 'NIST', name: 'NIST SP 800-53 / 800-190 / 800-218' },
    { id: 'PCI-DSS', name: 'PCI-DSS v4.0' },
    { id: 'SOC 2', name: 'SOC 2 Type II' },
    { id: 'HIPAA', name: 'HIPAA Security Rule' },
    { id: 'FedRAMP', name: 'FedRAMP High / Moderate' },
    { id: 'ISO 27001', name: 'ISO/IEC 27001:2022' },
    { id: 'MITRE', name: 'MITRE ATT&CK for Cloud & Containers' },
    { id: 'SLSA', name: 'SLSA Level 3 Supply Chain' },
    { id: 'Executive Order', name: 'Executive Order 14028' }
  ];

  // All 62 Categories across AWS, Azure, GCP, Kubernetes, and Containers
  const CATEGORIES = [
    { id: 'all', name: 'All Domains', provider: 'all', icon: null },

    // --- AWS (24 Domains) ---
    { id: 'storage-s3', name: 'S3 & Storage', provider: 'AWS', icon: '/images/cnapp-icons/aws-storage-s3.svg' },
    { id: 'iam-access', name: 'IAM & Identity', provider: 'AWS', icon: '/images/cnapp-icons/aws-iam-access.svg' },
    { id: 'network-vpc', name: 'VPC & Perimeter', provider: 'AWS', icon: '/images/cnapp-icons/aws-network-vpc.svg' },
    { id: 'compute-ec2', name: 'EC2 Hardening', provider: 'AWS', icon: '/images/cnapp-icons/aws-compute-ec2.svg' },
    { id: 'database-rds', name: 'RDS & Aurora', provider: 'AWS', icon: '/images/cnapp-icons/aws-database-rds.svg' },
    { id: 'nosql-dynamodb', name: 'DynamoDB NoSQL', provider: 'AWS', icon: '/images/cnapp-icons/aws-nosql-dynamodb.svg' },
    { id: 'container-eks', name: 'EKS Defense', provider: 'AWS', icon: '/images/cnapp-icons/aws-container-eks.svg' },
    { id: 'container-ecs', name: 'ECS Containers', provider: 'AWS', icon: '/images/cnapp-icons/aws-container-ecs.svg' },
    { id: 'serverless-lambda', name: 'Lambda Serverless', provider: 'AWS', icon: '/images/cnapp-icons/aws-serverless-lambda.svg' },
    { id: 'perimeter-apigateway', name: 'API Gateway', provider: 'AWS', icon: '/images/cnapp-icons/aws-perimeter-apigateway.svg' },
    { id: 'edge-cloudfront', name: 'CloudFront Edge', provider: 'AWS', icon: '/images/cnapp-icons/aws-edge-cloudfront.svg' },
    { id: 'waf-shield', name: 'WAF & Shield', provider: 'AWS', icon: '/images/cnapp-icons/aws-waf-shield.svg' },
    { id: 'security-kms', name: 'KMS & Secrets', provider: 'AWS', icon: '/images/cnapp-icons/aws-security-kms.svg' },
    { id: 'logging-cloudtrail', name: 'CloudTrail Audit', provider: 'AWS', icon: '/images/cnapp-icons/aws-logging-cloudtrail.svg' },
    { id: 'observability-cloudwatch', name: 'CloudWatch Metrics', provider: 'AWS', icon: '/images/cnapp-icons/aws-observability-cloudwatch.svg' },
    { id: 'threat-guardduty', name: 'GuardDuty Threats', provider: 'AWS', icon: '/images/cnapp-icons/aws-threat-guardduty.svg' },
    { id: 'compliance-sechub', name: 'Security Hub', provider: 'AWS', icon: '/images/cnapp-icons/aws-compliance-sechub.svg' },
    { id: 'backup-resilience', name: 'AWS Backup WORM', provider: 'AWS', icon: '/images/cnapp-icons/aws-backup-resilience.svg' },
    { id: 'messaging-sns-sqs', name: 'SNS & SQS', provider: 'AWS', icon: '/images/cnapp-icons/aws-messaging-sns-sqs.svg' },
    { id: 'decoupled-eventbridge', name: 'EventBridge', provider: 'AWS', icon: '/images/cnapp-icons/aws-decoupled-eventbridge.svg' },
    { id: 'aiml-sagemaker', name: 'SageMaker AI', provider: 'AWS', icon: '/images/cnapp-icons/aws-aiml-sagemaker.svg' },
    { id: 'governance-org', name: 'AWS Organizations', provider: 'AWS', icon: '/images/cnapp-icons/aws-governance-org.svg' },
    { id: 'dns-route53', name: 'Route 53 DNS', provider: 'AWS', icon: '/images/cnapp-icons/aws-dns-route53.svg' },
    { id: 'analytics-opensearch', name: 'OpenSearch', provider: 'AWS', icon: '/images/cnapp-icons/aws-analytics-opensearch.svg' },

    // --- AZURE (10 Domains) ---
    { id: 'azure-ad', name: 'Entra ID & Identity', provider: 'Azure', icon: '/images/cnapp-icons/azure-ad.svg' },
    { id: 'azure-blob', name: 'Blob & Storage Accounts', provider: 'Azure', icon: '/images/cnapp-icons/azure-blob.svg' },
    { id: 'azure-keyvault', name: 'Key Vault & HSM', provider: 'Azure', icon: '/images/cnapp-icons/azure-keyvault.svg' },
    { id: 'azure-aks', name: 'AKS Kubernetes', provider: 'Azure', icon: '/images/cnapp-icons/azure-aks.svg' },
    { id: 'azure-vnet', name: 'VNet & Azure Firewall', provider: 'Azure', icon: '/images/cnapp-icons/azure-vnet.svg' },
    { id: 'azure-defender', name: 'Defender for Cloud', provider: 'Azure', icon: '/images/cnapp-icons/azure-defender.svg' },
    { id: 'azure-appgateway', name: 'App Gateway & WAF', provider: 'Azure', icon: '/images/cnapp-icons/azure-appgateway.svg' },
    { id: 'azure-cosmosdb', name: 'Cosmos DB NoSQL', provider: 'Azure', icon: '/images/cnapp-icons/azure-cosmosdb.svg' },
    { id: 'azure-functions', name: 'Azure Functions', provider: 'Azure', icon: '/images/cnapp-icons/azure-functions.svg' },
    { id: 'azure-monitor', name: 'Monitor & Sentinel SIEM', provider: 'Azure', icon: '/images/cnapp-icons/azure-monitor.svg' },

    // --- GCP (10 Domains) ---
    { id: 'gcp-iam', name: 'Cloud IAM & Federation', provider: 'GCP', icon: '/images/cnapp-icons/gcp-iam.svg' },
    { id: 'gcp-gcs', name: 'Cloud Storage (GCS)', provider: 'GCP', icon: '/images/cnapp-icons/gcp-gcs.svg' },
    { id: 'gcp-gke', name: 'GKE Kubernetes', provider: 'GCP', icon: '/images/cnapp-icons/gcp-gke.svg' },
    { id: 'gcp-kms', name: 'Cloud KMS & HSM', provider: 'GCP', icon: '/images/cnapp-icons/gcp-kms.svg' },
    { id: 'gcp-armor', name: 'Cloud Armor DDoS/WAF', provider: 'GCP', icon: '/images/cnapp-icons/gcp-armor.svg' },
    { id: 'gcp-scc', name: 'Security Command Center', provider: 'GCP', icon: '/images/cnapp-icons/gcp-scc.svg' },
    { id: 'gcp-vpc', name: 'VPC Service Controls', provider: 'GCP', icon: '/images/cnapp-icons/gcp-vpc.svg' },
    { id: 'gcp-functions', name: 'Cloud Run & Serverless', provider: 'GCP', icon: '/images/cnapp-icons/gcp-functions.svg' },
    { id: 'gcp-bigquery', name: 'BigQuery DSPM', provider: 'GCP', icon: '/images/cnapp-icons/gcp-bigquery.svg' },
    { id: 'gcp-logging', name: 'Cloud Logging & Chronicle', provider: 'GCP', icon: '/images/cnapp-icons/gcp-logging.svg' },

    // --- KUBERNETES (10 Domains) ---
    { id: 'k8s-pod', name: 'Pod Security Standards', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-pod.svg' },
    { id: 'k8s-networkpolicy', name: 'NetworkPolicy Zero Trust', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-networkpolicy.svg' },
    { id: 'k8s-rbac', name: 'RBAC & ServiceAccounts', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-rbac.svg' },
    { id: 'k8s-apiserver', name: 'API Server Hardening', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-apiserver.svg' },
    { id: 'k8s-admission', name: 'Admission & Kyverno', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-admission.svg' },
    { id: 'k8s-etcd', name: 'etcd Encrypted Store', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-etcd.svg' },
    { id: 'k8s-kubelet', name: 'Kubelet Node Security', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-kubelet.svg' },
    { id: 'k8s-servicemesh', name: 'Service Mesh mTLS', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-servicemesh.svg' },
    { id: 'k8s-ingress', name: 'Ingress & Gateway API', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-ingress.svg' },
    { id: 'k8s-audit', name: 'Audit Trail & Forensics', provider: 'Kubernetes', icon: '/images/cnapp-icons/k8s-audit.svg' },

    // --- CONTAINERS (8 Domains) ---
    { id: 'container-cosign', name: 'Sigstore Cosign Signing', provider: 'Container', icon: '/images/cnapp-icons/container-cosign.svg' },
    { id: 'container-trivy', name: 'Trivy Vulnerability Gates', provider: 'Container', icon: '/images/cnapp-icons/container-trivy.svg' },
    { id: 'container-ebpf', name: 'eBPF Kernel Defense', provider: 'Container', icon: '/images/cnapp-icons/container-ebpf.svg' },
    { id: 'container-distroless', name: 'Distroless Minimal Images', provider: 'Container', icon: '/images/cnapp-icons/container-distroless.svg' },
    { id: 'container-docker', name: 'Docker Daemon Security', provider: 'Container', icon: '/images/cnapp-icons/container-docker.svg' },
    { id: 'container-registry', name: 'OCI Registry Immutability', provider: 'Container', icon: '/images/cnapp-icons/container-registry.svg' },
    { id: 'container-sbom', name: 'SBOM & Attestation', provider: 'Container', icon: '/images/cnapp-icons/container-sbom.svg' },
    { id: 'container-secrets', name: 'Runtime Secrets & CSI', provider: 'Container', icon: '/images/cnapp-icons/container-secrets.svg' }
  ];

  const SEVERITIES = ['all', 'Critical', 'High', 'Medium', 'Low'];

  // Quick Chips for 1-click discoverability
  const QUICK_CHIPS = [
    { label: '⚡ Critical Only', filter: { severity: 'Critical' } },
    { label: '☸️ Kubernetes KSPM', filter: { provider: 'Kubernetes', pillar: 'KSPM' } },
    { label: '🛡️ CSPM Guardrails', filter: { pillar: 'CSPM' } },
    { label: '📦 Supply Chain & SLSA', filter: { pillar: 'Supply Chain' } },
    { label: '🔐 Secrets & DSPM', filter: { pillar: 'DSPM' } },
    { label: '🔍 eBPF Runtime Threat', filter: { category: 'container-ebpf' } },
    { label: '🌐 Zero Trust Network', filter: { pillar: 'Network & Zero Trust' } },
    { label: '🏢 Azure Entra ID', filter: { provider: 'Azure', category: 'azure-ad' } },
    { label: '🇬 GCP Workload Identity', filter: { provider: 'GCP', category: 'gcp-iam' } }
  ];

  // Token-safe syntax highlighting for OPA Rego and Terraform / Kyverno manifests
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
      out = out.replace(/\b(allow|deny|violation|msg)\b/g, '<span class="text-rose-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(input|data|sprintf)\b/g, '<span class="text-cyan-400 font-semibold">$1</span>');
    } else if (lang === 'tf') {
      out = out.replace(/\b(resource|data|variable|output|locals|provider|terraform|module|apiVersion|kind|metadata|spec|rules)\b/g, '<span class="text-purple-400 font-bold">$1</span>');
      out = out.replace(/\b(true|false|null|enforce|strict)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');
      out = out.replace(/\b(var|local|each|count|jsonencode)\b/g, '<span class="text-cyan-400 font-semibold">$1</span>');
    }

    tokens.forEach((t, i) => {
      out = out.replace(`___TOK${i}___`, t);
    });

    return out;
  }

  // Instant vector SVG download helper
  function downloadSvgFile(svgStr, filename) {
    try {
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (filename || 'cnapp-architecture') + '.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  }

  // URL state synchronization
  function readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) STATE.query = params.get('q');
    if (params.has('provider')) STATE.provider = params.get('provider');
    if (params.has('category')) STATE.category = params.get('category');
    if (params.has('pillar')) STATE.pillar = params.get('pillar');
    if (params.has('severity')) STATE.severity = params.get('severity');
    if (params.has('compliance')) STATE.compliance = params.get('compliance');
    if (params.has('page')) STATE.page = parseInt(params.get('page'), 10) || 1;
  }

  function updateUrlParams() {
    const params = new URLSearchParams();
    if (STATE.query) params.set('q', STATE.query);
    if (STATE.provider !== 'all') params.set('provider', STATE.provider);
    if (STATE.category !== 'all') params.set('category', STATE.category);
    if (STATE.pillar !== 'all') params.set('pillar', STATE.pillar);
    if (STATE.severity !== 'all') params.set('severity', STATE.severity);
    if (STATE.compliance !== 'all') params.set('compliance', STATE.compliance);
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
      let resp = await fetch('/data/cnapp-best-practices.json');
      if (!resp.ok) {
        resp = await fetch('/data/aws-best-practices.json');
      }
      if (!resp.ok) throw new Error('HTTP ' + resp.status + ' loading CNAPP dataset');
      STATE.allData = await resp.json();
      applyFilters();
      renderApp();
    } catch (err) {
      console.error('Unified CNAPP Architecture Catalog Error:', err);
      if (container) {
        container.innerHTML = `
          <div class="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-rose-300">
            <p class="font-bold text-lg">Failed to load Unified CNAPP Architecture dataset</p>
            <p class="text-sm mt-1 text-slate-400">${escapeHtml(err.message)}</p>
            <p class="text-xs mt-3 text-slate-500">Please verify that /data/cnapp-best-practices.json is accessible.</p>
          </div>
        `;
      }
    }
  }

  function applyFilters() {
    const q = STATE.query.toLowerCase().trim();
    STATE.filteredData = STATE.allData.filter(item => {
      // Provider
      if (STATE.provider !== 'all' && (item.provider || 'AWS') !== STATE.provider) return false;
      // Category
      if (STATE.category !== 'all' && item.category !== STATE.category) return false;
      // Pillar
      if (STATE.pillar !== 'all' && item.pillar !== STATE.pillar) return false;
      // Severity
      if (STATE.severity !== 'all' && item.severity !== STATE.severity) return false;
      // Compliance
      if (STATE.compliance !== 'all') {
        if (!item.compliance || !item.compliance.some(c => c.toLowerCase().includes(STATE.compliance.toLowerCase()))) {
          return false;
        }
      }
      // Search Query
      if (q) {
        const match =
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          (item.provider && item.provider.toLowerCase().includes(q)) ||
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

  function getProviderBadge(provider) {
    const p = provider || 'AWS';
    switch (p) {
      case 'Azure':
        return {
          pill: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400',
          icon: '/images/cnapp-icons/azure-defender.svg',
          label: 'Azure'
        };
      case 'GCP':
        return {
          pill: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
          dot: 'bg-sky-400',
          icon: '/images/cnapp-icons/gcp-scc.svg',
          label: 'GCP'
        };
      case 'Kubernetes':
        return {
          pill: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40',
          dot: 'bg-indigo-400',
          icon: '/images/cnapp-icons/k8s-pod.svg',
          label: 'Kubernetes'
        };
      case 'Container':
        return {
          pill: 'bg-teal-500/15 text-teal-300 border-teal-500/40',
          dot: 'bg-teal-400',
          icon: '/images/cnapp-icons/container-cosign.svg',
          label: 'Container'
        };
      default: // AWS
        return {
          pill: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
          icon: '/images/cnapp-icons/aws-security-kms.svg',
          label: 'AWS'
        };
    }
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
      case 'CSPM':
        return {
          pill: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400'
        };
      case 'CWPP':
        return {
          pill: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'CIEM':
        return {
          pill: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400'
        };
      case 'KSPM':
        return {
          pill: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400'
        };
      case 'DSPM':
        return {
          pill: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400'
        };
      case 'Supply Chain':
        return {
          pill: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
          dot: 'bg-teal-400'
        };
      default: // Network & Zero Trust or Security
        return {
          pill: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400'
        };
    }
  }

  function getProviderCount(provId) {
    if (provId === 'all') return STATE.allData.length;
    return STATE.allData.filter(x => (x.provider || 'AWS') === provId).length;
  }

  function getCategoryCount(catId) {
    if (catId === 'all') {
      if (STATE.provider === 'all') return STATE.allData.length;
      return STATE.allData.filter(x => (x.provider || 'AWS') === STATE.provider).length;
    }
    return STATE.allData.filter(x => x.category === catId).length;
  }

  function getVisibleCategories() {
    if (STATE.provider === 'all') {
      return CATEGORIES;
    }
    return CATEGORIES.filter(c => c.provider === 'all' || c.provider === STATE.provider);
  }

  function renderApp() {
    updateUrlParams();

    const startIdx = (STATE.page - 1) * STATE.pageSize;
    const pageItems = STATE.filteredData.slice(startIdx, startIdx + STATE.pageSize);
    const totalPages = Math.ceil(STATE.filteredData.length / STATE.pageSize) || 1;

    const hasActiveFilters =
      STATE.query ||
      STATE.provider !== 'all' ||
      STATE.category !== 'all' ||
      STATE.pillar !== 'all' ||
      STATE.severity !== 'all' ||
      STATE.compliance !== 'all';

    const visibleCats = getVisibleCategories();

    let html = `
      <!-- Provider Tabs Bar -->
      <div class="mb-5 flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/90 dark:border-white/10 shadow-inner">
        ${PROVIDERS.map(p => {
          const count = getProviderCount(p.id);
          const isActive = STATE.provider === p.id;
          return `
            <button
              data-provider-tab="${p.id}"
              class="provider-tab-btn flex-1 min-w-[140px] flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-2 ring-purple-400/40'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10'
              }"
            >
              ${p.icon ? `<img src="${p.icon}" class="w-4 h-4 shrink-0 rounded object-contain" alt="" />` : `<span class="text-xs">🌐</span>`}
              <span>${p.name}</span>
              <span class="rounded-full px-2 py-0.5 text-[10px] font-mono ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
              }">${count}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Search, Quick Chips & Dropdown Filter Controls -->
      <div class="mb-8 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#161120] p-5 sm:p-6 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search Bar -->
          <div class="relative flex-1">
            <svg class="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              id="cnapp-search-input"
              type="text"
              value="${escapeHtml(STATE.query)}"
              placeholder="Search 1,500+ CNAPP blueprints (e.g. S3, AKS, Workload Identity, Cosign, eBPF, PSS, CIS)..."
              class="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition"
            />
            ${STATE.query ? `
              <button id="cnapp-clear-search" class="absolute right-3 top-3 h-5 w-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-white flex items-center justify-center text-xs">✕</button>
            ` : ''}
          </div>

          <!-- Dropdowns Row -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            <!-- CNAPP Pillar Filter -->
            <select id="cnapp-pillar-filter" class="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
              <option value="all">Pillar: All Pillars</option>
              ${CNAPP_PILLARS.filter(p => p !== 'all').map(p => `<option value="${p}" ${STATE.pillar === p ? 'selected' : ''}>Pillar: ${p}</option>`).join('')}
            </select>

            <!-- Compliance Filter -->
            <select id="cnapp-compliance-filter" class="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
              ${COMPLIANCE_FRAMEWORKS.map(c => `<option value="${c.id}" ${STATE.compliance === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
            </select>

            <!-- Severity Filter -->
            <select id="cnapp-severity-filter" class="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
              <option value="all">Severity: All</option>
              ${SEVERITIES.filter(s => s !== 'all').map(s => `<option value="${s}" ${STATE.severity === s ? 'selected' : ''}>Severity: ${s}</option>`).join('')}
            </select>

            <!-- Reset Button -->
            ${hasActiveFilters ? `
              <button id="cnapp-reset-filters" class="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition">
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

        <!-- Categories Pill Bar with Official CNAPP SVG Icons & Dynamic Counts -->
        <div class="mt-4 border-t border-slate-100 dark:border-white/5 pt-4">
          <div class="flex items-center justify-between mb-2">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Filter by Service Domain (${STATE.provider === 'all' ? 'All Providers' : STATE.provider})
            </p>
            <span class="text-[11px] text-slate-400 font-mono">${visibleCats.length - 1} Domains Available</span>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            ${visibleCats.map(cat => {
              const count = getCategoryCount(cat.id);
              const isActive = STATE.category === cat.id;
              return `
                <button
                  data-cat-id="${cat.id}"
                  class="cnapp-cat-pill inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
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
            ${STATE.provider !== 'all' ? ` in <span class="text-purple-400 font-bold">${STATE.provider}</span>` : ''}
            ${STATE.category !== 'all' ? ` &bull; <span class="text-purple-400 font-bold">${CATEGORIES.find(c => c.id === STATE.category)?.name}</span>` : ''}
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
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">No CNAPP blueprints match your filter</h3>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">Try broadening your search term or resetting provider, pillar, and severity filters.</p>
          <button id="cnapp-reset-empty" class="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition">
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
      <div id="cnapp-modal-container"></div>
    `;

    container.innerHTML = html;
    attachEvents();
  }

  function renderCard(item) {
    const activeTab = STATE.activeTabs[item.id] || 'diagram';
    const sev = getSeverityBadge(item.severity);
    const pillar = getPillarBadge(item.pillar);
    const prov = getProviderBadge(item.provider);
    const iconPath = item.icon_url || ('/images/cnapp-icons/' + item.category + '.svg');

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
              <div class="flex flex-wrap items-center gap-1.5 mb-0.5">
                <!-- Provider Badge -->
                <span class="inline-flex items-center gap-1 rounded-md text-[10px] font-bold px-1.5 py-0.5 border ${prov.pill}">
                  <span class="h-1.5 w-1.5 rounded-full ${prov.dot}"></span>
                  ${escapeHtml(prov.label)}
                </span>
                <!-- ID Badge -->
                <span class="rounded font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-white/[0.05] text-purple-600 dark:text-purple-300 border border-slate-200 dark:border-white/10">
                  ${escapeHtml(item.id)}
                </span>
                <!-- Pillar Badge -->
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

        <!-- Segmented Tab Switcher -->
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
            🏗️ IaC Manifest
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
            📜 Remediation
          </button>
        </div>

        <!-- Tab Body Content -->
        <div class="relative min-h-[190px] rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#0d0915] p-3 flex flex-col justify-center">
          ${renderCardTabContent(item, activeTab)}
        </div>

        <!-- Footer Actions & Compliance Tags -->
        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
          <!-- Compliance Pills -->
          <div class="flex flex-wrap items-center gap-1">
            ${(item.compliance || []).slice(0, 3).map(c => `
              <span class="rounded bg-slate-100 dark:bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/5">
                ${escapeHtml(c)}
              </span>
            `).join('')}
            ${(item.compliance || []).length > 3 ? `
              <span class="rounded bg-slate-100 dark:bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                +${item.compliance.length - 3}
              </span>
            ` : ''}
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-1.5">
            <button
              data-download-svg="${item.id}"
              class="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition"
              title="Download vector SVG pre-rendered with Obsidian Pele"
            >
              <svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              <span>SVG</span>
            </button>
            <button
              data-open-modal="${item.id}"
              class="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-[11px] font-bold text-purple-400 hover:bg-purple-500/20 transition"
            >
              <span>Inspect</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderCardTabContent(item, activeTab) {
    if (activeTab === 'diagram') {
      return `
        <div class="blueprint-canvas relative w-full h-[180px] rounded-lg overflow-hidden flex items-center justify-center p-2 bg-[#09070f] border border-white/5">
          <div class="w-full h-full flex items-center justify-center [&>svg]:max-h-full [&>svg]:max-w-full [&>svg]:w-auto [&>svg]:h-auto">
            ${item.svg || '<p class="text-xs text-slate-500">Diagram rendering...</p>'}
          </div>
          <button
            data-open-modal="${item.id}"
            class="absolute top-2 right-2 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1 text-[10px] text-slate-300 hover:text-white transition"
          >
            ⤢ Full View
          </button>
        </div>
      `;
    }

    if (activeTab === 'opa') {
      const codeHtml = highlightCode(item.opa_policy, 'rego');
      return `
        <div class="relative w-full h-[180px] rounded-lg overflow-hidden bg-[#09070f] border border-white/5 flex flex-col">
          <div class="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-white/[0.02]">
            <span class="text-[10px] font-mono text-purple-400 font-bold">OPA Rego Guardrail</span>
            <button
              data-copy-code="${escapeHtml(item.opa_policy)}"
              class="copy-btn text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              📋 Copy
            </button>
          </div>
          <pre class="p-3 text-[11px] font-mono text-slate-200 overflow-y-auto flex-1 custom-scrollbar leading-relaxed"><code>${codeHtml}</code></pre>
        </div>
      `;
    }

    if (activeTab === 'tf') {
      const codeHtml = highlightCode(item.terraform, 'tf');
      const isK8s = item.provider === 'Kubernetes' || item.provider === 'Container';
      return `
        <div class="relative w-full h-[180px] rounded-lg overflow-hidden bg-[#09070f] border border-white/5 flex flex-col">
          <div class="flex items-center justify-between px-3 py-1.5 border-b border-white/5 bg-white/[0.02]">
            <span class="text-[10px] font-mono text-emerald-400 font-bold">${isK8s ? 'Kubernetes / Kyverno Spec' : 'Terraform HCL'}</span>
            <button
              data-copy-code="${escapeHtml(item.terraform)}"
              class="copy-btn text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              📋 Copy
            </button>
          </div>
          <pre class="p-3 text-[11px] font-mono text-slate-200 overflow-y-auto flex-1 custom-scrollbar leading-relaxed"><code>${codeHtml}</code></pre>
        </div>
      `;
    }

    // activeTab === 'compliance'
    return `
      <div class="w-full h-[180px] rounded-lg overflow-y-auto bg-[#09070f] border border-white/5 p-3 flex flex-col gap-2 custom-scrollbar text-xs">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">Compliance Mappings:</span>
          <div class="flex flex-wrap gap-1">
            ${(item.compliance || []).map(c => `
              <span class="rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 text-[10px] font-mono">
                ${escapeHtml(c)}
              </span>
            `).join('')}
          </div>
        </div>
        <div class="mt-2 border-t border-white/5 pt-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Actionable Remediation:</span>
          <p class="text-[11px] text-slate-300 leading-relaxed">
            ${escapeHtml(item.remediation || 'Enforce this guardrail in accordance with documented standard.')}
          </p>
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
      <div class="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row border-t border-slate-200/80 dark:border-white/10 pt-6">
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Showing page <span class="font-bold text-slate-900 dark:text-white">${cur}</span> of <span class="font-bold">${totalPages}</span>
        </p>

        <div class="flex items-center gap-1.5">
          <button
            data-page-nav="${cur - 1}"
            ${cur <= 1 ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="hover:bg-purple-600 hover:text-white"'}
            class="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            ← Prev
          </button>

          ${pages.map(p => {
            if (p === '...') {
              return `<span class="px-2 text-xs text-slate-400">...</span>`;
            }
            const isCur = p === cur;
            return `
              <button
                data-page-nav="${p}"
                class="rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  isCur
                    ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400/40'
                    : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                }"
              >
                ${p}
              </button>
            `;
          }).join('')}

          <button
            data-page-nav="${cur + 1}"
            ${cur >= totalPages ? 'disabled class="opacity-40 cursor-not-allowed"' : 'class="hover:bg-purple-600 hover:text-white"'}
            class="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
          >
            Next →
          </button>
        </div>
      </div>
    `;
  }

  function renderModal(item) {
    if (!item) return '';
    const sev = getSeverityBadge(item.severity);
    const pillar = getPillarBadge(item.pillar);
    const prov = getProviderBadge(item.provider);
    const iconPath = item.icon_url || ('/images/cnapp-icons/' + item.category + '.svg');
    const tab = STATE.modalTab;

    return `
      <div id="modal-backdrop" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
        <div class="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-200 dark:border-white/20 bg-white dark:bg-[#151020] shadow-2xl overflow-hidden">
          
          <!-- Modal Header -->
          <div class="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
            <div class="flex items-center gap-3">
              <div class="h-12 w-12 shrink-0 rounded-2xl bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 p-2.5 shadow-sm">
                <img src="${iconPath}" class="w-full h-full object-contain" alt="" />
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <span class="inline-flex items-center gap-1 rounded-md text-[10px] font-bold px-2 py-0.5 border ${prov.pill}">
                    <span class="h-1.5 w-1.5 rounded-full ${prov.dot}"></span>
                    ${escapeHtml(prov.label)}
                  </span>
                  <span class="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    ${escapeHtml(item.id)}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${pillar.pill}">
                    ${escapeHtml(item.pillar)}
                  </span>
                  <span class="inline-flex items-center gap-1 rounded-full text-[10px] font-semibold px-2 py-0.5 border ${sev.pill}">
                    ${escapeHtml(item.severity)}
                  </span>
                </div>
                <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  ${escapeHtml(item.title)}
                </h2>
              </div>
            </div>

            <button id="modal-close-btn" class="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-white flex items-center justify-center text-sm font-bold">
              ✕
            </button>
          </div>

          <!-- Modal Subheader Tabs & Actions -->
          <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-100/50 dark:bg-[#0f0b18]">
            <div class="flex gap-1.5 text-xs font-semibold">
              <button data-modal-tab="diagram" class="px-3 py-1.5 rounded-lg transition ${tab === 'diagram' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
                📐 Architecture Diagram
              </button>
              <button data-modal-tab="opa" class="px-3 py-1.5 rounded-lg transition ${tab === 'opa' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
                🛡️ OPA Rego
              </button>
              <button data-modal-tab="tf" class="px-3 py-1.5 rounded-lg transition ${tab === 'tf' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
                🏗️ IaC Manifest
              </button>
              <button data-modal-tab="remediation" class="px-3 py-1.5 rounded-lg transition ${tab === 'remediation' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'}">
                📜 Compliance & Remediation
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button
                data-download-svg="${item.id}"
                class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Download SVG ⭳
              </button>
            </div>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#09070f]">
            ${renderModalBody(item, tab)}
          </div>
        </div>
      </div>
    `;
  }

  function renderModalBody(item, tab) {
    if (tab === 'diagram') {
      return `
        <div class="flex flex-col gap-4">
          <div class="blueprint-canvas relative w-full min-h-[360px] rounded-2xl border border-white/10 bg-[#07050d] p-6 flex items-center justify-center">
            <div class="w-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[500px]">
              ${item.svg || '<p class="text-sm text-slate-500">Pele SVG loading...</p>'}
            </div>
          </div>
          <div class="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-slate-400">
            <p><strong class="text-white">Obsidian Pele Topology:</strong> Diagram rendered natively via Pele <code class="text-purple-300">architecture-beta</code> using official SVG icons. Responsive and scalable to any display resolution.</p>
          </div>
        </div>
      `;
    }

    if (tab === 'opa') {
      const codeHtml = highlightCode(item.opa_policy, 'rego');
      return `
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <p class="text-xs text-slate-400">Enforce this guardrail across CI/CD pull requests, Conftest, or Gatekeeper admission controller.</p>
            <button data-copy-code="${escapeHtml(item.opa_policy)}" class="copy-btn rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 transition">
              📋 Copy OPA Policy
            </button>
          </div>
          <pre class="p-4 rounded-xl bg-[#07050d] border border-white/10 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed"><code>${codeHtml}</code></pre>
        </div>
      `;
    }

    if (tab === 'tf') {
      const codeHtml = highlightCode(item.terraform, 'tf');
      const isK8s = item.provider === 'Kubernetes' || item.provider === 'Container';
      return `
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <p class="text-xs text-slate-400">${isK8s ? 'Production Kubernetes Kyverno or Policy Controller Manifest.' : 'Production Terraform IaC Guardrail Module.'}</p>
            <button data-copy-code="${escapeHtml(item.terraform)}" class="copy-btn rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 transition">
              📋 Copy IaC Manifest
            </button>
          </div>
          <pre class="p-4 rounded-xl bg-[#07050d] border border-white/10 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed"><code>${codeHtml}</code></pre>
        </div>
      `;
    }

    // tab === 'remediation'
    return `
      <div class="flex flex-col gap-6 text-sm">
        <div>
          <h4 class="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">Mapped Compliance Standards</h4>
          <div class="flex flex-wrap gap-2">
            ${(item.compliance || []).map(c => `
              <span class="rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1 text-xs font-mono">
                ${escapeHtml(c)}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Remediation Guide</h4>
          <p class="text-slate-300 leading-relaxed">${escapeHtml(item.remediation)}</p>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h4 class="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Security Description</h4>
          <p class="text-slate-300 leading-relaxed">${escapeHtml(item.description)}</p>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    // Provider Tab Click
    container.querySelectorAll('[data-provider-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.provider = btn.getAttribute('data-provider-tab');
        STATE.category = 'all';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Search Input
    const searchInput = document.getElementById('cnapp-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        STATE.query = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Clear Search
    const clearSearch = document.getElementById('cnapp-clear-search');
    if (clearSearch) {
      clearSearch.addEventListener('click', () => {
        STATE.query = '';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Pillar Filter Dropdown
    const pillarFilter = document.getElementById('cnapp-pillar-filter');
    if (pillarFilter) {
      pillarFilter.addEventListener('change', e => {
        STATE.pillar = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Compliance Filter Dropdown
    const complianceFilter = document.getElementById('cnapp-compliance-filter');
    if (complianceFilter) {
      complianceFilter.addEventListener('change', e => {
        STATE.compliance = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Severity Filter Dropdown
    const severityFilter = document.getElementById('cnapp-severity-filter');
    if (severityFilter) {
      severityFilter.addEventListener('change', e => {
        STATE.severity = e.target.value;
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Reset Filters Button
    const resetFilters = document.getElementById('cnapp-reset-filters');
    if (resetFilters) {
      resetFilters.addEventListener('click', () => {
        STATE.query = '';
        STATE.provider = 'all';
        STATE.category = 'all';
        STATE.pillar = 'all';
        STATE.severity = 'all';
        STATE.compliance = 'all';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    const resetEmpty = document.getElementById('cnapp-reset-empty');
    if (resetEmpty) {
      resetEmpty.addEventListener('click', () => {
        STATE.query = '';
        STATE.provider = 'all';
        STATE.category = 'all';
        STATE.pillar = 'all';
        STATE.severity = 'all';
        STATE.compliance = 'all';
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    }

    // Quick Chip Buttons
    container.querySelectorAll('.quick-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        try {
          const filterObj = JSON.parse(btn.getAttribute('data-quick-chip'));
          if (filterObj.provider) STATE.provider = filterObj.provider;
          if (filterObj.category) STATE.category = filterObj.category;
          if (filterObj.pillar) STATE.pillar = filterObj.pillar;
          if (filterObj.severity) STATE.severity = filterObj.severity;
          if (filterObj.compliance) STATE.compliance = filterObj.compliance;
          STATE.page = 1;
          applyFilters();
          renderApp();
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Category Pills
    container.querySelectorAll('.cnapp-cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        STATE.category = btn.getAttribute('data-cat-id');
        STATE.page = 1;
        applyFilters();
        renderApp();
      });
    });

    // Card Segmented Tab Switches
    container.querySelectorAll('[data-tab-switch]').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-tab-switch');
        const targetTab = btn.getAttribute('data-tab-target');
        STATE.activeTabs[itemId] = targetTab;
        renderApp();
      });
    });

    // Pagination Nav
    container.querySelectorAll('[data-page-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.getAttribute('data-page-nav'), 10);
        if (p >= 1) {
          STATE.page = p;
          applyFilters();
          renderApp();
          const target = document.getElementById('architecture-catalog');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // SVG Download Buttons
    container.querySelectorAll('[data-download-svg]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.getAttribute('data-download-svg');
        const item = STATE.allData.find(x => x.id === id);
        if (item && item.svg) {
          downloadSvgFile(item.svg, `${item.id}-architecture`);
        }
      });
    });

    // Open Modal Buttons
    container.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-open-modal');
        const item = STATE.allData.find(x => x.id === id);
        if (item) {
          STATE.modalItem = item;
          STATE.modalTab = 'diagram';
          openModalView();
        }
      });
    });

    // Copy Code Buttons
    container.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rawCode = btn.getAttribute('data-copy-code');
        if (rawCode) {
          navigator.clipboard.writeText(rawCode).then(() => {
            const orig = btn.innerHTML;
            btn.innerHTML = '✓ Copied!';
            btn.classList.add('text-emerald-400');
            setTimeout(() => {
              btn.innerHTML = orig;
              btn.classList.remove('text-emerald-400');
            }, 2000);
          });
        }
      });
    });
  }

  function openModalView() {
    const modalContainer = document.getElementById('cnapp-modal-container');
    if (!modalContainer) return;
    modalContainer.innerHTML = renderModal(STATE.modalItem);

    // Modal Events
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close-btn');

    const closeModal = () => {
      STATE.modalItem = null;
      modalContainer.innerHTML = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) closeModal();
      });
    }

    // Modal Tab Switches
    modalContainer.querySelectorAll('[data-modal-tab]').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        STATE.modalTab = tabBtn.getAttribute('data-modal-tab');
        modalContainer.innerHTML = renderModal(STATE.modalItem);
        openModalView(); // Re-attach modal events
      });
    });

    // Modal Copy Buttons
    modalContainer.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rawCode = btn.getAttribute('data-copy-code');
        if (rawCode) {
          navigator.clipboard.writeText(rawCode).then(() => {
            const orig = btn.innerHTML;
            btn.innerHTML = '✓ Copied!';
            btn.classList.add('text-emerald-400');
            setTimeout(() => {
              btn.innerHTML = orig;
              btn.classList.remove('text-emerald-400');
            }, 2000);
          });
        }
      });
    });

    // Modal SVG Download
    modalContainer.querySelectorAll('[data-download-svg]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-download-svg');
        const item = STATE.allData.find(x => x.id === id);
        if (item && item.svg) {
          downloadSvgFile(item.svg, `${item.id}-architecture`);
        }
      });
    });
  }

  // Self initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
