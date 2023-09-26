import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

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
}
