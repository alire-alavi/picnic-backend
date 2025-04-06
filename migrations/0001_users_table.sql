CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(64) NOT NULL UNIQUE,
    phone_number    VARCHAR(32) UNIQUE,
    first_name      TEXT,
    last_name       TEXT,
    email           VARCHAR(512) UNIQUE,
    company_name    VARCHAR(512),
    birth_date      DATE,
    avatar_url      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_product_slug ON users(username);

