defmodule CloudSecurityCornerWeb.CivoArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.civo_best_practice_count()

    conn
    |> assign(:page_title, "Civo Cloud Developer Architectures & Integration Patterns")
    |> assign(
      :meta_description,
      "Civo Cloud K3s Kubernetes, Deep Lake GPU computing, object storage, and microservices architecture blueprints with Terraform, OPA policy, and STRIDE threat modeling."
    )
    |> assign(:total_count, count)
    |> render(:index)
  end
end
