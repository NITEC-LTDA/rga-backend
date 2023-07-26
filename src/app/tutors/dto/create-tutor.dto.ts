import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

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
  @IsNotEmpty()
  @MinLength(14)
  cpf: string
}
