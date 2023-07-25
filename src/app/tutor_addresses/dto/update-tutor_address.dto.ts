import { PartialType } from '@nestjs/mapped-types'
import { CreateTutorAddressDto } from './create-tutor_address.dto'

export class UpdateTutorAddressDto extends PartialType(CreateTutorAddressDto) {}
