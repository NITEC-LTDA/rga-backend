import { TutorAddress } from '@/app/tutor_addresses/entities/tutor_address.entity'
import { Tutor_Addresses as RawTutorAddresses } from '@prisma/client'

export class TutorsAddressesMapper {
  static toHttp(raw: RawTutorAddresses) {
    return {
      id: raw.id,
      tutorId: raw.tutor_id,
      street: raw.street,
      number: raw.number,
      neighborhood: raw.neighborhood,
      city: raw.city,
      state: raw.state,
      country: raw.country,
      zipCode: raw.zipcode,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  static toPrisma(tutorAddress: TutorAddress) {
    return {
      id: tutorAddress.id,
      tutor_id: tutorAddress.tutorId,
      street: tutorAddress.street,
      number: tutorAddress.number,
      neighborhood: tutorAddress.neighborhood,
      city: tutorAddress.city,
      state: tutorAddress.state,
      country: tutorAddress.country,
      zipcode: tutorAddress.zipcode,
      createdAt: tutorAddress.createdAt,
      updatedAt: tutorAddress.updatedAt,
    }
  }
}
