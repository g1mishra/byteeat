/*
  Warnings:

  - You are about to drop the `ItemPosition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemPosition" DROP CONSTRAINT "ItemPosition_itemId_fkey";

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "position" SERIAL NOT NULL;

-- DropTable
DROP TABLE "ItemPosition";
