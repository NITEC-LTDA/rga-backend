import { Injectable } from '@nestjs/common'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Admin } from './entities/admin.entity'
import { AdminsMapper } from '@/infra/database/prisma/mappers/admins.mapper'

interface IFindAllAdmins {
  page: number
  limit: number
  filters: any
}

@Injectable()
export class AdminsService {
  constructor(private prismaService: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const admin = new Admin(createAdminDto)

    const prismaAdmin = AdminsMapper.toPrisma(admin)

    const createdAdmin = await this.prismaService.admins.create({
      data: prismaAdmin,
    })

    return createdAdmin
  }

  async findAll(params: IFindAllAdmins) {
    const { page, limit, filters } = params

    const { name, email, cpf } = filters

    const admins = await this.prismaService.admins.findMany({
      skip: (page - 1) * limit,
      take: limit,

      where: {
        AND: [
          {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: email,
              mode: 'insensitive',
            },
          },
          {
            cpf: {
              contains: cpf,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    const total = await this.prismaService.admins.count({
      where: {
        AND: [
          {
            name: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: email,
              mode: 'insensitive',
            },
          },
          {
            cpf: {
              contains: cpf,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    return {
      data: admins,
      total,
      page,
      limit,
    }
  }

  async findById(id: string) {
    return this.prismaService.admins.findUnique({
      where: { id },
    })
  }

  async findByEmail(email: string) {
    return this.prismaService.admins.findUnique({
      where: { email },
    })
  }

  async findByCpf(cpf: string) {
    return this.prismaService.admins.findUnique({
      where: { cpf },
    })
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    return this.prismaService.admins.update({
      where: { id },
      data: updateAdminDto,
    })
  }

  remove(id: string) {
    return this.prismaService.admins.delete({
      where: { id },
    })
  }

  async validateToken(token: string) {
    return this.prismaService.admins.findFirst({
      where: { hashedRt: token },
    })
  }
}
