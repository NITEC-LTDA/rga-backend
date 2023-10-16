import { Role } from '@prisma/client'
import { IsEmail, IsNotEmpty, IsString, Matches, IsEnum } from 'class-validator'

const EMAIL_PATTERN = process.env.EMAIL_PATTERN || '@gmail\\.com$'

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  @Matches(new RegExp(EMAIL_PATTERN), {
    message: `Email must end with ${EMAIL_PATTERN}`,
  })
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  cpf: string

  @IsEnum(Role, {
    message: `Role must be one of the following: ${Object.values(Role).join(
      ', ',
    )}`,
  })
  @IsNotEmpty()
  role: Role
}
