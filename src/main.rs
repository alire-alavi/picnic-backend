#![allow(unused)]
mod db;
mod models;
mod handlers;
pub mod web;
use std::net::SocketAddr;
use db::client::db;
use handlers::products::handler_get_product;

use axum::{response::{Html, IntoResponse}, routing::get, Router};
use axum::serve;
use tokio::net::TcpListener;
use dotenv::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let routes_hello = Router::new()
        .route("/hello", get(handler_hello))
        .route("/products/{slug}", get(handler_get_product))
        .with_state(db().await.unwrap());

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("--> LISTENING on {addr}\n");
    serve(TcpListener::bind(addr).await.unwrap(), routes_hello).await.unwrap();
}

async fn handler_hello() ->  impl IntoResponse {
    println!("->> {:?} - handler_hello", "HANDLER");
    Html("Hello <strong>world</strong>")
}
