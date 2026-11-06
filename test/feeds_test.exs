defmodule CloudSecurityCorner.FeedsTest do
  use ExUnit.Case, async: true

  alias CloudSecurityCorner.Feeds
  alias CloudSecurityCorner.Feeds.{Client, Parser}
  @now ~U[2026-11-06 12:00:00Z]
  @source %{
    "id" => "test",
    "name" => "Cloud Publisher",
    "feed_url" => "https://publisher.example/feed.xml",
    "site_url" => "https://publisher.example",
    "allowed_hosts" => ["publisher.example"],
    "cloud_only" => false
  }

  test "parses real UTF-8, CDATA, dates and tracking URLs without retaining article HTML" do
    xml =
      rss([
        %{
          title: "AWS identity — scoped access &amp; keys",
          url: "https://publisher.example/aws?utm_source=rss#comments",
          description: "<p>Cloud guidance with private article text.</p>"
        }
      ])

    assert {:ok, [item]} = Parser.parse(xml, @source, @now)
    assert item["title"] == "AWS identity — scoped access & keys"
    assert item["url"] == "https://publisher.example/aws"
    assert item["published_at"] == "2026-11-05T10:00:00Z"
    assert item["topic"] == "Identity & Access"
    refute Map.has_key?(item, "description")
    refute Map.has_key?(item, "content")
  end

  test "supports namespaced Atom alternate links and original publication dates" do
    xml = """
    <feed xmlns="http://www.w3.org/2005/Atom"><entry>
      <title>Kubernetes tenant isolation</title>
      <link rel="self" href="https://publisher.example/api/item" />
      <link rel="alternate" href="https://publisher.example/kubernetes" />
      <published>2026-11-05T07:00:00-05:00</published>
      <updated>2026-11-06T11:00:00Z</updated>
      <summary>Cloud network policy.</summary>
    </entry></feed>
    """

    assert {:ok, [item]} = Parser.parse(xml, @source, @now)
    assert item["url"] == "https://publisher.example/kubernetes"
    assert item["published_at"] == "2026-11-05T12:00:00Z"
    assert item["topic"] == "Kubernetes & Containers"
  end

  test "filters broad security feeds for cloud relevance" do
    xml =
      rss([
        %{
          title: "Unrelated desktop malware",
          url: "https://publisher.example/desktop",
          description: "Windows desktop software."
        },
        %{
          title: "Identity investigation",
          url: "https://publisher.example/entra",
          description: "Microsoft Entra cloud permissions."
        }
      ])

    assert {:ok, [item]} = Parser.parse(xml, @source, @now)
    assert item["url"] == "https://publisher.example/entra"
    assert {:ok, items} = Parser.parse(xml, Map.put(@source, "cloud_only", true), @now)
    assert length(items) == 2
  end

  test "rejects unsafe links, invalid or missing dates, old stories and future-dated stories" do
    invalid = [
      %{title: "AWS unsafe", url: "javascript:alert(1)"},
      %{title: "AWS wrong host", url: "https://attacker.example/cloud"},
      %{title: "AWS userinfo", url: "https://user:password@publisher.example/cloud"},
      %{title: "AWS HTTP", url: "http://publisher.example/cloud"},
      %{title: "AWS no URL", url: ""},
      %{title: "AWS invalid date", date: "not a date"},
      %{title: "AWS no date", date: ""},
      %{title: "AWS old story", date: "Thu, 01 Jan 2026 10:00:00 GMT"},
      %{title: "AWS future story", date: "2026-11-07T12:00:00Z"}
    ]

    assert {:ok, []} = Parser.parse(rss(invalid), @source, @now)
  end

  test "general cloud publishers must also have security relevance" do
    source = Map.put(@source, "security_only", true)

    xml =
      rss([
        %{
          title: "Cloudflare improves image caching",
          url: "https://publisher.example/cache",
          description: "The author explains faster static image delivery."
        },
        %{
          title: "Cloudflare encrypts identity tokens",
          url: "https://publisher.example/security"
        }
      ])

    assert {:ok, [item]} = Parser.parse(xml, source, @now)
    assert item["url"] == "https://publisher.example/security"
  end

  test "maps verified publisher aliases while enforcing both allowed hosts" do
    source =
      @source
      |> Map.put("allowed_hosts", ["publisher.example", "staging.publisher.example"])
      |> Map.put("article_host_aliases", %{
        "staging.publisher.example" => "publisher.example",
        "attacker.example" => "publisher.example"
      })

    assert Parser.canonical_url("https://staging.publisher.example/cloud?utm_source=rss", source) ==
             "https://publisher.example/cloud"

    refute Parser.canonical_url("https://attacker.example/cloud", source)

    refute Parser.canonical_url(
             "https://publisher.example/cloud",
             Map.put(source, "article_host_aliases", %{"publisher.example" => "attacker.example"})
           )
  end

  test "rejects DTD/entity declarations, invalid XML, HTML pages and oversized payloads" do
    for xml <- [
          "<!DOCTYPE rss [<!ENTITY secret SYSTEM 'file:///etc/passwd'>]><rss>&secret;</rss>",
          "<rss><broken></rss>",
          "<html><body>Not a feed</body></html>",
          String.duplicate("x", 5_000_001)
        ] do
      assert {:error, _} = Parser.parse(xml, @source, @now)
    end
  end

  test "normalizes RFC dates and rejects malformed timezones" do
    assert {:ok, ~U[2026-11-05 07:30:00Z]} = Parser.parse_date("Thu, 05 Nov 2026 13:00:00 +0530")
    assert {:ok, ~U[2026-11-05 10:00:00Z]} = Parser.parse_date("Thu, 05 Nov 2026 10:00:00 GMT")
    assert {:error, _} = Parser.parse_date("Thu, 05 Nov 2026 10:00:00 +9960")
    assert {:ok, ~U[2026-11-05 06:00:00Z]} = Parser.parse_date("Nov 05, 2026 00:00:00-0600")
    assert {:error, _} = Parser.parse_date("Nov 05, 2026 00:00:00+9960")
  end

  test "deduplicates tracked links and bounds each publisher's output" do
    many =
      for i <- 1..30, do: %{title: "AWS cloud item #{i}", url: "https://publisher.example/#{i}"}

    duplicates = [
      %{title: "AWS cloud item", url: "https://publisher.example/1?utm_medium=rss"} | many
    ]

    assert {:ok, items} = Parser.parse(rss(duplicates), @source, @now)
    assert length(items) == 20
    assert length(Enum.uniq_by(items, & &1["url"])) == 20
  end

  test "expanded publisher collection stays bounded and newest first" do
    sources = for id <- 1..18, do: Map.put(@source, "id", "publisher-#{id}")

    snapshot =
      Feeds.refresh(
        sources,
        Feeds.empty(),
        fn source ->
          items =
            for i <- 1..20,
                do: %{
                  title: "AWS cloud security #{i}",
                  url: "https://publisher.example/#{source["id"]}/#{i}",
                  date: @now |> DateTime.add(-i * 3600) |> DateTime.to_iso8601()
                }

          {:ok, rss(items)}
        end,
        @now
      )

    assert length(snapshot["items"]) == 300
    assert length(snapshot["sources"]) == 18
    assert Enum.all?(snapshot["sources"], &(&1["status"] == "ok"))
    assert length(Enum.uniq_by(snapshot["items"], & &1["url"])) == 300
    dates = Enum.map(snapshot["items"], & &1["published_at"])
    assert dates == Enum.sort(dates, :desc)
  end

  test "successful refresh merges a shortened feed with recent cached articles" do
    old =
      Feeds.refresh(
        [@source],
        Feeds.empty(),
        fn _ -> {:ok, rss([%{title: "AWS older", url: "https://publisher.example/older"}])} end,
        DateTime.add(@now, -3600)
      )

    updated =
      Feeds.refresh(
        [@source],
        old,
        fn _ ->
          {:ok,
           rss([
             %{
               title: "AWS newer",
               url: "https://publisher.example/newer",
               date: "2026-11-06T11:00:00Z"
             }
           ])}
        end,
        @now
      )

    assert length(updated["items"]) == 2
    assert hd(updated["items"])["url"] == "https://publisher.example/newer"
    assert updated["updated_at"] == "2026-11-06T12:00:00Z"
    assert hd(updated["sources"])["status"] == "ok"
  end

  test "all-source failure retains last success and old publication dates" do
    previous =
      Feeds.refresh(
        [@source],
        Feeds.empty(),
        fn _ -> {:ok, rss([%{title: "AWS current"}])} end,
        @now
      )

    failed =
      Feeds.refresh(
        [@source],
        previous,
        fn _ -> {:error, "HTTP 503"} end,
        DateTime.add(@now, 3600)
      )

    assert failed["items"] == previous["items"]
    assert failed["updated_at"] == previous["updated_at"]
    assert failed["attempted_at"] == "2026-11-06T13:00:00Z"
    assert hd(failed["sources"])["status"] == "cached"
    assert hd(failed["sources"])["last_success_at"] == previous["updated_at"]
  end

  test "partial failure combines fresh and cached publishers and signals source status" do
    other = Map.merge(@source, %{"id" => "other", "name" => "Other Cloud Publisher"})

    initial =
      Feeds.refresh(
        [@source, other],
        Feeds.empty(),
        fn source ->
          {:ok,
           rss([
             %{title: "AWS #{source["id"]}", url: "https://publisher.example/#{source["id"]}"}
           ])}
        end,
        @now
      )

    updated =
      Feeds.refresh(
        [@source, other],
        initial,
        fn
          %{"id" => "other"} -> {:error, "timeout"}
          _ -> {:ok, rss([%{title: "AWS fresh", url: "https://publisher.example/fresh"}])}
        end,
        DateTime.add(@now, 60)
      )

    assert Enum.any?(updated["items"], &(&1["source_id"] == "other"))
    assert Enum.map(updated["sources"], & &1["status"]) == ["ok", "cached"]
    assert updated["updated_at"] == "2026-11-06T12:01:00Z"
  end

  test "removed publishers and expired cache entries are not retained" do
    initial =
      Feeds.refresh(
        [@source],
        Feeds.empty(),
        fn _ -> {:ok, rss([%{title: "AWS current"}])} end,
        @now
      )

    assert Feeds.refresh([], initial, fn _ -> flunk("Unexpected fetch") end, @now)["items"] == []

    expired =
      Feeds.refresh(
        [@source],
        initial,
        fn _ -> {:error, "offline"} end,
        DateTime.add(@now, 91 * 86400)
      )

    assert expired["items"] == []
    assert hd(expired["sources"])["status"] == "unavailable"
  end

  test "HTTPS client refuses off-publisher and HTTP redirects before fetching them" do
    for location <- [
          "http://publisher.example/feed",
          "https://attacker.example/feed",
          "https://user:pass@publisher.example/feed"
        ] do
      assert {:error, _} =
               Client.fetch(@source, fn url ->
                 assert url == @source["feed_url"]
                 {:ok, 302, [{"location", location}], ""}
               end)
    end
  end

  test "HTTPS client handles allowed redirects, redirect loops and publisher errors" do
    assert {:ok, "<rss/>"} =
             Client.fetch(@source, fn
               "https://publisher.example/feed.xml" ->
                 {:ok, 301, [{~c"location", ~c"/new.xml"}], ""}

               "https://publisher.example/new.xml" ->
                 {:ok, 200, [], "<rss/>"}
             end)

    assert {:error, "Too many redirects"} =
             Client.fetch(@source, fn _ -> {:ok, 302, [{"location", "/feed.xml"}], ""} end)

    assert {:error, "HTTP 429"} = Client.fetch(@source, fn _ -> {:ok, 429, [], ""} end)
  end

  test "RSS and OPML preserve external attribution, escape XML and publish valid documents" do
    snapshot =
      Feeds.refresh(
        [@source],
        Feeds.empty(),
        fn _ -> {:ok, rss([%{title: "AWS identity &amp; secrets"}])} end,
        @now
      )

    xml = Feeds.rss(snapshot)
    assert xml =~ "AWS identity &amp; secrets"
    assert xml =~ ~s(<source url="https://publisher.example/feed.xml">Cloud Publisher</source>)
    assert xml =~ "Thu, 05 Nov 2026 10:00:00 GMT"
    {_, []} = :xmerl_scan.string(:binary.bin_to_list(xml), quiet: true)
    {_, []} = :xmerl_scan.string(:binary.bin_to_list(Feeds.opml(snapshot)), quiet: true)
  end

  test "published export contains the canonical snapshot and subscription files" do
    directory = Path.join(System.tmp_dir!(), "csc-feed-#{System.unique_integer([:positive])}")
    on_exit(fn -> File.rm_rf!(directory) end)

    snapshot =
      Feeds.refresh(
        [@source],
        Feeds.empty(),
        fn _ -> {:ok, rss([%{title: "AWS security"}])} end,
        @now
      )

    Feeds.export!(snapshot, directory)

    assert Jason.decode!(File.read!(Path.join(directory, "data/cloud-security-feed.json"))) ==
             snapshot

    assert File.read!(Path.join(directory, "feeds/cloud-security.xml")) =~ "AWS security"
    assert File.read!(Path.join(directory, "feeds/cloud-security.opml")) =~ @source["feed_url"]
  end

  defp rss(items) do
    entries =
      Enum.map_join(items, "", fn item ->
        """
        <item><title>#{item[:title]}</title>
        <link>#{item[:url] || "https://publisher.example/cloud"}</link>
        <pubDate>#{item[:date] || "Thu, 05 Nov 2026 10:00:00 +0000"}</pubDate>
        <description><![CDATA[#{item[:description] || "AWS cloud security research."}]]></description></item>
        """
      end)

    ~s(<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>#{entries}</channel></rss>)
  end
end
