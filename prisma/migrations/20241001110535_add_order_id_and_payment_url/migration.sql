/*
  Warnings:

  - Added the required column `order_id` to the `RiwayatPembelian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_url` to the `RiwayatPembelian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiwayatPembelian" ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "payment_url" TEXT NOT NULL;
