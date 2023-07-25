-- CreateTable
CREATE TABLE "tutors" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "primary_address_id" TEXT,

    CONSTRAINT "tutors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor_addresses" (
    "id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutor_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tutors_cpf_key" ON "tutors"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "tutors_email_key" ON "tutors"("email");

-- AddForeignKey
ALTER TABLE "tutor_addresses" ADD CONSTRAINT "tutor_addresses_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
