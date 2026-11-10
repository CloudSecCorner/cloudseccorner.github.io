defmodule CloudSecurityCornerWeb.OracleArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.oracle_best_practice_count()

    render(conn, :index,
      page_title: "Oracle Cloud (OCI) Developer Architectures & Integration Patterns",
      description:
        "Oracle Cloud Infrastructure (OCI) application integration and deployment diagrams with service logos, Terraform examples, OPA policy, and verification steps for developers.",
      count: count
    )
  end
end
