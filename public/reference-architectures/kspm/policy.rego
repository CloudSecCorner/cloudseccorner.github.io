package reference.kspm
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
