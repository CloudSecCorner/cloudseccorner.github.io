"""Selected local Pod checks; not a replacement for Kubernetes admission."""
import copy
import re
import unittest

BASELINE = {"apiVersion": "v1", "kind": "Pod", "metadata": {"name": "local-fixture"}, "spec": {
    "automountServiceAccountToken": False,
    "securityContext": {"runAsNonRoot": True, "seccompProfile": {"type": "RuntimeDefault"}},
    "containers": [{"name": "app", "image": "registry.example/app@sha256:" + "a" * 64,
                    "securityContext": {"allowPrivilegeEscalation": False, "readOnlyRootFilesystem": True,
                                        "capabilities": {"drop": ["ALL"]}},
                    "resources": {"limits": {"cpu": "100m", "memory": "64Mi"}}}]}}


def violations(pod):
    spec = pod["spec"]
    errors = []
    if any(spec.get(field, False) for field in ["hostPID", "hostIPC", "hostNetwork"]):
        errors.append("host namespace")
    if any("hostPath" in volume for volume in spec.get("volumes", [])):
        errors.append("hostPath")
    if spec.get("automountServiceAccountToken") is not False:
        errors.append("ambient service account token")
    for container in spec.get("containers", []) + spec.get("initContainers", []) + spec.get("ephemeralContainers", []):
        security = container.get("securityContext", {})
        effective_nonroot = security.get("runAsNonRoot", spec.get("securityContext", {}).get("runAsNonRoot"))
        seccomp = security.get("seccompProfile", spec.get("securityContext", {}).get("seccompProfile", {}))
        if security.get("privileged", False) or security.get("allowPrivilegeEscalation") is not False:
            errors.append("privilege escalation")
        if effective_nonroot is not True or seccomp.get("type") != "RuntimeDefault":
            errors.append("identity or seccomp")
        if security.get("capabilities", {}).get("drop") != ["ALL"] or security.get("capabilities", {}).get("add"):
            errors.append("capabilities")
        if security.get("readOnlyRootFilesystem") is not True:
            errors.append("writable root filesystem")
        if not re.fullmatch(r"[^\s]+@sha256:[0-9a-f]{64}", container.get("image", "")):
            errors.append("mutable image")
        if not {"cpu", "memory"} <= container.get("resources", {}).get("limits", {}).keys():
            errors.append("missing resource limits")
    return errors


class HardeningTests(unittest.TestCase):
    def test_baseline(self):
        self.assertEqual(violations(BASELINE), [])

    def test_privileged_and_host_access(self):
        pod = copy.deepcopy(BASELINE)
        pod["spec"]["hostPID"] = True
        pod["spec"]["volumes"] = [{"name": "socket", "hostPath": {"path": "/var/run/docker.sock"}}]
        pod["spec"]["containers"][0]["securityContext"]["privileged"] = True
        self.assertEqual(set(violations(pod)), {"host namespace", "hostPath", "privilege escalation"})

    def test_token_image_and_filesystem(self):
        pod = copy.deepcopy(BASELINE)
        pod["spec"]["automountServiceAccountToken"] = True
        pod["spec"]["containers"][0]["image"] = "registry.example/app:latest"
        pod["spec"]["containers"][0]["securityContext"]["readOnlyRootFilesystem"] = False
        self.assertEqual(set(violations(pod)), {"ambient service account token", "mutable image", "writable root filesystem"})

    def test_init_container_cannot_bypass_checks(self):
        pod = copy.deepcopy(BASELINE)
        pod["spec"]["initContainers"] = [dict(pod["spec"]["containers"][0], securityContext={"privileged": True})]
        self.assertIn("privilege escalation", violations(pod))


if __name__ == "__main__":
    unittest.main(verbosity=2)
