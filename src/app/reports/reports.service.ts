import { PetsMapper } from '@/infra/database/prisma/mappers/pets.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
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
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async petsReport(filters: PetsReportsFilters, pagination: Pagination) {
    const { neighborhood, species, breed } = filters
    const { page, limit } = pagination

    /**
     * TODO: This may change to Elasticsearch in the future
     *
     * Added cache to base scenario (no filters provided)
     */
    if (!neighborhood && !species && !breed) {
      const cachedPetsReport = await this.cacheManager.get('petsReport')

      if (cachedPetsReport) {
        return cachedPetsReport
      }

      const petsData = await this.prismaService.pets.findMany({
        skip: (page - 1) * limit,
        take: limit,
      })

      const totalPets = await this.prismaService.pets.count()

      const percentage = 100

      const data = {
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

      await this.cacheManager.set('petsReport', data, 300) // cache for 5 minutes

      return data
    }

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

    /**
     * TODO: This may change to Elasticsearch in the future
     *
     * Added cache to base scenario (no filters provided)
     */
    if (!neighborhood && !city && !state && !zipcode) {
      const cachedTutors = await this.cacheManager.get('tutors')

      if (cachedTutors) {
        return cachedTutors
      }

      const tutorsData = await this.prismaService.tutors.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          Tutor_Addresses: true, // This will include the address details for each tutor
        },
      })

      const totalTutors = await this.prismaService.tutors.count()

      const percentage = 100

      const data = {
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
          percentage,
          total: totalTutors,
          page,
          limit,
        },
      }

      await this.cacheManager.set('tutors', data, 300) // cache for 5 minutes

      return data
    }

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

  async speciesPizzaChartReport() {
    // Get the counts of each species
    const speciesCounts = await this.prismaService.pets.groupBy({
      by: ['species'],
      _count: {
        species: true,
      },
      orderBy: {
        _count: {
          species: 'desc',
        },
      },
    })

    // Keep the top 4 species and map them to the desired format
    const topSpecies = speciesCounts.slice(0, 4).map((species) => ({
      name: species.species,
      value: species._count.species,
    }))

    // Sum the counts of all other species
    const othersCount = speciesCounts
      .slice(4)
      .reduce((sum, species) => sum + species._count.species, 0)

    // Create the "others" category if there are any and map to the desired format
    const others =
      othersCount > 0 ? [{ name: 'Others', value: othersCount }] : []

    // Combine the top species with "others"
    const report = topSpecies.concat(others)

    return {
      data: report,
    }
  }

  async petsAmountPerNeighborhoodPizzaChartReport() {
    // Fetch pets with their related addresses
    const petsWithAddresses = await this.prismaService.pets.findMany({
      include: {
        Tutor_Addresses: true, // Include related addresses
      },
    })

    // Manually group and count pets by neighborhood
    const neighborhoodCounts = petsWithAddresses.reduce((acc, pet) => {
      const neighborhood = pet.Tutor_Addresses?.neighborhood
      if (neighborhood) {
        acc[neighborhood] = (acc[neighborhood] || 0) + 1
      }
      return acc
    }, {})

    // Convert to array and sort by count
    const sortedNeighborhoods = Object.entries(neighborhoodCounts)
      .map(([name, value]) => ({ name, value: value as number })) // Explicitly cast value to number
      .sort((a, b) => b.value - a.value)

    // Keep the top 4 neighborhoods
    const topNeighborhoods = sortedNeighborhoods.slice(0, 4)

    // Sum the counts of all other neighborhoods
    const othersCount = sortedNeighborhoods
      .slice(4)
      .reduce((sum, neighborhood) => sum + neighborhood.value, 0)

    // Create the "others" category if there are any
    const others =
      othersCount > 0 ? [{ name: 'Others', value: othersCount }] : []

    // Combine the top neighborhoods with "others"
    const report = topNeighborhoods.concat(others)

    return {
      data: report,
    }
  }
}
