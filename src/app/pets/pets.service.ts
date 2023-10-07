import { Injectable } from '@nestjs/common'
import { CreatePetDto } from './dto/create-pet.dto'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Pet } from './entities/pet.entity'
import { generateRga } from '../utils'
import { PetsMapper } from '@/infra/database/prisma/mappers/pets.mapper'

@Injectable()
export class PetsService {
  constructor(private prismaService: PrismaService) {}

  async create(createPetDto: CreatePetDto, tutorId: string) {
    const rga = generateRga(7)
    const pet = new Pet(createPetDto, tutorId, rga)
    const prismaPet = PetsMapper.toPrisma(pet)

    return this.prismaService.pets.create({
      data: {
        id: prismaPet.id,
        name: prismaPet.name,
        species: prismaPet.species,
        breed: prismaPet.breed,
        birthDate: prismaPet.birthDate,
        rga: prismaPet.rga,
        microchip: prismaPet.microchip,
        imageUrl: prismaPet.imageUrl,
        color: prismaPet.color,
        gender: prismaPet.gender,
        isCastrated: prismaPet.isCastrated,
        createdAt: prismaPet.createdAt,
        updatedAt: prismaPet.updatedAt,
        Tutors: {
          connect: {
            id: tutorId,
          },
        },

        Tutor_Addresses: {
          connect: {
            id: prismaPet.addressId,
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
    const pet = await this.prismaService.pets.findFirst({
      where: { microchip },
      include: {
        Tutors: {
          include: {
            Tutor_Addresses: true,
          },
        },
      },
    })
    // Find the address from the fetched addresses in the application
    const address =
      pet.Tutors?.Tutor_Addresses.find((addr) => addr.id === pet.addressId) ||
      null

    return {
      ...pet,
      Tutors: {
        ...pet.Tutors,
        Tutor_Addresses: [
          {
            ...address,
          },
        ],
      },
    }
  }

  async findWithTutorByRga(rga: string) {
    const pet = await this.prismaService.pets.findUnique({
      where: { rga },
      include: {
        Tutors: {
          include: {
            Tutor_Addresses: true,
          },
        },
      },
    })
    // Find the address from the fetched addresses in the application
    const address =
      pet.Tutors?.Tutor_Addresses.find((addr) => addr.id === pet.addressId) ||
      null

    return {
      ...pet,
      Tutors: {
        ...pet.Tutors,
        Tutor_Addresses: [
          {
            ...address,
          },
        ],
      },
    }
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
