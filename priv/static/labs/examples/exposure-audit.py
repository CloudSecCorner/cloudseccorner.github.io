"""Run a bounded Nmap audit against this process's loopback-only HTTP service."""
import http.server
import pathlib
import shutil
import subprocess
import tempfile
import threading
import unittest
import xml.etree.ElementTree as ET


def open_ports(xml):
    root = ET.fromstring(xml)
    return {(port.attrib["protocol"], int(port.attrib["portid"]))
            for port in root.findall("./host/ports/port") if port.find("state").attrib["state"] == "open"}


class AuditTests(unittest.TestCase):
    def test_state_is_not_service_or_vulnerability_proof(self):
        fixture = '<nmaprun><host><ports><port protocol="tcp" portid="80"><state state="open"/></port><port protocol="tcp" portid="81"><state state="filtered"/></port></ports></host></nmaprun>'
        self.assertEqual(open_ports(fixture), {("tcp", 80)})

    @unittest.skipUnless(shutil.which("nmap"), "Install Nmap to run the actual local scan")
    def test_real_local_service_then_closed_port(self):
        class Handler(http.server.BaseHTTPRequestHandler):
            def handle(self):
                # A connect scan may reset immediately after establishing TCP.
                try:
                    super().handle()
                except (ConnectionResetError, BrokenPipeError):
                    pass

            def do_GET(self):
                self.send_response(200)
                self.end_headers()
                self.wfile.write(b"synthetic audit target\n")

            def log_message(self, *args):
                pass

        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        port = server.server_port
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        self.addCleanup(server.server_close)
        with tempfile.TemporaryDirectory(prefix="csc-nmap-") as directory:
            def scan(name):
                target = pathlib.Path(directory) / name
                subprocess.run(["nmap", "-sT", "-Pn", "-n", "-p", str(port), "--max-retries", "1",
                                "--host-timeout", "20s", "-oX", str(target), "127.0.0.1"],
                               check=True, capture_output=True, timeout=25)
                return open_ports(target.read_text())

            try:
                self.assertIn(("tcp", port), scan("before.xml"))
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)
            self.assertNotIn(("tcp", port), scan("after.xml"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
