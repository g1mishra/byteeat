/*
  Warnings:

  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_itemId_fkey";

-- DropTable
DROP TABLE "Price";

-- CreateTable
CREATE TABLE "PriceItemMap" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "portion" TEXT NOT NULL,

    CONSTRAINT "PriceItemMap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PriceItemMap" ADD CONSTRAINT "PriceItemMap_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
