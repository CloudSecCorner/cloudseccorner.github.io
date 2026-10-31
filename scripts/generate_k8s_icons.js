import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const privDir = path.join(rootDir, 'priv', 'static', 'images', 'k8s-icons');
const pubDir = path.join(rootDir, 'public', 'images', 'k8s-icons');

fs.mkdirSync(privDir, { recursive: true });
fs.mkdirSync(pubDir, { recursive: true });

// 24 Kubernetes Service / Kind Icons with distinct SVG vectors and authentic K8s palette
const ICONS = [
  {
    id: 'k8s-pod',
    title: 'Kubernetes Pod',
    colors: ['#326CE5', '#1D4ED8'],
    svg: `<path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.24L18.66 8 12 11.76 5.34 8 12 4.24zM4.8 9.38l6.4 3.66v6.92L4.8 16.3V9.38zm8 10.58v-6.92l6.4-3.66v6.92l-6.4 3.66z"/>`
  },
  {
    id: 'k8s-deployment',
    title: 'Kubernetes Deployment',
    colors: ['#2563EB', '#1E40AF'],
    svg: `<path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm12 0a4 4 0 11-4 4 4 4 0 014-4zm0 2a2 2 0 102 2 2 2 0 00-2-2z"/>`
  },
  {
    id: 'k8s-daemonset',
    title: 'Kubernetes DaemonSet',
    colors: ['#4F46E5', '#3730A3'],
    svg: `<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm-1 3v4.59l3.7 2.13.75-1.3-3.2-1.84V8h-1.25z"/>`
  },
  {
    id: 'k8s-statefulset',
    title: 'Kubernetes StatefulSet',
    colors: ['#0284C7', '#0369A1'],
    svg: `<path d="M4 5c0-1.66 3.58-3 8-3s8 1.34 8 3v14c0 1.66-3.58 3-8 3s-8-1.34-8-3V5zm2 0c0 .72 2.39 1.5 6 1.5s6-.78 6-1.5c0-.72-2.39-1.5-6-1.5S6 4.28 6 5zm12 5c0-.4-.5-.9-1.5-1.3-1.1-.4-2.7-.7-4.5-.7s-3.4.3-4.5.7C6.5 9.1 6 9.6 6 10v2c0 .72 2.39 1.5 6 1.5s6-.78 6-1.5v-2zm0 5c0-.4-.5-.9-1.5-1.3-1.1-.4-2.7-.7-4.5-.7s-3.4.3-4.5.7C6.5 14.1 6 14.6 6 15v2c0 .72 2.39 1.5 6 1.5s6-.78 6-1.5v-2z"/>`
  },
  {
    id: 'k8s-job',
    title: 'Kubernetes Job',
    colors: ['#0D9488', '#0F766E'],
    svg: `<path d="M19 4h-3V2H8v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9-1h4v1h-4V3zm9 17H5V6h14v14zm-8.5-3l-3.5-3.5 1.4-1.4 2.1 2.1 5.1-5.1 1.4 1.4L10.5 17z"/>`
  },
  {
    id: 'k8s-cronjob',
    title: 'Kubernetes CronJob',
    colors: ['#059669', '#047857'],
    svg: `<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.1.8-1.3-4.5-2.7V7z"/>`
  },
  {
    id: 'k8s-networkpolicy',
    title: 'Kubernetes NetworkPolicy',
    colors: ['#10B981', '#059669'],
    svg: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4a4 4 0 110 8 4 4 0 010-8zm-5 13.5c.8-1.8 3.1-3 5-3s4.2 1.2 5 3a9.9 9.9 0 01-10 0z"/>`
  },
  {
    id: 'k8s-serviceaccount',
    title: 'Kubernetes ServiceAccount',
    colors: ['#6366F1', '#4338CA'],
    svg: `<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7-8h-3V4h3c1.1 0 2 .9 2 2v4h-2V6zm0 10h2v2c0 1.1-.9 2-2 2h-3v-2h3v-2z"/>`
  },
  {
    id: 'k8s-role',
    title: 'Kubernetes Role & RBAC',
    colors: ['#8B5CF6', '#6D28D9'],
    svg: `<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>`
  },
  {
    id: 'k8s-binding',
    title: 'Kubernetes RoleBinding',
    colors: ['#7C3AED', '#5B21B6'],
    svg: `<path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>`
  },
  {
    id: 'k8s-service',
    title: 'Kubernetes Service',
    colors: ['#3B82F6', '#1D4ED8'],
    svg: `<path d="M12 2a4 4 0 00-4 4c0 1.3.62 2.45 1.58 3.18L7.1 13.6A3.99 3.99 0 004 13a4 4 0 104 4c0-.75-.22-1.46-.58-2.06l2.48-4.42c.63.31 1.34.48 2.1.48s1.47-.17 2.1-.48l2.48 4.42c-.36.6-.58 1.31-.58 2.06a4 4 0 104-4c-.75 0-1.46.22-2.06.58l-2.48-4.42A3.98 3.98 0 0016 6a4 4 0 00-4-4z"/>`
  },
  {
    id: 'k8s-ingress',
    title: 'Kubernetes Ingress',
    colors: ['#0284C7', '#075985'],
    svg: `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3l4 4h-3v4h-2v-4H8l4-4zm6 12H6v-2h12v2z"/>`
  },
  {
    id: 'k8s-secret',
    title: 'Kubernetes Secret',
    colors: ['#E11D48', '#BE123C'],
    svg: `<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>`
  },
  {
    id: 'k8s-configmap',
    title: 'Kubernetes ConfigMap',
    colors: ['#D97706', '#B45309'],
    svg: `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>`
  },
  {
    id: 'k8s-pvc',
    title: 'Kubernetes PVC & Storage',
    colors: ['#EA580C', '#C2410C'],
    svg: `<path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3v-3h2v3h3v2z"/>`
  },
  {
    id: 'k8s-pdb',
    title: 'PodDisruptionBudget',
    colors: ['#F59E0B', '#D97706'],
    svg: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`
  },
  {
    id: 'k8s-quota',
    title: 'ResourceQuota & LimitRange',
    colors: ['#ca8a04', '#a16207'],
    svg: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-12h-2v5l4.25 2.52.77-1.28-3.52-2.09V8z"/>`
  },
  {
    id: 'k8s-webhook',
    title: 'Admission Webhook',
    colors: ['#9333EA', '#7E22CE'],
    svg: `<path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.88 9h-3.76L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM6.5 13C4.01 13 2 15.01 2 17.5S4.01 22 6.5 22 11 19.99 11 17.5 8.99 13 6.5 13zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`
  },
  {
    id: 'k8s-node',
    title: 'Kubernetes Node & Kubelet',
    colors: ['#0891B2', '#0E7490'],
    svg: `<path d="M4 3h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2zm0 10h16a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2zm2-7v2h2V6H6zm0 10v2h2v-2H6zm10-10v2h2V6h-2zm0 10v2h2v-2h-2z"/>`
  },
  {
    id: 'k8s-apiserver',
    title: 'Kube-APIServer Control Plane',
    colors: ['#2563EB', '#1D4ED8'],
    svg: `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`
  },
  {
    id: 'k8s-psa',
    title: 'Pod Security Standards (PSA)',
    colors: ['#059669', '#047857'],
    svg: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>`
  },
  {
    id: 'k8s-ebpf',
    title: 'Cilium & eBPF Security',
    colors: ['#06B6D4', '#0891B2'],
    svg: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>`
  },
  {
    id: 'k8s-falco',
    title: 'Falco Runtime Security',
    colors: ['#E11D48', '#9F1239'],
    svg: `<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3c3.87 0 7 3.13 7 7 0 1.93-.78 3.68-2.05 4.95L12 12V5zm-7 7c0-3.87 3.13-7 7-7v7l-4.95 4.95A6.96 6.96 0 015 12z"/>`
  },
  {
    id: 'k8s-gateway',
    title: 'Kubernetes Gateway API',
    colors: ['#3B82F6', '#1E40AF'],
    svg: `<path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-7 2a3 3 0 110 6 3 3 0 010-6zm7 12H5v-1c0-2.33 4.67-3.5 7-3.5s7 1.17 7 3.5v1z"/>`
  }
];

for (const icon of ICONS) {
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="40px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <title>${icon.title}</title>
  <defs>
    <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="k8s-${icon.id}-grad">
      <stop stop-color="${icon.colors[0]}" offset="0%"></stop>
      <stop stop-color="${icon.colors[1]}" offset="100%"></stop>
    </linearGradient>
  </defs>
  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <rect fill="url(#k8s-${icon.id}-grad)" x="0" y="0" width="40" height="40" rx="8"></rect>
    <g transform="translate(8, 8)" fill="#FFFFFF">
      ${icon.svg}
    </g>
  </g>
</svg>
`;

  fs.writeFileSync(path.join(privDir, `${icon.id}.svg`), svgContent, 'utf8');
  fs.writeFileSync(path.join(pubDir, `${icon.id}.svg`), svgContent, 'utf8');
}

console.log(`Successfully generated ${ICONS.length} official Kubernetes SVG icons in priv and public!`);
