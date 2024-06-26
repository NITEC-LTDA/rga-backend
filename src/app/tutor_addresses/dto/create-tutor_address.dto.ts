import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTutorAddressDto {
  @IsString()
  @IsNotEmpty()
  street: string

  @IsString()
  @IsNotEmpty()
  number: string

  @IsString()
  @IsNotEmpty()
  zipcode: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  state: string

  @IsString()
  @IsNotEmpty()
  country: string

  @IsString()
  @IsNotEmpty()
  neighborhood: string

  @IsOptional()
  @IsString()
  complement: string | null
}
