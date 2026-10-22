defmodule CloudSecurityCornerTest do
  use ExUnit.Case, async: true

  alias CloudSecurityCorner.Content
  alias CloudSecurityCornerWeb.Endpoint

  test "loads the existing tools, labs, and blog catalogue" do
    assert Content.tool_count() > 30_000
    assert length(Content.labs()) == 6
    assert length(Content.blog_posts()) == 1
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
    assert conn.resp_body =~ "Make agentic cloud security"
    assert conn.resp_body =~ "Cloud Security Corner"
  end

  test "renders filtered tool results from the directory route" do
    conn =
      Plug.Test.conn(:get, "/tools?q=cve-2026-106173")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 200
    assert conn.resp_body =~ "Cve-2026-106173"
    assert conn.resp_body =~ "tools found"
  end

  test "returns a not found page for an unknown route" do
    conn =
      Plug.Test.conn(:get, "/this-page-does-not-exist")
      |> Endpoint.call(Endpoint.init([]))

    assert conn.status == 404
    assert conn.resp_body =~ "Page not found"
  end
end
