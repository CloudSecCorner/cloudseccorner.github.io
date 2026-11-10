import { render } from 'pele';
import { createIconResolver } from './diagram-icons.mjs';
import { buildDeveloperArchitecture } from './developer-architectures.mjs';

export const DIAGRAM_REVISION = '2026-11-06-developer';
const providers = {
  aws: { name: 'AWS', identity: 'iam-access', audit: 'logging-cloudtrail', authorization: 'IAM authorization for this action', evidence: 'Supported CloudTrail management events', sources: ['https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html', 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-management-events-with-cloudtrail.html'] },
  azure: { name: 'Azure', identity: 'azure-ad', audit: 'azure-activity-log', authorization: 'Microsoft Entra identity and applicable roles', evidence: 'Activity Log or supported diagnostic logs', sources: ['https://learn.microsoft.com/en-us/azure/role-based-access-control/overview', 'https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log'] },
  gcp: { name: 'Google Cloud', identity: 'gcp-iam', audit: 'gcp-logging', authorization: 'Applicable IAM and organization controls', evidence: 'Supported Cloud Audit Logs', sources: ['https://cloud.google.com/iam/docs/overview', 'https://cloud.google.com/logging/docs/audit'] },
  kspm: { name: 'Kubernetes', identity: 'k8s-role', audit: 'k8s-apiserver', authorization: 'RBAC for the requested resource and verb', evidence: 'API readback and configured audit events', sources: ['https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/', 'https://kubernetes.io/docs/concepts/security/security-checklist/'] },
  container: { name: 'Container', identity: 'container-cosign', audit: 'container-sbom', authorization: 'Authorized build or runtime operator', evidence: 'Digest-linked build and runtime evidence', sources: ['https://docs.sigstore.dev/cosign/verifying/verify/', 'https://docs.docker.com/engine/security/'] },
  vultr: { name: 'Vultr', identity: 'vultr-iam', audit: 'vultr-logging', authorization: 'Vultr API key or subaccount permissions', evidence: 'Vultr system audit logs and resource readback', sources: ['https://www.vultr.com/docs/security/', 'https://www.vultr.com/api/'] },
  oracle: { name: 'Oracle Cloud', identity: 'oci-iam', audit: 'oci-audit', authorization: 'OCI IAM policy and compartment authorization', evidence: 'Supported OCI Audit events and Cloud Guard problems', sources: ['https://docs.oracle.com/en-us/iaas/Content/Identity/Concepts/overview.htm', 'https://docs.oracle.com/en-us/iaas/Content/Audit/Concepts/auditoverview.htm'] }
};

const requirements = [
  { match: /tls|https|mtls|transport/i, check: 'Test protocol negotiation and certificate trust', caution: 'Transport encryption, identity validation, and authorization are separate checks. A SecureTransport condition alone does not set a minimum TLS version.', source: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/amazon-s3-policy-keys.html' },
  { match: /kms|cmk|encryp|key vault|hsm/i, check: 'Verify key identity and permitted encrypt or decrypt operations', caution: 'Check service support, key location, key policy, and the service identity. Encryption at rest does not prevent an authorized data read.', source: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html' },
  { match: /backup|retention|worm|replica|failover|pitr|versioning|recovery|availability/i, check: 'Perform restore or failover verification with recorded recovery targets', caution: 'Replication, versioning, retention lock, and backup recovery provide different guarantees. Select supported settings and test recovery before relying on them.' },
  { match: /network|firewall|private|public|ingress|egress|cidr|vpc|vnet|endpoint|dns|subnet/i, check: 'Test an allowed source and a denied source against the actual endpoint', caution: 'Identity, network reachability, and application permissions are independent. Private networking and DNS require explicit service-specific configuration.' },
  { match: /log|audit|monitor|detect|falco|alert|siem|finding/i, check: 'Generate a known event and verify delivery to the configured destination', caution: 'Telemetry requires enabled sources, access permissions, retention, and a tested delivery path. A detection or alert does not automatically remediate a resource.' },
  { match: /image|signature|sbom|registry|cosign|supply|scanning|binary/i, check: 'Verify artifact digest, trusted signer identity, and relevant attestations', caution: 'An image signature establishes provenance only under the configured trust policy. Scan results, deployment admission, and runtime restrictions remain separate controls.', source: 'https://docs.sigstore.dev/cosign/verifying/verify/' },
  { match: /iam|identity|role|rbac|token|credential|mfa|account|permission|principal|root/i, check: 'Test the intended principal and a principal outside the allowed scope', caution: 'Evaluate effective permissions, inherited grants, explicit denies, and credential lifetime. A policy attachment alone does not establish least privilege.' }
];

export function normalizeDiagramTitle(title) {
  return title
    .replace('Enforce TLS 1.2+ Transport Encryption via aws:SecureTransport', 'Deny unencrypted S3 requests with aws:SecureTransport')
    .replace('Enable S3 Versioning and MFA Delete Protection', 'Enable S3 versioning; configure MFA Delete separately')
    .replace('Enforce Origin Access Control (OAC) with SigV4 for S3 and ALB Origins', 'Use CloudFront Origin Access Control for supported S3 origins');
}

function inferProvider(entry, fallback) {
  if (entry.category.startsWith('azure-')) return 'azure';
  if (entry.category.startsWith('gcp-')) return 'gcp';
  if (entry.category.startsWith('k8s-')) return 'kspm';
  if (entry.category.startsWith('vultr-')) return 'vultr';
  if (entry.category.startsWith('oci-') || entry.category.startsWith('oracle-')) return 'oracle';
  if (entry.category.startsWith('container-') && !['container-eks', 'container-ecs'].includes(entry.category)) return 'container';
  return fallback === 'cnapp' ? 'aws' : fallback;
}

const quote = text => JSON.stringify(text.replace(/[\r\n]+/g, ' ').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
const iconNode = (id, icon, text) => `${id}@{ icon: "logos:${icon}", label: ${quote(text)}, h: 64, pos: "b" }`;

export function refreshDiagramEntry(provider, entry) {
  const platform = inferProvider(entry, provider);
  const context = providers[platform];
  const title = normalizeDiagramTitle(entry.title);
  const control = title.replace(/ \(Tier-.*$/, '');
  const requirement = requirements.find(candidate => candidate.match.test(control)) || { check: 'Read back the effective setting and exercise its rejection path', caution: 'Verify resource scope, service support, and the actual policy effect before deployment.' };
  const service = entry.service;
  const icon = entry.icon_url.split('/').pop().replace(/\.svg$/, '');
  const hostConfig = platform === 'kspm' && /node|apiserver|kubelet|etcd|falco|ebpf|audit/.test(entry.category);
  const applyLabel = platform === 'kspm'
    ? (hostConfig ? 'Apply component configuration through its supported interface' : 'API authentication, authorization, then applicable admission')
    : (platform === 'container' ? 'Apply approved build or runtime configuration' : 'Apply through the supported service management API');
  const mermaid = `flowchart TB
    subgraph proposal[${quote(`${context.name}: proposed control change`)}]
      change[${quote(`Proposed configuration for ${service}`)}]
      requirement[${quote(control)}]
      ${iconNode('identity', context.identity, context.authorization)}
      change --> requirement
      identity -.->|Required permissions| change
    end
    subgraph validation["Review and pre-deployment validation"]
      check{${quote('Service-specific checks pass?')}}
      reject["Revise configuration; no change applied"]
      review[${quote(`Owner review: ${entry.id}`)}]
      requirement --> check
      check -->|No or unknown| reject
      check -->|Yes| review
    end
    subgraph target[${quote(`${context.name}: resource administration`)}]
      ${iconNode('resource', icon, service)}
      review -->|${applyLabel}| resource
    end
    subgraph verification["Readback and operational evidence"]
      verify[${quote(requirement.check)}]
      ${iconNode('evidence', context.audit, context.evidence)}
      outcome{${quote('Observed behavior matches control?')}}
      followup["Investigate drift or missing enforcement"]
      accepted["Record resource scope, result, and evidence"]
      resource -->|Read effective configuration| verify
      resource -.->|Separate audit or evidence path| evidence
      verify --> outcome
      outcome -->|No or unknown| followup
      outcome -->|Yes| accepted
      evidence -.->|Correlate with test results| accepted
    end`;
  const sources = [...context.sources];
  if (requirement.source && (platform === 'aws' || !requirement.source.includes('amazon.com'))) sources.push(requirement.source);
  if (platform === 'kspm' && /network/.test(entry.category)) sources.push('https://kubernetes.io/docs/concepts/services-networking/network-policies/');
  const developer = buildDeveloperArchitecture(platform, { ...entry, title });
  const description = `${developer.guide.name} for ${service}. Integration contract: ${developer.guide.contract}. Control: ${control}.`;
  return {
    ...entry, title, description,
    mermaid: developer.mermaid,
    svg: render(developer.mermaid, { icons: createIconResolver(provider) }).svg,
    deployment_mermaid: mermaid,
    deployment_svg: render(mermaid, { icons: createIconResolver(provider) }).svg,
    developer_guide: developer.guide,
    ...(provider === 'cnapp' ? { provider: platform === 'kspm' ? 'Kubernetes' : context.name === 'Google Cloud' ? 'GCP' : context.name } : {}),
    diagram_revision: DIAGRAM_REVISION,
    diagram_details: {
      scope: 'Control deployment and verification workflow. Companion policy and configuration snippets are illustrative; validate their schema, inputs, and resource coverage before applying them.',
      checks: [requirement.check, requirement.caution, 'Confirm effective permissions and record both successful and rejected test cases.'],
      sources
    }
  };
}

export function refreshDiagramCollection(provider, entries) {
  for (let i = 0; i < entries.length; i++) entries[i] = refreshDiagramEntry(provider, entries[i]);
  return entries;
}
