#![allow(unused)]

use std::net::SocketAddr;

use axum::{response::Html, routing::get, Router};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let routes_hello = Router::new().route("/hello", get(|| async { Html("Hello <strong> World!</strong>")}));

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("--> LISTENING on {addr}\n");
    axum::serve(TcpListener::bind(addr).await.unwrap(), routes_hello).await.unwrap();
}
