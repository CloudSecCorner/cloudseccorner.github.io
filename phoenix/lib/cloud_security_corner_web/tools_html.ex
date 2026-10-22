defmodule CloudSecurityCornerWeb.ToolsHTML do
  use CloudSecurityCornerWeb, :html

  embed_templates("tools_html/*")

  def page_url(query, category, sort, page) do
    URI.encode_query(%{
      "q" => query,
      "category" => category,
      "sort" => sort,
      "page" => Integer.to_string(page)
    })
    |> then(&("/tools?" <> &1))
  end
end
