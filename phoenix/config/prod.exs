import Config

config :cloud_security_corner, CloudSecurityCornerWeb.Endpoint,
  http: [ip: {0, 0, 0, 0}, port: String.to_integer(System.get_env("PORT", "4000"))],
  server: true
