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
import { TutorsService } from './tutors.service'
import { CreateTutorDto } from './dto/create-tutor.dto'
import { UpdateTutorDto } from './dto/update-tutor.dto'
import { TutorsMapper } from '@/infra/database/prisma/mappers/tutors-mapper'
@Controller('tutors')
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createTutorDto: CreateTutorDto) {
    await this.tutorsService.create(createTutorDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tutor = await this.tutorsService.findOne(id)
    return TutorsMapper.toHttp(tutor)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTutorDto: UpdateTutorDto) {
    return this.tutorsService.update(+id, updateTutorDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorsService.remove(+id)
  }
}
