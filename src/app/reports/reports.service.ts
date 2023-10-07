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

    // Create base query object
    const baseQuery = {
      Tutors: {
        Tutor_Addresses: {
          some: {
            neighborhood,
          },
        },
      },
    }

    // Dynamically build where clause based on provided filters
    const where: any = {
      AND: [baseQuery],
    }

    if (species) {
      where.AND.push({ species })
    }

    if (breed) {
      where.AND.push({ breed })
    }

    // If neighborhood is not specified, remove base query
    if (!neighborhood) {
      where.AND.shift()
    }

    // Simplify further by directly using where condition in findMany and count
    const petsData = await this.prismaService.pets.findMany({
      where: neighborhood || species || breed ? where : {},
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalPets = await this.prismaService.pets.count()

    // Directly use where condition in count
    const allPetsWithFiltersCount = await this.prismaService.pets.count({
      where: neighborhood || species || breed ? where : {},
    })

    return {
      data: {
        pets: petsData.map((pet) => PetsMapper.toHttp(pet)),
      },
      meta: {
        percentage: (allPetsWithFiltersCount / totalPets) * 100,
        total: totalPets,
        page,
        limit,
      },
    }
  }

  async tutorsReport(filters: TutorsReportsFilters, pagination: Pagination) {
    const { neighborhood, city, state, zipcode } = filters
    const { page, limit } = pagination

    // Dynamically build where clause based on provided filters
    const where: any = {
      Tutor_Addresses: {
        some: {},
      },
    }

    if (neighborhood) {
      where.Tutor_Addresses.some.neighborhood = neighborhood
    }

    if (city) {
      where.Tutor_Addresses.some.city = city
    }

    if (state) {
      where.Tutor_Addresses.some.state = state
    }

    if (zipcode) {
      where.Tutor_Addresses.some.zipcode = zipcode
    }

    // If no filters provided, use an empty where clause
    const finalWhere = Object.keys(where.Tutor_Addresses.some).length
      ? where
      : {}

    const tutorsData = await this.prismaService.tutors.findMany({
      where: finalWhere,
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalTutors = await this.prismaService.tutors.count()

    const allTutorsWithFiltersCount = await this.prismaService.tutors.count({
      where: finalWhere,
    })

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
        total: totalTutors,
        percentage: (allTutorsWithFiltersCount / totalTutors) * 100,
        page,
        limit,
      },
    }
  }
}
