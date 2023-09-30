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

@Injectable()
export class ReportsService {
  constructor(private readonly prismaService: PrismaService) {}

  async countEntities() {
    const [tutorsCount, petsCounts] = await Promise.all([
      this.prismaService.tutors.count(),
      this.prismaService.pets.count(),
    ])

    return {
      tutorsCount,
      petsCounts,
    }
  }

  async petsReport(filters: PetsReportsFilters) {
    const { neighborhood, species, breed } = filters

    let sql = `
      SELECT 
        COUNT(*) as count, 
        (COUNT(*) * 1.0 / (SELECT COUNT(*) FROM "pets")) * 100 as percentage
      FROM "pets"
      JOIN "tutor_addresses" ON "tutor_addresses"."tutor_id" = "pets"."tutorId"
    `
    const params = []
    let whereAdded = false

    if (neighborhood) {
      sql += whereAdded ? ' AND ' : ' WHERE '
      sql += `"tutor_addresses"."neighborhood" = $${params.length + 1}`
      params.push(neighborhood)
      whereAdded = true
    }
    if (species) {
      sql += whereAdded ? ' AND ' : ' WHERE '
      sql += `"pets"."species" = $${params.length + 1}`
      params.push(species)
      whereAdded = true
    }
    if (breed) {
      sql += whereAdded ? ' AND ' : ' WHERE '
      sql += `"pets"."breed" = $${params.length + 1}`
      params.push(breed)
      whereAdded = true
    }

    const petsData = await this.prismaService.$queryRawUnsafe(sql, ...params)

    return {
      count: Number(petsData[0].count),
      percentage: Number(petsData[0].percentage),
    }
  }

  async tutorsReport(filters: TutorsReportsFilters) {
    const { neighborhood, city, state, zipcode } = filters

    let sql = `
      SELECT 
        COUNT(*) as count, 
        (COUNT(*) * 1.0 / (SELECT COUNT(*) FROM "tutors")) * 100 as percentage
      FROM "tutors"
      JOIN "tutor_addresses" ON "tutor_addresses"."tutor_id" = "tutors"."id"
    `
    const params = []
    let whereAdded = false

    if (neighborhood) {
      sql += whereAdded ? ' AND ' : ' WHERE '
      sql += `"tutor_addresses"."neighborhood" = $${params.length + 1}`
      params.push(neighborhood)
      whereAdded = true
    }

    if (city) {
      sql += whereAdded ? ' AND ' : ' WHERE '
      sql += `"tutor_addresses"."city" = $${params.length + 1}`
      params.push(city)
      whereAdded = true
    }

    if (state) {
      sql += whereAdded ? ' AND ' : ' WHERE '
      sql += `"tutor_addresses"."state" = $${params.length + 1}`
      params.push(state)
      whereAdded = true
    }

    if (zipcode) {
      sql += whereAdded ? ' AND ' : ' WHERE '
      sql += `"tutor_addresses"."zipcode" = $${params.length + 1}`
      params.push(zipcode)
      whereAdded = true
    }

    const tutorsData = await this.prismaService.$queryRawUnsafe(sql, ...params)

    return {
      count: Number(tutorsData[0].count),
      percentage: Number(tutorsData[0].percentage),
    }
  }
}
