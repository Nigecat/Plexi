defmodule Debug.Application do
    # See https://hexdocs.pm/elixir/Application.html
    # for more information on OTP Applications
    @moduledoc false

    use Application

    def start(_type, _args) do
        # Ensure the log folder exists
        unless File.exists?(DebugWeb.Constants.log_dir) do
            File.mkdir!("logs")
        end

        # Ensure the log files exist
        unless File.exists?(DebugWeb.Constants.info_log) do
            File.write!(DebugWeb.Constants.info_log, "level,message,timestamp");
        end
        unless File.exists?(DebugWeb.Constants.error_log) do
            File.write!(DebugWeb.Constants.error_log, "level,message,timestamp");
        end

        children = [
            # Start the Telemetry supervisor
            DebugWeb.Telemetry,
            # Start the PubSub system
            {Phoenix.PubSub, name: Debug.PubSub},
            # Start the Endpoint (http/https)
            DebugWeb.Endpoint
            # Start a worker by calling: Debug.Worker.start_link(arg)
            # {Debug.Worker, arg}
        ]

        # See https://hexdocs.pm/elixir/Supervisor.html
        # for other strategies and supported options
        opts = [strategy: :one_for_one, name: Debug.Supervisor]
        Supervisor.start_link(children, opts)
    end

    # Tell Phoenix to update the endpoint configuration
    # whenever the application is updated.
    def config_change(changed, _new, removed) do
        DebugWeb.Endpoint.config_change(changed, removed)
        :ok
    end
end
