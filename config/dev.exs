import Config

config :cloud_security_corner, CloudSecurityCornerWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4000],
  debug_errors: true,
  code_reloader: false,
  check_origin: false
