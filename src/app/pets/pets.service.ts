import { Injectable } from '@nestjs/common'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Pet } from './entities/pet.entity'
import { generateRga } from '../utils'
import { PetsMapper } from '@/infra/database/prisma/mappers/pets.mapper'

@Injectable()
export class PetsService {
  constructor(private prismaService: PrismaService) {}

  async create(createPetDto: CreatePetDto, tutorId: string) {
    const rga = generateRga(9)
    const pet = new Pet(createPetDto, tutorId, rga)
    const prismaPet = PetsMapper.toPrisma(pet)
    return this.prismaService.pets.create({ data: prismaPet })
  }

  async findAll(tutorId: string) {
    const pets = await this.prismaService.pets.findMany({
      where: { tutorId },
    })
    return pets
  }

  async update(rga: string, tutorId: string, updatePetDto: UpdatePetDto) {
    const pet = await this.findByRga(rga)
    const updatedPet = { ...pet, ...updatePetDto, tutorId }

    return this.prismaService.pets.update({
      where: { rga },
      data: PetsMapper.toPrisma(new Pet(updatedPet, tutorId, pet.rga)),
    })
  }

  remove(id: number) {
    return `This action removes a #${id} pet`
  }

  async findByMicrochip(microchip: string) {
    return this.prismaService.pets.findFirst({
      where: { microchip },
    })
  }

  async findByRga(rga: string) {
    return this.prismaService.pets.findUnique({
      where: { rga },
    })
  }

  async findByTutorId(tutorId: string) {
    return this.prismaService.pets.findFirst({
      where: { tutorId },
    })
  }
}
