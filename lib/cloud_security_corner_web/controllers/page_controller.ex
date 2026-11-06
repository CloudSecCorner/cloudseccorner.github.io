defmodule CloudSecurityCornerWeb.PageController do
  use CloudSecurityCornerWeb, :controller

  def home(conn, _params) do
    architecture_count =
      CloudSecurityCorner.Content.aws_best_practice_count() +
        CloudSecurityCorner.Content.azure_best_practice_count() +
        CloudSecurityCorner.Content.gcp_best_practice_count() +
        CloudSecurityCorner.Content.kspm_best_practice_count() + 4

    render(conn, :home,
      page_title: "Developer Architectures & Security Labs",
      description:
        "Application integration patterns for AWS, Azure, Google Cloud and Kubernetes, with configuration examples, hands-on security labs and a searchable tool directory.",
      tool_count: CloudSecurityCorner.Content.tool_count(),
      architecture_count: architecture_count,
      lab_count: length(CloudSecurityCorner.Content.labs()),
      post_count: length(CloudSecurityCorner.Content.blog_posts()),
      feed: CloudSecurityCorner.Feeds.snapshot(),
      categories: CloudSecurityCorner.Content.curated_categories(),
      category_counts: CloudSecurityCorner.Content.category_counts()
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
