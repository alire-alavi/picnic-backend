use uuid::Uuid;
use sqlx::FromRow;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use super::Category;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Product {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: String,
    pub price: f64,
    pub price_span: Option<String>,
    pub whole_price: Option<f64>,
    pub stock_quantity: i32,
    pub sku: String,
    pub image_url: Option<String>,
    pub meta_title: Option<String>,
    pub meta_description: Option<String>,
    pub keywords: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub category: Option<Category>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct ProductFromQuery {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: String,
    pub price: f64,
    pub price_span: Option<String>,
    pub whole_price: Option<f64>,
    pub stock_quantity: i32,
    pub sku: String,
    pub image_url: Option<String>,
    pub meta_title: Option<String>,
    pub meta_description: Option<String>,
    pub keywords: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
    pub category_id: Uuid,
    pub category_name: String,
    pub category_slug: String,
    pub category_description: String,
    pub category_image_url: Option<String>,
    pub category_meta_title: Option<String>,
    pub category_meta_description: Option<String>,
    pub category_keywords: Option<String>,
    pub category_created_at: chrono::DateTime<chrono::Utc>,
    pub category_updated_at: chrono::DateTime<chrono::Utc>,
}

impl ProductFromQuery {
    pub fn into_product(self) -> Product {
        Product {
            id: self.id,
            name: self.name,
            slug: self.slug,
            description: self.description,
            price: self.price,
            price_span: self.price_span,
            whole_price: self.whole_price,
            stock_quantity: self.stock_quantity,
            sku: self.sku,
            image_url: self.image_url,
            meta_title: self.meta_title,
            meta_description: self.meta_description,
            keywords: self.keywords,
            created_at: self.created_at,
            updated_at: self.updated_at,
            category: Some(Category {
                id: self.category_id,
                name: self.category_name,
                slug: self.category_slug,
                description: self.category_description,
                image_url: self.category_image_url,
                meta_title: self.category_meta_title,
                meta_description: self.category_meta_description,
                keywords: self.category_keywords,
                created_at: self.category_created_at,
                updated_at: self.category_updated_at,
            })
        }
    }
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
    pub category_id: String,
} 
