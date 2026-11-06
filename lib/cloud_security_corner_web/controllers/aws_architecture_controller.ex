defmodule CloudSecurityCornerWeb.AwsArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.aws_best_practice_count()

    render(conn, :index,
      page_title: "AWS Developer Architectures & Integration Patterns",
      description:
        "AWS application integration and deployment diagrams with service logos, Terraform examples, OPA policy, and verification steps for developers.",
      count: count
    )
  end
end
