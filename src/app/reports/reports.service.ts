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

    // Base query for neighborhood
    const baseQuery = neighborhood
      ? {
          Tutors: {
            Tutor_Addresses: {
              some: {
                neighborhood,
              },
            },
          },
        }
      : {}

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

    // If no filters are provided, use an empty where clause
    const finalWhere = where.AND.length ? where : {}

    const petsData = await this.prismaService.pets.findMany({
      where: finalWhere,
      skip: (page - 1) * limit,
      take: limit,
      // Uncomment below if you want to include related data
      // include: {
      //     Tutors: true,
      // },
    })

    const totalPets = await this.prismaService.pets.count()
    const allPetsWithFiltersCount = await this.prismaService.pets.count({
      where: finalWhere,
    })

    const percentage =
      totalPets !== 0 ? (allPetsWithFiltersCount / totalPets) * 100 : 0

    return {
      data: {
        pets: petsData.map((pet) => PetsMapper.toHttp(pet)),
      },
      meta: {
        percentage,
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
      include: {
        Tutor_Addresses: true, // This will include the address details for each tutor
      },
    })

    const totalTutors = await this.prismaService.tutors.count()
    const allTutorsWithFiltersCount = await this.prismaService.tutors.count({
      where: finalWhere,
    })

    // Safely calculate percentage
    const percentage =
      totalTutors !== 0 ? (allTutorsWithFiltersCount / totalTutors) * 100 : 0

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
        percentage,
        page,
        limit,
      },
    }
  }

  async newTutorsPerMonthReport(year: number) {
    const tutorsData = await this.prismaService.tutors.findMany({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`),
        },
      },

      select: {
        createdAt: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    })

    const tutorsPerMonth = {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
    }

    tutorsData.forEach((tutor) => {
      const month = tutor.createdAt.getMonth()
      switch (month) {
        case 0:
          tutorsPerMonth.january += 1
          break
        case 1:
          tutorsPerMonth.february += 1
          break
        case 2:
          tutorsPerMonth.march += 1
          break
        case 3:
          tutorsPerMonth.april += 1
          break
        case 4:
          tutorsPerMonth.may += 1
          break
        case 5:
          tutorsPerMonth.june += 1
          break
        case 6:
          tutorsPerMonth.july += 1
          break
        case 7:
          tutorsPerMonth.august += 1
          break
        case 8:
          tutorsPerMonth.september += 1
          break
        case 9:
          tutorsPerMonth.october += 1
          break
        case 10:
          tutorsPerMonth.november += 1
          break
        case 11:
          tutorsPerMonth.december += 1
          break
      }
    })

    return tutorsPerMonth
  }
}
