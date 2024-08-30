-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_advertId_fkey";

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_advertId_fkey" FOREIGN KEY ("advertId") REFERENCES "Advert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
