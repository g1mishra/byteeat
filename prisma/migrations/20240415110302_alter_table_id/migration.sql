/*
  Warnings:

  - The primary key for the `CategoryPosition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ItemCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address_string` on the `ItemCategory` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `ItemCategory` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `ItemCategory` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `ItemCategory` table. All the data in the column will be lost.
  - The primary key for the `ItemPosition` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PriceItemMap` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Restaurant` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CategoryPosition" DROP CONSTRAINT "CategoryPosition_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ItemCategory" DROP CONSTRAINT "ItemCategory_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "ItemPosition" DROP CONSTRAINT "ItemPosition_itemId_fkey";

-- DropForeignKey
ALTER TABLE "PriceItemMap" DROP CONSTRAINT "PriceItemMap_itemId_fkey";

-- AlterTable
ALTER TABLE "CategoryPosition" DROP CONSTRAINT "CategoryPosition_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "CategoryPosition_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CategoryPosition_id_seq";

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Item_id_seq";

-- AlterTable
ALTER TABLE "ItemCategory" DROP CONSTRAINT "ItemCategory_pkey",
DROP COLUMN "address_string",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "state",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "restaurantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ItemCategory_id_seq";

-- AlterTable
ALTER TABLE "ItemPosition" DROP CONSTRAINT "ItemPosition_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "itemId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ItemPosition_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ItemPosition_id_seq";

-- AlterTable
ALTER TABLE "PriceItemMap" DROP CONSTRAINT "PriceItemMap_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "itemId" SET DATA TYPE TEXT,
ADD CONSTRAINT "PriceItemMap_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PriceItemMap_id_seq";

-- AlterTable
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Restaurant_id_seq";

-- AddForeignKey
ALTER TABLE "ItemCategory" ADD CONSTRAINT "ItemCategory_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceItemMap" ADD CONSTRAINT "PriceItemMap_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryPosition" ADD CONSTRAINT "CategoryPosition_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ItemCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPosition" ADD CONSTRAINT "ItemPosition_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
