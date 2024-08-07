-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'WAITER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role";
