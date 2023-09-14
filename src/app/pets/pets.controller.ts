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
  Put,
  Req,
} from '@nestjs/common'
import { PetsService } from './pets.service'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'
import { AlreadyExistsException } from '@/commons/exceptions/already-exists.exception'
import { GetCurrentUserId } from '@/commons/decorators/get-current-user-id.decorator'
import { PetsMapper } from '@/infra/database/prisma/mappers/pets.mapper'
import { S3StorageService } from '@/infra/cloud_storage/aws/s3.service'
import { FastifyRequest } from 'fastify'
import { streamToBuffer } from '../utils'

@Controller('pets')
export class PetsController {
  constructor(
    private readonly petsService: PetsService,
    private readonly storageService: S3StorageService,
  ) {}

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

  @Put(':rga/image')
  @HttpCode(201)
  async uploadPetImage(
    @GetCurrentUserId() currentUserId: string,
    @Param('rga') rga: string,
    @Req() request: FastifyRequest,
  ) {
    // DELETE PREVIOUS IMAGE

    const pet = await this.petsService.findByRga(rga)
    if (!pet) {
      throw new NotFoundException('Pet not found')
    }

    if (pet.imageUrl) {
      const fileName = pet.imageUrl.split('/').slice(-1)[0]
      await this.storageService.deleteBlob(
        `${currentUserId}/${rga}/image/${fileName}`,
      )
    }

    const data = await request.file()
    const hashedFileName = `${data.filename}-${Date.now()}`
    const fileName = `${currentUserId}/${rga}/image/${hashedFileName}`
    const mimeType = data.mimetype

    if (data.filesize > 1_048_576 * 5) {
      throw new BadRequestException('File size must be less than 5MB')
    }

    // TODO: upload using stream
    /**
     * example:
     * await pump(data.file, fs.createWriteStream(uploadDestination))
     * import {pipeline} from 'node:stream'
     * import {promisify} from 'node:util'
     * const pump = promisify(pipeline)
     *
     * */

    // CONVERT STREAM TO BUFFER
    const buffer = await streamToBuffer(data.file)

    // UPLOAD TO S3
    await this.storageService.putBlob(fileName, buffer, mimeType)

    const getObjectUrl = this.storageService.getObjectUrl(fileName)

    // UPDATE PET IMAGE URL
    const updatedPet = { ...pet, imageUrl: getObjectUrl }
    await this.petsService.update(rga, updatedPet)

    return {
      message: 'Pet image uploaded successfully',
      imageUrl: getObjectUrl,
    }
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
    return this.petsService.update(rga, updatedPet)
  }
}
