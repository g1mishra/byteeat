/*
  Warnings:

  - A unique constraint covering the columns `[itemId,portion]` on the table `PriceItemMap` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PriceItemMap_itemId_portion_key" ON "PriceItemMap"("itemId", "portion");
