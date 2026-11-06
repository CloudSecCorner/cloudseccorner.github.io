defmodule CloudSecurityCornerWeb.AzureArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.azure_best_practice_count()

    render(conn, :index,
      page_title: "Azure Developer Architectures & Integration Patterns",
      description:
        "Azure application integration and deployment diagrams with service logos, Terraform examples, OPA policy, and verification steps for developers.",
      count: count
    )
  end
end
