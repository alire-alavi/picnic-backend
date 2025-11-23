/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[thumbnailId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ImageSize" AS ENUM ('SMALL', 'MEDIUM', 'LARGE');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imageId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "thumbnailId" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" "ImageSize" NOT NULL DEFAULT 'LARGE',
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productSliderId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_imageId_key" ON "Category"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_thumbnailId_key" ON "Product"("thumbnailId");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_productSliderId_fkey" FOREIGN KEY ("productSliderId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
