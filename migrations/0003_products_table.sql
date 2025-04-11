CREATE TABLE IF NOT EXISTS products (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    description         TEXT NOT NULL,
    price               DOUBLE PRECISION NOT NULL,
    price_span          VARCHAR(512),
    whole_price         DOUBLE PRECISION,
    stock_quantity      INTEGER NOT NULL,
    sku                 VARCHAR(64) NOT NULL,
    image_url           TEXT,
    category_id         UUID REFERENCES categories(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    meta_title          VARCHAR(2048),
    meta_description    TEXT,
    keywords            TEXT
);

-- Index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_sku ON products(sku);

