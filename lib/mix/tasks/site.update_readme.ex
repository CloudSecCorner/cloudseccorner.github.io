defmodule Mix.Tasks.Site.UpdateReadme do
  @moduledoc """
  Synchronizes the tool catalog from priv/data/security-entries.json
  into the markdown tables in README.md.
  """

  use Mix.Task

  @shortdoc "Updates README.md tool tables from security-entries.json"

  @impl Mix.Task
  def run(_args) do
    script = Path.expand("scripts/update_readme_tools.py")

    case System.cmd("python3", [script], into: IO.stream(:stdio, :line)) do
      {_, 0} ->
        Mix.shell().info("Successfully updated README.md tool tables.")

      {_, code} ->
        Mix.raise("Failed to update README.md tool tables with exit code #{code}")
    end
  end
end
