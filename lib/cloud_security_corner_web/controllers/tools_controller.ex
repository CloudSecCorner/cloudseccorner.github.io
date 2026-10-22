defmodule CloudSecurityCornerWeb.ToolsController do
  use CloudSecurityCornerWeb, :controller

  def index(conn, params) do
    query = params |> Map.get("q", "") |> String.trim()
    category = Map.get(params, "category", "")
    sort = Map.get(params, "sort", "default")
    page = parse_page(Map.get(params, "page"))
    result = CloudSecurityCorner.Content.search_tools(query, category, sort, page)

    render(conn, :index,
      page_title: "Agentic AI & Cloud Security Tools",
      description: "Browse and search a curated directory of cloud and agentic security tools.",
      query: query,
      category: category,
      sort: sort,
      result: result
    )
  end

  defp parse_page(page) when is_binary(page) do
    case Integer.parse(page) do
      {number, ""} when number > 0 -> number
      _ -> 1
    end
  end

  defp parse_page(_), do: 1
end
