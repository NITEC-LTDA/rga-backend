import { createHash, randomUUID } from 'node:crypto'

interface TutorProps {
  id?: string
  name: string
  email: string
  password: string
  phone: string
  cpf: string
  primaryAddressId?: string
  createdAt?: Date
  updatedAt?: Date
}

export class Tutor {
  private props: TutorProps
  private _id: string

  constructor(props: TutorProps, id?: string) {
    this.props = {
      ...props,
      id: id ?? randomUUID(),
    }
    this.password = props.password
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

  public get email(): string {
    return this.props.email
  }

  public set email(email: string) {
    this.props.email = email
  }

  public get phone(): string {
    return this.props.phone
  }

  public set phone(phone: string) {
    this.props.phone = phone
  }

  public get password(): string {
    return this.props.password
  }

  public set password(password: string) {
    const crypto = createHash('sha256')
    const hashedPassword = crypto.update(password).digest('hex')
    this.props.password = hashedPassword
  }

  public get cpf(): string {
    return this.props.cpf
  }

  public set cpf(cpf: string) {
    this.props.cpf = cpf
  }

  public get primaryAddressId(): string {
    return this.props.primaryAddressId
  }

  public set primaryAddressId(primaryAddressId: string) {
    this.props.primaryAddressId = primaryAddressId
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }

  public get updatedAt(): Date {
    return this.props.updatedAt
  }
}
