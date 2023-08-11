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
import { PetsService } from './pets.service'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'
import { AlreadyExistsException } from '@/commons/exceptions/already-exists.exception'

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createPetDto: CreatePetDto) {
    if (
      createPetDto.microchip &&
      (await this.petsService.findByMicrochip(createPetDto.microchip))
    ) {
      throw new AlreadyExistsException('Microchip already in use')
    }
    return this.petsService.create(createPetDto)
  }

  @Get()
  findAll() {
    return this.petsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+id, updatePetDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.petsService.remove(+id)
  }
}
