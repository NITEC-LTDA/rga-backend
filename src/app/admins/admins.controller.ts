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

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

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
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    const parsedPage = page ? Number(page) : 1
    const parsedLimit = limit ? Number(limit) : 10

    const pagination = await this.adminsService.findAll({
      page: parsedPage,
      limit: parsedLimit,
    })

    return {
      data: pagination.data.map(AdminsMapper.toHttp),
      limit: pagination.limit,
      page: pagination.page,
      total: pagination.total,
    }
  }

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
  updateSuperAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminsService.update(id, updateAdminDto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto)
  }

  @UseGuards(SuperAdminOnlyMiddleware)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.adminsService.remove(id)
    return true
  }
}
