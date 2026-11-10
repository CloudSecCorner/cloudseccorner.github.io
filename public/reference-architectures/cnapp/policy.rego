package reference.kspm

import rego.v1

# CloudSecCorner Reference Architecture - Kubernetes Security Posture Management (KSPM)
# Validates Kubernetes Deployment specs against CIS Benchmarks and MITRE ATT&CK mitigation requirements.
#
# Mitigates:
# - MITRE T1078 / T1552: Disables automatic service account token mounting
# - MITRE T1068: Disables privilege escalation
# - MITRE T1611: Restricts Linux capabilities (drops ALL) and enforces runtime seccomp
# - MITRE T1059: Enforces read-only root filesystem to prevent downloading malware payloads

default allow := false

# Allow deployment only if all zero-trust container security constraints pass
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

# Detailed violation reporting for Gatekeeper / Conftest
deny contains msg if {
    input.kind == "Deployment"
    input.spec.template.spec.automountServiceAccountToken != false
    msg := "KSPM-001: automountServiceAccountToken must be explicitly false (prevents token exfiltration T1552)"
}

deny contains msg if {
    input.kind == "Deployment"
    not input.spec.template.spec.securityContext.runAsNonRoot
    msg := "KSPM-002: spec.securityContext.runAsNonRoot must be true (prevents root compromise T1068)"
}

deny contains msg if {
    input.kind == "Deployment"
    input.spec.template.spec.securityContext.seccompProfile.type != "RuntimeDefault"
    msg := "KSPM-003: seccompProfile.type must be RuntimeDefault (restricts syscall surface T1611)"
}

deny contains msg if {
    input.kind == "Deployment"
    some c in input.spec.template.spec.containers
    c.securityContext.readOnlyRootFilesystem != true
    msg := sprintf("KSPM-004: Container '%v' must have readOnlyRootFilesystem enabled", [c.name])
}

deny contains msg if {
    input.kind == "Deployment"
    some c in input.spec.template.spec.containers
    not "ALL" in c.securityContext.capabilities.drop
    msg := sprintf("KSPM-005: Container '%v' must drop ALL capabilities", [c.name])
}
