import { Pet } from '@/app/pets/entities/pet.entity'
import { Pets as RawPet } from '@prisma/client'

export class PetsMapper {
  static toHttp(raw: RawPet) {
    return {
      id: raw.id,
      name: raw.name,
      species: raw.species,
      breed: raw.breed,
      birthDate: raw.birthdate,
      tutorId: raw.tutorId,
      rga: raw.rga,
      gender: raw.gender,
      microchip: raw.microchip,
      imageUrl: raw.image_url,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
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
      birthdate: pet.birthDate,
      tutorId: pet.tutorId,
      rga: pet.rga,
      microchip: pet.microchip,
      image_url: pet.imageUrl,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
    }
  }
}
