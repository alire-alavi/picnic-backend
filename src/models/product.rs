use uuid::Uuid;
use sqlx::FromRow;
use serde::{Deserialize, Serialize};
use super::Category;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: String,
    pub price: f64,
    pub whole_price: f64,
    pub stock_quantity: i32,
    pub sku: String,
    pub image_url: Option<String>,
    pub meta_title: Option<String>,
    pub meta_description: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub category_id: i32, 
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewProduct {
    pub name: String,
    pub slug: String,
    pub description: String,
    pub price: f64,
    pub stock_quantity: i32,
    pub sku: String,
    pub image_url: Option<String>,
    pub meta_title: Option<String>,
    pub meta_description: Option<String>,
    pub category: Category,
} 
