defmodule CloudSecurityCornerWeb.AwsArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.aws_best_practice_count()

    render(conn, :index,
      page_title: "1,000+ AWS Best Practices Architecture Diagrams (Pele, OPA & Terraform)",
      description:
        "Comprehensive collection of 1,000+ AWS Well-Architected and CIS Benchmark architecture diagrams rendered with Obsidian Pele, paired with production OPA Rego policies and Terraform IaC.",
      count: count
    )
  end
end
