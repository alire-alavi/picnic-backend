use uuid::Uuid;
use sqlx::FromRow;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Category {
    pub id: Uuid,
    pub name: String,
    pub slug: String,
    pub description: String,
    pub stock_quantity: i32,
    pub image_url: Option<String>,
    pub meta_title: Option<String>,
    pub meta_description: Option<String>,
    pub keywords: Option<string>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}
