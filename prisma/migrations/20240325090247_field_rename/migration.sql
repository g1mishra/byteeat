/*
  Warnings:

  - You are about to drop the column `vegOrNonVeg` on the `Item` table. All the data in the column will be lost.
  - The `foodOrBar` column on the `Item` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[categoryName]` on the table `ItemCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "vegOrNonVeg",
ADD COLUMN     "isVeg" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "foodOrBar",
ADD COLUMN     "foodOrBar" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PriceItemMap" ALTER COLUMN "portion" SET DEFAULT 'null';

-- CreateIndex
CREATE UNIQUE INDEX "ItemCategory_categoryName_key" ON "ItemCategory"("categoryName");
