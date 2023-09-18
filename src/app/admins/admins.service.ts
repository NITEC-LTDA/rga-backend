import { Injectable } from '@nestjs/common'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

@Injectable()
export class AdminsService {
  constructor(private prismaService: PrismaService) {}

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin'
  }

  findAll() {
    return `This action returns all admins`
  }

  async findById(id: string) {
    return this.prismaService.admins.findUnique({
      where: { id },
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
