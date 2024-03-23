-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "foodOrBar" TEXT NOT NULL DEFAULT 'Food',
ADD COLUMN     "vegOrNonVeg" TEXT NOT NULL DEFAULT 'Veg';
