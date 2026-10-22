defmodule CloudSecurityCornerWeb do
  def controller do
    quote do
      use Phoenix.Controller,
        formats: [:html],
        layouts: [html: CloudSecurityCornerWeb.Layouts]

      import Plug.Conn
    end
  end

  def html do
    quote do
      use Phoenix.Component
      import Phoenix.HTML
    end
  end

  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
