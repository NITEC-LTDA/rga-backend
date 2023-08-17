import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  HttpCode,
  NotFoundException,
} from '@nestjs/common'
import { TutorsService } from './tutors.service'
import { CreateTutorDto } from './dto/create-tutor.dto'
import { UpdateTutorDto } from './dto/update-tutor.dto'
import { TutorsMapper } from '@/infra/database/prisma/mappers/tutors.mapper'
import { AlreadyExistsException } from '../../commons/exceptions/already-exists.exception'
import { Public } from '@/commons/decorators/public.decorator'
import { GetCurrentUserId } from '@/commons/decorators/get-current-user-id.decorator'

@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Public()
  @Post()
  @HttpCode(201)
  async create(@Body() createTutorDto: CreateTutorDto) {
    if (await this.tutorsService.findByEmail(createTutorDto.email)) {
      throw new AlreadyExistsException('E-mail já cadastrado')
    }

    if (await this.tutorsService.findByCpf(createTutorDto.cpf)) {
      throw new AlreadyExistsException('CPF já cadastrado')
    }

    return this.tutorsService.create(createTutorDto)
  }

  @Get('/me')
  async findOne(@GetCurrentUserId() currentUserId: string) {
    const tutor = await this.tutorsService.findOne(currentUserId)

    if (!tutor) {
      throw new NotFoundException('Tutor not found')
    }

    return TutorsMapper.toHttp(tutor)
  }

  @Patch('/me')
  async update(
    @GetCurrentUserId() currentUserId: string,
    @Body() updateTutorDto: UpdateTutorDto,
  ) {
    const tutorExists = await this.tutorsService.findOne(currentUserId)

    if (!tutorExists) {
      throw new NotFoundException('Tutor não encontrado')
    }

    if (
      (await this.tutorsService.findByEmail(updateTutorDto.email)) &&
      updateTutorDto.email !== tutorExists.email
    ) {
      throw new AlreadyExistsException('E-mail já em uso')
    }

    if (
      (await this.tutorsService.findByCpf(updateTutorDto.cpf)) &&
      updateTutorDto.cpf !== tutorExists.cpf
    ) {
      throw new AlreadyExistsException('CPF já em uso')
    }

    const tutor = await this.tutorsService.update(currentUserId, updateTutorDto)

    return TutorsMapper.toHttp(tutor)
  }
}
