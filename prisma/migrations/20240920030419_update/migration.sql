/*
  Warnings:

  - You are about to drop the column `location` on the `Advert` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Advert" DROP COLUMN "location",
ADD COLUMN     "address" TEXT;
