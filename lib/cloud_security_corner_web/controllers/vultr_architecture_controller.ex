defmodule CloudSecurityCornerWeb.VultrArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.vultr_best_practice_count()

    render(conn, :index,
      page_title: "Vultr Developer Architectures & Integration Patterns",
      description:
        "Vultr application integration and deployment diagrams with service logos, Terraform examples, OPA policy, and verification steps for developers.",
      count: count
    )
  end
end
