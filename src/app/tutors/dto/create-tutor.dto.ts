import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator'

export class CreateTutorDto {
  @IsString()
  @MinLength(3)
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  @IsPhoneNumber('BR')
  phone: string

  @IsString()
  @IsNotEmpty()
  @MinLength(14)
  cpf: string
}
