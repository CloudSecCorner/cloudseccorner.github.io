defmodule CloudSecurityCornerWeb.PageController do
  use CloudSecurityCornerWeb, :controller

  def home(conn, _params) do
    render(conn, :home,
      page_title: "Practical agentic cloud security",
      description:
        "Practical tools, labs, and guidance for securing AI agents, autonomous cloud workloads, and the systems they can access.",
      tool_count: CloudSecurityCorner.Content.tool_count(),
      lab_count: length(CloudSecurityCorner.Content.labs()),
      post_count: length(CloudSecurityCorner.Content.blog_posts())
    )
  end

  def about(conn, _params) do
    render(conn, :about,
      page_title: "About Cloud Security Corner",
      description:
        "An open community making agentic cloud security practical for security teams and builders."
    )
  end
end
