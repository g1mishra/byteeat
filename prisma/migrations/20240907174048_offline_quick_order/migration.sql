-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "type" "OrderType" NOT NULL DEFAULT 'ONLINE';
