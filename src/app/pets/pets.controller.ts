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
import { GetCurrentUserId } from '@/commons/decorators/get-current-user-id.decorator'
import { PetsMapper } from '@/infra/database/prisma/mappers/pets.mapper'

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @HttpCode(201)
  async create(
    @GetCurrentUserId() currentUserId: string,
    @Body() createPetDto: CreatePetDto,
  ) {
    if (
      createPetDto.microchip &&
      (await this.petsService.findByMicrochip(createPetDto.microchip))
    ) {
      throw new AlreadyExistsException('Microchip already in use')
    }

    const prismaPet = await this.petsService.create(createPetDto, currentUserId)
    return PetsMapper.toHttp(prismaPet)
  }

  @Get()
  async findAll(@GetCurrentUserId() currentUserId: string) {
    const prismaPets = await this.petsService.findAll(currentUserId)
    return prismaPets.map((pet) => PetsMapper.toHttp(pet))
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
