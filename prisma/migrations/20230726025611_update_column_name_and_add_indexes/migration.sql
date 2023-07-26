/*
  Warnings:

  - You are about to drop the column `primary_address_id` on the `tutors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tutors" DROP COLUMN "primary_address_id",
ADD COLUMN     "primaryAddressId" TEXT;

-- CreateIndex
CREATE INDEX "tutor_id" ON "tutor_addresses"("tutor_id");

-- CreateIndex
CREATE INDEX "primaryAddressId" ON "tutors"("primaryAddressId");

-- CreateIndex
CREATE INDEX "cpf" ON "tutors"("cpf");
