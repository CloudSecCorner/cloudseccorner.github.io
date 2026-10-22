defmodule CloudSecurityCorner.MixProject do
  use Mix.Project

  def project do
    [
      app: :cloud_security_corner,
      version: "0.1.0",
      elixir: "~> 1.20",
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger, :runtime_tools],
      mod: {CloudSecurityCorner.Application, []}
    ]
  end

  defp deps do
    [
      {:bandit, "~> 1.5"},
      {:earmark, "~> 1.4"},
      {:jason, "~> 1.4"},
      {:phoenix, "~> 1.7"},
      {:phoenix_html, "~> 4.1"}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get"],
      "assets.deploy": ["compile"]
    ]
  end
end
