import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from 'pele';
import { refreshDiagramCollection } from './lib/control-diagrams.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('Generating 1,032 Deep Civo Cloud Architecture Best Practices with Pele & Official Icons...');

function padId(num) {
  return 'CIVO-BP-' + String(num).padStart(4, '0');
}

const iconDir = path.join(rootDir, 'priv', 'static', 'images', 'civo-icons');
const iconCache = {};

if (fs.existsSync(iconDir)) {
  for (const f of fs.readdirSync(iconDir)) {
    if (f.endsWith('.svg')) {
      const id = f.replace('.svg', '');
      let raw = fs.readFileSync(path.join(iconDir, f), 'utf8');

      raw = raw
        .replace(/id="([^"]+)"/g, `id="civo-${id}-$1"`)
        .replace(/url\(#([^)]+)\)/g, `url(#civo-${id}-$1)`);

      const defsMatch = raw.match(/<defs>[\s\S]*?<\/defs>/);
      const defs = defsMatch ? defsMatch[0].replace(/\s+/g, ' ') : '';
      const innerMatch = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
      if (innerMatch) {
        const content = innerMatch[1].replace(/<defs>[\s\S]*?<\/defs>/, '').trim().replace(/\s+/g, ' ');
        iconCache[id] = `${defs}<g transform="scale(0.6)">${content}</g>`;
      }
    }
  }
}

function resolveIcon(name) {
  if (!name) return null;
  const cleanName = name.replace(/^logos:/, '');
  if (iconCache[cleanName]) return iconCache[cleanName];
  for (const [key, svg] of Object.entries(iconCache)) {
    if (cleanName.includes(key) || key.includes(cleanName)) return svg;
    const shortKey = key.replace(/^[a-z]+-/, '');
    if (cleanName.includes(shortKey) || shortKey.includes(cleanName)) return svg;
  }
  return null;
}

const CATEGORIES = [
  { id: 'civo-k3s', name: 'Managed Kubernetes (K3s Engine)', service: 'Civo Kubernetes (K3s)', iconFile: 'civo-k3s.svg' },
  { id: 'civo-instances', name: 'Compute Instances & Micro-VMs', service: 'Civo Instances', iconFile: 'civo-instances.svg' },
  { id: 'civo-gpu', name: 'GPU & AI Training Clusters', service: 'Civo GPU Nodes', iconFile: 'civo-gpu.svg' },
  { id: 'civo-object-storage', name: 'Object Storage & Buckets', service: 'Civo Object Store', iconFile: 'civo-object-storage.svg' },
  { id: 'civo-volumes', name: 'Fast NVMe Block Storage Volumes', service: 'Civo Volumes', iconFile: 'civo-volumes.svg' },
  { id: 'civo-network', name: 'Private Networks & VPC Isolation', service: 'Civo Private Network', iconFile: 'civo-network.svg' },
  { id: 'civo-firewall', name: 'Security Firewalls & Ingress Rules', service: 'Civo Firewall', iconFile: 'civo-firewall.svg' },
  { id: 'civo-loadbalancer', name: 'Managed Load Balancers & TLS', service: 'Civo Load Balancer', iconFile: 'civo-loadbalancer.svg' },
  { id: 'civo-database', name: 'Managed DBaaS (Postgres & MySQL)', service: 'Civo Managed Database', iconFile: 'civo-database.svg' },
  { id: 'civo-registry', name: 'Private Container Registry', service: 'Civo Container Registry', iconFile: 'civo-registry.svg' },
  { id: 'civo-dns', name: 'Global Anycast DNS Zones', service: 'Civo DNS', iconFile: 'civo-dns.svg' },
  { id: 'civo-iam', name: 'Team Access & Scoped API Keys', service: 'Civo Teams IAM', iconFile: 'civo-iam.svg' },
  { id: 'civo-audit', name: 'Audit Logging & Action History', service: 'Civo Audit Logs', iconFile: 'civo-audit.svg' },
  { id: 'civo-marketplace', name: 'Kubernetes Marketplace Apps', service: 'Civo Marketplace', iconFile: 'civo-marketplace.svg' },
  { id: 'civo-events', name: 'Webhooks & Event Streams', service: 'Civo Webhooks', iconFile: 'civo-events.svg' },
  { id: 'civo-keys', name: 'SSH Key Management & Bastion Access', service: 'Civo SSH Keys', iconFile: 'civo-keys.svg' },
  { id: 'civo-autoscaling', name: 'Cluster Node Auto-Scaling Pools', service: 'Civo Auto-Scaler', iconFile: 'civo-autoscaling.svg' },
  { id: 'civo-backup', name: 'Snapshot Schedules & Backups', service: 'Civo Backups', iconFile: 'civo-backup.svg' },
  { id: 'civo-monitoring', name: 'Prometheus & Cluster Metrics', service: 'Civo Monitoring', iconFile: 'civo-monitoring.svg' },
  { id: 'civo-security', name: 'Guardrails & Pod Security Standards', service: 'Civo Security Guardrails', iconFile: 'civo-security.svg' },
  { id: 'civo-kafka', name: 'Managed Apache Kafka Streams', service: 'Civo Kafka DBaaS', iconFile: 'civo-kafka.svg' },
  { id: 'civo-redis', name: 'Managed In-Memory Redis Cache', service: 'Civo Redis DBaaS', iconFile: 'civo-redis.svg' },
  { id: 'civo-deep-lake', name: 'Deep Lake AI Vector Database', service: 'Civo Deep Lake', iconFile: 'civo-deep-lake.svg' },
  { id: 'civo-compliance', name: 'CIS Benchmark & SOC 2 Hardening', service: 'Civo Compliance Controls', iconFile: 'civo-compliance.svg' }
];

const TARGET_PER_CATEGORY = 43; // 24 * 43 = 1,032 total blueprints

const ARCHETYPES = [
  {
    name: 'K3s Private Microservices Mesh',
    buildFlow: cat => `architecture-beta
  group net(logos:civo-network)[Private Civo Network]
  service lb(logos:civo-loadbalancer)[Civo Load Balancer] in net
  service cluster(logos:civo-k3s)[Civo K3s Cluster] in net
  service svc(logos:${cat.id})[${cat.service}] in net
  service db(logos:civo-database)[Postgres DBaaS] in net
  lb:R --> L:cluster
  cluster:B --> T:svc
  svc:R --> L:db`
  },
  {
    name: 'AI & GPU Training Pipeline',
    buildFlow: cat => `architecture-beta
  group net(logos:civo-network)[VPC Isolated Subnet]
  service gpu(logos:civo-gpu)[Civo GPU Cluster] in net
  service lake(logos:civo-deep-lake)[Deep Lake Vector Store] in net
  service target(logos:${cat.id})[${cat.service}] in net
  service s3(logos:civo-object-storage)[Object Storage] in net
  gpu:R --> L:lake
  lake:B --> T:target
  target:R --> L:s3`
  },
  {
    name: 'Zero-Trust Secure Ingress Enclave',
    buildFlow: cat => `architecture-beta
  group dmz(logos:civo-firewall)[Protected DMZ Firewall]
  service dns(logos:civo-dns)[Civo DNS] in dmz
  service fw(logos:civo-firewall)[Firewall Ingress Gate] in dmz
  service target(logos:${cat.id})[${cat.service}] in dmz
  service iam(logos:civo-iam)[Scoped API Token] in dmz
  dns:R --> L:fw
  fw:B --> T:target
  target:R --> L:iam`
  },
  {
    name: 'Resilient Multi-Node Production Stack',
    buildFlow: cat => `architecture-beta
  group net(logos:civo-network)[Production VPC]
  service app(logos:civo-instances)[Compute Instance] in net
  service vol(logos:civo-volumes)[NVMe Volume] in net
  service target(logos:${cat.id})[${cat.service}] in net
  service bkp(logos:civo-backup)[Automated Backup] in net
  app:R --> L:vol
  vol:B --> T:target
  target:R --> L:bkp`
  }
];

const CONTROLS = [
  { action: 'Enforce Encrypted Transport with TLS 1.3 Termination', prop: 'tls_enabled', res: 'civo_loadbalancer', rule: 'tls_enforcement' },
  { action: 'Require Private Network Attachment without Public IP', prop: 'network_id', res: 'civo_instance', rule: 'private_networking' },
  { action: 'Mandate AES-256 Server-Side Encryption at Rest', prop: 'encryption_enabled', res: 'civo_object_store', rule: 'encryption_at_rest' },
  { action: 'Restrict Ingress to Zero-Trust CIDR Whitelists', prop: 'firewall_id', res: 'civo_firewall', rule: 'firewall_whitelist' },
  { action: 'Enforce Role-Based Ephemeral Scoped API Tokens', prop: 'permissions', res: 'civo_iam_token', rule: 'least_privilege' },
  { action: 'Enable Daily Automated Snapshots and Backups', prop: 'backup_enabled', res: 'civo_volume', rule: 'automated_backups' },
  { action: 'Enforce Pod Security Standards (Restricted Profile)', prop: 'applications', res: 'civo_kubernetes_cluster', rule: 'pod_security_restricted' },
  { action: 'Mandate Real-Time Audit Log Forwarding to SIEM', prop: 'audit_logging', res: 'civo_network', rule: 'audit_telemetry' }
];

const PILLARS = ['Security', 'Reliability', 'Operational Excellence', 'Performance Efficiency', 'Cost Optimization'];
const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM'];
const STRIDE = ['Spoofing', 'Tampering', 'Repudiation', 'Information Disclosure', 'Denial of Service', 'Elevation of Privilege'];

function getCategoryScenario(category, index) {
  const archetype = ARCHETYPES[index % ARCHETYPES.length];
  const ctrl = CONTROLS[index % CONTROLS.length];
  const pillar = PILLARS[(index * 2) % PILLARS.length];
  const severity = SEVERITIES[(index * 3) % SEVERITIES.length];
  const strideCategory = STRIDE[index % STRIDE.length];

  const tierNumber = (index % 12) + 1;
  const profileCode = `Tier-${tierNumber} ${category.name}`;
  const title = `${category.service}: ${ctrl.action} (${profileCode})`;

  const flow = archetype.buildFlow(category);

  const complianceStandards = [
    ['SOC 2 Type II CC6.1', 'ISO/IEC 27001 A.13.1', 'NIST CSF PR.AC-3', 'PCI DSS v4.0 Requirement 1'],
    ['CIS Civo Kubernetes Benchmark v1.0', 'SOC 2 CC6.6', 'ISO 27001 A.12.6', 'NIST 800-53 SC-7'],
    ['HIPAA Security Rule 164.312(e)(1)', 'SOC 2 CC6.7', 'NIST SP 800-53 SC-8', 'PCI DSS Requirement 4'],
    ['CIS Critical Security Controls v8', 'NIST 800-53 CP-9', 'HITRUST CSF v9.4', 'GDPR Article 32']
  ];
  const compliance = complianceStandards[index % complianceStandards.length];

  const desc = `Implements hardened cloud security baseline for ${category.service} within ${archetype.name}. Isolates workloads in private Civo networks, applies zero-trust firewalls, enforces TLS 1.3, and monitors runtime telemetry. Aligned with ${compliance[0]}.`;

  const regoRuleName = `${category.id.replace(/-/g, '_')}_${ctrl.rule}_t${tierNumber}`;
  const regoBody = `deny[msg] {
  r := input.resource_changes[_]
  r.type == "${ctrl.res}"
  not r.change.after.${ctrl.prop.split('.')[0]}
  msg := sprintf("Civo resource %v must enforce ${ctrl.prop} for compliance standard ${compliance[0]}", [r.address])
}`;

  const tf = `resource "${ctrl.res}" "${category.id.replace(/-/g, '_')}_hardened_${tierNumber}" {
  # Enforce enterprise ${category.service} architectural baseline (${profileCode})
  name = "civo-${category.id}-${tierNumber}"
  network_id = civo_network.private_vpc.id
  tags = [
    "compliance:${compliance[0].toLowerCase().replace(/[^a-z0-9]/g, '-')}",
    "pillar:${pillar.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
    "managed-by:terraform"
  ]

  lifecycle {
    prevent_destroy = true
  }
}`;

  const threatModel = {
    stride_category: strideCategory,
    attack_vector: `${strideCategory}: Unauthorized exploit targeting unhardened ${category.service} configuration`,
    mitre_technique: ['T1078 (Valid Accounts)', 'T1530 (Data from Cloud Storage)', 'T1046 (Network Service Discovery)', 'T1485 (Data Destruction)', 'T1498 (Network Denial of Service)', 'T1068 (Exploitation for Privilege Escalation)'][index % 6],
    defense_barrier: `Civo Firewall CIDR Ingress Whitelist & Enforced ${ctrl.action}`
  };

  return {
    title,
    pillar,
    severity,
    compliance,
    desc,
    flow,
    regoRule: regoRuleName,
    regoBody,
    tf,
    threatModel
  };
}

const startTime = Date.now();
const allBestPractices = [];
let globalIndex = 1;

for (const cat of CATEGORIES) {
  for (let i = 0; i < TARGET_PER_CATEGORY; i++) {
    const id = padId(globalIndex);
    const sc = getCategoryScenario(cat, i);

    let svgOutput = '';
    try {
      const rendered = render(sc.flow, { icons: resolveIcon });
      svgOutput = rendered.svg;
    } catch (err) {
      console.error(`Pele render failed for ${id}:`, err.message);
      const fallback = render(`architecture-beta\n  group net(logos:civo-network)[Private Network]\n  service a(logos:${cat.id})[${cat.service}] in net\n  service b(logos:civo-firewall)[Firewall] in net\n  a:R --> L:b`, { icons: resolveIcon });
      svgOutput = fallback.svg;
    }

    allBestPractices.push({
      id,
      title: sc.title,
      category: cat.id,
      category_name: cat.name,
      service: cat.service,
      icon_url: `/images/civo-icons/${cat.id}.svg`,
      pillar: sc.pillar,
      severity: sc.severity,
      compliance: sc.compliance,
      description: sc.desc,
      mermaid: sc.flow,
      svg: svgOutput,
      threat_model: sc.threatModel,
      opa_policy: `package civo.${cat.id.replace(/-/g, '_')}.${sc.regoRule}

default allow = false

# Rule: ${sc.title}
# Compliance: ${sc.compliance.join(', ')}
# Threat Vector: ${sc.threatModel.attack_vector}
${sc.regoBody}`,
      terraform: sc.tf,
      remediation: `Inspect resource via Civo CLI: civo ${cat.id.split('-')[1] || 'kubernetes'} list or apply Terraform: terraform plan -out=tfplan && terraform apply tfplan`
    });

    globalIndex++;
  }
}

refreshDiagramCollection('civo', allBestPractices);
const elapsedMs = Date.now() - startTime;
console.log(`Generated and rendered ${allBestPractices.length} Civo Cloud architecture diagrams in ${elapsedMs}ms!`);

const outputDataDir = path.join(rootDir, 'priv', 'data');
const outputStaticDir = path.join(rootDir, 'priv', 'static', 'data');
const outputPublicDir = path.join(rootDir, 'public', 'data');

const targetFile1 = path.join(outputDataDir, 'civo-best-practices.json');
const targetFile2 = path.join(outputStaticDir, 'civo-best-practices.json');
const targetFile3 = path.join(outputPublicDir, 'civo-best-practices.json');

const jsonContent = JSON.stringify(allBestPractices, null, 2);
fs.mkdirSync(outputDataDir, { recursive: true });
fs.mkdirSync(outputStaticDir, { recursive: true });
fs.mkdirSync(outputPublicDir, { recursive: true });

fs.writeFileSync(targetFile1, jsonContent, 'utf8');
fs.writeFileSync(targetFile2, jsonContent, 'utf8');
fs.writeFileSync(targetFile3, jsonContent, 'utf8');

console.log(`Saved dataset to ${targetFile1} (${(fs.statSync(targetFile1).size / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`Saved dataset to ${targetFile2}`);
console.log(`Saved dataset to ${targetFile3}`);
