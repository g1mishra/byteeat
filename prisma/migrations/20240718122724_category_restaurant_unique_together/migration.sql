/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,categoryName]` on the table `ItemCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ItemCategory_categoryName_key";

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_restaurantId_categoryName_key" ON "ItemCategory"("restaurantId", "categoryName");
