defmodule CloudSecurityCornerWeb.AzureArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.azure_best_practice_count()

    render(conn, :index,
      page_title: "1,000+ Azure Best Practices Architecture Diagrams (Pele, OPA & Terraform)",
      description:
        "Comprehensive collection of 1,000+ Azure Architecture Best Practices and CIS Azure Benchmark diagrams rendered with Obsidian Pele, paired with production OPA Rego policies and hardened Terraform IaC.",
      count: count
    )
  end
end
