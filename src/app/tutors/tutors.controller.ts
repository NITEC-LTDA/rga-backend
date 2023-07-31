import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common'
import { TutorsService } from './tutors.service'
import { CreateTutorDto } from './dto/create-tutor.dto'
import { UpdateTutorDto } from './dto/update-tutor.dto'
import { TutorsMapper } from '@/infra/database/prisma/mappers/tutors.mapper'
import { AlreadyExistsException } from '../exceptions/already-exists.exception'
@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createTutorDto: CreateTutorDto) {
    if (await this.tutorsService.findByEmail(createTutorDto.email)) {
      throw new AlreadyExistsException('Email already in use')
    }

    if (await this.tutorsService.findByCpf(createTutorDto.cpf)) {
      throw new AlreadyExistsException('CPF already in use')
    }

    return this.tutorsService.create(createTutorDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tutor = await this.tutorsService.findOne(id)

    if (!tutor) {
      throw new NotFoundException('Tutor not found')
    }

    return TutorsMapper.toHttp(tutor)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTutorDto: UpdateTutorDto,
  ) {
    const tutorExists = await this.tutorsService.findOne(id)

    if (!tutorExists) {
      throw new NotFoundException('Tutor not found')
    }

    if (
      (await this.tutorsService.findByEmail(updateTutorDto.email)) &&
      updateTutorDto.email !== tutorExists.email
    ) {
      throw new AlreadyExistsException('Email already in use')
    }

    if (
      (await this.tutorsService.findByCpf(updateTutorDto.cpf)) &&
      updateTutorDto.cpf !== tutorExists.cpf
    ) {
      throw new AlreadyExistsException('CPF already in use')
    }

    const tutor = await this.tutorsService.update(id, updateTutorDto)

    return TutorsMapper.toHttp(tutor)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return new NotImplementedException()
  }
}
