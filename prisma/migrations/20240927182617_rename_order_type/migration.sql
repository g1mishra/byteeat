-- AlterEnum
BEGIN;
CREATE TYPE "OrderType_new" AS ENUM ('QR', 'MANUAL');
ALTER TABLE "Order" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "type" TYPE "OrderType_new" USING (
  CASE
    WHEN "type" = 'ONLINE' THEN 'QR'::text::"OrderType_new"
    WHEN "type" = 'OFFLINE' THEN 'MANUAL'::text::"OrderType_new"
    ELSE 'QR'::text::"OrderType_new"
  END
);
ALTER TYPE "OrderType" RENAME TO "OrderType_old";
ALTER TYPE "OrderType_new" RENAME TO "OrderType";
DROP TYPE "OrderType_old";
ALTER TABLE "Order" ALTER COLUMN "type" SET DEFAULT 'QR';
COMMIT;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "type" SET DEFAULT 'QR';
