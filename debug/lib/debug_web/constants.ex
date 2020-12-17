defmodule DebugWeb.Constants do
    @log_dir "logs"
    @info_log "#{@log_dir}/info.log"
    @error_log "#{@log_dir}/error.log"

    def log_dir do
        @log_dir
    end

    def info_log do
        @info_log
    end

    def error_log do
        @error_log
    end
end
