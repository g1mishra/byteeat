/*
  Warnings:

  - A unique constraint covering the columns `[providerAccountId]` on the table `account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "account_providerAccountId_key" ON "account"("providerAccountId");
