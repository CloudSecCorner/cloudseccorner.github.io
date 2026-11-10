defmodule CloudSecurityCornerWeb.HetznerArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.hetzner_best_practice_count()

    conn
    |> assign(:page_title, "Hetzner Cloud Developer Architectures & European Security Baseline")
    |> assign(
      :meta_description,
      "Hetzner Cloud CX/CPX servers, private networks, firewalls, and storage box architecture blueprints with Terraform, OPA policy, and STRIDE threat modeling."
    )
    |> assign(:total_count, count)
    |> render(:index)
  end
end
