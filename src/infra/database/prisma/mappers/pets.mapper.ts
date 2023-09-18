import { Pet } from '@/app/pets/entities/pet.entity'
import { Pets as RawPet, Tutors } from '@prisma/client'
import { TutorsMapper } from './tutors.mapper'

export class PetsMapper {
  static toHttp(raw: RawPet & { Tutors?: Tutors }) {
    return {
      id: raw.id,
      name: raw.name,
      species: raw.species,
      breed: raw.breed,
      birthDate: raw.birthDate,
      rga: raw.rga,
      color: raw.color,
      gender: raw.gender,
      microchip: raw.microchip,
      imageUrl: raw.imageUrl,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,

      tutor: raw.hasOwnProperty('Tutors')
        ? TutorsMapper.toHttp(raw.Tutors)
        : null,
    }
  }

  static toPrisma(pet: Pet) {
    return {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      color: pet.color,
      gender: pet.gender,
      birthDate: pet.birthDate,
      rga: pet.rga,
      microchip: pet.microchip,
      imageUrl: pet.imageUrl,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
    }
  }
}
