defmodule CloudSecurityCornerWeb.CnappArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.cnapp_best_practice_count()

    render(conn, :index,
      page_title: "CNAPP & MITRE ATT&CK Developer Architectures with OPA Remediation",
      description:
        "Cloud Native Application Protection Platform (CNAPP) defense-in-depth architectures, MITRE ATT&CK matrix mitigation, OPA Gatekeeper policies, and automated threat remediation.",
      count: count
    )
  end
end
