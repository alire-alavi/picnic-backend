/*
  Warnings:

  - You are about to drop the column `size` on the `Image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "size",
ADD COLUMN     "md" TEXT,
ADD COLUMN     "sm" TEXT;

-- DropEnum
DROP TYPE "ImageSize";
