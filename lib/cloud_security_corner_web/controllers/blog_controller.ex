defmodule CloudSecurityCornerWeb.BlogController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    render(conn, :index,
      page_title: "Field Notes — Daily Cloud Security Feed",
      description:
        "Daily cloud security research from AWS, Google Cloud, Microsoft, Wiz and Datadog, alongside practical cloud defense guides.",
      feed: CloudSecurityCorner.Feeds.snapshot(),
      posts: CloudSecurityCorner.Content.blog_posts()
    )
  end

  def show(conn, %{"id" => id}) do
    case CloudSecurityCorner.Content.blog_post(id) do
      {:ok, post, content_html} ->
        render(conn, :show,
          page_title: post["title"],
          description: post["excerpt"],
          canonical_path: "/blog/" <> post["id"],
          post: post,
          content_html: content_html
        )

      :error ->
        conn
        |> put_status(:not_found)
        |> put_view(html: CloudSecurityCornerWeb.NotFoundHTML)
        |> render(:not_found,
          page_title: "Post not found",
          description: "The requested post could not be found."
        )
    end
  end
end
