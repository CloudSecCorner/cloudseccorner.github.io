import Config

config :cloud_security_corner, CloudSecurityCornerWeb.Endpoint,
  url: [host: "localhost"],
  adapter: Bandit.PhoenixAdapter,
  render_errors: [formats: [html: CloudSecurityCornerWeb.ErrorHTML], layout: false],
  secret_key_base: String.duplicate("cloud-security-corner-secret-key-", 4)

config :cloud_security_corner, site_url: "https://cloudsecuritycorner.com"

config :phoenix, :json_library, Jason

import_config "#{config_env()}.exs"
