defmodule CloudSecurityCornerWeb.AlicloudArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.alicloud_best_practice_count()

    conn
    |> assign(:page_title, "Alibaba Cloud Developer Architectures & Integration Patterns")
    |> assign(
      :meta_description,
      "Alibaba Cloud application integration and deployment diagrams with service logos, Terraform examples, OPA policy, and verification steps for developers."
    )
    |> assign(:total_count, count)
    |> render(:index)
  end
end
