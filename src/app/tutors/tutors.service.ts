import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTutorDto } from './dto/create-tutor.dto'
import { UpdateTutorDto } from './dto/update-tutor.dto'
import { Tutor } from './entities/tutor.entity'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { TutorsMapper } from '@/infra/database/prisma/mappers/tutors-mapper'

@Injectable()
export class TutorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTutorDto: CreateTutorDto) {
    const tutor = new Tutor(createTutorDto)

    try {
      const prismaTutor = TutorsMapper.toPrisma(tutor)

      return TutorsMapper.toHttp(
        await this.prismaService.tutor.create({
          data: prismaTutor,
        }),
      )
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(id: string) {
    const prismaTutor = await this.prismaService.tutor.findUnique({
      where: { id },
    })

    if (!prismaTutor) throw new NotFoundException()

    return prismaTutor
  }

  update(id: number, updateTutorDto: UpdateTutorDto) {
    return `This action updates a #${id} tutor`
  }

  remove(id: number) {
    return `This action removes a #${id} tutor`
  }
}
