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

  async update(updateTutorDto: Tutor) {
    const updatedTutor = TutorsMapper.toPrisma(updateTutorDto)

    return this.prismaService.tutors.update({
      where: { id: updateTutorDto.id },
      data: updatedTutor,
      include: { Tutor_Addresses: true },
    })
  }

  async findByEmail(email: string) {
    return this.prismaService.tutors.findUnique({ where: { email } })
  }

  async findByCpf(cpf: string) {
    return this.prismaService.tutors.findUnique({ where: { cpf } })
  }

  async findByCpfAndEmail(cpf: string, email: string) {
    return this.prismaService.tutors.findFirst({
      where: { cpf, email },
    })
  }
}
