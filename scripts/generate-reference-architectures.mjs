import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from 'pele';
import { createIconResolver } from './lib/diagram-icons.mjs';
import { refreshDiagramEntry } from './lib/control-diagrams.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const references = {
  aws: {
    category: 'storage-s3', service: 'Amazon S3', icon: 'storage-s3',
    title: 'Reference: TLS-only S3 document bucket',
    description: 'A versioned S3 bucket with all four public access blocks, SSE-S3 encryption, and an explicit deny for non-TLS requests. Identity permissions are prerequisites; this example does not create a private VPC endpoint or a customer-managed KMS key.',
    flow: `flowchart TB
      client@{ icon: "logos:iam-access", label: "Existing IAM principal", h: 64, pos: "b" }
      bucket@{ icon: "logos:storage-s3", label: "Versioned S3 document bucket", h: 64, pos: "b" }
      client[Existing IAM principal] -->|HTTPS and SigV4| auth{IAM allows request?}
      auth -->|Yes| tls{SecureTransport?}
      auth -->|No| denied[Access denied]
      tls -->|No: explicit deny| denied
      tls -->|Yes| bucket[Versioned S3 document bucket]
      public[Anonymous public request] -->|Blocked by public access settings| denied
      bucket -->|Default encryption at rest| encryption[SSE-S3 AES256]
      note[Public service endpoint: not a private network] -.-> bucket`,
    prerequisites: 'Terraform 1.5+, AWS CLI credentials and permissions to create S3 buckets and policies. Supply a globally unique bucket_name. Grant the test identity s3:GetObject/s3:PutObject separately. AWS service principals are excluded from the transport deny to avoid redacted network-context failures.',
    commands: 'terraform init\nterraform fmt -check\nterraform validate\nterraform plan -var="bucket_name=YOUR_UNIQUE_BUCKET" -out=tfplan\nterraform show -json tfplan > tfplan.json\nopa eval --data policy.rego --input tfplan.json "data.reference.aws.allow"\n# After reviewing the plan:\nterraform apply tfplan\naws s3api get-public-access-block --bucket YOUR_UNIQUE_BUCKET\naws s3api get-bucket-versioning --bucket YOUR_UNIQUE_BUCKET\naws s3api get-bucket-encryption --bucket YOUR_UNIQUE_BUCKET\n# Teardown after removing all object versions and delete markers:\nterraform destroy -var="bucket_name=YOUR_UNIQUE_BUCKET"',
    expected: 'All four public-access flags true; versioning Enabled; encryption AES256. Upload a test object with an authorized identity, then confirm anonymous and signed HTTP access are denied. Deletion requires an empty bucket, including versions.',
    sources: ['https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html', 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/amazon-s3-policy-keys.html'],
    checks: { aws_s3_bucket_public_access_block: { block_public_acls: true, block_public_policy: true, ignore_public_acls: true, restrict_public_buckets: true } }
  },
  azure: {
    category: 'azure-blob', service: 'Azure Blob Storage', icon: 'azure-blob',
    title: 'Reference: Azure storage with public networking disabled',
    description: 'Deploys a StorageV2 account with TLS 1.2, HTTPS-only access, Shared Key disabled, and public network access disabled. This is a locked-down baseline: blob data remains unreachable until you separately configure a private endpoint, DNS, network connectivity, and a data-plane RBAC role.',
    flow: `flowchart TB
      account@{ icon: "logos:azure-blob", label: "StorageV2 account", h: 64, pos: "b" }
      identity@{ icon: "logos:azure-ad", label: "Shared Key disabled: Entra identity required", h: 64, pos: "b" }
      arm[Terraform authenticated with Azure] -->|Management plane| account[StorageV2 account]
      internet[Public data-plane request] -->|Public networking disabled| denied[Access denied]
      account -->|Account controls| controls[TLS 1.2 and HTTPS only]
      controls --> identity[Shared Key disabled: Entra identity required]
      future[Private endpoint and DNS: not provisioned] -.-> account
      rbac[Data-plane RBAC: not provisioned] -.-> identity`,
    prerequisites: 'Terraform 1.5+, Azure CLI login, an existing subscription, and resource creation permissions. Supply subscription_id and a globally unique 3-24 character lowercase alphanumeric storage_name. Register Microsoft.Storage first if your identity cannot register providers. LRS is local redundancy, not zone or region disaster recovery.',
    commands: 'az login\nterraform init\nterraform fmt -check\nterraform validate\nterraform plan -var="subscription_id=YOUR_SUBSCRIPTION" -var="storage_name=YOURUNIQUENAME" -out=tfplan\nterraform show -json tfplan > tfplan.json\nopa eval --data policy.rego --input tfplan.json "data.reference.azure.allow"\n# After reviewing the plan:\nterraform apply tfplan\naz storage account show --ids "$(terraform output -raw storage_account_id)" --query "{publicNetworkAccess:publicNetworkAccess,allowSharedKeyAccess:allowSharedKeyAccess,minimumTlsVersion:minimumTlsVersion}"\nterraform destroy -var="subscription_id=YOUR_SUBSCRIPTION" -var="storage_name=YOURUNIQUENAME"',
    expected: 'publicNetworkAccess Disabled, allowSharedKeyAccess false, minimumTlsVersion TLS1_2. Management-plane access remains available; this does not prove private blob access works. Add and test private connectivity before storing application data.',
    sources: ['https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security', 'https://learn.microsoft.com/en-us/azure/storage/common/shared-key-authorization-prevent'],
    checks: { azurerm_storage_account: { public_network_access_enabled: false, shared_access_key_enabled: false, allow_nested_items_to_be_public: false, https_traffic_only_enabled: true, min_tls_version: 'TLS1_2' } }
  },
  gcp: {
    category: 'gcp-gcs', service: 'Cloud Storage', icon: 'gcp-gcs',
    title: 'Reference: IAM-only Cloud Storage bucket',
    description: 'Creates a versioned Cloud Storage bucket with uniform bucket-level access and enforced public access prevention. Existing IAM grants control authenticated requests. Public access prevention does not provide a private endpoint or VPC Service Controls perimeter, and versioning is not retention lock.',
    flow: `flowchart TB
      bucket@{ icon: "logos:gcp-gcs", label: "Versioned Cloud Storage bucket", h: 64, pos: "b" }
      client[Authenticated workload] -->|HTTPS OAuth token| iam{Bucket or inherited IAM permits?}
      iam -->|Yes| bucket[Versioned Cloud Storage bucket]
      iam -->|No| denied[Access denied]
      public[allUsers or allAuthenticatedUsers grant] -->|Public access prevention enforced| denied
      acl[Per-object ACL] -->|Disabled by uniform bucket-level access| disabled[No object ACL authorization]
      bucket --> encryption[Google-managed encryption at rest]
      perimeter[VPC Service Controls: not provisioned] -.-> bucket`,
    prerequisites: 'Terraform 1.5+, gcloud application-default login, an existing project with Cloud Storage available, and storage bucket administration permissions. Supply project_id and a globally unique bucket_name. Bind workload IAM separately. Noncurrent object versions incur storage usage.',
    commands: 'gcloud auth application-default login\nterraform init\nterraform fmt -check\nterraform validate\nterraform plan -var="project_id=YOUR_PROJECT" -var="bucket_name=YOUR_UNIQUE_BUCKET" -out=tfplan\nterraform show -json tfplan > tfplan.json\nopa eval --data policy.rego --input tfplan.json "data.reference.gcp.allow"\n# After reviewing the plan:\nterraform apply tfplan\ngcloud storage buckets describe gs://YOUR_UNIQUE_BUCKET --format=json\n# After removing all object generations:\nterraform destroy -var="project_id=YOUR_PROJECT" -var="bucket_name=YOUR_UNIQUE_BUCKET"',
    expected: 'publicAccessPrevention enforced, uniformBucketLevelAccess enabled, and versioning enabled in the bucket description. Anonymous access fails; authenticated object access requires an appropriate IAM role. Review inherited project roles when testing least privilege.',
    sources: ['https://cloud.google.com/storage/docs/public-access-prevention', 'https://cloud.google.com/storage/docs/uniform-bucket-level-access'],
    checks: { google_storage_bucket: { uniform_bucket_level_access: true, public_access_prevention: 'enforced' } }
  },
  kspm: {
    category: 'k8s-networkpolicy', service: 'Kubernetes NetworkPolicy', icon: 'k8s-networkpolicy',
    title: 'Reference: restricted web workload with default-deny networking',
    description: 'Two non-root web replicas behind a ClusterIP Service. Default-deny networking has explicit egress permission to web pods and ingress permission from same-namespace pods labeled role=client on TCP 8080. NetworkPolicy is enforcement configuration, not a hop between the Service and Pods.',
    flow: `flowchart TB
      client@{ icon: "logos:k8s-pod", label: "Same namespace pod: role client", h: 64, pos: "b" }
      service@{ icon: "logos:k8s-service", label: "ClusterIP Service: web", h: 64, pos: "b" }
      pods@{ icon: "logos:k8s-deployment", label: "Deployment: two web replicas", h: 64, pos: "b" }
      policy@{ icon: "logos:k8s-networkpolicy", label: "Allow role client on TCP 8080", h: 64, pos: "b" }
      egress@{ icon: "logos:k8s-networkpolicy", label: "Namespace egress allow to web TCP 8080", h: 64, pos: "b" }
      deny@{ icon: "logos:k8s-networkpolicy", label: "Default deny ingress and egress", h: 64, pos: "b" }
      untrusted@{ icon: "logos:k8s-pod", label: "Other pod", h: 64, pos: "b" }
      psa@{ icon: "logos:k8s-psa", label: "Restricted Pod Security Admission", h: 64, pos: "b" }
      client[Same namespace pod: role client] -->|TCP 80| service[ClusterIP Service: web]
      service -->|targetPort 8080| pods[Deployment: two web replicas]
      policy[Allow role client on TCP 8080] -.->|CNI enforces on pods| pods
      egress[Namespace egress allow to web TCP 8080] -.-> client
      deny[Default deny ingress and egress] -.-> pods
      untrusted[Other pod] -->|No matching allow| blocked[Connection blocked]
      psa[Restricted Pod Security Admission] -.->|Admission checks| pods
      pods -->|Writable scratch only| tmp[emptyDir mounted at /tmp]
      root[Non-root and read-only root filesystem] -.-> pods`,
    prerequisites: 'An existing Kubernetes cluster, kubectl context, and a NetworkPolicy-capable CNI. Namespace creation requires suitable RBAC. Use a Linux node. The image tag is a runnable example; pin a verified digest before production. No external ingress, TLS termination, or cross-zone scheduling is created. NetworkPolicy does not authenticate application users.',
    commands: 'kubectl apply --dry-run=client -f workload.yaml\n# After review:\nkubectl apply -f workload.yaml\nkubectl -n csc-reference rollout status deployment/web --timeout=120s\nkubectl -n csc-reference get networkpolicy\n# Allowed: same namespace and matching label, numeric Service IP avoids DNS egress\nWEB_IP=$(kubectl -n csc-reference get svc web -o jsonpath="{.spec.clusterIP}")\nkubectl -n csc-reference run allowed --restart=Never --image=busybox:1.37 --labels=role=client --overrides=\'{"spec":{"securityContext":{"runAsNonRoot":true,"runAsUser":1000,"seccompProfile":{"type":"RuntimeDefault"}},"containers":[{"name":"allowed","image":"busybox:1.37","command":["wget","-T","5","-qO-","http://\'"$WEB_IP"\'"],"securityContext":{"allowPrivilegeEscalation":false,"capabilities":{"drop":["ALL"]}}}]}}\'\nkubectl -n csc-reference logs allowed\n# Repeat with name denied and without the role=client label: expect a timeout.\n# Remove the disposable example namespace after testing:\nkubectl delete namespace csc-reference',
    expected: 'Deployment available replicas = 2; allowed client receives the nginx page. An unlabeled client times out despite matching egress permission, demonstrating ingress isolation. If both succeed, verify CNI policy enforcement; port-forward is not a valid NetworkPolicy test. Egress is limited to same-namespace web pods on TCP 8080; DNS remains blocked. Replies to allowed ingress remain permitted.',
    sources: ['https://kubernetes.io/docs/concepts/services-networking/network-policies/', 'https://kubernetes.io/docs/tasks/configure-pod-container/security-context/']
  },
  cnapp: {
    category: 'compliance-sechub', service: 'AWS Security Hub', icon: 'compliance-sechub',
    title: 'Reference: CNAPP Defense & MITRE ATT&CK Auto-Remediation with OPA',
    description: 'A multi-tier CNAPP defense-in-depth architecture mapping MITRE ATT&CK techniques across perimeter WAF, KSPM admission controls, CNI microsegmentation, GuardDuty runtime detection, and EventBridge Lambda auto-containment.',
    flow: `flowchart TB
      adversary@{ icon: "logos:iam-access", label: "External Adversary (T1190)", h: 64, pos: "b" }
      waf@{ icon: "logos:waf-shield", label: "WAF & Perimeter ALB", h: 64, pos: "b" }
      pod@{ icon: "logos:k8s-pod", label: "EKS Workload Pod", h: 64, pos: "b" }
      opa@{ icon: "logos:k8s-admission", label: "OPA Gatekeeper (KSPM)", h: 64, pos: "b" }
      cni@{ icon: "logos:k8s-networkpolicy", label: "CNI NetworkPolicy (Default-Deny)", h: 64, pos: "b" }
      s3@{ icon: "logos:storage-s3", label: "KMS Encrypted S3 Bucket", h: 64, pos: "b" }
      guardduty@{ icon: "logos:threat-guardduty", label: "Runtime GuardDuty Anomaly Detection", h: 64, pos: "b" }
      eventbridge@{ icon: "logos:decoupled-eventbridge", label: "EventBridge Remediation Rule", h: 64, pos: "b" }
      remediator@{ icon: "logos:serverless-lambda", label: "OPA Auto-Remediator Lambda", h: 64, pos: "b" }
      adversary -->|T1190 Probe| waf
      waf -->|Filtered Ingress| pod
      opa -.->|Enforce Non-Root, Drop Caps| pod
      cni -.->|Microsegmentation| pod
      pod -->|T1530 Exfiltration Attempt| s3
      s3 -.->|API Audit Log| guardduty
      guardduty -->|Threat Finding Event| eventbridge
      eventbridge -->|Trigger Quarantine| remediator
      remediator -->|Lockout Egress & Contain| cni`,
    prerequisites: 'Kubernetes 1.28+, OPA Gatekeeper, AWS CLI with SecurityHub, GuardDuty, and EventBridge permissions. NetworkPolicy capable CNI (Amazon VPC CNI with NetworkPolicy support or Cilium).',
    commands: 'kubectl apply -f workload.yaml\nopa eval --data policy.rego --input workload.yaml "data.reference.kspm.allow"\naws guardduty get-detector\naws events list-rules --name-prefix csc-cnapp',
    expected: 'Admission webhook validates pod non-root status; CNI blocks unauthorized egress; GuardDuty flags anomalous API behavior; Lambda updates quarantine NetworkPolicy.',
    sources: ['https://kubernetes.io/docs/concepts/services-networking/network-policies/', 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html']
  },
  vultr: {
    category: 'vultr-storage', service: 'Vultr Object Storage', icon: 'vultr-storage',
    title: 'Reference: S3-compatible Vultr Object Storage with private ACL & TLS',
    description: 'Deploys a Vultr Object Storage subscription with TLS transport, private access permissions, and automated lifecycle rules. Data access requires valid S3 API keys; anonymous public access is completely restricted.',
    flow: `flowchart TB
      client@{ icon: "logos:vultr-iam", label: "Authenticated API Client", h: 64, pos: "b" }
      storage@{ icon: "logos:vultr-storage", label: "Private Vultr Object Storage", h: 64, pos: "b" }
      client[Authenticated API Client] -->|HTTPS S3 API| auth{Valid API Key?}
      auth -->|Yes| tls{TLS 1.3 Transport?}
      auth -->|No| denied[Access Denied]
      tls -->|No| denied
      tls -->|Yes| storage[Private Vultr Object Storage]
      public[Anonymous Internet Request] -->|NoPublicAccess enforced| denied
      storage -->|Encrypted at Rest| sse[AES-256 Storage Engine]`,
    prerequisites: 'Terraform 1.5+, Vultr API key with storage permissions. Supply label for resource identification.',
    commands: 'vultr-cli account info\nterraform init\nterraform plan -out=tfplan\nterraform show -json tfplan > tfplan.json\nopa eval --data policy.rego --input tfplan.json "data.reference.vultr.allow"',
    expected: 'Vultr Object Storage provisioned with private access. Anonymous requests fail with 403 Forbidden; authenticated S3 API calls succeed.',
    sources: ['https://www.vultr.com/docs/vultr-object-storage/', 'https://www.vultr.com/api/#operation/create-object-storage'],
    checks: { vultr_object_storage: { cluster_id: 1 } }
  },
  oracle: {
    category: 'oci-storage', service: 'OCI Object Storage', icon: 'oci-storage',
    title: 'Reference: Encrypted OCI Object Storage bucket with public access disabled',
    description: 'Deploys an OCI Object Storage bucket with NoPublicAccess, customer-managed KMS encryption, and object versioning enabled. Workload access is restricted to authenticated IAM principals.',
    flow: `flowchart TB
      workload@{ icon: "logos:oci-iam", label: "OCI Workload Principal", h: 64, pos: "b" }
      bucket@{ icon: "logos:oci-storage", label: "Encrypted OCI Object Storage", h: 64, pos: "b" }
      workload[OCI Workload Principal] -->|HTTPS REST with SigV4| auth{IAM Policy Permits?}
      auth -->|Yes| bucket[Encrypted OCI Object Storage]
      auth -->|No| denied[Access Denied]
      public[Anonymous Public Request] -->|NoPublicAccess enforced| denied
      bucket -->|KMS Key Encryption| kms@{ icon: "logos:oci-kms", label: "OCI Vault KMS Key", h: 64, pos: "b" }
      bucket -->|Audit Events Streamed| audit@{ icon: "logos:oci-audit", label: "OCI Audit Service", h: 64, pos: "b" }`,
    prerequisites: 'Terraform 1.5+, OCI CLI configured with tenancy and user credentials. Supply compartment_ocid and bucket_name.',
    commands: 'oci iam user get\nterraform init\nterraform plan -var="compartment_ocid=YOUR_COMPARTMENT_OCID" -out=tfplan\nterraform show -json tfplan > tfplan.json\nopa eval --data policy.rego --input tfplan.json "data.reference.oracle.allow"',
    expected: 'OCI Object Storage bucket provisioned with access_type NoPublicAccess and versioning Enabled.',
    sources: ['https://docs.oracle.com/en-us/iaas/Content/Object/Concepts/objectstorageoverview.htm', 'https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/managingbuckets.htm'],
    checks: { oci_objectstorage_bucket: { access_type: "NoPublicAccess", versioning: "Enabled" } }
  }
};

function planPolicy(provider, checks) {
  const conditions = Object.entries(checks).flatMap(([type, fields]) => [
    `  resources := [r | some r in input.resource_changes; r.type == ${JSON.stringify(type)}; r.change.after != null]`,
    '  count(resources) > 0',
    '  every r in resources {',
    ...Object.entries(fields).map(([key, value]) => `    r.change.after.${key} == ${JSON.stringify(value)}`),
    '  }'
  ]);
  return `package reference.${provider}\nimport rego.v1\n\n# Input: terraform show -json tfplan. Partial baseline check; not a full audit.\ndefault allow := false\nallow if {\n${conditions.join('\n')}\n}\n`;
}

const output = {};
for (const [provider, entry] of Object.entries(references)) {
  const asset = `/reference-architectures/${provider}/${['kspm', 'cnapp'].includes(provider) ? 'workload.yaml' : 'main.tf'}`;
  const code = fs.readFileSync(path.join(root, 'public', asset), 'utf8');
  const policy = provider === 'kspm' ? `package reference.kspm
import rego.v1
# Input: a single Deployment JSON, not a List or a multi-document YAML stream.
default allow := false
allow if {
  input.kind == "Deployment"
  input.spec.template.spec.automountServiceAccountToken == false
  input.spec.template.spec.securityContext.runAsNonRoot == true
  input.spec.template.spec.securityContext.seccompProfile.type == "RuntimeDefault"
  count(input.spec.template.spec.containers) > 0
  every c in input.spec.template.spec.containers {
    c.securityContext.allowPrivilegeEscalation == false
    c.securityContext.readOnlyRootFilesystem == true
    "ALL" in c.securityContext.capabilities.drop
  }
}
` : provider === 'cnapp' ? fs.readFileSync(path.join(root, 'public', 'reference-architectures', 'cnapp', 'policy.rego'), 'utf8') : planPolicy(provider, entry.checks);
  fs.writeFileSync(path.join(root, 'public', 'reference-architectures', provider, 'policy.rego'), policy);
  fs.writeFileSync(path.join(root, 'public', 'reference-architectures', provider, 'diagram.mmd'), entry.flow + '\n');
  output[provider] = [{
    id: `${provider.toUpperCase()}-REF-0001`, title: entry.title,
    category: entry.category, category_name: entry.service, service: entry.service,
    icon_url: `/images/${provider === 'kspm' ? 'k8s' : provider}-icons/${entry.icon}.svg`,
    pillar: 'Security', severity: 'High', compliance: [],
    description: entry.description, mermaid: entry.flow,
    svg: render(entry.flow, { icons: createIconResolver(provider) }).svg, opa_policy: policy,
    [['kspm', 'cnapp'].includes(provider) ? 'manifest' : 'terraform']: code,
    remediation: entry.expected,
    reference: { asset, policy: `/reference-architectures/${provider}/policy.rego`, prerequisites: entry.prerequisites, commands: entry.commands, expected: entry.expected, sources: entry.sources }
  }];
  const example = output[provider][0];
  const developer = refreshDiagramEntry(provider, example);
  output[provider][0] = {
    ...developer, ...example,
    developer_guide: { ...developer.developer_guide, scope: entry.description + ' ' + entry.prerequisites }
  };
}
fs.writeFileSync(path.join(root, 'src', 'data', 'reference-architectures.json'), JSON.stringify(output, null, 2) + '\n');
console.log('Generated four reference diagrams with matching configuration, policy and runbook.');
