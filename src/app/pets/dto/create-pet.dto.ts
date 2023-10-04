import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsDateString,
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
  @MaxLength(20)
  color: string

  @IsOptional()
  @IsString()
  microchip: string | null
}
