defmodule Mix.Tasks.Feeds.Refresh do
  use Mix.Task

  alias CloudSecurityCorner.Feeds

  @shortdoc "Refreshes cloud security RSS/Atom headlines and publishes static feeds"

  @impl Mix.Task
  def run(args) do
    {options, _, invalid} =
      OptionParser.parse(args, strict: [input_dir: :string, require_fresh: :boolean])

    if invalid != [], do: Mix.raise("Unknown feed options: #{inspect(invalid)}")

    Mix.Task.run("compile")
    Application.ensure_all_started(:inets)
    Application.ensure_all_started(:ssl)

    fetch = fn source ->
      Mix.shell().info("Refreshing #{source["name"]}")

      if directory = options[:input_dir] do
        case File.read(Path.join(directory, source["id"] <> ".xml")) do
          {:ok, body} -> {:ok, body}
          {:error, _} -> {:error, "Local feed input missing"}
        end
      else
        CloudSecurityCorner.Feeds.Client.fetch(source)
      end
    end

    snapshot = Feeds.refresh(Feeds.sources(), Feeds.snapshot(), fetch)
    successful = Enum.count(snapshot["sources"], &(&1["status"] == "ok"))

    Enum.each(snapshot["sources"], fn source ->
      if source["status"] != "ok",
        do: Mix.shell().error("#{source["name"]}: #{source["error"]}; #{source["status"]}.")
    end)

    if successful == 0 and (options[:require_fresh] or snapshot["items"] == []) do
      Mix.raise(
        "No cloud security feeds refreshed; the previous published snapshot was preserved."
      )
    end

    Feeds.publish!(snapshot, File.cwd!())

    Mix.shell().info(
      "Published #{length(snapshot["items"])} cloud security headlines; #{successful}/#{length(snapshot["sources"])} sources refreshed."
    )
  end
end
