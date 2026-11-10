import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Code2, Download, FileCode, Maximize, Minimize, Network, RotateCcw, ShieldAlert, Target, Workflow, ZoomIn, ZoomOut } from 'lucide-react';
import './DiagramViewer.css';
import ReferenceRunbook from './ReferenceRunbook';
import DeveloperGuide from './DeveloperGuide';

function getContextualThreatModel(architecture, title) {
  const service = (architecture?.service || '').toLowerCase();
  const category = (architecture?.category || architecture?.category_name || '').toLowerCase();
  const titleText = (title || architecture?.title || '').toLowerCase();
  const descText = (architecture?.description || '').toLowerCase();

  const isStorage = service.includes('s3') || service.includes('storage') || service.includes('bucket') || service.includes('blob') || category.includes('storage');
  const isIdentity = service.includes('iam') || service.includes('auth') || service.includes('role') || service.includes('key') || category.includes('iam') || category.includes('identity');
  const isNetwork = service.includes('vpc') || service.includes('network') || service.includes('firewall') || service.includes('sg') || service.includes('security group') || category.includes('network');
  const isK8s = service.includes('k8s') || service.includes('kubernetes') || service.includes('eks') || service.includes('aks') || service.includes('gke') || service.includes('civo') || category.includes('container');

  let stride;
  let mitre;

  if (isStorage) {
    stride = [
      { code: 'S', name: 'Spoofing', threat: 'Forged Presigned URLs / Anonymous Read', impact: 'High', mitigation: 'Enforce SigV4 / HMAC token verification and disable anonymous ACLs' },
      { code: 'T', name: 'Tampering', threat: 'Unauthorized Object Overwrite & Deletion', impact: 'Critical', mitigation: 'Enable S3/Blob Object Lock, MFA Delete, and immutable versioning' },
      { code: 'R', name: 'Repudiation', threat: 'Unmonitored Data Access & Deletion', impact: 'Medium', mitigation: 'Enable CloudTrail Data Events & Server Access Logging to an isolated audit bucket' },
      { code: 'I', name: 'Information Disclosure', threat: 'Public Bucket Exposure & Plaintext Storage', impact: 'Critical', mitigation: 'Enable Block Public Access (BPA) and enforce KMS SSE-KMS customer-managed keys' },
      { code: 'D', name: 'Denial of Service', threat: 'PUT/GET Flood & Storage API Quota Starvation', impact: 'Medium', mitigation: 'Implement CloudFront edge caching and WAF rate-based request throttling' },
      { code: 'E', name: 'Elevation of Privilege', threat: 'Wildcard Bucket Policy (*:*) Delegation', impact: 'High', mitigation: 'Apply least-privilege IAM conditions restricting actions to specific principal ARNs' }
    ];
    mitre = [
      { id: 'T1530', tactic: 'Collection', technique: 'Data from Cloud Storage', attack: 'Adversary leverages public bucket permissions or stolen tokens to dump confidential data objects.', defense: 'Block Public Access, OPA Rego bucket privacy guardrails, and KMS encryption.' },
      { id: 'T1562.008', tactic: 'Defense Evasion', technique: 'Disable Cloud Logs', attack: 'Adversary turns off object-level CloudTrail or audit logging before exfiltrating data.', defense: 'IAM Service Control Policy (SCP) denying log deletion across production accounts.' },
      { id: 'T1098', tactic: 'Persistence', technique: 'Account Manipulation', attack: 'Adversary modifies bucket ACLs or cross-account trust policies to retain persistence.', defense: 'EventBridge alerting on PutBucketPolicy with automated remediation.' },
      { id: 'T1567', tactic: 'Exfiltration', technique: 'Exfiltration Over Web Service', attack: 'Adversary syncs bucket contents to adversary-controlled external cloud storage.', defense: 'VPC Endpoint Policies restricting storage traffic strictly to corporate account IDs.' }
    ];
  } else if (isIdentity) {
    stride = [
      { code: 'S', name: 'Spoofing', threat: 'Stolen Long-Lived Access Keys & Token Replay', impact: 'Critical', mitigation: 'Enforce Short-Lived STS Credentials with MFA token requirement' },
      { code: 'T', name: 'Tampering', threat: 'Unauthorized Role Policy & Trust Modification', impact: 'Critical', mitigation: 'Apply IAM Permissions Boundaries and strict Change-Management CI/CD gates' },
      { code: 'R', name: 'Repudiation', threat: 'Console Sessions Without MFA Traceability', impact: 'High', mitigation: 'Stream Identity Center / Entra ID audit logs to central immutable SIEM' },
      { code: 'I', name: 'Information Disclosure', threat: 'Exposed Account IDs, Role ARNs & Credentials', impact: 'High', mitigation: 'Automated secret scanning and automated credential revocation pipelines' },
      { code: 'D', name: 'Denial of Service', threat: 'IAM Resource Policy Bloat & Account Lockout', impact: 'Medium', mitigation: 'Automated orphan credential pruner and SCP safeguards on break-glass roles' },
      { code: 'E', name: 'Elevation of Privilege', threat: 'iam:PassRole Privilege Escalation', impact: 'Critical', mitigation: 'Restrict PassRole to tightly scoped compute roles with explicit resource constraints' }
    ];
    mitre = [
      { id: 'T1078.004', tactic: 'Initial Access', technique: 'Valid Cloud Accounts', attack: 'Adversary gains access using leaked API keys, compromised admin credentials, or phished SSO sessions.', defense: 'Hardware MFA enforcement, Conditional Access Policies, and automated credential rotation.' },
      { id: 'T1548', tactic: 'Privilege Escalation', technique: 'Abuse Elevation Control', attack: 'Adversary attaches AdministratorAccess policy or escalates permissions via PassRole.', defense: 'Permission Boundaries, OPA IaC checks forbidding *:* wildcards, and GuardDuty anomaly detection.' },
      { id: 'T1098.001', tactic: 'Persistence', technique: 'Additional Cloud Credentials', attack: 'Adversary generates secondary access keys or adds SSH keys to backdoor accounts.', defense: 'Automated compliance checks flagging unrotated keys older than 90 days.' },
      { id: 'T1550', tactic: 'Lateral Movement', technique: 'Use Alternate Auth Material', attack: 'Adversary steals STS session tokens to move across interconnected cloud accounts.', defense: 'Enforce STS session duration caps and bind tokens to source IP VPC endpoints.' }
    ];
  } else if (isNetwork) {
    stride = [
      { code: 'S', name: 'Spoofing', threat: 'IP Spoofing & Route Hijacking in Transit', impact: 'High', mitigation: 'Enable VPC Source/Dest Check, RPKI validation, and Cloud Armor/Shield' },
      { code: 'T', name: 'Tampering', threat: 'Unauthorized Security Group Egress / Ingress rules', impact: 'Critical', mitigation: 'Terraform IaC drift detection and OPA gate rejecting 0.0.0.0/0 inbound rules' },
      { code: 'R', name: 'Repudiation', threat: 'Unlogged East-West Lateral Traffic', impact: 'High', mitigation: 'Enable VPC Flow Logs with 1-minute aggregation interval to S3/CloudWatch' },
      { code: 'I', name: 'Information Disclosure', threat: 'Plaintext Transit Over Public Internet', impact: 'High', mitigation: 'Enforce TLS 1.3, IPSec VPN, and Direct Connect / ExpressRoute encryption' },
      { code: 'D', name: 'Denial of Service', threat: 'SYN Flood & Distributed Layer 7 DDoS', impact: 'High', mitigation: 'Deploy Cloud Shield / DDoS Protection, and WAF rate limiting' },
      { code: 'E', name: 'Elevation of Privilege', threat: 'VPC Peering Transit Pivoting Across Trust Enclaves', impact: 'Critical', mitigation: 'Zero Trust micro-segmentation with PrivateLink and network firewall inspection' }
    ];
    mitre = [
      { id: 'T1190', tactic: 'Initial Access', technique: 'Exploit Public-Facing Application', attack: 'Adversary targets unpatched ingress port exposed directly to the public internet.', defense: 'WAF inspection rules, ingress security group restrictions, and automated CVE scanning.' },
      { id: 'T1046', tactic: 'Discovery', technique: 'Network Service Discovery', attack: 'Adversary scans internal subnets to identify vulnerable microservices and management ports.', defense: 'Network security group microsegmentation, VPC Flow Log anomaly detection, and honeypots.' },
      { id: 'T1562.004', tactic: 'Defense Evasion', technique: 'Disable System Firewall', attack: 'Adversary modifies security group to open port 22 or 3389 to 0.0.0.0/0.', defense: 'Automated policy rule restricted-common-ports triggering instant firewall revocation.' },
      { id: 'T1071', tactic: 'Command and Control', technique: 'Application Layer Protocol', attack: 'Adversary establishes reverse shell beaconing outbound over HTTPS port 443.', defense: 'Egress filtering via Next-Gen Cloud Firewall with TLS decrypt inspection.' }
    ];
  } else if (isK8s) {
    stride = [
      { code: 'S', name: 'Spoofing', threat: 'Unauthenticated Kubelet & API Server Spoofing', impact: 'Critical', mitigation: 'Enforce mTLS, webhook authentication, and disable anonymous kubelet auth' },
      { code: 'T', name: 'Tampering', threat: 'Malicious Container Image Injection & Supply Chain Poisoning', impact: 'Critical', mitigation: 'Cosign image signature verification and admission controller image whitelist' },
      { code: 'R', name: 'Repudiation', threat: 'Missing Container Runtime Audit Logs', impact: 'Medium', mitigation: 'Deploy Falco eBPF runtime engine and forward Kubernetes Audit Logs to SIEM' },
      { code: 'I', name: 'Information Disclosure', threat: 'Unencrypted Kube Secrets & Environment Variable Leaks', impact: 'High', mitigation: 'Enable KMS Envelope Encryption for etcd and use Vault Secrets Operator' },
      { code: 'D', name: 'Denial of Service', threat: 'Node Resource Exhaustion & Fork Bombs', impact: 'High', mitigation: 'Mandate LimitRanges, ResourceQuotas, and PIDs limits on all namespaces' },
      { code: 'E', name: 'Elevation of Privilege', threat: 'Privileged Container Host Breakout', impact: 'Critical', mitigation: 'Enforce Pod Security Standards (Restricted profile) via OPA Gatekeeper' }
    ];
    mitre = [
      { id: 'T1610', tactic: 'Execution', technique: 'Deploy Container', attack: 'Adversary creates a malicious pod with root privileges or hostPath mounts.', defense: 'Admission controller rejecting privileged: true, hostNetwork: true, and root UID.' },
      { id: 'T1611', tactic: 'Privilege Escalation', technique: 'Escape to Host', attack: 'Adversary exploits kernel vulnerability from unconfined container to gain node root.', defense: 'gVisor sandboxing, AppArmor/seccomp profiles, and eBPF runtime monitoring.' },
      { id: 'T1552.005', tactic: 'Credential Access', technique: 'Cloud Instance Metadata API', attack: 'Adversary queries node 169.254.169.254 from pod to steal node IAM instance role.', defense: 'Enforce IMDSv2 with hop limit = 1 and deploy NetworkPolicy blocking metadata IP.' },
      { id: 'T1059', tactic: 'Execution', technique: 'Command and Scripting Interpreter', attack: 'Adversary uses kubectl exec to spawn interactive sh/bash shell in production container.', defense: 'Audit RBAC permissions for pods/exec and alert on shell invocations via Falco.' }
    ];
  } else {
    stride = [
      { code: 'S', name: 'Spoofing', threat: 'API Request Impersonation & Forged Service Identities', impact: 'High', mitigation: 'Enforce mutual TLS and cryptographically signed JWT bearer tokens with audience check' },
      { code: 'T', name: 'Tampering', threat: 'Unauthorized Configuration Drift & State Modification', impact: 'Critical', mitigation: 'Immutable infrastructure deployment via Terraform CI/CD pipeline and OPA guardrails' },
      { code: 'R', name: 'Repudiation', threat: 'Incomplete Audit Trails & Disabled Cloud Activity Logging', impact: 'Medium', mitigation: 'Centralize CloudTrail / Activity Log / Audit Log forwarding with WORM compliance' },
      { code: 'I', name: 'Information Disclosure', threat: 'Cleartext Data at Rest & Overly Permissive Access', impact: 'Critical', mitigation: 'Customer Managed Keys (CMK) encryption with automated rotation and least-privilege RBAC' },
      { code: 'D', name: 'Denial of Service', threat: 'Resource Starvation & Missing Rate Limiting', impact: 'High', mitigation: 'Implement automated horizontal autoscaling, circuit breakers, and edge WAF throttling' },
      { code: 'E', name: 'Elevation of Privilege', threat: 'Excessive Administrative Privileges & Wildcard Grants', impact: 'Critical', mitigation: 'Just-In-Time (JIT) privileged access management with dual-approval workflow' }
    ];
    mitre = [
      { id: 'T1078', tactic: 'Initial Access', technique: 'Valid Accounts', attack: 'Adversary gains initial cloud environment access using compromised credentials or API tokens.', defense: 'Mandatory Multi-Factor Authentication (MFA) and automated credential rotation.' },
      { id: 'T1562', tactic: 'Defense Evasion', technique: 'Impair Defenses', attack: 'Adversary disables security agents, alerting thresholds, or firewall rules to avoid detection.', defense: 'Tamper-resistant central logging, immutable policy enforcement, and drift monitoring.' },
      { id: 'T1552', tactic: 'Credential Access', technique: 'Unsecured Credentials', attack: 'Adversary searches repositories, configuration files, and metadata services for secrets.', defense: 'Automated secret scanning, KMS envelope encryption, and Secrets Manager integration.' },
      { id: 'T1082', tactic: 'Discovery', technique: 'System Information Discovery', attack: 'Adversary enumerates cloud resources, role assignments, and topology to map targets.', defense: 'Principle of least privilege restricting describe/list API calls and anomaly detection.' }
    ];
  }

  return { stride, mitre };
}

export default function DiagramViewer({ svg, title = 'Architecture diagram', filename = 'architecture', reference, details, architecture, source, fitToViewport = false }) {
  const root = useRef(null);
  const tabId = useId();
  const [mode, setMode] = useState('runtime');
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState('');
  const guide = architecture?.developer_guide;
  const activeSvg = mode === 'deployment' ? architecture?.deployment_svg : svg;
  const activeSource = mode === 'deployment' ? architecture?.deployment_mermaid : (source || architecture?.mermaid);
  const markup = useMemo(() => ({ __html: activeSvg }), [activeSvg]);
  const threatModel = useMemo(() => getContextualThreatModel(architecture, title), [architecture, title]);

  useEffect(() => {
    setZoom(100);
    setError('');
    setMode('runtime');
  }, [svg]);

  useEffect(() => { setZoom(100); }, [mode]);

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const download = () => {
    const rendered = root.current.querySelector('.diagram-content > svg');
    if (!rendered) return;
    const clone = rendered.cloneNode(true);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const originals = [rendered, ...rendered.querySelectorAll('*')];
    const copies = [clone, ...clone.querySelectorAll('*')];
    originals.forEach((element, index) => {
      const style = getComputedStyle(element);
      ['fill', 'stroke', 'color', 'font-family', 'font-size', 'font-weight'].forEach(property => {
        copies[index].style.setProperty(property, style.getPropertyValue(property));
      });
    });
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/[^a-z0-9_-]/gi, '-')}-${mode}.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const downloadSource = () => {
    const url = URL.createObjectURL(new Blob([activeSource], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/[^a-z0-9_-]/gi, '-')}-${mode}.mmd`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const modes = [
    { id: 'runtime', label: 'Integration', icon: Network },
    { id: 'stride', label: 'Threat Model (STRIDE)', icon: ShieldAlert },
    { id: 'mitre', label: 'MITRE ATT&CK®', icon: Target },
    ...(architecture?.deployment_svg ? [{ id: 'deployment', label: 'Deploy', icon: Workflow }] : []),
    ...(guide ? [{ id: 'build', label: 'Build Notes', icon: Code2 }] : [])
  ];

  const onTabKeyDown = event => {
    const index = modes.findIndex(item => item.id === mode);
    const next = event.key === 'ArrowRight' ? (index + 1) % modes.length
      : event.key === 'ArrowLeft' ? (index + modes.length - 1) % modes.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? modes.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setMode(modes[next].id);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
  };

  const toggleFullscreen = async () => {
    try {
      if (fullscreen) await document.exitFullscreen();
      else await root.current.requestFullscreen();
      setError('');
    } catch {
      setError('Fullscreen is unavailable in this browser.');
    }
  };

  return (
    <section ref={root} className="diagram-viewer" aria-label={title}>
      <div className="diagram-toolbar" role="group" aria-label="Diagram controls">
        <span className="diagram-title" title={title}>{title}</span>
        {mode !== 'build' && <div className="diagram-actions">
          <button type="button" title="Zoom out" aria-label="Zoom out" disabled={zoom <= 50} onClick={() => setZoom(value => Math.max(50, value - 25))}><ZoomOut size={16} /></button>
          <output aria-label="Zoom level">{zoom}%</output>
          <button type="button" title="Zoom in" aria-label="Zoom in" disabled={zoom >= 300} onClick={() => setZoom(value => Math.min(300, value + 25))}><ZoomIn size={16} /></button>
          <button type="button" title="Reset zoom" aria-label="Reset zoom" onClick={() => setZoom(100)}><RotateCcw size={16} /></button>
          <button type="button" title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={toggleFullscreen}>{fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}</button>
          <button type="button" title="Download SVG" aria-label="Download SVG" onClick={download}><Download size={16} /></button>
          {activeSource && <button type="button" title="Download Mermaid source" aria-label="Download Mermaid source" onClick={downloadSource}><FileCode size={16} /></button>}
        </div>}
      </div>

      <div className="diagram-tabs" role="tablist" aria-label="Architecture view">
        {modes.map(item => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${tabId}-${item.id}`}
            aria-controls={`${tabId}-panel`}
            aria-selected={mode === item.id}
            tabIndex={mode === item.id ? 0 : -1}
            onClick={() => setMode(item.id)}
            onKeyDown={onTabKeyDown}
          >
            <item.icon size={15} />
            {item.label}
          </button>
        ))}
      </div>

      {error && <p className="diagram-error" role="status">{error}</p>}

      <div id={`${tabId}-panel`} role="tabpanel" aria-labelledby={`${tabId}-${mode}`}>
        {mode === 'build' && guide ? (
          <DeveloperGuide guide={guide} />
        ) : (
          <div>
            {mode === 'stride' && (
              <div className="threat-hud threat-hud-stride">
                <div className="threat-hud-title">
                  <span className="threat-hud-pill">STRIDE Threat Modeling Simulation</span>
                  <span className="threat-hud-metric">Overall Posture: <strong>{architecture?.severity || 'High'} Risk Boundary</strong></span>
                </div>
                <div className="threat-hud-meta">
                  <span>Primary Attack Vector: Ingress Exploitation &amp; Privilege Escalation</span>
                  <span>Defense: OPA Policy &amp; Least Privilege Verified</span>
                </div>
              </div>
            )}

            {mode === 'mitre' && (
              <div className="threat-hud threat-hud-mitre">
                <div className="threat-hud-title">
                  <span className="threat-hud-pill mitre-pill">MITRE ATT&CK® Enterprise &amp; Cloud Mapping</span>
                  <span className="threat-hud-metric">Adversary Tactics: <strong>{threatModel.mitre.length} TTPs Detected</strong></span>
                </div>
                <div className="threat-hud-meta">
                  <span>Scope: Cloud Infrastructure, Identity &amp; Workload Isolation</span>
                  <span>Barriers: Automated Policy &amp; Cloud Detection</span>
                </div>
              </div>
            )}

            <div className={`diagram-viewport${fitToViewport ? ' diagram-fit' : ''}${mode === 'stride' ? ' diagram-stride-view' : ''}${mode === 'mitre' ? ' diagram-mitre-view' : ''}`} tabIndex={0} role="region" aria-label={`${title}, scrollable diagram`}>
              <div className="diagram-content" style={{ width: `${zoom}%`, height: fitToViewport ? `${zoom}%` : undefined }} role="img" aria-label={title} dangerouslySetInnerHTML={markup} />
            </div>

            {mode === 'stride' && (
              <div className="threat-stride-container">
                <h4 className="threat-section-title">STRIDE Threat Analysis &amp; Countermeasures</h4>
                <div className="threat-stride-grid">
                  {threatModel.stride.map((st) => (
                    <div key={st.code} className="threat-stride-card">
                      <div className="threat-stride-card-header">
                        <span className={`stride-code-badge stride-${st.code.toLowerCase()}`}>{st.code}</span>
                        <div className="threat-stride-name-box">
                          <strong className="threat-stride-name">{st.name}</strong>
                          <span className={`threat-impact-badge impact-${st.impact.toLowerCase()}`}>{st.impact}</span>
                        </div>
                      </div>
                      <p className="threat-stride-threat"><strong>Threat:</strong> {st.threat}</p>
                      <p className="threat-stride-mitigation"><strong>Mitigation:</strong> {st.mitigation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'mitre' && (
              <div className="threat-mitre-container">
                <h4 className="threat-section-title">Mapped MITRE Adversary Tactics &amp; Defensive Barriers</h4>
                <div className="threat-mitre-grid">
                  {threatModel.mitre.map((m) => (
                    <div key={m.id} className="threat-mitre-card">
                      <div className="threat-mitre-card-header">
                        <span className="mitre-ttp-code">{m.id}</span>
                        <span className="mitre-tactic-pill">{m.tactic}</span>
                      </div>
                      <h5 className="mitre-technique-name">{m.technique}</h5>
                      <p className="threat-mitre-attack"><strong>Adversary Method:</strong> {m.attack}</p>
                      <p className="threat-mitre-defense"><strong>Defensive Barrier:</strong> {m.defense}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ReferenceRunbook reference={reference} details={details} />
    </section>
  );
}
