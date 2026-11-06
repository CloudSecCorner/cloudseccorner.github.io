defmodule CloudSecurityCorner.Feeds.Parser do
  @moduledoc "RSS/Atom metadata parsing. Article HTML is never republished."

  @max_bytes 5_000_000
  @cloud ~r/\b(?:aws|amazon|azure|entra|gcp|google cloud|kubernetes|k8s|cloud|iam|eks|aks|gke|serverless|terraform|containers?|workload identity|cnapp|cspm|saas|s3)\b/i
  @months ~w(Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec)

  def parse(xml, source, now \\ DateTime.utc_now()) do
    cond do
      byte_size(xml) > @max_bytes ->
        {:error, "Feed exceeds 5 MB"}

      not String.valid?(xml) ->
        {:error, "Invalid feed encoding"}

      Regex.match?(~r/<!\s*(?:DOCTYPE|ENTITY)/i, xml) ->
        {:error, "DTD and entity declarations are not allowed"}

      true ->
        parse_document(xml, source, now)
    end
  end

  def canonical_url(value, source) when is_binary(value) do
    value = String.trim(value)
    uri = source["feed_url"] |> URI.merge(value)

    if value != "" and uri.scheme == "https" and uri.host in source["allowed_hosts"] and
         uri.userinfo == nil and uri.port == 443 do
      query =
        (uri.query || "")
        |> URI.decode_query()
        |> Enum.reject(fn {key, _} ->
          String.starts_with?(key, "utm_") or key in ~w(fbclid gclid)
        end)
        |> Enum.sort()
        |> URI.encode_query()

      URI.to_string(%{uri | fragment: nil, query: if(query == "", do: nil, else: query)})
    end
  rescue
    _ -> nil
  end

  def canonical_url(_, _), do: nil

  def parse_date(value) do
    value = String.trim(value)

    case DateTime.from_iso8601(value) do
      {:ok, date, _} -> {:ok, DateTime.truncate(date, :second)}
      _ -> parse_rfc_date(value)
    end
  end

  defp parse_document(xml, source, now) do
    {document, rest} =
      :xmerl_scan.string(:binary.bin_to_list(xml),
        quiet: true,
        validation: :off,
        allow_entities: false,
        fetch_fun: fn _, state -> {:ok, :not_fetched, state} end
      )

    root = text(document, "local-name(.)")

    if root not in ["rss", "feed", "RDF"] or String.trim(to_string(rest)) != "" do
      {:error, "Not an RSS or Atom document"}
    else
      items =
        :xmerl_xpath.string(~c"//*[local-name()='item' or local-name()='entry']", document)
        |> Enum.take(1_000)
        |> Enum.map(&entry(&1, source, now))
        |> Enum.reject(&is_nil/1)
        |> Enum.uniq_by(& &1["url"])
        |> Enum.sort_by(& &1["published_at"], :desc)
        |> Enum.take(20)

      {:ok, items}
    end
  rescue
    _ -> {:error, "Invalid RSS or Atom document"}
  catch
    _, _ -> {:error, "Invalid RSS or Atom document"}
  end

  defp entry(node, source, now) do
    title = text(node, "string(./*[local-name()='title'][1])") |> plain_text()

    link =
      first_text(node, [
        "string(./*[local-name()='link' and (@rel='alternate' or not(@rel))]/@href)",
        "string(./*[local-name()='link'][1])"
      ])

    published =
      first_text(node, [
        "string(./*[local-name()='pubDate'][1])",
        "string(./*[local-name()='published'][1])",
        "string(./*[local-name()='date'][1])"
      ])

    summary =
      text(node, "string(./*[local-name()='description' or local-name()='summary'][1])")
      |> plain_text()

    context =
      [
        title,
        summary
        | Enum.map(
            :xmerl_xpath.string(~c"./*[local-name()='category']", node),
            &text(&1, "string(.)")
          )
      ]
      |> Enum.join(" ")
      |> plain_text()

    with true <- title != "",
         url when is_binary(url) <- canonical_url(link, source),
         {:ok, date} <- parse_date(published),
         age when age >= -300 and age <= 90 * 86_400 <- DateTime.diff(now, date),
         true <- source["cloud_only"] == true or Regex.match?(@cloud, context) do
      %{
        "id" => :crypto.hash(:sha256, url) |> Base.encode16(case: :lower) |> binary_part(0, 20),
        "title" =>
          title |> String.split() |> Enum.take(24) |> Enum.join(" ") |> String.slice(0, 180),
        "url" => url,
        "source_id" => source["id"],
        "source_name" => source["name"],
        "published_at" => DateTime.to_iso8601(date),
        "topic" => topic(title <> " " <> summary)
      }
    else
      _ -> nil
    end
  end

  defp first_text(node, queries) do
    Enum.find_value(queries, "", fn query ->
      value = text(node, query) |> String.trim()
      if value != "", do: value
    end)
  end

  defp text(node, query) do
    case :xmerl_xpath.string(String.to_charlist(query), node) do
      {:xmlObj, :string, value} -> to_string(value)
      _ -> ""
    end
  end

  defp plain_text(value) do
    value
    |> String.replace(~r/&(?:amp|lt|gt|quot|apos|nbsp|#\d+|#x[0-9a-fA-F]+);/, fn
      "&amp;" -> "&"
      "&lt;" -> "<"
      "&gt;" -> ">"
      "&quot;" -> "\""
      "&apos;" -> "'"
      "&nbsp;" -> " "
      numeric -> decode_numeric(numeric)
    end)
    |> String.replace(~r/<[^>]*>/s, " ")
    |> String.replace(~r/[\s\x00-\x1f\x7f]+/u, " ")
    |> String.trim()
  end

  defp decode_numeric(entity) do
    {digits, base} =
      if String.starts_with?(entity, "&#x"),
        do: {String.slice(entity, 3..-2//1), 16},
        else: {String.slice(entity, 2..-2//1), 10}

    value = String.to_integer(digits, base)
    if value in 1..0x10FFFF and value not in 0xD800..0xDFFF, do: <<value::utf8>>, else: " "
  rescue
    _ -> " "
  end

  defp topic(text) do
    cond do
      Regex.match?(~r/kubernetes|\bk8s\b|containers?|\beks\b|\baks\b|\bgke\b/i, text) ->
        "Kubernetes & Containers"

      Regex.match?(~r/identity|\biam\b|entra|credentials?|permissions?|privilege/i, text) ->
        "Identity & Access"

      Regex.match?(~r/vulnerabilit|\bcve-|exposure|misconfigur/i, text) ->
        "Vulnerabilities & Exposure"

      Regex.match?(~r/threat|attack|incident|detect|response|\bsoc\b/i, text) ->
        "Threat Detection & Response"

      Regex.match?(~r/encrypt|data protect|secrets?|storage/i, text) ->
        "Data Protection"

      true ->
        "Cloud Security"
    end
  end

  defp parse_rfc_date(value) do
    pattern =
      ~r/^(?:[A-Za-z]{3},\s*)?(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+(GMT|UTC|[+-](?:[01]\d|2[0-3])[0-5]\d)$/

    with [_, day, month, year, hour, minute, second, zone] <- Regex.run(pattern, value),
         month_index when is_integer(month_index) <- Enum.find_index(@months, &(&1 == month)),
         {:ok, date} <-
           Date.new(String.to_integer(year), month_index + 1, String.to_integer(day)),
         {:ok, time} <-
           Time.new(String.to_integer(hour), String.to_integer(minute), String.to_integer(second)),
         {:ok, datetime} <- DateTime.new(date, time, "Etc/UTC") do
      offset =
        if zone in ["GMT", "UTC"] do
          0
        else
          sign = if String.starts_with?(zone, "-"), do: -1, else: 1

          sign *
            (String.to_integer(String.slice(zone, 1, 2)) * 3600 +
               String.to_integer(String.slice(zone, 3, 2)) * 60)
        end

      {:ok, DateTime.add(datetime, -offset)}
    else
      _ -> {:error, :invalid_date}
    end
  end
end
