use std::env;
use sqlx::{Connection, postgres::PgPool};

#[derive(Debug)]
pub struct PostgresConfig {
    pub database_endpoint: String,
    pub database_port: String,
    pub database_user: String,
    pub database_password: String,
    pub database_name: String,
}

impl PostgresConfig {
    pub fn new() -> Self {
        PostgresConfig {
            database_endpoint: env::var("DATABASE_ENDPOINT")
                .expect("DATABASE_ENDPOINT must be set"),
            database_port: env::var("DATABASE_PORT")
                .expect("DATABASE_PORT must be set"),
            database_user: env::var("DATABASE_USER")
                .expect("DATABASE_USER must be set"),
            database_password: env::var("DATABASE_PASSWORD")
                .expect("DATABASE_PASSWORD must be set"),
            database_name: env::var("DATABASE_NAME")
                .expect("DATABASE_NAME must be set"),
        }
    }

    pub fn database_url(&self) -> String {
        format!(
            "postgres://{}:{}@{}:{}/{}",
            self.database_user,
            self.database_password,
            self.database_endpoint,
            self.database_port,
            self.database_name
        )
    }
}

pub async fn db() -> Result<PgPool, sqlx::Error> {
    let db_config = PostgresConfig::new();
    let pool = PgPool::connect(&db_config.database_url()).await?;
    Ok(pool)
}
