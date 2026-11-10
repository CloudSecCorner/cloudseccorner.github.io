import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const vultrPub = path.join(rootDir, 'public', 'images', 'vultr-icons');
const vultrPriv = path.join(rootDir, 'priv', 'static', 'images', 'vultr-icons');
const oraclePub = path.join(rootDir, 'public', 'images', 'oracle-icons');
const oraclePriv = path.join(rootDir, 'priv', 'static', 'images', 'oracle-icons');

for (const dir of [vultrPub, vultrPriv, oraclePub, oraclePriv]) {
  fs.mkdirSync(dir, { recursive: true });
}

const VULTR_ICONS = [
  { id: 'vultr-storage', title: 'Vultr Object Storage', colors: ['#007BFC', '#0056B3'], svg: '<path d="M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4zM2 2v18a2 2 0 002 2h16a2 2 0 002-2V2a2 2 0 00-2-2H4a2 2 0 00-2 2z"/>' },
  { id: 'vultr-iam', title: 'Vultr Subaccounts & IAM', colors: ['#007BFC', '#142149'], svg: '<path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z"/>' },
  { id: 'vultr-vpc', title: 'Vultr VPC 2.0', colors: ['#00A3FF', '#007BFC'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'vultr-instance', title: 'Vultr Cloud Compute', colors: ['#007BFC', '#00438A'], svg: '<path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>' },
  { id: 'vultr-kubernetes', title: 'Vultr Kubernetes Engine (VKE)', colors: ['#326CE5', '#007BFC'], svg: '<path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.24L18.66 8 12 11.76 5.34 8 12 4.24zM4.8 9.38l6.4 3.66v6.92L4.8 16.3V9.38zm8 10.58v-6.92l6.4-3.66v6.92l-6.4 3.66z"/>' },
  { id: 'vultr-database', title: 'Vultr Managed Database', colors: ['#0284C7', '#0369A1'], svg: '<path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm8 6c0 .66-3.58 2-8 2s-8-1.34-8-2V8.26C5.55 9.33 8.58 10 12 10s6.45-.67 8-1.74V10zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V14zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V18z"/>' },
  { id: 'vultr-firewall', title: 'Vultr Firewall Groups', colors: ['#DC2626', '#007BFC'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>' },
  { id: 'vultr-loadbalancer', title: 'Vultr Load Balancer', colors: ['#007BFC', '#0D9488'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'vultr-dns', title: 'Vultr Anycast DNS', colors: ['#0284C7', '#007BFC'], svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' },
  { id: 'vultr-backup', title: 'Vultr Snapshots & Backup', colors: ['#0D9488', '#007BFC'], svg: '<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>' },
  { id: 'vultr-logging', title: 'Vultr Audit Logs', colors: ['#475569', '#142149'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>' },
  { id: 'vultr-monitoring', title: 'Vultr Telemetry & Health', colors: ['#6366F1', '#007BFC'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-6h2v6zm4 0h-2v-10h2v10zm-8 0H6v-3h2v3z"/>' },
  { id: 'vultr-security', title: 'Vultr DDoS & Protection', colors: ['#2563EB', '#1D4ED8'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a4 4 0 110 8 4 4 0 010-8zm-5 13.5c.8-1.8 3.1-3 5-3s4.2 1.2 5 3a9.9 9.9 0 01-10 0z"/>' },
  { id: 'vultr-keys', title: 'Vultr API & SSH Keys', colors: ['#8B5CF6', '#007BFC'], svg: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>' },
  { id: 'vultr-block-storage', title: 'Vultr NVMe Block Storage', colors: ['#0284C7', '#1E40AF'], svg: '<path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4zm4-7a1 1 0 100-2 1 1 0 000 2zm0 10a1 1 0 100-2 1 1 0 000 2z"/>' },
  { id: 'vultr-container-registry', title: 'Vultr Container Registry', colors: ['#007BFC', '#0369A1'], svg: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>' },
  { id: 'vultr-edge-compute', title: 'Vultr Bare Metal Edge', colors: ['#0056B3', '#002B5C'], svg: '<path d="M4 2h16a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm2 4v4h12V6H6zm0 8v4h12v-4H6z"/>' },
  { id: 'vultr-redis', title: 'Vultr Managed Redis', colors: ['#DC2626', '#991B1B'], svg: '<path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 16l10 5 10-5-10-5z"/>' },
  { id: 'vultr-kafka', title: 'Vultr Managed Kafka', colors: ['#0F172A', '#007BFC'], svg: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5v-9l6 4.5-6 4.5z"/>' },
  { id: 'vultr-direct-connect', title: 'Vultr Direct Connect', colors: ['#0D9488', '#0056B3'], svg: '<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM7 7l-5 5 5 5 1.41-1.41L5.83 13H16v-2H5.83l2.58-2.59L7 7z"/>' },
  { id: 'vultr-waf', title: 'Vultr Cloud WAF', colors: ['#EF4444', '#B91C1C'], svg: '<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>' },
  { id: 'vultr-serverless', title: 'Vultr Cloud Inference', colors: ['#6366F1', '#4338CA'], svg: '<path d="M7 2v11h3v9l7-12h-4l4-8H7z"/>' },
  { id: 'vultr-compliance', title: 'Vultr Security Posture', colors: ['#059669', '#047857'], svg: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>' },
  { id: 'vultr-dr', title: 'Vultr Disaster Recovery', colors: ['#D97706', '#B45309'], svg: '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>' }
];

const ORACLE_ICONS = [
  { id: 'oci-storage', title: 'OCI Object Storage', colors: ['#EA1B22', '#C74634'], svg: '<path d="M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4zM2 2v18a2 2 0 002 2h16a2 2 0 002-2V2a2 2 0 00-2-2H4a2 2 0 00-2 2z"/>' },
  { id: 'oci-iam', title: 'OCI Identity & Domains', colors: ['#EA1B22', '#1E293B'], svg: '<path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z"/>' },
  { id: 'oci-vcn', title: 'OCI Virtual Cloud Network (VCN)', colors: ['#EA1B22', '#F97316'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'oci-compute', title: 'OCI Compute & Bare Metal', colors: ['#EA1B22', '#7F1D1D'], svg: '<path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>' },
  { id: 'oci-oke', title: 'Oracle Container Engine for K8s (OKE)', colors: ['#326CE5', '#EA1B22'], svg: '<path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.24L18.66 8 12 11.76 5.34 8 12 4.24zM4.8 9.38l6.4 3.66v6.92L4.8 16.3V9.38zm8 10.58v-6.92l6.4-3.66v6.92l-6.4 3.66z"/>' },
  { id: 'oci-database', title: 'OCI Autonomous Database', colors: ['#B91C1C', '#EA1B22'], svg: '<path d="M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 2s-3.58 2-8 2-8-1.34-8-2 3.58-2 8-2zm8 6c0 .66-3.58 2-8 2s-8-1.34-8-2V8.26C5.55 9.33 8.58 10 12 10s6.45-.67 8-1.74V10zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V14zm0 4c0 .66-3.58 2-8 2s-8-1.34-8-2v-1.74c1.55 1.07 4.58 1.74 8 1.74s6.45-.67 8-1.74V18z"/>' },
  { id: 'oci-nosql', title: 'OCI NoSQL Database', colors: ['#991B1B', '#C74634'], svg: '<path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm12 0a4 4 0 11-4 4 4 4 0 014-4zm0 2a2 2 0 102 2 2 2 0 00-2-2z"/>' },
  { id: 'oci-functions', title: 'OCI Functions & API Gateway', colors: ['#EA1B22', '#F97316'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3l4 4h-3v4h-2v-4H8l4-4zm6 12H6v-2h12v2z"/>' },
  { id: 'oci-waf', title: 'OCI Web Application Firewall (WAF)', colors: ['#DC2626', '#EA1B22'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>' },
  { id: 'oci-loadbalancer', title: 'OCI Flexible Load Balancer', colors: ['#EA1B22', '#3B82F6'], svg: '<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>' },
  { id: 'oci-kms', title: 'OCI Vault & Key Management', colors: ['#831843', '#EA1B22'], svg: '<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>' },
  { id: 'oci-audit', title: 'OCI Audit Service', colors: ['#1F2937', '#EA1B22'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>' },
  { id: 'oci-cloudguard', title: 'OCI Cloud Guard', colors: ['#EA1B22', '#059669'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a4 4 0 110 8 4 4 0 010-8zm-5 13.5c.8-1.8 3.1-3 5-3s4.2 1.2 5 3a9.9 9.9 0 01-10 0z"/>' },
  { id: 'oci-backup', title: 'OCI Block Volume Backup', colors: ['#D97706', '#EA1B22'], svg: '<path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>' },
  { id: 'oci-dns', title: 'OCI Traffic Management DNS', colors: ['#EA1B22', '#0284C7'], svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>' },
  { id: 'oci-logging', title: 'OCI Centralized Logging', colors: ['#334155', '#EA1B22'], svg: '<path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>' },
  { id: 'oci-monitoring', title: 'OCI Monitoring & Alarms', colors: ['#6366F1', '#EA1B22'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-6h2v6zm4 0h-2v-10h2v10zm-8 0H6v-3h2v3z"/>' },
  { id: 'oci-vulnerability', title: 'OCI Vulnerability Scanning', colors: ['#EF4444', '#7F1D1D'], svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>' },
  { id: 'oci-streaming', title: 'OCI Streaming Service', colors: ['#EA1B22', '#8B5CF6'], svg: '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.5v-9l6 4.5-6 4.5z"/>' },
  { id: 'oci-fastconnect', title: 'OCI FastConnect & DRG', colors: ['#0D9488', '#EA1B22'], svg: '<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM7 7l-5 5 5 5 1.41-1.41L5.83 13H16v-2H5.83l2.58-2.59L7 7z"/>' },
  { id: 'oci-bastion', title: 'OCI Bastion Service', colors: ['#475569', '#EA1B22'], svg: '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.66 0 3 1.34 3 3 0 1.31-.83 2.42-2 2.83V16h-2v-3.17c-1.17-.41-2-1.52-2-2.83 0-1.66 1.34-3 3-3z"/>' },
  { id: 'oci-devops', title: 'OCI DevOps & Registry (OCIR)', colors: ['#0284C7', '#EA1B22'], svg: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>' },
  { id: 'oci-ai', title: 'OCI Generative AI Service', colors: ['#7C3AED', '#EA1B22'], svg: '<path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 16l10 5 10-5-10-5z"/>' },
  { id: 'oci-governance', title: 'OCI Compartments & Tagging', colors: ['#059669', '#EA1B22'], svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>' }
];

function generateIcons(icons, prefix, pubDir, privDir) {
  for (const icon of icons) {
    const content = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <title>${icon.title}</title>
  <defs>
    <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="${prefix}-${icon.id}-grad">
      <stop stop-color="${icon.colors[0]}" offset="0%"></stop>
      <stop stop-color="${icon.colors[1]}" offset="100%"></stop>
    </linearGradient>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <rect fill="url(#${prefix}-${icon.id}-grad)" x="0" y="0" width="40" height="40" rx="8"></rect>
    <g transform="translate(8, 8)" fill="#FFFFFF">
      ${icon.svg}
    </g>
  </g>
</svg>
`;
    fs.writeFileSync(path.join(pubDir, `${icon.id}.svg`), content, 'utf8');
    fs.writeFileSync(path.join(privDir, `${icon.id}.svg`), content, 'utf8');
  }
}

generateIcons(VULTR_ICONS, 'vultr', vultrPub, vultrPriv);
generateIcons(ORACLE_ICONS, 'oracle', oraclePub, oraclePriv);

console.log(`Successfully generated ${VULTR_ICONS.length} Vultr icons and ${ORACLE_ICONS.length} Oracle icons!`);
