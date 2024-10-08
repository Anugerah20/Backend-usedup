-- AlterTable
ALTER TABLE "Advert" ADD COLUMN     "highlightExpiry" TIMESTAMP(3),
ADD COLUMN     "isHighlighted" BOOLEAN NOT NULL DEFAULT false;
