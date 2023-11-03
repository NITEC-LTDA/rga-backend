import { Injectable } from '@nestjs/common'
import { UpdateTutorAddressDto } from './dto/update-tutor_address.dto'
import { TutorAddress } from './entities/tutor_address.entity'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { TutorsAddressesMapper } from '@/infra/database/prisma/mappers/tutors_addresses.mapper'

@Injectable()
export class TutorAddressesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(tutorAddress: TutorAddress) {
    const prismaTutorAddress = TutorsAddressesMapper.toPrisma(tutorAddress)

    return this.prismaService.tutor_Addresses.create({
      data: prismaTutorAddress,
    })
  }

  async findAll(tutorId: string) {
    const tutorAddresses = await this.prismaService.tutor_Addresses.findMany({
      where: {
        tutor_id: tutorId,
      },
    })

    return tutorAddresses.map((tutorAddress) => {
      return TutorsAddressesMapper.toHttp(tutorAddress)
    })
  }

  findOne(id: string) {
    return this.prismaService.tutor_Addresses.findUnique({
      where: {
        id,
      },
    })
  }

  update(updatedAddress: TutorAddress) {
    return this.prismaService.tutor_Addresses.update({
      where: {
        id: updatedAddress.id,
      },
      data: TutorsAddressesMapper.toPrisma(updatedAddress),
    })
  }

  remove(id: number) {
    return `This action removes a #${id} tutorAddress`
  }

  async count(tutorId: string) {
    return this.prismaService.tutor_Addresses.count({
      where: {
        tutor_id: tutorId,
      },
    })
  }
}
