FROM node:12

# Download packages
RUN \
    wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb     \
    && dpkg -i erlang-solutions_1.0_all.deb                                     \
    && wget http://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc    \
    && apt-key add erlang_solutions.asc                                         \
    && apt-get update                                                           \
    && apt-get install -y elixir esl-erlang inotify-tools                                                          

WORKDIR /plexi-debug
EXPOSE 4000

# Install dependencies
COPY mix* /plexi-debug/
COPY assets/package*.json /plexi-debug/assets/
RUN \
    mix local.rebar --force     \
    && mix local.hex --force    \
    && mix deps.get             \
    && cd assets                \
    && npm ci

COPY . /plexi-debug

CMD mix phx.server
