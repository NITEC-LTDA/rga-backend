import { PetsMapper } from '@/infra/database/prisma/mappers/pets.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

interface PetsReportsFilters {
  neighborhood: string
  species: string
  breed: string
}

interface TutorsReportsFilters {
  neighborhood: string
  city: string
  state: string
  zipcode: string
}

interface Pagination {
  page: number
  limit: number
}

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async petsReport(filters: PetsReportsFilters, pagination: Pagination) {
    const { neighborhood, species, breed } = filters
    const { page, limit } = pagination

    const petsData = await this.prismaService.pets.findMany({
      where: {
        AND: [
          {
            Tutors: {
              Tutor_Addresses: {
                some: {
                  neighborhood,
                },
              },
            },
            species,
            breed,
          },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalPets = await this.prismaService.pets.count()

    return {
      data: {
        pets: petsData.map((pet) => PetsMapper.toHttp(pet)),
      },
      meta: {
        percentage: (petsData.length / totalPets) * 100,
        totalPets,
        page,
        limit,
      },
    }
  }

  async tutorsReport(filters: TutorsReportsFilters, pagination: Pagination) {
    const { neighborhood, city, state, zipcode } = filters
    const { page, limit } = pagination

    const tutorsData = await this.prismaService.tutors.findMany({
      where: {
        Tutor_Addresses: {
          some: {
            neighborhood,
            city,
            state,
            zipcode,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalTutors = await this.prismaService.tutors.count()

    return {
      data: {
        tutors: tutorsData.map((tutor) => ({
          id: tutor.id,
          name: tutor.name,
          email: tutor.email,
          phone: tutor.phone,
          createdAt: tutor.createdAt,
          updatedAt: tutor.updatedAt,
        })),
      },
      meta: {
        totalTutors,
        percentage: (tutorsData.length / totalTutors) * 100,
        page,
        limit,
      },
    }
  }
}
