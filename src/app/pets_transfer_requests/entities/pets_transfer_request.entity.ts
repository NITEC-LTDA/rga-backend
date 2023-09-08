import { randomUUID } from 'node:crypto'

interface PetsTransferRequestProps {
  id?: string
  senderId: string
  receiverId: string
  petId: string
  acceptedAt?: Date
  canceledAt?: Date

  createdAt?: Date
  updatedAt?: Date
}
export class PetsTransferRequest {
  private props: PetsTransferRequestProps
  private _id: string

  constructor(props: PetsTransferRequestProps, id?: string) {
    this.props = {
      ...props,
      id: id ?? randomUUID(),
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    }
  }

  public get id() {
    return this._id
  }

  public get senderId() {
    return this.props.senderId
  }

  public get receiverId() {
    return this.props.receiverId
  }

  public get petId() {
    return this.props.petId
  }

  public get acceptedAt() {
    return this.props.acceptedAt
  }

  public get canceledAt() {
    return this.props.canceledAt
  }

  public get createdAt() {
    return this.props.createdAt
  }

  public get updatedAt() {
    return this.props.updatedAt
  }
}
