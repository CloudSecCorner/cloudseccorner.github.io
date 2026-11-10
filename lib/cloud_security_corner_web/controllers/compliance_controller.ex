defmodule CloudSecurityCornerWeb.ComplianceController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    conn
    |> assign(:page_title, "Regulatory Compliance Framework Explorer")
    |> assign(
      :meta_description,
      "Audit-ready security architecture mappings and automated OPA Rego policy controls for CIS Benchmarks, NIST SP 800-53, PCI-DSS, SOC 2, and MITRE ATT&CK."
    )
    |> render(:index)
  end
end
