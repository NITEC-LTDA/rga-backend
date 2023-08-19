import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common'
import { TutorAddressesService } from './tutor_addresses.service'
import { CreateTutorAddressDto } from './dto/create-tutor_address.dto'
import { UpdateTutorAddressDto } from './dto/update-tutor_address.dto'
import { TutorsAddressesMapper } from '@/infra/database/prisma/mappers/tutors_addresses.mapper'
import { GetCurrentUserId } from '@/commons/decorators/get-current-user-id.decorator'

@Controller('tutor-addresses')
export class TutorAddressesController {
  constructor(private readonly tutorAddressesService: TutorAddressesService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createTutorAddressDto: CreateTutorAddressDto) {
    const address = await this.tutorAddressesService.create(
      createTutorAddressDto,
    )

    return TutorsAddressesMapper.toHttp(address)
  }

  @Get()
  @HttpCode(200)
  findAll(@GetCurrentUserId() currentUserId: string) {
    return this.tutorAddressesService.findAll(currentUserId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorAddressesService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTutorAddressDto: UpdateTutorAddressDto,
  ) {
    return this.tutorAddressesService.update(+id, updateTutorAddressDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorAddressesService.remove(+id)
  }
}
