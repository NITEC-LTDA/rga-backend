-- CreateTable
CREATE TABLE "pets_transfer_request" (
    "id" TEXT NOT NULL,
    "petId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_transfer_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "petId" ON "pets_transfer_request"("petId");

-- CreateIndex
CREATE INDEX "senderIdTutorId" ON "pets_transfer_request"("senderId");

-- CreateIndex
CREATE INDEX "receiverIdTutorId" ON "pets_transfer_request"("receiverId");

-- AddForeignKey
ALTER TABLE "pets_transfer_request" ADD CONSTRAINT "pets_transfer_request_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets_transfer_request" ADD CONSTRAINT "pets_transfer_request_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "tutors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets_transfer_request" ADD CONSTRAINT "pets_transfer_request_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "tutors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
