-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('FOOD', 'BEVERAGE', 'BAR');

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "type" "ItemType" NOT NULL DEFAULT 'FOOD';
