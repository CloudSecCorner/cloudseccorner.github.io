defmodule CloudSecurityCornerWeb.LabsController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, params) do
    query = params |> Map.get("q", "") |> String.trim()
    category = Map.get(params, "category", "")
    labs = CloudSecurityCorner.Content.search_labs(query, category)

    render(conn, :index,
      page_title: "Hands-on Security Labs",
      description: "Practice threat modeling, cloud defense, zero trust, and agentic security.",
      query: query,
      category: category,
      categories: CloudSecurityCorner.Content.lab_categories(),
      labs: labs
    )
  end

  def show(conn, %{"id" => id}) do
    case CloudSecurityCorner.Content.lab(id) do
      {:ok, lab, content_html} ->
        render(conn, :show,
          page_title: lab["title"],
          description: lab["description"],
          lab: lab,
          content_html: content_html
        )

      :error ->
        conn
        |> put_status(:not_found)
        |> render(CloudSecurityCornerWeb.NotFoundHTML, :not_found,
          page_title: "Lab not found",
          description: "The requested lab could not be found."
        )
    end
  end
end
