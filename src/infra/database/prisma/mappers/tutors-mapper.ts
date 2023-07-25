import { Tutor as RawTutor } from '@prisma/client'
import { Tutor } from '@/app/tutors/entities/tutor.entity'

export class TutorsMapper {
  static toHttp(raw: RawTutor) {
    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      cpf: raw.cpf,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  static toPrisma(tutor: Tutor) {
    return {
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      password: tutor.password,
      cpf: tutor.cpf,
      createdAt: tutor.createdAt,
      updatedAt: tutor.updatedAt,
    }
  }
}
