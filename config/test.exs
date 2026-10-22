import Config

config :cloud_security_corner, CloudSecurityCornerWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  server: false
