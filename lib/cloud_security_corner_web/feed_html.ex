defmodule CloudSecurityCornerWeb.FeedHTML do
  use CloudSecurityCornerWeb, :html

  attr(:snapshot, :map, required: true)
  attr(:compact, :boolean, default: false)

  def headlines(assigns) do
    ~H"""
    <section id={if @compact, do: "home-cloud-feed", else: "cloud-feed"} class="cloud-feed" aria-label="Daily cloud security feed">
      <div class="cloud-feed-heading">
        <div><p class="dev-eyebrow">Field Notes / Cloud security research</p><h2>Daily Cloud Security Feed</h2><p>Cloud security headlines from the original publishers. Open an article to read it at the source.</p></div>
        <div class="cloud-feed-actions"><a href="/feeds/cloud-security.xml">Subscribe via RSS</a><a href="/feeds/cloud-security.opml" download>Download OPML</a><a :if={@compact} href="/blog#cloud-feed">All headlines →</a></div>
      </div>
      <p class="cloud-feed-meta">Updated daily · <%= if @snapshot["updated_at"] do %>Latest successful import <time datetime={@snapshot["updated_at"]}>{display_time(@snapshot["updated_at"])}</time><% else %>Waiting for the first successful import.<% end %></p>
      <p :if={Enum.any?(@snapshot["sources"], &(&1["status"] != "ok"))} class="cloud-feed-status">Some sources are temporarily unavailable. Previously imported headlines are retained when available.</p>
      <p :if={@snapshot["items"] == []} class="cloud-feed-empty">No recent cloud security headlines are available yet.</p>
      <ol class="cloud-feed-list">
        <li :for={item <- Enum.take(@snapshot["items"], if(@compact, do: 3, else: 15))} class="cloud-feed-item">
          <div class="cloud-feed-item-meta"><span>{item["source_name"]}</span><span>{item["topic"]}</span><time datetime={item["published_at"]}>{String.slice(item["published_at"], 0, 10)}</time></div>
          <h3><a href={item["url"]} target="_blank" rel="noopener noreferrer">{item["title"]} ↗</a></h3>
        </li>
      </ol>
      <details :if={!@compact} class="cloud-feed-sources">
        <summary>Feed addresses and source status</summary>
        <p>Broad security feeds are filtered for cloud topics. Source publication dates are preserved.</p>
        <ul><li :for={source <- @snapshot["sources"]}><a href={source["feed_url"]} target="_blank" rel="noopener noreferrer">{source["name"]} RSS ↗</a><span>{source_status(source["status"])}<%= if source["last_success_at"] do %> · Last success {display_time(source["last_success_at"])}<% end %></span></li></ul>
      </details>
    </section>
    """
  end

  defp display_time(value) do
    case DateTime.from_iso8601(value) do
      {:ok, date, _} -> Calendar.strftime(date, "%b %d, %Y %H:%M UTC")
      _ -> "Unavailable"
    end
  end

  defp source_status("ok"), do: "Import successful"
  defp source_status("cached"), do: "Showing cached headlines"
  defp source_status(_), do: "Currently unavailable"
end
