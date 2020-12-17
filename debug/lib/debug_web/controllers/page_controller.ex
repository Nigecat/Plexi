defmodule DebugWeb.PageController do
    use DebugWeb, :controller

    def index(conn, _params) do
        render(conn, "index.html")
    end
end
