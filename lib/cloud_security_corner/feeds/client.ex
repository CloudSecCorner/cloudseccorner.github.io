defmodule CloudSecurityCorner.Feeds.Client do
  @moduledoc "Bounded HTTPS requests to configured feed publishers."

  def fetch(source, request \\ &request/1) do
    fetch_url(source["feed_url"], source, request, 0)
  end

  defp fetch_url(url, source, request, redirects) when redirects <= 3 do
    uri = URI.parse(url)

    if uri.scheme == "https" and uri.host in source["allowed_hosts"] and uri.port == 443 and
         is_nil(uri.userinfo) do
      case request.(url) do
        {:ok, 200, _headers, body} ->
          {:ok, body}

        {:ok, status, headers, _body} when status in [301, 302, 303, 307, 308] ->
          location =
            Enum.find_value(headers, fn {key, value} ->
              if String.downcase(to_string(key)) == "location", do: to_string(value)
            end)

          if location,
            do:
              fetch_url(
                URI.merge(url, location) |> URI.to_string(),
                source,
                request,
                redirects + 1
              ),
            else: {:error, "Redirect without location"}

        {:ok, status, _, _} ->
          {:error, "HTTP #{status}"}

        {:error, _} ->
          {:error, "Network or TLS request failed"}
      end
    else
      {:error, "Feed URL or redirect is outside the configured HTTPS hosts"}
    end
  rescue
    _ -> {:error, "Invalid feed URL or response"}
  end

  defp fetch_url(_, _, _, _), do: {:error, "Too many redirects"}

  defp request(url) do
    options = [
      timeout: 15_000,
      connect_timeout: 5_000,
      autoredirect: false,
      ssl: [
        verify: :verify_peer,
        cacerts: :public_key.cacerts_get(),
        depth: 6,
        customize_hostname_check: [match_fun: :public_key.pkix_verify_hostname_match_fun(:https)]
      ]
    ]

    headers = [
      {~c"user-agent", ~c"CloudSecCorner/1.0 (+https://cloudsecuritycorner.com)"},
      {~c"accept", ~c"application/rss+xml, application/atom+xml, application/xml, text/xml"},
      {~c"accept-encoding", ~c"identity"}
    ]

    case :httpc.request(:get, {String.to_charlist(url), headers}, options, body_format: :binary) do
      {:ok, {{_, status, _}, response_headers, body}} -> {:ok, status, response_headers, body}
      {:error, reason} -> {:error, reason}
    end
  end
end
