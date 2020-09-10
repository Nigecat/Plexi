FROM rust:latest

WORKDIR /plexi-api
RUN rustup override set nightly

COPY Cargo* /plexi-api/
# Create a mock main file to use for the build process so the dependencies can be cached
# This is removed after the dependencies are built
RUN mkdir src && echo "fn main() {}" >> /plexi-api/src/main.rs 
RUN cargo build
RUN rm -rf /plexi-api/src

COPY . /plexi-api
RUN cargo build

CMD cargo run