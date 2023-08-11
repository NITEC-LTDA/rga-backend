import { Injectable } from '@nestjs/common'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Injectable()
export class PetsService {
  constructor(private prismaService: PrismaService) {}

  create(createPetDto: CreatePetDto) {
    return 'This action adds a new pet'
  }

  findAll() {
    return `This action returns all pets`
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet`
  }

  remove(id: number) {
    return `This action removes a #${id} pet`
  }

  async findByMicrochip(microchip: string) {
    return this.prismaService.pets.findUnique({
      where: { microchip },
    })
  }
}
