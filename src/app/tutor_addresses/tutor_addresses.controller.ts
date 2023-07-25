import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { TutorAddressesService } from './tutor_addresses.service'
import { CreateTutorAddressDto } from './dto/create-tutor_address.dto'
import { UpdateTutorAddressDto } from './dto/update-tutor_address.dto'

@Controller('tutor-addresses')
export class TutorAddressesController {
  constructor(private readonly tutorAddressesService: TutorAddressesService) {}

  @Post()
  create(@Body() createTutorAddressDto: CreateTutorAddressDto) {
    return this.tutorAddressesService.create(createTutorAddressDto)
  }

  @Get()
  findAll() {
    return this.tutorAddressesService.findAll()
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
