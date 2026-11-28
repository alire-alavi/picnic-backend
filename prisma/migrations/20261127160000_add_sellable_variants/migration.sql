BEGIN;

-- CreateEnum
CREATE TYPE "SellingMode" AS ENUM ('RETAIL', 'WHOLESALE');

-- CreateEnum
CREATE TYPE "PurchasePolicy" AS ENUM ('INSTANT', 'TEAM_VERIFICATION');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "wholesaleMinimumPacks" INTEGER;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "currencyCode" TEXT,
ADD COLUMN     "packContents" JSONB,
ADD COLUMN     "sellingMode" "SellingMode",
ADD COLUMN     "variantId" TEXT,
ADD COLUMN     "variantName" TEXT,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "ProductSellingMode" (
    "productId" TEXT NOT NULL,
    "mode" "SellingMode" NOT NULL,
    "purchasePolicy" "PurchasePolicy" NOT NULL,

    CONSTRAINT "ProductSellingMode_pkey" PRIMARY KEY ("productId","mode")
);

-- CreateTable
CREATE TABLE "SellableVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "mode" "SellingMode" NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "packContents" JSONB,

    CONSTRAINT "SellableVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantPrice" (
    "variantId" TEXT NOT NULL,
    "currencyId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "VariantPrice_pkey" PRIMARY KEY ("variantId","currencyId")
);

-- CreateIndex
CREATE INDEX "SellableVariant_productId_mode_idx" ON "SellableVariant"("productId", "mode");

-- CreateIndex
CREATE UNIQUE INDEX "SellableVariant_id_productId_mode_key" ON "SellableVariant"("id", "productId", "mode");

-- CreateIndex
CREATE INDEX "VariantPrice_currencyId_idx" ON "VariantPrice"("currencyId");

-- CreateIndex
CREATE INDEX "OrderItem_variantId_itemId_sellingMode_idx" ON "OrderItem"("variantId", "itemId", "sellingMode");

-- AddForeignKey
ALTER TABLE "ProductSellingMode" ADD CONSTRAINT "ProductSellingMode_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellableVariant" ADD CONSTRAINT "SellableVariant_productId_mode_fkey" FOREIGN KEY ("productId", "mode") REFERENCES "ProductSellingMode"("productId", "mode") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantPrice" ADD CONSTRAINT "VariantPrice_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "SellableVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantPrice" ADD CONSTRAINT "VariantPrice_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_itemId_sellingMode_fkey" FOREIGN KEY ("variantId", "itemId", "sellingMode") REFERENCES "SellableVariant"("id", "productId", "mode") ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE "Category" ADD CONSTRAINT "Category_wholesaleMinimumPacks_positive"
    CHECK ("wholesaleMinimumPacks" > 0);

ALTER TABLE "SellableVariant" ADD CONSTRAINT "SellableVariant_stock_nonnegative"
    CHECK ("stock" >= 0);

-- A pack can contain multiple item types, even for a wholesale-only product.
CREATE FUNCTION is_valid_wholesale_pack(contents JSONB) RETURNS BOOLEAN
LANGUAGE SQL IMMUTABLE AS $$
    SELECT CASE WHEN jsonb_typeof(contents) = 'array' THEN
        jsonb_array_length(contents) > 0
        AND NOT EXISTS (
            SELECT 1
            FROM jsonb_array_elements(contents) AS entries(item)
            WHERE jsonb_typeof(item) <> 'object'
                OR jsonb_typeof(item->'name') IS DISTINCT FROM 'string'
                OR trim(item->>'name') = ''
                OR CASE WHEN jsonb_typeof(item->'quantity') = 'number' THEN
                    (item->>'quantity')::numeric < 1
                    OR (item->>'quantity')::numeric <> trunc((item->>'quantity')::numeric)
                ELSE TRUE END
        )
    ELSE FALSE END;
$$;

ALTER TABLE "SellableVariant" ADD CONSTRAINT "SellableVariant_packContents_matches_mode"
    CHECK (CASE WHEN "mode" = 'RETAIL' THEN "packContents" IS NULL
        ELSE is_valid_wholesale_pack("packContents") END);

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variant_snapshot_complete"
    CHECK (CASE WHEN "variantId" IS NULL THEN
        "sellingMode" IS NULL AND "variantName" IS NULL
        AND "packContents" IS NULL AND "currencyCode" IS NULL
    ELSE
        "sellingMode" IS NOT NULL AND "variantName" IS NOT NULL
        AND "currencyCode" IS NOT NULL
        AND CASE WHEN "sellingMode" = 'WHOLESALE' THEN
            is_valid_wholesale_pack("packContents")
        ELSE "packContents" IS NULL END
    END);

-- Existing product-only orders keep their original product, quantity and unit
-- price. Their currency and variant were never recorded.
INSERT INTO "ProductSellingMode" ("productId", "mode", "purchasePolicy")
SELECT "id", 'RETAIL', 'INSTANT' FROM "Product";

INSERT INTO "SellableVariant" ("id", "productId", "mode", "name")
SELECT gen_random_uuid()::text, "id", 'RETAIL', "name" FROM "Product";

INSERT INTO "VariantPrice" ("variantId", "currencyId", "amount")
SELECT variant."id", price."currencyId", price."amount"
FROM "ProductPrice" AS price
JOIN "SellableVariant" AS variant ON variant."productId" = price."productId";

-- The legacy storefront displays base-only prices in toman. Keep the amount
-- in that denomination, and keep products' explicit currency prices as-is.
INSERT INTO "Currency" ("id", "code", "name", "symbol", "decimalPlaces", "updatedAt")
SELECT gen_random_uuid()::text, 'IRT', 'Iranian Toman', 'تومان', 2, CURRENT_TIMESTAMP
WHERE EXISTS (
    SELECT 1 FROM "SellableVariant" AS variant
    WHERE NOT EXISTS (SELECT 1 FROM "VariantPrice" WHERE "variantId" = variant."id")
)
ON CONFLICT ("code") DO NOTHING;

INSERT INTO "VariantPrice" ("variantId", "currencyId", "amount")
SELECT variant."id", currency."id", product."price"
FROM "SellableVariant" AS variant
JOIN "Product" AS product ON product."id" = variant."productId"
JOIN "Currency" AS currency ON currency."code" = 'IRT'
WHERE NOT EXISTS (SELECT 1 FROM "VariantPrice" WHERE "variantId" = variant."id");

COMMIT;
