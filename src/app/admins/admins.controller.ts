import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AdminsService } from './admins.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { GetCurrentUserId } from '@/commons/decorators/get-current-user-id.decorator'
import { AdminsMapper } from '@/infra/database/prisma/mappers/admins.mapper'
import { SuperAdminOnlyMiddleware } from '@/commons/middlewares/super-admin-only.middleware'
import { AdminOnlyGuard } from '@/commons/middlewares/admin-only.middleware'
import { Admin } from './entities/admin.entity'

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @UseGuards(AdminOnlyGuard)
  @Post()
  @HttpCode(201)
  async create(@Body() createAdminDto: CreateAdminDto) {
    const adminByEmail = await this.adminsService.findByEmail(
      createAdminDto.email,
    )

    if (adminByEmail) {
      throw new NotFoundException('Email já cadastrado')
    }

    const adminByCpf = await this.adminsService.findByCpf(createAdminDto.cpf)

    if (adminByCpf) {
      throw new NotFoundException('CPF já cadastrado')
    }

    const createdAdmin = await this.adminsService.create(createAdminDto)

    return AdminsMapper.toHttp(createdAdmin)
  }

  @UseGuards(SuperAdminOnlyMiddleware)
  @Get()
  @HttpCode(200)
  async findAll(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('cpf') cpf: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const parsedPage = page ? Number(page) : 1
    const parsedLimit = limit ? Number(limit) : 10

    const filters = { name, email, cpf }

    const pagination = await this.adminsService.findAll({
      page: parsedPage,
      limit: parsedLimit,
      filters,
    })

    return {
      data: pagination.data.map(AdminsMapper.toHttp),
      limit: pagination.limit,
      page: pagination.page,
      total: pagination.total,
    }
  }

  @UseGuards(AdminOnlyGuard)
  @Get('/me')
  @HttpCode(200)
  async findMe(@GetCurrentUserId() currentUserId: string) {
    const admin = await this.adminsService.findById(currentUserId)
    if (!admin) {
      throw new NotFoundException('Adm não encontrado')
    }

    return AdminsMapper.toHttp(admin)
  }

  @UseGuards(SuperAdminOnlyMiddleware)
  @Patch('/super-admin/:id')
  async updateSuperAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const adminExists = await this.adminsService.findById(id)

    if (!adminExists) {
      throw new NotFoundException('Admin não encontrado')
    }

    if (
      (await this.adminsService.findByEmail(updateAdminDto.email)) &&
      updateAdminDto.email !== adminExists.email
    ) {
      throw new NotFoundException('Email já cadastrado')
    }

    if (
      (await this.adminsService.findByCpf(updateAdminDto.cpf)) &&
      updateAdminDto.cpf !== adminExists.cpf
    ) {
      throw new NotFoundException('CPF já cadastrado')
    }

    updateAdminDto.role = updateAdminDto.role || adminExists.role

    const newAdmin = new Admin(
      {
        ...adminExists,
        ...updateAdminDto,
      },
      id,
    )

    newAdmin.password = updateAdminDto.password

    return this.adminsService.update(newAdmin)
  }

  @UseGuards(AdminOnlyGuard)
  @Patch('/me')
  async update(
    @GetCurrentUserId() currentUserId: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const adminExists = await this.adminsService.findById(currentUserId)

    if (!adminExists) {
      throw new NotFoundException('Admin não encontrado')
    }

    if (
      (await this.adminsService.findByEmail(updateAdminDto.email)) &&
      updateAdminDto.email !== adminExists.email
    ) {
      throw new NotFoundException('Email já cadastrado')
    }

    if (
      (await this.adminsService.findByCpf(updateAdminDto.cpf)) &&
      updateAdminDto.cpf !== adminExists.cpf
    ) {
      throw new NotFoundException('CPF já cadastrado')
    }

    const newAdmin = new Admin(
      {
        ...adminExists,
        ...updateAdminDto,
      },
      currentUserId,
    )

    newAdmin.password = updateAdminDto.password

    return this.adminsService.update(newAdmin)
  }

  @UseGuards(SuperAdminOnlyMiddleware)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.adminsService.remove(id)
    return true
  }
}
