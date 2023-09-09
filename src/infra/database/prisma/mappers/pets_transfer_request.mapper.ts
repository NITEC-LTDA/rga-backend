import { PetsTransferRequest as RawPetsTransferRequest } from '@prisma/client'
import { PetsTransferRequest } from '@/app/pets_transfer_requests/entities/pets_transfer_request.entity'

export class PetsTransferRequestMapper {
  static toHttp(raw: RawPetsTransferRequest) {
    return {
      id: raw.id,
      senderId: raw.senderId,
      receiverId: raw.receiverId,
      petId: raw.petId,
      acceptedAt: raw.acceptedAt,
      canceledAt: raw.canceledAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  static toPrisma(petsTransferRequest: PetsTransferRequest) {
    return {
      id: petsTransferRequest.id,
      senderId: petsTransferRequest.senderId,
      receiverId: petsTransferRequest.receiverId,
      petId: petsTransferRequest.petId,
      acceptedAt: petsTransferRequest.acceptedAt,
      canceledAt: petsTransferRequest.canceledAt,
      createdAt: petsTransferRequest.createdAt,
      updatedAt: petsTransferRequest.updatedAt,
    }
  }
}
