import { Injectable } from '@nestjs/common'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Admin } from './entities/admin.entity'

interface IFindAllAdmins {
  page: number
  limit: number
}

@Injectable()
export class AdminsService {
  constructor(private prismaService: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
    const admin = new Admin(createAdminDto)

    const createdAdmin = await this.prismaService.admins.create({
      data: admin,
    })

    return createdAdmin
  }

  async findAll(params: IFindAllAdmins) {
    const { page, limit } = params

    const admins = await this.prismaService.admins.findMany({
      skip: (page - 1) * limit,
      take: limit,
    })

    const total = await this.prismaService.admins.count()

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

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`
  }

  remove(id: number) {
    return `This action removes a #${id} admin`
  }

  async validateToken(token: string) {
    return this.prismaService.admins.findFirst({
      where: { hashedRt: token },
    })
  }
}