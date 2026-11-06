defmodule CloudSecurityCornerWeb.KspmArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.kspm_best_practice_count()

    render(conn, :index,
      page_title: "Kubernetes Developer Architectures & Deployment Patterns",
      description:
        "Kubernetes workload integration and deployment diagrams with service logos, manifests, admission policy, and verification steps for developers.",
      count: count
    )
  end
end
