/*
  Warnings:

  - You are about to drop the column `address` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `address_string` to the `ItemCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `ItemCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `ItemCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address_string` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemCategory" ADD COLUMN     "address_string" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'India',
ADD COLUMN     "state" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "address",
ADD COLUMN     "address_string" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'India',
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
