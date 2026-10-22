import Config

if config_env() == :prod do
  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      SECRET_KEY_BASE must be set in production.
      Generate one with: mix phx.gen.secret
      """

  config :cloud_security_corner, CloudSecurityCornerWeb.Endpoint,
    secret_key_base: secret_key_base,
    http: [ip: {0, 0, 0, 0}, port: String.to_integer(System.get_env("PORT", "4000"))]
end
