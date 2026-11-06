defmodule CloudSecurityCornerWeb.GcpArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.gcp_best_practice_count()

    render(conn, :index,
      page_title: "Google Cloud Developer Architectures & Integration Patterns",
      description:
        "Google Cloud application integration and deployment diagrams with service logos, Terraform examples, OPA policy, and verification steps for developers.",
      count: count
    )
  end
end
