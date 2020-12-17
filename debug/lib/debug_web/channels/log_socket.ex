defmodule DebugWeb.LogChannel do
    use Phoenix.Channel

    def format(level, message) do
        time = DateTime.to_iso8601(DateTime.utc_now())
        row = [[level, message, time]] |> CSV.encode
        Enum.take(row, Enum.count(row))
    end

    def join("log", _payload, socket) do
        {:ok, socket}
    end

    def handle_in("error", message, socket) do
        IO.puts("Got error: #{message}")

        row = format(:error, message)
        DebugWeb.Helper.append_file(DebugWeb.Constants.error_log, row)
        {:noreply, socket}
    end

    def handle_in("info", message, socket) do
        IO.puts("Got info: #{message}")

        row = format(:info, message)
        DebugWeb.Helper.append_file(DebugWeb.Constants.info_log, row)
        {:noreply, socket}
    end
end
