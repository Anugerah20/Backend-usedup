/*
  Warnings:

  - You are about to drop the column `userId` on the `Paket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Paket" DROP CONSTRAINT "Paket_userId_fkey";

-- AlterTable
ALTER TABLE "Paket" DROP COLUMN "userId";
