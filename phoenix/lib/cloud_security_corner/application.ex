defmodule CloudSecurityCorner.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    content = [{CloudSecurityCorner.Content, []}]
    endpoint_config = Application.get_env(:cloud_security_corner, CloudSecurityCornerWeb.Endpoint)

    server =
      if endpoint_config[:server] do
        http_config = Keyword.fetch!(endpoint_config, :http)
        ip = Keyword.get(http_config, :ip, {127, 0, 0, 1})
        port = Keyword.fetch!(http_config, :port)

        [
          {Bandit,
           plug: CloudSecurityCornerWeb.Endpoint, scheme: :http, options: [ip: ip, port: port]}
        ]
      else
        []
      end

    children = content ++ server
    opts = [strategy: :one_for_one, name: CloudSecurityCorner.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
