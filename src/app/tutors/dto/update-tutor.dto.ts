import { PartialType } from '@nestjs/mapped-types'
import { CreateTutorDto } from './create-tutor.dto'
import { IsString } from 'class-validator'

export class UpdateTutorDto extends PartialType(CreateTutorDto) {
  @IsString()
  primaryAddressId: string
}
