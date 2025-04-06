CREATE TABLE IF NOT EXISTS products (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    description         TEXT NOT NULL,
    price               DOUBLE PRECISION NOT NULL,
    whole_price         DOUBLE PRECISION,
    stock_quantity      INTEGER NOT NULL,
    sku                 VARCHAR(64) NOT NULL,
    image_url           TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    meta_title          TEXT,
    meta_description    TEXT
);

-- Index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_sku ON products(sku);

