import { Injectable } from '@nestjs/common'
import { CreatePetsTransferRequestDto } from './dto/create-pets_transfer_request.dto'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PetsTransferRequest } from './entities/pets_transfer_request.entity'
import { PetsTransferRequestMapper } from '@/infra/database/prisma/mappers/pets_transfer_request.mapper'

@Injectable()
export class PetsTransferRequestsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    senderId: string,
    createPetsTransferRequestDto: CreatePetsTransferRequestDto,
  ) {
    const request = new PetsTransferRequest({
      senderId,
      ...createPetsTransferRequestDto,
    })
    const prismaRequest = PetsTransferRequestMapper.toPrisma(request)
    return this.prismaService.petsTransferRequest.create({
      data: prismaRequest,
    })
  }

  findAllSent(senderId: string) {
    return this.prismaService.petsTransferRequest.findMany({
      where: { senderId },
    })
  }

  findAllReceived(receiverId: string) {
    return this.prismaService.petsTransferRequest.findMany({
      where: { receiverId },
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
