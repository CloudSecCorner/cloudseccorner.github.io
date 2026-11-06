defmodule CloudSecurityCorner.FrontendTest do
  use ExUnit.Case, async: false

  alias CloudSecurityCorner.Frontend
  alias CloudSecurityCornerWeb.Endpoint

  setup do
    directory = Path.join(System.tmp_dir!(), "csc-frontend-#{System.unique_integer([:positive])}")
    previous = Application.fetch_env(:cloud_security_corner, :frontend_directory)
    File.mkdir_p!(directory)
    Application.put_env(:cloud_security_corner, :frontend_directory, directory)

    on_exit(fn ->
      File.rm_rf!(directory)

      case previous do
        {:ok, value} -> Application.put_env(:cloud_security_corner, :frontend_directory, value)
        :error -> Application.delete_env(:cloud_security_corner, :frontend_directory)
      end
    end)

    %{directory: directory}
  end

  test "keeps Phoenix content and legacy controls usable without a React build" do
    refute Frontend.enabled?()
    conn = request("/aws-architectures")
    assert conn.status == 200
    assert conn.resp_body =~ ~s(id="root")
    assert conn.resp_body =~ "1,000+ AWS Architecture Best Practices"
    assert conn.resp_body =~ ~s(src="/assets/aws-architectures.js")
    refute conn.resp_body =~ ~s(src="/assets/react-test.js")
  end

  test "resolves recursive imports and deduplicates shared styles", %{directory: directory} do
    write_build(directory)
    assets = Frontend.validate_build!()
    assert assets.entry == "/assets/react-test.js"
    assert assets.stylesheets == ["/assets/react-test.css", "/assets/shared.css"]
    assert assets.preloads == ["/assets/vendor.js", "/assets/shared.js"]
  end

  test "embeds React on content, query, and unknown routes without legacy script conflicts", %{
    directory: directory
  } do
    write_build(directory)

    for {route, status, content} <- [
          {"/", 200, "Cloud Security Corner"},
          {"/aws-architectures", 200, "AWS Architecture Best Practices"},
          {"/tools?q=cve-2026-106173", 200, "Cve-2026-106173"},
          {"/labs/Agentic-Cloud-Security", 200, "Agentic Cloud Security Essentials"},
          {"/unknown-page", 404, "Page not found"}
        ] do
      conn = request(route)
      assert conn.status == status
      assert conn.resp_body =~ content
      assert conn.resp_body =~ ~s(data-renderer="elixir")
      assert conn.resp_body =~ ~s(src="/assets/react-test.js")
      assert conn.resp_body =~ ~s(href="/assets/shared.css")
      assert conn.resp_body =~ ~s(rel="modulepreload")
      refute conn.resp_body =~ ~s(src="/site.js)
      refute conn.resp_body =~ ~s(src="/tools.js")
      refute conn.resp_body =~ ~s(src="/assets/pele.global.js")
      refute conn.resp_body =~ ~s(src="/assets/aws-architectures.js")
    end
  end

  test "serves built assets through Phoenix while retaining server-owned routes", %{
    directory: directory
  } do
    write_build(directory)
    conn = request("/assets/react-test.js")
    assert conn.status == 200
    assert conn.resp_body == "// react entry\n"
    assert Plug.Conn.get_resp_header(conn, "content-type") |> hd() =~ "javascript"
    assert request("/about").resp_body =~ "About Cloud Security Corner"
  end

  test "rejects a partial build including missing lazy chunks", %{directory: directory} do
    write_build(directory)
    File.rm!(Path.join(directory, "assets/lazy.js"))

    assert_raise RuntimeError, ~r/Vite build is incomplete/, fn ->
      Frontend.validate_build!()
    end
  end

  test "required frontend export fails before replacing a previous artifact", %{
    directory: directory
  } do
    output = Path.join(directory, "previous-export")
    File.mkdir_p!(output)
    File.write!(Path.join(output, "index.html"), "previous deployment")

    assert_raise Mix.Error, ~r/React build missing/, fn ->
      Mix.Tasks.Site.Export.run(["--require-frontend", "--output", output])
    end

    assert File.read!(Path.join(output, "index.html")) == "previous deployment"
  end

  defp request(path), do: Plug.Test.conn(:get, path) |> Endpoint.call(Endpoint.init([]))

  defp write_build(directory) do
    manifest = %{
      "index.html" => %{
        "file" => "assets/react-test.js",
        "isEntry" => true,
        "css" => ["assets/react-test.css"],
        "imports" => ["_shared.js", "_vendor.js"],
        "dynamicImports" => ["src/Lazy.jsx"]
      },
      "_shared.js" => %{
        "file" => "assets/shared.js",
        "imports" => ["_vendor.js"],
        "css" => ["assets/shared.css"]
      },
      "_vendor.js" => %{"file" => "assets/vendor.js", "css" => ["assets/shared.css"]},
      "src/Lazy.jsx" => %{"file" => "assets/lazy.js", "isDynamicEntry" => true}
    }

    File.mkdir_p!(Path.join(directory, ".vite"))
    File.mkdir_p!(Path.join(directory, "assets"))
    File.write!(Path.join(directory, ".vite/manifest.json"), Jason.encode!(manifest))

    for file <- ~w(react-test.js react-test.css shared.css shared.js vendor.js lazy.js) do
      File.write!(Path.join([directory, "assets", file]), "// react entry\n")
    end
  end
end
