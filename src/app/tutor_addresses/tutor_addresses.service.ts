import { Injectable } from '@nestjs/common'
import { CreateTutorAddressDto } from './dto/create-tutor_address.dto'
import { UpdateTutorAddressDto } from './dto/update-tutor_address.dto'
import { TutorAddress } from './entities/tutor_address.entity'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { TutorsAddressesMapper } from '@/infra/database/prisma/mappers/tutors_addresses.mapper'

@Injectable()
export class TutorAddressesService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(createTutorAddressDto: CreateTutorAddressDto) {
    const tutorAddress = new TutorAddress(createTutorAddressDto)

    const prismaTutorAddress = TutorsAddressesMapper.toPrisma(tutorAddress)

    const addressCount = await this.prismaService.tutor_Addresses.count({
      where: {
        tutor_id: prismaTutorAddress.tutor_id,
      },
    })

    if (addressCount === 0) {
      this.prismaService.tutors.update({
        where: {
          id: prismaTutorAddress.tutor_id,
        },
        data: {
          primaryAddressId: prismaTutorAddress.id,
        },
      })
    }

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

  findOne(id: number) {
    return `This action returns a #${id} tutorAddress`
  }

  update(id: number, updateTutorAddressDto: UpdateTutorAddressDto) {
    return `This action updates a #${id} tutorAddress`
  }

  remove(id: number) {
    return `This action removes a #${id} tutorAddress`
  }
}
