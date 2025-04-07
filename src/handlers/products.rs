use crate::models::product::Product;
use crate::db::client::db;
use axum::{
    response::{IntoResponse, Response},
    extract::{Path},
    http::StatusCode,
    Json,
};
use sqlx::postgres::PgPool;

#[derive(Debug)]
pub enum ProductError {
    DatabaseError(String),
    NotFound,
}

impl IntoResponse for ProductError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            ProductError::DatabaseError(err) => (StatusCode::INTERNAL_SERVER_ERROR, err),
            ProductError::NotFound => (StatusCode::NOT_FOUND, "Product not found".to_string()),
        };

        (status, Json(serde_json::json!({ "error": message }))).into_response()
    }
}

pub async fn handler_get_product(slug: Path<String>) -> Result<Json<Product>, ProductError> {
    let pool = db().await.map_err(|e| ProductError::DatabaseError(e.to_string()))?;

    let product = sqlx::query_as!(
        Product,
        r#"
        SELECT c.id, c.name, c.slug, c.description, c.image_url
        FROM categories c
        JOIN products p ON c.id = p.category_id
        WHERE p.slug = $1
        "#,
        slug,
    )
    .fetch_optional(&pool)
    .await
    .map_err(|e| ProductError::DatabaseError(e.to_string()))?;

    match product {
        Some(product) => Ok(Json(product)),
        None => Err(ProductError::NotFound),
    }
}

