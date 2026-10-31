defmodule CloudSecurityCornerWeb.KspmArchitectureController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, _params) do
    count = CloudSecurityCorner.Content.kspm_best_practice_count()

    render(conn, :index,
      page_title: "1,000+ KSPM Kubernetes Architecture Best Practices (Pele, OPA & Manifests)",
      description:
        "Comprehensive collection of 1,000+ Kubernetes Security Posture Management (KSPM) and pod-level defense blueprints rendered with Obsidian Pele, paired with production OPA Rego admission policies and hardened Kubernetes manifests.",
      count: count
    )
  end
end
