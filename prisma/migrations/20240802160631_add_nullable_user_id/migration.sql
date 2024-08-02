-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropIndex
DROP INDEX "Order_status_idx";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE "Order" o
SET "userId" = r."userId"
FROM "Restaurant" r
WHERE o."restaurantId" = r."id"
  AND o."userId" IS NULL;

-- Verify the update
SELECT COUNT(*) as remaining_null_userids
FROM "Order"
WHERE "userId" IS NULL;