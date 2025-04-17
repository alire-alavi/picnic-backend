use crate::models::Product;
use crate::models::Category;
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

pub async fn handler_get_product(Path(slug): Path<String>, State(pool): State<PgPool>) -> Result<Json<Product>, ProductError> {

    let record = sqlx::query!(
        r#"
        SELECT 
            p.id, p.name, p.slug, p.description, p.price, p.price_span, p.whole_price,
            p.stock_quantity, p.sku, p.image_url, 
            p.created_at, p.updated_at, p.meta_title, p.meta_description, p.keywords,
            jsonb_build_object(
                'id', c.id,
                'name', c.name,
                'slug', c.slug,
                'description', c.description,
                'image_url', c.image_url,
                'parent_id', c.parent_id,
                'created_at', c.created_at,
                'updated_at', c.updated_at,
                'meta_title', c.meta_title,
                'meta_description', c.meta_description,
                'keywords', c.keywords
            ) AS category
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = $1
        "#,
        slug,
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| ProductError::NotFound)?;
    
    let category: Option<Category> = record.category
        .map(|value| serde_json::from_value(value).unwrap());
    
    let product = Product {
        id: record.id,
        name: record.name,
        slug: record.slug,
        description: record.description,
        price: record.price,
        price_span: record.price_span,
        whole_price: record.whole_price,
        stock_quantity: record.stock_quantity,
        sku: record.sku,
        image_url: record.image_url,
        meta_title: record.meta_title,
        meta_description: record.meta_description,
        keywords: record.keywords,
        created_at: record.created_at,
        updated_at: record.updated_at,
        category: category.unwrap()
    };

    Ok(Json(product))
}

