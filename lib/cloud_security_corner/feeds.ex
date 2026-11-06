defmodule CloudSecurityCorner.Feeds do
  @moduledoc "Daily cloud-security headline aggregation and static publication."

  alias CloudSecurityCorner.Feeds.{Client, Parser}

  @topics [
    "Cloud Security",
    "Identity & Access",
    "Kubernetes & Containers",
    "Vulnerabilities & Exposure",
    "Threat Detection & Response",
    "Data Protection"
  ]

  def sources do
    :cloud_security_corner
    |> Application.app_dir("priv/data/cloud-security-sources.json")
    |> File.read!()
    |> Jason.decode!()
    |> Map.fetch!("sources")
  end

  def snapshot do
    path = Application.app_dir(:cloud_security_corner, "priv/data/cloud-security-feed.json")

    with {:ok, json} <- File.read(path),
         {:ok, %{"version" => 1, "items" => items, "sources" => sources} = data} <-
           Jason.decode(json),
         true <- is_list(items) and is_list(sources) do
      data
    else
      _ -> empty()
    end
  end

  def empty do
    %{
      "version" => 1,
      "updated_at" => nil,
      "attempted_at" => nil,
      "refresh_interval_hours" => 24,
      "items" => [],
      "sources" => []
    }
  end

  def refresh(sources, previous, fetch \\ &Client.fetch/1, now \\ DateTime.utc_now()) do
    timestamp = now |> DateTime.truncate(:second) |> DateTime.to_iso8601()

    {items, statuses, successful} =
      Enum.reduce(sources, {[], [], 0}, fn source, {items, statuses, successful} ->
        old_status = Enum.find(previous["sources"] || [], &(&1["id"] == source["id"])) || %{}
        cached = Enum.filter(previous["items"] || [], &valid_cached?(&1, source, now))
        base = Map.take(source, ~w(id name feed_url site_url))

        result =
          try do
            with {:ok, xml} <- fetch.(source), do: Parser.parse(xml, source, now)
          rescue
            _ -> {:error, "Feed refresh failed"}
          catch
            _, _ -> {:error, "Feed refresh failed"}
          end

        case result do
          {:ok, fresh} ->
            # Keep recent older headlines when a publisher shortens its feed.
            combined =
              (fresh ++ cached)
              |> Enum.uniq_by(& &1["url"])
              |> Enum.sort_by(& &1["published_at"], :desc)
              |> Enum.take(20)

            status =
              Map.merge(base, %{"status" => "ok", "last_success_at" => timestamp, "error" => nil})

            {items ++ combined, statuses ++ [status], successful + 1}

          {:error, error} ->
            status =
              Map.merge(base, %{
                "status" => if(cached == [], do: "unavailable", else: "cached"),
                "last_success_at" => old_status["last_success_at"],
                "error" => to_string(error) |> String.slice(0, 160)
              })

            {items ++ cached, statuses ++ [status], successful}
        end
      end)

    items =
      items
      |> Enum.uniq_by(& &1["url"])
      |> Enum.sort_by(&{&1["published_at"], &1["url"]}, :desc)
      |> Enum.take(80)

    %{
      "version" => 1,
      "updated_at" => if(successful > 0, do: timestamp, else: previous["updated_at"]),
      "attempted_at" => timestamp,
      "refresh_interval_hours" => 24,
      "items" => items,
      "sources" => statuses
    }
  end

  def publish!(snapshot, root) do
    json = Jason.encode!(snapshot, pretty: true) <> "\n"

    for directory <- ["priv/data", "public/data", "priv/static/data"] do
      write!(Path.join([root, directory, "cloud-security-feed.json"]), json)
    end

    for directory <- ["public", "priv/static"] do
      export!(snapshot, Path.join(root, directory))
    end
  end

  def export!(snapshot, directory) do
    write!(
      Path.join(directory, "data/cloud-security-feed.json"),
      Jason.encode!(snapshot, pretty: true) <> "\n"
    )

    write!(Path.join(directory, "feeds/cloud-security.xml"), rss(snapshot))
    write!(Path.join(directory, "feeds/cloud-security.opml"), opml(snapshot))
  end

  def rss(snapshot) do
    sources = Map.new(snapshot["sources"], &{&1["id"], &1})

    items =
      Enum.map_join(snapshot["items"], "\n", fn item ->
        source = Map.fetch!(sources, item["source_id"])

        """
        <item>
          <title>#{escape(item["title"])}</title>
          <link>#{escape(item["url"])}</link>
          <guid isPermaLink="true">#{escape(item["url"])}</guid>
          <pubDate>#{rfc_date(item["published_at"])}</pubDate>
          <category>#{escape(item["topic"])}</category>
          <description>Cloud security research from #{escape(item["source_name"])}. Read the original article at the publisher.</description>
          <source url="#{escape(source["feed_url"])}">#{escape(item["source_name"])}</source>
        </item>
        """
      end)

    build_date =
      if snapshot["updated_at"],
        do: "<lastBuildDate>#{rfc_date(snapshot["updated_at"])}</lastBuildDate>",
        else: ""

    """
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>CloudSecCorner Field Notes — Cloud Security Feed</title>
        <link>https://cloudsecuritycorner.com/blog#cloud-feed</link>
        <description>Daily cloud security headlines from the original publishers.</description>
        <language>en</language>
        <ttl>1440</ttl>
        <atom:link href="https://cloudsecuritycorner.com/feeds/cloud-security.xml" rel="self" type="application/rss+xml" />
        #{build_date}
        #{items}
      </channel>
    </rss>
    """
  end

  def opml(snapshot) do
    outlines =
      Enum.map_join(snapshot["sources"], "\n", fn source ->
        ~s(<outline type="rss" text="#{escape(source["name"])}" title="#{escape(source["name"])}" xmlUrl="#{escape(source["feed_url"])}" htmlUrl="#{escape(source["site_url"])}" />)
      end)

    """
    <?xml version="1.0" encoding="UTF-8"?>
    <opml version="2.0"><head><title>CloudSecCorner Cloud Security Sources</title></head>
    <body><outline text="Cloud security">#{outlines}</outline></body></opml>
    """
  end

  defp valid_cached?(item, source, now) when is_map(item) do
    with true <-
           item["source_id"] == source["id"] and is_binary(item["title"]) and item["title"] != "",
         url when is_binary(url) <- Parser.canonical_url(item["url"], source),
         true <- url == item["url"] and item["topic"] in @topics,
         {:ok, date} <- Parser.parse_date(item["published_at"] || ""),
         age when age >= -300 and age <= 90 * 86_400 <- DateTime.diff(now, date) do
      true
    else
      _ -> false
    end
  end

  defp valid_cached?(_, _, _), do: false

  defp rfc_date(value) do
    {:ok, date, _} = DateTime.from_iso8601(value)
    day = Enum.at(~w(Mon Tue Wed Thu Fri Sat Sun), Date.day_of_week(date) - 1)
    month = Enum.at(~w(Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec), date.month - 1)
    pad = fn number -> number |> Integer.to_string() |> String.pad_leading(2, "0") end

    "#{day}, #{pad.(date.day)} #{month} #{date.year} #{pad.(date.hour)}:#{pad.(date.minute)}:#{pad.(date.second)} GMT"
  end

  defp escape(value), do: value |> Phoenix.HTML.html_escape() |> Phoenix.HTML.safe_to_string()

  defp write!(path, contents) do
    File.mkdir_p!(Path.dirname(path))
    File.write!(path <> ".tmp", contents)
    File.rename!(path <> ".tmp", path)
  end
end
