use std::net::SocketAddr;
use serde::Deserialize;

use axum::{response::{Html, IntoResponse}, routing::get, Router};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let routes_hello = Router::new().route("/hello", get(handler_hello));

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("--> LISTENING on {addr}\n");
    axum::serve(TcpListener::bind(addr).await.unwrap(), routes_hello).await.unwrap();
}

async fn handler_hello() ->  impl IntoResponse {
    println!("->> {:?} - handler_hello", "HANDLER");
    Html("Hello <strong>world</strong>")
}
