defmodule CloudSecurityCornerTest do
  use ExUnit.Case, async: true

  alias CloudSecurityCorner.Content
  alias CloudSecurityCornerWeb.Endpoint

  test "loads the existing tools, labs, and blog catalogue" do
    assert Content.tool_count() > 30_000
    assert length(Content.labs()) >= 10
    assert length(Content.blog_posts()) >= 10
    assert Content.aws_best_practice_count() >= 1000
    assert Content.azure_best_practice_count() >= 1000
    assert Content.gcp_best_practice_count() >= 1000
    assert Content.kspm_best_practice_count() >= 1000
    assert Content.vultr_best_practice_count() >= 1000
    assert Content.oracle_best_practice_count() >= 1000
  end

  test "renders the AWS Defender path, paired field notes, and downloadable examples" do
    conn = Plug.Test.conn(:get, "/labs") |> Endpoint.call(Endpoint.init([]))
    assert conn.status == 200
    assert conn.resp_body =~ "AWS Defender Practice Path"

    for id <-
          ~w(AWS-Credential-Review AWS-Role-Delegation AWS-S3-Plan-Review AWS-CloudTrail-Triage) do
      assert {:ok, lab, html} = Content.lab(id)
      assert lab["track"] == "AWS Defender"
      assert html =~ "Expected evidence"
      assert {:ok, _, note} = Content.blog_post(id)
      assert note =~ "Reviewed: 2026-11-07"
      assert conn.resp_body =~ "/labs/#{id}"
      assert conn.resp_body =~ "/blog/#{id}"
    end
  end

  test "renders aws architectures route and loads best practices" do
    conn =
      Plug.Test.conn(:get, "/aws-architectures")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 200
    assert conn.resp_body =~ "Obsidian Pele"
    assert conn.resp_body =~ "1,000+ AWS Architecture Best Practices"
    assert_frontend_or_legacy(conn, "aws-architectures.js")
  end

  test "renders azure architectures route and loads best practices" do
    conn =
      Plug.Test.conn(:get, "/azure-architectures")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 200
    assert conn.resp_body =~ "Obsidian Pele"
    assert conn.resp_body =~ "1,000+ Azure Architecture Best Practices"
    assert_frontend_or_legacy(conn, "azure-architectures.js")
  end

  test "renders gcp architectures route and loads best practices" do
    conn =
      Plug.Test.conn(:get, "/gcp-architectures")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 200
    assert conn.resp_body =~ "Obsidian Pele"
    assert conn.resp_body =~ "1,000+ GCP Architecture Best Practices"
    assert_frontend_or_legacy(conn, "gcp-architectures.js")
  end

  test "renders kspm architectures route and loads best practices" do
    conn =
      Plug.Test.conn(:get, "/kspm-architectures")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 200
    assert conn.resp_body =~ "Obsidian Pele"
    assert conn.resp_body =~ "1,000+ KSPM Kubernetes Architecture"
    assert_frontend_or_legacy(conn, "kspm-architectures.js")
  end

  test "renders vultr architectures route and loads best practices" do
    conn =
      Plug.Test.conn(:get, "/vultr-architectures")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 200
    assert conn.resp_body =~ "Obsidian Pele"
    assert conn.resp_body =~ "1,000+ Vultr Architecture Best Practices"
    assert_frontend_or_legacy(conn, "vultr-architectures.js")
  end

  test "renders oracle architectures route and loads best practices" do
    conn =
      Plug.Test.conn(:get, "/oracle-architectures")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 200
    assert conn.resp_body =~ "Obsidian Pele"
    assert conn.resp_body =~ "1,000+ Oracle Cloud Architecture Best Practices"
    assert_frontend_or_legacy(conn, "oracle-architectures.js")
  end

  test "searches and paginates the tool directory" do
    results = Content.search_tools("cve-2026-106173", "", "az", 1)

    assert results.total == 2
    assert length(results.tools) == 2
    assert results.page == 1
    assert results.page_count == 1
  end

  test "filters labs and renders their markdown" do
    assert [%{"id" => "Agentic-Cloud-Security"}] =
             Content.search_labs("", "Agentic Security")

    assert {:ok, lab, html} = Content.lab("Agentic-Cloud-Security")
    assert lab["title"] == "Agentic Cloud Security Essentials"
    assert html =~ "<h1>"
  end

  test "renders blog markdown and responds to the home route" do
    [post | _] = Content.blog_posts()
    assert {:ok, ^post, html} = Content.blog_post(post["id"])
    assert html =~ "<h1>"

    conn =
      Plug.Test.conn(:get, "/")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 200
    assert conn.resp_body =~ "Build cloud integrations"
    assert conn.resp_body =~ "4,132"
    assert conn.resp_body =~ "Cloud Security Corner"
  end

  test "renders tool directory route and searches tools" do
    conn =
      Plug.Test.conn(:get, "/tools")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 200
    assert conn.resp_body =~ "kube-tools"
    assert_frontend_or_legacy(conn, "tools.js")

    result = Content.search_tools("cve-2026-106173", "", "default", 1)
    assert result.total > 0
    [tool | _] = result.tools
    assert tool["title"] =~ "Cve-2026-106173"
  end

  test "returns a not found page for an unknown route" do
    conn =
      Plug.Test.conn(:get, "/this-page-does-not-exist")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 404
    assert conn.resp_body =~ "Page not found"
  end

  test "serves the daily cloud security reader and subscription assets through Elixir" do
    page = Plug.Test.conn(:get, "/blog") |> Endpoint.call(Endpoint.init([]))
    assert page.status == 200
    assert page.resp_body =~ "Daily Cloud Security Feed"
    assert page.resp_body =~ ~s(id="cloud-feed")
    assert page.resp_body =~ "Feed addresses and source status"
    assert page.resp_body =~ ~s(href="/feeds/cloud-security.xml")

    data =
      Plug.Test.conn(:get, "/data/cloud-security-feed.json") |> Endpoint.call(Endpoint.init([]))

    assert data.status == 200
    assert Jason.decode!(data.resp_body) == CloudSecurityCorner.Feeds.snapshot()

    for path <- ["/feeds/cloud-security.xml", "/feeds/cloud-security.opml"] do
      response = Plug.Test.conn(:get, path) |> Endpoint.call(Endpoint.init([]))
      assert response.status == 200
      assert response.resp_body =~ "<?xml"
    end
  end

  defp assert_frontend_or_legacy(conn, legacy_script) do
    if assets = CloudSecurityCorner.Frontend.assets() do
      assert conn.resp_body =~ ~s(src="#{assets.entry}")
      refute conn.resp_body =~ ~s(src="/assets/pele.global.js")
      refute conn.resp_body =~ ~s(src="/tools.js")
    else
      assert conn.resp_body =~ legacy_script
    end
  end
end
