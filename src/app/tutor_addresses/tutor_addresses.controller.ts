import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import { TutorAddressesService } from './tutor_addresses.service'
import { CreateTutorAddressDto } from './dto/create-tutor_address.dto'
import { UpdateTutorAddressDto } from './dto/update-tutor_address.dto'
import { TutorsAddressesMapper } from '@/infra/database/prisma/mappers/tutors_addresses.mapper'
import { GetCurrentUserId } from '@/commons/decorators/get-current-user-id.decorator'
import { TutorsService } from '../tutors/tutors.service'
import { TutorAddress } from './entities/tutor_address.entity'
import { Tutor } from '../tutors/entities/tutor.entity'

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
    const addressCount = await this.tutorAddressesService.count(currentUserId)
    // CREATE A NEW ADDRESS
    const tutorAddress = new TutorAddress({
      ...createTutorAddressDto,
      tutorId: currentUserId,
    })
    // IF THIS IS THE FIRST ADDRESS, SET IT AS PRIMARY
    if (addressCount === 0) {
      const tutor = await this.tutorsService.findOne(currentUserId)
      const newTutor = new Tutor(
        {
          ...tutor,
          primaryAddressId: tutorAddress.id,
        },
        tutor.id,
      )
      await this.tutorsService.update(newTutor)
    }
    // SAVE THE ADDRESS
    const address = await this.tutorAddressesService.create(tutorAddress)

    return TutorsAddressesMapper.toHttp(address)
  }

  @Get()
  @HttpCode(200)
  findAll(@GetCurrentUserId() currentUserId: string) {
    return this.tutorAddressesService.findAll(currentUserId)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTutorAddressDto: UpdateTutorAddressDto,
  ) {
    const addressExists = await this.tutorAddressesService.findOne(id)

    if (!addressExists) {
      throw new NotFoundException('Address not found')
    }

    const updatedAddress = new TutorAddress(
      {
        ...addressExists,
        ...updateTutorAddressDto,
        tutorId: addressExists.tutor_id,
      },
      addressExists.id,
    )

    return this.tutorAddressesService.update(updatedAddress)
  }
}
