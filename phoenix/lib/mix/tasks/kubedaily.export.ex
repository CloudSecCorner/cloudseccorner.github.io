defmodule Mix.Tasks.Kubedaily.Export do
  @moduledoc """
  KubeDaily-compatible alias for exporting CloudSecurityCorner as a static site.
  """

  use Mix.Task

  @shortdoc "Exports CloudSecurityCorner as a static site (KubeDaily alias)"

  @impl Mix.Task
  def run(args) do
    Mix.Tasks.Site.Export.run(args)
  end
end
