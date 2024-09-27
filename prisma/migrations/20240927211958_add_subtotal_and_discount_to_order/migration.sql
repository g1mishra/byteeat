-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Populate subtotal with existing total data
UPDATE "Order" SET "subtotal" = "total";
