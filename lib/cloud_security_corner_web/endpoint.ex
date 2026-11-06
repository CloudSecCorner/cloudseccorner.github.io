defmodule CloudSecurityCornerWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :cloud_security_corner

  # Built React assets take precedence; Phoenix still owns HTML and content routes.
  plug(Plug.Static,
    at: "/",
    from: {CloudSecurityCorner.Frontend, :directory, []},
    gzip: false,
    only:
      ~w(assets data images reference-architectures labs blog android-icon-192x192.png og-image.png favicon.ico)
  )

  plug(Plug.Static,
    at: "/",
    from: :cloud_security_corner,
    gzip: false,
    only:
      ~w(assets blog data images labs patterns reference-architectures android-icon-192x192.png og-image.png robots.txt sitemap.xml tools.js site.js aws-architectures.js azure-architectures.js CNAME _redirects)
  )

  plug(Plug.RequestId)
  plug(Plug.Head)
  plug(Plug.Parsers, parsers: [:urlencoded], pass: ["*/*"])
  plug(CloudSecurityCornerWeb.Router)
end
