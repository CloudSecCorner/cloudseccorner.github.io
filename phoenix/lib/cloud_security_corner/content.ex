defmodule CloudSecurityCorner.Content do
  use GenServer

  @page_size 24

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  @impl true
  def init(:ok) do
    data = %{
      tools: read_json!("security-entries.json"),
      blogs: read_json!("blog.json")["blogs"],
      labs: read_json!("labs.json")["labs"]
    }

    {:ok, data}
  end

  def tools, do: GenServer.call(__MODULE__, :tools)
  def blog_posts, do: GenServer.call(__MODULE__, :blogs)
  def labs, do: GenServer.call(__MODULE__, :labs)
  def tool_count, do: length(tools())

  def lab_categories do
    labs()
    |> Enum.map(& &1["category"])
    |> Enum.reject(&is_nil/1)
    |> Enum.uniq()
    |> Enum.sort()
  end

  def search_labs(query, category) do
    query = String.downcase(query)

    labs()
    |> Enum.filter(fn lab ->
      category_matches?(lab, category) and
        Enum.any?(
          [lab["title"], lab["description"], lab["category"]] ++ (lab["tags"] || []),
          fn value ->
            String.contains?(String.downcase(value || ""), query)
          end
        )
    end)
  end

  def search_tools(query, category, sort, page) do
    query = String.downcase(query)

    filtered =
      tools()
      |> Enum.filter(fn tool ->
        category_matches?(tool, category) and
          Enum.any?([tool["title"], tool["description"], tool["tag"]], fn value ->
            String.contains?(String.downcase(value || ""), query)
          end)
      end)
      |> sort_tools(sort)

    total = length(filtered)
    page_count = max(div(total + @page_size - 1, @page_size), 1)
    page = min(max(page, 1), page_count)

    %{
      tools: Enum.slice(filtered, (page - 1) * @page_size, @page_size),
      categories: tool_categories(),
      total: total,
      page: page,
      page_count: page_count,
      page_size: @page_size
    }
  end

  def lab(id) do
    case Enum.find(labs(), &(&1["id"] == id)) do
      nil -> :error
      entry -> load_markdown(entry, "path", "labs")
    end
  end

  def blog_post(id) do
    case Enum.find(blog_posts(), &(&1["id"] == id)) do
      nil -> :error
      entry -> load_markdown(entry, "file", "blog")
    end
  end

  @impl true
  def handle_call(:tools, _from, state), do: {:reply, state.tools, state}
  def handle_call(:blogs, _from, state), do: {:reply, state.blogs, state}
  def handle_call(:labs, _from, state), do: {:reply, state.labs, state}

  defp read_json!(filename) do
    filename
    |> data_path()
    |> File.read!()
    |> Jason.decode!()
  end

  defp data_path(filename) do
    Application.app_dir(:cloud_security_corner, Path.join("priv/data", filename))
  end

  defp load_markdown(entry, key, directory) do
    filename = entry[key] |> Path.basename()

    path =
      Application.app_dir(:cloud_security_corner, Path.join(["priv/static", directory, filename]))

    with {:ok, markdown} <- File.read(path) do
      html =
        case Earmark.as_html(markdown, escape: false) do
          {:ok, html, _messages} ->
            html

          {:error, html, _errors} when is_binary(html) and byte_size(html) > 0 ->
            html

          other ->
            raise "Unable to render #{directory}/#{filename}: #{inspect(other)}"
        end

      {:ok, entry, html}
    else
      {:error, reason} ->
        raise "Unable to read #{directory}/#{filename}: #{inspect(reason)}"
    end
  end

  defp tool_categories do
    tools()
    |> Enum.map(& &1["tag"])
    |> Enum.reject(&is_nil/1)
    |> Enum.uniq()
    |> Enum.sort()
  end

  defp category_matches?(_entry, ""), do: true

  defp category_matches?(entry, category),
    do: entry["category"] == category or entry["tag"] == category

  defp sort_tools(tools, "az"), do: Enum.sort_by(tools, &String.downcase(&1["title"] || ""))

  defp sort_tools(tools, "za"),
    do: Enum.sort_by(tools, &String.downcase(&1["title"] || ""), :desc)

  defp sort_tools(tools, _sort), do: tools
end
