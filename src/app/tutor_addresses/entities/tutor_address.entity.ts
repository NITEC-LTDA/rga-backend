import { randomUUID } from 'node:crypto'

interface TutorAddressProps {
  id?: string
  tutorId: string
  street: string
  number: string
  zipcode: string
  city: string
  state: string
  country: string
  neighborhood: string
  createdAt?: Date
  updatedAt?: Date
}

export class TutorAddress {
  private props: TutorAddressProps
  private _id: string

  constructor(props: TutorAddressProps, id?: string) {
    this.props = {
      ...props,
      id: id ?? randomUUID(),
    }
  }

  public get id() {
    return this._id
  }

  public get tutorId(): string {
    return this.props.tutorId
  }

  public set tutorId(tutorId: string) {
    this.props.tutorId = tutorId
  }

  public get street(): string {
    return this.props.street
  }

  public set street(street: string) {
    this.props.street = street
  }

  public get number(): string {
    return this.props.number
  }

  public set number(number: string) {
    this.props.number = number
  }

  public get zipcode(): string {
    return this.props.zipcode
  }

  public set zipcode(zipcode: string) {
    this.props.zipcode = zipcode
  }

  public get city(): string {
    return this.props.city
  }

  public set city(city: string) {
    this.props.city = city
  }

  public get state(): string {
    return this.props.state
  }

  public set state(state: string) {
    this.props.state = state
  }

  public get country(): string {
    return this.props.country
  }

  public set country(country: string) {
    this.props.country = country
  }

  public get neighborhood(): string {
    return this.props.neighborhood
  }

  public set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }

  public set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }
}
