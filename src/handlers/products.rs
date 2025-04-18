use crate::models::product::ProductFromQuery;
use crate::models::Product;
use crate::models::Category;
use crate::db::client::db;
use axum::{
    response::{IntoResponse, Response},
    extract::{Path, State},
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

pub async fn handler_get_product(Path(slug): Path<String>, State(pool): State<PgPool>) -> Result<Json<Product>, ProductError> {

    let record: ProductFromQuery = sqlx::query_as::<_, ProductFromQuery>(
        r#"
        SELECT 
            p.id, 
            p.name, 
            p.slug, 
            p.description, 
            p.price, 
            p.price_span, 
            p.whole_price,
            p.stock_quantity, 
            p.sku, 
            p.image_url, 
            p.meta_title, 
            p.meta_description, 
            p.keywords,
            p.created_at, 
            p.updated_at,
        
            c.id AS category_id,
            c.name AS category_name,
            c.slug AS category_slug,
            COALESCE(c.description, '') AS category_description,
            c.image_url AS category_image_url,
            c.meta_title AS category_meta_title,
            c.meta_description AS category_meta_description,
            c.keywords AS category_keywords,
            c.created_at AS category_created_at,
            c.updated_at AS category_updated_at
        
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = $1
        "#,
    )
    .bind(slug)
    .fetch_one(&pool)
    .await
    .map_err(|_| ProductError::NotFound)?;

    Ok(Json(record.into_product()))
}

