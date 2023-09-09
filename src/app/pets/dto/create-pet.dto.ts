import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsDateString,
  IsEmpty,
  IsOptional,
} from 'class-validator'

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  species: string

  @IsString()
  @IsNotEmpty()
  breed: string

  @IsDateString()
  @IsNotEmpty()
  birthDate: Date

  @IsString()
  @IsNotEmpty()
  @MaxLength(6)
  gender: string

  @IsString()
  @MaxLength(10)
  color: string

  @IsString()
  imageUrl: string

  @IsOptional()
  @IsString()
  microchip: string | null
}
