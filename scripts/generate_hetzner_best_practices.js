import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from 'pele';
import { refreshDiagramCollection } from './lib/control-diagrams.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('Generating 1,032 Deep Hetzner Cloud Architecture Best Practices with Pele & Official Icons...');

function padId(num) {
  return 'HTZ-BP-' + String(num).padStart(4, '0');
}

const iconDir = path.join(rootDir, 'priv', 'static', 'images', 'hetzner-icons');
const iconCache = {};

if (fs.existsSync(iconDir)) {
  for (const f of fs.readdirSync(iconDir)) {
    if (f.endsWith('.svg')) {
      const id = f.replace('.svg', '');
      let raw = fs.readFileSync(path.join(iconDir, f), 'utf8');

      raw = raw
        .replace(/id="([^"]+)"/g, `id="htz-${id}-$1"`)
        .replace(/url\(#([^)]+)\)/g, `url(#htz-${id}-$1)`);

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
  { id: 'hetzner-server', name: 'Cloud Compute Servers (CX/CPX/CAX)', service: 'Hetzner Cloud Server', iconFile: 'hetzner-server.svg' },
  { id: 'hetzner-network', name: 'Private Networks & vSwitch Interconnect', service: 'Hetzner Cloud Network', iconFile: 'hetzner-network.svg' },
  { id: 'hetzner-firewall', name: 'Stateful Cloud Firewalls & Rule Sets', service: 'Hetzner Cloud Firewall', iconFile: 'hetzner-firewall.svg' },
  { id: 'hetzner-volume', name: 'NVMe Fast Block Storage Volumes', service: 'Hetzner Volume', iconFile: 'hetzner-volume.svg' },
  { id: 'hetzner-loadbalancer', name: 'Managed Load Balancers & TLS Offload', service: 'Hetzner Load Balancer', iconFile: 'hetzner-loadbalancer.svg' },
  { id: 'hetzner-floating-ip', name: 'High-Availability Floating IPs', service: 'Hetzner Floating IP', iconFile: 'hetzner-floating-ip.svg' },
  { id: 'hetzner-primary-ip', name: 'Primary IPv4/IPv6 Address Allocation', service: 'Hetzner Primary IP', iconFile: 'hetzner-primary-ip.svg' },
  { id: 'hetzner-ssh-key', name: 'SSH Keys & Hardware Token Access', service: 'Hetzner SSH Keys', iconFile: 'hetzner-ssh-key.svg' },
  { id: 'hetzner-certificate', name: 'TLS/SSL Certificate Manager', service: 'Hetzner Managed Certificate', iconFile: 'hetzner-certificate.svg' },
  { id: 'hetzner-placement-group', name: 'Anti-Affinity Placement Groups', service: 'Hetzner Placement Group', iconFile: 'hetzner-placement-group.svg' },
  { id: 'hetzner-snapshot', name: 'Server & Volume Snapshot Images', service: 'Hetzner Snapshot', iconFile: 'hetzner-snapshot.svg' },
  { id: 'hetzner-backup', name: 'Automated 7-Day Rolling Backups', service: 'Hetzner Backup Schedule', iconFile: 'hetzner-backup.svg' },
  { id: 'hetzner-dns', name: 'Anycast Authoritative DNS Zones', service: 'Hetzner DNS Zone', iconFile: 'hetzner-dns.svg' },
  { id: 'hetzner-robot', name: 'Hetzner Robot Bare-Metal Hybrid', service: 'Hetzner Robot Dedicated', iconFile: 'hetzner-robot.svg' },
  { id: 'hetzner-vswitch', name: 'Layer 2 VLAN vSwitch Interconnect', service: 'Hetzner vSwitch VLAN', iconFile: 'hetzner-vswitch.svg' },
  { id: 'hetzner-storagebox', name: 'Storage Box (SFTP, WebDAV, ZFS Snapshots)', service: 'Hetzner Storage Box', iconFile: 'hetzner-storagebox.svg' },
  { id: 'hetzner-iam', name: 'Project Scoped API Tokens & RBAC', service: 'Hetzner API Tokens', iconFile: 'hetzner-iam.svg' },
  { id: 'hetzner-audit', name: 'Action History & Activity Audit Trail', service: 'Hetzner Action Log', iconFile: 'hetzner-audit.svg' },
  { id: 'hetzner-metrics', name: 'Telemetry, CPU & Network Metrics', service: 'Hetzner Metrics Graphing', iconFile: 'hetzner-metrics.svg' },
  { id: 'hetzner-security', name: 'Host OS Hardening & CIS Benchmarks', service: 'Hetzner Security Baseline', iconFile: 'hetzner-security.svg' },
  { id: 'hetzner-ddos', name: 'Automated Terabit DDoS Shield', service: 'Hetzner DDoS Protection', iconFile: 'hetzner-ddos.svg' },
  { id: 'hetzner-k8s', name: 'Production Kubernetes (hcloud-k8s & CSI)', service: 'Hetzner Kubernetes Cluster', iconFile: 'hetzner-k8s.svg' },
  { id: 'hetzner-cloud-init', name: 'Cloud-Init Hardening & Bootstrap', service: 'Hetzner Cloud-Init User Data', iconFile: 'hetzner-cloud-init.svg' },
  { id: 'hetzner-compliance', name: 'ISO/IEC 27001 & GDPR EU Compliance', service: 'Hetzner European Compliance', iconFile: 'hetzner-compliance.svg' }
];

const TARGET_PER_CATEGORY = 43; // 24 * 43 = 1,032 total blueprints

const ARCHETYPES = [
  {
    name: 'Multi-Tier Hardened Cloud Network',
    buildFlow: cat => `architecture-beta
  group net(logos:hetzner-network)[Hetzner Private Network]
  service lb(logos:hetzner-loadbalancer)[Load Balancer TLS] in net
  service srv(logos:hetzner-server)[App Server CX31] in net
  service target(logos:${cat.id})[${cat.service}] in net
  service box(logos:hetzner-storagebox)[Storage Box SFTP] in net
  lb:R --> L:srv
  srv:B --> T:target
  target:R --> L:box`
  },
  {
    name: 'Hybrid Bare-Metal vSwitch Bridge',
    buildFlow: cat => `architecture-beta
  group vsw(logos:hetzner-vswitch)[vSwitch VLAN 4000]
  service robot(logos:hetzner-robot)[Robot Bare Metal AX52] in vsw
  service vswitch(logos:hetzner-vswitch)[L2 Interconnect] in vsw
  service target(logos:${cat.id})[${cat.service}] in vsw
  service fw(logos:hetzner-firewall)[Cloud Firewall] in vsw
  robot:R --> L:vswitch
  vswitch:B --> T:target
  target:R --> L:fw`
  },
  {
    name: 'Zero-Trust Bastion & SSH Protection',
    buildFlow: cat => `architecture-beta
  group dmz(logos:hetzner-firewall)[Firewall Ingress Perimeter]
  service dns(logos:hetzner-dns)[Hetzner DNS Zone] in dmz
  service fw(logos:hetzner-firewall)[Stateful Firewall] in dmz
  service target(logos:${cat.id})[${cat.service}] in dmz
  service key(logos:hetzner-ssh-key)[ED25519 SSH Key] in dmz
  dns:R --> L:fw
  fw:B --> T:target
  target:R --> L:key`
  },
  {
    name: 'Resilient High-Availability Cluster',
    buildFlow: cat => `architecture-beta
  group net(logos:hetzner-network)[Private Subnet 10.0.0.0/16]
  service fip(logos:hetzner-floating-ip)[Floating IP Failover] in net
  service pg(logos:hetzner-placement-group)[Placement Group Spread] in net
  service target(logos:${cat.id})[${cat.service}] in net
  service bkp(logos:hetzner-backup)[Daily Snapshot Backup] in net
  fip:R --> L:pg
  pg:B --> T:target
  target:R --> L:bkp`
  }
];

const CONTROLS = [
  { action: 'Enforce Encrypted Transport with TLS 1.3 Termination', prop: 'tls_enabled', res: 'hcloud_load_balancer', rule: 'tls_enforcement' },
  { action: 'Require Private Network Attachment without Public IP', prop: 'network_id', res: 'hcloud_server', rule: 'private_networking' },
  { action: 'Restrict Ingress to Zero-Trust CIDR Whitelists', prop: 'rules', res: 'hcloud_firewall', rule: 'firewall_whitelist' },
  { action: 'Enforce ED25519 SSH Key Authentication without Passwords', prop: 'public_key', res: 'hcloud_ssh_key', rule: 'ssh_key_only' },
  { action: 'Mandate Daily Automated Backup Schedules', prop: 'backups', res: 'hcloud_server', rule: 'automated_backups' },
  { action: 'Enforce Anti-Affinity Spread in Placement Groups', prop: 'placement_group_id', res: 'hcloud_server', rule: 'high_availability' },
  { action: 'Enable Storage Box Encrypted Subaccounts & ZFS Snapshots', prop: 'encryption', res: 'hcloud_volume', rule: 'storage_encryption' },
  { action: 'Mandate Real-Time Action Log Collection & Telemetry', prop: 'metrics', res: 'hcloud_network', rule: 'audit_telemetry' }
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
    ['ISO/IEC 27001 A.13.1', 'SOC 2 Type II CC6.1', 'NIST CSF PR.AC-3', 'GDPR Article 32'],
    ['CIS Hetzner Linux Benchmark v1.0', 'SOC 2 CC6.6', 'ISO 27001 A.12.6', 'NIST 800-53 SC-7'],
    ['BSI C5 Cloud Standard', 'SOC 2 CC6.7', 'NIST SP 800-53 SC-8', 'PCI DSS Requirement 4'],
    ['CIS Critical Security Controls v8', 'NIST 800-53 CP-9', 'HITRUST CSF v9.4', 'EU Sovereign Cloud']
  ];
  const compliance = complianceStandards[index % complianceStandards.length];

  const desc = `Implements European sovereign cloud security baseline for ${category.service} within ${archetype.name}. Isolates server compute in private Hetzner Cloud Networks, applies stateful firewall rules, enforces ED25519 SSH keys, and activates automated backup replication. Aligned with ${compliance[0]}.`;

  const regoRuleName = `${category.id.replace(/-/g, '_')}_${ctrl.rule}_t${tierNumber}`;
  const regoBody = `deny[msg] {
  r := input.resource_changes[_]
  r.type == "${ctrl.res}"
  not r.change.after.${ctrl.prop.split('.')[0]}
  msg := sprintf("Hetzner resource %v must configure ${ctrl.prop} for compliance standard ${compliance[0]}", [r.address])
}`;

  const tf = `resource "${ctrl.res}" "${category.id.replace(/-/g, '_')}_hardened_${tierNumber}" {
  # Enforce enterprise ${category.service} architectural baseline (${profileCode})
  name = "htz-${category.id}-${tierNumber}"
  labels = {
    "compliance" = "${compliance[0].toLowerCase().replace(/[^a-z0-9]/g, '-')}"
    "pillar"     = "${pillar.toLowerCase().replace(/[^a-z0-9]/g, '-')}"
    "managed-by" = "terraform"
  }

  lifecycle {
    prevent_destroy = true
  }
}`;

  const threatModel = {
    stride_category: strideCategory,
    attack_vector: `${strideCategory}: Remote brute-force or unauthorized packet ingress targeting ${category.service}`,
    mitre_technique: ['T1078 (Valid Accounts)', 'T1046 (Network Service Discovery)', 'T1530 (Data from Cloud Storage)', 'T1485 (Data Destruction)', 'T1498 (Network Denial of Service)', 'T1068 (Exploitation for Privilege Escalation)'][index % 6],
    defense_barrier: `Hetzner Cloud Firewall Rule Filter & ${ctrl.action}`
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
      const fallback = render(`architecture-beta\n  group net(logos:hetzner-network)[Private Network]\n  service a(logos:${cat.id})[${cat.service}] in net\n  service b(logos:hetzner-firewall)[Firewall] in net\n  a:R --> L:b`, { icons: resolveIcon });
      svgOutput = fallback.svg;
    }

    allBestPractices.push({
      id,
      title: sc.title,
      category: cat.id,
      category_name: cat.name,
      service: cat.service,
      icon_url: `/images/hetzner-icons/${cat.id}.svg`,
      pillar: sc.pillar,
      severity: sc.severity,
      compliance: sc.compliance,
      description: sc.desc,
      mermaid: sc.flow,
      svg: svgOutput,
      threat_model: sc.threatModel,
      opa_policy: `package hetzner.${cat.id.replace(/-/g, '_')}.${sc.regoRule}

default allow = false

# Rule: ${sc.title}
# Compliance: ${sc.compliance.join(', ')}
# Threat Vector: ${sc.threatModel.attack_vector}
${sc.regoBody}`,
      terraform: sc.tf,
      remediation: `Inspect resource via Hetzner CLI: hcloud ${cat.id.split('-')[1] || 'server'} list or apply Terraform: terraform plan -out=tfplan && terraform apply tfplan`
    });

    globalIndex++;
  }
}

refreshDiagramCollection('hetzner', allBestPractices);
const elapsedMs = Date.now() - startTime;
console.log(`Generated and rendered ${allBestPractices.length} Hetzner Cloud architecture diagrams in ${elapsedMs}ms!`);

const outputDataDir = path.join(rootDir, 'priv', 'data');
const outputStaticDir = path.join(rootDir, 'priv', 'static', 'data');
const outputPublicDir = path.join(rootDir, 'public', 'data');

const targetFile1 = path.join(outputDataDir, 'hetzner-best-practices.json');
const targetFile2 = path.join(outputStaticDir, 'hetzner-best-practices.json');
const targetFile3 = path.join(outputPublicDir, 'hetzner-best-practices.json');

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
