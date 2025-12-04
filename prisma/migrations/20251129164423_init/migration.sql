-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('WEB', 'MOBILE', 'MARKETPLACE', 'STORE', 'PARTNER');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "channelId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "channelId" TEXT;

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ChannelType" NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_slug_key" ON "Channel"("slug");

-- CreateIndex
CREATE INDEX "Order_channelId_idx" ON "Order"("channelId");

-- CreateIndex
CREATE INDEX "Product_channelId_idx" ON "Product"("channelId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
