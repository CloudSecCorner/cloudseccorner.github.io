import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { securityEntries } from '../src/data/security-entries.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const references = readJson('src/data/reference-architectures.json');
const logos = readJson('node_modules/@iconify-json/logos/icons.json');
const definitions = [
  { id: 'aws', name: 'AWS', route: '/aws-architectures', logo: 'aws', scope: 'S3, Lambda, SQS, IAM, and VPC integration patterns.' },
  { id: 'azure', name: 'Azure', route: '/azure-architectures', logo: 'microsoft-azure', scope: 'Blob Storage, Functions, Service Bus, identity, and networking.' },
  { id: 'gcp', name: 'Google Cloud', route: '/gcp-architectures', logo: 'google-cloud', scope: 'Cloud Storage, Cloud Run, Pub/Sub, IAM, and GKE.' },
  { id: 'kspm', name: 'Kubernetes', route: '/kspm-architectures', logo: 'kubernetes', scope: 'Workloads, Services, admission, RBAC, and network policy.' },
  { id: 'cnapp', name: 'CNAPP & MITRE', route: '/cnapp-architectures', logo: 'aws-shield', scope: 'MITRE ATT&CK mitigation, KSPM, CSPM, CWPP, and OPA auto-remediation.' },
  { id: 'vultr', name: 'Vultr', route: '/vultr-architectures', logo: 'vultr', scope: 'VPC 2.0, Bare Metal, VKE, Object Storage, and Anycast networking.' },
  { id: 'oracle', name: 'Oracle Cloud', route: '/oracle-architectures', logo: 'oracle', scope: 'VCN, OKE, Autonomous Database, OCI Vault, and Cloud Guard.' },
  { id: 'digitalocean', name: 'DigitalOcean', route: '/digitalocean-architectures', logo: 'digital-ocean', scope: 'Droplets, DOKS, Spaces, Cloud Firewalls, and VPC networking.' },
  { id: 'alicloud', name: 'Alibaba Cloud', route: '/alicloud-architectures', logo: 'alicloud', scope: 'VPC, ACK, ApsaraDB, OSS, ActionTrail, and Security Center.' }
];
const logoDirectory = path.join(root, 'public/images/provider-logos');
fs.mkdirSync(logoDirectory, { recursive: true });
const providers = definitions.map(provider => {
  const entries = readJson(`public/data/${provider.id}-best-practices.json`);
  const logo = logos.icons[provider.logo] || {
    body: '<path fill="#FF6A00" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 4.5h3v4.5h-3zm-6 6h15v3h-15zm3 4.5h9v4.5h-9z"/>',
    width: 24,
    height: 24
  };
  const width = logo.width ?? logos.width ?? 16;
  const height = logo.height ?? logos.height ?? 16;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${logo.body}</svg>\n`;
  fs.writeFileSync(path.join(logoDirectory, `${provider.id}.svg`), svg);
  return {
    ...provider,
    logo: `/images/provider-logos/${provider.id}.svg`,
    profileCount: entries.length + references[provider.id].length,
    serviceCount: new Set(entries.map(entry => entry.category)).size,
    exampleCount: references[provider.id].length
  };
});
const labSummaries = {
  'Agentic-Cloud-Security': 'Tool authorization, action-bound approvals, replay rejection, and MCP integration.',
  'Zero-Trust-Architecture': 'Real local mutual TLS, certificate URI identities, and request authorization.',
  'Threat-Modeling': 'RAG tenant permissions, cache isolation, deletion, and owned regression tests.',
  'Security-Engineering-Fundamentals': 'Artifact signatures, digest checks, builder identity, and source policy.',
  'Nmap-Practical-Labs': 'Bounded loopback scans, port-state evidence, and before/after verification.',
  'ethical-hacker-easy-way': 'Container privilege, host access, credential, and init-container policy checks.'
};
const labs = readJson('public/data/labs.json').labs.map(lab => ({
  id: lab.id, title: lab.title, category: lab.category,
  description: labSummaries[lab.id] || lab.description,
  route: `/labs/${lab.id}`
}));
const blogs = readJson('priv/data/blog.json').blogs.map(blog => ({
  id: blog.id, title: blog.title, category: blog.category,
  route: `/blog/${blog.id}`
}));
const catalog = {
  providers, labs, blogs,
  counts: {
    profiles: providers.reduce((total, provider) => total + provider.profileCount, 0),
    examples: providers.reduce((total, provider) => total + provider.exampleCount, 0),
    labs: labs.length, tools: securityEntries.length
  }
};
fs.writeFileSync(path.join(root, 'src/data/home-catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
console.log(`Generated landing-page catalog: ${catalog.counts.profiles} profiles, ${catalog.counts.examples} examples, ${catalog.counts.labs} labs and ${catalog.counts.tools} tool entries.`);
