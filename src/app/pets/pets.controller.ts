import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common'
import { PetsService } from './pets.service'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'
import { AlreadyExistsException } from '@/commons/exceptions/already-exists.exception'
import { GetCurrentUserId } from '@/commons/decorators/get-current-user-id.decorator'
import { PetsMapper } from '@/infra/database/prisma/mappers/pets.mapper'
import { Pet } from './entities/pet.entity'

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
      throw new AlreadyExistsException('Microchip já cadastrado')
    }

    const prismaPet = await this.petsService.create(createPetDto, currentUserId)
    return PetsMapper.toHttp(prismaPet)
  }

  @Get()
  async findAll(@GetCurrentUserId() currentUserId: string) {
    const prismaPets = await this.petsService.findAll(currentUserId)
    return prismaPets.map((pet) => PetsMapper.toHttp(pet))
  }

  @Get('/search')
  async findOne(
    @Query() { rga, microchip }: { rga?: string; microchip?: string },
  ) {
    let pet

    if (rga) {
      pet = await this.petsService.findByRga(rga)
    } else if (microchip) {
      pet = await this.petsService.findByMicrochip(microchip)
    } else {
      throw new BadRequestException('Either rga or microchip must be provided')
    }

    if (!pet) {
      throw new NotFoundException('Pet not found')
    }

    return PetsMapper.toHttp(pet)
  }

  @Patch(':rga')
  async update(
    @GetCurrentUserId() currentUserId: string,
    @Param('rga') rga: string,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    const pet = await this.petsService.findByRga(rga)
    if (!pet) {
      throw new NotFoundException('Pet not found')
    }
    const updatedPet = { ...pet, ...updatePetDto }
    console.log(updatedPet)
    return this.petsService.update(rga, updatedPet)
  }
}
