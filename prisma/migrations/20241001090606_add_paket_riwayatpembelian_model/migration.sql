-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('IKLAN', 'SOROT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "kuota_iklan" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "kuota_sorot" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Paket" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" JSONB,
    "type" "PackageType",
    "price" INTEGER NOT NULL,
    "duration" INTEGER,
    "kuota" INTEGER,
    "expired" TIMESTAMP(3),
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatPembelian" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "paketId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RiwayatPembelian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Paket" ADD CONSTRAINT "Paket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPembelian" ADD CONSTRAINT "RiwayatPembelian_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatPembelian" ADD CONSTRAINT "RiwayatPembelian_paketId_fkey" FOREIGN KEY ("paketId") REFERENCES "Paket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
