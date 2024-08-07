-- DropIndex
DROP INDEX "UserRestaurant_userId_restaurantId_key";

-- CreateTable
CREATE TABLE "JoiningKey" (
    "id" TEXT NOT NULL,
    "field" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "JoiningKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JoiningKey_restaurantId_key" ON "JoiningKey"("restaurantId");

-- AddForeignKey
ALTER TABLE "JoiningKey" ADD CONSTRAINT "JoiningKey_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
