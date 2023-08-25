import { PartialType } from '@nestjs/mapped-types'
import { CreatePetsTransferRequestDto } from './create-pets_transfer_request.dto'

export class UpdatePetsTransferRequestDto extends PartialType(
  CreatePetsTransferRequestDto,
) {}
