import { IsEmail, IsNotEmpty, IsString, Matches, IsEnum } from 'class-validator'
import { AdminRole } from '../entities/admin.entity'
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

  @IsEnum(AdminRole, {
    message: `Role must be one of the following: ${Object.values(
      AdminRole,
    ).join(', ')}`,
  })
  @IsNotEmpty()
  role: AdminRole
}
