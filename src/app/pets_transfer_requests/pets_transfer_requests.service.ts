import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PetsTransferRequest } from './entities/pets_transfer_request.entity'
import { PetsTransferRequestMapper } from '@/infra/database/prisma/mappers/pets_transfer_request.mapper'

@Injectable()
export class PetsTransferRequestsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(senderId: string, receiverId: string, petId: string) {
    const request = new PetsTransferRequest({
      senderId,
      receiverId,
      petId,
    })
    const prismaRequest = PetsTransferRequestMapper.toPrisma(request)
    return this.prismaService.petsTransferRequest.create({
      data: prismaRequest,
    })
  }

  findAllSent(senderId: string) {
    return this.prismaService.petsTransferRequest.findMany({
      where: { senderId },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        petId: true,
        acceptedAt: true,
        canceledAt: true,
        createdAt: true,
        updatedAt: true,
        Pets: {
          select: {
            id: true,
            name: true,
            rga: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  findAllReceived(receiverId: string) {
    return this.prismaService.petsTransferRequest.findMany({
      where: { receiverId },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
        petId: true,
        acceptedAt: true,
        canceledAt: true,
        createdAt: true,
        updatedAt: true,
        Pets: {
          select: {
            id: true,
            name: true,
            rga: true,
          },
        },
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  acceptRequest(requestId: string) {
    return this.prismaService.petsTransferRequest.update({
      where: { id: requestId, canceledAt: null },
      data: { acceptedAt: new Date() },
    })
  }

  async cancelRequest(requestId: string) {
    return this.prismaService.petsTransferRequest.update({
      where: { id: requestId, acceptedAt: null },
      data: { canceledAt: new Date() },
    })
  }

  async findOneCancellable(requestId: string) {
    return this.prismaService.petsTransferRequest.findFirst({
      where: { id: requestId, acceptedAt: null, canceledAt: null },
    })
  }

  async findOneAcceptable(requestId: string) {
    return this.prismaService.petsTransferRequest.findFirst({
      where: { id: requestId, acceptedAt: null, canceledAt: null },
    })
  }
}
