"""Real local mTLS with URI identity authorization; not a SPIRE deployment."""
import http.client
import http.server
import pathlib
import ssl
import subprocess
import tempfile
import threading
import unittest


class IdentityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="csc-mtls-")
        cls.addClassCleanup(cls.temp.cleanup)
        cls.root = pathlib.Path(cls.temp.name)

        def openssl(*args):
            subprocess.run(["openssl", *args], cwd=cls.root, check=True, capture_output=True)

        openssl("req", "-x509", "-newkey", "rsa:2048", "-nodes", "-days", "1",
                "-subj", "/CN=CSC local lab CA", "-keyout", "ca.key", "-out", "ca.crt",
                "-addext", "basicConstraints=critical,CA:TRUE,pathlen:0",
                "-addext", "keyUsage=critical,keyCertSign,cRLSign",
                "-addext", "subjectKeyIdentifier=hash")
        for name, usage, san in [
            ("server", "serverAuth", "DNS:localhost,IP:127.0.0.1"),
            ("frontend", "clientAuth", "URI:spiffe://lab.example/frontend"),
            ("analytics", "clientAuth", "URI:spiffe://lab.example/analytics"),
        ]:
            openssl("req", "-new", "-newkey", "rsa:2048", "-nodes", "-subj", f"/CN={name}",
                    "-keyout", f"{name}.key", "-out", f"{name}.csr")
            (cls.root / f"{name}.ext").write_text(
                "basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature,keyEncipherment\n"
                f"extendedKeyUsage={usage}\nsubjectAltName={san}\n"
                "subjectKeyIdentifier=hash\nauthorityKeyIdentifier=keyid,issuer\n")
            openssl("x509", "-req", "-in", f"{name}.csr", "-CA", "ca.crt", "-CAkey", "ca.key",
                    "-CAcreateserial", "-days", "1", "-extfile", f"{name}.ext", "-out", f"{name}.crt")

        class Handler(http.server.BaseHTTPRequestHandler):
            def do_GET(self):
                uris = [value for kind, value in self.connection.getpeercert().get("subjectAltName", []) if kind == "URI"]
                allowed = uris == ["spiffe://lab.example/frontend"] and self.path == "/evidence"
                self.send_response(200 if allowed else 403)
                self.end_headers()
                self.wfile.write(b"allowed\n" if allowed else b"denied\n")

            def log_message(self, *args):
                pass

        cls.server = http.server.HTTPServer(("127.0.0.1", 0), Handler)
        ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        ctx.load_cert_chain(cls.root / "server.crt", cls.root / "server.key")
        ctx.load_verify_locations(cls.root / "ca.crt")
        ctx.verify_mode = ssl.CERT_REQUIRED
        cls.server.socket = ctx.wrap_socket(cls.server.socket, server_side=True)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=5)

    def request(self, client=None, path="/evidence", headers=None, trust=True):
        ctx = ssl.create_default_context(cafile=str(self.root / "ca.crt") if trust else None)
        if client:
            ctx.load_cert_chain(self.root / f"{client}.crt", self.root / f"{client}.key")
        conn = http.client.HTTPSConnection("127.0.0.1", self.server.server_port, context=ctx, timeout=5)
        try:
            conn.request("GET", path, headers=headers or {})
            response = conn.getresponse()
            response.read()
            return response.status
        finally:
            conn.close()

    def test_allowed_identity(self):
        self.assertEqual(self.request("frontend"), 200)

    def test_trusted_but_unauthorized_identity_and_spoofed_header(self):
        self.assertEqual(self.request("analytics", headers={"X-Workload-Identity": "spiffe://lab.example/frontend"}), 403)

    def test_authenticated_identity_still_needs_route_permission(self):
        self.assertEqual(self.request("frontend", path="/admin"), 403)

    def test_missing_client_certificate(self):
        with self.assertRaises((ssl.SSLError, ConnectionError, http.client.RemoteDisconnected)):
            self.request()

    def test_untrusted_server_certificate(self):
        with self.assertRaises(ssl.SSLCertVerificationError):
            self.request("frontend", trust=False)


if __name__ == "__main__":
    unittest.main(verbosity=2)
