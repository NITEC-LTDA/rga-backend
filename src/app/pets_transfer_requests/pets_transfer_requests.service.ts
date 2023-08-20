import { Injectable } from '@nestjs/common'
import { CreatePetsTransferRequestDto } from './dto/create-pets_transfer_request.dto'
import { UpdatePetsTransferRequestDto } from './dto/update-pets_transfer_request.dto'

@Injectable()
export class PetsTransferRequestsService {
  create(createPetsTransferRequestDto: CreatePetsTransferRequestDto) {
    return 'This action adds a new petsTransferRequest'
  }

  findAll() {
    return `This action returns all petsTransferRequests`
  }

  findOne(id: number) {
    return `This action returns a #${id} petsTransferRequest`
  }

  update(
    id: number,
    updatePetsTransferRequestDto: UpdatePetsTransferRequestDto,
  ) {
    return `This action updates a #${id} petsTransferRequest`
  }

  remove(id: number) {
    return `This action removes a #${id} petsTransferRequest`
  }
}
