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

    return this.prismaService.pets.create({
      data: {
        ...prismaPet,
        Tutors: {
          connect: {
            id: tutorId,
          },
        },
      },
    })
  }

  async findAll(tutorId: string) {
    const pets = await this.prismaService.pets.findMany({
      where: { tutorId },
    })
    return pets
  }

  update(pet: Pet) {
    const updatedPet = PetsMapper.toPrisma(pet)
    return this.prismaService.pets.update({
      where: { id: updatedPet.id },
      data: updatedPet,
    })
  }

  remove(id: number) {
    return `This action removes a #${id} pet`
  }

  async findByMicrochip(microchip: string) {
    return this.prismaService.pets.findFirst({
      where: { microchip },
      include: {
        Tutors: {
          include: {
            Tutor_Addresses: true,
          },
        },
      },
    })
  }

  async findWithTutorByRga(rga: string) {
    return this.prismaService.pets.findUnique({
      where: { rga },
      include: {
        Tutors: {
          include: {
            Tutor_Addresses: true,
          },
        },
      },
    })
  }

  async findByRga(rga: string) {
    return this.prismaService.pets.findFirst({
      where: { rga },
    })
  }

  async findByTutorId(tutorId: string) {
    return this.prismaService.pets.findFirst({
      where: { tutorId },
    })
  }
}
