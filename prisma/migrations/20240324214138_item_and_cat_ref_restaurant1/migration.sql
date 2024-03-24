-- AlterTable
ALTER TABLE "ItemCategory" ADD COLUMN     "restaurantId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "ItemCategory" ADD CONSTRAINT "ItemCategory_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
