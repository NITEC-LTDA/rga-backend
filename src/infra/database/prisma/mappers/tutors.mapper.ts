import {
  Tutors as RawTutor,
  Tutor_Addresses as RawTutorAddresses,
} from '@prisma/client'
import { Tutor } from '@/app/tutors/entities/tutor.entity'

export class TutorsMapper {
  static toHttp(raw: RawTutor & { Tutor_Addresses?: RawTutorAddresses[] }) {
    if (raw.Tutor_Addresses && raw.Tutor_Addresses.length > 0) {
      return {
        id: raw.id,
        name: raw.name,
        email: raw.email,
        cpf: raw.cpf,
        phone: raw.phone,
        primaryAddressId: raw.primaryAddressId,
        addresses: raw.Tutor_Addresses.map((address) => ({
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
      phone: raw.phone,
      primaryAddressId: raw.primaryAddressId,
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
      phone: tutor.phone,
      primaryAddressId: tutor.primaryAddressId,
      createdAt: tutor.createdAt,
      updatedAt: tutor.updatedAt,
    }
  }
}
