/*
  Warnings:

  - You are about to drop the column `birthdate` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `pets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rga]` on the table `pets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birthDate` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "birthdate",
DROP COLUMN "image_url",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ALTER COLUMN "microchip" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pets_rga_key" ON "pets"("rga");

-- CreateIndex
CREATE INDEX "pets_microchip" ON "pets"("microchip");

-- CreateIndex
CREATE INDEX "pets_rga" ON "pets"("rga");
