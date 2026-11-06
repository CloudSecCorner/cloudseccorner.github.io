# Kubernetes Isolation for Agent and Build Workloads

Reviewed: 2026-11-06

## Review the executor as an application boundary

An agent executor can turn model output into filesystem access, network traffic, or a process launch. A build runner can execute code supplied by a repository. Give these workloads an explicit privilege, credential, storage, and network budget before choosing a runtime.

The [Kubernetes Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) supply admission baselines. They are useful controls, but admission approval is not proof that an application cannot leak data or misuse its permitted credentials.

## Use multiple enforcement layers

| Boundary | Concrete verification |
| --- | --- |
| Pod admission | Prohibited privilege or host access is rejected |
| Workload identity | Required API access succeeds; unrelated access fails |
| Filesystem | Only declared writable locations accept writes |
| Network | An allowed destination works and a denied destination fails |
| Task lifecycle | Timeout, cancellation, retries, and resource exhaustion are bounded |

Review init containers and ephemeral debug containers as well as the main container. A narrow service account is still a credential; do not mount it automatically when the workload does not need Kubernetes API access. Digest pinning and a read-only root filesystem can be useful additional organization controls, but they should not be mislabeled as a complete Pod Security profile.

## Test network behavior in the chosen cluster

[NetworkPolicy](https://kubernetes.io/docs/concepts/services-networking/network-policies/) depends on a network implementation that enforces it. A saved object or successful API response does not show that traffic was blocked. Test DNS and required dependencies as well as prohibited destinations, and record the source and destination Pods involved.

Network policy does not decide whether an authenticated caller may read a specific tenant's document. Connect network tests to [workload authentication and request authorization](/labs/Zero-Trust-Architecture), rather than treating private connectivity as identity.

## Match isolation to the workload

Use the [Kubernetes security checklist](https://kubernetes.io/docs/concepts/security/security-checklist/) when planning admission, RBAC, secret handling, logging, and workload controls. If you choose an additional sandbox or VM boundary, test its actual configuration and operational tradeoffs. A container image or a diagram alone does not establish that boundary.

Begin with the [container-boundary lab](/labs/ethical-hacker-easy-way). Its local fixture rejects selected unsafe configuration changes without launching them. Then repeat the relevant checks against server-side admission and runtime behavior in a disposable cluster owned by your team.

Keep results tied to the cluster version, policy configuration, network implementation, image digest, and workload identity. This turns a configuration checklist into a repeatable deployment review instead of a one-time assertion that the workload is isolated.
