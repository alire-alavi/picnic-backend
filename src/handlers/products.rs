use crate::models::product::Product;
use axum::{
    response::{IntoResponse, Response},
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

pub async fn handler_get_product(slug: String) -> Result<Json<Product>, ProductError> {
    let pool = db().await.map_err(|e| ProductError::DatabaseError(e.to_string()))?;

    let product = sqlx::query_as!(
        Product,
        r#"
        SELECT id, name, slug, description, price, stock_quantity, image_url, created_at, updated_at
        FROM products
        WHERE slug = $1
        "#,
        slug
    )
    .fetch_optional(&pool)
    .await
    .map_err(|e| ProductError::DatabaseError(e.to_string()))?;

    match product {
        Some(product) => Ok(Json(product)),
        None => Err(ProductError::NotFound),
    }
}
