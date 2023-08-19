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
import { TutorsService } from '../tutors/tutors.service'
import { TutorAddress } from './entities/tutor_address.entity'

@Controller('tutor-addresses')
export class TutorAddressesController {
  constructor(
    private readonly tutorAddressesService: TutorAddressesService,
    private readonly tutorsService: TutorsService,
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @GetCurrentUserId() currentUserId: string,
    @Body() createTutorAddressDto: CreateTutorAddressDto,
  ) {
    const addressCount = await this.tutorAddressesService.count({
      where: {
        tutor_id: currentUserId,
      },
    })
    // CREATE A NEW ADDRESS
    const tutorAddress = new TutorAddress({
      ...createTutorAddressDto,
      tutorId: currentUserId,
    })
    // IF THIS IS THE FIRST ADDRESS, SET IT AS PRIMARY
    if (addressCount === 0) {
      this.tutorsService.update(currentUserId, {
        primaryAddressId: tutorAddress.id,
      })
    }
    // SAVE THE ADDRESS
    const address = await this.tutorAddressesService.create(
      currentUserId,
      tutorAddress,
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
