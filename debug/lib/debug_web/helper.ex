defmodule DebugWeb.Helper do
    def append_file(filename, data) do
        File.open(filename, [:append]) |> elem(1) |> IO.write(data)
    end
end
