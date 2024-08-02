/*
  Warnings:

  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "userId" TEXT NOT NULL;

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