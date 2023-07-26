/*
  Warnings:

  - You are about to drop the column `complement` on the `tutor_addresses` table. All the data in the column will be lost.
  - Added the required column `country` to the `tutor_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `tutor_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tutor_addresses" DROP COLUMN "complement",
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL;
