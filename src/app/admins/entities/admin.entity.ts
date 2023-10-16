import { Role } from '@prisma/client'
import { createHash, randomUUID } from 'node:crypto'

interface AdminProps {
  id?: string
  name: string
  email: string
  password: string
  phone: string
  cpf: string
  role?: Role
  createdAt?: Date
  updatedAt?: Date
}

export class Admin {
  private props: AdminProps
  private _id: string

  constructor(props: AdminProps, id?: string) {
    this.props = {
      ...props,
      id: id ?? randomUUID(),
    }
    this.password = props.password
  }

  public get id() {
    return this.id
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
    crypto.update(password)
    this.props.password = crypto.digest('hex')
  }

  public get cpf(): string {
    return this.props.cpf
  }

  public set cpf(cpf: string) {
    this.props.cpf = cpf
  }

  public get role(): Role {
    return this.props.role
  }

  public set role(role: Role) {
    this.props.role = role
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
