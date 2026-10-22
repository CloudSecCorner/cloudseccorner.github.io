defmodule Mix.Tasks.Site.Export do
  @moduledoc """
  Renders the public CloudSecurityCorner routes into a static directory for GitHub Pages.
  """

  use Mix.Task

  alias CloudSecurityCornerWeb.Endpoint

  @shortdoc "Exports CloudSecurityCorner as a static site for GitHub Pages"

  @impl Mix.Task
  def run(args) do
    {options, _, _} = OptionParser.parse(args, strict: [output: :string])
    output = options[:output] || "_site"

    Mix.Task.run("app.start")
    output = Path.expand(output)

    File.rm_rf!(output)
    File.mkdir_p!(output)

    # 1. Copy priv/static assets (canonical static assets)
    priv_static = Application.app_dir(:cloud_security_corner, "priv/static")

    if File.dir?(priv_static) do
      File.cp_r!(priv_static, output)
    end

    # 3. Ensure assets directory exists
    File.mkdir_p!(Path.join(output, "assets"))

    # 4. Render all public routes into static HTML
    Enum.each(routes(), &write_page(output, &1))

    # 5. Render 404 page
    write_404(output)

    # 6. Write GitHub Pages configuration files
    File.write!(Path.join(output, "robots.txt"), robots_txt())
    File.write!(Path.join(output, "sitemap.xml"), sitemap_xml())
    File.write!(Path.join(output, "CNAME"), "cloudsecuritycorner.com\n")
    File.touch!(Path.join(output, ".nojekyll"))

    Mix.shell().info("Successfully exported static site to #{output}")
  end

  def routes do
    base_routes = ["/", "/tools", "/labs", "/blog", "/about"]

    lab_routes =
      try do
        CloudSecurityCorner.Content.labs()
        |> Enum.flat_map(fn lab ->
          id = lab["id"]
          lower = String.downcase(id)
          if id == lower, do: ["/labs/#{id}"], else: ["/labs/#{id}", "/labs/#{lower}"]
        end)
      rescue
        _ -> []
      end

    blog_routes =
      try do
        CloudSecurityCorner.Content.blog_posts()
        |> Enum.flat_map(fn post ->
          id = post["id"]
          lower = String.downcase(id)
          if id == lower, do: ["/blog/#{id}"], else: ["/blog/#{id}", "/blog/#{lower}"]
        end)
      rescue
        _ -> []
      end

    base_routes ++ lab_routes ++ blog_routes
  end

  defp write_page(output, path) do
    conn =
      :get
      |> Plug.Test.conn(path)
      |> Map.put(:host, "cloudsecuritycorner.com")
      |> Map.put(:scheme, :https)
      |> Endpoint.call([])

    if conn.status != 200 do
      Mix.raise("Could not export #{path}: received HTTP #{conn.status}")
    end

    destination =
      case path do
        "/" -> Path.join(output, "index.html")
        "/sitemap.xml" -> Path.join(output, "sitemap.xml")
        "/robots.txt" -> Path.join(output, "robots.txt")
        _ -> Path.join([output, String.trim_leading(path, "/"), "index.html"])
      end

    destination |> Path.dirname() |> File.mkdir_p!()
    File.write!(destination, conn.resp_body)
  end

  defp write_404(output) do
    conn =
      :get
      |> Plug.Test.conn("/non-existent-page-for-404-export")
      |> Map.put(:host, "cloudsecuritycorner.com")
      |> Map.put(:scheme, :https)
      |> Endpoint.call([])

    destination = Path.join(output, "404.html")
    File.write!(destination, conn.resp_body)
  end

  defp robots_txt do
    """
    User-agent: *
    Allow: /

    Sitemap: https://cloudsecuritycorner.com/sitemap.xml
    """
  end

  defp sitemap_xml do
    urls =
      routes()
      |> Enum.map(fn path ->
        """
          <url>
            <loc>https://cloudsecuritycorner.com#{path}</loc>
            <changefreq>daily</changefreq>
            <priority>#{if path == "/", do: "1.0", else: "0.8"}</priority>
          </url>
        """
      end)
      |> Enum.join("")

    """
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    #{urls}
    </urlset>
    """
  end
end
