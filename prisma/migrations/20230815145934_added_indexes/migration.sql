-- AlterTable
ALTER TABLE "pets" ALTER COLUMN "microchip" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "pets_microchip" ON "pets"("microchip");

-- CreateIndex
CREATE INDEX "pets_rga" ON "pets"("rga");
