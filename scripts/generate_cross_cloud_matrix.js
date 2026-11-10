import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const PROVIDER_IDS = ['aws', 'azure', 'gcp', 'kspm', 'cnapp', 'vultr', 'oracle', 'digitalocean', 'alicloud', 'civo', 'hetzner'];

const DOMAIN_DEFS = [
  { id: 'iam', title: 'Identity & Access Management (IAM)', icon: '🔑', desc: 'Workload identity, scoped API tokens, role assumption, and least privilege governance.' },
  { id: 'k8s', title: 'Managed Kubernetes Security', icon: '☸️', desc: 'Production cluster hardening, private API endpoints, and pod security standards.' },
  { id: 'storage', title: 'Object Storage Encryption & Isolation', icon: '🗄️', desc: 'Enforcing AES-256 encryption, TLS transport, and private access across all object stores.' },
  { id: 'network', title: 'Network Isolation, VPCs & Firewalls', icon: '🌐', desc: 'Private routing, security group zero-trust ingress, and perimeter boundary defense.' },
  { id: 'database', title: 'Managed Databases (DBaaS)', icon: '💾', desc: 'Encrypted storage at rest, multi-AZ high availability, and SSL/TLS client enforcement.' },
  { id: 'secrets', title: 'Key Management & Secrets Vaults', icon: '🔐', desc: 'Customer-managed encryption keys, automated envelope encryption, and secret rotation.' },
  { id: 'registry', title: 'Container Registries & Image Scanning', icon: '📦', desc: 'Vulnerability scanning, Cosign cryptographic signatures, and immutable image tags.' },
  { id: 'audit', title: 'Audit Logging & Telemetry Streams', icon: '📜', desc: 'Management and data event logging, real-time SIEM forwarding, and immutable retention.' },
  { id: 'waf', title: 'Edge Security, DDoS & WAF', icon: '🛡️', desc: 'Web Application Firewall inspection, rate limiting, and automated terabit DDoS shielding.' },
  { id: 'compliance', title: 'Compliance & Sovereign Guardrails', icon: '⚖️', desc: 'CIS Benchmarks, NIST SP 800-53, SOC 2 Type II, and European GDPR sovereignty controls.' }
];

const MATRIX = DOMAIN_DEFS.map(dom => {
  const providers = {};
  for (const p of PROVIDER_IDS) {
    const pName = p.toUpperCase();
    providers[p] = {
      service: `${pName} ${dom.title.split(' ')[0]} Service`,
      control: `Enforce hardened architectural baseline for ${dom.title} on ${pName}`,
      cli: `${p}-cli audit --domain ${dom.id}`,
      tf: `resource "${p}_${dom.id}" "hardened" {\n  # Hardened ${dom.title} on ${pName}\n  name = "${p}-${dom.id}-baseline"\n  encrypted = true\n}`,
      rego: `deny[msg] {\n  r := input.resource_changes[_]\n  r.type == "${p}_${dom.id}"\n  not r.change.after.encrypted\n  msg := "Resource must be encrypted for compliance"\n}`,
      compliance: 'CIS Level 1, NIST 800-53, SOC 2'
    };
  }
  return {
    id: dom.id,
    title: dom.title,
    icon: dom.icon,
    description: dom.desc,
    providers
  };
});

const outputFile = path.join(rootDir, 'src', 'data', 'cross-cloud-matrix.json');
fs.writeFileSync(outputFile, JSON.stringify(MATRIX, null, 2), 'utf8');
console.log(`Generated Cross-Cloud Matrix dataset with ${MATRIX.length} security domains across all 11 providers.`);
