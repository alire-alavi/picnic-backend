-- Add migration script here
CREATE TABLE IF NOT EXISTS categories (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    description         TEXT NOT NULL,
    image_url           TEXT,
    parent_id           INTEGER REFERENCES categories(id)
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    meta_title          TEXT,
    meta_description    TEXT,
    keywords            TEXT,
);

CREATE INDEX IF NOT EXISTS idx_category_slug ON categories(slug);

