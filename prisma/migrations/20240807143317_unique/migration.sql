/*
  Warnings:

  - A unique constraint covering the columns `[userId,restaurantId]` on the table `UserRestaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserRestaurant_userId_restaurantId_key" ON "UserRestaurant"("userId", "restaurantId");
