"""Original RAG boundary fixture and a threat register, not a vector database."""
import json
import unittest

DOCUMENTS = [
    {"id": "a1", "tenant": "a", "readers": {"alice"}, "text": "Synthetic tenant A incident"},
    {"id": "b1", "tenant": "b", "readers": {"bob"}, "text": "Synthetic tenant B incident"},
]

THREATS = [
    {"id": "T1", "boundary": "retrieval to context", "owner": "search-team",
     "failure": "cross-tenant document", "test": "test_tenant_and_document_acl"},
    {"id": "T2", "boundary": "shared cache to caller", "owner": "platform-team",
     "failure": "cache reused across identities", "test": "test_cache_isolation"},
    {"id": "T3", "boundary": "document lifecycle to retrieval", "owner": "data-team",
     "failure": "deleted source remains retrievable", "test": "test_deletion_and_revocation"},
]


def retrieve(tenant, identity, query):
    # Filter before content is returned to the caller or passed to a model.
    return [dict(doc, readers=sorted(doc["readers"])) for doc in DOCUMENTS
            if doc["tenant"] == tenant and identity in doc["readers"] and query in doc["text"]]


def cache_key(tenant, identity, policy_revision, query):
    return tenant, identity, policy_revision, query


class ThreatTests(unittest.TestCase):
    def test_tenant_and_document_acl(self):
        self.assertEqual([d["id"] for d in retrieve("a", "alice", "incident")], ["a1"])
        self.assertEqual(retrieve("b", "alice", "incident"), [])
        self.assertEqual(retrieve("a", "bob", "incident"), [])

    def test_cache_isolation(self):
        base = cache_key("a", "alice", 1, "incident")
        for other in [cache_key("b", "alice", 1, "incident"), cache_key("a", "bob", 1, "incident"),
                      cache_key("a", "alice", 2, "incident")]:
            self.assertNotEqual(base, other)

    def test_deletion_and_revocation(self):
        original = list(DOCUMENTS)
        try:
            DOCUMENTS[:] = [doc for doc in DOCUMENTS if doc["id"] != "a1"]
            self.assertEqual(retrieve("a", "alice", "incident"), [])
            DOCUMENTS[:] = [dict(doc, readers=set()) for doc in original]
            self.assertEqual(retrieve("a", "alice", "incident"), [])
            self.assertNotEqual(cache_key("a", "alice", 1, "incident"), cache_key("a", "alice", 2, "incident"))
        finally:
            DOCUMENTS[:] = original

    def test_register_has_owned_executable_checks(self):
        for threat in THREATS:
            self.assertTrue(threat["owner"] and threat["failure"] and threat["boundary"])
            self.assertTrue(callable(getattr(self, threat["test"], None)))


if __name__ == "__main__":
    print(json.dumps(THREATS, indent=2))
    unittest.main(verbosity=2)
