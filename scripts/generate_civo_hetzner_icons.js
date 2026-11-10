import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const civoPub = path.join(rootDir, 'public', 'images', 'civo-icons');
const civoPriv = path.join(rootDir, 'priv', 'static', 'images', 'civo-icons');
const htzPub = path.join(rootDir, 'public', 'images', 'hetzner-icons');
const htzPriv = path.join(rootDir, 'priv', 'static', 'images', 'hetzner-icons');

for (const dir of [civoPub, civoPriv, htzPub, htzPriv]) {
  fs.mkdirSync(dir, { recursive: true });
}

// 24 Civo Icons
const CIVO_ICONS = [
  { id: 'civo-k3s', title: 'Civo Managed Kubernetes (K3s)', colors: ['#2293EE', '#0C5999'], svg: '<path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.24L18.66 8 12 11.76 5.34 8 12 4.24zM4.8 9.38l6.4 3.66v6.92L4.8 16.3V9.38zm8 10.58v-6.92l6.4-3.66v6.92l-6.4 3.66z"/>' },
  { id: 'civo-instances', title: 'Civo Compute Instances', colors: ['#2293EE', '#0284C7'], svg: '<path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>' },
  { id: 'civo-gpu', title: 'Civo GPU & Deep Learning Clusters', colors: ['#8B5CF6', '#2293EE'], svg: '<path d="M12 2a10 10 0 00-7.07 17.07l1.41-1.41A8 8 0 1112 20v2a10 10 0 000-20zm1 5h-2v6h6v-2h-4V7z"/>' },
  { id: 'civo-object-storage', title: 'Civo Object Storage', colors: ['#2293EE', '#0D9488'], svg: '<path d="M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4zM2 2v18a2 2 0 002 2h16a2 2 0 002-2V2a2 2 0 00-2-2H4a2 2 0 00-2 2z"/>' },
  { id: 'civo-volumes', title: 'Civo Block Storage Volumes', colors: ['#0284C7', '#1E40AF'], svg: '<path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm4-7a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z"/>' },
  { id: 'civo-network', title: 'Civo Private Networks & VPC', colors: ['#38BDF8', '#2293EE'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'civo-firewall', title: 'Civo Cloud Firewalls', colors: ['#DC2626', '#2293EE'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>' },
  { id: 'civo-loadbalancer', title: 'Civo Load Balancers', colors: ['#2293EE', '#14B8A6'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'civo-database', title: 'Civo Managed Databases', colors: ['#0284C7', '#0369A1'], svg: '<path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm8 6c0 .66-3.58 2-8 2s-8-1.34-8-2V8.26C5.55 9.33 8.58 10 12 10s6.45-.67 8-1.74V10zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V14zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V18z"/>' },
  { id: 'civo-registry', title: 'Civo Container Registry', colors: ['#2293EE', '#6366F1'], svg: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>' },
  { id: 'civo-dns', title: 'Civo Cloud DNS', colors: ['#0284C7', '#2293EE'], svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' },
  { id: 'civo-iam', title: 'Civo Teams & API Keys', colors: ['#2293EE', '#0F172A'], svg: '<path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z"/>' },
  { id: 'civo-audit', title: 'Civo Audit Logs & Webhooks', colors: ['#475569', '#1E293B'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>' },
  { id: 'civo-marketplace', title: 'Civo Kubernetes Marketplace', colors: ['#10B981', '#2293EE'], svg: '<path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/>' },
  { id: 'civo-events', title: 'Civo Events & Automation', colors: ['#F59E0B', '#D97706'], svg: '<path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.05.5-9 4.77-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.01-4.09l-2.45-1.45C16.3 17.84 14.28 19 12 19z"/>' },
  { id: 'civo-keys', title: 'Civo SSH Keys & Encryption', colors: ['#8B5CF6', '#2293EE'], svg: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>' },
  { id: 'civo-autoscaling', title: 'Civo Node Auto-scaling', colors: ['#2293EE', '#2563EB'], svg: '<path d="M19 12h-2v3h-3v2h5v-5zM7 9h3V7H5v5h2V9zm14-6H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.99h18v14.02z"/>' },
  { id: 'civo-backup', title: 'Civo Cluster & Volume Backups', colors: ['#0D9488', '#2293EE'], svg: '<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>' },
  { id: 'civo-monitoring', title: 'Civo Metrics & Telemetry', colors: ['#6366F1', '#2293EE'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-6h2v6zm4 0h-2v-10h2v10zm-8 0H6v-3h2v3z"/>' },
  { id: 'civo-security', title: 'Civo Security Guardrails', colors: ['#2563EB', '#1D4ED8'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a4 4 0 110 8 4 4 0 010-8zm-5 13.5c.8-1.8 3.1-3 5-3s4.2 1.2 5 3a9.9 9.9 0 01-10 0z"/>' },
  { id: 'civo-kafka', title: 'Civo Event Streams & Kafka', colors: ['#0F172A', '#2293EE'], svg: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5v-9l6 4.5-6 4.5z"/>' },
  { id: 'civo-redis', title: 'Civo In-Memory Cache (Redis)', colors: ['#DC2626', '#991B1B'], svg: '<path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 16l10 5 10-5-10-5z"/>' },
  { id: 'civo-deep-lake', title: 'Civo Deep Lake AI Data Lake', colors: ['#6366F1', '#4F46E5'], svg: '<path d="M12 2L1 21h22L12 2zm0 3.84L19.53 19H4.47L12 5.84zM11 10h2v4h-2zm0 6h2v2h-2z"/>' },
  { id: 'civo-compliance', title: 'Civo Compliance & CIS Controls', colors: ['#059669', '#047857'], svg: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>' }
];

// 24 Hetzner Icons
const HTZ_ICONS = [
  { id: 'hetzner-server', title: 'Hetzner Cloud Servers (CX/CPX/CAX)', colors: ['#D50C2D', '#99001A'], svg: '<path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>' },
  { id: 'hetzner-network', title: 'Hetzner Cloud Networks & Private IP', colors: ['#D50C2D', '#FF3B5C'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'hetzner-firewall', title: 'Hetzner Cloud Firewalls', colors: ['#D50C2D', '#111827'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>' },
  { id: 'hetzner-volume', title: 'Hetzner NVMe Block Storage Volumes', colors: ['#0284C7', '#D50C2D'], svg: '<path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm4-7a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z"/>' },
  { id: 'hetzner-loadbalancer', title: 'Hetzner Load Balancers', colors: ['#D50C2D', '#14B8A6'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'hetzner-floating-ip', title: 'Hetzner Floating IPs', colors: ['#0284C7', '#D50C2D'], svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' },
  { id: 'hetzner-primary-ip', title: 'Hetzner Primary Static IPs', colors: ['#3B82F6', '#1E40AF'], svg: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5v-9l6 4.5-6 4.5z"/>' },
  { id: 'hetzner-ssh-key', title: 'Hetzner SSH Keys & Access', colors: ['#8B5CF6', '#D50C2D'], svg: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>' },
  { id: 'hetzner-certificate', title: 'Hetzner TLS Certificates', colors: ['#10B981', '#047857'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>' },
  { id: 'hetzner-placement-group', title: 'Hetzner Placement Groups', colors: ['#6366F1', '#4F46E5'], svg: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>' },
  { id: 'hetzner-snapshot', title: 'Hetzner Snapshots & Imaging', colors: ['#D50C2D', '#7C3AED'], svg: '<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>' },
  { id: 'hetzner-backup', title: 'Hetzner Automated Backups', colors: ['#0D9488', '#D50C2D'], svg: '<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>' },
  { id: 'hetzner-dns', title: 'Hetzner DNS Console & API', colors: ['#0284C7', '#D50C2D'], svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' },
  { id: 'hetzner-robot', title: 'Hetzner Robot Bare Metal Dedis', colors: ['#111827', '#D50C2D'], svg: '<path d="M12 2a2 2 0 012 2v2h4a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4V4a2 2 0 012-2zm-4 8a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"/>' },
  { id: 'hetzner-vswitch', title: 'Hetzner vSwitch Cloud Interconnect', colors: ['#D50C2D', '#F59E0B'], svg: '<path d="M4 6h16v12H4zM2 4v16h20V4H2zm4 4h2v2H6zm0 4h2v2H6zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"/>' },
  { id: 'hetzner-storagebox', title: 'Hetzner Storage Box (SFTP/WebDAV)', colors: ['#D50C2D', '#0369A1'], svg: '<path d="M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4zM2 2v18a2 2 0 002 2h16a2 2 0 002-2V2a2 2 0 00-2-2H4a2 2 0 00-2 2z"/>' },
  { id: 'hetzner-iam', title: 'Hetzner API Tokens & RBAC', colors: ['#D50C2D', '#111827'], svg: '<path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z"/>' },
  { id: 'hetzner-audit', title: 'Hetzner Audit Trail & Action Logs', colors: ['#475569', '#1E293B'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>' },
  { id: 'hetzner-metrics', title: 'Hetzner Cloud Metrics & Graphing', colors: ['#6366F1', '#D50C2D'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-6h2v6zm4 0h-2v-10h2v10zm-8 0H6v-3h2v3z"/>' },
  { id: 'hetzner-security', title: 'Hetzner Security Hardening', colors: ['#2563EB', '#D50C2D'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a4 4 0 110 8 4 4 0 010-8zm-5 13.5c.8-1.8 3.1-3 5-3s4.2 1.2 5 3a9.9 9.9 0 01-10 0z"/>' },
  { id: 'hetzner-ddos', title: 'Hetzner Automated DDoS Protection', colors: ['#DC2626', '#991B1B'], svg: '<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>' },
  { id: 'hetzner-k8s', title: 'Hetzner Kubernetes (hcloud-k8s)', colors: ['#326CE5', '#D50C2D'], svg: '<path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.24L18.66 8 12 11.76 5.34 8 12 4.24zM4.8 9.38l6.4 3.66v6.92L4.8 16.3V9.38zm8 10.58v-6.92l6.4-3.66v6.92l-6.4 3.66z"/>' },
  { id: 'hetzner-cloud-init', title: 'Hetzner Cloud-Init & User-Data', colors: ['#F59E0B', '#D50C2D'], svg: '<path d="M7 2v11h3v9l7-12h-4l4-8H7z"/>' },
  { id: 'hetzner-compliance', title: 'Hetzner ISO/IEC 27001 Compliance', colors: ['#059669', '#047857'], svg: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>' }
];

function generateSvgIcon(item, provider) {
  const [c1, c2] = item.colors;
  return `<svg viewBox="0 0 48 48" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${item.id}-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}" />
      <stop offset="100%" stop-color="${c2}" />
    </linearGradient>
  </defs>
  <rect width="48" height="48" rx="10" fill="url(#${item.id}-grad)"/>
  <g transform="translate(12, 12)" fill="#FFFFFF">
    ${item.svg}
  </g>
</svg>`;
}

// Generate Civo service icons
for (const icon of CIVO_ICONS) {
  const content = generateSvgIcon(icon, 'civo');
  fs.writeFileSync(path.join(civoPub, `${icon.id}.svg`), content);
  fs.writeFileSync(path.join(civoPriv, `${icon.id}.svg`), content);
}
console.log(`Generated ${CIVO_ICONS.length} Civo service icons.`);

// Generate Hetzner service icons
for (const icon of HTZ_ICONS) {
  const content = generateSvgIcon(icon, 'hetzner');
  fs.writeFileSync(path.join(htzPub, `${icon.id}.svg`), content);
  fs.writeFileSync(path.join(htzPriv, `${icon.id}.svg`), content);
}
console.log(`Generated ${HTZ_ICONS.length} Hetzner service icons.`);

// Provider logos
const civoLogo = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="#2293EE">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
</svg>`;

const htzLogo = `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="#D50C2D">
  <path d="M2 3h4.5v7.5h11V3H22v18h-4.5v-7.5h-11V21H2V3z"/>
</svg>`;

const logosPub = path.join(rootDir, 'public', 'images', 'provider-logos');
const logosPriv = path.join(rootDir, 'priv', 'static', 'images', 'provider-logos');

fs.mkdirSync(logosPub, { recursive: true });
fs.mkdirSync(logosPriv, { recursive: true });

fs.writeFileSync(path.join(logosPub, 'civo.svg'), civoLogo);
fs.writeFileSync(path.join(logosPriv, 'civo.svg'), civoLogo);
fs.writeFileSync(path.join(logosPub, 'hetzner.svg'), htzLogo);
fs.writeFileSync(path.join(logosPriv, 'hetzner.svg'), htzLogo);

console.log('Provider logos written successfully!');
