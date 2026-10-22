defmodule CloudSecurityCornerWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :cloud_security_corner

  plug(Plug.Static,
    at: "/",
    from: :cloud_security_corner,
    gzip: false,
    only:
      ~w(assets blog data images labs patterns og-image.png robots.txt sitemap.xml tools.js site.js CNAME _redirects)
  )

  plug(Plug.RequestId)
  plug(Plug.Head)
  plug(Plug.Parsers, parsers: [:urlencoded], pass: ["*/*"])
  plug(CloudSecurityCornerWeb.Router)
end
