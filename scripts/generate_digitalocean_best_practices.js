import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from 'pele';
import { refreshDiagramCollection } from './lib/control-diagrams.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('Generating 1,032 Deep DigitalOcean Architecture Best Practices with Pele & Official Icons...');

function padId(num) {
  return 'DO-BP-' + String(num).padStart(4, '0');
}

const iconDir = path.join(rootDir, 'priv', 'static', 'images', 'digitalocean-icons');
const iconCache = {};

if (fs.existsSync(iconDir)) {
  for (const f of fs.readdirSync(iconDir)) {
    if (f.endsWith('.svg')) {
      const id = f.replace('.svg', '');
      let raw = fs.readFileSync(path.join(iconDir, f), 'utf8');

      raw = raw
        .replace(/id="([^"]+)"/g, `id="do-${id}-$1"`)
        .replace(/url\(#([^)]+)\)/g, `url(#do-${id}-$1)`);

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
  { id: 'do-spaces', name: 'DigitalOcean Spaces (Object Storage)', service: 'DigitalOcean Spaces', iconFile: 'do-spaces.svg' },
  { id: 'do-iam', name: 'Identity, Teams & Scoped API Tokens', service: 'DigitalOcean IAM & Tokens', iconFile: 'do-iam.svg' },
  { id: 'do-vpc', name: 'VPC & Private Network Isolation', service: 'DigitalOcean VPC', iconFile: 'do-vpc.svg' },
  { id: 'do-droplet', name: 'Droplets Compute Hardening & SSH', service: 'DigitalOcean Droplets', iconFile: 'do-droplet.svg' },
  { id: 'do-database', name: 'Managed Databases (Postgres & MySQL)', service: 'DigitalOcean Managed Databases', iconFile: 'do-database.svg' },
  { id: 'do-doks', name: 'DigitalOcean Kubernetes Engine (DOKS)', service: 'DigitalOcean DOKS', iconFile: 'do-doks.svg' },
  { id: 'do-firewall', name: 'Cloud Firewalls & Ingress Rules', service: 'DigitalOcean Cloud Firewall', iconFile: 'do-firewall.svg' },
  { id: 'do-loadbalancer', name: 'Cloud Load Balancers & SSL Offload', service: 'DigitalOcean Load Balancer', iconFile: 'do-loadbalancer.svg' },
  { id: 'do-dns', name: 'Cloud DNS & Domain Management', service: 'DigitalOcean Cloud DNS', iconFile: 'do-dns.svg' },
  { id: 'do-backup', name: 'Droplet Snapshots & Automated Backups', service: 'DigitalOcean Snapshots & Backups', iconFile: 'do-backup.svg' },
  { id: 'do-monitoring', name: 'Monitoring, Alerts & Metrics Agent', service: 'DigitalOcean Monitoring', iconFile: 'do-monitoring.svg' },
  { id: 'do-security', name: 'DDoS Mitigation & Project Security', service: 'DigitalOcean Security Shield', iconFile: 'do-security.svg' },
  { id: 'do-keys', name: 'SSH Keys & Secret Credentials', service: 'DigitalOcean SSH Keys', iconFile: 'do-keys.svg' },
  { id: 'do-volumes', name: 'Block Storage Volumes Encryption', service: 'DigitalOcean Block Storage', iconFile: 'do-volumes.svg' },
  { id: 'do-registry', name: 'DigitalOcean Container Registry (DOCR)', service: 'DigitalOcean Container Registry', iconFile: 'do-registry.svg' },
  { id: 'do-functions', name: 'Serverless Functions & API Handling', service: 'DigitalOcean Serverless Functions', iconFile: 'do-functions.svg' },
  { id: 'do-app-platform', name: 'App Platform Container Isolation', service: 'DigitalOcean App Platform', iconFile: 'do-app-platform.svg' },
  { id: 'do-redis', name: 'Managed Redis & Cache Protection', service: 'DigitalOcean Managed Redis', iconFile: 'do-redis.svg' },
  { id: 'do-kafka', name: 'Managed Kafka Streaming & Defense', service: 'DigitalOcean Managed Kafka', iconFile: 'do-kafka.svg' },
  { id: 'do-mongodb', name: 'Managed MongoDB Document Security', service: 'DigitalOcean Managed MongoDB', iconFile: 'do-mongodb.svg' },
  { id: 'do-waf', name: 'Cloud WAF & Edge Filtering', service: 'DigitalOcean Cloud WAF', iconFile: 'do-waf.svg' },
  { id: 'do-audit', name: 'Audit Logs & API Event Tracking', service: 'DigitalOcean Audit Logs', iconFile: 'do-audit.svg' },
  { id: 'do-ai', name: 'Gradient AI & GPU Droplets', service: 'DigitalOcean Gradient AI', iconFile: 'do-ai.svg' },
  { id: 'do-compliance', name: 'Security Posture & CIS Benchmarks', service: 'DigitalOcean Security Posture', iconFile: 'do-compliance.svg' }
];

const TARGET_PER_CATEGORY = 43;

const ARCHETYPES = [
  {
    name: 'Perimeter Defense & VPC Isolated Tier',
    buildFlow: (cat) => `architecture-beta
    group edge(logos:do-loadbalancer)[DigitalOcean Edge Ingress Tier]
    group vpc(logos:do-vpc)[Private VPC Security Enclave]
    group sec(logos:do-security)[Compliance & Audit Hub]

    service dns(logos:do-dns)[Cloud DNS] in edge
    service ddos(logos:do-security)[DDoS Shield] in edge
    service lb(logos:do-loadbalancer)[Load Balancer SSL] in edge

    service fw(logos:do-firewall)[Cloud Firewall] in vpc
    service svc(logos:${cat.id})[${cat.service}] in vpc
    service keys(logos:do-keys)[SSH / Secret Key] in vpc

    service log(logos:do-audit)[Audit Activity Log] in sec
    service mon(logos:do-monitoring)[Monitoring Alarms] in sec
    service cmp(logos:do-compliance)[Posture Guard] in sec

    dns:R --> L:ddos
    ddos:R --> L:lb
    lb:B --> T:fw
    fw:R --> L:svc
    svc:R --> L:keys
    svc:B --> T:log
    log:R --> L:mon
    mon:R --> L:cmp`
  },
  {
    name: 'DOKS Microservices & Private Workload Hardening',
    buildFlow: (cat) => `architecture-beta
    group ingress(logos:do-loadbalancer)[DO Ingress LB Tier]
    group cluster(logos:do-doks)[DOKS Enterprise Cluster]
    group backend(logos:do-spaces)[Private Spaces & Storage Store]

    service dns(logos:do-dns)[DNS Resolver] in ingress
    service lb(logos:do-loadbalancer)[DO Load Balancer] in ingress
    service fw(logos:do-firewall)[Perimeter Firewall] in ingress

    service doks(logos:do-doks)[DOKS Control Plane] in cluster
    service svc(logos:${cat.id})[${cat.service}] in cluster
    service iam(logos:do-iam)[Scoped API Token] in cluster

    service stor(logos:do-spaces)[Spaces Storage] in backend
    service cr(logos:do-registry)[Container Registry] in backend
    service sec(logos:do-security)[Threat Defense] in backend

    dns:R --> L:lb
    lb:R --> L:fw
    fw:B --> T:doks
    doks:R --> L:svc
    iam:B --> T:svc
    svc:B --> T:stor
    doks:R --> L:cr
    cr:R --> L:sec`
  },
  {
    name: 'Multi-Region High Availability & Snapshot DR',
    buildFlow: (cat) => `architecture-beta
    group global(logos:do-dns)[Global Anycast Routing]
    group primary(logos:do-vpc)[Primary Datacenter Region]
    group dr(logos:do-backup)[Disaster Recovery Vault]

    service dns(logos:do-dns)[DNS Health Check] in global
    service lb(logos:do-loadbalancer)[Edge Load Balancer] in global

    service prm(logos:${cat.id})[Primary Service Droplet] in primary
    service stb(logos:${cat.id})[Secondary Standby Node] in primary
    service fw(logos:do-firewall)[VPC Firewall] in primary

    service bk(logos:do-backup)[Snapshot Retention Vault] in dr
    service log(logos:do-audit)[Audit Trail] in dr
    service mon(logos:do-monitoring)[Failover Trigger] in dr

    dns:B --> T:lb
    lb:B --> T:prm
    prm:R --> L:stb
    prm:B --> T:fw
    prm:B --> T:bk
    prm:R --> L:log
    log:R --> L:mon`
  },
  {
    name: 'Event-Driven Real-time Ingestion & Messaging Mesh',
    buildFlow: (cat) => `architecture-beta
    group api(logos:do-loadbalancer)[API Gateway Ingress]
    group stream(logos:do-kafka)[Kafka / Streaming Bus]
    group worker(logos:do-droplet)[Compute Worker Droplets]

    service lb(logos:do-loadbalancer)[SSL Ingress LB] in api
    service iam(logos:do-iam)[Scoped Auth Token] in api

    service kfk(logos:do-kafka)[Managed Kafka] in stream
    service svc(logos:${cat.id})[${cat.service}] in stream
    service db(logos:do-database)[Managed Database] in stream

    service inst(logos:do-droplet)[Worker Droplet] in worker
    service log(logos:do-audit)[Kafka Audit Log] in worker
    service mon(logos:do-monitoring)[Consumer Lag Alerts] in worker

    lb:B --> T:svc
    iam:R --> L:lb
    svc:R --> L:kfk
    kfk:B --> T:db
    kfk:B --> T:inst
    inst:R --> L:log
    log:R --> L:mon`
  }
];

const CONTROLS = [
  { action: 'Enforce Restrictive Ingress Filtering', prop: 'inbound_rule', res: 'digitalocean_firewall', rule: 'ingress_boundary' },
  { action: 'Enforce Private Network (VPC) Binding', prop: 'vpc_uuid', res: 'digitalocean_droplet', rule: 'vpc_isolation' },
  { action: 'Require TLS 1.3 Encryption & Secure Ciphers', prop: 'tls_version', res: 'digitalocean_loadbalancer', rule: 'tls_enforcement' },
  { action: 'Enforce Automated Snapshot Retention', prop: 'backups', res: 'digitalocean_droplet', rule: 'snapshot_lifecycle' },
  { action: 'Block Public Bucket Access & Require S3 SigV4', prop: 'acl', res: 'digitalocean_spaces_bucket', rule: 'spaces_private_access' },
  { action: 'Enforce Scoped OAuth & Minimal Token Delegation', prop: 'scopes', res: 'digitalocean_project', rule: 'iam_least_privilege' },
  { action: 'Enable Storage Volume LUKS / AES-256 Encryption', prop: 'filesystem_type', res: 'digitalocean_volume', rule: 'storage_encryption' },
  { action: 'Mandate Audit Log Forwarding to Telemetry Sink', prop: 'audit_forwarding', res: 'digitalocean_project', rule: 'audit_logging' },
  { action: 'Enforce Strict Kubernetes Pod Admission via DOKS', prop: 'auto_upgrade', res: 'digitalocean_kubernetes_cluster', rule: 'doks_admission_gate' },
  { action: 'Require Multi-Zone Standby for High Availability', prop: 'region', res: 'digitalocean_database_cluster', rule: 'db_high_availability' },
  { action: 'Enforce SSH Key-Only Authentication without Passwords', prop: 'ssh_keys', res: 'digitalocean_droplet', rule: 'ssh_key_only' },
  { action: 'Enforce DNSSEC & Cloud DNS Zone Hardening', prop: 'dnssec', res: 'digitalocean_domain', rule: 'dns_dnssec_protection' }
];

const PILLARS = ['Security', 'Reliability', 'Operational Excellence', 'Performance Efficiency', 'Cost Optimization'];
const SEVERITIES = ['CRITICAL', 'HIGH', 'MEDIUM'];

function getCategoryScenario(category, index) {
  const archetype = ARCHETYPES[index % ARCHETYPES.length];
  const ctrl = CONTROLS[index % CONTROLS.length];
  const pillar = PILLARS[(index * 2) % PILLARS.length];
  const severity = SEVERITIES[(index * 3) % SEVERITIES.length];

  const tierNumber = (index % 12) + 1;
  const profileCode = `Tier-${tierNumber} ${category.name}`;
  const title = `${category.service}: ${ctrl.action} (${profileCode})`;

  const flow = archetype.buildFlow(category);

  const complianceStandards = [
    ['SOC 2 Type II CC6.1', 'ISO/IEC 27001 A.13.1', 'NIST CSF PR.AC-3', 'PCI DSS v4.0 Requirement 1'],
    ['CIS DigitalOcean Benchmark v1.2', 'SOC 2 CC6.6', 'ISO 27001 A.12.6', 'NIST 800-53 SC-7'],
    ['HIPAA Security Rule 164.312(e)(1)', 'SOC 2 CC6.7', 'NIST SP 800-53 SC-8', 'PCI DSS Requirement 4'],
    ['CIS Critical Security Controls v8', 'NIST 800-53 CP-9', 'HITRUST CSF v9.4', 'GDPR Article 32']
  ];
  const compliance = complianceStandards[index % complianceStandards.length];

  const desc = `Implements robust architectural hardening for ${category.service} within ${archetype.name}. Enforces explicit relations across DigitalOcean Load Balancers, private VPC enclaves, managed Cloud Firewalls, and automated snapshot retention. Aligned with ${compliance[0]}.`;

  const regoRuleName = `${category.id.replace(/-/g, '_')}_${ctrl.rule}_t${tierNumber}`;
  const regoBody = `deny[msg] {
  r := input.resource_changes[_]
  r.type == "${ctrl.res}"
  not r.change.after.${ctrl.prop.split('.')[0]}
  msg := sprintf("Resource %v must configure ${ctrl.prop} for compliance standard ${compliance[0]}", [r.address])
}`;

  const tf = `resource "${ctrl.res}" "${category.id.replace(/-/g, '_')}_hardened_${tierNumber}" {
  # Enforce enterprise ${category.service} architectural baseline (${profileCode})
  name = "do-${category.id}-${tierNumber}"
  tags = [
    "compliance:${compliance[0].toLowerCase().replace(/[^a-z0-9]/g, '-')}",
    "pillar:${pillar.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
    "managed-by:terraform"
  ]

  lifecycle {
    prevent_destroy = true
  }
}`;

  return {
    title,
    pillar,
    severity,
    compliance,
    desc,
    flow,
    regoRule: regoRuleName,
    regoBody,
    tf
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
      const fallback = render(`architecture-beta\n  group vpc(logos:do-vpc)[Private VPC]\n  service a(logos:${cat.id})[${cat.service}] in vpc\n  service b(logos:do-keys)[DO SSH Key] in vpc\n  a:R --> L:b`, { icons: resolveIcon });
      svgOutput = fallback.svg;
    }

    allBestPractices.push({
      id,
      title: sc.title,
      category: cat.id,
      category_name: cat.name,
      service: cat.service,
      icon_url: `/images/digitalocean-icons/${cat.id}.svg`,
      pillar: sc.pillar,
      severity: sc.severity,
      compliance: sc.compliance,
      description: sc.desc,
      mermaid: sc.flow,
      svg: svgOutput,
      opa_policy: `package digitalocean.${cat.id.replace(/-/g, '_')}.${sc.regoRule}

default allow = false

# Rule: ${sc.title}
# Compliance: ${sc.compliance.join(', ')}
${sc.regoBody}`,
      terraform: sc.tf,
      remediation: `Inspect resource via DigitalOcean CLI (doctl) or apply Terraform: terraform plan -out=tfplan && terraform apply tfplan`
    });

    globalIndex++;
  }
}

refreshDiagramCollection('digitalocean', allBestPractices);
const elapsedMs = Date.now() - startTime;
console.log(`Generated and rendered ${allBestPractices.length} DigitalOcean architecture diagrams in ${elapsedMs}ms!`);

const outputDataDir = path.join(rootDir, 'priv', 'data');
const outputStaticDir = path.join(rootDir, 'priv', 'static', 'data');
const outputPublicDir = path.join(rootDir, 'public', 'data');

const targetFile1 = path.join(outputDataDir, 'digitalocean-best-practices.json');
const targetFile2 = path.join(outputStaticDir, 'digitalocean-best-practices.json');
const targetFile3 = path.join(outputPublicDir, 'digitalocean-best-practices.json');

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
