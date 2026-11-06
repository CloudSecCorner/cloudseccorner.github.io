"""Local policy exercise. Identity is a trusted fixture, not an OAuth verifier."""
import hashlib
import hmac
import json
import secrets
import unittest


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode()


class Gateway:
    def __init__(self):
        self.key = secrets.token_bytes(32)
        self.used = set()

    def approve(self, action, expires=1100):
        claims = {"action": hashlib.sha256(canonical(action)).hexdigest(), "expires": expires,
                  "nonce": secrets.token_hex(16)}
        return claims, hmac.digest(self.key, canonical(claims), "sha256")

    def execute(self, action, principal, approval=None, now=1000):
        # The production adapter must authenticate before constructing this context.
        if principal != "spiffe://lab.example/agent":
            raise PermissionError("identity")
        if set(action) != {"tool", "tenant", "target", "bytes"}:
            raise PermissionError("schema")
        if action["tenant"] != "tenant-a" or type(action["bytes"]) is not int or not 0 <= action["bytes"] <= 1024:
            raise PermissionError("scope or budget")
        allowed = {"ticket.read": "tickets/INC-7", "evidence.write": "evidence/INC-7.json"}
        if action["tool"] not in allowed or action["target"] != allowed[action["tool"]]:
            raise PermissionError("tool or target")
        if action["tool"] == "evidence.write":
            if approval is None:
                raise PermissionError("approval required")
            claims, signature = approval
            expected = hmac.digest(self.key, canonical(claims), "sha256")
            if not hmac.compare_digest(signature, expected):
                raise PermissionError("approval signature")
            if claims["expires"] <= now or claims["nonce"] in self.used:
                raise PermissionError("expired or replayed approval")
            if claims["action"] != hashlib.sha256(canonical(action)).hexdigest():
                raise PermissionError("approval does not match action")
            self.used.add(claims["nonce"])
        # No real API call: return only a receipt, never a credential.
        return {"decision": "allow", "target": action["target"]}


class BoundaryTests(unittest.TestCase):
    def setUp(self):
        self.gateway = Gateway()
        self.identity = "spiffe://lab.example/agent"
        self.read = dict(tool="ticket.read", tenant="tenant-a", target="tickets/INC-7", bytes=50)
        self.write = dict(tool="evidence.write", tenant="tenant-a", target="evidence/INC-7.json", bytes=50)

    def test_scoped_read(self):
        self.assertEqual(self.gateway.execute(self.read, self.identity)["decision"], "allow")

    def test_untrusted_context_cannot_grant_approval(self):
        with self.assertRaisesRegex(PermissionError, "approval required"):
            self.gateway.execute(self.write, self.identity)

    def test_valid_approval_then_replay(self):
        approval = self.gateway.approve(self.write)
        self.gateway.execute(self.write, self.identity, approval)
        with self.assertRaisesRegex(PermissionError, "replayed"):
            self.gateway.execute(self.write, self.identity, approval)

    def test_action_changed_after_approval(self):
        approval = self.gateway.approve(self.write)
        with self.assertRaisesRegex(PermissionError, "does not match"):
            self.gateway.execute(dict(self.write, bytes=60), self.identity, approval)

    def test_expired_and_tampered_approvals(self):
        for approval in [self.gateway.approve(self.write, expires=999), (self.gateway.approve(self.write)[0], b"bad")]:
            with self.assertRaises(PermissionError):
                self.gateway.execute(self.write, self.identity, approval)

    def test_schema_tenant_budget_and_identity(self):
        for action in [dict(self.read, tenant="tenant-b"), dict(self.read, bytes=1025),
                       dict(self.read, admin=True), dict(self.read, tool="shell.exec")]:
            with self.assertRaises(PermissionError):
                self.gateway.execute(action, self.identity)
        with self.assertRaises(PermissionError):
            self.gateway.execute(self.read, "anonymous")


if __name__ == "__main__":
    unittest.main(verbosity=2)
