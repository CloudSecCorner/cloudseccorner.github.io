"""Real local signature/digest checks; intentionally not a SLSA certification."""
import hashlib
import json
import pathlib
import subprocess
import tempfile
import unittest


class ArtifactTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="csc-artifact-")
        self.addCleanup(self.temp.cleanup)
        self.root = pathlib.Path(self.temp.name)
        self.artifact = b"synthetic release artifact\n"
        self.statement = {
            "_type": "https://in-toto.io/Statement/v1",
            "subject": [{"name": "release.bin", "digest": {"sha256": hashlib.sha256(self.artifact).hexdigest()}}],
            "predicateType": "https://slsa.dev/provenance/v1",
            "predicate": {"buildDefinition": {"buildType": "https://lab.example/build/v1",
                            "externalParameters": {"source": "https://lab.example/repository@approved-commit"}},
                          "runDetails": {"builder": {"id": "https://lab.example/trusted-builder"}}}}
        self.openssl("genpkey", "-algorithm", "RSA", "-pkeyopt", "rsa_keygen_bits:2048", "-out", "key.pem")
        self.openssl("pkey", "-in", "key.pem", "-pubout", "-out", "trusted.pem")

    def openssl(self, *args):
        return subprocess.run(["openssl", *args], cwd=self.root, capture_output=True, check=True)

    def sign(self, statement):
        (self.root / "statement.json").write_text(json.dumps(statement, sort_keys=True))
        self.openssl("dgst", "-sha256", "-sign", "key.pem", "-out", "statement.sig", "statement.json")

    def verify(self, artifact):
        self.openssl("dgst", "-sha256", "-verify", "trusted.pem", "-signature", "statement.sig", "statement.json")
        statement = json.loads((self.root / "statement.json").read_text())
        if statement["subject"][0]["digest"]["sha256"] != hashlib.sha256(artifact).hexdigest():
            raise ValueError("artifact digest")
        if statement["predicate"]["runDetails"]["builder"]["id"] != "https://lab.example/trusted-builder":
            raise ValueError("builder identity")
        if statement["predicate"]["buildDefinition"]["externalParameters"]["source"] != "https://lab.example/repository@approved-commit":
            raise ValueError("source revision")

    def test_valid_release(self):
        self.sign(self.statement)
        self.verify(self.artifact)

    def test_artifact_changed_after_signing(self):
        self.sign(self.statement)
        with self.assertRaisesRegex(ValueError, "digest"):
            self.verify(b"modified release")

    def test_statement_changed_after_signing(self):
        self.sign(self.statement)
        (self.root / "statement.json").write_text("{}")
        with self.assertRaises(subprocess.CalledProcessError):
            self.verify(self.artifact)

    def test_signed_but_unapproved_builder(self):
        self.statement["predicate"]["runDetails"]["builder"]["id"] = "https://lab.example/other-builder"
        self.sign(self.statement)
        with self.assertRaisesRegex(ValueError, "builder"):
            self.verify(self.artifact)

    def test_signed_but_unapproved_source(self):
        self.statement["predicate"]["buildDefinition"]["externalParameters"]["source"] = "https://lab.example/fork@other-commit"
        self.sign(self.statement)
        with self.assertRaisesRegex(ValueError, "source"):
            self.verify(self.artifact)


if __name__ == "__main__":
    unittest.main(verbosity=2)
