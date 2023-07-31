import { Injectable } from '@nestjs/common'
import { CreateTutorAddressDto } from './dto/create-tutor_address.dto'
import { UpdateTutorAddressDto } from './dto/update-tutor_address.dto'
import { TutorAddress } from './entities/tutor_address.entity'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { TutorsAddressesMapper } from '@/infra/database/prisma/mappers/tutors_addresses.mapper'

@Injectable()
export class TutorAddressesService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createTutorAddressDto: CreateTutorAddressDto) {
    const tutorAddress = new TutorAddress(createTutorAddressDto)

    const prismaTutorAddress = TutorsAddressesMapper.toPrisma(tutorAddress)

    return this.prismaService.tutor_Addresses.create({
      data: prismaTutorAddress,
    })
  }

  findAll() {
    return `This action returns all tutorAddresses`
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
