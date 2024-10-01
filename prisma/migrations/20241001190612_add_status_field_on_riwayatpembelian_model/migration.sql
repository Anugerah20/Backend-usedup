-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "RiwayatPembelian" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
