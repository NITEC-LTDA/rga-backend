-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "isCastrated" BOOLEAN;

-- CreateIndex
CREATE INDEX "pets_address_id" ON "pets"("addressId");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "tutor_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
