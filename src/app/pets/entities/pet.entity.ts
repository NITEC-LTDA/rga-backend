import { randomUUID } from 'node:crypto'

interface PetsProps {
  id?: string
  name: string
  species: string
  breed: string
  birthDate: Date
  gender: string
  color: string
  rga?: string
  microchip?: string
  imageUrl?: string
  tutorId?: string
  createdAt?: Date
  updatedAt?: Date
}

export class Pet {
  private props: PetsProps
  private _id: string

  constructor(props: PetsProps, tutorId: string, rga: string, id?: string) {
    this.props = {
      ...props,
      id: id ?? randomUUID(),
      tutorId,
      rga,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    }
  }

  public get id() {
    return this._id
  }

  public get name(): string {
    return this.props.name
  }

  public set name(name: string) {
    this.props.name = name
  }

  public get species() {
    return this.props.species
  }

  public set species(species: string) {
    this.props.species = species
  }

  public get breed() {
    return this.props.breed
  }

  public set breed(breed: string) {
    this.props.breed = breed
  }

  public get birthDate() {
    return this.props.birthDate
  }

  public set birthDate(birthDate: Date) {
    this.props.birthDate = birthDate
  }

  public get gender() {
    return this.props.gender
  }

  public set gender(gender: string) {
    this.props.gender = gender
  }

  public get color() {
    return this.props.color
  }

  public set color(color: string) {
    this.props.color = color
  }

  public get microchip() {
    return this.props.microchip
  }

  public set microchip(microchip: string) {
    this.props.microchip = microchip
  }

  public get imageUrl() {
    return this.props.imageUrl
  }

  public set imageUrl(imageUrl: string) {
    this.props.imageUrl = imageUrl
  }

  public get rga() {
    return this.props.rga
  }

  public set rga(rga: string) {
    this.props.rga = rga
  }

  public get tutorId() {
    return this.props.tutorId
  }

  public set tutorId(tutorId: string) {
    this.props.tutorId = tutorId
  }

  public get createdAt() {
    return this.props.createdAt
  }

  public set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt
  }

  public get updatedAt() {
    return this.props.updatedAt
  }

  public set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }
}
