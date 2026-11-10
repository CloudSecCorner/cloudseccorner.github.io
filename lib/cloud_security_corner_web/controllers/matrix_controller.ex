defmodule CloudSecurityCornerWeb.MatrixController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    conn
    |> assign(:page_title, "Cross-Cloud Security Rosetta Stone Matrix")
    |> assign(
      :meta_description,
      "Side-by-side security controls, CLI commands, Terraform IaC, and OPA Rego policies across all 11 cloud providers."
    )
    |> render(:index)
  end
end
