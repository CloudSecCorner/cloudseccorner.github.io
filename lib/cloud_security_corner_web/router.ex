defmodule CloudSecurityCornerWeb.Router do
  use Phoenix.Router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:put_secure_browser_headers)
  end

  scope "/", CloudSecurityCornerWeb do
    pipe_through(:browser)

    get("/", PageController, :home)
    get("/tools", ToolsController, :index)
    get("/labs", LabsController, :index)
    get("/labs/:id", LabsController, :show)
    get("/blog", BlogController, :index)
    get("/blog/:id", BlogController, :show)
    get("/about", PageController, :about)
    match(:*, "/*path", NotFoundController, :show)
  end
end
