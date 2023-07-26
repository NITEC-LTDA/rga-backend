import {
  Tutor as RawTutor,
  Tutor_Address as RawTutorAddresses,
} from '@prisma/client'
import { Tutor } from '@/app/tutors/entities/tutor.entity'

export class TutorsMapper {
  static toHttp(raw: RawTutor & { Tutor_Address?: RawTutorAddresses[] }) {
    if (raw.Tutor_Address && raw.Tutor_Address.length > 0) {
      return {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        cpf: raw.cpf,
        primaryAddressId: raw.primary_address_id,
        addresses: raw.Tutor_Address.map((address) => ({
          id: address.id,
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          country: address.country,
          zipCode: address.zipcode,
          createdAt: address.createdAt,
          updatedAt: address.updatedAt,
        })),

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      }
    }

    return {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      cpf: raw.cpf,
      primaryAddressId: raw.primary_address_id,
      addresses: [],
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
      primaryAddressId: tutor.primaryAddressId,
      createdAt: tutor.createdAt,
      updatedAt: tutor.updatedAt,
    }
  }
}
