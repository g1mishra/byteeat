/*
  Warnings:

  - You are about to drop the `CategoryPosition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoryPosition" DROP CONSTRAINT "CategoryPosition_categoryId_fkey";

-- AlterTable
ALTER TABLE "ItemCategory" ADD COLUMN     "position" SERIAL NOT NULL;

-- DropTable
DROP TABLE "CategoryPosition";
