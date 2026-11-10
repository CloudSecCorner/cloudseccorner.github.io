import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from 'pele';
import { refreshDiagramCollection } from './lib/control-diagrams.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('Generating 1,032 Deep Alibaba Cloud Architecture Best Practices with Pele & Official Icons...');

function padId(num) {
  return 'ALICLOUD-BP-' + String(num).padStart(4, '0');
}

const iconDir = path.join(rootDir, 'priv', 'static', 'images', 'alicloud-icons');
const iconCache = {};

if (fs.existsSync(iconDir)) {
  for (const f of fs.readdirSync(iconDir)) {
    if (f.endsWith('.svg')) {
      const id = f.replace('.svg', '');
      let raw = fs.readFileSync(path.join(iconDir, f), 'utf8');

      raw = raw
        .replace(/id="([^"]+)"/g, `id="ali-${id}-$1"`)
        .replace(/url\(#([^)]+)\)/g, `url(#ali-${id}-$1)`);

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
  { id: 'alicloud-oss', name: 'Object Storage Service (OSS) Defense', service: 'Alibaba Cloud OSS', iconFile: 'alicloud-oss.svg' },
  { id: 'alicloud-ram', name: 'Resource Access Management (RAM) & Roles', service: 'Alibaba Cloud RAM', iconFile: 'alicloud-ram.svg' },
  { id: 'alicloud-vpc', name: 'Virtual Private Cloud (VPC) & Subnets', service: 'Alibaba Cloud VPC', iconFile: 'alicloud-vpc.svg' },
  { id: 'alicloud-ecs', name: 'Elastic Compute Service (ECS) Hardening', service: 'Alibaba Cloud ECS', iconFile: 'alicloud-ecs.svg' },
  { id: 'alicloud-rds', name: 'ApsaraDB RDS (MySQL & PostgreSQL)', service: 'Alibaba Cloud ApsaraDB RDS', iconFile: 'alicloud-rds.svg' },
  { id: 'alicloud-ack', name: 'Container Service for Kubernetes (ACK)', service: 'Alibaba Cloud ACK', iconFile: 'alicloud-ack.svg' },
  { id: 'alicloud-security-group', name: 'Security Groups & Microsegmentation', service: 'Alibaba Cloud Security Groups', iconFile: 'alicloud-security-group.svg' },
  { id: 'alicloud-slb', name: 'Server Load Balancer (SLB/ALB) & SSL', service: 'Alibaba Cloud SLB', iconFile: 'alicloud-slb.svg' },
  { id: 'alicloud-dns', name: 'Alibaba Cloud DNS & PrivateZone', service: 'Alibaba Cloud DNS', iconFile: 'alicloud-dns.svg' },
  { id: 'alicloud-hbr', name: 'Hybrid Backup Recovery (HBR) & Snapshots', service: 'Alibaba Cloud HBR', iconFile: 'alicloud-hbr.svg' },
  { id: 'alicloud-actiontrail', name: 'ActionTrail Audit & Event Governance', service: 'Alibaba Cloud ActionTrail', iconFile: 'alicloud-actiontrail.svg' },
  { id: 'alicloud-cms', name: 'CloudMonitor & Telemetry Alarms', service: 'Alibaba Cloud CloudMonitor', iconFile: 'alicloud-cms.svg' },
  { id: 'alicloud-security-center', name: 'Cloud Security Center & Threat Posture', service: 'Alibaba Cloud Security Center', iconFile: 'alicloud-security-center.svg' },
  { id: 'alicloud-kms', name: 'Key Management Service (KMS) & HSM', service: 'Alibaba Cloud KMS', iconFile: 'alicloud-kms.svg' },
  { id: 'alicloud-nas', name: 'File Storage (NAS) Isolation', service: 'Alibaba Cloud NAS', iconFile: 'alicloud-nas.svg' },
  { id: 'alicloud-cr', name: 'Container Registry Enterprise (ACR EE)', service: 'Alibaba Cloud ACR', iconFile: 'alicloud-cr.svg' },
  { id: 'alicloud-fc', name: 'Function Compute (FC) Serverless', service: 'Alibaba Cloud Function Compute', iconFile: 'alicloud-fc.svg' },
  { id: 'alicloud-redis', name: 'ApsaraDB for Redis Security', service: 'Alibaba Cloud ApsaraDB Redis', iconFile: 'alicloud-redis.svg' },
  { id: 'alicloud-kafka', name: 'Message Queue for Apache Kafka', service: 'Alibaba Cloud Kafka', iconFile: 'alicloud-kafka.svg' },
  { id: 'alicloud-mongodb', name: 'ApsaraDB for MongoDB Encryption', service: 'Alibaba Cloud ApsaraDB MongoDB', iconFile: 'alicloud-mongodb.svg' },
  { id: 'alicloud-waf', name: 'Web Application Firewall (WAF 3.0)', service: 'Alibaba Cloud WAF', iconFile: 'alicloud-waf.svg' },
  { id: 'alicloud-ddos', name: 'Anti-DDoS Pro & Edge Protection', service: 'Alibaba Cloud Anti-DDoS', iconFile: 'alicloud-ddos.svg' },
  { id: 'alicloud-pai', name: 'Platform for AI (PAI) & Model Security', service: 'Alibaba Cloud PAI', iconFile: 'alicloud-pai.svg' },
  { id: 'alicloud-governance', name: 'Resource Directory & Control Policies', service: 'Alibaba Cloud Resource Directory', iconFile: 'alicloud-governance.svg' }
];

const TARGET_PER_CATEGORY = 43;

const ARCHETYPES = [
  {
    name: 'Perimeter Defense & VPC Isolated Tier',
    buildFlow: (cat) => `architecture-beta
    group edge(logos:alicloud-slb)[Alibaba Cloud Edge Ingress Tier]
    group vpc(logos:alicloud-vpc)[Private VPC Security Enclave]
    group sec(logos:alicloud-security-center)[Compliance & Audit Hub]

    service dns(logos:alicloud-dns)[Alibaba Cloud DNS] in edge
    service ddos(logos:alicloud-ddos)[Anti-DDoS Pro] in edge
    service slb(logos:alicloud-slb)[SLB / ALB SSL] in edge

    service sg(logos:alicloud-security-group)[Security Group] in vpc
    service svc(logos:${cat.id})[${cat.service}] in vpc
    service kms(logos:alicloud-kms)[KMS Envelope Key] in vpc

    service log(logos:alicloud-actiontrail)[ActionTrail Audit] in sec
    service mon(logos:alicloud-cms)[CloudMonitor Alarms] in sec
    service cmp(logos:alicloud-security-center)[Security Center] in sec

    dns:R --> L:ddos
    ddos:R --> L:slb
    slb:B --> T:sg
    sg:R --> L:svc
    svc:R --> L:kms
    svc:B --> T:log
    log:R --> L:mon
    mon:R --> L:cmp`
  },
  {
    name: 'ACK Microservices & Private Workload Hardening',
    buildFlow: (cat) => `architecture-beta
    group ingress(logos:alicloud-slb)[Alibaba Ingress SLB Tier]
    group cluster(logos:alicloud-ack)[ACK Enterprise Cluster]
    group backend(logos:alicloud-oss)[Private OSS & Storage Store]

    service dns(logos:alicloud-dns)[DNS Resolver] in ingress
    service slb(logos:alicloud-slb)[SLB Load Balancer] in ingress
    service sg(logos:alicloud-security-group)[Perimeter SG] in ingress

    service ack(logos:alicloud-ack)[ACK Master Node] in cluster
    service svc(logos:${cat.id})[${cat.service}] in cluster
    service ram(logos:alicloud-ram)[RAM Workload Role] in cluster

    service stor(logos:alicloud-oss)[OSS Bucket] in backend
    service cr(logos:alicloud-cr)[ACR Enterprise] in backend
    service sec(logos:alicloud-security-center)[Threat Defense] in backend

    dns:R --> L:slb
    slb:R --> L:sg
    sg:B --> T:ack
    ack:R --> L:svc
    ram:B --> T:svc
    svc:B --> T:stor
    ack:R --> L:cr
    cr:R --> L:sec`
  },
  {
    name: 'Multi-Zone High Availability & HBR Snapshot DR',
    buildFlow: (cat) => `architecture-beta
    group global(logos:alicloud-dns)[Global Traffic Routing]
    group primary(logos:alicloud-vpc)[Primary Multi-AZ Enclave]
    group dr(logos:alicloud-hbr)[HBR Disaster Recovery Vault]

    service dns(logos:alicloud-dns)[DNS Health Check] in global
    service slb(logos:alicloud-slb)[Multi-AZ SLB] in global

    service prm(logos:${cat.id})[Primary Service Node] in primary
    service stb(logos:${cat.id})[Secondary Standby Node] in primary
    service sg(logos:alicloud-security-group)[VPC Security Group] in primary

    service bk(logos:alicloud-hbr)[HBR Vault Retention] in dr
    service log(logos:alicloud-actiontrail)[ActionTrail Trail] in dr
    service mon(logos:alicloud-cms)[Failover Trigger] in dr

    dns:B --> T:slb
    slb:B --> T:prm
    prm:R --> L:stb
    prm:B --> T:sg
    prm:B --> T:bk
    prm:R --> L:log
    log:R --> L:mon`
  },
  {
    name: 'Event-Driven Real-time Ingestion & Messaging Mesh',
    buildFlow: (cat) => `architecture-beta
    group api(logos:alicloud-slb)[API Ingress SLB]
    group stream(logos:alicloud-kafka)[Message Queue Kafka Bus]
    group worker(logos:alicloud-ecs)[Compute Worker ECS]

    service slb(logos:alicloud-slb)[SSL Ingress SLB] in api
    service ram(logos:alicloud-ram)[RAM API Token] in api

    service kfk(logos:alicloud-kafka)[Kafka Message Queue] in stream
    service svc(logos:${cat.id})[${cat.service}] in stream
    service rds(logos:alicloud-rds)[ApsaraDB RDS] in stream

    service inst(logos:alicloud-ecs)[Worker ECS] in worker
    service log(logos:alicloud-actiontrail)[ActionTrail Log] in worker
    service mon(logos:alicloud-cms)[Consumer Lag Alerts] in worker

    slb:B --> T:svc
    ram:R --> L:slb
    svc:R --> L:kfk
    kfk:B --> T:rds
    kfk:B --> T:inst
    inst:R --> L:log
    log:R --> L:mon`
  }
];

const CONTROLS = [
  { action: 'Enforce Restrictive Security Group Ingress Filtering', prop: 'nic_type', res: 'alicloud_security_group_rule', rule: 'sg_ingress_boundary' },
  { action: 'Enforce VPC Subnet Isolation & Private Route Table', prop: 'vpc_id', res: 'alicloud_vswitch', rule: 'vpc_isolation' },
  { action: 'Require Server-Side Encryption with Customer KMS Key', prop: 'server_side_encryption_rule', res: 'alicloud_oss_bucket', rule: 'oss_kms_encryption' },
  { action: 'Enforce HBR Automated Backup Lifecycle & Retention', prop: 'retention', res: 'alicloud_hbr_vault', rule: 'hbr_backup_lifecycle' },
  { action: 'Block Public Bucket Access via Bucket Policy', prop: 'acl', res: 'alicloud_oss_bucket', rule: 'oss_private_access' },
  { action: 'Enforce RAM Least Privilege & MFA Requirement', prop: 'policy_document', res: 'alicloud_ram_policy', rule: 'ram_least_privilege' },
  { action: 'Enable Disk Encryption with Envelope KMS Master Key', prop: 'encrypted', res: 'alicloud_disk', rule: 'storage_encryption' },
  { action: 'Mandate ActionTrail Multi-Region Audit Logging', prop: 'event_rw', res: 'alicloud_actiontrail_trail', rule: 'actiontrail_audit' },
  { action: 'Enforce Strict Kubernetes Pod Admission via ACK Gatekeeper', prop: 'cluster_spec', res: 'alicloud_cs_managed_kubernetes', rule: 'ack_admission_gate' },
  { action: 'Require Multi-AZ Primary/Standby RDS High Availability', prop: 'category', res: 'alicloud_db_instance', rule: 'rds_high_availability' },
  { action: 'Enforce Key Pair SSH Authentication & Password Disabled', prop: 'key_name', res: 'alicloud_instance', rule: 'ecs_key_pair_only' },
  { action: 'Enforce PrivateZone DNSSEC & Resolver Isolation', prop: 'zone_name', res: 'alicloud_pvtz_zone', rule: 'dns_privatezone_protection' }
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
    ['CIS Alibaba Cloud Benchmark v1.0', 'MLPS Level 3', 'ISO 27001 A.12.6', 'NIST 800-53 SC-7'],
    ['HIPAA Security Rule 164.312(e)(1)', 'SOC 2 CC6.7', 'NIST SP 800-53 SC-8', 'PCI DSS Requirement 4'],
    ['CIS Critical Security Controls v8', 'NIST 800-53 CP-9', 'HITRUST CSF v9.4', 'GDPR Article 32']
  ];
  const compliance = complianceStandards[index % complianceStandards.length];

  const desc = `Implements robust architectural hardening for ${category.service} within ${archetype.name}. Enforces explicit relations across Alibaba Cloud SLB/ALB, private VPC enclaves, Security Groups, ActionTrail auditing, and automated HBR retention. Aligned with ${compliance[0]}.`;

  const regoRuleName = `${category.id.replace(/-/g, '_')}_${ctrl.rule}_t${tierNumber}`;
  const regoBody = `deny[msg] {
  r := input.resource_changes[_]
  r.type == "${ctrl.res}"
  not r.change.after.${ctrl.prop.split('.')[0]}
  msg := sprintf("Resource %v must configure ${ctrl.prop} for compliance standard ${compliance[0]}", [r.address])
}`;

  const tf = `resource "${ctrl.res}" "${category.id.replace(/-/g, '_')}_hardened_${tierNumber}" {
  # Enforce enterprise ${category.service} architectural baseline (${profileCode})
  tags = {
    Environment    = var.environment
    Compliance     = "${compliance[0]}"
    SecurityPillar = "${pillar}"
    ManagedBy      = "Terraform"
  }

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
      const fallback = render(`architecture-beta\n  group vpc(logos:alicloud-vpc)[Private VPC]\n  service a(logos:${cat.id})[${cat.service}] in vpc\n  service b(logos:alicloud-kms)[Alibaba Cloud KMS] in vpc\n  a:R --> L:b`, { icons: resolveIcon });
      svgOutput = fallback.svg;
    }

    allBestPractices.push({
      id,
      title: sc.title,
      category: cat.id,
      category_name: cat.name,
      service: cat.service,
      icon_url: `/images/alicloud-icons/${cat.id}.svg`,
      pillar: sc.pillar,
      severity: sc.severity,
      compliance: sc.compliance,
      description: sc.desc,
      mermaid: sc.flow,
      svg: svgOutput,
      opa_policy: `package alicloud.${cat.id.replace(/-/g, '_')}.${sc.regoRule}

default allow = false

# Rule: ${sc.title}
# Compliance: ${sc.compliance.join(', ')}
${sc.regoBody}`,
      terraform: sc.tf,
      remediation: `Inspect resource via Alibaba Cloud CLI (aliyun) or apply Terraform: terraform plan -out=tfplan && terraform apply tfplan`
    });

    globalIndex++;
  }
}

refreshDiagramCollection('alicloud', allBestPractices);
const elapsedMs = Date.now() - startTime;
console.log(`Generated and rendered ${allBestPractices.length} Alibaba Cloud architecture diagrams in ${elapsedMs}ms!`);

const outputDataDir = path.join(rootDir, 'priv', 'data');
const outputStaticDir = path.join(rootDir, 'priv', 'static', 'data');
const outputPublicDir = path.join(rootDir, 'public', 'data');

const targetFile1 = path.join(outputDataDir, 'alicloud-best-practices.json');
const targetFile2 = path.join(outputStaticDir, 'alicloud-best-practices.json');
const targetFile3 = path.join(outputPublicDir, 'alicloud-best-practices.json');

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
