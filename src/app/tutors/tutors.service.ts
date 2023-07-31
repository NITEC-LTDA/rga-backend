import { Injectable } from '@nestjs/common'
import { CreateTutorDto } from './dto/create-tutor.dto'
import { UpdateTutorDto } from './dto/update-tutor.dto'
import { Tutor } from './entities/tutor.entity'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { TutorsMapper } from '@/infra/database/prisma/mappers/tutors.mapper'

@Injectable()
export class TutorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTutorDto: CreateTutorDto) {
    const tutor = new Tutor(createTutorDto)

    const prismaTutor = TutorsMapper.toPrisma(tutor)

    return TutorsMapper.toHttp(
      await this.prismaService.tutors.create({
        data: prismaTutor,
      }),
    )
  }

  async findOne(id: string) {
    const prismaTutor = await this.prismaService.tutors.findUnique({
      where: { id },
      include: { Tutor_Addresses: true },
    })
    return prismaTutor
  }

  async update(id: string, updateTutorDto: UpdateTutorDto) {
    const tutor = await this.findOne(id)
    const updatedTutor = { ...tutor, ...updateTutorDto }

    return this.prismaService.tutors.update({
      where: { id },
      data: TutorsMapper.toPrisma(new Tutor(updatedTutor)),
    })
  }

  async remove(id: string) {
    return this.prismaService.tutors.delete({ where: { id } })
  }

  async findByEmail(email: string) {
    return this.prismaService.tutors.findUnique({ where: { email } })
  }

  async findByCpf(cpf: string) {
    return this.prismaService.tutors.findUnique({ where: { cpf } })
  }
}
