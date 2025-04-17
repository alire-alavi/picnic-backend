use std::env;
use sqlx::{Connection, postgres::PgPool};
use axum::extract::State;
use axum::http::StatusCode;

pub async fn db() -> Result<PgPool, sqlx::Error> {
    let db_connection_str = env::var("DATABASE_URL").expect("DATABASE_URL env var must be set");
    let pool = PgPool::connect(&db_connection_str).await?;
    Ok(pool)
}
