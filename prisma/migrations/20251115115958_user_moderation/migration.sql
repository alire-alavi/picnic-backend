-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED', 'BANNED', 'FLAGGED', 'INCOMPLETE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferences" JSONB,
ADD COLUMN     "profileStatus" "UserStatus" NOT NULL DEFAULT 'INCOMPLETE';
