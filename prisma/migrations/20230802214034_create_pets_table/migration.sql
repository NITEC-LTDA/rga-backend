-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "species" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "gender" VARCHAR(10) NOT NULL,
    "color" VARCHAR(20) NOT NULL,
    "microchip" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "rga" TEXT NOT NULL,
    "tutorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pets_tutor_id" ON "pets"("tutorId");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
