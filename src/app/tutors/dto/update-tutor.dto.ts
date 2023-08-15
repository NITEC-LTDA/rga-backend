import { PartialType } from '@nestjs/mapped-types'
import { CreateTutorDto } from './create-tutor.dto'
import { IsOptional, IsString } from 'class-validator'

export class UpdateTutorDto extends PartialType(CreateTutorDto) {
  @IsString()
  @IsOptional()
  primaryAddressId: string
}
