FROM rust:latest

EXPOSE 8000
ENV USER root

RUN rustup override set nightly
RUN cd / && cargo new --bin plexi-api

WORKDIR /plexi-api
COPY Cargo* /plexi-api/
RUN cargo build --release
RUN rm src/*.rs

COPY . /plexi-api
RUN rm /plexi-api/target/release/deps/plexi_api*
RUN cargo build --release

CMD cargo run --release