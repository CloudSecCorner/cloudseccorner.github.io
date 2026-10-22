defmodule CloudSecurityCornerWeb.BlogController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    render(conn, :index,
      page_title: "Agentic Cloud Security Blog",
      description:
        "Research and practical guidance for securing agents and cloud infrastructure.",
      posts: CloudSecurityCorner.Content.blog_posts()
    )
  end

  def show(conn, %{"id" => id}) do
    case CloudSecurityCorner.Content.blog_post(id) do
      {:ok, post, content_html} ->
        render(conn, :show,
          page_title: post["title"],
          description: post["excerpt"],
          post: post,
          content_html: content_html
        )

      :error ->
        conn
        |> put_status(:not_found)
        |> render(CloudSecurityCornerWeb.NotFoundHTML, :not_found,
          page_title: "Post not found",
          description: "The requested post could not be found."
        )
    end
  end
end
