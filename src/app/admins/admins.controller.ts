import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common'
import { AdminsService } from './admins.service'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'
import { GetCurrentUserId } from '@/commons/decorators/get-current-user-id.decorator'
import { AdminsMapper } from '@/infra/database/prisma/mappers/admins.mapper'

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto)
  }

  @Get()
  findAll() {
    return this.adminsService.findAll()
  }

  @Get('/me')
  async findMe(@GetCurrentUserId() currentUserId: string) {
    const admin = await this.adminsService.findById(currentUserId)

    if (!admin) {
      throw new NotFoundException('Adm não encontrado')
    }

    return AdminsMapper.toHttp(admin)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(+id, updateAdminDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminsService.remove(+id)
  }
}
