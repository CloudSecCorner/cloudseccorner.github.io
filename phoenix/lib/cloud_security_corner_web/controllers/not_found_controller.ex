defmodule CloudSecurityCornerWeb.NotFoundController do
  use CloudSecurityCornerWeb, :controller

  def show(conn, _params) do
    conn
    |> put_status(:not_found)
    |> render(CloudSecurityCornerWeb.NotFoundHTML, :not_found,
      page_title: "Page not found",
      description: "The requested page could not be found."
    )
  end
end
