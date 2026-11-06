defmodule CloudSecurityCorner.Frontend do
  @moduledoc """
  Connects Vite's fingerprinted React assets to Phoenix and the Pages export.
  Phoenix remains usable without a frontend build during content development.
  """

  @default_directory Path.expand("../../dist", __DIR__)

  def directory do
    Application.get_env(:cloud_security_corner, :frontend_directory, @default_directory)
  end

  def enabled?, do: assets() != nil

  def assets(directory \\ directory()) do
    case File.read(Path.join(directory, ".vite/manifest.json")) do
      {:ok, json} -> json |> Jason.decode!() |> assets_from_manifest()
      {:error, :enoent} -> nil
      {:error, reason} -> raise File.Error, reason: reason, action: "read Vite manifest"
    end
  end

  def validate_build!(directory \\ directory()) do
    manifest = directory |> Path.join(".vite/manifest.json") |> File.read!() |> Jason.decode!()

    for {_key, chunk} <- manifest,
        file <- [chunk["file"] | Map.get(chunk, "css", []) ++ Map.get(chunk, "assets", [])] do
      unless is_binary(file) and File.regular?(Path.join(directory, file)) do
        raise "Vite build is incomplete: missing #{inspect(file)}. Run npm run build."
      end
    end

    assets_from_manifest(manifest)
  end

  defp assets_from_manifest(manifest) do
    entry = Map.fetch!(manifest, "index.html")
    {imports, _seen} = imported_chunks(manifest, entry, MapSet.new(["index.html"]))

    %{
      entry: "/" <> Map.fetch!(entry, "file"),
      stylesheets:
        ([entry] ++ imports)
        |> Enum.flat_map(&Map.get(&1, "css", []))
        |> Enum.uniq()
        |> Enum.map(&("/" <> &1)),
      preloads: Enum.map(imports, &("/" <> Map.fetch!(&1, "file")))
    }
  end

  defp imported_chunks(manifest, chunk, seen) do
    Enum.reduce(Map.get(chunk, "imports", []), {[], seen}, fn key, {chunks, seen} ->
      if MapSet.member?(seen, key) do
        {chunks, seen}
      else
        imported = Map.fetch!(manifest, key)
        {dependencies, seen} = imported_chunks(manifest, imported, MapSet.put(seen, key))
        {chunks ++ dependencies ++ [imported], seen}
      end
    end)
  end
end
