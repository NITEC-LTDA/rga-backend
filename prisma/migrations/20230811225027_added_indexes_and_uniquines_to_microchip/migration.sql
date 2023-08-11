/*
  Warnings:

  - A unique constraint covering the columns `[microchip]` on the table `pets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pets_microchip_key" ON "pets"("microchip");

-- CreateIndex
CREATE INDEX "pets_microchip" ON "pets"("microchip");

-- CreateIndex
CREATE INDEX "pets_rga" ON "pets"("rga");
