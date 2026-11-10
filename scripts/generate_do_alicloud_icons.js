import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const doPub = path.join(rootDir, 'public', 'images', 'digitalocean-icons');
const doPriv = path.join(rootDir, 'priv', 'static', 'images', 'digitalocean-icons');
const aliPub = path.join(rootDir, 'public', 'images', 'alicloud-icons');
const aliPriv = path.join(rootDir, 'priv', 'static', 'images', 'alicloud-icons');

for (const dir of [doPub, doPriv, aliPub, aliPriv]) {
  fs.mkdirSync(dir, { recursive: true });
}

// 24 DigitalOcean Icons
const DO_ICONS = [
  { id: 'do-spaces', title: 'DigitalOcean Spaces (Object Storage)', colors: ['#0069FF', '#004CCC'], svg: '<path d="M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4zM2 2v18a2 2 0 002 2h16a2 2 0 002-2V2a2 2 0 00-2-2H4a2 2 0 00-2 2z"/>' },
  { id: 'do-iam', title: 'DigitalOcean Identity & API Tokens', colors: ['#0069FF', '#002244'], svg: '<path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z"/>' },
  { id: 'do-vpc', title: 'DigitalOcean VPC & Private Network', colors: ['#00A3FF', '#0069FF'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'do-droplet', title: 'DigitalOcean Droplets Compute', colors: ['#0069FF', '#003B99'], svg: '<path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>' },
  { id: 'do-database', title: 'DigitalOcean Managed Databases', colors: ['#0284C7', '#0369A1'], svg: '<path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm8 6c0 .66-3.58 2-8 2s-8-1.34-8-2V8.26C5.55 9.33 8.58 10 12 10s6.45-.67 8-1.74V10zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V14zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V18z"/>' },
  { id: 'do-doks', title: 'DigitalOcean Kubernetes (DOKS)', colors: ['#326CE5', '#0069FF'], svg: '<path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.24L18.66 8 12 11.76 5.34 8 12 4.24zM4.8 9.38l6.4 3.66v6.92L4.8 16.3V9.38zm8 10.58v-6.92l6.4-3.66v6.92l-6.4 3.66z"/>' },
  { id: 'do-firewall', title: 'DigitalOcean Cloud Firewalls', colors: ['#DC2626', '#0069FF'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>' },
  { id: 'do-loadbalancer', title: 'DigitalOcean Load Balancers', colors: ['#0069FF', '#0D9488'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'do-dns', title: 'DigitalOcean Cloud DNS', colors: ['#0284C7', '#0069FF'], svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' },
  { id: 'do-backup', title: 'DigitalOcean Snapshots & Backups', colors: ['#0D9488', '#0069FF'], svg: '<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>' },
  { id: 'do-monitoring', title: 'DigitalOcean Monitoring & Agent', colors: ['#6366F1', '#0069FF'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-6h2v6zm4 0h-2v-10h2v10zm-8 0H6v-3h2v3z"/>' },
  { id: 'do-security', title: 'DigitalOcean Security & Cloud Shield', colors: ['#2563EB', '#1D4ED8'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a4 4 0 110 8 4 4 0 010-8zm-5 13.5c.8-1.8 3.1-3 5-3s4.2 1.2 5 3a9.9 9.9 0 01-10 0z"/>' },
  { id: 'do-keys', title: 'DigitalOcean SSH Keys & Secrets', colors: ['#8B5CF6', '#0069FF'], svg: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>' },
  { id: 'do-volumes', title: 'DigitalOcean Block Storage Volumes', colors: ['#0284C7', '#1E40AF'], svg: '<path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm4-7a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z"/>' },
  { id: 'do-registry', title: 'DigitalOcean Container Registry (DOCR)', colors: ['#0069FF', '#0284C7'], svg: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>' },
  { id: 'do-functions', title: 'DigitalOcean Serverless Functions', colors: ['#F59E0B', '#D97706'], svg: '<path d="M7 2v11h3v9l7-12h-4l4-8H7z"/>' },
  { id: 'do-app-platform', title: 'DigitalOcean App Platform', colors: ['#0069FF', '#7C3AED'], svg: '<path d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm2 4v4h12V6H6zm0 8v4h12v-4H6z"/>' },
  { id: 'do-redis', title: 'DigitalOcean Managed Redis', colors: ['#DC2626', '#991B1B'], svg: '<path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 16l10 5 10-5-10-5z"/>' },
  { id: 'do-kafka', title: 'DigitalOcean Managed Kafka', colors: ['#0F172A', '#0069FF'], svg: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5v-9l6 4.5-6 4.5z"/>' },
  { id: 'do-mongodb', title: 'DigitalOcean Managed MongoDB', colors: ['#10B981', '#047857'], svg: '<path d="M12 2C8 6 6 9 6 13c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-2-7-6-11zm0 18c-2.8 0-5-2.2-5-5 0-2.8 1.5-5.2 5-8.8 3.5 3.6 5 6 5 8.8 0 2.8-2.2 5-5 5z"/>' },
  { id: 'do-waf', title: 'DigitalOcean Cloud WAF & Edge', colors: ['#EF4444', '#B91C1C'], svg: '<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>' },
  { id: 'do-audit', title: 'DigitalOcean Audit Logs', colors: ['#475569', '#1E293B'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>' },
  { id: 'do-ai', title: 'DigitalOcean Gradient AI & GPUs', colors: ['#8B5CF6', '#6D28D9'], svg: '<path d="M12 2a10 10 0 00-7.07 17.07l1.41-1.41A8 8 0 1112 20v2a10 10 0 000-20zm1 5h-2v6h6v-2h-4V7z"/>' },
  { id: 'do-compliance', title: 'DigitalOcean Compliance & Hardening', colors: ['#059669', '#047857'], svg: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>' }
];

// 24 Alibaba Cloud Icons
const ALI_ICONS = [
  { id: 'alicloud-oss', title: 'Alibaba Cloud Object Storage (OSS)', colors: ['#FF6A00', '#D45000'], svg: '<path d="M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4zM2 2v18a2 2 0 002 2h16a2 2 0 002-2V2a2 2 0 00-2-2H4a2 2 0 00-2 2z"/>' },
  { id: 'alicloud-ram', title: 'Alibaba Cloud Resource Access Management (RAM)', colors: ['#FF6A00', '#1C2438'], svg: '<path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z"/>' },
  { id: 'alicloud-vpc', title: 'Alibaba Cloud Virtual Private Cloud (VPC)', colors: ['#FF8533', '#FF6A00'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'alicloud-ecs', title: 'Alibaba Cloud Elastic Compute (ECS)', colors: ['#FF6A00', '#B34700'], svg: '<path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>' },
  { id: 'alicloud-rds', title: 'Alibaba Cloud ApsaraDB RDS', colors: ['#0284C7', '#0369A1'], svg: '<path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm8 6c0 .66-3.58 2-8 2s-8-1.34-8-2V8.26C5.55 9.33 8.58 10 12 10s6.45-.67 8-1.74V10zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V14zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V18z"/>' },
  { id: 'alicloud-ack', title: 'Alibaba Cloud Container Service (ACK)', colors: ['#326CE5', '#FF6A00'], svg: '<path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.24L18.66 8 12 11.76 5.34 8 12 4.24zM4.8 9.38l6.4 3.66v6.92L4.8 16.3V9.38zm8 10.58v-6.92l6.4-3.66v6.92l-6.4 3.66z"/>' },
  { id: 'alicloud-security-group', title: 'Alibaba Cloud Security Groups', colors: ['#DC2626', '#FF6A00'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>' },
  { id: 'alicloud-slb', title: 'Alibaba Cloud Server Load Balancer (SLB/ALB)', colors: ['#FF6A00', '#0D9488'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'alicloud-dns', title: 'Alibaba Cloud PrivateZone & DNS', colors: ['#0284C7', '#FF6A00'], svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' },
  { id: 'alicloud-hbr', title: 'Alibaba Cloud Hybrid Backup Recovery (HBR)', colors: ['#0D9488', '#FF6A00'], svg: '<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>' },
  { id: 'alicloud-actiontrail', title: 'Alibaba Cloud ActionTrail', colors: ['#475569', '#1C2438'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>' },
  { id: 'alicloud-cms', title: 'Alibaba Cloud CloudMonitor', colors: ['#6366F1', '#FF6A00'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-6h2v6zm4 0h-2v-10h2v10zm-8 0H6v-3h2v3z"/>' },
  { id: 'alicloud-security-center', title: 'Alibaba Cloud Security Center', colors: ['#FF6A00', '#B91C1C'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a4 4 0 110 8 4 4 0 010-8zm-5 13.5c.8-1.8 3.1-3 5-3s4.2 1.2 5 3a9.9 9.9 0 01-10 0z"/>' },
  { id: 'alicloud-kms', title: 'Alibaba Cloud Key Management (KMS)', colors: ['#8B5CF6', '#FF6A00'], svg: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>' },
  { id: 'alicloud-nas', title: 'Alibaba Cloud File Storage (NAS)', colors: ['#0284C7', '#FF6A00'], svg: '<path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm4-7a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z"/>' },
  { id: 'alicloud-cr', title: 'Alibaba Cloud Container Registry (ACR)', colors: ['#FF6A00', '#0284C7'], svg: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>' },
  { id: 'alicloud-fc', title: 'Alibaba Cloud Function Compute (FC)', colors: ['#F59E0B', '#D97706'], svg: '<path d="M7 2v11h3v9l7-12h-4l4-8H7z"/>' },
  { id: 'alicloud-redis', title: 'Alibaba Cloud ApsaraDB for Redis', colors: ['#DC2626', '#991B1B'], svg: '<path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 16l10 5 10-5-10-5z"/>' },
  { id: 'alicloud-kafka', title: 'Alibaba Cloud Message Queue for Kafka', colors: ['#0F172A', '#FF6A00'], svg: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5v-9l6 4.5-6 4.5z"/>' },
  { id: 'alicloud-mongodb', title: 'Alibaba Cloud ApsaraDB for MongoDB', colors: ['#10B981', '#047857'], svg: '<path d="M12 2C8 6 6 9 6 13c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4-2-7-6-11zm0 18c-2.8 0-5-2.2-5-5 0-2.8 1.5-5.2 5-8.8 3.5 3.6 5 6 5 8.8 0 2.8-2.2 5-5 5z"/>' },
  { id: 'alicloud-waf', title: 'Alibaba Cloud Web App Firewall (WAF 3.0)', colors: ['#EF4444', '#B91C1C'], svg: '<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>' },
  { id: 'alicloud-ddos', title: 'Alibaba Cloud Anti-DDoS Pro', colors: ['#DC2626', '#7F1D1D'], svg: '<path d="M12 2a10 10 0 00-7.07 17.07l1.41-1.41A8 8 0 1112 20v2a10 10 0 000-20zm1 5h-2v6h6v-2h-4V7z"/>' },
  { id: 'alicloud-pai', title: 'Alibaba Cloud Platform for AI (PAI)', colors: ['#8B5CF6', '#6D28D9'], svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>' },
  { id: 'alicloud-governance', title: 'Alibaba Cloud Resource Directory & Governance', colors: ['#059669', '#047857'], svg: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>' }
];

function generateSvgIcon(icon, prefix) {
  const gradId = `${prefix}-${icon.id}-grad`;
  return `<svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <title>${icon.title}</title>
  <defs>
    <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="${gradId}">
      <stop stop-color="${icon.colors[0]}" offset="0%"></stop>
      <stop stop-color="${icon.colors[1]}" offset="100%"></stop>
    </linearGradient>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <rect fill="url(#${gradId})" x="0" y="0" width="40" height="40" rx="8"></rect>
    <g transform="translate(8, 8)" fill="#FFFFFF">
      ${icon.svg}
    </g>
  </g>
</svg>
`;
}

// Generate DigitalOcean service icons
for (const icon of DO_ICONS) {
  const content = generateSvgIcon(icon, 'do');
  fs.writeFileSync(path.join(doPub, `${icon.id}.svg`), content);
  fs.writeFileSync(path.join(doPriv, `${icon.id}.svg`), content);
}
console.log(`Generated ${DO_ICONS.length} DigitalOcean service icons.`);

// Generate Alibaba Cloud service icons
for (const icon of ALI_ICONS) {
  const content = generateSvgIcon(icon, 'alicloud');
  fs.writeFileSync(path.join(aliPub, `${icon.id}.svg`), content);
  fs.writeFileSync(path.join(aliPriv, `${icon.id}.svg`), content);
}
console.log(`Generated ${ALI_ICONS.length} Alibaba Cloud service icons.`);

// Provider logos
const doLogo = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="#0069FF">
  <path d="M12.04 0C5.408 0 .04 5.367.04 12c0 4.195 2.158 7.892 5.437 10.043v-4.103c-1.464-1.47-2.37-3.51-2.37-5.94 0-4.52 3.666-8.187 8.187-8.187 4.52 0 8.187 3.666 8.187 8.187 0 4.52-3.666 8.187-8.187 8.187v4.062c6.632 0 12-5.368 12-12s-5.368-12-12-12zm-3.5 17.5h3.5v3.5h-3.5zm-3.5 0h3.5v3.5h-3.5zm7 0h3.5v3.5h-3.5z"/>
</svg>`;

const aliLogo = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="#FF6A00">
  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 4.5h3v4.5h-3zm-6 6h15v3h-15zm3 4.5h9v4.5h-9z"/>
</svg>`;

const logosPub = path.join(rootDir, 'public', 'images', 'provider-logos');
const logosPriv = path.join(rootDir, 'priv', 'static', 'images', 'provider-logos');

fs.mkdirSync(logosPub, { recursive: true });
fs.mkdirSync(logosPriv, { recursive: true });

fs.writeFileSync(path.join(logosPub, 'digitalocean.svg'), doLogo);
fs.writeFileSync(path.join(logosPriv, 'digitalocean.svg'), doLogo);
fs.writeFileSync(path.join(logosPub, 'alicloud.svg'), aliLogo);
fs.writeFileSync(path.join(logosPriv, 'alicloud.svg'), aliLogo);

console.log('Provider logos written successfully!');
